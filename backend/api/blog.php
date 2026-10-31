<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/db.php';
require_once dirname(__DIR__) . '/lib/helpers.php';
require_once dirname(__DIR__) . '/lib/media.php';
require_once dirname(__DIR__) . '/lib/blog.php';

ad_cors_public();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    ad_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$slug = trim((string) ($_GET['slug'] ?? ''));
$category = trim((string) ($_GET['category'] ?? ''));
$limit = (int) ($_GET['limit'] ?? 50);
if ($limit < 1) {
    $limit = 1;
}
if ($limit > 50) {
    $limit = 50;
}

try {
    ad_media_ensure_schema();
    ad_blog_ensure_schema();

    $categories = ad_blog_categories_list();
    $publicCats = array_map(static function (array $c): array {
        return [
            'id' => (int) $c['id'],
            'name' => (string) $c['name'],
            'slug' => (string) $c['slug'],
            'post_count' => (int) ($c['post_count'] ?? 0),
        ];
    }, $categories);

    if ($slug !== '') {
        $stmt = ad_db()->prepare(
            'SELECT id, title, slug, meta_title, meta_description, meta_keywords, excerpt, content, cover, published_at
             FROM blog_posts
             WHERE status = \'published\' AND slug = ?
             LIMIT 1'
        );
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            ad_json(['ok' => false, 'error' => 'یافت نشد'], 404);
        }
        ad_json([
            'ok' => true,
            'data' => ad_blog_normalize_post($row),
            'categories' => $publicCats,
        ]);
    }

    $sql = 'SELECT DISTINCT p.id, p.title, p.slug, p.excerpt, p.cover, p.published_at
            FROM blog_posts p';
    $params = [];
    if ($category !== '') {
        $sql .= ' INNER JOIN blog_post_categories pc ON pc.post_id = p.id
                  INNER JOIN blog_categories c ON c.id = pc.category_id
                    AND (c.slug = ? OR c.name = ?)';
        $params[] = $category;
        $params[] = $category;
    }
    $sql .= ' WHERE p.status = \'published\'
              ORDER BY p.published_at DESC, p.id DESC
              LIMIT ' . $limit;

    if ($params) {
        $stmt = ad_db()->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
    } else {
        $rows = ad_db()->query($sql)->fetchAll();
    }

    $items = array_map('ad_blog_normalize_post', $rows);
    ad_json([
        'ok' => true,
        'data' => $items,
        'categories' => $publicCats,
    ]);
} catch (Throwable $e) {
    ad_json(['ok' => false, 'error' => 'خطای سرور'], 500);
}
