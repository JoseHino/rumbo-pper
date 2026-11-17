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

VIEWS.claves = {
  title: 'Lo que siempre cae',
  render() {
    const reps = DATA.repeats || [];
    const nRep = clavePickIds('rep').length;
    const nDoble = clavePickIds('doble').length;
    return `
<div class="panel" style="margin-top:16px">
  <p class="lead" style="margin:0">De ${nConv} exámenes oficiales (2017-2026): <b>cada número de pregunta es siempre de la misma norma</b>, y muchas preguntas vuelven con otras palabras. Aquí tienes, en el orden del examen, lo que han preguntado de verdad.</p>
  <div class="kpis"><div><b>18</b><span>aciertos para aprobar</span></div><div><b>22</b><span>preguntas de los 11 temas que valen 2</span></div><div><b>${reps.length}</b><span>preguntas que ya se han repetido</span></div></div>
  <button class="btn mag wide" data-act="go" data-v="reviewRun" data-k="rep">Practicar las repetidas (${nRep})</button>
  <button class="btn ghost wide" style="margin-top:10px" data-act="go" data-v="reviewRun" data-k="doble">Practicar los temas que valen 2 (${nDoble})</button>
  <p class="small muted" style="margin:10px 0 0">Las prácticas usan solo preguntas oficiales que siguen valiendo hoy, en tandas de 20, empezando por las que menos dominas.</p>
</div>
<div class="label">El examen, pregunta a pregunta</div>
<div class="stack">${TOPICS.map(t => {
  const c = CLAVE[t.id] || {};
  const nr = reps.filter(r => r.t === t.id).length;
  return `<button class="stage ckey" data-act="go" data-v="clave" data-t="${t.id}"><span class="cpos">${esc(c.pos || '')}</span><span class="grow"><b>${esc(t.title)}</b><span class="s">${esc(c.law || t.law)}</span><span class="s"><span class="tag ${t.weight === 2 ? '' : 'off'}">${t.weight === 2 ? '2 preguntas' : '1 pregunta'}</span> ${offOf(t.id).length} oficiales${nr ? ` · ${plural(nr, 'repetida', 'repetidas')}` : ''}</span></span><span class="muted" aria-hidden="true">›</span></button>`;
}).join('')}</div>
<p class="small muted">Números de pregunta de las convocatorias desde octubre de 2019; en 2017-2019 iban una o dos posiciones desplazados. Las preguntas de normas que han cambiado llevan aviso rojo, ámbar o gris, como en el simulacro.</p>`;
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
