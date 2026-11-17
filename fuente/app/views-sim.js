/* ===== Simulacro, exámenes oficiales y repaso espaciado ===== */
const convName = c => (DATA.replicas.find(r => r.conv === c) || {}).name || c;
const fmtClock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
function buildSim(conv) {
  if (conv) {
    const r = DATA.replicas.find(x => x.conv === conv);
    return r.ids.filter(id => QBY[id]).map(id => present(QBY[id], true));
  }
  const items = [];
  for (const t of TOPICS) {
    const pool = BYT[t.id] || [];
    const off = shuffle(pool.filter(q => q.src === 'oficial'));
    const pr = shuffle(pool.filter(q => q.src === 'practica'));
    for (let k = 0; k < t.weight; k++) {
      const q = (off.length && (Math.random() < 0.5 || !pr.length)) ? off.pop() : pr.pop();
      if (q) items.push(present(q));
    }
  }
  return items;
}
function simBest(conv) {
  const s = P.sims.filter(x => x.m === conv);
  return s.length ? Math.max(...s.map(x => x.s)) : null;
}

VIEWS.simMenu = {
  title: 'Simulacro',
  render() {
    const hist = P.sims.slice(-10).reverse();
    return `
<div class="panel" style="margin-top:16px"><div class="row"><div class="flag" style="width:54px;height:36px">${flagSvg('P')}</div><div class="grow"><b>Simulacro de examen</b><div class="small muted">${EXAM.questions} preguntas · ${EXAM.minutes} minutos · ${EXAM.pass} aciertos para aprobar. Oficiales y de práctica, repartidas por temas como en las convocatorias.</div></div></div>
<button class="btn mag wide" style="margin-top:14px" data-act="go" data-v="sim">Zarpar</button></div>
<div class="label">Exámenes oficiales</div>
${DATA.replicas.map(r => {
  const b = simBest(r.conv);
  return `<button class="stage ${b != null && b >= EXAM.pass ? 'done' : ''}" data-act="go" data-v="sim" data-c="${r.conv}"><span class="n" style="font-size:12px;font-style:normal;font-family:var(--f-mono)">${b != null && b >= EXAM.pass ? '✓' : r.name.slice(0, 3)}</span><span class="grow"><b>${esc(r.name)}</b><span class="s">Test 0${r.test || 1} · ${r.ids.length} preguntas${r.ids.length < 30 ? ' (sin las anuladas)' : ''}${(n => n ? ` · <span class="avc">${n} con aviso</span>` : '')(r.ids.filter(id => QBY[id] && QBY[id].av && QBY[id].av.n !== 'fuera').length)}${b != null ? ` · mejor ${b}/${r.ids.length}` : ''}</span></span><span class="muted" aria-hidden="true">›</span></button>`;
}).join('')}
<p class="small muted">Convocatorias de 2017 a 2026 publicadas por la Dirección General de la Marina Mercante, con su plantilla oficial de respuestas. Cada una publicó dos modelos con las mismas preguntas en distinto orden; aquí tienes uno tal cual se examinó (el 02 en diciembre de 2020, porque del 01 no se conserva la plantilla). Faltan octubre de 2022, abril y noviembre de 2023 y marzo de 2017, que ya no se encuentran o no tienen respuestas publicadas.</p>
<p class="small muted">Las preguntas de normas que han cambiado desde entonces llevan un aviso: <b class="avk derogada">rojo</b> si la respuesta puede no valer hoy, <b class="avk ojo">ámbar</b> si la norma cambió pero la respuesta sigue valiendo y <b class="avk fuera">gris</b> si ya no está en el temario de 2026.</p>
<div class="label">Historial</div>
${hist.length ? `<div class="panel"><ul class="list">${hist.map(s => `<li><span class="grow"><b>${s.m === 'sim' ? 'Simulacro' : 'Examen ' + esc(convName(s.m))}</b><br><span class="small muted">${fmtDate(s.d, { day: 'numeric', month: 'short' })} · ${Math.round(s.sec / 60)} min</span></span><span class="mono">${s.s}/${s.n}</span><span class="tag ${s.s >= EXAM.pass ? 'ok' : 'off'}">${s.s >= EXAM.pass ? 'Apto' : 'No apto'}</span></li>`).join('')}</ul></div>` : '<p class="muted small">Todavía no has hecho ningún simulacro.</p>'}`;
  },
};

