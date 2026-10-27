<?php

require_once __DIR__ . '/db.php';

function ad_services_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `services` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `title` VARCHAR(180) NOT NULL,
          `slug` VARCHAR(200) NOT NULL,
          `summary` TEXT NULL,
          `content` MEDIUMTEXT NULL,
          `cover` VARCHAR(255) NOT NULL DEFAULT '',
          `icon` VARCHAR(255) NOT NULL DEFAULT '',
          `sort_order` INT NOT NULL DEFAULT 0,
          `is_active` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_services_slug` (`slug`),
          KEY `idx_services_active_sort` (`is_active`, `sort_order`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $count = (int) $db->query('SELECT COUNT(*) FROM services')->fetchColumn();
    if ($count === 0) {
        $seed = [
            ['برنامه‌نویسی وب', 'web-development', 'طراحی و توسعه وبسایت و وب‌اپلیکیشن سریع و مقیاس‌پذیر.', "وبسایت‌هایی زیبا، پرسرعت و متناسب با کسب‌وکار شما می‌سازیم؛ از لندینگ تا پنل مدیریت و فروشگاه.\n\nشامل طراحی رابط، توسعه فرانت/بک، اتصال درگاه و بهینه‌سازی اولیه سئو."],
            ['برنامه‌نویسی اپلیکیشن', 'app-development', 'اپلیکیشن اختصاصی با تمرکز روی کارایی و تجربه کاربری.', "اپلیکیشن موبایل یا دسکتاپ متناسب با فرآیند کسب‌وکار شما طراحی و پیاده‌سازی می‌شود.\n\nاز تحلیل نیاز تا انتشار و پشتیبانی همراهتان هستیم."],
            ['سئو و بهینه‌سازی', 'seo', 'بهبود دیده شدن در نتایج جستجو و عملکرد فنی سایت.', "با ممیزی فنی، بهینه‌سازی محتوا و سرعت، مسیر رشد ارگانیک سایت را شفاف می‌کنیم."],
            ['پشتیبانی و نگهداری', 'support', 'نگهداری مستمر، به‌روزرسانی و رفع اشکال پس از تحویل.', "پکیج‌های ماهانه پشتیبانی برای پایداری سرویس، بکاپ و بهبودهای کوچک."],
        ];
        $stmt = $db->prepare(
            'INSERT INTO services (title, slug, summary, content, sort_order, is_active) VALUES (?,?,?,?,?,1)'
        );
        foreach ($seed as $i => $row) {
            $stmt->execute([$row[0], $row[1], $row[2], $row[3], $i + 1]);
        }
    }
    $done = true;
}
