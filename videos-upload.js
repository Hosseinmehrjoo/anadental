(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var form = document.getElementById("ana-video-form");
    if (!form) return;

    var uploadBtn = document.getElementById("ana-video-upload-btn");
    var fileInput = document.getElementById("ana-video-file");
    var urlInput = document.getElementById("ana-video-url");
    var progressWrap = document.getElementById("ana-video-upload-progress");
    var progressBar = document.getElementById("ana-video-upload-bar");
    var progressPct = document.getElementById("ana-video-upload-pct");
    var statusEl = document.getElementById("ana-video-upload-status");
    var csrfInput = form.querySelector('[name="csrf"]');
    var titleInput = form.querySelector('[name="title"]');

    if (!uploadBtn || !fileInput || !urlInput || !csrfInput) return;

    form.addEventListener("submit", function (e) {
      var hasUrl = String(urlInput.value || "").trim() !== "";
      var hasFile = fileInput.files && fileInput.files.length > 0;
      if (!hasUrl && !hasFile) {
        e.preventDefault();
        if (statusEl) statusEl.textContent = "آدرس ویدیو را وارد کنید یا فایل را بارگذاری کنید.";
        urlInput.focus();
      }
    });

    uploadBtn.addEventListener("click", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) {
        if (statusEl) statusEl.textContent = "ابتدا یک فایل ویدیو انتخاب کنید.";
        fileInput.focus();
        return;
      }

      var fd = new FormData();
      fd.append("csrf", csrfInput.value);
      fd.append("video_file", file);
      if (titleInput && titleInput.value) {
        fd.append("title", titleInput.value);
      }

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "videos-upload.php", true);
      xhr.responseType = "text";

      uploadBtn.disabled = true;
      if (statusEl) statusEl.textContent = "در حال بارگذاری…";
      if (progressWrap) progressWrap.hidden = false;
      if (progressBar) progressBar.style.width = "0%";
      if (progressPct) progressPct.textContent = "0%";

      xhr.upload.onprogress = function (ev) {
        if (!ev.lengthComputable) return;
        var pct = Math.min(100, Math.round((ev.loaded / ev.total) * 100));
        if (progressBar) progressBar.style.width = pct + "%";
        if (progressPct) progressPct.textContent = pct + "%";
      };

      xhr.onload = function () {
        uploadBtn.disabled = false;
        var data;
        try {
          data = JSON.parse(xhr.responseText || "{}");
        } catch (err) {
          if (statusEl) {
            if (xhr.status === 413) {
              statusEl.textContent =
                "حجم فایل از حد مجاز سرور بیشتر است (حداکثر حدود ۲۰۰ مگابایت).";
            } else if (xhr.status === 408 || xhr.status === 0) {
              statusEl.textContent =
                "آپلود قطع شد (تایم‌اوت). اتصال را بررسی کنید یا فایل کوچک‌تر آپلود کنید.";
            } else if (xhr.status === 403 || xhr.status === 401) {
              statusEl.textContent = "دسترسی منقضی شده؛ صفحه را رفرش کنید و دوباره وارد شوید.";
            } else {
              statusEl.textContent =
                xhr.status >= 400
                  ? "خطا در آپلود (کد " + xhr.status + ")."
                  : "پاسخ سرور نامعتبر است.";
            }
          }
          return;
        }
        if (data.ok && data.url) {
          urlInput.value = data.url;
          if (statusEl) statusEl.textContent = data.message || "بارگذاری انجام شد.";
          if (progressBar) progressBar.style.width = "100%";
          if (progressPct) progressPct.textContent = "100%";
          fileInput.value = "";
        } else {
          if (statusEl) statusEl.textContent = data.message || "بارگذاری ناموفق بود.";
        }
      };

      xhr.onerror = function () {
        uploadBtn.disabled = false;
        if (statusEl) statusEl.textContent = "خطای شبکه. دوباره تلاش کنید.";
      };

      xhr.send(fd);
    });
  });
})();
