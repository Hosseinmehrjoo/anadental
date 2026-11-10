<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

dental_render('about', [
    'pageTitle' => 'درباره ما | ' . dental_site_name(),
    'metaDescription' => 'آنادنت؛ مرکز تخصصی کاشت ایمپلنت و خدمات دندانپزشکی در تهران با تجهیزات دیجیتال، تیم مجرب و دو شعبه در جنت‌آباد و پاسداران.',
    'canonicalPath' => '/about.php',
]);
