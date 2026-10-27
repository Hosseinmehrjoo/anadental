<?php
/** @var string $pageTitle */
ad_users_ensure_schema();
$user = ad_current_user();
$admin = $user; // layout BC
$flash = ad_flash_get();
$currentScript = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');
$isLogin = $currentScript === 'login.php';
$userRole = $user['role'] ?? '';

// پنل سبک‌شده برای سایت دندانپزشکی — ماژول‌های آژانسی از منو حذف شده‌اند
$allMenuItems = [
    ['href' => 'index.php', 'label' => 'پیشخوان', 'icon' => '◈', 'match' => ['index.php'], 'cap' => 'dashboard'],
    ['href' => 'media.php', 'label' => 'رسانه', 'icon' => '⧉', 'match' => ['media.php'], 'cap' => 'media'],
    [
        'href' => 'blog.php',
        'label' => 'نوشته‌ها',
        'icon' => '☰',
        'match' => ['blog.php', 'blog-categories.php', 'comments.php'],
        'cap' => 'blog',
        'submenu' => [
            ['href' => 'blog.php', 'label' => 'همه نوشته‌ها', 'match' => ['blog.php']],
            ['href' => 'blog.php?new=1', 'label' => 'افزودن نوشته', 'match' => []],
            ['href' => 'blog-categories.php', 'label' => 'دسته‌بندی‌ها', 'match' => ['blog-categories.php']],
            ['href' => 'comments.php', 'label' => 'نظرات', 'match' => ['comments.php']],
        ],
    ],
    ['href' => 'videos.php', 'label' => 'ویدیو رضایت', 'icon' => '▶', 'match' => ['videos.php'], 'roles' => ['admin']],
    ['href' => 'messages.php', 'label' => 'پیام‌ها', 'icon' => '✉', 'match' => ['messages.php'], 'cap' => 'messages', 'roles' => ['admin']],
    ['href' => 'redirects.php', 'label' => 'ریدایرکت‌ها', 'icon' => '↳', 'match' => ['redirects.php'], 'roles' => ['admin']],
    ['href' => 'users.php', 'label' => 'کاربران', 'icon' => '☺', 'match' => ['users.php'], 'cap' => 'users', 'roles' => ['admin']],
    ['href' => 'settings.php', 'label' => 'تنظیمات', 'icon' => '⚙', 'match' => ['settings.php'], 'roles' => ['admin']],
];

