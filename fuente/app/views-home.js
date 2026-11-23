/* ===== Ruta, tema y lección ===== */
const BOE_LINKS = {
  1: [['TRLPEMM (RDL 2/2011)', 'BOE-A-2011-16467']],
  2: [['Ley 14/2014 de Navegación Marítima', 'BOE-A-2014-7877']],
  3: [['TRLPEMM', 'BOE-A-2011-16467'], ['RD 253/2024', 'BOE-A-2024-4865'], ['RD 1009/2023', 'BOE-A-2023-24842']],
  4: [['TRLPEMM', 'BOE-A-2011-16467'], ['RD 638/2007', 'BOE-A-2007-10951']],
  5: [['RD 186/2023', 'BOE-A-2023-7410']],
  6: [['RD 210/2004', 'BOE-A-2004-2752'], ['RD 1837/2000', 'BOE-A-2000-21432']],
  7: [['RD 62/2008', 'BOE-A-2008-2112']],
  8: [['RD 1435/2010', 'BOE-A-2010-17038'], ['RD 685/2010', 'BOE-A-2010-9713']],
  9: [['RD 607/1999', 'BOE-A-1999-9655']],
  10: [['RD 875/2014', 'BOE-A-2014-10344'], ['RD 269/2022', 'BOE-A-2022-6047']],
  11: [['RD 1434/1999', 'BOE-A-1999-18663']],
  12: [['RD 339/2021', 'BOE-A-2021-8268']],
  13: [['RD 98/2016', 'BOE-A-2016-2578']],
  14: [['TRLPEMM (SASEMAR)', 'BOE-A-2011-16467']],
  15: [['Ley 14/2014 de Navegación Marítima', 'BOE-A-2014-7877']],
  16: [['Código Civil', 'BOE-A-1889-4763']],
  17: [['RD 128/2022', 'BOE-A-2022-2465']],
  18: [['MARPOL, anexo V revisado', 'BOE-A-2012-14852', 'doc']],
  19: [['RD 1185/2006', 'BOE-A-2006-18968']],
};
const boeUrl = (id, kind) => `https://www.boe.es/buscar/${kind === 'doc' ? 'doc' : 'act'}.php?id=${id}`;
const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

