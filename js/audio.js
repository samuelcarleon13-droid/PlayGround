// Tiny procedural sound engine — no external assets.
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.lastShot = 0;
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
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);

    const len = Math.floor(this.ctx.sampleRate * 0.7);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.02);
    }
  }

  noise({ duration = 0.12, gain = 0.3, type = 'lowpass', freq = 1600, q = 1, sweep = 0, delay = 0 }) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t);
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(80, freq + sweep), t + duration);
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + duration);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + duration + 0.02);
  }

  tone({ freq = 440, endFreq = 0, duration = 0.15, gain = 0.15, type = 'sine', delay = 0 }) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  shoot() {
    const now = performance.now();
    if (now - this.lastShot < 30) return;
    this.lastShot = now;
    this.noise({ duration: 0.09, gain: 0.34, freq: 2400, sweep: -1700, q: 0.7 });
    this.tone({ freq: 150, endFreq: 48, duration: 0.1, gain: 0.28, type: 'square' });
    this.tone({ freq: 720, endFreq: 220, duration: 0.05, gain: 0.06, type: 'sawtooth' });
  }

  knife() {
    this.noise({ duration: 0.16, gain: 0.24, type: 'bandpass', freq: 2800, sweep: -1800, q: 1.6 });
    this.tone({ freq: 1200, endFreq: 420, duration: 0.1, gain: 0.05, type: 'sine' });
  }

  knifeHit() {
    this.noise({ duration: 0.12, gain: 0.32, type: 'bandpass', freq: 900, q: 0.8 });
    this.tone({ freq: 90, endFreq: 40, duration: 0.14, gain: 0.25, type: 'square' });
  }

  hit() {
    this.tone({ freq: 260, endFreq: 120, duration: 0.05, gain: 0.06, type: 'square' });
    this.noise({ duration: 0.05, gain: 0.09, type: 'highpass', freq: 3200 });
  }

  enemyDie() {
    this.noise({ duration: 0.28, gain: 0.22, type: 'lowpass', freq: 900, sweep: -700 });
    this.tone({ freq: 120, endFreq: 55, duration: 0.26, gain: 0.16, type: 'sawtooth' });
  }

  hurt() {
    this.tone({ freq: 180, endFreq: 60, duration: 0.28, gain: 0.22, type: 'sawtooth' });
    this.noise({ duration: 0.2, gain: 0.16, type: 'lowpass', freq: 600 });
  }

  reload() {
    this.noise({ duration: 0.04, gain: 0.15, type: 'highpass', freq: 2600 });
    this.tone({ freq: 420, duration: 0.03, gain: 0.05, type: 'square', delay: 0.03 });
    this.noise({ duration: 0.05, gain: 0.16, type: 'highpass', freq: 1800, delay: 0.72 });
    this.tone({ freq: 640, duration: 0.04, gain: 0.06, type: 'square', delay: 0.8 });
  }

  pickup() {
    this.tone({ freq: 520, endFreq: 820, duration: 0.1, gain: 0.12, type: 'sine' });
    this.tone({ freq: 780, endFreq: 1180, duration: 0.12, gain: 0.1, type: 'sine', delay: 0.08 });
  }

  empty() {
    this.tone({ freq: 320, duration: 0.05, gain: 0.07, type: 'square' });
  }

  explosion() {
    this.noise({ duration: 0.7, gain: 0.5, type: 'lowpass', freq: 900, sweep: -750 });
    this.tone({ freq: 90, endFreq: 28, duration: 0.6, gain: 0.35, type: 'sine' });
  }

  bossRoar() {
    this.tone({ freq: 70, endFreq: 42, duration: 1.1, gain: 0.3, type: 'sawtooth' });
    this.noise({ duration: 1.0, gain: 0.24, type: 'lowpass', freq: 500, sweep: -260 });
  }

  gate() {
    this.noise({ duration: 0.9, gain: 0.25, type: 'lowpass', freq: 500, sweep: -300 });
    this.tone({ freq: 110, endFreq: 70, duration: 0.9, gain: 0.12, type: 'sawtooth' });
  }

  win() {
    const notes = [392, 523, 659, 784];
    notes.forEach((f, i) => this.tone({ freq: f, duration: 0.5, gain: 0.12, type: 'triangle', delay: i * 0.16 }));
  }

  gameOver() {
    this.tone({ freq: 220, endFreq: 110, duration: 1.2, gain: 0.18, type: 'sawtooth' });
    this.tone({ freq: 110, endFreq: 55, duration: 1.4, gain: 0.14, type: 'sine' });
  }

  uiClick() {
    this.tone({ freq: 620, endFreq: 420, duration: 0.06, gain: 0.07, type: 'square' });
  }
}
