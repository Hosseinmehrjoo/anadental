(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function basename(path) {
    var parts = String(path || "").split(/[\\/]/);
    return parts[parts.length - 1] || path;
  }

  function parsePaths(value) {
    return String(value || "")
      .split(/\r?\n/)
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function writePaths(input, paths) {
    input.value = paths.join("\n");
    try {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (err) {}
  }

  function thumbSrc(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path) || path.indexOf("/") === 0) return path;
    return "../../" + path.replace(/^\.\.\//, "");
  }

  function renderMulti(input, host) {
    var paths = parsePaths(input.value);
    if (!paths.length) {
      host.innerHTML = '<p class="media-picked-empty muted">هنوز تصویری از رسانه انتخاب نشده است.</p>';
      return;
    }
    host.innerHTML = paths
      .map(function (path, index) {
        return (
          '<div class="media-picked-block" data-path="' +
          escapeHtml(path) +
          '" data-index="' +
          index +
          '">' +
          '<img src="' +
          escapeHtml(thumbSrc(path)) +
          '" alt="" loading="lazy" />' +
          '<button type="button" class="media-picked-block__remove" data-media-remove aria-label="حذف تصویر">×</button>' +
          '<span class="media-picked-block__name" title="' +
          escapeHtml(path) +
          '">' +
          escapeHtml(basename(path)) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderSingle(input, host) {
    var path = String(input.value || "").trim();
    if (!path) {
      host.innerHTML = '<p class="media-picked-empty muted">تصویری انتخاب نشده است.</p>';
      return;
    }
    host.innerHTML =
      '<div class="media-picked-block media-picked-block--single" data-path="' +
      escapeHtml(path) +
      '">' +
      '<img src="' +
      escapeHtml(thumbSrc(path)) +
      '" alt="" loading="lazy" />' +
      '<button type="button" class="media-picked-block__remove" data-media-remove aria-label="حذف تصویر">×</button>' +
      '<span class="media-picked-block__name" title="' +
      escapeHtml(path) +
      '">' +
      escapeHtml(basename(path)) +
      "</span>" +
      "</div>";
  }

  function bindMulti(host) {
    var name = host.getAttribute("data-media-blocks");
    if (!name) return;
    var form = host.closest("form") || document;
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return;

    input.classList.add("media-field-paths");
    var refresh = function () {
      renderMulti(input, host);
    };
    input.addEventListener("input", refresh);
    input.addEventListener("change", refresh);
    host.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-media-remove]") : null;
      if (!btn) return;
      e.preventDefault();
      var block = btn.closest(".media-picked-block");
      if (!block) return;
      var path = block.getAttribute("data-path") || "";
      var next = parsePaths(input.value).filter(function (p) {
        return p !== path;
      });
      writePaths(input, next);
    });
    refresh();
  }

  function bindSingle(host) {
    var name = host.getAttribute("data-media-preview");
    if (!name) return;
    var form = host.closest("form") || document;
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return;

    input.classList.add("media-field-paths");
    var refresh = function () {
      renderSingle(input, host);
    };
    input.addEventListener("input", refresh);
    input.addEventListener("change", refresh);
    host.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-media-remove]") : null;
      if (!btn) return;
      e.preventDefault();
      input.value = "";
      writePaths(input, []);
      var altName = host.getAttribute("data-media-alt");
      if (altName) {
        var altInput = form.querySelector('[name="' + altName + '"]');
        if (altInput) {
          altInput.value = "";
          try {
            altInput.dispatchEvent(new Event("input", { bubbles: true }));
            altInput.dispatchEvent(new Event("change", { bubbles: true }));
          } catch (err) {}
        }
      }
    });
    refresh();
  }

  document.querySelectorAll("[data-media-blocks]").forEach(bindMulti);
  document.querySelectorAll("[data-media-preview]").forEach(bindSingle);
})();
