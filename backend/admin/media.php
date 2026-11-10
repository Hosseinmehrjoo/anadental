<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/media.php';
ad_require_capability('media');
ad_media_ensure_schema();

$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = $editId > 0 ? ad_media_get($editId) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: media.php');
        exit;
    }
    $action = (string) ($_POST['action'] ?? '');

    try {
        if ($action === 'sync') {
            $added = ad_media_sync_uploads();
            ad_flash_set('ok', $added > 0
                ? ($added . ' فایل به کتابخانه رسانه افزوده شد.')
                : 'فایل جدیدی برای افزودن پیدا نشد.');
            header('Location: media.php');
            exit;
        }

        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            if ($id > 0 && ad_media_delete($id)) {
                ad_flash_set('ok', 'رسانه حذف شد.');
            } else {
                ad_flash_set('err', 'حذف رسانه ممکن نشد.');
            }
            header('Location: media.php');
            exit;
        }

        if ($action === 'delete_bulk') {
            $ids = $_POST['ids'] ?? [];
            if (!is_array($ids)) {
                $ids = [];
            }
            $deleted = 0;
            foreach ($ids as $rawId) {
                $id = (int) $rawId;
                if ($id > 0 && ad_media_delete($id)) {
                    $deleted++;
                }
            }
            if ($deleted > 0) {
                ad_flash_set('ok', $deleted . ' رسانه حذف شد.');
            } else {
                ad_flash_set('err', 'هیچ موردی برای حذف انتخاب نشده بود.');
            }
            header('Location: media.php');
            exit;
        }

        if ($action === 'update') {
            $id = (int) ($_POST['id'] ?? 0);
            $alt = trim((string) ($_POST['alt_text'] ?? ''));
            $row = $id > 0 ? ad_media_get($id) : null;
            if (!$row) {
                throw new RuntimeException('رسانه یافت نشد.');
            }
            ad_media_set_alt((string) $row['path'], $alt);
            ad_flash_set('ok', 'متن جایگزین ذخیره شد.');
            header('Location: media.php?edit=' . $id);
            exit;
        }

        if ($action === 'upload') {
            $alt = trim((string) ($_POST['alt_text'] ?? ''));
            $uploaded = 0;
            if (!empty($_FILES['files']['name']) && is_array($_FILES['files']['name'])) {
                $count = count($_FILES['files']['name']);
                for ($i = 0; $i < $count; $i++) {
                    if (($_FILES['files']['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                        continue;
                    }
                    $file = [
                        'name' => $_FILES['files']['name'][$i] ?? '',
                        'type' => $_FILES['files']['type'][$i] ?? '',
                        'tmp_name' => $_FILES['files']['tmp_name'][$i] ?? '',
                        'error' => $_FILES['files']['error'][$i] ?? UPLOAD_ERR_NO_FILE,
                        'size' => $_FILES['files']['size'][$i] ?? 0,
                    ];
                    $path = ad_media_upload_auto($file, $alt);
                    if ($path !== '') {
                        $uploaded++;
                    }
                }
            } elseif (!empty($_FILES['file']['name'])) {
                $path = ad_media_upload_auto($_FILES['file'], $alt);
                if ($path !== '') {
                    $uploaded = 1;
                }
            }
            if ($uploaded < 1) {
                throw new RuntimeException('هیچ فایلی آپلود نشد.');
            }
            ad_flash_set('ok', $uploaded . ' فایل به رسانه افزوده شد.');
            header('Location: media.php');
            exit;
        }
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
        header('Location: media.php' . ($editId > 0 ? '?edit=' . $editId : ''));
        exit;
    }

    header('Location: media.php');
    exit;
}

$rows = ad_media_list(300);
$total = ad_media_count();
$pageTitle = 'رسانه';
require __DIR__ . '/_layout_top.php';
?>
<h1>رسانه</h1>
<p class="muted">مدیریت تصویر، ویدیو و فایل صوتی سایت — آپلود، متن جایگزین (alt) و حذف.</p>

<div class="card">
  <h2>افزودن رسانه جدید</h2>
  <form method="post" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="upload" />
    <div class="form-section">
      <h3 class="form-section__title">آپلود فایل</h3>
      <div class="form-grid">
        <div class="field">
          <label>انتخاب فایل (چندتایی)</label>
          <input type="file" name="files[]" accept="image/*,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/mp3,audio/mp4,audio/ogg,audio/wav,.mp3,.m4a,.mp4,.webm,.mov,.ogg,.wav" multiple required />
          <p class="hint">تصویر، ویدیو (mp4, webm, mov) یا پادکست (mp3, m4a, ogg)</p>
        </div>
        <div class="field field--span-2">
          <label>متن جایگزین (alt)</label>
          <input type="text" name="alt_text" maxlength="255" placeholder="توضیح کوتاه تصویر برای دسترس‌پذیری و سئو" />
          <p class="hint">اگر چند فایل آپلود کنید، همین متن جایگزین برای همه اعمال می‌شود؛ بعداً می‌توانید جداگانه ویرایش کنید.</p>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn" type="submit">آپلود به رسانه</button>
    </div>
  </form>
  <form method="post" style="margin-top:1rem" onsubmit="return confirm('فایل‌های موجود در پوشه آپلود که هنوز در رسانه نیستند اسکن شوند؟');">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="sync" />
    <button class="btn btn-secondary" type="submit">همگام‌سازی فایل‌های موجود</button>
  </form>
