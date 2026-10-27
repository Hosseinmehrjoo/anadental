<h1>تماس با ما</h1>
<p class="dental-lead">برای رزرو نوبت یا مشاوره، فرم زیر را تکمیل کنید. پیام شما در پنل مدیریت ذخیره می‌شود.</p>

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
