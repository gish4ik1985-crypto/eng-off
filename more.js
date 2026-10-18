/* По 50 новых уроков в каждом предмете: уроки-закрепления. Берут темы и слова уже изученных уроков того же мира и перемешивают их
   (по 2–3 темы в одном уроке), а к концу списка задания становятся сложнее. Все уроки бонусные и идут в конец мира;
   босс мира открывается только после того, как пройдены ВСЕ уроки. Номера (id) существующих уроков не менялись. */
(() => {
  const ICONS = ['🔁', '🧠', '⚡', '🎯', '🏅', '🔥', '🚀', '💡'];
  const short = t => (String(t).length > 22 ? String(t).slice(0, 21) + '…' : String(t));
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const split = (total, parts) => Array.from({ length: parts }, (_, i) => Math.floor(total / parts) + (i < total % parts ? 1 : 0));

  // предметы, где задания генерируются: новые уроки смешивают темы существующих
  function mixGens(worlds, idStart) {
    let id = idStart;
    split(50, worlds.length).forEach((cnt, wi) => {
      const w = worlds[wi], src = w.lessons.filter(l => l.type === 'math' && l.gens && l.gens.length && l.rule);
      if (!src.length) return;
      for (let k = 0; k < cnt; k++) {
        const a = src[(k * 2) % src.length], b = src[(k * 2 + 1) % src.length], pick = [a, b];
        if (k % 3 === 2) pick.push(src[(k * 2 + 3) % src.length]);
        const bump = k >= cnt * .66 ? 2 : k >= cnt * .33 ? 1 : 0, seen = new Set(), gens = [];
        pick.forEach(l => l.gens.forEach(([g, lv]) => { if (!seen.has(g)) { seen.add(g); gens.push([g, Math.min(3, lv + bump)]); } }));
        const titles = pick.map(l => short(l.title)).filter((t, i, arr) => arr.indexOf(t) === i);
        w.lessons.push({
          id: id++, icon: ICONS[k % ICONS.length], title: `Закрепление ${k + 1}: ${titles.slice(0, 2).join(' + ')}`,
          story: `Повторяем вместе: ${titles.map(t => '«' + t + '»').join(', ')}. Так знания закрепляются лучше.${bump ? ' Задания теперь сложнее!' : ''}`,
          type: 'math', rule: a.rule, gens, bonus: true
        });
      }
    });
  }
  // языки: новые уроки собирают слова из соседних уроков мира
  function mixWords(worlds, idStart) {
    let id = idStart;
    split(50, worlds.length).forEach((cnt, wi) => {
      const w = worlds[wi], src = w.lessons.filter(l => !l.type && l.words && l.words.length >= 3);
      if (src.length < 2) return;
      for (let k = 0; k < cnt; k++) {
        const pick = [src[(k * 3) % src.length], src[(k * 3 + 1) % src.length], src[(k * 3 + 2) % src.length]], words = [];
        pick.forEach((l, i) => { for (let j = 0; j < 3; j++) { const x = l.words[(j + k + i) % l.words.length]; if (!words.includes(x)) words.push(x); } });
        const titles = pick.map(l => short(l.title)).filter((t, i, arr) => arr.indexOf(t) === i);
        w.lessons.push({ id: id++, title: `Повторение ${k + 1}: ${titles.slice(0, 2).join(' · ')}`, icon: ICONS[k % ICONS.length], words: words.slice(0, 8), story: 'Слова из нескольких уроков вперемешку: так они запоминаются крепче.', bonus: true });
      }
    });
  }
  mixGens(MWORLDS, 31001); mixGens(RWORLDS, 32001); mixGens(OWORLDS, 33001); mixGens(IWORLDS, 34001);
  mixGens(PWORLDS, 35001); mixGens(LWORLDS, 36001); mixGens(GWORLDS, 37001);
  mixWords(EN_PACK.WORLDS, 38001); mixWords(IT_PACK.WORLDS, 39001);
})();
