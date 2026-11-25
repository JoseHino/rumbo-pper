// Assemble and validate app data from content/t01..t19.js and exams_unique.json
const fs = require('fs');
const path = require('path');
const base = path.resolve(process.argv[2] || '.');
const out = process.argv[3];
const topics = [];
let problems = [];
for (let i = 1; i <= 19; i++) {
  const f = path.join(base, 'content', `t${String(i).padStart(2, '0')}.js`);
  const t = require(f);
  if (t.id !== i) problems.push(`t${i}: id mismatch`);
  topics.push(t);
}
const exams = JSON.parse(fs.readFileSync(path.join(base, 'exams_unique.json'), 'utf8'));
const raw = JSON.parse(fs.readFileSync(path.join(base, 'exams_raw.json'), 'utf8'));
// older official exams (2017-2024), transcribed and reviewed against current law; av = warning if the law changed
const old = JSON.parse(fs.readFileSync(path.join(base, 'exams_old.json'), 'utf8'));
// newest convocatoria (Nov 2026, Test 01 + plantilla definitiva), same format as exams_old.json, shown first
const newest = JSON.parse(fs.readFileSync(path.join(base, 'exams_2026nov.json'), 'utf8'));
// position -> topic map (exam order follows the syllabus)
const POS2T = {};
const layout = [[1,1],[2,1],[3,2],[4,2],[5,3],[6,4],[7,5],[8,6],[9,7],[10,7],[11,8],[12,8],[13,9],[14,10],[15,10],[16,11],[17,12],[18,12],[19,13],[20,14],[21,14],[22,15],[23,15],[24,16],[25,17],[26,17],[27,18],[28,18],[29,19],[30,19]];
for (const [p, t] of layout) POS2T[p] = t;
const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
const clean = s => s.replace(/\s+/g, ' ').replace(/\s+([.,:;?])/g, '$1').trim();
const CONV = { '2026abr': 'Abril 2026', '2025nov': 'Noviembre 2025', '2025abr': 'Abril 2025' };
const official = [];
const stemToId = {};
for (const e of exams) {
  if (e.id === '2025abr-2-07') continue; // same question as 2025abr-1-06 with one word changed
  const [conv, test, num] = e.id.split('-');
  const pos = parseInt(num, 10);
  const t = POS2T[pos];
  const letters = ['A', 'B', 'C', 'D'];
  const q = {
    id: e.id, t, src: 'oficial', conv, convName: CONV[conv],
    q: clean(e.q), o: letters.map(L => clean(e.opts[L])), a: letters.indexOf(e.ans)
  };
  stemToId[norm(e.q)] = e.id;
  official.push(q);
}
// attach explanations
for (const t of topics) {
  const offs = official.filter(q => q.t === t.id);
  for (const q of offs) {
    if (!t.official || !t.official[q.id]) problems.push(`t${t.id}: missing explanation for ${q.id}`);
    else q.e = t.official[q.id];
  }
  for (const k of Object.keys(t.official || {})) {
    if (!offs.find(q => q.id === k)) problems.push(`t${t.id}: explanation for unknown/other-topic official ${k}`);
  }
}
// real exam replicas (Test 01 order), mapping duplicates to the kept unique question
const replicas = [];
for (const conv of ['2026abr', '2025nov', '2025abr']) {
  const ids = raw[`${conv}_t1`].map(q => stemToId[norm(q.q)] || (norm(q.q).includes('con relación a la administración periférica') ? '2025abr-1-06' : null));
  const missing = ids.filter(x => !x).length;
  if (missing) problems.push(`replica ${conv}: ${missing} unmapped`);
  replicas.push({ conv, name: CONV[conv], test: 1, ids });
}
// older official exams
const OLD_CONVS = [];
for (const q of [...newest, ...old]) {
  if (!OLD_CONVS.find(c => c.conv === q.conv)) OLD_CONVS.push({ conv: q.conv, name: q.convName, test: +q.id.split('-')[1], ids: [] });
  OLD_CONVS.find(c => c.conv === q.conv).ids.push(q.id);
  const o = { id: q.id, t: q.t, src: 'oficial', conv: q.conv, convName: q.convName, q: clean(q.q), o: q.o.map(clean), a: q.a, e: q.e };
  if (q.av) o.av = q.av;
  if (!(o.a >= 0 && o.a <= 3) || o.o.length !== 4 || o.o.some(x => !x)) problems.push(`old ${q.id}: bad question`);
  if (!(o.t >= 1 && o.t <= 19)) problems.push(`old ${q.id}: bad topic`);
  official.push(o);
}
replicas.unshift(OLD_CONVS.shift()); // Nov 2026 first (most recent)
OLD_CONVS.forEach(c => replicas.push(c));
// «Claves»: groups of official questions that came up in two or more convocatorias (same fact, other wording)
const claves = require(path.join(base, 'claves.js'));
const repeats = [];
{
  const words = x => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  for (let t = 1; t <= 19; t++) {
    const qs = official.filter(q => q.t === t).map(q => ({ q, w: words(q.q + ' ' + q.o[q.a]) }));
    const df = {}; qs.forEach(x => new Set(x.w).forEach(w => { df[w] = (df[w] || 0) + 1; }));
    qs.forEach(x => { x.s = new Set(x.w.filter(w => df[w] <= qs.length * 0.25)); });
    const p = qs.map((_, i) => i); const f = i => (p[i] === i ? i : (p[i] = f(p[i])));
    for (let i = 0; i < qs.length; i++) for (let j = i + 1; j < qs.length; j++) {
      if (qs[i].q.conv === qs[j].q.conv) continue;
      let n = 0; qs[i].s.forEach(w => { if (qs[j].s.has(w)) n++; });
      if (n / (qs[i].s.size + qs[j].s.size - n) >= 0.42) p[f(i)] = f(j);
    }
    const g = {}; qs.forEach((x, i) => { (g[f(i)] = g[f(i)] || []).push(x.q.id); });
    Object.values(g).forEach(ids => { const convs = new Set(ids.map(id => id.split('-')[0])); if (convs.size >= 2) repeats.push({ t, n: convs.size, ids }); });
  }
  repeats.sort((a, b) => b.n - a.n || a.t - b.t);
  if (claves.length !== 19) problems.push('claves: expected 19 topics');
}
// practice questions
const practice = [];
let pid = 0;
for (const t of topics) {
  (t.quiz || []).forEach((q, i) => {
    if (!Array.isArray(q.o) || q.o.length !== 4) problems.push(`t${t.id} quiz ${i}: options != 4`);
    if (!(q.a >= 0 && q.a <= 3)) problems.push(`t${t.id} quiz ${i}: bad answer index`);
    if (!q.e) problems.push(`t${t.id} quiz ${i}: no explanation`);
    const dup = new Set(q.o.map(norm)); if (dup.size !== 4) problems.push(`t${t.id} quiz ${i}: duplicate options`);
    practice.push({ id: `p${t.id}-${i + 1}`, t: t.id, src: 'practica', q: q.q, o: q.o, a: q.a, e: q.e });
  });
  (t.cloze || []).forEach((c, i) => {
    if (!c.s.includes('___')) problems.push(`t${t.id} cloze ${i}: no blank`);
    if (c.o.length !== 4 || !(c.a >= 0 && c.a < 4)) problems.push(`t${t.id} cloze ${i}: bad options`);
  });
  (t.pairs || []).forEach((p, i) => {
    if (p.items.length < 3) problems.push(`t${t.id} pairs ${i}: <3 items`);
    const L = new Set(p.items.map(x => x[0])); if (L.size !== p.items.length) problems.push(`t${t.id} pairs ${i}: dup left`);
  });
  (t.tf || []).forEach((s, i) => { if (typeof s.a !== 'boolean' || !s.e) problems.push(`t${t.id} tf ${i}: bad`); });
  (t.cards || []).forEach((c, i) => { if (!c.t || !c.b || !c.ref) problems.push(`t${t.id} card ${i}: missing field`); });
}
// stats
const stat = topics.map(t => {
  const off = official.filter(q => q.t === t.id).length;
  const tfTrue = t.tf.filter(x => x.a).length;
  const ansDist = [0, 0, 0, 0]; t.quiz.forEach(q => ansDist[q.a]++);
  return `T${String(t.id).padStart(2)} cards ${String(t.cards.length).padStart(2)} | tf ${t.tf.length} (${tfTrue}V/${t.tf.length - tfTrue}F) | pairs ${t.pairs.length} | cloze ${t.cloze.length} | quiz ${t.quiz.length} ans[${ansDist}] | oficial ${off}`;
});
console.log(stat.join('\n'));
const totals = { cards: 0, tf: 0, pairs: 0, cloze: 0, quiz: 0 };
topics.forEach(t => { totals.cards += t.cards.length; totals.tf += t.tf.length; totals.pairs += t.pairs.length; totals.cloze += t.cloze.length; totals.quiz += t.quiz.length; });
console.log('TOTALS', JSON.stringify(totals), 'official', official.length, 'old', old.length, 'warned', old.filter(q => q.av).length);
// options referencing other options
for (const q of [...official, ...practice]) {
  if (q.o.some(o => /anteriores|todas las|ninguna de las/i.test(o))) problems.push(`option refers to others: ${q.id}`);
}
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'No problems');
const WEIGHT = { 1: 2, 2: 2, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 1, 10: 2, 11: 1, 12: 2, 13: 1, 14: 2, 15: 2, 16: 1, 17: 2, 18: 2, 19: 2 };
const data = {
  version: '2026.11.24',
  // next sitting: not published yet -> approximate (2026 pattern: BOE in late January, enrolment 1-15 March, exam on the 3rd Saturday of April in Madrid)
  exam: { name: 'Primera convocatoria de 2027', approx: true, date: '2027-04-17', enrolFrom: '2027-03-01', enrolTo: '2027-03-15', place: 'Madrid (lugar por confirmar)', prev: 'En 2026 fue el sábado 18 de abril, con matrícula del 1 al 15 de marzo; la segunda, el 21 de noviembre.', questions: 30, options: 4, minutes: 60, pass: 18 },
  topics: topics.map(t => ({ id: t.id, title: t.title, law: t.law, scope: t.scope, intro: t.intro, update: t.update || null, weight: WEIGHT[t.id], cards: t.cards, tf: t.tf, pairs: t.pairs, cloze: t.cloze })),
  questions: [...official, ...practice],
  replicas,
  claves,
  repeats
};
fs.writeFileSync(out, JSON.stringify(data));
console.log('written', out, (fs.statSync(out).size / 1024).toFixed(1) + ' KB');
