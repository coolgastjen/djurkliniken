// Butiken: mat, tillbehör och fler djurplatser

const SLOT_PRICE = 60;

const Shop = {
  tab: 'mat',

  setup() {
    $('#shop-tabs').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      Sound.click();
      this.tab = b.dataset.tab;
      this.render();
    });
  },

  enter() {
    this.render();
  },

  price(n) {
    return `<span class="price">${uiIcon('coin')} ${n}</span>`;
  },

  render() {
    $$('#shop-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === this.tab));
    const s = Game.s;
    let html = '';
    if (this.tab === 'mat') {
      html = Object.keys(FOODS).map(f => {
        const who = FOODS[f].likes.map(sp => SPECIES[sp].name.toLowerCase()).join(', ');
        return `<div class="shop-item">${foodIcon(f)}<h3>${FOODS[f].name}</h3>
          <p>Gillas av: ${who}</p><p>Du har: <b>${s.food[f]}</b></p>
          <button class="btn green" data-buy-food="${f}" ${s.coins < FOOD_PRICE ? 'disabled' : ''}>Köp 3 · ${this.price(FOOD_PRICE)}</button></div>`;
      }).join('');
    } else if (this.tab === 'tillbehor') {
      html = Object.keys(ACCESSORIES).map(id => {
        const acc = ACCESSORIES[id];
        const owned = s.owned.includes(id);
        return `<div class="shop-item">${accessoryIcon(id)}<h3>${acc.name}</h3>
          ${owned ? '<p><b>Köpt!</b> Klä ut ditt djur på djurkortet.</p>'
            : `<button class="btn green" data-buy-acc="${id}" ${s.coins < acc.price ? 'disabled' : ''}>Köp · ${this.price(acc.price)}</button>`}</div>`;
      }).join('');
    } else {
      const full = s.slots >= MAX_SLOTS;
      html = `<div class="shop-item">${uiIcon('home')}<h3>En plats till</h3>
        <p>Du har ${s.slots} platser och ${s.animals.length} djur.</p>
        ${full ? '<p><b>Du har maximalt antal platser!</b></p>'
          : `<button class="btn green" id="buy-slot" ${s.coins < SLOT_PRICE ? 'disabled' : ''}>Köp · ${this.price(SLOT_PRICE)}</button>`}</div>
        <div class="shop-item">${drawAnimal({ id: 77, species: 'hund', color: 2, acc: { head: null, neck: 'halsband', face: null } }, { mood: 'happy', still: true })}<h3>Vakthund</h3>
          <p>Jagar bort vargen när den kommer. Du får välja om du vill skjuta själv eller skicka hunden.</p>
          ${s.guardDog ? '<p><b>Köpt!</b> Vakthunden vaktar gården.</p>'
            : `<button class="btn green" id="buy-guard" ${s.coins < GUARD_PRICE ? 'disabled' : ''}>Köp · ${this.price(GUARD_PRICE)}</button>`}</div>
        <div class="shop-item">${uiIcon('coin')}<h3>Tjäna mynt</h3><p>Du får mynt varje gång du hjälper ett skadat djur. Vilda patienter ger extra!</p></div>`;
    }
    $('#shop-grid').innerHTML = html;

    $$('[data-buy-food]').forEach(b => b.addEventListener('click', () => this.buy(FOOD_PRICE, () => { s.food[b.dataset.buyFood] += 3; })));
    $$('[data-buy-acc]').forEach(b => b.addEventListener('click', () => this.buy(ACCESSORIES[b.dataset.buyAcc].price, () => { s.owned.push(b.dataset.buyAcc); })));
    const slot = $('#buy-slot');
    if (slot) slot.addEventListener('click', () => this.buy(SLOT_PRICE, () => { s.slots++; }));
    const guard = $('#buy-guard');
    if (guard) guard.addEventListener('click', () => this.buy(GUARD_PRICE, () => { s.guardDog = true; }));
  },

  buy(cost, give) {
    if (Game.s.coins < cost) { Sound.bad(); toast('Du har inte tillräckligt med mynt.', 'alert'); return; }
    Game.s.coins -= cost;
    give();
    Sound.coin();
    Game.save();
    updateHud();
    this.render();
  },
};
