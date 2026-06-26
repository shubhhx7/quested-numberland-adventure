// Web Audio API sound effects — no external asset files required

let _ctx: AudioContext | null = null;
let _enabled = true;

const PREF_KEY = 'quested_sound_enabled';

export function initSoundPreference(): boolean {
  try {
    const stored = localStorage.getItem(PREF_KEY);
    _enabled = stored === null ? true : stored === 'true';
  } catch {
    _enabled = true;
  }
  return _enabled;
}

export function setSoundEnabled(on: boolean): void {
  _enabled = on;
  try { localStorage.setItem(PREF_KEY, String(on)); } catch { /* ignore */ }
}

export function isSoundEnabled(): boolean {
  return _enabled;
}

function getCtx(): AudioContext | null {
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
    return _ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  dur: number,
  vol = 0.28,
  type: OscillatorType = 'sine',
  start = 0,
): void {
  try {
    const ac = getCtx();
    if (!ac || !_enabled) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const t = ac.currentTime + start;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch { /* silent fail */ }
}

export function playClickSound(): void {
  tone(880, 0.07, 0.16, 'sine', 0);
  tone(1100, 0.04, 0.1, 'sine', 0.04);
}

export function playCorrectSound(): void {
  // Rising cheerful chime — C5, E5, G5 then sparkle
  tone(523, 0.18, 0.30, 'sine', 0);
  tone(659, 0.18, 0.30, 'sine', 0.12);
  tone(784, 0.38, 0.35, 'sine', 0.24);
  tone(1047, 0.22, 0.14, 'sine', 0.28);
}

export function playWrongSound(): void {
  // Soft descending "oops" — not harsh or scary
  tone(392, 0.20, 0.20, 'sine', 0);
  tone(349, 0.20, 0.18, 'sine', 0.14);
  tone(294, 0.35, 0.14, 'sine', 0.28);
}

export function playRewardSound(): void {
  // Happy sparkle sequence
  const notes  = [523, 659, 784, 1047, 784, 880, 1047, 1319];
  const starts = [  0, 0.1, 0.2, 0.32, 0.46, 0.56, 0.68, 0.80];
  notes.forEach((f, i) => tone(f, 0.22, 0.22, 'sine', starts[i]));
}

export function playUnlockSound(): void {
  // Magical twinkle upward arpeggio
  const notes = [659, 784, 988, 1319];
  notes.forEach((f, i) => {
    tone(f, 0.28, 0.20, 'sine', i * 0.09);
    tone(f * 2, 0.14, 0.07, 'sine', i * 0.09 + 0.06);
  });
}
