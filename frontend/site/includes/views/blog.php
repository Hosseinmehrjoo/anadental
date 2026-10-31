<?php
/** @var list<array<string,mixed>> $posts */
/** @var list<array<string,mixed>> $categories */
/** @var string $activeCategory */

$popular = $posts;
usort($popular, static function (array $a, array $b): int {
    $ca = (int) ($a['comment_count'] ?? 0);
    $cb = (int) ($b['comment_count'] ?? 0);
    if ($ca !== $cb) {
        return $cb <=> $ca;
    }
    return strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? ''));
});
$popular = array_slice($popular, 0, 4);

$card = static function (array $post, bool $feature = false): void {
    $href = '/post/' . urlencode((string) $post['slug']);
    $cover = !empty($post['cover'])
        ? '/' . ltrim((string) $post['cover'], '/')
        : '/assets/media/2025/09/logo.webp';
    $cat = $post['categories'][0]['name'] ?? 'مجله آنادنت';
    $excerpt = (string) ($post['excerpt'] ?? '');
    ?>
    <article class="ana-mag-card<?= $feature ? ' ana-mag-card--feature' : '' ?>">
      <a class="ana-mag-card__media" href="<?= dental_e($href) ?>">
        <img src="<?= dental_e($cover) ?>" alt="<?= dental_e((string) $post['title']) ?>" loading="lazy" width="640" height="400">
      </a>
      <div class="ana-mag-card__body">
        <span class="ana-mag-card__cat"><?= dental_e((string) $cat) ?></span>
        <h2><a href="<?= dental_e($href) ?>"><?= dental_e((string) $post['title']) ?></a></h2>
        <?php if ($excerpt !== ''): ?><p><?= dental_e($excerpt) ?></p><?php endif; ?>
        <div class="ana-mag-card__foot">
          <a class="ana-mag-more" href="<?= dental_e($href) ?>">بیشتر بخوانید</a>
          <time><?= dental_e(dental_format_date((string) ($post['published_at'] ?? ''))) ?></time>
        </div>
      </div>
    </article>
    <?php
};
?>
<div class="ana-mag">
  <header class="ana-mag-head">
    <h1>مجله آنادنت</h1>
    <p>مقالات تخصصی ایمپلنت و مراقبت از دندان</p>
  </header>

  <?php if (!$posts): ?>
    <div class="dental-empty">هنوز مقاله‌ای منتشر نشده است.</div>
  <?php else: ?>
    <div class="ana-mag-layout">
      <div class="ana-mag-main">
        <nav class="ana-mag-filters" aria-label="دسته‌بندی مقالات">
          <a href="/blog.php" class="<?= $activeCategory === '' ? 'is-active' : '' ?>">همه مطالب</a>
          <?php foreach ($categories as $cat): ?>
            <a href="/blog.php?category=<?= urlencode((string) $cat['slug']) ?>"
               class="<?= $activeCategory === (string) $cat['slug'] ? 'is-active' : '' ?>">
              <?= dental_e((string) $cat['name']) ?>
            </a>
          <?php endforeach; ?>
        </nav>
        <div class="ana-mag-grid">
          <?php foreach ($posts as $post) { $card($post, false); } ?>
        </div>
      </div>
      <aside class="ana-mag-side">
        <section class="ana-mag-box">
          <h2>پربحث‌ترین مقالات</h2>
          <p class="ana-mag-box__lead">مقالاتی که بیشتر خوانده شده‌اند.</p>
          <ul>
            <?php foreach ($popular as $item): ?>
              <li><a href="/post/<?= urlencode((string) $item['slug']) ?>"><?= dental_e((string) $item['title']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </section>
      </aside>
    </div>

    <form class="ana-news ana-news--banner" id="ana-news-form-blog">
      <p>برای اطلاع از تازه‌ترین مطالب مجله، ایمیل خود را وارد کنید.</p>
      <label class="ana-news__field">
        <span class="visually-hidden">ایمیل</span>
        <input type="email" name="email" required placeholder="ایمیل خود را وارد کنید…" autocomplete="email">
        <button type="submit">ارسال</button>
      </label>
      <p class="ana-news__status" role="status"></p>
    </form>
  <?php endif; ?>
</div>
<script>
document.getElementById('ana-news-form-blog')?.addEventListener('submit', function (event) {
  event.preventDefault();
  var form = event.currentTarget;
  var status = form.querySelector('.ana-news__status');
  var email = (form.querySelector('[name=email]') || {}).value || '';
  var btn = form.querySelector('button');
  if (!window.DentalApi) { status.textContent = 'ارسال ممکن نشد.'; return; }
  btn.disabled = true;
  status.textContent = 'در حال ثبت…';
  DentalApi.contact({
    name: 'عضو خبرنامه',
    email: email.trim(),
    phone: '',
    subject: 'عضویت خبرنامه مجله',
    message: 'درخواست عضویت در خبرنامه با ایمیل ' + email.trim(),
    website: ''
  }).then(function (res) {
    status.textContent = (res && res.message) || 'ایمیل شما ثبت شد.';
    form.reset();
  }).catch(function (err) {
    status.textContent = (err && err.message) || 'ثبت ایمیل ممکن نشد.';
  }).finally(function () { btn.disabled = false; });
});
</script>