VIEWS.home = {
  title: 'Rumbo al PPER',
  render() {
    const dte = keyToNum(EXAM.date) - today();
    const r = rankOf(P.xp);
    const passed = TOPICS.filter(t => topicPassed(t.id)).length;
    const nt = nextTopic();
    const st = streak();
    const from = keyToNum(EXAM.enrolFrom), to = keyToNum(EXAM.enrolTo), d0 = today();
    const longDate = fmtDate(EXAM.date, { weekday: 'long', day: 'numeric', month: 'long' });
    let count;
    if (EXAM.approx && dte > 1) count = `<span class="n">≈${dte}</span><span class="t">días para el próximo examen<br><b>${fmtDate(EXAM.date, { month: 'long', year: 'numeric' })}</b> · fecha aproximada</span>`;
    else if (dte > 1) count = `<span class="n">${dte}</span><span class="t">días para el examen<br><b>${longDate}</b> · Madrid</span>`;
    else if (dte === 1) count = `<span class="n">1</span><span class="t">día: el examen es <b>mañana</b><br>${longDate} · Madrid</span>`;
    else if (dte === 0) count = `<span class="n">0</span><span class="t"><b>Hoy es el examen.</b><br>Buen viento y mar llana.</span>`;
    else count = `<span class="t"><b>La convocatoria del ${longDate} ya pasó.</b><br>Sigue entrenando para la próxima.</span>`;
    let enrol = '';
    if (EXAM.approx) enrol = `<span class="tag warn">Sin fecha oficial todavía</span> <button class="link small" data-act="tab" data-v="info">Dónde consultarla ›</button>`;
    else if (d0 < from) enrol = `<span class="tag warn">Matrícula del ${fmtDate(EXAM.enrolFrom, { day: 'numeric', month: 'long' })} al ${fmtDate(EXAM.enrolTo, { day: 'numeric', month: 'long' })}</span>`;
    else if (d0 <= to) enrol = `<span class="tag">Matrícula abierta hasta el ${fmtDate(EXAM.enrolTo, { day: 'numeric', month: 'long' })}</span>`;
    const w = (a, b) => Math.min(100, pct(a, b));
    const ns = nt ? nextStage(nt) : null;
    const cont = nt ? `Tema ${nt} · ${STAGES.find(s => s.k === ns).name}` : 'Todos los temas aprobados';
    return `
<section class="hero">
  ${ICONS.rose}
  <div class="count">${count}</div>
  ${enrol ? `<p class="small" style="margin:10px 0 0">${enrol}</p>` : ''}
  <div class="logbook">
    <div><span class="k">Millas</span><div class="v">${nf(P.xp)} <small>/ 2.500</small></div><div class="bar"><i style="width:${w(P.xp, GOAL.miles)}%"></i></div></div>
    <div><span class="k">Días de mar</span><div class="v">${seaDays()} <small>/ 50</small></div><div class="bar"><i style="width:${w(seaDays(), GOAL.days)}%"></i></div></div>
    <div><span class="k">Travesías</span><div class="v">${trips()} <small>/ 5</small></div><div class="bar"><i style="width:${w(trips(), GOAL.trips)}%"></i></div></div>
  </div>
  <div class="rank"><span class="tag">${r.name}</span><span class="muted small grow">${r.next ? `${nf(r.next[0] - P.xp)} millas para ${r.next[1]}` : 'Registro de millas completo'}</span><span class="small">Racha <b>${st}</b> ${st === 1 ? 'día' : 'días'}</span></div>
</section>
${introPanel()}
<div class="quick">
  <button data-act="continue"><b>Continuar</b><span>${cont}</span></button>
  <button data-act="tab" data-v="review"><b>Test por temas</b><span>Solo preguntas oficiales</span></button>
  <button data-act="tab" data-v="claves"><b>Claves</b><span>Lo que siempre cae</span></button>
  <button data-act="tab" data-v="simMenu"><b>Exámenes reales</b><span>${DATA.replicas.length} convocatorias completas</span></button>
</div>
<div class="label">La ruta · ${passed}/19 temas aprobados</div>
<nav class="route" aria-label="Temas">
${TOPICS.map(t => {
  const L = LETTERS[t.id - 1];
  const x = tpr(t.id);
  return `<button class="wp ${t.id === nt ? 'next' : ''}" data-act="go" data-v="topic" data-t="${t.id}">
    <span class="fl">${topicFlag(t.id)}</span>
    <span><span class="k">WP ${pad(t.id)} · ${FLAG_INFO[L][0]}</span><span class="ti">${esc(t.title)}</span>
    <span class="me">${starsHtml(x.stars || 0)}<span class="dots" aria-label="${stagesDone(t.id)} de 5 etapas">${STAGES.map(s => `<i class="${stageDone(t.id, s.k) ? 'on' : ''}"></i>`).join('')}</span>${t.id === nt ? '<span class="tag">Siguiente rumbo</span>' : ''}</span></span>
    <span class="chev" aria-hidden="true">›</span></button>`;
}).join('')}
</nav>
<p class="foot">Contenidos según el temario del BOE de 20-7-2026 y la normativa vigente.<br>Preguntas oficiales: ${DATA.replicas.length} exámenes de la DGMM, de octubre de 2017 a noviembre de 2026.</p>`;
  },
};
ACT.continue = () => {
  const nt = nextTopic();
  if (!nt) return go('simMenu');
  const ns = nextStage(nt) || 'exam';
  leave(() => {
    clearTimers(); S = {};
    NAV.stack = [{ v: 'home', p: {} }, { v: 'topic', p: { t: nt } }, { v: ns, p: { t: nt } }];
    render(true);
  });
};
ACT.introOk = () => { P.intro = 2; save(); rerender(); };
function introPanel() {
  if ((P.intro || 0) >= 2) return '';
  return `<div class="panel" style="margin-top:16px"><b style="font-size:17px">Cómo se navega esta app</b>
<ul class="prose small" style="margin:8px 0 0;padding-left:18px">
<li><b>Ruta:</b> los <b>19 temas</b> del examen, cada uno con su bandera del Código de Señales. Cada tema tiene <b>5 etapas</b>: fichas, verdadero o falso contra el reloj, parejas, cifras clave y un examen. Se aprueba con un 60 %.</li>
<li><b>Claves:</b> qué cae en cada número de pregunta del examen, los datos que más se repiten y las preguntas que ya han salido varias veces. Empieza por aquí si vas con poco tiempo.</li>
<li><b>Repaso:</b> un test por tema, solo con preguntas oficiales vigentes.</li>
<li><b>Simulacro:</b> los exámenes oficiales completos, de 2017 a noviembre de 2026, con su tiempo y su corrección.</li>
<li><b>Bitácora:</b> tu progreso. Lo que aciertas suma <b>millas</b>; un día con 50 o más es un <b>día de mar</b> y cada examen aprobado, una <b>travesía</b>.</li>
<li><b>Examen:</b> fecha de la próxima convocatoria, cómo es la prueba y dónde consultar las novedades.</li>
</ul>
<button class="btn wide" style="margin-top:12px" data-act="introOk">Entendido, a navegar</button></div>`;
}

