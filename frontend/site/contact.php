<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

dental_render('contact', [
    'pageTitle' => 'تماس با ما | ' . dental_site_name(),
    'metaDescription' => 'فرم تماس و رزرو نوبت',
    'canonicalPath' => '/contact.php',
]);
