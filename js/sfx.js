// ============================================================
//  sfx.js — efek suara sintetis (WebAudio, tanpa file). Satu "keluarga" nada (pentatonik C mayor,
//  gelombang lembut) sehingga setiap fungsi tombol punya bunyi berbeda namun tetap serasi.
// ============================================================
(function () {
  let ctx = null, master = null, on = localStorage.getItem('gq_sfx') !== 'off', last = 0;
  const N = { C4: 261.63, E4: 329.63, G4: 392, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5 };
  function ensure() {
    if (!ctx) { try { const AC = window.AudioContext || window.webkitAudioContext; ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.55; const c = ctx.createDynamicsCompressor(); master.connect(c); c.connect(ctx.destination); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx;
  }
  function tone(f, t, d, o) {
    o = o || {}; const osc = ctx.createOscillator(), g = ctx.createGain(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
    const v = o.v || 0.2; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.a || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g); g.connect(master); osc.start(t); osc.stop(t + d + 0.03);
  }
  function swoosh(t, d, f0, f1, v) {
    const len = Math.ceil(ctx.sampleRate * d), buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.2; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || 0.35, t + d * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(bp); bp.connect(g); g.connect(master); s.start(t); s.stop(t + d);
  }
  const arp = (t, notes, gap, o) => notes.forEach((n, i) => tone(N[n] || n, t + i * gap, (o && o.d) || 0.22, Object.assign({ type: 'triangle', v: 0.16 }, o)));
  const S = {
    tap: t => tone(N.A5, t, 0.07, { v: 0.14 }),
    tab: t => arp(t, ['E5', 'G5'], 0.055, { d: 0.12, v: 0.13 }),
    nav: t => tone(N.D5, t, 0.05, { type: 'triangle', v: 0.14 }),
    next: t => arp(t, ['G5', 'C6'], 0.05, { d: 0.1, v: 0.13 }),
    prev: t => arp(t, ['C6', 'G5'], 0.05, { d: 0.1, v: 0.13 }),
    select: t => tone(520, t, 0.09, { to: 980, v: 0.17 }),
    pluck: (t, i) => tone([N.C5, N.D5, N.E5, N.G5, N.A5, N.C6][(i || 0) % 6], t, 0.28, { type: 'triangle', v: 0.2 }),
    primary: t => arp(t, ['C5', 'E5', 'G5'], 0.06, { d: 0.18 }),
    confirm: t => { tone(N.G5, t, 0.3, { v: 0.13 }); tone(N.C6, t, 0.3, { v: 0.12 }); tone(N.E6, t + 0.05, 0.3, { v: 0.08 }); },
    start: t => { swoosh(t, 0.35, 400, 2400, 0.22); tone(N.C6, t + 0.28, 0.3, { type: 'triangle', v: 0.16 }); },
    success: t => arp(t, ['C5', 'E5', 'G5', 'C6'], 0.075, { d: 0.26 }),
    unlock: t => arp(t, ['G5', 'C6', 'E6'], 0.07, { d: 0.22, v: 0.14 }),
    lock: t => arp(t, ['C6', 'G5', 'C5'], 0.08, { d: 0.2, v: 0.13 }),
    check: t => { tone(N.E5, t, 0.16, { v: 0.16 }); tone(N.G5, t + 0.09, 0.2, { v: 0.14 }); },
    correct: t => arp(t, ['C5', 'E5', 'G5', 'C6'], 0.07, { d: 0.3, v: 0.18 }),
    wrong: t => { tone(N.E4, t, 0.22, { type: 'triangle', v: 0.2, to: 300 }); tone(N.C4, t + 0.16, 0.34, { type: 'triangle', v: 0.2, to: 220 }); },
    fold: t => { swoosh(t, 0.7, 2600, 380, 0.3); tone(170, t + 0.55, 0.22, { v: 0.22, to: 110 }); },
    unfold: t => { tone(150, t, 0.12, { v: 0.14 }); swoosh(t + 0.05, 0.7, 380, 2600, 0.3); },
    spin: t => { for (let i = 0; i < 6; i++) tone(300 + i * 90, t + i * 0.09, 0.16, { type: 'triangle', v: 0.11, to: 360 + i * 110 }); },
    reset: t => { tone(N.G5, t, 0.12, { v: 0.14, to: N.C5 }); tone(N.C5, t + 0.1, 0.18, { v: 0.12 }); },
    pop: t => tone(420, t, 0.1, { to: 720, v: 0.15 }),
    pop2: t => tone(640, t, 0.09, { to: 380, v: 0.13 }),
    ping: t => tone(N.C6, t, 0.25, { v: 0.12 }),
    step: (t, i) => tone([N.C5, N.D5, N.E5, N.G5, N.A5, N.C6, N.E6][(i || 0) % 7], t, 0.3, { type: 'triangle', v: 0.14 }),
    export: t => { swoosh(t, 0.22, 3000, 900, 0.22); tone(N.G5, t + 0.2, 0.18, { v: 0.12 }); },
    wa: t => { tone(N.G5, t, 0.09, { v: 0.15 }); tone(N.C6, t + 0.1, 0.16, { v: 0.15 }); }
  };
  const IDS = { 'l-spin': 'spin', 'l-reset': 'reset', 'k-cek': 'check', 'uji-cek': 'check', 'g-next': 'next', 'k-next': 'next', 'k-prev': 'prev', 'x-next': 'next', 'x-prev': 'prev', 'x-sub': 'confirm', 'u-start': 'start', 'x-rg': 'tap', 'v-back': 'unlock', 'lb': 'unlock', 'dv-p': 'prev', 'dv-x': 'next', 't-x': 'export', 't-p': 'export', 'g-pdf': 'export', 'p-save': 'success', 'f-save': 'success', 'wa-fab': 'wa', 'sfx-btn': 'tap' };
  const ACTS = { yt: 'start', login: 'unlock', logout: 'lock', tandai: 'success', mulai: 'start', menu: 'tap', tamu: 'tap', 'dv-play': 'start' };
  function resolve(el) {
    const e = el.closest('[data-sfx],button,a,[role=tab],.opt,.g-opt,[data-go],[data-act],label.ragu'); if (!e || e.disabled) return null;
    if (e.dataset.sfx) return [e.dataset.sfx === 'none' ? null : e.dataset.sfx];
    if (e.id && e.id === 'l-fold') return null;
    if (IDS[e.id]) return [IDS[e.id]];
    if (e.dataset.act && ACTS[e.dataset.act]) return [ACTS[e.dataset.act]];
    if (e.closest('.q-nav')) return ['nav'];
    if (e.classList.contains('opt') || e.classList.contains('g-opt')) return ['select'];
    if (e.dataset.p || e.dataset.pola !== undefined) return ['pluck', Array.from(e.parentNode.children).indexOf(e)];
    if (e.classList.contains('chip-btn') || e.classList.contains('tab') || e.closest('.pillnav,#mobnav,.g-side nav,.ex-tabs')) return ['tab'];
    if (e.matches('.btn-primary,.btn-white,.btn-glass')) return ['primary'];
    if (e.matches('.btn-teal')) return ['success'];
    if (e.matches('.btn-navy')) return ['confirm'];
    if (e.matches('.btn')) return ['tap'];
    if (e.matches('[data-go]')) return ['nav'];
    return e.matches('button,a') ? ['tap'] : null;
  }
  const Sfx = {
    get on() { return on; },
    play(name, arg) {
      if (!on || (window.FX && FX.exam) || !S[name]) return; const now = Date.now(); if (now - last < 35 && name !== 'correct' && name !== 'wrong') return; last = now;
      if (!ensure()) return; try { S[name](ctx.currentTime + 0.005, arg); } catch (e) {}
    },
    toggle() { on = !on; localStorage.setItem('gq_sfx', on ? 'on' : 'off'); if (on) { ensure(); S.ping(ctx.currentTime); } const b = document.getElementById('sfx-btn'); if (b) { b.textContent = on ? '🔊' : '🔇'; b.title = on ? 'Matikan suara' : 'Nyalakan suara'; } return on; },
    ctx: () => ensure()
  };
  document.addEventListener('click', e => { const r = resolve(e.target); if (r && r[0]) Sfx.play(r[0], r[1]); }, true);
  window.Sfx = Sfx;
})();
