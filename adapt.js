/* Адаптация игры под успеваемость: читает данные дневника (оценки, задания, замечания) и подсказывает игре,
   какому предмету и каким темам уделить внимание. Чистая логика без DOM: легко проверить тестами (tests/adapt.test.js). */
const ADAPT = (() => {
  const SUBJ = [[/матем/i, 'math'], [/англ/i, 'eng']];
  const gameSubject = name => { for (const [re, k] of SUBJ) if (re.test(String(name || ''))) return k; return null; };
  const TEST_RE = /контрольн|диктант|тест|проверочн|самостоятельн|зач[её]т|олимпиад/i;
  // слова из записей родителя -> темы математики в игре
  const MATH_KW = [
    [/умножен|таблиц/i, ['mul', 'mulA', 'mulsum']], [/деление с остатк|остат/i, ['rem']], [/делен/i, ['div', 'divA']],
    [/уравнен/i, ['eq']], [/скобк|порядок действ/i, ['order', 'brackets']], [/периметр|площад|фигур|геометр/i, ['geom', 'geo1']],
    [/задач/i, ['word', 'word1']], [/дол[ьяи]|дроб/i, ['frac']], [/сравнен/i, ['cmp', 'cmp20', 'cmp100']],
    [/величин|длин|масс|врем|час|санти|дециметр/i, ['units', 'len1']],
    [/сложен|вычитан|сумм|разност|столбик/i, ['add100', 'sub100', 'add20', 'sub20', 'add10', 'sub10', 'addsub1000']],
    [/числ|нумерац|разряд|сотн|десят/i, ['place', 'place100', 'count10', 'tens20']], [/закономерн/i, ['pattern']]
  ];
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10 : null;

  function mathGensFromText(text) {
    const out = new Set();
    MATH_KW.forEach(([re, gens]) => { if (re.test(text || '')) gens.forEach(g => out.add(g)); });
    return [...out];
  }

  // результат: { math: {...}, eng: {...} } — по каждому предмету игры
  function analyze(school, childId, today) {
    const subjName = id => ((school.subjects || []).find(s => s.id === id) || {}).name || '';
    const out = {};
    ['math', 'eng'].forEach(k => { out[k] = { focus: 0, reasons: [], avg: null, trend: null, topics: [], exams: [] }; });
    const mine = list => (school[list] || []).filter(x => x.childId === childId);
    const grades = mine('grades'), tasks = mine('tasks'), remarks = mine('remarks');
    const since30 = addDays(today, -30), since14 = addDays(today, -14);
    Object.keys(out).forEach(k => {
      const o = out[k], inSubj = x => gameSubject(subjName(x.subjectId)) === k;
      const g30 = grades.filter(g => inSubj(g) && g.date >= since30 && g.date <= today).sort((a, b) => a.date < b.date ? -1 : 1);
      const vals = g30.map(g => g.value);
      o.avg = avg(vals);
      if (vals.length >= 4) { const h = Math.floor(vals.length / 2); o.trend = Math.round((avg(vals.slice(h)) - avg(vals.slice(0, h))) * 10) / 10; }
      const low = g30.filter(g => g.value <= 3 && g.date >= since14);
      if (o.avg !== null && o.avg < 3.5) { o.focus = 2; o.reasons.push(`средний балл ${o.avg}`); }
      else if (o.avg !== null && o.avg < 4) { o.focus = 1; o.reasons.push(`средний балл ${o.avg}`); }
      if (low.length) { o.focus = Math.max(o.focus, low.length >= 2 ? 2 : 1); o.reasons.push(`оценки 3 и ниже: ${low.length}`); }
      if (o.trend !== null && o.trend <= -1) { o.focus = Math.max(o.focus, 1); o.reasons.push('оценки падают'); }
      const neg = remarks.filter(r => inSubj(r) && r.type === 'negative' && r.date >= since14);
      if (neg.length >= 2) { o.focus = Math.max(o.focus, 1); o.reasons.push(`замечаний: ${neg.length}`); }
      // темы: то, что не сдано/не проверено, замечания и комментарии к плохим оценкам
      const texts = [];
      tasks.filter(t => inSubj(t) && t.status !== 'checked' && t.due >= addDays(today, -21)).forEach(t => texts.push(t.text));
      neg.forEach(r => texts.push(r.text));
      g30.filter(g => g.value <= 3 && g.comment).forEach(g => texts.push(g.comment));
      o.topics = texts.filter(Boolean);
      // контрольные и диктанты впереди
      tasks.filter(t => inSubj(t) && t.status !== 'checked' && TEST_RE.test(t.text || '') && t.due >= today && t.due <= addDays(today, 10))
        .forEach(t => o.exams.push({ date: t.due, days: dayDiff(today, t.due), text: t.text }));
      o.exams.sort((a, b) => a.days - b.days);
    });
    return out;
  }

  // проверенные родителем задания, за которые ещё не выдана награда
  function homeworkToPay(school, childId, paid, today) {
    const since = addDays(today, -30);
    return (school.tasks || []).filter(t => t.childId === childId && t.status === 'checked' && !(paid || {})[t.id] && (t.due || '') >= since);
  }

  // сводка игры для дневника
  function summary(st, today, mtName) {
    const week = { min: 0, q: 0, ok: 0 }, since = addDays(today, -6);
    Object.keys(st.log || {}).forEach(d => { if (d >= since && d <= today) { const x = st.log[d]; week.min += Math.round((x.sec || 0) / 60); week.q += x.q || 0; week.ok += x.ok || 0; } });
    const topics = {};
    Object.keys(st.mt || {}).forEach(k => {
      const r = st.mt[k]; if (!r || !r.seen) return;
      const g = k.slice(0, -1), t = topics[g] || (topics[g] = { name: (mtName || {})[g] || g, seen: 0, miss: 0 });
      t.seen += r.seen; t.miss += r.miss || 0;
    });
    const math = Object.values(topics).map(t => ({ name: t.name, acc: Math.round(100 * (t.seen - t.miss) / t.seen), n: t.seen })).sort((a, b) => a.acc - b.acc);
    return { name: st.name, week, math, doneLessons: Object.keys(st.lessons || {}).filter(k => st.lessons[k].done).length, updated: today };
  }

  return { gameSubject, analyze, mathGensFromText, homeworkToPay, summary, TEST_RE };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = ADAPT;
