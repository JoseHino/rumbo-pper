/* ===== Etapas de juego: babor o estribor, amarres, cifras clave y examen del tema ===== */
const lifeIcons = n => [0, 1, 2].map(i => ICONS.buoy.replace('<svg', `<svg class="${i < n ? '' : 'lost'}"`)).join('');
function endButtons(t, nextK, nextName, extra) {
  return `<div class="stack">${nextK ? `<button class="btn wide" data-act="stage" data-v="${nextK}" data-t="${t}">Siguiente etapa: ${nextName}</button>` : ''}
<button class="btn ${nextK ? 'ghost' : ''} wide" data-act="retry">Otra vez</button>${extra || ''}
<button class="btn ghost wide" data-act="back">Volver al tema</button></div>`;
}

/* --- Babor o estribor (verdadero/falso con reloj y 3 aros) --- */
VIEWS.tf = {
  tab: 'home',
  title: p => `Tema ${p.t} · Babor o estribor`,
  render(p) {
    if (!S.items) Object.assign(S, { items: shuffle(TOPIC[p.t].tf).slice(0, 12), i: 0, ok: 0, lives: 3, lost: 0, T: 20, left: 20, ans: null, missed: [] });
    if (S.end) return tfEnd(p.t);
    const it = S.items[S.i];
    const answered = S.ans != null;
    const good = answered && S.okNow;
    return `
<div class="hud"><div class="lives" aria-label="${S.lives} aros salvavidas">${lifeIcons(S.lives)}</div><div class="tbar ${S.left <= 5 ? 'low' : ''}" id="tbar"><i style="width:${(100 * S.left) / S.T}%"></i></div><span class="mono" id="tsec">${Math.ceil(S.left)} s</span></div>
<div class="prog"><span>${S.i + 1}/${S.items.length}</span><div class="bar"><i style="width:${pct(S.i + (answered ? 1 : 0), S.items.length)}%"></i></div><span>${S.ok} ✓</span></div>
<div class="tfcard">${it.s}</div>
<div class="tfbtns"><button class="port" data-act="tfAns" data-v="0" ${answered ? 'disabled' : ''}>Falso<span>Babor</span></button><button class="stbd" data-act="tfAns" data-v="1" ${answered ? 'disabled' : ''}>Verdadero<span>Estribor</span></button></div>
${answered ? `<div class="fb ${good ? '' : 'bad'}" style="margin-top:14px" aria-live="polite"><span class="h">${good ? 'Correcto' : S.ans === 'time' ? 'Se acabó el tiempo' : 'Incorrecto'}</span>Es <b>${it.a ? 'verdadero' : 'falso'}</b>. ${it.e}</div>
<button class="btn wide" style="margin-top:12px" data-act="tfNext">${S.lives <= 0 || S.i >= S.items.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>` : ''}`;
  },
  after() { if (!S.end && S.ans == null) tfTick(); },
  key(e) {
    if (S.end) return;
    if (S.ans == null && (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'f')) tfAnswer(false);
    else if (S.ans == null && (e.key === 'ArrowRight' || e.key.toLowerCase() === 'v')) tfAnswer(true);
    else if (S.ans != null && e.key === 'Enter') ACT.tfNext();
  },
};
function tfTick() {
  if (S.timer) return;
  const t0 = Date.now(), start = S.left;
  S.timer = every(() => {
    S.left = Math.max(0, start - (Date.now() - t0) / 1000);
    const bar = document.querySelector('#tbar>i'); if (bar) bar.style.width = (100 * S.left) / S.T + '%';
    const tb = document.getElementById('tbar'); if (tb) tb.classList.toggle('low', S.left <= 5);
    const sec = document.getElementById('tsec'); if (sec) sec.textContent = Math.ceil(S.left) + ' s';
    if (S.left <= 0) tfAnswer(null);
  }, 250);
}
function tfStop() { if (S.timer) { clearInterval(S.timer); timers.delete(S.timer); S.timer = null; } }
function tfAnswer(v) {
  if (S.ans != null || S.end) return;
  tfStop();
  const it = S.items[S.i];
  const ok = v === it.a;
  S.ans = v === null ? 'time' : v;
  S.okNow = ok;
  if (ok) { S.ok++; addXP(XP.tf); } else { S.lives--; S.lost++; S.missed.push(it); buzz(70); }
  rerender();
}
ACT.tfAns = d => tfAnswer(d.v === '1');
ACT.tfNext = () => {
  const p = cur().p;
  if (S.lives <= 0 || S.i >= S.items.length - 1) {
    S.end = true;
    if (S.lives > 0) {
      const x = tp(p.t);
      x.tf = Math.max(x.tf, pct(S.ok, S.items.length));
      award('first');
      if (S.lost === 0) award('nomob');
      save();
    }
    render(true);
    return;
  }
  S.i++; S.ans = null; S.left = S.T;
  rerender();
};
function tfEnd(t) {
  const alive = S.lives > 0;
  return `<div class="result"><div class="flag pop">${flagSvg(alive ? 'C' : 'O')}</div>
<h2>${alive ? (S.lost === 0 ? 'Nadie al agua' : 'Etapa superada') : '¡Hombre al agua!'}</h2>
<div class="big">${S.ok}<small>/${S.items.length}</small></div>
<p class="muted">${alive ? `Llegas a puerto con ${plural(S.lives, 'aro', 'aros')} salvavidas.` : 'Has perdido los tres aros. Repasa la carta y vuelve a intentarlo.'}</p></div>
${missedList(S.missed.map(it => `<b>${it.a ? 'Verdadero' : 'Falso'}:</b> ${it.s}<br><span class="muted">${it.e}</span>`))}
${endButtons(t, alive ? 'pairs' : null, 'Amarres', alive ? '' : `<button class="btn ghost wide" data-act="stage" data-v="lesson" data-t="${t}">Volver a la carta</button>`)}`;
}
function missedList(rows) {
  if (!rows.length) return '';
  return `<div class="label">Para repasar</div><div class="panel"><ul class="list prose">${rows.map(r => `<li style="display:block">${r}</li>`).join('')}</ul></div>`;
}

/* --- Amarres (unir parejas) --- */
VIEWS.pairs = {
  tab: 'home',
  title: p => `Tema ${p.t} · Amarres`,
  render(p) {
    if (!S.sets) { Object.assign(S, { sets: shuffle(TOPIC[p.t].pairs).slice(0, 4), si: 0, totalMiss: 0 }); setupSet(); }
    if (S.end) return pairsEnd(p.t);
    const set = S.sets[S.si];
    const tile = (side, key, text, done, sel, no) => `<button class="tile ${done ? 'done' : ''} ${sel ? 'sel' : ''} ${no ? 'no' : ''}" data-act="pair${side}" data-k="${key}" ${done ? 'disabled' : ''}>${text}</button>`;
    return `
<div class="prog"><span>Juego ${S.si + 1}/${S.sets.length}</span><div class="bar"><i style="width:${pct(S.si, S.sets.length)}%"></i></div><span>${plural(S.totalMiss, 'fallo', 'fallos')}</span></div>
<p class="q">${set.title}</p>
<p class="small muted" style="margin:-8px 0 12px">Toca un elemento de cada columna para amarrarlos.</p>
<div class="pairs"><div class="col">${S.left.map(x => tile('L', x.i, x.t, S.doneL[x.i], S.selL === x.i, S.flash && S.flash.l === x.i)).join('')}</div>
<div class="col">${S.right.map((x, j) => tile('R', j, x.t, S.doneR[j], S.selR === j, S.flash && S.flash.r === j)).join('')}</div></div>`;
  },
};
function setupSet() {
  const set = S.sets[S.si];
  S.left = shuffle(set.items.map((x, i) => ({ i, t: x[0] })));
  S.right = shuffle(set.items.map((x, i) => ({ i, t: x[1] })));
  Object.assign(S, { doneL: {}, doneR: {}, selL: null, selR: null, flash: null, miss: 0, lock: false });
}
ACT.pairL = d => { if (S.lock) return; S.selL = +d.k; S.flash = null; tryPair(); };
ACT.pairR = d => { if (S.lock) return; S.selR = +d.k; S.flash = null; tryPair(); };
function tryPair() {
  if (S.selL == null || S.selR == null) return rerender();
  const set = S.sets[S.si];
  if (S.right[S.selR].t === set.items[S.selL][1]) {
    S.doneL[S.selL] = true; S.doneR[S.selR] = true; S.selL = S.selR = null; buzz(15);
    if (Object.keys(S.doneL).length === set.items.length) {
      S.lock = true;
      addXP(XP.pairSet, 'amarre completo');
      rerender();
      later(() => {
        if (S.si < S.sets.length - 1) { S.si++; setupSet(); rerender(); return; }
        const x = tp(cur().p.t); x.pairs = 1; award('first');
        if (S.totalMiss === 0) award('knot');
        save(); S.end = true; render(true);
      }, 750);
      return;
    }
  } else {
    S.miss++; S.totalMiss++; S.flash = { l: S.selL, r: S.selR }; S.selL = S.selR = null; buzz(70);
  }
  rerender();
}
function pairsEnd(t) {
  return `<div class="result"><div class="flag pop">${flagSvg('K')}</div><h2>${S.totalMiss === 0 ? 'Nudo perfecto' : 'Todo amarrado'}</h2>
<div class="big">${S.sets.length}<small> juegos</small></div><p class="muted">${S.totalMiss === 0 ? 'Sin un solo fallo.' : `Con ${plural(S.totalMiss, 'fallo', 'fallos')} por el camino.`}</p></div>
${endButtons(t, 'cloze', 'Cifras clave')}`;
}

/* --- Cifras clave (completar el dato) --- */
VIEWS.cloze = {
  tab: 'home',
  title: p => `Tema ${p.t} · Cifras clave`,
  render(p) {
    if (!S.items) Object.assign(S, { items: shuffle(TOPIC[p.t].cloze).slice(0, 10).map(c => { const order = shuffle([0, 1, 2, 3]); return { c, order, ans: order.indexOf(c.a), pick: null }; }), i: 0, ok: 0 });
    if (S.end) return clozeEnd(p.t);
    const it = S.items[S.i];
    const done = it.pick != null;
    const blank = `<span class="blank ${done ? 'ok' : ''}">${done ? esc(it.c.o[it.c.a]) : '&nbsp;?&nbsp;'}</span>`;
    return `
<div class="prog"><span>${S.i + 1}/${S.items.length}</span><div class="bar"><i style="width:${pct(S.i + (done ? 1 : 0), S.items.length)}%"></i></div><span>${S.ok} ✓</span></div>
<div class="cloze">${it.c.s.replace('___', blank)}</div>
<div class="chips">${it.order.map((oi, j) => {
  let cls = ''; if (done) cls = j === it.ans ? 'ok' : j === it.pick ? 'bad' : 'dim';
  return `<button class="opt ${cls}" data-act="clozeAns" data-j="${j}" ${done ? 'disabled' : ''}>${esc(it.c.o[oi])}</button>`;
}).join('')}</div>
${done ? `<button class="btn wide" style="margin-top:14px" data-act="clozeNext">${S.i >= S.items.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>` : ''}`;
  },
  key(e) {
    if (S.end) return;
    const it = S.items[S.i];
    if (it.pick == null && /^[1-4]$/.test(e.key)) ACT.clozeAns({ j: String(+e.key - 1) });
    else if (it.pick != null && e.key === 'Enter') ACT.clozeNext();
  },
};
ACT.clozeAns = d => {
  const it = S.items[S.i];
  if (it.pick != null) return;
  it.pick = +d.j;
  if (it.pick === it.ans) { S.ok++; addXP(XP.cloze); } else buzz(70);
  rerender();
};
ACT.clozeNext = () => {
  if (S.i < S.items.length - 1) { S.i++; rerender(); return; }
  const t = cur().p.t;
  const sc = pct(S.ok, S.items.length);
  const x = tp(t); x.cloze = Math.max(x.cloze, sc);
  if (sc >= 60) award('first');
  save(); S.end = true; render(true);
};
function clozeEnd(t) {
  const sc = pct(S.ok, S.items.length);
  const missed = S.items.filter(it => it.pick !== it.ans);
  return `<div class="result"><div class="flag pop">${flagSvg(sc >= 60 ? 'C' : 'N')}</div><h2>${sc >= 60 ? 'Cifras en la bitácora' : 'Hay que afinar'}</h2>
<div class="big">${S.ok}<small>/${S.items.length}</small></div><p class="muted">${sc >= 60 ? 'Etapa superada.' : 'Necesitas un 60 % para superar la etapa.'}</p></div>
${missedList(missed.map(it => it.c.s.replace('___', `<b>${esc(it.c.o[it.c.a])}</b>`)))}
${endButtons(t, sc >= 60 ? 'exam' : null, 'Examen del tema')}`;
}

/* --- Motor de preguntas tipo test con corrección inmediata (examen del tema y repaso) --- */
function optBtn(it, j, act, reveal) {
  const oi = it.order[j];
  let cls = '';
  if (reveal) cls = j === it.ans ? 'ok' : j === it.pick ? 'bad' : 'dim';
  else if (it.pick === j) cls = 'sel';
  return `<button class="opt ${cls}" data-act="${act}" data-j="${j}" ${reveal ? 'disabled' : ''}><span class="l">${'ABCD'[j]}</span><span>${esc(it.q.o[oi])}</span></button>`;
}
function qTag(q) {
  return q.src === 'oficial' ? `<span class="tag">Oficial · ${esc(q.convName)}</span>` : '<span class="tag off">Práctica</span>';
}
function learnQuiz() {
  const it = S.items[S.i];
  const done = it.pick != null;
  const ok = done && it.pick === it.ans;
  return `
<div class="prog"><span>${S.i + 1}/${S.items.length}</span><div class="bar"><i style="width:${pct(S.i + (done ? 1 : 0), S.items.length)}%"></i></div><span>${S.ok} ✓</span></div>
<div class="qmeta">${qTag(it.q)}<span class="tag off">Tema ${it.q.t}</span></div>
${avisoHtml(it.q)}<p class="q">${esc(it.q.q)}</p>
${it.order.map((_, j) => optBtn(it, j, 'qAns', done)).join('')}
${done ? `<div class="fb ${ok ? '' : 'bad'}" id="fb" aria-live="polite"><span class="h">${ok ? 'Correcto' : `Incorrecto · la buena es la ${'ABCD'[it.ans]}`}</span>${it.q.e || ''}</div>
<button class="btn wide" style="margin-top:12px" data-act="qNext">${S.i >= S.items.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>` : ''}`;
}
function learnKey(e) {
  if (S.end || !S.items) return;
  const it = S.items[S.i];
  const k = e.key.toLowerCase();
  if (it.pick == null && 'abcd'.includes(k) && k.length === 1) ACT.qAns({ j: String('abcd'.indexOf(k)) });
  else if (it.pick != null && e.key === 'Enter') ACT.qNext();
}
ACT.qAns = d => {
  const it = S.items[S.i];
  if (it.pick != null) return;
  it.pick = +d.j;
  const ok = it.pick === it.ans;
  if (ok) S.ok++; else buzz(70);
  leitner(it.q.id, ok);
  if (S.kind === 'review') P.st.rev++;
  if (ok) addXP(S.kind === 'review' ? XP.rev : XP.quiz); else save();
  rerender();
  const fb = document.getElementById('fb');
  if (fb && fb.getBoundingClientRect().bottom > window.innerHeight) fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
ACT.qNext = () => {
  if (S.i < S.items.length - 1) { S.i++; render(true); return; }
  S.end = true;
  if (S.kind === 'topic') examFinish(cur().p.t);
  else { checkBadges(); save(); }
  render(true);
};
function quizReview(items) {
  const bad = items.filter(it => it.pick !== it.ans);
  if (!bad.length) return '';
  return `<div class="label">Repasa tus fallos</div>` + bad.map(it => `<div class="panel"><div class="qmeta" style="margin-top:0">${qTag(it.q)}</div>${avisoHtml(it.q)}<p class="q" style="font-size:15.5px">${esc(it.q.q)}</p>
<p class="small" style="margin:0 0 6px">${it.pick != null ? `<span style="color:var(--bad)">Tu respuesta: ${esc(it.q.o[it.order[it.pick]])}</span><br>` : '<span class="muted">Sin responder</span><br>'}<span style="color:var(--ok)"><b>Correcta: ${esc(it.q.o[it.q.a])}</b></span></p>
<div class="small muted">${it.q.e || ''}</div></div>`).join('');
}

/* --- Examen del tema --- */
VIEWS.exam = {
  tab: 'home',
  title: p => `Tema ${p.t} · Examen`,
  render(p) {
    if (!S.items) {
      const pool = BYT[p.t] || [];
      const off = pool.filter(q => q.src === 'oficial');
      const pr = shuffle(pool.filter(q => q.src === 'practica')).slice(0, 8);
      Object.assign(S, { kind: 'topic', items: shuffle(off.concat(pr)).map(q => present(q)), i: 0, ok: 0 });
    }
    if (S.end) return examEnd(p.t);
    return learnQuiz();
  },
  key: learnKey,
};
function examFinish(t) {
  const sc = pct(S.ok, S.items.length);
  const x = tp(t);
  const was = x.exam >= 60, prevStars = x.stars || 0, st = starsFor(sc);
  x.exam = Math.max(x.exam, sc);
  x.stars = Math.max(prevStars, st);
  S.score = sc; S.st = st;
  if (sc >= 60) award('first');
  if (sc >= 60 && !was) addXP(XP.firstPass, 'tema aprobado');
  if (st === 3 && prevStars < 3) { addXP(XP.threeStars, 'tres estrellas'); award('stars3'); }
  checkBadges();
  save();
}
function examEnd(t) {
  const sc = S.score, pass = sc >= 60;
  const nextT = t < 19 ? t + 1 : null;
  return `<div class="result"><div class="flag pop">${topicFlag(t)}</div>
<h2>${pass ? (S.st === 3 ? 'Examen perfecto' : 'Tema aprobado') : 'Todavía no'}</h2>
<div class="big">${S.ok}<small>/${S.items.length}</small></div>
<div class="stars" style="margin-top:6px">${starsHtml(S.st)}</div>
<span class="verdict ${pass ? 'ok' : 'bad'}">${sc} %</span>
<p class="muted">${pass ? 'Más del 60 %, como en el examen real.' : 'Necesitas un 60 % (18 de 30 en el examen real). Repasa los fallos y vuelve a intentarlo.'}</p></div>
${quizReview(S.items)}
<div class="stack" style="margin-top:16px">${pass && nextT ? `<button class="btn wide" data-act="topicJump" data-t="${nextT}">Siguiente tema: ${esc(TOPIC[nextT].title)}</button>` : ''}
${pass && !nextT ? '<button class="btn wide" data-act="tab" data-v="simMenu">Haz un examen oficial completo</button>' : ''}
<button class="btn ${pass ? 'ghost' : ''} wide" data-act="retry">Repetir examen</button>
<button class="btn ghost wide" data-act="back">Volver al tema</button></div>`;
}
