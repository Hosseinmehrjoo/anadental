/**
 * AnaDent enhancements: BA sliders, video carousel, earth flags
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

  function initBaSliders() {
    document.querySelectorAll('[data-ana-ba-slider]').forEach(function (slider) {
      var pane = slider.querySelector('.ana-ba-before-pane');
      var beforeImg = pane ? pane.querySelector('img') : null;
      var handle = slider.querySelector('.ana-ba-handle');
      if (!pane || !beforeImg || !handle) return;

      var dragging = false;

      function syncSize() {
        slider.style.setProperty('--ba-img-w', slider.offsetWidth + 'px');
      }

      function setPos(clientX) {
        var rect = slider.getBoundingClientRect();
        var p = (clientX - rect.left) / rect.width;
        p = Math.max(0.04, Math.min(0.96, p));
        pane.style.width = p * 100 + '%';
        handle.style.left = p * 100 + '%';
        handle.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      }

      syncSize();
      setPos(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5);
      window.addEventListener('resize', syncSize);

      function startDrag(e) {
        dragging = true;
        slider.classList.add('is-dragging');
        if (slider.setPointerCapture && e.pointerId != null) {
          try { slider.setPointerCapture(e.pointerId); } catch (err) {}
        }
        setPos(e.clientX);
      }
      function moveDrag(e) {
        if (dragging) setPos(e.clientX);
      }
      function endDrag() {
        dragging = false;
        slider.classList.remove('is-dragging');
      }

      slider.addEventListener('pointerdown', startDrag);
      slider.addEventListener('pointermove', moveDrag);
      slider.addEventListener('pointerup', endDrag);
      slider.addEventListener('pointercancel', endDrag);

      handle.addEventListener('keydown', function (e) {
        var now = Number(handle.getAttribute('aria-valuenow') || 50);
        var rect = slider.getBoundingClientRect();
        if (e.key === 'ArrowLeft') {
          setPos(rect.left + ((now - 4) / 100) * rect.width);
          e.preventDefault();
        }
        if (e.key === 'ArrowRight') {
          setPos(rect.left + ((now + 4) / 100) * rect.width);
          e.preventDefault();
        }
      });
    });
  }

  function formatVideoTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function applyVideoAspect(slide, video) {
    var w = video.videoWidth;
    var h = video.videoHeight;
    if (!w || !h) return;
    slide.classList.remove('is-portrait', 'is-landscape');
    slide.classList.add(h > w * 1.08 ? 'is-portrait' : 'is-landscape');
    slide.style.setProperty('--video-ar', w + ' / ' + h);
  }

  function ensureVideoSource(video) {
    if (video.dataset.loaded === '1') return Promise.resolve();
    var src = video.getAttribute('data-src') || '';
    if (!src) return Promise.reject(new Error('no src'));
    return new Promise(function (resolve, reject) {
      function onMeta() {
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('error', onErr);
        video.dataset.loaded = '1';
        resolve();
      }
      function onErr() {
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('error', onErr);
        reject(new Error('load failed'));
      }
      video.addEventListener('loadedmetadata', onMeta);
      video.addEventListener('error', onErr);
      video.src = src;
      video.load();
    });
  }

  function pauseSlidePlayer(slide) {
    if (!slide) return;
    var video = slide.querySelector('video');
    if (video) {
      try { video.pause(); } catch (e) {}
    }
    slide.classList.remove('is-playing', 'is-buffering');
    var loading = slide.querySelector('.ana-video-loading');
    if (loading) loading.hidden = true;
  }

  function pauseAllVideos(root) {
    root.querySelectorAll('.video-slide').forEach(pauseSlidePlayer);
  }

  function toggleFullscreen(shell, video) {
    var el = shell || video;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
      return;
    }
    if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  }

  function buildSlide(item, index) {
    var slide = document.createElement('div');
    slide.className = 'video-slide is-landscape';
    slide.dataset.index = String(index);

    var shell = document.createElement('div');
    shell.className = 'ana-video-shell';

    if (item.poster_url) {
      var posterImg = document.createElement('img');
      posterImg.className = 'ana-video-poster';
      posterImg.src = item.poster_url;
      posterImg.alt = item.title || '';
      posterImg.loading = 'lazy';
      posterImg.decoding = 'async';
      shell.appendChild(posterImg);
    }

    var video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'none');
    video.setAttribute('data-src', item.video_url || '');
    video.title = item.title || '';

    var loading = document.createElement('div');
    loading.className = 'ana-video-loading';
    loading.hidden = true;
    loading.setAttribute('aria-hidden', 'true');

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'ana-video-play';
    playBtn.setAttribute('aria-label', 'پخش ویدیو');
    playBtn.innerHTML = '<span aria-hidden="true">▶</span>';

    var controls = document.createElement('div');
    controls.className = 'ana-video-controls';
    controls.hidden = true;

    var progress = document.createElement('input');
    progress.type = 'range';
    progress.className = 'ana-video-progress';
    progress.min = '0';
    progress.max = '1000';
    progress.value = '0';
    progress.setAttribute('aria-label', 'پیشرفت پخش');

    var row = document.createElement('div');
    row.className = 'ana-video-controls__row';

    var playSmall = document.createElement('button');
    playSmall.type = 'button';
    playSmall.className = 'ana-video-ctl';
    playSmall.setAttribute('aria-label', 'توقف / پخش');
    playSmall.textContent = '⏸';

    var timeEl = document.createElement('span');
    timeEl.className = 'ana-video-time';
    timeEl.textContent = '0:00 / 0:00';

    var muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'ana-video-ctl';
    muteBtn.setAttribute('aria-label', 'صدا');
    muteBtn.textContent = '🔊';

    var speedBtn = document.createElement('button');
    speedBtn.type = 'button';
    speedBtn.className = 'ana-video-ctl ana-video-speed';
    speedBtn.setAttribute('aria-label', 'سرعت پخش');
    speedBtn.textContent = '1×';

    var fsBtn = document.createElement('button');
    fsBtn.type = 'button';
    fsBtn.className = 'ana-video-ctl';
    fsBtn.setAttribute('aria-label', 'تمام‌صفحه');
    fsBtn.textContent = '⛶';

    var pipBtn = null;
    if (document.pictureInPictureEnabled) {
      pipBtn = document.createElement('button');
      pipBtn.type = 'button';
      pipBtn.className = 'ana-video-ctl';
      pipBtn.setAttribute('aria-label', 'تصویر در تصویر');
      pipBtn.textContent = 'PiP';
    }

    row.appendChild(playSmall);
    row.appendChild(timeEl);
    row.appendChild(muteBtn);
    row.appendChild(speedBtn);
    if (pipBtn) row.appendChild(pipBtn);
    row.appendChild(fsBtn);
    controls.appendChild(progress);
    controls.appendChild(row);

    shell.appendChild(video);
    shell.appendChild(loading);
    shell.appendChild(playBtn);
    shell.appendChild(controls);
    slide.appendChild(shell);

    var speeds = [1, 1.25, 1.5, 0.75];
    var speedIdx = 0;
    var waitingTimer = null;

    function hideLoading() {
      if (waitingTimer) {
        clearTimeout(waitingTimer);
        waitingTimer = null;
      }
      loading.hidden = true;
      slide.classList.remove('is-buffering');
    }

    function showLoadingSoon() {
      if (waitingTimer) return;
      waitingTimer = window.setTimeout(function () {
        waitingTimer = null;
        if (video.paused || video.ended) return;
        if (video.readyState >= 3) return;
        loading.hidden = false;
        slide.classList.add('is-buffering');
      }, 280);
    }

    function syncTime() {
      if (!video.duration) {
        timeEl.textContent = formatVideoTime(video.currentTime) + ' / --:--';
        return;
      }
      progress.value = String(Math.round((video.currentTime / video.duration) * 1000));
      timeEl.textContent =
        formatVideoTime(video.currentTime) + ' / ' + formatVideoTime(video.duration);
    }

    function startPlayback() {
      if (!slide.classList.contains('center')) return;
      pauseAllVideos(slide.closest('.video-carousel') || document);
      loading.hidden = false;
      slide.classList.add('is-buffering');
      ensureVideoSource(video)
        .then(function () {
          applyVideoAspect(slide, video);
          return video.play();
        })
        .then(function () {
          slide.classList.add('is-playing');
          controls.hidden = false;
          var poster = shell.querySelector('.ana-video-poster');
          if (poster) poster.style.opacity = '0';
          hideLoading();
        })
        .catch(function () {
          hideLoading();
        });
    }

    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      startPlayback();
    });

    playSmall.addEventListener('click', function (e) {
      e.stopPropagation();
      if (video.paused) video.play().catch(function () {});
      else video.pause();
    });

    progress.addEventListener('input', function (e) {
      e.stopPropagation();
      if (!video.duration) return;
      video.currentTime = (parseInt(progress.value, 10) / 1000) * video.duration;
    });

    muteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    speedBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      speedIdx = (speedIdx + 1) % speeds.length;
      video.playbackRate = speeds[speedIdx];
      speedBtn.textContent = speeds[speedIdx] + '×';
    });

    fsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFullscreen(shell, video);
    });

    if (pipBtn) {
      pipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (document.pictureInPictureElement === video) {
          document.exitPictureInPicture().catch(function () {});
        } else {
          video.requestPictureInPicture().catch(function () {});
        }
      });
    }

    video.addEventListener('play', function () {
      slide.classList.add('is-playing');
      playSmall.textContent = '⏸';
      controls.hidden = false;
      hideLoading();
    });
    video.addEventListener('pause', function () {
      playSmall.textContent = '▶';
      if (!video.ended) slide.classList.remove('is-playing');
    });
    video.addEventListener('ended', function () {
      slide.classList.remove('is-playing');
      playSmall.textContent = '▶';
    });
    video.addEventListener('timeupdate', function () {
      syncTime();
      if (!video.paused && !video.ended && video.readyState >= 2) {
        hideLoading();
      }
    });
    video.addEventListener('loadedmetadata', function () {
      applyVideoAspect(slide, video);
      syncTime();
    });
    video.addEventListener('waiting', showLoadingSoon);
    video.addEventListener('playing', hideLoading);
    video.addEventListener('canplay', hideLoading);
    video.addEventListener('canplaythrough', hideLoading);

    shell.addEventListener('dblclick', function (e) {
      e.stopPropagation();
      if (!slide.classList.contains('center')) return;
      toggleFullscreen(shell, video);
    });

    return slide;
  }

  function initVideoCarousel(carousel, items) {
    var track = carousel.querySelector('.video-carousel-track');
    if (!track) return;
    track.innerHTML = '';

    if (!items.length) {
      track.innerHTML = '<p class="video-carousel-empty">ویدیویی برای نمایش ثبت نشده است.</p>';
      return;
    }

    var slides = items.map(function (item, i) {
      return buildSlide(item, i);
    });
    slides.forEach(function (s) { track.appendChild(s); });

    var nextButton = carousel.querySelector('.next');
    var prevButton = carousel.querySelector('.prev');
    var currentIndex = 0;
    var isAnimating = false;

    function updateCarousel() {
      if (isAnimating) return;
      isAnimating = true;
      pauseAllVideos(carousel);
      var total = slides.length;

      slides.forEach(function (slide, index) {
        var position = (index - currentIndex + total) % total;
        slide.classList.remove('center', 'left', 'right');

        if (position === 0) {
          slide.classList.add('center');
        } else if (position === 1) {
          slide.classList.add('right');
        } else if (position === total - 1) {
          slide.classList.add('left');
        } else {
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          slide.style.transform = 'translateX(0) scale(.5)';
          slide.style.zIndex = '0';
          return;
        }

        slide.style.opacity = '';
        slide.style.pointerEvents = '';
        slide.style.transform = '';
        slide.style.zIndex = '';
      });

      setTimeout(function () { isAnimating = false; }, 650);
    }

    function nextVideo() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
    function previousVideo() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    if (nextButton) nextButton.addEventListener('click', nextVideo);
    if (prevButton) prevButton.addEventListener('click', previousVideo);

    slides.forEach(function (slide, index) {
      slide.addEventListener('click', function () {
        if (slide.classList.contains('center')) return;
        currentIndex = index;
        updateCarousel();
      });
    });

    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (event) {
      var diff = touchStartX - event.changedTouches[0].screenX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) nextVideo();
      else previousVideo();
    }, { passive: true });

    updateCarousel();
  }

  function fetchVideoItems() {
    if (window.DentalApi && typeof window.DentalApi.get === 'function') {
      return window.DentalApi.get('/videos.php').then(function (data) {
        return (data && data.items) || [];
      });
    }
    return fetch('/backend/api/videos.php', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) { return (data && data.items) || []; });
  }

  function loadVideos() {
    var carousel = document.getElementById('videoCarousel');
    if (!carousel) return;
    var section = carousel.closest('.SectionsSwiperLightBox.Videos');
    var started = false;

    function start(items) {
      if (started) return;
      started = true;
      items = Array.isArray(items) ? items : [];
      if (!items.length) {
        if (section) {
          section.style.display = 'none';
          section.setAttribute('hidden', '');
        }
        return;
      }
      if (section) {
        section.style.display = '';
        section.removeAttribute('hidden');
      }
      initVideoCarousel(carousel, items);
    }

    function bootstrap() {
      fetchVideoItems().then(start).catch(function () { start([]); });
    }

    if (!('IntersectionObserver' in window)) {
      bootstrap();
      return;
    }
    // Carousel lives inside a hidden section until data loads; observe a visible anchor above it.
    var lazyTarget =
      document.getElementById('anaVideosIoAnchor') ||
      document.querySelector('.SectionsFormsRe') ||
      document.getElementById('ana_contact_form_wrap') ||
      carousel;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          bootstrap();
          observer.disconnect();
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    observer.observe(lazyTarget);
  }

  function initMapConsent() {
    document.querySelectorAll('[data-ana-map-consent]').forEach(function (wrap) {
      var iframe = wrap.querySelector('iframe.ana-map-frame');
      var placeholder = wrap.querySelector('[data-ana-map-placeholder]');
      var btn = wrap.querySelector('[data-ana-map-load]');
      if (!iframe || !btn) return;
      var src = wrap.getAttribute('data-map-src') || iframe.getAttribute('data-src');
      if (!src) return;

      function loadMap() {
        if (iframe.src) return;
        iframe.src = src;
        iframe.removeAttribute('data-src');
        iframe.hidden = false;
        iframe.setAttribute('credentialless', '');
        if (placeholder) placeholder.hidden = true;
        btn.hidden = true;
      }

      btn.addEventListener('click', loadMap);
    });
  }

  function initEarthFlags() {
    var section = document.querySelector('.ana-earth-flags');
    if (!section) return;
    var items = Array.prototype.slice.call(
      section.querySelectorAll('.ana-earth-item')
    );
    if (!items.length) return;

    function play() {
      if (section.classList.contains('is-animated')) return;
      section.classList.add('is-animated');
      items.forEach(function (item, index) {
        window.setTimeout(function () {
          item.classList.add('is-out');
          var key = item.getAttribute('data-spoke');
          if (key) {
            var spoke = section.querySelector('.ana-earth-spoke[data-spoke="' + key + '"]');
            if (spoke) spoke.classList.add('is-drawn');
          }
        }, 180 + index * 520);
      });
    }

    if (!('IntersectionObserver' in window)) {
      play();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(section);
  }

  function initFormBalloon() {
    var section = document.querySelector('.SectionsFormsRe');
    if (!section) return;

    function play() {
      if (section.classList.contains('is-balloon-in')) return;
      section.classList.add('is-balloon-in');
      window.setTimeout(function () {
        section.classList.add('is-heartbeat');
      }, 1300);
    }

    if (!('IntersectionObserver' in window)) {
      play();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            play();
            observer.disconnect();
          }
        });
      },
      { threshold: [0, 0.12, 0.28], rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(section);

    // If already near viewport on load, don't wait forever
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      play();
      observer.disconnect();
    }
  }

  function initAutumnLeaves() {
    var hero = document.querySelector('.VOD_wrapper.ana-hero');
    var canvas = document.querySelector('.ana-leaves-canvas');
    if (!hero || !canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var LEAF_SRCS = [
      'assets/images/leaf/leaf-1.webp',
      'assets/images/leaf/leaf-2.webp',
      'assets/images/leaf/leaf-3.webp',
      'assets/images/leaf/leaf-4.webp',
      'assets/images/leaf/leaf-5.webp',
      'assets/images/leaf/leaf-6.webp',
      'assets/images/leaf/leaf-7.webp',
      'assets/images/leaf/leaf-8.webp'
    ];
    // Indices of the two newly added leaf assets (10 of each at seed)
    var NEW_LEAF_IDX = [6, 7];
    var NEW_LEAF_EACH = 7;

    var images = [];
    var leaves = [];
    var running = false;
    var width = 0;
    var height = 0;
    var dpr = 1;
    var lastT = 0;
    var spawnAcc = 0;
    var clock = 0;
    var mouse = {
      x: -9999,
      y: -9999,
      px: -9999,
      py: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      t: 0,
      inside: false
    };
    var MAX_LEAVES = 74;
    var GRAVITY = 1550;
    var MAX_SPEED = 1600;
    var GROUND_PAD = 18;
    var hangs = [];

    function rand(a, b) {
      return a + Math.random() * (b - a);
    }

    function mouseIntensity() {
      // 0 when idle → ~1 at moderate swipe → ~3.5 at fast swipe
      return Math.min(mouse.speed / 220, 3.5);
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function clampSpeed(leaf) {
      var sp = Math.sqrt(leaf.vx * leaf.vx + leaf.vy * leaf.vy);
      if (sp > MAX_SPEED) {
        var s = MAX_SPEED / sp;
        leaf.vx *= s;
        leaf.vy *= s;
      }
    }

    function makeLeaf(fromTop, imgOverride) {
      var img = imgOverride || images[(Math.random() * images.length) | 0] || images[0];
      var mobile = width <= 768;
      var scale = mobile ? rand(0.14, 0.30) : rand(0.28, 0.55);
      var minSide = mobile ? 10 : 16;
      var w = Math.max(minSide, (img.naturalWidth || 80) * scale);
      var h = Math.max(minSide, (img.naturalHeight || 80) * scale);
      var canvasW = isFinite(width) && width > 0 ? width : 800;
      var canvasH = isFinite(height) && height > 0 ? height : 500;
      return {
        img: img,
        x: rand(-40, canvasW + 40),
        y: fromTop ? rand(-220, -20) : rand(-40, canvasH * 0.35),
        vx: rand(-70, 70),
        vy: rand(200, 420),
        rot: rand(0, Math.PI * 2),
        spin: rand(-3.8, 3.8),
        w: w,
        h: h,
        drag: rand(0.4, 0.75),
        flutter: rand(0, Math.PI * 2),
        flutterSpeed: rand(2.8, 5.4),
        settled: false,
        bounce: rand(0.08, 0.18),
        groundFriction: rand(2.4, 4.2)
      };
    }

    function placeSeedLeaf(leaf) {
      leaf.y = rand(-height * 0.9, height * 0.55);
      if (leaf.y > height * 0.72) {
        leaf.settled = true;
        leaf.vy = 0;
        leaf.y = height - GROUND_PAD - leaf.h * 0.35;
      }
      leaves.push(leaf);
    }

    function seedLeaves() {
      leaves.length = 0;
      var n = Math.min(MAX_LEAVES, Math.max(30, Math.floor(width / 26)) + NEW_LEAF_EACH * NEW_LEAF_IDX.length);
      n = Math.min(MAX_LEAVES, n);

      // Guarantee 10 of each newly added leaf
      var ni;
      var k;
      for (ni = 0; ni < NEW_LEAF_IDX.length; ni++) {
        var img = images[NEW_LEAF_IDX[ni]];
        if (!img) continue;
        for (k = 0; k < NEW_LEAF_EACH; k++) {
          if (leaves.length >= MAX_LEAVES) break;
          placeSeedLeaf(makeLeaf(true, img));
        }
      }

      while (leaves.length < n) {
        placeSeedLeaf(makeLeaf(true));
      }
    }

    function initHangs() {
      hangs.length = 0;
      var nodes = hero.querySelectorAll('.ana-hang');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        hangs.push({
          el: el,
          rope: el.querySelector('.ana-hang__rope'),
          paths: el.querySelectorAll('.ana-hang__rope-path'),
          sign: el.querySelector('.ana-hang__sign'),
          angle: (i % 2 === 0 ? -2.4 : 2.1) * (Math.PI / 180),
          vel: 0,
          ropeLen: 100
        });
      }
      measureHangs();
    }

    function measureHangs() {
      for (var i = 0; i < hangs.length; i++) {
        var H = hangs[i];
        if (!H.rope) continue;
        var rh = H.rope.getBoundingClientRect().height;
        H.ropeLen = Math.max(64, rh || 100);
      }
    }

    function applyBroom(leaf, dt) {
      if (!mouse.inside) return;
      var intensity = mouseIntensity();
      if (intensity < 0.04) return;

      var dx = leaf.x - mouse.x;
      var dy = leaf.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var radius = 155 + intensity * 40;
      if (dist > radius || dist < 0.001) return;

      var influence = 1 - dist / radius;
      influence *= influence;
      var speed = Math.max(mouse.speed, 1);
      var dirX = mouse.vx / speed;
      var dirY = mouse.vy / speed;

      // lateral + strong upward toss (air launch)
      var push = influence * intensity * 820;
      var lift = influence * intensity * (620 + Math.max(0, -dirY) * 380);
      leaf.vx += dirX * push * dt * 15;
      leaf.vy += dirY * push * dt * 10 - lift * dt * 16;
      // light tumble only — throw speed stays high, self-spin stays calm
      leaf.spin += (Math.random() - 0.5) * influence * intensity * 4.5 * dt;
      if (leaf.spin > 3.2) leaf.spin = 3.2;
      if (leaf.spin < -3.2) leaf.spin = -3.2;
      leaf.settled = false;
      clampSpeed(leaf);
    }

    function renderHang(H) {
      if (!H.paths || !H.paths.length || !H.sign) return;
      var len = H.ropeLen;
      var tipX = Math.sin(H.angle) * len;
      var tipY = Math.cos(H.angle) * len;
      // flexible rope: cubic bends lag behind the tip (soft cord)
      var flex = H.vel * 3.4 + Math.sin(H.angle) * 12;
      var ax = 40;
      var ay = 2;
      var ex = 40 + tipX;
      var ey = Math.max(36, tipY);
      var c1x = 40 + tipX * 0.18 + flex * 0.85;
      var c1y = ey * 0.30;
      var c2x = 40 + tipX * 0.72 - flex * 0.55;
      var c2y = ey * 0.68;
      var vbH = Math.max(ey + 10, len + 8);
      H.rope.setAttribute('viewBox', '0 0 80 ' + vbH.toFixed(1));
      var d =
        'M' + ax + ' ' + ay +
        ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
        ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
        ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      for (var p = 0; p < H.paths.length; p++) {
        H.paths[p].setAttribute('d', d);
      }
      var deg = (H.angle * 180 / Math.PI);
      H.sign.style.transform =
        'translate(calc(-50% + ' + tipX.toFixed(2) + 'px), ' +
        (ey - len).toFixed(2) + 'px) rotate(' + deg.toFixed(2) + 'deg)';
    }

    function stepHangs(dt) {
      var i;
      for (i = 0; i < hangs.length; i++) {
        var H = hangs[i];
        // gentle idle sway only — no mouse interaction
        var force = Math.sin(clock * (1.35 + i * 0.28) + i * 1.7) * 1.1;
        force += -H.angle * 30;
        force += -H.vel * 6.2;
        H.vel += force * dt;
        H.angle += H.vel * dt;

        var maxAng = 8 * (Math.PI / 180);
        if (H.angle > maxAng) {
          H.angle = maxAng;
          H.vel *= 0.4;
        } else if (H.angle < -maxAng) {
          H.angle = -maxAng;
          H.vel *= 0.4;
        }

        renderHang(H);
      }
    }

    function step(dt) {
      if (!isFinite(dt) || dt < 0) dt = 0.016;
      if (dt > 0.045) dt = 0.045;
      clock += dt;

      // decay mouse velocity so intensity tracks real movement, not sticky peaks
      mouse.vx *= Math.exp(-7 * dt);
      mouse.vy *= Math.exp(-7 * dt);
      mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      spawnAcc += dt;
      while (spawnAcc > 0.03 && leaves.length < MAX_LEAVES) {
        leaves.push(makeLeaf(true));
        spawnAcc -= 0.03;
      }

      stepHangs(dt);

      var ground = height - GROUND_PAD;
      var i;
      for (i = 0; i < leaves.length; i++) {
        var L = leaves[i];
        if (!L || !isFinite(L.x) || !isFinite(L.y)) {
          leaves[i] = makeLeaf(true);
          continue;
        }
        applyBroom(L, dt);

        L.flutter += L.flutterSpeed * dt;

        if (!L.settled) {
          L.vy += GRAVITY * dt;
          L.vx += (Math.sin(L.flutter) * 70 + Math.sin(L.flutter * 1.7) * 32) * dt;
          L.vy += Math.cos(L.flutter * 0.9) * 22 * dt;
          var speed = Math.sqrt(L.vx * L.vx + L.vy * L.vy);
          if (speed > 0.001) {
            var damp = 1 / (1 + L.drag * 0.0011 * speed * dt * 60);
            L.vx *= damp;
            L.vy *= damp;
          }
          L.spin *= Math.exp(-2.2 * dt);
          L.spin += (-L.vx * 0.0012) * dt * 60;
          if (L.spin > 4) L.spin = 4;
          if (L.spin < -4) L.spin = -4;
          clampSpeed(L);
        }

        L.x += L.vx * dt;
        L.y += L.vy * dt;
        L.rot += L.spin * dt;

        if (L.x < -80) L.x = width + 60;
        if (L.x > width + 80) L.x = -60;

        var bottom = L.y + L.h * 0.35;
        if (bottom >= ground) {
          L.y = ground - L.h * 0.35;
          if (L.vy > 50) {
            L.vy *= -L.bounce;
            L.vx *= 0.72;
            L.spin *= 0.55;
          } else {
            L.vy = 0;
            L.settled = true;
          }
        }

        if (L.settled) {
          L.vx *= Math.exp(-L.groundFriction * dt);
          L.spin *= Math.exp(-3.5 * dt);
          if (Math.abs(L.vx) < 4 && Math.abs(L.spin) < 0.05) {
            L.vx = 0;
            L.spin = 0;
          }
          if (Math.abs(L.vx) > 2) {
            L.y = ground - L.h * 0.35 + Math.sin(L.flutter) * 0.6;
          } else {
            L.y = ground - L.h * 0.35;
          }
        }

        if (L.y > height + 120 || L.y < -height * 1.5) {
          leaves[i] = makeLeaf(true);
        }
      }

      if (leaves.length > MAX_LEAVES) {
        leaves.length = MAX_LEAVES;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < leaves.length; i++) {
        var L = leaves[i];
        if (!L.img || !L.img.complete) continue;
        ctx.save();
        ctx.translate(L.x, L.y);
        ctx.rotate(L.rot);
        ctx.globalAlpha = 0.92;
        ctx.drawImage(L.img, -L.w * 0.5, -L.h * 0.5, L.w, L.h);
        ctx.restore();
      }
    }

    function frame(ts) {
      if (!running) return;
      if (!lastT) lastT = ts;
      var dt = (ts - lastT) / 1000;
      lastT = ts;
      step(dt);
      draw();
      requestAnimationFrame(frame);
    }

    function onPointer(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      mouse.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!mouse.inside) {
        return;
      }
      var now = performance.now();
      if (mouse.px > -9000 && mouse.t > 0) {
        var dtm = Math.max(0.008, (now - mouse.t) / 1000);
        // px/s — blends a bit so tiny jitters don't spike intensity
        var nvx = (x - mouse.px) / dtm;
        var nvy = (y - mouse.py) / dtm;
        mouse.vx = mouse.vx * 0.35 + nvx * 0.65;
        mouse.vy = mouse.vy * 0.35 + nvy * 0.65;
        mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      }
      mouse.t = now;
      mouse.px = x;
      mouse.py = y;
      mouse.x = x;
      mouse.y = y;
    }

    function onLeave() {
      mouse.inside = false;
      mouse.px = -9999;
      mouse.t = 0;
    }

    function start() {
      if (running) return;
      running = true;
      resize();
      initHangs();
      seedLeaves();
      lastT = 0;
      requestAnimationFrame(frame);
    }

    var loaded = 0;
    var readyImgs = 0;
    LEAF_SRCS.forEach(function (src) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        loaded += 1;
        if (img.naturalWidth > 0) readyImgs += 1;
        if (loaded === LEAF_SRCS.length && readyImgs) start();
      };
      img.onerror = function () {
        loaded += 1;
        if (loaded === LEAF_SRCS.length && readyImgs) start();
      };
      img.src = '/' + src.replace(/^\//, '');
      images.push(img);
    });

    window.addEventListener('resize', function () {
      resize();
      measureHangs();
    });
    canvas.addEventListener('pointermove', onPointer, { passive: true });
    canvas.addEventListener('pointerenter', onPointer, { passive: true });
    canvas.addEventListener('pointerleave', onLeave, { passive: true });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stripHtml(value) {
    var tmp = document.createElement('div');
    tmp.innerHTML = String(value == null ? '' : value);
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function blogCoverUrl(post) {
    var cover = (post && (post.cover_url || post.cover)) || '';
    cover = String(cover).trim();
    if (!cover) return '';
    if (/^https?:\/\//i.test(cover) || cover.charAt(0) === '/') return cover;
    return '/' + cover.replace(/^\/+/, '');
  }

  function blogPostHref(post) {
    var slug = String((post && post.slug) || '').trim();
    if (!slug) return '/blog.php';
    return '/post/' + encodeURIComponent(slug);
  }

  function renderHomeBlogCard(post) {
    var href = blogPostHref(post);
    var title = escapeHtml(post.title || '');
    var excerpt = escapeHtml(stripHtml(post.excerpt || post.meta_description || ''));
    var cover = blogCoverUrl(post);
    var id = Number(post.id) || 0;
    var img = cover
      ? '<img width="443" height="230" src="' + escapeHtml(cover) + '" class="attachment-archive_content_image size-archive_content_image" alt="' + title + '" loading="lazy" decoding="async">'
      : '';
    return (
      '<article id="post-' + id + '" class="archiveCardAna swiper-slide">' +
        '<div class="archiveImage">' +
          (cover
            ? '<a class="post-thumbnail" href="' + escapeHtml(href) + '" aria-hidden="true" tabindex="-1">' + img + '</a>'
            : '') +
        '</div>' +
        '<h3><a href="' + escapeHtml(href) + '">' + title + '</a></h3>' +
        '<footer class="FootersArticle">' +
          '<div class="TxtPosts"><p>' + excerpt + '</p></div>' +
          '<a href="' + escapeHtml(href) + '" class="MorePosts">' +
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
              '<path d="M6.25 6.25L15 15" stroke="#3090B6" stroke-width="2" stroke-linecap="round" />' +
              '<path d="M13.333 5.15659C13.333 5.15659 6.62643 4.59124 5.60868 5.60899C4.59084 6.62674 5.15634 13.3333 5.15634 13.3333" stroke="#3090B6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
            '</svg>' +
            '<span>بـیشتر بخوانـیم</span>' +
          '</a>' +
        '</footer>' +
      '</article>'
    );
  }

  function refreshHomeBlogSwiper(section) {
    var el = section.querySelector('.ana-home-blog-swiper') || section.querySelector('.swiper');
    if (!el) return;
    if (el.swiper && typeof el.swiper.destroy === 'function') {
      el.swiper.destroy(true, true);
    }
    if (typeof window.Swiper !== 'function') return;
    new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 16,
      grabCursor: true,
      rtl: true,
      watchOverflow: true,
      speed: 600,
      autoHeight: true,
      breakpoints: {
        600: { slidesPerView: 2 },
        900: { slidesPerView: 2.4 },
        1100: { slidesPerView: 3 }
      },
      navigation: {
        nextEl: section.querySelector('.swiper-button-next_dental'),
        prevEl: section.querySelector('.swiper-button-prev_dental')
      }
    });
  }

  function fetchHomeBlogItems() {
    if (window.DentalApi && typeof window.DentalApi.blogList === 'function') {
      return window.DentalApi.blogList('', 8).then(function (data) {
        return (data && data.data) || [];
      });
    }
    return fetch('/backend/api/blog.php?limit=8', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) { return (data && data.data) || []; });
  }

  function loadHomeBlogs() {
    var section = document.querySelector('.FlexBlogsSection.mainView') || document.querySelector('.FlexBlogsSection');
    if (!section) return;
    var wrapper = section.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    var block = section.closest('.scetionBlogs');

    fetchHomeBlogItems()
      .then(function (items) {
        items = Array.isArray(items) ? items : [];
        if (!items.length) {
          if (block) {
            block.style.display = 'none';
            block.setAttribute('hidden', '');
          }
          return;
        }
        if (block) {
          block.style.display = '';
          block.removeAttribute('hidden');
        }
        wrapper.innerHTML = items.map(renderHomeBlogCard).join('');
        refreshHomeBlogSwiper(section);
      })
      .catch(function () {
        wrapper.innerHTML = '<p class="ana-home-blogs-error" role="status">بارگذاری مقالات ممکن نشد. لطفاً صفحه را رفرش کنید یا از <a href="/blog.php">مجله آنادنت</a> استفاده کنید.</p>';
      });
  }

  function initImplantReveal() {
    var section = document.querySelector('.Sectionsimplants .SectionsParents');
    if (!section) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    section.classList.add('is-implant-ready');
    if (!('IntersectionObserver' in window)) {
      section.classList.add('is-implant-in');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        section.classList.add('is-implant-in');
        observer.disconnect();
      });
    }, { threshold: 0.35 });
    observer.observe(section);
  }

  ready(function () {
    initBaSliders();
    loadVideos();
    loadHomeBlogs();
    initEarthFlags();
    initMapConsent();
    initFormBalloon();
    initAutumnLeaves();
    initImplantReveal();
  });
})();
