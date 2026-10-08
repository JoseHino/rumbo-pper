/* ===== Banderas del Código Internacional de Señales (A–S) e iconos ===== */
const FC = { R: '#C8102E', Y: '#F6C700', B: '#0B4EA2', W: '#FFFFFF', K: '#151515' };
const rect = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${FC[c]}"/>`;
const FLAG_SHAPES = {
  A: () => rect(0, 0, 30, 40, 'W') + `<polygon points="30,0 60,0 45,20 60,40 30,40" fill="${FC.B}"/>`,
  B: () => `<polygon points="0,0 60,0 45,20 60,40 0,40" fill="${FC.R}"/>`,
  C: () => ['B', 'W', 'R', 'W', 'B'].map((c, i) => rect(0, i * 8, 60, 8, c)).join(''),
  D: () => rect(0, 0, 60, 10, 'Y') + rect(0, 10, 60, 20, 'B') + rect(0, 30, 60, 10, 'Y'),
  E: () => rect(0, 0, 60, 20, 'B') + rect(0, 20, 60, 20, 'R'),
  F: () => rect(0, 0, 60, 40, 'W') + `<polygon points="30,0 60,20 30,40 0,20" fill="${FC.R}"/>`,
  G: () => ['Y', 'B', 'Y', 'B', 'Y', 'B'].map((c, i) => rect(i * 10, 0, 10, 40, c)).join(''),
  H: () => rect(0, 0, 30, 40, 'W') + rect(30, 0, 30, 40, 'R'),
  I: () => rect(0, 0, 60, 40, 'Y') + `<circle cx="30" cy="20" r="10" fill="${FC.K}"/>`,
  J: () => rect(0, 0, 60, 13.34, 'B') + rect(0, 13.33, 60, 13.34, 'W') + rect(0, 26.66, 60, 13.34, 'B'),
  K: () => rect(0, 0, 30, 40, 'Y') + rect(30, 0, 30, 40, 'B'),
  L: () => rect(0, 0, 30, 20, 'Y') + rect(30, 0, 30, 20, 'K') + rect(0, 20, 30, 20, 'K') + rect(30, 20, 30, 20, 'Y'),
  M: () => rect(0, 0, 60, 40, 'B') + `<path d="M0 0L60 40M60 0L0 40" stroke="${FC.W}" stroke-width="8"/>`,
  N: () => { let s = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += rect(c * 15, r * 10, 15, 10, (r + c) % 2 ? 'W' : 'B'); return s; },
  O: () => rect(0, 0, 60, 40, 'Y') + `<polygon points="0,0 60,0 60,40" fill="${FC.R}"/>`,
  P: () => rect(0, 0, 60, 40, 'B') + rect(20, 13.33, 20, 13.34, 'W'),
  Q: () => rect(0, 0, 60, 40, 'Y'),
  R: () => rect(0, 0, 60, 40, 'R') + rect(25, 0, 10, 40, 'Y') + rect(0, 15, 60, 10, 'Y'),
  S: () => rect(0, 0, 60, 40, 'W') + rect(20, 13.33, 20, 13.34, 'B'),
};
const FLAG_INFO = {
  A: ['Alfa', 'Tengo buzo sumergido; manténgase alejado de mí y a poca velocidad.'],
  B: ['Bravo', 'Estoy cargando, descargando o transportando mercancías peligrosas.'],
  C: ['Charlie', 'Sí (afirmativo).'],
  D: ['Delta', 'Manténgase alejado de mí; estoy maniobrando con dificultad.'],
  E: ['Echo', 'Caigo a estribor.'],
  F: ['Foxtrot', 'Tengo avería; póngase en comunicación conmigo.'],
  G: ['Golf', 'Necesito práctico.'],
  H: ['Hotel', 'Tengo práctico a bordo.'],
  I: ['India', 'Caigo a babor.'],
  J: ['Juliett', 'Tengo incendio y llevo mercancías peligrosas a bordo; manténgase bien alejado de mí.'],
  K: ['Kilo', 'Deseo comunicar con usted.'],
  L: ['Lima', 'Pare su buque inmediatamente.'],
  M: ['Mike', 'Mi buque está parado y sin arrancada.'],
  N: ['November', 'No (negativo).'],
  O: ['Oscar', '¡Hombre al agua!'],
  P: ['Papa', 'En puerto: todo el personal debe regresar a bordo; el buque va a hacerse a la mar.'],
  Q: ['Quebec', 'Mi buque está sano y pido libre plática.'],
  R: ['Romeo', 'Sin significado propio como bandera aislada.'],
  S: ['Sierra', 'Estoy dando atrás.'],
};
const LETTERS = 'ABCDEFGHIJKLMNOPQRS';
function flagSvg(letter, label) {
  const f = FLAG_SHAPES[letter] || FLAG_SHAPES.Q;
  const name = label || ('Bandera ' + (FLAG_INFO[letter] || [letter])[0]);
  return `<svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="${name}">${f()}</svg>`;
}
const topicFlag = (t) => flagSvg(LETTERS[t - 1]);

const ICONS = {
  back: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 18.5c3.5 0 3-6.5 6.5-6.5s3-6 6.5-6" stroke-dasharray="2.6 2.6"/><circle cx="5" cy="19" r="2"/><path d="M19 3.5l-2.2 5h4.4z" fill="currentColor"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/></svg>',
  sim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M9.5 3h5M18.3 7.2l1.4-1.4"/></svg>',
  log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5h11a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2z"/><path d="M6 18.5a2 2 0 0 1 2-2h11M10 8h5M10 11h3"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.2"/></svg>',
  anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M12 6.5V21M8 10h8M4 13.5c0 4.2 3.6 7.5 8 7.5s8-3.3 8-7.5M2.5 15l1.5-1.5 1.5 1.5M18.5 15l1.5-1.5 1.5 1.5"/></svg>',
  buoy: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="#F3F3F3" stroke-width="5"/><circle cx="12" cy="12" r="8" fill="none" stroke="#D9381E" stroke-width="5" stroke-dasharray="6.283 6.283" transform="rotate(-22.5 12 12)"/><circle cx="12" cy="12" r="10.6" fill="none" stroke="#5A5A5A" stroke-width=".7"/><circle cx="12" cy="12" r="5.4" fill="none" stroke="#5A5A5A" stroke-width=".7"/></svg>',
  rose: (() => {
    let p = '';
    for (let i = 0; i < 16; i++) {
      const long = i % 4 === 0, mid = i % 2 === 0;
      const r = long ? 70 : mid ? 48 : 34, w = long ? 9 : 6, a = i * 22.5;
      p += `<g transform="rotate(${a} 75 75)"><path d="M75 ${75 - r}L${75 + w} 75L75 75z" fill="currentColor"/><path d="M75 ${75 - r}L${75 - w} 75L75 75z" fill="currentColor" opacity=".45"/></g>`;
    }
    return `<svg viewBox="0 0 150 150" class="rose" aria-hidden="true"><circle cx="75" cy="75" r="58" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="75" cy="75" r="62" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="1.5 3"/>${p}</svg>`;
  })(),
};
