(function () {
  "use strict";

  var root = document.querySelector("[data-media-library]");
  if (!root) return;

  var toggleBtn = root.querySelector("[data-media-bulk-toggle]");
  var selectAllBtn = root.querySelector("[data-media-bulk-select-all]");
  var clearBtn = root.querySelector("[data-media-bulk-clear]");
  var deleteBtn = root.querySelector("[data-media-bulk-delete]");
  var cancelBtn = root.querySelector("[data-media-bulk-cancel]");
  var bulkForm = root.querySelector("[data-media-bulk-form]");
  var checks = Array.prototype.slice.call(root.querySelectorAll("[data-media-check]"));
  var cards = Array.prototype.slice.call(root.querySelectorAll("[data-media-card]"));

  if (!toggleBtn || !checks.length) return;

  function qsAll(sel) {
    return Array.prototype.slice.call(root.querySelectorAll(sel));
  }

  function selectedCount() {
    return checks.filter(function (el) {
      return el.checked;
    }).length;
  }

  function syncDeleteButton() {
    var count = selectedCount();
    if (!deleteBtn) return;
    deleteBtn.disabled = count < 1;
    deleteBtn.textContent =
      count > 0 ? "حذف انتخاب‌شده‌ها (" + count + ")" : "حذف انتخاب‌شده‌ها";
  }

  function setBulkMode(on) {
    root.classList.toggle("is-bulk-select", !!on);
    if (toggleBtn) toggleBtn.hidden = !!on;
    if (selectAllBtn) selectAllBtn.hidden = !on;
    if (clearBtn) clearBtn.hidden = !on;
    if (deleteBtn) deleteBtn.hidden = !on;
    if (cancelBtn) cancelBtn.hidden = !on;
    if (bulkForm) bulkForm.hidden = !on;

    qsAll(".media-library-card__check").forEach(function (el) {
      el.hidden = !on;
    });

    qsAll("[data-media-thumb-link]").forEach(function (link) {
      if (on) {
        if (!link.getAttribute("data-href-backup")) {
          link.setAttribute("data-href-backup", link.getAttribute("href") || "");
        }
        link.removeAttribute("href");
        link.setAttribute("role", "button");
        link.tabIndex = 0;
      } else {
        var href = link.getAttribute("data-href-backup");
        if (href) link.setAttribute("href", href);
        link.removeAttribute("role");
        link.removeAttribute("tabindex");
      }
    });

    if (!on) {
      checks.forEach(function (el) {
        el.checked = false;
      });
      cards.forEach(function (card) {
        card.classList.remove("is-selected");
      });
    }
    syncDeleteButton();
  }

  function toggleCard(card, force) {
    if (!root.classList.contains("is-bulk-select") || !card) return;
    var check = card.querySelector("[data-media-check]");
    if (!check) return;
    check.checked = typeof force === "boolean" ? force : !check.checked;
    card.classList.toggle("is-selected", check.checked);
    syncDeleteButton();
  }

  toggleBtn.addEventListener("click", function () {
    setBulkMode(true);
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      setBulkMode(false);
    });
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function () {
      checks.forEach(function (el) {
        el.checked = true;
      });
      cards.forEach(function (card) {
        card.classList.add("is-selected");
      });
      syncDeleteButton();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      checks.forEach(function (el) {
        el.checked = false;
      });
      cards.forEach(function (card) {
        card.classList.remove("is-selected");
      });
      syncDeleteButton();
    });
  }

  root.addEventListener("change", function (e) {
    var check = e.target && e.target.closest ? e.target.closest("[data-media-check]") : null;
    if (!check) return;
    var card = check.closest("[data-media-card]");
    if (card) card.classList.toggle("is-selected", check.checked);
    syncDeleteButton();
  });

  root.addEventListener("click", function (e) {
    if (!root.classList.contains("is-bulk-select")) return;
    var thumb = e.target && e.target.closest ? e.target.closest("[data-media-thumb-link]") : null;
    if (thumb) {
      e.preventDefault();
      toggleCard(thumb.closest("[data-media-card]"));
      return;
    }
    var card = e.target && e.target.closest ? e.target.closest("[data-media-card]") : null;
    if (!card || e.target.closest("[data-media-card-actions]") || e.target.closest(".media-library-card__check")) {
      return;
    }
    toggleCard(card);
  });

  setBulkMode(false);
})();
