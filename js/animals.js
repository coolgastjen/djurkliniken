// Djurgrafik: alla djur ritas som SVG med kod (viewBox 0 0 200 200, fötterna vid y≈190)
const OUT = '#4b3a33';
const SK = `stroke="${OUT}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const SK2 = `stroke="${OUT}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
let _uid = 0;

// ---------- Ansiktsdelar som delas av alla djur ----------

function eyesSvg([x1, x2, y], mood, r = 8) {
  const line = `fill="none" stroke="#2b2024" stroke-width="3.5" stroke-linecap="round"`;
  if (mood === 'sick') {
    return `<path d="M${x1 - r} ${y} q${r} ${r * 0.7} ${r * 2} 0 M${x2 - r} ${y} q${r} ${r * 0.7} ${r * 2} 0" ${line}/>`;
  }
  if (mood === 'joy') {
    return `<path d="M${x1 - r} ${y + 2} q${r} ${-r * 1.5} ${r * 2} 0 M${x2 - r} ${y + 2} q${r} ${-r * 1.5} ${r * 2} 0" ${line}/>`;
  }
  const one = x => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="#2b2024"/>` +
    `<circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff"/>` +
    `<circle cx="${x - r * 0.35}" cy="${y + r * 0.4}" r="${r * 0.17}" fill="#fff"/>`;
  let s = `<g class="eyes">${one(x1)}${one(x2)}</g>`;
  if (mood === 'sad') {
    s += `<path d="M${x1 - r - 2} ${y - r - 5} L${x1 + r} ${y - r - 10} M${x2 + r + 2} ${y - r - 5} L${x2 - r} ${y - r - 10}" stroke="#2b2024" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M${x2 + r - 1} ${y + r + 1} q-4 7 0 10 q4 -3 0 -10Z" fill="#7cc4f2" class="tear"/>`;
  }
  return s;
}

function mouthSvg([x, y, w], mood) {
  if (mood === 'happy' || mood === 'joy') {
    return `<path d="M${x - w} ${y} Q${x} ${y + w * 1.7} ${x + w} ${y} Z" fill="#8a3341" ${SK2}/>` +
      `<ellipse cx="${x}" cy="${y + w * 0.6}" rx="${w * 0.45}" ry="${w * 0.25}" fill="#f27c93"/>`;
  }
  const line = `fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"`;
  if (mood === 'sad') {
    return `<path d="M${x - w * 0.8} ${y + w * 0.6} Q${x} ${y - w * 0.3} ${x + w * 0.8} ${y + w * 0.6}" ${line}/>`;
  }
  if (mood === 'sick') {
    return `<path d="M${x - w} ${y + 3} q${w / 2} -4 ${w} 0 q${w / 2} 4 ${w} 0" ${line}/>`;
  }
  return `<path d="M${x - w} ${y} q${w / 2} ${w * 0.6} ${w} 0 q${w / 2} ${w * 0.6} ${w} 0" ${line}/>`;
}

function cheeksSvg([x1, x2, y], mood) {
  const fill = mood === 'sick' ? '#ff4d4d' : '#ff8fa3';
  const op = mood === 'sick' ? 0.6 : 0.45;
  return `<ellipse cx="${x1}" cy="${y}" rx="8" ry="5" fill="${fill}" opacity="${op}"/>` +
    `<ellipse cx="${x2}" cy="${y}" rx="8" ry="5" fill="${fill}" opacity="${op}"/>`;
}

