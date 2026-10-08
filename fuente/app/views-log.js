/* ===== Bitácora (progreso y ajustes) y datos del examen ===== */
VIEWS.log = {
  title: 'Bitácora',
  render() {
    const r = rankOf(P.xp);
    const w = (a, b) => Math.min(100, pct(a, b));
    const passed = TOPICS.filter(t => topicPassed(t.id)).length;
    const acc = pct(P.st.ok, P.st.ans);
    return `
<div class="label">Registro de navegación</div>
<div class="panel">
  <div class="row"><span class="grow"><b>Millas</b></span><span class="mono">${nf(P.xp)} / 2.500</span></div><div class="bar"><i style="width:${w(P.xp, GOAL.miles)}%"></i></div>
  <div class="row" style="margin-top:12px"><span class="grow"><b>Días de mar</b> <span class="small muted">(días con ${GOAL.dayMiles} millas o más)</span></span><span class="mono">${seaDays()} / 50</span></div><div class="bar"><i style="width:${w(seaDays(), GOAL.days)}%"></i></div>
  <div class="row" style="margin-top:12px"><span class="grow"><b>Travesías de altura</b> <span class="small muted">(simulacros aprobados)</span></span><span class="mono">${trips()} / 5</span></div><div class="bar"><i style="width:${w(trips(), GOAL.trips)}%"></i></div>
  <p class="small muted" style="margin:12px 0 0">Es un guiño al registro que exige el art. 93.3.c) del RD 269/2022 para el certificado: 50 días y 2.500 millas, con al menos cinco travesías de más de 60 millas como patrón.</p>
</div>
<div class="label">Rango</div>
<div class="panel"><div class="row wrap">${RANKS.map(([m, n]) => `<span class="tag ${P.xp >= m ? (n === r.name ? '' : 'ok') : 'off'}">${n}</span>`).join('')}</div>
<p class="small muted" style="margin:10px 0 0">${r.next ? `Te faltan ${nf(r.next[0] - P.xp)} millas para ${r.next[1]}.` : 'Has completado las 2.500 millas.'}</p></div>
<div class="label">Cifras</div>
<div class="logbook" style="margin-top:0">
  <div><span class="k">Temas</span><div class="v">${passed}<small> /19</small></div></div>
  <div><span class="k">Respuestas</span><div class="v">${nf(P.st.ans)}</div></div>
  <div><span class="k">Acierto</span><div class="v">${P.st.ans ? acc + '<small> %</small>' : '—'}</div></div>
  <div><span class="k">Racha</span><div class="v">${streak()}<small> días</small></div></div>
  <div><span class="k">Simulacros</span><div class="v">${P.sims.length}</div></div>
  <div><span class="k">Mejor nota</span><div class="v">${P.sims.length ? Math.max(...P.sims.map(s => s.s)) + '<small> /30</small>' : '—'}</div></div>
</div>
<div class="label">Temas</div>
<div class="panel"><ul class="list" style="margin:-6px 0">${TOPICS.map(t => {
  const x = tpr(t.id);
  return `<li><span class="fl">${topicFlag(t.id)}</span><span class="grow small"><b>${t.id}.</b> ${esc(t.title)}</span><span class="mono" style="width:40px;text-align:right">${x.exam >= 0 ? x.exam + '%' : '—'}</span>${starsHtml(x.stars || 0)}</li>`;
}).join('')}</ul></div>
<div class="label">Insignias · ${Object.keys(P.badges).length}/${BADGES.length}</div>
<div class="badges">${BADGES.map(b => `<div class="${P.badges[b.k] ? 'on' : ''}"><span class="ic"><span class="flag" style="display:inline-block;width:30px;height:20px;box-shadow:none">${flagSvg(b.f)}</span></span><b>${b.n}</b><br>${b.d}</div>`).join('')}</div>
<div class="label">Ajustes</div>
<div class="panel">
  <div class="row"><span class="grow">Apariencia</span><div class="seg" role="group" aria-label="Apariencia">${[['auto', 'Auto'], ['light', 'Día'], ['dark', 'Noche']].map(([k, n]) => `<button class="${P.theme === k ? 'on' : ''}" data-act="theme" data-k="${k}" aria-pressed="${P.theme === k}">${n}</button>`).join('')}</div></div>
  <p class="small muted" style="margin:14px 0 0">${Store.mode === 'cloud' ? 'Tu progreso se guarda en tu cuenta, en un espacio privado que solo ves tú, y se sincroniza entre dispositivos.' : window.PPER_WEB ? 'Tu progreso se guarda en este dispositivo. Instala la app en la pantalla de inicio para que el navegador lo conserve: en iPhone, botón Compartir y «Añadir a pantalla de inicio»; en Android, menú ⋮ e «Instalar aplicación».' : 'Tu progreso se guarda en este navegador. Si abres la app con tu cuenta de Claude, se guardará también en tu cuenta.'}</p>
  <button class="btn ghost wide" style="margin-top:14px;color:var(--bad)" data-act="reset">Borrar todo el progreso</button>
</div>`;
  },
};
ACT.theme = d => { P.theme = d.k; applyTheme(); save(); rerender(); };
ACT.reset = () => confirmBox({ title: 'Borrar progreso', text: 'Se borrarán tus millas, estrellas, insignias, repasos y simulacros. No se puede deshacer.', ok: 'Borrar', danger: true }, () => {
  const theme = P.theme;
  P = fresh(); P.theme = theme;
  save(); Store.flush(); render(true);
  toast('Progreso borrado');
});

