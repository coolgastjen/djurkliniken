// Apport: kasta bollen, djuret springer och hämtar den

const FETCH_ROUNDS = 5;
// Hur snabbt varje djur springer (andel av spelplanens bredd per sekund)
const RUN_SPEED = {
  hund: 0.55, katt: 0.45, kanin: 0.5, marsvin: 0.32, hast: 0.62, fagel: 0.5, igelkott: 0.3,
  gris: 0.4, ko: 0.38, get: 0.52, anka: 0.36, skoldpadda: 0.16, rav: 0.6, ekorre: 0.56, hamster: 0.3,
};

const Play = {
  a: null,
  phase: 'idle',   // ready | flying | fetching | returning | dropping | done
  count: 0,
  bonus: 0,
  raf: null,
  last: 0,
  pet: { x: 0.35, y: 0.92 },
  ball: { x: 0.5, y: 0.95, h: 0 },
  fly: null,
  goal: { x: 0.5, y: 0.6 },

  setup() {
    $('#play-field').addEventListener('pointerdown', e => this.throwAt(e));
    $('#play-back').innerHTML = uiIcon('back');
    $('#play-back').addEventListener('click', () => { Sound.click(); this.quit(); });
    $('#play-ball').innerHTML = uiIcon('ball');
    $('#play-goal').innerHTML = uiIcon('star');
  },

  enter(id) {
    this.a = Game.get(id);
    if (!this.a || this.a.injury) { setTimeout(() => show('home'), 0); return; }
    $('#play-title').textContent = `Apport med ${this.a.name}`;
    this.count = 0;
    this.bonus = 0;
    this.home = { x: 0.36, y: 0.93 };
    this.start = { x: 0.52, y: 0.96 };
    this.pet = { ...this.home };
    this.ball = { ...this.start, h: 0 };
    this.setMood('happy');
    this.placeGoal();
    this.ready();
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
    if (this.count > 0) this.finish();
    else show('home');
  },

  setMood(mood) {
    $('#play-pet .pet-svg').innerHTML = drawAnimal(this.a, { mood });
  },

  hint(text) {
    $('#play-hint').textContent = text;
  },

  updateHud() {
    $('#play-count').textContent = `${this.count} / ${FETCH_ROUNDS}`;
    updateHud();
  },

  ready() {
    this.phase = 'ready';
    this.ball = { ...this.start, h: 0 };
    this.hint(this.count === 0
      ? `Tryck där du vill kasta bollen! Träffa stjärnan för bonus.`
      : `Bra! Kasta igen!`);
    this.updateHud();
  },

  placeGoal() {
    this.goal = { x: 0.15 + Math.random() * 0.7, y: 0.5 + Math.random() * 0.25 };
  },

  // ---------- Kasta ----------

  throwAt(e) {
    if (this.phase !== 'ready') return;
    const r = $('#play-field').getBoundingClientRect();
    // Lite slump, så att det inte blir för lätt att träffa stjärnan
    const tx = clamp((e.clientX - r.left) / r.width + (Math.random() - 0.5) * 0.06, 0.06, 0.94);
    const ty = clamp((e.clientY - r.top) / r.height + (Math.random() - 0.5) * 0.05, 0.48, 0.86);
    const d = Math.hypot((tx - this.start.x) * r.width, (ty - this.start.y) * r.height);
    this.fly = { from: { ...this.start }, to: { x: tx, y: ty }, t: 0, dur: 0.45 + d / 1100, height: 60 + d * 0.45 };
    this.phase = 'flying';
    this.hint('Hämta!');
    Sound.tone(500, 0.2, 'sine', 0.1, 0, 900);
    this.say(SPECIES[this.a.species].says);
  },

  // ---------- Spelloop ----------

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const r = $('#play-field').getBoundingClientRect();
    if (r.width) this.step(dt, r);
    this.render(r);
    if (this.phase !== 'idle') this.raf = requestAnimationFrame(t => this.loop(t));
  },

  // Flytta djuret mot en punkt. Returnerar true när det är framme.
  runTo(target, dt, r) {
    const dx = (target.x - this.pet.x) * r.width;
    const dy = (target.y - this.pet.y) * r.height;
    const d = Math.hypot(dx, dy);
    const sc = 0.55 + 0.45 * this.pet.y;  // längre bort = ser långsammare ut
    const stepPx = (RUN_SPEED[this.a.species] || 0.45) * r.width * dt * sc;
    if (d <= stepPx) { this.pet.x = target.x; this.pet.y = target.y; return true; }
    this.pet.x += dx / d * stepPx / r.width;
    this.pet.y += dy / d * stepPx / r.height;
    return false;
  },

  step(dt, r) {
    const f = this.fly;
    if (this.phase === 'flying') {
      f.t = Math.min(1, f.t + dt / f.dur);
      this.ball.x = f.from.x + (f.to.x - f.from.x) * f.t;
      this.ball.y = f.from.y + (f.to.y - f.from.y) * f.t;
      this.ball.h = 4 * f.height * f.t * (1 - f.t);
      if (f.t > 0.25) this.runTo(f.to, dt, r);
      if (f.t >= 1) {
        Sound.pop();
        this.checkGoal(r);
        this.phase = 'fetching';
      }
    } else if (this.phase === 'fetching') {
      if (this.runTo(this.ball, dt, r)) {
        this.phase = 'returning';
        Sound.tone(800, 0.08, 'triangle', 0.08);
        this.hint(`${this.a.name} har bollen! Här kommer den...`);
      }
    } else if (this.phase === 'returning') {
      const arrived = this.runTo(this.home, dt, r);
      const m = this.mouth(r);
      this.ball.x = m.x; this.ball.y = this.pet.y; this.ball.h = m.h;
      if (arrived) this.fetched();
    } else if (this.phase === 'dropping') {
      this.dropT += dt / 0.35;
      const t = Math.min(1, this.dropT);
      this.ball.x = this.dropFrom.x + (this.start.x - this.dropFrom.x) * t;
      this.ball.y = this.dropFrom.y + (this.start.y - this.dropFrom.y) * t;
      this.ball.h = this.dropFrom.h * (1 - t) + Math.abs(Math.sin(t * Math.PI * 2)) * 14 * (1 - t);
      if (t >= 1) this.ready();
    }
  },

  // Var djurets mun är (bollen sitter där när djuret bär den)
  mouth(r) {
    const el = $('#play-pet');
    const size = el.offsetWidth * (0.5 + 0.5 * this.pet.y);
    const [mx, my] = SPECIES[this.a.species].spots.mouth;
    return { x: this.pet.x + (mx - 100) / 200 * size / r.width, h: (200 - my) / 200 * size - 4 };
  },

  checkGoal(r) {
    const d = Math.hypot((this.ball.x - this.goal.x) * r.width, (this.ball.y - this.goal.y) * r.height);
    if (d < 55 * (0.5 + 0.5 * this.goal.y)) {
      this.bonus += 2;
      Game.addCoins(2);
      Sound.coin();
      this.fx(this.goal, 'Fullträff! +2');
      this.placeGoal();
    }
  },

  fetched() {
    this.count++;
    const n = this.a.needs;
    n.joy = clamp(n.joy + 7);
    n.food = clamp(n.food - 1.5);
    n.water = clamp(n.water - 2);
    n.clean = clamp(n.clean - 2.5);
    Game.addCoins(1);
    Sound.happy();
    this.setMood('joy');
    this.say(pick(['Apport!', 'Igen, igen!', SPECIES[this.a.species].says]));
    setTimeout(() => { if (this.phase !== 'idle' && this.phase !== 'done') this.setMood('happy'); }, 1200);
    this.updateHud();
    Game.save();

    // Ibland går det lite för vilt till...
    if (Math.random() < 0.04) {
      const types = ['skrubbsar', ...injuriesFor(this.a.species).filter(t => ['tagg', 'benbrott', 'vinge', 'hov'].includes(t))];
      this.phase = 'done';
      Home.injure(this.a, pick(types));
      this.setMood('sad');
      setTimeout(() => this.finish(true), 900);
      return;
    }
    if (this.count >= FETCH_ROUNDS) {
      this.phase = 'done';
      setTimeout(() => this.finish(), 700);
      return;
    }
    this.dropFrom = { ...this.ball };
    this.dropT = 0;
    this.phase = 'dropping';
  },

  finish(hurt = false) {
    this.leave();
    const a = this.a;
    const coins = this.count + this.bonus;
    const portrait = drawAnimal(a, { mood: hurt ? 'sad' : 'joy' });
    openModal(`<div class="celebrate"><div class="portrait">${portrait}</div>
      <h2 style="${hurt ? 'color:var(--red)' : ''}">${hurt ? `Aj! ${esc(a.name)} gjorde sig illa!` : 'Vad roligt det var!'}</h2>
      <p>${esc(a.name)} hämtade bollen ${this.count} ${this.count === 1 ? 'gång' : 'gånger'}.${hurt ? ' Nu behöver djuret hjälp på kliniken.' : ''}</p>
      <div class="reward"><span class="pill">${uiIcon('heart')} Gladare</span><span class="pill">${uiIcon('coin')} +${coins}</span></div>
      <div class="modal-footer">
        ${hurt ? `<button class="btn red" id="pl-treat">${uiIcon('cross')} Till behandlingsrummet</button>`
          : `<button class="btn white" id="pl-home">Tillbaka till gården</button><button class="btn green" id="pl-again">Spela igen</button>`}
      </div></div>`, true);
    if (hurt) {
      $('#pl-treat').onclick = () => { Sound.click(); show('treat', a.id); };
      return;
    }
    $('#pl-home').onclick = () => { Sound.click(); show('home'); };
    $('#pl-again').onclick = () => {
      if (a.needs.food < 15 || a.needs.water < 15) {
        toast(`${a.name} är för hungrig och törstig för att leka mer.`, 'alert');
        show('home');
        return;
      }
      Sound.click();
      closeModal();
      this.enter(a.id);
    };
  },

  // ---------- Rita ----------

  render(r) {
    const pet = $('#play-pet');
    const ps = 0.5 + 0.5 * this.pet.y;
    pet.style.left = this.pet.x * r.width + 'px';
    pet.style.top = this.pet.y * r.height + 'px';
    pet.style.transform = `translate(-50%, -100%) scale(${ps})`;
    pet.style.zIndex = Math.round(this.pet.y * 100);
    const moving = this.phase === 'fetching' || this.phase === 'returning' || (this.phase === 'flying' && this.fly.t > 0.25);
    pet.classList.toggle('walking', moving);

    const bs = 0.5 + 0.5 * this.ball.y;
    const ball = $('#play-ball');
    const shadow = $('#play-shadow');
    const bx = this.ball.x * r.width;
    const by = this.ball.y * r.height;
    ball.style.left = bx + 'px';
    ball.style.top = (by - this.ball.h - 14 * bs) + 'px';
    ball.style.transform = `translate(-50%, -50%) scale(${bs}) rotate(${(this.ball.x * 900) % 360}deg)`;
    ball.style.zIndex = this.phase === 'returning' ? 999 : Math.round(this.ball.y * 100) + 1;
    shadow.style.left = bx + 'px';
    shadow.style.top = by + 'px';
    shadow.style.transform = `translate(-50%, -50%) scale(${bs * Math.max(0.4, 1 - this.ball.h / 300)})`;
    shadow.style.display = this.phase === 'returning' ? 'none' : '';

    const g = $('#play-goal');
    const gs = 0.5 + 0.5 * this.goal.y;
    g.style.left = this.goal.x * r.width + 'px';
    g.style.top = this.goal.y * r.height + 'px';
    g.style.transform = `translate(-50%, -50%) scale(${gs})`;
  },

  say(text) {
    const b = $('#play-says');
    b.textContent = text;
    b.classList.remove('hidden');
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = '';
    clearTimeout(this._say);
    this._say = setTimeout(() => b.classList.add('hidden'), 1300);
  },

  fx(pos, text) {
    const field = $('#play-field');
    const el = document.createElement('div');
    el.className = 'play-fx';
    el.textContent = text;
    el.style.left = pos.x * 100 + '%';
    el.style.top = pos.y * 100 + '%';
    field.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  },
};
