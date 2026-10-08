// Bakgrunder och ikoner – allt ritat som SVG

// Ritar former två gånger: först tjock kontur, sedan fyllning ovanpå (snygga sammansatta former)
const outlined = (shapes, fill, w = 6) =>
  `<g fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;

const icon = (inner, vb = '0 0 64 64') => `<svg class="ico" viewBox="${vb}">${inner}</svg>`;

// ---------- Trädgården ----------

function cloud(x, y, s, cls) {
  return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><g fill="#fff">
    <ellipse cx="0" cy="0" rx="50" ry="22"/><ellipse cx="-28" cy="-10" rx="26" ry="20"/><ellipse cx="18" cy="-18" rx="30" ry="24"/></g></g>`;
}

function flower(x, y, col) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0 v14" stroke="#4f9a3a" stroke-width="2.5"/>
    <circle cx="-4" cy="-3" r="4" fill="${col}"/><circle cx="4" cy="-3" r="4" fill="${col}"/><circle cx="0" cy="-7" r="4" fill="${col}"/><circle cx="0" cy="1" r="4" fill="${col}"/>
    <circle cx="0" cy="-3" r="2.8" fill="#ffe066"/></g>`;
}

function gardenBg() {
  let fence = '';
  for (let x = -10; x <= 1010; x += 46) {
    fence += `<path d="M${x} 300 v-56 l10 -12 l10 12 v56 Z" fill="#fffaf0" stroke="#c9b79c" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  const flowers = [[60, 420, '#ff8fab'], [180, 520, '#ffd43b'], [330, 450, '#b197fc'], [470, 560, '#ff8fab'], [610, 470, '#ffffff'],
    [760, 540, '#ffd43b'], [890, 440, '#ff8fab'], [960, 560, '#b197fc'], [260, 360, '#ffffff'], [700, 360, '#ff8fab'], [520, 330, '#ffd43b'], [120, 330, '#b197fc']]
    .map(([x, y, c]) => flower(x, y, c)).join('');
  let tufts = '';
  [[100, 380], [240, 470], [400, 400], [560, 500], [680, 420], [840, 490], [940, 380], [30, 520], [380, 570], [800, 380]].forEach(([x, y]) => {
    tufts += `<path d="M${x} ${y} l-5 -12 M${x} ${y} l0 -15 M${x} ${y} l5 -12" stroke="#5aa83f" stroke-width="3" stroke-linecap="round"/>`;
  });
  return `<svg class="bg-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice">
  <defs>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8f8"/><stop offset="1" stop-color="#d6f1ff"/></linearGradient>
    <linearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be07a"/><stop offset="1" stop-color="#6cbf4c"/></linearGradient>
  </defs>
  <rect width="1000" height="600" fill="url(#gSky)"/>
  <g transform="translate(860 90)"><g class="spin">${Array.from({ length: 12 }, (_, i) => `<path d="M0 -62 L6 -78 L-6 -78Z" fill="#ffd43b" transform="rotate(${i * 30})"/>`).join('')}</g>
    <circle r="48" fill="#ffe066" stroke="#ffc933" stroke-width="5"/></g>
  ${cloud(180, 80, 1, 'drift1')}${cloud(560, 60, 0.8, 'drift2')}${cloud(380, 140, 0.6, 'drift1')}
  <path d="M0 250 Q150 170 320 230 Q480 160 650 225 Q820 170 1000 230 V320 H0Z" fill="#b8e68f"/>
  <path d="M0 275 Q200 220 420 268 Q640 230 1000 270 V320 H0Z" fill="#a5dc7c"/>
  <g transform="translate(770 150)">
    <path d="M0 50 L60 0 L120 50 V140 H0Z" fill="#e5484d" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-10 56 L60 -6 L130 56" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="35" y="72" width="50" height="68" fill="#fff" stroke="${OUT}" stroke-width="4"/>
    <path d="M35 72 L85 140 M85 72 L35 140" stroke="#e5484d" stroke-width="5"/>
    <circle cx="60" cy="38" r="10" fill="#fff" stroke="${OUT}" stroke-width="3"/>
  </g>
  <g transform="translate(110 70)">
    <rect x="-14" y="120" width="28" height="110" rx="6" fill="#9b6b43" stroke="${OUT}" stroke-width="4"/>
    <circle cx="0" cy="80" r="70" fill="#5fb548" stroke="${OUT}" stroke-width="4"/>
    <circle cx="-40" cy="110" r="45" fill="#5fb548" stroke="${OUT}" stroke-width="4"/>
    <circle cx="42" cy="112" r="45" fill="#5fb548" stroke="${OUT}" stroke-width="4"/>
    <path d="M-35 120 a45 45 0 0 0 78 4 a70 70 0 0 0 -3 -50 a70 70 0 0 0 -72 0 Z" fill="#5fb548"/>
    <circle cx="-20" cy="60" r="7" fill="#ff6b6b"/><circle cx="30" cy="90" r="7" fill="#ff6b6b"/><circle cx="-45" cy="115" r="7" fill="#ff6b6b"/><circle cx="20" cy="40" r="7" fill="#ff6b6b"/>
  </g>
  ${fence}
  <path d="M0 268 H1000 M0 288 H1000" stroke="#e8dcc8" stroke-width="6"/>
  <rect y="300" width="1000" height="300" fill="url(#gGrass)"/>
  <path d="M500 600 Q470 470 560 400 Q640 340 600 300" fill="none" stroke="#e9d3a8" stroke-width="60" stroke-linecap="round" opacity=".7"/>
  <g transform="translate(290 225)">
    <path d="M0 40 L50 0 L100 40 V95 H0Z" fill="#74c0fc" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-12 46 L50 -6 L112 46" fill="none" stroke="#1c7ed6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 95 V65 Q50 45 70 65 V95Z" fill="#3b3540"/>
  </g>
  ${tufts}${flowers}
  </svg>`;
}

