<?php
/**
 * نصب‌گر CMS آنادنت
 * پس از نصب، installed.lock ساخته می‌شود و این صفحه قفل می‌گردد.
 */
declare(strict_types=1);

$lockFile = __DIR__ . '/installed.lock';
$configFile = __DIR__ . '/config.php';
$siteRoot = dirname(__DIR__);
$error = '';
$success = '';
$alreadyInstalled = is_file($lockFile) || is_file($configFile);

/**
 * @return list<array{ok:bool,label:string,detail:string}>
 */
function ad_install_requirements(string $siteRoot): array
{
    $uploadDir = $siteRoot . '/assets/images/uploads';
    $checks = [];

    $phpOk = version_compare(PHP_VERSION, '8.0.0', '>=');
    $checks[] = [
        'ok' => $phpOk,
        'label' => 'نسخه PHP ≥ ۸.۰',
        'detail' => 'نسخه فعلی: ' . PHP_VERSION,
    ];

    $pdoOk = extension_loaded('pdo') && extension_loaded('pdo_mysql');
    $checks[] = [
        'ok' => $pdoOk,
        'label' => 'افزونه PDO MySQL',
        'detail' => $pdoOk ? 'فعال است' : 'pdo_mysql را فعال کنید',
    ];

    $mbOk = extension_loaded('mbstring');
    $checks[] = [
        'ok' => $mbOk,
        'label' => 'افزونه mbstring',
        'detail' => $mbOk ? 'فعال است' : 'mbstring لازم است',
    ];

    $jsonOk = extension_loaded('json');
    $checks[] = [
        'ok' => $jsonOk,
        'label' => 'افزونه JSON',
        'detail' => $jsonOk ? 'فعال است' : 'json لازم است',
    ];

    $backendWritable = is_writable(__DIR__);
    $checks[] = [
        'ok' => $backendWritable,
        'label' => 'نوشتن در پوشه backend/',
        'detail' => $backendWritable ? 'قابل نوشتن' : 'دسترسی نوشتن برای ساخت config.php لازم است',
    ];

    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    $uploadWritable = is_dir($uploadDir) && is_writable($uploadDir);
    $checks[] = [
        'ok' => $uploadWritable,
        'label' => 'نوشتن در assets/images/uploads/',
        'detail' => $uploadWritable ? 'قابل نوشتن' : 'chmod 755 یا 775 روی پوشه uploads',
    ];

    $sqlOk = is_readable(__DIR__ . '/install.sql');
    $checks[] = [
        'ok' => $sqlOk,
        'label' => 'وجود install.sql',
        'detail' => $sqlOk ? 'یافت شد' : 'فایل schema موجود نیست',
    ];

    return $checks;
}

function ad_install_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function ad_install_exec_sql(PDO $pdo, string $sql): void
{
    $sql = preg_replace('/^\s*--.*$/m', '', $sql) ?? $sql;
    $parts = preg_split('/;\s*\n/', $sql) ?: [];
    foreach ($parts as $part) {
        $stmt = trim($part);
        if ($stmt === '') {
            continue;
        }
        $pdo->exec($stmt);
    }
}

