<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/media.php';

header('Content-Type: application/json; charset=utf-8');

if (!ad_is_logged_in() || ad_user_role() !== 'admin') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'لطفاً دوباره وارد پنل مدیریت شوید.'], JSON_UNESCAPED_UNICODE);
    exit;
}
ad_media_ensure_schema();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!ad_csrf_check($_POST['csrf'] ?? null)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'نشست نامعتبر است. صفحه را رفرش کنید.'], JSON_UNESCAPED_UNICODE);
    exit;
}

function ad_video_chunk_base_dir(): string
{
    $dir = rtrim(sys_get_temp_dir(), '/\\') . '/ana-dental-video-chunks';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('ساخت پوشه موقت آپلود ممکن نشد.');
    }
    return $dir;
}

function ad_video_chunk_cleanup(string $uploadId): void
{
    $base = ad_video_chunk_base_dir() . '/' . $uploadId;
    if (!is_dir($base)) {
        return;
    }
    foreach (glob($base . '/part_*') ?: [] as $part) {
        @unlink($part);
    }
    @rmdir($base);
}

/**
 * @return array{ok:bool,url?:string,path?:string,message?:string,done?:bool}
 */
function ad_video_handle_chunk_upload(string $title): array
{
    $uploadId = (string) ($_POST['upload_id'] ?? '');
    $chunkIndex = (int) ($_POST['chunk_index'] ?? -1);
    $totalChunks = (int) ($_POST['total_chunks'] ?? 0);
    $origName = basename((string) ($_POST['filename'] ?? 'video.mp4'));

    if (!preg_match('/^[a-f0-9]{32}$/', $uploadId)) {
        throw new RuntimeException('شناسه آپلود نامعتبر است.');
    }
    if ($totalChunks < 1 || $totalChunks > 80 || $chunkIndex < 0 || $chunkIndex >= $totalChunks) {
        throw new RuntimeException('پارامترهای تکه‌آپلود نامعتبر است.');
    }
    if (empty($_FILES['video_file']['tmp_name']) || ($_FILES['video_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('دریافت تکه فایل ناموفق بود.');
    }
    $partSize = (int) ($_FILES['video_file']['size'] ?? 0);
    if ($partSize <= 0 || $partSize > 6 * 1024 * 1024) {
        throw new RuntimeException('اندازه تکه فایل نامعتبر است.');
    }

    $chunkDir = ad_video_chunk_base_dir() . '/' . $uploadId;
    if (!is_dir($chunkDir) && !mkdir($chunkDir, 0700, true) && !is_dir($chunkDir)) {
        throw new RuntimeException('ساخت پوشه موقت ممکن نشد.');
    }

    $partPath = $chunkDir . '/part_' . str_pad((string) $chunkIndex, 5, '0', STR_PAD_LEFT);
    if (!move_uploaded_file((string) $_FILES['video_file']['tmp_name'], $partPath)) {
        throw new RuntimeException('ذخیره تکه فایل ممکن نشد.');
    }

    if ($chunkIndex + 1 < $totalChunks) {
        return [
            'ok' => true,
            'done' => false,
            'message' => 'تکه ' . ($chunkIndex + 1) . ' از ' . $totalChunks,
        ];
    }

    $merged = $chunkDir . '/merged.bin';
    $out = fopen($merged, 'wb');
    if ($out === false) {
        ad_video_chunk_cleanup($uploadId);
        throw new RuntimeException('ادغام فایل ممکن نشد.');
    }
    for ($i = 0; $i < $totalChunks; $i++) {
        $p = $chunkDir . '/part_' . str_pad((string) $i, 5, '0', STR_PAD_LEFT);
        if (!is_file($p)) {
            fclose($out);
            ad_video_chunk_cleanup($uploadId);
            throw new RuntimeException('تکه‌های فایل کامل نیست.');
        }
        $in = fopen($p, 'rb');
        if ($in === false) {
            fclose($out);
            ad_video_chunk_cleanup($uploadId);
            throw new RuntimeException('خواندن تکه فایل ممکن نشد.');
        }
        stream_copy_to_stream($in, $out);
        fclose($in);
    }
    fclose($out);

    try {
        $path = ad_save_video_from_local_path($merged, $origName, 'videos');
        if ($path === '') {
            throw new RuntimeException('آپلود ویدیو انجام نشد.');
        }
        ad_media_register($path, $title);
        $url = '/' . ltrim(str_replace('\\', '/', $path), '/');
        return [
            'ok' => true,
            'done' => true,
            'url' => $url,
            'path' => $path,
            'message' => 'ویدیو با موفقیت بارگذاری شد.',
        ];
    } finally {
        ad_video_chunk_cleanup($uploadId);
    }
}

try {
    $title = trim((string) ($_POST['title'] ?? ''));
    if (!empty($_POST['chunk_mode'])) {
        echo json_encode(ad_video_handle_chunk_upload($title), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (empty($_FILES['video_file']['name'])) {
        throw new RuntimeException('فایل ویدیو انتخاب نشده است.');
    }
    $path = ad_media_upload_video($_FILES['video_file'], 'videos', $title);
    if ($path === '') {
        throw new RuntimeException('آپلود ویدیو انجام نشد.');
    }
    $url = '/' . ltrim(str_replace('\\', '/', $path), '/');
    echo json_encode([
        'ok' => true,
        'url' => $url,
        'path' => $path,
        'message' => 'ویدیو با موفقیت بارگذاری شد.',
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