// ---------- Behandlingsrummet ----------

function clinicBg() {
  let tiles = '';
  for (let x = 0; x <= 1000; x += 50) tiles += `<path d="M${x} 300 V470" stroke="#b3e2d6" stroke-width="2"/>`;
  for (let y = 300; y <= 470; y += 42) tiles += `<path d="M0 ${y} H1000" stroke="#b3e2d6" stroke-width="2"/>`;
  let planks = '';
  for (let y = 490; y < 600; y += 30) planks += `<path d="M0 ${y} H1000" stroke="#d9b98f" stroke-width="2"/>`;
  const bottles = [['#ff8787', 20], ['#74c0fc', 60], ['#8ce99a', 100], ['#ffd43b', 140]].map(([c, x]) =>
    `<rect x="${x}" y="-46" width="26" height="40" rx="6" fill="${c}" stroke="${OUT}" stroke-width="3"/><rect x="${x + 7}" y="-56" width="12" height="10" fill="#fff" stroke="${OUT}" stroke-width="3"/>`).join('');
  return `<svg class="bg-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice">
  <rect width="1000" height="600" fill="#e6f7f2"/>
  <rect y="300" width="1000" height="170" fill="#ccefe5"/>${tiles}
  <rect y="466" width="1000" height="10" fill="#9fd8c8"/>
  <rect y="476" width="1000" height="124" fill="#f2dcc0"/>${planks}
  <g transform="translate(70 80)">
    <rect width="200" height="160" rx="10" fill="#bfe7ff" stroke="${OUT}" stroke-width="5"/>
    <circle cx="150" cy="45" r="22" fill="#ffe066"/>
    <path d="M10 130 Q60 90 110 125 Q150 100 190 130 V150 H10Z" fill="#8fd16a"/>
    <path d="M100 0 V160 M0 80 H200" stroke="#fff" stroke-width="8"/>
    <rect width="200" height="160" rx="10" fill="none" stroke="${OUT}" stroke-width="5"/>
    <path d="M-20 -10 Q20 80 -10 175 L-30 175 V-10Z" fill="#ff8fab" stroke="${OUT}" stroke-width="4"/>
    <path d="M220 -10 Q180 80 210 175 L230 175 V-10Z" fill="#ff8fab" stroke="${OUT}" stroke-width="4"/>
  </g>
  <g transform="translate(500 60)">
    <circle r="46" fill="#fff" stroke="${OUT}" stroke-width="5"/>
    <path d="M-12 -32 h24 v20 h20 v24 h-20 v20 h-24 v-20 h-20 v-24 h20Z" fill="#e5484d"/>
  </g>
  <g transform="translate(700 170)">
    <rect x="0" y="0" width="190" height="10" rx="3" fill="#c9a37a" stroke="${OUT}" stroke-width="3"/>${bottles}
    <rect x="0" y="90" width="190" height="10" rx="3" fill="#c9a37a" stroke="${OUT}" stroke-width="3"/>
    <g transform="translate(0 90)">${bottles}</g>
  </g>
  <g transform="translate(360 150)">
    <rect width="90" height="110" rx="6" fill="#fff8e1" stroke="${OUT}" stroke-width="4"/>
    <g transform="translate(45 62)" fill="#ff922b"><ellipse rx="16" ry="13"/><circle cx="-20" cy="-18" r="7"/><circle cx="-7" cy="-28" r="7"/><circle cx="7" cy="-28" r="7"/><circle cx="20" cy="-18" r="7"/></g>
  </g>
  <g transform="translate(940 380)">
    <path d="M-22 0 h44 l-6 52 h-32Z" fill="#e8835a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M0 0 Q-30 -40 -20 -80 M0 0 Q0 -50 10 -95 M0 0 Q30 -30 35 -70" stroke="#4f9a3a" stroke-width="5" fill="none"/>
    <ellipse cx="-22" cy="-70" rx="12" ry="22" fill="#5fb548" transform="rotate(-20 -22 -70)"/>
    <ellipse cx="12" cy="-88" rx="12" ry="22" fill="#5fb548"/><ellipse cx="34" cy="-62" rx="12" ry="22" fill="#5fb548" transform="rotate(25 34 -62)"/>
  </g>
  </svg>`;
}

