<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/team.php';
require_once dirname(__DIR__) . '/lib/media.php';
require_once dirname(__DIR__) . '/lib/seo.php';
ad_require_role(['admin']);

ad_team_ensure_schema();
ad_media_ensure_schema();
$db = ad_db();
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = null;

if ($editId > 0) {
    $stmt = $db->prepare('SELECT * FROM team_members WHERE id = ?');
    $stmt->execute([$editId]);
    $edit = $stmt->fetch() ?: null;
}
$editPhotoAlt = $edit && !empty($edit['photo']) ? ad_media_alt((string) $edit['photo']) : '';
$openModal = $edit !== null || isset($_GET['new']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: team.php');
        exit;
    }
    $action = $_POST['action'] ?? 'save';

    try {
        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('DELETE FROM team_members WHERE id = ?')->execute([$id]);
            ad_seo_on_content_change();
            ad_flash_set('ok', 'عضو تیم حذف شد.');
            header('Location: team.php');
            exit;
        }

        $id = (int) ($_POST['id'] ?? 0);
        $name = trim((string) ($_POST['name'] ?? ''));
        $nameEn = trim((string) ($_POST['name_en'] ?? ''));
        $role = trim((string) ($_POST['role'] ?? ''));
        $roleEn = trim((string) ($_POST['role_en'] ?? ''));
        $bio = trim((string) ($_POST['bio'] ?? ''));
        $rating = (float) ($_POST['rating'] ?? 5);
        if ($rating < 0) {
            $rating = 0;
        }
        if ($rating > 5) {
            $rating = 5;
        }
        $h1 = trim((string) ($_POST['highlight_1'] ?? ''));
        $h2 = trim((string) ($_POST['highlight_2'] ?? ''));
        $h3 = trim((string) ($_POST['highlight_3'] ?? ''));
        $joinedAt = trim((string) ($_POST['joined_at'] ?? ''));
        if ($joinedAt === '') {
            $joinedAt = null;
        }
        $wa = trim((string) ($_POST['social_whatsapp'] ?? ''));
        $tg = trim((string) ($_POST['social_telegram'] ?? ''));
        $ig = trim((string) ($_POST['social_instagram'] ?? ''));
        $li = trim((string) ($_POST['social_linkedin'] ?? ''));
        $web = trim((string) ($_POST['social_web'] ?? ''));
        $sort = (int) ($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $photo = trim((string) ($_POST['photo_path'] ?? ''));
        $photoAlt = trim((string) ($_POST['photo_alt'] ?? ''));
        $slugInput = trim((string) ($_POST['slug'] ?? ''));
        $metaTitle = trim((string) ($_POST['meta_title'] ?? ''));
        $metaDescription = trim((string) ($_POST['meta_description'] ?? ''));
        $metaKeywords = trim((string) ($_POST['meta_keywords'] ?? ''));
        if (mb_strlen($metaTitle) > 255) {
            $metaTitle = mb_substr($metaTitle, 0, 255);
        }
        if (mb_strlen($metaDescription) > 500) {
            $metaDescription = mb_substr($metaDescription, 0, 500);
        }
        if (mb_strlen($metaKeywords) > 500) {
            $metaKeywords = mb_substr($metaKeywords, 0, 500);
        }

        if ($name === '') {
            throw new RuntimeException('نام الزامی است.');
        }

        $slugBase = $slugInput !== '' ? $slugInput : ($nameEn !== '' ? $nameEn : $name);
        $slug = ad_team_unique_slug($slugBase, $id);

        if (!empty($_FILES['photo']['name'])) {
            $uploaded = ad_media_upload($_FILES['photo'], 'team', $photoAlt);
            if ($uploaded !== '') {
                $photo = $uploaded;
            }
        } elseif ($photo !== '') {
            ad_media_set_alt($photo, $photoAlt);
        }

        if ($id > 0) {
            $stmt = $db->prepare(
                'UPDATE team_members SET name=?, name_en=?, role=?, role_en=?, bio=?, rating=?, highlight_1=?, highlight_2=?, highlight_3=?, joined_at=?, social_whatsapp=?, social_telegram=?, social_instagram=?, social_linkedin=?, social_web=?, photo=?, sort_order=?, is_active=?, slug=?, meta_title=?, meta_description=?, meta_keywords=? WHERE id=?'
            );
            $stmt->execute([
                $name, $nameEn, $role, $roleEn, $bio, $rating, $h1, $h2, $h3, $joinedAt,
                $wa, $tg, $ig, $li, $web, $photo, $sort, $active, $slug, $metaTitle, $metaDescription, $metaKeywords, $id,
            ]);
            ad_flash_set('ok', 'عضو تیم به‌روزرسانی شد.');
        } else {
            $stmt = $db->prepare(
                'INSERT INTO team_members (name, name_en, role, role_en, bio, rating, highlight_1, highlight_2, highlight_3, joined_at, social_whatsapp, social_telegram, social_instagram, social_linkedin, social_web, photo, sort_order, is_active, slug, meta_title, meta_description, meta_keywords) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            );
            $stmt->execute([
                $name, $nameEn, $role, $roleEn, $bio, $rating, $h1, $h2, $h3, $joinedAt,
                $wa, $tg, $ig, $li, $web, $photo, $sort, $active, $slug, $metaTitle, $metaDescription, $metaKeywords,
            ]);
            ad_flash_set('ok', 'عضو تیم افزوده شد.');
        }
        ad_seo_on_content_change();
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
        $failId = (int) ($_POST['id'] ?? 0);
        header('Location: team.php' . ($failId > 0 ? '?edit=' . $failId : '?new=1'));
        exit;
    }
    header('Location: team.php');
    exit;
}

