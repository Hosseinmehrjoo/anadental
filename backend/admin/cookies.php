<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/cookies.php';
ad_require_role(['admin']);

ad_cookies_ensure_schema();
$db = ad_db();

/* Download all consents as CSV */
if (isset($_GET['download']) && $_GET['download'] === 'csv') {
    $rows = $db->query(
        'SELECT id, visitor_id, action, necessary, analytics, marketing, social, ip_hash, user_agent, page_url, created_at
         FROM cookie_consents
         ORDER BY created_at DESC'
    )->fetchAll();

    $filename = 'cookie-consents-' . date('Y-m-d-His') . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');

    $out = fopen('php://output', 'w');
    // UTF-8 BOM for Excel
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, [
        'id', 'visitor_id', 'action', 'necessary', 'analytics', 'marketing', 'social',
        'ip_hash', 'user_agent', 'page_url', 'created_at',
    ]);
    foreach ($rows as $row) {
        fputcsv($out, [
            $row['id'],
            $row['visitor_id'],
            $row['action'],
            $row['necessary'],
            $row['analytics'],
            $row['marketing'],
            $row['social'],
            $row['ip_hash'],
            $row['user_agent'],
            $row['page_url'],
            $row['created_at'],
        ]);
    }
    fclose($out);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: cookies.php');
        exit;
    }
    $action = $_POST['action'] ?? 'save_settings';

    try {
        if ($action === 'delete_consent') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('DELETE FROM cookie_consents WHERE id = ?')->execute([$id]);
            ad_flash_set('ok', 'رکورد رضایت حذف شد.');
        } elseif ($action === 'clear_consents') {
            $db->exec('TRUNCATE TABLE cookie_consents');
            ad_flash_set('ok', 'همه رضایت‌های ثبت‌شده پاک شدند.');
        } else {
            $bannerText = trim((string) ($_POST['banner_text'] ?? ''));
            if ($bannerText === '') {
                throw new RuntimeException('متن بنر الزامی است.');
            }
            $stmt = $db->prepare(
                'UPDATE cookie_settings SET
                 banner_enabled = ?,
                 banner_text = ?,
                 accept_label = ?,
                 reject_label = ?,
                 manage_label = ?,
                 enable_analytics = ?,
                 enable_marketing = ?,
                 enable_social = ?,
                 privacy_url = ?
                 WHERE id = 1'
            );
            $stmt->execute([
                isset($_POST['banner_enabled']) ? 1 : 0,
                $bannerText,
                trim((string) ($_POST['accept_label'] ?? 'پذیرش')) ?: 'پذیرش',
                trim((string) ($_POST['reject_label'] ?? 'رد')) ?: 'رد',
                trim((string) ($_POST['manage_label'] ?? 'مدیریت کوکی')) ?: 'مدیریت کوکی',
                isset($_POST['enable_analytics']) ? 1 : 0,
                isset($_POST['enable_marketing']) ? 1 : 0,
                isset($_POST['enable_social']) ? 1 : 0,
                trim((string) ($_POST['privacy_url'] ?? '')),
            ]);
            ad_flash_set('ok', 'تنظیمات کوکی ذخیره شد.');
        }
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
    }
    header('Location: cookies.php');
    exit;
}

$settings = ad_cookie_settings();
$stats = [
    'total' => (int) $db->query('SELECT COUNT(*) FROM cookie_consents')->fetchColumn(),
    'accept' => (int) $db->query("SELECT COUNT(*) FROM cookie_consents WHERE action = 'accept'")->fetchColumn(),
    'reject' => (int) $db->query("SELECT COUNT(*) FROM cookie_consents WHERE action = 'reject'")->fetchColumn(),
    'custom' => (int) $db->query("SELECT COUNT(*) FROM cookie_consents WHERE action = 'custom'")->fetchColumn(),
    'analytics' => (int) $db->query('SELECT COUNT(*) FROM cookie_consents WHERE analytics = 1')->fetchColumn(),
    'marketing' => (int) $db->query('SELECT COUNT(*) FROM cookie_consents WHERE marketing = 1')->fetchColumn(),
    'social' => (int) $db->query('SELECT COUNT(*) FROM cookie_consents WHERE social = 1')->fetchColumn(),
];
$rows = $db->query(
    'SELECT id, visitor_id, action, necessary, analytics, marketing, social, page_url, created_at
     FROM cookie_consents
     ORDER BY created_at DESC
     LIMIT 200'
)->fetchAll();

$pageTitle = 'مدیریت کوکی';
require __DIR__ . '/_layout_top.php';

$actionLabel = static function (string $a): string {
    return match ($a) {
        'accept' => 'پذیرش همه',
        'reject' => 'رد اختیاری',
        'custom' => 'سفارشی',
        default => $a,
    };
};
?>
<h1>مدیریت و جمع‌آوری کوکی</h1>
<p class="muted">تنظیم بنر رضایت و مشاهده رکوردهای ثبت‌شده بازدیدکنندگان.</p>