const tableSvg = `<svg class="table-svg" viewBox="0 0 300 80" preserveAspectRatio="none">
  <rect x="30" y="20" width="12" height="58" fill="#adb5bd" stroke="${OUT}" stroke-width="3"/>
  <rect x="258" y="20" width="12" height="58" fill="#adb5bd" stroke="${OUT}" stroke-width="3"/>
  <rect x="4" y="2" width="292" height="24" rx="12" fill="#74c0fc" stroke="${OUT}" stroke-width="4"/>
  <path d="M20 10 H280" stroke="#a5d8ff" stroke-width="4" stroke-linecap="round"/>
</svg>`;

// Veterinären som pratar med spelaren
const vetSvg = icon(`
  <circle cx="32" cy="36" r="20" fill="#f5c9a6" stroke="${OUT}" stroke-width="3"/>
  <path d="M12 34 Q12 12 32 12 Q52 12 52 34 Q46 24 32 24 Q18 24 12 34Z" fill="#8a5a3b" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M14 22 Q32 2 50 22 L48 26 Q32 18 16 26Z" fill="#fff" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M29 12 h6 v4 h4 v5 h-4 v4 h-6 v-4 h-4 v-5 h4Z" fill="#e5484d"/>
  <circle cx="25" cy="37" r="2.6" fill="#2b2024"/><circle cx="39" cy="37" r="2.6" fill="#2b2024"/>
  <path d="M26 45 Q32 50 38 45" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="20" cy="43" rx="3.5" ry="2" fill="#ff8fa3" opacity=".6"/><ellipse cx="44" cy="43" rx="3.5" ry="2" fill="#ff8fa3" opacity=".6"/>`);

// ---------- Ikoner ----------

