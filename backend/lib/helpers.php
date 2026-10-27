<?php

function ad_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ad_cors_public(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($origin !== '') {
        $parts = parse_url($origin);
        $originHost = strtolower((string) ($parts['host'] ?? ''));
        $allowedHosts = ['localhost', '127.0.0.1'];
        if (function_exists('ad_config')) {
            try {
                $cfg = ad_config();
                foreach (($cfg['allowed_origins'] ?? []) as $allowedOrigin) {
                    $p = parse_url((string) $allowedOrigin);
                    if (!empty($p['host'])) {
                        $allowedHosts[] = strtolower((string) $p['host']);
                    }
                }
                if (!empty($cfg['site_url'])) {
                    $p = parse_url((string) $cfg['site_url']);
                    if (!empty($p['host'])) {
                        $allowedHosts[] = strtolower((string) $p['host']);
                    }
                }
            } catch (Throwable $e) {
                // config may be missing during install
            }
        }
        $allowedHosts = array_values(array_unique($allowedHosts));
        $allowed = false;
        if ($originHost !== '' && strcasecmp($originHost, $host) === 0) {
            $allowed = true;
        }
        if (!$allowed && in_array($originHost, $allowedHosts, true)) {
            $allowed = true;
        }
        if ($allowed) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            header('Access-Control-Allow-Credentials: true');
        }
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Simple IP rate limiter for public endpoints.
 */
function ad_rate_limit(string $bucket, int $max, int $windowSeconds): bool
{
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (str_contains((string) $ip, ',')) {
        $ip = trim(explode(',', (string) $ip, 2)[0]);
    }
    $dir = sys_get_temp_dir() . '/ana-dental-rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $key = hash('sha256', $bucket . '|' . $ip);
    $file = $dir . '/' . $key . '.json';
    $now = time();
    $data = ['start' => $now, 'count' => 0];
    if (is_file($file)) {
        $raw = json_decode((string) file_get_contents($file), true);
        if (is_array($raw) && isset($raw['start'], $raw['count'])) {
            $data = $raw;
        }
    }
    if (($now - (int) $data['start']) >= $windowSeconds) {
        $data = ['start' => $now, 'count' => 0];
    }
    $data['count'] = (int) $data['count'] + 1;
    file_put_contents($file, json_encode($data), LOCK_EX);
    return $data['count'] <= $max;
}

function ad_read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function ad_e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function ad_slugify(string $text): string
{
    $text = trim(mb_strtolower($text, 'UTF-8'));
    $text = preg_replace('/[\s_]+/u', '-', $text) ?? $text;
    $text = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $text) ?? $text;
    $text = trim($text, '-');
    if ($text === '') {
        $text = 'post-' . date('YmdHis');
    }
    return mb_substr($text, 0, 200, 'UTF-8');
}

function ad_upload_image(array $file, string $subdir = ''): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return '';
    }
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('خطا در آپلود فایل.');
    }
    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!isset($allowed[$mime])) {
        throw new RuntimeException('فرمت تصویر مجاز نیست (jpg, png, webp, gif).');
    }
    if (($file['size'] ?? 0) > 5 * 1024 * 1024) {
        throw new RuntimeException('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
    }

    $config = ad_config();
    $baseDir = rtrim($config['upload_dir'], '/\\') . '/';
    if ($subdir !== '') {
        $baseDir .= trim($subdir, '/\\') . '/';
    }
    if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true) && !is_dir($baseDir)) {
        throw new RuntimeException('ساخت پوشه آپلود ممکن نشد.');
    }

    $name = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    $dest = $baseDir . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        throw new RuntimeException('ذخیره فایل آپلودشده ممکن نشد.');
    }

    $prefix = rtrim($config['upload_url_prefix'], '/') . '/';
    if ($subdir !== '') {
        $prefix .= trim($subdir, '/') . '/';
    }
    return $prefix . $name;
}

/**
 * Upload a video file into the public uploads tree (subdir e.g. videos).
 */
