/* Запасные картинки для пиктограмм (эмодзи). На старых компьютерах, где нет цветного шрифта эмодзи или он старый (новые значки превращаются в квадратики),
   игра сама находит такие значки и заменяет их картинками из папки emoji/ (Twemoji, CC BY 4.0, лежат в проекте — интернет не нужен).
   На современных устройствах ничего не меняется. Режим можно задать вручную: localStorage 'engAdventure_emoji' = 'on' (всегда картинки) / 'off' (никогда); в игре — «Родителям → Настройки». */
(() => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  let mode = 'auto'; try { mode = localStorage.getItem('engAdventure_emoji') || 'auto'; } catch (e) {}
  if (mode === 'off' || !document.createTreeWalker || !window.MutationObserver) return;
  let RE;
  try { RE = new RegExp('(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)\\p{Emoji_Modifier}?(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F?)\\p{Emoji_Modifier}?)*)', 'gu'); } catch (e) {
    try { RE = new RegExp('(?:[\\u{1F1E6}-\\u{1F1FF}]{2}|[#*0-9]\\uFE0F?\\u20E3|[\\u{1F000}-\\u{1FAFF}\\u2190-\\u21FF\\u2300-\\u23FF\\u2460-\\u24FF\\u25A0-\\u27BF\\u2900-\\u297F\\u2B00-\\u2BFF](?:\\uFE0F)?[\\u{1F3FB}-\\u{1F3FF}]?(?:\\u200D[\\u{1F000}-\\u{1FAFF}\\u2600-\\u27BF\\u2B00-\\u2BFF]\\uFE0F?)*)', 'gu'); } catch (e2) { return; }
  }
  const cv = document.createElement('canvas'); cv.width = cv.height = 36;
  const cx = cv.getContext && cv.getContext('2d'), cache = {};
  // есть ли у значка цвет: если шрифта нет, рисуется чёрно-белый значок или квадратик без цветных пикселей
  const colored = e => {
    if (!cx) return true;
    try {
      cx.clearRect(0, 0, 36, 36); cx.font = '24px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif'; cx.textBaseline = 'top'; cx.fillText(e, 2, 4);
      const d = cx.getImageData(0, 0, 36, 36).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40 && Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 30) n++;
      return n > 8;
    } catch (err) { return true; }
  };
  const bad = e => mode === 'on' || (e in cache ? cache[e] : (cache[e] = !colored(e)));
  const code = s => { const cps = Array.from(s).map(c => c.codePointAt(0).toString(16)); return (s.indexOf('‍') >= 0 ? cps : cps.filter(c => c !== 'fe0f')).join('-'); };
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, TITLE: 1, NOSCRIPT: 1, CANVAS: 1 };
  let busy = false;
  function fixNode(root) {
    if (!root) return;
    const out = [], tw = document.createTreeWalker(root.nodeType === 3 ? root.parentNode : root, 4, null, false);
    let n; while ((n = tw.nextNode())) { const p = n.parentNode; if (p && !SKIP[p.nodeName] && !(p.className && String(p.className).indexOf('emo') === 0) && n.data) { RE.lastIndex = 0; if (RE.test(n.data)) out.push(n); } }
    out.forEach(t => {
      const s = t.data, frag = document.createDocumentFragment(); let last = 0, changed = false; RE.lastIndex = 0; let m;
      while ((m = RE.exec(s))) {
        if (!bad(m[0])) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        const img = document.createElement('img'); img.className = 'emo'; img.alt = m[0]; img.draggable = false; img.src = 'emoji/' + code(m[0]) + '.svg'; img.onerror = function () { this.replaceWith(document.createTextNode(this.alt)); };
        frag.appendChild(img); last = m.index + m[0].length; changed = true;
      }
      if (!changed) return;
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      if (t.parentNode) t.parentNode.replaceChild(frag, t);
    });
  }
  const obs = new MutationObserver(recs => {
    if (busy) return; busy = true;
    try { recs.forEach(r => { if (r.type === 'characterData') fixNode(r.target); else r.addedNodes.forEach(n => { if (n.nodeType === 1 || n.nodeType === 3) fixNode(n); }); }); } finally { obs.takeRecords(); busy = false; }
  });
  const start = () => { fixNode(document.body); obs.observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
