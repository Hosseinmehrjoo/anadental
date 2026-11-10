(function () {
  "use strict";

  function toFaTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    var digits = "۰۱۲۳۴۵۶۷۸۹";
    function d(n) {
      return String(n)
        .padStart(2, "0")
        .replace(/\d/g, function (c) {
          return digits[Number(c)];
        });
    }
    return d(m) + ":" + d(s);
  }

  function initPodcast(root) {
    var audio = root.querySelector(".ana-podcast__audio");
    var playBtn = root.querySelector(".ana-podcast__play");
    var seek = root.querySelector(".ana-podcast__seek");
    var curEl = root.querySelector(".ana-podcast__cur");
    var durEl = root.querySelector(".ana-podcast__dur");
    if (!audio || !playBtn || !seek) return;

    function syncPlayUi() {
      root.classList.toggle("is-playing", !audio.paused && !audio.ended);
    }

    function syncTimes() {
      if (curEl) curEl.textContent = toFaTime(audio.currentTime);
      if (durEl && isFinite(audio.duration)) durEl.textContent = toFaTime(audio.duration);
      if (isFinite(audio.duration) && audio.duration > 0) {
        seek.value = String((audio.currentTime / audio.duration) * 100);
      }
    }

    playBtn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", syncPlayUi);
    audio.addEventListener("pause", syncPlayUi);
    audio.addEventListener("ended", syncPlayUi);
    audio.addEventListener("loadedmetadata", syncTimes);
    audio.addEventListener("timeupdate", syncTimes);

    seek.addEventListener("input", function () {
      if (!isFinite(audio.duration) || audio.duration <= 0) return;
      var pct = Number(seek.value) / 100;
      audio.currentTime = pct * audio.duration;
      syncTimes();
    });

    syncPlayUi();
    syncTimes();
  }

  function boot() {
    document.querySelectorAll(".ana-podcast").forEach(initPodcast);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
