/* ===== Núcleo: datos, progreso, almacenamiento, navegación ===== */
const DATA = JSON.parse(document.getElementById('pper-data').textContent);
const EXAM = DATA.exam;
const TOPICS = DATA.topics;
const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const QUESTIONS = DATA.questions.map(q => Object.assign({}, q, { q: q.q.trim(), o: q.o.map(s => s.trim()) }));
const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
const BYT = {};
QUESTIONS.forEach(q => (BYT[q.t] = BYT[q.t] || []).push(q));
const STAGES = [
  { k: 'lesson', name: 'Carta náutica', sub: 'La lección, ficha a ficha' },
  { k: 'tf', name: 'Babor o estribor', sub: 'Verdadero o falso contra el reloj' },
  { k: 'pairs', name: 'Amarres', sub: 'Une cada concepto con el suyo' },
  { k: 'cloze', name: 'Cifras clave', sub: 'Plazos, importes y distancias' },
  { k: 'exam', name: 'Examen del tema', sub: 'Preguntas oficiales y de práctica' },
];
const RANKS = [[0, 'Grumete'], [150, 'Marinero'], [400, 'Timonel'], [800, 'Contramaestre'], [1400, 'Patrón'], [2000, 'Capitán'], [2500, 'Patrón Profesional']];
const XP = { card: 2, tf: 5, pairSet: 20, cloze: 6, quiz: 10, sim: 12, rev: 8, firstPass: 50, threeStars: 100, simPass: 150 };
const GOAL = { miles: 2500, days: 50, trips: 5, dayMiles: 50 };
const LEITNER_DAYS = [0, 0, 1, 3, 7, 16];

/* --- utilidades --- */
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const keyToNum = k => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
const today = () => keyToNum(dayKey());
const nf = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = (k, opt) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('es-ES', opt || { day: 'numeric', month: 'long', year: 'numeric' }); };
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const plural = (n, one, many) => `${nf(n)} ${n === 1 ? one : many}`;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const AVISO = { derogada: ['!', 'Puede que ya no valga'], ojo: ['i', 'Norma cambiada'], fuera: ['–', 'Fuera del temario 2026'] };
function avisoHtml(q) { if (!q || !q.av) return ''; const [ic, tt] = AVISO[q.av.n] || AVISO.ojo; return `<div class="aviso ${q.av.n}" role="note"><span class="ic" aria-hidden="true">${ic}</span><span><b>${tt}.</b> ${esc(q.av.x)}</span></div>`; }
const avCls = q => (q && q.av ? ' av-' + q.av.n : '');
function present(q, keepOrder) { const order = keepOrder ? [0, 1, 2, 3] : shuffle([0, 1, 2, 3]); return { q, order, ans: order.indexOf(q.a), pick: null }; }
function starsFor(p) { return p >= 100 ? 3 : p >= 80 ? 2 : p >= 60 ? 1 : 0; }
function starsHtml(n, max = 3) { let s = ''; for (let i = 0; i < max; i++) s += `<i class="${i < n ? 'on' : ''}">★</i>`; return `<span class="stars" aria-label="${n} de ${max} estrellas">${s}</span>`; }
function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* sin vibración */ } }

