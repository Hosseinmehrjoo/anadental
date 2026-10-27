<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/portfolio.php';
require_once dirname(__DIR__) . '/lib/media.php';
require_once dirname(__DIR__) . '/lib/seo.php';
ad_require_role(['admin']);

ad_portfolio_ensure_schema();
ad_media_ensure_schema();
require_once dirname(__DIR__) . '/lib/team.php';
ad_team_ensure_schema();
$db = ad_db();
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = null;
$teamMembers = $db->query('SELECT id, name FROM team_members ORDER BY sort_order ASC, id ASC')->fetchAll();

if ($editId > 0) {
    $stmt = $db->prepare('SELECT * FROM portfolio_items WHERE id = ?');
    $stmt->execute([$editId]);
    $edit = $stmt->fetch() ?: null;
}

$editScreenshots = $edit ? ad_portfolio_parse_screenshots((string) ($edit['screenshots'] ?? '')) : [];
$editShotAlts = ad_media_alts_map($editScreenshots);
$editCoverAlt = $edit && !empty($edit['cover']) ? ad_media_alt((string) $edit['cover']) : '';
$editTeamRoles = $edit ? ad_portfolio_resolve_team_roles($edit) : [];
$editTechIds = $edit ? ad_portfolio_parse_technologies((string) ($edit['technologies'] ?? '')) : [];
$techCatalog = ad_portfolio_technology_catalog();
$editServiceIds = $edit ? ad_portfolio_parse_provided_services((string) ($edit['provided_services'] ?? '')) : [];
$serviceCatalog = ad_portfolio_provided_services_catalog();
$teamSlotCount = 5;
$openModal = $edit !== null || isset($_GET['new']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: portfolio.php');
        exit;
    }
    $action = $_POST['action'] ?? 'save';

    try {
        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('DELETE FROM portfolio_items WHERE id = ?')->execute([$id]);
            ad_seo_on_content_change();
            ad_flash_set('ok', 'نمونه‌کار حذف شد.');
            header('Location: portfolio.php');
            exit;
        }

        if ($action === 'clear_price') {
            $id = (int) ($_POST['id'] ?? 0);
            $db->prepare('UPDATE portfolio_items SET price = \'\', show_price = 0 WHERE id = ?')->execute([$id]);
            ad_flash_set('ok', 'قیمت حذف شد.');
            header('Location: portfolio.php?edit=' . $id);
            exit;
        }

        if ($action === 'add_technology') {
            $label = trim((string) ($_POST['tech_label'] ?? ''));
            $icon = '';
            if (!empty($_FILES['tech_icon']['name'])) {
                $icon = ad_media_upload($_FILES['tech_icon'], 'technologies', $label);
            }
            $created = ad_portfolio_add_technology($label, $icon);
            ad_flash_set('ok', 'تکنولوژی «' . $created['label'] . '» اضافه شد.');
            $backId = (int) ($_POST['return_id'] ?? 0);
            header('Location: portfolio.php' . ($backId > 0 ? '?edit=' . $backId : '?new=1') . '#techs');
            exit;
        }

        if ($action === 'add_provided_service') {
            $label = trim((string) ($_POST['service_label'] ?? ''));
            $icon = '';
            if (!empty($_FILES['service_icon']['name'])) {
                $icon = ad_media_upload($_FILES['service_icon'], 'provided-services', $label);
            }
            $created = ad_portfolio_add_provided_service($label, $icon);
            ad_flash_set('ok', 'خدمت «' . $created['label'] . '» اضافه شد.');
            $backId = (int) ($_POST['return_id'] ?? 0);
            header('Location: portfolio.php' . ($backId > 0 ? '?edit=' . $backId : '?new=1') . '#provided-services');
            exit;
        }

        $id = (int) ($_POST['id'] ?? 0);
        $title = trim((string) ($_POST['title'] ?? ''));
        $description = trim((string) ($_POST['description'] ?? ''));
        $category = $_POST['category'] ?? 'websites';
        if (!in_array($category, ['websites', 'apps'], true)) {
            $category = 'websites';
        }
        $tags = trim((string) ($_POST['tags'] ?? ''));
        $postedTechs = $_POST['technologies'] ?? [];
        if (!is_array($postedTechs)) {
            $postedTechs = [$postedTechs];
        }
        $technologiesList = ad_portfolio_parse_technologies(implode("\n", array_map('strval', $postedTechs)));
        $technologies = implode("\n", $technologiesList);
        $postedServices = $_POST['provided_services'] ?? [];
        if (!is_array($postedServices)) {
            $postedServices = [$postedServices];
        }
        $providedServicesList = ad_portfolio_parse_provided_services(implode("\n", array_map('strval', $postedServices)));
        $providedServices = implode("\n", $providedServicesList);
        $price = trim((string) ($_POST['price'] ?? ''));
        $showPrice = isset($_POST['show_price']) && $price !== '' ? 1 : 0;
        if ($price === '') {
            $showPrice = 0;
        }
        $url = trim((string) ($_POST['url'] ?? ''));
        $clientName = trim((string) ($_POST['client_name'] ?? ''));
        $deliveryDate = trim((string) ($_POST['delivery_date'] ?? ''));
        $uploadedAt = trim((string) ($_POST['uploaded_at'] ?? ''));
        $teamRoleRows = [];
        $postedMemberIds = $_POST['team_member_id'] ?? [];
        $postedRoles = $_POST['team_role'] ?? [];
        $postedSummaries = $_POST['team_summary'] ?? [];
        if (!is_array($postedMemberIds)) {
            $postedMemberIds = [];
        }
        if (!is_array($postedRoles)) {
            $postedRoles = [];
        }
        if (!is_array($postedSummaries)) {
            $postedSummaries = [];
        }
        $slotMax = max(count($postedMemberIds), count($postedRoles), count($postedSummaries), $teamSlotCount);
        for ($i = 0; $i < $slotMax; $i++) {
            $teamRoleRows[] = [
                'member_id' => (int) ($postedMemberIds[$i] ?? 0),
                'role' => trim((string) ($postedRoles[$i] ?? '')),
                'summary' => trim((string) ($postedSummaries[$i] ?? '')),
            ];
        }
        $teamRolesJson = ad_portfolio_team_roles_json($teamRoleRows);
        $parsedTeam = ad_portfolio_parse_team_roles($teamRolesJson);
        $memberId = $parsedTeam ? (int) $parsedTeam[0]['member_id'] : null;
        $memberSummary = $parsedTeam ? (string) ($parsedTeam[0]['summary'] ?? '') : '';
        $executorNames = [];
        foreach ($parsedTeam as $person) {
            foreach ($teamMembers as $tm) {
                if ((int) $tm['id'] !== (int) $person['member_id']) {
                    continue;
                }
                $name = (string) $tm['name'];
                $roleLabel = trim((string) ($person['role'] ?? ''));
                $executorNames[] = $roleLabel !== '' ? ($name . ' — ' . $roleLabel) : $name;
                break;
            }
        }
        $executor = implode('، ', $executorNames);
        if ($executor === '') {
            $executor = trim((string) ($_POST['executor'] ?? ''));
        }
        $sort = (int) ($_POST['sort_order'] ?? 0);
        $active = isset($_POST['is_active']) ? 1 : 0;
        $cover = trim((string) ($_POST['cover_path'] ?? ''));
        $coverAlt = trim((string) ($_POST['cover_alt'] ?? ''));
        $newShotAlt = trim((string) ($_POST['screenshots_alt'] ?? ''));
        $postedShotAlts = $_POST['screenshot_alt'] ?? [];
        if (!is_array($postedShotAlts)) {
            $postedShotAlts = [];
        }
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

        $screenshots = [];
        $keep = $_POST['keep_screenshot'] ?? [];
        if (is_array($keep)) {
            foreach ($keep as $path) {
                $path = trim((string) $path);
                if ($path !== '') {
                    $screenshots[] = $path;
                    $shotAlt = trim((string) ($postedShotAlts[$path] ?? ''));
                    ad_media_set_alt($path, $shotAlt);
                }
            }
        }
        $screenshots = array_values(array_unique(array_merge(
            $screenshots,
            ad_portfolio_parse_screenshots((string) ($_POST['screenshots_text'] ?? ''))
        )));

        if ($title === '') {
            throw new RuntimeException('عنوان الزامی است.');
        }

        $slug = $slugInput !== '' ? ad_slugify($slugInput) : ad_slugify($title);
        $slug = ad_portfolio_unique_slug($slug, $id);

        if (!empty($_FILES['cover']['name'])) {
            $uploaded = ad_media_upload($_FILES['cover'], 'portfolio', $coverAlt);
            if ($uploaded !== '') {
                $cover = $uploaded;
            }
        } elseif ($cover !== '') {
            ad_media_set_alt($cover, $coverAlt);
        }

        if (!empty($_FILES['screenshots']['name']) && is_array($_FILES['screenshots']['name'])) {
            $count = count($_FILES['screenshots']['name']);
            for ($i = 0; $i < $count; $i++) {
                if (($_FILES['screenshots']['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                    continue;
                }
                $file = [
                    'name' => $_FILES['screenshots']['name'][$i] ?? '',
                    'type' => $_FILES['screenshots']['type'][$i] ?? '',
                    'tmp_name' => $_FILES['screenshots']['tmp_name'][$i] ?? '',
                    'error' => $_FILES['screenshots']['error'][$i] ?? UPLOAD_ERR_NO_FILE,
                    'size' => $_FILES['screenshots']['size'][$i] ?? 0,
                ];
                $uploadedShot = ad_media_upload($file, 'portfolio', $newShotAlt);
                if ($uploadedShot !== '') {
                    $screenshots[] = $uploadedShot;
                }
            }
            $screenshots = array_values(array_unique($screenshots));
        }

        $screenshotsJson = ad_portfolio_screenshots_json($screenshots);

        if ($id > 0) {
            $stmt = $db->prepare(
                'UPDATE portfolio_items SET member_id=?, member_summary=?, team_roles=?, title=?, slug=?, meta_title=?, meta_description=?, meta_keywords=?, description=?, category=?, cover=?, tags=?, technologies=?, provided_services=?, price=?, show_price=?, url=?, client_name=?, delivery_date=?, executor=?, uploaded_at=?, screenshots=?, sort_order=?, is_active=? WHERE id=?'
            );
            $stmt->execute([
                $memberId, $memberSummary, $teamRolesJson, $title, $slug, $metaTitle, $metaDescription, $metaKeywords,
                $description, $category, $cover, $tags, $technologies, $providedServices, $price, $showPrice, $url,
                $clientName, $deliveryDate, $executor, $uploadedAt, $screenshotsJson, $sort, $active, $id,
            ]);
            ad_flash_set('ok', 'نمونه‌کار به‌روزرسانی شد.');
        } else {
            $stmt = $db->prepare(
                'INSERT INTO portfolio_items (member_id, member_summary, team_roles, title, slug, meta_title, meta_description, meta_keywords, description, category, cover, tags, technologies, provided_services, price, show_price, url, client_name, delivery_date, executor, uploaded_at, screenshots, sort_order, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            );
            $stmt->execute([
                $memberId, $memberSummary, $teamRolesJson, $title, $slug, $metaTitle, $metaDescription, $metaKeywords,
                $description, $category, $cover, $tags, $technologies, $providedServices, $price, $showPrice, $url,
                $clientName, $deliveryDate, $executor, $uploadedAt, $screenshotsJson, $sort, $active,
            ]);
            ad_flash_set('ok', 'نمونه‌کار افزوده شد.');
        }
        ad_seo_on_content_change();
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
        $failId = (int) ($_POST['id'] ?? 0);
        header('Location: portfolio.php' . ($failId > 0 ? '?edit=' . $failId : '?new=1'));
        exit;
    }
    header('Location: portfolio.php');
    exit;
}

$rows = $db->query('SELECT * FROM portfolio_items ORDER BY sort_order ASC, id DESC')->fetchAll();
$memberNames = [];
foreach ($teamMembers as $tm) {
    $memberNames[(int) $tm['id']] = (string) $tm['name'];
}
$pageTitle = 'مدیریت نمونه‌کار';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>مدیریت نمونه‌کار</h1>
    <p class="muted" style="margin:0.35rem 0 0"><a href="../../portfolio.html" target="_blank" rel="noopener">مشاهده آرشیو نمونه‌کارها</a></p>
  </div>
  <div class="page-toolbar__actions">
    <a class="btn" href="portfolio.php?new=1">افزودن نمونه‌کار</a>
  </div>
</div>

<div class="card">
  <h2>لیست نمونه‌کارها</h2>
  <table>
    <thead>
      <tr><th>کاور</th><th>عنوان</th><th>کارفرما</th><th>مسئول پروژه</th><th>دسته</th><th>ترتیب</th><th>وضعیت</th><th></th></tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $row):
        $rowTeam = ad_portfolio_resolve_team_roles($row);
        $rowTeamLabels = [];
        foreach ($rowTeam as $person) {
            $nm = $memberNames[(int) ($person['member_id'] ?? 0)] ?? '';
            if ($nm === '') {
                continue;
            }
            $rl = trim((string) ($person['role'] ?? ''));
            $rowTeamLabels[] = $rl !== '' ? ($nm . ' (' . $rl . ')') : $nm;
        }
        if (!$rowTeamLabels && !empty($row['executor'])) {
            $rowTeamLabels[] = (string) $row['executor'];
        }
        ?>
      <tr>
        <td><?php if ($row['cover']): ?><img class="thumb" src="../../<?= ad_e($row['cover']) ?>" alt="" /><?php endif; ?></td>
        <td><?= ad_e($row['title']) ?></td>
        <td><?= ad_e($row['client_name'] ?? '') ?: '—' ?></td>
        <td><?= ad_e($rowTeamLabels ? implode('، ', $rowTeamLabels) : '—') ?></td>
        <td><?= $row['category'] === 'apps' ? 'اپلیکیشن' : 'وبسایت' ?></td>
        <td><?= (int) $row['sort_order'] ?></td>
        <td><?= $row['is_active'] ? 'فعال' : 'غیرفعال' ?></td>
        <td class="row-actions">
          <a href="portfolio.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
          <a href="../../work.html?<?= trim((string) ($row['slug'] ?? '')) !== '' ? 'slug=' . rawurlencode((string) $row['slug']) : 'id=' . (int) $row['id'] ?>" target="_blank" rel="noopener">مشاهده</a>
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
<div class="admin-modal" id="portfolio-form-modal"<?= $openModal ? ' data-admin-modal-autoopen' : '' ?> hidden>
  <div class="admin-modal__backdrop" data-admin-modal-close></div>
  <div class="admin-modal__dialog">
    <div class="admin-modal__header">
      <h2><?= $edit ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار' ?></h2>
      <button type="button" class="admin-modal__close" data-admin-modal-close aria-label="بستن">×</button>
    </div>
    <div class="admin-modal__body">
