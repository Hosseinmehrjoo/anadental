<?php
/** @var string $pageTitle */
/** @var string $metaDescription */
/** @var string $canonicalPath */
$siteName = dental_site_name();
$canonical = $canonicalPath !== '' ? $canonicalPath : '';
?>
<!doctype html>
<html dir="rtl" lang="fa-IR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#3090B6">
  <meta name="api-base" content="/backend/api">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <title><?= dental_e($pageTitle) ?></title>
  <?php if ($metaDescription !== ''): ?>
  <meta name="description" content="<?= dental_e($metaDescription) ?>">
  <?php endif; ?>
  <?php if ($canonical !== ''): ?>
  <link rel="canonical" href="<?= dental_e($canonical) ?>">
  <?php endif; ?>
  <?php require __DIR__ . '/font-faces.inc.php'; ?>
  <link rel="preload" href="/assets/theme/assets/style-rtl.min.css?ver=1.2.60" as="style">
  <link rel="stylesheet" href="/assets/theme/assets/style-rtl.min.css?ver=1.2.60">
  <link rel="stylesheet" href="/assets/bundles/ds-bundle-css-86786fe9add48d8e.css?ver=20261021g" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/bundles/ds-bundle-css-86786fe9add48d8e.css?ver=20261021g"></noscript>
  <link rel="stylesheet" href="/assets/theme/style-rtl.css?ver=1.2.59" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/theme/style-rtl.css?ver=1.2.59"></noscript>
  <link rel="stylesheet" href="/assets/bundles/ds-bundle-css-a345d3fbea3fd57d.css?ver=20261021g" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/assets/bundles/ds-bundle-css-a345d3fbea3fd57d.css?ver=20261021g"></noscript>
  <link rel="stylesheet" href="/assets/css/site-pages.css?ver=20261025a">
  <link rel="stylesheet" href="/assets/css/ana-enhancements.css?ver=20261021i">
  <link rel="icon" href="/assets/media/2025/09/cropped-logo-3-32x32.webp" sizes="32x32">
</head>
<body class="dental-inner-page">
<?php readfile(__DIR__ . '/header.fragment.html'); ?>
<main class="dental-page mainView" id="main-content">
