<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/users.php';
ad_require_role(['admin']);
ad_users_ensure_schema();

$roleFilter = trim((string) ($_GET['role'] ?? ''));
if (!ad_role_is_valid($roleFilter)) {
    $roleFilter = '';
}

$current = ad_current_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: users.php');
        exit;
    }
    $action = (string) ($_POST['action'] ?? '');
    $id = (int) ($_POST['id'] ?? 0);
    try {
        if ($action === 'create') {
            ad_users_create(
                (string) ($_POST['username'] ?? ''),
                (string) ($_POST['password'] ?? ''),
                (string) ($_POST['email'] ?? ''),
                (string) ($_POST['display_name'] ?? ''),
                (string) ($_POST['role'] ?? 'user')
            );
            ad_flash_set('ok', 'کاربر ایجاد شد.');
        } elseif ($action === 'update' && $id > 0) {
            ad_users_update(
                $id,
                (string) ($_POST['email'] ?? ''),
                (string) ($_POST['display_name'] ?? ''),
                (string) ($_POST['role'] ?? 'user'),
                isset($_POST['is_active']),
                (string) ($_POST['password'] ?? '')
            );
            ad_flash_set('ok', 'کاربر به‌روزرسانی شد.');
        } elseif ($action === 'delete' && $id > 0) {
            ad_users_delete($id, (int) ($current['id'] ?? 0));
            ad_flash_set('ok', 'کاربر حذف شد.');
            header('Location: users.php' . ($roleFilter !== '' ? '?role=' . rawurlencode($roleFilter) : ''));
            exit;
        }
    } catch (RuntimeException $e) {
        ad_flash_set('err', $e->getMessage());
    } catch (Throwable $e) {
        ad_flash_set('err', 'عملیات انجام نشد.');
    }
    if ($action === 'update' && $id > 0) {
        header('Location: users.php?id=' . $id . ($roleFilter !== '' ? '&role=' . rawurlencode($roleFilter) : ''));
        exit;
    }
    header('Location: users.php' . ($roleFilter !== '' ? '?role=' . rawurlencode($roleFilter) : ''));
    exit;
}

$editId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$edit = $editId > 0 ? ad_users_get($editId) : null;
$rows = ad_users_list($roleFilter);
$counts = [
    'all' => ad_users_count_by_role(''),
    'user' => ad_users_count_by_role('user'),
    'author' => ad_users_count_by_role('author'),
    'admin' => ad_users_count_by_role('admin'),
];

$pageTitle = 'کاربران';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>کاربران و سطوح دسترسی</h1>
    <p class="muted" style="margin:0.35rem 0 0">نقش‌ها: کاربر عادی، نویسنده، مدیر کل</p>
  </div>
</div>

<nav class="subsubsub" style="margin:0 0 1rem;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:13px">
  <a href="users.php"<?= $roleFilter === '' ? ' style="font-weight:700"' : '' ?>>همه (<?= (int) $counts['all'] ?>)</a>
  <a href="users.php?role=user"<?= $roleFilter === 'user' ? ' style="font-weight:700"' : '' ?>>کاربر عادی (<?= (int) $counts['user'] ?>)</a>
  <a href="users.php?role=author"<?= $roleFilter === 'author' ? ' style="font-weight:700"' : '' ?>>نویسنده (<?= (int) $counts['author'] ?>)</a>
  <a href="users.php?role=admin"<?= $roleFilter === 'admin' ? ' style="font-weight:700"' : '' ?>>مدیر کل (<?= (int) $counts['admin'] ?>)</a>
</nav>

<div class="card">
  <h2><?= $edit ? 'ویرایش کاربر' : 'افزودن کاربر' ?></h2>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="<?= $edit ? 'update' : 'create' ?>" />
    <?php if ($edit): ?>
      <input type="hidden" name="id" value="<?= (int) $edit['id'] ?>" />
    <?php endif; ?>
    <div class="form-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
      <?php if (!$edit): ?>
        <div class="field">
          <label>نام کاربری</label>
          <input type="text" name="username" required maxlength="64" pattern="[A-Za-z0-9_\-\.]+" placeholder="مثلاً ali_author" />
        </div>
      <?php else: ?>
        <div class="field">
          <label>نام کاربری</label>
          <input type="text" value="<?= ad_e((string) $edit['username']) ?>" disabled />
        </div>
      <?php endif; ?>
      <div class="field">
        <label>نام نمایشی</label>
        <input type="text" name="display_name" maxlength="120" value="<?= ad_e((string) ($edit['display_name'] ?? '')) ?>" />
      </div>
      <div class="field">
        <label>ایمیل</label>
        <input type="email" name="email" maxlength="180" value="<?= ad_e((string) ($edit['email'] ?? '')) ?>" />
      </div>
      <div class="field">
        <label>نقش</label>
        <select name="role" required>
          <?php
          $selRole = (string) ($edit['role'] ?? 'user');
          foreach (['user' => 'کاربر عادی', 'author' => 'نویسنده', 'admin' => 'مدیر کل'] as $val => $label):
          ?>
            <option value="<?= ad_e($val) ?>"<?= $selRole === $val ? ' selected' : '' ?>><?= ad_e($label) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="field">
        <label>رمز عبور<?= $edit ? ' (خالی = بدون تغییر)' : '' ?></label>
        <input type="password" name="password" <?= $edit ? '' : 'required' ?> minlength="6" autocomplete="new-password" />
      </div>
      <?php if ($edit): ?>
        <div class="field" style="display:flex;align-items:flex-end">
          <label style="display:flex;gap:8px;align-items:center;cursor:pointer">
            <input type="checkbox" name="is_active" value="1"<?= !empty($edit['is_active']) ? ' checked' : '' ?> />
            حساب فعال باشد
          </label>
        </div>
      <?php endif; ?>
    </div>
    <div class="actions" style="margin-top:12px">
      <button class="btn" type="submit"><?= $edit ? 'ذخیره' : 'ایجاد' ?></button>
      <?php if ($edit): ?>
        <a class="btn btn-secondary" href="users.php">انصراف</a>
      <?php endif; ?>
    </div>
  </form>
</div>

<div class="card">
  <h2>لیست کاربران</h2>
  <table>
    <thead>
      <tr>
        <th>نام کاربری</th>
        <th>نام نمایشی</th>
        <th>نقش</th>
        <th>وضعیت</th>
        <th>تاریخ</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="6" class="muted">کاربری نیست.</td></tr>
    <?php endif; ?>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td><strong><?= ad_e((string) $row['username']) ?></strong>
          <?php if (!empty($row['email'])): ?>
            <div class="muted" style="font-size:12px"><?= ad_e((string) $row['email']) ?></div>
          <?php endif; ?>
        </td>
        <td><?= ad_e((string) $row['display_name']) ?></td>
        <td><?= ad_e(ad_role_label((string) $row['role'])) ?></td>
        <td><?= !empty($row['is_active']) ? '<span class="badge">فعال</span>' : '<span class="badge badge-unread">غیرفعال</span>' ?></td>
        <td><?= ad_e((string) $row['created_at']) ?></td>
        <td class="row-actions">
          <a href="users.php?id=<?= (int) $row['id'] ?><?= $roleFilter !== '' ? '&role=' . rawurlencode($roleFilter) : '' ?>">ویرایش</a>
          <?php if ((int) $row['id'] !== (int) ($current['id'] ?? 0)): ?>
            <form method="post" style="display:inline" onsubmit="return confirm('حذف شود؟');">
              <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
              <button type="submit">حذف</button>
            </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
