<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$siteUrl = rtrim((string) (ad_config()['site_url'] ?? ''), '/');
if ($siteUrl === '') {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    $siteUrl = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

ad_blog_ensure_schema();
$rows = ad_db()->query(
    "SELECT slug, updated_at, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC"
)->fetchAll();

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach (['/', '/blog.php', '/contact.php'] as $path) {
    echo '  <url><loc>' . htmlspecialchars($siteUrl . $path, ENT_XML1) . '</loc></url>' . "\n";
}
foreach ($rows as $row) {
    $loc = $siteUrl . '/post.php?slug=' . rawurlencode((string) $row['slug']);
    $last = (string) ($row['updated_at'] ?: $row['published_at'] ?: '');
    echo '  <url><loc>' . htmlspecialchars($loc, ENT_XML1) . '</loc>';
    if ($last !== '') {
        echo '<lastmod>' . htmlspecialchars(substr($last, 0, 10), ENT_XML1) . '</lastmod>';
    }
    echo "</url>\n";
}
echo "</urlset>\n";