VIEWS.topic = {
  tab: 'home',
  title: p => `Tema ${p.t}`,
  render(p) {
    const t = TOPIC[p.t];
    const L = LETTERS[p.t - 1];
    const pool = BYT[p.t] || [];
    const of = pool.filter(q => q.src === 'oficial').length;
    const links = (BOE_LINKS[p.t] || []).map(([n, id, k]) => ext(boeUrl(id, k), esc(n))).join(' · ');
    const nextT = p.t < 19 ? p.t + 1 : null;
    return `
<div class="thead"><div class="flag">${topicFlag(p.t)}</div><div class="grow"><h2>${esc(t.title)}</h2><div class="law">${esc(t.law)}</div></div></div>
<p class="signal"><b>${FLAG_INFO[L][0]}</b> en el Código de Señales: «${FLAG_INFO[L][1]}»</p>
${t.update ? `<div class="notice"><b>Aviso a los navegantes</b>${t.update}</div>` : ''}
<div class="prose" style="margin-top:14px"><p>${t.intro}</p></div>
<dl class="dl small">
  <dt>Entra</dt><dd style="font-weight:500">${t.scope}</dd>
  <dt>Material</dt><dd style="font-weight:500">${t.cards.length} fichas · ${of} preguntas oficiales · ${pool.length - of} de práctica</dd>
  <dt>En el examen</dt><dd style="font-weight:500">${plural(t.weight, 'pregunta', 'preguntas')} de 30 (según las convocatorias publicadas)</dd>
  <dt>BOE</dt><dd style="font-weight:500">${links}</dd>
</dl>
<div class="label">Etapas</div>
${STAGES.map((s, i) => stageBtn(p.t, s, i)).join('')}
${nextT ? `<button class="btn ghost wide" style="margin-top:6px" data-act="topicJump" data-t="${nextT}">Tema ${nextT}: ${esc(TOPIC[nextT].title)} ›</button>` : ''}`;
  },
};
function stageBtn(t, s, i) {
  const done = stageDone(t, s.k);
  const x = tpr(t);
  const T = TOPIC[t];
  let meta = s.sub;
  if (s.k === 'lesson') meta = `${seenCount(t)} de ${T.cards.length} fichas leídas`;
  if (s.k === 'tf' && x.tf >= 0) meta += ` · mejor ${x.tf} %`;
  if (s.k === 'pairs' && x.pairs) meta += ' · completado';
  if (s.k === 'cloze' && x.cloze >= 0) meta += ` · mejor ${x.cloze} %`;
  if (s.k === 'exam' && x.exam >= 0) meta = `Mejor nota ${x.exam} % ${starsHtml(x.stars || 0)}`;
  return `<button class="stage ${done ? 'done' : ''}" data-act="go" data-v="${s.k}" data-t="${t}"><span class="n">${done ? '✓' : i + 1}</span><span class="grow"><b>${s.name}</b><span class="s">${meta}</span></span><span class="muted" aria-hidden="true">›</span></button>`;
}
ACT.topicJump = d => {
  while (NAV.stack.length > 2 && cur().v !== 'topic') NAV.stack.pop();
  swap('topic', { t: +d.t });
};
ACT.stage = d => swap(d.v, { t: +d.t });
ACT.retry = () => { clearTimers(); S = {}; render(true); };