/* --- progreso --- */
let P = null;
function fresh() { return { v: 1, ts: 0, xp: 0, days: {}, tp: {}, L: {}, sims: [], badges: {}, theme: 'auto', instant: true, st: { ans: 0, ok: 0, rev: 0 } }; }
function normalize(o) {
  const f = fresh();
  if (!o || typeof o !== 'object' || o.v !== 1) return f;
  const r = Object.assign(f, o);
  r.st = Object.assign(fresh().st, o.st || {});
  return r;
}
function tp(t) { return P.tp[t] || (P.tp[t] = { seen: '', lesson: 0, tf: -1, pairs: 0, cloze: -1, exam: -1, stars: 0 }); }
const tpr = t => P.tp[t] || {};
function seenCount(t) { return (tpr(t).seen || '').split('').filter(c => c === '1').length; }
function stageDone(t, k) {
  const x = tpr(t);
  if (k === 'lesson') return !!x.lesson;
  if (k === 'pairs') return !!x.pairs;
  return (x[k] == null ? -1 : x[k]) >= 60;
}
const topicPassed = t => (tpr(t).exam == null ? -1 : tpr(t).exam) >= 60;
const stagesDone = t => STAGES.filter(s => stageDone(t, s.k)).length;
function nextTopic() { const t = TOPICS.find(x => !topicPassed(x.id)); return t ? t.id : null; }
function nextStage(t) { const s = STAGES.find(x => !stageDone(t, x.k)); return s ? s.k : null; }
function seaDays() { return Object.values(P.days).filter(v => v >= GOAL.dayMiles).length; }
function trips() { return P.sims.filter(s => s.s >= EXAM.pass).length; }
function streak() {
  const act = new Set(Object.keys(P.days).filter(k => P.days[k] > 0).map(keyToNum));
  let d = today(); if (!act.has(d)) d--;
  let n = 0; while (act.has(d)) { n++; d--; }
  return n;
}
function rankOf(xp) {
  let cur = RANKS[0], next = null;
  for (const r of RANKS) { if (xp >= r[0]) cur = r; else { next = r; break; } }
  return { name: cur[1], min: cur[0], next };
}
function addXP(n, why) {
  if (!n) return;
  P.xp += n;
  const k = dayKey();
  P.days[k] = (P.days[k] || 0) + n;
  toast(`+${n} millas${why ? ' · ' + why : ''}`);
  updateTopChip();
  checkBadges();
  save();
}
function leitner(id, ok) {
  const cur = P.L[id];
  const box = ok ? Math.min(5, Math.max(cur ? cur[0] : 0, 1) + 1) : 1;
  P.L[id] = [box, today() + LEITNER_DAYS[box]];
  P.st.ans++; if (ok) P.st.ok++;
}
function dueIds() { const d = today(); return Object.keys(P.L).filter(id => QBY[id] && P.L[id][1] <= d); }

/* --- insignias --- */
const BADGES = [
  { k: 'first', f: 'C', n: 'Primera singladura', d: 'Completa tu primera etapa.' },
  { k: 'chart', f: 'P', n: 'Carta leída', d: 'Lee todas las fichas de un tema.' },
  { k: 'nomob', f: 'O', n: 'Nadie al agua', d: 'Babor o estribor sin perder un aro.' },
  { k: 'knot', f: 'K', n: 'Nudo perfecto', d: 'Amarres sin un solo fallo.' },
  { k: 'stars3', f: 'Q', n: 'Tres estrellas', d: 'Un 100 % en un examen de tema.' },
  { k: 'trip', f: 'H', n: 'Travesía de altura', d: 'Aprueba un simulacro de 30.' },
  { k: 'real', f: 'B', n: 'Prueba real', d: 'Aprueba un examen oficial de convocatoria.' },
  { k: 'streak7', f: 'G', n: 'Siete días seguidos', d: 'Una racha de 7 días.' },
  { k: 'review50', f: 'R', n: 'Repaso constante', d: '50 respuestas en Repaso.' },
  { k: 'half', f: 'D', n: 'Medio camino', d: 'Aprueba 10 temas.' },
  { k: 'all', f: 'A', n: 'Vuelta completa', d: 'Aprueba los 19 temas.' },
  { k: 'pper', f: 'S', n: 'Registro completo', d: '2.500 millas, 50 días de mar y 5 travesías.' },
];
function award(k) {
  if (P.badges[k]) return;
  P.badges[k] = dayKey();
  const b = BADGES.find(x => x.k === k);
  setTimeout(() => toast('Insignia: ' + b.n), 1100);
  save();
}
function checkBadges() {
  const passed = TOPICS.filter(t => topicPassed(t.id)).length;
  if (passed >= 10) award('half');
  if (passed >= 19) award('all');
  if (streak() >= 7) award('streak7');
  if (P.st.rev >= 50) award('review50');
  if (P.xp >= GOAL.miles && seaDays() >= GOAL.days && trips() >= GOAL.trips) award('pper');
}

