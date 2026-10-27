<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

/** Max nesting depth: 1 = top-level comment, 4 = deepest reply */
const AD_COMMENTS_MAX_DEPTH = 4;

function ad_comments_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `blog_comments` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `post_id` INT UNSIGNED NOT NULL,
          `parent_id` INT UNSIGNED NULL DEFAULT NULL,
          `author_name` VARCHAR(120) NOT NULL,
          `author_email` VARCHAR(180) NOT NULL DEFAULT '',
          `body` TEXT NOT NULL,
          `status` ENUM('pending','approved','spam') NOT NULL DEFAULT 'pending',
          `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
          `ip_hash` VARCHAR(64) NOT NULL DEFAULT '',
          `user_agent` VARCHAR(255) NOT NULL DEFAULT '',
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_comments_post_status` (`post_id`, `status`, `created_at`),
          KEY `idx_comments_status` (`status`, `created_at`),
          KEY `idx_comments_parent` (`parent_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    // Migrate older installs
    $hasParent = $db->query("SHOW COLUMNS FROM `blog_comments` LIKE 'parent_id'")->fetch();
    if (!$hasParent) {
        $db->exec(
            'ALTER TABLE `blog_comments`
             ADD COLUMN `parent_id` INT UNSIGNED NULL DEFAULT NULL AFTER `post_id`,
             ADD KEY `idx_comments_parent` (`parent_id`)'
        );
    }
    $hasStaff = $db->query("SHOW COLUMNS FROM `blog_comments` LIKE 'is_staff'")->fetch();
    if (!$hasStaff) {
        $db->exec(
            'ALTER TABLE `blog_comments`
             ADD COLUMN `is_staff` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`'
        );
    }

    $done = true;
}

function ad_comments_client_ip(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return $ip !== '' ? $ip : '0.0.0.0';
}

function ad_comments_ip_hash(): string
{
    return hash('sha256', ad_comments_client_ip() . '|' . (ad_config()['app_key'] ?? 'ana'));
}

/**
 * @return array<string, mixed>|null
 */