<div class="grid-stats" style="margin-top:1rem;">
  <div class="stat"><span class="muted">کل رضایت‌ها</span><strong><?= $stats['total'] ?></strong></div>
  <div class="stat"><span class="muted">پذیرش</span><strong><?= $stats['accept'] ?></strong></div>
  <div class="stat"><span class="muted">رد</span><strong><?= $stats['reject'] ?></strong></div>
  <div class="stat"><span class="muted">سفارشی</span><strong><?= $stats['custom'] ?></strong></div>
  <div class="stat"><span class="muted">آنالیتیکس</span><strong><?= $stats['analytics'] ?></strong></div>
  <div class="stat"><span class="muted">بازاریابی</span><strong><?= $stats['marketing'] ?></strong></div>
  <div class="stat"><span class="muted">شبکه اجتماعی</span><strong><?= $stats['social'] ?></strong></div>
</div>

<div class="card" style="margin-top:1rem;">
  <h2>تنظیمات بنر</h2>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="save_settings" />
    <label><input type="checkbox" name="banner_enabled" <?= !empty($settings['banner_enabled']) ? 'checked' : '' ?> /> نمایش بنر کوکی در سایت</label>
    <label>متن بنر</label>
    <textarea name="banner_text" style="min-height:120px" required><?= ad_e($settings['banner_text'] ?? '') ?></textarea>
    <label>برچسب دکمه پذیرش</label>
    <input type="text" name="accept_label" value="<?= ad_e($settings['accept_label'] ?? 'پذیرش') ?>" />
    <label>برچسب دکمه رد</label>
    <input type="text" name="reject_label" value="<?= ad_e($settings['reject_label'] ?? 'رد') ?>" />
    <label>برچسب دکمه مدیریت</label>
    <input type="text" name="manage_label" value="<?= ad_e($settings['manage_label'] ?? 'مدیریت کوکی') ?>" />
    <label>لینک سیاست حریم خصوصی (اختیاری)</label>
    <input type="url" name="privacy_url" value="<?= ad_e($settings['privacy_url'] ?? '') ?>" placeholder="https://..." />
    <p class="muted" style="margin-top:1rem;">دسته‌های کوکی اختیاری قابل انتخاب توسط کاربر:</p>
    <label><input type="checkbox" name="enable_analytics" <?= !empty($settings['enable_analytics']) ? 'checked' : '' ?> /> آنالیتیکس</label>
    <label><input type="checkbox" name="enable_marketing" <?= !empty($settings['enable_marketing']) ? 'checked' : '' ?> /> بازاریابی / تبلیغات</label>
    <label><input type="checkbox" name="enable_social" <?= !empty($settings['enable_social']) ? 'checked' : '' ?> /> شبکه‌های اجتماعی</label>
    <div class="actions">
      <button class="btn" type="submit">ذخیره تنظیمات</button>
    </div>
  </form>
</div>

<div class="card">
  <h2>رضایت‌های ثبت‌شده (۲۰۰ مورد اخیر)</h2>
  <div class="actions" style="margin-bottom:1rem">
    <a class="btn" href="cookies.php?download=csv">دانلود کوکی‌ها (CSV)</a>
    <form method="post" style="display:inline" onsubmit="return confirm('همه رکوردها پاک شوند؟');">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="action" value="clear_consents" />
      <button class="btn btn-danger" type="submit">پاک کردن همه</button>
    </form>
  </div>
  <table>
    <thead>
      <tr>
        <th>تاریخ</th>
        <th>عمل</th>
        <th>آنالیتیکس</th>
        <th>بازاریابی</th>
        <th>اجتماعی</th>
        <th>بازدیدکننده</th>
        <th>صفحه</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="8" class="muted">هنوز رضایتی ثبت نشده است.</td></tr>
    <?php endif; ?>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td><?= ad_e($row['created_at']) ?></td>
        <td><span class="badge"><?= ad_e($actionLabel($row['action'])) ?></span></td>
        <td><?= $row['analytics'] ? 'بله' : 'خیر' ?></td>
        <td><?= $row['marketing'] ? 'بله' : 'خیر' ?></td>
        <td><?= $row['social'] ? 'بله' : 'خیر' ?></td>
        <td><code style="font-size:.75rem"><?= ad_e(substr((string) $row['visitor_id'], 0, 12) ?: '—') ?></code></td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><?= ad_e($row['page_url'] ?: '—') ?></td>
        <td class="row-actions">
          <form method="post" style="display:inline" onsubmit="return confirm('حذف شود؟');">
            <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
            <input type="hidden" name="action" value="delete_consent" />
            <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
            <button type="submit">حذف</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