VIEWS.sim = {
  tab: 'simMenu',
  title: p => (p.c ? 'Examen ' + convName(p.c) : 'Simulacro'),
  render(p) {
    if (!S.items) Object.assign(S, { items: buildSim(p.c), i: 0, started: false, conv: p.c || null });
    if (S.res) return simResult(p);
    if (!S.started) return simIntro(p);
    return simQuestion();
  },
  key(e) {
    if (!S.started || S.res) return;
    const k = e.key.toLowerCase();
    if (k.length === 1 && 'abcd'.includes(k)) ACT.simPick({ j: String('abcd'.indexOf(k)) });
    else if (e.key === 'ArrowRight') ACT.simNext();
    else if (e.key === 'ArrowLeft') ACT.simPrev();
  },
};
function simIntro(p) {
  return `<div class="result"><div class="flag pop">${flagSvg('P')}</div><h2>${p.c ? 'Convocatoria de ' + esc(convName(p.c)) : 'Simulacro'}</h2>
<p class="muted">${p.c ? `Las ${S.items.length} preguntas del test 0${(DATA.replicas.find(x => x.conv === p.c) || {}).test || 1}, en el orden y con las respuestas del examen original.${S.items.some(x => x.q.av && x.q.av.n !== 'fuera') ? ' Algunas son de normas que han cambiado: llevan un aviso encima del enunciado.' : ''}` : 'Treinta preguntas nuevas cada vez, repartidas por temas con el peso que tienen en el examen.'}</p></div>
<div class="panel"><dl class="dl"><dt>Preguntas</dt><dd>${S.items.length}, con 4 respuestas</dd><dt>Tiempo</dt><dd>${EXAM.minutes} minutos</dd><dt>Para aprobar</dt><dd>${EXAM.pass} aciertos (60 %)</dd><dt>Corrección</dt><dd>${P.instant ? 'Al momento: ves si aciertas en cada pregunta' : 'Al entregar, como en el examen real'}</dd></dl></div>
<div class="row" style="margin-top:14px"><span class="grow">Corrección</span><div class="seg" role="group" aria-label="Corrección">${[[1, 'Al momento'], [0, 'Al entregar']].map(([k, n]) => `<button class="${!!P.instant === !!k ? 'on' : ''}" data-act="simMode" data-k="${k}" aria-pressed="${!!P.instant === !!k}">${n}</button>`).join('')}</div></div>
<button class="btn mag wide" style="margin-top:16px" data-act="simStart">Zarpar</button>`;
}
ACT.simMode = d => { P.instant = d.k === '1'; save(); rerender(); };
ACT.simStart = () => {
  S.started = true;
  S.inst = !!P.instant;
  S.t0 = Date.now();
  S.endAt = S.t0 + EXAM.minutes * 60000;
  S.clock = fmtClock(S.endAt - Date.now());
  S.guard = { title: '¿Abandonar el examen?', text: 'Se perderán las respuestas de este intento.', ok: 'Abandonar', danger: true };
  every(() => {
    const left = S.endAt - Date.now();
    S.clock = fmtClock(left);
    const c = document.getElementById('clock');
    if (c) { c.textContent = S.clock; c.classList.toggle('low', left <= 5 * 60000); }
    if (left <= 0) simSubmit(true);
  }, 1000);
  render(true);
};
function simQuestion() {
  const it = S.items[S.i];
  const n = S.items.length;
  const answered = S.items.filter(x => x.pick != null).length;
  const shown = S.inst && it.pick != null;
  const good = shown && it.pick === it.ans;
  return `
<div class="prog"><span>${S.i + 1}/${n}</span><div class="bar"><i style="width:${pct(answered, n)}%"></i></div><span>${answered} resp.</span></div>
${avisoHtml(it.q)}<p class="q" style="margin-top:14px">${esc(it.q.q)}</p>
${it.order.map((_, j) => optBtn(it, j, 'simPick', shown)).join('')}
${shown ? `<div class="fb ${good ? '' : 'bad'}" id="fb" aria-live="polite"><span class="h">${good ? 'Correcto' : `Incorrecto · la buena es la ${'ABCD'[it.ans]}`}</span>${it.q.e || ''}</div>` : ''}
<div class="btnrow"><button class="btn ghost" data-act="simPrev" ${S.i === 0 ? 'disabled' : ''}>Anterior</button><button class="btn" data-act="simNext" ${S.i === n - 1 ? 'disabled' : ''}>Siguiente</button></div>
<div class="label">Hoja de respuestas</div>
<div class="qgrid">${S.items.map((x, k) => `<button class="${x.pick == null ? '' : !S.inst ? 'ans' : x.pick === x.ans ? 'ok' : 'bad'} ${k === S.i ? 'cur' : ''}${avCls(x.q)}" data-act="simJump" data-k="${k}" aria-label="Pregunta ${k + 1}${x.pick != null ? ', respondida' : ''}">${k + 1}</button>`).join('')}</div>
<button class="btn mag wide" data-act="simAsk">Entregar examen</button>
<p class="small muted" style="text-align:center">${S.inst ? `Llevas ${S.items.filter(x => x.pick != null && x.pick === x.ans).length} de ${answered} acertadas. Con corrección al momento la respuesta no se puede cambiar.` : 'Toca otra vez una respuesta marcada para dejarla en blanco.'}</p>`;
}
ACT.simPick = d => {
  const it = S.items[S.i]; const j = +d.j;
  if (S.inst) {
    if (it.pick != null) return;
    it.pick = j;
    if (j !== it.ans) buzz(70);
    rerender();
    const fb = document.getElementById('fb');
    if (fb && fb.getBoundingClientRect().bottom > window.innerHeight) fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  it.pick = it.pick === j ? null : j; rerender();
};
ACT.simPrev = () => { if (S.i > 0) { S.i--; render(true); } };
ACT.simNext = () => { if (S.i < S.items.length - 1) { S.i++; render(true); } };
ACT.simJump = d => { S.i = +d.k; render(true); };
ACT.simAsk = () => {
  const blank = S.items.filter(x => x.pick == null).length;
  confirmBox({ title: 'Entregar examen', text: blank ? `Te quedan ${plural(blank, 'pregunta', 'preguntas')} sin responder.` : 'Has respondido todas las preguntas.', ok: 'Entregar', cancel: 'Seguir' }, () => simSubmit(false));
};
function simSubmit(auto) {
  if (S.res) return;
  clearTimers();
  S.guard = null;
  S.clock = null;
  const n = S.items.length;
  let ok = 0;
  const byT = {};
  S.items.forEach(it => {
    const good = it.pick === it.ans;
    if (good) ok++;
    leitner(it.q.id, good);
    const b = byT[it.q.t] || (byT[it.q.t] = [0, 0]);
    b[1]++; if (good) b[0]++;
  });
  const secs = Math.min(EXAM.minutes * 60, Math.round((Date.now() - S.t0) / 1000));
  P.sims.push({ d: dayKey(), m: S.conv || 'sim', s: ok, n, sec: secs });
  if (P.sims.length > 80) P.sims = P.sims.slice(-80);
  const firstBad = S.items.findIndex(it => it.pick !== it.ans);
  S.res = { ok, n, secs, byT, auto };
  S.ri = firstBad < 0 ? 0 : firstBad;
  addXP(ok * XP.sim, 'examen');
  if (ok >= EXAM.pass) {
    setTimeout(() => addXP(XP.simPass, 'travesía de altura'), 900);
    award('trip');
    if (S.conv) award('real');
  }
  checkBadges();
  save();
  render(true);
}
function simResult(p) {
  const r = S.res, pass = r.ok >= EXAM.pass;
  const it = S.items[S.ri];
  const topics = Object.keys(r.byT).map(Number).sort((a, b) => a - b);
  return `<div class="result"><div class="flag pop">${flagSvg(pass ? 'C' : 'N')}</div><h2>${pass ? 'Travesía completada' : 'Esta vez, no'}</h2>
<div class="big">${r.ok}<small>/${r.n}</small></div><span class="verdict ${pass ? 'ok' : 'bad'}">${pass ? 'APTO' : 'NO APTO'}</span>
<p class="muted">${r.auto ? 'Se acabó el tiempo. ' : ''}Tiempo: ${Math.floor(r.secs / 60)} min ${r.secs % 60} s. ${pass ? `Margen de ${plural(r.ok - EXAM.pass, 'acierto', 'aciertos')} sobre el aprobado.` : `Te faltaron ${plural(EXAM.pass - r.ok, 'acierto', 'aciertos')}.`}</p></div>
<div class="label">Corrección · toca una casilla</div>
<div class="qgrid">${S.items.map((x, k) => `<button class="${x.pick == null ? 'blank' : x.pick === x.ans ? 'ok' : 'bad'} ${k === S.ri ? 'cur' : ''}${avCls(x.q)}" data-act="simSee" data-k="${k}" aria-label="Pregunta ${k + 1}">${k + 1}</button>`).join('')}</div>
<div class="panel"><div class="qmeta" style="margin-top:0"><span class="tag off">Pregunta ${S.ri + 1}</span>${qTag(it.q)}<span class="tag off">Tema ${it.q.t}</span>${it.pick == null ? '<span class="tag warn">En blanco</span>' : ''}</div>
${avisoHtml(it.q)}<p class="q">${esc(it.q.q)}</p>${it.order.map((_, j) => optBtn(it, j, 'noop', true)).join('')}
<div class="small muted">${it.q.e || ''}</div></div>
<div class="label">Por temas</div>
<div class="panel"><ul class="list">${topics.map(t => `<li><span class="fl">${topicFlag(t)}</span><span class="grow small">${t}. ${esc(TOPIC[t].title)}</span><span class="mono">${r.byT[t][0]}/${r.byT[t][1]}</span></li>`).join('')}</ul></div>
<div class="stack" style="margin-top:16px"><button class="btn wide" data-act="retry">${p.c ? 'Repetir este examen' : 'Otro simulacro'}</button><button class="btn ghost wide" data-act="tab" data-v="simMenu">Volver</button></div>`;
}
ACT.simSee = d => { S.ri = +d.k; rerender(); };
ACT.noop = () => {};

/* --- Repaso espaciado (cajas de Leitner) --- */
VIEWS.review = {
  title: 'Repaso',
  render() {
    const boxes = [0, 0, 0, 0, 0];
    Object.keys(P.L).forEach(id => { if (QBY[id]) boxes[P.L[id][0] - 1]++; });
    const due = dueIds().length;
    const total = boxes.reduce((a, b) => a + b, 0);
    const off = QUESTIONS.filter(q => q.src === 'oficial');
    const offSeen = off.filter(q => P.L[q.id]).length;
    return `
<div class="panel" style="margin-top:16px">
  <div class="row"><div class="grow"><b style="font-size:18px">${due ? plural(due, 'pregunta para hoy', 'preguntas para hoy') : 'Nada pendiente hoy'}</b><div class="small muted">${total ? `${plural(total, 'pregunta', 'preguntas')} en tus cajas` : 'Las preguntas que respondas irán entrando aquí.'}</div></div></div>
  <div class="boxes">${boxes.map((b, i) => `<div><b>${b}</b><span>Caja ${i + 1}</span></div>`).join('')}</div>
  <button class="btn mag wide" style="margin-top:14px" data-act="go" data-v="reviewRun" data-k="due" ${due ? '' : 'disabled'}>Empezar repaso${due ? ` (${Math.min(20, due)})` : ''}</button>
  ${boxes[0] ? `<button class="btn ghost wide" style="margin-top:10px" data-act="go" data-v="reviewRun" data-k="fails">Solo los fallos (${boxes[0]})</button>` : ''}
</div>
<div class="label">Banco de preguntas oficiales</div>
<div class="panel"><div class="row"><div class="flag" style="width:48px;height:32px">${flagSvg('B')}</div><div class="grow"><b>${off.length} preguntas de examen</b><div class="small muted">Has visto ${offSeen}. Tandas de 20, primero las que menos dominas.</div></div></div>
<button class="btn wide" style="margin-top:12px" data-act="go" data-v="reviewRun" data-k="bank">Practicar oficiales</button></div>
<div class="label">Cómo funciona</div>
<div class="prose small muted"><p>Cada pregunta que respondes en los exámenes de tema, simulacros y repasos entra en una de cinco cajas. Si la fallas vuelve a la caja 1 y te la pregunto hoy mismo; si la aciertas sube de caja y tarda más en volver: 1, 3, 7 y 16 días. Así repasas justo lo que se te olvida.</p></div>`;
  },
};
function pickReview(k, t) {
  if (k === 'rep' || k === 'tema' || k === 'doble') {
    const box = q => (P.L[q.id] ? P.L[q.id][0] : 0);
    return shuffle(clavePickIds(k, t)).sort((a, b) => box(a) - box(b)).slice(0, 20);
  }
  if (k === 'bank') {
    const box = q => (P.L[q.id] ? P.L[q.id][0] : 0);
    return shuffle(QUESTIONS.filter(q => q.src === 'oficial')).sort((a, b) => box(a) - box(b)).slice(0, 20);
  }
  const ids = k === 'fails' ? Object.keys(P.L).filter(id => QBY[id] && P.L[id][0] === 1) : dueIds();
  return shuffle(ids).sort((a, b) => P.L[a][0] - P.L[b][0]).slice(0, 20).map(id => QBY[id]);
}
VIEWS.reviewRun = {
  tab: p => (['rep', 'tema', 'doble'].includes(p.k) ? 'claves' : 'review'),
  title: p => (p.k === 'rep' ? 'Las que se repiten' : p.k === 'doble' ? 'Temas que valen 2' : p.k === 'tema' ? 'Oficiales del tema ' + p.t : p.k === 'bank' ? 'Banco oficial' : p.k === 'fails' ? 'Repaso de fallos' : 'Repaso'),
  render(p) {
    if (!S.items) Object.assign(S, { kind: 'review', items: pickReview(p.k, p.t).map(q => present(q)), i: 0, ok: 0 });
    if (!S.items.length) return `<div class="empty">${ICONS.anchor}<p>No hay preguntas pendientes. Vuelve mañana o haz un examen de tema.</p></div>`;
    if (S.end) {
      const sc = pct(S.ok, S.items.length);
      const more = ['bank', 'rep', 'tema', 'doble'].includes(p.k) || (p.k === 'due' ? dueIds().length : Object.keys(P.L).filter(id => P.L[id][0] === 1).length);
      return `<div class="result"><div class="flag pop">${flagSvg(sc >= 60 ? 'C' : 'R')}</div><h2>Repaso terminado</h2><div class="big">${S.ok}<small>/${S.items.length}</small></div><p class="muted">${sc} % de aciertos.</p></div>
${quizReview(S.items)}
<div class="stack" style="margin-top:16px">${more ? '<button class="btn wide" data-act="retry">Otra tanda</button>' : ''}<button class="btn ghost wide" data-act="back">Volver</button></div>`;
    }
    return learnQuiz();
  },
  key: learnKey,
};
