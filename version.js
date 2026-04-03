/**
 * 应用版本号：只改下面这一行字符串即可，主页会显示为 v…（若已以 v 开头则不再重复加）
 */
window.__APP_VERSION__ = '6.5.3';

(function applyAppVersion() {
  var el = document.getElementById('app-version');
  if (!el) return;
  var v = String(window.__APP_VERSION__ || '').trim();
  if (!v) return;
  el.textContent = v.charAt(0).toLowerCase() === 'v' ? v : 'v' + v;
})();
