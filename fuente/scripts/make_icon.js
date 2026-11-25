// App icon: 16-point compass rose on chart navy, north point in chart magenta (fits the maskable safe zone)
const fs = require('fs');
const out = process.argv[2];
const pt = (i, r, w, right, left) => {
  const a = i * 22.5;
  return `<g transform="rotate(${a} 256 256)"><path d="M256 ${256 - r}L${256 + w} 256H256z" fill="${right}"/><path d="M256 ${256 - r}L${256 - w} 256H256z" fill="${left}"/></g>`;
};
let short = '', mid = '', long = '';
for (let i = 0; i < 16; i++) {
  if (i % 2) short += pt(i, 98, 15, '#8FA3B6', '#5E7389');
  else if (i % 4) mid += pt(i, 132, 22, '#C6DEEA', '#8FA3B6');
  else if (i) long += pt(i, 180, 33, '#F7F9F8', '#C6DEEA');
}
const north = pt(0, 180, 33, '#E070B6', '#B0207A');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<rect width="512" height="512" fill="#142236"/>
<circle cx="256" cy="256" r="146" fill="none" stroke="#DCEBF2" stroke-opacity=".45" stroke-width="6"/>
${short}${mid}${long}${north}
<circle cx="256" cy="256" r="13" fill="#142236" stroke="#F7F9F8" stroke-width="6"/>
</svg>
`;
fs.writeFileSync(out, svg);
console.log('written', out, svg.length, 'bytes');
