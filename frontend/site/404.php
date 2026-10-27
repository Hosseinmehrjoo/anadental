<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
http_response_code(404);
dental_render('404', [
    'pageTitle' => 'یافت نشد | ' . dental_site_name(),
    'metaDescription' => '',
    'canonicalPath' => '',
]);
