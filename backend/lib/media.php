<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function ad_media_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `media_items` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

/**
 * Absolute filesystem path for a stored media URL/path, or empty if outside upload dir.
 */
function ad_media_absolute_path(string $path): string
{
    $path = ltrim(str_replace('\\', '/', trim($path)), '/');
    if ($path === '' || str_contains($path, '..')) {
        return '';
    }
    $config = ad_config();
    $uploadRoot = realpath(rtrim($config['upload_dir'], '/\\'));
    if ($uploadRoot === false) {
        return '';
    }
    $prefix = trim(str_replace('\\', '/', (string) $config['upload_url_prefix']), '/');
    $relative = $path;
    if ($prefix !== '' && str_starts_with($path, $prefix . '/')) {
        $relative = substr($path, strlen($prefix) + 1);
    } elseif ($prefix !== '' && $path === $prefix) {
        $relative = '';
    }
    if ($relative === '') {
        return '';
    }
    $full = $uploadRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    $real = realpath($full);
    if ($real === false) {
        // file may not exist yet after move; still constrain parent
        $parent = realpath(dirname($full));
        if ($parent === false || !str_starts_with($parent, $uploadRoot)) {
            return '';
        }
        return $full;
    }
    if (!str_starts_with($real, $uploadRoot)) {
        return '';
    }
    return $real;
}

/**
 * @param array<string, mixed>|null $fileMeta from $_FILES entry
 */
function ad_media_register(string $path, string $alt = '', ?array $fileMeta = null): void
{
    ad_media_ensure_schema();
    $path = trim(str_replace('\\', '/', $path));
    if ($path === '') {
        return;
    }
    $alt = trim($alt);
    if (mb_strlen($alt) > 255) {
        $alt = mb_substr($alt, 0, 255);
    }
    $filename = basename($path);
    $mime = '';
    $filesize = 0;
    $abs = ad_media_absolute_path($path);
    if ($abs !== '' && is_file($abs)) {
        $filesize = (int) filesize($abs);
        if (class_exists('finfo')) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $detected = $finfo->file($abs);
            if (is_string($detected)) {
                $mime = $detected;
            }
        }
    }
    if ($fileMeta) {
        if ($mime === '' && !empty($fileMeta['type'])) {
            $mime = (string) $fileMeta['type'];
        }
        if ($filesize <= 0 && !empty($fileMeta['size'])) {
            $filesize = (int) $fileMeta['size'];
        }
        if (!empty($fileMeta['name'])) {
            $filename = basename((string) $fileMeta['name']);
        }
    }

    $db = ad_db();
    $existing = $db->prepare('SELECT id, alt_text FROM media_items WHERE path = ? LIMIT 1');
    $existing->execute([$path]);
    $row = $existing->fetch();
    if ($row) {
        $keepAlt = $alt !== '' ? $alt : (string) ($row['alt_text'] ?? '');
        $stmt = $db->prepare(
            'UPDATE media_items SET filename = ?, alt_text = ?, mime = IF(? = \'\', mime, ?), filesize = IF(? = 0, filesize, ?) WHERE id = ?'
        );
        $stmt->execute([$filename, $keepAlt, $mime, $mime, $filesize, $filesize, (int) $row['id']]);
        return;
    }
    $stmt = $db->prepare(
        'INSERT INTO media_items (path, filename, alt_text, mime, filesize) VALUES (?,?,?,?,?)'
    );
    $stmt->execute([$path, $filename, $alt, $mime, $filesize]);
}

function ad_media_set_alt(string $path, string $alt): void
{
    $path = trim(str_replace('\\', '/', $path));
    if ($path === '') {
        return;
    }
    ad_media_register($path, $alt);
}

function ad_media_upload(array $file, string $subdir = '', string $alt = ''): string
{
    $path = ad_upload_image($file, $subdir);
    if ($path !== '') {
        ad_media_register($path, $alt, $file);
    }
    return $path;
}

function ad_media_upload_video(array $file, string $subdir = 'videos', string $alt = ''): string
{
    $path = ad_upload_video($file, $subdir);
    if ($path !== '') {
        ad_media_register($path, $alt, $file);
    }
    return $path;
}

function ad_media_alt(string $path): string
{
    $path = trim(str_replace('\\', '/', $path));
    if ($path === '') {
        return '';
    }
    ad_media_ensure_schema();
    static $cache = [];
    if (array_key_exists($path, $cache)) {
        return $cache[$path];
    }
    $stmt = ad_db()->prepare('SELECT alt_text FROM media_items WHERE path = ? LIMIT 1');
    $stmt->execute([$path]);
    $alt = trim((string) ($stmt->fetchColumn() ?: ''));
    $cache[$path] = $alt;
    return $alt;
}

