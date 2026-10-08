// Skador, verktyg och hur de ritas på djuren

const TOOLS = {
  tvatt: 'Tvättsvamp',
  salva: 'Salva',
  plaster: 'Plåster',
  pincett: 'Pincett',
  desinfektion: 'Desinfektion',
  rontgen: 'Röntgen',
  skena: 'Skena',
  bandage: 'Bandage',
  termometer: 'Termometer',
  medicin: 'Medicin',
  filt: 'Filt',
  loppkam: 'Loppkam',
  schampo: 'Schampo',
  dusch: 'Dusch',
  ogondroppar: 'Ögondroppar',
  fastingplockare: 'Fästingplockare',
  forstoringsglas: 'Förstoringsglas',
  hovkratsa: 'Hovkratsa',
};

const ACTION_TEXT = {
  click: 'Tryck på rätt ställe på djuret!',
  rub: 'Gnugga fram och tillbaka på rätt ställe!',
  hold: 'Håll kvar verktyget på rätt ställe!',
  pull: 'Tryck på rätt ställe och dra bort det!',
};

const SPOT_NAMES = {
  head: 'huvudet', eye: 'ögat', legL: 'benet', legR: 'benet', body: 'kroppen',
  mouth: 'munnen', wing: 'vingen', hoof: 'hoven',
};

// ---------- Små ritfunktioner ----------

const at = (x, y, inner, extra = '') => `<g transform="translate(${x} ${y}) ${extra}">${inner}</g>`;

const swelling = (r = 13) => `<circle r="${r}" fill="#ff7a7a" opacity=".45"/>`;
const painLines = `<path d="M-20 -14 l-6 -5 M20 -14 l6 -5 M-22 2 l-8 0 M22 2 l8 0" stroke="#e5484d" stroke-width="2.5" stroke-linecap="round"/>`;
const redDot = `<circle r="3.5" fill="#e5484d"/>`;

function plasterSvg(x, y, rot = -20) {
  return at(x, y, `<rect x="-17" y="-6.5" width="34" height="13" rx="6.5" fill="#f6c99a" ${SK2}/>` +
    `<rect x="-6" y="-6.5" width="12" height="13" fill="#eba877"/>` +
    `<circle cx="-12" cy="-2" r=".9" fill="#c98b5c"/><circle cx="-12" cy="2" r=".9" fill="#c98b5c"/><circle cx="12" cy="-2" r=".9" fill="#c98b5c"/><circle cx="12" cy="2" r=".9" fill="#c98b5c"/>`, `rotate(${rot})`);
}

function bandageSvg(x, y) {
  return at(x, y, `<rect x="-16" y="-14" width="32" height="24" rx="7" fill="#ffffff" ${SK2}/>` +
    `<path d="M-15 -6 L15 -9 M-15 1 L15 -2 M-15 7 L15 4" stroke="#cfd8e3" stroke-width="2"/>`);
}

