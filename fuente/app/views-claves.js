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

const CSECS = [
  ['Puertos, navegación y Administración', [1, 2, 3, 4, 5, 6]],
  ['Náutica de recreo', [7, 8, 9, 10, 11, 12, 13]],
  ['Salvamento, registro y Código Civil', [14, 15, 16]],
  ['Contaminación y radiocomunicaciones', [17, 18, 19]],
];
const nOf = n => (n >= nConv ? 'en todos los exámenes' : `en ${n} de ${nConv} exámenes`);
const cbar = n => `<span class="cbar" aria-hidden="true"><i style="width:${Math.min(100, Math.round(100 * n / nConv))}%"></i></span>`;
function topFacts(lim) {
  return (DATA.claves || []).flatMap(c => c.k.filter(k => k[1]).map(k => ({ t: c.t, pos: c.pos, txt: k[0], n: k[1] })))
    .sort((a, b) => b.n - a.n || a.t - b.t).slice(0, lim);
}

VIEWS.claves = {
  title: 'Lo que siempre cae',
  render() {
    const nRep = clavePickIds('rep').length;
    const nDoble = clavePickIds('doble').length;
    return `
<div class="panel" style="margin-top:16px">
  <p class="lead" style="margin:0">Desde octubre de 2019, <b>cada número de pregunta del examen cae siempre en la misma norma</b>. Esto es el examen por dentro, sacado de ${nConv} convocatorias oficiales: lo imprescindible, qué cae en cada número y las preguntas que se repiten.</p>
  <div class="btnrow" style="margin-top:12px"><button class="btn mag" data-act="go" data-v="reviewRun" data-k="rep">Practicar repetidas (${nRep})</button><button class="btn ghost" data-act="go" data-v="reviewRun" data-k="doble">Temas que valen 2 (${nDoble})</button></div>
</div>
<div class="label">Imprescindibles · lo que más ha salido</div>
<div class="panel"><ol class="ctop">${topFacts(8).map(f => `<li><button data-act="go" data-v="clave" data-t="${f.t}"><span class="cpos sm">${esc(f.pos)}</span><span class="grow"><span class="ctxt">${esc(f.txt)}</span><span class="cn">${cbar(f.n)}${nOf(f.n)}</span></span></button></li>`).join('')}</ol></div>
<div class="label">El examen, número a número</div>
${CSECS.map(([name, ts]) => `<div class="csec">${esc(name)}</div><div class="panel crows">${ts.map(id => {
  const t = TOPIC[id], c = CLAVE[id] || {};
  const nr = repOf(id).length;
  return `<button class="crow" data-act="go" data-v="clave" data-t="${id}"><span class="cpos">${esc(c.pos || '')}</span><span class="grow"><b>${esc(t.title)}</b><span class="s">${esc((c.s || []).slice(0, 2).join(' · '))}</span><span class="cmeta">${t.weight === 2 ? '<span class="tag">2 preguntas</span>' : ''}${nr ? `<span class="tag nrep">${plural(nr, 'repetida', 'repetidas')}</span>` : ''}</span></span><span class="chev" aria-hidden="true">›</span></button>`;
}).join('')}</div>`).join('')}`;
  },
};