function ad_upload_video(array $file, string $subdir = 'videos'): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return '';
    }
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        $code = (int) ($file['error'] ?? UPLOAD_ERR_OK);
        if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) {
            throw new RuntimeException('حجم فایل از حد مجاز سرور بیشتر است.');
        }
        throw new RuntimeException('خطا در آپلود فایل ویدیو (کد ' . $code . ').');
    }
    $allowed = [
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
        'video/quicktime' => 'mov',
        'video/x-m4v' => 'm4v',
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $origName = (string) ($file['name'] ?? '');
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if (!is_string($mime) || !isset($allowed[$mime])) {
        $extMap = ['mp4' => 'mp4', 'webm' => 'webm', 'mov' => 'mov', 'm4v' => 'm4v'];
        if ($ext !== '' && isset($extMap[$ext]) && in_array($mime, ['application/octet-stream', 'application/mp4', 'binary/octet-stream'], true)) {
            $mime = $ext === 'webm' ? 'video/webm' : ($ext === 'mov' ? 'video/quicktime' : 'video/mp4');
        }
    }
    if (!is_string($mime) || !isset($allowed[$mime])) {
        throw new RuntimeException('فرمت ویدیو مجاز نیست (mp4, webm, mov).');
    }
    $maxBytes = 200 * 1024 * 1024;
    if (($file['size'] ?? 0) > $maxBytes) {
        throw new RuntimeException('حجم ویدیو نباید بیشتر از ۲۰۰ مگابایت باشد.');
    }

    $config = ad_config();
    $baseDir = rtrim($config['upload_dir'], '/\\') . '/';
    if ($subdir !== '') {
        $baseDir .= trim($subdir, '/\\') . '/';
    }
    if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true) && !is_dir($baseDir)) {
        throw new RuntimeException('ساخت پوشه آپلود ممکن نشد.');
    }

    $name = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    $dest = $baseDir . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        throw new RuntimeException('ذخیره فایل ویدیو ممکن نشد.');
    }

    $prefix = rtrim($config['upload_url_prefix'], '/') . '/';
    if ($subdir !== '') {
        $prefix .= trim($subdir, '/') . '/';
    }
    return $prefix . $name;
}

/**
 * Store an already-local video file (e.g. merged chunks) into the uploads tree.
 */
function ad_save_video_from_local_path(string $srcPath, string $origName, string $subdir = 'videos'): string
{
    if (!is_file($srcPath)) {
        throw new RuntimeException('فایل ویدیو پیدا نشد.');
    }
    $allowed = [
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
        'video/quicktime' => 'mov',
        'video/x-m4v' => 'm4v',
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($srcPath);
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if (!is_string($mime) || !isset($allowed[$mime])) {
        $extMap = ['mp4' => 'mp4', 'webm' => 'webm', 'mov' => 'mov', 'm4v' => 'm4v'];
        if ($ext !== '' && isset($extMap[$ext]) && in_array($mime, ['application/octet-stream', 'application/mp4', 'binary/octet-stream'], true)) {
            $mime = $ext === 'webm' ? 'video/webm' : ($ext === 'mov' ? 'video/quicktime' : 'video/mp4');
        }
    }
    if (!is_string($mime) || !isset($allowed[$mime])) {
        throw new RuntimeException('فرمت ویدیو مجاز نیست (mp4, webm, mov).');
    }
    $size = (int) filesize($srcPath);
    $maxBytes = 200 * 1024 * 1024;
    if ($size > $maxBytes) {
        throw new RuntimeException('حجم ویدیو نباید بیشتر از ۲۰۰ مگابایت باشد.');
    }

    $config = ad_config();
    $baseDir = rtrim($config['upload_dir'], '/\\') . '/';
    if ($subdir !== '') {
        $baseDir .= trim($subdir, '/\\') . '/';
    }
    if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true) && !is_dir($baseDir)) {
        throw new RuntimeException('ساخت پوشه آپلود ممکن نشد.');
    }

    $name = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
    $dest = $baseDir . $name;
    if (!copy($srcPath, $dest)) {
        throw new RuntimeException('ذخیره فایل ویدیو ممکن نشد.');
    }

    $prefix = rtrim($config['upload_url_prefix'], '/') . '/';
    if ($subdir !== '') {
        $prefix .= trim($subdir, '/') . '/';
    }
    return $prefix . $name;
}

function ad_flash_set(string $type, string $message): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function ad_flash_get(): ?array
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    if (empty($_SESSION['flash'])) {
        return null;
    }
    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $flash;
}

function ad_csrf_token(): string
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function ad_csrf_check(?string $token): bool
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    return is_string($token) && isset($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
}
