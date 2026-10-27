<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/services.php';
require_once dirname(__DIR__) . '/lib/media.php';
ad_require_role(['admin']);

ad_services_ensure_schema();
ad_media_ensure_schema();
$db = ad_db();
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = null;

if ($editId > 0) {
    $stmt = $db->prepare('SELECT * FROM services WHERE id = ?');
    $stmt->execute([$editId]);
    $edit = $stmt->fetch() ?: null;
}
$editCoverAlt = $edit && !empty($edit['cover']) ? ad_media_alt((string) $edit['cover']) : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: services.php');
        exit;
    }
    $action = $_POST['action'] ?? 'save';
    try {
        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('DELETE FROM services WHERE id = ?')->execute([$id]);
            ad_flash_set('ok', 'خدمت حذف شد.');
            header('Location: services.php');
            exit;
        }

        $id = (int) ($_POST['id'] ?? 0);
        $title = trim((string) ($_POST['title'] ?? ''));
        $slug = trim((string) ($_POST['slug'] ?? ''));
        $summary = trim((string) ($_POST['summary'] ?? ''));
        $content = trim((string) ($_POST['content'] ?? ''));
        $sort = (int) ($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $cover = trim((string) ($_POST['cover_path'] ?? ''));
        $coverAlt = trim((string) ($_POST['cover_alt'] ?? ''));

        if ($title === '') {
            throw new RuntimeException('عنوان الزامی است.');
        }
        if ($slug === '') {
            $slug = ad_slugify($title);
        } else {
            $slug = ad_slugify($slug);
        }

        if (!empty($_FILES['cover']['name'])) {
            $uploaded = ad_media_upload($_FILES['cover'], 'services', $coverAlt);
            if ($uploaded !== '') {
                $cover = $uploaded;
            }
        } elseif ($cover !== '') {
            ad_media_set_alt($cover, $coverAlt);
        }

        if ($id > 0) {
            $stmt = $db->prepare(
                'UPDATE services SET title=?, slug=?, summary=?, content=?, cover=?, sort_order=?, is_active=? WHERE id=?'
            );
            $stmt->execute([$title, $slug, $summary, $content, $cover, $sort, $active, $id]);
            ad_flash_set('ok', 'خدمت به‌روزرسانی شد.');
        } else {
            $stmt = $db->prepare(
                'INSERT INTO services (title, slug, summary, content, cover, sort_order, is_active) VALUES (?,?,?,?,?,?,?)'
            );
            $stmt->execute([$title, $slug, $summary, $content, $cover, $sort, $active]);
            ad_flash_set('ok', 'خدمت افزوده شد.');
        }
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
    }
    header('Location: services.php');
    exit;
}

$rows = $db->query('SELECT * FROM services ORDER BY sort_order ASC, id ASC')->fetchAll();
$pageTitle = 'خدمات';
require __DIR__ . '/_layout_top.php';
?>
<h1>مدیریت خدمات</h1>
<p class="muted"><a href="../../service.html" target="_blank" rel="noopener">صفحه تکی خدمت</a> · <a href="../../services.html" target="_blank" rel="noopener">آرشیو خدمات</a></p>

<div class="card">
  <h2><?= $edit ? 'ویرایش خدمت' : 'افزودن خدمت' ?></h2>
  <form method="post" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="save" />
    <input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>" />

    <div class="form-section">
      <h3 class="form-section__title">اطلاعات خدمت</h3>
      <div class="form-grid">
        <div class="field field--span-2">
          <label>عنوان</label>
          <input type="text" name="title" required value="<?= ad_e($edit['title'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>اسلاگ</label>
          <input type="text" name="slug" value="<?= ad_e($edit['slug'] ?? '') ?>" />
        </div>
        <div class="field field--span-3">
          <label>خلاصه</label>
          <textarea name="summary" rows="3"><?= ad_e($edit['summary'] ?? '') ?></textarea>
        </div>
        <div class="field field--span-3">
          <label>محتوا</label>
          <textarea name="content" style="min-height:180px"><?= ad_e($edit['content'] ?? '') ?></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">تصویر و انتشار</h3>
      <div class="form-grid">
        <div class="field field--span-2">
          <label>مسیر کاور</label>
          <input type="text" name="cover_path" value="<?= ad_e($edit['cover'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>متن جایگزین (alt)</label>
          <input type="text" name="cover_alt" maxlength="255" value="<?= ad_e($editCoverAlt) ?>" placeholder="توضیح کوتاه تصویر کاور" />
        </div>
        <div class="field">
          <label>آپلود کاور</label>
          <input type="file" name="cover" accept="image/*" />
          <div class="media-field-actions">
            <button type="button" class="btn btn-secondary" data-media-picker data-media-target="cover_path" data-media-alt-target="cover_alt">انتخاب از رسانه</button>
          </div>
        </div>
        <div class="field">
          <label>ترتیب</label>
          <input type="number" name="sort_order" value="<?= (int) ($edit['sort_order'] ?? 0) ?>" />
        </div>
        <div class="field field--check">
          <label><input type="checkbox" name="is_active" <?= !isset($edit) || !empty($edit['is_active']) ? 'checked' : '' ?> /> فعال</label>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">ذخیره</button>
      <?php if ($edit): ?><a class="btn btn-secondary" href="services.php">انصراف</a><?php endif; ?>
    </div>
  </form>
</div>

<div class="card">
  <h2>لیست خدمات</h2>
  <table>
    <thead><tr><th>عنوان</th><th>اسلاگ</th><th>ترتیب</th><th>وضعیت</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td><?= ad_e($row['title']) ?></td>
        <td><a href="../../service.html?slug=<?= ad_e(urlencode($row['slug'])) ?>" target="_blank" rel="noopener"><?= ad_e($row['slug']) ?></a></td>
        <td><?= (int) $row['sort_order'] ?></td>
        <td><?= $row['is_active'] ? 'فعال' : 'غیرفعال' ?></td>
        <td class="row-actions">
          <a href="services.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
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
