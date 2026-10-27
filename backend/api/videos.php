<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/helpers.php';
require_once dirname(__DIR__) . '/lib/videos.php';

ad_cors_public();
ad_videos_ensure_schema();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    ad_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

ad_json([
    'ok' => true,
    'items' => ad_videos_list_public(),
]);
