/* ===== Claves: lo que siempre cae, sacado de los exámenes oficiales ===== */
const CLAVE = Object.fromEntries((DATA.claves || []).map(c => [c.t, c]));
const CONV_ORDER = Object.fromEntries(DATA.replicas.map((r, i) => [r.conv, i])); // 0 = más reciente
const byNewest = (a, b) => (CONV_ORDER[a.conv] ?? 99) - (CONV_ORDER[b.conv] ?? 99);
const offOf = t => QUESTIONS.filter(q => q.src === 'oficial' && q.t === t).sort(byNewest);
const usable = q => !(q.av && q.av.n === 'derogada');
const repOf = t => (DATA.repeats || []).filter(r => r.t === t).map(r => ({ n: r.n, qs: r.ids.map(id => QBY[id]).filter(Boolean).sort(byNewest) }));
const repIds = () => new Set((DATA.repeats || []).flatMap(r => r.ids));
const nConv = DATA.replicas.length;

function clavePickIds(k, t) {
  if (k === 'rep') { const s = repIds(); return QUESTIONS.filter(q => s.has(q.id) && usable(q)); }
  if (k === 'tema') return offOf(t).filter(usable);
  if (k === 'doble') return QUESTIONS.filter(q => q.src === 'oficial' && TOPIC[q.t].weight === 2 && usable(q));
  return [];
}
function qLine(q, showConv = true) {
  return `<li class="cq"><div class="small muted">${showConv ? esc(q.convName) : ''}${q.av ? ` <span class="avk ${q.av.n}">· ${esc(AVISO[q.av.n][1])}</span>` : ''}</div>
<div class="cq-q">${esc(q.q)}</div><div class="cq-a"><span aria-hidden="true">✓</span> ${esc(q.o[q.a])}</div></li>`;
}

const MES = { Enero: 'ene', Febrero: 'feb', Marzo: 'mar', Abril: 'abr', Mayo: 'may', Junio: 'jun', Julio: 'jul', Agosto: 'ago', Septiembre: 'sep', Octubre: 'oct', Noviembre: 'nov', Diciembre: 'dic' };
const convShort = name => { const [m, y] = String(name).split(' '); return (MES[m] || m) + ' ' + String(y).slice(2); };
const stemShort = s => {
  let x = s.replace(/^(Según|De acuerdo( con| al?)?|Conforme( al?| con)?|A efectos( de| del)?|En virtud del?|Atendiendo a|A tenor del?|De conformidad con|Regulado en|Tal y como establece|En aplicación del?|Respecto a lo dispuesto en)\b[^?¿:]*?(2\/2011|14\/2014|\d{2,4}\/\d{4}|Código Civil|MARPOL( 73\/78)?|1979|1989|de 2000|Mercante|marítimas|españoles|recreo|deportivas|buques)(, de \d+ de \w+)?[^,?¿]*?,\s*/i, '');
  for (let i = 0; i < 4; i++) {
    x = x.replace(/^(aprobad[oa]s? por|por (el|la) que|que regula|que se regula|sobre|de \d+ de \w+|de Navegación Marítima)\b[^,?¿]*?,\s*/i, '');
    x = x.replace(/^de la navegación y de la vida humana en la mar[^?¿]*?deportivas[,:]\s*/i, '');
    x = x.replace(/^El Real Decreto \d+\/\d+, sobre [^?¿]*?carga,\s*/i, '');
  }
  x = x.replace(/^¿(\S)/, (m, c) => '¿' + c.toUpperCase());
  x = x.charAt(0).toUpperCase() + x.slice(1);
  return x.length > 110 ? x.slice(0, 107).replace(/\s+\S*$/, '') + '…' : x;
};
const ansShort = s => (s.length > 90 ? s.slice(0, 87).replace(/\s+\S*$/, '') + '…' : s);