function ad_comments_get(int $id): ?array
{
    ad_comments_ensure_schema();
    if ($id < 1) {
        return null;
    }
    $stmt = ad_db()->prepare('SELECT * FROM blog_comments WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Depth of a comment: 1 = root, up to AD_COMMENTS_MAX_DEPTH.
 */
function ad_comments_depth(int $commentId): int
{
    if ($commentId < 1) {
        return 0;
    }
    $depth = 1;
    $id = $commentId;
    $guard = 0;
    while ($guard < AD_COMMENTS_MAX_DEPTH + 2) {
        $row = ad_comments_get($id);
        if (!$row) {
            break;
        }
        $parentId = isset($row['parent_id']) && $row['parent_id'] !== null ? (int) $row['parent_id'] : 0;
        if ($parentId < 1) {
            break;
        }
        $depth++;
        $id = $parentId;
        $guard++;
    }
    return $depth;
}

/**
 * Resolve reply target: keep real parent, enforce max depth of 4.
 */
function ad_comments_resolve_parent(int $postId, int $parentId): int
{
    if ($parentId < 1) {
        return 0;
    }
    $parent = ad_comments_get($parentId);
    if (!$parent || (int) $parent['post_id'] !== $postId) {
        throw new RuntimeException('نظر والد معتبر نیست.');
    }
    if ((string) ($parent['status'] ?? '') !== 'approved') {
        throw new RuntimeException('فقط می‌توان به نظرات تاییدشده پاسخ داد.');
    }
    $parentDepth = ad_comments_depth((int) $parent['id']);
    if ($parentDepth >= AD_COMMENTS_MAX_DEPTH) {
        throw new RuntimeException('بیش از ' . AD_COMMENTS_MAX_DEPTH . ' سطح پاسخ مجاز نیست.');
    }
    return (int) $parent['id'];
}

/**
 * @return list<array<string, mixed>>
 */
function ad_comments_list_approved_for_post(int $postId): array
{
    ad_comments_ensure_schema();
    if ($postId < 1) {
        return [];
    }
    $stmt = ad_db()->prepare(
        "SELECT id, parent_id, author_name, body, is_staff, created_at
         FROM blog_comments
         WHERE post_id = ? AND status = 'approved'
         ORDER BY created_at ASC, id ASC"
    );
    $stmt->execute([$postId]);
    return $stmt->fetchAll();
}

/**
 * Nested tree for public API (up to 4 levels).
 *
 * @return list<array<string, mixed>>
 */
function ad_comments_tree_approved_for_post(int $postId): array
{
    $rows = ad_comments_list_approved_for_post($postId);
    /** @var array<int, array<string, mixed>> $nodes */
    $nodes = [];
    /** @var array<int, list<int>> $children */
    $children = [];

    foreach ($rows as $row) {
        $item = ad_comments_normalize_public($row);
        $item['replies'] = [];
        $id = (int) $item['id'];
        $nodes[$id] = $item;
        $parentId = (int) ($item['parent_id'] ?? 0);
        if (!isset($children[$parentId])) {
            $children[$parentId] = [];
        }
        $children[$parentId][] = $id;
    }

    $build = static function (int $parentId, int $depth) use (&$build, &$nodes, &$children): array {
        $out = [];
        foreach ($children[$parentId] ?? [] as $id) {
            if (!isset($nodes[$id])) {
                continue;
            }
            $node = $nodes[$id];
            $node['depth'] = $depth;
            $node['replies'] = $depth < AD_COMMENTS_MAX_DEPTH
                ? $build($id, $depth + 1)
                : [];
            $out[] = $node;
        }
        return $out;
    };

    return $build(0, 1);
}

function ad_comments_count_approved(int $postId): int
{
    ad_comments_ensure_schema();
    if ($postId < 1) {
        return 0;
    }
    $stmt = ad_db()->prepare(
        "SELECT COUNT(*) FROM blog_comments WHERE post_id = ? AND status = 'approved'"
    );
    $stmt->execute([$postId]);
    return (int) $stmt->fetchColumn();
}

function ad_comments_count_by_status(string $status = ''): int
{
    ad_comments_ensure_schema();
    if ($status === '') {
        return (int) ad_db()->query('SELECT COUNT(*) FROM blog_comments')->fetchColumn();
    }
    $stmt = ad_db()->prepare('SELECT COUNT(*) FROM blog_comments WHERE status = ?');
    $stmt->execute([$status]);
    return (int) $stmt->fetchColumn();
}

/**
 * @return list<array<string, mixed>>
 */
function ad_comments_admin_list(string $status = ''): array
{
    ad_comments_ensure_schema();
    $sql = 'SELECT c.*, p.title AS post_title, p.slug AS post_slug,
                   parent.author_name AS parent_author
            FROM blog_comments c
            LEFT JOIN blog_posts p ON p.id = c.post_id
            LEFT JOIN blog_comments parent ON parent.id = c.parent_id';
    $params = [];
    if ($status !== '' && in_array($status, ['pending', 'approved', 'spam'], true)) {
        $sql .= ' WHERE c.status = ?';
        $params[] = $status;
    }
    $sql .= ' ORDER BY c.created_at DESC, c.id DESC LIMIT 300';
    if ($params) {
        $stmt = ad_db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    return ad_db()->query($sql)->fetchAll();
}

/**
 * @return list<array<string, mixed>>
 */
function ad_comments_replies_admin(int $parentId): array
{
    ad_comments_ensure_schema();
    if ($parentId < 1) {
        return [];
    }
    $stmt = ad_db()->prepare(
        'SELECT * FROM blog_comments WHERE parent_id = ? ORDER BY created_at ASC, id ASC'
    );
    $stmt->execute([$parentId]);
    return $stmt->fetchAll();
}

/**
 * @return array{id:int,status:string}
 */
function ad_comments_create(
    int $postId,
    string $name,
    string $email,
    string $body,
    int $parentId = 0,
    bool $isStaff = false,
    bool $autoApprove = false
): array {
    ad_comments_ensure_schema();
    if ($postId < 1) {
        throw new RuntimeException('مطلب معتبر نیست.');
    }

    $stmt = ad_db()->prepare(
        "SELECT id FROM blog_posts WHERE id = ? AND status = 'published' LIMIT 1"
    );
    $stmt->execute([$postId]);
    if (!$stmt->fetch()) {
        throw new RuntimeException('مطلب یافت نشد.');
    }

    $resolvedParent = 0;
    if ($parentId > 0) {
        $resolvedParent = ad_comments_resolve_parent($postId, $parentId);
    }

    $name = trim($name);
    $email = trim($email);
    $body = trim($body);

    if ($name === '' || mb_strlen($name) > 120) {
        throw new RuntimeException('نام معتبر نیست.');
    }
    if ($body === '' || mb_strlen($body) > 2000) {
        throw new RuntimeException('متن نظر معتبر نیست.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('ایمیل معتبر نیست.');
    }
    if (mb_strlen($email) > 180) {
        throw new RuntimeException('ایمیل بیش از حد طولانی است.');
    }

    if (!$isStaff) {
        $ipHash = ad_comments_ip_hash();
        $recent = ad_db()->prepare(
            'SELECT id FROM blog_comments
             WHERE ip_hash = ? AND created_at >= (NOW() - INTERVAL 1 MINUTE)
             LIMIT 1'
        );
        $recent->execute([$ipHash]);
        if ($recent->fetch()) {
            throw new RuntimeException('لطفاً کمی بعد دوباره تلاش کنید.');
        }
    } else {
        $ipHash = '';
    }

    $status = ($autoApprove || $isStaff) ? 'approved' : 'pending';
    $ua = mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255, 'UTF-8');
    $ins = ad_db()->prepare(
        'INSERT INTO blog_comments
         (post_id, parent_id, author_name, author_email, body, status, is_staff, ip_hash, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $ins->execute([
        $postId,
        $resolvedParent > 0 ? $resolvedParent : null,
        $name,
        $email,
        $body,
        $status,
        $isStaff ? 1 : 0,
        $ipHash,
        $ua,
    ]);

    return [
        'id' => (int) ad_db()->lastInsertId(),
        'status' => $status,
    ];
}

/**
 * Staff reply from admin panel (always approved).
 *
 * @return array{id:int,status:string}
 */
function ad_comments_create_staff_reply(int $parentId, string $body, string $staffName = 'مدیر سایت'): array
{
    $parent = ad_comments_get($parentId);
    if (!$parent) {
        throw new RuntimeException('نظر یافت نشد.');
    }
    $name = trim($staffName) !== '' ? trim($staffName) : 'مدیر سایت';
    return ad_comments_create(
        (int) $parent['post_id'],
        $name,
        '',
        $body,
        $parentId,
        true,
        true
    );
}

function ad_comments_set_status(int $id, string $status): void
{
    ad_comments_ensure_schema();
    if ($id < 1 || !in_array($status, ['pending', 'approved', 'spam'], true)) {
        return;
    }
    ad_db()->prepare('UPDATE blog_comments SET status = ? WHERE id = ?')->execute([$status, $id]);
}

function ad_comments_delete(int $id): void
{
    ad_comments_ensure_schema();
    if ($id < 1) {
        return;
    }
    $db = ad_db();
    $stmt = $db->prepare('SELECT id FROM blog_comments WHERE parent_id = ?');
    $stmt->execute([$id]);
    foreach ($stmt->fetchAll(PDO::FETCH_COLUMN) as $childId) {
        ad_comments_delete((int) $childId);
    }
    $db->prepare('DELETE FROM blog_comments WHERE id = ?')->execute([$id]);
}

function ad_comments_delete_for_post(int $postId): void
{
    ad_comments_ensure_schema();
    if ($postId < 1) {
        return;
    }
    ad_db()->prepare('DELETE FROM blog_comments WHERE post_id = ?')->execute([$postId]);
}

/**
 * @param array<string, mixed> $row
 * @return array<string, mixed>
 */
function ad_comments_normalize_public(array $row): array
{
    return [
        'id' => (int) ($row['id'] ?? 0),
        'parent_id' => isset($row['parent_id']) && $row['parent_id'] !== null ? (int) $row['parent_id'] : 0,
        'author_name' => (string) ($row['author_name'] ?? ''),
        'body' => (string) ($row['body'] ?? ''),
        'is_staff' => !empty($row['is_staff']),
        'created_at' => (string) ($row['created_at'] ?? ''),
        'depth' => isset($row['depth']) ? (int) $row['depth'] : 0,
    ];
}
