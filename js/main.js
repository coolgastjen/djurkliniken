// Start, skärmbyten, hjälpfunktioner och adoptera/namnge

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const esc = str => String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

let currentScreen = 'start';

function show(name, arg) {
  currentScreen = name;
  $$('.screen').forEach(el => el.classList.toggle('active', el.id === 'screen-' + name));
  closeModal();
  if (name === 'home') Home.enter();
  if (name === 'adopt') Adopt.enter(arg);
  if (name === 'treat') Treat.enter(arg);
  if (name === 'shop') Shop.enter();
  if (name === 'play') Play.enter(arg);
  if (name === 'walk') Walk.enter(arg);
  if (name !== 'treat') Treat.leave();
  applyTheme();
  if (name !== 'play') Play.leave();
  if (name !== 'walk') Walk.leave();
  updateHud();
}

// ---------- Miljöer ----------

let appliedTheme = null;
let currentT = null;

// Vädret slumpas om med några minuters mellanrum när det står på automatiskt
function autoWeather() {
  if (!Game.s) return 'klart';
  const aw = Game.s.autoWeather;
  if (aw && aw.until > Date.now()) return aw.w;
  const x = Math.random();
  const w = x < 0.6 ? 'klart' : x < 0.88 ? 'regn' : 'aska';
  Game.s.autoWeather = { w, until: Date.now() + (2 + Math.random() * 2) * 60000 };
  return w;
}

function sceneSettings() {
  return (Game.s && Game.s.scene) || { season: 'auto', time: 'auto', weather: 'auto' };
}

function currentScene() {
  const set = sceneSettings();
  return {
    season: set.season === 'auto' ? autoSeason() : set.season,
    time: set.time === 'auto' ? autoTime() : set.time,
    weather: set.weather === 'auto' ? autoWeather() : set.weather,
  };
}

const TIME_MSG = { dag: 'God morgon! En ny dag börjar.', kvall: 'Solen går ner...', natt: 'Nu är det natt. God natt!' };

function announceChange(prev, sc) {
  if (!prev || currentScreen === 'start') return;
  if (prev.season !== sc.season) {
    toast(`Nu är det ${SEASON_NAMES[sc.season].toLowerCase()}!`, 'good');
    if (sc.season === 'vinter') toast('Ge djuren en filt eller halsduk så att de inte fryser!');
  }
  else if (prev.time !== sc.time) toast(TIME_MSG[sc.time]);
  if (prev.weather !== sc.weather) {
    const winter = sc.season === 'vinter';
    if (sc.weather === 'regn') toast(winter ? 'Det börjar snöa.' : 'Det börjar regna.');
    else if (sc.weather === 'aska') toast(winter ? 'Snöstorm!' : 'Åh nej, det åskar!', 'alert');
    else toast(winter ? 'Nu har det slutat snöa.' : 'Nu har det slutat regna.');
  }
}

let lastScene = null;

function applyTheme(force = false, announce = false) {
  const sc = currentScene();
  const T = buildTheme(sc.season, sc.time, sc.weather);
  if (!force && appliedTheme === T.key) return;
  if (announce) announceChange(lastScene, sc);
  lastScene = sc;
  appliedTheme = T.key;
  currentT = T;
  document.body.dataset.scene = sc.time;
  document.body.dataset.weather = sc.weather;
  $('#garden-bg').innerHTML = gardenBg(T);
  $('#garden-weather').innerHTML = weatherHtml(T);
  $('#play-bg').innerHTML = gardenBg(T);
  $('#play-weather').innerHTML = weatherHtml(T);
  $('#clinic-bg').innerHTML = clinicBg(T);
  Walk.applyTheme(T);
}

