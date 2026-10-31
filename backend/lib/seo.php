<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function ad_seo_site_root(): string
{
    return dirname(__DIR__, 2);
}

function ad_seo_site_base_url(): string
{
    $config = ad_config();
    $fromConfig = rtrim((string) ($config['site_url'] ?? ''), '/');
    if ($fromConfig !== '' && !preg_match('#^https?://(127\.0\.0\.1|localhost)(:\d+)?$#i', $fromConfig)) {
        return $fromConfig;
    }
    $forwardedProto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $https = $forwardedProto === 'https'
        || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ((int) ($_SERVER['SERVER_PORT'] ?? 0) === 443);
    $scheme = $https ? 'https' : 'http';
    $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
    if ($host !== '' && !preg_match('#^(127\.0\.0\.1|localhost)(:\d+)?$#i', $host)) {
        return $scheme . '://' . $host;
    }
    return 'https://ana-dental.ir';
}

function ad_seo_absolute_url(string $pathOrUrl): string
{
    $pathOrUrl = trim($pathOrUrl);
    if ($pathOrUrl === '') {
        return ad_seo_site_base_url() . '/';
    }
    if (preg_match('#^https?://#i', $pathOrUrl)) {
        return $pathOrUrl;
    }
    return ad_seo_site_base_url() . '/' . ltrim($pathOrUrl, '/');
}

function ad_seo_robots_path(): string
{
    return ad_seo_site_root() . '/robots.txt';
}

function ad_seo_default_robots(): string
{
    $sitemap = ad_seo_absolute_url('sitemap.xml');
    return "User-agent: *\nAllow: /\nDisallow: /backend/admin/\nDisallow: /backend/api/\nDisallow: /backend/install.php\n\nSitemap: {$sitemap}\n";
}

function ad_seo_read_robots(): string
{
    $path = ad_seo_robots_path();
    if (!is_file($path)) {
        return ad_seo_default_robots();
    }
    $raw = file_get_contents($path);
    return $raw === false ? ad_seo_default_robots() : $raw;
}

function ad_seo_write_robots(string $content): void
{
    $content = str_replace("\r\n", "\n", $content);
    $content = trim($content) . "\n";
    $path = ad_seo_robots_path();
    if (file_put_contents($path, $content) === false) {
        throw new RuntimeException('نوشتن robots.txt ممکن نشد. دسترسی فایل را بررسی کنید.');
    }
}

function ad_seo_ensure_robots_file(): void
{
    $path = ad_seo_robots_path();
    if (!is_file($path)) {
        @file_put_contents($path, ad_seo_default_robots());
    }
}