/* --- almacenamiento: tu cuenta (db privada) con copia local --- */
const Store = {
  K: 'rumbo-pper-v1', ref: null, mode: 'local', writing: false, dirty: false, timer: null,
  loadLocal() { try { return JSON.parse(localStorage.getItem(this.K) || 'null'); } catch (e) { return null; } },
  saveLocal() { try { localStorage.setItem(this.K, JSON.stringify(P)); } catch (e) { /* sin almacenamiento local */ } },
  async connect() {
    if (window.PPER_WEB) return this.connectWeb();
    try {
      const c = window.claude;
      if (!c || typeof c.use !== 'function') return;
      const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
      if (!db || !user) return;
      const uid = await user.id();
      if (!uid) return;
      this.ref = db.doc('data/users/' + uid + '/progress');
      let snap;
      try { snap = await this.ref.get(); } catch (e) {
        if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 800 + Math.random() * 800)); snap = await this.ref.get(); } else throw e;
      }
      this.mode = 'cloud';
      let remote = null;
      if (snap && snap.exists) { const d = snap.data(); try { remote = d && typeof d.p === 'string' ? normalize(JSON.parse(d.p)) : null; } catch (e) { remote = null; } }
      if (remote && remote.ts > P.ts) { P = remote; this.saveLocal(); applyTheme(); render(false); }
      else if (P.ts > (remote ? remote.ts : 0)) this.flush();
      if (cur().v === 'log') render(false);
    } catch (e) { this.ref = null; this.mode = 'local'; }
  },
  async connectWeb() {
    if (typeof AUTH === 'undefined' || !AUTH.user) return;
    try {
      const row = await AUTH.pull();
      this.ref = 'web'; this.mode = 'cloud';
      let remote = null;
      if (row && row.p) { try { remote = normalize(JSON.parse(row.p)); } catch (e) { remote = null; } }
      if (remote && remote.ts > P.ts) { P = remote; this.saveLocal(); applyTheme(); render(false); }
      else if (P.ts > (remote ? remote.ts : 0) || !row) this.flush();
      if (cur().v === 'log') render(false);
    } catch (e) { this.ref = 'web'; this.mode = 'cloud'; /* sin conexión: se sube al guardar */ }
  },
  save() {
    P.ts = Date.now();
    this.saveLocal();
    if (!this.ref) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 1500);
  },
  async flush(retried) {
    if (!this.ref) return;
    clearTimeout(this.timer); this.timer = null;
    if (this.writing) { this.dirty = true; return; }
    this.writing = true;
    try { if (this.ref === 'web') await AUTH.push(P); else await this.ref.set({ v: 1, ts: P.ts, p: JSON.stringify(P) }); }
    catch (e) {
      const code = e && e.code;
      if (code === 'unavailable' && !retried) { this.writing = false; setTimeout(() => this.flush(true), 1200 + Math.random() * 1500); return; }
      if (code === 'revoked') { this.ref = null; this.mode = 'local'; }
      if (code === 'quota_exceeded') toast('No se pudo guardar en tu cuenta: espacio lleno');
    }
    this.writing = false;
    if (this.dirty) { this.dirty = false; this.flush(); }
  },
};
const save = () => Store.save();
function applyTheme() {
  const r = document.documentElement;
  if (P.theme === 'light' || P.theme === 'dark') r.setAttribute('data-theme', P.theme); else r.removeAttribute('data-theme');
  // barra de estado del móvil (solo en la versión web, que declara theme-color)
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
    const own = /dark/.test(m.media || '') ? '#0A121C' : '#F7F9F8';
    m.content = P.theme === 'dark' ? '#0A121C' : P.theme === 'light' ? '#F7F9F8' : own;
  });
}

