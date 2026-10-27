<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
ad_require_role(['admin']);

$db = ad_db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: messages.php');
        exit;
    }
    $action = $_POST['action'] ?? '';
    $id = (int) ($_POST['id'] ?? 0);
    if ($action === 'read' && $id > 0) {
        $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([$id]);
        ad_flash_set('ok', 'پیام خوانده شد.');
    } elseif ($action === 'unread' && $id > 0) {
        $db->prepare('UPDATE contact_messages SET is_read = 0 WHERE id = ?')->execute([$id]);
        ad_flash_set('ok', 'پیام خوانده‌نشده شد.');
    } elseif ($action === 'delete' && $id > 0) {
        $db->prepare('DELETE FROM contact_messages WHERE id = ?')->execute([$id]);
        ad_flash_set('ok', 'پیام حذف شد.');
    }
    header('Location: messages.php');
    exit;
}

$viewId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$view = null;
if ($viewId > 0) {
    $stmt = $db->prepare('SELECT * FROM contact_messages WHERE id = ?');
    $stmt->execute([$viewId]);
    $view = $stmt->fetch() ?: null;
    if ($view && !(int) $view['is_read']) {
        $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([$viewId]);
        $view['is_read'] = 1;
    }
}

$rows = $db->query('SELECT id, name, email, phone, subject, is_read, created_at FROM contact_messages ORDER BY created_at DESC')->fetchAll();
$pageTitle = 'پیام‌های تماس';
require __DIR__ . '/_layout_top.php';
?>
<h1>پیام‌های تماس</h1>

<?php if ($view): ?>
<div class="card">
  <h2>جزئیات پیام #<?= (int) $view['id'] ?></h2>
  <p><strong>نام:</strong> <?= ad_e($view['name']) ?></p>
  <p><strong>ایمیل:</strong> <?= ad_e($view['email'] ?: '—') ?></p>
  <p><strong>تلفن:</strong> <?= ad_e($view['phone'] ?: '—') ?></p>
  <p><strong>موضوع:</strong> <?= ad_e($view['subject'] ?: '—') ?></p>
  <p><strong>تاریخ:</strong> <?= ad_e($view['created_at']) ?></p>
  <p style="white-space:pre-wrap"><?= ad_e($view['message']) ?></p>
  <div class="actions">
    <a class="btn btn-secondary" href="messages.php">بازگشت</a>
    <form method="post" style="display:inline">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
      <input type="hidden" name="action" value="<?= $view['is_read'] ? 'unread' : 'read' ?>" />
      <button class="btn" type="submit"><?= $view['is_read'] ? 'علامت خوانده‌نشده' : 'علامت خوانده‌شده' ?></button>
    </form>
    <form method="post" style="display:inline" onsubmit="return confirm('حذف شود؟');">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
      <input type="hidden" name="action" value="delete" />
      <button class="btn btn-danger" type="submit">حذف</button>
    </form>
  </div>
</div>
<?php endif; ?>

<div class="card">
  <h2>لیست پیام‌ها</h2>
  <table>
    <thead>
      <tr><th>وضعیت</th><th>نام</th><th>موضوع</th><th>تماس</th><th>تاریخ</th><th></th></tr>
    </thead>
    <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="6" class="muted">پیامی ثبت نشده است.</td></tr>
    <?php endif; ?>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td><?= $row['is_read'] ? '<span class="badge">خوانده</span>' : '<span class="badge badge-unread">جدید</span>' ?></td>
        <td><?= ad_e($row['name']) ?></td>
        <td><?= ad_e($row['subject'] ?: '—') ?></td>
        <td><?= ad_e($row['phone'] ?: $row['email'] ?: '—') ?></td>
        <td><?= ad_e($row['created_at']) ?></td>
        <td class="row-actions"><a href="messages.php?id=<?= (int) $row['id'] ?>">مشاهده</a></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