$rows = $db->query('SELECT * FROM team_members ORDER BY sort_order ASC, id ASC')->fetchAll();
$pageTitle = 'مدیریت تیم';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>مدیریت تیم</h1>
    <p class="muted" style="margin:0.35rem 0 0">نمونه‌کارها از پنل نمونه‌کار و «مسئولین پروژه» تعیین می‌شوند.</p>
  </div>
  <div class="page-toolbar__actions">
    <a class="btn" href="team.php?new=1">افزودن عضو</a>
  </div>
</div>

<div class="card">
  <h2>لیست اعضا</h2>
  <table>
    <thead>
      <tr><th>عکس</th><th>نام</th><th>نقش</th><th>امتیاز</th><th>ترتیب</th><th>وضعیت</th><th></th></tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $row): ?>
      <tr>
        <td><?php if ($row['photo']): ?><img class="thumb" src="../../<?= ad_e($row['photo']) ?>" alt="" /><?php endif; ?></td>
        <td><?= ad_e($row['name']) ?></td>
        <td><?= ad_e($row['role']) ?></td>
        <td><?= ad_e((string) ($row['rating'] ?? '5')) ?></td>
        <td><?= (int) $row['sort_order'] ?></td>
        <td><?= $row['is_active'] ? 'فعال' : 'غیرفعال' ?></td>
        <td class="row-actions">
          <a href="team.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
          <a href="../../member.html?<?= trim((string) ($row['slug'] ?? '')) !== '' ? 'slug=' . rawurlencode((string) $row['slug']) : 'id=' . (int) $row['id'] ?>" target="_blank" rel="noopener">رزومه</a>
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
<div class="admin-modal" id="team-form-modal"<?= $openModal ? ' data-admin-modal-autoopen' : '' ?> hidden>
  <div class="admin-modal__backdrop" data-admin-modal-close></div>
  <div class="admin-modal__dialog">
    <div class="admin-modal__header">
      <h2><?= $edit ? 'ویرایش عضو' : 'افزودن عضو' ?></h2>
      <button type="button" class="admin-modal__close" data-admin-modal-close aria-label="بستن">×</button>
    </div>
    <div class="admin-modal__body">
