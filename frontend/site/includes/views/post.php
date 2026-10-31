<?php
/** @var array<string,mixed> $post */
/** @var list<array<string,mixed>> $comments */
/** @var list<array<string,mixed>> $related */
$related = $related ?? [];
$cat = $post['categories'][0]['name'] ?? 'مجله آنادنت';
$cover = !empty($post['cover']) ? '/' . ltrim((string) $post['cover'], '/') : '';
$minutes = dental_reading_minutes((string) ($post['content'] ?? '') . ' ' . (string) ($post['excerpt'] ?? ''));
$postSlug = (string) ($post['slug'] ?? '');
?>
<article class="ana-post">
  <header class="ana-post__titlebar">
    <h1><?= dental_e((string) $post['title']) ?></h1>
  </header>

  <?php if ($cover !== ''): ?>
    <figure class="ana-post__cover">
      <img src="<?= dental_e($cover) ?>" alt="<?= dental_e((string) $post['title']) ?>" fetchpriority="high" decoding="async">
    </figure>
  <?php endif; ?>

  <div class="ana-post__layout">
    <div class="ana-post__main">
      <div class="ana-post__facts" aria-label="خلاصه مقاله">
        <p class="ana-post__facts-label">چکیده:</p>
        <ul>
          <li><span>دسته</span><strong><?= dental_e((string) $cat) ?></strong></li>
          <li><span>تاریخ</span><strong><?= dental_e(dental_format_date((string) ($post['published_at'] ?? ''))) ?></strong></li>
          <li><span>دیدگاه</span><strong><?= dental_e(dental_fa_digits((string) (int) ($post['comment_count'] ?? count($comments)))) ?></strong></li>
          <li><span>زمان مطالعه</span><strong><?= dental_e($minutes) ?></strong></li>
        </ul>
      </div>

      <?php if (!empty($post['excerpt'])): ?>
        <p class="ana-post__lead"><?= dental_e((string) $post['excerpt']) ?></p>
      <?php endif; ?>

      <div class="ana-post__body-box">
        <div class="content ana-post__content" id="ana-post-content">
          <?= $post['content'] ?? '' ?>
        </div>
      </div>

      <section class="dental-comments" id="comments">
        <h2>نظرات</h2>
        <div id="dental-comments-list">
          <?php if (!$comments): ?>
            <p class="dental-empty">هنوز نظری ثبت نشده است.</p>
          <?php else: ?>
            <?php
            $render = function (array $nodes) use (&$render): void {
                foreach ($nodes as $node) {
                    echo '<div class="dental-comment">';
                    echo '<strong>' . dental_e((string) ($node['author_name'] ?? '')) . '</strong>';
                    echo '<div>' . nl2br(dental_e((string) ($node['body'] ?? ''))) . '</div>';
                    if (!empty($node['children']) && is_array($node['children'])) {
                        echo '<div class="dental-comment__children">';
                        $render($node['children']);
                        echo '</div>';
                    }
                    echo '</div>';
                }
            };
            $render($comments);
            ?>
          <?php endif; ?>
        </div>
        <h3>ثبت نظر</h3>
        <form class="dental-form" id="dental-comment-form">
          <input type="hidden" name="slug" value="<?= dental_e($postSlug) ?>">
          <input type="text" name="website" value="" tabindex="-1" autocomplete="off" class="ana-contact-form__hp" aria-hidden="true">
          <label>نام<input name="name" required maxlength="120"></label>
          <label>ایمیل (اختیاری)<input name="email" type="email" maxlength="180"></label>
          <label>متن نظر<textarea name="body" rows="5" required maxlength="5000"></textarea></label>
          <button type="submit">ارسال نظر</button>
          <p id="dental-comment-status" role="status"></p>
        </form>
      </section>
    </div>

    <aside class="ana-mag-side ana-post__side">
      <nav class="ana-post-toc ana-mag-box" id="ana-post-toc" aria-labelledby="ana-post-toc-title" hidden>
        <h2 id="ana-post-toc-title">آنچه در این مطلب می‌خوانید</h2>
        <ol class="ana-post-toc__list" id="ana-post-toc-list"></ol>
      </nav>

      <section class="ana-mag-box">
        <h2>پربحث‌ترین مقالات</h2>
        <p class="ana-mag-box__lead">مقالاتی که بیشتر خوانده شده‌اند.</p>
        <ul>
          <?php foreach ($related as $item): ?>
            <li><a href="/post/<?= urlencode((string) $item['slug']) ?>"><?= dental_e((string) $item['title']) ?></a></li>
          <?php endforeach; ?>
        </ul>
      </section>
      <section class="ana-mag-box ana-follow">
        <h2>ما را دنبال کنید</h2>
        <p>در شبکه‌های اجتماعی با ما همراه شوید.</p>
        <div class="ana-follow__links">
          <a href="https://t.me/+989125142254" aria-label="تلگرام">تلگرام</a>
          <a href="https://wa.me/+989125142254" aria-label="واتس‌اپ">واتس‌اپ</a>
          <a href="tel:02191300511" aria-label="تماس">تماس</a>
        </div>
      </section>
    </aside>
  </div>
</article>
<script>
(function () {
  var content = document.getElementById('ana-post-content');
  var toc = document.getElementById('ana-post-toc');
  var list = document.getElementById('ana-post-toc-list');
  if (!content || !toc || !list) return;

  var headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  var slugify = function (text, index) {
    var base = String(text || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]+/g, '')
      .slice(0, 48);
    return base || 'section-' + index;
  };

  headings.forEach(function (heading, index) {
    if (!heading.id) {
      var id = slugify(heading.textContent, index);
      var unique = id;
      var n = 1;
      while (document.getElementById(unique)) {
        unique = id + '-' + n;
        n += 1;
      }
      heading.id = unique;
    }
    var li = document.createElement('li');
    li.className = heading.tagName === 'H3' ? 'ana-post-toc__item ana-post-toc__item--sub' : 'ana-post-toc__item';
    var a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent.trim();
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(heading.id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + heading.id);
    });
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.hidden = false;

  var tocLinks = list.querySelectorAll('a');
  if (!('IntersectionObserver' in window) || !tocLinks.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        tocLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-20% 0px -55% 0px', threshold: 0 }
  );

  headings.forEach(function (h) {
    observer.observe(h);
  });
})();

document.getElementById('dental-comment-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  var form = e.currentTarget;
  var status = document.getElementById('dental-comment-status');
  var btn = form.querySelector('[type=submit]');
  btn.disabled = true;
  status.textContent = 'در حال ارسال…';
  try {
    var payload = Object.fromEntries(new FormData(form).entries());
    var res = await DentalApi.commentCreate(payload);
    status.textContent = res.message || 'نظر ثبت شد.';
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'ارسال نظر ممکن نشد.';
  } finally {
    btn.disabled = false;
  }
});
</script>
