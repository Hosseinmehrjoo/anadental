<?php
/**
 * کپی این فایل به config.php و مقادیر را پر کنید.
 * در Docker معمولاً از متغیرهای محیطی در entrypoint ساخته می‌شود.
 */
return [
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => (int) (getenv('DB_PORT') ?: 3306),
    'db_name' => getenv('DB_NAME') ?: 'ana_dental',
    'db_user' => getenv('DB_USER') ?: 'ana_dental',
    'db_pass' => getenv('DB_PASS') ?: 'change_me',
    'db_charset' => 'utf8mb4',

    // در Docker خالی بگذارید تا ریشهٔ پروژه (= document root) استفاده شود.
    // در توسعهٔ محلی معمولاً نیازی به تنظیم دستی نیست.
    'site_root' => getenv('SITE_ROOT') ?: '',
    'upload_url_prefix' => 'assets/images/uploads/',
    'upload_dir' => '',

    'site_name' => getenv('SITE_NAME') ?: 'آنادنت',
    // آدرس عمومی بدون اسلش پایانی — مثال: https://example.com
    'site_url' => rtrim((string) (getenv('SITE_URL') ?: ''), '/'),
    // مبدأهای مجاز CORS علاوه بر دامنهٔ فعلی و localhost
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', (string) (getenv('ALLOWED_ORIGINS') ?: ''))))),
    'timezone' => getenv('TZ') ?: 'Asia/Tehran',
    'trusted_proxies' => array_values(array_filter(array_map('trim', explode(',', (string) (getenv('TRUSTED_PROXIES') ?: ''))))),
];
