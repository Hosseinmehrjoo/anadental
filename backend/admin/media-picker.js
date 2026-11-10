(function () {
  "use strict";

  var modal = null;
  var grid = null;
  var statusEl = null;
  var searchEl = null;
  var footerEl = null;
  var confirmBtn = null;
  var countEl = null;
  var titleEl = null;
  var hintEl = null;
  var selectAllBtn = null;
  var clearBtn = null;
  var activeBtn = null;
  var cache = null;
  /** @type {Object.<string, string>} */
  var selected = {};
  var pickerCallback = null;
  var pickerFilter = "any";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function selectedPaths() {
    return Object.keys(selected);
  }

  function isMultiField() {
    return !!(activeBtn && activeBtn.getAttribute("data-media-multi"));
  }

  function syncChrome() {
    var multi = isMultiField();
    if (modal) modal.classList.toggle("is-multi-mode", multi);
    if (selectAllBtn) selectAllBtn.hidden = !multi;
    if (clearBtn) clearBtn.hidden = !multi;
    if (footerEl) footerEl.hidden = !multi;
    if (titleEl) {
      var filterHint = filterLabel(pickerFilter);
      titleEl.textContent = multi ? "انتخاب چند تصویر از رسانه" : "انتخاب از رسانه — " + filterHint;
    }
    if (hintEl) {
      hintEl.textContent = multi
        ? "چند تصویر را علامت بزنید، سپس «افزودن تصاویر» را بزنید."
        : "روی تصویر کلیک کنید تا انتخاب شود.";
    }
    if (!multi) return;
    if (!confirmBtn || !footerEl) return;
    var count = selectedPaths().length;
    confirmBtn.disabled = count < 1;
    if (countEl) {
      countEl.textContent = count ? count + " مورد انتخاب شده" : "هنوز موردی انتخاب نشده";
    }
    confirmBtn.textContent = count > 0 ? "افزودن " + count + " تصویر" : "افزودن تصاویر";
  }

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "ad-media-picker";
    modal.className = "ad-media-picker";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="ad-media-picker__backdrop" data-media-close></div>' +
      '<div class="ad-media-picker__dialog" role="dialog" aria-modal="true" aria-labelledby="ad-media-picker-title">' +
        '<div class="ad-media-picker__header">' +
          '<div class="ad-media-picker__heading">' +
            '<h2 id="ad-media-picker-title">انتخاب از رسانه</h2>' +
            '<p class="ad-media-picker__hint" id="ad-media-picker-hint"></p>' +
          "</div>" +
          '<button type="button" class="ad-media-picker__close" data-media-close aria-label="بستن">×</button>' +
        "</div>" +
        '<div class="ad-media-picker__toolbar">' +
          '<input type="search" id="ad-media-picker-search" placeholder="جستجو در نام یا متن جایگزین…" />' +
          '<button type="button" class="btn btn-secondary" id="ad-media-picker-select-all" hidden>انتخاب همه</button>' +
          '<button type="button" class="btn btn-secondary" id="ad-media-picker-clear" hidden>پاک کردن انتخاب</button>' +
          '<a class="btn btn-secondary" href="media.php" target="_blank" rel="noopener">مدیریت رسانه</a>' +
        "</div>" +
        '<p class="ad-media-picker__status" id="ad-media-picker-status" hidden></p>' +
        '<div class="ad-media-picker__grid" id="ad-media-picker-grid"></div>' +
        '<div class="ad-media-picker__footer" id="ad-media-picker-footer" hidden>' +
          '<span class="ad-media-picker__count" id="ad-media-picker-count">هنوز موردی انتخاب نشده</span>' +
          '<button type="button" class="btn" id="ad-media-picker-confirm" disabled>افزودن تصاویر</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);
    grid = qs("#ad-media-picker-grid", modal);
    statusEl = qs("#ad-media-picker-status", modal);
    searchEl = qs("#ad-media-picker-search", modal);
    footerEl = qs("#ad-media-picker-footer", modal);
    confirmBtn = qs("#ad-media-picker-confirm", modal);
    countEl = qs("#ad-media-picker-count", modal);
    titleEl = qs("#ad-media-picker-title", modal);
    hintEl = qs("#ad-media-picker-hint", modal);
    selectAllBtn = qs("#ad-media-picker-select-all", modal);
    clearBtn = qs("#ad-media-picker-clear", modal);

    modal.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-media-close") !== null) {
        closePicker();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) closePicker();
    });
    if (searchEl) {
      searchEl.addEventListener("input", function () {
        renderGrid(cache || [], searchEl.value);
      });
    }
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        commitMultiSelection();
      });
    }
    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectAllVisible();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        selected = {};
        renderGrid(cache || [], searchEl ? searchEl.value : "");
      });
    }
    return modal;
  }

  function setStatus(text, isErr) {
    if (!statusEl) return;
    if (!text) {
      statusEl.hidden = true;
      statusEl.textContent = "";
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = text;
    statusEl.classList.toggle("is-err", !!isErr);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findItemButton(path) {
    if (!grid) return null;
    var buttons = grid.querySelectorAll(".ad-media-picker__item");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute("data-path") === path) return buttons[i];
    }
    return null;
  }

  function visibleItems() {
    if (!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll(".ad-media-picker__item"));
  }

  function selectAllVisible() {
    visibleItems().forEach(function (btn) {
      var path = btn.getAttribute("data-path") || "";
      if (!path) return;
      selected[path] = btn.getAttribute("data-alt") || "";
      btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", "true");
    });
    syncChrome();
  }

  function itemKind(item) {
    var mime = String((item && item.mime) || "").toLowerCase();
    var path = String((item && item.path) || "").toLowerCase();
    if (mime.indexOf("video/") === 0) return "video";
    if (mime.indexOf("audio/") === 0) return "audio";
    if (mime.indexOf("image/") === 0) return "image";
    if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(path)) return "video";
    if (/\.(mp3|m4a|ogg|wav)(\?|$)/.test(path)) return "audio";
    if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/.test(path)) return "image";
    return "file";
  }

  function matchesFilter(item, kind) {
    kind = kind || "any";
    if (kind === "any") return true;
    if (kind === "image") return itemKind(item) === "image";
    if (kind === "video") return itemKind(item) === "video";
    if (kind === "audio") return itemKind(item) === "audio";
    return true;
  }

  function thumbHtml(item) {
    var path = String(item.path || "");
    var kind = itemKind(item);
    if (kind === "image") {
      return (
        '<span class="ad-media-picker__thumb"><img src="../../' +
        escapeHtml(path) +
        '" alt="" loading="lazy" /></span>'
      );
    }
    var label = kind === "video" ? "ویدیو" : kind === "audio" ? "صوتی" : "فایل";
  var glyph = kind === "video" ? "▶" : kind === "audio" ? "♫" : "📄";
    return (
      '<span class="ad-media-picker__thumb ad-media-picker__thumb--file" data-kind="' +
      escapeHtml(kind) +
      '"><span aria-hidden="true">' +
      glyph +
      "</span><small>" +
      escapeHtml(label) +
      "</small></span>"
    );
  }

  function filterLabel(kind) {
    if (kind === "image") return "فقط تصاویر";
    if (kind === "video") return "فقط ویدیوها";
    if (kind === "audio") return "فقط فایل‌های صوتی";
    return "همه فایل‌ها";
  }

  function renderGrid(items, query) {
    if (!grid) return;
    var multi = isMultiField();
    var q = String(query || "").trim().toLowerCase();
    var kind = pickerFilter || "any";
    var pool = (items || []).filter(function (item) {
      return matchesFilter(item, kind);
    });
    var filtered = !q
      ? pool
      : pool.filter(function (item) {
          var hay = ((item.filename || "") + " " + (item.alt_text || "") + " " + (item.path || "")).toLowerCase();
          return hay.indexOf(q) !== -1;
        });
    if (!filtered.length) {
      grid.innerHTML = '<p class="muted">موردی یافت نشد.</p>';
      syncChrome();
      return;
    }
    grid.innerHTML = filtered
      .map(function (item) {
        var path = String(item.path || "");
        var isSelected = multi && Object.prototype.hasOwnProperty.call(selected, path);
        return (
          '<button type="button" class="ad-media-picker__item' +
          (isSelected ? " is-selected" : "") +
          (multi ? "" : " is-single") +
          '" data-path="' +
          escapeHtml(path) +
          '" data-alt="' +
          escapeHtml(item.alt_text || "") +
          '" aria-pressed="' +
          (isSelected ? "true" : "false") +
          '">' +
          (multi ? '<span class="ad-media-picker__check" aria-hidden="true"></span>' : "") +
          thumbHtml(item) +
          "<strong>" +
          escapeHtml(item.filename || path) +
          "</strong>" +
          "<small>" +
          escapeHtml(item.alt_text || "بدون alt") +
          "</small>" +
          "</button>"
        );
      })
      .join("");
    syncChrome();
  }

  function notifyField(el) {
    if (!el) return;
    try {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (err) {}
  }

  function applySingle(path, alt) {
    if (pickerCallback) {
      if (!path) return;
      var item = null;
      if (cache && cache.length) {
        for (var ci = 0; ci < cache.length; ci++) {
          if (cache[ci].path === path) {
            item = cache[ci];
            break;
          }
        }
      }
      try {
        pickerCallback(path, alt || "", item || null);
      } catch (err) {}
      pickerCallback = null;
      pickerFilter = "any";
      closePicker();
      return;
    }
    if (!activeBtn || !path) return;
    var form = activeBtn.closest("form") || document;
    var targetName = activeBtn.getAttribute("data-media-target") || "";
    var altName = activeBtn.getAttribute("data-media-alt-target") || "";
    if (targetName) {
      var input = form.querySelector('[name="' + targetName + '"]');
      if (input) {
        input.value = path;
        notifyField(input);
      }
    }
    if (altName) {
      var altInput = form.querySelector('[name="' + altName + '"]');
      if (altInput) {
        altInput.value = alt || "";
        notifyField(altInput);
      }
    }
    closePicker();
  }

  function commitMultiSelection() {
    if (!activeBtn || !isMultiField()) return;
    var paths = selectedPaths();
    if (!paths.length) return;
    var form = activeBtn.closest("form") || document;
    var multiName = activeBtn.getAttribute("data-media-multi") || "";
    var multi = form.querySelector('[name="' + multiName + '"]');
    if (multi) {
      var current = String(multi.value || "").trim();
      var lines = current ? current.split(/\r?\n/).filter(Boolean) : [];
      paths.forEach(function (path) {
        if (lines.indexOf(path) === -1) lines.push(path);
      });
      multi.value = lines.join("\n");
      notifyField(multi);
    }
    closePicker();
  }

  function toggleMultiPath(path, alt) {
    if (!path) return;
    if (Object.prototype.hasOwnProperty.call(selected, path)) {
      delete selected[path];
    } else {
      selected[path] = alt || "";
    }
    var item = findItemButton(path);
    if (item) {
      var on = Object.prototype.hasOwnProperty.call(selected, path);
      item.classList.toggle("is-selected", on);
      item.setAttribute("aria-pressed", on ? "true" : "false");
    }
    syncChrome();
  }

  function openPicker(btn) {
    ensureModal();
    activeBtn = btn;
    pickerCallback = null;
    pickerFilter = btn && btn.getAttribute("data-media-kind") ? String(btn.getAttribute("data-media-kind")) : "image";
    selected = {};
    modal.hidden = false;
    document.body.classList.add("ad-media-picker-open");
    setStatus("در حال بارگذاری…");
    if (grid) grid.innerHTML = "";
    if (searchEl) searchEl.value = "";
    syncChrome();

    fetch("media-json.php", { credentials: "same-origin" })
      .then(function (r) {
        return r.json();
      })
      .then(function (json) {
        if (!json || !json.ok) {
          setStatus((json && json.error) || "بارگذاری رسانه ممکن نشد.", true);
          return;
        }
        cache = json.data || [];
        var pool = (cache || []).filter(function (item) {
          return matchesFilter(item, pickerFilter);
        });
        if (!cache.length) {
          setStatus("کتابخانه رسانه خالی است. از منوی «رسانه» آپلود کنید.");
        } else if (!pool.length) {
          setStatus("برای این نوع فایل موردی نیست. از منوی «رسانه» ویدیو یا صوت آپلود کنید.", true);
        } else {
          setStatus("");
        }
        renderGrid(cache, "");
      })
      .catch(function () {
        setStatus("ارتباط با سرور برقرار نشد.", true);
      });
  }

  function closePicker() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("ad-media-picker-open");
    activeBtn = null;
    pickerCallback = null;
    pickerFilter = "any";
    selected = {};
  }

  function openPickerCallback(options) {
    ensureModal();
    options = options || {};
    activeBtn = null;
    pickerCallback = typeof options.onSelect === "function" ? options.onSelect : null;
    pickerFilter = options.kind || "any";
    selected = {};
    modal.hidden = false;
    document.body.classList.add("ad-media-picker-open");
    setStatus("در حال بارگذاری…");
    if (grid) grid.innerHTML = "";
    if (searchEl) searchEl.value = "";
    syncChrome();
    if (titleEl) {
      titleEl.textContent = "انتخاب از رسانه — " + filterLabel(pickerFilter);
    }
    if (hintEl) {
      hintEl.textContent = "روی فایل کلیک کنید. بدون فایل؟ در تب دیگر از «رسانه» آپلود کنید.";
    }

    fetch("media-json.php", { credentials: "same-origin" })
      .then(function (r) {
        return r.json();
      })
      .then(function (json) {
        if (!json || !json.ok) {
          setStatus((json && json.error) || "بارگذاری رسانه ممکن نشد.", true);
          return;
        }
        cache = json.data || [];
        var pool = (cache || []).filter(function (item) {
          return matchesFilter(item, pickerFilter);
        });
        if (!cache.length) {
          setStatus("کتابخانه رسانه خالی است. از منوی «رسانه» آپلود کنید.");
        } else if (!pool.length) {
          setStatus("برای این نوع فایل موردی نیست. از منوی «رسانه» آپلود کنید.", true);
        } else {
          setStatus("");
        }
        renderGrid(cache, "");
      })
      .catch(function () {
        setStatus("ارتباط با سرور برقرار نشد.", true);
      });
  }

  window.AnaMediaPicker = {
    pick: openPickerCallback,
  };

  document.addEventListener("click", function (e) {
    var openBtn = e.target && e.target.closest ? e.target.closest("[data-media-picker]") : null;
    if (openBtn) {
      e.preventDefault();
      openPicker(openBtn);
      return;
    }
    if (!modal || modal.hidden) return;

    var item = e.target.closest ? e.target.closest(".ad-media-picker__item") : null;
    if (item && modal.contains(item)) {
      e.preventDefault();
      e.stopPropagation();
      var path = item.getAttribute("data-path") || "";
      var alt = item.getAttribute("data-alt") || "";
      if (isMultiField()) {
        toggleMultiPath(path, alt);
      } else {
        applySingle(path, alt);
      }
    }
  });
})();
