<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function ad_blog_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `blog_categories` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `name` VARCHAR(120) NOT NULL,
          `slug` VARCHAR(140) NOT NULL,
          `description` TEXT NULL,
          `parent_id` INT UNSIGNED NULL DEFAULT NULL,
          `sort_order` INT NOT NULL DEFAULT 0,
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_blog_category_slug` (`slug`),
          KEY `idx_blog_category_parent` (`parent_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `blog_post_categories` (
          `post_id` INT UNSIGNED NOT NULL,
          `category_id` INT UNSIGNED NOT NULL,
          PRIMARY KEY (`post_id`, `category_id`),
          KEY `idx_bpc_category` (`category_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    try {
        $cols = $db->query('SHOW COLUMNS FROM blog_posts')->fetchAll(PDO::FETCH_COLUMN);
    } catch (Throwable $e) {
        $cols = [];
    }
    if ($cols && !in_array('meta_title', $cols, true)) {
        $db->exec("ALTER TABLE blog_posts ADD COLUMN `meta_title` VARCHAR(255) NOT NULL DEFAULT '' AFTER `slug`");
        $cols[] = 'meta_title';
    }
    if ($cols && !in_array('meta_description', $cols, true)) {
        $db->exec("ALTER TABLE blog_posts ADD COLUMN `meta_description` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_title`");
        $cols[] = 'meta_description';
    }
    if ($cols && !in_array('meta_keywords', $cols, true)) {
        $db->exec("ALTER TABLE blog_posts ADD COLUMN `meta_keywords` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_description`");
    }
    $done = true;
}

/**
 * @return list<array<string, mixed>>
 */
function ad_blog_categories_list(): array
{
    ad_blog_ensure_schema();
    return ad_db()->query(
        'SELECT c.*,
                (SELECT COUNT(*) FROM blog_post_categories pc WHERE pc.category_id = c.id) AS post_count
         FROM blog_categories c
         ORDER BY c.sort_order ASC, c.name ASC'
    )->fetchAll();
}

