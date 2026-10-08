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
    spots: { head: [100, 54], eye: [118, 80], legL: [80, 182], legR: [120, 182], body: [70, 150], mouth: [100, 110] },
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
    spots: { head: [100, 60], eye: [120, 84], legL: [84, 183], legR: [116, 183], body: [70, 152], mouth: [100, 110] },
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
    spots: { head: [100, 60], eye: [116, 86], legL: [78, 184], legR: [122, 184], body: [68, 152], mouth: [100, 110] },
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
    spots: { head: [100, 80], eye: [120, 104], legL: [76, 186], legR: [124, 186], body: [156, 140], mouth: [100, 127] },
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
    spots: { head: [100, 50], eye: [120, 70], legL: [84, 168], legR: [116, 168], body: [134, 138], mouth: [100, 116], hoof: [84, 185] },
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
    spots: { head: [100, 66], eye: [118, 86], legL: [86, 180], legR: [114, 180], body: [100, 146], mouth: [100, 108], wing: [48, 132] },
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
    spots: { head: [100, 96], eye: [116, 120], legL: [78, 186], legR: [122, 186], body: [150, 104], mouth: [100, 160] },
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
};

const SPECIES_ORDER = ['hund', 'katt', 'kanin', 'marsvin', 'hast', 'fagel', 'igelkott'];

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

// ---------- Rita ett helt djur ----------

// opts: { mood, still (inga animationer), cls }
function drawAnimal(a, opts = {}) {
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
