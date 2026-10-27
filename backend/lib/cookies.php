<?php

require_once __DIR__ . '/db.php';

function ad_cookies_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `cookie_settings` (
          `id` TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
          `banner_enabled` TINYINT(1) NOT NULL DEFAULT 1,
          `banner_text` TEXT NOT NULL,
          `accept_label` VARCHAR(80) NOT NULL DEFAULT 'پذیرش',
          `reject_label` VARCHAR(80) NOT NULL DEFAULT 'رد',
          `manage_label` VARCHAR(80) NOT NULL DEFAULT 'مدیریت کوکی',
          `enable_analytics` TINYINT(1) NOT NULL DEFAULT 1,
          `enable_marketing` TINYINT(1) NOT NULL DEFAULT 1,
          `enable_social` TINYINT(1) NOT NULL DEFAULT 1,
          `privacy_url` VARCHAR(255) NOT NULL DEFAULT '',
          `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `cookie_consents` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `visitor_id` VARCHAR(64) NOT NULL DEFAULT '',
          `action` ENUM('accept','reject','custom') NOT NULL,
          `necessary` TINYINT(1) NOT NULL DEFAULT 1,
          `analytics` TINYINT(1) NOT NULL DEFAULT 0,
          `marketing` TINYINT(1) NOT NULL DEFAULT 0,
          `social` TINYINT(1) NOT NULL DEFAULT 0,
          `ip_hash` VARCHAR(64) NOT NULL DEFAULT '',
          `user_agent` VARCHAR(255) NOT NULL DEFAULT '',
          `page_url` VARCHAR(500) NOT NULL DEFAULT '',
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_cookie_action_date` (`action`, `created_at`),
          KEY `idx_cookie_visitor` (`visitor_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $count = (int) $db->query('SELECT COUNT(*) FROM cookie_settings')->fetchColumn();
    if ($count === 0) {
        $defaultText = 'ما از کوکی‌های اختیاری برای بهبود تجربه شما در وب‌سایت‌هایمان (از جمله از طریق اتصال به شبکه‌های اجتماعی) و ارائه تبلیغات شخصی‌سازی‌شده بر اساس فعالیت آنلاین شما استفاده می‌کنیم. در صورت رد کوکی‌های اختیاری، تنها کوکی‌هایی که برای ارائه این خدمات ضروری هستند، مورد استفاده قرار خواهند گرفت.';
        $stmt = $db->prepare(
            'INSERT INTO cookie_settings
             (id, banner_enabled, banner_text, accept_label, reject_label, manage_label, enable_analytics, enable_marketing, enable_social, privacy_url)
             VALUES (1, 1, ?, \'پذیرش\', \'رد\', \'مدیریت کوکی\', 1, 1, 1, \'\')'
        );
        $stmt->execute([$defaultText]);
    }
    $done = true;
}

function ad_cookie_settings(): array
{
    ad_cookies_ensure_schema();
    $row = ad_db()->query('SELECT * FROM cookie_settings WHERE id = 1')->fetch();
    return $row ?: [];
}

function ad_cookie_ip_hash(): string
{
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    if (str_contains((string) $ip, ',')) {
        $ip = trim(explode(',', (string) $ip)[0]);
    }
    $ip = trim((string) $ip);
    if ($ip === '') {
        return '';
    }
    return hash('sha256', $ip . '|ana-cookie');
}
