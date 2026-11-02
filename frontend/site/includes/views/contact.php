<h1>تماس با ما</h1>
<p class="dental-lead">برای رزرو نوبت، مشاوره یا پیگیری درمان با مطب تماس بگیرید یا فرم زیر را تکمیل کنید.</p>

<div class="ana-contact-page">
  <section class="ana-contact-page__info ana-mag-box">
    <h2>اطلاعات تماس</h2>
    <dl class="ana-contact-dl">
      <div>
        <dt>آدرس مطب اول</dt>
        <dd>جنت آباد مركزى ، روبروى بلوار بعثت رو به رو مسجد جامع ، ساختمان بانك شهر ، پلاک ۱ طبقه دوم</dd>
      </div>
      <div>
        <dt>آدرس مطب دوم</dt>
        <dd>پاسداران بالاتر از گل نبی،روبروی نگارستان ششم جنب شیرینی فروشی تیفانی ساختمان تندیس ۱واحد۱۴طبقه۴</dd>
      </div>
      <div>
        <dt>شماره تماس</dt>
        <dd><a href="tel:02191300511">02191300511</a></dd>
      </div>
      <div>
        <dt>وبسایت</dt>
        <dd><a href="https://drbaghi.com" target="_blank" rel="noopener noreferrer">drbaghi.com</a></dd>
      </div>
      <div>
        <dt>اینستاگرام</dt>
        <dd><a href="https://instagram.com/dr.arzhang.baghi" target="_blank" rel="noopener noreferrer">@dr.arzhang.baghi</a></dd>
      </div>
      <div>
        <dt>نظام پزشکی</dt>
        <dd><a href="https://membersearch.irimc.org/member/profile?id=4df7e036-aaab-4c12-b674-1a948219c938" target="_blank" rel="noopener noreferrer">مشاهده پروفایل در سامانه نظام پزشکی</a></dd>
      </div>
    </dl>

    <h3>مشخصات پروانه</h3>
    <table class="ana-contact-license">
      <tbody>
        <tr><th scope="row">شهر مجاز پروانه</th><td>استان تهران- شهرستان تهران- شهر تهران</td></tr>
        <tr><th scope="row">نوع پروانه</th><td>پروانه طبابت</td></tr>
        <tr><th scope="row">مدرک مربوطه</th><td>دکترای حرفه ای - دندانپزشکی - مریلند آمریکا</td></tr>
        <tr><th scope="row">تاریخ انقضا</th><td>1409/06/30</td></tr>
      </tbody>
    </table>
  </section>

  <section class="ana-contact-page__map">
    <h2>موقعیت روی نقشه</h2>
    <?php readfile(__DIR__ . '/../map-neshan.fragment.html'); ?>
  </section>

  <section class="ana-contact-page__form ana-mag-box">
    <h2>ارسال پیام</h2>
    <p class="muted">پیام شما در پنل مدیریت ذخیره می‌شود.</p>
    <form class="dental-form" id="dental-contact-page-form">
      <input type="text" name="website" value="" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
      <label>نام و نام خانوادگی<input name="name" required maxlength="120"></label>
      <label>شماره تماس<input name="phone" required maxlength="40" inputmode="tel" placeholder="0912…"></label>
      <label>ایمیل (اختیاری)<input name="email" type="email" maxlength="180"></label>
      <label>موضوع<input name="subject" maxlength="200" value="پیام از صفحه تماس"></label>
      <label>پیام<textarea name="message" rows="6" required maxlength="5000"></textarea></label>
      <button type="submit">ارسال پیام</button>
      <p id="dental-contact-page-status" role="status"></p>
    </form>
  </section>
</div>
<script>
document.getElementById('dental-contact-page-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  var form = e.currentTarget;
  var status = document.getElementById('dental-contact-page-status');
  var btn = form.querySelector('[type=submit]');
  btn.disabled = true;
  status.textContent = 'در حال ارسال…';
  try {
    var payload = Object.fromEntries(new FormData(form).entries());
    var res = await DentalApi.contact(payload);
    status.textContent = res.message || 'پیام ثبت شد.';
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'ارسال ممکن نشد.';
  } finally {
    btn.disabled = false;
  }
});
</script>
