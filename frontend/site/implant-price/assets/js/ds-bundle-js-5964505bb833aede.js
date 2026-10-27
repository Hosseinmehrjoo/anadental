
/* lightgallery */
/**
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis
          ? globalThis
          : t || self).lightGallery = e());
})(this, function () {
  "use strict";
  var t = function () {
    return (t =
      Object.assign ||
      function (t) {
        for (var e, i = 1, s = arguments.length; i < s; i++)
          for (var n in (e = arguments[i]))
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t;
      }).apply(this, arguments);
  };
  var e = "lgAfterAppendSlide",
    i = "lgInit",
    s = "lgHasVideo",
    n = "lgContainerResize",
    o = "lgUpdateSlides",
    r = "lgAfterAppendSubHtml",
    l = "lgBeforeOpen",
    a = "lgAfterOpen",
    d = "lgSlideItemLoad",
    g = "lgBeforeSlide",
    h = "lgAfterSlide",
    c = "lgPosterClick",
    u = "lgDragStart",
    m = "lgDragMove",
    p = "lgDragEnd",
    f = "lgBeforeNextSlide",
    y = "lgBeforePrevSlide",
    v = "lgBeforeClose",
    b = "lgAfterClose",
    C = {
      mode: "lg-slide",
      easing: "ease",
      speed: 400,
      licenseKey: "0000-0000-000-0000",
      height: "100%",
      width: "100%",
      addClass: "",
      startClass: "lg-start-zoom",
      backdropDuration: 300,
      container: "",
      startAnimationDuration: 400,
      zoomFromOrigin: !0,
      hideBarsDelay: 0,
      showBarsAfter: 1e4,
      slideDelay: 0,
      supportLegacyBrowser: !0,
      allowMediaOverlap: !1,
      videoMaxSize: "1280-720",
      loadYouTubePoster: !0,
      defaultCaptionHeight: 0,
      ariaLabelledby: "",
      ariaDescribedby: "",
      resetScrollPosition: !0,
      hideScrollbar: !1,
      closable: !0,
      swipeToClose: !0,
      closeOnTap: !0,
      showCloseIcon: !0,
      showMaximizeIcon: !1,
      loop: !0,
      escKey: !0,
      keyPress: !0,
      trapFocus: !0,
      controls: !0,
      slideEndAnimation: !0,
      hideControlOnEnd: !1,
      mousewheel: !1,
      getCaptionFromTitleOrAlt: !0,
      appendSubHtmlTo: ".lg-sub-html",
      subHtmlSelectorRelative: !1,
      preload: 2,
      numberOfSlideItemsInDom: 10,
      selector: "",
      selectWithin: "",
      nextHtml: "",
      prevHtml: "",
      index: 0,
      iframeWidth: "100%",
      iframeHeight: "100%",
      iframeMaxWidth: "100%",
      iframeMaxHeight: "100%",
      download: !0,
      counter: !0,
      appendCounterTo: ".lg-toolbar",
      swipeThreshold: 50,
      enableSwipe: !0,
      enableDrag: !0,
      dynamic: !1,
      dynamicEl: [],
      extraProps: [],
      exThumbImage: "",
      isMobile: void 0,
      mobileSettings: { controls: !1, showCloseIcon: !1, download: !1 },
      plugins: [],
      strings: {
        closeGallery: "Close gallery",
        toggleMaximize: "Toggle maximize",
        previousSlide: "Previous slide",
        nextSlide: "Next slide",
        download: "Download",
        playVideo: "Play video",
        mediaLoadingFailed: "Oops... Failed to load content...",
      },
    };
  var I = (function () {
    function t(t) {
      return (
        (this.cssVenderPrefixes = [
          "TransitionDuration",
          "TransitionTimingFunction",
          "Transform",
          "Transition",
        ]),
        (this.selector = this._getSelector(t)),
        (this.firstElement = this._getFirstEl()),
        this
      );
    }
    return (
      (t.generateUUID = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (t) {
            var e = (16 * Math.random()) | 0;
            return ("x" == t ? e : (3 & e) | 8).toString(16);
          }
        );
      }),
      (t.prototype._getSelector = function (t, e) {
        return (
          void 0 === e && (e = document),
          "string" != typeof t
            ? t
            : ((e = e || document),
              "#" === t.substring(0, 1)
                ? e.querySelector(t)
                : e.querySelectorAll(t))
        );
      }),
      (t.prototype._each = function (t) {
        return this.selector
          ? (void 0 !== this.selector.length
              ? [].forEach.call(this.selector, t)
              : t(this.selector, 0),
            this)
          : this;
      }),
      (t.prototype._setCssVendorPrefix = function (t, e, i) {
        var s = e.replace(/-([a-z])/gi, function (t, e) {
          return e.toUpperCase();
        });
        -1 !== this.cssVenderPrefixes.indexOf(s)
          ? ((t.style[s.charAt(0).toLowerCase() + s.slice(1)] = i),
            (t.style["webkit" + s] = i),
            (t.style["moz" + s] = i),
            (t.style["ms" + s] = i),
            (t.style["o" + s] = i))
          : (t.style[s] = i);
      }),
      (t.prototype._getFirstEl = function () {
        return this.selector && void 0 !== this.selector.length
          ? this.selector[0]
          : this.selector;
      }),
      (t.prototype.isEventMatched = function (t, e) {
        var i = e.split(".");
        return t
          .split(".")
          .filter(function (t) {
            return t;
          })
          .every(function (t) {
            return -1 !== i.indexOf(t);
          });
      }),
      (t.prototype.attr = function (t, e) {
        return void 0 === e
          ? this.firstElement
            ? this.firstElement.getAttribute(t)
            : ""
          : (this._each(function (i) {
              i.setAttribute(t, e);
            }),
            this);
      }),
      (t.prototype.find = function (t) {
        return x(this._getSelector(t, this.selector));
      }),
      (t.prototype.first = function () {
        return this.selector && void 0 !== this.selector.length
          ? x(this.selector[0])
          : x(this.selector);
      }),
      (t.prototype.eq = function (t) {
        return x(this.selector[t]);
      }),
      (t.prototype.parent = function () {
        return x(this.selector.parentElement);
      }),
      (t.prototype.get = function () {
        return this._getFirstEl();
      }),
      (t.prototype.removeAttr = function (t) {
        var e = t.split(" ");
        return (
          this._each(function (t) {
            e.forEach(function (e) {
              return t.removeAttribute(e);
            });
          }),
          this
        );
      }),
      (t.prototype.wrap = function (t) {
        if (!this.firstElement) return this;
        var e = document.createElement("div");
        return (
          (e.className = t),
          this.firstElement.parentNode.insertBefore(e, this.firstElement),
          this.firstElement.parentNode.removeChild(this.firstElement),
          e.appendChild(this.firstElement),
          this
        );
      }),
      (t.prototype.addClass = function (t) {
        return (
          void 0 === t && (t = ""),
          this._each(function (e) {
            t.split(" ").forEach(function (t) {
              t && e.classList.add(t);
            });
          }),
          this
        );
      }),
      (t.prototype.removeClass = function (t) {
        return (
          this._each(function (e) {
            t.split(" ").forEach(function (t) {
              t && e.classList.remove(t);
            });
          }),
          this
        );
      }),
      (t.prototype.hasClass = function (t) {
        return !!this.firstElement && this.firstElement.classList.contains(t);
      }),
      (t.prototype.hasAttribute = function (t) {
        return !!this.firstElement && this.firstElement.hasAttribute(t);
      }),
      (t.prototype.toggleClass = function (t) {
        return this.firstElement
          ? (this.hasClass(t) ? this.removeClass(t) : this.addClass(t), this)
          : this;
      }),
      (t.prototype.css = function (t, e) {
        var i = this;
        return (
          this._each(function (s) {
            i._setCssVendorPrefix(s, t, e);
          }),
          this
        );
      }),
      (t.prototype.on = function (e, i) {
        var s = this;
        return this.selector
          ? (e.split(" ").forEach(function (e) {
              Array.isArray(t.eventListeners[e]) || (t.eventListeners[e] = []),
                t.eventListeners[e].push(i),
                s.selector.addEventListener(e.split(".")[0], i);
            }),
            this)
          : this;
      }),
      (t.prototype.once = function (t, e) {
        var i = this;
        return (
          this.on(t, function () {
            i.off(t), e(t);
          }),
          this
        );
      }),
      (t.prototype.off = function (e) {
        var i = this;
        return this.selector
          ? (Object.keys(t.eventListeners).forEach(function (s) {
              i.isEventMatched(e, s) &&
                (t.eventListeners[s].forEach(function (t) {
                  i.selector.removeEventListener(s.split(".")[0], t);
                }),
                (t.eventListeners[s] = []));
            }),
            this)
          : this;
      }),
      (t.prototype.trigger = function (t, e) {
        if (!this.firstElement) return this;
        var i = new CustomEvent(t.split(".")[0], { detail: e || null });
        return this.firstElement.dispatchEvent(i), this;
      }),
      (t.prototype.load = function (t) {
        var e = this;
        return (
          fetch(t)
            .then(function (t) {
              return t.text();
            })
            .then(function (t) {
              e.selector.innerHTML = t;
            }),
          this
        );
      }),
      (t.prototype.html = function (t) {
        return void 0 === t
          ? this.firstElement
            ? this.firstElement.innerHTML
            : ""
          : (this._each(function (e) {
              e.innerHTML = t;
            }),
            this);
      }),
      (t.prototype.append = function (t) {
        return (
          this._each(function (e) {
            "string" == typeof t
              ? e.insertAdjacentHTML("beforeend", t)
              : e.appendChild(t);
          }),
          this
        );
      }),
      (t.prototype.prepend = function (t) {
        return (
          this._each(function (e) {
            "string" == typeof t
              ? e.insertAdjacentHTML("afterbegin", t)
              : t instanceof HTMLElement &&
                e.insertBefore(t.cloneNode(!0), e.firstChild);
          }),
          this
        );
      }),
      (t.prototype.remove = function () {
        return (
          this._each(function (t) {
            t.parentNode.removeChild(t);
          }),
          this
        );
      }),
      (t.prototype.empty = function () {
        return (
          this._each(function (t) {
            t.innerHTML = "";
          }),
          this
        );
      }),
      (t.prototype.scrollTop = function (t) {
        return void 0 !== t
          ? ((document.body.scrollTop = t),
            (document.documentElement.scrollTop = t),
            this)
          : window.pageYOffset ||
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              0;
      }),
      (t.prototype.scrollLeft = function (t) {
        return void 0 !== t
          ? ((document.body.scrollLeft = t),
            (document.documentElement.scrollLeft = t),
            this)
          : window.pageXOffset ||
              document.documentElement.scrollLeft ||
              document.body.scrollLeft ||
              0;
      }),
      (t.prototype.offset = function () {
        if (!this.firstElement) return { left: 0, top: 0 };
        var t = this.firstElement.getBoundingClientRect(),
          e = x("body").style().marginLeft;
        return {
          left: t.left - parseFloat(e) + this.scrollLeft(),
          top: t.top + this.scrollTop(),
        };
      }),
      (t.prototype.style = function () {
        return this.firstElement
          ? this.firstElement.currentStyle ||
              window.getComputedStyle(this.firstElement)
          : {};
      }),
      (t.prototype.width = function () {
        var t = this.style();
        return (
          this.firstElement.clientWidth -
          parseFloat(t.paddingLeft) -
          parseFloat(t.paddingRight)
        );
      }),
      (t.prototype.height = function () {
        var t = this.style();
        return (
          this.firstElement.clientHeight -
          parseFloat(t.paddingTop) -
          parseFloat(t.paddingBottom)
        );
      }),
      (t.eventListeners = {}),
      t
    );
  })();
  function x(t) {
    return (
      (function () {
        if ("function" == typeof window.CustomEvent) return !1;
        window.CustomEvent = function (t, e) {
          e = e || { bubbles: !1, cancelable: !1, detail: null };
          var i = document.createEvent("CustomEvent");
          return i.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), i;
        };
      })(),
      Element.prototype.matches ||
        (Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector),
      new I(t)
    );
  }
  var w = [
    "src",
    "sources",
    "subHtml",
    "subHtmlUrl",
    "html",
    "video",
    "poster",
    "slideName",
    "responsive",
    "srcset",
    "sizes",
    "iframe",
    "downloadUrl",
    "download",
    "width",
    "facebookShareUrl",
    "tweetText",
    "iframeTitle",
    "twitterShareUrl",
    "pinterestShareUrl",
    "pinterestText",
    "fbHtml",
    "disqusIdentifier",
    "disqusUrl",
  ];
  function S(t) {
    return "href" === t
      ? "src"
      : (t = (t =
          (t = t.replace("data-", "")).charAt(0).toLowerCase() +
          t.slice(1)).replace(/-([a-z])/g, function (t) {
          return t[1].toUpperCase();
        }));
  }
  var T = function (t, e, i) {
      fetch(t)
        .then(function (t) {
          return t.text();
        })
        .then(function (t) {
          if ("append" === i) {
            var s = '<div class="lg-sub-html">' + t + "</div>";
            e.append(s);
          } else e.html(t);
        });
    },
    E = function (t, e, i, s) {
      void 0 === i && (i = 0);
      var n = x(t).attr("data-lg-size") || s;
      if (n) {
        var o = n.split(",");
        if (o[1])
          for (var r = window.innerWidth, l = 0; l < o.length; l++) {
            var a = o[l];
            if (parseInt(a.split("-")[2], 10) > r) {
              n = a;
              break;
            }
            l === o.length - 1 && (n = a);
          }
        var d = n.split("-"),
          g = parseInt(d[0], 10),
          h = parseInt(d[1], 10),
          c = e.width(),
          u = e.height() - i,
          m = Math.min(c, g),
          p = Math.min(u, h),
          f = Math.min(m / g, p / h);
        return { width: g * f, height: h * f };
      }
    },
    O = function (t, e, i, s, n) {
      if (n) {
        var o = x(t).find("img").first();
        if (o.get()) {
          var r = e.get().getBoundingClientRect(),
            l = r.width,
            a = e.height() - (i + s),
            d = o.width(),
            g = o.height(),
            h = o.style(),
            c =
              (l - d) / 2 -
              o.offset().left +
              (parseFloat(h.paddingLeft) || 0) +
              (parseFloat(h.borderLeft) || 0) +
              x(window).scrollLeft() +
              r.left,
            u =
              (a - g) / 2 -
              o.offset().top +
              (parseFloat(h.paddingTop) || 0) +
              (parseFloat(h.borderTop) || 0) +
              x(window).scrollTop() +
              i;
          return (
            "translate3d(" +
            (c *= -1) +
            "px, " +
            (u *= -1) +
            "px, 0) scale3d(" +
            d / n.width +
            ", " +
            g / n.height +
            ", 1)"
          );
        }
      }
    },
    L = function (t, e, i, s, n, o) {
      return (
        '<div class="lg-media-cont lg-has-iframe" style="width:' +
        t +
        "; max-width:" +
        i +
        "; height: " +
        e +
        "; max-height:" +
        s +
        '">\n                    <iframe class="lg-object" frameborder="0" ' +
        (o ? 'title="' + o + '"' : "") +
        ' src="' +
        n +
        '"  allowfullscreen="true"></iframe>\n                </div>'
      );
    },
    D = function (t, e, i, s, n, o) {
      var r =
          "<img " +
          i +
          " " +
          (s ? 'srcset="' + s + '"' : "") +
          "  " +
          (n ? 'sizes="' + n + '"' : "") +
          ' class="lg-object lg-image" data-index="' +
          t +
          '" src="' +
          e +
          '" />',
        l = "";
      o &&
        (l = ("string" == typeof o ? JSON.parse(o) : o).map(function (t) {
          var e = "";
          return (
            Object.keys(t).forEach(function (i) {
              e += " " + i + '="' + t[i] + '"';
            }),
            "<source " + e + "></source>"
          );
        }));
      return "" + l + r;
    },
    z = function (t) {
      for (var e = [], i = [], s = "", n = 0; n < t.length; n++) {
        var o = t[n].split(" ");
        "" === o[0] && o.splice(0, 1), i.push(o[0]), e.push(o[1]);
      }
      for (var r = window.innerWidth, l = 0; l < e.length; l++)
        if (parseInt(e[l], 10) > r) {
          s = i[l];
          break;
        }
      return s;
    },
    M = function (t) {
      return !!t && !!t.complete && 0 !== t.naturalWidth;
    },
    G = function (t, e, i, s, n) {
      var o = "";
      o =
        n && n.youtube
          ? "lg-has-youtube"
          : n && n.vimeo
          ? "lg-has-vimeo"
          : "lg-has-html5";
      var r = e;
      return (
        "string" != typeof e && (r = e.outerHTML),
        '<div class="lg-video-cont ' +
          o +
          '" style="' +
          i +
          '">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="' +
          s +
          '"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>' +
          s +
          '</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            ' +
          r +
          '\n            <img class="lg-object lg-video-poster" src="' +
          t +
          '" />\n        </div>'
      );
    },
    k = function (t) {
      var e = t.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      return [].filter.call(e, function (t) {
        var e = window.getComputedStyle(t);
        return "none" !== e.display && "hidden" !== e.visibility;
      });
    },
    A = function (t, e, i, s) {
      var n = [],
        o = (function () {
          for (var t = 0, e = 0, i = arguments.length; e < i; e++)
            t += arguments[e].length;
          var s = Array(t),
            n = 0;
          for (e = 0; e < i; e++)
            for (var o = arguments[e], r = 0, l = o.length; r < l; r++, n++)
              s[n] = o[r];
          return s;
        })(w, e);
      return (
        [].forEach.call(t, function (t) {
          for (var e = {}, r = 0; r < t.attributes.length; r++) {
            var l = t.attributes[r];
            if (l.specified) {
              var a = S(l.name),
                d = "";
              o.indexOf(a) > -1 && (d = a), d && (e[d] = l.value);
            }
          }
          var g = x(t),
            h = g.find("img").first().attr("alt"),
            c = g.attr("title"),
            u = s ? g.attr(s) : g.find("img").first().attr("src");
          (e.thumb = u),
            i && !e.subHtml && (e.subHtml = c || h || ""),
            (e.alt = h || c || ""),
            n.push(e);
        }),
        n
      );
    },
    B = function () {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },
    P = function (t, e, i) {
      if (!t)
        return e
          ? { html5: !0 }
          : void console.error(
              "lightGallery :- data-src is not provided on slide item " +
                (i + 1) +
                ". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/"
            );
      var s = t.match(
          /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i
        ),
        n = t.match(
          /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i
        ),
        o = t.match(
          /https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/
        );
      return s ? { youtube: s } : n ? { vimeo: n } : o ? { wistia: o } : void 0;
    },
    F = 0,
    H = (function () {
      function w(t, e) {
        if (
          ((this.lgOpened = !1),
          (this.index = 0),
          (this.plugins = []),
          (this.lGalleryOn = !1),
          (this.lgBusy = !1),
          (this.currentItemsInDom = []),
          (this.prevScrollTop = 0),
          (this.bodyPaddingRight = 0),
          (this.isDummyImageRemoved = !1),
          (this.dragOrSwipeEnabled = !1),
          (this.mediaContainerPosition = { top: 0, bottom: 0 }),
          !t)
        )
          return this;
        if (
          (F++,
          (this.lgId = F),
          (this.el = t),
          (this.LGel = x(t)),
          this.generateSettings(e),
          this.buildModules(),
          this.settings.dynamic &&
            void 0 !== this.settings.dynamicEl &&
            !Array.isArray(this.settings.dynamicEl))
        )
          throw "When using dynamic mode, you must also define dynamicEl as an Array.";
        return (
          (this.galleryItems = this.getItems()),
          this.normalizeSettings(),
          this.init(),
          this.validateLicense(),
          this
        );
      }
      return (
        (w.prototype.generateSettings = function (e) {
          if (
            ((this.settings = t(t({}, C), e)),
            this.settings.isMobile &&
            "function" == typeof this.settings.isMobile
              ? this.settings.isMobile()
              : B())
          ) {
            var i = t(
              t({}, this.settings.mobileSettings),
              this.settings.mobileSettings
            );
            this.settings = t(t({}, this.settings), i);
          }
        }),
        (w.prototype.normalizeSettings = function () {
          if (
            (this.settings.slideEndAnimation &&
              (this.settings.hideControlOnEnd = !1),
            this.settings.closable || (this.settings.swipeToClose = !1),
            (this.zoomFromOrigin = this.settings.zoomFromOrigin),
            this.settings.dynamic && (this.zoomFromOrigin = !1),
            this.settings.container)
          ) {
            var t = this.settings.container;
            if ("function" == typeof t) this.settings.container = t();
            else if ("string" == typeof t) {
              var e = document.querySelector(t);
              this.settings.container = null != e ? e : document.body;
            }
          } else this.settings.container = document.body;
          this.settings.preload = Math.min(
            this.settings.preload,
            this.galleryItems.length
          );
        }),
        (w.prototype.init = function () {
          var t = this;
          this.addSlideVideoInfo(this.galleryItems),
            this.buildStructure(),
            this.LGel.trigger(i, { instance: this }),
            this.settings.keyPress && this.keyPress(),
            setTimeout(function () {
              t.enableDrag(), t.enableSwipe(), t.triggerPosterClick();
            }, 50),
            this.arrow(),
            this.settings.mousewheel && this.mousewheel(),
            this.settings.dynamic || this.openGalleryOnItemClick();
        }),
        (w.prototype.openGalleryOnItemClick = function () {
          for (
            var t = this,
              e = function (e) {
                var s = i.items[e],
                  n = x(s),
                  o = I.generateUUID();
                n.attr("data-lg-id", o).on(
                  "click.lgcustom-item-" + o,
                  function (i) {
                    i.preventDefault();
                    var n = t.settings.index || e;
                    t.openGallery(n, s);
                  }
                );
              },
              i = this,
              s = 0;
            s < this.items.length;
            s++
          )
            e(s);
        }),
        (w.prototype.buildModules = function () {
          var t = this;
          this.settings.plugins.forEach(function (e) {
            t.plugins.push(new e(t, x));
          });
        }),
        (w.prototype.validateLicense = function () {
          this.settings.licenseKey
            ? "0000-0000-000-0000" === this.settings.licenseKey &&
              console.warn(
                "lightGallery: " +
                  this.settings.licenseKey +
                  " license key is not valid for production use"
              )
            : console.error("Please provide a valid license key");
        }),
        (w.prototype.getSlideItem = function (t) {
          return x(this.getSlideItemId(t));
        }),
        (w.prototype.getSlideItemId = function (t) {
          return "#lg-item-" + this.lgId + "-" + t;
        }),
        (w.prototype.getIdName = function (t) {
          return t + "-" + this.lgId;
        }),
        (w.prototype.getElementById = function (t) {
          return x("#" + this.getIdName(t));
        }),
        (w.prototype.manageSingleSlideClassName = function () {
          this.galleryItems.length < 2
            ? this.outer.addClass("lg-single-item")
            : this.outer.removeClass("lg-single-item");
        }),
        (w.prototype.buildStructure = function () {
          var t = this;
          if (!(this.$container && this.$container.get())) {
            var e = "",
              i = "";
            this.settings.controls &&
              (e =
                '<button type="button" id="' +
                this.getIdName("lg-prev") +
                '" aria-label="' +
                this.settings.strings.previousSlide +
                '" class="lg-prev lg-icon"> ' +
                this.settings.prevHtml +
                ' </button>\n                <button type="button" id="' +
                this.getIdName("lg-next") +
                '" aria-label="' +
                this.settings.strings.nextSlide +
                '" class="lg-next lg-icon"> ' +
                this.settings.nextHtml +
                " </button>"),
              ".lg-item" !== this.settings.appendSubHtmlTo &&
                (i =
                  '<div class="lg-sub-html" role="status" aria-live="polite"></div>');
            var s = "";
            this.settings.allowMediaOverlap && (s += "lg-media-overlap ");
            var n = this.settings.ariaLabelledby
                ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"'
                : "",
              o = this.settings.ariaDescribedby
                ? 'aria-describedby="' + this.settings.ariaDescribedby + '"'
                : "",
              r =
                "lg-container " +
                this.settings.addClass +
                " " +
                (document.body !== this.settings.container ? "lg-inline" : ""),
              l =
                this.settings.closable && this.settings.showCloseIcon
                  ? '<button type="button" aria-label="' +
                    this.settings.strings.closeGallery +
                    '" id="' +
                    this.getIdName("lg-close") +
                    '" class="lg-close lg-icon"></button>'
                  : "",
              a = this.settings.showMaximizeIcon
                ? '<button type="button" aria-label="' +
                  this.settings.strings.toggleMaximize +
                  '" id="' +
                  this.getIdName("lg-maximize") +
                  '" class="lg-maximize lg-icon"></button>'
                : "",
              d =
                '\n        <div class="' +
                r +
                '" id="' +
                this.getIdName("lg-container") +
                '" tabindex="-1" aria-modal="true" ' +
                n +
                " " +
                o +
                ' role="dialog"\n        >\n            <div id="' +
                this.getIdName("lg-backdrop") +
                '" class="lg-backdrop"></div>\n\n            <div id="' +
                this.getIdName("lg-outer") +
                '" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ' +
                s +
                ' ">\n\n              <div id="' +
                this.getIdName("lg-content") +
                '" class="lg-content">\n                <div id="' +
                this.getIdName("lg-inner") +
                '" class="lg-inner">\n                </div>\n                ' +
                e +
                '\n              </div>\n                <div id="' +
                this.getIdName("lg-toolbar") +
                '" class="lg-toolbar lg-group">\n                    ' +
                a +
                "\n                    " +
                l +
                "\n                    </div>\n                    " +
                (".lg-outer" === this.settings.appendSubHtmlTo ? i : "") +
                '\n                <div id="' +
                this.getIdName("lg-components") +
                '" class="lg-components">\n                    ' +
                (".lg-sub-html" === this.settings.appendSubHtmlTo ? i : "") +
                "\n                </div>\n            </div>\n        </div>\n        ";
            x(this.settings.container).append(d),
              document.body !== this.settings.container &&
                x(this.settings.container).css("position", "relative"),
              (this.outer = this.getElementById("lg-outer")),
              (this.$lgComponents = this.getElementById("lg-components")),
              (this.$backdrop = this.getElementById("lg-backdrop")),
              (this.$container = this.getElementById("lg-container")),
              (this.$inner = this.getElementById("lg-inner")),
              (this.$content = this.getElementById("lg-content")),
              (this.$toolbar = this.getElementById("lg-toolbar")),
              this.$backdrop.css(
                "transition-duration",
                this.settings.backdropDuration + "ms"
              );
            var g = this.settings.mode + " ";
            this.manageSingleSlideClassName(),
              this.settings.enableDrag && (g += "lg-grab "),
              this.outer.addClass(g),
              this.$inner.css(
                "transition-timing-function",
                this.settings.easing
              ),
              this.$inner.css(
                "transition-duration",
                this.settings.speed + "ms"
              ),
              this.settings.download &&
                this.$toolbar.append(
                  '<a id="' +
                    this.getIdName("lg-download") +
                    '" target="_blank" rel="noopener" aria-label="' +
                    this.settings.strings.download +
                    '" download class="lg-download lg-icon"></a>'
                ),
              this.counter(),
              x(window).on(
                "resize.lg.global" +
                  this.lgId +
                  " orientationchange.lg.global" +
                  this.lgId,
                function () {
                  t.refreshOnResize();
                }
              ),
              this.hideBars(),
              this.manageCloseGallery(),
              this.toggleMaximize(),
              this.initModules();
          }
        }),
        (w.prototype.refreshOnResize = function () {
          if (this.lgOpened) {
            var t = this.galleryItems[this.index].__slideVideoInfo;
            this.mediaContainerPosition = this.getMediaContainerPosition();
            var e = this.mediaContainerPosition,
              i = e.top,
              s = e.bottom;
            if (
              ((this.currentImageSize = E(
                this.items[this.index],
                this.outer,
                i + s,
                t && this.settings.videoMaxSize
              )),
              t && this.resizeVideoSlide(this.index, this.currentImageSize),
              this.zoomFromOrigin && !this.isDummyImageRemoved)
            ) {
              var o = this.getDummyImgStyles(this.currentImageSize);
              this.outer
                .find(".lg-current .lg-dummy-img")
                .first()
                .attr("style", o);
            }
            this.LGel.trigger(n);
          }
        }),
        (w.prototype.resizeVideoSlide = function (t, e) {
          var i = this.getVideoContStyle(e);
          this.getSlideItem(t).find(".lg-video-cont").attr("style", i);
        }),
        (w.prototype.updateSlides = function (t, e) {
          if (
            (this.index > t.length - 1 && (this.index = t.length - 1),
            1 === t.length && (this.index = 0),
            t.length)
          ) {
            var i = this.galleryItems[e].src;
            (this.galleryItems = t),
              this.updateControls(),
              this.$inner.empty(),
              (this.currentItemsInDom = []);
            var s = 0;
            this.galleryItems.some(function (t, e) {
              return t.src === i && ((s = e), !0);
            }),
              (this.currentItemsInDom = this.organizeSlideItems(s, -1)),
              this.loadContent(s, !0),
              this.getSlideItem(s).addClass("lg-current"),
              (this.index = s),
              this.updateCurrentCounter(s),
              this.LGel.trigger(o);
          } else this.closeGallery();
        }),
        (w.prototype.getItems = function () {
          if (((this.items = []), this.settings.dynamic))
            return this.settings.dynamicEl || [];
          if ("this" === this.settings.selector) this.items.push(this.el);
          else if (this.settings.selector)
            if ("string" == typeof this.settings.selector)
              if (this.settings.selectWithin) {
                var t = x(this.settings.selectWithin);
                this.items = t.find(this.settings.selector).get();
              } else
                this.items = this.el.querySelectorAll(this.settings.selector);
            else this.items = this.settings.selector;
          else this.items = this.el.children;
          return A(
            this.items,
            this.settings.extraProps,
            this.settings.getCaptionFromTitleOrAlt,
            this.settings.exThumbImage
          );
        }),
        (w.prototype.shouldHideScrollbar = function () {
          return (
            this.settings.hideScrollbar &&
            document.body === this.settings.container
          );
        }),
        (w.prototype.hideScrollbar = function () {
          if (this.shouldHideScrollbar()) {
            this.bodyPaddingRight = parseFloat(x("body").style().paddingRight);
            var t = document.documentElement.getBoundingClientRect(),
              e = window.innerWidth - t.width;
            x(document.body).css(
              "padding-right",
              e + this.bodyPaddingRight + "px"
            ),
              x(document.body).addClass("lg-overlay-open");
          }
        }),
        (w.prototype.resetScrollBar = function () {
          this.shouldHideScrollbar() &&
            (x(document.body).css(
              "padding-right",
              this.bodyPaddingRight + "px"
            ),
            x(document.body).removeClass("lg-overlay-open"));
        }),
        (w.prototype.openGallery = function (t, e) {
          var i = this;
          if ((void 0 === t && (t = this.settings.index), !this.lgOpened)) {
            (this.lgOpened = !0),
              this.outer.removeClass("lg-hide-items"),
              this.hideScrollbar(),
              this.$container.addClass("lg-show");
            var s = this.getItemsToBeInsertedToDom(t, t);
            this.currentItemsInDom = s;
            var n = "";
            s.forEach(function (t) {
              n = n + '<div id="' + t + '" class="lg-item"></div>';
            }),
              this.$inner.append(n),
              this.addHtml(t);
            var o = "";
            this.mediaContainerPosition = this.getMediaContainerPosition();
            var r = this.mediaContainerPosition,
              d = r.top,
              g = r.bottom;
            this.settings.allowMediaOverlap ||
              this.setMediaContainerPosition(d, g);
            var h = this.galleryItems[t].__slideVideoInfo;
            this.zoomFromOrigin &&
              e &&
              ((this.currentImageSize = E(
                e,
                this.outer,
                d + g,
                h && this.settings.videoMaxSize
              )),
              (o = O(e, this.outer, d, g, this.currentImageSize))),
              (this.zoomFromOrigin && o) ||
                (this.outer.addClass(this.settings.startClass),
                this.getSlideItem(t).removeClass("lg-complete"));
            var c = this.settings.zoomFromOrigin
              ? 100
              : this.settings.backdropDuration;
            setTimeout(function () {
              i.outer.addClass("lg-components-open");
            }, c),
              (this.index = t),
              this.LGel.trigger(l),
              this.getSlideItem(t).addClass("lg-current"),
              (this.lGalleryOn = !1),
              (this.prevScrollTop = x(window).scrollTop()),
              setTimeout(function () {
                if (i.zoomFromOrigin && o) {
                  var e = i.getSlideItem(t);
                  e.css("transform", o),
                    setTimeout(function () {
                      e
                        .addClass("lg-start-progress lg-start-end-progress")
                        .css(
                          "transition-duration",
                          i.settings.startAnimationDuration + "ms"
                        ),
                        i.outer.addClass("lg-zoom-from-image");
                    }),
                    setTimeout(function () {
                      e.css("transform", "translate3d(0, 0, 0)");
                    }, 100);
                }
                setTimeout(function () {
                  i.$backdrop.addClass("in"),
                    i.$container.addClass("lg-show-in");
                }, 10),
                  setTimeout(function () {
                    i.settings.trapFocus &&
                      document.body === i.settings.container &&
                      i.trapFocus();
                  }, i.settings.backdropDuration + 50),
                  (i.zoomFromOrigin && o) ||
                    setTimeout(function () {
                      i.outer.addClass("lg-visible");
                    }, i.settings.backdropDuration),
                  i.slide(t, !1, !1, !1),
                  i.LGel.trigger(a);
              }),
              document.body === this.settings.container &&
                x("html").addClass("lg-on");
          }
        }),
        (w.prototype.getMediaContainerPosition = function () {
          if (this.settings.allowMediaOverlap) return { top: 0, bottom: 0 };
          var t = this.$toolbar.get().clientHeight || 0,
            e = this.outer.find(".lg-components .lg-sub-html").get(),
            i =
              this.settings.defaultCaptionHeight || (e && e.clientHeight) || 0,
            s = this.outer.find(".lg-thumb-outer").get();
          return { top: t, bottom: (s ? s.clientHeight : 0) + i };
        }),
        (w.prototype.setMediaContainerPosition = function (t, e) {
          void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            this.$content.css("top", t + "px").css("bottom", e + "px");
        }),
        (w.prototype.hideBars = function () {
          var t = this;
          setTimeout(function () {
            t.outer.removeClass("lg-hide-items"),
              t.settings.hideBarsDelay > 0 &&
                (t.outer.on("mousemove.lg click.lg touchstart.lg", function () {
                  t.outer.removeClass("lg-hide-items"),
                    clearTimeout(t.hideBarTimeout),
                    (t.hideBarTimeout = setTimeout(function () {
                      t.outer.addClass("lg-hide-items");
                    }, t.settings.hideBarsDelay));
                }),
                t.outer.trigger("mousemove.lg"));
          }, this.settings.showBarsAfter);
        }),
        (w.prototype.initPictureFill = function (t) {
          if (this.settings.supportLegacyBrowser)
            try {
              picturefill({ elements: [t.get()] });
            } catch (t) {
              console.warn(
                "lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document."
              );
            }
        }),
        (w.prototype.counter = function () {
          if (this.settings.counter) {
            var t =
              '<div class="lg-counter" role="status" aria-live="polite">\n                <span id="' +
              this.getIdName("lg-counter-current") +
              '" class="lg-counter-current">' +
              (this.index + 1) +
              ' </span> /\n                <span id="' +
              this.getIdName("lg-counter-all") +
              '" class="lg-counter-all">' +
              this.galleryItems.length +
              " </span></div>";
            this.outer.find(this.settings.appendCounterTo).append(t);
          }
        }),
        (w.prototype.addHtml = function (t) {
          var e, i;
          if (
            (this.galleryItems[t].subHtmlUrl
              ? (i = this.galleryItems[t].subHtmlUrl)
              : (e = this.galleryItems[t].subHtml),
            !i)
          )
            if (e) {
              var s = e.substring(0, 1);
              ("." !== s && "#" !== s) ||
                (e =
                  this.settings.subHtmlSelectorRelative &&
                  !this.settings.dynamic
                    ? x(this.items).eq(t).find(e).first().html()
                    : x(e).first().html());
            } else e = "";
          if (".lg-item" !== this.settings.appendSubHtmlTo)
            i
              ? T(i, this.outer.find(".lg-sub-html"), "replace")
              : this.outer.find(".lg-sub-html").html(e);
          else {
            var n = x(this.getSlideItemId(t));
            i
              ? T(i, n, "append")
              : n.append('<div class="lg-sub-html">' + e + "</div>");
          }
          null != e &&
            ("" === e
              ? this.outer
                  .find(this.settings.appendSubHtmlTo)
                  .addClass("lg-empty-html")
              : this.outer
                  .find(this.settings.appendSubHtmlTo)
                  .removeClass("lg-empty-html")),
            this.LGel.trigger(r, { index: t });
        }),
        (w.prototype.preload = function (t) {
          for (
            var e = 1;
            e <= this.settings.preload && !(e >= this.galleryItems.length - t);
            e++
          )
            this.loadContent(t + e, !1);
          for (var i = 1; i <= this.settings.preload && !(t - i < 0); i++)
            this.loadContent(t - i, !1);
        }),
        (w.prototype.getDummyImgStyles = function (t) {
          return t
            ? "width:" +
                t.width +
                "px;\n                margin-left: -" +
                t.width / 2 +
                "px;\n                margin-top: -" +
                t.height / 2 +
                "px;\n                height:" +
                t.height +
                "px"
            : "";
        }),
        (w.prototype.getVideoContStyle = function (t) {
          return t
            ? "width:" +
                t.width +
                "px;\n                height:" +
                t.height +
                "px"
            : "";
        }),
        (w.prototype.getDummyImageContent = function (t, e, i) {
          var s;
          if ((this.settings.dynamic || (s = x(this.items).eq(e)), s)) {
            var n = void 0;
            if (
              !(n = this.settings.exThumbImage
                ? s.attr(this.settings.exThumbImage)
                : s.find("img").first().attr("src"))
            )
              return "";
            var o = this.getDummyImgStyles(this.currentImageSize),
              r = document.createElement("img");
            return (
              (r.alt = i || ""),
              (r.src = n),
              (r.className = "lg-dummy-img"),
              (r.style.cssText = o),
              t.addClass("lg-first-slide"),
              this.outer.addClass("lg-first-slide-loading"),
              r
            );
          }
          return "";
        }),
        (w.prototype.setImgMarkup = function (t, e, i) {
          var s = this.galleryItems[i],
            n = s.alt,
            o = s.srcset,
            r = s.sizes,
            l = s.sources,
            a = "",
            d = n ? 'alt="' + n + '"' : "";
          a = this.isFirstSlideWithZoomAnimation()
            ? this.getDummyImageContent(e, i, d)
            : D(i, t, d, o, r, l);
          var g = document.createElement("picture");
          (g.className = "lg-img-wrap"), x(g).append(a), e.prepend(g);
        }),
        (w.prototype.onSlideObjectLoad = function (t, e, i, s) {
          var n = t.find(".lg-object").first();
          M(n.get()) || e
            ? i()
            : (n.on("load.lg error.lg", function () {
                i && i();
              }),
              n.on("error.lg", function () {
                s && s();
              }));
        }),
        (w.prototype.onLgObjectLoad = function (t, e, i, s, n, o) {
          var r = this;
          this.onSlideObjectLoad(
            t,
            o,
            function () {
              r.triggerSlideItemLoad(t, e, i, s, n);
            },
            function () {
              t.addClass("lg-complete lg-complete_"),
                t.html(
                  '<span class="lg-error-msg">' +
                    r.settings.strings.mediaLoadingFailed +
                    "</span>"
                );
            }
          );
        }),
        (w.prototype.triggerSlideItemLoad = function (t, e, i, s, n) {
          var o = this,
            r = this.galleryItems[e],
            l = n && "video" === this.getSlideType(r) && !r.poster ? s : 0;
          setTimeout(function () {
            t.addClass("lg-complete lg-complete_"),
              o.LGel.trigger(d, { index: e, delay: i || 0, isFirstSlide: n });
          }, l);
        }),
        (w.prototype.isFirstSlideWithZoomAnimation = function () {
          return !(
            this.lGalleryOn ||
            !this.zoomFromOrigin ||
            !this.currentImageSize
          );
        }),
        (w.prototype.addSlideVideoInfo = function (t) {
          var e = this;
          t.forEach(function (t, i) {
            (t.__slideVideoInfo = P(t.src, !!t.video, i)),
              t.__slideVideoInfo &&
                e.settings.loadYouTubePoster &&
                !t.poster &&
                t.__slideVideoInfo.youtube &&
                (t.poster =
                  "//img.youtube.com/vi/" +
                  t.__slideVideoInfo.youtube[1] +
                  "/maxresdefault.jpg");
          });
        }),
        (w.prototype.loadContent = function (t, i) {
          var n = this,
            o = this.galleryItems[t],
            r = x(this.getSlideItemId(t)),
            l = o.poster,
            a = o.srcset,
            d = o.sizes,
            g = o.sources,
            h = o.src,
            c = o.video,
            u = c && "string" == typeof c ? JSON.parse(c) : c;
          if (o.responsive) {
            var m = o.responsive.split(",");
            h = z(m) || h;
          }
          var p = o.__slideVideoInfo,
            f = "",
            y = !!o.iframe,
            v = !this.lGalleryOn,
            b = 0;
          if (
            (v &&
              (b =
                this.zoomFromOrigin && this.currentImageSize
                  ? this.settings.startAnimationDuration + 10
                  : this.settings.backdropDuration + 10),
            !r.hasClass("lg-loaded"))
          ) {
            if (p) {
              var C = this.mediaContainerPosition,
                I = C.top,
                w = C.bottom,
                S = E(
                  this.items[t],
                  this.outer,
                  I + w,
                  p && this.settings.videoMaxSize
                );
              f = this.getVideoContStyle(S);
            }
            if (y) {
              var T = L(
                this.settings.iframeWidth,
                this.settings.iframeHeight,
                this.settings.iframeMaxWidth,
                this.settings.iframeMaxHeight,
                h,
                o.iframeTitle
              );
              r.prepend(T);
            } else if (l) {
              var O = "";
              v &&
                this.zoomFromOrigin &&
                this.currentImageSize &&
                (O = this.getDummyImageContent(r, t, ""));
              T = G(l, O || "", f, this.settings.strings.playVideo, p);
              r.prepend(T);
            } else if (p) {
              T = '<div class="lg-video-cont " style="' + f + '"></div>';
              r.prepend(T);
            } else if ((this.setImgMarkup(h, r, t), a || g)) {
              var M = r.find(".lg-object");
              this.initPictureFill(M);
            }
            (l || p) &&
              this.LGel.trigger(s, {
                index: t,
                src: h,
                html5Video: u,
                hasPoster: !!l,
              }),
              this.LGel.trigger(e, { index: t }),
              this.lGalleryOn &&
                ".lg-item" === this.settings.appendSubHtmlTo &&
                this.addHtml(t);
          }
          var k = 0;
          b && !x(document.body).hasClass("lg-from-hash") && (k = b),
            this.isFirstSlideWithZoomAnimation() &&
              (setTimeout(function () {
                r.removeClass(
                  "lg-start-end-progress lg-start-progress"
                ).removeAttr("style");
              }, this.settings.startAnimationDuration + 100),
              r.hasClass("lg-loaded") ||
                setTimeout(function () {
                  if ("image" === n.getSlideType(o)) {
                    var e = o.alt,
                      i = e ? 'alt="' + e + '"' : "";
                    if (
                      (r
                        .find(".lg-img-wrap")
                        .append(D(t, h, i, a, d, o.sources)),
                      a || g)
                    ) {
                      var s = r.find(".lg-object");
                      n.initPictureFill(s);
                    }
                  }
                  ("image" === n.getSlideType(o) ||
                    ("video" === n.getSlideType(o) && l)) &&
                    (n.onLgObjectLoad(r, t, b, k, !0, !1),
                    n.onSlideObjectLoad(
                      r,
                      !(!p || !p.html5 || l),
                      function () {
                        n.loadContentOnFirstSlideLoad(t, r, k);
                      },
                      function () {
                        n.loadContentOnFirstSlideLoad(t, r, k);
                      }
                    ));
                }, this.settings.startAnimationDuration + 100)),
            r.addClass("lg-loaded"),
            (this.isFirstSlideWithZoomAnimation() &&
              ("video" !== this.getSlideType(o) || l)) ||
              this.onLgObjectLoad(r, t, b, k, v, !(!p || !p.html5 || l)),
            (this.zoomFromOrigin && this.currentImageSize) ||
              !r.hasClass("lg-complete_") ||
              this.lGalleryOn ||
              setTimeout(function () {
                r.addClass("lg-complete");
              }, this.settings.backdropDuration),
            (this.lGalleryOn = !0),
            !0 === i &&
              (r.hasClass("lg-complete_")
                ? this.preload(t)
                : r
                    .find(".lg-object")
                    .first()
                    .on("load.lg error.lg", function () {
                      n.preload(t);
                    }));
        }),
        (w.prototype.loadContentOnFirstSlideLoad = function (t, e, i) {
          var s = this;
          setTimeout(function () {
            e.find(".lg-dummy-img").remove(),
              e.removeClass("lg-first-slide"),
              s.outer.removeClass("lg-first-slide-loading"),
              (s.isDummyImageRemoved = !0),
              s.preload(t);
          }, i + 300);
        }),
        (w.prototype.getItemsToBeInsertedToDom = function (t, e, i) {
          var s = this;
          void 0 === i && (i = 0);
          var n = [],
            o = Math.max(i, 3);
          o = Math.min(o, this.galleryItems.length);
          var r = "lg-item-" + this.lgId + "-" + e;
          if (this.galleryItems.length <= 3)
            return (
              this.galleryItems.forEach(function (t, e) {
                n.push("lg-item-" + s.lgId + "-" + e);
              }),
              n
            );
          if (t < (this.galleryItems.length - 1) / 2) {
            for (var l = t; l > t - o / 2 && l >= 0; l--)
              n.push("lg-item-" + this.lgId + "-" + l);
            var a = n.length;
            for (l = 0; l < o - a; l++)
              n.push("lg-item-" + this.lgId + "-" + (t + l + 1));
          } else {
            for (l = t; l <= this.galleryItems.length - 1 && l < t + o / 2; l++)
              n.push("lg-item-" + this.lgId + "-" + l);
            for (a = n.length, l = 0; l < o - a; l++)
              n.push("lg-item-" + this.lgId + "-" + (t - l - 1));
          }
          return (
            this.settings.loop &&
              (t === this.galleryItems.length - 1
                ? n.push("lg-item-" + this.lgId + "-0")
                : 0 === t &&
                  n.push(
                    "lg-item-" +
                      this.lgId +
                      "-" +
                      (this.galleryItems.length - 1)
                  )),
            -1 === n.indexOf(r) && n.push("lg-item-" + this.lgId + "-" + e),
            n
          );
        }),
        (w.prototype.organizeSlideItems = function (t, e) {
          var i = this,
            s = this.getItemsToBeInsertedToDom(
              t,
              e,
              this.settings.numberOfSlideItemsInDom
            );
          return (
            s.forEach(function (t) {
              -1 === i.currentItemsInDom.indexOf(t) &&
                i.$inner.append('<div id="' + t + '" class="lg-item"></div>');
            }),
            this.currentItemsInDom.forEach(function (t) {
              -1 === s.indexOf(t) && x("#" + t).remove();
            }),
            s
          );
        }),
        (w.prototype.getPreviousSlideIndex = function () {
          var t = 0;
          try {
            var e = this.outer.find(".lg-current").first().attr("id");
            t = parseInt(e.split("-")[3]) || 0;
          } catch (e) {
            t = 0;
          }
          return t;
        }),
        (w.prototype.setDownloadValue = function (t) {
          if (this.settings.download) {
            var e = this.galleryItems[t];
            if (!1 === e.downloadUrl || "false" === e.downloadUrl)
              this.outer.addClass("lg-hide-download");
            else {
              var i = this.getElementById("lg-download");
              this.outer.removeClass("lg-hide-download"),
                i.attr("href", e.downloadUrl || e.src),
                e.download && i.attr("download", e.download);
            }
          }
        }),
        (w.prototype.makeSlideAnimation = function (t, e, i) {
          var s = this;
          this.lGalleryOn && i.addClass("lg-slide-progress"),
            setTimeout(
              function () {
                s.outer.addClass("lg-no-trans"),
                  s.outer
                    .find(".lg-item")
                    .removeClass("lg-prev-slide lg-next-slide"),
                  "prev" === t
                    ? (e.addClass("lg-prev-slide"), i.addClass("lg-next-slide"))
                    : (e.addClass("lg-next-slide"),
                      i.addClass("lg-prev-slide")),
                  setTimeout(function () {
                    s.outer.find(".lg-item").removeClass("lg-current"),
                      e.addClass("lg-current"),
                      s.outer.removeClass("lg-no-trans");
                  }, 50);
              },
              this.lGalleryOn ? this.settings.slideDelay : 0
            );
        }),
        (w.prototype.slide = function (t, e, i, s) {
          var n = this,
            o = this.getPreviousSlideIndex();
          if (
            ((this.currentItemsInDom = this.organizeSlideItems(t, o)),
            !this.lGalleryOn || o !== t)
          ) {
            var r = this.galleryItems.length;
            if (!this.lgBusy) {
              this.settings.counter && this.updateCurrentCounter(t);
              var l = this.getSlideItem(t),
                a = this.getSlideItem(o),
                d = this.galleryItems[t],
                c = d.__slideVideoInfo;
              if (
                (this.outer.attr("data-lg-slide-type", this.getSlideType(d)),
                this.setDownloadValue(t),
                c)
              ) {
                var u = this.mediaContainerPosition,
                  m = u.top,
                  p = u.bottom,
                  f = E(
                    this.items[t],
                    this.outer,
                    m + p,
                    c && this.settings.videoMaxSize
                  );
                this.resizeVideoSlide(t, f);
              }
              if (
                (this.LGel.trigger(g, {
                  prevIndex: o,
                  index: t,
                  fromTouch: !!e,
                  fromThumb: !!i,
                }),
                (this.lgBusy = !0),
                clearTimeout(this.hideBarTimeout),
                this.arrowDisable(t),
                s || (t < o ? (s = "prev") : t > o && (s = "next")),
                e)
              ) {
                this.outer
                  .find(".lg-item")
                  .removeClass("lg-prev-slide lg-current lg-next-slide");
                var y = void 0,
                  v = void 0;
                r > 2
                  ? ((y = t - 1),
                    (v = t + 1),
                    ((0 === t && o === r - 1) || (t === r - 1 && 0 === o)) &&
                      ((v = 0), (y = r - 1)))
                  : ((y = 0), (v = 1)),
                  "prev" === s
                    ? this.getSlideItem(v).addClass("lg-next-slide")
                    : this.getSlideItem(y).addClass("lg-prev-slide"),
                  l.addClass("lg-current");
              } else this.makeSlideAnimation(s, l, a);
              this.lGalleryOn
                ? setTimeout(function () {
                    n.loadContent(t, !0),
                      ".lg-item" !== n.settings.appendSubHtmlTo && n.addHtml(t);
                  }, this.settings.speed +
                    50 +
                    (e ? 0 : this.settings.slideDelay))
                : this.loadContent(t, !0),
                setTimeout(function () {
                  (n.lgBusy = !1),
                    a.removeClass("lg-slide-progress"),
                    n.LGel.trigger(h, {
                      prevIndex: o,
                      index: t,
                      fromTouch: e,
                      fromThumb: i,
                    });
                }, (this.lGalleryOn ? this.settings.speed + 100 : 100) +
                  (e ? 0 : this.settings.slideDelay));
            }
            this.index = t;
          }
        }),
        (w.prototype.updateCurrentCounter = function (t) {
          this.getElementById("lg-counter-current").html(t + 1 + "");
        }),
        (w.prototype.updateCounterTotal = function () {
          this.getElementById("lg-counter-all").html(
            this.galleryItems.length + ""
          );
        }),
        (w.prototype.getSlideType = function (t) {
          return t.__slideVideoInfo ? "video" : t.iframe ? "iframe" : "image";
        }),
        (w.prototype.touchMove = function (t, e, i) {
          var s = e.pageX - t.pageX,
            n = e.pageY - t.pageY,
            o = !1;
          if (
            (this.swipeDirection
              ? (o = !0)
              : Math.abs(s) > 15
              ? ((this.swipeDirection = "horizontal"), (o = !0))
              : Math.abs(n) > 15 &&
                ((this.swipeDirection = "vertical"), (o = !0)),
            o)
          ) {
            var r = this.getSlideItem(this.index);
            if ("horizontal" === this.swipeDirection) {
              null == i || i.preventDefault(),
                this.outer.addClass("lg-dragging"),
                this.setTranslate(r, s, 0);
              var l = r.get().offsetWidth,
                a = (15 * l) / 100 - Math.abs((10 * s) / 100);
              this.setTranslate(
                this.outer.find(".lg-prev-slide").first(),
                -l + s - a,
                0
              ),
                this.setTranslate(
                  this.outer.find(".lg-next-slide").first(),
                  l + s + a,
                  0
                );
            } else if (
              "vertical" === this.swipeDirection &&
              this.settings.swipeToClose
            ) {
              null == i || i.preventDefault(),
                this.$container.addClass("lg-dragging-vertical");
              var d = 1 - Math.abs(n) / window.innerHeight;
              this.$backdrop.css("opacity", d);
              var g = 1 - Math.abs(n) / (2 * window.innerWidth);
              this.setTranslate(r, 0, n, g, g),
                Math.abs(n) > 100 &&
                  this.outer
                    .addClass("lg-hide-items")
                    .removeClass("lg-components-open");
            }
          }
        }),
        (w.prototype.touchEnd = function (t, e, i) {
          var s,
            n = this;
          "lg-slide" !== this.settings.mode && this.outer.addClass("lg-slide"),
            setTimeout(function () {
              n.$container.removeClass("lg-dragging-vertical"),
                n.outer
                  .removeClass("lg-dragging lg-hide-items")
                  .addClass("lg-components-open");
              var o = !0;
              if ("horizontal" === n.swipeDirection) {
                s = t.pageX - e.pageX;
                var r = Math.abs(t.pageX - e.pageX);
                s < 0 && r > n.settings.swipeThreshold
                  ? (n.goToNextSlide(!0), (o = !1))
                  : s > 0 &&
                    r > n.settings.swipeThreshold &&
                    (n.goToPrevSlide(!0), (o = !1));
              } else if ("vertical" === n.swipeDirection) {
                if (
                  ((s = Math.abs(t.pageY - e.pageY)),
                  n.settings.closable && n.settings.swipeToClose && s > 100)
                )
                  return void n.closeGallery();
                n.$backdrop.css("opacity", 1);
              }
              if (
                (n.outer.find(".lg-item").removeAttr("style"),
                o && Math.abs(t.pageX - e.pageX) < 5)
              ) {
                var l = x(i.target);
                n.isPosterElement(l) && n.LGel.trigger(c);
              }
              n.swipeDirection = void 0;
            }),
            setTimeout(function () {
              n.outer.hasClass("lg-dragging") ||
                "lg-slide" === n.settings.mode ||
                n.outer.removeClass("lg-slide");
            }, this.settings.speed + 100);
        }),
        (w.prototype.enableSwipe = function () {
          var t = this,
            e = {},
            i = {},
            s = !1,
            n = !1;
          this.settings.enableSwipe &&
            (this.$inner.on("touchstart.lg", function (i) {
              t.dragOrSwipeEnabled = !0;
              var s = t.getSlideItem(t.index);
              (!x(i.target).hasClass("lg-item") &&
                !s.get().contains(i.target)) ||
                t.outer.hasClass("lg-zoomed") ||
                t.lgBusy ||
                1 !== i.touches.length ||
                ((n = !0),
                (t.touchAction = "swipe"),
                t.manageSwipeClass(),
                (e = { pageX: i.touches[0].pageX, pageY: i.touches[0].pageY }));
            }),
            this.$inner.on("touchmove.lg", function (o) {
              n &&
                "swipe" === t.touchAction &&
                1 === o.touches.length &&
                ((i = { pageX: o.touches[0].pageX, pageY: o.touches[0].pageY }),
                t.touchMove(e, i, o),
                (s = !0));
            }),
            this.$inner.on("touchend.lg", function (o) {
              if ("swipe" === t.touchAction) {
                if (s) (s = !1), t.touchEnd(i, e, o);
                else if (n) {
                  var r = x(o.target);
                  t.isPosterElement(r) && t.LGel.trigger(c);
                }
                (t.touchAction = void 0), (n = !1);
              }
            }));
        }),
        (w.prototype.enableDrag = function () {
          var t = this,
            e = {},
            i = {},
            s = !1,
            n = !1;
          this.settings.enableDrag &&
            (this.outer.on("mousedown.lg", function (i) {
              t.dragOrSwipeEnabled = !0;
              var n = t.getSlideItem(t.index);
              (x(i.target).hasClass("lg-item") || n.get().contains(i.target)) &&
                (t.outer.hasClass("lg-zoomed") ||
                  t.lgBusy ||
                  (i.preventDefault(),
                  t.lgBusy ||
                    (t.manageSwipeClass(),
                    (e = { pageX: i.pageX, pageY: i.pageY }),
                    (s = !0),
                    (t.outer.get().scrollLeft += 1),
                    (t.outer.get().scrollLeft -= 1),
                    t.outer.removeClass("lg-grab").addClass("lg-grabbing"),
                    t.LGel.trigger(u))));
            }),
            x(window).on("mousemove.lg.global" + this.lgId, function (o) {
              s &&
                t.lgOpened &&
                ((n = !0),
                (i = { pageX: o.pageX, pageY: o.pageY }),
                t.touchMove(e, i),
                t.LGel.trigger(m));
            }),
            x(window).on("mouseup.lg.global" + this.lgId, function (o) {
              if (t.lgOpened) {
                var r = x(o.target);
                n
                  ? ((n = !1), t.touchEnd(i, e, o), t.LGel.trigger(p))
                  : t.isPosterElement(r) && t.LGel.trigger(c),
                  s &&
                    ((s = !1),
                    t.outer.removeClass("lg-grabbing").addClass("lg-grab"));
              }
            }));
        }),
        (w.prototype.triggerPosterClick = function () {
          var t = this;
          this.$inner.on("click.lg", function (e) {
            !t.dragOrSwipeEnabled &&
              t.isPosterElement(x(e.target)) &&
              t.LGel.trigger(c);
          });
        }),
        (w.prototype.manageSwipeClass = function () {
          var t = this.index + 1,
            e = this.index - 1;
          this.settings.loop &&
            this.galleryItems.length > 2 &&
            (0 === this.index
              ? (e = this.galleryItems.length - 1)
              : this.index === this.galleryItems.length - 1 && (t = 0)),
            this.outer
              .find(".lg-item")
              .removeClass("lg-next-slide lg-prev-slide"),
            e > -1 && this.getSlideItem(e).addClass("lg-prev-slide"),
            this.getSlideItem(t).addClass("lg-next-slide");
        }),
        (w.prototype.goToNextSlide = function (t) {
          var e = this,
            i = this.settings.loop;
          t && this.galleryItems.length < 3 && (i = !1),
            this.lgBusy ||
              (this.index + 1 < this.galleryItems.length
                ? (this.index++,
                  this.LGel.trigger(f, { index: this.index }),
                  this.slide(this.index, !!t, !1, "next"))
                : i
                ? ((this.index = 0),
                  this.LGel.trigger(f, { index: this.index }),
                  this.slide(this.index, !!t, !1, "next"))
                : this.settings.slideEndAnimation &&
                  !t &&
                  (this.outer.addClass("lg-right-end"),
                  setTimeout(function () {
                    e.outer.removeClass("lg-right-end");
                  }, 400)));
        }),
        (w.prototype.goToPrevSlide = function (t) {
          var e = this,
            i = this.settings.loop;
          t && this.galleryItems.length < 3 && (i = !1),
            this.lgBusy ||
              (this.index > 0
                ? (this.index--,
                  this.LGel.trigger(y, { index: this.index, fromTouch: t }),
                  this.slide(this.index, !!t, !1, "prev"))
                : i
                ? ((this.index = this.galleryItems.length - 1),
                  this.LGel.trigger(y, { index: this.index, fromTouch: t }),
                  this.slide(this.index, !!t, !1, "prev"))
                : this.settings.slideEndAnimation &&
                  !t &&
                  (this.outer.addClass("lg-left-end"),
                  setTimeout(function () {
                    e.outer.removeClass("lg-left-end");
                  }, 400)));
        }),
        (w.prototype.keyPress = function () {
          var t = this;
          x(window).on("keydown.lg.global" + this.lgId, function (e) {
            t.lgOpened &&
              !0 === t.settings.escKey &&
              27 === e.keyCode &&
              (e.preventDefault(),
              t.settings.allowMediaOverlap &&
              t.outer.hasClass("lg-can-toggle") &&
              t.outer.hasClass("lg-components-open")
                ? t.outer.removeClass("lg-components-open")
                : t.closeGallery()),
              t.lgOpened &&
                t.galleryItems.length > 1 &&
                (37 === e.keyCode && (e.preventDefault(), t.goToPrevSlide()),
                39 === e.keyCode && (e.preventDefault(), t.goToNextSlide()));
          });
        }),
        (w.prototype.arrow = function () {
          var t = this;
          this.getElementById("lg-prev").on("click.lg", function () {
            t.goToPrevSlide();
          }),
            this.getElementById("lg-next").on("click.lg", function () {
              t.goToNextSlide();
            });
        }),
        (w.prototype.arrowDisable = function (t) {
          if (!this.settings.loop && this.settings.hideControlOnEnd) {
            var e = this.getElementById("lg-prev"),
              i = this.getElementById("lg-next");
            t + 1 === this.galleryItems.length
              ? i.attr("disabled", "disabled").addClass("disabled")
              : i.removeAttr("disabled").removeClass("disabled"),
              0 === t
                ? e.attr("disabled", "disabled").addClass("disabled")
                : e.removeAttr("disabled").removeClass("disabled");
          }
        }),
        (w.prototype.setTranslate = function (t, e, i, s, n) {
          void 0 === s && (s = 1),
            void 0 === n && (n = 1),
            t.css(
              "transform",
              "translate3d(" +
                e +
                "px, " +
                i +
                "px, 0px) scale3d(" +
                s +
                ", " +
                n +
                ", 1)"
            );
        }),
        (w.prototype.mousewheel = function () {
          var t = this,
            e = 0;
          this.outer.on("wheel.lg", function (i) {
            if (i.deltaY && !(t.galleryItems.length < 2)) {
              i.preventDefault();
              var s = new Date().getTime();
              s - e < 1e3 ||
                ((e = s),
                i.deltaY > 0
                  ? t.goToNextSlide()
                  : i.deltaY < 0 && t.goToPrevSlide());
            }
          });
        }),
        (w.prototype.isSlideElement = function (t) {
          return (
            t.hasClass("lg-outer") ||
            t.hasClass("lg-item") ||
            t.hasClass("lg-img-wrap") ||
            t.hasClass("lg-img-rotate")
          );
        }),
        (w.prototype.isPosterElement = function (t) {
          var e = this.getSlideItem(this.index)
            .find(".lg-video-play-button")
            .get();
          return (
            t.hasClass("lg-video-poster") ||
            t.hasClass("lg-video-play-button") ||
            (e && e.contains(t.get()))
          );
        }),
        (w.prototype.toggleMaximize = function () {
          var t = this;
          this.getElementById("lg-maximize").on("click.lg", function () {
            t.$container.toggleClass("lg-inline"), t.refreshOnResize();
          });
        }),
        (w.prototype.invalidateItems = function () {
          for (var t = 0; t < this.items.length; t++) {
            var e = x(this.items[t]);
            e.off("click.lgcustom-item-" + e.attr("data-lg-id"));
          }
        }),
        (w.prototype.trapFocus = function () {
          var t = this;
          this.$container.get().focus({ preventScroll: !0 }),
            x(window).on("keydown.lg.global" + this.lgId, function (e) {
              if (t.lgOpened && ("Tab" === e.key || 9 === e.keyCode)) {
                var i = k(t.$container.get()),
                  s = i[0],
                  n = i[i.length - 1];
                e.shiftKey
                  ? document.activeElement === s &&
                    (n.focus(), e.preventDefault())
                  : document.activeElement === n &&
                    (s.focus(), e.preventDefault());
              }
            });
        }),
        (w.prototype.manageCloseGallery = function () {
          var t = this;
          if (this.settings.closable) {
            var e = !1;
            this.getElementById("lg-close").on("click.lg", function () {
              t.closeGallery();
            }),
              this.settings.closeOnTap &&
                (this.outer.on("mousedown.lg", function (i) {
                  var s = x(i.target);
                  e = !!t.isSlideElement(s);
                }),
                this.outer.on("mousemove.lg", function () {
                  e = !1;
                }),
                this.outer.on("mouseup.lg", function (i) {
                  var s = x(i.target);
                  t.isSlideElement(s) &&
                    e &&
                    (t.outer.hasClass("lg-dragging") || t.closeGallery());
                }));
          }
        }),
        (w.prototype.closeGallery = function (t) {
          var e = this;
          if (!this.lgOpened || (!this.settings.closable && !t)) return 0;
          this.LGel.trigger(v),
            this.settings.resetScrollPosition &&
              !this.settings.hideScrollbar &&
              x(window).scrollTop(this.prevScrollTop);
          var i,
            s = this.items[this.index];
          if (this.zoomFromOrigin && s) {
            var n = this.mediaContainerPosition,
              o = n.top,
              r = n.bottom,
              l = this.galleryItems[this.index],
              a = l.__slideVideoInfo,
              d = l.poster,
              g = E(s, this.outer, o + r, a && d && this.settings.videoMaxSize);
            i = O(s, this.outer, o, r, g);
          }
          this.zoomFromOrigin && i
            ? (this.outer.addClass("lg-closing lg-zoom-from-image"),
              this.getSlideItem(this.index)
                .addClass("lg-start-end-progress")
                .css(
                  "transition-duration",
                  this.settings.startAnimationDuration + "ms"
                )
                .css("transform", i))
            : (this.outer.addClass("lg-hide-items"),
              this.outer.removeClass("lg-zoom-from-image")),
            this.destroyModules(),
            (this.lGalleryOn = !1),
            (this.isDummyImageRemoved = !1),
            (this.zoomFromOrigin = this.settings.zoomFromOrigin),
            clearTimeout(this.hideBarTimeout),
            (this.hideBarTimeout = !1),
            x("html").removeClass("lg-on"),
            this.outer.removeClass("lg-visible lg-components-open"),
            this.$backdrop.removeClass("in").css("opacity", 0);
          var h =
            this.zoomFromOrigin && i
              ? Math.max(
                  this.settings.startAnimationDuration,
                  this.settings.backdropDuration
                )
              : this.settings.backdropDuration;
          return (
            this.$container.removeClass("lg-show-in"),
            setTimeout(function () {
              e.zoomFromOrigin &&
                i &&
                e.outer.removeClass("lg-zoom-from-image"),
                e.$container.removeClass("lg-show"),
                e.resetScrollBar(),
                e.$backdrop
                  .removeAttr("style")
                  .css(
                    "transition-duration",
                    e.settings.backdropDuration + "ms"
                  ),
                e.outer.removeClass("lg-closing " + e.settings.startClass),
                e.getSlideItem(e.index).removeClass("lg-start-end-progress"),
                e.$inner.empty(),
                e.lgOpened && e.LGel.trigger(b, { instance: e }),
                e.$container.get() && e.$container.get().blur(),
                (e.lgOpened = !1);
            }, h + 100),
            h + 100
          );
        }),
        (w.prototype.initModules = function () {
          this.plugins.forEach(function (t) {
            try {
              t.init();
            } catch (t) {
              console.warn(
                "lightGallery:- make sure lightGallery module is properly initiated"
              );
            }
          });
        }),
        (w.prototype.destroyModules = function (t) {
          this.plugins.forEach(function (e) {
            try {
              t ? e.destroy() : e.closeGallery && e.closeGallery();
            } catch (t) {
              console.warn(
                "lightGallery:- make sure lightGallery module is properly destroyed"
              );
            }
          });
        }),
        (w.prototype.refresh = function (t) {
          this.settings.dynamic || this.invalidateItems(),
            (this.galleryItems = t || this.getItems()),
            this.updateControls(),
            this.openGalleryOnItemClick(),
            this.LGel.trigger(o);
        }),
        (w.prototype.updateControls = function () {
          this.addSlideVideoInfo(this.galleryItems),
            this.updateCounterTotal(),
            this.manageSingleSlideClassName();
        }),
        (w.prototype.destroyGallery = function () {
          this.destroyModules(!0),
            this.settings.dynamic || this.invalidateItems(),
            x(window).off(".lg.global" + this.lgId),
            this.LGel.off(".lg"),
            this.$container.remove();
        }),
        (w.prototype.destroy = function () {
          var t = this.closeGallery(!0);
          return (
            t
              ? setTimeout(this.destroyGallery.bind(this), t)
              : this.destroyGallery(),
            t
          );
        }),
        w
      );
    })();
  return function (t, e) {
    return new H(t, e);
  };
});
;

/* lg-video */
/**
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!(function (e, o) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = o())
    : "function" == typeof define && define.amd
    ? define(o)
    : ((e = "undefined" != typeof globalThis ? globalThis : e || self).lgVideo =
        o());
})(this, function () {
  "use strict";
  var e = function () {
      return (e =
        Object.assign ||
        function (e) {
          for (var o, i = 1, t = arguments.length; i < t; i++)
            for (var s in (o = arguments[i]))
              Object.prototype.hasOwnProperty.call(o, s) && (e[s] = o[s]);
          return e;
        }).apply(this, arguments);
    },
    o = {
      autoplayFirstVideo: !0,
      youTubePlayerParams: !1,
      vimeoPlayerParams: !1,
      wistiaPlayerParams: !1,
      gotoNextSlideOnVideoEnd: !0,
      autoplayVideoOnSlide: !1,
      videojs: !1,
      videojsTheme: "",
      videojsOptions: {},
    },
    i = "lgHasVideo",
    t = "lgSlideItemLoad",
    s = "lgBeforeSlide",
    n = "lgAfterSlide",
    l = "lgPosterClick",
    r = function (e) {
      return Object.keys(e)
        .map(function (o) {
          return encodeURIComponent(o) + "=" + encodeURIComponent(e[o]);
        })
        .join("&");
    },
    d = function (o, i) {
      if (!o.youtube) return "";
      var t = o.youtube[2]
          ? o.youtube[2]
              .slice(1)
              .split("&")
              .map(function (e) {
                return e.split("=");
              })
              .reduce(function (e, o) {
                var i = o.map(decodeURIComponent),
                  t = i[0],
                  s = i[1];
                return (e[t] = s), e;
              }, {})
          : "",
        s = i || {},
        n = e(
          e(
            e({}, { wmode: "opaque", autoplay: 0, mute: 1, enablejsapi: 1 }),
            s
          ),
          t
        );
      return "?" + r(n);
    };
  return (function () {
    function a(i) {
      return (
        (this.core = i), (this.settings = e(e({}, o), this.core.settings)), this
      );
    }
    return (
      (a.prototype.init = function () {
        var e = this;
        this.core.LGel.on(i + ".video", this.onHasVideo.bind(this)),
          this.core.LGel.on(l + ".video", function () {
            var o = e.core.getSlideItem(e.core.index);
            e.loadVideoOnPosterClick(o);
          }),
          this.core.LGel.on(t + ".video", this.onSlideItemLoad.bind(this)),
          this.core.LGel.on(s + ".video", this.onBeforeSlide.bind(this)),
          this.core.LGel.on(n + ".video", this.onAfterSlide.bind(this));
      }),
      (a.prototype.onSlideItemLoad = function (e) {
        var o = this,
          i = e.detail,
          t = i.isFirstSlide,
          s = i.index;
        this.settings.autoplayFirstVideo &&
          t &&
          s === this.core.index &&
          setTimeout(function () {
            o.loadAndPlayVideo(s);
          }, 200),
          !t &&
            this.settings.autoplayVideoOnSlide &&
            s === this.core.index &&
            this.loadAndPlayVideo(s);
      }),
      (a.prototype.onHasVideo = function (e) {
        var o = e.detail,
          i = o.index,
          t = o.src,
          s = o.html5Video;
        o.hasPoster ||
          (this.appendVideos(this.core.getSlideItem(i), {
            src: t,
            addClass: "lg-object",
            index: i,
            html5Video: s,
          }),
          this.gotoNextSlideOnVideoEnd(t, i));
      }),
      (a.prototype.onBeforeSlide = function (e) {
        if (this.core.lGalleryOn) {
          var o = e.detail.prevIndex;
          this.pauseVideo(o);
        }
      }),
      (a.prototype.onAfterSlide = function (e) {
        var o = this,
          i = e.detail,
          t = i.index,
          s = i.prevIndex,
          n = this.core.getSlideItem(t);
        this.settings.autoplayVideoOnSlide &&
          t !== s &&
          n.hasClass("lg-complete") &&
          setTimeout(function () {
            o.loadAndPlayVideo(t);
          }, 100);
      }),
      (a.prototype.loadAndPlayVideo = function (e) {
        var o = this.core.getSlideItem(e);
        this.core.galleryItems[e].poster
          ? this.loadVideoOnPosterClick(o, !0)
          : this.playVideo(e);
      }),
      (a.prototype.playVideo = function (e) {
        this.controlVideo(e, "play");
      }),
      (a.prototype.pauseVideo = function (e) {
        this.controlVideo(e, "pause");
      }),
      (a.prototype.getVideoHtml = function (e, o, i, t) {
        var s = "",
          n = this.core.galleryItems[i].__slideVideoInfo || {},
          l = this.core.galleryItems[i],
          a = l.title || l.alt;
        a = a ? 'title="' + a + '"' : "";
        var c =
          'allowtransparency="true"\n            frameborder="0"\n            scrolling="no"\n            allowfullscreen\n            mozallowfullscreen\n            webkitallowfullscreen\n            oallowfullscreen\n            msallowfullscreen';
        if (n.youtube) {
          var u = "lg-youtube" + i,
            f = d(n, this.settings.youTubePlayerParams);
          s =
            '<iframe allow="autoplay" id=' +
            u +
            ' class="lg-video-object lg-youtube ' +
            o +
            '" ' +
            a +
            ' src="' +
            (e.includes("youtube-nocookie.com")
              ? "//www.youtube-nocookie.com/"
              : "//www.youtube.com/") +
            "embed/" +
            (n.youtube[1] + f) +
            '" ' +
            c +
            "></iframe>";
        } else if (n.vimeo) {
          u = "lg-vimeo" + i;
          var h = (function (e, o) {
            if (!o || !o.vimeo) return "";
            var i = o.vimeo[2] || "",
              t = Object.assign({}, { autoplay: 0, muted: 1 }, e),
              s = t && 0 !== Object.keys(t).length ? r(t) : "",
              n = (
                (o.vimeo[0].split("/").pop() || "").split("?")[0] || ""
              ).split("#")[0],
              l = o.vimeo[1] !== n;
            l && (i = i.replace("/" + n, ""));
            var d = l ? "h=" + n : "";
            return (
              "?" +
              d +
              (s = d ? "&" + s : s) +
              ("?" == i[0] ? "&" + i.slice(1) : i || "")
            );
          })(this.settings.vimeoPlayerParams, n);
          s =
            '<iframe allow="autoplay" id=' +
            u +
            ' class="lg-video-object lg-vimeo ' +
            o +
            '" ' +
            a +
            ' src="//player.vimeo.com/video/' +
            (n.vimeo[1] + h) +
            '" ' +
            c +
            "></iframe>";
        } else if (n.wistia) {
          var g = "lg-wistia" + i;
          (h = (h = r(this.settings.wistiaPlayerParams)) ? "?" + h : ""),
            (s =
              '<iframe allow="autoplay" id="' +
              g +
              '" src="//fast.wistia.net/embed/iframe/' +
              (n.wistia[4] + h) +
              '" ' +
              a +
              ' class="wistia_embed lg-video-object lg-wistia ' +
              o +
              '" name="wistia_embed" ' +
              c +
              "></iframe>");
        } else if (n.html5) {
          for (var p = "", y = 0; y < t.source.length; y++) {
            var v = t.source[y].type,
              m = v ? 'type="' + v + '"' : "";
            p += '<source src="' + t.source[y].src + '" ' + m + ">";
          }
          if (t.tracks) {
            var w = function (e) {
              var o = "",
                i = t.tracks[e];
              Object.keys(i || {}).forEach(function (e) {
                o += e + '="' + i[e] + '" ';
              }),
                (p += "<track " + o + ">");
            };
            for (y = 0; y < t.tracks.length; y++) w(y);
          }
          var V = "",
            b = t.attributes || {};
          Object.keys(b || {}).forEach(function (e) {
            V += e + '="' + b[e] + '" ';
          }),
            (s =
              '<video class="lg-video-object lg-html5 ' +
              (this.settings.videojs && this.settings.videojsTheme
                ? this.settings.videojsTheme + " "
                : "") +
              " " +
              (this.settings.videojs ? " video-js" : "") +
              '" ' +
              V +
              ">\n                " +
              p +
              "\n                Your browser does not support HTML5 video.\n            </video>");
        }
        return s;
      }),
      (a.prototype.appendVideos = function (e, o) {
        var i,
          t = this.getVideoHtml(o.src, o.addClass, o.index, o.html5Video);
        e.find(".lg-video-cont").append(t);
        var s = e.find(".lg-video-object").first();
        if (
          (o.html5Video &&
            s.on("mousedown.lg.video", function (e) {
              e.stopPropagation();
            }),
          this.settings.videojs &&
            (null === (i = this.core.galleryItems[o.index].__slideVideoInfo) ||
            void 0 === i
              ? void 0
              : i.html5))
        )
          try {
            return videojs(s.get(), this.settings.videojsOptions);
          } catch (e) {
            console.error("lightGallery:- Make sure you have included videojs");
          }
      }),
      (a.prototype.gotoNextSlideOnVideoEnd = function (e, o) {
        var i = this,
          t = this.core.getSlideItem(o).find(".lg-video-object").first(),
          s = this.core.galleryItems[o].__slideVideoInfo || {};
        if (this.settings.gotoNextSlideOnVideoEnd)
          if (s.html5)
            t.on("ended", function () {
              i.core.goToNextSlide();
            });
          else if (s.vimeo)
            try {
              new Vimeo.Player(t.get()).on("ended", function () {
                i.core.goToNextSlide();
              });
            } catch (e) {
              console.error(
                "lightGallery:- Make sure you have included //github.com/vimeo/player.js"
              );
            }
          else if (s.wistia)
            try {
              (window._wq = window._wq || []),
                window._wq.push({
                  id: t.attr("id"),
                  onReady: function (e) {
                    e.bind("end", function () {
                      i.core.goToNextSlide();
                    });
                  },
                });
            } catch (e) {
              console.error(
                "lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js"
              );
            }
      }),
      (a.prototype.controlVideo = function (e, o) {
        var i = this.core.getSlideItem(e).find(".lg-video-object").first(),
          t = this.core.galleryItems[e].__slideVideoInfo || {};
        if (i.get())
          if (t.youtube)
            try {
              i.get().contentWindow.postMessage(
                '{"event":"command","func":"' + o + 'Video","args":""}',
                "*"
              );
            } catch (e) {
              console.error("lightGallery:- " + e);
            }
          else if (t.vimeo)
            try {
              new Vimeo.Player(i.get())[o]();
            } catch (e) {
              console.error(
                "lightGallery:- Make sure you have included //github.com/vimeo/player.js"
              );
            }
          else if (t.html5)
            if (this.settings.videojs)
              try {
                videojs(i.get())[o]();
              } catch (e) {
                console.error(
                  "lightGallery:- Make sure you have included videojs"
                );
              }
            else i.get()[o]();
          else if (t.wistia)
            try {
              (window._wq = window._wq || []),
                window._wq.push({
                  id: i.attr("id"),
                  onReady: function (e) {
                    e[o]();
                  },
                });
            } catch (e) {
              console.error(
                "lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js"
              );
            }
      }),
      (a.prototype.loadVideoOnPosterClick = function (e, o) {
        var i = this;
        if (e.hasClass("lg-video-loaded")) o && this.playVideo(this.core.index);
        else if (e.hasClass("lg-has-video")) this.playVideo(this.core.index);
        else {
          e.addClass("lg-has-video");
          var t = void 0,
            s = this.core.galleryItems[this.core.index].src,
            n = this.core.galleryItems[this.core.index].video;
          n && (t = "string" == typeof n ? JSON.parse(n) : n);
          var l = this.appendVideos(e, {
            src: s,
            addClass: "",
            index: this.core.index,
            html5Video: t,
          });
          this.gotoNextSlideOnVideoEnd(s, this.core.index);
          var r = e.find(".lg-object").first().get();
          e.find(".lg-video-cont").first().append(r),
            e.addClass("lg-video-loading"),
            l &&
              l.ready(function () {
                l.on("loadedmetadata", function () {
                  i.onVideoLoadAfterPosterClick(e, i.core.index);
                });
              }),
            e
              .find(".lg-video-object")
              .first()
              .on("load.lg error.lg loadedmetadata.lg", function () {
                setTimeout(function () {
                  i.onVideoLoadAfterPosterClick(e, i.core.index);
                }, 50);
              });
        }
      }),
      (a.prototype.onVideoLoadAfterPosterClick = function (e, o) {
        e.addClass("lg-video-loaded"), this.playVideo(o);
      }),
      (a.prototype.destroy = function () {
        this.core.LGel.off(".lg.video"), this.core.LGel.off(".video");
      }),
      a
    );
  })();
});
;

/* lg-share */
/**
 * lightgallery | 2.8.2 | November 28th 2024
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).lgShare=e()}(this,(function(){"use strict";var t=function(){return(t=Object.assign||function(t){for(var e,r=1,o=arguments.length;r<o;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)};function e(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var o=Array(t),n=0;for(e=0;e<r;e++)for(var i=arguments[e],s=0,a=i.length;s<a;s++,n++)o[n]=i[s];return o}var r={share:!0,facebook:!0,facebookDropdownText:"Facebook",twitter:!0,twitterDropdownText:"Twitter",pinterest:!0,pinterestDropdownText:"Pinterest",additionalShareOptions:[],sharePluginStrings:{share:"Share"}};function o(t){return"//www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(t.facebookShareUrl||window.location.href)}function n(t){var e=encodeURIComponent(t.twitterShareUrl||window.location.href);return"//twitter.com/intent/tweet?text="+t.tweetText+"&url="+e}function i(t){var e=t.pinterestText,r=encodeURIComponent(t.src);return"http://www.pinterest.com/pin/create/button/?url="+encodeURIComponent(t.pinterestShareUrl||window.location.href)+"&media="+r+"&description="+e}var s="lgAfterSlide";return function(){function a(e){return this.shareOptions=[],this.core=e,this.settings=t(t({},r),this.core.settings),this}return a.prototype.init=function(){this.settings.share&&(this.shareOptions=e(this.getDefaultShareOptions(),this.settings.additionalShareOptions),this.setLgShareMarkup(),this.core.outer.find(".lg-share .lg-dropdown").append(this.getShareListHtml()),this.core.LGel.on(s+".share",this.onAfterSlide.bind(this)))},a.prototype.getShareListHtml=function(){var t="";return this.shareOptions.forEach((function(e){t+=e.dropdownHTML})),t},a.prototype.setLgShareMarkup=function(){var t=this;this.core.$toolbar.append('<button type="button" aria-label="'+this.settings.sharePluginStrings.share+'" aria-haspopup="true" aria-expanded="false" class="lg-share lg-icon">\n                <ul class="lg-dropdown" style="position: absolute;"></ul></button>'),this.core.outer.append('<div class="lg-dropdown-overlay"></div>'),this.core.outer.find(".lg-share").first().on("click.lg",(function(){t.core.outer.toggleClass("lg-dropdown-active"),t.core.outer.hasClass("lg-dropdown-active")?t.core.outer.attr("aria-expanded",!0):t.core.outer.attr("aria-expanded",!1)})),this.core.outer.find(".lg-dropdown-overlay").first().on("click.lg",(function(){t.core.outer.removeClass("lg-dropdown-active"),t.core.outer.attr("aria-expanded",!1)}))},a.prototype.onAfterSlide=function(t){var e=this,r=t.detail.index,o=this.core.galleryItems[r];setTimeout((function(){e.shareOptions.forEach((function(t){var r=t.selector;e.core.outer.find(r).attr("href",t.generateLink(o))}))}),100)},a.prototype.getShareListItemHTML=function(t,e){return'<li><a class="lg-share-'+t+'" rel="noopener" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">'+e+"</span></a></li>"},a.prototype.getDefaultShareOptions=function(){return e(this.settings.facebook?[{type:"facebook",generateLink:o,dropdownHTML:this.getShareListItemHTML("facebook",this.settings.facebookDropdownText),selector:".lg-share-facebook"}]:[],this.settings.twitter?[{type:"twitter",generateLink:n,dropdownHTML:this.getShareListItemHTML("twitter",this.settings.twitterDropdownText),selector:".lg-share-twitter"}]:[],this.settings.pinterest?[{type:"pinterest",generateLink:i,dropdownHTML:this.getShareListItemHTML("pinterest",this.settings.pinterestDropdownText),selector:".lg-share-pinterest"}]:[])},a.prototype.destroy=function(){this.core.outer.find(".lg-dropdown-overlay").remove(),this.core.outer.find(".lg-share").remove(),this.core.LGel.off(".lg.share"),this.core.LGel.off(".share")},a}()}));
;

/* lg-zoom */
/**
 * lightgallery | 2.8.3 | March 1st 2025
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e = "undefined" != typeof globalThis ? globalThis : e || self).lgZoom =
        t());
})(this, function () {
  "use strict";
  var e = function () {
      return (e =
        Object.assign ||
        function (e) {
          for (var t, o = 1, i = arguments.length; o < i; o++)
            for (var s in (t = arguments[o]))
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          return e;
        }).apply(this, arguments);
    },
    t = {
      scale: 1,
      zoom: !0,
      infiniteZoom: !0,
      actualSize: !0,
      showZoomInOutIcons: !1,
      actualSizeIcons: { zoomIn: "lg-zoom-in", zoomOut: "lg-zoom-out" },
      enableZoomAfter: 300,
      zoomPluginStrings: {
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        viewActualSize: "View actual size",
      },
    },
    o = "lgContainerResize",
    i = "lgBeforeOpen",
    s = "lgAfterOpen",
    a = "lgSlideItemLoad",
    n = "lgAfterSlide",
    r = "lgRotateLeft",
    l = "lgRotateRight",
    c = "lgFlipHorizontal",
    g = "lgFlipVertical";
  return (function () {
    function h(o, i) {
      return (
        (this.core = o),
        (this.$LG = i),
        (this.settings = e(e({}, t), this.core.settings)),
        this
      );
    }
    return (
      (h.prototype.buildTemplates = function () {
        var e = this.settings.showZoomInOutIcons
          ? '<button id="' +
            this.core.getIdName("lg-zoom-in") +
            '" type="button" aria-label="' +
            this.settings.zoomPluginStrings.zoomIn +
            '" class="lg-zoom-in lg-icon"></button><button id="' +
            this.core.getIdName("lg-zoom-out") +
            '" type="button" aria-label="' +
            this.settings.zoomPluginStrings.zoomOut +
            '" class="lg-zoom-out lg-icon"></button>'
          : "";
        this.settings.actualSize &&
          (e +=
            '<button id="' +
            this.core.getIdName("lg-actual-size") +
            '" type="button" aria-label="' +
            this.settings.zoomPluginStrings.viewActualSize +
            '" class="' +
            this.settings.actualSizeIcons.zoomIn +
            ' lg-icon"></button>'),
          this.core.outer.addClass("lg-use-transition-for-zoom"),
          this.core.$toolbar.first().append(e);
      }),
      (h.prototype.enableZoom = function (e) {
        var t = this,
          o = this.settings.enableZoomAfter + e.detail.delay;
        this.$LG("body").first().hasClass("lg-from-hash") && e.detail.delay
          ? (o = 0)
          : this.$LG("body").first().removeClass("lg-from-hash"),
          (this.zoomableTimeout = setTimeout(function () {
            t.isImageSlide(t.core.index) &&
              (t.core.getSlideItem(e.detail.index).addClass("lg-zoomable"),
              e.detail.index === t.core.index && t.setZoomEssentials());
          }, o + 30));
      }),
      (h.prototype.enableZoomOnSlideItemLoad = function () {
        this.core.LGel.on(a + ".zoom", this.enableZoom.bind(this));
      }),
      (h.prototype.getDragCords = function (e) {
        return { x: e.pageX, y: e.pageY };
      }),
      (h.prototype.getSwipeCords = function (e) {
        return { x: e.touches[0].pageX, y: e.touches[0].pageY };
      }),
      (h.prototype.getDragAllowedAxises = function (e, t) {
        if (!this.containerRect) return { allowX: !1, allowY: !1 };
        var o = this.core
            .getSlideItem(this.core.index)
            .find(".lg-image")
            .first()
            .get(),
          i = 0,
          s = 0,
          a = o.getBoundingClientRect();
        e
          ? ((i = o.offsetHeight * e), (s = o.offsetWidth * e))
          : t
          ? ((i = a.height + t * a.height), (s = a.width + t * a.width))
          : ((i = a.height), (s = a.width));
        var n = i > this.containerRect.height;
        return { allowX: s > this.containerRect.width, allowY: n };
      }),
      (h.prototype.setZoomEssentials = function () {
        this.containerRect = this.core.$content.get().getBoundingClientRect();
      }),
      (h.prototype.zoomImage = function (e, t, o, i) {
        if (!(Math.abs(t) <= 0)) {
          var s,
            a,
            n = this.containerRect.width / 2 + this.containerRect.left,
            r =
              this.containerRect.height / 2 +
              this.containerRect.top +
              this.scrollTop;
          1 === e && (this.positionChanged = !1);
          var l = this.getDragAllowedAxises(0, t),
            c = l.allowY,
            g = l.allowX;
          this.positionChanged &&
            ((s = this.left / (this.scale - t)),
            (a = this.top / (this.scale - t)),
            (this.pageX = n - s),
            (this.pageY = r - a),
            (this.positionChanged = !1));
          var h,
            m,
            u = this.getPossibleSwipeDragCords(t),
            d = n - this.pageX,
            f = r - this.pageY;
          if (e - t > 1) {
            var p = (e - t) / Math.abs(t);
            (h =
              (d = (t < 0 ? -d : d) + this.left * (p + (t < 0 ? -1 : 1))) / p),
              (m =
                (f = (t < 0 ? -f : f) + this.top * (p + (t < 0 ? -1 : 1))) / p);
          } else {
            (h = d * (p = (e - t) * t)), (m = f * p);
          }
          o &&
            (g
              ? this.isBeyondPossibleLeft(h, u.minX)
                ? (h = u.minX)
                : this.isBeyondPossibleRight(h, u.maxX) && (h = u.maxX)
              : e > 1 &&
                (h < u.minX ? (h = u.minX) : h > u.maxX && (h = u.maxX)),
            c
              ? this.isBeyondPossibleTop(m, u.minY)
                ? (m = u.minY)
                : this.isBeyondPossibleBottom(m, u.maxY) && (m = u.maxY)
              : e > 1 &&
                (m < u.minY ? (m = u.minY) : m > u.maxY && (m = u.maxY))),
            this.setZoomStyles({ x: h, y: m, scale: e }),
            (this.left = h),
            (this.top = m),
            i && this.setZoomImageSize();
        }
      }),
      (h.prototype.resetImageTranslate = function (e) {
        if (this.isImageSlide(e)) {
          var t = this.core.getSlideItem(e).find(".lg-image").first();
          (this.imageReset = !1),
            t.removeClass(
              "reset-transition reset-transition-y reset-transition-x"
            ),
            this.core.outer.removeClass("lg-actual-size"),
            t.css("width", "auto").css("height", "auto"),
            setTimeout(function () {
              t.removeClass("no-transition");
            }, 10);
        }
      }),
      (h.prototype.setZoomImageSize = function () {
        var e = this,
          t = this.core.getSlideItem(this.core.index).find(".lg-image").first();
        setTimeout(function () {
          var o = e.getCurrentImageActualSizeScale();
          e.scale >= o && (t.addClass("no-transition"), (e.imageReset = !0));
        }, 500),
          setTimeout(function () {
            var o = e.getCurrentImageActualSizeScale();
            if (e.scale >= o) {
              var i = e.getDragAllowedAxises(e.scale);
              t
                .css("width", t.get().naturalWidth + "px")
                .css("height", t.get().naturalHeight + "px"),
                e.core.outer.addClass("lg-actual-size"),
                i.allowX && i.allowY
                  ? t.addClass("reset-transition")
                  : i.allowX && !i.allowY
                  ? t.addClass("reset-transition-x")
                  : !i.allowX && i.allowY && t.addClass("reset-transition-y");
            }
          }, 550);
      }),
      (h.prototype.setZoomStyles = function (e) {
        var t = this.core
            .getSlideItem(this.core.index)
            .find(".lg-img-wrap")
            .first(),
          o = this.core.getSlideItem(this.core.index).find(".lg-image").first(),
          i = this.core.outer.find(".lg-current .lg-dummy-img").first();
        (this.scale = e.scale),
          o.css("transform", "scale3d(" + e.scale + ", " + e.scale + ", 1)"),
          i.css("transform", "scale3d(" + e.scale + ", " + e.scale + ", 1)");
        var s = "translate3d(" + e.x + "px, " + e.y + "px, 0)";
        t.css("transform", s);
      }),
      (h.prototype.setActualSize = function (e, t) {
        var o = this;
        if (!this.zoomInProgress) {
          this.zoomInProgress = !0;
          var i = this.core.galleryItems[this.core.index];
          this.resetImageTranslate(e),
            setTimeout(function () {
              if (i.src && !o.core.outer.hasClass("lg-first-slide-loading")) {
                var e = o.getCurrentImageActualSizeScale(),
                  s = o.scale;
                o.core.outer.hasClass("lg-zoomed")
                  ? (o.scale = 1)
                  : (o.scale = o.getScale(e)),
                  o.setPageCords(t),
                  o.beginZoom(o.scale),
                  o.zoomImage(o.scale, o.scale - s, !0, !0);
              }
            }, 50),
            setTimeout(function () {
              o.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
            }, 60),
            setTimeout(function () {
              o.zoomInProgress = !1;
            }, 610);
        }
      }),
      (h.prototype.getNaturalWidth = function (e) {
        var t = this.core.getSlideItem(e).find(".lg-image").first(),
          o = this.core.galleryItems[e].width;
        return o ? parseFloat(o) : t.get().naturalWidth;
      }),
      (h.prototype.getActualSizeScale = function (e, t) {
        return e >= t ? e / t || 2 : 1;
      }),
      (h.prototype.getCurrentImageActualSizeScale = function () {
        var e = this.core
            .getSlideItem(this.core.index)
            .find(".lg-image")
            .first()
            .get().offsetWidth,
          t = this.getNaturalWidth(this.core.index) || e;
        return this.getActualSizeScale(t, e);
      }),
      (h.prototype.getPageCords = function (e) {
        var t = {};
        if (e)
          (t.x = e.pageX || e.touches[0].pageX),
            (t.y = e.pageY || e.touches[0].pageY);
        else {
          var o = this.core.$content.get().getBoundingClientRect();
          (t.x = o.width / 2 + o.left),
            (t.y = o.height / 2 + this.scrollTop + o.top);
        }
        return t;
      }),
      (h.prototype.setPageCords = function (e) {
        var t = this.getPageCords(e);
        (this.pageX = t.x), (this.pageY = t.y);
      }),
      (h.prototype.manageActualPixelClassNames = function () {
        this.core
          .getElementById("lg-actual-size")
          .removeClass(this.settings.actualSizeIcons.zoomIn)
          .addClass(this.settings.actualSizeIcons.zoomOut);
      }),
      (h.prototype.beginZoom = function (e) {
        return (
          this.core.outer.removeClass(
            "lg-zoom-drag-transition lg-zoom-dragging"
          ),
          e > 1
            ? (this.core.outer.addClass("lg-zoomed"),
              this.manageActualPixelClassNames())
            : this.resetZoom(),
          e > 1
        );
      }),
      (h.prototype.getScale = function (e) {
        var t = this.getCurrentImageActualSizeScale();
        return e < 1 ? (e = 1) : e > t && (e = t), e;
      }),
      (h.prototype.init = function () {
        var e = this;
        if (this.settings.zoom) {
          this.buildTemplates(), this.enableZoomOnSlideItemLoad();
          var t = null;
          this.core.outer.on("dblclick.lg", function (t) {
            e.$LG(t.target).hasClass("lg-image") &&
              e.setActualSize(e.core.index, t);
          }),
            this.core.outer.on("touchstart.lg", function (o) {
              var i = e.$LG(o.target);
              1 === o.touches.length &&
                i.hasClass("lg-image") &&
                (t
                  ? (clearTimeout(t),
                    (t = null),
                    o.preventDefault(),
                    e.setActualSize(e.core.index, o))
                  : (t = setTimeout(function () {
                      t = null;
                    }, 300)));
            }),
            this.core.LGel.on(
              o +
                ".zoom " +
                l +
                ".zoom " +
                r +
                ".zoom " +
                c +
                ".zoom " +
                g +
                ".zoom",
              function () {
                if (
                  e.core.lgOpened &&
                  e.isImageSlide(e.core.index) &&
                  !e.core.touchAction
                ) {
                  var t = e.core
                    .getSlideItem(e.core.index)
                    .find(".lg-img-wrap")
                    .first();
                  (e.top = 0),
                    (e.left = 0),
                    e.setZoomEssentials(),
                    e.setZoomSwipeStyles(t, { x: 0, y: 0 }),
                    (e.positionChanged = !0);
                }
              }
            ),
            this.$LG(window).on(
              "scroll.lg.zoom.global" + this.core.lgId,
              function () {
                e.core.lgOpened && (e.scrollTop = e.$LG(window).scrollTop());
              }
            ),
            this.core.getElementById("lg-zoom-out").on("click.lg", function () {
              if (e.isImageSlide(e.core.index)) {
                var t = 0;
                e.imageReset && (e.resetImageTranslate(e.core.index), (t = 50)),
                  setTimeout(function () {
                    var t = e.scale - e.settings.scale;
                    t < 1 && (t = 1),
                      e.beginZoom(t),
                      e.zoomImage(
                        t,
                        -e.settings.scale,
                        !0,
                        !e.settings.infiniteZoom
                      );
                  }, t);
              }
            }),
            this.core.getElementById("lg-zoom-in").on("click.lg", function () {
              e.zoomIn();
            }),
            this.core
              .getElementById("lg-actual-size")
              .on("click.lg", function () {
                e.setActualSize(e.core.index);
              }),
            this.core.LGel.on(i + ".zoom", function () {
              e.core.outer.find(".lg-item").removeClass("lg-zoomable");
            }),
            this.core.LGel.on(s + ".zoom", function () {
              (e.scrollTop = e.$LG(window).scrollTop()),
                (e.pageX = e.core.outer.width() / 2),
                (e.pageY = e.core.outer.height() / 2 + e.scrollTop),
                (e.scale = 1);
            }),
            this.core.LGel.on(n + ".zoom", function (t) {
              var o = t.detail.prevIndex;
              (e.scale = 1),
                (e.positionChanged = !1),
                (e.zoomInProgress = !1),
                e.resetZoom(o),
                e.resetImageTranslate(o),
                e.isImageSlide(e.core.index) && e.setZoomEssentials();
            }),
            this.zoomDrag(),
            this.pinchZoom(),
            this.zoomSwipe(),
            (this.zoomableTimeout = !1),
            (this.positionChanged = !1),
            (this.zoomInProgress = !1);
        }
      }),
      (h.prototype.zoomIn = function () {
        if (this.isImageSlide(this.core.index)) {
          var e = this.scale + this.settings.scale;
          this.settings.infiniteZoom || (e = this.getScale(e)),
            this.beginZoom(e),
            this.zoomImage(
              e,
              Math.min(this.settings.scale, e - this.scale),
              !0,
              !this.settings.infiniteZoom
            );
        }
      }),
      (h.prototype.resetZoom = function (e) {
        this.core.outer.removeClass("lg-zoomed lg-zoom-drag-transition");
        var t = this.core.getElementById("lg-actual-size"),
          o = this.core.getSlideItem(void 0 !== e ? e : this.core.index);
        t
          .removeClass(this.settings.actualSizeIcons.zoomOut)
          .addClass(this.settings.actualSizeIcons.zoomIn),
          o.find(".lg-img-wrap").first().removeAttr("style"),
          o.find(".lg-image").first().removeAttr("style"),
          (this.scale = 1),
          (this.left = 0),
          (this.top = 0),
          this.setPageCords();
      }),
      (h.prototype.getTouchDistance = function (e) {
        return Math.sqrt(
          (e.touches[0].pageX - e.touches[1].pageX) *
            (e.touches[0].pageX - e.touches[1].pageX) +
            (e.touches[0].pageY - e.touches[1].pageY) *
              (e.touches[0].pageY - e.touches[1].pageY)
        );
      }),
      (h.prototype.pinchZoom = function () {
        var e = this,
          t = 0,
          o = !1,
          i = 1,
          s = 0,
          a = this.core.getSlideItem(this.core.index);
        this.core.outer.on("touchstart.lg", function (o) {
          if (
            ((a = e.core.getSlideItem(e.core.index)),
            e.isImageSlide(e.core.index) && 2 === o.touches.length)
          ) {
            if (
              (o.preventDefault(),
              e.core.outer.hasClass("lg-first-slide-loading"))
            )
              return;
            (i = e.scale || 1),
              e.core.outer.removeClass(
                "lg-zoom-drag-transition lg-zoom-dragging"
              ),
              e.setPageCords(o),
              e.resetImageTranslate(e.core.index),
              (e.core.touchAction = "pinch"),
              (t = e.getTouchDistance(o));
          }
        }),
          this.core.$inner.on("touchmove.lg", function (n) {
            if (
              2 === n.touches.length &&
              "pinch" === e.core.touchAction &&
              (e.$LG(n.target).hasClass("lg-item") ||
                a.get().contains(n.target))
            ) {
              n.preventDefault();
              var r = e.getTouchDistance(n),
                l = t - r;
              if ((!o && Math.abs(l) > 5 && (o = !0), o)) {
                s = e.scale;
                var c = Math.max(1, i + 0.02 * -l);
                e.scale = Math.round(100 * (c + Number.EPSILON)) / 100;
                var g = e.scale - s;
                e.zoomImage(
                  e.scale,
                  Math.round(100 * (g + Number.EPSILON)) / 100,
                  !1,
                  !1
                );
              }
            }
          }),
          this.core.$inner.on("touchend.lg", function (i) {
            if (
              "pinch" === e.core.touchAction &&
              (e.$LG(i.target).hasClass("lg-item") ||
                a.get().contains(i.target))
            ) {
              if (((o = !1), (t = 0), e.scale <= 1)) e.resetZoom();
              else {
                var s = e.getCurrentImageActualSizeScale();
                if (e.scale >= s) {
                  var n = s - e.scale;
                  0 === n && (n = 0.01), e.zoomImage(s, n, !1, !0);
                }
                e.manageActualPixelClassNames(),
                  e.core.outer.addClass("lg-zoomed");
              }
              e.core.touchAction = void 0;
            }
          });
      }),
      (h.prototype.touchendZoom = function (e, t, o, i, s) {
        var a = t.x - e.x,
          n = t.y - e.y,
          r = Math.abs(a) / s + 1,
          l = Math.abs(n) / s + 1;
        r > 2 && (r += 1), l > 2 && (l += 1), (a *= r), (n *= l);
        var c = this.core
            .getSlideItem(this.core.index)
            .find(".lg-img-wrap")
            .first(),
          g = {};
        (g.x = this.left + a), (g.y = this.top + n);
        var h = this.getPossibleSwipeDragCords();
        (Math.abs(a) > 15 || Math.abs(n) > 15) &&
          (i &&
            (this.isBeyondPossibleTop(g.y, h.minY)
              ? (g.y = h.minY)
              : this.isBeyondPossibleBottom(g.y, h.maxY) && (g.y = h.maxY)),
          o &&
            (this.isBeyondPossibleLeft(g.x, h.minX)
              ? (g.x = h.minX)
              : this.isBeyondPossibleRight(g.x, h.maxX) && (g.x = h.maxX)),
          i ? (this.top = g.y) : (g.y = this.top),
          o ? (this.left = g.x) : (g.x = this.left),
          this.setZoomSwipeStyles(c, g),
          (this.positionChanged = !0));
      }),
      (h.prototype.getZoomSwipeCords = function (e, t, o, i, s) {
        var a = {};
        if (i) {
          if (
            ((a.y = this.top + (t.y - e.y)),
            this.isBeyondPossibleTop(a.y, s.minY))
          ) {
            var n = s.minY - a.y;
            a.y = s.minY - n / 6;
          } else if (this.isBeyondPossibleBottom(a.y, s.maxY)) {
            var r = a.y - s.maxY;
            a.y = s.maxY + r / 6;
          }
        } else a.y = this.top;
        if (o) {
          if (
            ((a.x = this.left + (t.x - e.x)),
            this.isBeyondPossibleLeft(a.x, s.minX))
          ) {
            var l = s.minX - a.x;
            a.x = s.minX - l / 6;
          } else if (this.isBeyondPossibleRight(a.x, s.maxX)) {
            var c = a.x - s.maxX;
            a.x = s.maxX + c / 6;
          }
        } else a.x = this.left;
        return a;
      }),
      (h.prototype.isBeyondPossibleLeft = function (e, t) {
        return e >= t;
      }),
      (h.prototype.isBeyondPossibleRight = function (e, t) {
        return e <= t;
      }),
      (h.prototype.isBeyondPossibleTop = function (e, t) {
        return e >= t;
      }),
      (h.prototype.isBeyondPossibleBottom = function (e, t) {
        return e <= t;
      }),
      (h.prototype.isImageSlide = function (e) {
        var t = this.core.galleryItems[e];
        return "image" === this.core.getSlideType(t);
      }),
      (h.prototype.getPossibleSwipeDragCords = function (e) {
        var t = this.core
            .getSlideItem(this.core.index)
            .find(".lg-image")
            .first(),
          o = this.core.mediaContainerPosition.bottom,
          i = t.get().getBoundingClientRect(),
          s = i.height,
          a = i.width;
        return (
          e && ((s += e * s), (a += e * a)),
          {
            minY: (s - this.containerRect.height) / 2,
            maxY: (this.containerRect.height - s) / 2 + o,
            minX: (a - this.containerRect.width) / 2,
            maxX: (this.containerRect.width - a) / 2,
          }
        );
      }),
      (h.prototype.setZoomSwipeStyles = function (e, t) {
        e.css("transform", "translate3d(" + t.x + "px, " + t.y + "px, 0)");
      }),
      (h.prototype.zoomSwipe = function () {
        var e,
          t,
          o = this,
          i = {},
          s = {},
          a = !1,
          n = !1,
          r = !1,
          l = new Date(),
          c = (new Date(), this.core.getSlideItem(this.core.index));
        this.core.$inner.on("touchstart.lg", function (s) {
          if (
            o.isImageSlide(o.core.index) &&
            ((c = o.core.getSlideItem(o.core.index)),
            (o.$LG(s.target).hasClass("lg-item") ||
              c.get().contains(s.target)) &&
              1 === s.touches.length &&
              o.core.outer.hasClass("lg-zoomed"))
          ) {
            s.preventDefault(),
              (l = new Date()),
              (o.core.touchAction = "zoomSwipe"),
              (t = o.core
                .getSlideItem(o.core.index)
                .find(".lg-img-wrap")
                .first());
            var a = o.getDragAllowedAxises(0);
            (r = a.allowY),
              ((n = a.allowX) || r) && (i = o.getSwipeCords(s)),
              (e = o.getPossibleSwipeDragCords()),
              o.core.outer.addClass("lg-zoom-dragging lg-zoom-drag-transition");
          }
        }),
          this.core.$inner.on("touchmove.lg", function (l) {
            if (
              1 === l.touches.length &&
              "zoomSwipe" === o.core.touchAction &&
              (o.$LG(l.target).hasClass("lg-item") ||
                c.get().contains(l.target))
            ) {
              l.preventDefault(),
                (o.core.touchAction = "zoomSwipe"),
                (s = o.getSwipeCords(l));
              var g = o.getZoomSwipeCords(i, s, n, r, e);
              (Math.abs(s.x - i.x) > 15 || Math.abs(s.y - i.y) > 15) &&
                ((a = !0), o.setZoomSwipeStyles(t, g));
            }
          }),
          this.core.$inner.on("touchend.lg", function (e) {
            if (
              "zoomSwipe" === o.core.touchAction &&
              (o.$LG(e.target).hasClass("lg-item") ||
                c.get().contains(e.target))
            ) {
              if (
                (e.preventDefault(),
                (o.core.touchAction = void 0),
                o.core.outer.removeClass("lg-zoom-dragging"),
                !a)
              )
                return;
              a = !1;
              var t = new Date().valueOf() - l.valueOf();
              o.touchendZoom(i, s, n, r, t);
            }
          });
      }),
      (h.prototype.zoomDrag = function () {
        var e,
          t,
          o,
          i,
          s = this,
          a = {},
          n = {},
          r = !1,
          l = !1,
          c = !1,
          g = !1;
        this.core.outer.on("mousedown.lg.zoom", function (t) {
          if (s.isImageSlide(s.core.index)) {
            var n = s.core.getSlideItem(s.core.index);
            if (
              s.$LG(t.target).hasClass("lg-item") ||
              n.get().contains(t.target)
            ) {
              (e = new Date()),
                (i = s.core
                  .getSlideItem(s.core.index)
                  .find(".lg-img-wrap")
                  .first());
              var l = s.getDragAllowedAxises(0);
              (g = l.allowY),
                (c = l.allowX),
                s.core.outer.hasClass("lg-zoomed") &&
                  s.$LG(t.target).hasClass("lg-object") &&
                  (c || g) &&
                  (t.preventDefault(),
                  (a = s.getDragCords(t)),
                  (o = s.getPossibleSwipeDragCords()),
                  (r = !0),
                  s.core.outer
                    .removeClass("lg-grab")
                    .addClass(
                      "lg-grabbing lg-zoom-drag-transition lg-zoom-dragging"
                    ));
            }
          }
        }),
          this.$LG(window).on(
            "mousemove.lg.zoom.global" + this.core.lgId,
            function (e) {
              if (r) {
                (l = !0), (n = s.getDragCords(e));
                var t = s.getZoomSwipeCords(a, n, c, g, o);
                s.setZoomSwipeStyles(i, t);
              }
            }
          ),
          this.$LG(window).on(
            "mouseup.lg.zoom.global" + this.core.lgId,
            function (o) {
              if (r) {
                if (
                  ((t = new Date()),
                  (r = !1),
                  s.core.outer.removeClass("lg-zoom-dragging"),
                  l && (a.x !== n.x || a.y !== n.y))
                ) {
                  n = s.getDragCords(o);
                  var i = t.valueOf() - e.valueOf();
                  s.touchendZoom(a, n, c, g, i);
                }
                l = !1;
              }
              s.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
            }
          );
      }),
      (h.prototype.closeGallery = function () {
        this.resetZoom(), (this.zoomInProgress = !1);
      }),
      (h.prototype.destroy = function () {
        this.$LG(window).off(".lg.zoom.global" + this.core.lgId),
          this.core.LGel.off(".lg.zoom"),
          this.core.LGel.off(".zoom"),
          clearTimeout(this.zoomableTimeout),
          (this.zoomableTimeout = !1);
      }),
      h
    );
  })();
});
;

/* lg-thumbnail */
/**
 * lightgallery | 2.8.2 | November 28th 2024
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).lgThumbnail=e()}(this,(function(){"use strict";var t=function(){return(t=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var h in e=arguments[i])Object.prototype.hasOwnProperty.call(e,h)&&(t[h]=e[h]);return t}).apply(this,arguments)},e={thumbnail:!0,animateThumb:!0,currentPagerPosition:"middle",alignThumbnails:"middle",thumbWidth:100,thumbHeight:"80px",thumbMargin:5,appendThumbnailsTo:".lg-components",toggleThumb:!1,enableThumbDrag:!0,enableThumbSwipe:!0,thumbnailSwipeThreshold:10,loadYouTubeThumbnail:!0,youTubeThumbSize:1,thumbnailPluginStrings:{toggleThumbnails:"Toggle thumbnails"}},i="lgContainerResize",s="lgUpdateSlides",h="lgBeforeOpen",n="lgBeforeSlide";return function(){function o(t,e){return this.thumbOuterWidth=0,this.thumbTotalWidth=0,this.translateX=0,this.thumbClickable=!1,this.core=t,this.$LG=e,this}return o.prototype.init=function(){this.settings=t(t({},e),this.core.settings),this.thumbOuterWidth=0,this.thumbTotalWidth=this.core.galleryItems.length*(this.settings.thumbWidth+this.settings.thumbMargin),this.translateX=0,this.setAnimateThumbStyles(),this.core.settings.allowMediaOverlap||(this.settings.toggleThumb=!1),this.settings.thumbnail&&(this.build(),this.settings.animateThumb?(this.settings.enableThumbDrag&&this.enableThumbDrag(),this.settings.enableThumbSwipe&&this.enableThumbSwipe(),this.thumbClickable=!1):this.thumbClickable=!0,this.toggleThumbBar(),this.thumbKeyPress())},o.prototype.build=function(){var t=this;this.setThumbMarkup(),this.manageActiveClassOnSlideChange(),this.$lgThumb.first().on("click.lg touchend.lg",(function(e){var i=t.$LG(e.target);i.hasAttribute("data-lg-item-id")&&setTimeout((function(){if(t.thumbClickable&&!t.core.lgBusy){var e=parseInt(i.attr("data-lg-item-id"));t.core.slide(e,!1,!0,!1)}}),50)})),this.core.LGel.on(n+".thumb",(function(e){var i=e.detail.index;t.animateThumb(i)})),this.core.LGel.on(h+".thumb",(function(){t.thumbOuterWidth=t.core.outer.get().offsetWidth})),this.core.LGel.on(s+".thumb",(function(){t.rebuildThumbnails()})),this.core.LGel.on(i+".thumb",(function(){t.core.lgOpened&&setTimeout((function(){t.thumbOuterWidth=t.core.outer.get().offsetWidth,t.animateThumb(t.core.index),t.thumbOuterWidth=t.core.outer.get().offsetWidth}),50)}))},o.prototype.setThumbMarkup=function(){var t="lg-thumb-outer ";this.settings.alignThumbnails&&(t+="lg-thumb-align-"+this.settings.alignThumbnails);var e='<div class="'+t+'">\n        <div class="lg-thumb lg-group">\n        </div>\n        </div>';this.core.outer.addClass("lg-has-thumb"),".lg-components"===this.settings.appendThumbnailsTo?this.core.$lgComponents.append(e):this.core.outer.append(e),this.$thumbOuter=this.core.outer.find(".lg-thumb-outer").first(),this.$lgThumb=this.core.outer.find(".lg-thumb").first(),this.settings.animateThumb&&this.core.outer.find(".lg-thumb").css("transition-duration",this.core.settings.speed+"ms").css("width",this.thumbTotalWidth+"px").css("position","relative"),this.setThumbItemHtml(this.core.galleryItems)},o.prototype.enableThumbDrag=function(){var t=this,e={cords:{startX:0,endX:0},isMoved:!1,newTranslateX:0,startTime:new Date,endTime:new Date,touchMoveTime:0},i=!1;this.$thumbOuter.addClass("lg-grab"),this.core.outer.find(".lg-thumb").first().on("mousedown.lg.thumb",(function(s){t.thumbTotalWidth>t.thumbOuterWidth&&(s.preventDefault(),e.cords.startX=s.pageX,e.startTime=new Date,t.thumbClickable=!1,i=!0,t.core.outer.get().scrollLeft+=1,t.core.outer.get().scrollLeft-=1,t.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"))})),this.$LG(window).on("mousemove.lg.thumb.global"+this.core.lgId,(function(s){t.core.lgOpened&&i&&(e.cords.endX=s.pageX,e=t.onThumbTouchMove(e))})),this.$LG(window).on("mouseup.lg.thumb.global"+this.core.lgId,(function(){t.core.lgOpened&&(e.isMoved?e=t.onThumbTouchEnd(e):t.thumbClickable=!0,i&&(i=!1,t.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab")))}))},o.prototype.enableThumbSwipe=function(){var t=this,e={cords:{startX:0,endX:0},isMoved:!1,newTranslateX:0,startTime:new Date,endTime:new Date,touchMoveTime:0};this.$lgThumb.on("touchstart.lg",(function(i){t.thumbTotalWidth>t.thumbOuterWidth&&(i.preventDefault(),e.cords.startX=i.targetTouches[0].pageX,t.thumbClickable=!1,e.startTime=new Date)})),this.$lgThumb.on("touchmove.lg",(function(i){t.thumbTotalWidth>t.thumbOuterWidth&&(i.preventDefault(),e.cords.endX=i.targetTouches[0].pageX,e=t.onThumbTouchMove(e))})),this.$lgThumb.on("touchend.lg",(function(){e.isMoved?e=t.onThumbTouchEnd(e):t.thumbClickable=!0}))},o.prototype.rebuildThumbnails=function(){var t=this;this.$thumbOuter.addClass("lg-rebuilding-thumbnails"),setTimeout((function(){t.thumbTotalWidth=t.core.galleryItems.length*(t.settings.thumbWidth+t.settings.thumbMargin),t.$lgThumb.css("width",t.thumbTotalWidth+"px"),t.$lgThumb.empty(),t.setThumbItemHtml(t.core.galleryItems),t.animateThumb(t.core.index)}),50),setTimeout((function(){t.$thumbOuter.removeClass("lg-rebuilding-thumbnails")}),200)},o.prototype.setTranslate=function(t){this.$lgThumb.css("transform","translate3d(-"+t+"px, 0px, 0px)")},o.prototype.getPossibleTransformX=function(t){return t>this.thumbTotalWidth-this.thumbOuterWidth&&(t=this.thumbTotalWidth-this.thumbOuterWidth),t<0&&(t=0),t},o.prototype.animateThumb=function(t){if(this.$lgThumb.css("transition-duration",this.core.settings.speed+"ms"),this.settings.animateThumb){var e=0;switch(this.settings.currentPagerPosition){case"left":e=0;break;case"middle":e=this.thumbOuterWidth/2-this.settings.thumbWidth/2;break;case"right":e=this.thumbOuterWidth-this.settings.thumbWidth}this.translateX=(this.settings.thumbWidth+this.settings.thumbMargin)*t-1-e,this.translateX>this.thumbTotalWidth-this.thumbOuterWidth&&(this.translateX=this.thumbTotalWidth-this.thumbOuterWidth),this.translateX<0&&(this.translateX=0),this.setTranslate(this.translateX)}},o.prototype.onThumbTouchMove=function(t){return t.newTranslateX=this.translateX,t.isMoved=!0,t.touchMoveTime=(new Date).valueOf(),t.newTranslateX-=t.cords.endX-t.cords.startX,t.newTranslateX=this.getPossibleTransformX(t.newTranslateX),this.setTranslate(t.newTranslateX),this.$thumbOuter.addClass("lg-dragging"),t},o.prototype.onThumbTouchEnd=function(t){t.isMoved=!1,t.endTime=new Date,this.$thumbOuter.removeClass("lg-dragging");var e=t.endTime.valueOf()-t.startTime.valueOf(),i=t.cords.endX-t.cords.startX,s=Math.abs(i)/e;return s>.15&&t.endTime.valueOf()-t.touchMoveTime<30?((s+=1)>2&&(s+=1),s+=s*(Math.abs(i)/this.thumbOuterWidth),this.$lgThumb.css("transition-duration",Math.min(s-1,2)+"settings"),i*=s,this.translateX=this.getPossibleTransformX(this.translateX-i),this.setTranslate(this.translateX)):this.translateX=t.newTranslateX,Math.abs(t.cords.endX-t.cords.startX)<this.settings.thumbnailSwipeThreshold&&(this.thumbClickable=!0),t},o.prototype.getThumbHtml=function(t,e,i){var s,h=this.core.galleryItems[e].__slideVideoInfo||{};s=h.youtube&&this.settings.loadYouTubeThumbnail?"//img.youtube.com/vi/"+h.youtube[1]+"/"+this.settings.youTubeThumbSize+".jpg":t;var n=document.createElement("div");n.setAttribute("data-lg-item-id",e+""),n.className="lg-thumb-item "+(e===this.core.index?"active":""),n.style.cssText="width: "+this.settings.thumbWidth+"px; height: "+this.settings.thumbHeight+"; margin-right: "+this.settings.thumbMargin+"px;";var o=document.createElement("img");return o.alt=i||"",o.setAttribute("data-lg-item-id",e+""),o.src=s,n.appendChild(o),n},o.prototype.setThumbItemHtml=function(t){for(var e=0;e<t.length;e++){var i=this.getThumbHtml(t[e].thumb,e,t[e].alt);this.$lgThumb.append(i)}},o.prototype.setAnimateThumbStyles=function(){this.settings.animateThumb&&this.core.outer.addClass("lg-animate-thumb")},o.prototype.manageActiveClassOnSlideChange=function(){var t=this;this.core.LGel.on(n+".thumb",(function(e){var i=t.core.outer.find(".lg-thumb-item"),s=e.detail.index;i.removeClass("active"),i.eq(s).addClass("active")}))},o.prototype.toggleThumbBar=function(){var t=this;this.settings.toggleThumb&&(this.core.outer.addClass("lg-can-toggle"),this.core.$toolbar.append('<button type="button" aria-label="'+this.settings.thumbnailPluginStrings.toggleThumbnails+'" class="lg-toggle-thumb lg-icon"></button>'),this.core.outer.find(".lg-toggle-thumb").first().on("click.lg",(function(){t.core.outer.toggleClass("lg-components-open")})))},o.prototype.thumbKeyPress=function(){var t=this;this.$LG(window).on("keydown.lg.thumb.global"+this.core.lgId,(function(e){t.core.lgOpened&&t.settings.toggleThumb&&(38===e.keyCode?(e.preventDefault(),t.core.outer.addClass("lg-components-open")):40===e.keyCode&&(e.preventDefault(),t.core.outer.removeClass("lg-components-open")))}))},o.prototype.destroy=function(){this.settings.thumbnail&&(this.$LG(window).off(".lg.thumb.global"+this.core.lgId),this.core.LGel.off(".lg.thumb"),this.core.LGel.off(".thumb"),this.$thumbOuter.remove(),this.core.outer.removeClass("lg-has-thumb"))},o}()}));
;

/* swiper-scripts */
/**
 * Swiper 12.0.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2025 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: September 11, 2025
 */

var Swiper=function(){"use strict";function e(e){return null!==e&&"object"==typeof e&&"constructor"in e&&e.constructor===Object}function t(s={},a={}){const i=["__proto__","constructor","prototype"];Object.keys(a).filter(e=>i.indexOf(e)<0).forEach(i=>{void 0===s[i]?s[i]=a[i]:e(a[i])&&e(s[i])&&Object.keys(a[i]).length>0&&t(s[i],a[i])})}const s={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createEvent:()=>({initEvent(){}}),createElement:()=>({children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName:()=>[]}),createElementNS:()=>({}),importNode:()=>null,location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function a(){const e="undefined"!=typeof document?document:{};return t(e,s),e}const i={document:s,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle:()=>({getPropertyValue:()=>""}),Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia:()=>({}),requestAnimationFrame:e=>"undefined"==typeof setTimeout?(e(),null):setTimeout(e,0),cancelAnimationFrame(e){"undefined"!=typeof setTimeout&&clearTimeout(e)}};function r(){const e="undefined"!=typeof window?window:{};return t(e,i),e}function n(e=""){return e.trim().split(" ").filter(e=>!!e.trim())}function l(e,t=0){return setTimeout(e,t)}function o(){return Date.now()}function d(e,t="x"){const s=r();let a,i,n;const l=function(e){const t=r();let s;return t.getComputedStyle&&(s=t.getComputedStyle(e,null)),!s&&e.currentStyle&&(s=e.currentStyle),s||(s=e.style),s}(e);return s.WebKitCSSMatrix?(i=l.transform||l.webkitTransform,i.split(",").length>6&&(i=i.split(", ").map(e=>e.replace(",",".")).join(", ")),n=new s.WebKitCSSMatrix("none"===i?"":i)):(n=l.MozTransform||l.OTransform||l.MsTransform||l.msTransform||l.transform||l.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),a=n.toString().split(",")),"x"===t&&(i=s.WebKitCSSMatrix?n.m41:16===a.length?parseFloat(a[12]):parseFloat(a[4])),"y"===t&&(i=s.WebKitCSSMatrix?n.m42:16===a.length?parseFloat(a[13]):parseFloat(a[5])),i||0}function c(e){return"object"==typeof e&&null!==e&&e.constructor&&"Object"===Object.prototype.toString.call(e).slice(8,-1)}function p(e){return"undefined"!=typeof window&&void 0!==window.HTMLElement?e instanceof HTMLElement:e&&(1===e.nodeType||11===e.nodeType)}function u(...e){const t=Object(e[0]),s=["__proto__","constructor","prototype"];for(let a=1;a<e.length;a+=1){const i=e[a];if(null!=i&&!p(i)){const e=Object.keys(Object(i)).filter(e=>s.indexOf(e)<0);for(let s=0,a=e.length;s<a;s+=1){const a=e[s],r=Object.getOwnPropertyDescriptor(i,a);void 0!==r&&r.enumerable&&(c(t[a])&&c(i[a])?i[a].__swiper__?t[a]=i[a]:u(t[a],i[a]):!c(t[a])&&c(i[a])?(t[a]={},i[a].__swiper__?t[a]=i[a]:u(t[a],i[a])):t[a]=i[a])}}}return t}function m(e,t,s){e.style.setProperty(t,s)}function h({swiper:e,targetPosition:t,side:s}){const a=r(),i=-e.translate;let n,l=null;const o=e.params.speed;e.wrapperEl.style.scrollSnapType="none",a.cancelAnimationFrame(e.cssModeFrameID);const d=t>i?"next":"prev",c=(e,t)=>"next"===d&&e>=t||"prev"===d&&e<=t,p=()=>{n=(new Date).getTime(),null===l&&(l=n);const r=Math.max(Math.min((n-l)/o,1),0),d=.5-Math.cos(r*Math.PI)/2;let u=i+d*(t-i);if(c(u,t)&&(u=t),e.wrapperEl.scrollTo({[s]:u}),c(u,t))return e.wrapperEl.style.overflow="hidden",e.wrapperEl.style.scrollSnapType="",setTimeout(()=>{e.wrapperEl.style.overflow="",e.wrapperEl.scrollTo({[s]:u})}),void a.cancelAnimationFrame(e.cssModeFrameID);e.cssModeFrameID=a.requestAnimationFrame(p)};p()}function f(e){return e.querySelector(".swiper-slide-transform")||e.shadowRoot&&e.shadowRoot.querySelector(".swiper-slide-transform")||e}function g(e,t=""){const s=r(),a=[...e.children];return s.HTMLSlotElement&&e instanceof HTMLSlotElement&&a.push(...e.assignedElements()),t?a.filter(e=>e.matches(t)):a}function v(e){try{return void console.warn(e)}catch(e){}}function w(e,t=[]){const s=document.createElement(e);return s.classList.add(...Array.isArray(t)?t:n(t)),s}function b(e){const t=r(),s=a(),i=e.getBoundingClientRect(),n=s.body,l=e.clientTop||n.clientTop||0,o=e.clientLeft||n.clientLeft||0,d=e===t?t.scrollY:e.scrollTop,c=e===t?t.scrollX:e.scrollLeft;return{top:i.top+d-l,left:i.left+c-o}}function y(e,t){return r().getComputedStyle(e,null).getPropertyValue(t)}function E(e){let t,s=e;if(s){for(t=0;null!==(s=s.previousSibling);)1===s.nodeType&&(t+=1);return t}}function x(e,t){const s=[];let a=e.parentElement;for(;a;)t?a.matches(t)&&s.push(a):s.push(a),a=a.parentElement;return s}function S(e,t){t&&e.addEventListener("transitionend",function s(a){a.target===e&&(t.call(e,a),e.removeEventListener("transitionend",s))})}function T(e,t,s){const a=r();return s?e["width"===t?"offsetWidth":"offsetHeight"]+parseFloat(a.getComputedStyle(e,null).getPropertyValue("width"===t?"margin-right":"margin-top"))+parseFloat(a.getComputedStyle(e,null).getPropertyValue("width"===t?"margin-left":"margin-bottom")):e.offsetWidth}function M(e){return(Array.isArray(e)?e:[e]).filter(e=>!!e)}function C(e){return t=>Math.abs(t)>0&&e.browser&&e.browser.need3dFix&&Math.abs(t)%90==0?t+.001:t}function P(e,t=""){"undefined"!=typeof trustedTypes?e.innerHTML=trustedTypes.createPolicy("html",{createHTML:e=>e}).createHTML(t):e.innerHTML=t}let L,z,I;function A(){return L||(L=function(){const e=r(),t=a();return{smoothScroll:t.documentElement&&t.documentElement.style&&"scrollBehavior"in t.documentElement.style,touch:!!("ontouchstart"in e||e.DocumentTouch&&t instanceof e.DocumentTouch)}}()),L}function $(e={}){return z||(z=function({userAgent:e}={}){const t=A(),s=r(),a=s.navigator.platform,i=e||s.navigator.userAgent,n={ios:!1,android:!1},l=s.screen.width,o=s.screen.height,d=i.match(/(Android);?[\s\/]+([\d.]+)?/);let c=i.match(/(iPad)(?!\1).*OS\s([\d_]+)/);const p=i.match(/(iPod)(.*OS\s([\d_]+))?/),u=!c&&i.match(/(iPhone\sOS|iOS)\s([\d_]+)/),m="Win32"===a;let h="MacIntel"===a;return!c&&h&&t.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"].indexOf(`${l}x${o}`)>=0&&(c=i.match(/(Version)\/([\d.]+)/),c||(c=[0,1,"13_0_0"]),h=!1),d&&!m&&(n.os="android",n.android=!0),(c||u||p)&&(n.os="ios",n.ios=!0),n}(e)),z}function k(){return I||(I=function(){const e=r(),t=$();let s=!1;function a(){const t=e.navigator.userAgent.toLowerCase();return t.indexOf("safari")>=0&&t.indexOf("chrome")<0&&t.indexOf("android")<0}if(a()){const t=String(e.navigator.userAgent);if(t.includes("Version/")){const[e,a]=t.split("Version/")[1].split(" ")[0].split(".").map(e=>Number(e));s=e<16||16===e&&a<2}}const i=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent),n=a();return{isSafari:s||n,needPerspectiveFix:s,need3dFix:n||i&&t.ios,isWebView:i}}()),I}var O={on(e,t,s){const a=this;if(!a.eventsListeners||a.destroyed)return a;if("function"!=typeof t)return a;const i=s?"unshift":"push";return e.split(" ").forEach(e=>{a.eventsListeners[e]||(a.eventsListeners[e]=[]),a.eventsListeners[e][i](t)}),a},once(e,t,s){const a=this;if(!a.eventsListeners||a.destroyed)return a;if("function"!=typeof t)return a;function i(...s){a.off(e,i),i.__emitterProxy&&delete i.__emitterProxy,t.apply(a,s)}return i.__emitterProxy=t,a.on(e,i,s)},onAny(e,t){const s=this;if(!s.eventsListeners||s.destroyed)return s;if("function"!=typeof e)return s;const a=t?"unshift":"push";return s.eventsAnyListeners.indexOf(e)<0&&s.eventsAnyListeners[a](e),s},offAny(e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsAnyListeners)return t;const s=t.eventsAnyListeners.indexOf(e);return s>=0&&t.eventsAnyListeners.splice(s,1),t},off(e,t){const s=this;return!s.eventsListeners||s.destroyed?s:s.eventsListeners?(e.split(" ").forEach(e=>{void 0===t?s.eventsListeners[e]=[]:s.eventsListeners[e]&&s.eventsListeners[e].forEach((a,i)=>{(a===t||a.__emitterProxy&&a.__emitterProxy===t)&&s.eventsListeners[e].splice(i,1)})}),s):s},emit(...e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsListeners)return t;let s,a,i;"string"==typeof e[0]||Array.isArray(e[0])?(s=e[0],a=e.slice(1,e.length),i=t):(s=e[0].events,a=e[0].data,i=e[0].context||t),a.unshift(i);return(Array.isArray(s)?s:s.split(" ")).forEach(e=>{t.eventsAnyListeners&&t.eventsAnyListeners.length&&t.eventsAnyListeners.forEach(t=>{t.apply(i,[e,...a])}),t.eventsListeners&&t.eventsListeners[e]&&t.eventsListeners[e].forEach(e=>{e.apply(i,a)})}),t}};const D=(e,t,s)=>{t&&!e.classList.contains(s)?e.classList.add(s):!t&&e.classList.contains(s)&&e.classList.remove(s)};const G=(e,t,s)=>{t&&!e.classList.contains(s)?e.classList.add(s):!t&&e.classList.contains(s)&&e.classList.remove(s)};const X=(e,t)=>{if(!e||e.destroyed||!e.params)return;const s=t.closest(e.isElement?"swiper-slide":`.${e.params.slideClass}`);if(s){let t=s.querySelector(`.${e.params.lazyPreloaderClass}`);!t&&e.isElement&&(s.shadowRoot?t=s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{s.shadowRoot&&(t=s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`),t&&t.remove())})),t&&t.remove()}},B=(e,t)=>{if(!e.slides[t])return;const s=e.slides[t].querySelector('[loading="lazy"]');s&&s.removeAttribute("loading")},Y=e=>{if(!e||e.destroyed||!e.params)return;let t=e.params.lazyPreloadPrevNext;const s=e.slides.length;if(!s||!t||t<0)return;t=Math.min(t,s);const a="auto"===e.params.slidesPerView?e.slidesPerViewDynamic():Math.ceil(e.params.slidesPerView),i=e.activeIndex;if(e.params.grid&&e.params.grid.rows>1){const s=i,r=[s-t];return r.push(...Array.from({length:t}).map((e,t)=>s+a+t)),void e.slides.forEach((t,s)=>{r.includes(t.column)&&B(e,s)})}const r=i+a-1;if(e.params.rewind||e.params.loop)for(let a=i-t;a<=r+t;a+=1){const t=(a%s+s)%s;(t<i||t>r)&&B(e,t)}else for(let a=Math.max(i-t,0);a<=Math.min(r+t,s-1);a+=1)a!==i&&(a>r||a<i)&&B(e,a)};var H={updateSize:function(){const e=this;let t,s;const a=e.el;t=void 0!==e.params.width&&null!==e.params.width?e.params.width:a.clientWidth,s=void 0!==e.params.height&&null!==e.params.height?e.params.height:a.clientHeight,0===t&&e.isHorizontal()||0===s&&e.isVertical()||(t=t-parseInt(y(a,"padding-left")||0,10)-parseInt(y(a,"padding-right")||0,10),s=s-parseInt(y(a,"padding-top")||0,10)-parseInt(y(a,"padding-bottom")||0,10),Number.isNaN(t)&&(t=0),Number.isNaN(s)&&(s=0),Object.assign(e,{width:t,height:s,size:e.isHorizontal()?t:s}))},updateSlides:function(){const e=this;function t(t,s){return parseFloat(t.getPropertyValue(e.getDirectionLabel(s))||0)}const s=e.params,{wrapperEl:a,slidesEl:i,rtlTranslate:r,wrongRTL:n}=e,l=e.virtual&&s.virtual.enabled,o=l?e.virtual.slides.length:e.slides.length,d=g(i,`.${e.params.slideClass}, swiper-slide`),c=l?e.virtual.slides.length:d.length;let p=[];const u=[],h=[];let f=s.slidesOffsetBefore;"function"==typeof f&&(f=s.slidesOffsetBefore.call(e));let v=s.slidesOffsetAfter;"function"==typeof v&&(v=s.slidesOffsetAfter.call(e));const w=e.snapGrid.length,b=e.slidesGrid.length,E=e.size-f-v;let x=s.spaceBetween,S=-f,M=0,C=0;if(void 0===E)return;"string"==typeof x&&x.indexOf("%")>=0?x=parseFloat(x.replace("%",""))/100*E:"string"==typeof x&&(x=parseFloat(x)),e.virtualSize=-x-f-v,d.forEach(e=>{r?e.style.marginLeft="":e.style.marginRight="",e.style.marginBottom="",e.style.marginTop=""}),s.centeredSlides&&s.cssMode&&(m(a,"--swiper-centered-offset-before",""),m(a,"--swiper-centered-offset-after",""));const P=s.grid&&s.grid.rows>1&&e.grid;let L;P?e.grid.initSlides(d):e.grid&&e.grid.unsetSlides();const z="auto"===s.slidesPerView&&s.breakpoints&&Object.keys(s.breakpoints).filter(e=>void 0!==s.breakpoints[e].slidesPerView).length>0;for(let a=0;a<c;a+=1){L=0;const i=d[a];if(!i||(P&&e.grid.updateSlide(a,i,d),"none"!==y(i,"display"))){if(l&&"auto"===s.slidesPerView)s.virtual.slidesPerViewAutoSlideSize&&(L=s.virtual.slidesPerViewAutoSlideSize),L&&i&&(s.roundLengths&&(L=Math.floor(L)),i.style[e.getDirectionLabel("width")]=`${L}px`);else if("auto"===s.slidesPerView){z&&(i.style[e.getDirectionLabel("width")]="");const a=getComputedStyle(i),r=i.style.transform,n=i.style.webkitTransform;if(r&&(i.style.transform="none"),n&&(i.style.webkitTransform="none"),s.roundLengths)L=e.isHorizontal()?T(i,"width",!0):T(i,"height",!0);else{const e=t(a,"width"),s=t(a,"padding-left"),r=t(a,"padding-right"),n=t(a,"margin-left"),l=t(a,"margin-right"),o=a.getPropertyValue("box-sizing");if(o&&"border-box"===o)L=e+n+l;else{const{clientWidth:t,offsetWidth:a}=i;L=e+s+r+n+l+(a-t)}}r&&(i.style.transform=r),n&&(i.style.webkitTransform=n),s.roundLengths&&(L=Math.floor(L))}else L=(E-(s.slidesPerView-1)*x)/s.slidesPerView,s.roundLengths&&(L=Math.floor(L)),i&&(i.style[e.getDirectionLabel("width")]=`${L}px`);i&&(i.swiperSlideSize=L),h.push(L),s.centeredSlides?(S=S+L/2+M/2+x,0===M&&0!==a&&(S=S-E/2-x),0===a&&(S=S-E/2-x),Math.abs(S)<.001&&(S=0),s.roundLengths&&(S=Math.floor(S)),C%s.slidesPerGroup===0&&p.push(S),u.push(S)):(s.roundLengths&&(S=Math.floor(S)),(C-Math.min(e.params.slidesPerGroupSkip,C))%e.params.slidesPerGroup===0&&p.push(S),u.push(S),S=S+L+x),e.virtualSize+=L+x,M=L,C+=1}}if(e.virtualSize=Math.max(e.virtualSize,E)+v,r&&n&&("slide"===s.effect||"coverflow"===s.effect)&&(a.style.width=`${e.virtualSize+x}px`),s.setWrapperSize&&(a.style[e.getDirectionLabel("width")]=`${e.virtualSize+x}px`),P&&e.grid.updateWrapperSize(L,p),!s.centeredSlides){const t=[];for(let a=0;a<p.length;a+=1){let i=p[a];s.roundLengths&&(i=Math.floor(i)),p[a]<=e.virtualSize-E&&t.push(i)}p=t,Math.floor(e.virtualSize-E)-Math.floor(p[p.length-1])>1&&p.push(e.virtualSize-E)}if(l&&s.loop){const t=h[0]+x;if(s.slidesPerGroup>1){const a=Math.ceil((e.virtual.slidesBefore+e.virtual.slidesAfter)/s.slidesPerGroup),i=t*s.slidesPerGroup;for(let e=0;e<a;e+=1)p.push(p[p.length-1]+i)}for(let a=0;a<e.virtual.slidesBefore+e.virtual.slidesAfter;a+=1)1===s.slidesPerGroup&&p.push(p[p.length-1]+t),u.push(u[u.length-1]+t),e.virtualSize+=t}if(0===p.length&&(p=[0]),0!==x){const t=e.isHorizontal()&&r?"marginLeft":e.getDirectionLabel("marginRight");d.filter((e,t)=>!(s.cssMode&&!s.loop)||t!==d.length-1).forEach(e=>{e.style[t]=`${x}px`})}if(s.centeredSlides&&s.centeredSlidesBounds){let e=0;h.forEach(t=>{e+=t+(x||0)}),e-=x;const t=e>E?e-E:0;p=p.map(e=>e<=0?-f:e>t?t+v:e)}if(s.centerInsufficientSlides){let e=0;h.forEach(t=>{e+=t+(x||0)}),e-=x;const t=(f||0)+(v||0);if(e+t<E){const s=(E-e-t)/2;p.forEach((e,t)=>{p[t]=e-s}),u.forEach((e,t)=>{u[t]=e+s})}}if(Object.assign(e,{slides:d,snapGrid:p,slidesGrid:u,slidesSizesGrid:h}),s.centeredSlides&&s.cssMode&&!s.centeredSlidesBounds){m(a,"--swiper-centered-offset-before",-p[0]+"px"),m(a,"--swiper-centered-offset-after",e.size/2-h[h.length-1]/2+"px");const t=-e.snapGrid[0],s=-e.slidesGrid[0];e.snapGrid=e.snapGrid.map(e=>e+t),e.slidesGrid=e.slidesGrid.map(e=>e+s)}if(c!==o&&e.emit("slidesLengthChange"),p.length!==w&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),u.length!==b&&e.emit("slidesGridLengthChange"),s.watchSlidesProgress&&e.updateSlidesOffset(),e.emit("slidesUpdated"),!(l||s.cssMode||"slide"!==s.effect&&"fade"!==s.effect)){const t=`${s.containerModifierClass}backface-hidden`,a=e.el.classList.contains(t);c<=s.maxBackfaceHiddenSlides?a||e.el.classList.add(t):a&&e.el.classList.remove(t)}},updateAutoHeight:function(e){const t=this,s=[],a=t.virtual&&t.params.virtual.enabled;let i,r=0;"number"==typeof e?t.setTransition(e):!0===e&&t.setTransition(t.params.speed);const n=e=>a?t.slides[t.getSlideIndexByData(e)]:t.slides[e];if("auto"!==t.params.slidesPerView&&t.params.slidesPerView>1)if(t.params.centeredSlides)(t.visibleSlides||[]).forEach(e=>{s.push(e)});else for(i=0;i<Math.ceil(t.params.slidesPerView);i+=1){const e=t.activeIndex+i;if(e>t.slides.length&&!a)break;s.push(n(e))}else s.push(n(t.activeIndex));for(i=0;i<s.length;i+=1)if(void 0!==s[i]){const e=s[i].offsetHeight;r=e>r?e:r}(r||0===r)&&(t.wrapperEl.style.height=`${r}px`)},updateSlidesOffset:function(){const e=this,t=e.slides,s=e.isElement?e.isHorizontal()?e.wrapperEl.offsetLeft:e.wrapperEl.offsetTop:0;for(let a=0;a<t.length;a+=1)t[a].swiperSlideOffset=(e.isHorizontal()?t[a].offsetLeft:t[a].offsetTop)-s-e.cssOverflowAdjustment()},updateSlidesProgress:function(e=this&&this.translate||0){const t=this,s=t.params,{slides:a,rtlTranslate:i,snapGrid:r}=t;if(0===a.length)return;void 0===a[0].swiperSlideOffset&&t.updateSlidesOffset();let n=-e;i&&(n=e),t.visibleSlidesIndexes=[],t.visibleSlides=[];let l=s.spaceBetween;"string"==typeof l&&l.indexOf("%")>=0?l=parseFloat(l.replace("%",""))/100*t.size:"string"==typeof l&&(l=parseFloat(l));for(let e=0;e<a.length;e+=1){const o=a[e];let d=o.swiperSlideOffset;s.cssMode&&s.centeredSlides&&(d-=a[0].swiperSlideOffset);const c=(n+(s.centeredSlides?t.minTranslate():0)-d)/(o.swiperSlideSize+l),p=(n-r[0]+(s.centeredSlides?t.minTranslate():0)-d)/(o.swiperSlideSize+l),u=-(n-d),m=u+t.slidesSizesGrid[e],h=u>=0&&u<=t.size-t.slidesSizesGrid[e],f=u>=0&&u<t.size-1||m>1&&m<=t.size||u<=0&&m>=t.size;f&&(t.visibleSlides.push(o),t.visibleSlidesIndexes.push(e)),D(o,f,s.slideVisibleClass),D(o,h,s.slideFullyVisibleClass),o.progress=i?-c:c,o.originalProgress=i?-p:p}},updateProgress:function(e){const t=this;if(void 0===e){const s=t.rtlTranslate?-1:1;e=t&&t.translate&&t.translate*s||0}const s=t.params,a=t.maxTranslate()-t.minTranslate();let{progress:i,isBeginning:r,isEnd:n,progressLoop:l}=t;const o=r,d=n;if(0===a)i=0,r=!0,n=!0;else{i=(e-t.minTranslate())/a;const s=Math.abs(e-t.minTranslate())<1,l=Math.abs(e-t.maxTranslate())<1;r=s||i<=0,n=l||i>=1,s&&(i=0),l&&(i=1)}if(s.loop){const s=t.getSlideIndexByData(0),a=t.getSlideIndexByData(t.slides.length-1),i=t.slidesGrid[s],r=t.slidesGrid[a],n=t.slidesGrid[t.slidesGrid.length-1],o=Math.abs(e);l=o>=i?(o-i)/n:(o+n-r)/n,l>1&&(l-=1)}Object.assign(t,{progress:i,progressLoop:l,isBeginning:r,isEnd:n}),(s.watchSlidesProgress||s.centeredSlides&&s.autoHeight)&&t.updateSlidesProgress(e),r&&!o&&t.emit("reachBeginning toEdge"),n&&!d&&t.emit("reachEnd toEdge"),(o&&!r||d&&!n)&&t.emit("fromEdge"),t.emit("progress",i)},updateSlidesClasses:function(){const e=this,{slides:t,params:s,slidesEl:a,activeIndex:i}=e,r=e.virtual&&s.virtual.enabled,n=e.grid&&s.grid&&s.grid.rows>1,l=e=>g(a,`.${s.slideClass}${e}, swiper-slide${e}`)[0];let o,d,c;if(r)if(s.loop){let t=i-e.virtual.slidesBefore;t<0&&(t=e.virtual.slides.length+t),t>=e.virtual.slides.length&&(t-=e.virtual.slides.length),o=l(`[data-swiper-slide-index="${t}"]`)}else o=l(`[data-swiper-slide-index="${i}"]`);else n?(o=t.find(e=>e.column===i),c=t.find(e=>e.column===i+1),d=t.find(e=>e.column===i-1)):o=t[i];o&&(n||(c=function(e,t){const s=[];for(;e.nextElementSibling;){const a=e.nextElementSibling;t?a.matches(t)&&s.push(a):s.push(a),e=a}return s}(o,`.${s.slideClass}, swiper-slide`)[0],s.loop&&!c&&(c=t[0]),d=function(e,t){const s=[];for(;e.previousElementSibling;){const a=e.previousElementSibling;t?a.matches(t)&&s.push(a):s.push(a),e=a}return s}(o,`.${s.slideClass}, swiper-slide`)[0],s.loop&&0===!d&&(d=t[t.length-1]))),t.forEach(e=>{G(e,e===o,s.slideActiveClass),G(e,e===c,s.slideNextClass),G(e,e===d,s.slidePrevClass)}),e.emitSlidesClasses()},updateActiveIndex:function(e){const t=this,s=t.rtlTranslate?t.translate:-t.translate,{snapGrid:a,params:i,activeIndex:r,realIndex:n,snapIndex:l}=t;let o,d=e;const c=e=>{let s=e-t.virtual.slidesBefore;return s<0&&(s=t.virtual.slides.length+s),s>=t.virtual.slides.length&&(s-=t.virtual.slides.length),s};if(void 0===d&&(d=function(e){const{slidesGrid:t,params:s}=e,a=e.rtlTranslate?e.translate:-e.translate;let i;for(let e=0;e<t.length;e+=1)void 0!==t[e+1]?a>=t[e]&&a<t[e+1]-(t[e+1]-t[e])/2?i=e:a>=t[e]&&a<t[e+1]&&(i=e+1):a>=t[e]&&(i=e);return s.normalizeSlideIndex&&(i<0||void 0===i)&&(i=0),i}(t)),a.indexOf(s)>=0)o=a.indexOf(s);else{const e=Math.min(i.slidesPerGroupSkip,d);o=e+Math.floor((d-e)/i.slidesPerGroup)}if(o>=a.length&&(o=a.length-1),d===r&&!t.params.loop)return void(o!==l&&(t.snapIndex=o,t.emit("snapIndexChange")));if(d===r&&t.params.loop&&t.virtual&&t.params.virtual.enabled)return void(t.realIndex=c(d));const p=t.grid&&i.grid&&i.grid.rows>1;let u;if(t.virtual&&i.virtual.enabled&&i.loop)u=c(d);else if(p){const e=t.slides.find(e=>e.column===d);let s=parseInt(e.getAttribute("data-swiper-slide-index"),10);Number.isNaN(s)&&(s=Math.max(t.slides.indexOf(e),0)),u=Math.floor(s/i.grid.rows)}else if(t.slides[d]){const e=t.slides[d].getAttribute("data-swiper-slide-index");u=e?parseInt(e,10):d}else u=d;Object.assign(t,{previousSnapIndex:l,snapIndex:o,previousRealIndex:n,realIndex:u,previousIndex:r,activeIndex:d}),t.initialized&&Y(t),t.emit("activeIndexChange"),t.emit("snapIndexChange"),(t.initialized||t.params.runCallbacksOnInit)&&(n!==u&&t.emit("realIndexChange"),t.emit("slideChange"))},updateClickedSlide:function(e,t){const s=this,a=s.params;let i=e.closest(`.${a.slideClass}, swiper-slide`);!i&&s.isElement&&t&&t.length>1&&t.includes(e)&&[...t.slice(t.indexOf(e)+1,t.length)].forEach(e=>{!i&&e.matches&&e.matches(`.${a.slideClass}, swiper-slide`)&&(i=e)});let r,n=!1;if(i)for(let e=0;e<s.slides.length;e+=1)if(s.slides[e]===i){n=!0,r=e;break}if(!i||!n)return s.clickedSlide=void 0,void(s.clickedIndex=void 0);s.clickedSlide=i,s.virtual&&s.params.virtual.enabled?s.clickedIndex=parseInt(i.getAttribute("data-swiper-slide-index"),10):s.clickedIndex=r,a.slideToClickedSlide&&void 0!==s.clickedIndex&&s.clickedIndex!==s.activeIndex&&s.slideToClickedSlide()}};var N={getTranslate:function(e=(this.isHorizontal()?"x":"y")){const{params:t,rtlTranslate:s,translate:a,wrapperEl:i}=this;if(t.virtualTranslate)return s?-a:a;if(t.cssMode)return a;let r=d(i,e);return r+=this.cssOverflowAdjustment(),s&&(r=-r),r||0},setTranslate:function(e,t){const s=this,{rtlTranslate:a,params:i,wrapperEl:r,progress:n}=s;let l,o=0,d=0;s.isHorizontal()?o=a?-e:e:d=e,i.roundLengths&&(o=Math.floor(o),d=Math.floor(d)),s.previousTranslate=s.translate,s.translate=s.isHorizontal()?o:d,i.cssMode?r[s.isHorizontal()?"scrollLeft":"scrollTop"]=s.isHorizontal()?-o:-d:i.virtualTranslate||(s.isHorizontal()?o-=s.cssOverflowAdjustment():d-=s.cssOverflowAdjustment(),r.style.transform=`translate3d(${o}px, ${d}px, 0px)`);const c=s.maxTranslate()-s.minTranslate();l=0===c?0:(e-s.minTranslate())/c,l!==n&&s.updateProgress(e),s.emit("setTranslate",s.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e=0,t=this.params.speed,s=!0,a=!0,i){const r=this,{params:n,wrapperEl:l}=r;if(r.animating&&n.preventInteractionOnTransition)return!1;const o=r.minTranslate(),d=r.maxTranslate();let c;if(c=a&&e>o?o:a&&e<d?d:e,r.updateProgress(c),n.cssMode){const e=r.isHorizontal();if(0===t)l[e?"scrollLeft":"scrollTop"]=-c;else{if(!r.support.smoothScroll)return h({swiper:r,targetPosition:-c,side:e?"left":"top"}),!0;l.scrollTo({[e?"left":"top"]:-c,behavior:"smooth"})}return!0}return 0===t?(r.setTransition(0),r.setTranslate(c),s&&(r.emit("beforeTransitionStart",t,i),r.emit("transitionEnd"))):(r.setTransition(t),r.setTranslate(c),s&&(r.emit("beforeTransitionStart",t,i),r.emit("transitionStart")),r.animating||(r.animating=!0,r.onTranslateToWrapperTransitionEnd||(r.onTranslateToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.wrapperEl.removeEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.onTranslateToWrapperTransitionEnd=null,delete r.onTranslateToWrapperTransitionEnd,r.animating=!1,s&&r.emit("transitionEnd"))}),r.wrapperEl.addEventListener("transitionend",r.onTranslateToWrapperTransitionEnd))),!0}};function R({swiper:e,runCallbacks:t,direction:s,step:a}){const{activeIndex:i,previousIndex:r}=e;let n=s;n||(n=i>r?"next":i<r?"prev":"reset"),e.emit(`transition${a}`),t&&"reset"===n?e.emit(`slideResetTransition${a}`):t&&i!==r&&(e.emit(`slideChangeTransition${a}`),"next"===n?e.emit(`slideNextTransition${a}`):e.emit(`slidePrevTransition${a}`))}var V={slideTo:function(e=0,t,s=!0,a,i){"string"==typeof e&&(e=parseInt(e,10));const r=this;let n=e;n<0&&(n=0);const{params:l,snapGrid:o,slidesGrid:d,previousIndex:c,activeIndex:p,rtlTranslate:u,wrapperEl:m,enabled:f}=r;if(!f&&!a&&!i||r.destroyed||r.animating&&l.preventInteractionOnTransition)return!1;void 0===t&&(t=r.params.speed);const g=Math.min(r.params.slidesPerGroupSkip,n);let v=g+Math.floor((n-g)/r.params.slidesPerGroup);v>=o.length&&(v=o.length-1);const w=-o[v];if(l.normalizeSlideIndex)for(let e=0;e<d.length;e+=1){const t=-Math.floor(100*w),s=Math.floor(100*d[e]),a=Math.floor(100*d[e+1]);void 0!==d[e+1]?t>=s&&t<a-(a-s)/2?n=e:t>=s&&t<a&&(n=e+1):t>=s&&(n=e)}if(r.initialized&&n!==p){if(!r.allowSlideNext&&(u?w>r.translate&&w>r.minTranslate():w<r.translate&&w<r.minTranslate()))return!1;if(!r.allowSlidePrev&&w>r.translate&&w>r.maxTranslate()&&(p||0)!==n)return!1}let b;n!==(c||0)&&s&&r.emit("beforeSlideChangeStart"),r.updateProgress(w),b=n>p?"next":n<p?"prev":"reset";const y=r.virtual&&r.params.virtual.enabled;if(!(y&&i)&&(u&&-w===r.translate||!u&&w===r.translate))return r.updateActiveIndex(n),l.autoHeight&&r.updateAutoHeight(),r.updateSlidesClasses(),"slide"!==l.effect&&r.setTranslate(w),"reset"!==b&&(r.transitionStart(s,b),r.transitionEnd(s,b)),!1;if(l.cssMode){const e=r.isHorizontal(),s=u?w:-w;if(0===t)y&&(r.wrapperEl.style.scrollSnapType="none",r._immediateVirtual=!0),y&&!r._cssModeVirtualInitialSet&&r.params.initialSlide>0?(r._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{m[e?"scrollLeft":"scrollTop"]=s})):m[e?"scrollLeft":"scrollTop"]=s,y&&requestAnimationFrame(()=>{r.wrapperEl.style.scrollSnapType="",r._immediateVirtual=!1});else{if(!r.support.smoothScroll)return h({swiper:r,targetPosition:s,side:e?"left":"top"}),!0;m.scrollTo({[e?"left":"top"]:s,behavior:"smooth"})}return!0}const E=k().isSafari;return y&&!i&&E&&r.isElement&&r.virtual.update(!1,!1,n),r.setTransition(t),r.setTranslate(w),r.updateActiveIndex(n),r.updateSlidesClasses(),r.emit("beforeTransitionStart",t,a),r.transitionStart(s,b),0===t?r.transitionEnd(s,b):r.animating||(r.animating=!0,r.onSlideToWrapperTransitionEnd||(r.onSlideToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.wrapperEl.removeEventListener("transitionend",r.onSlideToWrapperTransitionEnd),r.onSlideToWrapperTransitionEnd=null,delete r.onSlideToWrapperTransitionEnd,r.transitionEnd(s,b))}),r.wrapperEl.addEventListener("transitionend",r.onSlideToWrapperTransitionEnd)),!0},slideToLoop:function(e=0,t,s=!0,a){if("string"==typeof e){e=parseInt(e,10)}const i=this;if(i.destroyed)return;void 0===t&&(t=i.params.speed);const r=i.grid&&i.params.grid&&i.params.grid.rows>1;let n=e;if(i.params.loop)if(i.virtual&&i.params.virtual.enabled)n+=i.virtual.slidesBefore;else{let e;if(r){const t=n*i.params.grid.rows;e=i.slides.find(e=>1*e.getAttribute("data-swiper-slide-index")===t).column}else e=i.getSlideIndexByData(n);const t=r?Math.ceil(i.slides.length/i.params.grid.rows):i.slides.length,{centeredSlides:s,slidesOffsetBefore:l,slidesOffsetAfter:o}=i.params,d=s||!!l||!!o;let c=i.params.slidesPerView;"auto"===c?c=i.slidesPerViewDynamic():(c=Math.ceil(parseFloat(i.params.slidesPerView,10)),d&&c%2==0&&(c+=1));let p=t-e<c;if(d&&(p=p||e<Math.ceil(c/2)),a&&d&&"auto"!==i.params.slidesPerView&&!r&&(p=!1),p){const s=d?e<i.activeIndex?"prev":"next":e-i.activeIndex-1<i.params.slidesPerView?"next":"prev";i.loopFix({direction:s,slideTo:!0,activeSlideIndex:"next"===s?e+1:e-t+1,slideRealIndex:"next"===s?i.realIndex:void 0})}if(r){const e=n*i.params.grid.rows;n=i.slides.find(t=>1*t.getAttribute("data-swiper-slide-index")===e).column}else n=i.getSlideIndexByData(n)}return requestAnimationFrame(()=>{i.slideTo(n,t,s,a)}),i},slideNext:function(e,t=!0,s){const a=this,{enabled:i,params:r,animating:n}=a;if(!i||a.destroyed)return a;void 0===e&&(e=a.params.speed);let l=r.slidesPerGroup;"auto"===r.slidesPerView&&1===r.slidesPerGroup&&r.slidesPerGroupAuto&&(l=Math.max(a.slidesPerViewDynamic("current",!0),1));const o=a.activeIndex<r.slidesPerGroupSkip?1:l,d=a.virtual&&r.virtual.enabled;if(r.loop){if(n&&!d&&r.loopPreventsSliding)return!1;if(a.loopFix({direction:"next"}),a._clientLeft=a.wrapperEl.clientLeft,a.activeIndex===a.slides.length-1&&r.cssMode)return requestAnimationFrame(()=>{a.slideTo(a.activeIndex+o,e,t,s)}),!0}return r.rewind&&a.isEnd?a.slideTo(0,e,t,s):a.slideTo(a.activeIndex+o,e,t,s)},slidePrev:function(e,t=!0,s){const a=this,{params:i,snapGrid:r,slidesGrid:n,rtlTranslate:l,enabled:o,animating:d}=a;if(!o||a.destroyed)return a;void 0===e&&(e=a.params.speed);const c=a.virtual&&i.virtual.enabled;if(i.loop){if(d&&!c&&i.loopPreventsSliding)return!1;a.loopFix({direction:"prev"}),a._clientLeft=a.wrapperEl.clientLeft}function p(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}const u=p(l?a.translate:-a.translate),m=r.map(e=>p(e)),h=i.freeMode&&i.freeMode.enabled;let f=r[m.indexOf(u)-1];if(void 0===f&&(i.cssMode||h)){let e;r.forEach((t,s)=>{u>=t&&(e=s)}),void 0!==e&&(f=h?r[e]:r[e>0?e-1:e])}let g=0;if(void 0!==f&&(g=n.indexOf(f),g<0&&(g=a.activeIndex-1),"auto"===i.slidesPerView&&1===i.slidesPerGroup&&i.slidesPerGroupAuto&&(g=g-a.slidesPerViewDynamic("previous",!0)+1,g=Math.max(g,0))),i.rewind&&a.isBeginning){const i=a.params.virtual&&a.params.virtual.enabled&&a.virtual?a.virtual.slides.length-1:a.slides.length-1;return a.slideTo(i,e,t,s)}return i.loop&&0===a.activeIndex&&i.cssMode?(requestAnimationFrame(()=>{a.slideTo(g,e,t,s)}),!0):a.slideTo(g,e,t,s)},slideReset:function(e,t=!0,s){const a=this;if(!a.destroyed)return void 0===e&&(e=a.params.speed),a.slideTo(a.activeIndex,e,t,s)},slideToClosest:function(e,t=!0,s,a=.5){const i=this;if(i.destroyed)return;void 0===e&&(e=i.params.speed);let r=i.activeIndex;const n=Math.min(i.params.slidesPerGroupSkip,r),l=n+Math.floor((r-n)/i.params.slidesPerGroup),o=i.rtlTranslate?i.translate:-i.translate;if(o>=i.snapGrid[l]){const e=i.snapGrid[l];o-e>(i.snapGrid[l+1]-e)*a&&(r+=i.params.slidesPerGroup)}else{const e=i.snapGrid[l-1];o-e<=(i.snapGrid[l]-e)*a&&(r-=i.params.slidesPerGroup)}return r=Math.max(r,0),r=Math.min(r,i.slidesGrid.length-1),i.slideTo(r,e,t,s)},slideToClickedSlide:function(){const e=this;if(e.destroyed)return;const{params:t,slidesEl:s}=e,a="auto"===t.slidesPerView?e.slidesPerViewDynamic():t.slidesPerView;let i,r=e.getSlideIndexWhenGrid(e.clickedIndex);const n=e.isElement?"swiper-slide":`.${t.slideClass}`,o=e.grid&&e.params.grid&&e.params.grid.rows>1;if(t.loop){if(e.animating)return;i=parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"),10),t.centeredSlides?e.slideToLoop(i):r>(o?(e.slides.length-a)/2-(e.params.grid.rows-1):e.slides.length-a)?(e.loopFix(),r=e.getSlideIndex(g(s,`${n}[data-swiper-slide-index="${i}"]`)[0]),l(()=>{e.slideTo(r)})):e.slideTo(r)}else e.slideTo(r)}};var q={loopCreate:function(e,t){const s=this,{params:a,slidesEl:i}=s;if(!a.loop||s.virtual&&s.params.virtual.enabled)return;const r=()=>{g(i,`.${a.slideClass}, swiper-slide`).forEach((e,t)=>{e.setAttribute("data-swiper-slide-index",t)})},n=s.grid&&a.grid&&a.grid.rows>1;a.loopAddBlankSlides&&(a.slidesPerGroup>1||n)&&(()=>{const e=g(i,`.${a.slideBlankClass}`);e.forEach(e=>{e.remove()}),e.length>0&&(s.recalcSlides(),s.updateSlides())})();const l=a.slidesPerGroup*(n?a.grid.rows:1),o=s.slides.length%l!==0,d=n&&s.slides.length%a.grid.rows!==0,c=e=>{for(let t=0;t<e;t+=1){const e=s.isElement?w("swiper-slide",[a.slideBlankClass]):w("div",[a.slideClass,a.slideBlankClass]);s.slidesEl.append(e)}};if(o){if(a.loopAddBlankSlides){c(l-s.slides.length%l),s.recalcSlides(),s.updateSlides()}else v("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");r()}else if(d){if(a.loopAddBlankSlides){c(a.grid.rows-s.slides.length%a.grid.rows),s.recalcSlides(),s.updateSlides()}else v("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");r()}else r();const p=a.centeredSlides||!!a.slidesOffsetBefore||!!a.slidesOffsetAfter;s.loopFix({slideRealIndex:e,direction:p?void 0:"next",initial:t})},loopFix:function({slideRealIndex:e,slideTo:t=!0,direction:s,setTranslate:a,activeSlideIndex:i,initial:r,byController:n,byMousewheel:l}={}){const o=this;if(!o.params.loop)return;o.emit("beforeLoopFix");const{slides:d,allowSlidePrev:c,allowSlideNext:p,slidesEl:u,params:m}=o,{centeredSlides:h,slidesOffsetBefore:f,slidesOffsetAfter:g,initialSlide:w}=m,b=h||!!f||!!g;if(o.allowSlidePrev=!0,o.allowSlideNext=!0,o.virtual&&m.virtual.enabled)return t&&(b||0!==o.snapIndex?b&&o.snapIndex<m.slidesPerView?o.slideTo(o.virtual.slides.length+o.snapIndex,0,!1,!0):o.snapIndex===o.snapGrid.length-1&&o.slideTo(o.virtual.slidesBefore,0,!1,!0):o.slideTo(o.virtual.slides.length,0,!1,!0)),o.allowSlidePrev=c,o.allowSlideNext=p,void o.emit("loopFix");let y=m.slidesPerView;"auto"===y?y=o.slidesPerViewDynamic():(y=Math.ceil(parseFloat(m.slidesPerView,10)),b&&y%2==0&&(y+=1));const E=m.slidesPerGroupAuto?y:m.slidesPerGroup;let x=b?Math.max(E,Math.ceil(y/2)):E;x%E!==0&&(x+=E-x%E),x+=m.loopAdditionalSlides,o.loopedSlides=x;const S=o.grid&&m.grid&&m.grid.rows>1;d.length<y+x||"cards"===o.params.effect&&d.length<y+2*x?v("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):S&&"row"===m.grid.fill&&v("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const T=[],M=[],C=S?Math.ceil(d.length/m.grid.rows):d.length,P=r&&C-w<y&&!b;let L=P?w:o.activeIndex;void 0===i?i=o.getSlideIndex(d.find(e=>e.classList.contains(m.slideActiveClass))):L=i;const z="next"===s||!s,I="prev"===s||!s;let A=0,$=0;const k=(S?d[i].column:i)+(b&&void 0===a?-y/2+.5:0);if(k<x){A=Math.max(x-k,E);for(let e=0;e<x-k;e+=1){const t=e-Math.floor(e/C)*C;if(S){const e=C-t-1;for(let t=d.length-1;t>=0;t-=1)d[t].column===e&&T.push(t)}else T.push(C-t-1)}}else if(k+y>C-x){$=Math.max(k-(C-2*x),E),P&&($=Math.max($,y-C+w+1));for(let e=0;e<$;e+=1){const t=e-Math.floor(e/C)*C;S?d.forEach((e,s)=>{e.column===t&&M.push(s)}):M.push(t)}}if(o.__preventObserver__=!0,requestAnimationFrame(()=>{o.__preventObserver__=!1}),"cards"===o.params.effect&&d.length<y+2*x&&(M.includes(i)&&M.splice(M.indexOf(i),1),T.includes(i)&&T.splice(T.indexOf(i),1)),I&&T.forEach(e=>{d[e].swiperLoopMoveDOM=!0,u.prepend(d[e]),d[e].swiperLoopMoveDOM=!1}),z&&M.forEach(e=>{d[e].swiperLoopMoveDOM=!0,u.append(d[e]),d[e].swiperLoopMoveDOM=!1}),o.recalcSlides(),"auto"===m.slidesPerView?o.updateSlides():S&&(T.length>0&&I||M.length>0&&z)&&o.slides.forEach((e,t)=>{o.grid.updateSlide(t,e,o.slides)}),m.watchSlidesProgress&&o.updateSlidesOffset(),t)if(T.length>0&&I){if(void 0===e){const e=o.slidesGrid[L],t=o.slidesGrid[L+A]-e;l?o.setTranslate(o.translate-t):(o.slideTo(L+Math.ceil(A),0,!1,!0),a&&(o.touchEventsData.startTranslate=o.touchEventsData.startTranslate-t,o.touchEventsData.currentTranslate=o.touchEventsData.currentTranslate-t))}else if(a){const e=S?T.length/m.grid.rows:T.length;o.slideTo(o.activeIndex+e,0,!1,!0),o.touchEventsData.currentTranslate=o.translate}}else if(M.length>0&&z)if(void 0===e){const e=o.slidesGrid[L],t=o.slidesGrid[L-$]-e;l?o.setTranslate(o.translate-t):(o.slideTo(L-$,0,!1,!0),a&&(o.touchEventsData.startTranslate=o.touchEventsData.startTranslate-t,o.touchEventsData.currentTranslate=o.touchEventsData.currentTranslate-t))}else{const e=S?M.length/m.grid.rows:M.length;o.slideTo(o.activeIndex-e,0,!1,!0)}if(o.allowSlidePrev=c,o.allowSlideNext=p,o.controller&&o.controller.control&&!n){const r={slideRealIndex:e,direction:s,setTranslate:a,activeSlideIndex:i,byController:!0};Array.isArray(o.controller.control)?o.controller.control.forEach(e=>{!e.destroyed&&e.params.loop&&e.loopFix({...r,slideTo:e.params.slidesPerView===m.slidesPerView&&t})}):o.controller.control instanceof o.constructor&&o.controller.control.params.loop&&o.controller.control.loopFix({...r,slideTo:o.controller.control.params.slidesPerView===m.slidesPerView&&t})}o.emit("loopFix")},loopDestroy:function(){const e=this,{params:t,slidesEl:s}=e;if(!t.loop||!s||e.virtual&&e.params.virtual.enabled)return;e.recalcSlides();const a=[];e.slides.forEach(e=>{const t=void 0===e.swiperSlideIndex?1*e.getAttribute("data-swiper-slide-index"):e.swiperSlideIndex;a[t]=e}),e.slides.forEach(e=>{e.removeAttribute("data-swiper-slide-index")}),a.forEach(e=>{s.append(e)}),e.recalcSlides(),e.slideTo(e.realIndex,0)}};function _(e,t,s){const a=r(),{params:i}=e,n=i.edgeSwipeDetection,l=i.edgeSwipeThreshold;return!n||!(s<=l||s>=a.innerWidth-l)||"prevent"===n&&(t.preventDefault(),!0)}function F(e){const t=this,s=a();let i=e;i.originalEvent&&(i=i.originalEvent);const n=t.touchEventsData;if("pointerdown"===i.type){if(null!==n.pointerId&&n.pointerId!==i.pointerId)return;n.pointerId=i.pointerId}else"touchstart"===i.type&&1===i.targetTouches.length&&(n.touchId=i.targetTouches[0].identifier);if("touchstart"===i.type)return void _(t,i,i.targetTouches[0].pageX);const{params:l,touches:d,enabled:c}=t;if(!c)return;if(!l.simulateTouch&&"mouse"===i.pointerType)return;if(t.animating&&l.preventInteractionOnTransition)return;!t.animating&&l.cssMode&&l.loop&&t.loopFix();let p=i.target;if("wrapper"===l.touchEventsTarget&&!function(e,t){const s=r();let a=t.contains(e);!a&&s.HTMLSlotElement&&t instanceof HTMLSlotElement&&(a=[...t.assignedElements()].includes(e),a||(a=function(e,t){const s=[t];for(;s.length>0;){const t=s.shift();if(e===t)return!0;s.push(...t.children,...t.shadowRoot?t.shadowRoot.children:[],...t.assignedElements?t.assignedElements():[])}}(e,t)));return a}(p,t.wrapperEl))return;if("which"in i&&3===i.which)return;if("button"in i&&i.button>0)return;if(n.isTouched&&n.isMoved)return;const u=!!l.noSwipingClass&&""!==l.noSwipingClass,m=i.composedPath?i.composedPath():i.path;u&&i.target&&i.target.shadowRoot&&m&&(p=m[0]);const h=l.noSwipingSelector?l.noSwipingSelector:`.${l.noSwipingClass}`,f=!(!i.target||!i.target.shadowRoot);if(l.noSwiping&&(f?function(e,t=this){return function t(s){if(!s||s===a()||s===r())return null;s.assignedSlot&&(s=s.assignedSlot);const i=s.closest(e);return i||s.getRootNode?i||t(s.getRootNode().host):null}(t)}(h,p):p.closest(h)))return void(t.allowClick=!0);if(l.swipeHandler&&!p.closest(l.swipeHandler))return;d.currentX=i.pageX,d.currentY=i.pageY;const g=d.currentX,v=d.currentY;if(!_(t,i,g))return;Object.assign(n,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),d.startX=g,d.startY=v,n.touchStartTime=o(),t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,l.threshold>0&&(n.allowThresholdMove=!1);let w=!0;p.matches(n.focusableElements)&&(w=!1,"SELECT"===p.nodeName&&(n.isTouched=!1)),s.activeElement&&s.activeElement.matches(n.focusableElements)&&s.activeElement!==p&&("mouse"===i.pointerType||"mouse"!==i.pointerType&&!p.matches(n.focusableElements))&&s.activeElement.blur();const b=w&&t.allowTouchMove&&l.touchStartPreventDefault;!l.touchStartForcePreventDefault&&!b||p.isContentEditable||i.preventDefault(),l.freeMode&&l.freeMode.enabled&&t.freeMode&&t.animating&&!l.cssMode&&t.freeMode.onTouchStart(),t.emit("touchStart",i)}function W(e){const t=a(),s=this,i=s.touchEventsData,{params:r,touches:n,rtlTranslate:l,enabled:d}=s;if(!d)return;if(!r.simulateTouch&&"mouse"===e.pointerType)return;let c,p=e;if(p.originalEvent&&(p=p.originalEvent),"pointermove"===p.type){if(null!==i.touchId)return;if(p.pointerId!==i.pointerId)return}if("touchmove"===p.type){if(c=[...p.changedTouches].find(e=>e.identifier===i.touchId),!c||c.identifier!==i.touchId)return}else c=p;if(!i.isTouched)return void(i.startMoving&&i.isScrolling&&s.emit("touchMoveOpposite",p));const u=c.pageX,m=c.pageY;if(p.preventedByNestedSwiper)return n.startX=u,void(n.startY=m);if(!s.allowTouchMove)return p.target.matches(i.focusableElements)||(s.allowClick=!1),void(i.isTouched&&(Object.assign(n,{startX:u,startY:m,currentX:u,currentY:m}),i.touchStartTime=o()));if(r.touchReleaseOnEdges&&!r.loop)if(s.isVertical()){if(m<n.startY&&s.translate<=s.maxTranslate()||m>n.startY&&s.translate>=s.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else{if(l&&(u>n.startX&&-s.translate<=s.maxTranslate()||u<n.startX&&-s.translate>=s.minTranslate()))return;if(!l&&(u<n.startX&&s.translate<=s.maxTranslate()||u>n.startX&&s.translate>=s.minTranslate()))return}if(t.activeElement&&t.activeElement.matches(i.focusableElements)&&t.activeElement!==p.target&&"mouse"!==p.pointerType&&t.activeElement.blur(),t.activeElement&&p.target===t.activeElement&&p.target.matches(i.focusableElements))return i.isMoved=!0,void(s.allowClick=!1);i.allowTouchCallbacks&&s.emit("touchMove",p),n.previousX=n.currentX,n.previousY=n.currentY,n.currentX=u,n.currentY=m;const h=n.currentX-n.startX,f=n.currentY-n.startY;if(s.params.threshold&&Math.sqrt(h**2+f**2)<s.params.threshold)return;if(void 0===i.isScrolling){let e;s.isHorizontal()&&n.currentY===n.startY||s.isVertical()&&n.currentX===n.startX?i.isScrolling=!1:h*h+f*f>=25&&(e=180*Math.atan2(Math.abs(f),Math.abs(h))/Math.PI,i.isScrolling=s.isHorizontal()?e>r.touchAngle:90-e>r.touchAngle)}if(i.isScrolling&&s.emit("touchMoveOpposite",p),void 0===i.startMoving&&(n.currentX===n.startX&&n.currentY===n.startY||(i.startMoving=!0)),i.isScrolling||"touchmove"===p.type&&i.preventTouchMoveFromPointerMove)return void(i.isTouched=!1);if(!i.startMoving)return;s.allowClick=!1,!r.cssMode&&p.cancelable&&p.preventDefault(),r.touchMoveStopPropagation&&!r.nested&&p.stopPropagation();let g=s.isHorizontal()?h:f,v=s.isHorizontal()?n.currentX-n.previousX:n.currentY-n.previousY;r.oneWayMovement&&(g=Math.abs(g)*(l?1:-1),v=Math.abs(v)*(l?1:-1)),n.diff=g,g*=r.touchRatio,l&&(g=-g,v=-v);const w=s.touchesDirection;s.swipeDirection=g>0?"prev":"next",s.touchesDirection=v>0?"prev":"next";const b=s.params.loop&&!r.cssMode,y="next"===s.touchesDirection&&s.allowSlideNext||"prev"===s.touchesDirection&&s.allowSlidePrev;if(!i.isMoved){if(b&&y&&s.loopFix({direction:s.swipeDirection}),i.startTranslate=s.getTranslate(),s.setTransition(0),s.animating){const e=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});s.wrapperEl.dispatchEvent(e)}i.allowMomentumBounce=!1,!r.grabCursor||!0!==s.allowSlideNext&&!0!==s.allowSlidePrev||s.setGrabCursor(!0),s.emit("sliderFirstMove",p)}if((new Date).getTime(),!1!==r._loopSwapReset&&i.isMoved&&i.allowThresholdMove&&w!==s.touchesDirection&&b&&y&&Math.abs(g)>=1)return Object.assign(n,{startX:u,startY:m,currentX:u,currentY:m,startTranslate:i.currentTranslate}),i.loopSwapReset=!0,void(i.startTranslate=i.currentTranslate);s.emit("sliderMove",p),i.isMoved=!0,i.currentTranslate=g+i.startTranslate;let E=!0,x=r.resistanceRatio;if(r.touchReleaseOnEdges&&(x=0),g>0?(b&&y&&i.allowThresholdMove&&i.currentTranslate>(r.centeredSlides?s.minTranslate()-s.slidesSizesGrid[s.activeIndex+1]-("auto"!==r.slidesPerView&&s.slides.length-r.slidesPerView>=2?s.slidesSizesGrid[s.activeIndex+1]+s.params.spaceBetween:0)-s.params.spaceBetween:s.minTranslate())&&s.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),i.currentTranslate>s.minTranslate()&&(E=!1,r.resistance&&(i.currentTranslate=s.minTranslate()-1+(-s.minTranslate()+i.startTranslate+g)**x))):g<0&&(b&&y&&i.allowThresholdMove&&i.currentTranslate<(r.centeredSlides?s.maxTranslate()+s.slidesSizesGrid[s.slidesSizesGrid.length-1]+s.params.spaceBetween+("auto"!==r.slidesPerView&&s.slides.length-r.slidesPerView>=2?s.slidesSizesGrid[s.slidesSizesGrid.length-1]+s.params.spaceBetween:0):s.maxTranslate())&&s.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:s.slides.length-("auto"===r.slidesPerView?s.slidesPerViewDynamic():Math.ceil(parseFloat(r.slidesPerView,10)))}),i.currentTranslate<s.maxTranslate()&&(E=!1,r.resistance&&(i.currentTranslate=s.maxTranslate()+1-(s.maxTranslate()-i.startTranslate-g)**x))),E&&(p.preventedByNestedSwiper=!0),!s.allowSlideNext&&"next"===s.swipeDirection&&i.currentTranslate<i.startTranslate&&(i.currentTranslate=i.startTranslate),!s.allowSlidePrev&&"prev"===s.swipeDirection&&i.currentTranslate>i.startTranslate&&(i.currentTranslate=i.startTranslate),s.allowSlidePrev||s.allowSlideNext||(i.currentTranslate=i.startTranslate),r.threshold>0){if(!(Math.abs(g)>r.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,n.startX=n.currentX,n.startY=n.currentY,i.currentTranslate=i.startTranslate,void(n.diff=s.isHorizontal()?n.currentX-n.startX:n.currentY-n.startY)}r.followFinger&&!r.cssMode&&((r.freeMode&&r.freeMode.enabled&&s.freeMode||r.watchSlidesProgress)&&(s.updateActiveIndex(),s.updateSlidesClasses()),r.freeMode&&r.freeMode.enabled&&s.freeMode&&s.freeMode.onTouchMove(),s.updateProgress(i.currentTranslate),s.setTranslate(i.currentTranslate))}function j(e){const t=this,s=t.touchEventsData;let a,i=e;i.originalEvent&&(i=i.originalEvent);if("touchend"===i.type||"touchcancel"===i.type){if(a=[...i.changedTouches].find(e=>e.identifier===s.touchId),!a||a.identifier!==s.touchId)return}else{if(null!==s.touchId)return;if(i.pointerId!==s.pointerId)return;a=i}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(i.type)){if(!(["pointercancel","contextmenu"].includes(i.type)&&(t.browser.isSafari||t.browser.isWebView)))return}s.pointerId=null,s.touchId=null;const{params:r,touches:n,rtlTranslate:d,slidesGrid:c,enabled:p}=t;if(!p)return;if(!r.simulateTouch&&"mouse"===i.pointerType)return;if(s.allowTouchCallbacks&&t.emit("touchEnd",i),s.allowTouchCallbacks=!1,!s.isTouched)return s.isMoved&&r.grabCursor&&t.setGrabCursor(!1),s.isMoved=!1,void(s.startMoving=!1);r.grabCursor&&s.isMoved&&s.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);const u=o(),m=u-s.touchStartTime;if(t.allowClick){const e=i.path||i.composedPath&&i.composedPath();t.updateClickedSlide(e&&e[0]||i.target,e),t.emit("tap click",i),m<300&&u-s.lastClickTime<300&&t.emit("doubleTap doubleClick",i)}if(s.lastClickTime=o(),l(()=>{t.destroyed||(t.allowClick=!0)}),!s.isTouched||!s.isMoved||!t.swipeDirection||0===n.diff&&!s.loopSwapReset||s.currentTranslate===s.startTranslate&&!s.loopSwapReset)return s.isTouched=!1,s.isMoved=!1,void(s.startMoving=!1);let h;if(s.isTouched=!1,s.isMoved=!1,s.startMoving=!1,h=r.followFinger?d?t.translate:-t.translate:-s.currentTranslate,r.cssMode)return;if(r.freeMode&&r.freeMode.enabled)return void t.freeMode.onTouchEnd({currentPos:h});const f=h>=-t.maxTranslate()&&!t.params.loop;let g=0,v=t.slidesSizesGrid[0];for(let e=0;e<c.length;e+=e<r.slidesPerGroupSkip?1:r.slidesPerGroup){const t=e<r.slidesPerGroupSkip-1?1:r.slidesPerGroup;void 0!==c[e+t]?(f||h>=c[e]&&h<c[e+t])&&(g=e,v=c[e+t]-c[e]):(f||h>=c[e])&&(g=e,v=c[c.length-1]-c[c.length-2])}let w=null,b=null;r.rewind&&(t.isBeginning?b=r.virtual&&r.virtual.enabled&&t.virtual?t.virtual.slides.length-1:t.slides.length-1:t.isEnd&&(w=0));const y=(h-c[g])/v,E=g<r.slidesPerGroupSkip-1?1:r.slidesPerGroup;if(m>r.longSwipesMs){if(!r.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(y>=r.longSwipesRatio?t.slideTo(r.rewind&&t.isEnd?w:g+E):t.slideTo(g)),"prev"===t.swipeDirection&&(y>1-r.longSwipesRatio?t.slideTo(g+E):null!==b&&y<0&&Math.abs(y)>r.longSwipesRatio?t.slideTo(b):t.slideTo(g))}else{if(!r.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(i.target===t.navigation.nextEl||i.target===t.navigation.prevEl)?i.target===t.navigation.nextEl?t.slideTo(g+E):t.slideTo(g):("next"===t.swipeDirection&&t.slideTo(null!==w?w:g+E),"prev"===t.swipeDirection&&t.slideTo(null!==b?b:g))}}function U(){const e=this,{params:t,el:s}=e;if(s&&0===s.offsetWidth)return;t.breakpoints&&e.setBreakpoint();const{allowSlideNext:a,allowSlidePrev:i,snapGrid:r}=e,n=e.virtual&&e.params.virtual.enabled;e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),e.updateSlidesClasses();const l=n&&t.loop;!("auto"===t.slidesPerView||t.slidesPerView>1)||!e.isEnd||e.isBeginning||e.params.centeredSlides||l?e.params.loop&&!n?e.slideToLoop(e.realIndex,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0):e.slideTo(e.slides.length-1,0,!1,!0),e.autoplay&&e.autoplay.running&&e.autoplay.paused&&(clearTimeout(e.autoplay.resizeTimeout),e.autoplay.resizeTimeout=setTimeout(()=>{e.autoplay&&e.autoplay.running&&e.autoplay.paused&&e.autoplay.resume()},500)),e.allowSlidePrev=i,e.allowSlideNext=a,e.params.watchOverflow&&r!==e.snapGrid&&e.checkOverflow()}function K(e){const t=this;t.enabled&&(t.allowClick||(t.params.preventClicks&&e.preventDefault(),t.params.preventClicksPropagation&&t.animating&&(e.stopPropagation(),e.stopImmediatePropagation())))}function Z(){const e=this,{wrapperEl:t,rtlTranslate:s,enabled:a}=e;if(!a)return;let i;e.previousTranslate=e.translate,e.isHorizontal()?e.translate=-t.scrollLeft:e.translate=-t.scrollTop,0===e.translate&&(e.translate=0),e.updateActiveIndex(),e.updateSlidesClasses();const r=e.maxTranslate()-e.minTranslate();i=0===r?0:(e.translate-e.minTranslate())/r,i!==e.progress&&e.updateProgress(s?-e.translate:e.translate),e.emit("setTranslate",e.translate,!1)}function Q(e){const t=this;X(t,e.target),t.params.cssMode||"auto"!==t.params.slidesPerView&&!t.params.autoHeight||t.update()}function J(){const e=this;e.documentTouchHandlerProceeded||(e.documentTouchHandlerProceeded=!0,e.params.touchReleaseOnEdges&&(e.el.style.touchAction="auto"))}const ee=(e,t)=>{const s=a(),{params:i,el:r,wrapperEl:n,device:l}=e,o=!!i.nested,d="on"===t?"addEventListener":"removeEventListener",c=t;r&&"string"!=typeof r&&(s[d]("touchstart",e.onDocumentTouchStart,{passive:!1,capture:o}),r[d]("touchstart",e.onTouchStart,{passive:!1}),r[d]("pointerdown",e.onTouchStart,{passive:!1}),s[d]("touchmove",e.onTouchMove,{passive:!1,capture:o}),s[d]("pointermove",e.onTouchMove,{passive:!1,capture:o}),s[d]("touchend",e.onTouchEnd,{passive:!0}),s[d]("pointerup",e.onTouchEnd,{passive:!0}),s[d]("pointercancel",e.onTouchEnd,{passive:!0}),s[d]("touchcancel",e.onTouchEnd,{passive:!0}),s[d]("pointerout",e.onTouchEnd,{passive:!0}),s[d]("pointerleave",e.onTouchEnd,{passive:!0}),s[d]("contextmenu",e.onTouchEnd,{passive:!0}),(i.preventClicks||i.preventClicksPropagation)&&r[d]("click",e.onClick,!0),i.cssMode&&n[d]("scroll",e.onScroll),i.updateOnWindowResize?e[c](l.ios||l.android?"resize orientationchange observerUpdate":"resize observerUpdate",U,!0):e[c]("observerUpdate",U,!0),r[d]("load",e.onLoad,{capture:!0}))};const te=(e,t)=>e.grid&&t.grid&&t.grid.rows>1;var se={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};function ae(e,t){return function(s={}){const a=Object.keys(s)[0],i=s[a];"object"==typeof i&&null!==i?(!0===e[a]&&(e[a]={enabled:!0}),"navigation"===a&&e[a]&&e[a].enabled&&!e[a].prevEl&&!e[a].nextEl&&(e[a].auto=!0),["pagination","scrollbar"].indexOf(a)>=0&&e[a]&&e[a].enabled&&!e[a].el&&(e[a].auto=!0),a in e&&"enabled"in i?("object"!=typeof e[a]||"enabled"in e[a]||(e[a].enabled=!0),e[a]||(e[a]={enabled:!1}),u(t,s)):u(t,s)):u(t,s)}}const ie={eventsEmitter:O,update:H,translate:N,transition:{setTransition:function(e,t){const s=this;s.params.cssMode||(s.wrapperEl.style.transitionDuration=`${e}ms`,s.wrapperEl.style.transitionDelay=0===e?"0ms":""),s.emit("setTransition",e,t)},transitionStart:function(e=!0,t){const s=this,{params:a}=s;a.cssMode||(a.autoHeight&&s.updateAutoHeight(),R({swiper:s,runCallbacks:e,direction:t,step:"Start"}))},transitionEnd:function(e=!0,t){const s=this,{params:a}=s;s.animating=!1,a.cssMode||(s.setTransition(0),R({swiper:s,runCallbacks:e,direction:t,step:"End"}))}},slide:V,loop:q,grabCursor:{setGrabCursor:function(e){const t=this;if(!t.params.simulateTouch||t.params.watchOverflow&&t.isLocked||t.params.cssMode)return;const s="container"===t.params.touchEventsTarget?t.el:t.wrapperEl;t.isElement&&(t.__preventObserver__=!0),s.style.cursor="move",s.style.cursor=e?"grabbing":"grab",t.isElement&&requestAnimationFrame(()=>{t.__preventObserver__=!1})},unsetGrabCursor:function(){const e=this;e.params.watchOverflow&&e.isLocked||e.params.cssMode||(e.isElement&&(e.__preventObserver__=!0),e["container"===e.params.touchEventsTarget?"el":"wrapperEl"].style.cursor="",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1}))}},events:{attachEvents:function(){const e=this,{params:t}=e;e.onTouchStart=F.bind(e),e.onTouchMove=W.bind(e),e.onTouchEnd=j.bind(e),e.onDocumentTouchStart=J.bind(e),t.cssMode&&(e.onScroll=Z.bind(e)),e.onClick=K.bind(e),e.onLoad=Q.bind(e),ee(e,"on")},detachEvents:function(){ee(this,"off")}},breakpoints:{setBreakpoint:function(){const e=this,{realIndex:t,initialized:s,params:i,el:r}=e,n=i.breakpoints;if(!n||n&&0===Object.keys(n).length)return;const l=a(),o="window"!==i.breakpointsBase&&i.breakpointsBase?"container":i.breakpointsBase,d=["window","container"].includes(i.breakpointsBase)||!i.breakpointsBase?e.el:l.querySelector(i.breakpointsBase),c=e.getBreakpoint(n,o,d);if(!c||e.currentBreakpoint===c)return;const p=(c in n?n[c]:void 0)||e.originalParams,m=te(e,i),h=te(e,p),f=e.params.grabCursor,g=p.grabCursor,v=i.enabled;m&&!h?(r.classList.remove(`${i.containerModifierClass}grid`,`${i.containerModifierClass}grid-column`),e.emitContainerClasses()):!m&&h&&(r.classList.add(`${i.containerModifierClass}grid`),(p.grid.fill&&"column"===p.grid.fill||!p.grid.fill&&"column"===i.grid.fill)&&r.classList.add(`${i.containerModifierClass}grid-column`),e.emitContainerClasses()),f&&!g?e.unsetGrabCursor():!f&&g&&e.setGrabCursor(),["navigation","pagination","scrollbar"].forEach(t=>{if(void 0===p[t])return;const s=i[t]&&i[t].enabled,a=p[t]&&p[t].enabled;s&&!a&&e[t].disable(),!s&&a&&e[t].enable()});const w=p.direction&&p.direction!==i.direction,b=i.loop&&(p.slidesPerView!==i.slidesPerView||w),y=i.loop;w&&s&&e.changeDirection(),u(e.params,p);const E=e.params.enabled,x=e.params.loop;Object.assign(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),v&&!E?e.disable():!v&&E&&e.enable(),e.currentBreakpoint=c,e.emit("_beforeBreakpoint",p),s&&(b?(e.loopDestroy(),e.loopCreate(t),e.updateSlides()):!y&&x?(e.loopCreate(t),e.updateSlides()):y&&!x&&e.loopDestroy()),e.emit("breakpoint",p)},getBreakpoint:function(e,t="window",s){if(!e||"container"===t&&!s)return;let a=!1;const i=r(),n="window"===t?i.innerHeight:s.clientHeight,l=Object.keys(e).map(e=>{if("string"==typeof e&&0===e.indexOf("@")){const t=parseFloat(e.substr(1));return{value:n*t,point:e}}return{value:e,point:e}});l.sort((e,t)=>parseInt(e.value,10)-parseInt(t.value,10));for(let e=0;e<l.length;e+=1){const{point:r,value:n}=l[e];"window"===t?i.matchMedia(`(min-width: ${n}px)`).matches&&(a=r):n<=s.clientWidth&&(a=r)}return a||"max"}},checkOverflow:{checkOverflow:function(){const e=this,{isLocked:t,params:s}=e,{slidesOffsetBefore:a}=s;if(a){const t=e.slides.length-1,s=e.slidesGrid[t]+e.slidesSizesGrid[t]+2*a;e.isLocked=e.size>s}else e.isLocked=1===e.snapGrid.length;!0===s.allowSlideNext&&(e.allowSlideNext=!e.isLocked),!0===s.allowSlidePrev&&(e.allowSlidePrev=!e.isLocked),t&&t!==e.isLocked&&(e.isEnd=!1),t!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock")}},classes:{addClasses:function(){const e=this,{classNames:t,params:s,rtl:a,el:i,device:r}=e,n=function(e,t){const s=[];return e.forEach(e=>{"object"==typeof e?Object.keys(e).forEach(a=>{e[a]&&s.push(t+a)}):"string"==typeof e&&s.push(t+e)}),s}(["initialized",s.direction,{"free-mode":e.params.freeMode&&s.freeMode.enabled},{autoheight:s.autoHeight},{rtl:a},{grid:s.grid&&s.grid.rows>1},{"grid-column":s.grid&&s.grid.rows>1&&"column"===s.grid.fill},{android:r.android},{ios:r.ios},{"css-mode":s.cssMode},{centered:s.cssMode&&s.centeredSlides},{"watch-progress":s.watchSlidesProgress}],s.containerModifierClass);t.push(...n),i.classList.add(...t),e.emitContainerClasses()},removeClasses:function(){const{el:e,classNames:t}=this;e&&"string"!=typeof e&&(e.classList.remove(...t),this.emitContainerClasses())}}},re={};class ne{constructor(...e){let t,s;1===e.length&&e[0].constructor&&"Object"===Object.prototype.toString.call(e[0]).slice(8,-1)?s=e[0]:[t,s]=e,s||(s={}),s=u({},s),t&&!s.el&&(s.el=t);const i=a();if(s.el&&"string"==typeof s.el&&i.querySelectorAll(s.el).length>1){const e=[];return i.querySelectorAll(s.el).forEach(t=>{const a=u({},s,{el:t});e.push(new ne(a))}),e}const r=this;r.__swiper__=!0,r.support=A(),r.device=$({userAgent:s.userAgent}),r.browser=k(),r.eventsListeners={},r.eventsAnyListeners=[],r.modules=[...r.__modules__],s.modules&&Array.isArray(s.modules)&&r.modules.push(...s.modules);const n={};r.modules.forEach(e=>{e({params:s,swiper:r,extendParams:ae(s,n),on:r.on.bind(r),once:r.once.bind(r),off:r.off.bind(r),emit:r.emit.bind(r)})});const l=u({},se,n);return r.params=u({},l,re,s),r.originalParams=u({},r.params),r.passedParams=u({},s),r.params&&r.params.on&&Object.keys(r.params.on).forEach(e=>{r.on(e,r.params.on[e])}),r.params&&r.params.onAny&&r.onAny(r.params.onAny),Object.assign(r,{enabled:r.params.enabled,el:t,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:()=>"horizontal"===r.params.direction,isVertical:()=>"vertical"===r.params.direction,activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:r.params.allowSlideNext,allowSlidePrev:r.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:r.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:r.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),r.emit("_swiper"),r.params.init&&r.init(),r}getDirectionLabel(e){return this.isHorizontal()?e:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[e]}getSlideIndex(e){const{slidesEl:t,params:s}=this,a=E(g(t,`.${s.slideClass}, swiper-slide`)[0]);return E(e)-a}getSlideIndexByData(e){return this.getSlideIndex(this.slides.find(t=>1*t.getAttribute("data-swiper-slide-index")===e))}getSlideIndexWhenGrid(e){return this.grid&&this.params.grid&&this.params.grid.rows>1&&("column"===this.params.grid.fill?e=Math.floor(e/this.params.grid.rows):"row"===this.params.grid.fill&&(e%=Math.ceil(this.slides.length/this.params.grid.rows))),e}recalcSlides(){const{slidesEl:e,params:t}=this;this.slides=g(e,`.${t.slideClass}, swiper-slide`)}enable(){const e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))}disable(){const e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))}setProgress(e,t){const s=this;e=Math.min(Math.max(e,0),1);const a=s.minTranslate(),i=(s.maxTranslate()-a)*e+a;s.translateTo(i,void 0===t?0:t),s.updateActiveIndex(),s.updateSlidesClasses()}emitContainerClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=e.el.className.split(" ").filter(t=>0===t.indexOf("swiper")||0===t.indexOf(e.params.containerModifierClass));e.emit("_containerClasses",t.join(" "))}getSlideClasses(e){const t=this;return t.destroyed?"":e.className.split(" ").filter(e=>0===e.indexOf("swiper-slide")||0===e.indexOf(t.params.slideClass)).join(" ")}emitSlidesClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=[];e.slides.forEach(s=>{const a=e.getSlideClasses(s);t.push({slideEl:s,classNames:a}),e.emit("_slideClass",s,a)}),e.emit("_slideClasses",t)}slidesPerViewDynamic(e="current",t=!1){const{params:s,slides:a,slidesGrid:i,slidesSizesGrid:r,size:n,activeIndex:l}=this;let o=1;if("number"==typeof s.slidesPerView)return s.slidesPerView;if(s.centeredSlides){let e,t=a[l]?Math.ceil(a[l].swiperSlideSize):0;for(let s=l+1;s<a.length;s+=1)a[s]&&!e&&(t+=Math.ceil(a[s].swiperSlideSize),o+=1,t>n&&(e=!0));for(let s=l-1;s>=0;s-=1)a[s]&&!e&&(t+=a[s].swiperSlideSize,o+=1,t>n&&(e=!0))}else if("current"===e)for(let e=l+1;e<a.length;e+=1){(t?i[e]+r[e]-i[l]<n:i[e]-i[l]<n)&&(o+=1)}else for(let e=l-1;e>=0;e-=1){i[l]-i[e]<n&&(o+=1)}return o}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:t,params:s}=e;function a(){const t=e.rtlTranslate?-1*e.translate:e.translate,s=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(s),e.updateActiveIndex(),e.updateSlidesClasses()}let i;if(s.breakpoints&&e.setBreakpoint(),[...e.el.querySelectorAll('[loading="lazy"]')].forEach(t=>{t.complete&&X(e,t)}),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),s.freeMode&&s.freeMode.enabled&&!s.cssMode)a(),s.autoHeight&&e.updateAutoHeight();else{if(("auto"===s.slidesPerView||s.slidesPerView>1)&&e.isEnd&&!s.centeredSlides){const t=e.virtual&&s.virtual.enabled?e.virtual.slides:e.slides;i=e.slideTo(t.length-1,0,!1,!0)}else i=e.slideTo(e.activeIndex,0,!1,!0);i||a()}s.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,t=!0){const s=this,a=s.params.direction;return e||(e="horizontal"===a?"vertical":"horizontal"),e===a||"horizontal"!==e&&"vertical"!==e||(s.el.classList.remove(`${s.params.containerModifierClass}${a}`),s.el.classList.add(`${s.params.containerModifierClass}${e}`),s.emitContainerClasses(),s.params.direction=e,s.slides.forEach(t=>{"vertical"===e?t.style.width="":t.style.height=""}),s.emit("changeDirection"),t&&s.update()),s}changeLanguageDirection(e){const t=this;t.rtl&&"rtl"===e||!t.rtl&&"ltr"===e||(t.rtl="rtl"===e,t.rtlTranslate="horizontal"===t.params.direction&&t.rtl,t.rtl?(t.el.classList.add(`${t.params.containerModifierClass}rtl`),t.el.dir="rtl"):(t.el.classList.remove(`${t.params.containerModifierClass}rtl`),t.el.dir="ltr"),t.update())}mount(e){const t=this;if(t.mounted)return!0;let s=e||t.params.el;if("string"==typeof s&&(s=document.querySelector(s)),!s)return!1;s.swiper=t,s.parentNode&&s.parentNode.host&&s.parentNode.host.nodeName===t.params.swiperElementNodeName.toUpperCase()&&(t.isElement=!0);const a=()=>`.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;let i=(()=>{if(s&&s.shadowRoot&&s.shadowRoot.querySelector){return s.shadowRoot.querySelector(a())}return g(s,a())[0]})();return!i&&t.params.createElements&&(i=w("div",t.params.wrapperClass),s.append(i),g(s,`.${t.params.slideClass}`).forEach(e=>{i.append(e)})),Object.assign(t,{el:s,wrapperEl:i,slidesEl:t.isElement&&!s.parentNode.host.slideSlots?s.parentNode.host:i,hostEl:t.isElement?s.parentNode.host:s,mounted:!0,rtl:"rtl"===s.dir.toLowerCase()||"rtl"===y(s,"direction"),rtlTranslate:"horizontal"===t.params.direction&&("rtl"===s.dir.toLowerCase()||"rtl"===y(s,"direction")),wrongRTL:"-webkit-box"===y(i,"display")}),!0}init(e){const t=this;if(t.initialized)return t;if(!1===t.mount(e))return t;t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.loop&&t.virtual&&t.params.virtual.enabled?t.slideTo(t.params.initialSlide+t.virtual.slidesBefore,0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.params.loop&&t.loopCreate(void 0,!0),t.attachEvents();const s=[...t.el.querySelectorAll('[loading="lazy"]')];return t.isElement&&s.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),s.forEach(e=>{e.complete?X(t,e):e.addEventListener("load",e=>{X(t,e.target)})}),Y(t),t.initialized=!0,Y(t),t.emit("init"),t.emit("afterInit"),t}destroy(e=!0,t=!0){const s=this,{params:a,el:i,wrapperEl:r,slides:n}=s;return void 0===s.params||s.destroyed||(s.emit("beforeDestroy"),s.initialized=!1,s.detachEvents(),a.loop&&s.loopDestroy(),t&&(s.removeClasses(),i&&"string"!=typeof i&&i.removeAttribute("style"),r&&r.removeAttribute("style"),n&&n.length&&n.forEach(e=>{e.classList.remove(a.slideVisibleClass,a.slideFullyVisibleClass,a.slideActiveClass,a.slideNextClass,a.slidePrevClass),e.removeAttribute("style"),e.removeAttribute("data-swiper-slide-index")})),s.emit("destroy"),Object.keys(s.eventsListeners).forEach(e=>{s.off(e)}),!1!==e&&(s.el&&"string"!=typeof s.el&&(s.el.swiper=null),function(e){const t=e;Object.keys(t).forEach(e=>{try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}})}(s)),s.destroyed=!0),null}static extendDefaults(e){u(re,e)}static get extendedDefaults(){return re}static get defaults(){return se}static installModule(e){ne.prototype.__modules__||(ne.prototype.__modules__=[]);const t=ne.prototype.__modules__;"function"==typeof e&&t.indexOf(e)<0&&t.push(e)}static use(e){return Array.isArray(e)?(e.forEach(e=>ne.installModule(e)),ne):(ne.installModule(e),ne)}}function le(e,t,s,a){return e.params.createElements&&Object.keys(a).forEach(i=>{if(!s[i]&&!0===s.auto){let r=g(e.el,`.${a[i]}`)[0];r||(r=w("div",a[i]),r.className=a[i],e.el.append(r)),s[i]=r,t[i]=r}}),s}Object.keys(ie).forEach(e=>{Object.keys(ie[e]).forEach(t=>{ne.prototype[t]=ie[e][t]})}),ne.use([function({swiper:e,on:t,emit:s}){const a=r();let i=null,n=null;const l=()=>{e&&!e.destroyed&&e.initialized&&(s("beforeResize"),s("resize"))},o=()=>{e&&!e.destroyed&&e.initialized&&s("orientationchange")};t("init",()=>{e.params.resizeObserver&&void 0!==a.ResizeObserver?e&&!e.destroyed&&e.initialized&&(i=new ResizeObserver(t=>{n=a.requestAnimationFrame(()=>{const{width:s,height:a}=e;let i=s,r=a;t.forEach(({contentBoxSize:t,contentRect:s,target:a})=>{a&&a!==e.el||(i=s?s.width:(t[0]||t).inlineSize,r=s?s.height:(t[0]||t).blockSize)}),i===s&&r===a||l()})}),i.observe(e.el)):(a.addEventListener("resize",l),a.addEventListener("orientationchange",o))}),t("destroy",()=>{n&&a.cancelAnimationFrame(n),i&&i.unobserve&&e.el&&(i.unobserve(e.el),i=null),a.removeEventListener("resize",l),a.removeEventListener("orientationchange",o)})},function({swiper:e,extendParams:t,on:s,emit:a}){const i=[],n=r(),l=(t,s={})=>{const r=new(n.MutationObserver||n.WebkitMutationObserver)(t=>{if(e.__preventObserver__)return;if(1===t.length)return void a("observerUpdate",t[0]);const s=function(){a("observerUpdate",t[0])};n.requestAnimationFrame?n.requestAnimationFrame(s):n.setTimeout(s,0)});r.observe(t,{attributes:void 0===s.attributes||s.attributes,childList:e.isElement||(void 0===s.childList||s).childList,characterData:void 0===s.characterData||s.characterData}),i.push(r)};t({observer:!1,observeParents:!1,observeSlideChildren:!1}),s("init",()=>{if(e.params.observer){if(e.params.observeParents){const t=x(e.hostEl);for(let e=0;e<t.length;e+=1)l(t[e])}l(e.hostEl,{childList:e.params.observeSlideChildren}),l(e.wrapperEl,{attributes:!1})}}),s("destroy",()=>{i.forEach(e=>{e.disconnect()}),i.splice(0,i.length)})}]);function oe(e=""){return`.${e.trim().replace(/([\.:!+\/()[\]])/g,"\\$1").replace(/ /g,".")}`}function de(e){const t=this,{params:s,slidesEl:a}=t;s.loop&&t.loopDestroy();const i=e=>{if("string"==typeof e){const t=document.createElement("div");P(t,e),a.append(t.children[0]),P(t,"")}else a.append(e)};if("object"==typeof e&&"length"in e)for(let t=0;t<e.length;t+=1)e[t]&&i(e[t]);else i(e);t.recalcSlides(),s.loop&&t.loopCreate(),s.observer&&!t.isElement||t.update()}function ce(e){const t=this,{params:s,activeIndex:a,slidesEl:i}=t;s.loop&&t.loopDestroy();let r=a+1;const n=e=>{if("string"==typeof e){const t=document.createElement("div");P(t,e),i.prepend(t.children[0]),P(t,"")}else i.prepend(e)};if("object"==typeof e&&"length"in e){for(let t=0;t<e.length;t+=1)e[t]&&n(e[t]);r=a+e.length}else n(e);t.recalcSlides(),s.loop&&t.loopCreate(),s.observer&&!t.isElement||t.update(),t.slideTo(r,0,!1)}function pe(e,t){const s=this,{params:a,activeIndex:i,slidesEl:r}=s;let n=i;a.loop&&(n-=s.loopedSlides,s.loopDestroy(),s.recalcSlides());const l=s.slides.length;if(e<=0)return void s.prependSlide(t);if(e>=l)return void s.appendSlide(t);let o=n>e?n+1:n;const d=[];for(let t=l-1;t>=e;t-=1){const e=s.slides[t];e.remove(),d.unshift(e)}if("object"==typeof t&&"length"in t){for(let e=0;e<t.length;e+=1)t[e]&&r.append(t[e]);o=n>e?n+t.length:n}else r.append(t);for(let e=0;e<d.length;e+=1)r.append(d[e]);s.recalcSlides(),a.loop&&s.loopCreate(),a.observer&&!s.isElement||s.update(),a.loop?s.slideTo(o+s.loopedSlides,0,!1):s.slideTo(o,0,!1)}function ue(e){const t=this,{params:s,activeIndex:a}=t;let i=a;s.loop&&(i-=t.loopedSlides,t.loopDestroy());let r,n=i;if("object"==typeof e&&"length"in e){for(let s=0;s<e.length;s+=1)r=e[s],t.slides[r]&&t.slides[r].remove(),r<n&&(n-=1);n=Math.max(n,0)}else r=e,t.slides[r]&&t.slides[r].remove(),r<n&&(n-=1),n=Math.max(n,0);t.recalcSlides(),s.loop&&t.loopCreate(),s.observer&&!t.isElement||t.update(),s.loop?t.slideTo(n+t.loopedSlides,0,!1):t.slideTo(n,0,!1)}function me(){const e=this,t=[];for(let s=0;s<e.slides.length;s+=1)t.push(s);e.removeSlide(t)}function he(e){const{effect:t,swiper:s,on:a,setTranslate:i,setTransition:r,overwriteParams:n,perspective:l,recreateShadows:o,getEffectParams:d}=e;let c;a("beforeInit",()=>{if(s.params.effect!==t)return;s.classNames.push(`${s.params.containerModifierClass}${t}`),l&&l()&&s.classNames.push(`${s.params.containerModifierClass}3d`);const e=n?n():{};Object.assign(s.params,e),Object.assign(s.originalParams,e)}),a("setTranslate _virtualUpdated",()=>{s.params.effect===t&&i()}),a("setTransition",(e,a)=>{s.params.effect===t&&r(a)}),a("transitionEnd",()=>{if(s.params.effect===t&&o){if(!d||!d().slideShadows)return;s.slides.forEach(e=>{e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(e=>e.remove())}),o()}}),a("virtualUpdate",()=>{s.params.effect===t&&(s.slides.length||(c=!0),requestAnimationFrame(()=>{c&&s.slides&&s.slides.length&&(i(),c=!1)}))})}function fe(e,t){const s=f(t);return s!==t&&(s.style.backfaceVisibility="hidden",s.style["-webkit-backface-visibility"]="hidden"),s}function ge({swiper:e,duration:t,transformElements:s,allSlides:a}){const{activeIndex:i}=e;if(e.params.virtualTranslate&&0!==t){let t,r=!1;t=a?s:s.filter(t=>{const s=t.classList.contains("swiper-slide-transform")?(t=>{if(!t.parentElement)return e.slides.find(e=>e.shadowRoot&&e.shadowRoot===t.parentNode);return t.parentElement})(t):t;return e.getSlideIndex(s)===i}),t.forEach(t=>{S(t,()=>{if(r)return;if(!e||e.destroyed)return;r=!0,e.animating=!1;const t=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0});e.wrapperEl.dispatchEvent(t)})})}}function ve(e,t,s){const a=`swiper-slide-shadow${s?`-${s}`:""}${e?` swiper-slide-shadow-${e}`:""}`,i=f(t);let r=i.querySelector(`.${a.split(" ").join(".")}`);return r||(r=w("div",a.split(" ")),i.append(r)),r}const we=[function({swiper:e,extendParams:t,on:s,emit:i}){let r;t({virtual:{enabled:!1,slides:[],cache:!0,slidesPerViewAutoSlideSize:320,renderSlide:null,renderExternal:null,renderExternalUpdate:!0,addSlidesBefore:0,addSlidesAfter:0}});const n=a();e.virtual={cache:{},from:void 0,to:void 0,slides:[],offset:0,slidesGrid:[]};const l=n.createElement("div");function o(t,s){const a=e.params.virtual;if(a.cache&&e.virtual.cache[s])return e.virtual.cache[s];let i;return a.renderSlide?(i=a.renderSlide.call(e,t,s),"string"==typeof i&&(P(l,i),i=l.children[0])):i=e.isElement?w("swiper-slide"):w("div",e.params.slideClass),i.setAttribute("data-swiper-slide-index",s),a.renderSlide||P(i,t),a.cache&&(e.virtual.cache[s]=i),i}function d(t,s,a){const{slidesPerGroup:r,centeredSlides:n,slidesPerView:l,loop:d,initialSlide:c}=e.params;if(s&&!d&&c>0)return;const{addSlidesBefore:p,addSlidesAfter:u,slidesPerViewAutoSlideSize:m}=e.params.virtual,{from:h,to:f,slides:v,slidesGrid:w,offset:b}=e.virtual;e.params.cssMode||e.updateActiveIndex();const y=void 0===a?e.activeIndex||0:a;let E,x,S,T;if(E=e.rtlTranslate?"right":e.isHorizontal()?"left":"top","auto"===l)if(m){let t=e.size;t||(t=e.isHorizontal()?e.el.getBoundingClientRect().width:e.el.getBoundingClientRect().height),x=Math.max(1,Math.ceil(t/m))}else x=1;else x=l;n?(S=Math.floor(x/2)+r+u,T=Math.floor(x/2)+r+p):(S=x+(r-1)+u,T=(d?x:r)+p);let M=y-T,C=y+S;d||(M=Math.max(M,0),C=Math.min(C,v.length-1));let P=(e.slidesGrid[M]||0)-(e.slidesGrid[0]||0);function L(){e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),i("virtualUpdate")}if(d&&y>=T?(M-=T,n||(P+=e.slidesGrid[0])):d&&y<T&&(M=-T,n&&(P+=e.slidesGrid[0])),Object.assign(e.virtual,{from:M,to:C,offset:P,slidesGrid:e.slidesGrid,slidesBefore:T,slidesAfter:S}),h===M&&f===C&&!t)return e.slidesGrid!==w&&P!==b&&e.slides.forEach(t=>{t.style[E]=P-Math.abs(e.cssOverflowAdjustment())+"px"}),e.updateProgress(),void i("virtualUpdate");if(e.params.virtual.renderExternal)return e.params.virtual.renderExternal.call(e,{offset:P,from:M,to:C,slides:function(){const e=[];for(let t=M;t<=C;t+=1)e.push(v[t]);return e}()}),void(e.params.virtual.renderExternalUpdate?L():i("virtualUpdate"));const z=[],I=[],A=e=>{let t=e;return e<0?t=v.length+e:t>=v.length&&(t-=v.length),t};if(t)e.slides.filter(t=>t.matches(`.${e.params.slideClass}, swiper-slide`)).forEach(e=>{e.remove()});else for(let t=h;t<=f;t+=1)if(t<M||t>C){const s=A(t);e.slides.filter(t=>t.matches(`.${e.params.slideClass}[data-swiper-slide-index="${s}"], swiper-slide[data-swiper-slide-index="${s}"]`)).forEach(e=>{e.remove()})}const $=d?-v.length:0,k=d?2*v.length:v.length;for(let e=$;e<k;e+=1)if(e>=M&&e<=C){const s=A(e);void 0===f||t?I.push(s):(e>f&&I.push(s),e<h&&z.push(s))}if(I.forEach(t=>{e.slidesEl.append(o(v[t],t))}),d)for(let t=z.length-1;t>=0;t-=1){const s=z[t];e.slidesEl.prepend(o(v[s],s))}else z.sort((e,t)=>t-e),z.forEach(t=>{e.slidesEl.prepend(o(v[t],t))});g(e.slidesEl,".swiper-slide, swiper-slide").forEach(t=>{t.style[E]=P-Math.abs(e.cssOverflowAdjustment())+"px"}),L()}s("beforeInit",()=>{if(!e.params.virtual.enabled)return;let t;if(void 0===e.passedParams.virtual.slides){const s=[...e.slidesEl.children].filter(t=>t.matches(`.${e.params.slideClass}, swiper-slide`));s&&s.length&&(e.virtual.slides=[...s],t=!0,s.forEach((t,s)=>{t.setAttribute("data-swiper-slide-index",s),e.virtual.cache[s]=t,t.remove()}))}t||(e.virtual.slides=e.params.virtual.slides),e.classNames.push(`${e.params.containerModifierClass}virtual`),e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0,d(!1,!0)}),s("setTranslate",()=>{e.params.virtual.enabled&&(e.params.cssMode&&!e._immediateVirtual?(clearTimeout(r),r=setTimeout(()=>{d()},100)):d())}),s("init update resize",()=>{e.params.virtual.enabled&&e.params.cssMode&&m(e.wrapperEl,"--swiper-virtual-size",`${e.virtualSize}px`)}),Object.assign(e.virtual,{appendSlide:function(t){if("object"==typeof t&&"length"in t)for(let s=0;s<t.length;s+=1)t[s]&&e.virtual.slides.push(t[s]);else e.virtual.slides.push(t);d(!0)},prependSlide:function(t){const s=e.activeIndex;let a=s+1,i=1;if(Array.isArray(t)){for(let s=0;s<t.length;s+=1)t[s]&&e.virtual.slides.unshift(t[s]);a=s+t.length,i=t.length}else e.virtual.slides.unshift(t);if(e.params.virtual.cache){const t=e.virtual.cache,s={};Object.keys(t).forEach(e=>{const a=t[e],r=a.getAttribute("data-swiper-slide-index");r&&a.setAttribute("data-swiper-slide-index",parseInt(r,10)+i),s[parseInt(e,10)+i]=a}),e.virtual.cache=s}d(!0),e.slideTo(a,0)},removeSlide:function(t){if(null==t)return;let s=e.activeIndex;if(Array.isArray(t))for(let a=t.length-1;a>=0;a-=1)e.params.virtual.cache&&(delete e.virtual.cache[t[a]],Object.keys(e.virtual.cache).forEach(s=>{s>t&&(e.virtual.cache[s-1]=e.virtual.cache[s],e.virtual.cache[s-1].setAttribute("data-swiper-slide-index",s-1),delete e.virtual.cache[s])})),e.virtual.slides.splice(t[a],1),t[a]<s&&(s-=1),s=Math.max(s,0);else e.params.virtual.cache&&(delete e.virtual.cache[t],Object.keys(e.virtual.cache).forEach(s=>{s>t&&(e.virtual.cache[s-1]=e.virtual.cache[s],e.virtual.cache[s-1].setAttribute("data-swiper-slide-index",s-1),delete e.virtual.cache[s])})),e.virtual.slides.splice(t,1),t<s&&(s-=1),s=Math.max(s,0);d(!0),e.slideTo(s,0)},removeAllSlides:function(){e.virtual.slides=[],e.params.virtual.cache&&(e.virtual.cache={}),d(!0),e.slideTo(0,0)},update:d})},function({swiper:e,extendParams:t,on:s,emit:i}){const n=a(),l=r();function o(t){if(!e.enabled)return;const{rtlTranslate:s}=e;let a=t;a.originalEvent&&(a=a.originalEvent);const r=a.keyCode||a.charCode,o=e.params.keyboard.pageUpDown,d=o&&33===r,c=o&&34===r,p=37===r,u=39===r,m=38===r,h=40===r;if(!e.allowSlideNext&&(e.isHorizontal()&&u||e.isVertical()&&h||c))return!1;if(!e.allowSlidePrev&&(e.isHorizontal()&&p||e.isVertical()&&m||d))return!1;if(!(a.shiftKey||a.altKey||a.ctrlKey||a.metaKey||n.activeElement&&(n.activeElement.isContentEditable||n.activeElement.nodeName&&("input"===n.activeElement.nodeName.toLowerCase()||"textarea"===n.activeElement.nodeName.toLowerCase())))){if(e.params.keyboard.onlyInViewport&&(d||c||p||u||m||h)){let t=!1;if(x(e.el,`.${e.params.slideClass}, swiper-slide`).length>0&&0===x(e.el,`.${e.params.slideActiveClass}`).length)return;const a=e.el,i=a.clientWidth,r=a.clientHeight,n=l.innerWidth,o=l.innerHeight,d=b(a);s&&(d.left-=a.scrollLeft);const c=[[d.left,d.top],[d.left+i,d.top],[d.left,d.top+r],[d.left+i,d.top+r]];for(let e=0;e<c.length;e+=1){const s=c[e];if(s[0]>=0&&s[0]<=n&&s[1]>=0&&s[1]<=o){if(0===s[0]&&0===s[1])continue;t=!0}}if(!t)return}e.isHorizontal()?((d||c||p||u)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),((c||u)&&!s||(d||p)&&s)&&e.slideNext(),((d||p)&&!s||(c||u)&&s)&&e.slidePrev()):((d||c||m||h)&&(a.preventDefault?a.preventDefault():a.returnValue=!1),(c||h)&&e.slideNext(),(d||m)&&e.slidePrev()),i("keyPress",r)}}function d(){e.keyboard.enabled||(n.addEventListener("keydown",o),e.keyboard.enabled=!0)}function c(){e.keyboard.enabled&&(n.removeEventListener("keydown",o),e.keyboard.enabled=!1)}e.keyboard={enabled:!1},t({keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}}),s("init",()=>{e.params.keyboard.enabled&&d()}),s("destroy",()=>{e.keyboard.enabled&&c()}),Object.assign(e.keyboard,{enable:d,disable:c})},function({swiper:e,extendParams:t,on:s,emit:a}){const i=r();let n;t({mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null,noMousewheelClass:"swiper-no-mousewheel"}}),e.mousewheel={enabled:!1};let d,c=o();const p=[];function u(){e.enabled&&(e.mouseEntered=!0)}function m(){e.enabled&&(e.mouseEntered=!1)}function h(t){return!(e.params.mousewheel.thresholdDelta&&t.delta<e.params.mousewheel.thresholdDelta)&&(!(e.params.mousewheel.thresholdTime&&o()-c<e.params.mousewheel.thresholdTime)&&(t.delta>=6&&o()-c<60||(t.direction<0?e.isEnd&&!e.params.loop||e.animating||(e.slideNext(),a("scroll",t.raw)):e.isBeginning&&!e.params.loop||e.animating||(e.slidePrev(),a("scroll",t.raw)),c=(new i.Date).getTime(),!1)))}function f(t){let s=t,i=!0;if(!e.enabled)return;if(t.target.closest(`.${e.params.mousewheel.noMousewheelClass}`))return;const r=e.params.mousewheel;e.params.cssMode&&s.preventDefault();let c=e.el;"container"!==e.params.mousewheel.eventsTarget&&(c=document.querySelector(e.params.mousewheel.eventsTarget));const u=c&&c.contains(s.target);if(!e.mouseEntered&&!u&&!r.releaseOnEdges)return!0;s.originalEvent&&(s=s.originalEvent);let m=0;const f=e.rtlTranslate?-1:1,g=function(e){let t=0,s=0,a=0,i=0;return"detail"in e&&(s=e.detail),"wheelDelta"in e&&(s=-e.wheelDelta/120),"wheelDeltaY"in e&&(s=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=s,s=0),a=10*t,i=10*s,"deltaY"in e&&(i=e.deltaY),"deltaX"in e&&(a=e.deltaX),e.shiftKey&&!a&&(a=i,i=0),(a||i)&&e.deltaMode&&(1===e.deltaMode?(a*=40,i*=40):(a*=800,i*=800)),a&&!t&&(t=a<1?-1:1),i&&!s&&(s=i<1?-1:1),{spinX:t,spinY:s,pixelX:a,pixelY:i}}(s);if(r.forceToAxis)if(e.isHorizontal()){if(!(Math.abs(g.pixelX)>Math.abs(g.pixelY)))return!0;m=-g.pixelX*f}else{if(!(Math.abs(g.pixelY)>Math.abs(g.pixelX)))return!0;m=-g.pixelY}else m=Math.abs(g.pixelX)>Math.abs(g.pixelY)?-g.pixelX*f:-g.pixelY;if(0===m)return!0;r.invert&&(m=-m);let v=e.getTranslate()+m*r.sensitivity;if(v>=e.minTranslate()&&(v=e.minTranslate()),v<=e.maxTranslate()&&(v=e.maxTranslate()),i=!!e.params.loop||!(v===e.minTranslate()||v===e.maxTranslate()),i&&e.params.nested&&s.stopPropagation(),e.params.freeMode&&e.params.freeMode.enabled){const t={time:o(),delta:Math.abs(m),direction:Math.sign(m)},i=d&&t.time<d.time+500&&t.delta<=d.delta&&t.direction===d.direction;if(!i){d=void 0;let o=e.getTranslate()+m*r.sensitivity;const c=e.isBeginning,u=e.isEnd;if(o>=e.minTranslate()&&(o=e.minTranslate()),o<=e.maxTranslate()&&(o=e.maxTranslate()),e.setTransition(0),e.setTranslate(o),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses(),(!c&&e.isBeginning||!u&&e.isEnd)&&e.updateSlidesClasses(),e.params.loop&&e.loopFix({direction:t.direction<0?"next":"prev",byMousewheel:!0}),e.params.freeMode.sticky){clearTimeout(n),n=void 0,p.length>=15&&p.shift();const s=p.length?p[p.length-1]:void 0,a=p[0];if(p.push(t),s&&(t.delta>s.delta||t.direction!==s.direction))p.splice(0);else if(p.length>=15&&t.time-a.time<500&&a.delta-t.delta>=1&&t.delta<=6){const s=m>0?.8:.2;d=t,p.splice(0),n=l(()=>{!e.destroyed&&e.params&&e.slideToClosest(e.params.speed,!0,void 0,s)},0)}n||(n=l(()=>{if(e.destroyed||!e.params)return;d=t,p.splice(0),e.slideToClosest(e.params.speed,!0,void 0,.5)},500))}if(i||a("scroll",s),e.params.autoplay&&e.params.autoplay.disableOnInteraction&&e.autoplay.stop(),r.releaseOnEdges&&(o===e.minTranslate()||o===e.maxTranslate()))return!0}}else{const s={time:o(),delta:Math.abs(m),direction:Math.sign(m),raw:t};p.length>=2&&p.shift();const a=p.length?p[p.length-1]:void 0;if(p.push(s),a?(s.direction!==a.direction||s.delta>a.delta||s.time>a.time+150)&&h(s):h(s),function(t){const s=e.params.mousewheel;if(t.direction<0){if(e.isEnd&&!e.params.loop&&s.releaseOnEdges)return!0}else if(e.isBeginning&&!e.params.loop&&s.releaseOnEdges)return!0;return!1}(s))return!0}return s.preventDefault?s.preventDefault():s.returnValue=!1,!1}function g(t){let s=e.el;"container"!==e.params.mousewheel.eventsTarget&&(s=document.querySelector(e.params.mousewheel.eventsTarget)),s[t]("mouseenter",u),s[t]("mouseleave",m),s[t]("wheel",f)}function v(){return e.params.cssMode?(e.wrapperEl.removeEventListener("wheel",f),!0):!e.mousewheel.enabled&&(g("addEventListener"),e.mousewheel.enabled=!0,!0)}function w(){return e.params.cssMode?(e.wrapperEl.addEventListener(event,f),!0):!!e.mousewheel.enabled&&(g("removeEventListener"),e.mousewheel.enabled=!1,!0)}s("init",()=>{!e.params.mousewheel.enabled&&e.params.cssMode&&w(),e.params.mousewheel.enabled&&v()}),s("destroy",()=>{e.params.cssMode&&v(),e.mousewheel.enabled&&w()}),Object.assign(e.mousewheel,{enable:v,disable:w})},function({swiper:e,extendParams:t,on:s,emit:a}){function i(t){let s;return t&&"string"==typeof t&&e.isElement&&(s=e.el.querySelector(t)||e.hostEl.querySelector(t),s)?s:(t&&("string"==typeof t&&(s=[...document.querySelectorAll(t)]),e.params.uniqueNavElements&&"string"==typeof t&&s&&s.length>1&&1===e.el.querySelectorAll(t).length?s=e.el.querySelector(t):s&&1===s.length&&(s=s[0])),t&&!s?t:s)}function r(t,s){const a=e.params.navigation;(t=M(t)).forEach(t=>{t&&(t.classList[s?"add":"remove"](...a.disabledClass.split(" ")),"BUTTON"===t.tagName&&(t.disabled=s),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](a.lockClass))})}function n(){const{nextEl:t,prevEl:s}=e.navigation;if(e.params.loop)return r(s,!1),void r(t,!1);r(s,e.isBeginning&&!e.params.rewind),r(t,e.isEnd&&!e.params.rewind)}function l(t){t.preventDefault(),(!e.isBeginning||e.params.loop||e.params.rewind)&&(e.slidePrev(),a("navigationPrev"))}function o(t){t.preventDefault(),(!e.isEnd||e.params.loop||e.params.rewind)&&(e.slideNext(),a("navigationNext"))}function d(){const t=e.params.navigation;if(e.params.navigation=le(e,e.originalParams.navigation,e.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),!t.nextEl&&!t.prevEl)return;let s=i(t.nextEl),a=i(t.prevEl);Object.assign(e.navigation,{nextEl:s,prevEl:a}),s=M(s),a=M(a);const r=(s,a)=>{s&&(s.matches(".swiper-button-next,.swiper-button-prev")&&!s.querySelector("svg")&&P(s,'<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>'),s.addEventListener("click","next"===a?o:l)),!e.enabled&&s&&s.classList.add(...t.lockClass.split(" "))};s.forEach(e=>r(e,"next")),a.forEach(e=>r(e,"prev"))}function c(){let{nextEl:t,prevEl:s}=e.navigation;t=M(t),s=M(s);const a=(t,s)=>{t.removeEventListener("click","next"===s?o:l),t.classList.remove(...e.params.navigation.disabledClass.split(" "))};t.forEach(e=>a(e,"next")),s.forEach(e=>a(e,"prev"))}t({navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),e.navigation={nextEl:null,prevEl:null},s("init",()=>{!1===e.params.navigation.enabled?p():(d(),n())}),s("toEdge fromEdge lock unlock",()=>{n()}),s("destroy",()=>{c()}),s("enable disable",()=>{let{nextEl:t,prevEl:s}=e.navigation;t=M(t),s=M(s),e.enabled?n():[...t,...s].filter(e=>!!e).forEach(t=>t.classList.add(e.params.navigation.lockClass))}),s("click",(t,s)=>{let{nextEl:i,prevEl:r}=e.navigation;i=M(i),r=M(r);const n=s.target;let l=r.includes(n)||i.includes(n);if(e.isElement&&!l){const e=s.path||s.composedPath&&s.composedPath();e&&(l=e.find(e=>i.includes(e)||r.includes(e)))}if(e.params.navigation.hideOnClick&&!l){if(e.pagination&&e.params.pagination&&e.params.pagination.clickable&&(e.pagination.el===n||e.pagination.el.contains(n)))return;let t;i.length?t=i[0].classList.contains(e.params.navigation.hiddenClass):r.length&&(t=r[0].classList.contains(e.params.navigation.hiddenClass)),a(!0===t?"navigationShow":"navigationHide"),[...i,...r].filter(e=>!!e).forEach(t=>t.classList.toggle(e.params.navigation.hiddenClass))}});const p=()=>{e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")),c()};Object.assign(e.navigation,{enable:()=>{e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")),d(),n()},disable:p,update:n,init:d,destroy:c})},function({swiper:e,extendParams:t,on:s,emit:a}){const i="swiper-pagination";let r;t({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:e=>e,formatFractionTotal:e=>e,bulletClass:`${i}-bullet`,bulletActiveClass:`${i}-bullet-active`,modifierClass:`${i}-`,currentClass:`${i}-current`,totalClass:`${i}-total`,hiddenClass:`${i}-hidden`,progressbarFillClass:`${i}-progressbar-fill`,progressbarOppositeClass:`${i}-progressbar-opposite`,clickableClass:`${i}-clickable`,lockClass:`${i}-lock`,horizontalClass:`${i}-horizontal`,verticalClass:`${i}-vertical`,paginationDisabledClass:`${i}-disabled`}}),e.pagination={el:null,bullets:[]};let n=0;function l(){return!e.params.pagination.el||!e.pagination.el||Array.isArray(e.pagination.el)&&0===e.pagination.el.length}function o(t,s){const{bulletActiveClass:a}=e.params.pagination;t&&(t=t[("prev"===s?"previous":"next")+"ElementSibling"])&&(t.classList.add(`${a}-${s}`),(t=t[("prev"===s?"previous":"next")+"ElementSibling"])&&t.classList.add(`${a}-${s}-${s}`))}function d(t){const s=t.target.closest(oe(e.params.pagination.bulletClass));if(!s)return;t.preventDefault();const a=E(s)*e.params.slidesPerGroup;if(e.params.loop){if(e.realIndex===a)return;const t=(i=e.realIndex,r=a,n=e.slides.length,(r%=n)===1+(i%=n)?"next":r===i-1?"previous":void 0);"next"===t?e.slideNext():"previous"===t?e.slidePrev():e.slideToLoop(a)}else e.slideTo(a);var i,r,n}function c(){const t=e.rtl,s=e.params.pagination;if(l())return;let i,d,c=e.pagination.el;c=M(c);const p=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,u=e.params.loop?Math.ceil(p/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?(d=e.previousRealIndex||0,i=e.params.slidesPerGroup>1?Math.floor(e.realIndex/e.params.slidesPerGroup):e.realIndex):void 0!==e.snapIndex?(i=e.snapIndex,d=e.previousSnapIndex):(d=e.previousIndex||0,i=e.activeIndex||0),"bullets"===s.type&&e.pagination.bullets&&e.pagination.bullets.length>0){const a=e.pagination.bullets;let l,p,u;if(s.dynamicBullets&&(r=T(a[0],e.isHorizontal()?"width":"height",!0),c.forEach(t=>{t.style[e.isHorizontal()?"width":"height"]=r*(s.dynamicMainBullets+4)+"px"}),s.dynamicMainBullets>1&&void 0!==d&&(n+=i-(d||0),n>s.dynamicMainBullets-1?n=s.dynamicMainBullets-1:n<0&&(n=0)),l=Math.max(i-n,0),p=l+(Math.min(a.length,s.dynamicMainBullets)-1),u=(p+l)/2),a.forEach(e=>{const t=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(e=>`${s.bulletActiveClass}${e}`)].map(e=>"string"==typeof e&&e.includes(" ")?e.split(" "):e).flat();e.classList.remove(...t)}),c.length>1)a.forEach(t=>{const a=E(t);a===i?t.classList.add(...s.bulletActiveClass.split(" ")):e.isElement&&t.setAttribute("part","bullet"),s.dynamicBullets&&(a>=l&&a<=p&&t.classList.add(...`${s.bulletActiveClass}-main`.split(" ")),a===l&&o(t,"prev"),a===p&&o(t,"next"))});else{const t=a[i];if(t&&t.classList.add(...s.bulletActiveClass.split(" ")),e.isElement&&a.forEach((e,t)=>{e.setAttribute("part",t===i?"bullet-active":"bullet")}),s.dynamicBullets){const e=a[l],t=a[p];for(let e=l;e<=p;e+=1)a[e]&&a[e].classList.add(...`${s.bulletActiveClass}-main`.split(" "));o(e,"prev"),o(t,"next")}}if(s.dynamicBullets){const i=Math.min(a.length,s.dynamicMainBullets+4),n=(r*i-r)/2-u*r,l=t?"right":"left";a.forEach(t=>{t.style[e.isHorizontal()?l:"top"]=`${n}px`})}}c.forEach((t,r)=>{if("fraction"===s.type&&(t.querySelectorAll(oe(s.currentClass)).forEach(e=>{e.textContent=s.formatFractionCurrent(i+1)}),t.querySelectorAll(oe(s.totalClass)).forEach(e=>{e.textContent=s.formatFractionTotal(u)})),"progressbar"===s.type){let a;a=s.progressbarOpposite?e.isHorizontal()?"vertical":"horizontal":e.isHorizontal()?"horizontal":"vertical";const r=(i+1)/u;let n=1,l=1;"horizontal"===a?n=r:l=r,t.querySelectorAll(oe(s.progressbarFillClass)).forEach(t=>{t.style.transform=`translate3d(0,0,0) scaleX(${n}) scaleY(${l})`,t.style.transitionDuration=`${e.params.speed}ms`})}"custom"===s.type&&s.renderCustom?(P(t,s.renderCustom(e,i+1,u)),0===r&&a("paginationRender",t)):(0===r&&a("paginationRender",t),a("paginationUpdate",t)),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](s.lockClass)})}function p(){const t=e.params.pagination;if(l())return;const s=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.grid&&e.params.grid.rows>1?e.slides.length/Math.ceil(e.params.grid.rows):e.slides.length;let i=e.pagination.el;i=M(i);let r="";if("bullets"===t.type){let a=e.params.loop?Math.ceil(s/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&e.params.freeMode.enabled&&a>s&&(a=s);for(let s=0;s<a;s+=1)t.renderBullet?r+=t.renderBullet.call(e,s,t.bulletClass):r+=`<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`}"fraction"===t.type&&(r=t.renderFraction?t.renderFraction.call(e,t.currentClass,t.totalClass):`<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`),"progressbar"===t.type&&(r=t.renderProgressbar?t.renderProgressbar.call(e,t.progressbarFillClass):`<span class="${t.progressbarFillClass}"></span>`),e.pagination.bullets=[],i.forEach(s=>{"custom"!==t.type&&P(s,r||""),"bullets"===t.type&&e.pagination.bullets.push(...s.querySelectorAll(oe(t.bulletClass)))}),"custom"!==t.type&&a("paginationRender",i[0])}function u(){e.params.pagination=le(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const t=e.params.pagination;if(!t.el)return;let s;"string"==typeof t.el&&e.isElement&&(s=e.el.querySelector(t.el)),s||"string"!=typeof t.el||(s=[...document.querySelectorAll(t.el)]),s||(s=t.el),s&&0!==s.length&&(e.params.uniqueNavElements&&"string"==typeof t.el&&Array.isArray(s)&&s.length>1&&(s=[...e.el.querySelectorAll(t.el)],s.length>1&&(s=s.find(t=>x(t,".swiper")[0]===e.el))),Array.isArray(s)&&1===s.length&&(s=s[0]),Object.assign(e.pagination,{el:s}),s=M(s),s.forEach(s=>{"bullets"===t.type&&t.clickable&&s.classList.add(...(t.clickableClass||"").split(" ")),s.classList.add(t.modifierClass+t.type),s.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass),"bullets"===t.type&&t.dynamicBullets&&(s.classList.add(`${t.modifierClass}${t.type}-dynamic`),n=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&s.classList.add(t.progressbarOppositeClass),t.clickable&&s.addEventListener("click",d),e.enabled||s.classList.add(t.lockClass)}))}function m(){const t=e.params.pagination;if(l())return;let s=e.pagination.el;s&&(s=M(s),s.forEach(s=>{s.classList.remove(t.hiddenClass),s.classList.remove(t.modifierClass+t.type),s.classList.remove(e.isHorizontal()?t.horizontalClass:t.verticalClass),t.clickable&&(s.classList.remove(...(t.clickableClass||"").split(" ")),s.removeEventListener("click",d))})),e.pagination.bullets&&e.pagination.bullets.forEach(e=>e.classList.remove(...t.bulletActiveClass.split(" ")))}s("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const t=e.params.pagination;let{el:s}=e.pagination;s=M(s),s.forEach(s=>{s.classList.remove(t.horizontalClass,t.verticalClass),s.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass)})}),s("init",()=>{!1===e.params.pagination.enabled?h():(u(),p(),c())}),s("activeIndexChange",()=>{void 0===e.snapIndex&&c()}),s("snapIndexChange",()=>{c()}),s("snapGridLengthChange",()=>{p(),c()}),s("destroy",()=>{m()}),s("enable disable",()=>{let{el:t}=e.pagination;t&&(t=M(t),t.forEach(t=>t.classList[e.enabled?"remove":"add"](e.params.pagination.lockClass)))}),s("lock unlock",()=>{c()}),s("click",(t,s)=>{const i=s.target,r=M(e.pagination.el);if(e.params.pagination.el&&e.params.pagination.hideOnClick&&r&&r.length>0&&!i.classList.contains(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&i===e.navigation.nextEl||e.navigation.prevEl&&i===e.navigation.prevEl))return;const t=r[0].classList.contains(e.params.pagination.hiddenClass);a(!0===t?"paginationShow":"paginationHide"),r.forEach(t=>t.classList.toggle(e.params.pagination.hiddenClass))}});const h=()=>{e.el.classList.add(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=M(t),t.forEach(t=>t.classList.add(e.params.pagination.paginationDisabledClass))),m()};Object.assign(e.pagination,{enable:()=>{e.el.classList.remove(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=M(t),t.forEach(t=>t.classList.remove(e.params.pagination.paginationDisabledClass))),u(),p(),c()},disable:h,render:p,update:c,init:u,destroy:m})},function({swiper:e,extendParams:t,on:s,emit:i}){const r=a();let o,d,c,p,u=!1,m=null,h=null;function f(){if(!e.params.scrollbar.el||!e.scrollbar.el)return;const{scrollbar:t,rtlTranslate:s}=e,{dragEl:a,el:i}=t,r=e.params.scrollbar,n=e.params.loop?e.progressLoop:e.progress;let l=d,o=(c-d)*n;s?(o=-o,o>0?(l=d-o,o=0):-o+d>c&&(l=c+o)):o<0?(l=d+o,o=0):o+d>c&&(l=c-o),e.isHorizontal()?(a.style.transform=`translate3d(${o}px, 0, 0)`,a.style.width=`${l}px`):(a.style.transform=`translate3d(0px, ${o}px, 0)`,a.style.height=`${l}px`),r.hide&&(clearTimeout(m),i.style.opacity=1,m=setTimeout(()=>{i.style.opacity=0,i.style.transitionDuration="400ms"},1e3))}function g(){if(!e.params.scrollbar.el||!e.scrollbar.el)return;const{scrollbar:t}=e,{dragEl:s,el:a}=t;s.style.width="",s.style.height="",c=e.isHorizontal()?a.offsetWidth:a.offsetHeight,p=e.size/(e.virtualSize+e.params.slidesOffsetBefore-(e.params.centeredSlides?e.snapGrid[0]:0)),d="auto"===e.params.scrollbar.dragSize?c*p:parseInt(e.params.scrollbar.dragSize,10),e.isHorizontal()?s.style.width=`${d}px`:s.style.height=`${d}px`,a.style.display=p>=1?"none":"",e.params.scrollbar.hide&&(a.style.opacity=0),e.params.watchOverflow&&e.enabled&&t.el.classList[e.isLocked?"add":"remove"](e.params.scrollbar.lockClass)}function v(t){return e.isHorizontal()?t.clientX:t.clientY}function y(t){const{scrollbar:s,rtlTranslate:a}=e,{el:i}=s;let r;r=(v(t)-b(i)[e.isHorizontal()?"left":"top"]-(null!==o?o:d/2))/(c-d),r=Math.max(Math.min(r,1),0),a&&(r=1-r);const n=e.minTranslate()+(e.maxTranslate()-e.minTranslate())*r;e.updateProgress(n),e.setTranslate(n),e.updateActiveIndex(),e.updateSlidesClasses()}function E(t){const s=e.params.scrollbar,{scrollbar:a,wrapperEl:r}=e,{el:n,dragEl:l}=a;u=!0,o=t.target===l?v(t)-t.target.getBoundingClientRect()[e.isHorizontal()?"left":"top"]:null,t.preventDefault(),t.stopPropagation(),r.style.transitionDuration="100ms",l.style.transitionDuration="100ms",y(t),clearTimeout(h),n.style.transitionDuration="0ms",s.hide&&(n.style.opacity=1),e.params.cssMode&&(e.wrapperEl.style["scroll-snap-type"]="none"),i("scrollbarDragStart",t)}function x(t){const{scrollbar:s,wrapperEl:a}=e,{el:r,dragEl:n}=s;u&&(t.preventDefault&&t.cancelable?t.preventDefault():t.returnValue=!1,y(t),a.style.transitionDuration="0ms",r.style.transitionDuration="0ms",n.style.transitionDuration="0ms",i("scrollbarDragMove",t))}function S(t){const s=e.params.scrollbar,{scrollbar:a,wrapperEl:r}=e,{el:n}=a;u&&(u=!1,e.params.cssMode&&(e.wrapperEl.style["scroll-snap-type"]="",r.style.transitionDuration=""),s.hide&&(clearTimeout(h),h=l(()=>{n.style.opacity=0,n.style.transitionDuration="400ms"},1e3)),i("scrollbarDragEnd",t),s.snapOnRelease&&e.slideToClosest())}function T(t){const{scrollbar:s,params:a}=e,i=s.el;if(!i)return;const n=i,l=!!a.passiveListeners&&{passive:!1,capture:!1},o=!!a.passiveListeners&&{passive:!0,capture:!1};if(!n)return;const d="on"===t?"addEventListener":"removeEventListener";n[d]("pointerdown",E,l),r[d]("pointermove",x,l),r[d]("pointerup",S,o)}function C(){const{scrollbar:t,el:s}=e;e.params.scrollbar=le(e,e.originalParams.scrollbar,e.params.scrollbar,{el:"swiper-scrollbar"});const a=e.params.scrollbar;if(!a.el)return;let i,l;if("string"==typeof a.el&&e.isElement&&(i=e.el.querySelector(a.el)),i||"string"!=typeof a.el)i||(i=a.el);else if(i=r.querySelectorAll(a.el),!i.length)return;e.params.uniqueNavElements&&"string"==typeof a.el&&i.length>1&&1===s.querySelectorAll(a.el).length&&(i=s.querySelector(a.el)),i.length>0&&(i=i[0]),i.classList.add(e.isHorizontal()?a.horizontalClass:a.verticalClass),i&&(l=i.querySelector(oe(e.params.scrollbar.dragClass)),l||(l=w("div",e.params.scrollbar.dragClass),i.append(l))),Object.assign(t,{el:i,dragEl:l}),a.draggable&&e.params.scrollbar.el&&e.scrollbar.el&&T("on"),i&&i.classList[e.enabled?"remove":"add"](...n(e.params.scrollbar.lockClass))}function P(){const t=e.params.scrollbar,s=e.scrollbar.el;s&&s.classList.remove(...n(e.isHorizontal()?t.horizontalClass:t.verticalClass)),e.params.scrollbar.el&&e.scrollbar.el&&T("off")}t({scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock",dragClass:"swiper-scrollbar-drag",scrollbarDisabledClass:"swiper-scrollbar-disabled",horizontalClass:"swiper-scrollbar-horizontal",verticalClass:"swiper-scrollbar-vertical"}}),e.scrollbar={el:null,dragEl:null},s("changeDirection",()=>{if(!e.scrollbar||!e.scrollbar.el)return;const t=e.params.scrollbar;let{el:s}=e.scrollbar;s=M(s),s.forEach(s=>{s.classList.remove(t.horizontalClass,t.verticalClass),s.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass)})}),s("init",()=>{!1===e.params.scrollbar.enabled?L():(C(),g(),f())}),s("update resize observerUpdate lock unlock changeDirection",()=>{g()}),s("setTranslate",()=>{f()}),s("setTransition",(t,s)=>{!function(t){e.params.scrollbar.el&&e.scrollbar.el&&(e.scrollbar.dragEl.style.transitionDuration=`${t}ms`)}(s)}),s("enable disable",()=>{const{el:t}=e.scrollbar;t&&t.classList[e.enabled?"remove":"add"](...n(e.params.scrollbar.lockClass))}),s("destroy",()=>{P()});const L=()=>{e.el.classList.add(...n(e.params.scrollbar.scrollbarDisabledClass)),e.scrollbar.el&&e.scrollbar.el.classList.add(...n(e.params.scrollbar.scrollbarDisabledClass)),P()};Object.assign(e.scrollbar,{enable:()=>{e.el.classList.remove(...n(e.params.scrollbar.scrollbarDisabledClass)),e.scrollbar.el&&e.scrollbar.el.classList.remove(...n(e.params.scrollbar.scrollbarDisabledClass)),C(),g(),f()},disable:L,updateSize:g,setTranslate:f,init:C,destroy:P})},function({swiper:e,extendParams:t,on:s}){t({parallax:{enabled:!1}});const a="[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]",i=(t,s)=>{const{rtl:a}=e,i=a?-1:1,r=t.getAttribute("data-swiper-parallax")||"0";let n=t.getAttribute("data-swiper-parallax-x"),l=t.getAttribute("data-swiper-parallax-y");const o=t.getAttribute("data-swiper-parallax-scale"),d=t.getAttribute("data-swiper-parallax-opacity"),c=t.getAttribute("data-swiper-parallax-rotate");if(n||l?(n=n||"0",l=l||"0"):e.isHorizontal()?(n=r,l="0"):(l=r,n="0"),n=n.indexOf("%")>=0?parseInt(n,10)*s*i+"%":n*s*i+"px",l=l.indexOf("%")>=0?parseInt(l,10)*s+"%":l*s+"px",null!=d){const e=d-(d-1)*(1-Math.abs(s));t.style.opacity=e}let p=`translate3d(${n}, ${l}, 0px)`;if(null!=o){p+=` scale(${o-(o-1)*(1-Math.abs(s))})`}if(c&&null!=c){p+=` rotate(${c*s*-1}deg)`}t.style.transform=p},r=()=>{const{el:t,slides:s,progress:r,snapGrid:n,isElement:l}=e,o=g(t,a);e.isElement&&o.push(...g(e.hostEl,a)),o.forEach(e=>{i(e,r)}),s.forEach((t,s)=>{let l=t.progress;e.params.slidesPerGroup>1&&"auto"!==e.params.slidesPerView&&(l+=Math.ceil(s/2)-r*(n.length-1)),l=Math.min(Math.max(l,-1),1),t.querySelectorAll(`${a}, [data-swiper-parallax-rotate]`).forEach(e=>{i(e,l)})})};s("beforeInit",()=>{e.params.parallax.enabled&&(e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)}),s("init",()=>{e.params.parallax.enabled&&r()}),s("setTranslate",()=>{e.params.parallax.enabled&&r()}),s("setTransition",(t,s)=>{e.params.parallax.enabled&&((t=e.params.speed)=>{const{el:s,hostEl:i}=e,r=[...s.querySelectorAll(a)];e.isElement&&r.push(...i.querySelectorAll(a)),r.forEach(e=>{let s=parseInt(e.getAttribute("data-swiper-parallax-duration"),10)||t;0===t&&(s=0),e.style.transitionDuration=`${s}ms`})})(s)})},function({swiper:e,extendParams:t,on:s,emit:a}){const i=r();t({zoom:{enabled:!1,limitToOriginalSize:!1,maxRatio:3,minRatio:1,panOnMouseMove:!1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}}),e.zoom={enabled:!1};let n,l,o=1,c=!1,p=!1,u={x:0,y:0};const m=[],h={originX:0,originY:0,slideEl:void 0,slideWidth:void 0,slideHeight:void 0,imageEl:void 0,imageWrapEl:void 0,maxRatio:3},f={isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},v={x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0};let w,y=1;function E(){if(m.length<2)return 1;const e=m[0].pageX,t=m[0].pageY,s=m[1].pageX,a=m[1].pageY;return Math.sqrt((s-e)**2+(a-t)**2)}function S(){const t=e.params.zoom,s=h.imageWrapEl.getAttribute("data-swiper-zoom")||t.maxRatio;if(t.limitToOriginalSize&&h.imageEl&&h.imageEl.naturalWidth){const e=h.imageEl.naturalWidth/h.imageEl.offsetWidth;return Math.min(e,s)}return s}function T(t){const s=e.isElement?"swiper-slide":`.${e.params.slideClass}`;return!!t.target.matches(s)||e.slides.filter(e=>e.contains(t.target)).length>0}function M(t){const s=`.${e.params.zoom.containerClass}`;return!!t.target.matches(s)||[...e.hostEl.querySelectorAll(s)].filter(e=>e.contains(t.target)).length>0}function C(t){if("mouse"===t.pointerType&&m.splice(0,m.length),!T(t))return;const s=e.params.zoom;if(n=!1,l=!1,m.push(t),!(m.length<2)){if(n=!0,h.scaleStart=E(),!h.slideEl){h.slideEl=t.target.closest(`.${e.params.slideClass}, swiper-slide`),h.slideEl||(h.slideEl=e.slides[e.activeIndex]);let a=h.slideEl.querySelector(`.${s.containerClass}`);if(a&&(a=a.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),h.imageEl=a,h.imageWrapEl=a?x(h.imageEl,`.${s.containerClass}`)[0]:void 0,!h.imageWrapEl)return void(h.imageEl=void 0);h.maxRatio=S()}if(h.imageEl){const[e,t]=function(){if(m.length<2)return{x:null,y:null};const e=h.imageEl.getBoundingClientRect();return[(m[0].pageX+(m[1].pageX-m[0].pageX)/2-e.x-i.scrollX)/o,(m[0].pageY+(m[1].pageY-m[0].pageY)/2-e.y-i.scrollY)/o]}();h.originX=e,h.originY=t,h.imageEl.style.transitionDuration="0ms"}c=!0}}function P(t){if(!T(t))return;const s=e.params.zoom,a=e.zoom,i=m.findIndex(e=>e.pointerId===t.pointerId);i>=0&&(m[i]=t),m.length<2||(l=!0,h.scaleMove=E(),h.imageEl&&(a.scale=h.scaleMove/h.scaleStart*o,a.scale>h.maxRatio&&(a.scale=h.maxRatio-1+(a.scale-h.maxRatio+1)**.5),a.scale<s.minRatio&&(a.scale=s.minRatio+1-(s.minRatio-a.scale+1)**.5),h.imageEl.style.transform=`translate3d(0,0,0) scale(${a.scale})`))}function L(t){if(!T(t))return;if("mouse"===t.pointerType&&"pointerout"===t.type)return;const s=e.params.zoom,a=e.zoom,i=m.findIndex(e=>e.pointerId===t.pointerId);i>=0&&m.splice(i,1),n&&l&&(n=!1,l=!1,h.imageEl&&(a.scale=Math.max(Math.min(a.scale,h.maxRatio),s.minRatio),h.imageEl.style.transitionDuration=`${e.params.speed}ms`,h.imageEl.style.transform=`translate3d(0,0,0) scale(${a.scale})`,o=a.scale,c=!1,a.scale>1&&h.slideEl?h.slideEl.classList.add(`${s.zoomedSlideClass}`):a.scale<=1&&h.slideEl&&h.slideEl.classList.remove(`${s.zoomedSlideClass}`),1===a.scale&&(h.originX=0,h.originY=0,h.slideEl=void 0)))}function z(){e.touchEventsData.preventTouchMoveFromPointerMove=!1}function I(t){const s="mouse"===t.pointerType&&e.params.zoom.panOnMouseMove;if(!T(t)||!M(t))return;const a=e.zoom;if(!h.imageEl)return;if(!f.isTouched||!h.slideEl)return void(s&&$(t));if(s)return void $(t);f.isMoved||(f.width=h.imageEl.offsetWidth||h.imageEl.clientWidth,f.height=h.imageEl.offsetHeight||h.imageEl.clientHeight,f.startX=d(h.imageWrapEl,"x")||0,f.startY=d(h.imageWrapEl,"y")||0,h.slideWidth=h.slideEl.offsetWidth,h.slideHeight=h.slideEl.offsetHeight,h.imageWrapEl.style.transitionDuration="0ms");const i=f.width*a.scale,r=f.height*a.scale;f.minX=Math.min(h.slideWidth/2-i/2,0),f.maxX=-f.minX,f.minY=Math.min(h.slideHeight/2-r/2,0),f.maxY=-f.minY,f.touchesCurrent.x=m.length>0?m[0].pageX:t.pageX,f.touchesCurrent.y=m.length>0?m[0].pageY:t.pageY;if(Math.max(Math.abs(f.touchesCurrent.x-f.touchesStart.x),Math.abs(f.touchesCurrent.y-f.touchesStart.y))>5&&(e.allowClick=!1),!f.isMoved&&!c){if(e.isHorizontal()&&(Math.floor(f.minX)===Math.floor(f.startX)&&f.touchesCurrent.x<f.touchesStart.x||Math.floor(f.maxX)===Math.floor(f.startX)&&f.touchesCurrent.x>f.touchesStart.x))return f.isTouched=!1,void z();if(!e.isHorizontal()&&(Math.floor(f.minY)===Math.floor(f.startY)&&f.touchesCurrent.y<f.touchesStart.y||Math.floor(f.maxY)===Math.floor(f.startY)&&f.touchesCurrent.y>f.touchesStart.y))return f.isTouched=!1,void z()}t.cancelable&&t.preventDefault(),t.stopPropagation(),clearTimeout(w),e.touchEventsData.preventTouchMoveFromPointerMove=!0,w=setTimeout(()=>{e.destroyed||z()}),f.isMoved=!0;const n=(a.scale-o)/(h.maxRatio-e.params.zoom.minRatio),{originX:l,originY:p}=h;f.currentX=f.touchesCurrent.x-f.touchesStart.x+f.startX+n*(f.width-2*l),f.currentY=f.touchesCurrent.y-f.touchesStart.y+f.startY+n*(f.height-2*p),f.currentX<f.minX&&(f.currentX=f.minX+1-(f.minX-f.currentX+1)**.8),f.currentX>f.maxX&&(f.currentX=f.maxX-1+(f.currentX-f.maxX+1)**.8),f.currentY<f.minY&&(f.currentY=f.minY+1-(f.minY-f.currentY+1)**.8),f.currentY>f.maxY&&(f.currentY=f.maxY-1+(f.currentY-f.maxY+1)**.8),v.prevPositionX||(v.prevPositionX=f.touchesCurrent.x),v.prevPositionY||(v.prevPositionY=f.touchesCurrent.y),v.prevTime||(v.prevTime=Date.now()),v.x=(f.touchesCurrent.x-v.prevPositionX)/(Date.now()-v.prevTime)/2,v.y=(f.touchesCurrent.y-v.prevPositionY)/(Date.now()-v.prevTime)/2,Math.abs(f.touchesCurrent.x-v.prevPositionX)<2&&(v.x=0),Math.abs(f.touchesCurrent.y-v.prevPositionY)<2&&(v.y=0),v.prevPositionX=f.touchesCurrent.x,v.prevPositionY=f.touchesCurrent.y,v.prevTime=Date.now(),h.imageWrapEl.style.transform=`translate3d(${f.currentX}px, ${f.currentY}px,0)`}function A(){const t=e.zoom;h.slideEl&&e.activeIndex!==e.slides.indexOf(h.slideEl)&&(h.imageEl&&(h.imageEl.style.transform="translate3d(0,0,0) scale(1)"),h.imageWrapEl&&(h.imageWrapEl.style.transform="translate3d(0,0,0)"),h.slideEl.classList.remove(`${e.params.zoom.zoomedSlideClass}`),t.scale=1,o=1,h.slideEl=void 0,h.imageEl=void 0,h.imageWrapEl=void 0,h.originX=0,h.originY=0)}function $(e){if(o<=1||!h.imageWrapEl)return;if(!T(e)||!M(e))return;const t=i.getComputedStyle(h.imageWrapEl).transform,s=new i.DOMMatrix(t);if(!p)return p=!0,u.x=e.clientX,u.y=e.clientY,f.startX=s.e,f.startY=s.f,f.width=h.imageEl.offsetWidth||h.imageEl.clientWidth,f.height=h.imageEl.offsetHeight||h.imageEl.clientHeight,h.slideWidth=h.slideEl.offsetWidth,void(h.slideHeight=h.slideEl.offsetHeight);const a=-3*(e.clientX-u.x),r=-3*(e.clientY-u.y),n=f.width*o,l=f.height*o,d=h.slideWidth,c=h.slideHeight,m=Math.min(d/2-n/2,0),g=-m,v=Math.min(c/2-l/2,0),w=-v,b=Math.max(Math.min(f.startX+a,g),m),y=Math.max(Math.min(f.startY+r,w),v);h.imageWrapEl.style.transitionDuration="0ms",h.imageWrapEl.style.transform=`translate3d(${b}px, ${y}px, 0)`,u.x=e.clientX,u.y=e.clientY,f.startX=b,f.startY=y,f.currentX=b,f.currentY=y}function k(t){const s=e.zoom,a=e.params.zoom;if(!h.slideEl){t&&t.target&&(h.slideEl=t.target.closest(`.${e.params.slideClass}, swiper-slide`)),h.slideEl||(e.params.virtual&&e.params.virtual.enabled&&e.virtual?h.slideEl=g(e.slidesEl,`.${e.params.slideActiveClass}`)[0]:h.slideEl=e.slides[e.activeIndex]);let s=h.slideEl.querySelector(`.${a.containerClass}`);s&&(s=s.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),h.imageEl=s,h.imageWrapEl=s?x(h.imageEl,`.${a.containerClass}`)[0]:void 0}if(!h.imageEl||!h.imageWrapEl)return;let r,n,l,d,c,p,u,m,v,w,y,E,T,M,C,P,L,z;e.params.cssMode&&(e.wrapperEl.style.overflow="hidden",e.wrapperEl.style.touchAction="none"),h.slideEl.classList.add(`${a.zoomedSlideClass}`),void 0===f.touchesStart.x&&t?(r=t.pageX,n=t.pageY):(r=f.touchesStart.x,n=f.touchesStart.y);const I=o,A="number"==typeof t?t:null;1===o&&A&&(r=void 0,n=void 0,f.touchesStart.x=void 0,f.touchesStart.y=void 0);const $=S();s.scale=A||$,o=A||$,!t||1===o&&A?(u=0,m=0):(L=h.slideEl.offsetWidth,z=h.slideEl.offsetHeight,l=b(h.slideEl).left+i.scrollX,d=b(h.slideEl).top+i.scrollY,c=l+L/2-r,p=d+z/2-n,v=h.imageEl.offsetWidth||h.imageEl.clientWidth,w=h.imageEl.offsetHeight||h.imageEl.clientHeight,y=v*s.scale,E=w*s.scale,T=Math.min(L/2-y/2,0),M=Math.min(z/2-E/2,0),C=-T,P=-M,I>0&&A&&"number"==typeof f.currentX&&"number"==typeof f.currentY?(u=f.currentX*s.scale/I,m=f.currentY*s.scale/I):(u=c*s.scale,m=p*s.scale),u<T&&(u=T),u>C&&(u=C),m<M&&(m=M),m>P&&(m=P)),A&&1===s.scale&&(h.originX=0,h.originY=0),f.currentX=u,f.currentY=m,h.imageWrapEl.style.transitionDuration="300ms",h.imageWrapEl.style.transform=`translate3d(${u}px, ${m}px,0)`,h.imageEl.style.transitionDuration="300ms",h.imageEl.style.transform=`translate3d(0,0,0) scale(${s.scale})`}function O(){const t=e.zoom,s=e.params.zoom;if(!h.slideEl){e.params.virtual&&e.params.virtual.enabled&&e.virtual?h.slideEl=g(e.slidesEl,`.${e.params.slideActiveClass}`)[0]:h.slideEl=e.slides[e.activeIndex];let t=h.slideEl.querySelector(`.${s.containerClass}`);t&&(t=t.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]),h.imageEl=t,h.imageWrapEl=t?x(h.imageEl,`.${s.containerClass}`)[0]:void 0}h.imageEl&&h.imageWrapEl&&(e.params.cssMode&&(e.wrapperEl.style.overflow="",e.wrapperEl.style.touchAction=""),t.scale=1,o=1,f.currentX=void 0,f.currentY=void 0,f.touchesStart.x=void 0,f.touchesStart.y=void 0,h.imageWrapEl.style.transitionDuration="300ms",h.imageWrapEl.style.transform="translate3d(0,0,0)",h.imageEl.style.transitionDuration="300ms",h.imageEl.style.transform="translate3d(0,0,0) scale(1)",h.slideEl.classList.remove(`${s.zoomedSlideClass}`),h.slideEl=void 0,h.originX=0,h.originY=0,e.params.zoom.panOnMouseMove&&(u={x:0,y:0},p&&(p=!1,f.startX=0,f.startY=0)))}function D(t){const s=e.zoom;s.scale&&1!==s.scale?O():k(t)}function G(){return{passiveListener:!!e.params.passiveListeners&&{passive:!0,capture:!1},activeListenerWithCapture:!e.params.passiveListeners||{passive:!1,capture:!0}}}function X(){const t=e.zoom;if(t.enabled)return;t.enabled=!0;const{passiveListener:s,activeListenerWithCapture:a}=G();e.wrapperEl.addEventListener("pointerdown",C,s),e.wrapperEl.addEventListener("pointermove",P,a),["pointerup","pointercancel","pointerout"].forEach(t=>{e.wrapperEl.addEventListener(t,L,s)}),e.wrapperEl.addEventListener("pointermove",I,a)}function B(){const t=e.zoom;if(!t.enabled)return;t.enabled=!1;const{passiveListener:s,activeListenerWithCapture:a}=G();e.wrapperEl.removeEventListener("pointerdown",C,s),e.wrapperEl.removeEventListener("pointermove",P,a),["pointerup","pointercancel","pointerout"].forEach(t=>{e.wrapperEl.removeEventListener(t,L,s)}),e.wrapperEl.removeEventListener("pointermove",I,a)}Object.defineProperty(e.zoom,"scale",{get:()=>y,set(e){if(y!==e){const t=h.imageEl,s=h.slideEl;a("zoomChange",e,t,s)}y=e}}),s("init",()=>{e.params.zoom.enabled&&X()}),s("destroy",()=>{B()}),s("touchStart",(t,s)=>{e.zoom.enabled&&function(t){const s=e.device;if(!h.imageEl)return;if(f.isTouched)return;s.android&&t.cancelable&&t.preventDefault(),f.isTouched=!0;const a=m.length>0?m[0]:t;f.touchesStart.x=a.pageX,f.touchesStart.y=a.pageY}(s)}),s("touchEnd",(t,s)=>{e.zoom.enabled&&function(){const t=e.zoom;if(m.length=0,!h.imageEl)return;if(!f.isTouched||!f.isMoved)return f.isTouched=!1,void(f.isMoved=!1);f.isTouched=!1,f.isMoved=!1;let s=300,a=300;const i=v.x*s,r=f.currentX+i,n=v.y*a,l=f.currentY+n;0!==v.x&&(s=Math.abs((r-f.currentX)/v.x)),0!==v.y&&(a=Math.abs((l-f.currentY)/v.y));const o=Math.max(s,a);f.currentX=r,f.currentY=l;const d=f.width*t.scale,c=f.height*t.scale;f.minX=Math.min(h.slideWidth/2-d/2,0),f.maxX=-f.minX,f.minY=Math.min(h.slideHeight/2-c/2,0),f.maxY=-f.minY,f.currentX=Math.max(Math.min(f.currentX,f.maxX),f.minX),f.currentY=Math.max(Math.min(f.currentY,f.maxY),f.minY),h.imageWrapEl.style.transitionDuration=`${o}ms`,h.imageWrapEl.style.transform=`translate3d(${f.currentX}px, ${f.currentY}px,0)`}()}),s("doubleTap",(t,s)=>{!e.animating&&e.params.zoom.enabled&&e.zoom.enabled&&e.params.zoom.toggle&&D(s)}),s("transitionEnd",()=>{e.zoom.enabled&&e.params.zoom.enabled&&A()}),s("slideChange",()=>{e.zoom.enabled&&e.params.zoom.enabled&&e.params.cssMode&&A()}),Object.assign(e.zoom,{enable:X,disable:B,in:k,out:O,toggle:D})},function({swiper:e,extendParams:t,on:s}){function a(e,t){const s=function(){let e,t,s;return(a,i)=>{for(t=-1,e=a.length;e-t>1;)s=e+t>>1,a[s]<=i?t=s:e=s;return e}}();let a,i;return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(i=s(this.x,e),a=i-1,(e-this.x[a])*(this.y[i]-this.y[a])/(this.x[i]-this.x[a])+this.y[a]):0},this}function i(){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)}t({controller:{control:void 0,inverse:!1,by:"slide"}}),e.controller={control:void 0},s("beforeInit",()=>{if("undefined"!=typeof window&&("string"==typeof e.params.controller.control||e.params.controller.control instanceof HTMLElement)){return void("string"==typeof e.params.controller.control?[...document.querySelectorAll(e.params.controller.control)]:[e.params.controller.control]).forEach(t=>{if(e.controller.control||(e.controller.control=[]),t&&t.swiper)e.controller.control.push(t.swiper);else if(t){const s=`${e.params.eventsPrefix}init`,a=i=>{e.controller.control.push(i.detail[0]),e.update(),t.removeEventListener(s,a)};t.addEventListener(s,a)}})}e.controller.control=e.params.controller.control}),s("update",()=>{i()}),s("resize",()=>{i()}),s("observerUpdate",()=>{i()}),s("setTranslate",(t,s,a)=>{e.controller.control&&!e.controller.control.destroyed&&e.controller.setTranslate(s,a)}),s("setTransition",(t,s,a)=>{e.controller.control&&!e.controller.control.destroyed&&e.controller.setTransition(s,a)}),Object.assign(e.controller,{setTranslate:function(t,s){const i=e.controller.control;let r,n;const l=e.constructor;function o(t){if(t.destroyed)return;const s=e.rtlTranslate?-e.translate:e.translate;"slide"===e.params.controller.by&&(!function(t){e.controller.spline=e.params.loop?new a(e.slidesGrid,t.slidesGrid):new a(e.snapGrid,t.snapGrid)}(t),n=-e.controller.spline.interpolate(-s)),n&&"container"!==e.params.controller.by||(r=(t.maxTranslate()-t.minTranslate())/(e.maxTranslate()-e.minTranslate()),!Number.isNaN(r)&&Number.isFinite(r)||(r=1),n=(s-e.minTranslate())*r+t.minTranslate()),e.params.controller.inverse&&(n=t.maxTranslate()-n),t.updateProgress(n),t.setTranslate(n,e),t.updateActiveIndex(),t.updateSlidesClasses()}if(Array.isArray(i))for(let e=0;e<i.length;e+=1)i[e]!==s&&i[e]instanceof l&&o(i[e]);else i instanceof l&&s!==i&&o(i)},setTransition:function(t,s){const a=e.constructor,i=e.controller.control;let r;function n(s){s.destroyed||(s.setTransition(t,e),0!==t&&(s.transitionStart(),s.params.autoHeight&&l(()=>{s.updateAutoHeight()}),S(s.wrapperEl,()=>{i&&s.transitionEnd()})))}if(Array.isArray(i))for(r=0;r<i.length;r+=1)i[r]!==s&&i[r]instanceof a&&n(i[r]);else i instanceof a&&s!==i&&n(i)}})},function({swiper:e,extendParams:t,on:s}){t({a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",slideLabelMessage:"{{index}} / {{slidesLength}}",containerMessage:null,containerRoleDescriptionMessage:null,containerRole:null,itemRoleDescriptionMessage:null,slideRole:"group",id:null,scrollOnFocus:!0,wrapperLiveRegion:!0}}),e.a11y={clicked:!1};let i,r,n=null,l=(new Date).getTime();function o(e){const t=n;0!==t.length&&P(t,e)}function d(e){(e=M(e)).forEach(e=>{e.setAttribute("tabIndex","0")})}function c(e){(e=M(e)).forEach(e=>{e.setAttribute("tabIndex","-1")})}function p(e,t){(e=M(e)).forEach(e=>{e.setAttribute("role",t)})}function u(e,t){(e=M(e)).forEach(e=>{e.setAttribute("aria-roledescription",t)})}function m(e,t){(e=M(e)).forEach(e=>{e.setAttribute("aria-label",t)})}function h(e){(e=M(e)).forEach(e=>{e.setAttribute("aria-disabled",!0)})}function f(e){(e=M(e)).forEach(e=>{e.setAttribute("aria-disabled",!1)})}function g(t){if(13!==t.keyCode&&32!==t.keyCode)return;const s=e.params.a11y,a=t.target;if(!e.pagination||!e.pagination.el||a!==e.pagination.el&&!e.pagination.el.contains(t.target)||t.target.matches(oe(e.params.pagination.bulletClass))){if(e.navigation&&e.navigation.prevEl&&e.navigation.nextEl){const t=M(e.navigation.prevEl);M(e.navigation.nextEl).includes(a)&&(e.isEnd&&!e.params.loop||e.slideNext(),e.isEnd?o(s.lastSlideMessage):o(s.nextSlideMessage)),t.includes(a)&&(e.isBeginning&&!e.params.loop||e.slidePrev(),e.isBeginning?o(s.firstSlideMessage):o(s.prevSlideMessage))}e.pagination&&a.matches(oe(e.params.pagination.bulletClass))&&a.click()}}function v(){return e.pagination&&e.pagination.bullets&&e.pagination.bullets.length}function b(){return v()&&e.params.pagination.clickable}const y=(e,t,s)=>{d(e),"BUTTON"!==e.tagName&&(p(e,"button"),e.addEventListener("keydown",g)),m(e,s),function(e,t){(e=M(e)).forEach(e=>{e.setAttribute("aria-controls",t)})}(e,t)},x=t=>{r&&r!==t.target&&!r.contains(t.target)&&(i=!0),e.a11y.clicked=!0},S=()=>{i=!1,requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.destroyed||(e.a11y.clicked=!1)})})},T=e=>{l=(new Date).getTime()},C=t=>{if(e.a11y.clicked||!e.params.a11y.scrollOnFocus)return;if((new Date).getTime()-l<100)return;const s=t.target.closest(`.${e.params.slideClass}, swiper-slide`);if(!s||!e.slides.includes(s))return;r=s;const a=e.slides.indexOf(s)===e.activeIndex,n=e.params.watchSlidesProgress&&e.visibleSlides&&e.visibleSlides.includes(s);a||n||t.sourceCapabilities&&t.sourceCapabilities.firesTouchEvents||(e.isHorizontal()?e.el.scrollLeft=0:e.el.scrollTop=0,requestAnimationFrame(()=>{i||(e.params.loop?e.slideToLoop(e.getSlideIndexWhenGrid(parseInt(s.getAttribute("data-swiper-slide-index"))),0):e.slideTo(e.getSlideIndexWhenGrid(e.slides.indexOf(s)),0),i=!1)}))},L=()=>{const t=e.params.a11y;t.itemRoleDescriptionMessage&&u(e.slides,t.itemRoleDescriptionMessage),t.slideRole&&p(e.slides,t.slideRole);const s=e.slides.length;t.slideLabelMessage&&e.slides.forEach((a,i)=>{const r=e.params.loop?parseInt(a.getAttribute("data-swiper-slide-index"),10):i;m(a,t.slideLabelMessage.replace(/\{\{index\}\}/,r+1).replace(/\{\{slidesLength\}\}/,s))})},z=()=>{const t=e.params.a11y;e.el.append(n);const s=e.el;t.containerRoleDescriptionMessage&&u(s,t.containerRoleDescriptionMessage),t.containerMessage&&m(s,t.containerMessage),t.containerRole&&p(s,t.containerRole);const i=e.wrapperEl,r=t.id||i.getAttribute("id")||`swiper-wrapper-${function(e=16){return"x".repeat(e).replace(/x/g,()=>Math.round(16*Math.random()).toString(16))}(16)}`;var l;if(l=r,M(i).forEach(e=>{e.setAttribute("id",l)}),t.wrapperLiveRegion){!function(e,t){(e=M(e)).forEach(e=>{e.setAttribute("aria-live",t)})}(i,e.params.autoplay&&e.params.autoplay.enabled?"off":"polite")}L();let{nextEl:o,prevEl:d}=e.navigation?e.navigation:{};if(o=M(o),d=M(d),o&&o.forEach(e=>y(e,r,t.nextSlideMessage)),d&&d.forEach(e=>y(e,r,t.prevSlideMessage)),b()){M(e.pagination.el).forEach(e=>{e.addEventListener("keydown",g)})}a().addEventListener("visibilitychange",T),e.el.addEventListener("focus",C,!0),e.el.addEventListener("focus",C,!0),e.el.addEventListener("pointerdown",x,!0),e.el.addEventListener("pointerup",S,!0)};s("beforeInit",()=>{n=w("span",e.params.a11y.notificationClass),n.setAttribute("aria-live","assertive"),n.setAttribute("aria-atomic","true")}),s("afterInit",()=>{e.params.a11y.enabled&&z()}),s("slidesLengthChange snapGridLengthChange slidesGridLengthChange",()=>{e.params.a11y.enabled&&L()}),s("fromEdge toEdge afterInit lock unlock",()=>{e.params.a11y.enabled&&function(){if(e.params.loop||e.params.rewind||!e.navigation)return;const{nextEl:t,prevEl:s}=e.navigation;s&&(e.isBeginning?(h(s),c(s)):(f(s),d(s))),t&&(e.isEnd?(h(t),c(t)):(f(t),d(t)))}()}),s("paginationUpdate",()=>{e.params.a11y.enabled&&function(){const t=e.params.a11y;v()&&e.pagination.bullets.forEach(s=>{e.params.pagination.clickable&&(d(s),e.params.pagination.renderBullet||(p(s,"button"),m(s,t.paginationBulletMessage.replace(/\{\{index\}\}/,E(s)+1)))),s.matches(oe(e.params.pagination.bulletActiveClass))?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current")})}()}),s("destroy",()=>{e.params.a11y.enabled&&function(){n&&n.remove();let{nextEl:t,prevEl:s}=e.navigation?e.navigation:{};t=M(t),s=M(s),t&&t.forEach(e=>e.removeEventListener("keydown",g)),s&&s.forEach(e=>e.removeEventListener("keydown",g)),b()&&M(e.pagination.el).forEach(e=>{e.removeEventListener("keydown",g)});a().removeEventListener("visibilitychange",T),e.el&&"string"!=typeof e.el&&(e.el.removeEventListener("focus",C,!0),e.el.removeEventListener("pointerdown",x,!0),e.el.removeEventListener("pointerup",S,!0))}()})},function({swiper:e,extendParams:t,on:s}){t({history:{enabled:!1,root:"",replaceState:!1,key:"slides",keepQuery:!1}});let a=!1,i={};const n=e=>e.toString().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,""),l=e=>{const t=r();let s;s=e?new URL(e):t.location;const a=s.pathname.slice(1).split("/").filter(e=>""!==e),i=a.length;return{key:a[i-2],value:a[i-1]}},o=(t,s)=>{const i=r();if(!a||!e.params.history.enabled)return;let l;l=e.params.url?new URL(e.params.url):i.location;const o=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${s}"]`):e.slides[s];let d=n(o.getAttribute("data-history"));if(e.params.history.root.length>0){let s=e.params.history.root;"/"===s[s.length-1]&&(s=s.slice(0,s.length-1)),d=`${s}/${t?`${t}/`:""}${d}`}else l.pathname.includes(t)||(d=`${t?`${t}/`:""}${d}`);e.params.history.keepQuery&&(d+=l.search);const c=i.history.state;c&&c.value===d||(e.params.history.replaceState?i.history.replaceState({value:d},null,d):i.history.pushState({value:d},null,d))},d=(t,s,a)=>{if(s)for(let i=0,r=e.slides.length;i<r;i+=1){const r=e.slides[i];if(n(r.getAttribute("data-history"))===s){const s=e.getSlideIndex(r);e.slideTo(s,t,a)}}else e.slideTo(0,t,a)},c=()=>{i=l(e.params.url),d(e.params.speed,i.value,!1)};s("init",()=>{e.params.history.enabled&&(()=>{const t=r();if(e.params.history){if(!t.history||!t.history.pushState)return e.params.history.enabled=!1,void(e.params.hashNavigation.enabled=!0);a=!0,i=l(e.params.url),i.key||i.value?(d(0,i.value,e.params.runCallbacksOnInit),e.params.history.replaceState||t.addEventListener("popstate",c)):e.params.history.replaceState||t.addEventListener("popstate",c)}})()}),s("destroy",()=>{e.params.history.enabled&&(()=>{const t=r();e.params.history.replaceState||t.removeEventListener("popstate",c)})()}),s("transitionEnd _freeModeNoMomentumRelease",()=>{a&&o(e.params.history.key,e.activeIndex)}),s("slideChange",()=>{a&&e.params.cssMode&&o(e.params.history.key,e.activeIndex)})},function({swiper:e,extendParams:t,emit:s,on:i}){let n=!1;const l=a(),o=r();t({hashNavigation:{enabled:!1,replaceState:!1,watchState:!1,getSlideIndex(t,s){if(e.virtual&&e.params.virtual.enabled){const t=e.slides.find(e=>e.getAttribute("data-hash")===s);if(!t)return 0;return parseInt(t.getAttribute("data-swiper-slide-index"),10)}return e.getSlideIndex(g(e.slidesEl,`.${e.params.slideClass}[data-hash="${s}"], swiper-slide[data-hash="${s}"]`)[0])}}});const d=()=>{s("hashChange");const t=l.location.hash.replace("#",""),a=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${e.activeIndex}"]`):e.slides[e.activeIndex];if(t!==(a?a.getAttribute("data-hash"):"")){const s=e.params.hashNavigation.getSlideIndex(e,t);if(void 0===s||Number.isNaN(s))return;e.slideTo(s)}},c=()=>{if(!n||!e.params.hashNavigation.enabled)return;const t=e.virtual&&e.params.virtual.enabled?e.slidesEl.querySelector(`[data-swiper-slide-index="${e.activeIndex}"]`):e.slides[e.activeIndex],a=t?t.getAttribute("data-hash")||t.getAttribute("data-history"):"";e.params.hashNavigation.replaceState&&o.history&&o.history.replaceState?(o.history.replaceState(null,null,`#${a}`||""),s("hashSet")):(l.location.hash=a||"",s("hashSet"))};i("init",()=>{e.params.hashNavigation.enabled&&(()=>{if(!e.params.hashNavigation.enabled||e.params.history&&e.params.history.enabled)return;n=!0;const t=l.location.hash.replace("#","");if(t){const s=0,a=e.params.hashNavigation.getSlideIndex(e,t);e.slideTo(a||0,s,e.params.runCallbacksOnInit,!0)}e.params.hashNavigation.watchState&&o.addEventListener("hashchange",d)})()}),i("destroy",()=>{e.params.hashNavigation.enabled&&e.params.hashNavigation.watchState&&o.removeEventListener("hashchange",d)}),i("transitionEnd _freeModeNoMomentumRelease",()=>{n&&c()}),i("slideChange",()=>{n&&e.params.cssMode&&c()})},function({swiper:e,extendParams:t,on:s,emit:i,params:r}){let n,l;e.autoplay={running:!1,paused:!1,timeLeft:0},t({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let o,d,c,p,u,m,h,f,g=r&&r.autoplay?r.autoplay.delay:3e3,v=r&&r.autoplay?r.autoplay.delay:3e3,w=(new Date).getTime();function b(t){e&&!e.destroyed&&e.wrapperEl&&t.target===e.wrapperEl&&(e.wrapperEl.removeEventListener("transitionend",b),f||t.detail&&t.detail.bySwiperTouchMove||M())}const y=()=>{if(e.destroyed||!e.autoplay.running)return;e.autoplay.paused?d=!0:d&&(v=o,d=!1);const t=e.autoplay.paused?o:w+v-(new Date).getTime();e.autoplay.timeLeft=t,i("autoplayTimeLeft",t,t/g),l=requestAnimationFrame(()=>{y()})},E=t=>{if(e.destroyed||!e.autoplay.running)return;cancelAnimationFrame(l),y();let s=void 0===t?e.params.autoplay.delay:t;g=e.params.autoplay.delay,v=e.params.autoplay.delay;const a=(()=>{let t;if(t=e.virtual&&e.params.virtual.enabled?e.slides.find(e=>e.classList.contains("swiper-slide-active")):e.slides[e.activeIndex],!t)return;return parseInt(t.getAttribute("data-swiper-autoplay"),10)})();!Number.isNaN(a)&&a>0&&void 0===t&&(s=a,g=a,v=a),o=s;const r=e.params.speed,d=()=>{e&&!e.destroyed&&(e.params.autoplay.reverseDirection?!e.isBeginning||e.params.loop||e.params.rewind?(e.slidePrev(r,!0,!0),i("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(e.slides.length-1,r,!0,!0),i("autoplay")):!e.isEnd||e.params.loop||e.params.rewind?(e.slideNext(r,!0,!0),i("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(0,r,!0,!0),i("autoplay")),e.params.cssMode&&(w=(new Date).getTime(),requestAnimationFrame(()=>{E()})))};return s>0?(clearTimeout(n),n=setTimeout(()=>{d()},s)):requestAnimationFrame(()=>{d()}),s},x=()=>{w=(new Date).getTime(),e.autoplay.running=!0,E(),i("autoplayStart")},S=()=>{e.autoplay.running=!1,clearTimeout(n),cancelAnimationFrame(l),i("autoplayStop")},T=(t,s)=>{if(e.destroyed||!e.autoplay.running)return;clearTimeout(n),t||(h=!0);const a=()=>{i("autoplayPause"),e.params.autoplay.waitForTransition?e.wrapperEl.addEventListener("transitionend",b):M()};if(e.autoplay.paused=!0,s)return m&&(o=e.params.autoplay.delay),m=!1,void a();const r=o||e.params.autoplay.delay;o=r-((new Date).getTime()-w),e.isEnd&&o<0&&!e.params.loop||(o<0&&(o=0),a())},M=()=>{e.isEnd&&o<0&&!e.params.loop||e.destroyed||!e.autoplay.running||(w=(new Date).getTime(),h?(h=!1,E(o)):E(),e.autoplay.paused=!1,i("autoplayResume"))},C=()=>{if(e.destroyed||!e.autoplay.running)return;const t=a();"hidden"===t.visibilityState&&(h=!0,T(!0)),"visible"===t.visibilityState&&M()},P=t=>{"mouse"===t.pointerType&&(h=!0,f=!0,e.animating||e.autoplay.paused||T(!0))},L=t=>{"mouse"===t.pointerType&&(f=!1,e.autoplay.paused&&M())};s("init",()=>{e.params.autoplay.enabled&&(e.params.autoplay.pauseOnMouseEnter&&(e.el.addEventListener("pointerenter",P),e.el.addEventListener("pointerleave",L)),a().addEventListener("visibilitychange",C),x())}),s("destroy",()=>{e.el&&"string"!=typeof e.el&&(e.el.removeEventListener("pointerenter",P),e.el.removeEventListener("pointerleave",L)),a().removeEventListener("visibilitychange",C),e.autoplay.running&&S()}),s("_freeModeStaticRelease",()=>{(p||h)&&M()}),s("_freeModeNoMomentumRelease",()=>{e.params.autoplay.disableOnInteraction?S():T(!0,!0)}),s("beforeTransitionStart",(t,s,a)=>{!e.destroyed&&e.autoplay.running&&(a||!e.params.autoplay.disableOnInteraction?T(!0,!0):S())}),s("sliderFirstMove",()=>{!e.destroyed&&e.autoplay.running&&(e.params.autoplay.disableOnInteraction?S():(c=!0,p=!1,h=!1,u=setTimeout(()=>{h=!0,p=!0,T(!0)},200)))}),s("touchEnd",()=>{if(!e.destroyed&&e.autoplay.running&&c){if(clearTimeout(u),clearTimeout(n),e.params.autoplay.disableOnInteraction)return p=!1,void(c=!1);p&&e.params.cssMode&&M(),p=!1,c=!1}}),s("slideChange",()=>{!e.destroyed&&e.autoplay.running&&(m=!0)}),Object.assign(e.autoplay,{start:x,stop:S,pause:T,resume:M})},function({swiper:e,extendParams:t,on:s}){t({thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-thumbs"}});let i=!1,r=!1;function n(){const t=e.thumbs.swiper;if(!t||t.destroyed)return;const s=t.clickedIndex,a=t.clickedSlide;if(a&&a.classList.contains(e.params.thumbs.slideThumbActiveClass))return;if(null==s)return;let i;i=t.params.loop?parseInt(t.clickedSlide.getAttribute("data-swiper-slide-index"),10):s,e.params.loop?e.slideToLoop(i):e.slideTo(i)}function l(){const{thumbs:t}=e.params;if(i)return!1;i=!0;const s=e.constructor;if(t.swiper instanceof s){if(t.swiper.destroyed)return i=!1,!1;e.thumbs.swiper=t.swiper,Object.assign(e.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),Object.assign(e.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper.update()}else if(c(t.swiper)){const a=Object.assign({},t.swiper);Object.assign(a,{watchSlidesProgress:!0,slideToClickedSlide:!1}),e.thumbs.swiper=new s(a),r=!0}return e.thumbs.swiper.el.classList.add(e.params.thumbs.thumbsContainerClass),e.thumbs.swiper.on("tap",n),!0}function o(t){const s=e.thumbs.swiper;if(!s||s.destroyed)return;const a="auto"===s.params.slidesPerView?s.slidesPerViewDynamic():s.params.slidesPerView;let i=1;const r=e.params.thumbs.slideThumbActiveClass;if(e.params.slidesPerView>1&&!e.params.centeredSlides&&(i=e.params.slidesPerView),e.params.thumbs.multipleActiveThumbs||(i=1),i=Math.floor(i),s.slides.forEach(e=>e.classList.remove(r)),s.params.loop||s.params.virtual&&s.params.virtual.enabled)for(let t=0;t<i;t+=1)g(s.slidesEl,`[data-swiper-slide-index="${e.realIndex+t}"]`).forEach(e=>{e.classList.add(r)});else for(let t=0;t<i;t+=1)s.slides[e.realIndex+t]&&s.slides[e.realIndex+t].classList.add(r);const n=e.params.thumbs.autoScrollOffset,l=n&&!s.params.loop;if(e.realIndex!==s.realIndex||l){const i=s.activeIndex;let r,o;if(s.params.loop){const t=s.slides.find(t=>t.getAttribute("data-swiper-slide-index")===`${e.realIndex}`);r=s.slides.indexOf(t),o=e.activeIndex>e.previousIndex?"next":"prev"}else r=e.realIndex,o=r>e.previousIndex?"next":"prev";l&&(r+="next"===o?n:-1*n),s.visibleSlidesIndexes&&s.visibleSlidesIndexes.indexOf(r)<0&&(s.params.centeredSlides?r=r>i?r-Math.floor(a/2)+1:r+Math.floor(a/2)-1:r>i&&s.params.slidesPerGroup,s.slideTo(r,t?0:void 0))}}e.thumbs={swiper:null},s("beforeInit",()=>{const{thumbs:t}=e.params;if(t&&t.swiper)if("string"==typeof t.swiper||t.swiper instanceof HTMLElement){const s=a(),i=()=>{const a="string"==typeof t.swiper?s.querySelector(t.swiper):t.swiper;if(a&&a.swiper)t.swiper=a.swiper,l(),o(!0);else if(a){const s=`${e.params.eventsPrefix}init`,i=r=>{t.swiper=r.detail[0],a.removeEventListener(s,i),l(),o(!0),t.swiper.update(),e.update()};a.addEventListener(s,i)}return a},r=()=>{if(e.destroyed)return;i()||requestAnimationFrame(r)};requestAnimationFrame(r)}else l(),o(!0)}),s("slideChange update resize observerUpdate",()=>{o()}),s("setTransition",(t,s)=>{const a=e.thumbs.swiper;a&&!a.destroyed&&a.setTransition(s)}),s("beforeDestroy",()=>{const t=e.thumbs.swiper;t&&!t.destroyed&&r&&t.destroy()}),Object.assign(e.thumbs,{init:l,update:o})},function({swiper:e,extendParams:t,emit:s,once:a}){t({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}}),Object.assign(e,{freeMode:{onTouchStart:function(){if(e.params.cssMode)return;const t=e.getTranslate();e.setTranslate(t),e.setTransition(0),e.touchEventsData.velocities.length=0,e.freeMode.onTouchEnd({currentPos:e.rtl?e.translate:-e.translate})},onTouchMove:function(){if(e.params.cssMode)return;const{touchEventsData:t,touches:s}=e;0===t.velocities.length&&t.velocities.push({position:s[e.isHorizontal()?"startX":"startY"],time:t.touchStartTime}),t.velocities.push({position:s[e.isHorizontal()?"currentX":"currentY"],time:o()})},onTouchEnd:function({currentPos:t}){if(e.params.cssMode)return;const{params:i,wrapperEl:r,rtlTranslate:n,snapGrid:l,touchEventsData:d}=e,c=o()-d.touchStartTime;if(t<-e.minTranslate())e.slideTo(e.activeIndex);else if(t>-e.maxTranslate())e.slides.length<l.length?e.slideTo(l.length-1):e.slideTo(e.slides.length-1);else{if(i.freeMode.momentum){if(d.velocities.length>1){const t=d.velocities.pop(),s=d.velocities.pop(),a=t.position-s.position,r=t.time-s.time;e.velocity=a/r,e.velocity/=2,Math.abs(e.velocity)<i.freeMode.minimumVelocity&&(e.velocity=0),(r>150||o()-t.time>300)&&(e.velocity=0)}else e.velocity=0;e.velocity*=i.freeMode.momentumVelocityRatio,d.velocities.length=0;let t=1e3*i.freeMode.momentumRatio;const c=e.velocity*t;let p=e.translate+c;n&&(p=-p);let u,m=!1;const h=20*Math.abs(e.velocity)*i.freeMode.momentumBounceRatio;let f;if(p<e.maxTranslate())i.freeMode.momentumBounce?(p+e.maxTranslate()<-h&&(p=e.maxTranslate()-h),u=e.maxTranslate(),m=!0,d.allowMomentumBounce=!0):p=e.maxTranslate(),i.loop&&i.centeredSlides&&(f=!0);else if(p>e.minTranslate())i.freeMode.momentumBounce?(p-e.minTranslate()>h&&(p=e.minTranslate()+h),u=e.minTranslate(),m=!0,d.allowMomentumBounce=!0):p=e.minTranslate(),i.loop&&i.centeredSlides&&(f=!0);else if(i.freeMode.sticky){let t;for(let e=0;e<l.length;e+=1)if(l[e]>-p){t=e;break}p=Math.abs(l[t]-p)<Math.abs(l[t-1]-p)||"next"===e.swipeDirection?l[t]:l[t-1],p=-p}if(f&&a("transitionEnd",()=>{e.loopFix()}),0!==e.velocity){if(t=n?Math.abs((-p-e.translate)/e.velocity):Math.abs((p-e.translate)/e.velocity),i.freeMode.sticky){const s=Math.abs((n?-p:p)-e.translate),a=e.slidesSizesGrid[e.activeIndex];t=s<a?i.speed:s<2*a?1.5*i.speed:2.5*i.speed}}else if(i.freeMode.sticky)return void e.slideToClosest();i.freeMode.momentumBounce&&m?(e.updateProgress(u),e.setTransition(t),e.setTranslate(p),e.transitionStart(!0,e.swipeDirection),e.animating=!0,S(r,()=>{e&&!e.destroyed&&d.allowMomentumBounce&&(s("momentumBounce"),e.setTransition(i.speed),setTimeout(()=>{e.setTranslate(u),S(r,()=>{e&&!e.destroyed&&e.transitionEnd()})},0))})):e.velocity?(s("_freeModeNoMomentumRelease"),e.updateProgress(p),e.setTransition(t),e.setTranslate(p),e.transitionStart(!0,e.swipeDirection),e.animating||(e.animating=!0,S(r,()=>{e&&!e.destroyed&&e.transitionEnd()}))):e.updateProgress(p),e.updateActiveIndex(),e.updateSlidesClasses()}else{if(i.freeMode.sticky)return void e.slideToClosest();i.freeMode&&s("_freeModeNoMomentumRelease")}(!i.freeMode.momentum||c>=i.longSwipesMs)&&(s("_freeModeStaticRelease"),e.updateProgress(),e.updateActiveIndex(),e.updateSlidesClasses())}}}})},function({swiper:e,extendParams:t,on:s}){let a,i,r,n;t({grid:{rows:1,fill:"column"}});const l=()=>{let t=e.params.spaceBetween;return"string"==typeof t&&t.indexOf("%")>=0?t=parseFloat(t.replace("%",""))/100*e.size:"string"==typeof t&&(t=parseFloat(t)),t};s("init",()=>{n=e.params.grid&&e.params.grid.rows>1}),s("update",()=>{const{params:t,el:s}=e,a=t.grid&&t.grid.rows>1;n&&!a?(s.classList.remove(`${t.containerModifierClass}grid`,`${t.containerModifierClass}grid-column`),r=1,e.emitContainerClasses()):!n&&a&&(s.classList.add(`${t.containerModifierClass}grid`),"column"===t.grid.fill&&s.classList.add(`${t.containerModifierClass}grid-column`),e.emitContainerClasses()),n=a}),e.grid={initSlides:t=>{const{slidesPerView:s}=e.params,{rows:n,fill:l}=e.params.grid,o=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:t.length;r=Math.floor(o/n),a=Math.floor(o/n)===o/n?o:Math.ceil(o/n)*n,"auto"!==s&&"row"===l&&(a=Math.max(a,s*n)),i=a/n},unsetSlides:()=>{e.slides&&e.slides.forEach(t=>{t.swiperSlideGridSet&&(t.style.height="",t.style[e.getDirectionLabel("margin-top")]="")})},updateSlide:(t,s,n)=>{const{slidesPerGroup:o}=e.params,d=l(),{rows:c,fill:p}=e.params.grid,u=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:n.length;let m,h,f;if("row"===p&&o>1){const e=Math.floor(t/(o*c)),i=t-c*o*e,r=0===e?o:Math.min(Math.ceil((u-e*c*o)/c),o);f=Math.floor(i/r),h=i-f*r+e*o,m=h+f*a/c,s.style.order=m}else"column"===p?(h=Math.floor(t/c),f=t-h*c,(h>r||h===r&&f===c-1)&&(f+=1,f>=c&&(f=0,h+=1))):(f=Math.floor(t/i),h=t-f*i);s.row=f,s.column=h,s.style.height=`calc((100% - ${(c-1)*d}px) / ${c})`,s.style[e.getDirectionLabel("margin-top")]=0!==f?d&&`${d}px`:"",s.swiperSlideGridSet=!0},updateWrapperSize:(t,s)=>{const{centeredSlides:i,roundLengths:r}=e.params,n=l(),{rows:o}=e.params.grid;if(e.virtualSize=(t+n)*a,e.virtualSize=Math.ceil(e.virtualSize/o)-n,e.params.cssMode||(e.wrapperEl.style[e.getDirectionLabel("width")]=`${e.virtualSize+n}px`),i){const t=[];for(let a=0;a<s.length;a+=1){let i=s[a];r&&(i=Math.floor(i)),s[a]<e.virtualSize+s[0]&&t.push(i)}s.splice(0,s.length),s.push(...t)}}}},function({swiper:e}){Object.assign(e,{appendSlide:de.bind(e),prependSlide:ce.bind(e),addSlide:pe.bind(e),removeSlide:ue.bind(e),removeAllSlides:me.bind(e)})},function({swiper:e,extendParams:t,on:s}){t({fadeEffect:{crossFade:!1}}),he({effect:"fade",swiper:e,on:s,setTranslate:()=>{const{slides:t}=e;e.params.fadeEffect;for(let s=0;s<t.length;s+=1){const t=e.slides[s];let a=-t.swiperSlideOffset;e.params.virtualTranslate||(a-=e.translate);let i=0;e.isHorizontal()||(i=a,a=0);const r=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(t.progress),0):1+Math.min(Math.max(t.progress,-1),0),n=fe(0,t);n.style.opacity=r,n.style.transform=`translate3d(${a}px, ${i}px, 0px)`}},setTransition:t=>{const s=e.slides.map(e=>f(e));s.forEach(e=>{e.style.transitionDuration=`${t}ms`}),ge({swiper:e,duration:t,transformElements:s,allSlides:!0})},overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})},function({swiper:e,extendParams:t,on:s}){t({cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}});const a=(e,t,s)=>{let a=s?e.querySelector(".swiper-slide-shadow-left"):e.querySelector(".swiper-slide-shadow-top"),i=s?e.querySelector(".swiper-slide-shadow-right"):e.querySelector(".swiper-slide-shadow-bottom");a||(a=w("div",("swiper-slide-shadow-cube swiper-slide-shadow-"+(s?"left":"top")).split(" ")),e.append(a)),i||(i=w("div",("swiper-slide-shadow-cube swiper-slide-shadow-"+(s?"right":"bottom")).split(" ")),e.append(i)),a&&(a.style.opacity=Math.max(-t,0)),i&&(i.style.opacity=Math.max(t,0))};he({effect:"cube",swiper:e,on:s,setTranslate:()=>{const{el:t,wrapperEl:s,slides:i,width:r,height:n,rtlTranslate:l,size:o,browser:d}=e,c=C(e),p=e.params.cubeEffect,u=e.isHorizontal(),m=e.virtual&&e.params.virtual.enabled;let h,f=0;p.shadow&&(u?(h=e.wrapperEl.querySelector(".swiper-cube-shadow"),h||(h=w("div","swiper-cube-shadow"),e.wrapperEl.append(h)),h.style.height=`${r}px`):(h=t.querySelector(".swiper-cube-shadow"),h||(h=w("div","swiper-cube-shadow"),t.append(h))));for(let e=0;e<i.length;e+=1){const t=i[e];let s=e;m&&(s=parseInt(t.getAttribute("data-swiper-slide-index"),10));let r=90*s,n=Math.floor(r/360);l&&(r=-r,n=Math.floor(-r/360));const d=Math.max(Math.min(t.progress,1),-1);let h=0,g=0,v=0;s%4==0?(h=4*-n*o,v=0):(s-1)%4==0?(h=0,v=4*-n*o):(s-2)%4==0?(h=o+4*n*o,v=o):(s-3)%4==0&&(h=-o,v=3*o+4*o*n),l&&(h=-h),u||(g=h,h=0);const w=`rotateX(${c(u?0:-r)}deg) rotateY(${c(u?r:0)}deg) translate3d(${h}px, ${g}px, ${v}px)`;d<=1&&d>-1&&(f=90*s+90*d,l&&(f=90*-s-90*d)),t.style.transform=w,p.slideShadows&&a(t,d,u)}if(s.style.transformOrigin=`50% 50% -${o/2}px`,s.style["-webkit-transform-origin"]=`50% 50% -${o/2}px`,p.shadow)if(u)h.style.transform=`translate3d(0px, ${r/2+p.shadowOffset}px, ${-r/2}px) rotateX(89.99deg) rotateZ(0deg) scale(${p.shadowScale})`;else{const e=Math.abs(f)-90*Math.floor(Math.abs(f)/90),t=1.5-(Math.sin(2*e*Math.PI/360)/2+Math.cos(2*e*Math.PI/360)/2),s=p.shadowScale,a=p.shadowScale/t,i=p.shadowOffset;h.style.transform=`scale3d(${s}, 1, ${a}) translate3d(0px, ${n/2+i}px, ${-n/2/a}px) rotateX(-89.99deg)`}const g=(d.isSafari||d.isWebView)&&d.needPerspectiveFix?-o/2:0;s.style.transform=`translate3d(0px,0,${g}px) rotateX(${c(e.isHorizontal()?0:f)}deg) rotateY(${c(e.isHorizontal()?-f:0)}deg)`,s.style.setProperty("--swiper-cube-translate-z",`${g}px`)},setTransition:t=>{const{el:s,slides:a}=e;if(a.forEach(e=>{e.style.transitionDuration=`${t}ms`,e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(e=>{e.style.transitionDuration=`${t}ms`})}),e.params.cubeEffect.shadow&&!e.isHorizontal()){const e=s.querySelector(".swiper-cube-shadow");e&&(e.style.transitionDuration=`${t}ms`)}},recreateShadows:()=>{const t=e.isHorizontal();e.slides.forEach(e=>{const s=Math.max(Math.min(e.progress,1),-1);a(e,s,t)})},getEffectParams:()=>e.params.cubeEffect,perspective:()=>!0,overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0})})},function({swiper:e,extendParams:t,on:s}){t({flipEffect:{slideShadows:!0,limitRotation:!0}});const a=(t,s)=>{let a=e.isHorizontal()?t.querySelector(".swiper-slide-shadow-left"):t.querySelector(".swiper-slide-shadow-top"),i=e.isHorizontal()?t.querySelector(".swiper-slide-shadow-right"):t.querySelector(".swiper-slide-shadow-bottom");a||(a=ve("flip",t,e.isHorizontal()?"left":"top")),i||(i=ve("flip",t,e.isHorizontal()?"right":"bottom")),a&&(a.style.opacity=Math.max(-s,0)),i&&(i.style.opacity=Math.max(s,0))};he({effect:"flip",swiper:e,on:s,setTranslate:()=>{const{slides:t,rtlTranslate:s}=e,i=e.params.flipEffect,r=C(e);for(let n=0;n<t.length;n+=1){const l=t[n];let o=l.progress;e.params.flipEffect.limitRotation&&(o=Math.max(Math.min(l.progress,1),-1));const d=l.swiperSlideOffset;let c=-180*o,p=0,u=e.params.cssMode?-d-e.translate:-d,m=0;e.isHorizontal()?s&&(c=-c):(m=u,u=0,p=-c,c=0),l.style.zIndex=-Math.abs(Math.round(o))+t.length,i.slideShadows&&a(l,o);const h=`translate3d(${u}px, ${m}px, 0px) rotateX(${r(p)}deg) rotateY(${r(c)}deg)`;fe(0,l).style.transform=h}},setTransition:t=>{const s=e.slides.map(e=>f(e));s.forEach(e=>{e.style.transitionDuration=`${t}ms`,e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(e=>{e.style.transitionDuration=`${t}ms`})}),ge({swiper:e,duration:t,transformElements:s})},recreateShadows:()=>{e.params.flipEffect,e.slides.forEach(t=>{let s=t.progress;e.params.flipEffect.limitRotation&&(s=Math.max(Math.min(t.progress,1),-1)),a(t,s)})},getEffectParams:()=>e.params.flipEffect,perspective:()=>!0,overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})},function({swiper:e,extendParams:t,on:s}){t({coverflowEffect:{rotate:50,stretch:0,depth:100,scale:1,modifier:1,slideShadows:!0}}),he({effect:"coverflow",swiper:e,on:s,setTranslate:()=>{const{width:t,height:s,slides:a,slidesSizesGrid:i}=e,r=e.params.coverflowEffect,n=e.isHorizontal(),l=e.translate,o=n?t/2-l:s/2-l,d=n?r.rotate:-r.rotate,c=r.depth,p=C(e);for(let e=0,t=a.length;e<t;e+=1){const t=a[e],s=i[e],l=(o-t.swiperSlideOffset-s/2)/s,u="function"==typeof r.modifier?r.modifier(l):l*r.modifier;let m=n?d*u:0,h=n?0:d*u,f=-c*Math.abs(u),g=r.stretch;"string"==typeof g&&-1!==g.indexOf("%")&&(g=parseFloat(r.stretch)/100*s);let v=n?0:g*u,w=n?g*u:0,b=1-(1-r.scale)*Math.abs(u);Math.abs(w)<.001&&(w=0),Math.abs(v)<.001&&(v=0),Math.abs(f)<.001&&(f=0),Math.abs(m)<.001&&(m=0),Math.abs(h)<.001&&(h=0),Math.abs(b)<.001&&(b=0);const y=`translate3d(${w}px,${v}px,${f}px)  rotateX(${p(h)}deg) rotateY(${p(m)}deg) scale(${b})`;if(fe(0,t).style.transform=y,t.style.zIndex=1-Math.abs(Math.round(u)),r.slideShadows){let e=n?t.querySelector(".swiper-slide-shadow-left"):t.querySelector(".swiper-slide-shadow-top"),s=n?t.querySelector(".swiper-slide-shadow-right"):t.querySelector(".swiper-slide-shadow-bottom");e||(e=ve("coverflow",t,n?"left":"top")),s||(s=ve("coverflow",t,n?"right":"bottom")),e&&(e.style.opacity=u>0?u:0),s&&(s.style.opacity=-u>0?-u:0)}}},setTransition:t=>{e.slides.map(e=>f(e)).forEach(e=>{e.style.transitionDuration=`${t}ms`,e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(e=>{e.style.transitionDuration=`${t}ms`})})},perspective:()=>!0,overwriteParams:()=>({watchSlidesProgress:!0})})},function({swiper:e,extendParams:t,on:s}){t({creativeEffect:{limitProgress:1,shadowPerProgress:!1,progressMultiplier:1,perspective:!0,prev:{translate:[0,0,0],rotate:[0,0,0],opacity:1,scale:1},next:{translate:[0,0,0],rotate:[0,0,0],opacity:1,scale:1}}});const a=e=>"string"==typeof e?e:`${e}px`;he({effect:"creative",swiper:e,on:s,setTranslate:()=>{const{slides:t,wrapperEl:s,slidesSizesGrid:i}=e,r=e.params.creativeEffect,{progressMultiplier:n}=r,l=e.params.centeredSlides,o=C(e);if(l){const t=i[0]/2-e.params.slidesOffsetBefore||0;s.style.transform=`translateX(calc(50% - ${t}px))`}for(let s=0;s<t.length;s+=1){const i=t[s],d=i.progress,c=Math.min(Math.max(i.progress,-r.limitProgress),r.limitProgress);let p=c;l||(p=Math.min(Math.max(i.originalProgress,-r.limitProgress),r.limitProgress));const u=i.swiperSlideOffset,m=[e.params.cssMode?-u-e.translate:-u,0,0],h=[0,0,0];let f=!1;e.isHorizontal()||(m[1]=m[0],m[0]=0);let g={translate:[0,0,0],rotate:[0,0,0],scale:1,opacity:1};c<0?(g=r.next,f=!0):c>0&&(g=r.prev,f=!0),m.forEach((e,t)=>{m[t]=`calc(${e}px + (${a(g.translate[t])} * ${Math.abs(c*n)}))`}),h.forEach((e,t)=>{let s=g.rotate[t]*Math.abs(c*n);h[t]=s}),i.style.zIndex=-Math.abs(Math.round(d))+t.length;const v=m.join(", "),w=`rotateX(${o(h[0])}deg) rotateY(${o(h[1])}deg) rotateZ(${o(h[2])}deg)`,b=p<0?`scale(${1+(1-g.scale)*p*n})`:`scale(${1-(1-g.scale)*p*n})`,y=p<0?1+(1-g.opacity)*p*n:1-(1-g.opacity)*p*n,E=`translate3d(${v}) ${w} ${b}`;if(f&&g.shadow||!f){let e=i.querySelector(".swiper-slide-shadow");if(!e&&g.shadow&&(e=ve("creative",i)),e){const t=r.shadowPerProgress?c*(1/r.limitProgress):c;e.style.opacity=Math.min(Math.max(Math.abs(t),0),1)}}const x=fe(0,i);x.style.transform=E,x.style.opacity=y,g.origin&&(x.style.transformOrigin=g.origin)}},setTransition:t=>{const s=e.slides.map(e=>f(e));s.forEach(e=>{e.style.transitionDuration=`${t}ms`,e.querySelectorAll(".swiper-slide-shadow").forEach(e=>{e.style.transitionDuration=`${t}ms`})}),ge({swiper:e,duration:t,transformElements:s,allSlides:!0})},perspective:()=>e.params.creativeEffect.perspective,overwriteParams:()=>({watchSlidesProgress:!0,virtualTranslate:!e.params.cssMode})})},function({swiper:e,extendParams:t,on:s}){t({cardsEffect:{slideShadows:!0,rotate:!0,perSlideRotate:2,perSlideOffset:8}}),he({effect:"cards",swiper:e,on:s,setTranslate:()=>{const{slides:t,activeIndex:s,rtlTranslate:a}=e,i=e.params.cardsEffect,{startTranslate:r,isTouched:n}=e.touchEventsData,l=a?-e.translate:e.translate;for(let o=0;o<t.length;o+=1){const d=t[o],c=d.progress,p=Math.min(Math.max(c,-4),4);let u=d.swiperSlideOffset;e.params.centeredSlides&&!e.params.cssMode&&(e.wrapperEl.style.transform=`translateX(${e.minTranslate()}px)`),e.params.centeredSlides&&e.params.cssMode&&(u-=t[0].swiperSlideOffset);let m=e.params.cssMode?-u-e.translate:-u,h=0;const f=-100*Math.abs(p);let g=1,v=-i.perSlideRotate*p,w=i.perSlideOffset-.75*Math.abs(p);const b=e.virtual&&e.params.virtual.enabled?e.virtual.from+o:o,y=(b===s||b===s-1)&&p>0&&p<1&&(n||e.params.cssMode)&&l<r,E=(b===s||b===s+1)&&p<0&&p>-1&&(n||e.params.cssMode)&&l>r;if(y||E){const t=(1-Math.abs((Math.abs(p)-.5)/.5))**.5;v+=-28*p*t,g+=-.5*t,w+=96*t,h=(i.rotate||e.isHorizontal()?-25:0)*t*Math.abs(p)+"%"}if(m=p<0?`calc(${m}px ${a?"-":"+"} (${w*Math.abs(p)}%))`:p>0?`calc(${m}px ${a?"-":"+"} (-${w*Math.abs(p)}%))`:`${m}px`,!e.isHorizontal()){const e=h;h=m,m=e}const x=p<0?""+(1+(1-g)*p):""+(1-(1-g)*p),S=`\n        translate3d(${m}, ${h}, ${f}px)\n        rotateZ(${i.rotate?a?-v:v:0}deg)\n        scale(${x})\n      `;if(i.slideShadows){let e=d.querySelector(".swiper-slide-shadow");e||(e=ve("cards",d)),e&&(e.style.opacity=Math.min(Math.max((Math.abs(p)-.5)/.5,0),1))}d.style.zIndex=-Math.abs(Math.round(c))+t.length;fe(0,d).style.transform=S}},setTransition:t=>{const s=e.slides.map(e=>f(e));s.forEach(e=>{e.style.transitionDuration=`${t}ms`,e.querySelectorAll(".swiper-slide-shadow").forEach(e=>{e.style.transitionDuration=`${t}ms`})}),ge({swiper:e,duration:t,transformElements:s})},perspective:()=>!0,overwriteParams:()=>({_loopSwapReset:!1,watchSlidesProgress:!0,loopAdditionalSlides:e.params.cardsEffect.rotate?3:2,centeredSlides:!0,virtualTranslate:!e.params.cssMode})})}];return ne.use(we),ne}();
//# sourceMappingURL=swiper-bundle.min.js.map;

/* ana-dental-navigation */
/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	const siteNavigation = document.getElementById( 'site-navigation' );

	// Return early if the navigation doesn't exist.
	if ( ! siteNavigation ) {
		return;
	}

	const button = siteNavigation.getElementsByTagName( 'button' )[ 0 ];

	// Return early if the button doesn't exist.
	if ( 'undefined' === typeof button ) {
		return;
	}

	const menu = siteNavigation.getElementsByTagName( 'ul' )[ 0 ];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	if ( ! menu.classList.contains( 'nav-menu' ) ) {
		menu.classList.add( 'nav-menu' );
	}

	// Toggle the .toggled class and the aria-expanded value each time the button is clicked.
	button.addEventListener( 'click', function() {
		siteNavigation.classList.toggle( 'toggled' );

		if ( button.getAttribute( 'aria-expanded' ) === 'true' ) {
			button.setAttribute( 'aria-expanded', 'false' );
		} else {
			button.setAttribute( 'aria-expanded', 'true' );
		}
	} );

	// Remove the .toggled class and set aria-expanded to false when the user clicks outside the navigation.
	document.addEventListener( 'click', function( event ) {
		const isClickInside = siteNavigation.contains( event.target );

		if ( ! isClickInside ) {
			siteNavigation.classList.remove( 'toggled' );
			button.setAttribute( 'aria-expanded', 'false' );
		}
	} );

	// Get all the link elements within the menu.
	const links = menu.getElementsByTagName( 'a' );

	// Get all the link elements with children within the menu.
	const linksWithChildren = menu.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

	// Toggle focus each time a menu link is focused or blurred.
	for ( const link of links ) {
		link.addEventListener( 'focus', toggleFocus, true );
		link.addEventListener( 'blur', toggleFocus, true );
	}

	// Toggle focus each time a menu link with children receive a touch event.
	for ( const link of linksWithChildren ) {
		link.addEventListener( 'touchstart', toggleFocus, false );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		if ( event.type === 'focus' || event.type === 'blur' ) {
			let self = this;
			// Move up through the ancestors of the current link until we hit .nav-menu.
			while ( ! self.classList.contains( 'nav-menu' ) ) {
				// On li elements toggle the class .focus.
				if ( 'li' === self.tagName.toLowerCase() ) {
					self.classList.toggle( 'focus' );
				}
				self = self.parentNode;
			}
		}

		if ( event.type === 'touchstart' ) {
			const menuItem = this.parentNode;
			event.preventDefault();
			for ( const link of menuItem.parentNode.children ) {
				if ( menuItem !== link ) {
					link.classList.remove( 'focus' );
				}
			}
			menuItem.classList.toggle( 'focus' );
		}
	}
}() );
;

/* js-global */
var $=jQuery;function initWhenNear(e,t){const i=document.querySelector(e);if(!i)return;let n=!1;const o=function(){n||(n=!0,t(i))};if(!("IntersectionObserver"in window))return void(window.requestIdleCallback||window.setTimeout)(o,1);const s=new IntersectionObserver(function(e){e.some(e=>e.isIntersecting)&&(s.disconnect(),o())},{rootMargin:"300px 0px"});s.observe(i)}const swiperIntro3=new Swiper(".swiperIntro3",{spaceBetween:10,slidesPerView:3,freeMode:!0,loop:!0,effect:"slide",watchSlidesProgress:!0,navigation:{nextEl:".swiper-button-next-imageGallerySwiper2",prevEl:".swiper-button-prev-imageGallerySwiper2"},breakpoints:{800:{slidesPerView:3}}}),swiperIntro3_2=new Swiper(".swiperIntro3_2",{spaceBetween:10,effect:"fade",loop:!0,autoplay:{delay:4e3,disableOnInteraction:!1},thumbs:{swiper:swiperIntro3}});initWhenNear(".mySwiperVideos",function(){new Swiper(".mySwiperVideos",{slidesPerView:1.2,centeredSlides:!0,spaceBetween:20,loop:!0,rtl:!0,speed:600,effect:"slide",breakpoints:{480:{slidesPerView:1.2},600:{slidesPerView:1.4},700:{slidesPerView:2.2,loop:!0,centeredSlides:!0},1100:{slidesPerView:3,spaceBetween:30,loop:!1,centeredSlides:!1},1220:{slidesPerView:3.4,spaceBetween:30,loop:!1,centeredSlides:!1},1400:{slidesPerView:4.2,spaceBetween:30,loop:!1,centeredSlides:!1}},autoplay:{delay:3e3,disableOnInteraction:!1,pauseOnMouseEnter:!0},navigation:{nextEl:".swiper-button-next_dental",prevEl:".swiper-button-prev_dental"},on:{init:function(){this.slides.forEach(e=>e.classList.remove("active-slide")),this.slides[this.activeIndex].classList.add("active-slide")},slideChange:function(){this.slides.forEach(e=>e.classList.remove("active-slide")),this.slides[this.activeIndex].classList.add("active-slide")}}});lightGallery(document.querySelector(".mySwiperVideos .swiper-wrapper"),{selector:".swiper-slide a",thumbnail:!0,plugins:[lgThumbnail,lgVideo,lgShare],videojs:!1,download:!1})}),initWhenNear(".Blog",function(){new Swiper(".Blog",{slidesPerView:1,spaceBetween:16,grabCursor:!0,rtl:!0,ObjectwatchOverflow:!0,speed:600,effect:"slide",breakpoints:{480:{},600:{slidesPerView:2},900:{slidesPerView:2.4},1100:{slidesPerView:3}},autoplay:{delay:4e3,disableOnInteraction:!1},navigation:{nextEl:".swiper-button-next_dental",prevEl:".swiper-button-prev_dental"}})});const slidesData=Array.from(document.querySelectorAll(".HomeHero .swiper-slide")).map(e=>e.querySelector("span")?.textContent||""),HomeHero=new Swiper(".HomeHero",{centeredSlides:!0,loop:!0,speed:600,slidesPerView:1,centeredSlides:!0,allowTouchMove:!1,waitForTransition:!0,effect:"fade",autoplay:{delay:4e3,disableOnInteraction:!1},pagination:{el:".swiper-pagination",clickable:!0,type:"custom",renderCustom:function(e,t,i){return slidesData.map((e,t)=>`<div class="custom-pagination" data-index="${t}">\n            <svg viewBox="0 0 36 36" class="circle-progress">\n              <path class="circle-bg"\n                    d="M18 2.0845\n                       a 15.9155 15.9155 0 0 1 0 31.831\n                       a 15.9155 15.9155 0 0 1 0 -31.831"/>\n              <path class="circle"\n                    d="M18 2.0845\n                       a 15.9155 15.9155 0 0 1 0 31.831\n                       a 15.9155 15.9155 0 0 1 0 -31.831"/>\n            </svg>\n          </div>`).join("")}},on:{init:function(e){setActive(e.realIndex),startProgress(e.realIndex)},slideChange:function(e){setActive(e.realIndex),restartProgress(e.realIndex)}}});function setActive(e){document.querySelectorAll(".custom-pagination").forEach((t,i)=>{t.classList.toggle("active",i===e)})}function startProgress(e){const t=document.querySelectorAll(".custom-pagination")[e];t&&t.querySelector(".circle").classList.add("animate")}function restartProgress(e){document.querySelectorAll(".circle").forEach(e=>{e.classList.remove("animate")}),window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){startProgress(e)})})}HomeHero.init(),document.addEventListener("click",function(e){if(e.target.closest(".custom-pagination")){const t=parseInt(e.target.closest(".custom-pagination").dataset.index);HomeHero.slideToLoop(t)}}),document.addEventListener("DOMContentLoaded",function(){const e=document.querySelectorAll(".star-rating .star"),t=document.querySelector("#rating");function i(t){e.forEach(e=>{e.dataset.value<=t&&e.classList.add("selected")})}function n(){e.forEach(e=>e.classList.remove("selected"))}e.forEach(e=>{e.addEventListener("mouseover",function(){n(),i(this.dataset.value)}),e.addEventListener("mouseout",function(){n(),t.value&&i(t.value)}),e.addEventListener("click",function(){t.value=this.dataset.value,n(),i(this.dataset.value)})})});let isMenuOpen=!1;function copyToClipboard(){var e=$("<input>");$("body").append(e),e.val(window.location.href).select(),document.execCommand("copy"),e.remove();var t=$("#copyUrlButton .tooltiptext");t.text("با موفقیت کپی شد!"),t.css("visibility","visible"),t.css("transform","translateY(-1px)"),t.css("opacity","1"),setTimeout(function(){t.css("visibility",""),t.text("کپی کردن URL"),t.css("transform",""),t.css("opacity","")},5e3)}$(".MenueBtnIcone").click(function(){isMenuOpen?($(".GeneralOverlay").fadeOut(300),$(".mamaMobileMenuParent").removeClass("showMobMenu"),isMenuOpen=!1):($(".GeneralOverlay").fadeIn(300),$(".mamaMobileMenuParent").addClass("showMobMenu"),isMenuOpen=!0)}),$(".GeneralOverlay , .closeMobMenu").click(function(){$(".GeneralOverlay").fadeOut(300),$(".mamaMobileMenuParent").removeClass("showMobMenu"),isMenuOpen=!1}),$(".mamaMobileMenuParent").on("click",".menu-item-has-children",function(e){e.stopPropagation(),$(this).toggleClass("arrow-left"),$(this).children(".sub-menu").toggleClass("openSub")}),$("#back-to-top").click(function(){return $("html, body").animate({scrollTop:0},600),!1}),$(window).scroll(function(){$(this).scrollTop()>200?$("#back-to-top").fadeIn(200):$("#back-to-top").fadeOut(200)}),$(document).ready(function(){$("#copyUrlButton").on("click",copyToClipboard)}),$('a.listSideItem[href^="#"] , .woocommerce-review-link').on("click",function(e){e.preventDefault();var t=$(this.getAttribute("href"));t.length&&$("html, body").animate({scrollTop:t.offset().top},800)}),initWhenNear(".sw--gallery",function(){new Swiper(".sw--gallery",{speed:500,breakpointsBase:"container",grabCursor:!0,rtl:!0,ObjectwatchOverflow:!0,pagination:{el:".swiper-pagination.anaCustom",type:"bullets",clickable:!0},breakpoints:{0:{slidesPerView:1.4,spaceBetween:20},320:{slidesPerView:2,spaceBetween:10},600:{slidesPerView:3,spaceBetween:5},800:{slidesPerView:4,spaceBetween:20}}});lightGallery(document.getElementById("customize-thumbnails-gallery"),{addClass:"lg-custom-thumbnails",plugins:[lgThumbnail,lgVideo,lgZoom,lgShare],animateThumb:!0,allowMediaOverlap:!0,zoomFromOrigin:!1,thumbnail:!0,animateThumb:!0,subHtmlSelectorRelative:!0,mode:"lg-fade",speed:500})}),initWhenNear(".page_lightgallery",function(){let e=document.querySelectorAll(".page_lightgallery");for(var t=0;t<e.length;t++)try{lightGallery(e[t],{addClass:"lg-custom-thumbnails",thumbnail:!0,animateThumb:!0,speed:500,plugins:[lgThumbnail,lgVideo,lgZoom,lgShare],selector:".for-lightgallery",subHtmlSelectorRelative:!0,mode:"lg-fade",fullScreen:!1,allowMediaOverlap:!0,zoomFromOrigin:!1})}catch(e){console.log("no")}});let headerMenu=0;if($(".header-wrap-menu > li > ul > li").each(function(){$(this).find("a").each(function(e,t){$(this).css("transition-delay",.05*headerMenu+"s")}),headerMenu++}),$(document).ready(function(e){if(e("body").hasClass("page-id-461"))return;let t=null;function i(){const i=window.matchMedia("(max-width: 767px)").matches;if(i===t)return;t=i;const n=e(".faqs-item"),o=e(".accordion-content");n.removeClass("active"),o.stop(!0,!0).hide(),i||(n.first().addClass("active"),n.first().find(".accordion-content").show())}i();let n=0;e(window).resize(function(){window.cancelAnimationFrame(n),n=window.requestAnimationFrame(i)}),e(".accordion").on("click",function(t){t.preventDefault();var i=e(this);i.parent().hasClass("active")?(i.parent().removeClass("active"),i.next().slideUp(350)):(e(".accordion").parent().removeClass("active"),e(".accordion").next().slideUp(350),i.parent().addClass("active"),i.next().slideDown(350))})}),$(window).width()<768){const e='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M6 12h12m-6 6V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n  </svg>',t='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M19.5 12h-15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n  </svg>',i=$(".col").first();i.addClass("active").find("ul").show(),i.find(".footerItemsTitle svg").replaceWith(t),$(".footerItems .footerItemsTitle").on("pointerdown",function(i){i.preventDefault(),i.stopPropagation();const n=$(this).closest(".footerItems"),o=n.hasClass("active");$(".footerItems").removeClass("active").find("ul").slideUp(200),$(".footerItems .footerItemsTitle > svg").replaceWith(e),o||(n.addClass("active").find("ul").slideDown(200),n.find(".footerItemsTitle > svg").replaceWith(t))}),$(document).on("pointerdown",function(t){$(t.target).closest(".footerItems").length||($(".footerItems").removeClass("active").find("ul").slideUp(200),$(".footerItems .footerItemsTitle svg").replaceWith(e))})}$(document).ready(function(e){e(".filter-link").on("click",function(t){t.preventDefault();let i=e(this).data("sort");e("#posts-wrapper").addClass("loading"),e.ajax({url:ajax_object.ajax_url,type:"POST",data:{action:"filter_posts",sort:i,cat:ajax_object.cat,tax:ajax_object.tax,term:ajax_object.term,nonce:ajax_object.nonce},success:function(t){e("#posts-wrapper").removeClass("loading").html(t)},error:function(t,i,n){console.error("AJAX Error:",n),e("#posts-wrapper").removeClass("loading").html("<p>خطایی رخ داد. دوباره تلاش کنید.</p>")}}),e(".filter-link").removeClass("active"),e(this).addClass("active")})}),jQuery(document).ready(function(e){let t=1,i=e("#category-filter").val()||e("body").data("category-id")||"";const n=e("#load-more"),o=e("#no-more-posts"),s=e("#posts-wrapper");function a(a=!1){a&&(t=1),e("#posts-wrapper").addClass("loading"),e.ajax({url:ajax_params.ajax_url,type:"POST",data:{action:"filter_projects",category:i,page:t},beforeSend:function(){n.prop("disabled",!0).text("در حال بارگذاری...")},success:function(i){s.removeClass("loading"),a?s.fadeOut(200,function(){s.html(i).fadeIn(400),e("html, body").animate({scrollTop:s.offset().top-20},500)}):e(i).hide().appendTo(s).fadeIn(400);let r=s.children().length;""===i.trim()||r<ajax_params.posts_per_page*t?(n.hide(),o.show()):(n.show(),o.hide()),n.prop("disabled",!1).text("بارگذاری بیشتر")},error:function(){e("#posts-wrapper").removeClass("loading").html("<p>خطا در بارگذاری. دوباره تلاش کنید.</p>"),n.hide(),o.hide()}})}e("#filter-button").on("click",function(){i=e("#category-filter").val(),a(!0)}),n.on("click",function(){t++,a()}),e("#posts-wrapper").children().length>0?(n.show(),o.hide()):(n.hide(),o.show())}),initWhenNear(".outTeamSwiper",function(){new Swiper(".outTeamSwiper",{loop:!0,slidesPerView:1,spaceBetween:16,navigation:{nextEl:".swiper-button-next_dental",prevEl:".swiper-button-prev_dental"},breakpoints:{400:{slidesPerView:1},480:{slidesPerView:2},760:{slidesPerView:3,spaceBetween:20},1e3:{slidesPerView:4}}})}),initWhenNear(".imageGallerySwiper1",function(){const e=document.querySelectorAll(".imageGallerySwiper1 .swiper-slide").length,t=new Swiper(".imageGallerySwiper1",{loop:!0,slidesPerView:1,initialSlide:0,loopedSlides:e}),i=new Swiper(".imageGallerySwiper2",{loop:!0,slidesPerView:3,centeredSlides:!0,spaceBetween:12,initialSlide:0,loopedSlides:e,autoplay:{delay:4e3,disableOnInteraction:!1},navigation:{nextEl:".swiper-button-next-imageGallerySwiper2",prevEl:".swiper-button-prev-imageGallerySwiper2"},breakpoints:{760:{spaceBetween:20}}});t.on("slideChangeTransitionStart",function(){let e=t.realIndex;i.slideToLoop(e)}),i.on("slideChangeTransitionStart",function(){let e=i.realIndex;t.slideToLoop(e)})}),function(e){"use strict";e(document).ready(function(){e(".timelineItemsMain").each(function(){var t;(t=e(this).find(".timelineItem")).removeClass("active"),t.first().addClass("active"),t.on("click",function(i){i.preventDefault();var n=e(this);n.hasClass("active")||(t.removeClass("active"),n.addClass("active"))})})})}(jQuery),$(document).ready(function(){$(window).width()<1068&&($(document).on("click",".titleSidebarPost",function(){console.log($(".RightsSideBar").css("bottom")),$(".RightsSideBar").hasClass("singleSideContentMobileShow")?($(".RightsSideBar").scrollTop(0),$(".RightsSideBar").removeClass("singleSideContentMobileShow")):$(".RightsSideBar").addClass("singleSideContentMobileShow")}),$(document).on("click",".singleSideContent li a",function(){$(".RightsSideBar").scrollTop(0),$(".RightsSideBar").removeClass("singleSideContentMobileShow")}))}),initWhenNear(".partnersSwiper",function(){new Swiper(".partnersSwiper",{slidesPerView:1.9,spaceBetween:10,loop:!0,ObjectwatchOverflow:!0,freeMode:!0,speed:3200,autoplay:{delay:0,disableOnInteraction:!1},allowTouchMove:!1,grabCursor:!1,breakpoints:{490:{slidesPerView:3,spaceBetween:10},816:{slidesPerView:4,spaceBetween:14},1200:{slidesPerView:5,spaceBetween:50}}})});const stepContainer=document.querySelector(".StepSt");if(stepContainer){const e=stepContainer.querySelectorAll("li");let t=e[0];t&&t.classList.add("active"),e.forEach(i=>{i.addEventListener("mouseenter",()=>{e.forEach(e=>e.classList.remove("active")),i.classList.add("active")}),i.addEventListener("mouseleave",()=>{t=i})}),stepContainer.addEventListener("mouseleave",()=>{e.forEach(e=>e.classList.remove("active")),t&&t.classList.add("active")})};

/* my-fast-search */
jQuery(function(t){"use strict";let n=null,e=null,s=null,o=0;function a(t){return String(t||"").toLocaleLowerCase("fa").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/آ/g,"ا").replace(/\s+/g," ").trim()}function c(n){return t("<div>").text(null==n?"":n).html()}function i(t){const n=String(t||"");return/^(?:https?:)?\/\//i.test(n)||"/"===n.charAt(0)?n:"#"}function l(s){const l=a(s),r=++o;l&&(n?Promise.resolve(n):e||(e=t.getJSON(my_fast_search.data).catch(function(){return t.getJSON(my_fast_search.build)}).then(function(t){return n=t&&t.success?t.data:t,n||{posts:[],categories:[]}}).always(function(){e=null}),e)).then(function(n){r===o&&function(n,e){const s=[],o=[];t.each(n.posts||[],function(t,n){if(s.length>=15)return!1;a(n.title).includes(e)&&s.push('<a href="'+c(i(n.link))+'" class="item"><div class="img"><img src="'+c(i(n.img))+'" loading="lazy" alt=""></div><div class="Parents"><div class="title">'+c(n.title)+'</div><div class="Txtx">'+c(n.txt)+"</div></div></a>")}),t.each(n.categories||[],function(t,n){if(o.length>=10)return!1;a(n.title).includes(e)&&o.push('<li><a href="'+c(i(n.link))+'" class="item"><span class="title">'+c(n.title)+"</span></a></li>")});const l=t("#fast-search-body");l.find(".list-posts").html(s.join("")),l.find(".list-category ul").html(o.join("")),l.find(".posts").toggleClass("d-none",!s.length),l.find(".category").toggleClass("d-none",!o.length),l.find(".is-search").toggleClass("d-none",!s.length&&!o.length),l.find(".not-found").toggleClass("d-none",!!s.length||!!o.length)}(n,l)}).catch(function(){r===o&&(t("#fast-search-body .is-search").addClass("d-none"),t("#fast-search-body .not-found").removeClass("d-none"))})}t(document.body).on("input","#fast-search-input",function(){window.clearTimeout(s);const n=t.trim(this.value),e=n.length>0;t("#search-by-json .input .empty").toggleClass("d-none",!e),t("#fast-search-body .default").toggleClass("d-none",e),t("#fast-search-body .not-found, #fast-search-body .is-search").addClass("d-none"),e?s=window.setTimeout(function(){l(n)},250):o++}),t(document.body).on("click","#search-by-json .input .empty",function(){t("#fast-search-input").val("").trigger("input").trigger("focus")}),t(document.body).on("click",".btn-search.search-js",function(){t(".search-body-box").addClass("open"),window.requestAnimationFrame(function(){t("#fast-search-input").trigger("focus")})}),t(document.body).on("click",".search-body-box .close",function(){t(".search-body-box").removeClass("open"),t("#fast-search-input").val("").trigger("input")}),t(document).on("click",function(n){const e=t(".search-body-box");e.hasClass("open")&&!t(n.target).closest("#search-by-json, .search-js").length&&(e.removeClass("open"),t("#fast-search-input").val("").trigger("input"))}),t(document).on("keydown",function(n){"Escape"===n.key&&t(".search-body-box .close").trigger("click")})});;

/* ana-dental-cta */
jQuery(document).ready(function ($) {
  // Popup
  $(".ana-dental-cta-popup-btn").click(function () {
    $("#ana-dental-cta-popup").fadeIn();
  });

  // Close Cta
  $(".close-cta").click(function () {
    $("#ana-dental-cta-popup").fadeOut();
  });

  // Remove BG
  $("#remove-before-card-products").length &&
    $("#ana-dental-cta-product").addClass("ana-dental-cta-product-remove-before");

  // Product
  if ($(".editor-content").length) {
    // alert (elWidth);
    $(".cta-carousel:not(.cta-advanced)").length &&
      $(".cta-carousel:not(.cta-advanced)").owlCarousel({
        rtl: true,
        dots: false,
        margin: 6,
        autoplay: true,
        autoplayTimeout: 10000,
        smartSpeed: 2000,
        navText: ["<i class='icon-arrow'></i>", "<i class='icon-arrow'></i>"],
        responsive: {
          0: {
            items: 1.3,
            nav: false,
            dots: true,
          },
          450: {
            items: 2,
            nav: false,
            dots: true,
          },
          768: {
            items: 3,
            nav: true,
          },
          1200: {
            items: 4,
            nav: true,
          },
        },
      });

    // Product Advanced
    $(".cta-advanced").length &&
      $(".cta-advanced").owlCarousel({
        rtl: true,
        dots: false,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 10000,
        smartSpeed: 2000,
        navText: ["<i class='icon-arrow'></i>", "<i class='icon-arrow'></i>"],
        responsive: {
          0: {
            items: 1,
            nav: false,
            dots: true,
          },
          768: {
            items: 1.5,
            nav: true,
          },
          1200: {
            items: 2,
            nav: true,
          },
        },
      });
  }

  // Cta Actions
  const cta_actions = (subject, id, page, param) => {
    jQuery.ajax({
      type: "POST",
      url: ana-dental_cta.ajax_url,
      data: {
        action: "ana-dental_cta_counter",
        subject: subject,
        id: id,
        page: page,
        param: param,
        nonce: ana-dental_cta.nonce,
      },
    });
  };

  // Visit
  $(window).scroll(function () {
    $(".cta-statis").each(function () {
      if (
        this.getBoundingClientRect().top -
          window.innerHeight +
          $(this).height() <
          0 &&
        !$(this).hasClass("reached") &&
        !$(this).closest("#ana-dental-cta-popup").length
      ) {
        $(this).addClass("reached");
        if (window.innerWidth > 566) {
          cta_actions(
            "reached-desktop",
            $(this).data("id"),
            $(this).data("page"),
            ""
          );
        } else {
          cta_actions(
            "reached-mobile",
            $(this).data("id"),
            $(this).data("page"),
            ""
          );
        }
      }
    });
  });

  // Click
  let clickRequest = true;
  $(".ana-dental-cta-btns .cta-btn-click").click(function (e) {
    if (clickRequest) {
      clickRequest = false;
      cta_actions(
        "clickcount",
        $(this).closest("#ana-dental-cta-content").data("id"),
        $(this).closest("#ana-dental-cta-content").data("page"),
        $(this).data("n")
      );
    }
  });
  $(".cta-banner-btn").click(function () {
    if (clickRequest) {
      clickRequest = false;
      cta_actions("clickcount", $(this).data("id"), $(this).data("page"), 0);
    }
  });

  // Popup
  $(".ana-dental-cta-popup-btn").click(function () {
    if (window.innerWidth < 566) {
      cta_actions(
        "clickcount",
        $("#ana-dental-cta-popup").find(".cta-statis").data("id"),
        $("#ana-dental-cta-popup").find(".cta-statis").data("page"),
        3
      );
    } else {
      cta_actions(
        "clickcount",
        $("#ana-dental-cta-popup").find(".cta-statis").data("id"),
        $("#ana-dental-cta-popup").find(".cta-statis").data("page"),
        4
      );
    }
  });
});
;

/* ana-implant-installments */
(function () {
  'use strict';

  var modal = document.querySelector('[data-ana-installment-modal]');
  if (!modal) return;

  var runtime = window.anaImplantInstallments || {
    configUrl: modal.dataset.configUrl,
    quoteUrl: modal.dataset.quoteUrl,
    captchaUrl: modal.dataset.captchaUrl,
    ajaxUrl: modal.dataset.ajaxUrl,
    nonce: modal.dataset.nonce
  };

  var app = modal.querySelector('[data-ana-installment-app]');
  var loading = modal.querySelector('[data-ana-installment-loading]');
  var error = modal.querySelector('[data-ana-installment-error]');
  var dialog = modal.querySelector('.ana-installment-modal__dialog');
  var config, selectedBrand, selectedQuantity, selectedMonths, previousFocus, quoteRequestId = 0, quantityUpdateTimer, closeTimer;
  var el = function (name) { return modal.querySelector('[data-ana-installment-' + name + ']'); };
  var fa = new Intl.NumberFormat('fa-IR');
  var money = function (amount) { return fa.format(amount) + ' تومان'; };
  var escapeHtml = function (value) { var box = document.createElement('span'); box.textContent = value == null ? '' : String(value); return box.innerHTML; };

  function setStep(name) {
    modal.querySelectorAll('[data-ana-installment-step]').forEach(function (section) {
      section.hidden = section.dataset.anaInstallmentStep !== name;
    });
    el('configurator').hidden = name === 'form' || name === 'success';
    if (name === 'success') app.scrollTop = 0;
  }

  function showError(message) {
    error.textContent = message || '';
    error.hidden = !message;
  }

  function currentQuote() {
    return config && config.quotes[selectedBrand] && config.quotes[selectedBrand][String(selectedQuantity)];
  }

  function fetchQuote() {
    var requestedMonths = selectedMonths || 0;
    var cached = currentQuote();
    if (cached && !requestedMonths) return Promise.resolve(cached);
    var url = runtime.quoteUrl + '?brandId=' + encodeURIComponent(selectedBrand) + '&quantity=' + encodeURIComponent(selectedQuantity);
    if (requestedMonths) url += '&months=' + encodeURIComponent(requestedMonths);
    return fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('شرایط اقساط برای این انتخاب معتبر نیست.');
        return response.json();
      })
      .then(function (quote) {
        if (!requestedMonths) {
          config.quotes[selectedBrand] = config.quotes[selectedBrand] || {};
          config.quotes[selectedBrand][String(selectedQuantity)] = quote;
        }
        return quote;
      });
  }

  function renderSelection() {
    var brands = el('brands');
    var input = el('quantity');
    input.value = selectedQuantity || config.suggestedQuantities[0] || 1;
    brands.innerHTML = config.brands.map(function (brand) {
      var logo = '<bdi class="ana-installment-brand__name">' + escapeHtml(brand.name) + '</bdi>';
      logo +=  brand.logo ? '<img src="' + escapeHtml(brand.logo) + '" alt="">' : '';
      return '<button type="button" class="ana-installment-brand" data-brand="' + escapeHtml(brand.id) + '"><span class="ana-installment-brand__country">' + escapeHtml(brand.country) + '</span><span class="ana-installment-brand__identity">' + logo + '</span></button>';
    }).join('');
  }

  function renderQuote(quote) {
    var selectedOption = quote;
    selectedMonths = quote.months;
    var installmentOptions = quote.installmentOptions && quote.installmentOptions.length ? quote.installmentOptions : [{ months: quote.months, selected: true }];
    var termButtons = installmentOptions.map(function (option) {
      var classes = 'ana-installment-term-chip' + (option.selected ? ' is-selected' : '') + (option.alwaysVisible ? ' is-always-visible' : '');
      var current = option.selected ? ' aria-current="true"' : '';
      if (option.selectable) return '<button type="button" class="' + classes + '" data-installment-months="' + option.months + '"' + current + '>' + fa.format(option.months) + ' ماهه</button>';
      return '<span class="' + classes + '"' + current + '>' + fa.format(option.months) + ' ماهه</span>';
    }).join('');
    var details = quote.unitPriceDetails.slice(1).map(function (item) {
      return '<div><span>' + escapeHtml(item.title) + '</span><strong>' + money(item.amount) + '</strong></div>';
    }).join('');
    var brand = config.brands.find(function (item) { return item.id === quote.brandId; });
    var selectedBrandIdentity = '<bdi class="ana-installment-brand__name">' + escapeHtml(brand ? brand.name : quote.brandName) + '</bdi>';
    selectedBrandIdentity += brand && brand.logo ? '<img src="' + escapeHtml(brand.logo) + '" alt="">' : '';
    el('selected-brand').innerHTML = '<span class="ana-installment-brand__country">' + escapeHtml(brand ? brand.country : '') + '</span><span class="ana-installment-brand__identity">' + selectedBrandIdentity + '</span>';
    el('term-picker').innerHTML = '<p>مدت بازپرداخت</p><div>' + termButtons + '</div>';
    el('summary').innerHTML = '<div class="ana-installment-price-details" data-ana-installment-price-details aria-hidden="true"><div class="ana-installment-price-details__inner">' + details + '</div></div><dl><div><dt>مبلغ کل:</dt><dd>' + money(quote.totalAmount) + '</dd></div><div><dt>تعداد ایمپلنت:</dt><dd>' + fa.format(quote.quantity) + ' واحد</dd></div><div><dt>پیش‌پرداخت:</dt><dd>' + money(quote.depositAmount) + '</dd></div><div><dt>مدت زمان بازپرداخت:</dt><dd>' + fa.format(selectedOption.months) + ' ماه</dd></div><div class="is-emphasis"><dt>قسط ماهانه:</dt><dd>' + money(selectedOption.monthlyInstallment) + '</dd></div></dl><button type="button" class="ana-installment-link ana-installment-details-toggle" data-ana-installment-details-toggle aria-expanded="false"></button>';
    el('summary').querySelector('dl > div').insertAdjacentHTML('afterend', '<div><dt>مبلغ بازپرداخت:</dt><dd>' + money(quote.totalAmount) + '</dd></div>');
    el('summary').querySelector('dl').insertAdjacentHTML('afterend', '<p class="ana-installment-interest-note">تمام شرایط وام بدون بهره می باشد.</p>');
    el('summary').classList.remove('is-updating');
    el('details-toggle').innerHTML =
        '<span>' + escapeHtml(config.detailsLabel) + '</span>' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true"><path stroke="#3090b6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6s3.474 4.114 4.625 4.114C8.777 10.114 12.251 6 12.251 6"/></svg>';
    el('details-toggle').setAttribute('aria-expanded', 'false');
    el('details-toggle').hidden = !details;
    el('notice').innerHTML = '<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="#c3b322" stroke-width="1.5" d="M3.541 7.174C5.487 3.724 6.46 2 8 2s2.513 1.725 4.459 5.174l.242.43c1.617 2.867 2.425 4.3 1.695 5.348S11.857 14 8.242 14h-.485c-3.615 0-5.422 0-6.153-1.048s.078-2.481 1.695-5.348z"/><path stroke="#c3b322" stroke-linecap="round" stroke-width="1.5" d="M8 5.333v3.334"/><circle cx="8" cy="10.667" r=".667" fill="#c3b322"/></svg></span>'
        + '<span>' + escapeHtml(config.noticeText) + '</span>';
    el('notice').hidden = !String(config.noticeText || '').trim();
    el('before-cta').textContent = config.beforeCtaText;
    el('show-form').textContent = config.ctaLabel;
    setStep('quote');
  }

  function updateQuote() {
    if (!selectedBrand) return;
    var requestId = ++quoteRequestId;
    el('summary').classList.add('is-updating');
    fetchQuote().then(function (quote) {
      if (requestId === quoteRequestId) renderQuote(quote);
    }).catch(function (requestError) {
      if (requestId === quoteRequestId) { el('summary').classList.remove('is-updating'); showError(requestError.message); }
    });
  }

  function updateQuantity(quantity) {
    if (selectedQuantity !== quantity) selectedMonths = 0;
    selectedQuantity = quantity;
    renderSelection();
    if (!modal.querySelector('[data-ana-installment-step="quote"]').hidden && selectedBrand) updateQuote();
  }

  function loadCaptcha() {
    el('captcha-question').textContent = 'در حال ساخت سوال…';
    el('captcha-token').value = '';
    return fetch(runtime.captchaUrl, { credentials: 'same-origin', cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error();
      return response.json();
    }).then(function (captcha) {
      el('captcha-question').textContent = captcha.question;
      el('captcha-token').value = captcha.token;
    }).catch(function () {
      el('captcha-question').textContent = 'خطا در ساخت کد امنیتی';
    });
  }

  function showSkeleton() {
    app.hidden = true;
    loading.hidden = false;
    showError('');
  }

  function showApp() {
    loading.hidden = true;
    app.hidden = false;
  }

  function openModal(trigger) {
    window.clearTimeout(closeTimer);
    previousFocus = trigger || document.activeElement;
    modal.hidden = false;
    modal.classList.remove('is-open');
    void modal.offsetWidth;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ana-installment-open');
    dialog.focus();
    setStep('selection');
    if (config) {
      showApp();
      renderSelection();
      return;
    }
    showSkeleton();
    fetch(runtime.configUrl, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(function (data) {
        config = data;
        selectedQuantity = data.suggestedQuantities[0] || 1;
        showApp();
        renderSelection();
      })
      .catch(function () {
        loading.hidden = true;
        showError('دریافت اطلاعات اقساط ممکن نیست. لطفاً دوباره تلاش کنید.');
      });
  }

  function closeModal() {
    window.clearTimeout(closeTimer);
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    closeTimer = window.setTimeout(function () {
      if (modal.classList.contains('is-open')) return;
      modal.hidden = true;
      document.body.classList.remove('ana-installment-open');
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }, 340);
  }

  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) return;
    var trigger = event.target.closest('[data-implant-installment-open], [data-ana-installment-open], a[href="#implant-installment-open"]');
    if (!trigger) return;
    event.preventDefault();
    openModal(trigger);
  });

  modal.addEventListener('click', function (event) {
    if (event.target.closest('[data-ana-installment-close]')) {
      closeModal();
      return;
    }
    var brandButton = event.target.closest('[data-brand]');
    if (brandButton) {
      selectedBrand = brandButton.dataset.brand;
      selectedMonths = 0;
      showError('');
      updateQuote();
      return;
    }
    var termButton = event.target.closest('[data-installment-months]');
    if (termButton) {
      selectedMonths = Number(termButton.dataset.installmentMonths);
      showError('');
      updateQuote();
      return;
    }
    if (event.target.closest('[data-ana-installment-change-brand]')) {
      var details = el('price-details');
      if (details) details.hidden = true;
      setStep('selection');
      renderSelection();
      return;
    }
    if (event.target.closest('[data-ana-installment-details-toggle]')) {
      var priceDetails = el('price-details');
      if (!priceDetails) return;
      var expanded = !priceDetails.classList.contains('is-expanded');
      priceDetails.classList.toggle('is-expanded', expanded);
      priceDetails.setAttribute('aria-hidden', String(!expanded));
      el('details-toggle').setAttribute('aria-expanded', String(expanded));
      return;
    }
    if (event.target.closest('[data-ana-installment-show-form]')) { setStep('form'); loadCaptcha(); }
    if (event.target.closest('[data-ana-installment-captcha-refresh]')) loadCaptcha();
  });

  el('quantity').addEventListener('input', function (event) {
    var quantity = Number(event.target.value);
    window.clearTimeout(quantityUpdateTimer);
    if (Number.isInteger(quantity) && quantity > 0) quantityUpdateTimer = window.setTimeout(function () { updateQuantity(quantity); }, 300);
  });

  el('quantity').addEventListener('change', function (event) {
    var quantity = Number(event.target.value);
    window.clearTimeout(quantityUpdateTimer);
    if (Number.isInteger(quantity) && quantity > 0) {
      updateQuantity(quantity);
    }
  });

  modal.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  el('form').addEventListener('submit', function (event) {
    event.preventDefault();
    var form = event.currentTarget;
    var message = el('form-message');
    var submit = form.querySelector('[type="submit"]');
    if (!selectedBrand || !selectedQuantity) return;
    submit.disabled = true;
    message.textContent = 'در حال ثبت…';
    var data = new FormData(form);
    data.append('action', 'ana_submit_implant_consultation');
    data.append('nonce', runtime.nonce);
    data.append('brand_id', selectedBrand);
    data.append('quantity', selectedQuantity);
    data.append('months', selectedMonths);
    fetch(runtime.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: data })
      .then(function (response) { return response.json(); })
      .then(function (response) {
        if (!response.success) {
          if (response.data && response.data.refreshCaptcha) loadCaptcha();
          throw new Error(response.data && response.data.message);
        }
        form.reset();
        message.textContent = '';
        showError('');
        setStep('success');
      })
      .catch(function (requestError) {
        message.textContent = requestError.message || 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.';
      })
      .finally(function () { submit.disabled = false; });
  });

  // Always start closed, including pages restored from the browser back-forward cache.
  modal.classList.remove('is-open');
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  window.anaImplantInstallments = { open: openModal, close: closeModal };
}());
;

/* ana-dental-cta-click-tracker */
(function () {
    'use strict';

    if (!window.ana-dentalCtaTracker || !window.ana-dentalCtaTracker.endpoint) {
        return;
    }

    var storageKey = 'ana-dental_cta_click_queue_v1';
    var selectors = [
        { selector: '.BtnHeaderPhone, .BtnHeaderPhoneMobile', cta: 'header_phone' },
        { selector: '.numberundtel a', cta: 'sticky_banner' },
        { selector: '.PhoneLink', cta: 'footer_phone' },
        { selector: '.numbersCo a[href^="tel:"]', cta: 'contact_phone' },
        { selector: '.ana-dental-content-cta', cta: 'content_cta' },
        { selector: '[data-cta-key="mobile_consult_phone"]', cta: 'mobile_consult_phone' },
        { selector: '[data-cta-key="mobile_whatsapp"]', cta: 'mobile_whatsapp' },
        { selector: '[data-cta-key="mobile_implant_loan"]', cta: 'mobile_implant_loan' },
        { selector: '[data-cta-key="mobile_appointment"]', cta: 'mobile_appointment' }
    ];

    function readQueue() {
        try {
            var queue = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Array.isArray(queue) ? queue.slice(-100) : [];
        } catch (error) {
            return [];
        }
    }

    function writeQueue(queue) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(queue.slice(-100)));
        } catch (error) {
            // Tracking must never interfere with the CTA action.
        }
    }

    function eventId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (character) {
            var random = Math.random() * 16 | 0;
            return (character === 'x' ? random : (random & 3 | 8)).toString(16);
        });
    }

    function deviceType() {
        return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
    }

    function payloadBody(item) {
        return JSON.stringify(item);
    }

    function sendWithFetch(item) {
        return fetch(window.ana-dentalCtaTracker.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            keepalive: true,
            body: payloadBody(item)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('CTA tracking request failed');
            }
            return item.event_id;
        });
    }

    function flushQueue() {
        var queue = readQueue();
        if (!queue.length || !navigator.onLine) {
            return;
        }

        Promise.all(queue.map(function (item) {
            return sendWithFetch(item).catch(function () { return null; });
        })).then(function (completedIds) {
            var completed = completedIds.filter(Boolean);
            if (!completed.length) {
                return;
            }
            writeQueue(readQueue().filter(function (item) {
                return completed.indexOf(item.event_id) === -1;
            }));
        });
    }

    function queueClick(cta, element) {
        var pageId = cta === 'content_cta' ? parseInt(element.getAttribute('data-cta-page-id'), 10) || 0 : 0;
        var item = { event_id: eventId(), cta: cta, device: deviceType(), page_id: pageId };
        var queue = readQueue();
        queue.push(item);
        writeQueue(queue);

        if (navigator.sendBeacon) {
            var blob = new Blob([payloadBody(item)], { type: 'application/json' });
            navigator.sendBeacon(window.ana-dentalCtaTracker.endpoint, blob);
        } else {
            sendWithFetch(item).then(flushQueue).catch(function () {});
        }
    }

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        for (var index = 0; index < selectors.length; index++) {
            var matchedElement = target.closest(selectors[index].selector);
            if (matchedElement) {
                queueClick(selectors[index].cta, matchedElement);
                return;
            }
        }
    }, true);

    window.addEventListener('online', flushQueue);
    window.addEventListener('pageshow', flushQueue);
    setTimeout(flushQueue, 1500);
}());
;

/* ana-dental-mobile-consultation-bar */
(function () {
    'use strict';

    function initMobileMenuLayering() {
        var menu = document.querySelector('.mamaMobileMenuParent');
        var bar = document.querySelector('.ana-dental-mobile-bar');
        if (!menu || !bar) {
            return;
        }

        function syncMenuState() {
            var isOpen = menu.classList.contains('showMobMenu');
            document.body.classList.toggle('ana-dental-mobile-menu-is-open', isOpen);
            menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            bar.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
        }

        new MutationObserver(syncMenuState).observe(menu, {
            attributes: true,
            attributeFilter: ['class']
        });
        syncMenuState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenuLayering, { once: true });
    } else {
        initMobileMenuLayering();
    }
}());
;
