// Gården: djuren går runt, behov sjunker, skador händer och man sköter om djuren

const NEED_INFO = {
  food: { name: 'Mat', icon: 'food' },
  water: { name: 'Vatten', icon: 'water' },
  joy: { name: 'Glädje', icon: 'heart' },
  clean: { name: 'Renhet', icon: 'clean' },
};

// Bestämd form, används som namn på vilda patienter
const SPECIES_DEF = {
  hund: 'Hunden', katt: 'Katten', kanin: 'Kaninen', marsvin: 'Marsvinet',
  hast: 'Hästen', fagel: 'Fågeln', igelkott: 'Igelkotten', gris: 'Grisen', ko: 'Kon', get: 'Geten',
  anka: 'Ankan', skoldpadda: 'Sköldpaddan', rav: 'Räven', ekorre: 'Ekorren', hamster: 'Hamstern',
};

// Hur länge ett djur klarar sig (sekunder i spelet)
const DEATH_STARVE = 90;     // helt slut på mat eller vatten
const INJURY_WARN = 300;     // varning för obehandlad skada
const INJURY_DEATH = 480;    // obehandlad skada
const REVIVE_PRICE = 50;

const Home = {
  els: {},          // id -> DOM-element för varje djur i trädgården
  joyUntil: {},     // id -> tidpunkt då "jätteglad"-minen slutar
  cardId: null,
  cardSub: null,    // 'food' | 'acc' | null

  setup() {
    $('#wild-door').addEventListener('click', () => { Sound.click(); show('treat', 'wild'); });
    if (location.search.includes('test')) this.setupDebug();
  },

  enter() {
    this.renderGraves();
    this.renderPets(true);
    this.renderWild();
  },

  // ---------- Djuren i trädgården ----------

  petMood(a) {
    if ((this.joyUntil[a.id] || 0) > Date.now()) return 'joy';
    return moodFor(a);
  },

  visualKey(a, mood) {
    return JSON.stringify([mood, a.color, a.injury, a.mark && a.mark.kind, a.acc]);
  },

  renderPets(force = false) {
    const wrap = $('#garden-animals');
    const s = Game.s;
    $('#empty-hint').classList.toggle('hidden', s.animals.length > 0);
    const ids = new Set(s.animals.map(a => a.id));
    for (const id in this.els) {
      if (!ids.has(+id)) { this.els[id].remove(); delete this.els[id]; }
    }
    for (const a of s.animals) {
      let el = this.els[a.id];
      if (!el) {
        el = document.createElement('div');
        el.className = 'pet';
        el.innerHTML = `<div class="bubble hidden"></div><div class="pet-svg"></div><div class="nametag"></div>`;
        el.style.left = a.x + '%';
        el.style.top = a.y + '%';
        el.addEventListener('click', () => { Sound.pop(); this.openCard(a.id); });
        wrap.appendChild(el);
        this.els[a.id] = el;
      }
      const mood = this.petMood(a);
      const key = this.visualKey(a, mood);
      if (force || el.dataset.key !== key) {
        el.dataset.key = key;
        el.querySelector('.pet-svg').innerHTML = drawAnimal(a, { mood });
      }
      el.querySelector('.nametag').textContent = a.name;
      el.style.zIndex = Math.round(a.y);
      el.classList.toggle('limping', !!a.injury && !a.dead);
      el.classList.toggle('dead', !!a.dead);
      this.renderBubble(a, el.querySelector('.bubble'));
    }
  },

  // Gravarna efter begravda djur ligger kvar på gården
  renderGraves() {
    const graves = Game.s.graves || [];
    $('#garden-graves').innerHTML = graves.map((g, i) =>
      `<div class="grave" data-i="${i}" style="left:${g.x}%;top:${g.y}%;z-index:${Math.round(g.y)}"><div class="nametag">${esc(g.name)}</div>${graveSvg()}</div>`).join('');
    $$('#garden-graves .grave').forEach(el => el.addEventListener('click', () => {
      const g = graves[+el.dataset.i];
      Sound.click();
      toast(`Här vilar ${g.name}, en ${SPECIES[g.species].name.toLowerCase()}.`);
    }));
  },

  renderBubble(a, b) {
    let kind = null;
    if (a.dead) kind = null;
    else if (a.danger > 0 || (a.injury && a.injury.age >= INJURY_WARN)) kind = 'danger';
    else if (a.injury) kind = 'alert';
    else {
      const low = Object.keys(NEED_INFO).filter(k => a.needs[k] < 30).sort((x, y) => a.needs[x] - a.needs[y])[0];
      if (low) kind = low;
    }
    if (b.dataset.kind === (kind || '')) return;
    b.dataset.kind = kind || '';
    b.classList.toggle('hidden', !kind);
    b.classList.toggle('alert', kind === 'alert' || kind === 'danger');
    if (kind === 'danger') b.innerHTML = uiIcon('skull');
    else if (kind === 'alert') b.innerHTML = uiIcon('cross');
    else if (kind) b.innerHTML = uiIcon(NEED_INFO[kind].icon);
  },

  wander() {
    for (const a of Game.s.animals) {
      const el = this.els[a.id];
      if (!el || a.dead || Math.random() > (a.injury ? 0.08 : 0.3)) continue;
      const nx = clamp(a.x + (Math.random() - 0.5) * (a.injury ? 10 : 34), 8, 92);
      const ny = clamp(a.y + (Math.random() - 0.5) * 18, 55, 94);
      a.x = nx; a.y = ny;
      el.style.left = nx + '%';
      el.style.top = ny + '%';
      el.style.zIndex = Math.round(ny);
      if (!a.injury) {
        el.classList.add('walking');
        clearTimeout(el._walk);
        el._walk = setTimeout(() => el.classList.remove('walking'), 4000);
      }
    }
  },

  // ---------- Vilda patienter ----------

  renderWild() {
    const w = Game.s.wild;
    const door = $('#wild-door');
    door.classList.toggle('hidden', !w);
    if (!w) return;
    const sp = SPECIES[w.species];
    door.innerHTML = `<div class="mini">${drawAnimal(w, { mood: moodFor(w), still: true })}</div>
      <div>En skadad ${sp.name.toLowerCase()} väntar i väntrummet!<small>Tryck här för att hjälpa den</small></div>`;
  },

  spawnWild() {
    const species = Math.random() < 0.6 ? pick(['igelkott', 'fagel', 'rav', 'ekorre', 'anka', 'skoldpadda']) : pick(SPECIES_ORDER);
    const color = Math.floor(Math.random() * SPECIES[species].colors.length);
    Game.s.wild = {
      id: -1, wild: true, species, color, name: SPECIES_DEF[species],
      needs: { food: 60, water: 60, joy: 40, clean: 60 },
      injury: makeInjury(species), mark: null, acc: { head: null, neck: null, face: null },
    };
    Sound.alert();
    toast(`Knack knack! Någon har hittat en skadad ${SPECIES[species].name.toLowerCase()} och kommit med den till kliniken.`, 'alert');
    this.renderWild();
  },

  // ---------- Tiden går ----------

  tick(dt) {
    const s = Game.s;
    for (const a of s.animals) {
      if (a.dead) continue;
      for (const k in NEED_RATES) {
        let rate = NEED_RATES[k];
        if (k === 'joy' && a.injury) rate *= 2;
        a.needs[k] = clamp(a.needs[k] - rate * dt);
      }
      if (a.mark && a.mark.until < Date.now()) a.mark = null;
      this.checkDanger(a, dt);
    }

    if (currentScreen !== 'home') return;
    s.timers.injury -= dt;
    s.timers.wild -= dt;
    if (s.timers.injury <= 0) {
      s.timers.injury = 70 + Math.random() * 80;
      this.randomInjury();
    }
    if (s.timers.wild <= 0) {
      s.timers.wild = 100 + Math.random() * 100;
      if (!s.wild) this.spawnWild();
    }
    if (Math.random() < 0.35) this.wander();
    this.renderPets();
    if (this.cardId) this.refreshMeters();
  },

  // Svält, törst och obehandlade skador kan till slut döda djuret
  checkDanger(a, dt) {
    const hungry = a.needs.food <= 0;
    if (hungry || a.needs.water <= 0) {
      a.danger = (a.danger || 0) + dt;
      if (!a.warned) {
        a.warned = true;
        Sound.alert();
        toast(hungry ? `${a.name} svälter! Ge mat snabbt, annars dör djuret.` : `${a.name} är jättetörstig! Ge vatten snabbt, annars dör djuret.`, 'alert');
      }
      if (a.danger >= DEATH_STARVE) { this.die(a, hungry ? 'svalt' : 'torst'); return; }
    } else {
      a.danger = 0;
      a.warned = false;
    }
    if (a.injury && !(currentScreen === 'treat' && Treat.a === a)) {
      a.injury.age = (a.injury.age || 0) + dt;
      if (a.injury.age >= INJURY_WARN && !a.injury.warned) {
        a.injury.warned = true;
        Sound.alert();
        toast(`${a.name} har haft ont länge. Hjälp djuret på kliniken snabbt!`, 'alert');
      }
      if (a.injury.age >= INJURY_DEATH) this.die(a, 'skada');
    }
  },

  die(a, cause) {
    a.dead = { cause };
    a.injury = null;
    a.mark = null;
    a.danger = 0;
    Sound.sad();
    toast(`${a.name} har dött...`, 'alert');
    const busy = (currentScreen === 'treat' && Treat.a === a) || (currentScreen === 'play' && Play.a === a) || (currentScreen === 'walk' && Walk.a === a);
    if (busy) show('home');
    this.renderPets();
    if (this.cardId === a.id) this.renderCard();
    Game.save();
  },

  randomInjury(forceType) {
    const s = Game.s;
    const injured = s.animals.filter(a => a.injury).length;
    const healthy = s.animals.filter(a => !a.injury && !a.dead);
    if (!healthy.length) return;
    if (!forceType && (injured >= 2 || Math.random() > 0.55)) return;
    const a = pick(healthy);
    let type = forceType;
    if (!type) {
      // Djur som inte sköts om blir lättare sjuka
      const options = injuriesFor(a.species);
      if (a.needs.clean < 25 && options.includes('loppor')) type = 'loppor';
      else if (a.needs.food < 15 || a.needs.water < 15) type = 'feber';
    }
    this.injure(a, type);
  },

  injure(a, type) {
    a.injury = makeInjury(a.species, type);
    a.mark = null;
    Sound.alert();
    toast(INJURIES[a.injury.type].event(a.name), 'alert');
    this.renderPets();
    if (this.cardId === a.id) this.renderCard();
  },

  // ---------- Djurkortet ----------

  openCard(id) {
    this.cardId = id;
    this.cardSub = null;
    openModal('<div id="card"></div>');
    this.cardId = id;
    this.renderCard();
  },

  renderCard(says) {
    const a = Game.get(this.cardId);
    if (!a) { closeModal(); return; }
    const sp = SPECIES[a.species];
    if (a.dead) { this.renderDeadCard(a, sp, says); return; }
    const mood = this.petMood(a);
    const meters = Object.keys(NEED_INFO).map(k =>
      `<div class="meter" title="${NEED_INFO[k].name}"><span class="m-ico">${uiIcon(NEED_INFO[k].icon)}</span><div class="bar"><i data-need="${k}"></i></div></div>`).join('');
    const hurt = !!a.injury;
    const btn = (act, ico, label, dis = false) =>
      `<button class="care-btn" data-act="${act}" ${dis ? 'disabled' : ''}>${ico}${label}</button>`;
    $('#card').innerHTML = `
      <div class="card-head">
        <div class="card-portrait">${drawAnimal(a, { mood })}${says ? `<div class="says">${esc(says)}</div>` : ''}</div>
        <div>
          <h2>${esc(a.name)} <button class="icon-btn" data-act="rename" title="Byt namn">${uiIcon('pencil')}</button></h2>
          <p>${sp.name} · ${sp.colors[a.color].name}</p>
        </div>
      </div>
      ${hurt ? `<div class="injury-alert"><p>${esc(INJURIES[a.injury.type].problem(a.name, a.injury.spot))}</p>
        <button class="btn red" data-act="treat">${uiIcon('cross')} Till behandlingsrummet</button></div>` : ''}
      <div class="meters">${meters}</div>
      <div class="care-actions">
        ${btn('food', uiIcon('food'), 'Mata')}
        ${btn('water', uiIcon('water'), 'Vatten')}
        ${btn('cuddle', uiIcon('heart'), 'Gosa')}
        ${btn('play', uiIcon('ball'), 'Apport', hurt)}
        ${a.species === 'hast' ? btn('walk', uiIcon('horseshoe'), 'Rida', hurt) : btn('walk', uiIcon('leash'), 'Promenad', hurt)}
        ${btn('wash', uiIcon('brush'), 'Bada')}
        ${btn('acc', uiIcon('bow'), 'Klä ut')}
      </div>
      <div class="card-sub" id="card-sub"></div>
      <div class="modal-footer"><button class="btn white" data-act="close">Stäng</button></div>`;
    this.refreshMeters();
    this.renderSub();
    $$('#card [data-act]').forEach(el => el.addEventListener('click', () => this.action(el.dataset.act)));
  },

  renderDeadCard(a, sp, confirmBury) {
    const cause = { svalt: 'svalt ihjäl', torst: 'dog av törst', skada: 'dog av sin skada' }[a.dead.cause] || 'har dött';
    $('#card').innerHTML = `
      <div class="card-head">
        <div class="card-portrait">${drawAnimal(a)}</div>
        <div><h2>Här vilar ${esc(a.name)}</h2><p>${sp.name} · ${esc(a.name)} ${cause}.</p></div>
      </div>
      <p class="dead-note">Djur dör om de inte får mat, vatten eller vård i tid. Med mirakelmedicin kan du väcka ${esc(a.name)} till liv igen. Om du begraver djuret blir platsen ledig för ett nytt.</p>
      ${confirmBury === 'bury' ? `<div class="injury-alert"><p>Vill du begrava ${esc(a.name)}? Det går inte att ångra.</p>
        <div class="modal-footer" style="margin:0"><button class="btn white" data-act="bury-no">Nej</button><button class="btn red" data-act="bury-yes">Ja, begrav</button></div></div>` : ''}
      <div class="modal-footer">
        <button class="btn green" data-act="revive" ${Game.s.coins < REVIVE_PRICE ? 'disabled' : ''}>Mirakelmedicin · ${uiIcon('coin')} ${REVIVE_PRICE}</button>
        <button class="btn white" data-act="bury">Begrav</button>
        <button class="btn white" data-act="close">Stäng</button>
      </div>`;
    $$('#card [data-act]').forEach(el => el.addEventListener('click', () => this.action(el.dataset.act)));
  },

  refreshMeters() {
    const a = Game.get(this.cardId);
    if (!a) return;
    $$('#card .bar i').forEach(i => {
      const v = a.needs[i.dataset.need];
      i.style.width = Math.max(4, v) + '%';
      i.className = v < 25 ? 'low' : v < 55 ? 'mid' : '';
    });
  },

  renderSub() {
    const box = $('#card-sub');
    const a = Game.get(this.cardId);
    if (!box || !a) return;
    if (this.cardSub === 'food') {
      box.innerHTML = `<div class="picker"><p class="picker-title">Vad vill du ge ${esc(a.name)}?</p>` +
        Object.keys(FOODS).map(f => `<button class="pick-item" data-food="${f}" ${Game.s.food[f] > 0 ? '' : 'disabled'}>${foodIcon(f)}${FOODS[f].name}<span>${Game.s.food[f]} st</span></button>`).join('') +
        `</div>`;
      $$('#card-sub [data-food]').forEach(el => el.addEventListener('click', () => this.feed(el.dataset.food)));
    } else if (this.cardSub === 'acc') {
      const owned = Game.s.owned;
      if (!owned.length) {
        box.innerHTML = `<div class="picker"><p class="picker-title">Du har inga tillbehör än. Köp hattar, rosetter och mer i butiken!</p><button class="btn" data-go2="shop">Till butiken</button></div>`;
        box.querySelector('[data-go2]').addEventListener('click', () => show('shop'));
        return;
      }
      box.innerHTML = `<div class="picker"><p class="picker-title">Tryck för att ta på eller av</p>` +
        owned.map(id => {
          const on = a.acc[ACCESSORIES[id].slot] === id;
          return `<button class="pick-item ${on ? 'on' : ''}" data-acc="${id}">${accessoryIcon(id)}${ACCESSORIES[id].name}</button>`;
        }).join('') + `</div>`;
      $$('#card-sub [data-acc]').forEach(el => el.addEventListener('click', () => this.wear(el.dataset.acc)));
    } else {
      box.innerHTML = '';
    }
  },

  joy(a, says) {
    this.joyUntil[a.id] = Date.now() + 1800;
    this.renderCard(says);
    this.renderPets();
    setTimeout(() => { if (this.cardId === a.id) this.renderCard(); this.renderPets(); }, 1900);
  },

  action(act) {
    const a = Game.get(this.cardId);
    if (!a) return;
    const n = a.needs;
    switch (act) {
      case 'close': Sound.click(); closeModal(); return;
      case 'bury': Sound.click(); this.renderDeadCard(a, SPECIES[a.species], 'bury'); return;
      case 'bury-no': Sound.click(); this.renderCard(); return;
      case 'bury-yes':
        Game.s.animals = Game.s.animals.filter(x => x !== a);
        if (!Game.s.graves) Game.s.graves = [];
        Game.s.graves.push({ name: a.name, species: a.species, x: a.x, y: a.y });
        if (Game.s.graves.length > 30) Game.s.graves.shift();
        this.renderGraves();
        Game.save();
        Sound.sad();
        toast(`Hej då, ${a.name}. Vila i frid.`);
        closeModal();
        this.renderPets();
        return;
      case 'revive':
        if (Game.s.coins < REVIVE_PRICE) { Sound.bad(); toast('Du har inte tillräckligt med mynt.', 'alert'); return; }
        Game.s.coins -= REVIVE_PRICE;
        a.dead = null;
        a.needs = { food: 60, water: 60, joy: 60, clean: 60 };
        updateHud();
        Sound.win();
        confetti();
        toast(`Mirakel! ${a.name} lever igen!`, 'good');
        Game.save();
        this.joy(a, SPECIES[a.species].says);
        return;
      case 'treat': Sound.click(); show('treat', a.id); return;
      case 'rename': this.rename(a); return;
      case 'food':
      case 'acc':
        Sound.click();
        this.cardSub = this.cardSub === act ? null : act;
        this.renderSub();
        return;
      case 'water':
        if (n.water > 92) { this.renderCard(`${a.name} är inte törstig.`); return; }
        n.water = clamp(n.water + 45);
        Sound.pop();
        this.joy(a, 'Slurp slurp!');
        break;
      case 'cuddle':
        n.joy = clamp(n.joy + 25);
        Sound.happy();
        this.joy(a, SPECIES[a.species].says);
        this.hearts();
        break;
      case 'play':
        if (n.food < 15 || n.water < 15) { Sound.bad(); this.renderCard(`${a.name} är för hungrig och törstig för att leka.`); return; }
        Sound.click();
        show('play', a.id);
        return;
      case 'walk':
        if (n.food < 15 || n.water < 15) { Sound.bad(); this.renderCard(`${a.name} är för hungrig och törstig för att gå ut.`); return; }
        Sound.click();
        show('walk', a.id);
        return;
      case 'wash':
        if (n.clean > 92) { this.renderCard(`${a.name} är redan ren!`); return; }
        n.clean = 100;
        Sound.pop();
        if (a.species === 'katt') {
          n.joy = clamp(n.joy - 5);
          this.renderCard('Mjau! Katter tycker inte om bad...');
        } else {
          this.joy(a, 'Skinande ren!');
        }
        break;
    }
    Game.save();
  },

  feed(food) {
    const a = Game.get(this.cardId);
    if (!a || Game.s.food[food] <= 0) return;
    if (!FOODS[food].likes.includes(a.species)) {
      Sound.bad();
      this.cardSub = 'food';
      this.renderCard(`${a.name} vill inte ha ${FOODS[food].name.toLowerCase()}. Prova något annat!`);
      return;
    }
    if (a.needs.food > 92) { this.renderCard(`${a.name} är mätt!`); return; }
    Game.s.food[food]--;
    a.needs.food = clamp(a.needs.food + 40);
    a.needs.joy = clamp(a.needs.joy + 5);
    Sound.happy();
    this.cardSub = null;
    this.joy(a, 'Mums mums!');
    Game.save();
  },

  wear(id) {
    const a = Game.get(this.cardId);
    const slot = ACCESSORIES[id].slot;
    a.acc[slot] = a.acc[slot] === id ? null : id;
    Sound.pop();
    this.renderCard();
    this.renderPets();
    Game.save();
  },

  rename(a) {
    Sound.click();
    openModal(`<div class="celebrate"><h2 style="color:var(--ink)">Nytt namn</h2>
      <div class="name-row" style="margin:12px auto"><input class="text-input" id="rename-input" maxlength="14" value="${esc(a.name)}"></div>
      <div class="modal-footer"><button class="btn white" id="rn-cancel">Avbryt</button><button class="btn green" id="rn-ok">Spara</button></div></div>`, true);
    const input = $('#rename-input');
    input.focus();
    input.select();
    const done = ok => {
      const v = input.value.trim();
      if (ok && v) { a.name = v; Game.save(); Sound.good(); }
      this.renderPets();
      this.openCard(a.id);
    };
    $('#rn-cancel').onclick = () => done(false);
    $('#rn-ok').onclick = () => done(true);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') done(true); });
  },

  hearts() {
    const p = $('.card-portrait');
    if (!p) return;
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('div');
      h.className = 'fx';
      h.innerHTML = uiIcon('heart');
      h.style.left = (30 + Math.random() * 70) + 'px';
      h.style.top = (50 + Math.random() * 40) + 'px';
      h.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      h.style.animationDelay = (i * 0.12) + 's';
      p.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  },

  // ---------- Testpanel (öppna index.html?test) ----------

  setupDebug() {
    const p = $('#debug-panel');
    p.classList.remove('hidden');
    p.style.cssText = 'position:absolute;left:8px;bottom:8px;z-index:200;background:#fff;border:2px solid #333;border-radius:10px;padding:6px;display:flex;flex-wrap:wrap;gap:4px;max-width:340px;font-size:12px';
    const types = Object.keys(INJURIES);
    p.innerHTML = '<b style="width:100%">Test: skada första djuret</b>' +
      types.map(t => `<button data-t="${t}">${t}</button>`).join('') +
      '<button data-x="wild">vild patient</button><button data-x="coins">+100 mynt</button><button data-x="low">behov låga</button><button data-x="die">dö</button><button data-x="dieall">döda alla</button>';
    p.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const a = Game.s.animals[0];
      if (b.dataset.t) {
        if (!a) return toast('Skaffa ett djur först');
        if (!injuriesFor(a.species).includes(b.dataset.t)) return toast(`${b.dataset.t} passar inte för ${a.species}`);
        this.injure(a, b.dataset.t);
      }
      if (b.dataset.x === 'wild') { Game.s.wild = null; this.spawnWild(); }
      if (b.dataset.x === 'coins') { Game.addCoins(100); updateHud(); }
      if (b.dataset.x === 'die' && a) this.die(a, 'svalt');
      if (b.dataset.x === 'dieall') Game.s.animals.filter(x => !x.dead).forEach(x => this.die(x, 'svalt'));
      if (b.dataset.x === 'low') Game.s.animals.forEach(x => Object.keys(x.needs).forEach(k => { x.needs[k] = 20; }));
    });
  },
};
