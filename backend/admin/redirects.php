<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/seo.php';
ad_require_role(['admin']);
ad_redirects_ensure_schema();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: redirects.php');
        exit;
    }
    $action = (string) ($_POST['action'] ?? '');
    $id = (int) ($_POST['id'] ?? 0);
    try {
        if ($action === 'create') {
            ad_redirects_create(
                (string) ($_POST['source_path'] ?? ''),
                (string) ($_POST['target_url'] ?? ''),
                (int) ($_POST['status_code'] ?? 301),
                (string) ($_POST['note'] ?? ''),
                true
            );
            ad_flash_set('ok', 'ریدایرکت اضافه شد.');
        } elseif ($action === 'update' && $id > 0) {
            ad_redirects_update(
                $id,
                (string) ($_POST['source_path'] ?? ''),
                (string) ($_POST['target_url'] ?? ''),
                (int) ($_POST['status_code'] ?? 301),
                (string) ($_POST['note'] ?? ''),
                isset($_POST['is_active'])
            );
            ad_flash_set('ok', 'ریدایرکت به‌روزرسانی شد.');
        } elseif ($action === 'delete' && $id > 0) {
            ad_redirects_delete($id);
            ad_flash_set('ok', 'ریدایرکت حذف شد.');
            header('Location: redirects.php');
            exit;
        } elseif ($action === 'sync') {
            ad_redirects_sync_htaccess();
            ad_flash_set('ok', 'قوانین .htaccess هم‌گام شد.');
        }
    } catch (RuntimeException $e) {
        ad_flash_set('err', $e->getMessage());
    } catch (Throwable $e) {
        ad_flash_set('err', 'عملیات انجام نشد.');
    }
    if ($action === 'update' && $id > 0) {
        header('Location: redirects.php?id=' . $id);
        exit;
    }
    header('Location: redirects.php');
    exit;
}

$editId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$edit = $editId > 0 ? ad_redirects_get($editId) : null;
$rows = ad_redirects_list();

$pageTitle = 'ریدایرکت‌ها';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>ریدایرکت‌ها</h1>
    <p class="muted" style="margin:0.35rem 0 0">مسیر قدیمی را به آدرس جدید بفرستید (۳۰۱ / ۳۰۲).</p>
  </div>
  <div class="page-toolbar__actions">
    <form method="post" style="display:inline">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="action" value="sync" />
      <button class="btn btn-secondary" type="submit">هم‌گام‌سازی .htaccess</button>
    </form>
  </div>
</div>

<div class="card">
  <h2><?= $edit ? 'ویرایش ریدایرکت' : 'افزودن ریدایرکت' ?></h2>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="<?= $edit ? 'update' : 'create' ?>" />
    <?php if ($edit): ?>
      <input type="hidden" name="id" value="<?= (int) $edit['id'] ?>" />
    <?php endif; ?>
    <div class="form-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
      <div class="field">
        <label>مسیر مبدأ</label>
        <input type="text" name="source_path" required maxlength="500" dir="ltr" style="text-align:left"
               placeholder="/old-page.html یا blog-post.html?slug=old"
               value="<?= ad_e((string) ($edit['source_path'] ?? '')) ?>" />
        <p class="hint">نسبت به ریشه سایت؛ با یا بدون / اول.</p>
      </div>
      <div class="field">
        <label>آدرس مقصد</label>
        <input type="text" name="target_url" required maxlength="1000" dir="ltr" style="text-align:left"
               placeholder="/new-page.html یا https://example.com"
               value="<?= ad_e((string) ($edit['target_url'] ?? '')) ?>" />
      </div>
      <div class="field">
        <label>کد وضعیت</label>
        <?php $code = (int) ($edit['status_code'] ?? 301); ?>
        <select name="status_code">
          <option value="301"<?= $code === 301 ? ' selected' : '' ?>>301 — دائمی</option>
          <option value="302"<?= $code === 302 ? ' selected' : '' ?>>302 — موقت</option>
          <option value="307"<?= $code === 307 ? ' selected' : '' ?>>307 — موقت (حفظ متد)</option>
          <option value="308"<?= $code === 308 ? ' selected' : '' ?>>308 — دائمی (حفظ متد)</option>
        </select>
      </div>
      <div class="field">
        <label>یادداشت (اختیاری)</label>
        <input type="text" name="note" maxlength="255" value="<?= ad_e((string) ($edit['note'] ?? '')) ?>" />
      </div>
      <?php if ($edit): ?>
        <div class="field" style="display:flex;align-items:flex-end">
          <label style="display:flex;gap:8px;align-items:center;cursor:pointer">
            <input type="checkbox" name="is_active" value="1"<?= !empty($edit['is_active']) ? ' checked' : '' ?> />
            فعال باشد
          </label>
        </div>
      <?php endif; ?>
    </div>
    <div class="actions" style="margin-top:12px">
      <button class="btn" type="submit"><?= $edit ? 'ذخیره' : 'افزودن' ?></button>
      <?php if ($edit): ?>
        <a class="btn btn-secondary" href="redirects.php">انصراف</a>
      <?php endif; ?>
    </div>
  </form>
</div>

<div class="card">
  <h2>لیست ریدایرکت‌ها</h2>
  <table>
    <thead>
      <tr>
        <th>مبدأ</th>
        <th>مقصد</th>
        <th>کد</th>
        <th>وضعیت</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="5" class="muted">هنوز ریدایرکتی ثبت نشده است.</td></tr>
    <?php endif; ?>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td dir="ltr" style="text-align:left"><code><?= ad_e((string) $row['source_path']) ?></code></td>
        <td dir="ltr" style="text-align:left"><code><?= ad_e((string) $row['target_url']) ?></code></td>
        <td><?= (int) $row['status_code'] ?></td>
        <td><?= !empty($row['is_active']) ? '<span class="badge">فعال</span>' : '<span class="badge badge-unread">غیرفعال</span>' ?></td>
        <td class="row-actions">
          <a href="redirects.php?id=<?= (int) $row['id'] ?>">ویرایش</a>
          <form method="post" style="display:inline" onsubmit="return confirm('حذف شود؟');">
            <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
            <input type="hidden" name="action" value="delete" />
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
