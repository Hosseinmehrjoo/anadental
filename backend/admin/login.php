<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/users.php';
ad_users_ensure_schema();

if (ad_is_logged_in()) {
    if (ad_role_is_staff(ad_user_role())) {
        header('Location: index.php');
    } else {
        header('Location: ../../account.html');
    }
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        $error = 'نشست نامعتبر است. دوباره تلاش کنید.';
    } else {
        $user = trim((string) ($_POST['username'] ?? ''));
        $pass = (string) ($_POST['password'] ?? '');
        if (ad_login($user, $pass)) {
            if (ad_role_is_staff(ad_user_role())) {
                header('Location: index.php');
            } else {
                header('Location: ../../account.html');
            }
            exit;
        }
        $error = 'نام کاربری یا رمز عبور اشتباه است.';
    }
}

$pageTitle = 'ورود';
require __DIR__ . '/_layout_top.php';
?>
<div class="login-wrap">
  <h1>آنادنت</h1>
  <div class="login-box">
    <?php if ($error): ?><div class="flash flash-err"><?= ad_e($error) ?></div><?php endif; ?>
    <form method="post" autocomplete="off">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <label for="user_login">نام کاربری یا ایمیل</label>
      <input id="user_login" type="text" name="username" required autofocus />
      <label for="user_pass">رمز عبور</label>
      <input id="user_pass" type="password" name="password" required />
      <div class="actions">
        <button class="btn" type="submit">ورود به پنل</button>
      </div>
    </form>
    <p class="muted" style="margin-top:1rem;font-size:12px">
      حساب ندارید؟ <a href="../../register.html">ثبت‌نام</a>
      ·
      <a href="../../login.html">ورود کاربران</a>
    </p>
  </div>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
