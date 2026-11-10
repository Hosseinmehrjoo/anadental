/**
 * CKEditor 4 — آپارات، ویدیو (۱۶:۹ / ۹:۱۶)، پادکست آنادنت
 */
(function () {
  "use strict";

  if (typeof CKEDITOR === "undefined") {
    return;
  }

  function escAttr(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function escText(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;");
  }

  function normalizeMediaUrl(url) {
    url = String(url || "").trim();
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || url.charAt(0) === "/") return url;
    return "/" + url.replace(/^\/+/, "");
  }

  function aparatHash(input) {
    input = String(input || "").trim();
    if (!input) return "";
    var m =
      input.match(/aparat\.com\/v\/([^/?&#]+)/i) ||
      input.match(/videohash\/([^/?&#]+)/i) ||
      input.match(/embed\/videohash\/([^/?&#]+)/i);
    if (m) return m[1];
    if (/^[a-zA-Z0-9_-]{4,32}$/.test(input)) return input;
    return "";
  }

  function ensureAnaCkeIcons() {
    if (window.__ANA_CKE_MEDIA_ICONS__) return;
    window.__ANA_CKE_MEDIA_ICONS__ = true;
    try {
      CKEDITOR.skin.addIcon(
        "ana-aparat",
        "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3" fill="#e74c3c"/><path fill="#fff" d="M10 9.5v5l5-2.5z"/></svg>'
          )
      );
      CKEDITOR.skin.addIcon(
        "ana-video",
        "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" fill="#3090b6"/><path fill="#fff" d="M10 10v4l4-2z"/></svg>'
          )
      );
      CKEDITOR.skin.addIcon(
        "ana-podcast",
        "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1d264f"/><circle cx="12" cy="12" r="3" fill="#e7f0ea"/><path stroke="#e7f0ea" stroke-width="1.5" d="M12 4v3M12 17v3M5 12h2M17 12h2"/></svg>'
          )
      );
    } catch (e) {}
  }

  function mediaPickButton(tab, fieldId, kind) {
    return {
      type: "button",
      id: "pick_" + fieldId,
      label: "انتخاب از رسانه",
      onClick: function () {
        var dlg = this.getDialog();
        if (!window.AnaMediaPicker || typeof window.AnaMediaPicker.pick !== "function") {
          window.alert("کتابخانه رسانه آماده نیست. صفحه را یک بار رفرش کنید.");
          return false;
        }
        window.AnaMediaPicker.pick({
          kind: kind,
          onSelect: function (path) {
            dlg.getContentElement(tab, fieldId).setValue(path);
          },
        });
        return false;
      },
    };
  }

  function mediaHintHtml() {
    return (
      '<p class="muted" style="margin:6px 0 0;font-size:12px;line-height:1.65">' +
      'از دکمه «انتخاب از رسانه» استفاده کنید یا در تب دیگر از منوی <a href="media.php" target="_blank" rel="noopener">رسانه</a> فایل را آپلود کنید.' +
      "</p>"
    );
  }

  function buildAparatHtml(hash) {
    var src =
      "https://www.aparat.com/video/video/embed/videohash/" +
      escAttr(hash) +
      "/vt/frame";
    return (
      '<div class="ana-embed ana-embed--aparat" contenteditable="false" data-ana-embed="aparat">' +
      '<div class="ana-embed__ratio ana-embed__ratio--16x9">' +
      '<iframe class="ana-embed__iframe" src="' +
      src +
      '" title="ویدیو آپارات" allowfullscreen allow="fullscreen; encrypted-media" frameborder="0" loading="lazy"></iframe>' +
      "</div></div>"
    );
  }

  function buildVideoHtml(url, aspect, poster, caption) {
    var isVert = aspect === "9x16";
    var wrapClass = isVert ? "ana-video ana-video--9x16" : "ana-video ana-video--16x9";
    var ratioClass = isVert ? "ana-embed__ratio ana-embed__ratio--9x16" : "ana-embed__ratio ana-embed__ratio--16x9";
    var posterAttr = poster ? ' poster="' + escAttr(poster) + '"' : "";
    var cap =
      caption !== ""
        ? '<figcaption class="ana-embed__caption">' + escText(caption) + "</figcaption>"
        : "";
    return (
      '<figure class="ana-embed ana-embed--video" contenteditable="false" data-ana-embed="video" data-aspect="' +
      escAttr(aspect) +
      '">' +
      '<div class="' +
      wrapClass +
      '">' +
      '<div class="' +
      ratioClass +
      '">' +
      '<video class="ana-video__el" controls playsinline preload="metadata" src="' +
      escAttr(url) +
      '"' +
      posterAttr +
      "></video>" +
      "</div></div>" +
      cap +
      "</figure>"
    );
  }

  function buildPodcastHtml(url, title, subtitle, cover) {
    var coverUrl = cover ? normalizeMediaUrl(cover) : "";
    var coverBlock = coverUrl
      ? '<img class="ana-podcast__art-img" src="' + escAttr(coverUrl) + '" alt="" width="72" height="72" loading="lazy" decoding="async">'
      : '<span class="ana-podcast__art-fallback" aria-hidden="true">🎙</span>';
    var sub =
      subtitle !== ""
        ? '<span class="ana-podcast__sub">' + escText(subtitle) + "</span>"
        : "";
    return (
      '<figure class="ana-embed ana-embed--podcast" contenteditable="false" data-ana-embed="podcast">' +
      '<div class="ana-podcast">' +
      '<div class="ana-podcast__glow" aria-hidden="true"></div>' +
      '<div class="ana-podcast__shell">' +
      '<div class="ana-podcast__art">' +
      coverBlock +
      "</div>" +
      '<div class="ana-podcast__body">' +
      '<div class="ana-podcast__meta">' +
      '<strong class="ana-podcast__title">' +
      escText(title || "پادکست") +
      "</strong>" +
      sub +
      "</div>" +
      '<div class="ana-podcast__controls">' +
      '<button type="button" class="ana-podcast__play" aria-label="پخش و توقف">' +
      '<span class="ana-podcast__play-icon" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="ana-podcast__timeline">' +
      '<input type="range" class="ana-podcast__seek" value="0" min="0" max="100" step="0.1" aria-label="جلو و عقب">' +
      '<div class="ana-podcast__times"><span class="ana-podcast__cur">۰:۰۰</span><span class="ana-podcast__dur">۰:۰۰</span></div>' +
      "</div>" +
      "</div>" +
      '<audio class="ana-podcast__audio" preload="metadata" src="' +
      escAttr(url) +
      '"></audio>' +
      "</div></div></div></figure>"
    );
  }

  CKEDITOR.dialog.add("anaAparatDialog", function () {
    return {
      title: "درج ویدیو آپارات",
      minWidth: 420,
      minHeight: 100,
      contents: [
        {
          id: "tab1",
          label: "آپارات",
          elements: [
            {
              type: "text",
              id: "aparatInput",
              label: "لینک یا کد ویدیو",
              labelLayout: "vertical",
              validate: function () {
                var hash = aparatHash(this.getValue());
                if (!hash) {
                  alert("لینک آپارات معتبر نیست. مثال: https://www.aparat.com/v/xxxxx");
                  return false;
                }
                return true;
              },
            },
            {
              type: "html",
              html: '<p class="muted" style="margin:0;font-size:12px;line-height:1.6">لینک صفحه ویدیو در آپارات یا شناسه (videohash) را وارد کنید.</p>',
            },
          ],
        },
      ],
      onOk: function () {
        var hash = aparatHash(this.getContentElement("tab1", "aparatInput").getValue());
        if (!hash) return false;
        this.getParentEditor().insertHtml(buildAparatHtml(hash));
      },
    };
  });

  CKEDITOR.dialog.add("anaVideoDialog", function () {
    return {
      title: "درج ویدیو",
      minWidth: 440,
      minHeight: 120,
      contents: [
        {
          id: "tab1",
          label: "ویدیو",
          elements: [
            {
              type: "text",
              id: "videoUrl",
              label: "آدرس فایل ویدیو (MP4)",
              labelLayout: "vertical",
              validate: CKEDITOR.dialog.validate.notEmpty("آدرس ویدیو الزامی است."),
            },
            mediaPickButton("tab1", "videoUrl", "video"),
            {
              type: "select",
              id: "videoAspect",
              label: "نسبت تصویر",
              items: [
                ["افقی ۱۶:۹ (یوتیوب، آموزش)", "16x9"],
                ["عمودی ۹:۱۶ (ریلز، استوری)", "9x16"],
              ],
              default: "16x9",
            },
            {
              type: "text",
              id: "videoPoster",
              label: "تصویر پوستر (اختیاری)",
              labelLayout: "vertical",
            },
            mediaPickButton("tab1", "videoPoster", "image"),
            {
              type: "text",
              id: "videoCaption",
              label: "عنوان زیر ویدیو (اختیاری)",
              labelLayout: "vertical",
            },
            {
              type: "html",
              html: mediaHintHtml(),
            },
          ],
        },
      ],
      onOk: function () {
        var url = normalizeMediaUrl(this.getContentElement("tab1", "videoUrl").getValue());
        var aspect = this.getContentElement("tab1", "videoAspect").getValue() || "16x9";
        var poster = normalizeMediaUrl(this.getContentElement("tab1", "videoPoster").getValue());
        var caption = String(this.getContentElement("tab1", "videoCaption").getValue() || "").trim();
        if (!url) return false;
        this.getParentEditor().insertHtml(buildVideoHtml(url, aspect, poster, caption));
      },
    };
  });

  CKEDITOR.dialog.add("anaPodcastDialog", function () {
    return {
      title: "درج پادکست",
      minWidth: 440,
      minHeight: 120,
      contents: [
        {
          id: "tab1",
          label: "پادکست",
          elements: [
            {
              type: "text",
              id: "podTitle",
              label: "عنوان",
              labelLayout: "vertical",
              default: "پادکست آنادنت",
            },
            {
              type: "text",
              id: "podSub",
              label: "زیرعنوان (اختیاری)",
              labelLayout: "vertical",
            },
            {
              type: "text",
              id: "podUrl",
              label: "آدرس فایل صوتی (MP3)",
              labelLayout: "vertical",
              validate: CKEDITOR.dialog.validate.notEmpty("آدرس فایل صوتی الزامی است."),
            },
            mediaPickButton("tab1", "podUrl", "audio"),
            {
              type: "text",
              id: "podCover",
              label: "کاور (اختیاری)",
              labelLayout: "vertical",
            },
            mediaPickButton("tab1", "podCover", "image"),
            {
              type: "html",
              html: mediaHintHtml(),
            },
          ],
        },
      ],
      onOk: function () {
        var title = String(this.getContentElement("tab1", "podTitle").getValue() || "").trim();
        var subtitle = String(this.getContentElement("tab1", "podSub").getValue() || "").trim();
        var url = normalizeMediaUrl(this.getContentElement("tab1", "podUrl").getValue());
        var cover = String(this.getContentElement("tab1", "podCover").getValue() || "").trim();
        if (!url) return false;
        this.getParentEditor().insertHtml(buildPodcastHtml(url, title, subtitle, cover));
      },
    };
  });

  CKEDITOR.plugins.add("anamedia", {
    init: function (editor) {
      ensureAnaCkeIcons();
      editor.addCommand("insertAnaAparat", new CKEDITOR.dialogCommand("anaAparatDialog"));
      editor.addCommand("insertAnaVideo", new CKEDITOR.dialogCommand("anaVideoDialog"));
      editor.addCommand("insertAnaPodcast", new CKEDITOR.dialogCommand("anaPodcastDialog"));
      editor.ui.addButton("AnaAparat", {
        label: "ویدیو آپارات",
        command: "insertAnaAparat",
        toolbar: "insert,10",
        icon: "ana-aparat",
      });
      editor.ui.addButton("AnaVideo", {
        label: "ویدیو ۱۶:۹ / ۹:۱۶",
        command: "insertAnaVideo",
        toolbar: "insert,20",
        icon: "ana-video",
      });
      editor.ui.addButton("AnaPodcast", {
        label: "پادکست",
        command: "insertAnaPodcast",
        toolbar: "insert,30",
        icon: "ana-podcast",
      });
    },
  });
})();
