/* Адаптация игры под успеваемость: читает данные дневника (оценки, задания, замечания) и подсказывает игре,
   какому предмету и каким темам уделить внимание. Чистая логика без DOM: легко проверить тестами (tests/adapt.test.js). */
const ADAPT = (() => {
  const SUBJ = [[/матем/i, 'math'], [/англ/i, 'eng'], [/русск/i, 'ru'], [/окружающ/i, 'ow'], [/(^|[^а-яё])изо([^а-яё]|$)|рисован|изобразит|художеств/i, 'izo']];
  const gameSubject = name => { for (const [re, k] of SUBJ) if (re.test(String(name || ''))) return k; return null; };
  const TEST_RE = /контрольн|диктант|тест|проверочн|самостоятельн|зач[её]т|олимпиад/i;
  // слова из записей родителя -> темы математики в игре
  const MATH_KW = [
    [/доли|дол[яьи]|дроб|числител|знаменател/i, ['m_fracpic', 'm_fraccmp', 'm_fracwhole']],
    [/деньги|рубл|монет|сдач|стоимост/i, ['m_money']], [/смекалк|логическ/i, ['m_logic']], [/циферблат|(^|[^а-яё])часы([^а-яё]|$)|который час/i, ['m_clock']],
    [/умножен|таблиц/i, ['mul', 'mulA', 'mulsum', 'mulbig']], [/деление с остатк|остат/i, ['rem', 'remB']], [/делен/i, ['div', 'divA', 'divbig', 'divtwo']],
    [/уравнен/i, ['eq', 'eq4']], [/скобк|порядок действ/i, ['order', 'brackets', 'order4']], [/периметр|площад|фигур|геометр/i, ['geom', 'geo1', 'area4']],
    [/задач/i, ['word', 'word1', 'word4']], [/дол[ьяи]|дроб/i, ['frac', 'frac4']], [/сравнен/i, ['cmp', 'cmp20', 'cmp100']],
    [/величин|длин|масс|врем|час|санти|дециметр/i, ['units', 'len1', 'units4']],
    [/сложен|вычитан|сумм|разност|столбик/i, ['add100', 'sub100', 'add20', 'sub20', 'add10', 'sub10', 'addsub1000', 'addbig', 'subbig']],
    [/числ|нумерац|разряд|сотн|десят|тысяч|миллион|многозначн/i, ['place', 'place100', 'count10', 'tens20', 'big']], [/закономерн/i, ['pattern']], [/скорост|движен/i, ['speed']], [/(^|[^а-яё])(угол|угл)|градус/i, ['angle']]
  ];
  // слова из записей родителя -> темы русского языка в игре
  const RU_KW = [
    [/безударн|проверяем/i, ['r_unstress']], [/парн|звонк|глух/i, ['r_voiced']], [/(^|[^а-яё])(жи|ши|ча|ща|чу|щу)([^а-яё]|$)/i, ['r_zhi']],
    [/ударени/i, ['r_stress']], [/слог|перенос/i, ['r_vowel']], [/заглавн|больш\S* букв/i, ['r_cap']], [/алфавит/i, ['r_alpha']],
    [/гласн|согласн|звук/i, ['r_vowel']], [/предложени|знак препинан|точк/i, ['r_punct', 'r_comma']], [/разделительн|мягк\S* знак|твёрд\S* знак|ь и ъ/i, ['r_sepsoft']],
    [/предлог|приставк/i, ['r_prep', 'r_morph']], [/част[иь] реч|существительн|прилагательн|глагол|наречи|местоимен/i, ['r_parts']],
    [/состав слова|корен|суффикс|окончани|однокорен/i, ['r_morph', 'r_oneroot']], [/падеж/i, ['r_cases', 'r_caseend']], [/врем\S* глагол|глагол\S* врем/i, ['r_verbtime']],
    [/тся|ться/i, ['r_tsya']], [/словарн/i, ['r_dict', 'r_dw3']], [/пропущенн\S* букв|вставь\S* букв|пропуск\S* букв/i, ['r_gl1', 'r_gl2', 'r_gl3']], [/диктант|списыван/i, ['r_dw1', 'r_dw2', 'r_dw3', 'r_gap1', 'r_gap2']], [/склонен/i, ['r_decl', 'r_caseend']], [/спряжен/i, ['r_conj', 'r_persend']],
    [/запят|однородн/i, ['r_comma']], [/подлежащ|сказуем|член\S* предложен|главн\S* член/i, ['r_sentparts']]
  ];
  // слова из записей родителя -> темы ИЗО в игре
  const IZO_KW = [
    [/лини|штрих/i, ['i_line']], [/цвет|краск|смешива/i, ['i_primary', 'i_mix', 'i_warm']], [/фигур|форм/i, ['i_shape']], [/композиц|перспектив|ближе|дальше|горизонт/i, ['i_compos']],
    [/жанр|пейзаж|портрет|натюрморт/i, ['i_genre']], [/художник|картин|репродукц/i, ['i_artist']], [/материал|акварел|гуаш|кист|карандаш/i, ['i_tools']],
    [/симметр/i, ['i_symm']], [/светотен|тень|оттенк|(^|[^а-яё])тон([^а-яё]|$)/i, ['i_tone', 'i_light']]
  ];
  // слова из записей родителя -> темы окружающего мира в игре
  const OW_KW = [
    [/сезон|времена года|месяц|календар|недел|сутк/i, ['o_season', 'o_calendar']], [/живая|неживая|природ/i, ['o_nature']], [/животн|зверь|звери|птиц|рыб|насеком|земноводн|пресмыкающ/i, ['o_animals']],
    [/растен|дерев|кустарник|трав|корень|стебел|цветок|плод/i, ['o_plants']], [/человек|орган|здоров|тело|зубы|гигиен|режим дня/i, ['o_body']],
    [/безопасн|светофор|пожар|экстренн|переход/i, ['o_safety']], [/росси|родин|москв|флаг|герб|гимн|конституц|символ/i, ['o_russia']],
    [/вода|водяной|лёд|круговорот|испарен/i, ['o_water']], [/воздух|почв|ископаем|нефть|уголь|глина/i, ['o_earth']],
    [/космос|планет|солнечн|спутник|гагарин|галактик/i, ['o_space']], [/природн\S* зон|тундр|тайг|степь|пустын|арктик/i, ['o_zones']],
    [/эконом|деньги|бюджет|рубл|доход|расход|товар/i, ['o_econ']], [/стран|столиц|европ/i, ['o_countries']], [/золот\S* кольц|суздал|ярославл|кострома/i, ['o_golden']],
    [/материк|океан|евразия|африка|антарктид/i, ['o_world']], [/истори|битв|князь|война|пётр|кутузов|куликов/i, ['o_history']],
    [/карт|глобус|компас|масштаб|горизонт|ориентирован/i, ['o_map']]
  ];
  // слова из записей родителя -> уроки английского (по названиям уроков и словам в них)
  const ENG_STOP = ['выуч', 'учит', 'учеб', 'страни', 'упраж', 'задан', 'прочи', 'напис', 'повто', 'тетра', 'работ', 'контр', 'диктан', 'прове', 'тест', 'англи', 'язык', 'урок', 'выпол', 'сдела', 'подго', 'слова', 'тетрад'];
  const ENG_ALIAS = [
    [/быть|to be|глагол be/i, ['am', 'is', 'are']], [/артикл/i, ['a', 'an']], [/множественн|plural/i, ['множественное']], [/have got|has got|иметь|у меня есть/i, ['have', 'got']],
    [/present simple|настоящее простое|простое настоящее/i, ['simple', 'present']], [/continuous|длительн|сейчас/i, ['continuous']], [/past simple|прошедш|вчера/i, ['past', 'was', 'were']],
    [/неправильн/i, ['неправильные']], [/сравнени|степен|comparative/i, ['сравнение']], [/притяжат/i, ['притяжательный']], [/предлог|in on under/i, ['in', 'on', 'under']],
    [/(^|[^a-z])can([^a-z]|$)|мочь|умею/i, ['can']], [/there is|there are/i, ['there']], [/some|any/i, ['some', 'any']],
    [/цвет/i, ['red', 'blue', 'green', 'yellow']], [/числ|счёт|счет|цифр/i, ['one', 'two', 'three']], [/семь/i, ['mother', 'father']], [/живот|зверь|питомц/i, ['cat', 'dog']],
    [/еда|продукт/i, ['apple', 'bread']], [/одежд/i, ['hat']], [/погод|времена года|сезон/i, ['rain', 'snow']], [/школ/i, ['school']], [/професс/i, ['teacher', 'doctor']],
    [/месяц/i, ['january']], [/транспорт/i, ['bus', 'car']]
  ];
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10 : null;

  function gensFromText(text, subj) {
    const out = new Set(), kw = subj === 'ru' ? RU_KW : subj === 'ow' ? OW_KW : subj === 'izo' ? IZO_KW : MATH_KW;
    kw.forEach(([re, gens]) => { if (re.test(text || '')) gens.forEach(g => out.add(g)); });
    if (subj === 'ru' && /ударн|парн|непроизн/i.test(text || '')) out.delete('r_vowel'); // «безударные гласные» — это не про слоги
    return [...out];
  }
  const mathGensFromText = t => gensFromText(t, 'math');
  // уроки английского, подходящие к записи родителя: lessons = [{id, hay}], hay — название, правило и слова урока
  function engMatch(text, lessons) {
    const low = String(text || '').toLowerCase(), toks = new Map();
    (low.match(/[а-яё]{4,}/g) || []).forEach(w => { const st = w.slice(0, 5); if (!ENG_STOP.some(s => st.startsWith(s))) toks.set(st, 1); });
    ENG_ALIAS.forEach(([re, list]) => { if (re.test(low)) list.forEach(t => toks.set(t, 2)); });
    const out = [];
    lessons.forEach(l => {
      const hay = String(l.hay || '').match(/[a-zа-яё']+/g) || [];
      let sc = 0;
      toks.forEach((w, t) => { if (/^[a-z]/.test(t) ? hay.includes(t) : hay.some(h => h.startsWith(t))) sc += w; });
      if (sc) out.push({ id: l.id, score: sc });
    });
    return out.sort((a, b) => b.score - a.score);
  }

  // результат: { math: {...}, eng: {...} } — по каждому предмету игры
  function analyze(school, childId, today) {
    const subjName = id => ((school.subjects || []).find(s => s.id === id) || {}).name || '';
    const out = {};
    ['math', 'eng', 'ru', 'ow', 'izo'].forEach(k => { out[k] = { focus: 0, reasons: [], avg: null, trend: null, topics: [], exams: [] }; });
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

  return { gameSubject, analyze, gensFromText, mathGensFromText, engMatch, homeworkToPay, summary, TEST_RE };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = ADAPT;
