(function () {
  "use strict";

  var CHUNK_BYTES = 3 * 1024 * 1024;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function randomUploadId() {
    var a = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) {
      crypto.getRandomValues(a);
    } else {
      for (var i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    }
    return Array.prototype.map
      .call(a, function (b) {
        return ("0" + b.toString(16)).slice(-2);
      })
      .join("");
  }

  function uploadStatusMessage(xhr) {
    if (xhr.status === 413) {
      return "حجم فایل از حد مجاز سرور بیشتر است (حداکثر حدود ۲۰۰ مگابایت).";
    }
    if (xhr.status === 408 || xhr.status === 0) {
      return "آپلود قطع شد (تایم‌اوت). اتصال را بررسی کنید یا دوباره تلاش کنید.";
    }
    if (xhr.status === 402) {
      return "CDN مسیر آپلود را مسدود کرده (۴۰۲). صفحه را رفرش کنید؛ آپلود تکه‌ای فعال است.";
    }
    if (xhr.status === 403 || xhr.status === 401) {
      return "دسترسی منقضی شده؛ صفحه را رفرش کنید و دوباره وارد شوید.";
    }
    if (xhr.status >= 400) {
      return "خطا در آپلود (کد " + xhr.status + ").";
    }
    return "پاسخ سرور نامعتبر است.";
  }

  function postForm(fd) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "videos-upload.php", true);
      xhr.responseType = "text";
      xhr.onload = function () {
        var data;
        try {
          data = JSON.parse(xhr.responseText || "{}");
        } catch (err) {
          reject(new Error(uploadStatusMessage(xhr)));
          return;
        }
        if (!data.ok) {
          reject(new Error(data.message || uploadStatusMessage(xhr)));
          return;
        }
        resolve(data);
      };
      xhr.onerror = function () {
        reject(new Error("خطای شبکه. دوباره تلاش کنید."));
      };
      xhr.send(fd);
    });
  }

  function uploadChunked(file, csrf, title, onProgress) {
    var uploadId = randomUploadId();
    var total = Math.max(1, Math.ceil(file.size / CHUNK_BYTES));
    var chain = Promise.resolve();

    for (var i = 0; i < total; i++) {
      chain = chain.then(function (idx) {
        return function () {
          var start = idx * CHUNK_BYTES;
          var end = Math.min(file.size, start + CHUNK_BYTES);
          var blob = file.slice(start, end);
          var fd = new FormData();
          fd.append("csrf", csrf);
          fd.append("chunk_mode", "1");
          fd.append("upload_id", uploadId);
          fd.append("chunk_index", String(idx));
          fd.append("total_chunks", String(total));
          fd.append("filename", file.name);
          fd.append("video_file", blob, file.name);
          if (title) fd.append("title", title);
          return postForm(fd).then(function (data) {
            if (onProgress) onProgress(Math.round(((idx + 1) / total) * 100));
            return data;
          });
        };
      }(i));
    }

    return chain;
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

      // Never send the video file with «افزودن» — WCDN blocks large POST bodies (402/408).
      fileInput.removeAttribute("name");

      if (!hasUrl && hasFile) {
        e.preventDefault();
        if (statusEl) {
          statusEl.textContent =
            "اول دکمه «بارگذاری ویدیو» را بزنید تا آدرس پر شود؛ بعد «افزودن».";
        }
        fileInput.setAttribute("name", "video_file");
        fileInput.focus();
        return;
      }
      if (!hasUrl && !hasFile) {
        e.preventDefault();
        if (statusEl) statusEl.textContent = "آدرس ویدیو را وارد کنید یا فایل را بارگذاری کنید.";
        urlInput.focus();
        fileInput.setAttribute("name", "video_file");
        return;
      }
    });

    uploadBtn.addEventListener("click", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) {
        if (statusEl) statusEl.textContent = "ابتدا یک فایل ویدیو انتخاب کنید.";
        fileInput.focus();
        return;
      }

      var title = titleInput && titleInput.value ? titleInput.value : "";
      var csrf = csrfInput.value;

      uploadBtn.disabled = true;
      if (statusEl) statusEl.textContent = "در حال بارگذاری…";
      if (progressWrap) progressWrap.hidden = false;
      if (progressBar) progressBar.style.width = "0%";
      if (progressPct) progressPct.textContent = "0%";

      function setPct(pct) {
        if (progressBar) progressBar.style.width = pct + "%";
        if (progressPct) progressPct.textContent = pct + "%";
      }

      uploadChunked(file, csrf, title, setPct)
        .then(function (data) {
          if (data.url) urlInput.value = data.url;
          if (statusEl) statusEl.textContent = data.message || "بارگذاری انجام شد.";
          setPct(100);
          fileInput.value = "";
        })
        .catch(function (err) {
          if (statusEl) statusEl.textContent = err.message || "بارگذاری ناموفق بود.";
        })
        .finally(function () {
          uploadBtn.disabled = false;
        });
    });
  });
})();