function paw(x, y, rx, ry, fill) {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${SK}/>` +
    `<path d="M${x - rx * 0.3} ${y + ry * 0.1} v${ry * 0.6} M${x + rx * 0.3} ${y + ry * 0.1} v${ry * 0.6}" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>`;
}

// Linje med kontur (ritas två gånger: tjock mörk + smalare färg)
function strokeOut(d, color, w) {
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ---------- Djursorterna ----------

const SPECIES = {
  hund: {
    name: 'Hund', says: 'Voff voff!',
    colors: [
      { name: 'Brun', main: '#c8874a', light: '#f4dfc0', dark: '#7d4b22' },
      { name: 'Guld', main: '#eab35a', light: '#fcebc9', dark: '#c08532' },
      { name: 'Svart', main: '#4a444f', light: '#efe6da', dark: '#26222b' },
      { name: 'Vit med fläck', main: '#f7f3ec', light: '#ffffff', dark: '#4a444f', patch: true },
    ],
    eyes: [82, 118, 80], eyeR: 8, cheeks: [68, 132, 100], mouth: [100, 107, 9],
    spots: { ear: [52, 84], head: [100, 54], eye: [118, 80], legL: [80, 182], legR: [120, 182], body: [70, 150], mouth: [100, 110] },
    hat: [100, 44, 1], neck: [100, 125, 1],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:136px 152px">${strokeOut('M136 152 Q174 142 168 106', c.main, 11)}</g>
      <ellipse cx="100" cy="148" rx="46" ry="38" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="157" rx="26" ry="24" fill="${c.light}"/>
      ${paw(80, 182, 15, 10, c.main)}${paw(120, 182, 15, 10, c.main)}
      <circle cx="100" cy="84" r="44" fill="${c.main}" ${SK}/>
      ${c.patch ? `<ellipse cx="119" cy="78" rx="16" ry="15" fill="${c.dark}"/>` : ''}
      <g class="ears">
        <path d="M66 54 Q38 56 42 102 Q50 118 66 100 Q70 80 74 60 Z" fill="${c.dark}" ${SK}/>
        <path d="M134 54 Q162 56 158 102 Q150 118 134 100 Q130 80 126 60 Z" fill="${c.dark}" ${SK}/>
      </g>
      <ellipse cx="100" cy="104" rx="24" ry="18" fill="${c.light}"/>
      <ellipse cx="100" cy="96" rx="8.5" ry="6" fill="#2b2024"/>
      <ellipse cx="97" cy="94" rx="3" ry="1.8" fill="#fff" opacity=".7"/>
      <path d="M100 102 v4" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>`;
    },
  },

  katt: {
    name: 'Katt', says: 'Mjau!',
    colors: [
      { name: 'Orange', main: '#f0a04b', light: '#fde7c8', dark: '#c8712a', stripes: true },
      { name: 'Grå', main: '#9aa0aa', light: '#e6e8ec', dark: '#6b717c', stripes: true },
      { name: 'Svart', main: '#3e3a42', light: '#f1ebe4', dark: '#26232a' },
      { name: 'Vit', main: '#faf6f0', light: '#ffffff', dark: '#d9cbbd' },
    ],
    eyes: [80, 120, 84], eyeR: 8.5, cheeks: [66, 134, 102], mouth: [100, 108, 7],
    spots: { ear: [70, 46], head: [100, 60], eye: [120, 84], legL: [84, 183], legR: [116, 183], body: [70, 152], mouth: [100, 110] },
    hat: [100, 50, 1], neck: [100, 126, 0.9],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:136px 160px">${strokeOut('M136 162 Q184 152 172 112 Q166 92 180 78', c.main, 10)}</g>
      <ellipse cx="100" cy="150" rx="40" ry="36" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="158" rx="22" ry="22" fill="${c.light}"/>
      ${paw(84, 183, 12, 9, c.main)}${paw(116, 183, 12, 9, c.main)}
      <g class="ears">
        <path d="M60 70 L62 24 L96 52 Z" fill="${c.main}" ${SK}/>
        <path d="M140 70 L138 24 L104 52 Z" fill="${c.main}" ${SK}/>
        <path d="M67 60 L68 37 L85 52 Z" fill="#f6a9b8"/>
        <path d="M133 60 L132 37 L115 52 Z" fill="#f6a9b8"/>
      </g>
      <ellipse cx="100" cy="88" rx="46" ry="40" fill="${c.main}" ${SK}/>
      ${c.stripes ? `<path d="M100 50 v11 M89 52 l2 9 M111 52 l-2 9 M56 84 h9 M57 94 h8 M144 84 h-9 M143 94 h-8" stroke="${c.dark}" stroke-width="4" stroke-linecap="round"/>` : ''}
      <ellipse cx="92" cy="104" rx="10" ry="8" fill="${c.light}"/>
      <ellipse cx="108" cy="104" rx="10" ry="8" fill="${c.light}"/>
      <path d="M95 97 L105 97 L100 103 Z" fill="#f28ba3" ${SK2}/>
      <path d="M82 104 L56 98 M82 108 L56 110 M118 104 L144 98 M118 108 L144 110" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>`;
    },
  },

  kanin: {
    name: 'Kanin', says: '*nos nos*',
    colors: [
      { name: 'Vit', main: '#fbf8f3', light: '#ffffff', dark: '#e8d9cc' },
      { name: 'Brun', main: '#b9875e', light: '#efdcc6', dark: '#8a5e3b' },
      { name: 'Grå', main: '#a7a2a0', light: '#e9e5e2', dark: '#7d7774' },
      { name: 'Svart', main: '#4a4448', light: '#e7dfd8', dark: '#2c272b' },
    ],
    eyes: [84, 116, 86], eyeR: 8, cheeks: [70, 130, 103], mouth: [100, 109, 6],
    spots: { ear: [80, 30], head: [100, 60], eye: [116, 86], legL: [78, 184], legR: [122, 184], body: [68, 152], mouth: [100, 110] },
    hat: [100, 54, 0.9], neck: [100, 128, 0.9],
    draw(c) {
      return `
      <circle class="tail" cx="146" cy="166" r="13" fill="${c.light}" ${SK}/>
      <ellipse cx="100" cy="152" rx="42" ry="34" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="160" rx="24" ry="22" fill="${c.light}"/>
      ${paw(78, 184, 18, 9, c.main)}${paw(122, 184, 18, 9, c.main)}
      <g class="ears">
        <ellipse cx="82" cy="36" rx="13" ry="34" transform="rotate(-10 82 36)" fill="${c.main}" ${SK}/>
        <ellipse cx="82" cy="38" rx="6" ry="24" transform="rotate(-10 82 38)" fill="#f6a9b8"/>
        <ellipse cx="118" cy="36" rx="13" ry="34" transform="rotate(10 118 36)" fill="${c.main}" ${SK}/>
        <ellipse cx="118" cy="38" rx="6" ry="24" transform="rotate(10 118 38)" fill="#f6a9b8"/>
      </g>
      <circle cx="100" cy="92" r="40" fill="${c.main}" ${SK}/>
      <ellipse cx="93" cy="106" rx="9" ry="8" fill="${c.light}"/>
      <ellipse cx="107" cy="106" rx="9" ry="8" fill="${c.light}"/>
      <ellipse cx="100" cy="100" rx="5" ry="4" fill="#f28ba3" ${SK2}/>`;
    },
    drawTop() {
      return `<rect x="96" y="113" width="8" height="7" rx="1.5" fill="#fff" ${SK2}/><path d="M100 113 v7" stroke="${OUT}" stroke-width="1.5"/>`;
    },
  },

  marsvin: {
    name: 'Marsvin', says: 'Pip pip!',
    colors: [
      { name: 'Brun & vit', main: '#c07a45', light: '#fbe6cf', dark: '#8a5229', patch: '#fbf6ef' },
      { name: 'Orange', main: '#eba25a', light: '#fde6c6', dark: '#b8722f' },
      { name: 'Svart & vit', main: '#3f3a3f', light: '#f3ece4', dark: '#1f1c20', patch: '#fbf6ef' },
      { name: 'Beige', main: '#e5c79f', light: '#fbf1e2', dark: '#b8966b', patch: '#c98e55' },
    ],
    eyes: [80, 120, 104], eyeR: 7.5, cheeks: [66, 134, 120], mouth: [100, 126, 6],
    spots: { ear: [62, 76], head: [100, 80], eye: [120, 104], legL: [76, 186], legR: [124, 186], body: [156, 140], mouth: [100, 127] },
    hat: [100, 74, 0.9], neck: [100, 146, 1],
    draw(c, mood, u) {
      return `
      <defs><clipPath id="${u}b"><ellipse cx="100" cy="140" rx="68" ry="48"/></clipPath>
      <clipPath id="${u}h"><ellipse cx="100" cy="108" rx="44" ry="38"/></clipPath></defs>
      <ellipse cx="100" cy="140" rx="68" ry="48" fill="${c.main}"/>
      ${c.patch ? `<ellipse cx="160" cy="130" rx="30" ry="40" fill="${c.patch}" clip-path="url(#${u}b)"/>` : ''}
      <ellipse cx="100" cy="140" rx="68" ry="48" fill="none" ${SK}/>
      ${paw(76, 186, 11, 6, c.main)}${paw(124, 186, 11, 6, c.main)}
      <ellipse cx="62" cy="76" rx="14" ry="10" transform="rotate(-30 62 76)" fill="#e8a9a0" ${SK}/>
      <ellipse cx="138" cy="76" rx="14" ry="10" transform="rotate(30 138 76)" fill="#e8a9a0" ${SK}/>
      <ellipse cx="100" cy="108" rx="44" ry="38" fill="${c.main}"/>
      ${c.patch ? `<ellipse cx="68" cy="100" rx="26" ry="40" fill="${c.patch}" clip-path="url(#${u}h)"/><ellipse cx="100" cy="82" rx="8" ry="14" fill="${c.patch}" clip-path="url(#${u}h)"/>` : ''}
      <ellipse cx="100" cy="108" rx="44" ry="38" fill="none" ${SK}/>
      <ellipse cx="100" cy="123" rx="18" ry="13" fill="${c.light}"/>
      <ellipse cx="100" cy="117" rx="5.5" ry="3.8" fill="#8a4b4b"/>`;
    },
  },

  hast: {
    name: 'Häst', says: 'Gnägg!',
    colors: [
      { name: 'Brun', main: '#a0663a', light: '#dcb592', dark: '#3a2e2a', mane: '#3d2a20', blaze: true },
      { name: 'Svart', main: '#3b3438', light: '#6e6266', dark: '#1d181b', mane: '#1d181b', blaze: true },
      { name: 'Vit', main: '#f3efe9', light: '#e6dcd2', dark: '#7a6e66', mane: '#d6cbc0' },
      { name: 'Fux', main: '#c9733a', light: '#ebbd96', dark: '#4a3328', mane: '#f2d7a8', blaze: true },
    ],
    eyes: [80, 120, 70], eyeR: 7.5, cheeks: [74, 126, 92], mouth: [100, 115, 6],
    spots: { ear: [82, 30], head: [100, 50], eye: [120, 70], legL: [84, 168], legR: [116, 168], body: [134, 138], mouth: [100, 116], hoof: [84, 185] },
    hat: [100, 34, 0.85], neck: [100, 134, 0.8],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:138px 140px"><path d="M136 138 Q178 140 172 188 Q160 174 152 182 Q150 162 134 156 Z" fill="${c.mane}" ${SK}/></g>
      <ellipse cx="100" cy="142" rx="42" ry="28" fill="${c.main}" ${SK}/>
      <rect x="76" y="152" width="16" height="32" rx="6" fill="${c.main}" ${SK}/>
      <rect x="108" y="152" width="16" height="32" rx="6" fill="${c.main}" ${SK}/>
      <rect x="74" y="180" width="20" height="10" rx="3" fill="${c.dark}" ${SK}/>
      <rect x="106" y="180" width="20" height="10" rx="3" fill="${c.dark}" ${SK}/>
      <path d="M80 100 L76 136 L124 136 L120 100 Z" fill="${c.main}"/>
      <path d="M80 100 L78 119 M120 100 L122 119" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>
      <g class="ears">
        <path d="M74 46 L78 12 L96 36 Z" fill="${c.main}" ${SK}/>
        <path d="M126 46 L122 12 L104 36 Z" fill="${c.main}" ${SK}/>
        <path d="M79 38 L80 22 L89 34 Z" fill="${c.dark}" opacity=".5"/>
        <path d="M121 38 L120 22 L111 34 Z" fill="${c.dark}" opacity=".5"/>
      </g>
      <ellipse cx="100" cy="72" rx="31" ry="41" fill="${c.main}" ${SK}/>
      ${c.blaze ? `<path d="M96 46 Q100 42 104 46 L107 92 L93 92 Z" fill="#fff" opacity=".92"/>` : ''}
      <ellipse cx="100" cy="106" rx="27" ry="19" fill="${c.light}" ${SK}/>
      <ellipse cx="90" cy="104" rx="3.8" ry="2.8" fill="${OUT}"/>
      <ellipse cx="110" cy="104" rx="3.8" ry="2.8" fill="${OUT}"/>
      <path d="M84 38 Q100 22 116 38 Q112 54 100 58 Q90 52 84 38 Z" fill="${c.mane}" ${SK}/>`;
    },
  },

  fagel: {
    name: 'Fågel', says: 'Kvitter kvitter!',
    colors: [
      { name: 'Blå', main: '#5fa8e8', light: '#f4f8fc', dark: '#2f5f8f', belly: '#84c0f0', cheek: '#6c5ce7' },
      { name: 'Grön', main: '#7ccf5a', light: '#fbe96b', dark: '#3f7f33', belly: '#a2df82', cheek: '#5b6ee8' },
      { name: 'Gul', main: '#ffd84d', light: '#fff3b0', dark: '#c9a227', belly: '#ffe680', cheek: '#f08bb0' },
      { name: 'Röd', main: '#ef6b5a', light: '#ffd3a8', dark: '#a83a30', belly: '#f6957f', cheek: '#ffd84d' },
    ],
    eyes: [82, 118, 86], eyeR: 7, cheeks: [70, 130, 108], mouth: null,
    spots: { head: [100, 66], eye: [118, 86], legL: [86, 180], legR: [114, 180], body: [100, 146], mouth: [100, 108], wing: [52, 134] },
    wingPivot: [66, 108],
    hat: [100, 60, 0.85], neck: [100, 126, 0.9],
    draw(c, mood, u, a) {
      const hurtWing = a && a.injury && a.injury.type === 'vinge';
      const stripes = `<path d="M44 120 q8 4 16 0 M42 134 q9 4 18 0 M46 148 q7 3 14 0" fill="none" stroke="${OUT}" stroke-width="1.6" opacity=".45"/>`;
      return `
      <path d="M88 160 L82 196 L100 188 L118 196 L112 160 Z" fill="${c.dark}" ${SK}/>
      <path d="M86 170 v12 l-8 5 M86 182 l6 6 M114 170 v12 l8 5 M114 182 l-6 6" fill="none" stroke="#f08c2e" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="118" rx="50" ry="56" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="142" rx="30" ry="28" fill="${c.belly}"/>
      <ellipse cx="100" cy="92" rx="35" ry="28" fill="${c.light}"/>
      <g class="wingL" style="transform-origin:66px 108px${hurtWing ? ';transform:rotate(28deg)' : ''}">
        <path d="M58 100 Q26 128 46 164 Q66 152 68 112 Z" fill="${c.dark}" ${SK}/>${stripes}
      </g>
      <g class="wingR" style="transform-origin:134px 108px">
        <path d="M142 100 Q174 128 154 164 Q134 152 132 112 Z" fill="${c.dark}" ${SK}/>
        <g transform="translate(200 0) scale(-1 1)">${stripes}</g>
      </g>
      <path d="M96 64 Q90 46 100 40 Q98 52 106 60" fill="${c.main}" ${SK}/>
      <path d="M91 100 Q100 95 109 100 Q105 114 100 117 Q95 114 91 100 Z" fill="#f4a43a" ${SK}/>
      <ellipse cx="72" cy="104" rx="6" ry="5" fill="${c.cheek}" opacity=".8"/>
      <ellipse cx="128" cy="104" rx="6" ry="5" fill="${c.cheek}" opacity=".8"/>`;
    },
  },

  igelkott: {
    name: 'Igelkott', says: '*snörf snörf*',
    colors: [
      { name: 'Brun', main: '#a77c55', light: '#f0d9b5', dark: '#6e4b30' },
      { name: 'Ljus', main: '#d7bb94', light: '#fbecd3', dark: '#a8845f' },
      { name: 'Mörk', main: '#7a6250', light: '#e2c9a8', dark: '#43332a' },
    ],
    eyes: [84, 116, 120], eyeR: 6.5, cheeks: [72, 128, 136], mouth: [100, 160, 5],
    spots: { ear: [68, 98], head: [100, 96], eye: [116, 120], legL: [78, 186], legR: [122, 186], body: [150, 104], mouth: [100, 160] },
    hat: [100, 52, 0.9], neck: [100, 168, 0.9],
    draw(c) {
      const spikes = (r1, r2, cy, n) => {
        let d = '';
        for (let i = 0; i <= n; i++) {
          const t = 0.82 * Math.PI + (1.36 * Math.PI) * i / n;
          const r = i % 2 ? r2 : r1;
          d += (i ? 'L' : 'M') + (100 + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1) + ' ';
        }
        return d + 'L100 178 Z';
      };
      return `
      <path d="${spikes(60, 84, 128, 30)}" fill="${c.dark}" ${SK}/>
      <path d="${spikes(50, 68, 128, 30)}" fill="${c.main}" opacity=".85"/>
      <ellipse cx="100" cy="176" rx="40" ry="14" fill="${c.light}" ${SK}/>
      ${paw(78, 186, 10, 6, c.dark)}${paw(122, 186, 10, 6, c.dark)}
      <circle cx="68" cy="98" r="9" fill="${c.light}" ${SK}/><circle cx="68" cy="98" r="4" fill="#f6a9b8"/>
      <circle cx="132" cy="98" r="9" fill="${c.light}" ${SK}/><circle cx="132" cy="98" r="4" fill="#f6a9b8"/>
      <ellipse cx="100" cy="128" rx="40" ry="36" fill="${c.light}" ${SK}/>
      <ellipse cx="100" cy="148" rx="15" ry="11" fill="${c.light}" ${SK}/>
      <circle cx="100" cy="147" r="6.5" fill="#2b2024"/>
      <circle cx="98" cy="145" r="2" fill="#fff" opacity=".7"/>`;
    },
  },

  gris: {
    name: 'Gris', says: 'Nöff nöff!',
    colors: [
      { name: 'Rosa', main: '#f7b2bf', light: '#fcd6dd', dark: '#e0879a' },
      { name: 'Fläckig', main: '#f7b2bf', light: '#fcd6dd', dark: '#e0879a', spots: '#4a444f' },
      { name: 'Brun', main: '#c8875f', light: '#ebc3a5', dark: '#8a5434' },
      { name: 'Svart', main: '#4a444f', light: '#7a7280', dark: '#2a262e' },
    ],
    eyes: [82, 118, 80], eyeR: 7.5, cheeks: [66, 134, 96], mouth: [100, 123, 7],
    spots: { ear: [70, 44], head: [100, 54], eye: [118, 80], legL: [80, 184], legR: [120, 184], body: [70, 150], mouth: [100, 124] },
    hat: [100, 48, 0.95], neck: [100, 130, 1],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:140px 148px"><path d="M140 148 q16 -4 12 -16 q-4 -8 -10 -2 q-4 8 8 9" fill="none" stroke="${OUT}" stroke-width="8" stroke-linecap="round"/><path d="M140 148 q16 -4 12 -16 q-4 -8 -10 -2 q-4 8 8 9" fill="none" stroke="${c.main}" stroke-width="4" stroke-linecap="round"/></g>
      <ellipse cx="100" cy="148" rx="48" ry="38" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="157" rx="28" ry="22" fill="${c.light}"/>
      ${c.spots ? `<ellipse cx="72" cy="140" rx="13" ry="10" fill="${c.spots}"/><ellipse cx="132" cy="160" rx="8" ry="7" fill="${c.spots}"/>` : ''}
      <ellipse cx="80" cy="184" rx="12" ry="8" fill="${c.dark}" ${SK}/><ellipse cx="120" cy="184" rx="12" ry="8" fill="${c.dark}" ${SK}/>
      <path d="M80 179 v9 M120 179 v9" stroke="${OUT}" stroke-width="2"/>
      <g class="ears">
        <path d="M64 60 L56 26 L92 48 Z" fill="${c.main}" ${SK}/><path d="M66 52 L62 34 L82 48 Z" fill="${c.dark}"/>
        <path d="M136 60 L144 26 L108 48 Z" fill="${c.main}" ${SK}/><path d="M134 52 L138 34 L118 48 Z" fill="${c.dark}"/>
      </g>
      <circle cx="100" cy="88" r="42" fill="${c.main}" ${SK}/>
      ${c.spots ? `<ellipse cx="121" cy="66" rx="12" ry="10" fill="${c.spots}"/>` : ''}
      <ellipse cx="100" cy="104" rx="21" ry="14" fill="${c.light}" ${SK}/>
      <ellipse cx="93" cy="104" rx="3.5" ry="5" fill="${c.dark}"/><ellipse cx="107" cy="104" rx="3.5" ry="5" fill="${c.dark}"/>`;
    },
  },

  ko: {
    name: 'Ko', says: 'Muuu!',
    colors: [
      { name: 'Svartvit', main: '#fbf8f3', light: '#f7c1c8', dark: '#3b3540', patch: '#3b3540' },
      { name: 'Brunvit', main: '#fbf8f3', light: '#f7c1c8', dark: '#3b3540', patch: '#9b5a32' },
      { name: 'Brun', main: '#b5733f', light: '#ebc3a5', dark: '#3b3540' },
      { name: 'Svart', main: '#3e3a42', light: '#8a7f86', dark: '#1f1c20' },
    ],
    eyes: [84, 116, 72], eyeR: 7, cheeks: [70, 130, 90], mouth: [100, 116, 6],
    spots: { ear: [54, 66], head: [100, 46], eye: [116, 72], legL: [82, 170], legR: [118, 170], body: [140, 140], mouth: [100, 117], hoof: [82, 186] },
    hat: [100, 40, 0.85], neck: [100, 128, 0.9],
    draw(c, mood, u) {
      return `
      <defs><clipPath id="${u}b"><ellipse cx="100" cy="146" rx="50" ry="34"/></clipPath><clipPath id="${u}h"><ellipse cx="100" cy="76" rx="36" ry="38"/></clipPath></defs>
      <g class="tail" style="transform-origin:142px 140px"><path d="M142 140 Q166 150 160 176" fill="none" stroke="${OUT}" stroke-width="9" stroke-linecap="round"/><path d="M142 140 Q166 150 160 176" fill="none" stroke="${c.main}" stroke-width="4" stroke-linecap="round"/><ellipse cx="160" cy="180" rx="6" ry="8" fill="${c.dark}"/></g>
      <ellipse cx="100" cy="146" rx="50" ry="34" fill="${c.main}"/>
      ${c.patch ? `<g clip-path="url(#${u}b)"><ellipse cx="68" cy="134" rx="20" ry="15" fill="${c.patch}"/><ellipse cx="132" cy="160" rx="18" ry="13" fill="${c.patch}"/></g>` : ''}
      <ellipse cx="100" cy="146" rx="50" ry="34" fill="none" ${SK}/>
      <rect x="74" y="156" width="16" height="28" rx="6" fill="${c.main}" ${SK}/><rect x="110" y="156" width="16" height="28" rx="6" fill="${c.main}" ${SK}/>
      <rect x="72" y="180" width="20" height="10" rx="3" fill="${c.dark}" ${SK}/><rect x="108" y="180" width="20" height="10" rx="3" fill="${c.dark}" ${SK}/>
      <path d="M70 50 Q54 42 58 24 Q68 38 80 44 Z" fill="#f3e3c3" ${SK}/><path d="M130 50 Q146 42 142 24 Q132 38 120 44 Z" fill="#f3e3c3" ${SK}/>
      <g class="ears">
        <ellipse cx="54" cy="66" rx="17" ry="9" transform="rotate(-15 54 66)" fill="${c.main}" ${SK}/><ellipse cx="54" cy="66" rx="9" ry="4" transform="rotate(-15 54 66)" fill="#f7c1c8"/>
        <ellipse cx="146" cy="66" rx="17" ry="9" transform="rotate(15 146 66)" fill="${c.main}" ${SK}/><ellipse cx="146" cy="66" rx="9" ry="4" transform="rotate(15 146 66)" fill="#f7c1c8"/>
      </g>
      <ellipse cx="100" cy="76" rx="36" ry="38" fill="${c.main}"/>
      ${c.patch ? `<ellipse cx="120" cy="62" rx="15" ry="17" fill="${c.patch}" clip-path="url(#${u}h)"/>` : ''}
      <ellipse cx="100" cy="76" rx="36" ry="38" fill="none" ${SK}/>
      <ellipse cx="100" cy="106" rx="30" ry="18" fill="${c.light}" ${SK}/>
      <ellipse cx="89" cy="103" rx="4" ry="3" fill="#b8606e"/><ellipse cx="111" cy="103" rx="4" ry="3" fill="#b8606e"/>`;
    },
  },

  get: {
    name: 'Get', says: 'Bä-ä-ä!',
    colors: [
      { name: 'Vit', main: '#f6f2ec', light: '#ffffff', dark: '#5a4e48' },
      { name: 'Brun', main: '#a8774f', light: '#e3c8ae', dark: '#3b3540' },
      { name: 'Svart', main: '#3e3a42', light: '#f1ebe4', dark: '#1f1c20' },
      { name: 'Grå', main: '#a7a2a0', light: '#e9e5e2', dark: '#4a4448' },
    ],
    eyes: [86, 114, 68], eyeR: 6.5, cheeks: [74, 126, 86], mouth: [100, 104, 5],
    spots: { ear: [60, 66], head: [100, 44], eye: [114, 68], legL: [84, 170], legR: [116, 170], body: [136, 142], mouth: [100, 105], hoof: [84, 185] },
    hat: [100, 40, 0.8], neck: [100, 120, 0.8],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:140px 134px"><path d="M138 134 L148 116 L152 130 Z" fill="${c.main}" ${SK}/></g>
      <ellipse cx="100" cy="146" rx="44" ry="30" fill="${c.main}" ${SK}/>
      <rect x="78" y="154" width="13" height="30" rx="5" fill="${c.main}" ${SK}/><rect x="109" y="154" width="13" height="30" rx="5" fill="${c.main}" ${SK}/>
      <rect x="76" y="180" width="17" height="9" rx="3" fill="${c.dark}" ${SK}/><rect x="107" y="180" width="17" height="9" rx="3" fill="${c.dark}" ${SK}/>
      <path d="M82 44 Q70 22 86 10 Q82 26 92 40 Z" fill="#cdbfa8" ${SK}/><path d="M118 44 Q130 22 114 10 Q118 26 108 40 Z" fill="#cdbfa8" ${SK}/>
      <g class="ears">
        <ellipse cx="62" cy="66" rx="17" ry="7" transform="rotate(20 62 66)" fill="${c.main}" ${SK}/>
        <ellipse cx="138" cy="66" rx="17" ry="7" transform="rotate(-20 138 66)" fill="${c.main}" ${SK}/>
      </g>
      <ellipse cx="100" cy="72" rx="30" ry="34" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="98" rx="20" ry="14" fill="${c.light}" ${SK}/>
      <ellipse cx="94" cy="95" rx="2.5" ry="2" fill="${OUT}"/><ellipse cx="106" cy="95" rx="2.5" ry="2" fill="${OUT}"/>
      <path d="M92 110 Q100 134 108 110 Z" fill="${c.light}" ${SK}/>`;
    },
  },

  anka: {
    name: 'Anka', says: 'Kvack kvack!',
    colors: [
      { name: 'Gul', main: '#ffd84d', light: '#fff3b0', dark: '#e6b52e', tuft: true },
      { name: 'Vit', main: '#fbf8f3', light: '#ffffff', dark: '#e2d9cc' },
      { name: 'Gräsand', main: '#a8845e', light: '#e6d3b8', dark: '#6e5238', head: '#2f8a4a' },
      { name: 'Brun', main: '#b88a5a', light: '#ecd6b6', dark: '#7d5a36' },
    ],
    eyes: [86, 114, 72], eyeR: 6.5, cheeks: [74, 126, 88], mouth: null,
    spots: { head: [100, 52], eye: [114, 72], legL: [82, 188], legR: [118, 188], body: [100, 152], mouth: [100, 104], wing: [54, 146] },
    wingPivot: [68, 124],
    hat: [100, 46, 0.85], neck: [100, 118, 0.9],
    draw(c, mood, u, a) {
      const hurtWing = a && a.injury && a.injury.type === 'vinge';
      return `
      <ellipse cx="82" cy="188" rx="15" ry="6" fill="#f59f00" ${SK}/><ellipse cx="118" cy="188" rx="15" ry="6" fill="#f59f00" ${SK}/>
      <ellipse cx="100" cy="142" rx="50" ry="44" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="154" rx="28" ry="24" fill="${c.light}"/>
      <g class="wingL" style="transform-origin:68px 124px${hurtWing ? ';transform:rotate(28deg)' : ''}"><path d="M60 120 Q38 150 58 176 Q74 164 72 128 Z" fill="${c.dark}" ${SK}/></g>
      <g class="wingR" style="transform-origin:132px 124px"><path d="M140 120 Q162 150 142 176 Q126 164 128 128 Z" fill="${c.dark}" ${SK}/></g>
      <circle cx="100" cy="78" r="36" fill="${c.head || c.main}" ${SK}/>
      ${c.head ? `<path d="M70 108 Q100 120 130 108" fill="none" stroke="#fff" stroke-width="5"/>` : ''}
      ${c.tuft ? `<path d="M98 44 q-8 -12 4 -16 q-4 7 2 14" fill="${c.main}" ${SK}/>` : ''}
      <path d="M77 98 Q100 87 123 98 Q125 111 100 113 Q75 111 77 98 Z" fill="#f59f00" ${SK}/>
      <path d="M82 102 Q100 107 118 102" fill="none" stroke="${OUT}" stroke-width="2"/>
      <circle cx="93" cy="96" r="1.6" fill="${OUT}"/><circle cx="107" cy="96" r="1.6" fill="${OUT}"/>`;
    },
  },

  skoldpadda: {
    name: 'Sköldpadda', says: '*mums*',
    colors: [
      { name: 'Grön', main: '#9ccf6a', light: '#f2df9a', dark: '#5e7f33', patch: '#86a744' },
      { name: 'Brun', main: '#c2b77a', light: '#f2df9a', dark: '#8a5a32', patch: '#a8744a' },
      { name: 'Havsblå', main: '#8fd0c4', light: '#f2e6b8', dark: '#3f7f86', patch: '#5aa3a8' },
    ],
    eyes: [88, 112, 112], eyeR: 6, cheeks: [78, 122, 126], mouth: [100, 135, 6],
    spots: { head: [100, 94], eye: [112, 112], legL: [44, 172], legR: [156, 172], body: [140, 100], mouth: [100, 137] },
    hat: [100, 88, 0.8], neck: [100, 150, 0.8],
    draw(c) {
      return `
      <path d="M30 160 Q30 68 100 64 Q170 68 170 160 Z" fill="${c.dark}" ${SK}/>
      <path d="M88 82 L112 82 L122 104 L112 126 L88 126 L78 104 Z" fill="${c.patch}" ${SK2}/>
      <path d="M48 128 L68 108 L74 140 L54 152 Z M152 128 L132 108 L126 140 L146 152 Z M62 92 L80 76 L74 100 Z M138 92 L120 76 L126 100 Z" fill="${c.patch}" ${SK2}/>
      <ellipse cx="44" cy="172" rx="17" ry="12" fill="${c.main}" ${SK}/><ellipse cx="156" cy="172" rx="17" ry="12" fill="${c.main}" ${SK}/>
      <path d="M36 180 v4 M44 182 v4 M52 180 v4 M148 180 v4 M156 182 v4 M164 180 v4" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="100" cy="166" rx="54" ry="18" fill="${c.light}" ${SK}/>
      <path d="M70 160 h60 M76 172 h48" stroke="#d9c27a" stroke-width="2.5"/>
      <circle cx="100" cy="120" r="32" fill="${c.main}" ${SK}/>
      <circle cx="96" cy="126" r="1.5" fill="${OUT}"/><circle cx="104" cy="126" r="1.5" fill="${OUT}"/>`;
    },
  },

  rav: {
    name: 'Räv', says: 'Yip yip!',
    colors: [
      { name: 'Röd', main: '#f08a3c', light: '#fff4e6', dark: '#4a3a33' },
      { name: 'Silver', main: '#8f96a3', light: '#f4f5f7', dark: '#3b3540' },
      { name: 'Fjällräv', main: '#f6f4f0', light: '#ffffff', dark: '#c9c2b8' },
      { name: 'Brun', main: '#b4683a', light: '#f6e2cc', dark: '#3b2e2a' },
    ],
    eyes: [80, 120, 80], eyeR: 7.5, cheeks: [68, 132, 100], mouth: [100, 108, 7],
    spots: { ear: [72, 44], head: [100, 56], eye: [120, 80], legL: [84, 183], legR: [116, 183], body: [70, 152], mouth: [100, 110] },
    hat: [100, 48, 0.95], neck: [100, 126, 0.9],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:134px 156px">
        <path d="M134 162 Q192 154 180 100 Q174 84 160 92 Q168 124 132 142 Z" fill="${c.main}" ${SK}/>
        <path d="M180 100 Q174 84 160 92 Q162 104 168 110 Q176 108 180 100 Z" fill="${c.light}" ${SK2}/>
      </g>
      <ellipse cx="100" cy="150" rx="40" ry="34" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="157" rx="22" ry="24" fill="${c.light}"/>
      ${paw(84, 183, 12, 9, c.dark)}${paw(116, 183, 12, 9, c.dark)}
      <g class="ears">
        <path d="M58 68 L60 18 L96 50 Z" fill="${c.main}" ${SK}/><path d="M65 58 L66 32 L85 50 Z" fill="${c.dark}"/>
        <path d="M142 68 L140 18 L104 50 Z" fill="${c.main}" ${SK}/><path d="M135 58 L134 32 L115 50 Z" fill="${c.dark}"/>
      </g>
      <ellipse cx="100" cy="84" rx="46" ry="38" fill="${c.main}" ${SK}/>
      <path d="M56 92 Q76 82 100 96 Q124 82 144 92 Q130 120 100 120 Q70 120 56 92 Z" fill="${c.light}"/>
      <ellipse cx="100" cy="100" rx="6.5" ry="4.5" fill="#2b2024"/>`;
    },
  },

  ekorre: {
    name: 'Ekorre', says: 'Tjick tjick!',
    colors: [
      { name: 'Röd', main: '#c8662f', light: '#f6dcc0', dark: '#8a4220' },
      { name: 'Grå', main: '#8d8f99', light: '#ecebef', dark: '#5a5c66' },
      { name: 'Brun', main: '#8b5a3c', light: '#ead2bb', dark: '#5a3824' },
      { name: 'Svart', main: '#3e3a42', light: '#a39aa3', dark: '#1f1c20' },
    ],
    eyes: [86, 114, 90], eyeR: 7, cheeks: [76, 124, 104], mouth: [100, 112, 5],
    spots: { ear: [78, 52], head: [100, 66], eye: [114, 90], legL: [84, 184], legR: [116, 184], body: [74, 158], mouth: [100, 113] },
    hat: [100, 62, 0.8], neck: [100, 128, 0.8],
    draw(c) {
      return `
      <g class="tail" style="transform-origin:128px 160px">
        <path d="M126 170 Q188 168 182 110 Q178 58 140 46 Q118 42 122 64 Q150 68 156 102 Q160 142 120 150 Z" fill="${c.main}" ${SK}/>
        <path d="M134 60 Q164 72 168 108 M148 152 Q172 136 172 112" fill="none" stroke="${c.dark}" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      </g>
      <ellipse cx="100" cy="152" rx="34" ry="32" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="159" rx="20" ry="22" fill="${c.light}"/>
      ${paw(84, 184, 12, 7, c.main)}${paw(116, 184, 12, 7, c.main)}
      <ellipse cx="100" cy="142" rx="7" ry="8" fill="#b07a45" ${SK2}/><path d="M92 137 Q100 128 108 137 Z" fill="#6e4a2a" ${SK2}/>
      <ellipse cx="89" cy="140" rx="7" ry="8" fill="${c.main}" ${SK2}/><ellipse cx="111" cy="140" rx="7" ry="8" fill="${c.main}" ${SK2}/>
      <g class="ears">
        <path d="M70 70 L72 36 L92 58 Z" fill="${c.main}" ${SK}/><path d="M72 36 l-5 -9 M72 36 l1 -10 M72 36 l6 -7" stroke="${c.dark}" stroke-width="3" stroke-linecap="round"/>
        <path d="M130 70 L128 36 L108 58 Z" fill="${c.main}" ${SK}/><path d="M128 36 l5 -9 M128 36 l-1 -10 M128 36 l-6 -7" stroke="${c.dark}" stroke-width="3" stroke-linecap="round"/>
      </g>
      <circle cx="100" cy="94" r="34" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="108" rx="16" ry="12" fill="${c.light}"/>
      <ellipse cx="100" cy="103" rx="4.5" ry="3.5" fill="#2b2024"/>`;
    },
  },

  hamster: {
    name: 'Hamster', says: 'Pip!',
    colors: [
      { name: 'Guld', main: '#e9a65a', light: '#fff3e0', dark: '#b8722f' },
      { name: 'Vit', main: '#f8f4ee', light: '#ffffff', dark: '#d8ccbf' },
      { name: 'Grå', main: '#a8a3a6', light: '#f1eef0', dark: '#77727a' },
      { name: 'Panda', main: '#3f3a3f', light: '#fbf6ef', dark: '#1f1c20' },
    ],
    eyes: [82, 118, 92], eyeR: 7, cheeks: [66, 134, 112], mouth: [100, 114, 5],
    spots: { ear: [66, 64], head: [100, 66], eye: [118, 92], legL: [80, 186], legR: [120, 186], body: [150, 150], mouth: [100, 115] },
    hat: [100, 60, 0.85], neck: [100, 134, 0.9],
    draw(c) {
      return `
      <ellipse cx="100" cy="146" rx="56" ry="44" fill="${c.main}" ${SK}/>
      <ellipse cx="100" cy="158" rx="34" ry="27" fill="${c.light}"/>
      <ellipse cx="80" cy="187" rx="10" ry="5" fill="#f6a9b8" ${SK2}/><ellipse cx="120" cy="187" rx="10" ry="5" fill="#f6a9b8" ${SK2}/>
      <ellipse cx="88" cy="142" rx="6" ry="5" fill="#f6a9b8" ${SK2}/><ellipse cx="112" cy="142" rx="6" ry="5" fill="#f6a9b8" ${SK2}/>
      <circle cx="66" cy="64" r="12" fill="${c.main}" ${SK}/><circle cx="66" cy="64" r="6" fill="#f6a9b8"/>
      <circle cx="134" cy="64" r="12" fill="${c.main}" ${SK}/><circle cx="134" cy="64" r="6" fill="#f6a9b8"/>
      <ellipse cx="100" cy="96" rx="44" ry="38" fill="${c.main}" ${SK}/>
      <ellipse cx="72" cy="110" rx="18" ry="14" fill="${c.light}"/><ellipse cx="128" cy="110" rx="18" ry="14" fill="${c.light}"/>
      <ellipse cx="100" cy="109" rx="12" ry="9" fill="${c.light}"/>
      <ellipse cx="100" cy="104" rx="4" ry="3" fill="#e57d97"/>`;
    },
  },
};

const SPECIES_ORDER = ['hund', 'katt', 'kanin', 'marsvin', 'hamster', 'hast', 'ko', 'gris', 'get', 'fagel', 'anka', 'skoldpadda', 'igelkott', 'rav', 'ekorre'];

// ---------- Tillbehör (ritas runt punkten 0,0) ----------

const ACCESSORIES = {
  hatt: {
    name: 'Hög hatt', slot: 'head', price: 25,
    draw: () => `<rect x="-16" y="-36" width="32" height="32" rx="3" fill="#3b3540" ${SK}/><rect x="-15" y="-14" width="30" height="7" fill="#e5484d"/><rect x="-27" y="-7" width="54" height="9" rx="4.5" fill="#3b3540" ${SK}/>`,
  },
  krona: {
    name: 'Krona', slot: 'head', price: 40,
    draw: () => `<path d="M-22 0 L-24 -26 L-12 -14 L0 -32 L12 -14 L24 -26 L22 0 Z" fill="#ffcf3f" ${SK}/><circle cx="0" cy="-10" r="4" fill="#e5484d" ${SK2}/><circle cx="-14" cy="-6" r="3" fill="#4dabf7"/><circle cx="14" cy="-6" r="3" fill="#4dabf7"/>`,
  },
  rosett: {
    name: 'Rosett', slot: 'head', price: 15, iconVb: '0 -20 48 48',
    draw: () => `<g transform="translate(24 4) rotate(15)"><path d="M0 0 L-17 -11 Q-22 0 -17 11 Z" fill="#ff7eb6" ${SK}/><path d="M0 0 L17 -11 Q22 0 17 11 Z" fill="#ff7eb6" ${SK}/><circle r="5.5" fill="#ff4f9a" ${SK2}/></g>`,
  },
  blomma: {
    name: 'Blomma', slot: 'head', price: 15, iconVb: '-48 -20 48 48',
    draw: () => {
      let p = '';
      for (let i = 0; i < 5; i++) {
        const t = i * Math.PI * 2 / 5;
        p += `<circle cx="${(Math.cos(t) * 8).toFixed(1)}" cy="${(Math.sin(t) * 8).toFixed(1)}" r="7" fill="#ffa8d6" ${SK2}/>`;
      }
      return `<g transform="translate(-24 4)">${p}<circle r="5.5" fill="#ffd43b" ${SK2}/></g>`;
    },
  },
  keps: {
    name: 'Keps', slot: 'head', price: 20,
    draw: () => `<path d="M-22 -2 Q-22 -28 0 -28 Q22 -28 22 -2 Z" fill="#4dabf7" ${SK}/><path d="M14 -4 Q34 -6 38 2 Q26 6 10 2 Z" fill="#1c7ed6" ${SK}/><circle cx="0" cy="-27" r="3.5" fill="#1c7ed6" ${SK2}/>`,
  },
  halsband: {
    name: 'Halsband', slot: 'neck', price: 15,
    draw: () => `${strokeOut('M-30 -4 Q0 12 30 -4', '#e5484d', 6)}<circle cx="0" cy="9" r="6" fill="#ffcf3f" ${SK2}/>`,
  },
  scarf: {
    name: 'Halsduk', slot: 'neck', price: 20,
    draw: () => `${strokeOut('M-32 -6 Q0 14 32 -6', '#51cf66', 10)}<path d="M-16 4 l-6 26 l12 2 l2 -24 Z" fill="#51cf66" ${SK}/><path d="M-20 14 l9 1 M-21 22 l9 1" stroke="#fff" stroke-width="3"/><path d="M-18 2 l6 2 M4 5 l6 -1 M18 0 l6 -3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  },
  glasogon: {
    name: 'Solglasögon', slot: 'face', price: 25,
    draw: (e) => {
      const [x1, x2, y] = e;
      const lens = x => `<rect x="${x - 13}" y="${y - 10}" width="26" height="20" rx="8" fill="#2b2b3a" ${SK2}/><path d="M${x - 7} ${y - 5} l6 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`;
      return `<path d="M${x1 + 13} ${y - 2} Q100 ${y - 8} ${x2 - 13} ${y - 2}" fill="none" stroke="#2b2b3a" stroke-width="3"/>${lens(x1)}${lens(x2)}`;
    },
  },
};