/* --- navegación --- */
const NAV = { stack: [{ v: 'home', p: {} }] };
let S = {};
const VIEWS = {};
const ACT = {};
const timers = new Set();
const cur = () => NAV.stack[NAV.stack.length - 1];
function later(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; }
function every(fn, ms) { const id = setInterval(fn, ms); timers.add(id); return id; }
function clearTimers() { timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers.clear(); }
function leave(fn) {
  if (S.guard) { confirmBox(S.guard, () => { S.guard = null; fn(); }); return; }
  fn();
}
function go(v, p = {}) { leave(() => { clearTimers(); S = {}; NAV.stack.push({ v, p }); render(true); }); }
function swap(v, p = {}) { clearTimers(); S = {}; NAV.stack[NAV.stack.length - 1] = { v, p }; render(true); }
function back() { leave(() => { clearTimers(); S = {}; if (NAV.stack.length > 1) NAV.stack.pop(); render(true); }); }
function tab(v) { leave(() => { clearTimers(); S = {}; NAV.stack = [{ v, p: {} }]; render(true); }); }
const TABS = [['home', 'Ruta', 'route'], ['claves', 'Claves', 'key'], ['review', 'Repaso', 'review'], ['simMenu', 'Simulacro', 'sim'], ['log', 'Bitácora', 'log'], ['info', 'Examen', 'info']];
function tabOf(v, p) { const t = VIEWS[v] && VIEWS[v].tab; return (typeof t === 'function' ? t(p || {}) : t) || v; }
function topChip() { return S.clock ? `<span class="chip clock" id="clock">${S.clock}</span>` : `<span class="chip" id="xpchip" title="Millas navegadas">${nf(P.xp)} mi</span>`; }
function updateTopChip() { const c = document.getElementById('xpchip'); if (c) c.textContent = nf(P.xp) + ' mi'; }
function render(scrollTop) {
  const c = cur();
  const V = VIEWS[c.v];
  const html = V.render(c.p);
  const title = typeof V.title === 'function' ? V.title(c.p) : V.title;
  document.getElementById('top').innerHTML =
    (NAV.stack.length > 1 ? `<button class="iconbtn" data-act="back" aria-label="Volver">${ICONS.back}</button>` : '') +
    `<h1>${esc(title)}</h1>` + topChip();
  document.getElementById('view').innerHTML = html;
  const due = dueIds().length;
  const on = tabOf(c.v, c.p);
  document.getElementById('tabs').innerHTML = TABS.map(([v, label, ic]) =>
    `<button data-act="tab" data-v="${v}" class="${on === v ? 'on' : ''}" ${on === v ? 'aria-current="page"' : ''}>${ICONS[ic]}<span>${label}</span>${v === 'review' && due ? `<span class="badge">${due > 99 ? '99+' : due}</span>` : ''}</button>`).join('');
  if (V.after) V.after(c.p);
  if (scrollTop) window.scrollTo(0, 0);
}
const rerender = () => render(false);

/* --- avisos y confirmaciones dentro de la página --- */
function toast(msg) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}
function confirmBox(o, onOk) {
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div role="dialog" aria-modal="true" aria-labelledby="mt"><h3 id="mt">${esc(o.title)}</h3><p class="muted">${esc(o.text)}</p><div class="btnrow"><button class="btn ghost" data-m="0">${esc(o.cancel || 'Cancelar')}</button><button class="btn ${o.danger ? 'mag' : ''}" data-m="1">${esc(o.ok || 'Aceptar')}</button></div></div>`;
  m.addEventListener('click', e => {
    const b = e.target.closest('[data-m]');
    if (e.target !== m && !b) return;
    e.stopPropagation();
    m.remove();
    if (b && b.dataset.m === '1') onOk();
  });
  m.addEventListener('keydown', e => { if (e.key === 'Escape') m.remove(); });
  document.body.appendChild(m);
  m.querySelector('[data-m="1"]').focus();
}

/* --- acciones comunes --- */
ACT.back = () => back();
ACT.tab = d => tab(d.v);
ACT.go = d => go(d.v, { t: d.t ? +d.t : undefined, c: d.c, k: d.k });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && Store.timer) Store.flush(); });
