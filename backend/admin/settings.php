<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/seo.php';
ad_require_role(['admin']);

ad_seo_ensure_robots_file();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: settings.php');
        exit;
    }
    $action = (string) ($_POST['action'] ?? 'save_robots');
    try {
        if ($action === 'save_robots') {
            ad_seo_write_robots((string) ($_POST['robots'] ?? ''));
            ad_flash_set('ok', 'robots.txt ذخیره شد.');
        } elseif ($action === 'reset_robots') {
            ad_seo_write_robots(ad_seo_default_robots());
            ad_flash_set('ok', 'robots.txt به حالت پیش‌فرض برگشت.');
        } elseif ($action === 'refresh_seo') {
            ad_seo_refresh_public_files();
            ad_flash_set('ok', 'sitemap.xml و llms.txt بازتولید شدند.');
        }
    } catch (RuntimeException $e) {
        ad_flash_set('err', $e->getMessage());
    } catch (Throwable $e) {
        ad_flash_set('err', 'ذخیره تنظیمات ممکن نشد.');
    }
    header('Location: settings.php');
    exit;
}

$robots = ad_seo_read_robots();
$sitemapUrl = ad_seo_absolute_url('sitemap.xml');
$llmsUrl = ad_seo_absolute_url('llms.txt');
$robotsUrl = ad_seo_absolute_url('robots.txt');

$pageTitle = 'تنظیمات';
require __DIR__ . '/_layout_top.php';
?>
<div class="page-toolbar">
  <div>
    <h1>تنظیمات</h1>
    <p class="muted" style="margin:0.35rem 0 0">فعلاً فقط ویرایش robots.txt — بخش‌های بیشتر به‌زودی.</p>
  </div>
</div>

<div class="card">
  <h2>robots.txt</h2>
  <p class="muted">آدرس عمومی: <a href="<?= ad_e($robotsUrl) ?>" target="_blank" rel="noopener"><?= ad_e($robotsUrl) ?></a></p>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <div class="field">
      <label for="robots">محتوای فایل</label>
      <textarea id="robots" name="robots" rows="14" style="width:100%;font-family:ui-monospace,monospace;font-size:13px;direction:ltr;text-align:left" required><?= ad_e($robots) ?></textarea>
    </div>
    <div class="actions">
      <button class="btn" type="submit" name="action" value="save_robots">ذخیره robots.txt</button>
      <button class="btn btn-secondary" type="submit" name="action" value="reset_robots" onclick="return confirm('به پیش‌فرض برگردد؟');">بازنشانی پیش‌فرض</button>
    </div>
  </form>
</div>

<div class="card">
  <h2>نقشه سایت و llms.txt</h2>
  <p class="muted" style="margin:0 0 0.75rem">این فایل‌ها با انتشار/ویرایش/حذف مقالات به‌صورت خودکار به‌روز می‌شوند.</p>
  <ul style="margin:0 0 1rem;padding-inline-start:1.25rem;line-height:1.8">
    <li><a href="<?= ad_e($sitemapUrl) ?>" target="_blank" rel="noopener">sitemap.xml</a></li>
    <li><a href="<?= ad_e($llmsUrl) ?>" target="_blank" rel="noopener">llms.txt</a></li>
  </ul>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="action" value="refresh_seo" />
    <button class="btn btn-secondary" type="submit">بازتولید همین حالا</button>
  </form>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
