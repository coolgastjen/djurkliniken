// Vargen: hoppar in på gården och försöker ta ett djur. Skjut den inom 30 sekunder, eller skicka vakthunden!

const WOLF_TIME = 30;
const WOLF_HP = 3;
const GUARD_PRICE = 80;

// Stora stygga vargen (ritad som räven, fast grå och arg)
function wolfSvg(state = 'run') {
  const c = { main: '#7d8592', light: '#e3e6ea', dark: '#3b3540' };
  let s = `<ellipse cx="100" cy="191" rx="58" ry="7" fill="#000" opacity=".15"/>` + SPECIES.rav.draw(c);
  if (state === 'ko') {
    s += `<path d="M72 72 l16 16 M88 72 l-16 16 M112 72 l16 16 M128 72 l-16 16" stroke="#2b2024" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M90 110 q10 8 20 0" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<g class="dizzy"><circle cx="70" cy="40" r="5" fill="#ffd43b"/><circle cx="130" cy="36" r="5" fill="#ffd43b"/><circle cx="100" cy="26" r="5" fill="#ffd43b"/></g>`;
  } else {
    s += `<ellipse cx="80" cy="80" rx="8" ry="8" fill="#fff"/><ellipse cx="120" cy="80" rx="8" ry="8" fill="#fff"/>`;
    s += `<circle cx="82" cy="82" r="4.5" fill="#c92a2a"/><circle cx="118" cy="82" r="4.5" fill="#c92a2a"/>`;
    s += `<path d="M66 66 L92 74 M134 66 L108 74" stroke="#2b2024" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M84 108 Q100 120 116 108 Z" fill="#8a3341" ${SK2}/><path d="M88 109 l3 6 l3 -5 M106 109 l3 5 l3 -6" fill="#fff" stroke="#fff" stroke-width="1"/>`;
    if (state === 'hit') s += `<circle cx="100" cy="80" r="60" fill="#fff" opacity=".45"/>`;
  }
  return `<svg class="animal wolf-svg" viewBox="0 0 200 200">${s}</svg>`;
}