$requirements = ad_install_requirements($siteRoot);
$requirementsOk = !in_array(false, array_column($requirements, 'ok'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$alreadyInstalled) {
    if (!$requirementsOk) {
        $error = 'پیش‌نیازهای نصب کامل نیستند.';
    } else {
        $host = trim((string) ($_POST['db_host'] ?? 'localhost'));
        $port = trim((string) ($_POST['db_port'] ?? '3306'));
        $name = trim((string) ($_POST['db_name'] ?? ''));
        $user = trim((string) ($_POST['db_user'] ?? ''));
        $pass = (string) ($_POST['db_pass'] ?? '');
        $siteName = trim((string) ($_POST['site_name'] ?? 'آنادنت'));
        $adminUser = trim((string) ($_POST['admin_user'] ?? 'admin'));
        $adminPass = (string) ($_POST['admin_pass'] ?? '');
        $adminPass2 = (string) ($_POST['admin_pass2'] ?? '');
        $createDb = isset($_POST['create_db']);
        $seedDemo = isset($_POST['seed_demo']);

        if ($siteName === '') {
            $siteName = 'آنادنت';
        }
        if ($port === '' || !ctype_digit($port)) {
            $port = '3306';
        }

        if ($name === '' || $user === '' || $adminUser === '' || $adminPass === '') {
            $error = 'تمام فیلدهای لازم را پر کنید.';
        } elseif ($adminPass !== $adminPass2) {
            $error = 'تکرار رمز ادمین مطابقت ندارد.';
        } elseif (strlen($adminPass) < 8) {
            $error = 'رمز ادمین باید حداقل ۸ کاراکتر باشد.';
        } else {
            try {
                $dsnBase = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);
                if ($createDb) {
                    $pdoBoot = new PDO($dsnBase, $user, $pass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    ]);
                    $safeName = str_replace('`', '``', $name);
                    $pdoBoot->exec(
                        "CREATE DATABASE IF NOT EXISTS `{$safeName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                    );
                }

                $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
                $pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                ]);

                $sql = file_get_contents(__DIR__ . '/install.sql');
                if ($sql === false) {
                    throw new RuntimeException('خواندن install.sql ممکن نشد.');
                }
                ad_install_exec_sql($pdo, $sql);

                if ($seedDemo && is_readable(__DIR__ . '/install-seed.sql')) {
                    $seed = file_get_contents(__DIR__ . '/install-seed.sql');
                    if ($seed !== false) {
                        ad_install_exec_sql($pdo, $seed);
                    }
                }

                $hash = password_hash($adminPass, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare(
                    'INSERT INTO admins (username, password_hash) VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
                );
                $stmt->execute([$adminUser, $hash]);

                $stmtUser = $pdo->prepare(
                    'INSERT INTO users (username, email, display_name, password_hash, role, is_active)
                     VALUES (?, ?, ?, ?, \'admin\', 1)
                     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = \'admin\', is_active = 1'
                );
                $stmtUser->execute([$adminUser, '', $adminUser, $hash]);

                $uploadDir = $siteRoot . '/assets/images/uploads';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                $config = [
                    'db_host' => $host,
                    'db_port' => (int) $port,
                    'db_name' => $name,
                    'db_user' => $user,
                    'db_pass' => $pass,
                    'db_charset' => 'utf8mb4',
                    'upload_url_prefix' => 'assets/images/uploads/',
                    'upload_dir' => $uploadDir . '/',
                    'site_name' => $siteName,
                    'timezone' => 'Asia/Tehran',
                ];

                $configContent = "<?php\n/**\n * تولیدشده توسط نصب‌گر — این فایل را در Git قرار ندهید.\n */\nreturn " . var_export($config, true) . ";\n";
                if (file_put_contents($configFile, $configContent) === false) {
                    throw new RuntimeException('نوشتن config.php ممکن نشد. دسترسی نوشتن پوشه backend را بررسی کنید.');
                }

                file_put_contents($lockFile, date('c') . "\ninstalled_by=web_installer\n");
                $alreadyInstalled = true;
                $success = 'نصب با موفقیت انجام شد. اکنون می‌توانید وارد پنل ادمین شوید.';
            } catch (Throwable $e) {
                $error = 'خطای نصب: ' . $e->getMessage();
            }
        }
    }
}

