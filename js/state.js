// Speldata: sparas automatiskt i webbläsaren (localStorage)
const SAVE_KEY = 'djurkliniken-spar-v1';
const MAX_SLOTS = 8;

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const Game = {
  s: null,

  fresh() {
    return {
      coins: 30,
      stars: 0,
      slots: 4,
      nextId: 1,
      animals: [],
      wild: null,
      food: { hundgodis: 4, kattmat: 4, morot: 4, ho: 4, apple: 4, fron: 4, mask: 4, notter: 4, sallad: 4 },
      owned: [],
      sound: true,
      healed: 0,
      lastSeen: Date.now(),
      timers: { injury: 50, wild: 25 },
    };
  },

  hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const fresh = this.fresh();
        const data = JSON.parse(raw);
        this.s = Object.assign(fresh, data);
        this.s.food = Object.assign(fresh.food, data.food || {});
        this.s.timers = Object.assign({ injury: 50, wild: 25 }, data.timers || {});
        return true;
      }
    } catch (e) { /* trasig sparfil – börja om */ }
    return false;
  },

  save() {
    if (!this.s) return;
    this.s.lastSeen = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); } catch (e) { /* t.ex. privat läge */ }
  },

  newGame() {
    this.s = this.fresh();
    this.save();
  },

  makeAnimal(species, color, name) {
    return {
      id: this.s.nextId++,
      species, color, name,
      needs: { food: 80, water: 80, joy: 80, clean: 80 },
      injury: null,
      mark: null,
      acc: { head: null, neck: null, face: null },
      x: 15 + Math.random() * 70,
      y: 55 + Math.random() * 35,
    };
  },

  get(id) {
    return this.s.animals.find(a => a.id === id);
  },

  freeSlots() {
    return this.s.slots - this.s.animals.length;
  },

  addCoins(n) {
    this.s.coins += n;
  },

  // Räkna ut hur behoven har sjunkit medan spelet var stängt (snällt: aldrig under 15)
  catchUp() {
    const secs = Math.min((Date.now() - (this.s.lastSeen || Date.now())) / 1000, 3 * 3600);
    if (secs < 5) return;
    for (const a of this.s.animals) {
      for (const k in NEED_RATES) {
        const v = a.needs[k];
        a.needs[k] = Math.max(Math.min(v, 15), v - NEED_RATES[k] * secs * 0.5);
      }
    }
  },
};

// Hur mycket varje behov sjunker per sekund
const NEED_RATES = { food: 0.05, water: 0.07, joy: 0.035, clean: 0.025 };

const NAMES = [
  'Sessan', 'Bamse', 'Nala', 'Molly', 'Simba', 'Kanel', 'Pricken', 'Smulan', 'Doris', 'Totte',
  'Luna', 'Pelle', 'Stella', 'Ludde', 'Fia', 'Musse', 'Tussan', 'Bella', 'Rocky', 'Ronja',
  'Kalle', 'Nugget', 'Pippi', 'Bosse', 'Lakrits', 'Kexet', 'Ville', 'Saga', 'Maja', 'Zorro',
  'Snobben', 'Tingeling', 'Hasse', 'Mimmi', 'Godis', 'Blixten', 'Krumelur', 'Vanilj', 'Polly', 'Elsa',
];
