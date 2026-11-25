/* ===== Arranque ===== */
document.addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector('.modal')) return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const V = VIEWS[cur().v];
  if (V && V.key) V.key(e, cur().p);
});
function start(data) {
  try {
    const nav = data && data.nav;
    if (Array.isArray(nav) && nav.length && nav.every(x => x && VIEWS[x.v])) NAV.stack = nav.map(x => ({ v: x.v, p: x.p || {} }));
  } catch (e) { /* se empieza en la ruta */ }
  P = normalize(Store.loadLocal());
  applyTheme();
  render(true);
  Store.connect();
}
const HOT = window.claude && window.claude.hot;
try { if (HOT && typeof HOT.snapshot === 'function') HOT.snapshot(() => ({ nav: NAV.stack })); } catch (e) { /* sin recarga en caliente */ }
if (window.PPER_WEB && typeof AUTH !== 'undefined') AUTH.boot(() => start({}));
else if (HOT && typeof HOT.ready === 'function') HOT.ready(start); else start((HOT && HOT.data) || {});
