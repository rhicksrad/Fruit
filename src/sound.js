let audioCtx;
let enabled = true;

function ensureCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

export function setSoundEnabled(isEnabled) {
  enabled = !!isEnabled;
}

function beep({ freq = 440, dur = 0.1, type = 'sine', gain = 0.04 } = {}) {
  if (!enabled) return;
  ensureCtx();
  try { if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); } catch {}
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  osc.start(t);
  osc.stop(t + dur);
}

export function sClick() { beep({ freq: 560, dur: 0.05, type: 'square', gain: 0.03 }); }
export function sSpin() { beep({ freq: 240, dur: 0.08, type: 'sawtooth', gain: 0.035 }); }
export function sHold() { beep({ freq: 320, dur: 0.09, type: 'triangle', gain: 0.03 }); }
export function sWin() {
  if (!enabled) return;
  ensureCtx();
  const now = audioCtx.currentTime;
  [660, 880, 990].forEach((f, i) => setTimeout(() => beep({ freq: f, dur: 0.12, type: 'square', gain: 0.05 }), i * 110));
}
export function sLose() { beep({ freq: 180, dur: 0.12, type: 'sine', gain: 0.03 }); }

export function primeSound() {
  try {
    ensureCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {}
}


