-- ana-developer.ir CMS schema
-- Charset: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `email` VARCHAR(180) NOT NULL DEFAULT '',
  `display_name` VARCHAR(120) NOT NULL DEFAULT '',
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user','author','admin') NOT NULL DEFAULT 'user',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `name_en` VARCHAR(120) NOT NULL DEFAULT '',
  `slug` VARCHAR(200) NOT NULL DEFAULT '',
  `meta_title` VARCHAR(255) NOT NULL DEFAULT '',
  `meta_description` VARCHAR(500) NOT NULL DEFAULT '',
  `meta_keywords` VARCHAR(500) NOT NULL DEFAULT '',
  `role` VARCHAR(180) NOT NULL DEFAULT '',
  `role_en` VARCHAR(180) NOT NULL DEFAULT '',
  `bio` TEXT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `highlight_1` VARCHAR(255) NOT NULL DEFAULT '',
  `highlight_2` VARCHAR(255) NOT NULL DEFAULT '',
  `highlight_3` VARCHAR(255) NOT NULL DEFAULT '',
  `joined_at` DATE NULL,
  `social_whatsapp` VARCHAR(255) NOT NULL DEFAULT '',
  `social_telegram` VARCHAR(255) NOT NULL DEFAULT '',
  `social_instagram` VARCHAR(255) NOT NULL DEFAULT '',
  `social_linkedin` VARCHAR(255) NOT NULL DEFAULT '',
  `social_web` VARCHAR(255) NOT NULL DEFAULT '',
  `photo` VARCHAR(255) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_team_slug` (`slug`),
  KEY `idx_team_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `member_id` INT UNSIGNED NULL DEFAULT NULL,
  `member_summary` VARCHAR(255) NOT NULL DEFAULT '',
  `team_roles` TEXT NULL,
  `title` VARCHAR(180) NOT NULL,
  `slug` VARCHAR(200) NOT NULL DEFAULT '',
  `meta_title` VARCHAR(255) NOT NULL DEFAULT '',
  `meta_description` VARCHAR(500) NOT NULL DEFAULT '',
  `meta_keywords` VARCHAR(500) NOT NULL DEFAULT '',
  `description` TEXT NULL,
  `category` ENUM('websites','apps') NOT NULL DEFAULT 'websites',
  `cover` VARCHAR(255) NOT NULL DEFAULT '',
  `tags` VARCHAR(255) NOT NULL DEFAULT '',
  `technologies` TEXT NULL,
  `provided_services` TEXT NULL,
  `price` VARCHAR(120) NOT NULL DEFAULT '',
  `show_price` TINYINT(1) NOT NULL DEFAULT 0,
  `url` VARCHAR(255) NOT NULL DEFAULT '',
  `client_name` VARCHAR(180) NOT NULL DEFAULT '',
  `delivery_date` VARCHAR(80) NOT NULL DEFAULT '',
  `executor` VARCHAR(180) NOT NULL DEFAULT '',
  `uploaded_at` VARCHAR(80) NOT NULL DEFAULT '',
  `screenshots` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_portfolio_slug` (`slug`),
  KEY `idx_portfolio_cat_active` (`category`, `is_active`, `sort_order`),
  KEY `idx_portfolio_member` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL,
  `meta_title` VARCHAR(255) NOT NULL DEFAULT '',
  `meta_description` VARCHAR(500) NOT NULL DEFAULT '',
  `meta_keywords` VARCHAR(500) NOT NULL DEFAULT '',
  `excerpt` TEXT NULL,
  `content` MEDIUMTEXT NULL,
  `cover` VARCHAR(255) NOT NULL DEFAULT '',
  `status` ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `published_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_slug` (`slug`),
  KEY `idx_blog_status_date` (`status`, `published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(140) NOT NULL,
  `description` TEXT NULL,
  `parent_id` INT UNSIGNED NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_category_slug` (`slug`),
  KEY `idx_blog_category_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_post_categories` (
  `post_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `category_id`),
  KEY `idx_bpc_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `parent_id` INT UNSIGNED NULL DEFAULT NULL,
  `author_name` VARCHAR(120) NOT NULL,
  `author_email` VARCHAR(180) NOT NULL DEFAULT '',
  `body` TEXT NOT NULL,
  `status` ENUM('pending','approved','spam') NOT NULL DEFAULT 'pending',
  `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
  `ip_hash` VARCHAR(64) NOT NULL DEFAULT '',
  `user_agent` VARCHAR(255) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_post_status` (`post_id`, `status`, `created_at`),
  KEY `idx_comments_status` (`status`, `created_at`),
  KEY `idx_comments_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `portfolio_technologies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `label` VARCHAR(120) NOT NULL,
  `icon` VARCHAR(255) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_portfolio_tech_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `portfolio_provided_services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `label` VARCHAR(120) NOT NULL,
  `icon` VARCHAR(255) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_portfolio_provided_service_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL DEFAULT '',
  `alt_text` VARCHAR(255) NOT NULL DEFAULT '',
  `mime` VARCHAR(80) NOT NULL DEFAULT '',
  `filesize` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_media_path` (`path`),
  KEY `idx_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL DEFAULT '',
  `phone` VARCHAR(40) NOT NULL DEFAULT '',
  `subject` VARCHAR(200) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_read_date` (`is_read`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cookie_settings` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `redirects` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cookie_consents` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cookie_settings`
  (`id`, `banner_enabled`, `banner_text`, `accept_label`, `reject_label`, `manage_label`, `enable_analytics`, `enable_marketing`, `enable_social`, `privacy_url`)
VALUES
  (1, 1, 'ما از کوکی‌های اختیاری برای بهبود تجربه شما در وب‌سایت‌هایمان (از جمله از طریق اتصال به شبکه‌های اجتماعی) و ارائه تبلیغات شخصی‌سازی‌شده بر اساس فعالیت آنلاین شما استفاده می‌کنیم. در صورت رد کوکی‌های اختیاری، تنها کوکی‌هایی که برای ارائه این خدمات ضروری هستند، مورد استفاده قرار خواهند گرفت.', 'پذیرش', 'رد', 'مدیریت کوکی', 1, 1, 1, '')
ON DUPLICATE KEY UPDATE `id` = `id`;

SET FOREIGN_KEY_CHECKS = 1;

-- installment system removed

CREATE TABLE IF NOT EXISTS `satisfaction_videos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL DEFAULT '',
  `video_url` VARCHAR(1000) NOT NULL DEFAULT '',
  `poster_url` VARCHAR(1000) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_videos_active_sort` (`is_active`, `sort_order`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