<form method="post" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="save" />
    <input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>" />

    <div class="form-section">
      <h3 class="form-section__title">اطلاعات اصلی</h3>
      <div class="form-grid">
        <div class="field">
          <label>نام فارسی</label>
          <input type="text" name="name" required value="<?= ad_e($edit['name'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>نام انگلیسی</label>
          <input type="text" name="name_en" value="<?= ad_e($edit['name_en'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>امتیاز (۰ تا ۵)</label>
          <input type="number" name="rating" min="0" max="5" step="0.1" value="<?= ad_e((string) ($edit['rating'] ?? '5.0')) ?>" />
        </div>
        <div class="field">
          <label>سمت فارسی</label>
          <input type="text" name="role" value="<?= ad_e($edit['role'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>سمت انگلیسی</label>
          <input type="text" name="role_en" value="<?= ad_e($edit['role_en'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>تاریخ عضویت</label>
          <input type="date" name="joined_at" value="<?= ad_e($edit['joined_at'] ?? '') ?>" />
        </div>
        <div class="field field--span-3">
          <label>بیوگرافی کامل</label>
          <textarea name="bio" rows="7"><?= ad_e($edit['bio'] ?? '') ?></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">نکات برجسته</h3>
      <div class="form-grid">
        <div class="field">
          <label>نکته برجسته ۱</label>
          <input type="text" name="highlight_1" value="<?= ad_e($edit['highlight_1'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>نکته برجسته ۲</label>
          <input type="text" name="highlight_2" value="<?= ad_e($edit['highlight_2'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>نکته برجسته ۳</label>
          <input type="text" name="highlight_3" value="<?= ad_e($edit['highlight_3'] ?? '') ?>" />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">شبکه‌های اجتماعی</h3>
      <div class="form-grid">
        <div class="field">
          <label>واتساپ</label>
          <input type="text" name="social_whatsapp" value="<?= ad_e($edit['social_whatsapp'] ?? '') ?>" placeholder="https://wa.me/98..." />
        </div>
        <div class="field">
          <label>تلگرام</label>
          <input type="text" name="social_telegram" value="<?= ad_e($edit['social_telegram'] ?? '') ?>" placeholder="https://t.me/..." />
        </div>
        <div class="field">
          <label>اینستاگرام</label>
          <input type="url" name="social_instagram" value="<?= ad_e($edit['social_instagram'] ?? '') ?>" placeholder="https://instagram.com/..." />
        </div>
        <div class="field">
          <label>لینکدین</label>
          <input type="url" name="social_linkedin" value="<?= ad_e($edit['social_linkedin'] ?? '') ?>" placeholder="https://linkedin.com/in/..." />
        </div>
        <div class="field field--span-2">
          <label>وبسایت / لینک دیگر</label>
          <input type="url" name="social_web" value="<?= ad_e($edit['social_web'] ?? '') ?>" placeholder="https://..." />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">تصویر و انتشار</h3>
      <div class="form-grid">
        <div class="field field--span-2">
          <label>عکس عضو</label>
          <input type="text" name="photo_path" class="media-field-paths" value="<?= ad_e($edit['photo'] ?? '') ?>" placeholder="assets/images/uploads/..." hidden />
          <div class="media-picked-blocks media-picked-blocks--single" data-media-preview="photo_path" data-media-alt="photo_alt"></div>
          <div class="media-field-actions">
            <button type="button" class="btn btn-secondary" data-media-picker data-media-target="photo_path" data-media-alt-target="photo_alt">انتخاب از رسانه</button>
          </div>
          <input type="file" name="photo" accept="image/*" style="margin-top:0.5rem" />
          <p class="hint">یا عکس را از دستگاه آپلود کنید.</p>
        </div>
        <div class="field">
          <label>متن جایگزین (alt)</label>
          <input type="text" name="photo_alt" maxlength="255" value="<?= ad_e($editPhotoAlt) ?>" placeholder="مثلاً تصویر مهندس حسین مهرجو" />
        </div>
        <div class="field">
          <label>ترتیب نمایش</label>
          <input type="number" name="sort_order" value="<?= (int) ($edit['sort_order'] ?? 0) ?>" />
        </div>
        <div class="field field--check">
          <label><input type="checkbox" name="is_active" <?= !isset($edit) || !empty($edit['is_active']) ? 'checked' : '' ?> /> فعال</label>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">سئو گوگل</h3>
      <div class="form-grid">
        <div class="field field--span-2">
          <label>اسلاگ (نامک URL)</label>
          <input type="text" name="slug" maxlength="200" value="<?= ad_e($edit['slug'] ?? '') ?>" placeholder="خالی = از نام انگلیسی یا فارسی ساخته می‌شود" dir="ltr" />
          <p class="hint">آدرس صفحه: member.html?slug=...</p>
        </div>
        <div class="field field--span-2">
          <label>متا تایتل</label>
          <input type="text" name="meta_title" maxlength="255" value="<?= ad_e($edit['meta_title'] ?? '') ?>" placeholder="خالی = نام عضو | آنادنت" />
        </div>
        <div class="field field--span-2">
          <label>متا دیسکریپشن</label>
          <textarea name="meta_description" rows="3" maxlength="500" placeholder="توضیح کوتاه برای نتایج گوگل"><?= ad_e($edit['meta_description'] ?? '') ?></textarea>
        </div>
        <div class="field field--span-2">
          <label>متا کیورد</label>
          <input type="text" name="meta_keywords" maxlength="500" value="<?= ad_e($edit['meta_keywords'] ?? '') ?>" placeholder="کلمه۱, کلمه۲, کلمه۳" />
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">ذخیره</button>
      <a class="btn btn-secondary" href="team.php">انصراف</a>
      <?php if ($edit): ?>
        <a class="btn btn-secondary" href="../../member.html?<?= trim((string) ($edit['slug'] ?? '')) !== '' ? 'slug=' . rawurlencode((string) $edit['slug']) : 'id=' . (int) $edit['id'] ?>" target="_blank" rel="noopener">مشاهده رزومه</a>
      <?php endif; ?>
    </div>
  </form>
    </div>
  </div>
</div>

<?php require __DIR__ . '/_layout_bottom.php'; ?>