$posted = static function (string $key, string $default = '') : string {
    return ad_install_escape((string) ($_POST[$key] ?? $default));
};
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>نصب CMS آنادنت</title>
  <style>
    :root { --bg:#f0f0f1; --card:#fff; --border:#c3c4c7; --text:#1d2327; --muted:#646970; --accent:#2271b1; --accent-border:#135e96; --ok:#00a32a; --err:#d63638; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Tahoma, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.6; }
    .wrap { max-width: 640px; margin: 2.5rem auto; padding: 0 1rem 2rem; }
    .card { background: var(--card); border: 1px solid var(--border); box-shadow: 0 1px 1px rgba(0,0,0,.04); padding: 1.5rem 1.75rem; }
    h1 { font-size: 1.4rem; margin: 0 0 .35rem; }
    .lead { color: var(--muted); margin: 0 0 1.25rem; }
    label { display: block; margin: .85rem 0 .3rem; font-weight: 600; }
    input[type=text], input[type=password], input[type=number] { width: 100%; padding: .55rem .65rem; border: 1px solid #8c8f94; border-radius: 3px; font: inherit; }
    .row { display: grid; grid-template-columns: 1fr 120px; gap: .75rem; }
    .check { display: flex; gap: .5rem; align-items: flex-start; margin: .85rem 0; font-weight: 400; }
    .check input { margin-top: .2rem; }
    button, .btn { display: inline-block; margin-top: 1.1rem; background: var(--accent); color: #fff !important; border: 1px solid var(--accent-border); border-radius: 3px; padding: .55rem 1.1rem; cursor: pointer; font: inherit; text-decoration: none !important; }
    button:disabled { opacity: .55; cursor: not-allowed; }
    .err { background: #fcf0f1; border-inline-start: 4px solid var(--err); color: #3c434a; padding: .75rem 1rem; margin-bottom: 1rem; }
    .ok { background: #edfaef; border-inline-start: 4px solid var(--ok); color: #3c434a; padding: .75rem 1rem; margin-bottom: 1rem; }
    .hint { color: var(--muted); font-size: .85rem; margin-top: 1rem; }
    .req { list-style: none; margin: 0 0 1.25rem; padding: 0; border: 1px solid var(--border); }
    .req li { display: flex; justify-content: space-between; gap: 1rem; padding: .55rem .75rem; border-bottom: 1px solid var(--border); }
    .req li:last-child { border-bottom: 0; }
    .badge { font-size: 12px; font-weight: 700; }
    .badge.is-ok { color: var(--ok); }
    .badge.is-bad { color: var(--err); }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .5rem; }
    code { background: #f6f7f7; padding: .1rem .35rem; border-radius: 2px; }
    fieldset { border: 1px solid var(--border); margin: 1rem 0 0; padding: .75rem 1rem 1rem; }
    legend { padding: 0 .35rem; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>نصب CMS آنادنت</h1>
      <p class="lead">نصب‌گر وب — دیتابیس، تنظیمات و حساب مدیر را یک‌جا می‌سازد.</p>

      <?php if ($error): ?><div class="err"><?= ad_install_escape($error) ?></div><?php endif; ?>
      <?php if ($success): ?><div class="ok"><?= ad_install_escape($success) ?></div><?php endif; ?>

      <?php if ($alreadyInstalled): ?>
        <p>سیستم قبلاً نصب شده است.</p>
        <div class="actions">
          <a class="btn" href="admin/">ورود به پنل ادمین</a>
          <a class="btn" href="../index.html" style="background:#f6f7f7;color:#2c3338!important;border-color:#c3c4c7">مشاهده سایت</a>
        </div>
        <p class="hint">برای امنیت، پس از نصب می‌توانید فایل <code>backend/install.php</code> را حذف کنید. فایل‌های <code>config.php</code> و <code>installed.lock</code> را در Git commit نکنید.</p>
      <?php else: ?>

        <h2 style="font-size:1rem;margin:0 0 .5rem">۱. پیش‌نیازها</h2>
        <ul class="req">
          <?php foreach ($requirements as $item): ?>
            <li>
              <span>
                <strong><?= ad_install_escape($item['label']) ?></strong><br />
                <span style="color:var(--muted);font-size:12px"><?= ad_install_escape($item['detail']) ?></span>
              </span>
              <span class="badge <?= $item['ok'] ? 'is-ok' : 'is-bad' ?>"><?= $item['ok'] ? 'OK' : 'ناموفق' ?></span>
            </li>
          <?php endforeach; ?>
        </ul>

        <?php if (!$requirementsOk): ?>
          <div class="err">تا وقتی همه پیش‌نیازها برقرار نشوند، نصب ادامه پیدا نمی‌کند.</div>
        <?php else: ?>
          <form method="post" autocomplete="off">
            <fieldset>
              <legend>۲. سایت</legend>
              <label for="site_name">نام سایت</label>
              <input id="site_name" name="site_name" type="text" value="<?= $posted('site_name', 'آنادنت') ?>" required />
            </fieldset>

            <fieldset>
              <legend>۳. دیتابیس MySQL</legend>
              <div class="row">
                <div>
                  <label for="db_host">هاست</label>
                  <input id="db_host" name="db_host" type="text" value="<?= $posted('db_host', '127.0.0.1') ?>" required />
                </div>
                <div>
                  <label for="db_port">پورت</label>
                  <input id="db_port" name="db_port" type="number" value="<?= $posted('db_port', '3306') ?>" required />
                </div>
              </div>
              <label for="db_name">نام دیتابیس</label>
              <input id="db_name" name="db_name" type="text" value="<?= $posted('db_name', 'ana_developer') ?>" required />
              <label for="db_user">کاربر</label>
              <input id="db_user" name="db_user" type="text" value="<?= $posted('db_user', 'root') ?>" required />
              <label for="db_pass">رمز</label>
              <input id="db_pass" name="db_pass" type="password" value="" />
              <label class="check">
                <input type="checkbox" name="create_db" value="1" <?= isset($_POST['create_db']) || $_SERVER['REQUEST_METHOD'] !== 'POST' ? 'checked' : '' ?> />
                <span>اگر دیتابیس وجود ندارد، آن را بساز (نیاز به دسترسی CREATE دارد)</span>
              </label>
              <label class="check">
                <input type="checkbox" name="seed_demo" value="1" <?= isset($_POST['seed_demo']) ? 'checked' : '' ?> />
                <span>نصب داده نمونه (اعضای تیم اولیه)</span>
              </label>
            </fieldset>

            <fieldset>
              <legend>۴. حساب مدیر</legend>
              <label for="admin_user">نام کاربری</label>
              <input id="admin_user" name="admin_user" type="text" value="<?= $posted('admin_user', 'admin') ?>" required />
              <label for="admin_pass">رمز (حداقل ۸ کاراکتر)</label>
              <input id="admin_pass" name="admin_pass" type="password" required minlength="8" />
              <label for="admin_pass2">تکرار رمز</label>
              <input id="admin_pass2" name="admin_pass2" type="password" required minlength="8" />
            </fieldset>

            <button type="submit">اجرای نصب</button>
          </form>
          <p class="hint">پس از نصب، پنل در مسیر <code>/backend/admin/</code> در دسترس است.</p>
        <?php endif; ?>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