const S3 = `stroke="${OUT}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

const TOOL_ICONS = {
  tvatt: `<rect x="10" y="22" width="44" height="30" rx="9" fill="#ffd84d" ${S3}/><circle cx="22" cy="33" r="3" fill="#e6b72e"/><circle cx="36" cy="40" r="4" fill="#e6b72e"/><circle cx="44" cy="30" r="2.5" fill="#e6b72e"/><circle cx="28" cy="44" r="2" fill="#e6b72e"/>
    <path d="M20 6 q-5 7 0 10 q5 -3 0 -10Z M34 4 q-4 6 0 8 q4 -2 0 -8Z M46 8 q-4 6 0 8 q4 -2 0 -8Z" fill="#5ab4f0"/>`,
  salva: `<g transform="rotate(-35 32 32)"><rect x="12" y="23" width="32" height="18" rx="3" fill="#f4f7fb" ${S3}/><path d="M12 23 L6 26 V38 L12 41" fill="#dfe6ee" ${S3}/><rect x="44" y="26" width="10" height="12" rx="2" fill="#4dabf7" ${S3}/><rect x="20" y="28" width="16" height="8" rx="2" fill="#ff8fa3"/></g>`,
  plaster: `<g transform="rotate(-35 32 32)"><rect x="6" y="22" width="52" height="20" rx="10" fill="#f6c99a" ${S3}/><rect x="24" y="22" width="16" height="20" fill="#eba877"/><rect x="6" y="22" width="52" height="20" rx="10" fill="none" ${S3}/><circle cx="14" cy="29" r="1.3" fill="#c98b5c"/><circle cx="14" cy="35" r="1.3" fill="#c98b5c"/><circle cx="50" cy="29" r="1.3" fill="#c98b5c"/><circle cx="50" cy="35" r="1.3" fill="#c98b5c"/></g>`,
  pincett: `${strokeOut('M50 10 L16 52', '#c3ccd6', 5)}${strokeOut('M54 14 L22 56', '#c3ccd6', 5)}<circle cx="52" cy="12" r="6" fill="#c3ccd6" ${S3}/>`,
  desinfektion: `<rect x="18" y="26" width="26" height="32" rx="6" fill="#8ee0b5" ${S3}/><rect x="25" y="18" width="12" height="9" fill="#fff" ${S3}/><path d="M20 10 h22 v9 h-22Z" fill="#fff" ${S3}/><path d="M42 12 h6" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>
    <path d="M31 34 v14 M24 41 h14" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="54" cy="8" r="2" fill="#8ee0b5"/><circle cx="58" cy="14" r="1.6" fill="#8ee0b5"/><circle cx="54" cy="18" r="1.4" fill="#8ee0b5"/>`,
  rontgen: `<rect x="6" y="10" width="52" height="42" rx="7" fill="#cfd8e3" ${S3}/><rect x="12" y="16" width="40" height="28" rx="3" fill="#1d2a3a"/><path d="M22 30 h20" stroke="#dff1ff" stroke-width="5" stroke-linecap="round"/><circle cx="21" cy="27" r="3.5" fill="#dff1ff"/><circle cx="21" cy="33" r="3.5" fill="#dff1ff"/><circle cx="43" cy="27" r="3.5" fill="#dff1ff"/><circle cx="43" cy="33" r="3.5" fill="#dff1ff"/><rect x="24" y="52" width="16" height="6" fill="#adb5bd" ${S3}/>`,
  skena: `<rect x="16" y="6" width="11" height="52" rx="3" fill="#d9a066" ${S3}/><rect x="37" y="6" width="11" height="52" rx="3" fill="#d9a066" ${S3}/><rect x="10" y="22" width="44" height="8" rx="2" fill="#fff" ${S3}/><rect x="10" y="38" width="44" height="8" rx="2" fill="#fff" ${S3}/>`,
  bandage: `<path d="M36 40 Q50 42 58 56 L50 60 Q44 50 34 50Z" fill="#fff" ${S3}/><rect x="8" y="16" width="32" height="36" fill="#fff" ${S3}/><ellipse cx="24" cy="52" rx="16" ry="6" fill="#fff" ${S3}/><rect x="9.5" y="17" width="29" height="34" fill="#fff"/><ellipse cx="24" cy="16" rx="16" ry="6" fill="#fff" ${S3}/><ellipse cx="24" cy="16" rx="6" ry="2.4" fill="#dee2e6" ${S3}/><path d="M8 30 H40 M8 40 H40" stroke="#a5d8ff" stroke-width="3"/>`,
  termometer: `<g transform="rotate(40 32 32)"><rect x="27" y="4" width="10" height="44" rx="5" fill="#fff" ${S3}/><circle cx="32" cy="50" r="8" fill="#e5484d" ${S3}/><rect x="30" y="22" width="4" height="26" fill="#e5484d"/><path d="M37 14 h-3 M37 20 h-3 M37 26 h-3 M37 32 h-3" stroke="${OUT}" stroke-width="2"/></g>`,
  medicin: `<rect x="18" y="20" width="28" height="38" rx="6" fill="#c97b3c" ${S3}/><rect x="21" y="9" width="22" height="12" rx="3" fill="#fff" ${S3}/><rect x="22" y="30" width="20" height="18" rx="2" fill="#fff"/><path d="M32 33 v12 M26 39 h12" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/>`,
  filt: `<rect x="6" y="16" width="52" height="34" rx="7" fill="#ff9fc0" ${S3}/><path d="M6 28 H58 M6 40 H58 M22 16 V50 M42 16 V50" stroke="#ffd3e2" stroke-width="4"/><rect x="6" y="16" width="52" height="34" rx="7" fill="none" ${S3}/><path d="M6 44 Q32 54 58 44" fill="none" ${S3}/>`,
  loppkam: `<path d="M12 28 V50 M17 28 V50 M22 28 V50 M27 28 V50 M32 28 V50 M37 28 V50 M42 28 V50 M47 28 V50 M52 28 V50" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M12 28 V50 M17 28 V50 M22 28 V50 M27 28 V50 M32 28 V50 M37 28 V50 M42 28 V50 M47 28 V50 M52 28 V50" stroke="#9775fa" stroke-width="2.5" stroke-linecap="round"/><rect x="7" y="14" width="50" height="16" rx="5" fill="#9775fa" ${S3}/>`,
  schampo: `<path d="M20 24 Q20 18 26 18 H38 Q44 18 44 24 V54 Q44 58 40 58 H24 Q20 58 20 54 Z" fill="#b197fc" ${S3}/><rect x="26" y="9" width="12" height="10" rx="2" fill="#fff" ${S3}/><rect x="25" y="32" width="14" height="14" rx="3" fill="#fff"/><circle cx="50" cy="16" r="5" fill="#fff" stroke="#9fd3ff" stroke-width="2"/><circle cx="56" cy="28" r="3.5" fill="#fff" stroke="#9fd3ff" stroke-width="2"/><circle cx="12" cy="20" r="4" fill="#fff" stroke="#9fd3ff" stroke-width="2"/>`,
  dusch: `${strokeOut('M10 30 V14 Q10 6 20 6 H32 V12', '#c3ccd6', 4)}<path d="M20 12 H44 L40 24 H24Z" fill="#cfd8e3" ${S3}/><path d="M26 30 l-3 8 M32 30 v9 M38 30 l3 8 M24 44 l-3 8 M32 44 v9 M40 44 l3 8" stroke="#4dabf7" stroke-width="3.5" stroke-linecap="round"/>`,
  ogondroppar: `<path d="M22 30 h20 v24 q0 4 -4 4 h-12 q-4 0 -4 -4Z" fill="#74c0fc" ${S3}/><path d="M27 30 L30 14 h4 L37 30Z" fill="#fff" ${S3}/><path d="M32 2 q-5 6 0 9 q5 -3 0 -9Z" fill="#4dabf7" ${S3}/><path d="M25 44 Q32 37 39 44 Q32 51 25 44Z" fill="#fff"/><circle cx="32" cy="44" r="2.6" fill="#2b2024"/>`,
  fastingplockare: `${strokeOut('M12 54 L36 30', '#51cf66', 8)}<path d="M34 32 L50 12 M38 34 L54 18" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><path d="M34 32 L50 12 M38 34 L54 18" stroke="#c3ccd6" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(52 50) scale(.7)">${tickSvg}</g>`,
  forstoringsglas: `${strokeOut('M37 37 L54 54', '#c97b3c', 7)}<circle cx="26" cy="26" r="17" fill="#d0ebff" stroke="${OUT}" stroke-width="4"/><circle cx="26" cy="26" r="17" fill="none" stroke="#adb5bd" stroke-width="2"/><path d="M16 22 Q18 15 25 13" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
  hovkratsa: `${strokeOut('M14 52 L34 32', '#e5484d', 9)}${strokeOut('M34 32 L44 22 Q52 12 44 8', '#c3ccd6', 4)}`,
};

const FOODS = {
  hundgodis: { name: 'Hundgodis', likes: ['hund'] },
  kattmat: { name: 'Kattmat', likes: ['katt', 'igelkott', 'rav'] },
  morot: { name: 'Morot', likes: ['kanin', 'marsvin', 'hast', 'gris', 'get', 'hamster'] },
  ho: { name: 'Hö', likes: ['kanin', 'marsvin', 'hast', 'ko', 'get'] },
  apple: { name: 'Äpple', likes: ['hast', 'marsvin', 'fagel', 'gris', 'get', 'ekorre'] },
  fron: { name: 'Frön', likes: ['fagel', 'anka', 'hamster'] },
  mask: { name: 'Mjölmask', likes: ['igelkott', 'fagel', 'anka', 'skoldpadda'] },
  notter: { name: 'Nötter', likes: ['ekorre', 'hamster'] },
  sallad: { name: 'Sallad', likes: ['skoldpadda', 'kanin', 'marsvin', 'anka'] },
};
const FOOD_PRICE = 6;  // för 3 st

const FOOD_ICONS = {
  hundgodis: `<g transform="rotate(-30 32 32)">${outlined(`<rect x="17" y="27" width="30" height="10"/><circle cx="17" cy="26" r="7"/><circle cx="17" cy="38" r="7"/><circle cx="47" cy="26" r="7"/><circle cx="47" cy="38" r="7"/>`, '#f3e3c3')}</g>`,
  kattmat: `<ellipse cx="32" cy="32" rx="22" ry="8" fill="#a0663a" ${S3}/><circle cx="24" cy="30" r="3" fill="#7d4b22"/><circle cx="34" cy="28" r="3" fill="#7d4b22"/><circle cx="41" cy="32" r="3" fill="#7d4b22"/>
    <path d="M8 34 h48 q-2 20 -24 20 q-22 0 -24 -20Z" fill="#ff8787" ${S3}/><path d="M26 44 q6 -6 12 0 q-6 6 -12 0Z M38 44 l5 -3 v6Z" fill="#fff"/>`,
  morot: `<path d="M42 20 L12 54 Q10 58 15 56 L50 28 Q50 20 42 20Z" fill="#ff922b" ${S3}/><path d="M30 32 l5 4 M24 40 l4 3 M18 47 l3 2" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>
    <path d="M44 20 Q42 6 50 4 Q50 14 48 20 M48 22 Q58 14 62 18 Q54 22 50 26 M46 21 Q52 10 58 8" fill="#51cf66" ${S3}/>`,
  ho: `<path d="M14 56 L22 10 M20 56 L26 8 M26 56 L30 8 M32 56 L34 6 M38 56 L38 8 M44 56 L42 8 M50 56 L46 10" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>
    <path d="M14 56 L22 10 M20 56 L26 8 M26 56 L30 8 M32 56 L34 6 M38 56 L38 8 M44 56 L42 8 M50 56 L46 10" stroke="#f2d36b" stroke-width="4" stroke-linecap="round"/><rect x="14" y="30" width="36" height="8" rx="3" fill="#e5484d" ${S3}/>`,
  apple: `<path d="M32 20 Q18 12 12 26 Q8 44 22 54 Q28 58 32 54 Q36 58 42 54 Q56 44 52 26 Q46 12 32 20Z" fill="#ff6b6b" ${S3}/><path d="M32 20 Q31 12 35 6" fill="none" ${S3}/><path d="M35 12 Q44 4 50 10 Q42 16 35 12Z" fill="#51cf66" ${S3}/><ellipse cx="22" cy="30" rx="3" ry="6" fill="#fff" opacity=".5"/>`,
  fron: `<ellipse cx="32" cy="46" rx="26" ry="10" fill="#74c0fc" ${S3}/>${outlined(`<ellipse cx="22" cy="38" rx="5" ry="3.5"/><ellipse cx="32" cy="34" rx="5" ry="3.5"/><ellipse cx="42" cy="38" rx="5" ry="3.5"/><ellipse cx="27" cy="28" rx="5" ry="3.5"/><ellipse cx="37" cy="27" rx="5" ry="3.5"/><ellipse cx="32" cy="21" rx="5" ry="3.5"/>`, '#e9c46a', 4)}`,
  mask: `${strokeOut('M10 42 Q18 26 28 38 T48 34 Q54 32 56 26', '#e0b77a', 10)}<path d="M18 33 l3 6 M27 37 l-1 7 M37 38 l-1 7 M46 33 l2 6" stroke="#b8894a" stroke-width="2"/><circle cx="55" cy="25" r="1.8" fill="#2b2024"/>`,
};

FOOD_ICONS.notter = `<path d="M18 30 Q18 54 26 56 Q34 54 34 30 Z" fill="#c98b4a" ${S3}/><path d="M14 30 Q26 16 38 30 Z" fill="#7a4a22" ${S3}/><path d="M26 22 V16" ${S3}/>
  <path d="M36 36 Q36 58 44 58 Q52 58 52 36 Z" fill="#d9a066" ${S3}/><path d="M32 36 Q44 22 56 36 Z" fill="#8a5a2c" ${S3}/><path d="M44 28 V22" ${S3}/>`;
FOOD_ICONS.sallad = `<path d="M32 56 Q8 52 8 32 Q8 16 20 14 Q24 6 32 8 Q40 6 44 14 Q56 16 56 32 Q56 52 32 56Z" fill="#8ce99a" ${S3}/>
  <path d="M32 54 Q30 36 32 16 M32 40 Q22 34 16 26 M32 34 Q42 28 48 22 M32 48 Q42 44 50 38" fill="none" stroke="#2f9e44" stroke-width="2.5" stroke-linecap="round"/>`;

const UI_ICONS = {
  coin: `<circle cx="32" cy="32" r="24" fill="#ffd43b" ${S3}/><circle cx="32" cy="32" r="17" fill="none" stroke="#f0b400" stroke-width="3"/><g transform="translate(32 34) scale(.55)" fill="#f0b400"><ellipse rx="16" ry="13"/><circle cx="-20" cy="-18" r="7"/><circle cx="-7" cy="-28" r="7"/><circle cx="7" cy="-28" r="7"/><circle cx="20" cy="-18" r="7"/></g>`,
  star: `<path d="M32 6 L39 23 L58 24 L43 36 L48 55 L32 45 L16 55 L21 36 L6 24 L25 23Z" fill="#ffd43b" ${S3}/>`,
  heart: `<path d="M32 54 Q6 36 8 20 Q12 6 26 10 Q30 12 32 17 Q34 12 38 10 Q52 6 56 20 Q58 36 32 54Z" fill="#ff6b8a" ${S3}/><ellipse cx="20" cy="20" rx="4" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 20 20)"/>`,
  food: `<ellipse cx="32" cy="30" rx="22" ry="8" fill="#c8874a" ${S3}/><circle cx="24" cy="28" r="3" fill="#7d4b22"/><circle cx="34" cy="26" r="3" fill="#7d4b22"/><circle cx="40" cy="30" r="3" fill="#7d4b22"/><path d="M8 32 h48 q-2 20 -24 20 q-22 0 -24 -20Z" fill="#4dabf7" ${S3}/>`,
  water: `<path d="M32 6 Q14 30 14 40 A18 18 0 0 0 50 40 Q50 30 32 6Z" fill="#4dabf7" ${S3}/><path d="M22 40 Q22 48 30 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  clean: `<circle cx="24" cy="36" r="14" fill="#fff" stroke="#74c0fc" stroke-width="4"/><circle cx="42" cy="24" r="10" fill="#fff" stroke="#74c0fc" stroke-width="4"/><circle cx="44" cy="46" r="7" fill="#fff" stroke="#74c0fc" stroke-width="4"/><path d="M17 30 q3 -5 8 -5" fill="none" stroke="#74c0fc" stroke-width="3" stroke-linecap="round"/>`,
  ball: `<circle cx="32" cy="32" r="24" fill="#ff6b6b" ${S3}/><path d="M10 26 Q32 36 54 26 M12 42 Q32 50 52 42" fill="none" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="24" fill="none" ${S3}/>`,
  brush: `<rect x="10" y="28" width="44" height="14" rx="6" fill="#c97b3c" ${S3}/><path d="M16 42 v12 M22 42 v12 M28 42 v12 M34 42 v12 M40 42 v12 M46 42 v12" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/><circle cx="48" cy="14" r="6" fill="#fff" stroke="#74c0fc" stroke-width="3"/><circle cx="38" cy="10" r="4" fill="#fff" stroke="#74c0fc" stroke-width="3"/>`,
  bow: `<path d="M32 32 L10 18 Q4 32 10 46 Z" fill="#ff7eb6" ${S3}/><path d="M32 32 L54 18 Q60 32 54 46 Z" fill="#ff7eb6" ${S3}/><circle cx="32" cy="32" r="7" fill="#ff4f9a" ${S3}/>`,
  cross: `<path d="M24 8 h16 v16 h16 v16 h-16 v16 h-16 v-16 h-16 v-16 h16Z" fill="#fff" ${S3}/>`,
  back: `<path d="M38 12 L18 32 L38 52" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  dice: `<rect x="8" y="8" width="48" height="48" rx="10" fill="#fff" ${S3}/><circle cx="21" cy="21" r="4.5" fill="${OUT}"/><circle cx="43" cy="21" r="4.5" fill="${OUT}"/><circle cx="32" cy="32" r="4.5" fill="${OUT}"/><circle cx="21" cy="43" r="4.5" fill="${OUT}"/><circle cx="43" cy="43" r="4.5" fill="${OUT}"/>`,
  soundOn: `<path d="M8 24 h10 l14 -12 v40 l-14 -12 h-10Z" fill="#fff" ${S3}/><path d="M40 22 q6 10 0 20 M46 16 q12 16 0 32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  soundOff: `<path d="M8 24 h10 l14 -12 v40 l-14 -12 h-10Z" fill="#fff" ${S3}/><path d="M40 24 l14 16 M54 24 l-14 16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
  bag: `<path d="M12 22 h40 l-4 34 h-32Z" fill="#ffd43b" ${S3}/><path d="M22 26 V18 Q22 8 32 8 Q42 8 42 18 V26" fill="none" ${S3}/><g transform="translate(32 42) scale(.4)" fill="#f08c00"><ellipse rx="16" ry="13"/><circle cx="-20" cy="-18" r="7"/><circle cx="-7" cy="-28" r="7"/><circle cx="7" cy="-28" r="7"/><circle cx="20" cy="-18" r="7"/></g>`,
  plus: `<path d="M32 10 V54 M10 32 H54" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>`,
  pencil: `<path d="M12 52 L16 38 L42 12 L52 22 L26 48Z" fill="#ffd43b" ${S3}/><path d="M12 52 L16 38 L26 48Z" fill="#f5c9a6" ${S3}/><path d="M38 16 L48 26" ${S3}/>`,
  paw: `<g transform="translate(32 38)" fill="currentColor"><ellipse rx="13" ry="11"/><circle cx="-16" cy="-15" r="6"/><circle cx="-6" cy="-24" r="6"/><circle cx="6" cy="-24" r="6"/><circle cx="16" cy="-15" r="6"/></g>`,
  door: `<rect x="14" y="6" width="36" height="52" rx="4" fill="#ffd8a8" ${S3}/><circle cx="42" cy="34" r="3" fill="${OUT}"/><path d="M24 18 h16 v4 h-16Z" fill="#e5484d"/>`,
  home: `<path d="M8 30 L32 10 L56 30 V54 H8Z" fill="#ffd8a8" ${S3}/><rect x="26" y="36" width="12" height="18" fill="#c97b3c" ${S3}/>`,
};

const toolIcon = id => icon(TOOL_ICONS[id] || '');
const foodIcon = id => icon(FOOD_ICONS[id] || '');
const uiIcon = id => icon(UI_ICONS[id] || '');

// Logga: hjärta med tass och kors
const logoSvg = icon(`
  <path d="M32 58 Q2 38 4 18 Q8 2 24 6 Q30 8 32 14 Q34 8 40 6 Q56 2 60 18 Q62 38 32 58Z" fill="#ff6b8a" ${S3}/>
  <g transform="translate(32 34) scale(.62)" fill="#fff"><ellipse rx="14" ry="12"/><circle cx="-18" cy="-17" r="6.5"/><circle cx="-6" cy="-27" r="6.5"/><circle cx="6" cy="-27" r="6.5"/><circle cx="18" cy="-17" r="6.5"/></g>
  <g transform="translate(48 14)"><circle r="10" fill="#fff" ${S3}/><path d="M-2.5 -6 h5 v3.5 h3.5 v5 h-3.5 v3.5 h-5 v-3.5 h-3.5 v-5 h3.5Z" fill="#e5484d"/></g>`);