function ad_blog_category_get(int $id): ?array
{
    ad_blog_ensure_schema();
    if ($id < 1) {
        return null;
    }
    $stmt = ad_db()->prepare('SELECT * FROM blog_categories WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function ad_blog_category_unique_slug(string $base, int $ignoreId = 0): string
{
    $slug = ad_slugify($base);
    $db = ad_db();
    $candidate = $slug;
    $i = 2;
    while (true) {
        $stmt = $db->prepare('SELECT id FROM blog_categories WHERE slug = ? LIMIT 1');
        $stmt->execute([$candidate]);
        $row = $stmt->fetch();
        if (!$row || ((int) $row['id'] === $ignoreId)) {
            return $candidate;
        }
        $candidate = mb_substr($slug, 0, 120, 'UTF-8') . '-' . $i;
        $i++;
    }
}

/**
 * @return array<string, mixed>
 */
function ad_blog_category_create(string $name, string $slug = '', string $description = '', ?int $parentId = null): array
{
    ad_blog_ensure_schema();
    $name = trim($name);
    if ($name === '') {
        throw new RuntimeException('نام دسته‌بندی الزامی است.');
    }
    if (mb_strlen($name) > 120) {
        $name = mb_substr($name, 0, 120);
    }
    $slug = trim($slug) !== '' ? ad_slugify($slug) : ad_blog_category_unique_slug($name);
    $slug = ad_blog_category_unique_slug($slug);
    $description = trim($description);
    $parent = ($parentId !== null && $parentId > 0) ? $parentId : null;
    if ($parent !== null && !ad_blog_category_get($parent)) {
        $parent = null;
    }
    $stmt = ad_db()->prepare(
        'INSERT INTO blog_categories (name, slug, description, parent_id, sort_order) VALUES (?,?,?,?,0)'
    );
    $stmt->execute([$name, $slug, $description, $parent]);
    $id = (int) ad_db()->lastInsertId();
    $row = ad_blog_category_get($id);
    if (!$row) {
        throw new RuntimeException('ایجاد دسته‌بندی ممکن نشد.');
    }
    return $row;
}

function ad_blog_category_update(int $id, string $name, string $slug = '', string $description = '', ?int $parentId = null): void
{
    ad_blog_ensure_schema();
    $existing = ad_blog_category_get($id);
    if (!$existing) {
        throw new RuntimeException('دسته‌بندی یافت نشد.');
    }
    $name = trim($name);
    if ($name === '') {
        throw new RuntimeException('نام دسته‌بندی الزامی است.');
    }
    $slug = trim($slug) !== '' ? ad_slugify($slug) : ad_blog_category_unique_slug($name, $id);
    $slug = ad_blog_category_unique_slug($slug, $id);
    $description = trim($description);
    $parent = ($parentId !== null && $parentId > 0) ? $parentId : null;
    if ($parent === $id) {
        $parent = null;
    }
    if ($parent !== null && !ad_blog_category_get($parent)) {
        $parent = null;
    }
    $stmt = ad_db()->prepare(
        'UPDATE blog_categories SET name=?, slug=?, description=?, parent_id=? WHERE id=?'
    );
    $stmt->execute([$name, $slug, $description, $parent, $id]);
}

function ad_blog_category_delete(int $id): void
{
    ad_blog_ensure_schema();
    if ($id < 1) {
        return;
    }
    $db = ad_db();
    $db->prepare('UPDATE blog_categories SET parent_id = NULL WHERE parent_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM blog_post_categories WHERE category_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM blog_categories WHERE id = ?')->execute([$id]);
}

/**
 * @return list<int>
 */
function ad_blog_post_category_ids(int $postId): array
{
    ad_blog_ensure_schema();
    if ($postId < 1) {
        return [];
    }
    $stmt = ad_db()->prepare('SELECT category_id FROM blog_post_categories WHERE post_id = ?');
    $stmt->execute([$postId]);
    return array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
}

/**
 * @param list<int|string> $categoryIds
 */
function ad_blog_post_set_categories(int $postId, array $categoryIds): void
{
    ad_blog_ensure_schema();
    if ($postId < 1) {
        return;
    }
    $db = ad_db();
    $db->prepare('DELETE FROM blog_post_categories WHERE post_id = ?')->execute([$postId]);
    $seen = [];
    $ins = $db->prepare('INSERT INTO blog_post_categories (post_id, category_id) VALUES (?,?)');
    foreach ($categoryIds as $raw) {
        $cid = (int) $raw;
        if ($cid < 1 || isset($seen[$cid])) {
            continue;
        }
        if (!ad_blog_category_get($cid)) {
            continue;
        }
        $seen[$cid] = true;
        $ins->execute([$postId, $cid]);
    }
}

/**
 * @return list<array{id:int,name:string,slug:string}>
 */
function ad_blog_post_categories(int $postId): array
{
    ad_blog_ensure_schema();
    if ($postId < 1) {
        return [];
    }
    $stmt = ad_db()->prepare(
        'SELECT c.id, c.name, c.slug
         FROM blog_categories c
         INNER JOIN blog_post_categories pc ON pc.category_id = c.id
         WHERE pc.post_id = ?
         ORDER BY c.name ASC'
    );
    $stmt->execute([$postId]);
    $out = [];
    foreach ($stmt->fetchAll() as $row) {
        $out[] = [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'slug' => (string) $row['slug'],
        ];
    }
    return $out;
}

/**
 * @param array<string, mixed> $post
 * @return array<string, mixed>
 */
function ad_blog_normalize_post(array $post): array
{
    $id = (int) ($post['id'] ?? 0);
    $post['meta_title'] = trim((string) ($post['meta_title'] ?? ''));
    $post['meta_description'] = trim((string) ($post['meta_description'] ?? ''));
    $post['meta_keywords'] = trim((string) ($post['meta_keywords'] ?? ''));
    $post['categories'] = ad_blog_post_categories($id);
    if (!function_exists('ad_comments_count_approved')) {
        require_once __DIR__ . '/comments.php';
    }
    $post['comment_count'] = ad_comments_count_approved($id);
    if (!function_exists('ad_media_with_cover_alt')) {
        require_once __DIR__ . '/media.php';
    }
    return ad_media_with_cover_alt($post);
}