<form method="post" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="save" />
    <input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>" />

    <div class="form-section">
      <h3 class="form-section__title">اطلاعات پروژه</h3>
      <div class="form-grid">
        <div class="field field--span-2">
          <label>۱. عنوان پروژه</label>
          <input type="text" name="title" required value="<?= ad_e($edit['title'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>۲. تاریخ بارگزاری</label>
          <input type="text" name="uploaded_at" value="<?= ad_e($edit['uploaded_at'] ?? '') ?>" placeholder="مثلاً ۱۴۰۳/۰۷/۱۲" />
        </div>
        <div class="field">
          <label>۳. نام کارفرما</label>
          <input type="text" name="client_name" value="<?= ad_e($edit['client_name'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>۴. تاریخ تحویل</label>
          <input type="text" name="delivery_date" value="<?= ad_e($edit['delivery_date'] ?? '') ?>" placeholder="مثلاً ۱۴۰۳/۰۸/۰۱" />
        </div>
        <div class="field">
          <label>۶. آدرس لایو پروژه</label>
          <input type="url" name="url" value="<?= ad_e($edit['url'] ?? '') ?>" placeholder="https://example.com" />
        </div>
        <div class="field field--span-3">
          <label>۷. توضیحات پروژه</label>
          <textarea name="description" rows="7"><?= ad_e($edit['description'] ?? '') ?></textarea>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">۵. مسئولین پروژه</h3>
      <p class="muted" style="margin:0 0 0.75rem">تا ۵ نفر؛ هر نفر با نقش خودش. پروژه در صفحه رزومه همه این اعضا نمایش داده می‌شود.</p>
      <?php for ($slot = 0; $slot < $teamSlotCount; $slot++):
          $slotRow = $editTeamRoles[$slot] ?? ['member_id' => 0, 'role' => '', 'summary' => ''];
          ?>
        <div class="team-role-row">
          <div class="field">
            <label>عضو <?= $slot + 1 ?></label>
            <select name="team_member_id[]">
              <option value="0">— انتخاب کنید —</option>
              <?php foreach ($teamMembers as $tm): ?>
                <option value="<?= (int) $tm['id'] ?>" <?= (int) ($slotRow['member_id'] ?? 0) === (int) $tm['id'] ? 'selected' : '' ?>><?= ad_e($tm['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="field">
            <label>نقش در پروژه</label>
            <input type="text" name="team_role[]" maxlength="180" value="<?= ad_e($slotRow['role'] ?? '') ?>" placeholder="مثلاً مسئول برنامه‌نویسی" />
          </div>
          <div class="field">
            <label>توضیح کوتاه برای عضو</label>
            <input type="text" name="team_summary[]" maxlength="255" value="<?= ad_e($slotRow['summary'] ?? '') ?>" placeholder="متن زیر کارت در صفحه عضو" />
          </div>
        </div>
      <?php endfor; ?>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">۸. اسکرین‌شات‌ها</h3>
      <?php if ($editScreenshots): ?>
        <div style="display:flex;flex-wrap:wrap;gap:0.85rem;margin:0 0 1rem">
          <?php foreach ($editScreenshots as $shot): ?>
            <div style="display:flex;flex-direction:column;gap:0.35rem;width:150px">
              <label style="display:flex;flex-direction:column;gap:0.35rem;align-items:center;margin:0">
                <img class="thumb" src="../../<?= ad_e($shot) ?>" alt="<?= ad_e($editShotAlts[$shot] ?? '') ?>" style="width:110px;height:80px;object-fit:cover" />
                <span style="font-size:12px;word-break:break-all"><?= ad_e(basename($shot)) ?></span>
                <span style="font-size:12px"><input type="checkbox" name="keep_screenshot[]" value="<?= ad_e($shot) ?>" checked /> نگه داشتن</span>
              </label>
              <input type="text" name="screenshot_alt[<?= ad_e($shot) ?>]" maxlength="255" value="<?= ad_e($editShotAlts[$shot] ?? '') ?>" placeholder="متن جایگزین" />
            </div>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <p class="muted">هنوز اسکرین‌شاتی ثبت نشده است.</p>
      <?php endif; ?>
      <div class="form-grid">
        <div class="field">
          <label>آپلود اسکرین‌شات جدید</label>
          <input type="file" name="screenshots[]" accept="image/*" multiple />
          <div class="media-field-actions">
            <button type="button" class="btn btn-secondary" data-media-picker data-media-multi="screenshots_text">انتخاب از رسانه</button>
          </div>
        </div>
        <div class="field">
          <label>متن جایگزین اسکرین‌شات‌های جدید</label>
          <input type="text" name="screenshots_alt" maxlength="255" placeholder="مثلاً نمای صفحه اصلی پروژه" />
        </div>
        <div class="field field--span-3">
          <label>اسکرین‌شات‌های انتخاب‌شده از رسانه</label>
          <textarea name="screenshots_text" rows="3" class="media-field-paths" placeholder="assets/images/uploads/portfolio/shot1.webp" hidden></textarea>
          <div class="media-picked-blocks" data-media-blocks="screenshots_text"></div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3 class="form-section__title">دسته‌بندی، تکنولوژی و کاور</h3>
      <div class="form-grid">
        <div class="field">
          <label>دسته</label>
          <select name="category">
            <option value="websites" <?= ($edit['category'] ?? '') === 'websites' ? 'selected' : '' ?>>وبسایت</option>
            <option value="apps" <?= ($edit['category'] ?? '') === 'apps' ? 'selected' : '' ?>>اپلیکیشن</option>
          </select>
        </div>
        <div class="field">
          <label>تگ‌ها (با ویرگول)</label>
          <input type="text" name="tags" value="<?= ad_e($edit['tags'] ?? '') ?>" />
        </div>
        <div class="field">
          <label>قیمت</label>
          <input type="text" name="price" value="<?= ad_e($edit['price'] ?? '') ?>" placeholder="خالی = بدون قیمت" />
        </div>
        <div class="field field--span-3" id="techs">
          <div class="tech-toolbar">
            <div>
              <label style="margin:0">تکنولوژی‌های استفاده‌شده</label>
              <p class="hint">موارد موردنظر را تیک بزنید؛ در صفحه نمونه‌کار با آیکون نمایش داده می‌شوند.</p>
            </div>
            <button type="button" class="btn btn-secondary" data-admin-modal-open="tech-add-modal">افزودن تکنولوژی</button>
          </div>
          <div class="tech-check-grid">
            <?php foreach ($techCatalog as $tech):
                $checked = in_array($tech['id'], $editTechIds, true);
                $icon = trim((string) ($tech['icon'] ?? ''));
                $initial = mb_substr((string) ($tech['label'] ?? ''), 0, 1, 'UTF-8');
                ?>
              <label>
                <input type="checkbox" name="technologies[]" value="<?= ad_e($tech['id']) ?>" <?= $checked ? 'checked' : '' ?> />
                <?php if ($icon !== ''): ?>
                  <img src="../../<?= ad_e($icon) ?>" alt="" width="22" height="22" style="width:22px;height:22px;object-fit:contain" />
                <?php else: ?>
                  <span class="tech-icon-fallback" aria-hidden="true"><?= ad_e($initial) ?></span>
                <?php endif; ?>
                <span><?= ad_e($tech['label']) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        </div>
        <div class="field field--span-3" id="provided-services">
          <div class="tech-toolbar">
            <div>
              <label style="margin:0">خدمات ارائه‌شده</label>
              <p class="hint">خدمات این پروژه را تیک بزنید؛ در صفحه نمونه‌کار مثل تکنولوژی‌ها نمایش داده می‌شوند. ابتدا از دکمه افزودن، خدمت را بسازید.</p>
            </div>
            <button type="button" class="btn btn-secondary" data-admin-modal-open="service-add-modal">افزودن خدمت</button>
          </div>
          <?php if (!$serviceCatalog): ?>
            <p class="muted">هنوز خدمتی ثبت نشده است. با «افزودن خدمت» اولین مورد را بسازید.</p>
          <?php else: ?>
          <div class="tech-check-grid">
            <?php foreach ($serviceCatalog as $svc):
                $checked = in_array($svc['id'], $editServiceIds, true);
                $icon = trim((string) ($svc['icon'] ?? ''));
                $initial = mb_substr((string) ($svc['label'] ?? ''), 0, 1, 'UTF-8');
                ?>
              <label>
                <input type="checkbox" name="provided_services[]" value="<?= ad_e($svc['id']) ?>" <?= $checked ? 'checked' : '' ?> />
                <?php if ($icon !== ''): ?>
                  <img src="../../<?= ad_e($icon) ?>" alt="" width="22" height="22" style="width:22px;height:22px;object-fit:contain" />
                <?php else: ?>
                  <span class="tech-icon-fallback" aria-hidden="true"><?= ad_e($initial) ?></span>
                <?php endif; ?>
                <span><?= ad_e($svc['label']) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
          <?php endif; ?>
        </div>
        <div class="field field--span-2">
          <label>کاور آرشیو</label>
          <input type="text" name="cover_path" class="media-field-paths" value="<?= ad_e($edit['cover'] ?? '') ?>" hidden />
          <div class="media-picked-blocks media-picked-blocks--single" data-media-preview="cover_path" data-media-alt="cover_alt"></div>
          <div class="media-field-actions">
            <button type="button" class="btn btn-secondary" data-media-picker data-media-target="cover_path" data-media-alt-target="cover_alt">انتخاب از رسانه</button>
          </div>
          <input type="file" name="cover" accept="image/*" style="margin-top:0.5rem" />
          <p class="hint">یا فایل کاور را از دستگاه آپلود کنید.</p>
        </div>
        <div class="field">
          <label>متن جایگزین کاور (alt)</label>
          <input type="text" name="cover_alt" maxlength="255" value="<?= ad_e($editCoverAlt) ?>" placeholder="توضیح کوتاه تصویر شاخص" />
        </div>
        <div class="field">
          <label>ترتیب</label>
          <input type="number" name="sort_order" value="<?= (int) ($edit['sort_order'] ?? 0) ?>" />
        </div>
        <div class="field field--check">
          <label><input type="checkbox" name="show_price" <?= !empty($edit['show_price']) && trim((string) ($edit['price'] ?? '')) !== '' ? 'checked' : '' ?> /> نمایش قیمت در سایت</label>
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
          <input type="text" name="slug" maxlength="200" value="<?= ad_e($edit['slug'] ?? '') ?>" placeholder="خالی = از عنوان ساخته می‌شود" dir="ltr" />
          <p class="hint">آدرس صفحه: work.html?slug=...</p>
        </div>
        <div class="field field--span-2">
          <label>متا تایتل</label>
          <input type="text" name="meta_title" maxlength="255" value="<?= ad_e($edit['meta_title'] ?? '') ?>" placeholder="خالی = عنوان پروژه | آنادنت" />
        </div>
        <div class="field field--span-2">
          <label>متا دیسکریپشن</label>
          <textarea name="meta_description" rows="3" maxlength="500" placeholder="توضیح کوتاه برای نتایج گوگل (حداکثر حدود ۵۰۰ کاراکتر)"><?= ad_e($edit['meta_description'] ?? '') ?></textarea>
        </div>
        <div class="field field--span-2">
          <label>متا کیورد</label>
          <input type="text" name="meta_keywords" maxlength="500" value="<?= ad_e($edit['meta_keywords'] ?? '') ?>" placeholder="کلمه۱, کلمه۲, کلمه۳" />
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">ذخیره</button>
      <a class="btn btn-secondary" href="portfolio.php">انصراف</a>
      <?php if ($edit): ?>
        <a class="btn btn-secondary" href="../../work.html?<?= trim((string) ($edit['slug'] ?? '')) !== '' ? 'slug=' . rawurlencode((string) $edit['slug']) : 'id=' . (int) $edit['id'] ?>" target="_blank" rel="noopener">مشاهده</a>
      <?php endif; ?>
    </div>
  </form>
  <?php if ($edit && (trim((string) ($edit['price'] ?? '')) !== '' || !empty($edit['show_price']))): ?>
  <form method="post" style="margin-top:1rem" onsubmit="return confirm('قیمت این نمونه‌کار حذف شود؟');">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="clear_price" />
    <input type="hidden" name="id" value="<?= (int) $edit['id'] ?>" />
    <button class="btn btn-danger" type="submit">حذف قیمت</button>
  </form>
  <?php endif; ?>
    </div>
  </div>
</div>

<div class="admin-modal" id="tech-add-modal" hidden>
  <div class="admin-modal__backdrop" data-admin-modal-close></div>
  <div class="admin-modal__dialog admin-modal__dialog--sm">
    <div class="admin-modal__header">
      <h2>افزودن تکنولوژی</h2>
      <button type="button" class="admin-modal__close" data-admin-modal-close aria-label="بستن">×</button>
    </div>
    <div class="admin-modal__body">
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="action" value="add_technology" />
        <input type="hidden" name="return_id" value="<?= (int) ($edit['id'] ?? 0) ?>" />
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="field">
            <label>نام تکنولوژی</label>
            <input type="text" name="tech_label" required maxlength="120" placeholder="مثلاً Tailwind CSS" />
          </div>
          <div class="field">
            <label>آیکون (اختیاری)</label>
            <input type="file" name="tech_icon" accept="image/*" />
            <p class="hint">اگر خالی باشد، حرف اول نام به‌جای آیکون نشان داده می‌شود.</p>
          </div>
        </div>
        <div class="actions">
          <button class="btn" type="submit">افزودن</button>
          <button type="button" class="btn btn-secondary" data-admin-modal-close>انصراف</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="admin-modal" id="service-add-modal" hidden>
  <div class="admin-modal__backdrop" data-admin-modal-close></div>
  <div class="admin-modal__dialog admin-modal__dialog--sm">
    <div class="admin-modal__header">
      <h2>افزودن خدمت</h2>
      <button type="button" class="admin-modal__close" data-admin-modal-close aria-label="بستن">×</button>
    </div>
    <div class="admin-modal__body">
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="action" value="add_provided_service" />
        <input type="hidden" name="return_id" value="<?= (int) ($edit['id'] ?? 0) ?>" />
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="field">
            <label>نام خدمت</label>
            <input type="text" name="service_label" required maxlength="120" placeholder="مثلاً طراحی UI" />
          </div>
          <div class="field">
            <label>آیکون (اختیاری)</label>
            <input type="file" name="service_icon" accept="image/*" />
            <p class="hint">اگر خالی باشد، حرف اول نام به‌جای آیکون نشان داده می‌شود.</p>
          </div>
        </div>
        <div class="actions">
          <button class="btn" type="submit">افزودن</button>
          <button type="button" class="btn btn-secondary" data-admin-modal-close>انصراف</button>
        </div>
      </form>
    </div>
  </div>
</div>

<?php require __DIR__ . '/_layout_bottom.php'; ?>
