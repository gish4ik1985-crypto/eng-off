/* Математика: масштаб, план и карта (бонусные уроки; существующий прогресс не затрагивается). */
Object.assign(MTOP, { m_scale: 'Масштаб', m_scalepic: 'Расстояние по клеткам карты', m_plan: 'План комнаты', m_gridmap: 'Координаты на карте' });

MQ.m_scale = l => {
  if (l === 1) { const s = MP([2, 5, 10, 20, 50]), cm = MR(2, 9); return { q: `Масштаб карты: в 1 см — ${s} км. Расстояние на карте — ${cm} см. Сколько километров это на местности?`, ans: s * cm, why: `${cm} × ${s} = ${s * cm} км.` }; }
  if (l === 2) { const s = MP([2, 5, 10, 20, 50]), cm = MR(2, 9); return { q: `Масштаб карты: в 1 см — ${s} км. Расстояние между городами ${s * cm} км. Сколько сантиметров между ними на карте?`, ans: cm, why: `${s * cm} : ${s} = ${cm} см.` }; }
  const N = MP([100, 1000, 10000]), m = N / 100, cm = MR(2, 9);
  return { q: `Масштаб плана 1:${N} (в 1 см — ${m} м). Длина на плане — ${cm} см. Сколько метров на местности?`, ans: cm * m, why: `В 1 см плана — ${m} м, значит ${cm} × ${m} = ${cm * m} м.` };
};
MQ.m_plan = l => {
  const a = MR(2, 6), b = MR(2, 5), s = MP(l === 1 ? [1, 2] : [1, 2, 3, 5]);
  if (l === 1) return { q: `На плане комната — прямоугольник ${a} см на ${b} см. Масштаб: в 1 см — ${s} м. Найди длину комнаты (${a} см на плане) в метрах.`, ans: a * s, why: `${a} × ${s} = ${a * s} м.` };
  if (l === 2) return { q: `План комнаты: ${a} см на ${b} см. Масштаб: в 1 см — ${s} м. Найди периметр комнаты в метрах.`, ans: 2 * (a + b) * s, why: `Размеры комнаты ${a * s} м и ${b * s} м. Периметр: 2 × (${a * s} + ${b * s}) = ${2 * (a + b) * s} м.` };
  return { q: `План комнаты: ${a} см на ${b} см. Масштаб: в 1 см — ${s} м. Найди площадь комнаты в квадратных метрах.`, ans: a * s * b * s, why: `Размеры комнаты ${a * s} м и ${b * s} м. Площадь: ${a * s} × ${b * s} = ${a * s * b * s} м².` };
};
const mgrid = (w, h, cell, extra) => { let o = ''; for (let i = 0; i <= w; i++) o += `<line x1="${20 + i * cell}" y1="20" x2="${20 + i * cell}" y2="${20 + h * cell}" stroke="#9db7ea" stroke-width="2"/>`; for (let j = 0; j <= h; j++) o += `<line x1="20" y1="${20 + j * cell}" x2="${20 + w * cell}" y2="${20 + j * cell}" stroke="#9db7ea" stroke-width="2"/>`; return o + extra; };
MQ.m_scalepic = l => {
  const W = 8, H = 5, cell = 40, s = MP(l === 1 ? [1, 2, 5, 10] : l === 2 ? [10, 20, 50] : [20, 50, 100]);
  let ax, ay, bx, by; do { ax = MR(0, W - 1); ay = MR(0, H - 1); bx = MR(0, W - 1); by = MR(0, H - 1); } while (Math.abs(ax - bx) + Math.abs(ay - by) < 3 || ax === bx || ay === by);
  const c = (x, y) => [20 + x * cell + cell / 2, 20 + y * cell + cell / 2], A = c(ax, ay), B = c(bx, by), path = `${A[0]},${A[1]} ${B[0]},${A[1]} ${B[0]},${B[1]}`;
  const n = Math.abs(ax - bx) + Math.abs(ay - by);
  const body = mgrid(W, H, cell, `<polyline points="${path}" fill="none" stroke="#e8472b" stroke-width="5" stroke-linejoin="round" stroke-dasharray="2 8" stroke-linecap="round"/><text x="${A[0]}" y="${A[1] + 9}" font-size="26" text-anchor="middle">🏠</text><text x="${B[0]}" y="${B[1] + 9}" font-size="26" text-anchor="middle">🏫</text>`);
  return { pic: OSVG(360, 240, body), q: `Масштаб: одна клетка — ${s} м. Сколько метров от дома до школы по красной тропинке?`, ans: n * s, why: `Тропинка идёт по ${n} клеткам. ${n} × ${s} = ${n * s} м.` };
};
const MGOBJ = [['🏠', 'дом'], ['🏫', 'школа'], ['🌳', 'дерево'], ['🏪', 'магазин'], ['⛲', 'фонтан'], ['🏥', 'больница']];
MQ.m_gridmap = l => {
  const W = l === 1 ? 4 : 6, H = l === 1 ? 4 : 5, cell = l === 1 ? 54 : 44, L = ['А', 'Б', 'В', 'Г', 'Д', 'Е'], n = l === 1 ? 3 : 4;
  const cells = RS(Array.from({ length: W * H }, (_, i) => [i % W, Math.floor(i / W)])).slice(0, n), objs = RS(MGOBJ).slice(0, n), name = ([x, y]) => `${L[x]}${y + 1}`;
  const lab = Array.from({ length: W }, (_, i) => `<text x="${20 + i * cell + cell / 2}" y="14" font-size="14" font-weight="700" text-anchor="middle" font-family="sans-serif">${L[i]}</text>`).join('') + Array.from({ length: H }, (_, j) => `<text x="8" y="${20 + j * cell + cell / 2 + 5}" font-size="14" font-weight="700" text-anchor="middle" font-family="sans-serif">${j + 1}</text>`).join('');
  const icons = cells.map((c, i) => `<text x="${20 + c[0] * cell + cell / 2}" y="${20 + c[1] * cell + cell / 2 + 9}" font-size="${l === 1 ? 30 : 26}" text-anchor="middle">${objs[i][0]}</text>`).join('');
  const pic = OSVG(40 + W * cell, 36 + H * cell, mgrid(W, H, cell, lab + icons));
  const k = MR(0, n - 1);
  if (MR(0, 1)) { const ws = RS(objs.filter((_, i) => i !== k).map(o => o[1])).slice(0, 2), r = objs[k][1]; return { pic, q: `Что находится в клетке ${name(cells[k])}?`, opts: RS([r].concat(ws)), ans: r, why: `Клетка ${name(cells[k])}: столбец ${L[cells[k][0]]}, строка ${cells[k][1] + 1}. Там ${r}.` }; }
  const r = name(cells[k]), ws = RS(cells.filter((_, i) => i !== k).map(name)).slice(0, 2);
  return { pic, q: `В какой клетке находится ${objs[k][1]} (${objs[k][0]})?`, opts: RS([r].concat(ws)), ans: r, why: `${cap1(objs[k][1])} в клетке ${r}: буква — столбец, цифра — строка.` };
};
MB(MWORLDS[2], [BL(ML(1306, '🗺️', 'Карта по клеткам', 'Клетчатая карта: буква показывает столбец, цифра — строку.', BR('Координаты', 'Клетка на карте называется буквой и цифрой: <b>Б3</b> — второй столбец, третья строка. Так можно найти любое место.', [['В2', 'столбец В, строка 2'], ['А1', 'левый верхний угол']]), [['m_gridmap', 1], ['m_gridmap', 2], ['m_scalepic', 1]]))]);
MB(MWORLDS[3], [
  BL(ML(4307, '📏', 'Масштаб', 'Карта и план — это уменьшенный рисунок местности. Масштаб показывает, во сколько раз всё уменьшили.', BR('Масштаб', 'Если в 1 см карты — 10 км, то 5 см на карте — это 5 × 10 = 50 км. Чтобы найти расстояние на карте, километры делят на число км в 1 см. Запись <b>1:100</b> значит: 1 см на плане — 100 см (то есть 1 м) на местности.', [['1 см — 10 км, 5 см', '50 км'], ['1:1000', '1 см — 10 м']]), [['m_scale', 1], ['m_scale', 2], ['m_scale', 3]])),
  BL(ML(4308, '📐', 'План комнаты', 'Чертим план: размеры уменьшены, а форма остаётся.', BR('План и размеры', 'Сначала найди настоящие размеры по масштабу, потом считай периметр: P = 2 × (a + b) или площадь: S = a × b.', [['5 см × 3 см, 1 см — 2 м', '10 м × 6 м']]), [['m_plan', 1], ['m_plan', 2], ['m_plan', 3]])),
  BL(ML(4309, '🧭', 'Расстояние по клеткам', 'Считаем путь по клеткам карты и переводим в метры.', BR('Путь по клеткам', 'Посчитай клетки, по которым идёт путь, и умножь на масштаб клетки: 7 клеток по 20 м — это 140 м.', [['7 клеток × 20 м', '140 м']]), [['m_scalepic', 2], ['m_scalepic', 3], ['m_gridmap', 2]]))
]);
