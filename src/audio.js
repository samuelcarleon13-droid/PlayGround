/* Audio procedural con WebAudio — sin archivos externos. */
export class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.noise = null;
    this.ambience = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.7;
    this.master.connect(this.ctx.destination);

    const len = Math.floor(this.ctx.sampleRate * 1.2);
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buffer;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.7, this.ctx.currentTime, 0.05);
  }

  noiseBurst({ dur = 0.2, gain = 0.3, freq = 3000, endFreq = 400, type = 'lowpass', when = 0 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, endFreq), t + dur);
    filter.Q.value = type === 'bandpass' ? 2.2 : 0.9;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  tone({ freq = 120, endFreq = 50, dur = 0.2, gain = 0.25, type = 'sine', when = 0 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  shoot(id) {
    switch (id) {
      case 'pistol':
        this.noiseBurst({ dur: 0.13, gain: 0.3, freq: 5200, endFreq: 700 });
        this.tone({ freq: 160, endFreq: 55, dur: 0.13, gain: 0.27 });
        break;
      case 'rifle':
        this.noiseBurst({ dur: 0.1, gain: 0.26, freq: 4200, endFreq: 500 });
        this.tone({ freq: 130, endFreq: 45, dur: 0.12, gain: 0.25 });
        break;
      case 'shotgun':
        this.noiseBurst({ dur: 0.34, gain: 0.42, freq: 2500, endFreq: 220 });
        this.tone({ freq: 95, endFreq: 32, dur: 0.3, gain: 0.4 });
        this.noiseBurst({ dur: 0.09, gain: 0.2, freq: 7000, endFreq: 2200, when: 0.01 });
        break;
      case 'sniper':
        this.noiseBurst({ dur: 0.5, gain: 0.4, freq: 6500, endFreq: 180 });
        this.tone({ freq: 150, endFreq: 30, dur: 0.4, gain: 0.38 });
        this.tone({ freq: 2200, endFreq: 400, dur: 0.09, gain: 0.09, type: 'triangle' });
        break;
    }
  }

  enemyShoot(type) {
    const sniper = type === 'sniper' || type === 'boss';
    this.noiseBurst({ dur: sniper ? 0.22 : 0.09, gain: sniper ? 0.16 : 0.09, freq: sniper ? 4000 : 2600, endFreq: 420 });
    if (sniper) this.tone({ freq: 900, endFreq: 220, dur: 0.16, gain: 0.05, type: 'triangle' });
  }

  hit(head = false) {
    if (head) {
      this.tone({ freq: 1750, endFreq: 1650, dur: 0.08, gain: 0.16, type: 'triangle' });
      this.tone({ freq: 2600, endFreq: 2300, dur: 0.06, gain: 0.09, type: 'sine', when: 0.02 });
    } else {
      this.tone({ freq: 1150, endFreq: 900, dur: 0.05, gain: 0.1, type: 'square' });
    }
  }

  kill() {
    this.tone({ freq: 320, endFreq: 130, dur: 0.16, gain: 0.07, type: 'triangle' });
  }

  hurt() {
    this.noiseBurst({ dur: 0.22, gain: 0.24, freq: 900, endFreq: 120 });
    this.tone({ freq: 90, endFreq: 42, dur: 0.22, gain: 0.2 });
  }

  reload(stage = 0) {
    if (stage === 0) {
      this.noiseBurst({ dur: 0.05, gain: 0.12, freq: 2200, endFreq: 1400, type: 'bandpass' });
      this.tone({ freq: 240, endFreq: 170, dur: 0.05, gain: 0.05, type: 'square' });
    } else {
      this.noiseBurst({ dur: 0.06, gain: 0.14, freq: 3000, endFreq: 1800, type: 'bandpass' });
      this.tone({ freq: 180, endFreq: 120, dur: 0.08, gain: 0.07, type: 'square' });
    }
  }

  empty() {
    this.tone({ freq: 900, endFreq: 500, dur: 0.03, gain: 0.07, type: 'square' });
  }

  explosion() {
    this.noiseBurst({ dur: 0.85, gain: 0.55, freq: 1800, endFreq: 90 });
    this.tone({ freq: 70, endFreq: 24, dur: 0.9, gain: 0.5 });
    this.noiseBurst({ dur: 0.3, gain: 0.3, freq: 6000, endFreq: 900, when: 0.01 });
  }

  pickup(kind) {
    const base = kind === 'health' ? 520 : 380;
    this.tone({ freq: base, endFreq: base * 1.5, dur: 0.09, gain: 0.1, type: 'triangle' });
    this.tone({ freq: base * 1.5, endFreq: base * 2, dur: 0.12, gain: 0.08, type: 'triangle', when: 0.07 });
  }

  levelUp() {
    [440, 660, 880, 1180].forEach((f, i) => this.tone({ freq: f, endFreq: f, dur: 0.16, gain: 0.08, type: 'triangle', when: i * 0.08 }));
  }

  success() {
    [330, 440, 550, 660, 880].forEach((f, i) => this.tone({ freq: f, endFreq: f, dur: 0.3, gain: 0.07, type: 'sine', when: i * 0.12 }));
  }

  fail() {
    [300, 220, 150, 90].forEach((f, i) => this.tone({ freq: f, endFreq: f * 0.7, dur: 0.4, gain: 0.09, type: 'sawtooth', when: i * 0.18 }));
  }

  ui() {
    this.tone({ freq: 700, endFreq: 1000, dur: 0.045, gain: 0.05, type: 'square' });
  }

  startAmbience() {
    if (!this.ctx || this.ambience) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    const g = this.ctx.createGain();
    g.gain.value = 0.0;
    g.gain.setTargetAtTime(0.05, this.ctx.currentTime, 1.5);
    src.connect(filter).connect(g).connect(this.master);
    src.start();
    this.ambience = { src, g, filter };
  }

  stopAmbience() {
    if (!this.ambience) return;
    const a = this.ambience;
    this.ambience = null;
    try {
      a.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      a.src.stop(this.ctx.currentTime + 0.8);
    } catch (e) { /* noop */ }
  }
}
