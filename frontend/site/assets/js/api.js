/**
 * لایه متمرکز درخواست‌های API سایت دندانپزشکی
 * پایه از meta[name=api-base] یا window.__API_BASE__ یا /backend/api
 */
(function (global) {
  'use strict';

  function resolveBase() {
    if (typeof global.__API_BASE__ === 'string' && global.__API_BASE__) {
      return global.__API_BASE__.replace(/\/$/, '');
    }
    var meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) {
      return meta.content.replace(/\/$/, '');
    }
    return '/backend/api';
  }

  async function request(path, options) {
    var opts = options || {};
    var url = resolveBase() + (path.charAt(0) === '/' ? path : '/' + path);
    var headers = Object.assign({ Accept: 'application/json' }, opts.headers || {});
    var init = {
      method: opts.method || 'GET',
      credentials: 'same-origin',
      headers: headers,
    };
    if (opts.body !== undefined) {
      if (opts.body instanceof FormData) {
        init.body = opts.body;
      } else {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(opts.body);
        init.headers = headers;
      }
    }
    var res = await fetch(url, init);
    var data = null;
    var text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = { ok: false, error: 'پاسخ نامعتبر از سرور' };
    }
    if (!res.ok) {
      var err = new Error((data && (data.error || (data.data && data.data.message))) || 'خطای سرور');
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  }

  global.DentalApi = {
    base: resolveBase,
    get: function (path) {
      return request(path, { method: 'GET' });
    },
    post: function (path, body) {
      return request(path, { method: 'POST', body: body });
    },
    contact: function (payload) {
      return request('/contact.php', { method: 'POST', body: payload });
    },
    blogList: function (category) {
      var q = category ? '?category=' + encodeURIComponent(category) : '';
      return request('/blog.php' + q);
    },
    blogPost: function (slug) {
      return request('/blog.php?slug=' + encodeURIComponent(slug));
    },
    commentsList: function (slug) {
      return request('/comments.php?slug=' + encodeURIComponent(slug));
    },
    commentCreate: function (payload) {
      return request('/comments.php', { method: 'POST', body: payload });
    },
  };
})(window);