$menuItems = [];
foreach ($allMenuItems as $item) {
    if (!empty($item['roles']) && !in_array($userRole, $item['roles'], true)) {
        continue;
    }
    if (!empty($item['cap']) && $userRole !== '' && !ad_role_can($userRole, (string) $item['cap'])) {
        continue;
    }
    $menuItems[] = $item;
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= ad_e($pageTitle ?? 'پنل ادمین') ?> ‹ مدیریت سایت</title>
  <link rel="stylesheet" href="/backend/admin/wp-admin.css?ver=20261017users" />
  <style>
    /* critical fallback if cached CSS fails */
    body.wp-admin{margin:0;background:#f0f0f1;font-family:Tahoma,sans-serif;font-size:13px;color:#1d2327}
    .wpadminbar{position:fixed;inset-inline:0;top:0;z-index:99999;height:32px;background:#1d2327;color:#fff;display:flex;align-items:stretch;justify-content:space-between}
    .wpadminbar a{color:#fff!important;text-decoration:none!important;display:inline-flex;align-items:center;padding:0 10px}
    .admin-shell{display:flex;min-height:100vh;padding-top:32px}
    .adminmenumain{position:fixed;top:32px;inset-inline-start:0;bottom:0;width:160px;background:#1d2327;z-index:9990}
    .adminmenu{list-style:none;margin:0;padding:0}
    .adminmenu a{display:flex;gap:8px;align-items:center;padding:10px 12px;color:#f0f0f1!important;text-decoration:none!important;border-inline-start:4px solid transparent}
    .adminmenu a.is-active{background:#2271b1;border-inline-start-color:#72aee6}
    .adminmenu .wp-submenu{display:none;list-style:none;margin:0;padding:0 0 8px;background:#2c3338}
    .adminmenu .wp-has-current-submenu>.wp-submenu,.adminmenu .wp-menu-open>.wp-submenu,.adminmenu li.wp-has-submenu:hover>.wp-submenu{display:block}
    .adminmenu .wp-submenu a{padding:6px 12px 6px 36px;font-size:13px;border-inline-start:0;color:#b4b9be!important;font-weight:400}
    .adminmenu .wp-submenu a.is-active{background:transparent;color:#fff!important;font-weight:600}
    .wpcontent{flex:1;margin-inline-start:160px;min-width:0}
    .wrap{margin:10px 20px 20px}
    .welcome-panel,.postbox,.card{background:#fff;border:1px solid #c3c4c7;box-shadow:0 1px 1px rgba(0,0,0,.04);margin-bottom:20px}
    .welcome-panel{padding:20px 24px}
    .postbox-header,.card>h2{margin:0;padding:8px 12px;border-bottom:1px solid #c3c4c7;font-size:14px}
    .inside,.card-body{padding:12px}
    .dashboard-widgets{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
    .btn{display:inline-block;background:#2271b1;color:#fff!important;border:1px solid #135e96;border-radius:3px;padding:0 12px;min-height:30px;line-height:28px;text-decoration:none!important;cursor:pointer}
    .btn-secondary{background:#f6f7f7;color:#2c3338!important;border-color:#c3c4c7}
    .at-a-glance-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px}
    .at-a-glance-list .count{font-size:18px;font-weight:600;color:#2271b1}
    body.login-page{background:#f0f0f1}
    .login-wrap{max-width:320px;margin:8% auto 0}
    .login-box{background:#fff;border:1px solid #c3c4c7;padding:24px}
    @media(max-width:782px){.adminmenumain{width:36px}.adminmenu .menu-label{display:none}.wpcontent{margin-inline-start:36px}.dashboard-widgets{grid-template-columns:1fr}}
  </style>
</head>
<body class="<?= $isLogin ? 'login-page' : 'wp-admin' ?>">
<?php if ($user && !$isLogin): ?>
<div class="wpadminbar" role="navigation" aria-label="نوار بالای مدیریت">
  <a class="wpadminbar__brand" href="index.php">پنل مدیریت</a>
  <div class="wpadminbar__end">
    <a href="/" target="_blank" rel="noopener">مشاهده سایت</a>
    <a class="wpadminbar__user" href="logout.php">سلام، <?= ad_e($user['display_name'] ?: $user['username']) ?> · <?= ad_e($user['role_label']) ?> ▾</a>
  </div>
</div>

<div class="admin-shell">
  <div class="adminmenumain" id="adminmenumain" role="navigation" aria-label="منوی اصلی">
    <div class="adminmenuback"></div>
    <ul class="adminmenu" id="adminmenu">
      <?php foreach ($menuItems as $item): ?>
        <?php
        $active = in_array($currentScript, $item['match'], true);
        $hasSub = !empty($item['submenu']) && is_array($item['submenu']);
        $liClass = [];
        if ($hasSub) {
            $liClass[] = 'wp-has-submenu';
            if ($active) {
                $liClass[] = 'wp-has-current-submenu';
                $liClass[] = 'wp-menu-open';
            }
        }
        ?>
        <li<?= $liClass ? ' class="' . ad_e(implode(' ', $liClass)) . '"' : '' ?>>
          <a href="<?= ad_e($item['href']) ?>" class="<?= $active ? 'is-active' : '' ?>">
            <i class="dashicon" aria-hidden="true"><?= ad_e($item['icon']) ?></i>
            <span class="menu-label"><?= ad_e($item['label']) ?></span>
          </a>
          <?php if ($hasSub): ?>
            <ul class="wp-submenu">
              <?php foreach ($item['submenu'] as $sub): ?>
                <?php
                $subActive = !empty($sub['match']) && in_array($currentScript, $sub['match'], true);
                if (($sub['href'] ?? '') === 'blog.php?new=1') {
                    $subActive = $currentScript === 'blog.php' && isset($_GET['new']);
                } elseif (($sub['href'] ?? '') === 'blog.php') {
                    $subActive = $currentScript === 'blog.php' && !isset($_GET['new']) && !isset($_GET['edit']);
                }
                ?>
                <li>
                  <a href="<?= ad_e($sub['href']) ?>" class="<?= $subActive ? 'is-active' : '' ?>"><?= ad_e($sub['label']) ?></a>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </li>
      <?php endforeach; ?>
      <li class="menu-sep" aria-hidden="true"></li>
      <li>
        <a href="logout.php">
          <i class="dashicon" aria-hidden="true">⏻</i>
          <span class="menu-label">خروج</span>
        </a>
      </li>
    </ul>
  </div>

  <div class="wpcontent" id="wpcontent">
    <div class="wrap">
<?php else: ?>
    <div class="wrap">
<?php endif; ?>
<?php if ($flash): ?>
  <div class="flash flash-<?= ad_e($flash['type'] === 'ok' ? 'ok' : 'err') ?>"><?= ad_e($flash['message']) ?></div>
<?php endif; ?>
