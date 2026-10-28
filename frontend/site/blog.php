<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

ad_blog_ensure_schema();

$category = trim((string) ($_GET['category'] ?? ''));

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
          LIMIT 50';

if ($params) {
    $stmt = ad_db()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
} else {
    $rows = ad_db()->query($sql)->fetchAll();
}

$posts = array_map('ad_blog_normalize_post', $rows);
$categories = ad_blog_categories_list();

dental_render('blog', [
    'pageTitle' => 'مجله آنادنت | ' . dental_site_name(),
    'metaDescription' => 'مقالات تخصصی ایمپلنت و مراقبت از دندان',
    'canonicalPath' => '/blog.php',
    'posts' => $posts,
    'categories' => $categories,
    'activeCategory' => $category,
]);
