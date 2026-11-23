// Assemble the single-file app: style + markup + embedded data + scripts
const fs = require('fs');
const path = require('path');
const base = process.argv[2];
const out = process.argv[3];
const rd = f => fs.readFileSync(path.join(base, f), 'utf8');

const data = JSON.parse(rd('app_data.json'));
// PDF extraction left a private-use glyph (U+F093) at the end of official stems and options
const PUA = new RegExp('[' + String.fromCharCode(0xE000) + '-' + String.fromCharCode(0xF8FF) + ']', 'g');
data.questions.forEach(q => { q.q = q.q.replace(PUA, '').trim(); q.o = q.o.map(o => o.replace(PUA, '').trim()); if (q.e) q.e = q.e.replace(PUA, '').trim(); });
// authored HTML fields must not contain stray '<' outside the allowed inline tags
const allowed = /<\/?(b|i|em|strong|br|sub|sup)\s*\/?>/g;
const LT_RE = new RegExp('<(?!/?(b|i|em|strong|br|sub|sup)[ ]*/?>)', 'g');
const fixLt = s => (typeof s === 'string' ? s.replace(LT_RE, '&lt;') : s);
for (const t of data.topics) {
  ["scope", "intro", "update"].forEach(k => { t[k] = fixLt(t[k]); });
  t.cards.forEach(c => { c.t = fixLt(c.t); c.b = fixLt(c.b); c.tip = fixLt(c.tip); });
  t.tf.forEach(c => { c.s = fixLt(c.s); c.e = fixLt(c.e); });
  t.pairs.forEach(p => { p.title = fixLt(p.title); p.items = p.items.map(it => it.map(fixLt)); });
  t.cloze.forEach(c => { c.s = fixLt(c.s); });
}
data.questions.forEach(q => { q.e = fixLt(q.e); });
const strays = [];
const scan = (s, where) => { if (typeof s === 'string' && s.replace(allowed, '').includes('<')) strays.push(where + ': ' + s.slice(0, 90)); };
for (const t of data.topics) {
  ['title', 'law', 'scope', 'intro', 'update'].forEach(k => scan(t[k], `T${t.id}.${k}`));
  t.cards.forEach((c, i) => ['t', 'b', 'tip'].forEach(k => scan(c[k], `T${t.id}.card${i}.${k}`)));
  t.tf.forEach((c, i) => ['s', 'e'].forEach(k => scan(c[k], `T${t.id}.tf${i}.${k}`)));
  t.pairs.forEach((p, i) => { scan(p.title, `T${t.id}.pairs${i}`); p.items.forEach(it => it.forEach(x => scan(x, `T${t.id}.pairs${i}.item`))); });
  t.cloze.forEach((c, i) => scan(c.s, `T${t.id}.cloze${i}`));
}
data.questions.forEach(q => scan(q.e, `${q.id}.e`));
if (strays.length) { console.log('STRAY <:\n' + strays.join('\n')); process.exit(1); }
const ids = new Set(data.questions.map(q => q.id));
data.replicas.forEach(r => console.log('replica', r.conv, r.ids.length, 'missing:', r.ids.filter(i => !ids.has(i)).join(',') || 'none', 'dups:', r.ids.length - new Set(r.ids).size));

const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const BS = String.fromCharCode(92);
const json = JSON.stringify(data).replace(/</g, BS + 'u003c').split(LS).join(BS + 'u2028').split(PS).join(BS + 'u2029');
const files = ['flags.js', 'core.js', 'views-home.js', 'views-games.js', 'views-sim.js', 'views-claves.js', 'views-log.js'];
const js = [...files, 'main.js'].map(f => rd('app/' + f)).join('\n');
// web: accounts with e-mail verification (Supabase); the Claude artifact keeps its own private db
const jsWeb = [...files, 'auth-web.js', 'main.js'].map(f => rd('app/' + f)).join('\n');
const supa = JSON.parse(rd('web_config.json'));
const withAuth = /^https:\/\//.test(supa.url || '') && !!supa.key; // until the Supabase project exists, the web stays open
if (!withAuth) console.log('web: sin cuentas (web_config.json sin configurar)');
if (/<\/script/i.test(jsWeb)) { console.log('script contains </script'); process.exit(1); }
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=IBM+Plex+Mono:wght@400;500&family=Spectral:ital,wght@0,500;0,600;1,400;1,600&display=swap" rel="stylesheet">`;
const css = `<style>
${rd('app/style.css')}
</style>`;
const body = `<div id="app">
<header class="top" id="top"></header>
<main id="view" tabindex="-1"></main>
<nav class="tabs" id="tabs" aria-label="Secciones"></nav>
</div>
<script type="application/json" id="pper-data">${json}</script>`;
const script = `<script>
"use strict";
${js}
</script>`;
const kb = s => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB';

// 1) Claude artifact page: the viewer adds the document skeleton
if (out && out !== '-') {
  const html = `<title>Rumbo al PPER</title>\n${fonts}\n${css}\n${body}\n${script}\n`;
  fs.writeFileSync(out, html);
  // separate copy of the inline script for a syntax check
  fs.writeFileSync(out.replace(/\.html$/, '.check.js'), js);
  console.log('written', out, kb(html));
}

// 2) Stand-alone web app (GitHub Pages): full document, manifest, icons and offline service worker
const outWeb = process.argv[4];
if (outWeb) {
  const web = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Rumbo al PPER</title>
<meta name="description" content="App de estudio no oficial para el examen de Patrón Profesional de Embarcaciones de Recreo (PPER): 19 temas jugables, preguntas oficiales y simulacros.">
<meta name="theme-color" content="#F7F9F8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0A121C" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="icon" href="icons/icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Rumbo PPER">
${fonts}
${css}
<style>:root{padding-top:env(safe-area-inset-top,0px)}</style>
</head>
<body>
${body}
${withAuth ? `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
<script>window.PPER_WEB = true; window.PPER_SUPA = ${JSON.stringify(supa)};</script>
<script>
"use strict";
${jsWeb}
</script>` : `<script>window.PPER_WEB = true;</script>
${script}`}
<script>
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) { /* sin almacenamiento persistente */ }
</script>
</body>
</html>
`;
  fs.writeFileSync(outWeb, web);
  console.log('written', outWeb, kb(web));
}