function scrapeSvg(stage) {
  const col = stage === 0 ? '#e5484d' : '#f28b8b';
  let s = `<path d="M-11 -6 Q-2 -12 9 -7 Q14 0 8 7 Q-2 11 -10 6 Q-15 0 -11 -6Z" fill="${col}" opacity=".9"/>` +
    `<path d="M-7 -3 l12 -2 M-8 2 l14 -1 M-5 6 l9 -1" stroke="#a61e2a" stroke-width="1.6" opacity="${stage === 0 ? 1 : 0.4}"/>`;
  if (stage === 0) s += `<circle cx="-6" cy="-1" r="1.6" fill="#6b4a2a"/><circle cx="5" cy="3" r="1.3" fill="#6b4a2a"/><circle cx="2" cy="-5" r="1.2" fill="#6b4a2a"/>`;
  if (stage === 2) s += `<ellipse rx="13" ry="9" fill="#fff" opacity=".55"/><path d="M-6 -4 q4 -2 8 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return s;
}

function xraySvg() {
  return `<rect x="-24" y="-30" width="48" height="46" rx="7" fill="#1d2a3a" stroke="#9fd3ff" stroke-width="2.5"/>` +
    `<path d="M0 -22 L0 8" stroke="#dff1ff" stroke-width="8" stroke-linecap="round"/>` +
    `<circle cx="-4" cy="-23" r="4.5" fill="#dff1ff"/><circle cx="4" cy="-23" r="4.5" fill="#dff1ff"/>` +
    `<circle cx="-4" cy="9" r="4.5" fill="#dff1ff"/><circle cx="4" cy="9" r="4.5" fill="#dff1ff"/>` +
    `<path d="M-7 -8 l4 3 l-3 3 l5 2 l-2 3 l6 1" fill="none" stroke="#ff4d4d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const tickSvg = `<path d="M-5 -3 l-5 -3 M-6 1 l-6 0 M-5 5 l-5 3 M5 -3 l5 -3 M6 1 l6 0 M5 5 l5 3" stroke="#3a3440" stroke-width="1.6" stroke-linecap="round"/>` +
  `<ellipse rx="6" ry="7.5" fill="#5b5466" ${SK2}/><circle cy="-7.5" r="2.8" fill="#3a3440"/>`;

const FLEA_POS = [[-34, -12], [22, -30], [-12, 22], [36, 10], [-40, 30], [6, -52], [26, 36], [-22, -42]];
function fleasSvg(n) {
  return FLEA_POS.slice(0, n).map(([dx, dy], i) =>
    `<g transform="translate(${100 + dx} ${125 + dy})"><g class="flea" style="animation-delay:${(i * 0.13).toFixed(2)}s">` +
    `<ellipse rx="2.8" ry="2.1" fill="#222"/><path d="M-2 1 l-2 3 M2 1 l2 3" stroke="#222" stroke-width="1"/></g></g>`).join('');
}

function bubblesSvg() {
  const pos = [[-30, -20, 9], [10, -40, 7], [30, 0, 10], [-10, 18, 8], [-44, 20, 6], [40, 30, 7], [0, -8, 6], [-20, -50, 6], [24, -24, 5]];
  return pos.map(([dx, dy, r]) => `<circle cx="${100 + dx}" cy="${125 + dy}" r="${r}" fill="#fff" fill-opacity=".75" stroke="#9fd3ff" stroke-width="1.5"/>`).join('');
}

function sweatSvg(x, y) {
  return `<path d="M${x + 34} ${y - 4} q-5 8 0 12 q5 -4 0 -12Z" fill="#7cc4f2" ${SK2}/><path d="M${x - 36} ${y + 6} q-4 7 0 10 q4 -3 0 -10Z" fill="#7cc4f2" ${SK2}/>`;
}

// ---------- Skadetyperna ----------
// species: 'all' eller lista. spots: var på kroppen den kan sitta. steps: verktyg i rätt ordning.

const INJURIES = {
  skrubbsar: {
    name: 'Skrubbsår', species: 'all', spots: ['legL', 'legR', 'head', 'body'],
    problem: (n, spot) => `${n} har ramlat och fått ett skrubbsår på ${SPOT_NAMES[spot]}.`,
    event: n => `Oj! ${n} ramlade och fick ett skrubbsår!`,
    steps: [
      { tool: 'tvatt', action: 'rub', hint: 'Först måste såret tvättas rent från smuts.', done: 'Nu är såret rent!' },
      { tool: 'salva', action: 'click', hint: 'Såret är rent. Vad hjälper det att läka?', done: 'Salvan lindrar och läker.' },
      { tool: 'plaster', action: 'click', hint: 'Skydda såret så att det inte blir smutsigt igen.', done: 'Ett fint plåster!' },
    ],
    mark: 'plaster', markTime: 150,
    draw: (x, y, step) => at(x, y, scrapeSvg(step)),
  },

  tagg: {
    name: 'Tagg i tassen', species: ['hund', 'katt', 'kanin', 'marsvin', 'igelkott', 'rav', 'ekorre', 'hamster'], spots: ['legL', 'legR'],
    problem: n => `${n} har trampat på en vass tagg som sitter fast i tassen.`,
    event: n => `Aj! ${n} har fått en tagg i tassen!`,
    steps: [
      { tool: 'pincett', action: 'pull', hint: 'Taggen sitter fast. Vilket verktyg kan nypa tag i den?', done: 'Taggen är ute!' },
      { tool: 'desinfektion', action: 'click', hint: 'Det finns ett litet hål. Döda bakterierna så att det inte blir infekterat.', done: 'Nu är det rent från bakterier.' },
      { tool: 'plaster', action: 'click', hint: 'Skydda det lilla såret.', done: 'Plåster på!' },
    ],
    mark: 'plaster', markTime: 150,
    draw: (x, y, step) => {
      if (step === 0) return at(x, y, swelling(12) + `<path d="M-3 2 L12 -20 L4 3 Z" fill="#7a5230" ${SK2}/>`);
      if (step === 1) return at(x, y, swelling(8) + redDot);
      return at(x, y, `<circle r="9" fill="#ffd36b" opacity=".5"/>` + redDot);
    },
  },

  benbrott: {
    name: 'Benbrott', species: ['hund', 'katt', 'kanin', 'marsvin', 'hast', 'ko', 'gris', 'get', 'rav'], spots: ['legL', 'legR'],
    problem: n => `${n} haltar och har jätteont i benet. Det kanske är brutet?`,
    event: n => `Åh nej! ${n} hoppade snett och haltar. Benet kan vara brutet!`,
    steps: [
      { tool: 'rontgen', action: 'hold', hint: 'Vi måste se inuti benet för att veta om det är brutet.', done: 'Röntgenbilden visar att benet är brutet. Där är sprickan!' },
      { tool: 'skena', action: 'click', hint: 'Benet måste hållas stilla och rakt medan det läker.', done: 'Skenan håller benet rakt.' },
      { tool: 'bandage', action: 'rub', hint: 'Linda något runt skenan så att den sitter fast.', done: 'Bandaget sitter fint!' },
    ],
    mark: 'bandage', markTime: 240,
    draw: (x, y, step) => {
      if (step === 0) return at(x, y, swelling(15) + painLines);
      if (step === 1) return at(x, y, swelling(13)) + at(x, y - 22, xraySvg());
      return at(x, y, swelling(12) + `<rect x="-17" y="-22" width="6" height="32" rx="2" fill="#d9a066" ${SK2}/><rect x="11" y="-22" width="6" height="32" rx="2" fill="#d9a066" ${SK2}/>`);
    },
  },

  feber: {
    name: 'Feber', species: 'all', spots: ['head'],
    problem: n => `${n} är trött, varm och vill bara ligga ner.`,
    event: n => `${n} verkar sjuk och trött...`,
    steps: [
      { tool: 'termometer', action: 'hold', at: 'mouth', hint: 'Ta reda på om djuret har feber. Vad mäter man temperaturen med?', done: 'Termometern visar 40 grader. Det är feber!' },
      { tool: 'medicin', action: 'click', at: 'mouth', hint: 'Något som får febern att gå ner...', done: 'Medicinen hjälper mot febern.' },
      { tool: 'filt', action: 'click', at: 'whole', hint: 'Sjuka djur behöver vila och hålla sig varma.', done: 'Mysigt och varmt. Nu kan djuret vila.' },
    ],
    mark: null,
    draw: (x, y, step) => step < 2 ? sweatSvg(x, y) : '',
  },

  loppor: {
    name: 'Loppor', species: ['hund', 'katt', 'kanin', 'marsvin', 'igelkott', 'rav', 'ekorre', 'hamster'], spots: ['body'],
    problem: n => `${n} kliar sig hela tiden. Det kryper små svarta prickar i pälsen!`,
    event: n => `${n} kliar och kliar sig... kan det vara loppor?`,
    steps: [
      { tool: 'loppkam', action: 'rub', at: 'whole', hint: 'Kamma ut de små krypen ur pälsen.', done: 'Nästan alla loppor är borta!' },
      { tool: 'schampo', action: 'rub', at: 'whole', hint: 'Tvätta pälsen med något som tar bort de sista lopporna.', done: 'Så mycket lödder!' },
      { tool: 'dusch', action: 'hold', at: 'whole', hint: 'Skölj bort löddret.', done: 'Ren och lopp-fri!' },
    ],
    mark: null,
    draw: (x, y, step) => {
      if (step === 0) return fleasSvg(8);
      if (step === 1) return fleasSvg(2);
      return bubblesSvg();
    },
  },

  oga: {
    name: 'Ögoninflammation', species: 'all', spots: ['eye'],
    problem: n => `${n} har ett rött och kladdigt öga som kliar.`,
    event: n => `${n} kisar med ena ögat. Det ser rött ut!`,
    steps: [
      { tool: 'tvatt', action: 'click', hint: 'Torka försiktigt bort kladdet runt ögat först.', done: 'Nu är det rent runt ögat.' },
      { tool: 'ogondroppar', action: 'click', hint: 'Vilken medicin är gjord för ögon?', done: 'Dropparna gör att ögat läker.' },
    ],
    mark: null,
    draw: (x, y, step, c) => {
      if (step === 0) {
        return at(x, y, `<ellipse rx="13" ry="12" fill="#ff6b6b" opacity=".55"/>` +
          `<path d="M-11 0 Q0 -15 11 0 Z" fill="${c.main}" ${SK2}/>` +
          `<circle cx="9" cy="8" r="2" fill="#e8d36a"/><circle cx="-8" cy="9" r="1.6" fill="#e8d36a"/>`);
      }
      return at(x, y, `<ellipse rx="13" ry="12" fill="none" stroke="#ff6b6b" stroke-width="3" opacity=".6"/>`);
    },
  },

  fasting: {
    name: 'Fästing', species: ['hund', 'katt', 'hast', 'igelkott', 'ko', 'get', 'rav', 'ekorre'], spots: ['body', 'head'],
    problem: n => `${n} har en fästing som sitter fast och suger blod.`,
    event: n => `Usch! ${n} har fått en fästing!`,
    steps: [
      { tool: 'fastingplockare', action: 'pull', hint: 'Det finns ett speciellt verktyg för att få loss fästingar.', done: 'Fästingen är borta!' },
      { tool: 'desinfektion', action: 'click', hint: 'Gör rent stället där fästingen satt.', done: 'Rent och fint!' },
    ],
    mark: null,
    draw: (x, y, step) => step === 0 ? at(x, y, tickSvg) : at(x, y, redDot),
  },

  vinge: {
    name: 'Skadad vinge', species: ['fagel', 'anka'], spots: ['wing'],
    problem: n => `${n} har flugit in i ett fönster och kan inte lyfta vingen.`,
    event: n => `Åh nej! ${n} flög in i ett fönster och vingen hänger!`,
    steps: [
      { tool: 'forstoringsglas', action: 'hold', hint: 'Undersök vingen noga först, så ser du vad som har hänt.', done: 'Vingen är stukad, men inte bruten.' },
      { tool: 'bandage', action: 'rub', hint: 'Vingen måste lindas så att den hålls stilla.', done: 'Vingen är lindad.' },
      { tool: 'filt', action: 'click', at: 'whole', hint: 'Nu behöver djuret vila i värmen.', done: 'Lugn och ro, så läker vingen.' },
    ],
    mark: 'wing', markTime: 180,
    draw: (x, y, step, c, sp) => {
      const [px, py] = sp.wingPivot;
      const g = inner => `<g transform="rotate(28 ${px} ${py})">${inner}</g>`;
      if (step < 2) return g(at(x, y, `<path d="M-8 -6 l12 4 M-9 2 l14 3" stroke="#e5484d" stroke-width="3" stroke-linecap="round"/>`));
      return g(at(x, y, `<rect x="-13" y="-16" width="26" height="30" rx="8" fill="#fff" ${SK2}/><path d="M-12 -6 L12 -9 M-12 2 L12 -1" stroke="#cfd8e3" stroke-width="2"/>`));
    },
  },

  skal: {
    name: 'Spricka i skalet', species: ['skoldpadda'], spots: ['body'],
    problem: n => `${n} har ramlat ner från en sten och fått en spricka i skalet.`,
    event: n => `Oj! ${n} har fått en spricka i skalet!`,
    steps: [
      { tool: 'forstoringsglas', action: 'hold', hint: 'Undersök sprickan noga först. Hur stor är den?', done: 'Sprickan är liten. Den går att laga!' },
      { tool: 'desinfektion', action: 'click', hint: 'Gör rent i sprickan så att det inte kommer in bakterier.', done: 'Rent och fint.' },
      { tool: 'bandage', action: 'rub', hint: 'Skalet måste hållas ihop medan det läker.', done: 'Skalet är lagat!' },
    ],
    mark: 'bandage', markTime: 200,
    draw: (x, y, step) => {
      const crack = `<path d="M-14 -12 L-4 -4 L-8 4 L4 8 L0 16" fill="none" stroke="#3b2a20" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (step === 0) return at(x, y, `<circle r="15" fill="#ff7a7a" opacity=".35"/>` + crack + painLines);
      if (step === 1) return at(x, y, crack);
      return at(x, y, `<circle r="13" fill="#ffd36b" opacity=".45"/>` + crack);
    },
  },

  hov: {
    name: 'Sten i hoven', species: ['hast', 'ko', 'get'], spots: ['hoof'],
    problem: n => `${n} haltar. En vass sten har fastnat under hoven.`,
    event: n => `${n} haltar plötsligt. Något har fastnat i hoven!`,
    steps: [
      { tool: 'hovkratsa', action: 'pull', hint: 'Det finns ett speciellt verktyg för att rensa hovar.', done: 'Stenen är borta!' },
      { tool: 'desinfektion', action: 'click', hint: 'Gör rent där stenen satt.', done: 'Rent!' },
      { tool: 'bandage', action: 'rub', hint: 'Skydda hoven medan den läker.', done: 'Hoven är skyddad!' },
    ],
    mark: 'bandage', markTime: 150,
    draw: (x, y, step) => {
      if (step === 0) return at(x, y, `<path d="M-7 -1 Q0 -9 7 -3 Q9 4 2 6 Q-7 6 -7 -1Z" fill="#8d8d95" ${SK2}/>` + painLines);
      return at(x, y, step === 1 ? redDot : `<circle r="8" fill="#ffd36b" opacity=".5"/>` + redDot);
    },
  },
};

function injuriesFor(species) {
  return Object.keys(INJURIES).filter(k => {
    const v = INJURIES[k];
    return v.species === 'all' || v.species.includes(species);
  });
}

function makeInjury(species, type) {
  type = type || pick(injuriesFor(species));
  const def = INJURIES[type];
  const spots = def.spots.filter(sp => SPECIES[species].spots[sp]);
  return { type, spot: pick(spots), step: 0 };
}

function drawInjury(a, sp, c) {
  const inj = a.injury;
  const def = INJURIES[inj.type];
  if (!def || inj.step >= def.steps.length) return '';
  const [x, y] = sp.spots[inj.spot] || sp.spots.body;
  return def.draw(x, y, inj.step, c, sp);
}

function drawMark(mark, sp) {
  const [x, y] = sp.spots[mark.spot] || sp.spots.body;
  if (mark.kind === 'plaster') return plasterSvg(x, y);
  if (mark.kind === 'bandage') return bandageSvg(x, y);
  if (mark.kind === 'wing') return at(x, y, `<rect x="-13" y="-16" width="26" height="30" rx="8" fill="#fff" ${SK2}/><path d="M-12 -6 L12 -9 M-12 2 L12 -1" stroke="#cfd8e3" stroke-width="2"/>`);
  return '';
}

function moodFor(a) {
  if (a.injury) {
    if (a.injury.type === 'feber' && a.injury.step < 2) return 'sick';
    return a.injury.step === 0 ? 'sad' : 'neutral';
  }
  const n = a.needs;
  const avg = (n.food + n.water + n.joy + n.clean) / 4;
  const low = Math.min(n.food, n.water, n.joy, n.clean);
  if (low < 15) return 'sad';
  if (avg > 60) return 'happy';
  return 'neutral';
}
