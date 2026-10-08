// Enkla ljudeffekter med WebAudio – inga ljudfiler behövs
const Sound = {
  ctx: null,
  enabled: true,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  tone(freq, dur, type = 'sine', vol = 0.12, delay = 0, freqEnd = null) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },

  click() { this.tone(700, 0.07, 'triangle', 0.08); },
  good() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.12, i * 0.08)); },
  win() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.12, i * 0.11)); },
  bad() { this.tone(330, 0.3, 'sawtooth', 0.04, 0, 200); },
  coin() { this.tone(988, 0.08, 'square', 0.05); this.tone(1319, 0.2, 'square', 0.05, 0.08); },
  pop() { this.tone(400, 0.08, 'sine', 0.1, 0, 900); },
  alert() { [880, 660, 880].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.1, i * 0.15)); },
  happy() { this.tone(500, 0.15, 'sine', 0.1, 0, 1000); this.tone(600, 0.15, 'sine', 0.1, 0.15, 1200); },
  scrub() { this.tone(180 + Math.random() * 260, 0.05, 'triangle', 0.03); },
};
