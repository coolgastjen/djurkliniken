// Behandlingsrummet: välj rätt verktyg och använd det på rätt ställe

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const Treat = {
  a: null,
  isWild: false,
  tool: null,
  wrong: 0,
  prog: 0,
  down: false,
  last: null,
  holdInside: false,
  holdTimer: null,
  finished: false,
  lastScrub: 0,

  setup() {
    $('#toolbar').innerHTML = Object.keys(TOOLS).map(id =>
      `<button class="tool" data-tool="${id}">${toolIcon(id)}<span>${TOOLS[id].replace(/(svamp|fektion|meter|droppar|plockare|glas|kratsa)$/, '&shy;$1')}</span></button>`).join('');
    $('#toolbar').addEventListener('click', e => {
      const b = e.target.closest('.tool');
      if (b) this.selectTool(b.dataset.tool);
    });
    const stage = $('#treat-stage');
    stage.addEventListener('pointerdown', e => this.onDown(e));
    stage.addEventListener('pointermove', e => this.onMove(e));
    stage.addEventListener('pointerup', e => this.onUp(e));
    stage.addEventListener('pointercancel', () => this.onUp());
    window.addEventListener('pointermove', e => this.moveCursor(e));
    window.addEventListener('resize', () => this.placeRing());
    $('#treat-back').addEventListener('click', () => { Sound.click(); show('home'); });
  },

  enter(arg) {
    this.kind = arg === 'wild' ? 'wild' : arg === 'akut' ? 'akut' : 'own';
    this.isWild = this.kind !== 'own';
    this.a = this.kind === 'wild' ? Game.s.wild : this.kind === 'akut' ? Game.s.akut : Game.get(arg);
    this.sew = null;
    $('#sew-layer').innerHTML = '';
    if (!this.a || !this.a.injury || this.a.dead) { setTimeout(() => show('home'), 0); return; }
    const sp = SPECIES[this.a.species];
    $('#treat-title').textContent = this.kind === 'akut' ? `Akut: ${sp.name.toLowerCase()}` : this.isWild ? `Vild patient: ${sp.name.toLowerCase()}` : `${this.a.name} hos veterinären`;
    $('#treat-timer').classList.toggle('hidden', this.kind !== 'akut');
    this.updateTimer();
    this.finished = false;
    this.wrong = 0;
    this.setTool(null);
    this.render();
    this.setMsg('Vad behöver göras först? Välj ett verktyg i lådan.', '');
    requestAnimationFrame(() => this.placeRing());
  },

  updateTimer() {
    if (this.kind !== 'akut' || !this.a) return;
    const t = Math.max(0, Math.ceil(this.a.timeLeft || 0));
    const el = $('#treat-timer');
    el.textContent = `Tid kvar ${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    el.classList.toggle('low', t <= 20);
  },

  clearPatient() {
    if (this.kind === 'akut') Game.s.akut = null;
    else Game.s.wild = null;
  },

  // Minispel: sy ihop såret genom att trycka på prickarna i ordning
  startSew() {
    const t = this.target();
    const st = $('#treat-stage').getBoundingClientRect();
    this.sew = { next: 0, pts: [] };
    let html = '<svg class="sew-lines"><polyline id="sew-line" points=""/></svg>';
    for (let i = 0; i < 5; i++) {
      const x = t.x - st.left + (i - 2) * t.r * 0.42;
      const y = t.y - st.top + (i % 2 ? -1 : 1) * t.r * 0.3;
      html += `<button class="sew-dot" data-i="${i}" style="left:${x}px;top:${y}px">${i + 1}</button>`;
    }
    $('#sew-layer').innerHTML = html;
    $('#target-ring').classList.add('hidden');
    $$('#sew-layer .sew-dot').forEach(d => d.addEventListener('pointerdown', e => { e.stopPropagation(); this.sewTap(+d.dataset.i, d); }));
  },

  sewTap(i, dot) {
    if (!this.sew) return;
    if (i !== this.sew.next) { Sound.bad(); this.setMsg(`Börja med nummer ${this.sew.next + 1}!`, 'bad'); return; }
    Sound.tone(500 + i * 90, 0.1, 'triangle', 0.1);
    dot.classList.add('done');
    this.sew.pts.push(`${parseFloat(dot.style.left)},${parseFloat(dot.style.top)}`);
    $('#sew-line').setAttribute('points', this.sew.pts.join(' '));
    this.sew.next++;
    if (this.sew.next >= 5) {
      setTimeout(() => { $('#sew-layer').innerHTML = ''; this.sew = null; this.completeStep(); }, 350);
    }
  },

  leave() {
    this.sew = null;
    $('#sew-layer').innerHTML = '';
    this.stopHold();
    this.down = false;
    this.setTool(null);
  },

  def() { return INJURIES[this.a.injury.type]; },
  step() { return this.def().steps[this.a.injury.step]; },

  render() {
    const a = this.a;
    const mood = this.finished ? 'joy' : moodFor(a);
    $('#treat-animal').innerHTML = drawAnimal(a, { mood });
    if (this.finished) {
      $('#treat-steps').innerHTML = '';
      return;
    }
    const def = this.def();
    $('#treat-problem').textContent = def.problem(a.name, a.injury.spot);
    $('#treat-steps').innerHTML = def.steps.map((st, i) => {
      const cls = i < a.injury.step ? 'done' : i === a.injury.step ? 'now' : '';
      const inner = i < a.injury.step ? toolIcon(st.tool) : '?';
      return (i ? '<span class="step-arrow">›</span>' : '') + `<div class="step-dot ${cls}">${inner}</div>`;
    }).join('');
  },

  setMsg(text, kind) {
    const m = $('#treat-msg');
    m.textContent = text;
    m.className = kind || '';
  },

  setTool(id) {
    this.tool = id;
    $$('#toolbar .tool').forEach(b => b.classList.toggle('selected', b.dataset.tool === id));
    const c = $('#tool-cursor');
    if (id) c.innerHTML = toolIcon(id);
    c.classList.toggle('hidden', !id);
  },

  selectTool(id) {
    if (this.finished || !this.a) return;
    const step = this.step();
    if (id === step.tool) {
      Sound.click();
      this.setTool(id);
      this.setMsg(`Bra val! ${ACTION_TEXT[step.action]}`, 'action');
      this.placeRing();
      if (step.action === 'sew') this.startSew();
    } else {
      Sound.bad();
      this.setTool(null);
      this.wrong++;
      this.setMsg(`Hmm, ${TOOLS[id].toLowerCase()} behövs inte just nu. Tips: ${step.hint}`, 'bad');
      if (this.wrong >= 2) $(`#toolbar [data-tool="${step.tool}"]`).classList.add('glow');
    }
  },

  // Var på skärmen ska verktyget användas?
  target() {
    const svg = $('#treat-animal svg');
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const sc = r.width / 200;
    const key = this.step().at || this.a.injury.spot;
    let [x, y] = key === 'whole' ? [100, 125] : (SPECIES[this.a.species].spots[key] || [100, 125]);
    const rad = key === 'whole' ? 58 : 30;
    return { x: r.left + x * sc, y: r.top + y * sc, r: rad * sc };
  },

  placeRing() {
    const ring = $('#target-ring');
    if (currentScreen !== 'treat' || this.finished || !this.a || !this.a.injury) { ring.classList.add('hidden'); return; }
    const t = this.target();
    if (!t) return;
    const st = $('#treat-stage').getBoundingClientRect();
    ring.classList.remove('hidden');
    ring.style.left = (t.x - st.left) + 'px';
    ring.style.top = (t.y - st.top) + 'px';
    ring.style.width = ring.style.height = (t.r * 2) + 'px';
  },

  moveCursor(e) {
    if (currentScreen !== 'treat' || !this.tool) return;
    const c = $('#tool-cursor');
    c.style.left = e.clientX + 'px';
    c.style.top = e.clientY + 'px';
  },

  // ---------- Pekare / finger ----------

  onDown(e) {
    if (this.finished || !this.a || !this.a.injury || this.sew) return;
    this.moveCursor(e);
    const t = this.target();
    const p = { x: e.clientX, y: e.clientY };
    const d = dist(p, t);
    if (!this.tool) {
      if (d < t.r * 1.5) { Sound.pop(); this.setMsg('Aj! Välj ett verktyg i lådan först.', 'bad'); }
      return;
    }
    if (d > t.r * 1.2) {
      this.setMsg('Inte där! Använd verktyget där ringen är.', 'bad');
      return;
    }
    $('#treat-stage').setPointerCapture(e.pointerId);
    this.down = true;
    this.last = p;
    this.lastT = performance.now();
    this.prog = 0;
    const step = this.step();
    if (step.action === 'click') { this.completeStep(); return; }
    this.setMsg(ACTION_TEXT[step.action], 'action');
    $('#action-progress').classList.remove('hidden');
    $('#target-ring').classList.add('busy');
    this.updateProgress();
    if (step.action === 'hold') this.startHold();
  },

  onMove(e) {
    if (!this.down) return;
    const t = this.target();
    const p = { x: e.clientX, y: e.clientY };
    const step = this.step();
    if (step.action === 'rub') {
      if (dist(p, t) < t.r * 1.4) {
        this.prog += dist(p, this.last) / (t.r * 12);
        const now = Date.now();
        if (now - this.lastScrub > 90) {
          this.lastScrub = now;
          Sound.scrub();
          if (['tvatt', 'schampo'].includes(step.tool)) this.fx(p.x, p.y, 'bubblefx');
        }
      }
      this.last = p;
    } else if (step.action === 'pull') {
      this.prog = Math.min(1, dist(p, t) / (t.r * 2.6));
    } else if (step.action === 'slowpull') {
      const now = performance.now();
      const speed = dist(p, this.last) / Math.max(1, now - this.lastT);
      this.last = p;
      this.lastT = now;
      if (speed > 1.1 && this.prog > 0.05) {
        this.down = false;
        this.prog = 0;
        this.updateProgress();
        $('#target-ring').classList.remove('busy');
        Sound.bad();
        this.setMsg('Oj, för fort! Den gled tillbaka. Dra långsamt!', 'bad');
        return;
      }
      this.prog = Math.min(1, dist(p, t) / (t.r * 2.2));
    } else if (step.action === 'hold') {
      this.holdInside = dist(p, t) < t.r * 1.4;
    }
    this.updateProgress();
    if (this.prog >= 1) this.completeStep();
  },

  onUp(e) {
    if (!this.down) return;
    if (e && e.type === 'pointerup' && this.step().action === 'pull') {
      this.prog = Math.max(this.prog, Math.min(1, dist({ x: e.clientX, y: e.clientY }, this.target()) / (this.target().r * 2.6)));
      if (this.prog >= 1) { this.completeStep(); return; }
    }
    this.down = false;
    this.stopHold();
    $('#target-ring').classList.remove('busy');
    if (['pull', 'slowpull'].includes(this.step().action) && this.prog < 1) {
      this.prog = 0;
      this.updateProgress();
      this.setMsg('Det sitter fast! Håll kvar och dra längre bort.', 'action');
    }
  },

  startHold() {
    this.holdInside = true;
    this.stopHold();
    this.holdTimer = setInterval(() => {
      if (!this.down || !this.holdInside) return;
      this.prog += 0.055;
      if (Math.random() < 0.3) Sound.tone(600 + this.prog * 600, 0.05, 'sine', 0.04);
      this.updateProgress();
      if (this.prog >= 1) this.completeStep();
    }, 100);
  },

  stopHold() {
    clearInterval(this.holdTimer);
    this.holdTimer = null;
  },

  updateProgress() {
    $('#action-progress i').style.width = Math.min(100, this.prog * 100) + '%';
  },

  // ---------- Steg klart ----------

  completeStep() {
    this.stopHold();
    this.down = false;
    this.prog = 0;
    $('#action-progress').classList.add('hidden');
    $('#target-ring').classList.remove('busy');
    const step = this.step();
    const t = this.target();
    this.sparkles(t.x, t.y);
    this.a.injury.step++;
    this.setTool(null);
    this.wrong = 0;
    $$('#toolbar .tool').forEach(b => b.classList.remove('glow'));
    Sound.good();
    if (this.a.injury.step >= this.def().steps.length) { this.finish(); return; }
    this.render();
    this.setMsg(`${step.done} Vad behövs nu?`, 'good');
    this.placeRing();
    Game.save();
  },

  finish() {
    const a = this.a;
    const def = this.def();
    const spot = a.injury.spot;
    a.injury = null;
    if (def.mark) a.mark = { kind: def.mark, spot: def.mark === 'wing' ? 'wing' : spot, until: Date.now() + def.markTime * 1000 };
    a.needs.joy = clamp(a.needs.joy + 20);
    this.finished = true;
    this.placeRing();
    this.render();
    $('#treat-problem').textContent = `${a.name} mår bra igen!`;
    this.setMsg('Bra jobbat, doktorn!', 'good');
    const reward = this.kind === 'akut' ? 40 + Math.floor((a.timeLeft || 0) / 5) : this.isWild ? 20 : 15;
    if (this.kind === 'akut') { a.saved = true; $('#treat-timer').classList.add('hidden'); }
    Game.addCoins(reward);
    Game.s.stars += this.kind === 'akut' ? 2 : 1;
    Game.s.healed++;
    updateHud();
    Game.save();
    Sound.win();
    confetti();
    setTimeout(() => { if (currentScreen === 'treat') this.celebrate(reward, def); }, 1100);
  },

  celebrate(reward, def) {
    const a = this.a;
    const rewards = `<div class="reward"><span class="pill">${uiIcon('coin')} +${reward}</span><span class="pill">${uiIcon('star')} +${this.kind === 'akut' ? 2 : 1}</span></div>`;
    const markText = def.mark ? `<p>${def.mark === 'plaster' ? 'Plåstret' : 'Bandaget'} får sitta kvar en liten stund.</p>` : '';
    if (!this.isWild) {
      openModal(`<div class="celebrate"><div class="portrait">${drawAnimal(a, { mood: 'joy' })}</div>
        <h2>Hurra! ${esc(a.name)} mår bra igen!</h2>${rewards}${markText}
        <div class="modal-footer"><button class="btn green big" id="cel-ok">Tillbaka till gården</button></div></div>`, true);
      $('#cel-ok').onclick = () => { Sound.click(); show('home'); };
      return;
    }
    const free = Game.freeSlots() > 0;
    openModal(`<div class="celebrate"><div class="portrait">${drawAnimal(a, { mood: 'joy' })}</div>
      <h2>${this.kind === 'akut' ? `Du räddade ${esc(a.name)} i tid!` : `Hurra! ${esc(a.name)} mår bra igen!`}</h2>${rewards}
      <p>Vill du släppa ut den i naturen igen, eller ska den få bo hos dig?</p>
      <div class="modal-footer"><button class="btn blue" id="cel-free">Släpp fri (+10 mynt)</button></div>
      ${free ? `<p class="label" style="margin-top:12px">Eller ge den ett namn och adoptera den:</p>
        <div class="name-row" style="margin:8px auto"><input class="text-input" id="wild-name" maxlength="14" placeholder="Namn..."><button class="icon-btn" id="wild-dice">${uiIcon('dice')}</button></div>
        <div class="modal-footer"><button class="btn green" id="cel-adopt">Adoptera</button></div>`
        : `<p><small>Du har ingen ledig plats för fler djur. Köp fler platser i butiken.</small></p>`}
      </div>`, true);
    $('#cel-free').onclick = () => {
      Game.addCoins(10);
      this.clearPatient();
      Game.save();
      Sound.coin();
      toast(`Hej då! ${a.name} springer glad tillbaka ut i naturen.`, 'good');
      show('home');
    };
    if (free) {
      $('#wild-dice').onclick = () => { Sound.pop(); $('#wild-name').value = pick(NAMES); };
      $('#cel-adopt').onclick = () => {
        const name = $('#wild-name').value.trim();
        if (!name) { Sound.bad(); toast('Skriv ett namn först!', 'alert'); return; }
        const n = Game.makeAnimal(a.species, a.color, name);
        n.mark = a.mark;
        Game.s.animals.push(n);
        this.clearPatient();
        Game.save();
        Sound.win();
        toast(`Välkommen hem, ${name}!`, 'good');
        show('home');
      };
    }
  },

  // ---------- Effekter ----------

  fx(x, y, cls, inner = '') {
    const st = $('#treat-stage').getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'fx ' + cls;
    el.innerHTML = inner;
    el.style.left = (x - st.left) + 'px';
    el.style.top = (y - st.top) + 'px';
    el.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    $('#fx-layer').appendChild(el);
    setTimeout(() => el.remove(), 1100);
  },

  sparkles(x, y) {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => this.fx(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 40, 'star', uiIcon('star')), i * 60);
    }
  },
};
