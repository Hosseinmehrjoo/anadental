<?php

function ad_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $path = dirname(__DIR__) . '/config.php';
    if (!is_file($path)) {
        throw new RuntimeException('فایل config.php یافت نشد. ابتدا نصب را انجام دهید.');
    }
    $config = require $path;
    $envSiteUrl = rtrim((string) (getenv('SITE_URL') ?: ''), '/');
    if ($envSiteUrl !== '') {
        $config['site_url'] = $envSiteUrl;
    } elseif (!empty($config['site_url']) && preg_match('#^https?://(127\.0\.0\.1|localhost)(:\d+)?$#i', rtrim((string) $config['site_url'], '/'))) {
        $config['site_url'] = '';
    }
    if (!empty($config['timezone'])) {
        date_default_timezone_set($config['timezone']);
    }
    $backendRoot = dirname(__DIR__);
    $projectRoot = dirname($backendRoot);
    // Docker: document root contains backend/ ; local monorepo: frontend/site is public root
    if (!empty($config['site_root'])) {
        $siteRoot = rtrim(str_replace('\\', '/', (string) $config['site_root']), '/');
    } elseif (is_dir($projectRoot . '/frontend/site')) {
        $siteRoot = $projectRoot . '/frontend/site';
    } else {
        $siteRoot = $projectRoot;
    }
    if (empty($config['upload_url_prefix'])) {
        $config['upload_url_prefix'] = 'assets/images/uploads/';
    }
    if (empty($config['upload_dir'])) {
        $config['upload_dir'] = $siteRoot . '/assets/images/uploads/';
    }
    $config['site_root'] = $siteRoot;
    return $config;
}

function ad_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = ad_config();
    $port = (int) ($c['db_port'] ?? 3306);
    if ($port < 1) {
        $port = 3306;
    }
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $c['db_host'],
        $port,
        $c['db_name'],
        $c['db_charset'] ?? 'utf8mb4'
    );
    $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
