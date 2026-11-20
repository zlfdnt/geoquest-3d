// ============================================================
//  frac.js — semua pembagian/pecahan ditulis bertumpuk (pembilang di atas, penyebut di bawah, ada garis),
//  mis. r/s, 2πr / 2πs, 22/7, ⅓, ⅔, ½, ⁴⁄₃, serta penanda {atas|bawah} dan ~~coret~~.
//  Berjalan otomatis pada elemen rumus/soal (lihat SEL) dan tersedia sebagai Frac.html(teks).
// ============================================================
(function () {
  const UNI = { '⁴⁄₃': ['4', '3'], '⅓': ['1', '3'], '⅔': ['2', '3'], '½': ['1', '2'], '¼': ['1', '4'], '¾': ['3', '4'], '⅕': ['1', '5'], '⅖': ['2', '5'] };
  const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fr = (n, d) => '<span class="fr"><span class="n">' + n + '</span><span class="d">' + d + '</span></span>';
  function plain(t, noAuto) {
    let h = e(t).replace(/~~(.+?)~~/g, '<s class="cx">$1</s>');
    h = h.replace(/⁴⁄₃|[⅓⅔½¼¾⅕⅖]/g, m => fr(UNI[m][0], UNI[m][1]));
    if (!noAuto) {
      h = h.replace(/(^|[^\w\/.,>])(\d{1,3})\/(\d{1,3})(?![\d\/])/g, (m, p, a, b) => p + fr(a, b));                                   // 22/7, 7/25
      h = h.replace(/(^|[^\w\/>])(\d*[π√A-Za-z][\wπ²³]*)\s?\/\s?(\d*[π√A-Za-z][\wπ²³]*)(?![\w\/<])/g, (m, p, a, b) => p + fr(a, b));      // r/s, 2πr / 2πs
    }
    return h;
  }
  function html(t) {
    t = String(t); let out = '', last = 0, m; const re = /\{([^{}|]+)\|([^{}|]+)\}/g;
    while ((m = re.exec(t))) { out += plain(t.slice(last, m.index)); out += fr(plain(m[1], true), plain(m[2], true)); last = re.lastIndex; }
    return out + plain(t.slice(last));
  }
  const has = (t) => /[⅓⅔½¼¾⅕⅖⁴]|~~|\{[^{}|]+\|[^{}|]+\}|\d{1,3}\/\d{1,3}|[π√A-Za-z][\wπ²³]*\s?\/\s?[π√A-Za-z]/.test(t);
  const plainLen = (t) => String(t).replace(/[{}~]/g, '').replace(/\|/g, ' ').length;
  // ---- pemrosesan DOM otomatis ----
  const SEL = '.mf,.dv-now,.dv-f,.dv-work,.dv-cap,.dv-d,.fm,.fcard,.extra,.formula-panel,.contoh,.steps-l,.q-text,.ot,.prose,.pg-pb,.info-card,.fb,.identitas-tp,.hint-f';
  const SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|svg|foreignObject)$/i;
  let obs = null;
  function node(el) {
    if (!el || el.nodeType !== 1) return;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => { const p = n.parentElement; if (!p || SKIP.test(p.tagName) || p.closest('.fr,svg,textarea')) return NodeFilter.FILTER_REJECT; return has(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } }), list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(n => { const h = html(n.nodeValue); if (h === e(n.nodeValue)) return; const f = document.createRange().createContextualFragment(h); n.parentNode.replaceChild(f, n); });
  }
  function collect(r, els) { if (r.matches && r.matches(SEL)) els.add(r); if (r.querySelectorAll) r.querySelectorAll(SEL).forEach(x => els.add(x)); const c = r.closest && r.closest(SEL); if (c) els.add(c); }
  function start() { if (obs && document.body) obs.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  function run(root) { if (obs) obs.disconnect(); try { const els = new Set(); collect(root, els); els.forEach(node); } finally { start(); } }
  function init() {
    if (!document.body) return;
    obs = new MutationObserver(ms => {
      const roots = new Set(); ms.forEach(m => { if (m.type === 'characterData') { if (m.target.parentElement) roots.add(m.target.parentElement); } else m.addedNodes.forEach(n => { if (n.nodeType === 1) roots.add(n); else if (n.nodeType === 3 && n.parentElement) roots.add(n.parentElement); }); });
      obs.disconnect(); roots.forEach(r => { try { const els = new Set(); collect(r, els); els.forEach(node); } catch (x) {} }); start();
    });
    start(); run(document.body);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.Frac = { html, has, plainLen, run };
})();
