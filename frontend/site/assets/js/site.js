/**
 * اتصال فرم رزرو صفحه اصلی به API تماس
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var form = document.getElementById('ana_contact_form');
    if (!form || !window.DentalApi) {
      return;
    }

    form.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        var nameInput = form.querySelector('#ana_contact_name, [name="name"]');
        var phoneInput = form.querySelector('#ana_contact_phone, [name="phone"]');
        var hpInput = form.querySelector('#ana_contact_hp, [name="website"]');
        var name = nameInput ? nameInput.value.trim() : '';
        var phone = phoneInput ? phoneInput.value.trim() : '';
        var website = hpInput ? hpInput.value.trim() : '';
        var submit = form.querySelector('#ana_contact_submit, [type="submit"]');
        var statusId = 'dental-contact-status';
        var status = document.getElementById(statusId);
        if (!status) {
          status = document.createElement('p');
          status.id = statusId;
          status.setAttribute('role', 'status');
          status.style.marginTop = '12px';
          form.appendChild(status);
        }

        if (website) {
          status.textContent = 'پیام شما با موفقیت ثبت شد.';
          status.style.color = '#067647';
          form.reset();
          return;
        }

        if (!name || !phone) {
          status.textContent = 'نام و شماره تماس الزامی است.';
          status.style.color = '#b42318';
          return;
        }

        if (submit) {
          submit.disabled = true;
        }
        status.textContent = 'در حال ارسال…';
        status.style.color = '#1d264f';

        DentalApi.contact({
          name: name,
          phone: phone,
          subject: 'رزرو نوبت از صفحه اصلی',
          message: 'درخواست رزرو وقت و مشاوره تخصصی از فرم صفحه اصلی',
          website: website,
        })
          .then(function (res) {
            status.textContent = (res && res.message) || 'پیام شما با موفقیت ثبت شد.';
            status.style.color = '#067647';
            form.reset();
          })
          .catch(function (err) {
            status.textContent = (err && err.message) || 'ارسال پیام ممکن نشد.';
            status.style.color = '#b42318';
          })
          .finally(function () {
            if (submit) {
              submit.disabled = false;
            }
          });
      },
      true
    );
  });
})();
