<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/videos.php';
require_once dirname(__DIR__) . '/lib/media.php';
ad_require_role(['admin']);

ad_videos_ensure_schema();
ad_media_ensure_schema();
$db = ad_db();
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = $editId > 0 ? ad_videos_get($editId) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: videos.php');
        exit;
    }
    $action = $_POST['action'] ?? 'save';

    try {
        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('DELETE FROM satisfaction_videos WHERE id = ?')->execute([$id]);
            ad_flash_set('ok', 'ویدیو حذف شد.');
            header('Location: videos.php');
            exit;
        }

        $id = (int) ($_POST['id'] ?? 0);
        $title = trim((string) ($_POST['title'] ?? ''));
        $videoUrl = trim((string) ($_POST['video_url'] ?? ''));
        $posterUrl = trim((string) ($_POST['poster_url'] ?? ''));
        $sort = (int) ($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;

        if (!empty($_FILES['poster_file']['name'])) {
            $uploaded = ad_media_upload($_FILES['poster_file'], 'videos', $title);
            if ($uploaded !== '') {
                $posterUrl = '/' . ltrim($uploaded, '/');
            }
        }

        if (!empty($_FILES['video_file']['name'])) {
            $uploadedVideo = ad_media_upload_video($_FILES['video_file'], 'videos', $title);
            if ($uploadedVideo !== '') {
                $videoUrl = '/' . ltrim(str_replace('\\', '/', $uploadedVideo), '/');
            }
        }

        if ($videoUrl === '') {
            throw new RuntimeException('آدرس ویدیو یا فایل ویدیو الزامی است.');
        }

        if ($id > 0) {
            $stmt = $db->prepare(
                'UPDATE satisfaction_videos SET title=?, video_url=?, poster_url=?, sort_order=?, is_active=? WHERE id=?'
            );
            $stmt->execute([$title, $videoUrl, $posterUrl, $sort, $active, $id]);
            ad_flash_set('ok', 'ویدیو به‌روزرسانی شد.');
        } else {
            $stmt = $db->prepare(
                'INSERT INTO satisfaction_videos (title, video_url, poster_url, sort_order, is_active) VALUES (?,?,?,?,?)'
            );
            $stmt->execute([$title, $videoUrl, $posterUrl, $sort, $active]);
            ad_flash_set('ok', 'ویدیو افزوده شد.');
        }
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
    }
    header('Location: videos.php');
    exit;
}

$rows = ad_videos_list_all();
$pageTitle = 'ویدیوهای رضایت';
require __DIR__ . '/_layout_top.php';
?>
<h1>ویدیوهای رضایت مشتریان</h1>
<p class="muted">ویدیوها در بخش «رضایت مراجعین» صفحه اصلی به‌صورت کاروسل سه‌تایی نمایش داده می‌شوند.</p>

<div class="card">
  <h2><?= $edit ? 'ویرایش ویدیو' : 'افزودن ویدیو' ?></h2>
  <form method="post" enctype="multipart/form-data" id="ana-video-form">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="save" />
    <input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>" />

    <p>
      <label>عنوان<br>
        <input type="text" name="title" class="regular-text" style="width:100%;max-width:480px"
               value="<?= ad_e((string) ($edit['title'] ?? '')) ?>" placeholder="مثلاً رضایت خانم …" />
      </label>
    </p>
    <p>
      <label>آدرس ویدیو (mp4 / webm / mov یا لینک مستقیم)<br>
        <input type="url" name="video_url" id="ana-video-url" class="regular-text" style="width:100%;max-width:640px"
               value="<?= ad_e((string) ($edit['video_url'] ?? '')) ?>" dir="ltr"
               placeholder="https://… یا /assets/images/uploads/videos/…" />
      </label>
      <span class="muted" style="display:block;margin-top:4px">می‌توانید فایل را پایین بارگذاری کنید تا این فیلد خودکار پر شود.</span>
    </p>
    <p>
      <label>آپلود فایل ویدیو (حداکثر ۲۰۰ مگابایت — mp4, webm, mov)<br>
        <input type="file" name="video_file" id="ana-video-file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" />
      </label>
    </p>
    <p>
      <button type="button" class="btn" id="ana-video-upload-btn">بارگذاری ویدیو</button>
      <span id="ana-video-upload-status" class="muted" role="status" style="margin-inline-start:10px"></span>
    </p>
    <div id="ana-video-upload-progress" class="ana-upload-progress" hidden>
      <div class="ana-upload-progress__bar" id="ana-video-upload-bar" style="width:0%"></div>
      <span class="ana-upload-progress__label" id="ana-video-upload-pct">0%</span>
    </div>
    <p>
      <label>آدرس پوستر (اختیاری)<br>
        <input type="url" name="poster_url" class="regular-text" style="width:100%;max-width:640px"
               value="<?= ad_e((string) ($edit['poster_url'] ?? '')) ?>" dir="ltr" />
      </label>
    </p>
    <p>
      <label>یا آپلود پوستر<br>
        <input type="file" name="poster_file" accept="image/jpeg,image/png,image/webp,image/gif" />
      </label>
    </p>
    <p>
      <label>ترتیب نمایش
        <input type="number" name="sort_order" value="<?= (int) ($edit['sort_order'] ?? 0) ?>" style="width:100px" />
      </label>
    </p>
    <p>
      <label>
        <input type="checkbox" name="is_active" value="1" <?= !isset($edit['is_active']) || (int) ($edit['is_active'] ?? 1) === 1 ? 'checked' : '' ?> />
        فعال در سایت
      </label>
    </p>
    <p>
      <button type="submit" class="btn"><?= $edit ? 'ذخیره تغییرات' : 'افزودن' ?></button>
      <?php if ($edit): ?>
        <a class="btn btn-secondary" href="videos.php">انصراف</a>
      <?php endif; ?>
    </p>
  </form>
</div>

<div class="card">
  <h2>ویدیوهای موجود</h2>
  <?php if (!$rows): ?>
    <p class="muted">هنوز ویدیویی ثبت نشده است.</p>
  <?php else: ?>
    <table class="widefat striped" style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:right;padding:8px">پوستر</th>
          <th style="text-align:right;padding:8px">عنوان</th>
          <th style="text-align:right;padding:8px">ترتیب</th>
          <th style="text-align:right;padding:8px">وضعیت</th>
          <th style="text-align:right;padding:8px">عملیات</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $row): ?>
          <tr>
            <td style="padding:8px;width:90px">
              <?php if (!empty($row['poster_url'])): ?>
                <img src="<?= ad_e((string) $row['poster_url']) ?>" alt="" style="width:72px;height:40px;object-fit:cover;border-radius:4px" />
              <?php else: ?>
                <span class="muted">—</span>
              <?php endif; ?>
            </td>
            <td style="padding:8px">
              <strong><?= ad_e((string) ($row['title'] ?: 'بدون عنوان')) ?></strong><br>
              <span class="muted" dir="ltr" style="font-size:12px;word-break:break-all"><?= ad_e((string) $row['video_url']) ?></span>
            </td>
            <td style="padding:8px"><?= (int) $row['sort_order'] ?></td>
            <td style="padding:8px"><?= (int) $row['is_active'] ? 'فعال' : 'غیرفعال' ?></td>
            <td style="padding:8px;white-space:nowrap">
              <a class="btn btn-secondary" href="videos.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
              <form method="post" style="display:inline" onsubmit="return confirm('حذف این ویدیو؟');">
                <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
                <button type="submit" class="btn btn-secondary">حذف</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>
<script src="videos-upload.js?ver=20261022d" defer></script>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
