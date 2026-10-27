<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/blog.php';
ad_require_capability('blog');

ad_blog_ensure_schema();
$editId = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$edit = $editId > 0 ? ad_blog_category_get($editId) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: blog-categories.php');
        exit;
    }
    $action = (string) ($_POST['action'] ?? 'save');

    try {
        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            ad_blog_category_delete($id);
            ad_flash_set('ok', 'دسته‌بندی حذف شد.');
            header('Location: blog-categories.php');
            exit;
        }

        $id = (int) ($_POST['id'] ?? 0);
        $name = trim((string) ($_POST['name'] ?? ''));
        $slug = trim((string) ($_POST['slug'] ?? ''));
        $description = trim((string) ($_POST['description'] ?? ''));
        $parentRaw = (int) ($_POST['parent_id'] ?? 0);
        $parentId = $parentRaw > 0 ? $parentRaw : null;

        if ($id > 0) {
            ad_blog_category_update($id, $name, $slug, $description, $parentId);
            ad_flash_set('ok', 'دسته‌بندی به‌روزرسانی شد.');
        } else {
            ad_blog_category_create($name, $slug, $description, $parentId);
            ad_flash_set('ok', 'دسته‌بندی افزوده شد.');
        }
    } catch (Throwable $e) {
        ad_flash_set('err', $e->getMessage());
        $failId = (int) ($_POST['id'] ?? 0);
        header('Location: blog-categories.php' . ($failId > 0 ? '?edit=' . $failId : ''));
        exit;
    }
    header('Location: blog-categories.php');
    exit;
}

$categories = ad_blog_categories_list();
$parentOptions = array_filter(
    $categories,
    static fn(array $c): bool => (int) $c['id'] !== (int) ($edit['id'] ?? 0)
);
$pageTitle = $edit ? 'ویرایش دسته‌بندی' : 'دسته‌بندی‌ها';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>دسته‌بندی‌ها</h1>
    <p class="muted" style="margin:0.35rem 0 0">دسته‌بندی نوشته‌های وبلاگ را اینجا مدیریت کنید.</p>
  </div>
  <div class="page-toolbar__actions">
    <a class="btn btn-secondary" href="blog.php">همه نوشته‌ها</a>
    <a class="btn" href="blog.php?new=1">نوشتن جدید</a>
  </div>
</div>

<div class="wp-cats-layout">
  <div class="card">
    <h2><?= $edit ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی' ?></h2>
    <div class="card-body">
      <form method="post">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="action" value="save" />
        <input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>" />

        <div class="field">
          <label for="cat-name">نام</label>
          <input id="cat-name" type="text" name="name" required maxlength="120" value="<?= ad_e($edit['name'] ?? '') ?>" />
          <p class="hint">نامی که در سایت نمایش داده می‌شود.</p>
        </div>
        <div class="field">
          <label for="cat-slug">نامک (اسلاگ)</label>
          <input id="cat-slug" type="text" name="slug" maxlength="140" value="<?= ad_e($edit['slug'] ?? '') ?>" />
          <p class="hint">نسخهٔ لاتین نام برای URL؛ خالی بگذارید تا خودکار ساخته شود.</p>
        </div>
        <div class="field">
          <label for="cat-parent">دسته مادر</label>
          <select id="cat-parent" name="parent_id">
            <option value="0">— بدون والد —</option>
            <?php foreach ($parentOptions as $opt): ?>
              <option value="<?= (int) $opt['id'] ?>" <?= (int) ($edit['parent_id'] ?? 0) === (int) $opt['id'] ? 'selected' : '' ?>>
                <?= ad_e($opt['name']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="field">
          <label for="cat-desc">توضیح</label>
          <textarea id="cat-desc" name="description" rows="4"><?= ad_e($edit['description'] ?? '') ?></textarea>
        </div>
        <div class="actions">
          <button class="btn" type="submit"><?= $edit ? 'به‌روزرسانی' : 'افزودن دسته‌بندی جدید' ?></button>
          <?php if ($edit): ?>
            <a class="btn btn-secondary" href="blog-categories.php">انصراف</a>
          <?php endif; ?>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <h2>دسته‌بندی‌های موجود</h2>
    <table>
      <thead>
        <tr>
          <th>نام</th>
          <th>نامک</th>
          <th>توضیح</th>
          <th>تعداد</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <?php if (!$categories): ?>
        <tr><td colspan="5" class="muted">هنوز دسته‌بندی‌ای ثبت نشده است.</td></tr>
      <?php else: ?>
        <?php foreach ($categories as $row): ?>
          <tr>
            <td>
              <strong><?= ad_e($row['name']) ?></strong>
              <?php if (!empty($row['parent_id'])): ?>
                <?php
                $parentName = '';
                foreach ($categories as $p) {
                    if ((int) $p['id'] === (int) $row['parent_id']) {
                        $parentName = (string) $p['name'];
                        break;
                    }
                }
                ?>
                <?php if ($parentName !== ''): ?>
                  <span class="muted" style="display:block;font-size:12px">زیرمجموعهٔ <?= ad_e($parentName) ?></span>
                <?php endif; ?>
              <?php endif; ?>
            </td>
            <td><code><?= ad_e($row['slug']) ?></code></td>
            <td><?= ad_e(mb_substr((string) ($row['description'] ?? ''), 0, 80)) ?: '—' ?></td>
            <td><?= (int) ($row['post_count'] ?? 0) ?></td>
            <td class="row-actions">
              <a href="blog-categories.php?edit=<?= (int) $row['id'] ?>">ویرایش</a>
              <form method="post" style="display:inline" onsubmit="return confirm('این دسته‌بندی حذف شود؟');">
                <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
                <button type="submit">حذف</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
