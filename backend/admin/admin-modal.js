(function () {
  "use strict";

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    document.body.classList.add("admin-modal-open");
    try {
      document.dispatchEvent(new CustomEvent("admin-modal:open", { detail: { id: id } }));
    } catch (err) {}
    var focusable = el.querySelector("input, select, textarea, button");
    if (focusable) {
      try { focusable.focus(); } catch (e) {}
    }
  }

  function closeModal(el) {
    if (!el) return;
    el.hidden = true;
    if (!document.querySelector(".admin-modal:not([hidden])")) {
      document.body.classList.remove("admin-modal-open");
    }
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest ? e.target.closest("[data-admin-modal-open]") : null;
    if (openBtn) {
      e.preventDefault();
      openModal(openBtn.getAttribute("data-admin-modal-open"));
      return;
    }
    var closeBtn = e.target.closest ? e.target.closest("[data-admin-modal-close]") : null;
    if (closeBtn) {
      e.preventDefault();
      closeModal(closeBtn.closest(".admin-modal"));
      return;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var mediaPicker = document.getElementById("ad-media-picker");
    if (mediaPicker && !mediaPicker.hidden) return;
    /* Let CKEditor close its own dialog/panel first */
    if (document.querySelector(".cke_dialog, .cke_panel, .cke_combopanel")) return;
    document.querySelectorAll(".admin-modal:not([hidden])").forEach(function (el) {
      closeModal(el);
    });
  });

  document.querySelectorAll(".admin-modal[data-admin-modal-autoopen]").forEach(function (el) {
    openModal(el.id);
  });

  // اگر هش #techs یا #provided-services باشد، مودال نمونه‌کار را باز نگه دار
  var hash = window.location.hash;
  if (hash === "#techs" || hash === "#provided-services") {
    var pf = document.getElementById("portfolio-form-modal");
    if (pf) openModal("portfolio-form-modal");
    setTimeout(function () {
      var target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }
  if (hash === "#categories") {
    var bf = document.getElementById("blog-form-modal");
    if (bf) openModal("blog-form-modal");
    setTimeout(function () {
      var target = document.getElementById("categories");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }
})();