const Wolf = {
  w: null,
  raf: null,

  setup() {
    const garden = $('#garden');
    // Under vargattacken skjuter man i stället för att öppna djurkort
    garden.addEventListener('pointerdown', e => this.shoot(e), true);
    garden.addEventListener('click', e => { if (this.w && this.w.phase === 'hunt') { e.stopPropagation(); e.preventDefault(); } }, true);
  },

  // Vakthunden sitter vid hundkojan om man har köpt den
  renderGuard() {
    const g = $('#guard-dog');
    g.classList.toggle('hidden', !Game.s.guardDog);
    if (Game.s.guardDog && !g.innerHTML) {
      g.innerHTML = drawAnimal({ id: 77, species: 'hund', color: 2, acc: { head: null, neck: 'halsband', face: null } }, { mood: 'happy' }) + '<div class="nametag">Vakthund</div>';
    }
    if (!this.w || this.w.phase !== 'guard') { g.style.left = '34%'; g.style.top = '52%'; g.classList.remove('running'); }
  },

  maybeSpawn(dt) {
    const s = Game.s;
    const night = typeof currentT !== 'undefined' && currentT && currentT.time === 'natt';
    s.timers.wolf = (s.timers.wolf === undefined ? 150 : s.timers.wolf) - dt * (night ? 2 : 1);
    if (s.timers.wolf <= 0 && !this.w) {
      s.timers.wolf = 240 + Math.random() * 180;
      this.start();
    }
  },

  start() {
    const alive = Game.s.animals.filter(a => !a.dead);
    if (!alive.length || this.w) return;
    const target = pick(alive);
    const fromLeft = target.x > 50;
    this.w = { targetId: target.id, sx: fromLeft ? -6 : 106, sy: 60 + Math.random() * 20, x: 0, y: 0, t: 0, hp: WOLF_HP, phase: 'enter' };
    this.w.x = this.w.sx; this.w.y = this.w.sy;
    Sound.howl();
    $('#wolf').classList.remove('hidden');
    $('#wolf').innerHTML = wolfSvg('run') + `<div class="wolf-hp"></div>`;
    this.updateHp();
    closeModal();
    if (Game.s.guardDog) this.showChoice(target);
    else this.beginHunt();
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(t => this.loop(t));
  },

  target() {
    return Game.get(this.w.targetId);
  },

  showChoice(target) {
    this.w.phase = 'choice';
    $('#wolf-banner').classList.remove('hidden');
    $('#wolf-banner').innerHTML = `<b>En varg är här och vill ta ${esc(target.name)}!</b>
      <div class="wolf-choice"><button class="btn red" id="wolf-shoot">Skjut själv</button><button class="btn blue" id="wolf-dog">Skicka vakthunden</button></div>`;
    $('#wolf-shoot').onclick = e => { e.stopPropagation(); Sound.click(); this.beginHunt(); };
    $('#wolf-dog').onclick = e => { e.stopPropagation(); Sound.click(); this.sendGuard(); };
  },

  beginHunt() {
    const target = this.target();
    if (!target) { this.end(); return; }
    this.w.phase = 'hunt';
    this.w.t = 0;
    $('#garden').classList.add('hunting');
    $('#wolf-banner').classList.remove('hidden');
    this.updateBanner();
  },

  updateBanner() {
    if (!this.w || this.w.phase !== 'hunt') return;
    const target = this.target();
    const left = Math.max(0, Math.ceil(WOLF_TIME - this.w.t));
    $('#wolf-banner').innerHTML = `<b>Vargen jagar ${esc(target ? target.name : '')}! Skjut den genom att trycka på den!</b>
      <div class="wolf-timer ${left <= 10 ? 'low' : ''}">0:${String(left).padStart(2, '0')}</div>`;
  },

  updateHp() {
    const hp = this.w ? this.w.hp : 0;
    $('#wolf .wolf-hp').innerHTML = Array.from({ length: WOLF_HP }, (_, i) => `<i class="${i < hp ? '' : 'gone'}">${uiIcon('heart')}</i>`).join('');
  },

  // ---------- Skjuta ----------

  shoot(e) {
    if (!this.w || this.w.phase !== 'hunt') return;
    if (e.target.closest('#wolf-banner') || e.target.closest('#debug-panel')) return;
    e.stopPropagation();
    Sound.bang();
    const g = $('#garden').getBoundingClientRect();
    this.puff(e.clientX - g.left, e.clientY - g.top);
    const wolfEl = $('#wolf');
    const r = wolfEl.getBoundingClientRect();
    const hit = e.clientX > r.left + r.width * 0.15 && e.clientX < r.right - r.width * 0.15 && e.clientY > r.top + r.height * 0.1 && e.clientY < r.bottom;
    if (!hit) return;
    this.w.hp--;
    this.w.t = Math.max(0, this.w.t - 3);  // vargen backar lite när den träffas
    this.updateHp();
    wolfEl.querySelector('.wolf-svg').outerHTML = wolfSvg('hit');
    setTimeout(() => { if (this.w && this.w.phase === 'hunt') { const s = $('#wolf .wolf-svg'); if (s) s.outerHTML = wolfSvg('run'); } }, 150);
    if (this.w.hp <= 0) this.defeated();
  },

  defeated() {
    this.w.phase = 'ko';
    $('#garden').classList.remove('hunting');
    $('#wolf .wolf-svg').outerHTML = wolfSvg('ko');
    $('#wolf').classList.add('ko');
    $('#wolf-banner').innerHTML = '<b>Träff! Vargen är besegrad. Djuren är räddade!</b>';
    Game.addCoins(25);
    updateHud();
    Sound.win();
    toast('Du räddade djuren från vargen! +25 mynt', 'good');
    setTimeout(() => {
      const r = $('#wolf').getBoundingClientRect();
      const g = $('#garden').getBoundingClientRect();
      this.puff(r.left - g.left + r.width / 2, r.top - g.top + r.height / 2, true);
      this.end();
    }, 1600);
    Game.save();
  },

  // ---------- Vakthunden ----------

  sendGuard() {
    this.w.phase = 'guard';
    this.w.gx = 34; this.w.gy = 52;
    $('#guard-dog').classList.add('running');
    $('#wolf-banner').innerHTML = '<b>Vakthunden springer mot vargen!</b>';
    Sound.tone(500, 0.12, 'square', 0.06); Sound.tone(500, 0.12, 'square', 0.06, 0.2);
  },

  // ---------- Spelloop ----------

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    if (!this.w) return;
    if (currentScreen === 'home') this.step(dt);
    this.render();
    this.raf = requestAnimationFrame(t => this.loop(t));
  },

  step(dt) {
    const w = this.w;
    const target = this.target();
    if (w.phase === 'enter' || w.phase === 'choice') {
      w.x += (w.sx < 50 ? 1 : -1) * dt * 6;  // smyger in lite vid kanten
      w.x = w.sx < 50 ? Math.min(w.x, 6) : Math.max(w.x, 94);
      return;
    }
    if (w.phase === 'hunt') {
      if (!target || target.dead) { this.flee('Vargen gav upp och sprang iväg.'); return; }
      w.t += dt;
      const p = Math.min(1, w.t / WOLF_TIME);
      const bx = w.sx + (target.x - w.sx) * p;
      const by = w.sy + (target.y - w.sy) * p;
      // Sicksack så att den blir svårare att träffa
      w.x = clamp(bx + Math.sin(w.t * 2.3) * 14 * (1 - p), 4, 96);
      w.y = clamp(by + Math.sin(w.t * 3.7) * 8 * (1 - p), 52, 94);
      if (Math.floor(w.t) !== Math.floor(w.t - dt)) this.updateBanner();
      if (w.t >= WOLF_TIME) this.caught(target);
      return;
    }
    if (w.phase === 'guard') {
      const dx = w.x - w.gx, dy = w.y - w.gy;
      const d = Math.hypot(dx, dy);
      if (d < 6) { this.flee('Vakthunden jagade bort vargen! Djuren är räddade.', true); return; }
      w.gx += dx / d * dt * 40;
      w.gy += dy / d * dt * 40;
      return;
    }
    if (w.phase === 'flee') {
      w.x += (w.x < 50 ? -1 : 1) * dt * 60;
      if (w.gx !== undefined) { w.gx += (w.x < 50 ? -1 : 1) * dt * 45; }
      if (w.x < -15 || w.x > 115) this.end();
    }
  },

  render() {
    const w = this.w;
    if (!w) return;
    const el = $('#wolf');
    el.style.left = w.x + '%';
    el.style.top = w.y + '%';
    el.style.zIndex = Math.round(w.y) + 1;
    el.classList.toggle('running', ['hunt', 'flee', 'enter'].includes(w.phase));
    if (w.gx !== undefined && (w.phase === 'guard' || w.phase === 'flee')) {
      const g = $('#guard-dog');
      g.style.left = w.gx + '%';
      g.style.top = w.gy + '%';
      g.style.zIndex = Math.round(w.gy) + 1;
    }
  },

  caught(target) {
    $('#garden').classList.remove('hunting');
    this.w.phase = 'flee';
    Sound.howl();
    Home.die(target, 'varg');
    $('#wolf-banner').innerHTML = `<b>Åh nej! Vargen tog ${esc(target.name)}...</b>`;
    setTimeout(() => $('#wolf-banner').classList.add('hidden'), 2500);
  },

  flee(msg, guard = false) {
    this.w.phase = 'flee';
    $('#garden').classList.remove('hunting');
    $('#wolf-banner').innerHTML = `<b>${esc(msg)}</b>`;
    if (guard) { Game.addCoins(10); updateHud(); Sound.win(); toast(msg + ' +10 mynt', 'good'); }
    setTimeout(() => $('#wolf-banner').classList.add('hidden'), 2500);
  },

  end() {
    cancelAnimationFrame(this.raf);
    this.w = null;
    $('#wolf').classList.add('hidden');
    $('#wolf').classList.remove('ko');
    $('#garden').classList.remove('hunting');
    setTimeout(() => { if (!this.w) $('#wolf-banner').classList.add('hidden'); }, 2500);
    this.renderGuard();
  },

  puff(x, y, big = false) {
    const el = document.createElement('div');
    el.className = 'shot-puff' + (big ? ' big' : '');
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    $('#garden').appendChild(el);
    setTimeout(() => el.remove(), 600);
  },
};
