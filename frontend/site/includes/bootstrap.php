<?php
declare(strict_types=1);

$backendRoot = '';
foreach ([
    dirname(__DIR__) . '/backend',     // Docker/public root: /var/www/html/backend
    dirname(__DIR__, 3) . '/backend',  // Local monorepo: ana-dental/backend
] as $candidate) {
    if (is_file($candidate . '/lib/db.php')) {
        $backendRoot = $candidate;
        break;
    }
}
if ($backendRoot === '') {
    http_response_code(503);
    echo 'بک‌اند در دسترس نیست.';
    exit;
}

require_once $backendRoot . '/lib/db.php';
require_once $backendRoot . '/lib/helpers.php';
require_once $backendRoot . '/lib/blog.php';
require_once $backendRoot . '/lib/comments.php';
require_once $backendRoot . '/lib/media.php';
require_once $backendRoot . '/lib/seo.php';

function dental_e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function dental_fa_digits(string $value): string
{
    return strtr($value, [
        '0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴',
        '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹',
    ]);
}

function dental_format_date(?string $value): string
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }
    $ts = strtotime($value);
    if ($ts === false) {
        return dental_fa_digits($value);
    }
    return dental_fa_digits(date('Y/m/d', $ts));
}

function dental_reading_minutes(string $html): string
{
    $text = trim(preg_replace('/\s+/u', ' ', strip_tags($html)) ?? '');
    $words = $text === '' ? 0 : count(preg_split('/\s+/u', $text) ?: []);
    $minutes = max(1, (int) ceil($words / 180));
    return dental_fa_digits((string) $minutes) . ' دقیقه';
}

function dental_site_name(): string
{
    try {
        return (string) (ad_config()['site_name'] ?? 'آنادنت');
    } catch (Throwable $e) {
        return 'آنادنت';
    }
}

/**
 * @param array<string, mixed> $vars
 */
function dental_render(string $view, array $vars = []): void
{
    extract($vars, EXTR_SKIP);
    $pageTitle = $pageTitle ?? dental_site_name();
    $metaDescription = $metaDescription ?? '';
    $canonicalPath = $canonicalPath ?? '';
    require __DIR__ . '/layout-top.php';
    require __DIR__ . '/views/' . $view . '.php';
    require __DIR__ . '/layout-bottom.php';
}