VIEWS.clave = {
  tab: 'claves',
  title: p => 'Pregunta ' + ((CLAVE[p.t] || {}).pos || ''),
  render(p) {
    const t = TOPIC[p.t], c = CLAVE[p.t] || { k: [], s: [] };
    const all = offOf(p.t);
    const groups = repOf(p.t);
    const inGroup = new Set(groups.flatMap(g => g.qs.map(q => q.id)));
    const rest = all.filter(q => !inGroup.has(q.id) && vigente(q));
    const nOld = all.filter(q => !inGroup.has(q.id) && !vigente(q)).length;
    const nVig = vigentesDe(p.t).length;
    const keys = c.k.map((k, i) => ({ txt: k[0], n: k[1] || 0, i })).sort((a, b) => b.n - a.n || a.i - b.i);
    const prev = TOPIC[p.t - 1], next = TOPIC[p.t + 1];
    return `
<div class="panel" style="margin-top:16px">
  <div class="row" style="align-items:flex-start"><span class="cpos lg">${esc(c.pos || '')}</span><div class="grow"><h2 class="ctitle">${esc(t.title)}</h2>
  <p class="small muted" style="margin:0">${esc(c.law || t.law)}</p></div></div>
  <div class="qmeta"><span class="tag ${t.weight === 2 ? '' : 'off'}">${t.weight === 2 ? '2 preguntas por examen' : '1 pregunta por examen'}</span><span class="tag off">Tema ${t.id}</span><span class="tag off">${plural(all.length, 'pregunta oficial', 'preguntas oficiales')}</span></div>
</div>
<div class="label">Suele preguntar</div>
<div class="cchipset">${(c.s || []).map(x => `<span>${esc(x)}</span>`).join('')}</div>
<div class="label">Lo que hay que saber</div>
<div class="panel"><ul class="ckeys">${keys.map(k => `<li><span class="grow">${esc(k.txt)}${k.n ? `<span class="cn">${cbar(k.n)}${nOf(k.n)}</span>` : ''}</span></li>`).join('')}</ul></div>
<div class="stack" style="margin-top:12px">
  <button class="btn mag wide" data-act="go" data-v="reviewRun" data-k="vig" data-t="${t.id}" ${nVig ? '' : 'disabled'}>Test con sus ${nVig} preguntas oficiales</button>
  <button class="btn ghost wide" data-act="go" data-v="topic" data-t="${t.id}">Estudiar el tema ${t.id} completo</button>
</div>
<div class="label">Han salido más de una vez${groups.length ? ` · ${groups.length}` : ''}</div>
${groups.length ? groups.map(g => {
  const q0 = g.qs.find(vigente) || g.qs[0];
  return `<div class="panel cgrp"><div class="cchips" style="margin:0 0 8px">${g.qs.map(q => `<span class="cchip${q.av && q.av.n === 'derogada' ? ' old' : ''}" title="${esc(q.convName)}">${esc(convShort(q.convName))}</span>`).join('')}</div>
<div class="cq-q">${esc(q0.q)}</div><div class="cq-a"><span aria-hidden="true">✓</span> ${esc(q0.o[q0.a])}</div>
${g.qs.length > 1 ? `<details class="cmore2"><summary>Cómo se preguntó cada vez (${g.qs.length})</summary><ul class="cqs">${g.qs.map(q => qLine(q)).join('')}</ul></details>` : ''}</div>`;
}).join('') : '<p class="small muted">Ninguna repetida todavía: cada examen ha preguntado algo distinto.</p>'}
<div class="label">Las demás preguntas oficiales</div>
${rest.length ? `<details class="panel cmore"><summary>Ver ${plural(rest.length, 'pregunta', 'preguntas')} con su respuesta</summary><ul class="cqs">${rest.map(q => qLine(q)).join('')}</ul></details>` : '<p class="small muted">No hay más.</p>'}
${nOld ? `<p class="small muted">No se muestran ${plural(nOld, 'pregunta', 'preguntas')} de normas derogadas o fuera del temario.</p>` : ''}
<div class="cnav">${prev ? `<button class="btn ghost" data-act="cgo" data-t="${prev.id}">‹ Pregunta ${esc((CLAVE[prev.id] || {}).pos || '')}</button>` : '<span></span>'}${next ? `<button class="btn ghost" data-act="cgo" data-t="${next.id}">Pregunta ${esc((CLAVE[next.id] || {}).pos || '')} ›</button>` : '<span></span>'}</div>`;
  },
};
ACT.cgo = d => { clearTimers(); S = {}; NAV.stack[NAV.stack.length - 1] = { v: 'clave', p: { t: +d.t } }; render(true); };