</div>

<?php if ($edit): ?>
<div class="card">
  <h2>ویرایش رسانه #<?= (int) $edit['id'] ?></h2>
  <div class="media-edit">
    <div class="media-edit__preview">
      <img src="../../<?= ad_e($edit['path']) ?>" alt="<?= ad_e($edit['alt_text'] ?? '') ?>" />
    </div>
    <form method="post" class="media-edit__form">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="action" value="update" />
      <input type="hidden" name="id" value="<?= (int) $edit['id'] ?>" />
      <label>مسیر</label>
      <input type="text" readonly value="<?= ad_e($edit['path']) ?>" />
      <label>نام فایل</label>
      <input type="text" readonly value="<?= ad_e($edit['filename'] ?? '') ?>" />
      <label>متن جایگزین (alt)</label>
      <input type="text" name="alt_text" maxlength="255" value="<?= ad_e($edit['alt_text'] ?? '') ?>" />
      <p class="muted">حجم: <?= number_format((int) ($edit['filesize'] ?? 0) / 1024, 1) ?> KB
        <?php if (!empty($edit['mime'])): ?> · <?= ad_e((string) $edit['mime']) ?><?php endif; ?>
      </p>
      <div class="actions">
        <button class="btn" type="submit">ذخیره</button>
        <a class="btn btn-secondary" href="media.php">بازگشت به کتابخانه</a>
      </div>
    </form>
  </div>
  <form method="post" style="margin-top:1rem" onsubmit="return confirm('این رسانه حذف شود؟ فایل از سرور هم پاک می‌شود.');">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="delete" />
    <input type="hidden" name="id" value="<?= (int) $edit['id'] ?>" />
    <button class="btn btn-danger" type="submit">حذف رسانه</button>
  </form>
</div>
<?php endif; ?>

<div class="card" id="media-library" data-media-library>
  <div class="media-library-toolbar">
    <h2>کتابخانه رسانه <span class="muted">(<?= (int) $total ?> مورد)</span></h2>
    <?php if ($rows): ?>
      <div class="media-library-toolbar__actions">
        <button type="button" class="btn btn-secondary" data-media-bulk-toggle>انتخاب چندتایی</button>
        <button type="button" class="btn btn-secondary" data-media-bulk-select-all hidden>انتخاب همه</button>
        <button type="button" class="btn btn-secondary" data-media-bulk-clear hidden>لغو انتخاب</button>
        <button type="submit" form="media-bulk-delete-form" class="btn btn-danger" data-media-bulk-delete hidden disabled>حذف انتخاب‌شده‌ها</button>
        <button type="button" class="btn btn-secondary" data-media-bulk-cancel hidden>خروج از انتخاب</button>
      </div>
    <?php endif; ?>
  </div>
  <?php if (!$rows): ?>
    <p class="muted">هنوز رسانه‌ای ثبت نشده است. از فرم بالا آپلود کنید یا همگام‌سازی را بزنید.</p>
  <?php else: ?>
    <form method="post" id="media-bulk-delete-form" data-media-bulk-form onsubmit="return confirm('موارد انتخاب‌شده حذف شوند؟ فایل‌ها از سرور هم پاک می‌شوند.');" hidden>
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="action" value="delete_bulk" />
    </form>
    <div class="media-library-grid">
      <?php foreach ($rows as $row): ?>
        <article class="media-library-card<?= $edit && (int) $edit['id'] === (int) $row['id'] ? ' is-active' : '' ?>" data-media-card data-media-id="<?= (int) $row['id'] ?>">
          <label class="media-library-card__check" hidden>
            <input type="checkbox" form="media-bulk-delete-form" name="ids[]" value="<?= (int) $row['id'] ?>" data-media-check />
            <span class="visually-hidden">انتخاب</span>
          </label>
          <a class="media-library-card__thumb" href="media.php?edit=<?= (int) $row['id'] ?>" data-media-thumb-link>
            <img src="../../<?= ad_e($row['path']) ?>" alt="<?= ad_e($row['alt_text'] ?? '') ?>" loading="lazy" />
          </a>
          <div class="media-library-card__body">
            <?php
              $fname = (string) ($row['filename'] ?? '');
              $fnameShort = mb_strlen($fname) > 28 ? (mb_substr($fname, 0, 27) . '…') : $fname;
            ?>
            <strong title="<?= ad_e($fname) ?>"><?= ad_e($fnameShort) ?></strong>
            <small><?= ad_e(trim((string) ($row['alt_text'] ?? '')) !== '' ? (string) $row['alt_text'] : 'بدون متن جایگزین') ?></small>
            <div class="media-library-card__actions" data-media-card-actions>
              <a href="media.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
              <form method="post" onsubmit="return confirm('حذف شود؟');">
                <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
                <button type="submit">حذف</button>
              </form>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
<script src="media-library.js?ver=20261014bulk" defer></script>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