function openThemePicker() {
  Sound.click();
  const set = sceneSettings();
  const now = currentScene();
  const chip = (group, val, label) => `<button class="chip ${set[group] === val ? 'on' : ''}" data-g="${group}" data-v="${val}">${label}</button>`;
  const autoLabel = txt => `Auto <small>(${txt.toLowerCase()})</small>`;
  openModal(`<h2 class="picker-head">Miljö och väder</h2>
    ${themePreview(currentT || buildTheme(now.season, now.time, now.weather))}
    <p class="label">Årstid</p>
    <div class="chips">${chip('season', 'auto', autoLabel(SEASON_NAMES[autoSeason()]))}${SEASONS.map(v => chip('season', v, SEASON_NAMES[v])).join('')}</div>
    <p class="label">Tid på dygnet</p>
    <div class="chips">${chip('time', 'auto', autoLabel(TIME_NAMES[autoTime()]))}${TIMES.map(v => chip('time', v, TIME_NAMES[v])).join('')}</div>
    <p class="label">Väder</p>
    <div class="chips">${chip('weather', 'auto', 'Auto <small>(växlar)</small>')}${WEATHERS.map(v => chip('weather', v, weatherName(v, now.season))).join('')}</div>
    <p class="picker-note">På auto går spelets egen klocka: ett dygn tar 6 minuter, årstiden byts var 12:e minut och vädret växlar med några minuters mellanrum.</p>
    <div class="modal-footer"><button class="btn white" id="theme-close">Stäng</button></div>`);
  $('#theme-close').onclick = () => { Sound.click(); closeModal(); };
  $$('#modal-box .chip').forEach(b => b.addEventListener('click', () => {
    Game.s.scene = { ...sceneSettings(), [b.dataset.g]: b.dataset.v };
    if (b.dataset.g === 'weather') Game.s.autoWeather = null;
    Game.save();
    Sound.pop();
    applyTheme(true);
    openThemePicker();
  }));
}

// Åskmuller ibland när det åskar
function maybeThunder() {
  if (currentT && currentT.lightning && ['home', 'play', 'walk'].includes(currentScreen) && Math.random() < 0.12) { Sound.thunder(); Home.scare(); }
}

function updateHud() {
  if (!Game.s) return;
  $$('.coin-count').forEach(el => { el.textContent = Game.s.coins; });
  $('#star-count').textContent = Game.s.stars;
  $('#btn-sound').innerHTML = uiIcon(Game.s.sound ? 'soundOn' : 'soundOff');
}

function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.textContent = msg;
  $('#toast-wrap').appendChild(el);
  setTimeout(() => el.remove(), 3700);
}

function openModal(html, center = false) {
  $('#modal-box').innerHTML = html;
  $('#modal').classList.toggle('center', center);
  $('#modal').classList.remove('hidden');
}

function closeModal() {
  $('#modal').classList.add('hidden');
  $('#modal-box').innerHTML = '';
  Home.cardId = null;
}

