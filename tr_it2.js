/* Чтение новых итальянских слов (Миры 4–5) русскими буквами по правилам чтения. Ударение ставится только там, где оно написано (à, è, ì, ò, ù):
   для остальных слов его лучше послушать в озвучке. Дополняет IT_TR и IT_TRX из tr_it.js только теми словами, которых там нет. */
(() => {
  const V = 'aeiouàèéìòù', isV = c => !!c && V.includes(c), AC = { 'à': 'а́', 'è': 'э́', 'é': 'е́', 'ì': 'и́', 'ò': 'о́', 'ù': 'у́' };
  const PLAIN = { a: 'а', e: 'е', i: 'и', o: 'о', u: 'у', b: 'б', d: 'д', f: 'ф', l: 'л', m: 'м', n: 'н', p: 'п', r: 'р', s: 'с', t: 'т', v: 'в', z: 'ц', k: 'к', w: 'в', x: 'кс', y: 'и', j: 'дж' };
  const JOT = { а: 'я', о: 'ё', у: 'ю', е: 'е', и: 'и' };
  function read(w) {
    w = w.toLowerCase().normalize('NFC').replace(/[’'`]/g, ''); let out = '';
    for (let i = 0; i < w.length;) {
      const c = w[i], n = w[i + 1], n2 = w[i + 2], soft = x => x === 'e' || x === 'i' || x === 'è' || x === 'é' || x === 'ì';
      if (c === 's' && n === 'c' && soft(n2)) { out += n2 === 'i' && isV(w[i + 3]) ? 'ш' : 'ш'; i += n2 === 'i' && isV(w[i + 3]) ? 3 : 2; continue; }
      if (c === 's' && n === 'c' && n2 === 'h') { out += 'ск'; i += 3; continue; }
      if (c === 'c' && n === 'c' && soft(n2)) { out += 'чч'; i += 2; if (w[i] === 'i' && isV(w[i + 1])) i++; continue; }
      if (c === 'c' && n === 'c' && n2 === 'h') { out += 'кк'; i += 3; continue; }
      if (c === 'c' && n === 'h') { out += 'к'; i += 2; continue; }
      if (c === 'c' && soft(n)) { out += 'ч'; i += 1; if (n === 'i' && isV(n2)) i++; continue; }
      if (c === 'c') { out += 'к'; i++; continue; }
      if (c === 'g' && n === 'g' && soft(n2)) { out += 'ддж'; i += 2; if (w[i] === 'i' && isV(w[i + 1])) i++; continue; }
      if (c === 'g' && n === 'g' && n2 === 'h') { out += 'гг'; i += 3; continue; }
      if (c === 'g' && n === 'h') { out += 'г'; i += 2; continue; }
      if (c === 'g' && n === 'l' && n2 === 'i') { out += isV(w[i + 3]) ? 'ль' : 'ли'; i += isV(w[i + 3]) ? 3 : 3; continue; }
      if (c === 'g' && n === 'n') { out += 'нь'; i += 2; continue; }
      if (c === 'g' && soft(n)) { out += 'дж'; i += 1; if (n === 'i' && isV(n2)) i++; continue; }
      if (c === 'g') { out += 'г'; i++; continue; }
      if (c === 'q' && n === 'u') { out += 'кв'; i += 2; continue; }
      if (c === 'q') { out += 'к'; i++; continue; }
      if (c === 'h') { i++; continue; }
      if (c === 'z' && n === 'z') { out += 'цц'; i += 2; continue; }
      if (AC[c]) { out += AC[c]; i++; continue; }
      if (c === 'i' && isV(n) && i > 0 && !isV(w[i - 1])) { out += 'ь'; const m = PLAIN[n] || n; out += (n === 'a' || n === 'o' || n === 'u') ? m : m; i += 2; continue; }
      out += PLAIN[c] !== undefined ? PLAIN[c] : c; i++;
    }
    return out;
  }
  const ART = { il: 'иль', lo: 'ло', la: 'ла', le: 'ле', gli: 'льи', un: 'ун', una: 'у́на', di: 'ди', da: 'да', e: 'э' };
  const phrase = s => String(s).split(/\s+/).filter(Boolean).map(t => ART[t.toLowerCase()] || read(t)).join(' ');
  if (typeof IT_TR !== 'undefined') Object.keys(IT_WORDS).forEach(id => { if (!IT_TR[id]) IT_TR[id] = phrase(IT_WORDS[id].en); });
  if (typeof IT_TRX !== 'undefined') {
    const add = s => String(s).toLowerCase().replace(/[.,!?;:«»—…()]/g, ' ').split(/\s+/).forEach(t => { const w = t.replace(/’$/, ''); if (w && !IT_TRX[w] && /^[a-zàèéìòù’]+$/.test(w)) IT_TRX[w] = read(w); });
    IT_WORLDS.slice(3).forEach(wd => wd.lessons.forEach(l => { (l.sents || []).forEach(x => add(x.en)); (l.text || []).forEach(x => add(x.en)); (l.gaps || []).forEach(g => { add(g.en); (g.opts || []).forEach(add); }); (l.qs || []).forEach(q => { add(q.en); (q.opts || []).forEach(add); }); }));
    IT_DIALOGS.forEach(d => d.turns.forEach(t => { add(t.en); (t.opts || []).forEach(add); }));
  }
})();
