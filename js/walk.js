// Promenad (och ridtur för hästar): landskapet rullar förbi, tryck för att hoppa över hinder

const WALK_TIME = 40;  // sekunder

// ---------- Grafik för promenaden ----------

const svgUrl = svg => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

// Landskapet för promenaden, i rätt miljö (sommar, höst, vinter, natt, solnedgång)
function walkArt(theme) {
  const T = themeOf(theme);
  const snowTop = T.snow ? `<path d="M570 70 L600 140 Q585 132 570 140 Q555 132 540 140Z" fill="#fff"/><path d="M570 120 L604 184 Q588 176 570 184 Q552 176 536 184Z" fill="#fff"/>` : '';
  const fruit = T.fruit ? `<circle cx="100" cy="110" r="9" fill="${T.fruit}"/><circle cx="150" cy="140" r="9" fill="${T.fruit}"/><circle cx="110" cy="160" r="9" fill="${T.fruit}"/>` : '';
  const flowers = T.flowers ? `<circle cx="320" cy="270" r="6" fill="#ff8fab"/><circle cx="360" cy="262" r="6" fill="#ffd43b"/><circle cx="780" cy="280" r="6" fill="#fff"/>` : '';
  const stones = T.snow ? '#d3dde8' : '#c9a46f';
  return {
    sky: `linear-gradient(${T.sky.join(', ')})`,
    hills: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="none">
      <path d="M0 300 V170 Q120 80 260 150 Q380 60 520 140 Q660 70 800 170 V300Z" fill="${T.hills[0]}"/>
      <path d="M0 300 V220 Q160 160 330 215 Q520 150 800 220 V300Z" fill="${T.hills[1]}"/></svg>`,
    trees: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300">
      <g stroke="${OUT}" stroke-width="5">
        <rect x="112" y="170" width="26" height="130" rx="6" fill="#9b6b43"/>
        <circle cx="125" cy="130" r="70" fill="${T.leaf}"/>
        <rect x="560" y="200" width="20" height="100" rx="5" fill="#9b6b43"/>
        <path d="M570 70 L630 210 H510Z" fill="${T.pine}" stroke-linejoin="round"/>
        <path d="M570 120 L640 250 H500Z" fill="${T.pine}" stroke-linejoin="round"/>
        <ellipse cx="340" cy="285" rx="70" ry="40" fill="${T.bush}"/>
        <ellipse cx="790" cy="290" rx="55" ry="30" fill="${T.bush}"/>
      </g>${snowTop}${fruit}${flowers}</svg>`,
    ground: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" preserveAspectRatio="none">
      <rect width="400" height="120" fill="${T.ground}"/>
      <rect width="400" height="16" fill="${T.groundTop}"/>
      <path d="M0 16 Q20 26 40 16 T80 16 T120 16 T160 16 T200 16 T240 16 T280 16 T320 16 T360 16 T400 16" fill="${T.groundTop}"/>
      <path d="M0 16 H400" stroke="${OUT}" stroke-width="4"/>
      <ellipse cx="60" cy="60" rx="10" ry="5" fill="${stones}"/><ellipse cx="210" cy="85" rx="14" ry="6" fill="${stones}"/>
      <ellipse cx="320" cy="50" rx="8" ry="4" fill="${stones}"/><ellipse cx="130" cy="100" rx="9" ry="4" fill="${stones}"/></svg>`,
    rideGround: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" preserveAspectRatio="none">
      <rect width="400" height="120" fill="${T.snow ? '#e9eff5' : '#d8b48a'}"/>
      <rect width="400" height="10" fill="#fff"/><rect y="10" width="400" height="6" fill="#e5484d"/>
      <path d="M0 16 H400" stroke="${OUT}" stroke-width="4"/>
      <path d="M30 50 q10 -6 20 0 M180 80 q10 -6 20 0 M300 45 q10 -6 20 0 M110 100 q10 -6 20 0" stroke="${T.snow ? '#c9d6e3' : '#b8946a'}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  };
}

const OBSTACLES = {
  puddle: { w: 0.9, h: 0.1, flat: true, svg: `<svg viewBox="0 0 100 24" preserveAspectRatio="none"><ellipse cx="50" cy="12" rx="48" ry="10" fill="#74c0fc" ${SK}/><ellipse cx="38" cy="10" rx="18" ry="3" fill="#fff" opacity=".6"/></svg>` },
  stone: { w: 0.42, h: 0.3, svg: `<svg viewBox="0 0 60 40" preserveAspectRatio="none"><path d="M4 38 Q2 14 20 6 Q40 0 54 16 Q60 30 56 38Z" fill="#a5a5ad" ${SK}/><path d="M16 16 Q22 10 30 12" stroke="#fff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/></svg>` },
  log: { w: 0.75, h: 0.28, svg: `<svg viewBox="0 0 100 40" preserveAspectRatio="none"><rect x="4" y="4" width="84" height="34" rx="6" fill="#9b6b43" ${SK}/><ellipse cx="88" cy="21" rx="9" ry="17" fill="#d9a066" ${SK}/><ellipse cx="88" cy="21" rx="4" ry="8" fill="none" stroke="#9b6b43" stroke-width="2"/><path d="M14 14 H60 M20 26 H70" stroke="#7a4a22" stroke-width="2.5"/></svg>` },
  fence: { w: 0.38, h: 0.55, svg: `<svg viewBox="0 0 60 80" preserveAspectRatio="none"><rect x="2" y="4" width="10" height="76" rx="2" fill="#fff" ${SK}/><rect x="48" y="4" width="10" height="76" rx="2" fill="#fff" ${SK}/>
      <g class="poles"><rect x="4" y="18" width="52" height="8" fill="#e5484d" ${SK2}/><rect x="4" y="38" width="52" height="8" fill="#fff" ${SK2}/><rect x="4" y="58" width="52" height="8" fill="#e5484d" ${SK2}/></g></svg>` },
  hay: { w: 0.6, h: 0.38, svg: `<svg viewBox="0 0 80 54" preserveAspectRatio="none"><rect x="3" y="3" width="74" height="48" rx="6" fill="#f2d36b" ${SK}/><path d="M10 14 H70 M10 26 H70 M10 38 H70" stroke="#d4b13f" stroke-width="3"/><path d="M28 3 V51 M52 3 V51" stroke="#e5484d" stroke-width="4"/></svg>` },
};

UI_ICONS.leash = `<g fill="currentColor" opacity=".9"><g transform="translate(18 46) scale(.35) rotate(-20)"><ellipse rx="13" ry="11"/><circle cx="-16" cy="-15" r="6"/><circle cx="-6" cy="-24" r="6"/><circle cx="6" cy="-24" r="6"/><circle cx="16" cy="-15" r="6"/></g><g transform="translate(44 24) scale(.35) rotate(20)"><ellipse rx="13" ry="11"/><circle cx="-16" cy="-15" r="6"/><circle cx="-6" cy="-24" r="6"/><circle cx="6" cy="-24" r="6"/><circle cx="16" cy="-15" r="6"/></g></g><path d="M8 20 Q30 4 56 52" fill="none" stroke="#e5484d" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 4"/>`;
UI_ICONS.horseshoe = `<path d="M14 56 L10 30 Q10 8 32 8 Q54 8 54 30 L50 56 L40 56 L43 30 Q43 18 32 18 Q21 18 21 30 L24 56Z" fill="#adb5bd" ${S3}/><circle cx="15" cy="34" r="2" fill="${OUT}"/><circle cx="49" cy="34" r="2" fill="${OUT}"/><circle cx="20" cy="16" r="2" fill="${OUT}"/><circle cx="44" cy="16" r="2" fill="${OUT}"/>`;

// ---------- Spelet ----------

const Walk = {
  a: null,
  ride: false,
  phase: 'idle',
  raf: null,

  setup() {
    $('#walk-back').innerHTML = uiIcon('back');
    $('#walk-back').addEventListener('click', () => { Sound.click(); this.quit(); });
    $('#walk-field').addEventListener('pointerdown', e => { e.preventDefault(); this.jump(); });
    window.addEventListener('keydown', e => {
      if (currentScreen === 'walk' && [' ', 'ArrowUp', 'w'].includes(e.key)) { e.preventDefault(); this.jump(); }
    });
  },

  applyTheme(theme) {
    this.art = walkArt(theme);
    $('#walk-field').style.background = this.art.sky;
    $('#walk-hills').style.backgroundImage = svgUrl(this.art.hills);
    $('#walk-trees').style.backgroundImage = svgUrl(this.art.trees);
    $('#walk-weather').innerHTML = weatherHtml(theme);
    if (this.a) $('#walk-ground').style.backgroundImage = svgUrl(this.ride ? this.art.rideGround : this.art.ground);
  },

  enter(id) {
    this.a = Game.get(id);
    if (!this.a || this.a.injury) { setTimeout(() => show('home'), 0); return; }
    this.ride = this.a.species === 'hast';
    $('#walk-title').textContent = this.ride ? `Ridtur med ${this.a.name}` : `Promenad med ${this.a.name}`;
    $('#walk-ground').style.backgroundImage = svgUrl(this.ride ? this.art.rideGround : this.art.ground);
    $('#walk-objs').innerHTML = '';
    this.objs = [];
    this.dist = 0;
    this.time = 0;
    this.nextSpawn = 0.6;  // i skärmbredder
    this.jumpH = 0;
    this.vy = 0;
    this.slow = 0;
    this.stats = { coins: 0, hearts: 0, food: 0, jumps: 0, hits: 0, splash: 0 };
    this.setMood('happy');
    this.hint(this.ride ? 'Tryck (eller mellanslag) för att hoppa över hindren!' : 'Tryck (eller mellanslag) för att hoppa! Samla godsaker på vägen.');
    this.updateHud();
    this.phase = 'run';
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(t => this.loop(t));
  },

  leave() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.phase = 'idle';
  },

  quit() {
    if (this.time > 5) this.finish();
    else show('home');
  },

  setMood(mood) {
    $('#walk-pet').innerHTML = drawAnimal(this.a, { mood, rider: this.ride });
  },

  hint(text) {
    const h = $('#walk-hint');
    h.textContent = text;
    h.classList.remove('hidden');
    clearTimeout(this._hint);
    this._hint = setTimeout(() => h.classList.add('hidden'), 3500);
  },

  updateHud() {
    $('#walk-coins').textContent = this.stats.coins;
    $('#walk-progress i').style.width = Math.min(100, this.time / WALK_TIME * 100) + '%';
    updateHud();
  },

  size(r) {
    return Math.min(r.height * 0.3, r.width * 0.3, 210);
  },

  jump() {
    if (this.phase !== 'run' || this.jumpH > 2) return;
    const r = $('#walk-field').getBoundingClientRect();
    const S = this.size(r);
    const h = S * (this.ride ? 1.0 : 0.85);
    const T = this.ride ? 0.85 : 0.75;
    this.g = 8 * h / (T * T);
    this.vy = 4 * h / T;
    this.jumpH = 0.01;
    Sound.tone(400, 0.18, 'sine', 0.1, 0, 800);
  },

  // ---------- Hinder och saker att samla ----------

  spawn(r) {
    const S = this.size(r);
    const x = r.width + S;
    if (Math.random() < 0.55) {
      const type = this.ride ? pick(['fence', 'fence', 'hay']) : pick(['puddle', 'stone', 'log', 'stone']);
      this.addObj({ kind: 'ob', type, x, w: OBSTACLES[type].w * S, h: OBSTACLES[type].h * S, y: 0, html: OBSTACLES[type].svg });
      // Ibland ett mynt ovanför hindret (belöning för hoppet)
      if (Math.random() < 0.5) this.addItem('coin', x + OBSTACLES[type].w * S / 2, S * 0.95, S);
    } else {
      const liked = Object.keys(FOODS).filter(f => FOODS[f].likes.includes(this.a.species));
      const high = Math.random() < 0.4;
      for (let i = 0; i < 3; i++) {
        const kind = i === 1 ? pick(['coin', 'heart', 'food']) : 'coin';
        const y = high ? S * (0.6 + (i === 1 ? 0.35 : 0.2)) : S * 0.35;
        this.addItem(kind, x + i * S * 0.55, y, S, pick(liked));
      }
    }
  },

  addItem(kind, x, y, S, food) {
    const html = kind === 'food' ? foodIcon(food) : uiIcon(kind);
    this.addObj({ kind, food, x, y, w: S * 0.32, h: S * 0.32, html });
  },

  addObj(o) {
    o.el = document.createElement('div');
    o.el.className = 'walk-obj' + (o.kind === 'ob' ? '' : ' item');
    o.el.innerHTML = o.html;
    o.el.style.width = o.w + 'px';
    o.el.style.height = o.h + 'px';
    $('#walk-objs').appendChild(o.el);
    this.objs.push(o);
  },

  // ---------- Spelloop ----------

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const r = $('#walk-field').getBoundingClientRect();
    if (r.width && this.phase === 'run') this.step(dt, r);
    if (r.width) this.render(r);
    if (this.phase !== 'idle') this.raf = requestAnimationFrame(t => this.loop(t));
  },

  step(dt, r) {
    const S = this.size(r);
    this.time += dt;
    this.slow = Math.max(0, this.slow - dt);
    const speed = Math.max(200, Math.min(this.ride ? 520 : 430, r.width * (this.ride ? 0.45 : 0.36))) * (this.slow > 0 ? 0.5 : 1);
    const dx = speed * dt;
    this.dist += dx;

    // hopp
    if (this.jumpH > 0) {
      this.jumpH += this.vy * dt;
      this.vy -= this.g * dt;
      if (this.jumpH <= 0) { this.jumpH = 0; this.vy = 0; }
    }

    // nya saker
    if (this.dist / r.width >= this.nextSpawn && this.time < WALK_TIME - 2) {
      this.spawn(r);
      this.nextSpawn = this.dist / r.width + 0.55 + Math.random() * 0.5;
    }

    const px = r.width * 0.25;
    for (const o of this.objs) {
      o.x -= dx;
      if (o.done) continue;
      if (o.kind === 'ob') {
        const overlap = Math.abs(o.x - px) < (o.w / 2 + S * 0.18);
        if (overlap && this.jumpH < o.h * 0.75) { this.hit(o); }
        else if (o.x < px - o.w / 2 - S * 0.2) { o.done = true; this.stats.jumps++; }
      } else {
        const cy = this.jumpH + S * 0.45;
        if (Math.abs(o.x - px) < S * 0.35 && Math.abs(o.y - cy) < S * 0.45) this.collect(o);
      }
    }
    this.objs = this.objs.filter(o => {
      if (o.x < -o.w * 2) { o.el.remove(); return false; }
      return true;
    });

    if (this.time >= WALK_TIME) { this.phase = 'done'; setTimeout(() => this.finish(), 300); }
    this.updateHud();
  },

  hit(o) {
    o.done = true;
    if (OBSTACLES[o.type].flat) {
      this.stats.splash++;
      Sound.tone(300, 0.25, 'sine', 0.08, 0, 120);
      this.fx(o.x, 0.15, 'Plask!');
      o.el.classList.add('splashed');
    } else {
      this.stats.hits++;
      this.slow = 0.8;
      Sound.bad();
      this.fx(o.x, 0.5, this.ride ? 'Rivning!' : 'Oj!');
      o.el.classList.add('knocked');
      this.setMood('sad');
      setTimeout(() => { if (this.phase === 'run') this.setMood('happy'); }, 900);
      // Ett hårt fall kan ge en skada
      if (Math.random() < 0.06) {
        this.phase = 'done';
        Home.injure(this.a, pick(['skrubbsar', ...injuriesFor(this.a.species).filter(t => ['tagg', 'benbrott', 'hov'].includes(t))]));
        setTimeout(() => this.finish(true), 900);
      }
    }
  },

  collect(o) {
    o.done = true;
    o.el.classList.add('got');
    const n = this.a.needs;
    if (o.kind === 'coin') { this.stats.coins++; Game.addCoins(1); Sound.coin(); }
    if (o.kind === 'heart') { this.stats.hearts++; n.joy = clamp(n.joy + 5); Sound.happy(); }
    if (o.kind === 'food') { this.stats.food++; n.food = clamp(n.food + 8); Sound.happy(); this.fx(o.x, 0.6, 'Mums!'); }
  },

  // ---------- Rita ----------

  render(r) {
    const S = this.size(r);
    const ground = r.height * 0.82;
    $('#walk-hills').style.backgroundPositionX = (-this.dist * 0.15) + 'px';
    $('#walk-trees').style.backgroundPositionX = (-this.dist * 0.5) + 'px';
    $('#walk-ground').style.backgroundPositionX = (-this.dist) + 'px';

    const pet = $('#walk-pet');
    const w = this.ride ? S * 1.05 : S;
    pet.style.width = w + 'px';
    pet.style.left = r.width * 0.25 + 'px';
    pet.style.top = (ground - this.jumpH + S * 0.04) + 'px';
    const bob = this.jumpH > 0 ? -8 : Math.sin(this.dist / 18) * 3;
    pet.style.transform = `translate(-50%, -100%) rotate(${bob}deg)`;

    for (const o of this.objs) {
      o.el.style.left = o.x + 'px';
      o.el.style.top = (o.kind === 'ob' ? ground + (OBSTACLES[o.type].flat ? o.h * 0.4 : 0) : ground - o.y) + 'px';
    }
  },

  fx(x, yFrac, text) {
    const el = document.createElement('div');
    el.className = 'play-fx';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = (82 - yFrac * 30) + '%';
    $('#walk-field').appendChild(el);
    setTimeout(() => el.remove(), 1300);
  },

  // ---------- Slut ----------

  finish(hurt = false) {
    this.leave();
    const a = this.a;
    const st = this.stats;
    const n = a.needs;
    const part = Math.min(1, this.time / WALK_TIME);
    n.joy = clamp(n.joy + 25 * part);
    n.food = clamp(n.food - 8 * part);
    n.water = clamp(n.water - 12 * part);
    n.clean = clamp(n.clean - 6 * part - st.splash * 8);
    Game.save();
    const title = hurt ? `Aj! ${esc(a.name)} gjorde sig illa!` : this.ride ? 'Vilken härlig ridtur!' : 'Vilken härlig promenad!';
    const total = st.jumps + st.hits;
    const lines = [];
    if (this.ride) lines.push(st.hits === 0 && total > 0 ? `Felfri runda! Ni klarade alla ${total} hinder!` : `Ni klarade ${st.jumps} av ${total} hinder.`);
    else if (st.splash) lines.push(`${esc(a.name)} plaskade i ${st.splash} ${st.splash === 1 ? 'vattenpöl' : 'vattenpölar'} och blev lite smutsig.`);
    if (st.food) lines.push(`${esc(a.name)} hittade ${st.food} ${st.food === 1 ? 'godsak' : 'godsaker'} på vägen.`);
    if (hurt) lines.push('Nu behöver djuret hjälp på kliniken.');
    openModal(`<div class="celebrate"><div class="portrait">${drawAnimal(a, { mood: hurt ? 'sad' : 'joy', rider: this.ride })}</div>
      <h2 style="${hurt ? 'color:var(--red)' : ''}">${title}</h2>
      ${lines.map(l => `<p>${l}</p>`).join('')}
      <div class="reward"><span class="pill">${uiIcon('heart')} Gladare</span><span class="pill">${uiIcon('coin')} +${st.coins}</span></div>
      <div class="modal-footer">
        ${hurt ? `<button class="btn red" id="wk-treat">${uiIcon('cross')} Till behandlingsrummet</button>`
          : `<button class="btn white" id="wk-home">Tillbaka till gården</button><button class="btn green" id="wk-again">${this.ride ? 'Rid igen' : 'Gå igen'}</button>`}
      </div></div>`, true);
    if (hurt) { $('#wk-treat').onclick = () => { Sound.click(); show('treat', a.id); }; return; }
    $('#wk-home').onclick = () => { Sound.click(); show('home'); };
    $('#wk-again').onclick = () => {
      if (n.food < 15 || n.water < 15) { toast(`${a.name} är för hungrig och törstig. Ge mat och vatten först!`, 'alert'); show('home'); return; }
      Sound.click();
      closeModal();
      this.enter(a.id);
    };
  },
};