function drawAccessory(id, sp) {
  const acc = ACCESSORIES[id];
  if (!acc) return '';
  if (acc.slot === 'face') return acc.draw(sp.eyes);
  const [x, y, sc] = acc.slot === 'head' ? sp.hat : sp.neck;
  return `<g transform="translate(${x} ${y}) scale(${sc})">${acc.draw()}</g>`;
}

// Ikon för ett tillbehör (för butiken)
function accessoryIcon(id) {
  const acc = ACCESSORIES[id];
  if (acc.slot === 'face') return `<svg viewBox="50 60 100 40">${acc.draw([80, 120, 80])}</svg>`;
  const vb = acc.iconVb || (acc.slot === 'head' ? '-42 -44 84 60' : '-40 -20 80 56');
  return `<svg viewBox="${vb}">${acc.draw()}</svg>`;
}

// ---------- Ryttare (när man rider på hästen) ----------

const SKIN = '#f5c9a6';
function riderBack() {
  return `
  <path d="M64 40 Q64 -8 100 -10 Q136 -8 136 40 Z" fill="#ff7a59" ${SK}/>
  <path d="M84 -8 Q100 6 116 -8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  ${strokeOut('M70 2 Q60 30 82 54', '#ff7a59', 10)}${strokeOut('M130 2 Q140 30 118 54', '#ff7a59', 10)}
  <rect x="93" y="-16" width="14" height="10" fill="${SKIN}"/>
  <path d="M77 -30 Q74 -6 86 -8 L114 -8 Q126 -6 123 -30 Z" fill="#8a5a3b" ${SK}/>
  <circle cx="100" cy="-30" r="21" fill="${SKIN}" ${SK}/>
  <circle cx="92" cy="-28" r="2.8" fill="#2b2024"/><circle cx="108" cy="-28" r="2.8" fill="#2b2024"/>
  <path d="M94 -20 Q100 -15 106 -20" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="86" cy="-21" rx="4" ry="2.4" fill="#ff8fa3" opacity=".6"/><ellipse cx="114" cy="-21" rx="4" ry="2.4" fill="#ff8fa3" opacity=".6"/>
  <path d="M77 -34 Q77 -58 100 -58 Q123 -58 123 -34 Z" fill="#3b3540" ${SK}/>
  <path d="M74 -34 H128" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>
  <path d="M88 -50 Q94 -55 102 -54" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
}
function riderFront() {
  return `
  <path d="M56 122 L80 118 L80 152 L60 156 Z" fill="#4dabf7" ${SK}/>
  <path d="M144 122 L120 118 L120 152 L140 156 Z" fill="#4dabf7" ${SK}/>
  ${strokeOut('M72 116 Q52 126 55 158', '#3b5bdb', 11)}${strokeOut('M128 116 Q148 126 145 158', '#3b5bdb', 11)}
  <ellipse cx="54" cy="164" rx="9" ry="7" fill="#3b3540" ${SK2}/><ellipse cx="146" cy="164" rx="9" ry="7" fill="#3b3540" ${SK2}/>
  <path d="M70 70 Q74 90 82 108 M130 70 Q126 90 118 108" fill="none" stroke="#7a4a22" stroke-width="3" stroke-linecap="round"/>`;
}

// ---------- Skelett (när ett djur har dött) ----------

const SKELETON = {
  hund: { skull: 'round', tail: 'long', size: 0.9 }, katt: { skull: 'round', tail: 'long', size: 0.85 },
  kanin: { skull: 'round', tail: 'none', size: 0.75 }, marsvin: { skull: 'round', tail: 'none', size: 0.7 },
  hamster: { skull: 'round', tail: 'none', size: 0.6 }, hast: { skull: 'long', tail: 'short', size: 1.15 },
  ko: { skull: 'long', tail: 'long', size: 1.15, horns: true }, gris: { skull: 'round', tail: 'curl', size: 1 },
  get: { skull: 'long', tail: 'short', size: 1, horns: true }, fagel: { skull: 'beak', bird: true, size: 0.7 },
  anka: { skull: 'beak', bird: true, size: 0.8 }, skoldpadda: { shell: true, size: 0.85 },
  igelkott: { skull: 'round', tail: 'none', size: 0.65, spikes: true }, rav: { skull: 'round', tail: 'long', size: 0.9 },
  ekorre: { skull: 'round', tail: 'long', size: 0.7 },
};

const BONE = '#fbf7ee';
function bone(x1, y1, x2, y2, w = 7) {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${OUT}" stroke-width="${w + 5}" stroke-linecap="round"/>` +
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${BONE}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<circle cx="${x2}" cy="${y2}" r="${w * 0.7}" fill="${BONE}" stroke="${OUT}" stroke-width="2.5"/>`;
}
const xEye = (x, y, r = 4.5) => `<path d="M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`;

function skullSvg(k) {
  const B = `fill="${BONE}" ${SK}`;
  if (k.skull === 'long') {
    return (k.horns ? `${bone(56, 132, 66, 112, 5)}${bone(64, 134, 80, 118, 5)}` : '') +
      `<path d="M10 150 Q8 136 24 132 L56 128 Q72 130 72 146 Q72 162 56 164 L24 166 Q10 164 10 150Z" ${B}/>` +
      xEye(54, 142) + `<ellipse cx="18" cy="147" rx="3" ry="2.2" fill="${OUT}"/><path d="M20 160 h28 M26 156 v8 M34 156 v8 M42 156 v8" stroke="${OUT}" stroke-width="2"/>`;
  }
  if (k.skull === 'beak') {
    return `<path d="M38 140 L14 148 L38 156Z" ${B}/><circle cx="50" cy="146" r="17" ${B}/>` + xEye(52, 142, 4);
  }
  return `<path d="M22 146 a22 22 0 1 1 44 0 v8 q0 8 -8 8 h-28 q-8 0 -8 -8 Z" ${B}/>` +
    xEye(36, 144) + xEye(52, 144) + `<path d="M41 155 l3 -5 l3 5Z" fill="${OUT}"/><path d="M34 162 v-5 M40 162 v-5 M46 162 v-5 M52 162 v-5" stroke="${OUT}" stroke-width="2"/>`;
}

function drawSkeleton(a, opts = {}) {
  const k = SKELETON[a.species] || SKELETON.hund;
  const B = `fill="${BONE}" ${SK}`;
  let s = `<ellipse cx="100" cy="188" rx="70" ry="7" fill="#000" opacity=".12"/>`;
  let body = '';
  if (k.shell) {
    body += bone(60, 172, 48, 186, 5) + bone(150, 172, 162, 186, 5) +
      `<path d="M40 176 Q40 104 110 100 Q174 104 172 176Z" fill="#c9b98a" ${SK}/>` +
      `<path d="M96 116 L124 116 L134 140 L124 164 L96 164 L86 140Z M60 150 L76 128 M158 150 L142 128" fill="none" stroke="#8a7a52" stroke-width="3"/>` +
      `<path d="M120 104 L126 120 L118 132 L128 146" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="30" cy="164" r="15" ${B}/>` + xEye(26, 161, 3.5) + xEye(36, 161, 3.5);
  } else if (k.bird) {
    body += bone(98, 160, 92, 186, 4) + bone(112, 160, 118, 186, 4) +
      `<path d="M88 188 h10 M112 188 h12" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>` +
      bone(104, 146, 124, 120, 5) + bone(124, 120, 146, 126, 4) +
      `<path d="M62 150 Q100 140 132 152" fill="none" stroke="${OUT}" stroke-width="11" stroke-linecap="round"/><path d="M62 150 Q100 140 132 152" fill="none" stroke="${BONE}" stroke-width="6" stroke-linecap="round"/>`;
    for (let x = 80; x <= 112; x += 10) body += `<path d="M${x} 147 Q${x + 9} 158 ${x + 2} 168" fill="none" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><path d="M${x} 147 Q${x + 9} 158 ${x + 2} 168" fill="none" stroke="${BONE}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += skullSvg(k);
  } else {
    body += bone(80, 160, 66, 184) + bone(92, 162, 94, 186) + bone(126, 160, 118, 185) + bone(138, 160, 148, 184);
    body += `<path d="M58 150 Q100 138 144 154" fill="none" stroke="${OUT}" stroke-width="13" stroke-linecap="round"/><path d="M58 150 Q100 138 144 154" fill="none" stroke="${BONE}" stroke-width="8" stroke-linecap="round"/>`;
    for (const [x, y] of [[70, 146], [84, 143], [98, 142], [112, 143], [126, 147]]) body += `<circle cx="${x}" cy="${y - 5}" r="4" ${B}/>`;
    for (let x = 76; x <= 116; x += 10) body += `<path d="M${x} 147 Q${x + 11} 160 ${x + 2} 174" fill="none" stroke="${OUT}" stroke-width="8" stroke-linecap="round"/><path d="M${x} 147 Q${x + 11} 160 ${x + 2} 174" fill="none" stroke="${BONE}" stroke-width="4" stroke-linecap="round"/>`;
    body += `<ellipse cx="142" cy="157" rx="11" ry="9" ${B}/>`;
    if (k.tail === 'long') [[154, 154, 4.2], [162, 151, 3.8], [170, 148, 3.4], [178, 146, 3], [185, 145, 2.6]].forEach(([x, y, r]) => { body += `<circle cx="${x}" cy="${y}" r="${r}" ${B}/>`; });
    if (k.tail === 'short') [[155, 156, 4], [163, 158, 3.4]].forEach(([x, y, r]) => { body += `<circle cx="${x}" cy="${y}" r="${r}" ${B}/>`; });
    if (k.tail === 'curl') body += `<path d="M152 154 q12 -4 10 -14 q-3 -7 -9 -2" fill="none" stroke="${OUT}" stroke-width="8" stroke-linecap="round"/><path d="M152 154 q12 -4 10 -14 q-3 -7 -9 -2" fill="none" stroke="${BONE}" stroke-width="4" stroke-linecap="round"/>`;
    if (k.spikes) [[60, 182, -30], [150, 184, 20], [110, 190, 70], [40, 186, -60], [170, 180, 40]].forEach(([x, y, r]) => { body += `<path d="M${x} ${y} l12 0" stroke="#6e4b30" stroke-width="3" stroke-linecap="round" transform="rotate(${r} ${x} ${y})"/>`; });
    body += skullSvg(k);
  }
  s += `<g transform="translate(100 186) scale(${k.size}) translate(-100 -186)">${body}</g>`;
  // Ett litet spöke som svävar ovanför
  if (!opts.noGhost) {
    s += `<g class="ghost"><path d="M84 92 Q84 60 100 60 Q116 60 116 92 l-5 -5 l-5 5 l-6 -5 l-6 5 l-5 -5 Z" fill="#fff" fill-opacity=".85" stroke="#b9c4d0" stroke-width="2"/>
      <circle cx="94" cy="76" r="2.6" fill="${OUT}"/><circle cx="106" cy="76" r="2.6" fill="${OUT}"/><ellipse cx="100" cy="84" rx="3" ry="2.2" fill="${OUT}"/></g>`;
  }
  return `<svg class="animal dead ${opts.still ? '' : 'anim'}" viewBox="0 0 200 200" style="overflow:visible">${s}</svg>`;
}

// Grav: en jordhög med ett litet träkors
function graveSvg() {
  return `<svg class="grave-svg" viewBox="0 0 120 90">
    <rect x="55" y="14" width="10" height="58" rx="2" fill="#9b6b43" ${SK}/>
    <rect x="40" y="28" width="40" height="9" rx="2" fill="#9b6b43" ${SK}/>
    <path d="M8 84 Q60 46 112 84 Z" fill="#8a5a3c" ${SK}/>
    <circle cx="40" cy="74" r="2.5" fill="#6e4530"/><circle cx="72" cy="70" r="2" fill="#6e4530"/><circle cx="86" cy="78" r="2.5" fill="#6e4530"/>
    <g transform="translate(30 70)"><circle cx="-3" cy="0" r="3" fill="#ff8fab"/><circle cx="3" cy="0" r="3" fill="#ff8fab"/><circle cx="0" cy="-3" r="3" fill="#ff8fab"/><circle r="2" fill="#ffe066"/></g>
    <g transform="translate(92 74)"><circle cx="-3" cy="0" r="3" fill="#fff"/><circle cx="3" cy="0" r="3" fill="#fff"/><circle cx="0" cy="-3" r="3" fill="#fff"/><circle r="2" fill="#ffe066"/></g>
  </svg>`;
}

// ---------- Rita ett helt djur ----------

// opts: { mood, still (inga animationer), cls }
function drawAnimal(a, opts = {}) {
  if (a.dead) return drawSkeleton(a, opts);
  const sp = SPECIES[a.species];
  const c = sp.colors[a.color] || sp.colors[0];
  const mood = opts.mood || 'happy';
  const u = 'a' + (++_uid);
  let s = `<ellipse cx="100" cy="191" rx="58" ry="7" fill="#000" opacity=".12"/>`;
  if (opts.rider) s += riderBack();
  s += sp.draw(c, mood, u, a);
  s += eyesSvg(sp.eyes, mood, sp.eyeR);
  s += cheeksSvg(sp.cheeks, mood);
  if (sp.mouth) s += mouthSvg(sp.mouth, mood);
  if (sp.drawTop) s += sp.drawTop(c, mood);
  if (a.acc && a.acc.neck) s += drawAccessory(a.acc.neck, sp);
  if (typeof drawMark === 'function' && a.mark && (!a.mark.until || a.mark.until > Date.now())) s += drawMark(a.mark, sp);
  if (typeof drawInjury === 'function' && a.injury) s += drawInjury(a, sp, c);
  if (a.acc && a.acc.face) s += drawAccessory(a.acc.face, sp);
  if (a.acc && a.acc.head) s += drawAccessory(a.acc.head, sp);
  if (opts.rider) s += riderFront();
  const cls = ['animal', opts.still ? '' : 'anim', 'sp-' + a.species, 'mood-' + mood, opts.cls || ''].join(' ');
  const delay = ((a.id || 0) * 1.37) % 5;
  return `<svg class="${cls}" viewBox="${opts.rider ? '0 -66 200 266' : '0 0 200 200'}" style="--d:-${delay.toFixed(2)}s"><g class="breathe">${s}</g></svg>`;
}
