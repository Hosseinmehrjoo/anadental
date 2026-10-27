<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

/**
 * @return array{title:string,description:string,keywords:string}
 */
function ad_page_seo_defaults(string $page): array
{
    $map = [
        'member' => [
            'title' => 'عضو تیم | آنادنت',
            'description' => 'رزومه عضو تیم آنادنت',
            'keywords' => '',
        ],
        'work' => [
            'title' => 'نمونه‌کار | آنادنت',
            'description' => 'جزئیات نمونه‌کار آنادنت',
            'keywords' => '',
        ],
        'blog-post' => [
            'title' => 'مطلب | آنادنت',
            'description' => 'مطلب وبلاگ آنادنت',
            'keywords' => '',
        ],
    ];
    return $map[$page] ?? [
        'title' => 'آنادنت',
        'description' => 'کلینیک تخصصی ایمپلنت آنادنت',
        'keywords' => '',
    ];
}

function ad_page_seo_plain(string $html, int $max = 160): string
{
    $text = trim(preg_replace('/\s+/u', ' ', strip_tags($html)) ?? '');
    if ($text === '') {
        return '';
    }
    if (mb_strlen($text, 'UTF-8') <= $max) {
        return $text;
    }
    return mb_substr($text, 0, $max - 1, 'UTF-8') . '…';
}

/**
 * @return array{title:string,description:string,keywords:string}
 */
function ad_page_seo_for_request(string $page): array
{
    $seo = ad_page_seo_defaults($page);
    $slug = trim((string) ($_GET['slug'] ?? ''));
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    try {
        if ($page === 'member') {
            require_once __DIR__ . '/team.php';
            ad_team_ensure_schema();
            if ($id > 0) {
                $stmt = ad_db()->prepare(
                    'SELECT name, slug, meta_title, meta_description, meta_keywords, bio, role
                     FROM team_members WHERE is_active = 1 AND id = ? LIMIT 1'
                );
                $stmt->execute([$id]);
            } elseif ($slug !== '') {
                $stmt = ad_db()->prepare(
                    'SELECT name, slug, meta_title, meta_description, meta_keywords, bio, role
                     FROM team_members WHERE is_active = 1 AND slug = ? LIMIT 1'
                );
                $stmt->execute([$slug]);
            } else {
                return $seo;
            }
            $row = $stmt->fetch();
            if (!$row) {
                return $seo;
            }
            $name = trim((string) ($row['name'] ?? ''));
            $metaTitle = trim((string) ($row['meta_title'] ?? ''));
            $metaDesc = trim((string) ($row['meta_description'] ?? ''));
            $metaKw = trim((string) ($row['meta_keywords'] ?? ''));
            $seo['title'] = $metaTitle !== '' ? $metaTitle : ($name !== '' ? ($name . ' | آنادنت') : $seo['title']);
            $seo['description'] = $metaDesc !== ''
                ? $metaDesc
                : (ad_page_seo_plain((string) ($row['bio'] ?? '')) ?: (trim((string) ($row['role'] ?? '')) ?: $seo['description']));
            $seo['keywords'] = $metaKw;
            return $seo;
        }

        if ($page === 'work') {
            require_once __DIR__ . '/portfolio.php';
            ad_portfolio_ensure_schema();
            if ($id > 0) {
                $stmt = ad_db()->prepare(
                    'SELECT title, slug, meta_title, meta_description, meta_keywords, description
                     FROM portfolio_items WHERE is_active = 1 AND id = ? LIMIT 1'
                );
                $stmt->execute([$id]);
            } elseif ($slug !== '') {
                $stmt = ad_db()->prepare(
                    'SELECT title, slug, meta_title, meta_description, meta_keywords, description
                     FROM portfolio_items WHERE is_active = 1 AND slug = ? LIMIT 1'
                );
                $stmt->execute([$slug]);
            } else {
                return $seo;
            }
            $row = $stmt->fetch();
            if (!$row) {
                return $seo;
            }
            $title = trim((string) ($row['title'] ?? ''));
            $metaTitle = trim((string) ($row['meta_title'] ?? ''));
            $metaDesc = trim((string) ($row['meta_description'] ?? ''));
            $metaKw = trim((string) ($row['meta_keywords'] ?? ''));
            $seo['title'] = $metaTitle !== '' ? $metaTitle : ($title !== '' ? ($title . ' | آنادنت') : $seo['title']);
            $seo['description'] = $metaDesc !== ''
                ? $metaDesc
                : (ad_page_seo_plain((string) ($row['description'] ?? '')) ?: $seo['description']);
            $seo['keywords'] = $metaKw;
            return $seo;
        }

        if ($page === 'blog-post') {
            require_once __DIR__ . '/blog.php';
            ad_blog_ensure_schema();
            if ($slug === '') {
                return $seo;
            }
            $stmt = ad_db()->prepare(
                "SELECT title, slug, excerpt, content, meta_title, meta_description, meta_keywords
                 FROM blog_posts
                 WHERE status = 'published' AND slug = ?
                 LIMIT 1"
            );
            $stmt->execute([$slug]);
            $row = $stmt->fetch();
            if (!$row) {
                return $seo;
            }
            $title = trim((string) ($row['title'] ?? ''));
            $metaTitle = trim((string) ($row['meta_title'] ?? ''));
            $metaDesc = trim((string) ($row['meta_description'] ?? ''));
            $metaKw = trim((string) ($row['meta_keywords'] ?? ''));
            $seo['title'] = $metaTitle !== '' ? $metaTitle : ($title !== '' ? ($title . ' | آنادنت') : $seo['title']);
            $seo['description'] = $metaDesc !== ''
                ? $metaDesc
                : (ad_page_seo_plain((string) ($row['excerpt'] ?? ''))
                    ?: (ad_page_seo_plain((string) ($row['content'] ?? '')) ?: $seo['description']));
            $seo['keywords'] = $metaKw;
            return $seo;
        }

    } catch (Throwable $e) {
        return $seo;
    }

    return $seo;
}

/**
 * @param array{title:string,description:string,keywords:string} $seo
 */
function ad_page_seo_print_head_tags(array $seo): void
{
    $title = (string) ($seo['title'] ?? '');
    $description = (string) ($seo['description'] ?? '');
    $keywords = (string) ($seo['keywords'] ?? '');
    echo '<title>' . ad_e($title) . "</title>\n";
    if ($description !== '') {
        echo '  <meta name="description" content="' . ad_e($description) . "\" />\n";
    }
    if ($keywords !== '') {
        echo '  <meta name="keywords" content="' . ad_e($keywords) . "\" />\n";
    }
    if ($title !== '') {
        echo '  <meta property="og:title" content="' . ad_e($title) . "\" />\n";
    }
    if ($description !== '') {
        echo '  <meta property="og:description" content="' . ad_e($description) . "\" />\n";
    }
}
