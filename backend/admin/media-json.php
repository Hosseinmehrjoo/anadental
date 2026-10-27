<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/media.php';
ad_require_capability('media');
ad_media_ensure_schema();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

try {
    $rows = ad_media_list(400);
    $items = [];
    foreach ($rows as $row) {
        $items[] = [
            'id' => (int) ($row['id'] ?? 0),
            'path' => (string) ($row['path'] ?? ''),
            'filename' => (string) ($row['filename'] ?? ''),
            'alt_text' => (string) ($row['alt_text'] ?? ''),
            'mime' => (string) ($row['mime'] ?? ''),
            'filesize' => (int) ($row['filesize'] ?? 0),
        ];
    }
    echo json_encode(['ok' => true, 'data' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'خطای سرور'], JSON_UNESCAPED_UNICODE);
}
