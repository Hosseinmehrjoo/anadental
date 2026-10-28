<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$slug = trim((string) basename($path), '/');
if ($slug === '' || $slug === 'post') {
    http_response_code(404);
    exit;
}

ad_blog_ensure_schema();
ad_comments_ensure_schema();

$stmt = ad_db()->prepare(
    'SELECT id, title, slug, meta_title, meta_description, meta_keywords, excerpt, content, cover, published_at
     FROM blog_posts
     WHERE status = \'published\' AND slug = ?
     LIMIT 1'
);
$stmt->execute([$slug]);
$row = $stmt->fetch();
if (!$row) {
    http_response_code(404);
    exit;
}

$post = ad_blog_normalize_post($row);
$postId = (int) ($post['id'] ?? 0);
$comments = ad_comments_tree_approved_for_post($postId);

// Related posts: same categories, excluding current post
$related = [];
$catIds = [];
foreach ((array) ($post['categories'] ?? []) as $c) {
    $catIds[] = (int) ($c['id'] ?? 0);
}
if ($catIds) {
    $placeholders = implode(',', array_fill(0, count($catIds), '?'));
    $sql = "SELECT DISTINCT p.id, p.title, p.slug, p.excerpt, p.cover, p.published_at
            FROM blog_posts p
            INNER JOIN blog_post_categories pc ON pc.post_id = p.id
            WHERE pc.category_id IN ($placeholders)
              AND p.id <> ?
              AND p.status = 'published'
            ORDER BY p.published_at DESC, p.id DESC
            LIMIT 6";
    $params = [...$catIds, $postId];
    $stmt = ad_db()->prepare($sql);
    $stmt->execute($params);
    $related = array_map('ad_blog_normalize_post', $stmt->fetchAll());
}

$seoTitle = !empty($post['meta_title']) ? (string) $post['meta_title'] : (string) ($post['title'] ?? '');
$seoDesc = !empty($post['meta_description']) ? (string) $post['meta_description'] : (string) ($post['excerpt'] ?? '');
$seoCanonical = '/post/' . $slug;

dental_render('post', [
    'pageTitle' => $seoTitle . ' | ' . dental_site_name(),
    'metaDescription' => $seoDesc,
    'canonicalPath' => $seoCanonical,
    'post' => $post,
    'comments' => $comments,
    'related' => $related,
]);