/* --- Lección: fichas --- */
VIEWS.lesson = {
  tab: 'home',
  title: p => `Tema ${p.t} · Carta náutica`,
  render(p) {
    const t = TOPIC[p.t];
    const n = t.cards.length;
    if (S.end) return lessonEnd(p.t);
    if (S.i == null) {
      const seen = tpr(p.t).seen || '';
      let i = 0; while (i < n && seen[i] === '1') i++;
      S.i = i >= n ? 0 : i;
    }
    if (S.list) {
      return `<div class="prog"><span>${n} fichas</span><span class="grow"></span><button class="chip" data-act="lessonList">Ficha a ficha</button></div>` +
        t.cards.map((c, i) => cardHtml(c, i, n, true)).join('') +
        `<button class="btn wide" style="margin-top:16px" data-act="lessonList">Volver a ficha a ficha</button>`;
    }
    const c = t.cards[S.i];
    return `
<div class="prog"><span>${S.i + 1}/${n}</span><div class="bar"><i style="width:${pct(S.i + 1, n)}%"></i></div><button class="chip" data-act="lessonList">Ver todas</button></div>
${cardHtml(c, S.i, n)}
<div class="btnrow"><button class="btn ghost" data-act="lessonPrev" ${S.i === 0 ? 'disabled' : ''}>Anterior</button><button class="btn" data-act="lessonNext">${S.i === n - 1 ? 'Terminar' : 'Siguiente'}</button></div>
<p class="small muted" style="text-align:center;margin-top:10px">Desliza la ficha a izquierda o derecha para avanzar o volver.</p>`;
  },
  after(p) {
    if (S.end || S.list) return;
    markSeen(p.t, S.i);
    const el = document.getElementById('lcard');
    if (!el) return;
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? ACT.lessonNext : ACT.lessonPrev)();
    });
  },
  key(e) {
    if (S.end || S.list) return;
    if (e.key === 'ArrowRight') ACT.lessonNext();
    if (e.key === 'ArrowLeft') ACT.lessonPrev();
  },
};
function cardHtml(c, i, n, list) {
  return `<article class="lcard ${list ? 'list' : ''}" ${list ? '' : 'id="lcard"'}>
  ${list ? `<div class="mono muted" style="margin-bottom:4px">${i + 1}/${n}</div>` : ''}
  <h3>${c.t}</h3>
  <div class="body">${c.b}</div>
  ${c.tip ? `<div class="tip">${flagSvg('L', 'Atención')}<span><b>Ojo al examen.</b> ${c.tip}</span></div>` : ''}
  ${c.ref ? `<div class="ref">${esc(c.ref)}</div>` : ''}
</article>`;
}
function markSeen(t, i) {
  const n = TOPIC[t].cards.length;
  const x = tp(t);
  let s = (x.seen || '').padEnd(n, '0');
  if (s[i] === '1') return;
  x.seen = s.slice(0, i) + '1' + s.slice(i + 1);
  addXP(XP.card);
}
ACT.lessonNext = () => {
  const p = cur().p;
  const n = TOPIC[p.t].cards.length;
  if (S.i < n - 1) { S.i++; rerender(); window.scrollTo(0, 0); return; }
  const x = tp(p.t);
  x.lesson = 1;
  award('first');
  if (seenCount(p.t) >= n) award('chart');
  save();
  S.end = true;
  render(true);
};
ACT.lessonPrev = () => { if (S.i > 0) { S.i--; rerender(); window.scrollTo(0, 0); } };
ACT.lessonList = () => { S.list = !S.list; render(true); };
ACT.lessonRestart = () => { S = { i: 0 }; render(true); };
function lessonEnd(t) {
  const n = TOPIC[t].cards.length;
  const seen = seenCount(t);
  return `<div class="result"><div class="flag pop">${topicFlag(t)}</div><h2>Carta leída</h2>
<p class="muted">${seen >= n ? `Has leído las ${n} fichas del tema ${t}.` : `Llevas ${seen} de ${n} fichas leídas.`} Ahora, a ponerlo a prueba.</p></div>
<div class="stack"><button class="btn wide" data-act="stage" data-v="tf" data-t="${t}">Siguiente etapa: Babor o estribor</button>
<button class="btn ghost wide" data-act="lessonRestart">Repasar las fichas desde el principio</button></div>`;
}