VIEWS.claves = {
  title: 'Lo que siempre cae',
  render() {
    const nRep = clavePickIds('rep').length;
    const nDoble = clavePickIds('doble').length;
    return `
<div class="panel" style="margin-top:16px">
  <p class="lead" style="margin:0">En ${nConv} exámenes oficiales (2017-2026) <b>cada número de pregunta cae siempre en la misma norma</b>. Debajo tienes, número a número, qué suele preguntar y qué preguntas ya se han repetido, con los exámenes en que salieron.</p>
  <div class="btnrow" style="margin-top:12px"><button class="btn mag" data-act="go" data-v="reviewRun" data-k="rep">Practicar repetidas (${nRep})</button><button class="btn ghost" data-act="go" data-v="reviewRun" data-k="doble">Temas que valen 2 (${nDoble})</button></div>
</div>
${TOPICS.map(t => {
  const c = CLAVE[t.id] || {};
  const groups = repOf(t.id);
  return `<section class="panel cblock">
  <div class="chead"><span class="cpos">${esc(c.pos || '')}</span><div class="grow"><b>${esc(t.title)}</b><div class="small muted">${esc(c.law || t.law)} · ${t.weight === 2 ? '<b class="w2">2 preguntas</b>' : '1 pregunta'}</div></div></div>
  <div class="csub">Suele preguntar</div>
  <ul class="csuele">${(c.s || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  <div class="csub">${groups.length ? `Se han repetido (${groups.length})` : 'Se han repetido'}</div>
  ${groups.length ? `<div class="creps">${groups.map(g => {
    const q0 = g.qs[0];
    return `<details class="crep"><summary><span class="grow"><span class="crep-q">${esc(stemShort(q0.q))}</span><span class="crep-a">✓ ${esc(ansShort(q0.o[q0.a]))}</span><span class="cchips">${g.qs.map(q => `<span class="cchip${q.av && q.av.n === 'derogada' ? ' old' : ''}" title="${esc(q.convName)}">${esc(convShort(q.convName))}</span>`).join('')}</span></span></summary><ul class="cqs">${g.qs.map(q => qLine(q)).join('')}</ul></details>`;
  }).join('')}</div>` : '<p class="small muted" style="margin:2px 0 0">Ninguna repetida todavía: cada examen ha preguntado algo distinto.</p>'}
  <button class="clink" data-act="go" data-v="clave" data-t="${t.id}">Datos clave, todas sus preguntas y práctica ›</button>
</section>`;
}).join('')}
<p class="small muted">Números de pregunta de las convocatorias desde octubre de 2019 (en 2017-2019 iban una o dos posiciones desplazados). Toca una repetida para ver cómo se preguntó en cada examen. Las etiquetas tachadas son de normas derogadas.</p>`;
  },
};

VIEWS.clave = {
  tab: 'claves',
  title: p => 'Pregunta ' + ((CLAVE[p.t] || {}).pos || ''),
  render(p) {
    const t = TOPIC[p.t], c = CLAVE[p.t] || { k: [] };
    const all = offOf(p.t);
    const groups = repOf(p.t);
    const inGroup = new Set(groups.flatMap(g => g.qs.map(q => q.id)));
    const rest = all.filter(q => !inGroup.has(q.id));
    const nPrac = clavePickIds('tema', p.t).length;
    return `
<div class="panel" style="margin-top:16px">
  <div class="qmeta" style="margin-top:0"><span class="tag ${t.weight === 2 ? '' : 'off'}">${t.weight === 2 ? '2 preguntas por examen' : '1 pregunta por examen'}</span><span class="tag off">Tema ${t.id}</span></div>
  <h2 class="ctitle">${esc(t.title)}</h2>
  <p class="small muted" style="margin:0">${esc(c.law || t.law)} · ${all.length} preguntas oficiales en ${nConv} convocatorias</p>
</div>
<div class="label">Lo que hay que saber</div>
<div class="panel"><ul class="ckeys">${c.k.map(([txt, n]) => `<li><span class="grow">${esc(txt)}</span>${n ? `<span class="tag nrep">${n === nConv ? 'en todas' : n + ' exámenes'}</span>` : ''}</li>`).join('')}</ul>
<p class="small muted" style="margin:8px 0 0">«N exámenes» = convocatorias en que ese dato fue la respuesta correcta.</p></div>
<div class="stack" style="margin-top:12px">
  <button class="btn mag wide" data-act="go" data-v="reviewRun" data-k="tema" data-t="${t.id}" ${nPrac ? '' : 'disabled'}>Practicar sus ${nPrac} preguntas oficiales</button>
  <button class="btn ghost wide" data-act="go" data-v="topic" data-t="${t.id}">Estudiar el tema ${t.id} completo</button>
</div>
${groups.length ? `<div class="label">Han salido más de una vez</div>${groups.map(g => `<div class="panel"><div class="qmeta" style="margin-top:0"><span class="tag nrep">En ${g.n} exámenes</span></div><ul class="cqs">${g.qs.map(q => qLine(q)).join('')}</ul></div>`).join('')}` : ''}
<div class="label">Todas las demás preguntas oficiales</div>
<details class="panel cmore"><summary>Ver ${plural(rest.length, 'pregunta', 'preguntas')} con su respuesta</summary><ul class="cqs">${rest.map(q => qLine(q)).join('')}</ul></details>`;
  },
};