function confetti() {
  const colors = ['#ff7a59', '#4dabf7', '#51cf66', '#ffd43b', '#ff8fab', '#b197fc'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.animationDuration = (1.8 + Math.random() * 1.8) + 's';
    c.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}

// Fyll i alla ikoner som är markerade med data-icon i HTML
function fillIcons() {
  $$('[data-icon]').forEach(el => { el.innerHTML = uiIcon(el.dataset.icon); });
  $$('[data-go]').forEach(el => {
    if (el.classList.contains('icon-btn')) el.innerHTML = uiIcon('back');
    el.addEventListener('click', () => { Sound.click(); show(el.dataset.go); });
  });
  $('#treat-back').innerHTML = uiIcon('back');
  $('#random-name').innerHTML = uiIcon('dice');
  $('#start-logo').innerHTML = logoSvg;
  $('#home-logo').innerHTML = logoSvg;
  $('#vet-face').innerHTML = vetSvg;
  $('#btn-theme').innerHTML = uiIcon('scene');
  $('#table-holder').innerHTML = tableSvg;
}

// ---------- Startskärm ----------

function setupStart() {
  $('#parade').innerHTML = ['hund', 'katt', 'kanin', 'hast', 'gris', 'anka', 'rav', 'igelkott'].map((sp, i) =>
    `<div>${drawAnimal({ id: i + 1, species: sp, color: i % SPECIES[sp].colors.length }, { mood: 'happy' })}</div>`).join('');
  if (Game.hasSave()) $('#btn-continue').classList.remove('hidden');

  $('#btn-continue').addEventListener('click', () => {
    Sound.click();
    if (!Game.load()) { Game.newGame(); }
    Sound.enabled = Game.s.sound;
    show('home');
  });

  $('#btn-new').addEventListener('click', () => {
    Sound.click();
    if (Game.hasSave()) {
      openModal(`<div class="celebrate"><h2 style="color:var(--red)">Börja om?</h2>
        <p>Om du startar ett nytt spel försvinner alla dina djur och mynt.</p>
        <div class="modal-footer"><button class="btn white" id="m-no">Nej, tillbaka</button><button class="btn red" id="m-yes">Ja, börja om</button></div></div>`, true);
      $('#m-no').onclick = closeModal;
      $('#m-yes').onclick = () => { Game.newGame(); show('adopt'); };
    } else {
      Game.newGame();
      show('adopt');
    }
  });
}

// ---------- Skaffa djur ----------

const Adopt = {
  species: null,
  color: 0,

  enter() {
    this.species = null;
    $('#adopt-panel').classList.add('hidden');
    const free = Game.freeSlots();
    $('#adopt-hint').textContent = free > 0
      ? `Vilket djur vill du ha? Du har ${free} ${free === 1 ? 'ledig plats' : 'lediga platser'}.`
      : 'Du har inga lediga platser. Köp fler platser i butiken!';
    $('#species-grid').innerHTML = SPECIES_ORDER.map((sp, i) =>
      `<button class="species-card" data-sp="${sp}">${drawAnimal({ id: 50 + i, species: sp, color: 0 }, { mood: 'happy' })}${SPECIES[sp].name}</button>`).join('');
    $$('#species-grid .species-card').forEach(el => el.addEventListener('click', () => this.choose(el.dataset.sp)));
  },

  choose(sp) {
    Sound.pop();
    this.species = sp;
    this.color = 0;
    $$('#species-grid .species-card').forEach(el => el.classList.toggle('selected', el.dataset.sp === sp));
    $('#adopt-panel').classList.remove('hidden');
    $('#name-input').value = '';
    this.renderSwatches();
    this.renderPreview();
    $('#adopt-btn').disabled = Game.freeSlots() <= 0;
    $('#adopt-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  renderSwatches() {
    const colors = SPECIES[this.species].colors;
    $('#swatches').innerHTML = colors.map((c, i) =>
      `<button class="swatch ${i === this.color ? 'selected' : ''}" data-i="${i}"><i style="background:${c.main}"></i>${c.name}</button>`).join('');
    $$('#swatches .swatch').forEach(el => el.addEventListener('click', () => {
      Sound.click();
      this.color = +el.dataset.i;
      this.renderSwatches();
      this.renderPreview();
    }));
  },

  renderPreview() {
    $('#adopt-preview').innerHTML = drawAnimal({ id: 99, species: this.species, color: this.color }, { mood: 'joy' });
  },

  adopt() {
    if (!this.species) return;
    if (Game.freeSlots() <= 0) { toast('Du har inga lediga platser. Köp fler i butiken!', 'alert'); return; }
    const name = $('#name-input').value.trim();
    if (!name) {
      toast('Ditt djur behöver ett namn!', 'alert');
      Sound.bad();
      $('#name-input').focus();
      return;
    }
    const a = Game.makeAnimal(this.species, this.color, name);
    Game.s.animals.push(a);
    Game.save();
    Sound.win();
    confetti();
    toast(`Välkommen hem, ${name}!`, 'good');
    show('home');
  },
};

// ---------- Huvudloop ----------

function mainLoop() {
  let saveCounter = 0;
  setInterval(() => {
    if (!Game.s || currentScreen === 'start' || document.hidden) return;
    Home.tick(1);
    Game.s.clock = (Game.s.clock || 0) + 1;
    applyTheme(false, true);
    maybeThunder();
    if (++saveCounter >= 10) { saveCounter = 0; Game.save(); }
  }, 1000);
  window.addEventListener('beforeunload', () => Game.save());
  document.addEventListener('visibilitychange', () => { if (document.hidden) Game.save(); });
}

// ---------- Start ----------

// Stoppa zoom i mobilen (nyp-zoom på iPhone/iPad och zoom med ctrl+hjul)
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('dblclick', e => e.preventDefault());
document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

window.addEventListener('DOMContentLoaded', () => {
  fillIcons();
  setupStart();
  Home.setup();
  Treat.setup();
  Shop.setup();
  Play.setup();
  Walk.setup();

  $('#adopt-btn').addEventListener('click', () => Adopt.adopt());
  $('#name-input').addEventListener('keydown', e => { if (e.key === 'Enter') Adopt.adopt(); });
  $('#random-name').addEventListener('click', () => { Sound.pop(); $('#name-input').value = pick(NAMES); });
  $('#btn-theme').addEventListener('click', openThemePicker);
  $('#btn-sound').addEventListener('click', () => {
    Game.s.sound = !Game.s.sound;
    Sound.enabled = Game.s.sound;
    Sound.click();
    updateHud();
    Game.save();
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && !$('#modal').classList.contains('center')) closeModal(); });

  applyTheme(true);
  mainLoop();
});
