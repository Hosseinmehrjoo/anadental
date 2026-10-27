<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/portfolio.php';

function ad_team_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $cols = $db->query('SHOW COLUMNS FROM team_members')->fetchAll(PDO::FETCH_COLUMN);

    $add = static function (array $cols, string $name, string $ddl) use ($db): array {
        if (!in_array($name, $cols, true)) {
            $db->exec("ALTER TABLE team_members ADD COLUMN {$ddl}");
            $cols[] = $name;
        }
        return $cols;
    };

    $cols = $add($cols, 'name_en', "`name_en` VARCHAR(120) NOT NULL DEFAULT '' AFTER `name`");
    $cols = $add($cols, 'role_en', "`role_en` VARCHAR(180) NOT NULL DEFAULT '' AFTER `role`");
    $cols = $add($cols, 'rating', "`rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0 AFTER `bio`");
    $cols = $add($cols, 'highlight_1', "`highlight_1` VARCHAR(255) NOT NULL DEFAULT '' AFTER `rating`");
    $cols = $add($cols, 'highlight_2', "`highlight_2` VARCHAR(255) NOT NULL DEFAULT '' AFTER `highlight_1`");
    $cols = $add($cols, 'highlight_3', "`highlight_3` VARCHAR(255) NOT NULL DEFAULT '' AFTER `highlight_2`");
    $cols = $add($cols, 'joined_at', "`joined_at` DATE NULL AFTER `highlight_3`");
    $cols = $add($cols, 'social_whatsapp', "`social_whatsapp` VARCHAR(255) NOT NULL DEFAULT '' AFTER `joined_at`");
    $cols = $add($cols, 'social_telegram', "`social_telegram` VARCHAR(255) NOT NULL DEFAULT '' AFTER `social_whatsapp`");
    $cols = $add($cols, 'social_instagram', "`social_instagram` VARCHAR(255) NOT NULL DEFAULT '' AFTER `social_telegram`");
    $cols = $add($cols, 'social_linkedin', "`social_linkedin` VARCHAR(255) NOT NULL DEFAULT '' AFTER `social_instagram`");
    $cols = $add($cols, 'social_web', "`social_web` VARCHAR(255) NOT NULL DEFAULT '' AFTER `social_linkedin`");
    $cols = $add($cols, 'slug', "`slug` VARCHAR(200) NOT NULL DEFAULT '' AFTER `name_en`");
    $cols = $add($cols, 'meta_title', "`meta_title` VARCHAR(255) NOT NULL DEFAULT '' AFTER `slug`");
    $cols = $add($cols, 'meta_description', "`meta_description` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_title`");
    $cols = $add($cols, 'meta_keywords', "`meta_keywords` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_description`");

    ad_team_backfill_slugs();
    try {
        $db->exec('ALTER TABLE team_members ADD UNIQUE KEY `uq_team_slug` (`slug`)');
    } catch (Throwable $e) {
        // index may already exist
    }

    ad_portfolio_ensure_schema();
    $pCols = $db->query('SHOW COLUMNS FROM portfolio_items')->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('member_id', $pCols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `member_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id`");
        try {
            $db->exec("ALTER TABLE portfolio_items ADD KEY `idx_portfolio_member` (`member_id`)");
        } catch (Throwable $e) {
            // index may already exist on partial migrations
        }
    }

    $done = true;
}

function ad_team_unique_slug(string $base, int $ignoreId = 0): string
{
    if (!function_exists('ad_slugify')) {
        require_once __DIR__ . '/helpers.php';
    }
    $slug = ad_slugify($base);
    $db = ad_db();
    $candidate = $slug;
    $i = 2;
    while (true) {
        $stmt = $db->prepare('SELECT id FROM team_members WHERE slug = ? LIMIT 1');
        $stmt->execute([$candidate]);
        $row = $stmt->fetch();
        if (!$row || ((int) $row['id'] === $ignoreId)) {
            return $candidate;
        }
        $candidate = mb_substr($slug, 0, 180, 'UTF-8') . '-' . $i;
        $i++;
    }
}

function ad_team_backfill_slugs(): void
{
    $db = ad_db();
    try {
        $rows = $db->query("SELECT id, name, name_en FROM team_members WHERE slug = '' OR slug IS NULL")->fetchAll();
    } catch (Throwable $e) {
        return;
    }
    foreach ($rows as $row) {
        $id = (int) ($row['id'] ?? 0);
        if ($id <= 0) {
            continue;
        }
        $base = trim((string) ($row['name_en'] ?? ''));
        if ($base === '') {
            $base = trim((string) ($row['name'] ?? ''));
        }
        if ($base === '') {
            $base = 'member-' . $id;
        }
        $slug = ad_team_unique_slug($base, $id);
        $db->prepare('UPDATE team_members SET slug = ? WHERE id = ?')->execute([$slug, $id]);
    }
}

/**
 * @param array<string, mixed> $row
 * @return array<string, mixed>
 */
function ad_team_normalize_member(array $row): array
{
    $row['slug'] = trim((string) ($row['slug'] ?? ''));
    $row['meta_title'] = trim((string) ($row['meta_title'] ?? ''));
    $row['meta_description'] = trim((string) ($row['meta_description'] ?? ''));
    $row['meta_keywords'] = trim((string) ($row['meta_keywords'] ?? ''));
    $rating = (float) ($row['rating'] ?? 5);
    if ($rating < 0) {
        $rating = 0;
    }
    if ($rating > 5) {
        $rating = 5;
    }
    $row['rating'] = round($rating, 1);
    $row['highlights'] = array_values(array_filter([
        trim((string) ($row['highlight_1'] ?? '')),
        trim((string) ($row['highlight_2'] ?? '')),
        trim((string) ($row['highlight_3'] ?? '')),
    ], static function ($v) {
        return $v !== '';
    }));

    $joined = $row['joined_at'] ?? null;
    $row['joined_at'] = $joined ? (string) $joined : '';
    $row['joined_label'] = '';
    if ($joined) {
        try {
            $start = new DateTimeImmutable((string) $joined);
            $now = new DateTimeImmutable('today');
            $months = ((int) $now->format('Y') - (int) $start->format('Y')) * 12
                + ((int) $now->format('n') - (int) $start->format('n'));
            if ($months < 0) {
                $months = 0;
            }
            if ($months === 0) {
                $row['joined_label'] = 'عضویت جدید';
            } else {
                $row['joined_label'] = $months . ' ماه پیش';
            }
        } catch (Throwable $e) {
            $row['joined_label'] = (string) $joined;
        }
    }

    $row['name_en'] = (string) ($row['name_en'] ?? '');
    $row['role_en'] = (string) ($row['role_en'] ?? '');
    $row['social_whatsapp'] = (string) ($row['social_whatsapp'] ?? '');
    $row['social_telegram'] = (string) ($row['social_telegram'] ?? '');
    $row['social_instagram'] = (string) ($row['social_instagram'] ?? '');
    $row['social_linkedin'] = (string) ($row['social_linkedin'] ?? '');
    $row['social_web'] = (string) ($row['social_web'] ?? '');
    $photo = trim((string) ($row['photo'] ?? ''));
    if (!function_exists('ad_media_alt')) {
        require_once __DIR__ . '/media.php';
    }
    $row['photo_alt'] = $photo !== '' ? ad_media_alt($photo) : '';
    unset($row['highlight_1'], $row['highlight_2'], $row['highlight_3']);
    return $row;
}