function ad_redirects_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    ad_db()->exec(
        "CREATE TABLE IF NOT EXISTS `redirects` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `source_path` VARCHAR(500) NOT NULL,
          `target_url` VARCHAR(1000) NOT NULL,
          `status_code` SMALLINT UNSIGNED NOT NULL DEFAULT 301,
          `is_active` TINYINT(1) NOT NULL DEFAULT 1,
          `note` VARCHAR(255) NOT NULL DEFAULT '',
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_redirect_source` (`source_path`),
          KEY `idx_redirect_active` (`is_active`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

function ad_redirects_normalize_source(string $source): string
{
    $source = trim($source);
    if ($source === '') {
        throw new RuntimeException('مسیر مبدأ الزامی است.');
    }
    // Keep query string if present; normalize path part
    $parts = parse_url($source);
    if ($parts === false) {
        throw new RuntimeException('مسیر مبدأ نامعتبر است.');
    }
    $path = $parts['path'] ?? $source;
    $path = '/' . ltrim($path, '/');
    if (isset($parts['query']) && $parts['query'] !== '') {
        return $path . '?' . $parts['query'];
    }
    // If original had ? without parse_url catching (relative weirdness)
    if (strpos($source, '?') !== false && strpos($path, '?') === false) {
        $q = substr($source, strpos($source, '?'));
        return $path . $q;
    }
    return $path;
}

/**
 * @return list<array<string, mixed>>
 */
function ad_redirects_list(): array
{
    ad_redirects_ensure_schema();
    return ad_db()->query(
        'SELECT * FROM redirects ORDER BY updated_at DESC, id DESC LIMIT 500'
    )->fetchAll();
}

/**
 * @return array<string, mixed>|null
 */
function ad_redirects_get(int $id): ?array
{
    ad_redirects_ensure_schema();
    if ($id < 1) {
        return null;
    }
    $stmt = ad_db()->prepare('SELECT * FROM redirects WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * @return array<string, mixed>
 */
function ad_redirects_create(string $source, string $target, int $code = 301, string $note = '', bool $active = true): array
{
    ad_redirects_ensure_schema();
    $source = ad_redirects_normalize_source($source);
    $target = trim($target);
    $note = trim($note);
    if ($target === '') {
        throw new RuntimeException('آدرس مقصد الزامی است.');
    }
    if (!in_array($code, [301, 302, 307, 308], true)) {
        $code = 301;
    }
    if (mb_strlen($source) > 500 || mb_strlen($target) > 1000 || mb_strlen($note) > 255) {
        throw new RuntimeException('طول فیلدها بیش از حد مجاز است.');
    }
    $stmt = ad_db()->prepare(
        'INSERT INTO redirects (source_path, target_url, status_code, is_active, note)
         VALUES (?, ?, ?, ?, ?)'
    );
    try {
        $stmt->execute([$source, $target, $code, $active ? 1 : 0, $note]);
    } catch (PDOException $e) {
        throw new RuntimeException('این مسیر مبدأ قبلاً ثبت شده است.');
    }
    $id = (int) ad_db()->lastInsertId();
    ad_redirects_sync_htaccess();
    $row = ad_redirects_get($id);
    if (!$row) {
        throw new RuntimeException('ایجاد ریدایرکت ممکن نشد.');
    }
    return $row;
}

function ad_redirects_update(int $id, string $source, string $target, int $code = 301, string $note = '', bool $active = true): void
{
    ad_redirects_ensure_schema();
    if (!ad_redirects_get($id)) {
        throw new RuntimeException('ریدایرکت یافت نشد.');
    }
    $source = ad_redirects_normalize_source($source);
    $target = trim($target);
    $note = trim($note);
    if ($target === '') {
        throw new RuntimeException('آدرس مقصد الزامی است.');
    }
    if (!in_array($code, [301, 302, 307, 308], true)) {
        $code = 301;
    }
    try {
        $stmt = ad_db()->prepare(
            'UPDATE redirects SET source_path=?, target_url=?, status_code=?, is_active=?, note=? WHERE id=?'
        );
        $stmt->execute([$source, $target, $code, $active ? 1 : 0, $note, $id]);
    } catch (PDOException $e) {
        throw new RuntimeException('این مسیر مبدأ قبلاً ثبت شده است.');
    }
    ad_redirects_sync_htaccess();
}

function ad_redirects_delete(int $id): void
{
    ad_redirects_ensure_schema();
    if ($id < 1) {
        return;
    }
    ad_db()->prepare('DELETE FROM redirects WHERE id = ?')->execute([$id]);
    ad_redirects_sync_htaccess();
}

function ad_redirects_htaccess_path(): string
{
    return ad_seo_site_root() . '/.htaccess';
}

/**
 * Build Apache rewrite rules for active redirects.
 */
function ad_redirects_build_htaccess_block(): string
{
    ad_redirects_ensure_schema();
    $rows = ad_db()->query(
        'SELECT source_path, target_url, status_code FROM redirects WHERE is_active = 1 ORDER BY id ASC'
    )->fetchAll();
    $lines = [
        '# BEGIN ANA-REDIRECTS',
        '# Generated automatically — do not edit by hand',
    ];
    if (!$rows) {
        $lines[] = '# (no active redirects)';
        $lines[] = '# END ANA-REDIRECTS';
        return implode("\n", $lines) . "\n";
    }
    foreach ($rows as $row) {
        $source = (string) $row['source_path'];
        $target = (string) $row['target_url'];
        $code = (int) $row['status_code'];
        if ($code < 300 || $code > 399) {
            $code = 301;
        }
        // Relative targets get site-root leading slash unless absolute URL
        if (!preg_match('#^https?://#i', $target)) {
            $target = '/' . ltrim($target, '/');
        }
        $qPos = strpos($source, '?');
        if ($qPos !== false) {
            $path = substr($source, 0, $qPos);
            $query = substr($source, $qPos + 1);
            $path = ltrim($path, '/');
            $pathQuoted = preg_quote($path, '#');
            $queryQuoted = preg_quote($query, '#');
            $lines[] = 'RewriteCond %{QUERY_STRING} ^' . $queryQuoted . '$';
            $lines[] = 'RewriteRule ^' . $pathQuoted . '$ ' . $target . ' [R=' . $code . ',L,QSD]';
        } else {
            $path = ltrim($source, '/');
            $pathQuoted = preg_quote($path, '#');
            $lines[] = 'RewriteRule ^' . $pathQuoted . '/?$ ' . $target . ' [R=' . $code . ',L]';
        }
    }
    $lines[] = '# END ANA-REDIRECTS';
    return implode("\n", $lines) . "\n";
}

function ad_redirects_sync_htaccess(): void
{
    $path = ad_redirects_htaccess_path();
    $block = ad_redirects_build_htaccess_block();
    $existing = is_file($path) ? (string) file_get_contents($path) : "";
    if ($existing === '' && !is_file($path)) {
        $existing = "# آنادنت — تنظیمات ریشه سایت\nOptions -Indexes\n\n"
            . "<IfModule mod_rewrite.c>\n  RewriteEngine On\n</IfModule>\n\n";
    }

    if (preg_match('/# BEGIN ANA-REDIRECTS.*?# END ANA-REDIRECTS\n?/s', $existing)) {
        $new = preg_replace('/# BEGIN ANA-REDIRECTS.*?# END ANA-REDIRECTS\n?/s', $block, $existing, 1);
    } else {
        // Insert inside mod_rewrite if possible, else append
        if (preg_match('/(<IfModule mod_rewrite\.c>\s*RewriteEngine On\s*)/i', $existing, $m, PREG_OFFSET_CAPTURE)) {
            $pos = $m[0][1] + strlen($m[0][0]);
            $new = substr($existing, 0, $pos) . "\n" . $block . substr($existing, $pos);
        } else {
            $new = rtrim($existing) . "\n\n" . $block;
        }
    }

    if (file_put_contents($path, $new) === false) {
        throw new RuntimeException('به‌روزرسانی .htaccess برای ریدایرکت‌ها ممکن نشد.');
    }
}

/**
 * Apply matching redirect for current request (PHP fallback).
 */
function ad_redirects_apply_request(): void
{
    ad_redirects_ensure_schema();
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';
    $query = parse_url($uri, PHP_URL_QUERY);
    $candidates = [$path];
    if ($query) {
        $candidates[] = $path . '?' . $query;
    }
    foreach ($candidates as $candidate) {
        $stmt = ad_db()->prepare(
            'SELECT target_url, status_code FROM redirects
             WHERE is_active = 1 AND source_path = ? LIMIT 1'
        );
        $stmt->execute([$candidate]);
        $row = $stmt->fetch();
        if (!$row) {
            // try without leading slash variants already normalized with /
            continue;
        }
        $target = (string) $row['target_url'];
        $code = (int) $row['status_code'];
        if ($code < 300 || $code > 399) {
            $code = 301;
        }
        if (!preg_match('#^https?://#i', $target)) {
            $target = ad_seo_absolute_url($target);
        }
        header('Location: ' . $target, true, $code);
        exit;
    }
}

/**
 * @return list<array{loc:string,lastmod:?string,changefreq:string,priority:string,title:string}>
 */
function ad_seo_static_pages(): array
{
    $pages = [
        ['loc' => '/', 'file' => 'index.html', 'title' => 'صفحه اصلی', 'changefreq' => 'weekly', 'priority' => '1.0'],
        ['loc' => 'blog.php', 'file' => 'blog.php', 'title' => 'وبلاگ', 'changefreq' => 'daily', 'priority' => '0.9'],
        ['loc' => 'contact.php', 'file' => 'contact.php', 'title' => 'تماس با ما', 'changefreq' => 'monthly', 'priority' => '0.7'],
    ];
    $out = [];
    $root = ad_seo_site_root();
    foreach ($pages as $p) {
        $file = $root . '/' . $p['file'];
        if (!is_file($file)) {
            continue;
        }
        $mtime = filemtime($file) ?: null;
        $out[] = [
            'loc' => ad_seo_absolute_url($p['loc']),
            'lastmod' => $mtime ? gmdate('Y-m-d', $mtime) : null,
            'changefreq' => $p['changefreq'],
            'priority' => $p['priority'],
            'title' => $p['title'],
        ];
    }
    return $out;
}

/**
 * @return list<array{loc:string,lastmod:?string,changefreq:string,priority:string,title:string,excerpt:string}>
 */
function ad_seo_blog_urls(): array
{
    try {
        require_once __DIR__ . '/blog.php';
        ad_blog_ensure_schema();
        $rows = ad_db()->query(
            "SELECT title, slug, excerpt, published_at, updated_at
             FROM blog_posts
             WHERE status = 'published'
             ORDER BY published_at DESC, id DESC"
        )->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
    $out = [];
    foreach ($rows as $row) {
        $slug = (string) ($row['slug'] ?? '');
        if ($slug === '') {
            continue;
        }
        $last = (string) ($row['updated_at'] ?? $row['published_at'] ?? '');
        $lastmod = $last !== '' ? gmdate('Y-m-d', strtotime($last) ?: time()) : null;
        $out[] = [
            'loc' => ad_seo_absolute_url('post/' . rawurlencode($slug)),
            'lastmod' => $lastmod,
            'changefreq' => 'weekly',
            'priority' => '0.7',
            'title' => (string) ($row['title'] ?? $slug),
            'excerpt' => trim(preg_replace('/\s+/', ' ', strip_tags((string) ($row['excerpt'] ?? ''))) ?? ''),
        ];
    }
    return $out;
}

/**
 * @return list<array{loc:string,lastmod:?string,changefreq:string,priority:string,title:string,excerpt:string}>
 */
function ad_seo_portfolio_urls(): array
{
    try {
        require_once __DIR__ . '/portfolio.php';
        ad_portfolio_ensure_schema();
        $rows = ad_db()->query(
            "SELECT title, slug, meta_description, description, updated_at, created_at
             FROM portfolio_items
             WHERE is_active = 1 AND slug <> ''
             ORDER BY sort_order ASC, id DESC"
        )->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
    $out = [];
    foreach ($rows as $row) {
        $slug = (string) ($row['slug'] ?? '');
        if ($slug === '') {
            continue;
        }
        $last = (string) ($row['updated_at'] ?? $row['created_at'] ?? '');
        $lastmod = $last !== '' ? gmdate('Y-m-d', strtotime($last) ?: time()) : null;
        $excerpt = trim((string) ($row['meta_description'] ?? ''));
        if ($excerpt === '') {
            $excerpt = trim(preg_replace('/\s+/', ' ', strip_tags((string) ($row['description'] ?? ''))) ?? '');
        }
        if (!is_file(ad_seo_site_root() . '/work.html') && !is_file(ad_seo_site_root() . '/work.php')) {
            break;
        }
        $out[] = [
            'loc' => ad_seo_absolute_url('work.html?slug=' . rawurlencode($slug)),
            'lastmod' => $lastmod,
            'changefreq' => 'monthly',
            'priority' => '0.6',
            'title' => (string) ($row['title'] ?? $slug),
            'excerpt' => $excerpt,
        ];
    }
    return $out;
}

/**
 * @return list<array{loc:string,lastmod:?string,changefreq:string,priority:string,title:string,excerpt:string}>
 */
function ad_seo_team_urls(): array
{
    try {
        require_once __DIR__ . '/team.php';
        ad_team_ensure_schema();
        $rows = ad_db()->query(
            "SELECT name, slug, meta_description, bio, role, updated_at, created_at
             FROM team_members
             WHERE is_active = 1 AND slug <> ''
             ORDER BY sort_order ASC, id ASC"
        )->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
    $out = [];
    foreach ($rows as $row) {
        $slug = (string) ($row['slug'] ?? '');
        if ($slug === '') {
            continue;
        }
        $last = (string) ($row['updated_at'] ?? $row['created_at'] ?? '');
        $lastmod = $last !== '' ? gmdate('Y-m-d', strtotime($last) ?: time()) : null;
        $excerpt = trim((string) ($row['meta_description'] ?? ''));
        if ($excerpt === '') {
            $excerpt = trim(preg_replace('/\s+/', ' ', strip_tags((string) ($row['bio'] ?? ''))) ?? '');
        }
        if ($excerpt === '') {
            $excerpt = trim((string) ($row['role'] ?? ''));
        }
        if (!is_file(ad_seo_site_root() . '/member.html') && !is_file(ad_seo_site_root() . '/member.php')) {
            break;
        }
        $out[] = [
            'loc' => ad_seo_absolute_url('member.html?slug=' . rawurlencode($slug)),
            'lastmod' => $lastmod,
            'changefreq' => 'monthly',
            'priority' => '0.5',
            'title' => (string) ($row['name'] ?? $slug),
            'excerpt' => $excerpt,
        ];
    }
    return $out;
}

function ad_seo_build_sitemap_xml(): string
{
    $urls = array_merge(
        ad_seo_static_pages(),
        ad_seo_blog_urls(),
        ad_seo_portfolio_urls(),
        ad_seo_team_urls()
    );
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as $u) {
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1 | ENT_COMPAT, 'UTF-8') . "</loc>\n";
        if (!empty($u['lastmod'])) {
            $xml .= '    <lastmod>' . htmlspecialchars((string) $u['lastmod'], ENT_XML1 | ENT_COMPAT, 'UTF-8') . "</lastmod>\n";
        }
        $xml .= '    <changefreq>' . htmlspecialchars($u['changefreq'], ENT_XML1 | ENT_COMPAT, 'UTF-8') . "</changefreq>\n";
        $xml .= '    <priority>' . htmlspecialchars($u['priority'], ENT_XML1 | ENT_COMPAT, 'UTF-8') . "</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= "</urlset>\n";
    return $xml;
}

function ad_seo_build_llms_txt(): string
{
    $config = ad_config();
    $siteName = (string) ($config['site_name'] ?? 'آنادنت');
    $base = ad_seo_site_base_url();
    $lines = [
        '# ' . $siteName,
        '> وب‌سایت رسمی ' . $siteName . ' — خدمات توسعه نرم‌افزار، وب و اپلیکیشن.',
        '',
        'Site: ' . $base,
        'Sitemap: ' . ad_seo_absolute_url('sitemap.xml'),
        '',
        '## صفحات اصلی',
    ];
    foreach (ad_seo_static_pages() as $p) {
        $lines[] = '- [' . $p['title'] . '](' . $p['loc'] . ')';
    }
    $posts = ad_seo_blog_urls();
    $lines[] = '';
    $lines[] = '## مقالات وبلاگ';
    if (!$posts) {
        $lines[] = '- هنوز مقاله‌ای منتشر نشده است.';
    } else {
        foreach ($posts as $p) {
            $extra = $p['excerpt'] !== '' ? ': ' . mb_substr($p['excerpt'], 0, 160) : '';
            $lines[] = '- [' . $p['title'] . '](' . $p['loc'] . ')' . $extra;
        }
    }
    $works = ad_seo_portfolio_urls();
    $lines[] = '';
    $lines[] = '## نمونه‌کارها';
    if (!$works) {
        $lines[] = '- هنوز نمونه‌کاری ثبت نشده است.';
    } else {
        foreach ($works as $p) {
            $extra = $p['excerpt'] !== '' ? ': ' . mb_substr($p['excerpt'], 0, 160) : '';
            $lines[] = '- [' . $p['title'] . '](' . $p['loc'] . ')' . $extra;
        }
    }
    $members = ad_seo_team_urls();
    $lines[] = '';
    $lines[] = '## اعضای تیم';
    if (!$members) {
        $lines[] = '- هنوز عضوی ثبت نشده است.';
    } else {
        foreach ($members as $p) {
            $extra = $p['excerpt'] !== '' ? ': ' . mb_substr($p['excerpt'], 0, 160) : '';
            $lines[] = '- [' . $p['title'] . '](' . $p['loc'] . ')' . $extra;
        }
    }
    $lines[] = '';
    $lines[] = '## توجه';
    $lines[] = 'این فایل به‌صورت خودکار از محتوای منتشرشده سایت تولید می‌شود.';
    return implode("\n", $lines) . "\n";
}

function ad_seo_output_sitemap(): void
{
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: public, max-age=300');
    echo ad_seo_build_sitemap_xml();
    exit;
}

function ad_seo_output_llms(): void
{
    header('Content-Type: text/plain; charset=utf-8');
    echo ad_seo_build_llms_txt();
    exit;
}

/**
 * Write cached static copies (optional boost) — always regenerates from live data.
 */
function ad_seo_refresh_public_files(): void
{
    $root = ad_seo_site_root();
    @file_put_contents($root . '/sitemap.xml', ad_seo_build_sitemap_xml());
    @file_put_contents($root . '/llms.txt', ad_seo_build_llms_txt());
    ad_seo_ensure_robots_file();
}

/** Call after blog publish/update/delete */
function ad_seo_ping_search_engines(): void
{
    $sitemap = ad_seo_absolute_url('sitemap.xml');
    $targets = [
        'https://www.google.com/ping?sitemap=' . rawurlencode($sitemap),
        'https://www.bing.com/ping?sitemap=' . rawurlencode($sitemap),
    ];
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 4,
            'ignore_errors' => true,
            'header' => "User-Agent: ana-dental-sitemap-ping\r\n",
        ],
    ]);
    foreach ($targets as $url) {
        @file_get_contents($url, false, $ctx);
    }
}

function ad_seo_on_content_change(): void
{
    try {
        ad_seo_refresh_public_files();
        ad_seo_ping_search_engines();
    } catch (Throwable $e) {
        // non-fatal
    }
}