/**
 * @param list<string> $paths
 * @return array<string, string>
 */
function ad_media_alts_map(array $paths): array
{
    ad_media_ensure_schema();
    $clean = [];
    foreach ($paths as $path) {
        $path = trim(str_replace('\\', '/', (string) $path));
        if ($path !== '') {
            $clean[$path] = true;
        }
    }
    if (!$clean) {
        return [];
    }
    $keys = array_keys($clean);
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    $stmt = ad_db()->prepare("SELECT path, alt_text FROM media_items WHERE path IN ($placeholders)");
    $stmt->execute($keys);
    $map = array_fill_keys($keys, '');
    foreach ($stmt->fetchAll() as $row) {
        $map[(string) $row['path']] = trim((string) ($row['alt_text'] ?? ''));
    }
    return $map;
}

/**
 * @return array<string, mixed>|null
 */
function ad_media_get(int $id): ?array
{
    ad_media_ensure_schema();
    $stmt = ad_db()->prepare('SELECT * FROM media_items WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * @return list<array<string, mixed>>
 */
function ad_media_list(int $limit = 200, int $offset = 0): array
{
    ad_media_ensure_schema();
    $limit = max(1, min(500, $limit));
    $offset = max(0, $offset);
    $stmt = ad_db()->prepare(
        'SELECT * FROM media_items ORDER BY created_at DESC, id DESC LIMIT ' . (int) $limit . ' OFFSET ' . (int) $offset
    );
    $stmt->execute();
    return $stmt->fetchAll();
}

function ad_media_count(): int
{
    ad_media_ensure_schema();
    return (int) ad_db()->query('SELECT COUNT(*) FROM media_items')->fetchColumn();
}

function ad_media_delete(int $id): bool
{
    ad_media_ensure_schema();
    $row = ad_media_get($id);
    if (!$row) {
        return false;
    }
    $path = (string) ($row['path'] ?? '');
    $abs = ad_media_absolute_path($path);
    if ($abs !== '' && is_file($abs)) {
        @unlink($abs);
    }
    $stmt = ad_db()->prepare('DELETE FROM media_items WHERE id = ?');
    $stmt->execute([$id]);
    return true;
}

/**
 * Import files already on disk under upload dir into the library.
 */
function ad_media_sync_uploads(): int
{
    ad_media_ensure_schema();
    $config = ad_config();
    $uploadRoot = realpath(rtrim($config['upload_dir'], '/\\'));
    if ($uploadRoot === false || !is_dir($uploadRoot)) {
        return 0;
    }
    $prefix = rtrim(str_replace('\\', '/', (string) $config['upload_url_prefix']), '/');
    $added = 0;
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($uploadRoot, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $fileInfo) {
        if (!$fileInfo instanceof SplFileInfo || !$fileInfo->isFile()) {
            continue;
        }
        $ext = strtolower($fileInfo->getExtension());
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
            continue;
        }
        $real = $fileInfo->getRealPath();
        if ($real === false || !str_starts_with($real, $uploadRoot)) {
            continue;
        }
        $relative = ltrim(str_replace('\\', '/', substr($real, strlen($uploadRoot))), '/');
        $path = $prefix !== '' ? ($prefix . '/' . $relative) : $relative;
        $exists = ad_db()->prepare('SELECT id FROM media_items WHERE path = ? LIMIT 1');
        $exists->execute([$path]);
        if ($exists->fetch()) {
            continue;
        }
        ad_media_register($path, '');
        $added++;
    }
    return $added;
}

/**
 * @return list<array{path:string,alt:string}>
 */
function ad_media_attach_alts_to_paths(array $paths): array
{
    $clean = [];
    foreach ($paths as $path) {
        $path = trim(str_replace('\\', '/', (string) $path));
        if ($path !== '') {
            $clean[] = $path;
        }
    }
    $alts = ad_media_alts_map($clean);
    $out = [];
    foreach ($clean as $path) {
        $out[] = [
            'path' => $path,
            'alt' => $alts[$path] ?? '',
        ];
    }
    return $out;
}

/**
 * @param array<string, mixed> $row
 * @return array<string, mixed>
 */
function ad_media_with_cover_alt(array $row): array
{
    $cover = trim((string) ($row['cover'] ?? ''));
    $row['cover_alt'] = $cover !== '' ? ad_media_alt($cover) : '';
    return $row;
}