VIEWS.info = {
  title: 'El examen',
  render() {
    const upd = TOPICS.filter(t => t.update);
    const d = k => fmtDate(k, { day: 'numeric', month: 'long' });
    return `
<div class="label">Segunda convocatoria de 2026</div>
<div class="panel"><dl class="dl">
  <dt>Fecha</dt><dd>${fmtDate(EXAM.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
  <dt>Lugar</dt><dd>${esc(EXAM.place)}, calle Kelsen 1, Madrid</dd>
  <dt>Hora</dt><dd>La fija el tribunal según el número de candidatos y se publica en la web del Ministerio</dd>
  <dt>Matrícula</dt><dd>Del ${d(EXAM.enrolFrom)} al ${d(EXAM.enrolTo)}, por «matriculación exprés» en la sede electrónica o en registro</dd>
  <dt>Requisito</dt><dd>Título de Capitán de Yate</dd>
</dl></div>
<div class="label">Cómo es la prueba</div>
<div class="panel"><dl class="dl">
  <dt>Preguntas</dt><dd>${EXAM.questions}, con cuatro respuestas y una sola correcta</dd>
  <dt>Tiempo</dt><dd>Una hora</dd>
  <dt>Aprobado</dt><dd>${EXAM.pass} aciertos (60 %); las bases no prevén que los fallos resten</dd>
  <dt>Temario</dt><dd>19 temas (anexo II de la Resolución de 11 de junio de 2026)</dd>
</dl></div>
<div class="label">Lo que te da el certificado</div>
<div class="panel prose"><p>Gobierno de embarcaciones de recreo españolas de las listas 6.ª y 7.ª, de hasta 24 m de eslora y con un máximo de 12 pasajeros además de la tripulación (art. 93.2 del RD 269/2022):</p>
<ul><li><b>Primera categoría:</b> navegación a lo largo de la costa hasta 60 millas de ella.</li><li><b>Segunda categoría:</b> cabotaje y costa hasta 150 millas; exige además 24 meses de embarco como PPER.</li><li><b>Formación:</b> instructor en las prácticas básicas de seguridad y navegación de PNB y PER.</li></ul>
<p>Para la primera categoría (art. 93.3) necesitas 20 años, Capitán de Yate, un registro de 50 días y 2.500 millas con al menos cinco travesías de más de 60 millas como patrón, operador general o restringido del SMSSM, formación básica en seguridad, formación sanitaria específica inicial, certificado médico y aprobar esta prueba. El certificado vale 5 años.</p></div>
${upd.length ? `<div class="label">Tus apuntes frente al BOE</div>
<div class="panel prose"><p>En ${upd.length} temas tus apuntes no coinciden con lo que pide el temario de 2026: normas derogadas o modificadas, o partes que no recogen. La app usa el texto vigente del BOE:</p><ul>${upd.map(t => `<li><b>Tema ${t.id}.</b> ${t.update}</li>`).join('')}</ul></div>` : ''}
<div class="label">Fuentes</div>
<div class="panel prose small"><ul>
<li>${ext('https://www.boe.es/boe/dias/2026/07/20/pdfs/BOE-A-2026-15822.pdf', 'Resolución de 11 de junio de 2026: temario y fecha (BOE 20-7-2026)')}</li>
<li>${ext('https://www.boe.es/boe/dias/2026/01/28/pdfs/BOE-A-2026-2053.pdf', 'Resolución de 9 de enero de 2026: estructura de la prueba (BOE 28-1-2026)')}</li>
<li>${ext(boeUrl('BOE-A-2022-6047'), 'Real Decreto 269/2022, art. 93')}</li>
<li>${ext('https://www.transportes.gob.es/marina-mercante/titulaciones/titulos-profesionales-formacion-maritima-documentos-y-guardia-de-la-gente-de-mar/titulaciones-profesionales/examenes-y-pruebas-nacionales', 'Exámenes y plantillas publicados por el Ministerio')}</li>
<li>Normativa de cada tema: enlaces al BOE en la ficha del tema.</li></ul></div>
<p class="foot">App de estudio no oficial. Ante cualquier duda manda el BOE.</p>`;
  },
};
