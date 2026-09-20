(function () {
  'use strict';

  var ADMIN_HASH = '852f57d2ac6efc633bf86a3e17ada7fc6200fac0bf2fdea956348d4e21f2e7d6';
  var STORAGE_KEY = 'yaowu_admin_gate_v1';
  var SCRIPT_LIST = [
    'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js',
    './formatting-widget.js',
  ];

  function bytesToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
  }

  function sha256(value) {
    return window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode('yaowu-admin:' + value)
    ).then(bytesToHex);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function loadCms() {
    var gate = document.getElementById('admin-gate');
    if (gate) gate.remove();

    SCRIPT_LIST.reduce(function (promise, src) {
      return promise.then(function () {
        return loadScript(src);
      });
    }, Promise.resolve()).catch(function () {
      document.body.innerHTML = '<div class="admin-gate-error-screen">後台載入失敗，請重新整理頁面。</div>';
    });
  }

  function showError(message) {
    var error = document.getElementById('admin-gate-error');
    if (error) error.textContent = message || '';
  }

  function initGate() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('lock')) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (window.localStorage.getItem(STORAGE_KEY) === ADMIN_HASH) {
      loadCms();
      return;
    }

    var form = document.getElementById('admin-gate-form');
    var input = document.getElementById('admin-gate-password');
    if (!form || !input) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      showError('');

      sha256(input.value || '').then(function (hash) {
        if (hash !== ADMIN_HASH) {
          input.value = '';
          input.focus();
          showError('管理密語不正確。');
          return;
        }

        window.localStorage.setItem(STORAGE_KEY, hash);
        loadCms();
      }).catch(function () {
        showError('瀏覽器不支援安全驗證，請更新瀏覽器後再試。');
      });
    });

    input.focus();
  }

  initGate();
})();
