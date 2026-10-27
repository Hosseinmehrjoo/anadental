<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function ad_portfolio_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $cols = $db->query('SHOW COLUMNS FROM portfolio_items')->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('price', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `price` VARCHAR(120) NOT NULL DEFAULT '' AFTER `tags`");
    }
    if (!in_array('show_price', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `show_price` TINYINT(1) NOT NULL DEFAULT 0 AFTER `price`");
    }
    if (!in_array('client_name', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `client_name` VARCHAR(180) NOT NULL DEFAULT '' AFTER `url`");
    }
    if (!in_array('delivery_date', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `delivery_date` VARCHAR(80) NOT NULL DEFAULT '' AFTER `client_name`");
    }
    if (!in_array('executor', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `executor` VARCHAR(180) NOT NULL DEFAULT '' AFTER `delivery_date`");
    }
    if (!in_array('uploaded_at', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `uploaded_at` VARCHAR(80) NOT NULL DEFAULT '' AFTER `executor`");
    }
    if (!in_array('screenshots', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `screenshots` TEXT NULL AFTER `uploaded_at`");
    }
    if (!in_array('member_id', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `member_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id`");
        try {
            $db->exec("ALTER TABLE portfolio_items ADD KEY `idx_portfolio_member` (`member_id`)");
        } catch (Throwable $e) {
            // ignore duplicate index
        }
    }
    if (!in_array('technologies', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `technologies` TEXT NULL AFTER `tags`");
    }
    if (!in_array('provided_services', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `provided_services` TEXT NULL AFTER `technologies`");
    }
    if (!in_array('member_summary', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `member_summary` VARCHAR(255) NOT NULL DEFAULT '' AFTER `member_id`");
    }
    if (!in_array('team_roles', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `team_roles` TEXT NULL AFTER `member_summary`");
    }
    if (!in_array('slug', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `slug` VARCHAR(200) NOT NULL DEFAULT '' AFTER `title`");
        $cols[] = 'slug';
    }
    if (!in_array('meta_title', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `meta_title` VARCHAR(255) NOT NULL DEFAULT '' AFTER `slug`");
        $cols[] = 'meta_title';
    }
    if (!in_array('meta_description', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `meta_description` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_title`");
        $cols[] = 'meta_description';
    }
    if (!in_array('meta_keywords', $cols, true)) {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN `meta_keywords` VARCHAR(500) NOT NULL DEFAULT '' AFTER `meta_description`");
        $cols[] = 'meta_keywords';
    }
    ad_portfolio_backfill_slugs();
    try {
        $db->exec('ALTER TABLE portfolio_items ADD UNIQUE KEY `uq_portfolio_slug` (`slug`)');
    } catch (Throwable $e) {
        // index may already exist
    }
    ad_portfolio_ensure_technologies_table();
    ad_portfolio_ensure_provided_services_table();
    $done = true;
}

function ad_portfolio_unique_slug(string $base, int $ignoreId = 0): string
{
    $slug = ad_slugify($base);
    $db = ad_db();
    $candidate = $slug;
    $i = 2;
    while (true) {
        $stmt = $db->prepare('SELECT id FROM portfolio_items WHERE slug = ? LIMIT 1');
        $stmt->execute([$candidate]);
        $row = $stmt->fetch();
        if (!$row || ((int) $row['id'] === $ignoreId)) {
            return $candidate;
        }
        $candidate = mb_substr($slug, 0, 180, 'UTF-8') . '-' . $i;
        $i++;
    }
}

function ad_portfolio_backfill_slugs(): void
{
    $db = ad_db();
    try {
        $rows = $db->query("SELECT id, title FROM portfolio_items WHERE slug = '' OR slug IS NULL")->fetchAll();
    } catch (Throwable $e) {
        return;
    }
    foreach ($rows as $row) {
        $id = (int) ($row['id'] ?? 0);
        if ($id <= 0) {
            continue;
        }
        $title = trim((string) ($row['title'] ?? ''));
        $slug = ad_portfolio_unique_slug($title !== '' ? $title : ('work-' . $id), $id);
        $db->prepare('UPDATE portfolio_items SET slug = ? WHERE id = ?')->execute([$slug, $id]);
    }
}

function ad_portfolio_ensure_technologies_table(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    ad_db()->exec(
        "CREATE TABLE IF NOT EXISTS `portfolio_technologies` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `slug` VARCHAR(80) NOT NULL,
          `label` VARCHAR(120) NOT NULL,
          `icon` VARCHAR(255) NOT NULL DEFAULT '',
          `sort_order` INT NOT NULL DEFAULT 0,
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_portfolio_tech_slug` (`slug`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

function ad_portfolio_technology_slugify(string $label): string
{
    $slug = trim(mb_strtolower($label, 'UTF-8'));
    $slug = preg_replace('/\s+/u', '-', $slug) ?? $slug;
    $slug = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $slug) ?? $slug;
    $slug = trim($slug, '-');
    if ($slug === '') {
        $slug = 'tech-' . substr(bin2hex(random_bytes(4)), 0, 8);
    }
    return mb_substr($slug, 0, 80, 'UTF-8');
}

/**
 * @return list<array{id:string,label:string,icon:string}>
 */
function ad_portfolio_custom_technologies(): array
{
    ad_portfolio_ensure_technologies_table();
    try {
        $rows = ad_db()->query(
            'SELECT slug, label, icon FROM portfolio_technologies ORDER BY sort_order ASC, id ASC'
        )->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
    $out = [];
    foreach ($rows as $row) {
        $id = trim((string) ($row['slug'] ?? ''));
        if ($id === '') {
            continue;
        }
        $out[] = [
            'id' => $id,
            'label' => (string) ($row['label'] ?? $id),
            'icon' => (string) ($row['icon'] ?? ''),
        ];
    }
    return $out;
}

/**
 * @return array{id:string,label:string,icon:string}
 */
function ad_portfolio_add_technology(string $label, string $icon = ''): array
{
    ad_portfolio_ensure_technologies_table();
    $label = trim($label);
    if ($label === '') {
        throw new RuntimeException('نام تکنولوژی الزامی است.');
    }
    if (mb_strlen($label) > 120) {
        $label = mb_substr($label, 0, 120);
    }
    $slug = ad_portfolio_technology_slugify($label);
    $builtin = ad_portfolio_builtin_technology_catalog();
    if (isset($builtin[$slug])) {
        throw new RuntimeException('این تکنولوژی از قبل در لیست پیش‌فرض وجود دارد.');
    }
    $db = ad_db();
    $exists = $db->prepare('SELECT id FROM portfolio_technologies WHERE slug = ? LIMIT 1');
    $exists->execute([$slug]);
    if ($exists->fetch()) {
        throw new RuntimeException('این تکنولوژی قبلاً اضافه شده است.');
    }
    $stmt = $db->prepare(
        'INSERT INTO portfolio_technologies (slug, label, icon, sort_order) VALUES (?,?,?,?)'
    );
    $stmt->execute([$slug, $label, $icon, 100]);
    // invalidate static catalog cache by using a fresh merge next call
    return ['id' => $slug, 'label' => $label, 'icon' => $icon];
}

function ad_portfolio_ensure_provided_services_table(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    ad_db()->exec(
        "CREATE TABLE IF NOT EXISTS `portfolio_provided_services` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `slug` VARCHAR(80) NOT NULL,
          `label` VARCHAR(120) NOT NULL,
          `icon` VARCHAR(255) NOT NULL DEFAULT '',
          `sort_order` INT NOT NULL DEFAULT 0,
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_portfolio_provided_service_slug` (`slug`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

/**
 * @return list<array{id:string,label:string,icon:string}>
 */
function ad_portfolio_custom_provided_services(): array
{
    ad_portfolio_ensure_provided_services_table();
    try {
        $rows = ad_db()->query(
            'SELECT slug, label, icon FROM portfolio_provided_services ORDER BY sort_order ASC, id ASC'
        )->fetchAll();
    } catch (Throwable $e) {
        return [];
    }
    $out = [];
    foreach ($rows as $row) {
        $id = trim((string) ($row['slug'] ?? ''));
        if ($id === '') {
            continue;
        }
        $out[] = [
            'id' => $id,
            'label' => (string) ($row['label'] ?? $id),
            'icon' => (string) ($row['icon'] ?? ''),
        ];
    }
    return $out;
}

/**
 * @return array{id:string,label:string,icon:string}
 */
function ad_portfolio_add_provided_service(string $label, string $icon = ''): array
{
    ad_portfolio_ensure_provided_services_table();
    $label = trim($label);
    if ($label === '') {
        throw new RuntimeException('نام خدمت الزامی است.');
    }
    if (mb_strlen($label) > 120) {
        $label = mb_substr($label, 0, 120);
    }
    $slug = ad_portfolio_technology_slugify($label);
    $db = ad_db();
    $exists = $db->prepare('SELECT id FROM portfolio_provided_services WHERE slug = ? LIMIT 1');
    $exists->execute([$slug]);
    if ($exists->fetch()) {
        throw new RuntimeException('این خدمت قبلاً اضافه شده است.');
    }
    $stmt = $db->prepare(
        'INSERT INTO portfolio_provided_services (slug, label, icon, sort_order) VALUES (?,?,?,?)'
    );
    $stmt->execute([$slug, $label, $icon, 100]);
    return ['id' => $slug, 'label' => $label, 'icon' => $icon];
}

/**
 * @return array<string, array{id:string,label:string,icon:string}>
 */
function ad_portfolio_provided_services_catalog(): array
{
    $catalog = [];
    foreach (ad_portfolio_custom_provided_services() as $item) {
        $catalog[$item['id']] = $item;
    }
    return $catalog;
}

/**
 * @return list<string>
 */
function ad_portfolio_parse_provided_services(?string $raw): array
{
    $parts = ad_portfolio_parse_list($raw);
    if (!$parts) {
        return [];
    }
    $catalog = ad_portfolio_provided_services_catalog();
    $out = [];
    $seen = [];
    foreach ($parts as $part) {
        $key = trim((string) $part);
        $id = null;
        if (isset($catalog[$key])) {
            $id = $key;
        } else {
            $lower = mb_strtolower($key, 'UTF-8');
            foreach ($catalog as $cid => $meta) {
                if (mb_strtolower((string) ($meta['label'] ?? ''), 'UTF-8') === $lower) {
                    $id = $cid;
                    break;
                }
            }
        }
        if ($id === null || isset($seen[$id])) {
            continue;
        }
        $seen[$id] = true;
        $out[] = $id;
    }
    return $out;
}

/**
 * @param list<string> $ids
 * @return list<array{id:string,label:string,icon:string}>
 */
function ad_portfolio_enrich_provided_services(array $ids): array
{
    $catalog = ad_portfolio_provided_services_catalog();
    $out = [];
    foreach ($ids as $id) {
        if (isset($catalog[$id])) {
            $out[] = $catalog[$id];
        }
    }
    return $out;
}

/**
 * @return list<array{member_id:int,role:string,summary:string}>
 */
function ad_portfolio_parse_team_roles(?string $raw): array
{
    $raw = trim((string) $raw);
    if ($raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return [];
    }
    $out = [];
    $seen = [];
    foreach ($decoded as $row) {
        if (!is_array($row)) {
            continue;
        }
        $memberId = (int) ($row['member_id'] ?? 0);
        if ($memberId <= 0 || isset($seen[$memberId])) {
            continue;
        }
        $role = trim((string) ($row['role'] ?? ''));
        $summary = trim((string) ($row['summary'] ?? ''));
        if (mb_strlen($role) > 180) {
            $role = mb_substr($role, 0, 180);
        }
        if (mb_strlen($summary) > 255) {
            $summary = mb_substr($summary, 0, 255);
        }
        $seen[$memberId] = true;
        $out[] = [
            'member_id' => $memberId,
            'role' => $role,
            'summary' => $summary,
        ];
    }
    return $out;
}

/**
 * @param list<array{member_id?:int|string,role?:string,summary?:string}> $rows
 */
function ad_portfolio_team_roles_json(array $rows): string
{
    $clean = ad_portfolio_parse_team_roles(json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]');
    return json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]';
}

/**
 * Build team_roles from legacy member_id / member_summary when JSON is empty.
 *
 * @param array<string, mixed> $item
 * @return list<array{member_id:int,role:string,summary:string}>
 */
function ad_portfolio_resolve_team_roles(array $item): array
{
    $roles = ad_portfolio_parse_team_roles(isset($item['team_roles']) ? (string) $item['team_roles'] : '');
    if ($roles) {
        return $roles;
    }
    $memberId = (int) ($item['member_id'] ?? 0);
    if ($memberId <= 0) {
        return [];
    }
    return [[
        'member_id' => $memberId,
        'role' => '',
        'summary' => trim((string) ($item['member_summary'] ?? '')),
    ]];
}

/**
 * @return array<int, array{id:int,name:string,photo:string,role:string}>
 */
function ad_portfolio_team_member_map(): array
{
    static $map = null;
    if ($map !== null) {
        return $map;
    }
    $map = [];
    try {
        try {
            $rows = ad_db()->query(
                'SELECT id, name, photo, role, slug FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
            )->fetchAll();
        } catch (Throwable $e) {
            $rows = ad_db()->query(
                'SELECT id, name, photo, role FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
            )->fetchAll();
        }
        foreach ($rows as $row) {
            $id = (int) ($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $map[$id] = [
                'id' => $id,
                'name' => (string) ($row['name'] ?? ''),
                'photo' => (string) ($row['photo'] ?? ''),
                'role' => (string) ($row['role'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
            ];
        }
    } catch (Throwable $e) {
        $map = [];
    }
    return $map;
}

/**
 * @param list<array{member_id:int,role:string,summary:string}> $roles
 * @return list<array{member_id:int,role:string,summary:string,name:string,photo:string,member_href:string}>
 */
function ad_portfolio_enrich_team_roles(array $roles): array
{
    $map = ad_portfolio_team_member_map();
    $out = [];
    foreach ($roles as $row) {
        $id = (int) ($row['member_id'] ?? 0);
        if ($id <= 0 || !isset($map[$id])) {
            continue;
        }
        $memberSlug = trim((string) ($map[$id]['slug'] ?? ''));
        $out[] = [
            'member_id' => $id,
            'name' => $map[$id]['name'],
            'photo' => $map[$id]['photo'],
            'role' => trim((string) ($row['role'] ?? '')),
            'summary' => trim((string) ($row['summary'] ?? '')),
            'member_href' => $memberSlug !== ''
                ? ('member.html?slug=' . rawurlencode($memberSlug))
                : ('member.html?id=' . $id),
        ];
    }
    return $out;
}

/**
 * @param array<string, mixed> $item
 * @param int $memberId
 * @return array{role:string,summary:string}|null
 */
function ad_portfolio_team_entry_for_member(array $item, int $memberId): ?array
{
    if ($memberId <= 0) {
        return null;
    }
    foreach (ad_portfolio_resolve_team_roles($item) as $row) {
        if ((int) $row['member_id'] === $memberId) {
            return [
                'role' => (string) ($row['role'] ?? ''),
                'summary' => (string) ($row['summary'] ?? ''),
            ];
        }
    }
    return null;
}

/**
 * @return list<string>
 */
function ad_portfolio_parse_list(?string $raw): array
{
    $raw = trim((string) $raw);
    if ($raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $out = [];
        foreach ($decoded as $item) {
            $path = trim((string) $item);
            if ($path !== '') {
                $out[] = $path;
            }
        }
        return array_values(array_unique($out));
    }
    $parts = preg_split('/[\r\n,]+/', $raw) ?: [];
    $out = [];
    foreach ($parts as $part) {
        $path = trim((string) $part);
        if ($path !== '') {
            $out[] = $path;
        }
    }
    return array_values(array_unique($out));
}

/**
 * @return list<string>
 */
function ad_portfolio_parse_screenshots(?string $raw): array
{
    return ad_portfolio_parse_list($raw);
}

/**
 * Built-in technology catalog (without custom DB items).
 *
 * @return array<string, array{id:string,label:string,icon:string}>
 */
function ad_portfolio_builtin_technology_catalog(): array
{
    static $catalog = null;
    if ($catalog !== null) {
        return $catalog;
    }
    $base = 'assets/images/website/tecnology-icons/';
    $items = [
        ['id' => 'html', 'label' => 'HTML', 'icon' => $base . 'html.webp'],
        ['id' => 'css', 'label' => 'CSS', 'icon' => $base . 'css.webp'],
        ['id' => 'js', 'label' => 'JS', 'icon' => $base . 'javascript.webp'],
        ['id' => 'django', 'label' => 'Django', 'icon' => $base . 'django.webp'],
        ['id' => 'php', 'label' => 'PHP', 'icon' => $base . 'php.webp'],
        ['id' => 'laravel', 'label' => 'Laravel', 'icon' => $base . 'Laravel.svg.webp'],
        ['id' => 'react-js', 'label' => 'React JS', 'icon' => $base . 'react-js.webp'],
        ['id' => 'flutter', 'label' => 'Flutter', 'icon' => $base . 'flutter.webp'],
        ['id' => 'sqlite', 'label' => 'SQLite', 'icon' => $base . 'sqli-lite.webp'],
        ['id' => 'mysql', 'label' => 'MySQL', 'icon' => $base . 'mysql.webp'],
        ['id' => 'mongodb', 'label' => 'Mongo DB', 'icon' => $base . 'mongodb.webp'],
        ['id' => 'postgresql', 'label' => 'PostgreSQL', 'icon' => $base . 'postgresql.webp'],
        ['id' => 'linux-server', 'label' => 'Linux Server', 'icon' => $base . 'ubunto-server.webp'],
        ['id' => 'docker', 'label' => 'Docker', 'icon' => $base . 'docker.webp'],
        ['id' => 'cpanel', 'label' => 'cPanel', 'icon' => $base . 'cpanel.webp'],
        ['id' => 'rest-api', 'label' => 'REST API', 'icon' => $base . 'rest-api.webp'],
    ];
    $catalog = [];
    foreach ($items as $item) {
        $catalog[$item['id']] = $item;
    }
    return $catalog;
}

/**
 * Full selectable technologies (built-in + custom).
 *
 * @return array<string, array{id:string,label:string,icon:string}>
 */
function ad_portfolio_technology_catalog(): array
{
    $catalog = ad_portfolio_builtin_technology_catalog();
    foreach (ad_portfolio_custom_technologies() as $item) {
        $catalog[$item['id']] = $item;
    }
    return $catalog;
}

/**
 * Map free-text / legacy labels to catalog ids.
 */
function ad_portfolio_technology_alias_map(): array
{
    return [
        'html' => 'html',
        'css' => 'css',
        'js' => 'js',
        'javascript' => 'js',
        'django' => 'django',
        'php' => 'php',
        'laravel' => 'laravel',
        'react' => 'react-js',
        'reactjs' => 'react-js',
        'react js' => 'react-js',
        'react-js' => 'react-js',
        'flutter' => 'flutter',
        'sqlite' => 'sqlite',
        'sqllite' => 'sqlite',
        'sql lite' => 'sqlite',
        'mysql' => 'mysql',
        'my sql' => 'mysql',
        'mongodb' => 'mongodb',
        'mongo' => 'mongodb',
        'mongo db' => 'mongodb',
        'postgresql' => 'postgresql',
        'postgres' => 'postgresql',
        'postgersql' => 'postgresql',
        'linux' => 'linux-server',
        'linux server' => 'linux-server',
        'ubuntu' => 'linux-server',
        'ubuntu server' => 'linux-server',
        'docker' => 'docker',
        'cpanel' => 'cpanel',
        'rest' => 'rest-api',
        'rest api' => 'rest-api',
        'rest-api' => 'rest-api',
    ];
}

/**
 * @return list<string> catalog ids
 */
function ad_portfolio_parse_technologies(?string $raw): array
{
    $parts = ad_portfolio_parse_list($raw);
    if (!$parts) {
        return [];
    }
    $catalog = ad_portfolio_technology_catalog();
    $aliases = ad_portfolio_technology_alias_map();
    $out = [];
    $seen = [];
    foreach ($parts as $part) {
        $key = strtolower(trim((string) $part));
        $key = preg_replace('/\s+/', ' ', $key) ?? $key;
        $id = $aliases[$key] ?? null;
        if ($id === null && isset($catalog[$key])) {
            $id = $key;
        }
        // allow custom slugs already in catalog
        if ($id === null) {
            foreach ($catalog as $cid => $meta) {
                if (mb_strtolower((string) ($meta['label'] ?? ''), 'UTF-8') === $key) {
                    $id = $cid;
                    break;
                }
            }
        }
        if ($id === null || !isset($catalog[$id]) || isset($seen[$id])) {
            continue;
        }
        $seen[$id] = true;
        $out[] = $id;
    }
    return $out;
}

/**
 * @param list<string> $ids
 * @return list<array{id:string,label:string,icon:string}>
 */
function ad_portfolio_enrich_technologies(array $ids): array
{
    $catalog = ad_portfolio_technology_catalog();
    $out = [];
    foreach ($ids as $id) {
        if (isset($catalog[$id])) {
            $out[] = $catalog[$id];
        }
    }
    return $out;
}

function ad_portfolio_screenshots_json(array $paths): string
{
    $clean = [];
    foreach ($paths as $path) {
        $path = trim((string) $path);
        if ($path !== '') {
            $clean[] = $path;
        }
    }
    return json_encode(array_values(array_unique($clean)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '[]';
}

/**
 * Normalize a portfolio row for API responses.
 *
 * @param array<string, mixed> $item
 * @return array<string, mixed>
 */
function ad_portfolio_normalize_item(array $item): array
{
    $item['slug'] = trim((string) ($item['slug'] ?? ''));
    $item['meta_title'] = trim((string) ($item['meta_title'] ?? ''));
    $item['meta_description'] = trim((string) ($item['meta_description'] ?? ''));
    $item['meta_keywords'] = trim((string) ($item['meta_keywords'] ?? ''));
    $item['show_price'] = (int) ($item['show_price'] ?? 0) === 1;
    if (!$item['show_price'] || trim((string) ($item['price'] ?? '')) === '') {
        $item['price'] = '';
        $item['show_price'] = false;
    }
    $shotPaths = ad_portfolio_parse_screenshots(
        isset($item['screenshots']) ? (string) $item['screenshots'] : ''
    );
    if (!function_exists('ad_media_attach_alts_to_paths')) {
        require_once __DIR__ . '/media.php';
    }
    $item['screenshots'] = ad_media_attach_alts_to_paths($shotPaths);
    $coverPath = trim((string) ($item['cover'] ?? ''));
    $item['cover_alt'] = $coverPath !== '' ? ad_media_alt($coverPath) : '';
    $techIds = ad_portfolio_parse_technologies(
        isset($item['technologies']) ? (string) $item['technologies'] : ''
    );
    $item['technologies'] = ad_portfolio_enrich_technologies($techIds);
    $serviceIds = ad_portfolio_parse_provided_services(
        isset($item['provided_services']) ? (string) $item['provided_services'] : ''
    );
    $item['provided_services'] = ad_portfolio_enrich_provided_services($serviceIds);
    $uploaded = trim((string) ($item['uploaded_at'] ?? ''));
    if ($uploaded === '' && !empty($item['created_at'])) {
        $uploaded = substr((string) $item['created_at'], 0, 10);
    }
    $item['uploaded_at'] = $uploaded;
    $item['client_name'] = (string) ($item['client_name'] ?? '');
    $item['delivery_date'] = (string) ($item['delivery_date'] ?? '');
    $item['executor'] = (string) ($item['executor'] ?? '');
    $item['member_summary'] = trim((string) ($item['member_summary'] ?? ''));
    if (isset($item['member_id'])) {
        $item['member_id'] = $item['member_id'] !== null && $item['member_id'] !== ''
            ? (int) $item['member_id']
            : null;
    }
    $team = ad_portfolio_enrich_team_roles(ad_portfolio_resolve_team_roles($item));
    $item['team'] = $team;
    if ($team) {
        $item['member_id'] = (int) $team[0]['member_id'];
        if ($item['member_summary'] === '' && trim((string) ($team[0]['summary'] ?? '')) !== '') {
            $item['member_summary'] = (string) $team[0]['summary'];
        }
        if (trim($item['executor']) === '') {
            $names = [];
            foreach ($team as $person) {
                $label = trim((string) ($person['name'] ?? ''));
                $role = trim((string) ($person['role'] ?? ''));
                if ($label === '') {
                    continue;
                }
                $names[] = $role !== '' ? ($label . ' — ' . $role) : $label;
            }
            $item['executor'] = implode('، ', $names);
        }
    }
    return $item;
}
