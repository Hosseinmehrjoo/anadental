<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function ad_videos_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `satisfaction_videos` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

/**
 * @return list<array<string, mixed>>
 */
function ad_videos_list_all(): array
{
    ad_videos_ensure_schema();
    return ad_db()
        ->query('SELECT * FROM satisfaction_videos ORDER BY sort_order ASC, id ASC')
        ->fetchAll();
}

/**
 * @return list<array<string, mixed>>
 */
function ad_videos_list_public(): array
{
    ad_videos_ensure_schema();
    $rows = ad_db()
        ->query(
            'SELECT id, title, video_url, poster_url, sort_order
             FROM satisfaction_videos
             WHERE is_active = 1 AND video_url <> \'\'
             ORDER BY sort_order ASC, id ASC'
        )
        ->fetchAll();
    $out = [];
    foreach ($rows as $row) {
        $out[] = [
            'id' => (int) $row['id'],
            'title' => (string) $row['title'],
            'video_url' => (string) $row['video_url'],
            'poster_url' => (string) $row['poster_url'],
            'sort_order' => (int) $row['sort_order'],
        ];
    }
    return $out;
}

function ad_videos_get(int $id): ?array
{
    ad_videos_ensure_schema();
    $stmt = ad_db()->prepare('SELECT * FROM satisfaction_videos WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}
