(function () {
'use strict';
const app = document.getElementById('app');
const KEY = 'engAdventure_v1';

/* ---------- утилиты ---------- */
const pad = n => String(n).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const $ = id => document.getElementById(id);
const PRAISE = ['Отлично! 🎉', 'Супер! ⭐', 'Верно! 💎', 'Молодец! 🤖', 'Класс! 🔥', 'Точно! ⛏️'];
const praise = () => PRAISE[Math.random() * PRAISE.length | 0];

function toast(t) {
  const el = $('toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- состояние ---------- */
// товары магазина: e — картинка, n — название, p — цена в изумрудах
const HATS = {
  h_bow: { e: '🎀', n: 'Бант', p: 6 }, cap: { e: '🧢', n: 'Кепка', p: 6 }, h_sun: { e: '👒', n: 'Соломенная шляпа', p: 7 },
  grad: { e: '🎓', n: 'Шапочка', p: 8 }, h_mil: { e: '🪖', n: 'Каска', p: 9 }, top: { e: '🎩', n: 'Цилиндр', p: 10 },
  h_cloud: { e: '☁️', n: 'Облачко', p: 10 }, helm: { e: '⛑️', n: 'Шлем', p: 12 }, h_pizza: { e: '🍕', n: 'Пицца на голове', p: 12 },
  h_chick: { e: '🐣', n: 'Цыплёнок', p: 12 }, h_phones: { e: '🎧', n: 'Наушники', p: 16 }, h_star: { e: '⭐', n: 'Звезда', p: 18 },
  crown: { e: '👑', n: 'Корона', p: 20 }, h_rainbow: { e: '🌈', n: 'Радуга', p: 22 }, h_fire: { e: '🔥', n: 'Огонь', p: 25 }
};
const FACES = {
  f_glasses: { e: '👓', n: 'Очки', p: 8 }, f_sun: { e: '🕶️', n: 'Тёмные очки', p: 10 }, f_mask: { e: '🥽', n: 'Маска для плавания', p: 12 },
  f_theatre: { e: '🎭', n: 'Театральная маска', p: 14 }, f_mustache: { e: '🥸', n: 'Усы и очки', p: 15 }
};
const BACKS = {
  b_scarf: { e: '🧣', n: 'Шарф', p: 10 }, b_bag: { e: '🎒', n: 'Рюкзак', p: 12 }, b_butterfly: { e: '🦋', n: 'Бабочка', p: 14 },
  b_shield: { e: '🛡️', n: 'Щит', p: 20 }, b_cape: { e: '🧥', n: 'Плащ героя', p: 25 }, b_rocket: { e: '🚀', n: 'Ракета', p: 35 }
};
const HANDS = {
  i_apple: { e: '🍎', n: 'Яблоко', p: 5 }, i_balloon: { e: '🎈', n: 'Шарик', p: 6 }, i_torch: { e: '🔦', n: 'Фонарик', p: 8 },
  i_pick: { e: '⛏️', n: 'Кирка', p: 15 }, i_guitar: { e: '🎸', n: 'Гитара', p: 15 }, i_tele: { e: '🔭', n: 'Телескоп', p: 18 },
  i_sword: { e: '🗡️', n: 'Меч', p: 20 }, i_bow: { e: '🏹', n: 'Лук', p: 20 }, i_wand: { e: '🪄', n: 'Волшебная палочка', p: 25 }
};
// ---- ещё товары ----
Object.assign(HATS, {
  h_flower: { e: '🌸', n: 'Цветочный венок', p: 8 }, h_bee: { e: '🐝', n: 'Пчёлка', p: 9 }, h_donut: { e: '🍩', n: 'Пончик', p: 10 },
  h_mushroom: { e: '🍄', n: 'Гриб', p: 10 }, h_cowboy: { e: '🤠', n: 'Ковбой', p: 14 }, h_pumpkin: { e: '🎃', n: 'Тыква', p: 14 },
  h_snowman: { e: '☃️', n: 'Снеговик', p: 16 }, h_santa: { e: '🎅', n: 'Дед Мороз', p: 20 }, h_unicorn: { e: '🦄', n: 'Единорог', p: 25 },
  h_ufo: { e: '🛸', n: 'Летающая тарелка', p: 30 }
});
Object.assign(FACES, {
  f_mask2: { e: '😷', n: 'Медицинская маска', p: 10 }, f_monocle: { e: '🧐', n: 'Монокль', p: 12 }, f_nerd: { e: '🤓', n: 'Умник', p: 12 },
  f_heart: { e: '😍', n: 'Влюблённый', p: 14 }, f_cool: { e: '😎', n: 'Круто!', p: 16 }
});
Object.assign(BACKS, {
  b_kite: { e: '🪁', n: 'Воздушный змей', p: 12 }, b_squirrel: { e: '🐿️', n: 'Белка', p: 14 }, b_star: { e: '🌟', n: 'Звезда-спутница', p: 16 },
  b_parrot: { e: '🦜', n: 'Попугай', p: 18 }, b_parachute: { e: '🪂', n: 'Парашют', p: 30 }
});
Object.assign(HANDS, {
  i_carrot: { e: '🥕', n: 'Морковка', p: 5 }, i_icecream: { e: '🍦', n: 'Мороженое', p: 8 }, i_ball: { e: '⚽', n: 'Мяч', p: 8 },
  i_book: { e: '📖', n: 'Книга', p: 10 }, i_wrench: { e: '🔧', n: 'Гаечный ключ', p: 10 }, i_flask: { e: '🧪', n: 'Колба', p: 12 },
  i_brush: { e: '🎨', n: 'Палитра', p: 12 }, i_mic: { e: '🎤', n: 'Микрофон', p: 14 }, i_cup: { e: '🏆', n: 'Кубок', p: 25 },
  i_trident: { e: '🔱', n: 'Трезубец', p: 30 }
});
// ---- редкие предметы: нельзя купить, открываются за ачивки (a — id ачивки) ----
Object.assign(HATS, {
  r_h1: { e: '👾', n: 'Трофей Забывака', p: 999, a: 'b1' }, r_h2: { e: '👹', n: 'Маска Путаницы', p: 999, a: 'b2' },
  r_h3: { e: '🔮', n: 'Магический шар', p: 999, a: 'b3' }, r_h4: { e: '💫', n: 'Кометный венец', p: 999, a: 'all' },
  r_h5: { e: '🏅', n: 'Золотая медаль', p: 999, a: 'g25' }, r_h6: { e: '🎶', n: 'Музыка в голове', p: 999, a: 'aud60' }
});
Object.assign(FACES, {
  r_f1: { e: '🤩', n: 'Звёздный взгляд', p: 999, a: 't30' }, r_f2: { e: '🥷', n: 'Ниндзя-знаток', p: 999, a: 'tale' },
  r_f3: { e: '👂', n: 'Супер-слух', p: 999, a: 'aud25' }
});
Object.assign(BACKS, {
  r_b1: { e: '🦅', n: 'Орёл стойкости', p: 999, a: 'st30' }, r_b2: { e: '🐉', n: 'Дракон за спиной', p: 999, a: 'p5' },
  r_b3: { e: '🌈', n: 'Радужный плащ', p: 999, a: 's100' }
});
Object.assign(HANDS, {
  r_i1: { e: '📚', n: 'Волшебная библиотека', p: 999, a: 'w200' }, r_i2: { e: '🔥', n: 'Факел недели', p: 999, a: 'st7' },
  r_i3: { e: '🗝️', n: 'Ключ знаний', p: 999, a: 'diag' }
});
const ITEMS = Object.assign({}, HATS, FACES, BACKS, HANDS);
const ITEMS_BASE_PRICES_SCALED = true; // цены ниже умножаются на 6 один раз после объявления всех товаров
const HUES = [
  { h: 0, n: 'Классика', p: 0 }, { h: 140, n: 'Мята', p: 0 }, { h: 260, n: 'Лёд', p: 0 },
  { h: 40, n: 'Закат', p: 12 }, { h: 190, n: 'Океан', p: 12 }, { h: 320, n: 'Фиалка', p: 12 }, { h: 80, n: 'Лайм', p: 12 }, { h: 220, n: 'Космос', p: 18 }
];
const THEMES = {
  theme0: { n: 'Луг', p: 0, bg: '#8ed1fc' }, theme1: { n: 'Ночь', p: 20, bg: '#1e2a5a' }, theme2: { n: 'Незер', p: 30, bg: '#6a2020' },
  theme3: { n: 'Снег', p: 20, bg: '#dff3ff' }, theme4: { n: 'Пустыня', p: 20, bg: '#f2d38a' }, theme5: { n: 'Океан', p: 25, bg: '#2a7fa5' },
  theme6: { n: 'Край (Энд)', p: 35, bg: '#3b1f5e' }, theme7: { n: 'Закат', p: 30, bg: 'linear-gradient(#ff9a6b,#b06ab3)' }
};
const PET_LINES = {
  dragon: { n: 'Дракончик', p: 0, line: ['🥚', '🐣', '🐥', '🦖', '🐉', '🐲'] },
  cat: { n: 'Котёнок', p: 30, line: ['🥚', '🐱', '😺', '🐈', '🦁', '🐯'] },
  sea: { n: 'Морской друг', p: 35, line: ['🥚', '🐠', '🐟', '🐬', '🐋', '🦈'] },
  robot: { n: 'Робо-друг', p: 40, line: ['🥚', '🔩', '⚙️', '🤖', '🦾', '🛸'] },
  space: { n: 'Космический', p: 50, line: ['🥚', '🌑', '🌙', '🪐', '🌟', '🚀'] }
};
// пороги роста питомца (xp) и названия стадий
const PET_STAGES = [[0, '🥚', 'Яйцо'], [3, '🐣', 'Малыш'], [8, '🐥', 'Подросток'], [15, '🦖', 'Взрослый'], [28, '🐉', 'Силач'], [50, '🐲', 'Легенда']];
const petE = k => (PET_LINES[S.pet] || PET_LINES.dragon).line[k];
// ---- ещё товары: цвета, фоны, питомцы, звания ----
HUES.push({ h: 100, n: 'Мох', p: 12 }, { h: 160, n: 'Бирюза', p: 12 }, { h: 280, n: 'Сирень', p: 15 }, { h: 350, n: 'Малина', p: 15 });
Object.assign(THEMES, {
  theme8: { n: 'Джунгли', p: 25, bg: '#2e7d32' }, theme9: { n: 'Конфетный', p: 25, bg: 'linear-gradient(#ffd1e8,#c9e7ff)' },
  theme10: { n: 'Вулкан', p: 30, bg: 'linear-gradient(#ff7043,#4e342e)' }, theme11: { n: 'Подводный мир', p: 30, bg: 'linear-gradient(#2a7fa5,#0b3d5c)' },
  theme12: { n: 'Космос', p: 35, bg: 'linear-gradient(#0b1030,#3a1c71)' }
});
Object.assign(PET_LINES, {
  bugs: { n: 'Букашки', p: 30, line: ['🥚', '🐛', '🐜', '🐝', '🦋', '🐞'] },
  bird: { n: 'Птичка', p: 40, line: ['🥚', '🐤', '🐥', '🦆', '🦢', '🦅'] },
  forest: { n: 'Лесной друг', p: 45, line: ['🥚', '🐿️', '🦊', '🐺', '🦌', '🐻'] },
  dino: { n: 'Динозавр', p: 55, line: ['🥚', '🦎', '🐊', '🦕', '🦖', '🐉'] }
});
// звания: показываются рядом с именем игрока
const TITLES = {
  t_explorer: { e: '🧭', n: 'Юный исследователь', p: 5 }, t_hero: { e: '🛡️', n: 'Герой слов', p: 10 }, t_robot: { e: '🤖', n: 'Друг роботов', p: 10 },
  t_miner: { e: '⛏️', n: 'Шахтёр знаний', p: 15 }, t_knight: { e: '⚔️', n: 'Рыцарь грамматики', p: 20 }, t_wizard: { e: '🧙', n: 'Волшебник английского', p: 25 },
  t_captain: { e: '⚓', n: 'Капитан острова', p: 30 }, t_legend: { e: '👑', n: 'Легенда Spotlight', p: 50 },
  t_r1: { e: '👾', n: 'Победитель Забывака', p: 999, a: 'b1' }, t_r2: { e: '🌍', n: 'Мастер всех миров', p: 999, a: 'all' },
  t_r3: { e: '📚', n: 'Король словаря', p: 999, a: 'w200' }, t_r4: { e: '🔥', n: 'Железная воля', p: 999, a: 'st30' },
  t_r5: { e: '📜', n: 'Сказочный герой', p: 999, a: 'tale' }, t_r6: { e: '🎧', n: 'Мастер слуха', p: 999, a: 'aud60' },
  t_r7: { e: '🏆', n: 'Мастер острова', p: 999, a: 'l60' }
};
// редкие питомцы и фоны
Object.assign(PET_LINES, {
  legend: { n: 'Звёздный дракон', p: 999, a: 'l60', line: ['🥚', '✨', '🌠', '🦄', '🐲', '👑'] },
  phoenix: { n: 'Огненная птица', p: 999, a: 'st14', line: ['🥚', '🔥', '🐦', '🦚', '🦅', '🐲'] }
});
Object.assign(THEMES, {
  theme13: { n: 'Золотой остров', p: 999, a: 'e300', bg: 'linear-gradient(#ffe082,#ff8f00)' },
  theme14: { n: 'Радужное небо', p: 999, a: 't10', bg: 'linear-gradient(#ffb3ba,#ffdfba,#ffffba,#baffc9,#bae1ff)' }
});
// какие редкие предметы открывает ачивка
function rareFor(achId) {
  const out = [];
  [ITEMS, TITLES, PET_LINES, THEMES].forEach(src => Object.keys(src).forEach(k => { if (src[k].a === achId) out.push((src[k].e || '🎁') + ' ' + src[k].n); }));
  return out;
}
const HEROES = [0, 140, 260];
// цены в 6 раз выше (с округлением до 5): копить на мечту несколько дней — это интереснее, чем покупать всё сразу
(function scalePrices() {
  const sc = o => { if (o && o.p > 0 && o.p < 999) o.p = Math.max(5, Math.round(o.p * 6 / 5) * 5); };
  [HATS, FACES, BACKS, HANDS, TITLES, THEMES, PET_LINES].forEach(src => Object.values(src).forEach(sc));
  HUES.forEach(sc);
})();

const defState = () => ({
  name: '', hue: 0, emeralds: 0, owned: ['theme0'], hat: null, theme: 'theme0',
  rate: 0.8, face: null, back: null, hand: null, title: null, pet: 'dragon', petName: 'Кубик',
  ach: {}, cnt: {}, totalDays: 0, maxStreak: 0, maxEm: 0, diagRun: false,
  prizes: [{ need: 5, text: '' }, { need: 12, text: '' }, { need: 25, text: '' }],
  subj: 'eng', mworld: 0, rworld: 0, oworld: 0, iworld: 0, izoDay: '', strict: false, mt: {}, xp: 0, up: {}, inv: {}, potionOn: false, chestDay: '', goal: null, repDay: '', repCnt: {}, hwPaid: {}, schoolChild: '', sets: {}, log: {}, dlg: {}, songs: {}, audio: {}, lessons: {}, words: {}, streak: 0, lastDay: '', bonusGiven: {}, petXp: 0, mute: false, unlockAll: false, world: 0, gr: {}, diagDone: false
});
// предметы: английский (WORLDS) и математика (MWORLDS); у каждого свои миры
const skind = () => S.subj === 'ru' ? 'ru' : S.subj === 'ow' ? 'ow' : S.subj === 'izo' ? 'izo' : S.subj === 'math' ? 'math' : 'eng';
const isGen = () => S.subj === 'math' || S.subj === 'ru' || S.subj === 'ow' || S.subj === 'izo'; // предметы с генерируемыми заданиями
const genWorlds = () => S.subj === 'ru' ? RWORLDS : S.subj === 'ow' ? OWORLDS : S.subj === 'izo' ? IWORLDS : MWORLDS;
const WS = () => isGen() ? genWorlds() : WORLDS;
const widx = () => S.subj === 'math' ? (S.mworld || 0) : S.subj === 'ru' ? (S.rworld || 0) : S.subj === 'ow' ? (S.oworld || 0) : S.subj === 'izo' ? (S.iworld || 0) : S.world;
const W = () => WS()[widx()] || WS()[0];
const worldOpen = k => S.unlockAll || k === 0 || isGen() || (S.lessons[WS()[k - 1].boss.id] || {}).done;
/* игроки (профили): у каждого свой прогресс. Первый профиль использует прежний ключ, поэтому сохранённое не пропадает */
const PKEY = 'engAdventure_profiles';
let PR = { list: [], cur: null };
try { const r = JSON.parse(localStorage.getItem(PKEY)); if (r && r.list) PR = r; } catch (e) {}
const savePR = () => { try { localStorage.setItem(PKEY, JSON.stringify(PR)); } catch (e) {} };
const snapOf = o => JSON.stringify(o, (k, v) => k === '_ts' ? undefined : v);
const lastSnap = {}; // снимок состояния при последнем сохранении: по нему видно, что игрок реально что-то изменил
function loadState(key) {
  let s = defState();
  try { const r = JSON.parse(localStorage.getItem(key)); if (r) s = Object.assign(defState(), r); } catch (e) {}
  lastSnap[key] = snapOf(s);
  return s;
}
if (!PR.list.length) {
  let legacy = null; try { legacy = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (legacy) { PR = { list: [{ id: 'p0', name: legacy.name || 'Игрок', key: KEY }], cur: 'p0' }; savePR(); }
}
let KEYNOW = (PR.list.find(p => p.id === PR.cur) || {}).key || KEY;
let S = loadState(KEYNOW);
function save() {
  try {
    if (!PR.list.length && S.name) { PR = { list: [{ id: 'p0', name: S.name, key: KEYNOW }], cur: 'p0' }; savePR(); }
    const sn = snapOf(S);
    if (sn !== lastSnap[KEYNOW]) { lastSnap[KEYNOW] = sn; S._ts = Date.now(); cloudDirty(); }
    localStorage.setItem(KEYNOW, JSON.stringify(S));
    const p = PR.list.find(x => x.id === PR.cur);
    if (p && S.name && p.name !== S.name) { p.name = S.name; savePR(); }
  } catch (e) {}
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- звук и озвучка ---------- */
let ac;
// планшеты (особенно iOS) включают звук и речь только после первого касания — «будим» их
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return; audioUnlocked = true;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
  } catch (e) {}
  try { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
}
['pointerdown', 'touchstart', 'keydown'].forEach(ev => document.addEventListener(ev, unlockAudio, { once: false, passive: true }));
/* Речь: одно «состояние речи» на всё приложение.
   seq — номер последней фразы (старые фразы и их отложенные запуски отменяются),
   until — когда фраза должна закончиться по расчёту, ended — подтвердил ли браузер конец,
   sfxUntil — до какого момента звучит звуковой сигнал (речь стартует после него, чтобы они не мешали друг другу). */
const SPK = { seq: 0, until: 0, ended: true, sfxUntil: 0 };
const speechOn = () => 'speechSynthesis' in window;
let enVoice = null;
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices();
    enVoice = vs.find(v => /^en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  } catch (e) {}
  return enVoice;
}
if (speechOn()) { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', () => { pickVoice(); setTimeout(() => { try { voiceCheck(); } catch (e) {} }, 300); }); } catch (e) {} }

function tones(freqs, kind) {
  if (S.mute) return;
  if (kind === 'bad' && !SPK.ended && Date.now() < SPK.until) return; // не перебиваем речь сигналом ошибки
  SPK.sfxUntil = Date.now() + freqs.length * 120 + 80;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, k) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.value = f; g.gain.value = .05;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime + k * .12; o.start(t); o.stop(t + .11);
    });
  } catch (e) {}
}
const sfx = k => tones({ ok: [523, 659, 784], bad: [200, 160], win: [523, 659, 784, 1047, 1319] }[k], k);

// say: говорит t (rate — скорость). Если уже что-то говорится, сначала останавливает, ждёт немного (иначе на Android
// слово «съедается») и говорит новое. done вызывается, когда фраза закончилась или отменена.
function say(t, rate, delay, done) {
  if (!speechOn()) { if (done) setTimeout(done, t.length * 90 + 800); return; }
  const my = ++SPK.seq;
  let busy = false;
  try { busy = speechSynthesis.speaking || speechSynthesis.pending; if (busy) speechSynthesis.cancel(); } catch (e) {}
  const wait = Math.max(delay || 0, SPK.sfxUntil - Date.now(), 0) + (busy ? 90 : 0);
  SPK.ended = false; SPK.until = Date.now() + wait + Math.max(900, t.length * 90 + 500);
  let fin = false; const finish = () => { if (!fin) { fin = true; if (done) done(); } };
  if (done) setTimeout(finish, wait + t.length * 130 + 3500);
  const start = attempt => {
    if (my !== SPK.seq) return finish(); // за это время запросили другую фразу или остановили речь
    let started = false, retrying = false;
    try {
      const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = rate || .8;
      try { const v = enVoice || pickVoice(); if (v) u.voice = v; } catch (e) { enVoice = null; } // сбой голоса не должен заглушать речь
      u.onstart = () => { started = true; };
      u.onend = u.onerror = () => { if (retrying) return; started = true; if (my === SPK.seq) SPK.ended = true; finish(); };
      speechSynthesis.speak(u);
      // контроль: если браузер «проглотил» фразу и она не началась за 1,2 с — один раз повторяем
      setTimeout(() => {
        if (started || my !== SPK.seq || attempt > 0) return;
        retrying = true;
        try { speechSynthesis.cancel(); } catch (e) {}
        setTimeout(() => start(1), 120);
      }, 1200);
    } catch (e) { finish(); }
  };
  setTimeout(() => start(0), wait);
}
const speak = (t, delay) => say(t, S.rate || .8, delay);
// ждём не меньше minMs и, пока робот не договорит (но не дольше maxMs), и только потом идём дальше —
// иначе следующее задание начинается, пока ещё звучит ответ на предыдущее
let epoch = 0; // «поколение» экрана: после выхода из урока отложенные переходы больше не срабатывают
// надёжно останавливает речь: на планшетах одиночный cancel() иногда не срабатывает сразу, поэтому повторяем
function hardStop() {
  SPK.seq++; SPK.ended = true; SPK.until = 0; // отменяет и ещё не начавшиеся фразы
  const my = SPK.seq;
  try {
    speechSynthesis.cancel();
    // повтор через 80 мс — только если за это время не началась новая фраза
    setTimeout(() => { if (SPK.seq === my) { try { speechSynthesis.cancel(); } catch (e) {} } }, 80);
  } catch (e) {}
}
function stopAll() { epoch++; newScreen(); }
// «номер экрана»: отложенная озвучка срабатывает, только если экран за это время не сменился
let screenId = 0;
function newScreen() { screenId++; hardStop(); }
function speakLater(text, ms) {
  const id = screenId;
  setTimeout(() => { if (id === screenId) speak(text); }, ms);
}
function waitSpeech(minMs, cb, maxMs = 5000) {
  const t0 = Date.now(), e0 = epoch;
  const check = () => {
    if (e0 !== epoch) return; // ребёнок уже вышел на карту
    // занят, пока браузер не подтвердил конец фразы (расчётное время и флаг speaking — на случай, если события не приходят)
    const busy = !SPK.ended && (Date.now() < SPK.until || (speechOn() && speechSynthesis.speaking));
    const el = Date.now() - t0;
    if (el >= minMs && (!busy || el >= maxMs)) cb(); else setTimeout(check, 120);
  };
  setTimeout(check, 200);
}

/* ---------- повторение слов (интервалы) ---------- */
const INTERVALS = [0, 1, 3, 7, 14, 30];
/* ---------- журнал занятий (для недельного отчёта) ---------- */
function dayRec() {
  const t = today();
  if (!S.log[t]) {
    S.log[t] = { sec: 0, q: 0, ok: 0, les: 0, dlg: 0, song: 0, aud: 0, tr: 0, card: 0 };
    const old = addDays(t, -60); Object.keys(S.log).forEach(d => { if (d < old) delete S.log[d]; });
  }
  return S.log[t];
}
function logQn(n, okN) { const d = dayRec(); d.q += n; d.ok += okN; }
let combo = 0, maxCombo = 0; // серия верных ответов подряд в текущем занятии
function logQ(ok) {
  logQn(1, ok ? 1 : 0);
  if (ok) { combo++; maxCombo = Math.max(maxCombo, combo); addXp(1); } else combo = 0;
}
/* ---------- опыт и уровни ---------- */
const level = (xp = S.xp || 0) => 1 + Math.floor(Math.sqrt(xp / 30));
const levelPct = (xp = S.xp || 0) => { const L = level(xp), a = 30 * (L - 1) * (L - 1), b = 30 * L * L; return Math.round((xp - a) / (b - a) * 100); };
let lvlNote = '';
function addXp(n) {
  const mult = 1 + (S.up && S.up.brain ? S.up.brain * 0.15 : 0);
  const before = level(); S.xp = (S.xp || 0) + Math.max(0, Math.round(n * mult));
  const after = level();
  if (after > before) { const bonus = 15 * (after - before); S.emeralds += bonus; lvlNote = `⭐ Новый уровень: ${after}! +${bonus} 💎`; setTimeout(() => toast(lvlNote), 700); }
}
/* ---------- улучшения и экипировка ---------- */
const UPGRADES = {
  magnet: { e: '🧲', n: 'Магнит изумрудов', d: l => `+${l * 10}% 💎 за уроки и тренировки`, cost: [150, 350, 700] },
  lamp: { e: '💡', n: 'Лампа подсказок', d: l => `${l} ${l === 1 ? 'подсказка' : 'подсказки'} в каждом уроке`, cost: [120, 280, 560] },
  shield: { e: '🛡️', n: 'Щит от ошибки', d: l => `${l === 1 ? 'Первая ошибка' : 'Первые ' + l + ' ошибки'} за урок не считается`, cost: [180, 380, 760] },
  brain: { e: '🧠', n: 'Мозг-ускоритель', d: l => `+${l * 15}% опыта`, cost: [130, 300, 600] },
  luck: { e: '🍀', n: 'Удача сундука', d: l => `Сундук дня богаче на ${l * 25}%`, cost: [100, 250, 500] }
};
const CONS = {
  potion: { e: '🧪', n: 'Зелье ×2', d: 'Следующий урок даст вдвое больше 💎', p: 40, max: 5 },
  freeze: { e: '❄️', n: 'Заморозка серии', d: 'Сама сохранит серию, если пропустишь день', p: 70, max: 3 },
  hints: { e: '💡', n: '3 подсказки', d: 'Подсказки в любой момент занятия', p: 35, max: 30, pack: 3 }
};
const upLv = k => (S.up && S.up[k]) || 0;
// предметы с высокой ценой дают бонус к изумрудам, пока надеты
const perkOf = it => (!it ? 0 : it.a ? 5 : it.p >= 300 ? 6 : it.p >= 200 ? 4 : it.p >= 100 ? 2 : 0);
const gearPerk = () => ['hat', 'face', 'back', 'hand'].reduce((t, k) => t + perkOf(ITEMS[S[k]]), 0);
const emMult = () => 1 + (upLv('magnet') * 10 + gearPerk()) / 100;
function shieldUse(ctx) {
  if (S.strict) return false; // строгий режим родителя: без щита
  if (ctx.shield === undefined) ctx.shield = upLv('shield');
  if (ctx.shield > 0) { ctx.shield--; return true; }
  return false;
}
const hintAllow = ctx => upLv('lamp') - (ctx.hintUsed || 0);
const hintsLeft = ctx => S.strict ? 0 : Math.max(0, hintAllow(ctx)) + ((S.inv && S.inv.hints) || 0);
function hintUI(ctx, apply) {
  if (hintsLeft(ctx) <= 0) return;
  const msg = $('msg'); if (!msg) return;
  const b = document.createElement('button');
  b.className = 'btn small gold'; b.id = 'hintb'; b.textContent = `💡 Подсказка (${hintsLeft(ctx)})`;
  msg.after(b);
  b.onclick = () => {
    if (!apply()) return;
    if (hintAllow(ctx) > 0) ctx.hintUsed = (ctx.hintUsed || 0) + 1; else S.inv.hints--;
    save(); b.remove();
  };
}
function logDone(kind) {
  const d = dayRec(); d[kind] = (d[kind] || 0) + 1;
  S.cnt[kind] = (S.cnt[kind] || 0) + 1;
  setTimeout(checkAch, 1600); // проверяем награды чуть позже, когда экран результата уже показан
}
// время занятий: считаем паузы между касаниями (не дольше 90 секунд)
let lastTouch = 0;
document.addEventListener('pointerdown', () => {
  const n = Date.now();
  if (lastTouch && n - lastTouch < 90000) { dayRec().sec += Math.round((n - lastTouch) / 1000); }
  lastTouch = n;
}, { passive: true });
window.addEventListener('pagehide', () => save());

function ensureWord(id) { return S.words[id] || (S.words[id] = { box: 0, due: today(), miss: 0, seen: 0, first: today() }); }
function srs(id, ok) {
  logQ(ok);
  const w = ensureWord(id); w.seen++;
  if (ok) w.box = Math.min(5, w.box + 1); else { w.box = 0; w.miss++; }
  w.due = addDays(today(), INTERVALS[w.box]);
}
/* учёт ошибок в грамматике и чтении (пропуски и вопросы по тексту) */
const gkey = g => g.en + '|' + g.ans;
const GAPIDX = {};
WORLDS.forEach(wd => wd.lessons.forEach(l => (l.gaps || []).forEach(g => { GAPIDX[gkey(g)] = g; }))); // вопросы по тексту без самого текста в «Тренировку» не берём
DIALOGS.forEach(d => d.turns.forEach(t => { GAPIDX[gkey(t)] = t; })); // реплики диалогов тоже попадают в «Тренировку»
SONGS.forEach(s => s.lines.forEach(l => { const g = songGap(l); if (g) GAPIDX[gkey(g)] = g; })); // и рифмы из песенок
function grSrs(g, ok) {
  logQ(ok);
  const r = S.gr[gkey(g)] || (S.gr[gkey(g)] = { box: 0, miss: 0, due: today() });
  if (ok) r.box = Math.min(5, r.box + 1); else { r.box = 0; r.miss++; }
  r.due = addDays(today(), INTERVALS[r.box]);
}
// слабое = были ошибки и пока меньше 3 верных ответов подряд
function weakItems() {
  const sc = r => r.miss * 2 - r.box;
  const words = Object.keys(S.words).filter(id => WORDS[id] && S.words[id].miss > 0 && S.words[id].box < 3)
    .sort((a, b) => sc(S.words[b]) - sc(S.words[a]));
  const gaps = Object.keys(S.gr).filter(k => GAPIDX[k] && S.gr[k].miss > 0 && S.gr[k].box < 3)
    .sort((a, b) => sc(S.gr[b]) - sc(S.gr[a]));
  return { words, gaps };
}
function weakCount() { const w = weakItems(); return w.words.length + w.gaps.length; }
function warmupWords(L) {
  return Object.keys(S.words)
    .filter(id => !L.words.includes(id) && S.words[id].due <= today() && S.words[id].seen > 0)
    .sort((a, b) => S.words[b].miss - S.words[a].miss).slice(0, 4);
}

/* ---------- серия дней, питомец, герой ---------- */
function touchStreak() {
  const t = today(); let bonus = 0, msg = '';
  if (S.lastDay !== t) {
    const gap = S.lastDay ? dayDiff(S.lastDay, t) : 0;
    if (gap > 1 && S.inv && (S.inv.freeze || 0) >= gap - 1) { S.inv.freeze -= gap - 1; msg = '❄️ Заморозка сохранила серию!'; S.streak = S.streak + 1; }
    else S.streak = (S.lastDay && gap === 1) ? S.streak + 1 : 1;
    S.lastDay = t;
    S.totalDays = (S.totalDays || 0) + 1; S.maxStreak = Math.max(S.maxStreak || 0, S.streak);
    if ([3, 7, 14, 30].includes(S.streak) && !S.bonusGiven[S.streak]) {
      S.bonusGiven[S.streak] = 1; bonus = 10; msg = (msg ? msg + ' ' : '') + '🔥 ' + S.streak + ' дней подряд! +10 💎';
    }
  }
  return { bonus, msg };
}
const shownStreak = () => (S.lastDay && dayDiff(S.lastDay, today()) <= 1 + ((S.inv && S.inv.freeze) || 0)) ? S.streak : 0;
function petStage(xp = S.petXp) { let k = 0; PET_STAGES.forEach((p, i) => { if (xp >= p[0]) k = i; }); return k; }
function hero(size, hue, st) {
  const s = st || S;
  const h = hue === undefined ? s.hue : hue;
  const it = (slot, cls) => (s[slot] && ITEMS[s[slot]] ? `<span class="${cls}">${ITEMS[s[slot]].e}</span>` : '');
  return `<span class="hero" style="font-size:${size}px"><span style="filter:hue-rotate(${h}deg)">🤖</span>${it('hat', 'hat')}${it('face', 'face')}${it('back', 'back')}${it('hand', 'hand')}</span>`;
}
function applyTheme() {
  document.body.className = '';
  const t = THEMES[S.theme] || THEMES.theme0;
  document.body.style.background = S.theme === 'theme0' ? '' : t.bg;
  document.body.style.backgroundAttachment = 'fixed';
}

/* ---------- каркас экранов ---------- */
function frame(ctx, inner) {
  newScreen(); // новый экран: то, что говорилось на предыдущем, больше не звучит
  const dots = ctx.steps.map((s, k) => `<i class="${k < ctx.cur ? 'd' : k === ctx.cur ? 'c' : ''}"></i>`).join('');
  app.innerHTML = `<div class="topline"><button class="btn small sec" id="exit">⬅ Карта</button><div class="dots">${dots}</div>${combo >= 3 ? `<span class="chip cmb">🔥 ×${combo}</span>` : ''}<div class="stepname">${ctx.steps[ctx.cur][0]}</div></div>${inner}`;
  $('exit').onclick = () => { stopAll(); map(); };
  window.scrollTo(0, 0);
}
function runSteps(ctx, final) {
  ctx.cur = 0; combo = 0; maxCombo = 0; lvlNote = '';
  const go = () => {
    if (ctx.cur >= ctx.steps.length) return final();
    ctx.steps[ctx.cur][1](() => { ctx.cur++; go(); });
  };
  go();
}

/* если на устройстве нет английского голоса, слова читаются русским голосом и ничего не понятно — предупреждаем родителей */
let voiceDismissed = false; // «Понятно» нажато — до перезапуска больше не напоминаем
const hasEnVoice = () => { try { return speechSynthesis.getVoices().some(v => /^en/i.test(v.lang)); } catch (e) { return false; } };
const voiceCount = () => { try { return speechSynthesis.getVoices().length; } catch (e) { return 0; } };
function voiceCheck() {
  const box = $('vw');
  if (isGen() || voiceDismissed || !box || !speechOn()) return;
  if (!voiceCount() || hasEnVoice()) return; // голоса ещё не загрузились или английский есть
  box.innerHTML = `<div class="card" style="background:#ffe3e0"><b>🔇 На этом устройстве нет английского голоса.</b> Английские слова читаются русским голосом, поэтому звучат непонятно, «обрываются» или «пропадают».
    <ul><li><b>Проще всего:</b> откройте игру в <b>Google Chrome</b> при подключённом интернете, там появляется голос «Google US English».</li>
    <li><b>Windows:</b> Параметры → Время и язык → Язык и регион → Добавить язык → English (United States) → после установки включите «Преобразование текста в речь», затем перезапустите браузер.</li>
    <li><b>Android:</b> Настройки → Язык и ввод → Синтез речи → Google → Установить голосовые данные → English.</li>
    <li><b>iPad:</b> Настройки → Универсальный доступ → Устный контент → Голоса → English.</li></ul>
    <button class="btn small sec" id="vwx">Понятно</button></div>`;
  $('vwx').onclick = () => { voiceDismissed = true; box.innerHTML = ''; };
}

/* ---------- игроки ---------- */
let newPlayerFrom = null; // id игрока, с которого перешли к созданию нового (чтобы можно было отменить)
function useProfile(id) {
  const p = PR.list.find(x => x.id === id); if (!p) return;
  PR.cur = id; savePR(); KEYNOW = p.key; S = loadState(KEYNOW); applyTheme(); syncSoon(true); map();
}
function addPlayer() {
  newPlayerFrom = PR.cur;
  const id = 'p' + Date.now().toString(36);
  PR.list.push({ id, name: 'Новый игрок', key: KEY + '_' + id }); PR.cur = id; savePR();
  KEYNOW = KEY + '_' + id; S = defState(); applyTheme(); welcome();
}
function cancelNewPlayer() {
  const id = PR.cur;
  try { localStorage.removeItem(KEYNOW); } catch (e) {}
  PR.list = PR.list.filter(x => x.id !== id);
  PR.cur = (PR.list.find(x => x.id === newPlayerFrom) || PR.list[0] || {}).id || null;
  const p = PR.list.find(x => x.id === PR.cur); KEYNOW = p ? p.key : KEY; S = loadState(KEYNOW);
  newPlayerFrom = null; savePR(); applyTheme(); players();
}
function players() {
  homeView = true;
  const cards = PR.list.map(p => {
    const st = loadState(p.key), done = Object.values(st.lessons || {}).filter(x => x.done).length;
    return `<div class="item"><div class="ie">${hero(56, st.hue, st)}</div><b>${esc(p.name)}</b><br><small>💎 ${st.emeralds || 0} · пройдено локаций: ${done}</small><br>
      <button class="btn small ${p.id === PR.cur ? 'gold' : ''}" data-pl="${p.id}">Играть</button><br>
      <button class="btn small sec" data-ren="${p.id}" title="Переименовать">✏️</button><button class="btn small sec" data-del="${p.id}" title="Удалить">🗑</button></div>`;
  }).join('');
  app.innerHTML = `<div class="card top">${S.name ? '<button class="btn small sec" id="bk">⬅ Карта</button>' : ''}<div class="grow center"><h2>👤 Кто занимается?</h2></div></div>
    <div class="card"><div class="shop">${cards}<div class="item"><div class="ie">➕</div><b>Новый игрок</b><br><button class="btn small gold" id="np">Добавить</button></div></div>
      <p><button class="btn small sec" id="cl">☁️ Семейный код (вход с другого устройства)</button></p>
      <p><small>У каждого игрока свой прогресс, награды, питомец и недельный отчёт. ${cloudOn() ? 'Прогресс синхронизируется с облаком.' : 'Данные хранятся на этом устройстве.'}</small></p></div>`;
  if ($('bk')) $('bk').onclick = map;
  $('cl').onclick = () => cloudScreen(players);
  $('np').onclick = addPlayer;
  app.querySelectorAll('[data-pl]').forEach(b => b.onclick = () => useProfile(b.dataset.pl));
  app.querySelectorAll('[data-ren]').forEach(b => b.onclick = () => {
    const p = PR.list.find(x => x.id === b.dataset.ren);
    const nn = (prompt('Новое имя игрока:', p.name) || '').replace(/[<>&"]/g, '').trim().slice(0, 14);
    if (!nn) return;
    p.name = nn;
    if (p.id === PR.cur) { S.name = nn; save(); } else { const st = loadState(p.key); st.name = nn; try { localStorage.setItem(p.key, JSON.stringify(st)); } catch (e) {} }
    savePR(); players();
  });
  app.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const p = PR.list.find(x => x.id === b.dataset.del);
    if (!confirm(`Удалить игрока «${p.name}» и весь его прогресс? Это нельзя отменить.`)) return;
    try { localStorage.removeItem(p.key); } catch (e) {}
    PR.list = PR.list.filter(x => x.id !== p.id);
    if (PR.cur === p.id) {
      if (PR.list.length) { PR.cur = PR.list[0].id; KEYNOW = PR.list[0].key; S = loadState(KEYNOW); } else { PR.cur = null; KEYNOW = KEY; S = defState(); }
    }
    savePR(); applyTheme();
    if (!PR.list.length) return welcome();
    players();
  });
}

/* ---------- облако: семейный код и синхронизация ---------- */
const CK = 'engAdventure_cloud';
let CL = { url: '', code: '', last: 0, err: '' };
try { const r = JSON.parse(localStorage.getItem(CK)); if (r) CL = Object.assign(CL, r); } catch (e) {}
const saveCL = () => { try { localStorage.setItem(CK, JSON.stringify(CL)); } catch (e) {} };
const cloudUrl = () => CL.url || (typeof CLOUD_URL === 'string' ? CLOUD_URL : '');
const cloudOn = () => !!(cloudUrl() && CL.code);
const cloudStatus = () => CL.err ? 'Нет связи с облаком (' + CL.err + '). Данные сохранены на устройстве и отправятся позже.' : CL.last ? 'Последняя синхронизация: ' + new Date(CL.last).toLocaleString('ru-RU') + '.' : 'Ещё не синхронизировалось.';
async function api(op, data) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(cloudUrl(), { method: 'POST', body: JSON.stringify(Object.assign({ op, code: CL.code }, data)), signal: ctl.signal });
    const j = await r.json();
    if (!j.ok) throw new Error(j.err || 'ошибка облака');
    return j;
  } finally { clearTimeout(t); }
}
const newCid = () => 'c' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);
const genCode = () => { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 6; i++) c += a[Math.floor(Math.random() * a.length)]; return c; };
// слияние двух версий прогресса: ничего не теряется, одиночные значения берём из более свежей версии
function mergeState(a, b) {
  const newer = (a._ts || 0) >= (b._ts || 0) ? a : b, older = newer === a ? b : a;
  const m = Object.assign(defState(), older, newer);
  const keyed = (x, y, pick) => { const o = {}; new Set([...Object.keys(x || {}), ...Object.keys(y || {})]).forEach(k => { const p = (x || {})[k], q = (y || {})[k]; o[k] = !p ? q : !q ? p : pick(p, q); }); return o; };
  const prog = (p, q) => Object.assign({}, q, p, { done: !!(p.done || q.done), stars: Math.max(p.stars || 0, q.stars || 0) });
  ['lessons', 'dlg', 'songs', 'audio'].forEach(k => { m[k] = keyed(a[k], b[k], prog); });
  m.words = keyed(a.words, b.words, (p, q) => { const w = (p.seen || 0) >= (q.seen || 0) ? p : q; return Object.assign({}, w, { first: [p.first, q.first].filter(Boolean).sort()[0] || w.first }); });
  m.gr = keyed(a.gr, b.gr, (p, q) => ((p.miss || 0) + (p.box || 0)) >= ((q.miss || 0) + (q.box || 0)) ? p : q);
  m.cnt = keyed(a.cnt, b.cnt, (p, q) => Math.max(p, q));
  m.mt = keyed(a.mt, b.mt, (p, q) => (p.seen || 0) >= (q.seen || 0) ? p : q);
  m.up = keyed(a.up, b.up, (p, q) => Math.max(p, q));
  m.xp = Math.max(a.xp || 0, b.xp || 0);
  ['sets', 'ach', 'bonusGiven', 'hwPaid'].forEach(k => { m[k] = Object.assign({}, older[k], newer[k]); });
  m.owned = Array.from(new Set([].concat(a.owned || [], b.owned || [])));
  m.log = keyed(a.log, b.log, (p, q) => keyed(p, q, (x, y) => Math.max(x, y)));
  ['totalDays', 'maxStreak', 'maxEm', 'petXp'].forEach(k => { m[k] = Math.max(a[k] || 0, b[k] || 0); });
  m._ts = Math.max(a._ts || 0, b._ts || 0);
  return m;
}
const curPlayer = () => PR.list.find(x => x.id === PR.cur);
let syncBusy = false, pushTimer = 0, lastSync = 0, needPush = false;
function cloudDirty() {
  if (!cloudOn()) return;
  needPush = true; clearTimeout(pushTimer);
  pushTimer = setTimeout(() => cloudSync(false), 6000);
}
function syncSoon(force) { if (cloudOn() && (force || Date.now() - lastSync > 120000)) cloudSync(true); }
// pull = true: сначала забрать из облака и слить; потом всегда отправить
async function cloudSync(pull) {
  if (!cloudOn() || syncBusy) return;
  const p = curPlayer(); if (!p || !S.name) return;
  syncBusy = true;
  try {
    if (!p.cid) { p.cid = newCid(); savePR(); }
    const cid = p.cid, key = KEYNOW;
    let changed = false;
    if (pull) {
      const r = await api('pull', { id: cid });
      if (r.state && KEYNOW === key) {
        const remote = JSON.parse(r.state), before = snapOf(S), merged = mergeState(S, remote);
        Object.keys(S).forEach(k => delete S[k]); Object.assign(S, merged);
        changed = snapOf(S) !== before;
        lastSnap[key] = snapOf(S);
        try { localStorage.setItem(key, JSON.stringify(S)); } catch (e) {}
        if (S.name && p.name !== S.name) { p.name = S.name; savePR(); }
      }
    }
    if (KEYNOW === key) await api('push', { id: cid, name: S.name, ts: S._ts || 0, state: JSON.stringify(S) });
    needPush = false; CL.last = Date.now(); CL.err = ''; lastSync = Date.now(); saveCL();
    if (KEYNOW === key) api('push', { id: '__sum_' + cid, name: S.name, ts: Date.now(), state: JSON.stringify(ADAPT.summary(S, today(), MTOP)) }).catch(() => {});
    schoolPull().then(ch => { if (ch && document.getElementById('vw')) map(); });
    if (changed && document.getElementById('vw')) { applyTheme(); map(); } // мы на карте: показать полученное
  } catch (e) { CL.err = String(e.message || e).slice(0, 40); saveCL(); }
  syncBusy = false;
}
async function cloudPin() {
  if (!cloudOn() || !getPin()) return;
  try { await api('setpin', { pin: getPin() }); } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && needPush) cloudSync(false); });
window.addEventListener('online', () => { if (needPush) cloudSync(false); });

function cloudScreen(back) {
  epoch++; newScreen();
  let msg = '', cloudPlayers = null;
  const draw = () => {
    const urlBlock = cloudUrl() ? '' : '<p>1) Вставьте ссылку на облако (её выдаёт тот, кто настраивал, см. cloud/НАСТРОЙКА.md):</p><input type="text" id="cu" placeholder="https://script.google.com/macros/s/.../exec">';
    let body;
    if (!cloudOn()) {
      body = `${urlBlock}<p>${cloudUrl() ? '' : '2) '}Семейный код (6 знаков):</p><input type="text" id="cc" maxlength="12" placeholder="ABC234" style="text-transform:uppercase">
        <p><button class="btn gold" id="cj">Войти по коду</button> <button class="btn small sec" id="cn">Создать новый семейный код</button></p>
        <p><small>Новый код создаёт родитель один раз на первом устройстве. Остальные устройства входят по этому же коду, потом выбирают игрока.</small></p>`;
    } else {
      const have = new Set(PR.list.map(x => x.cid).filter(Boolean));
      const remote = (cloudPlayers || []).map(c => `<p><b>${esc(c.name)}</b> ${have.has(c.id) ? '(уже на этом устройстве)' : ''} <button class="btn small gold" data-dl="${c.id}">${have.has(c.id) ? 'Играть' : 'Загрузить сюда'}</button></p>`).join('') || '<p>В облаке пока нет игроков.</p>';
      const up = PR.list.filter(x => !x.cid).map(x => `<p>${esc(x.name)} <button class="btn small" data-up="${x.id}">Отправить в облако</button></p>`).join('');
      body = `<p>Семейный код: <b style="font-size:1.6rem;letter-spacing:3px">${esc(CL.code)}</b></p><p><small>${esc(cloudStatus())}</small></p>
        <h3>Игроки в облаке</h3>${remote}${up ? '<h3>Только на этом устройстве</h3>' + up : ''}
        <p><button class="btn small" id="cs">🔄 Синхронизировать сейчас</button> <button class="btn small red" id="co">Выйти с этого устройства</button></p>`;
    }
    app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Назад</button><h2>☁️ Облако</h2>${body}<p class="pmsg">${esc(msg)}</p></div>`;
    $('bk').onclick = back;
    const run = async (fn) => { let pr; try { pr = fn(); } catch (e) { pr = Promise.reject(e); } msg = 'Подождите...'; draw(); const my = screenId; try { await pr; msg = ''; } catch (e) { msg = 'Не получилось: ' + String(e.message || e); } if (screenId === my) draw(); };
    const readUrl = () => { if ($('cu')) { const u = $('cu').value.trim(); if (u) { CL.url = u; saveCL(); } } if (!cloudUrl()) throw new Error('вставьте ссылку на облако'); };
    const login = async (code, create) => {
      readUrl();
      CL.code = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const r = await api('init', {});
      if (!create && r.created) { CL.code = ''; throw new Error('такого кода нет'); }
      if (create && !r.created) { CL.code = ''; throw new Error('код занят, попробуйте ещё раз'); }
      CL.err = ''; saveCL(); cloudPlayers = r.players.filter(x => !String(x.id).startsWith('__'));
      if (r.pin) { try { localStorage.setItem(PIN_KEY, r.pin); } catch (e) {} } else await cloudPin();
    };
    if ($('cj')) $('cj').onclick = () => run(() => { const c = $('cc').value.trim(); if (c.length < 6) throw new Error('код из 6 знаков'); return login(c, false); });
    if ($('cn')) $('cn').onclick = () => run(() => login(genCode(), true));
    if ($('cs')) $('cs').onclick = () => run(async () => {
      if (S.name && curPlayer()) { syncBusy = false; await cloudSync(true); if (CL.err) throw new Error(CL.err); }
      cloudPlayers = (await api('join', {})).players.filter(x => !String(x.id).startsWith('__'));
    });
    if ($('co')) $('co').onclick = () => { if (!confirm('Выйти из облака на этом устройстве? Прогресс на устройстве останется.')) return; CL.code = ''; saveCL(); cloudPlayers = null; draw(); };
    app.querySelectorAll('[data-up]').forEach(b => b.onclick = () => run(async () => {
      const p = PR.list.find(x => x.id === b.dataset.up); p.cid = newCid(); savePR();
      const st = loadState(p.key); await api('push', { id: p.cid, name: st.name, ts: st._ts || Date.now(), state: JSON.stringify(st) });
      cloudPlayers = (await api('join', {})).players.filter(x => !String(x.id).startsWith('__'));
    }));
    app.querySelectorAll('[data-dl]').forEach(b => b.onclick = () => run(async () => {
      const cid = b.dataset.dl;
      let p = PR.list.find(x => x.cid === cid);
      if (!p) {
        const r = await api('pull', { id: cid }); if (!r.state) throw new Error('данные не найдены');
        const id = 'p' + Date.now().toString(36);
        p = { id, name: r.name || 'Игрок', key: KEY + '_' + id, cid };
        PR.list.push(p); try { localStorage.setItem(p.key, r.state); } catch (e) {}
      }
      newPlayerFrom = null; savePR(); useProfile(p.id);
    }));
  };
  draw();
  if (cloudOn() && !cloudPlayers) (async () => { try { cloudPlayers = (await api('join', {})).players.filter(x => !String(x.id).startsWith('__')); draw(); } catch (e) { msg = 'Нет связи: ' + String(e.message || e); draw(); } })();
}

/* ---------- приветствие ---------- */
function welcome() {
  let hue = S.hue;
  app.innerHTML = `<div class="card center">
    <h1>⛏️ Остров английских слов 🤖</h1>
    <p>Злой Забывака украл английские слова! Только ты можешь их вернуть.</p>
    <p>Как тебя зовут?</p><input type="text" id="nm" maxlength="14" placeholder="Твоё имя" value="${esc(S.name)}">
    <p>Выбери своего робота:</p><div id="heroes"></div>
    <p><button class="btn gold" id="go">Начать приключение ➜</button></p>
    ${newPlayerFrom ? '<p><button class="btn small sec" id="wb">⬅ Назад к игрокам</button></p>' : ''}
    <p><button class="btn small sec" id="clw">☁️ У меня уже есть семейный код</button></p></div>`;
  if ($('wb')) $('wb').onclick = cancelNewPlayer;
  $('clw').onclick = () => cloudScreen(welcome);
  const draw = () => {
    $('heroes').innerHTML = HEROES.map(h => `<button class="btn ${h === hue ? 'gold' : 'sec'}" data-h="${h}"><span style="font-size:60px;filter:hue-rotate(${h}deg)">🤖</span></button>`).join('');
    $('heroes').querySelectorAll('button').forEach(b => b.onclick = () => { hue = +b.dataset.h; draw(); });
  };
  draw();
  $('go').onclick = () => {
    const n = $('nm').value.replace(/[<>&"]/g, '').trim();
    if (!n) { toast('Напиши, как тебя зовут 🙂'); return; }
    S.name = n; S.hue = hue; newPlayerFrom = null; save();
    Object.keys(S.lessons).length || S.diagDone ? map() : diagIntro();
  };
}

/* ---------- адаптация под успеваемость (данные дневника) ---------- */
const SKEY = 'school-off:v1';
const schoolData = () => { try { return JSON.parse(localStorage.getItem(SKEY)); } catch (e) { return null; } };
function schoolChild(sd) {
  if (!sd) return null;
  const kids = sd.children || [];
  if (S.schoolChild) { const c = kids.find(x => x.id === S.schoolChild); if (c) return c; }
  const nm = String(S.name || '').trim().toLowerCase();
  return kids.find(x => String(x.name).trim().toLowerCase() === nm) || null;
}
let ADP = null; // { child, sd, a } — разбор дневника для текущего игрока
function adaptLoad() {
  const sd = schoolData(), c = schoolChild(sd);
  ADP = c ? { child: c, sd, a: ADAPT.analyze(sd, c.id, today()) } : null;
  return ADP;
}
const noFocus = { focus: 0, reasons: [], topics: [], exams: [], avg: null };
const focusOf = subj => (ADP && ADP.a[subj]) || noFocus;
// забрать из облака более свежий дневник (если родитель правил на другом устройстве)
async function schoolPull() {
  if (!cloudOn()) return false;
  try {
    const r = await api('pull', { id: '__school' });
    if (!r.state) return false;
    const remote = JSON.parse(r.state), local = schoolData();
    if (!local || (remote._ts || 0) > (local._ts || 0)) { localStorage.setItem(SKEY, r.state); return true; }
  } catch (e) {}
  return false;
}
// за домашку, проверенную родителем, — изумруды
function payHomework() {
  if (!ADP) return;
  const due = ADAPT.homeworkToPay(ADP.sd, ADP.child.id, S.hwPaid, today());
  if (!due.length) return;
  S.hwPaid = S.hwPaid || {};
  due.forEach(t => { S.hwPaid[t.id] = 1; });
  S.emeralds += due.length * 3; save();
  toast(`📓 Домашка проверена: ${mpl(due.length, ['задание', 'задания', 'заданий'])}, +${due.length * 3} 💎`);
}
// темы из дневника, которым сейчас стоит уделить внимание, в виде заданий математики
function diarySpecs() {
  const sj = skind() === 'eng' ? 'math' : skind(), f = focusOf(sj);
  const texts = f.topics.concat(f.exams.map(e => e.text));
  const gens = new Set(); texts.forEach(t => ADAPT.gensFromText(t, sj).forEach(g => gens.add(g)));
  if (!gens.size) return [];
  const seen = new Set(), out = [];
  [W()].concat(genWorlds()).forEach(w => w.lessons.forEach(l => l.gens.forEach(g => { const k = g[0] + g[1]; if (gens.has(g[0]) && !seen.has(k)) { seen.add(k); out.push(specOf(g)); } })));
  return shuffle(out);
}
// уроки английского, которые просит повторить дневник (по словам из записей родителя)
let ENG_IDX = null;
function engIndex() {
  if (ENG_IDX) return ENG_IDX;
  ENG_IDX = [];
  WORLDS.forEach(wd => wd.lessons.forEach(l => {
    const ws = (l.words || []).map(id => WORDS[id] ? WORDS[id].en + ' ' + WORDS[id].ru : '').join(' ');
    ENG_IDX.push({ id: l.id, hay: [l.title, l.rule ? l.rule.title : '', ws].join(' ').toLowerCase() });
  }));
  return ENG_IDX;
}
function engDiaryLessons() {
  const f = focusOf('eng'), texts = f.topics.concat(f.exams.map(e => e.text));
  if (!texts.length) return [];
  const score = {};
  texts.forEach(t => ADAPT.engMatch(t, engIndex()).forEach(m => { score[m.id] = (score[m.id] || 0) + m.score; }));
  const all = [].concat(...WORLDS.map(w => w.lessons));
  return Object.keys(score).sort((a, b) => score[b] - score[a]).slice(0, 3).map(id => all.find(l => String(l.id) === id)).filter(Boolean);
}
// сводка игры для дневника (хранится и на устройстве, и в облаке)
function writeSummary() {
  try {
    const all = JSON.parse(localStorage.getItem('engAdventure_sum') || '{}');
    all[String(S.name).trim().toLowerCase()] = ADAPT.summary(S, today(), MTOP);
    localStorage.setItem('engAdventure_sum', JSON.stringify(all));
  } catch (e) {}
}
function playNext() {
  const WL = W().lessons, i = WL.findIndex(l => !(S.lessons[l.id] || {}).done);
  if (i >= 0) return startLesson(i);
  if (!(S.lessons[W().boss.id] || {}).done) return startBoss();
  toast('Мир пройден! Выбери урок на карте или загляни в другой мир 🏆');
}
function openChest() {
  S.chestDay = today(); S.inv = S.inv || {};
  const luck = 1 + upLv('luck') * 0.25, r = Math.random(); let msg;
  if (r < 0.45) { const n = Math.round((10 + Math.random() * 15) * luck); S.emeralds += n; msg = `+${n} 💎`; }
  else if (r < 0.7) { S.inv.potion = Math.min(CONS.potion.max, (S.inv.potion || 0) + 1); msg = '🧪 Зелье ×2'; }
  else if (r < 0.85) { S.inv.hints = (S.inv.hints || 0) + 3; msg = '💡 3 подсказки'; }
  else if (r < 0.95 && (S.inv.freeze || 0) < CONS.freeze.max) { S.inv.freeze = (S.inv.freeze || 0) + 1; msg = '❄️ Заморозка серии'; }
  else { const n = Math.round(50 * luck); S.emeralds += n; msg = `🎉 Джекпот! +${n} 💎`; }
  save(); sfx('win'); toast('🎁 Сундук дня: ' + msg); map();
}
const goalKeyName = k => {
  if (ITEMS[k]) return ITEMS[k].e + ' ' + ITEMS[k].n;
  if (k.startsWith('hue')) return '🎨 Цвет робота';
  if (k.startsWith('pet_') && PET_LINES[k.slice(4)]) return '🐾 ' + PET_LINES[k.slice(4)].n;
  if (THEMES[k]) return '🗺️ Фон: ' + THEMES[k].n;
  if (TITLES[k]) return TITLES[k].e + ' ' + TITLES[k].n;
  const m = /^up_(\w+)_(\d)$/.exec(k); if (m && UPGRADES[m[1]]) return UPGRADES[m[1]].e + ' ' + UPGRADES[m[1]].n + ' ' + m[2];
  return k;
};
const goalDone = g => { if (!g) return true; const m = /^up_(\w+)_(\d)$/.exec(g.k); return m ? upLv(m[1]) >= +m[2] : S.owned.includes(g.k); };
function goalHtml() {
  if (S.goal && goalDone(S.goal)) S.goal = null;
  const g = S.goal; if (!g) return '';
  const pct = Math.min(100, Math.round(S.emeralds / g.p * 100));
  return `<div><small>🎯 Цель: ${goalKeyName(g.k)} — ${Math.min(S.emeralds, g.p)}/${g.p} 💎${S.emeralds >= g.p ? ' (хватает! зайди в магазин)' : ''}</small><div class="bar goal"><i style="width:${pct}%"></i></div></div>`;
}
function missionCard() {
  const sj = skind(), f = focusOf(sj), log = S.log[today()] || {}, gen = isGen(), dl = gen ? [] : engDiaryLessons();
  const nW = gen ? mathWeak().length + diarySpecs().length : weakCount() + (dl.length ? 1 : 0);
  const steps = gen
    ? [[nW ? '💪' : '✅', nW ? 'Тренировка' : 'Слабых мест нет', !nW || (log.tr || 0) >= 1, mathTraining], ['📘', 'Новый урок', (log.les || 0) >= 1, playNext], ['🚀', 'Ещё урок', (log.les || 0) >= 2, playNext]]
    : [[nW ? '💪' : '✅', nW ? 'Тренировка' : 'Слабых мест нет', !nW || (log.tr || 0) >= 1, training], ['📘', 'Новый урок', (log.les || 0) >= 1, playNext], ['🎧', 'Аудирование', (log.aud || 0) >= 1, listening]];
  const all = steps.every(x => x[2]), bonusKey = today() + 'M' + sj;
  if (all && !S.bonusGiven[bonusKey]) { S.bonusGiven[bonusKey] = 1; S.emeralds += 8; addXp(10); save(); setTimeout(() => toast('🎯 Задание дня выполнено! +8 💎'), 300); }
  const name = { math: 'математике', ru: 'русскому языку', ow: 'окружающему миру', izo: 'ИЗО', eng: 'английскому' }[sj];
  const notes = [];
  if (f.exams.length) { const e = f.exams[0]; notes.push(`📅 По ${name}: «${esc(e.text)}» ${e.days === 0 ? 'сегодня' : e.days === 1 ? 'завтра' : 'через ' + mpl(e.days, ['день', 'дня', 'дней'])}. Потренируемся заранее!`); }
  if (f.focus) notes.push(`📌 В дневнике по ${name}: ${esc(f.reasons.join(', '))}. Сегодня больше повторяем.`);
  if (dl.length) notes.push(`📓 Из дневника по английскому: ${dl.map(l => esc(l.title)).join(', ')}. Они попадут в тренировку.`);
  mission = steps;
  const chestReady = (all || S.bonusGiven[today() + 'Mmath'] || S.bonusGiven[today() + 'Meng']) && S.chestDay !== today();
  return `<div class="card mission"><b>🎯 Задание дня</b>${all ? ' · выполнено! 🎉' : ''}${chestReady ? ' <button class="btn small gold" id="chest">🎁 Сундук дня</button>' : (S.chestDay === today() ? ' <small>🎁 сундук открыт</small>' : '')}
    <div class="msteps">${steps.map((x, k) => `<button class="btn small ${x[2] ? 'gold' : 'sec'}" data-ms="${k}">${x[2] && x[0] !== '✅' ? '✅' : x[0]} ${x[1]}</button>`).join('')}</div>
    ${notes.map(n => `<div class="mnote">${n}</div>`).join('')}</div>`;
}
let mission = [];

/* ---------- карта ---------- */
// уже пройденная локация остаётся открытой, даже если порядок в мире поменялся
function unlocked(i) { return S.unlockAll || i === 0 || (S.lessons[W().lessons[i].id] || {}).done || (S.lessons[W().lessons[i - 1].id] || {}).done; }
/* ---------- главный экран и карта предмета ---------- */
// Два уровня, чтобы ребёнок не путался: сначала главный экран (крупно: играть, предметы, магазин, награды),
// и только внутри предмета — карта уроков, тренировка и задание дня.
let homeView = true;
const SUBJ_META = { eng: ['🇬🇧', 'Английский', () => WORLDS], math: ['🧮', 'Математика', () => MWORLDS], ru: ['📝', 'Русский язык', () => RWORLDS], ow: ['🌍', 'Окружающий мир', () => OWORLDS], izo: ['🎨', 'ИЗО', () => IWORLDS] };
const subjProgress = key => { const ws = SUBJ_META[key][2](); let d = 0, n = 0; ws.forEach(w => { w.lessons.forEach(l => { n++; if ((S.lessons[l.id] || {}).done) d++; }); }); return [d, n]; };
function mapTail() {
  syncSoon(); writeSummary();
  setTimeout(checkAch, 500); // награды, которые зависят от покупок и состояния (шляпы, питомец и др.)
}
function home() {
  epoch++; newScreen(); applyTheme(); adaptLoad(); payHomework();
  const st = petStage(), nxt = PET_STAGES[st + 1];
  const petPct = nxt ? Math.round((S.petXp - PET_STAGES[st][0]) / (nxt[0] - PET_STAGES[st][0]) * 100) : 100;
  const cur = skind(), meta = SUBJ_META[cur];
  const WL = W().lessons, nextI = WL.findIndex(l => !(S.lessons[l.id] || {}).done), bossDone = (S.lessons[W().boss.id] || {}).done;
  const what = nextI >= 0 ? `${WL[nextI].icon} ${WL[nextI].title}` : (bossDone ? 'повторяем' : `${W().boss.icon} ${W().boss.title}`);
  const tiles = Object.keys(SUBJ_META).map(k => { const m = SUBJ_META[k], [d, n] = subjProgress(k); return `<button class="sjt ${k === cur ? 'cur' : ''}" data-sj="${k}"><span class="te">${m[0]}</span><span class="tn">${m[1]}</span><span class="tp"><i style="width:${n ? Math.round(d / n * 100) : 0}%"></i></span></button>`; }).join('');
  app.innerHTML = `<div class="card top">
      <div>${hero(72)}</div>
      <div class="grow"><h2>Привет, ${S.name}!</h2>${S.title && TITLES[S.title] ? `<div><small>${TITLES[S.title].e} ${TITLES[S.title].n}</small></div>` : ''}
        <span class="chip">💎 ${S.emeralds}</span><span class="chip">⭐ Ур. ${level()}</span><span class="chip">🔥 ${shownStreak()} дн.</span>${S.potionOn ? '<span class="chip">🧪 ×2</span>' : ''}${(S.inv && S.inv.freeze) ? `<span class="chip">❄️ ${S.inv.freeze}</span>` : ''}
        <div>${petE(st)} ${S.petName || 'Кубик'} · ${PET_STAGES[st][2]}<div class="bar"><i style="width:${petPct}%"></i></div></div>
        <div><small>⭐ Опыт до уровня ${level() + 1}</small><div class="bar xp"><i style="width:${levelPct()}%"></i></div></div>${goalHtml()}</div>
    </div>
    <div class="center"><button class="btn play huge" id="play">▶ Играть</button><div class="sjhint">${meta[0]} ${meta[1]}: ${what}</div></div>
    <h3 class="center">Выбери предмет</h3>
    <div class="sjgrid">${tiles}</div>
    <div class="center bigrow"><button class="btn gold big" id="shop">🛒 Магазин</button><button class="btn gold big" id="awb">🏆 Награды ${ACH.filter(a => S.ach[a.id]).length}/${ACH.length}</button>${location.protocol === 'file:' ? '' : '<button class="btn sec big" id="dia">📓 Дневник</button>'}</div>
    <div class="mini2"><button class="ib" id="who" title="Сменить игрока">👤</button><button class="ib" id="mute" title="Звук">${S.mute ? '🔇' : '🔊'}</button>${cloudOn() ? `<button class="ib" id="cld" title="Облако">${CL.err ? '⚠️' : '☁️'}</button>` : ''}<button class="ib" id="parent" title="Родителям">🔒</button></div>`;
  $('play').onclick = () => { homeView = false; playNext(); };
  app.querySelectorAll('[data-sj]').forEach(b => b.onclick = () => { S.subj = b.dataset.sj; homeView = false; save(); map(); });
  $('shop').onclick = shop; $('awb').onclick = awards; $('parent').onclick = parentGate; $('who').onclick = players;
  if ($('dia')) $('dia').onclick = () => { location.href = diaryHref(); };
  if ($('cld')) $('cld').onclick = () => toast(CL.err ? 'Нет связи с облаком — всё сохранено на устройстве и отправится позже' : 'Прогресс сохранён в облаке ☁️');
  $('mute').onclick = () => { S.mute = !S.mute; save(); home(); };
  mapTail();
}
function map() {
  if (homeView) return home();
  epoch++; newScreen();
  applyTheme();
  const WL = W().lessons, BS = W().boss;
  const nextI = WL.findIndex(l => !(S.lessons[l.id] || {}).done);
  const allDone = nextI === -1;
  const node = (l, i) => {
    const rec = S.lessons[l.id] || {}, ok = unlocked(i);
    const cls = rec.done ? 'done' : (i === nextI ? 'cur' : (ok ? '' : 'lock'));
    return `<div class="node ${cls}" data-i="${i}"><div class="blk"><span class="num">${i + 1}</span>${ok ? l.icon : '🔒'}</div><div class="t">${l.title}</div><div class="st">${rec.done ? '⭐'.repeat(rec.stars) : '&nbsp;'}</div></div>`;
  };
  const items = WL.map(node);
  const bossOk = allDone || S.unlockAll;
  const bossRec = S.lessons[BS.id] || {};
  items.push(`<div class="node ${bossRec.done ? 'done' : (bossOk ? 'cur' : 'lock')}" data-boss="1"><div class="blk"><span class="num">★</span>${bossOk ? BS.icon : '🔒'}</div><div class="t">${BS.title}</div><div class="st">${bossRec.done ? '⭐'.repeat(bossRec.stars) : '&nbsp;'}</div></div>`);
  let rows = '';
  for (let r = 0; r * 3 < items.length; r++) rows += `<div class="row ${r % 2 ? 'rev' : ''}">${items.slice(r * 3, r * 3 + 3).join('')}</div>`;
  adaptLoad(); payHomework();
  const cur = allDone ? null : WL[nextI];
  const missionHtml = missionCard();
  const nWeak = isGen() ? mathWeak().length : weakCount();
  const meta = SUBJ_META[skind()];
  const tabs = WS().length > 1 ? WS().map((wd, k) => `<button class="btn small ${k === widx() ? 'gold' : 'sec'}" data-w="${k}">${worldOpen(k) ? '' : '🔒 '}${(/(\d)\s*класс/.exec(wd.name) || [0, 0])[1] ? (/(\d)\s*класс/.exec(wd.name)[1]) + ' класс' : wd.name}</button>`).join('') : '';
  const extra = skind() === 'izo' ? '<button class="btn gold" id="free">🖌️ Рисовать самому</button><button class="btn sec" id="gal">🖼️ Мои рисунки</button>' : (!isGen() ? `${!S.diagDone && !Object.keys(S.lessons).length ? '<button class="btn gold" id="dg">🔎 Разведка</button>' : ''}<button class="btn sec" id="more">📚 Ещё</button>` : '');
  app.innerHTML = `<div class="card toprow"><button class="btn sec" id="hm">🏠 Домой</button><h2>${meta[0]} ${meta[1]}</h2><span class="chip">💎 ${S.emeralds}</span></div>
    <div id="vw"></div>
    <div class="center"><button class="btn play huge" id="play">▶ Играть</button></div>
    <div class="center bigrow"><button class="btn ${nWeak ? 'red' : 'sec'}" id="trn">💪 Тренировка${nWeak ? ' (' + nWeak + ')' : ''}</button>${extra}</div>
    ${missionHtml}
    ${tabs ? `<div class="center">${tabs}</div>` : ''}
    <div class="story">${cur ? `<b>Следующая локация — ${cur.icon} ${cur.title}.</b> ${cur.story}` : (bossRec.done ? (widx() + 1 < WS().length ? '🏆 Этот мир пройден! Загляни в следующий мир выше или повтори уроки ради звёзд.' : '🏆 Этот мир пройден! Можно повторять уроки и копить звёзды. Следующий мир — скоро!') : `${BS.icon} Все локации пройдены! Пора на битву с боссом.`)}</div>
    <div class="map">${rows}</div>`;
  $('hm').onclick = () => { homeView = true; home(); };
  if ($('dg')) $('dg').onclick = diagIntro;
  if ($('free')) $('free').onclick = () => izoFree();
  if ($('gal')) $('gal').onclick = izoGallery;
  $('trn').onclick = isGen() ? mathTraining : training;
  if ($('more')) $('more').onclick = more;
  $('play').onclick = () => {
    if (cur) return startLesson(nextI);
    if (!bossRec.done) return bossOk ? startBoss() : toast('Сначала пройди все локации 🔒');
    toast('Мир пройден! Выбери урок на карте или загляни в «Тренировку» 🏆');
  };
  mapTail();
  app.querySelectorAll('[data-ms]').forEach(b => b.onclick = () => mission[+b.dataset.ms][3]());
  if ($('chest')) $('chest').onclick = openChest;
  if (!isGen()) setTimeout(voiceCheck, 1500);
  app.querySelectorAll('[data-w]').forEach(b => b.onclick = () => {
    const k = +b.dataset.w;
    if (!worldOpen(k)) return toast('Сначала победи босса предыдущего мира 🔒');
    if (S.subj === 'math') S.mworld = k; else if (S.subj === 'ru') S.rworld = k; else if (S.subj === 'ow') S.oworld = k; else if (S.subj === 'izo') S.iworld = k; else S.world = k;
    save(); map();
  });
  app.querySelectorAll('.node').forEach(n => n.onclick = () => {
    if (n.dataset.boss) { if (!bossOk) return toast('Сначала пройди все локации 🔒'); return startBoss(); }
    const i = +n.dataset.i;
    if (!unlocked(i)) return toast('Сначала пройди предыдущую локацию 🔒');
    startLesson(i);
  });
}

/* ---------- урок ---------- */
const GAME_PAIRS = [['listen', 'memory'], ['mine', 'build'], ['memory', 'mine'], ['listen', 'build']];
const GAMES = {
  listen: ['Послушай и найди', (ctx, cb) => quiz({ ctx, mode: 'listen', counted: true, items: sample(ctx.L.words, Math.min(6, ctx.L.words.length)) }, cb)],
  mine: ['Добыча блоков', (ctx, cb) => quiz({ ctx, mode: 'mine', counted: true, items: sample(ctx.L.words, Math.min(6, ctx.L.words.length)) }, cb)],
  memory: ['Найди пару', memory],
  build: ['Собери слово', build]
};
function startLesson(i) {
  const L = W().lessons[i], ctx = { L, i, asked: 0, ok: 0 };
  ctx.steps = [];
  if (L.type === 'math') {
    ctx.steps.push(['Правило', cb => mathRule(ctx, cb)]);
    ctx.steps.push(['Тренируемся', cb => mathQuiz({ ctx, counted: true, items: mixSpecs(L.gens, focusOf(skind()).focus ? 12 : 8) }, cb)]);
    const ds = focusOf(skind()).focus || focusOf(skind()).exams.length ? diarySpecs().slice(0, 4) : [];
    if (ds.length) ctx.steps.push(['Из дневника', cb => mathQuiz({ ctx, counted: true, title: '📓 Темы из дневника', items: ds }, cb)]);
    ctx.steps.push(['Мини-тест', cb => mathQuiz({ ctx, counted: true, title: 'Мини-тест', items: mixSpecs(L.gens, 6) }, cb)]);
  } else if (L.type === 'draw') {
    ctx.steps.push(['Правило', cb => mathRule(ctx, cb)]);
    ctx.steps.push(['Рисуем', cb => drawLesson(ctx, L.draw, cb)]);
    if (L.gens.length) ctx.steps.push(['Мини-тест', cb => mathQuiz({ ctx, counted: true, title: 'Мини-тест', items: mixSpecs(L.gens, 4) }, cb)]);
  } else if (L.type === 'read') {
    ctx.steps.push(['Читаем', cb => readCard(ctx, cb)]);
    ctx.steps.push(['Вопросы по тексту', cb => gapQuiz({ ctx, counted: true, items: L.qs }, cb)]);
    if (L.order) ctx.steps.push(['Порядок событий', cb => storyOrder(ctx, cb)]);
    ctx.steps.push(['Собери предложение', cb => sentBuild(ctx, sample(L.sents, Math.min(3, L.sents.length)), cb)]);
  } else if (L.type === 'gram') {
    ctx.steps.push(['Правило', cb => ruleCard(ctx, cb)]);
    ctx.steps.push(['Вставь слово', cb => gapQuiz({ ctx, counted: true, items: sample(L.gaps, Math.min(6, L.gaps.length)) }, cb)]);
    ctx.steps.push(['Собери предложение', cb => sentBuild(ctx, sample(L.sents, Math.min(3, L.sents.length)), cb)]);
    ctx.steps.push(['Мини-тест', cb => gapQuiz({ ctx, counted: true, title: 'Мини-тест', items: sample(L.gaps, Math.min(5, L.gaps.length)) }, cb)]);
  } else {
    const wu = warmupWords(L);
    if (wu.length) ctx.steps.push(['Разминка', cb => quiz({ ctx, mode: 'listen', counted: false, title: '🔥 Разминка: вспомни старые слова', items: wu }, cb)]);
    ctx.steps.push(['Новые слова', cb => intro(ctx, cb)]);
    GAME_PAIRS[i % 4].forEach(g => ctx.steps.push([GAMES[g][0], cb => GAMES[g][1](ctx, cb)]));
    if (L.sents) ctx.steps.push(['Предложения', cb => sentBuild(ctx, sample(L.sents, 2), cb)]);
    ctx.steps.push(['Мини-тест', cb => quiz({ ctx, mode: 'see', counted: true, title: 'Мини-тест', items: sample(L.words, Math.min(5, L.words.length)) }, cb)]);
  }
  runSteps(ctx, () => reward(ctx));
}

/* Грамматика: карточка с правилом */
function ruleCard(ctx, cb) {
  const r = ctx.L.rule;
  frame(ctx, `<div class="card"><div class="story">${ctx.L.story}</div><h2>${r.title}</h2><div class="rule">${r.html}</div>
    <h3>Примеры (нажми — робот прочитает):</h3>
    ${r.ex.map((e, k) => `<button class="btn sec exb" data-k="${k}">🔊 ${e[0]}<br><small>${e[1]}</small></button>`).join('')}
    <p class="center"><button class="btn gold" id="go">Понятно, играем ➜</button></p></div>`);
  app.querySelectorAll('.exb').forEach(b => b.onclick = () => speak(r.ex[+b.dataset.k][0]));
  $('go').onclick = cb;
}

/* Чтение: текст с озвучкой и переводом */
function readCard(ctx, cb) {
  const t = ctx.L.text; let showRu = false;
  const draw = () => {
    frame(ctx, `<div class="card">${ctx.L.story ? `<div class="story">${ctx.L.story}</div>` : ''}<h2>${ctx.L.icon} ${ctx.L.title}</h2>
      <p>Нажимай на строки — робот прочитает. Прочитай текст вслух!</p>
      ${t.map((s, k) => `<button class="btn sec exb" data-k="${k}">🔊 ${s.en}${showRu ? `<br><small>${s.ru}</small>` : ''}</button>`).join('')}
      <p class="center"><button class="btn small" id="rd">🔊 Прочитать всё</button><button class="btn small sec" id="tr">${showRu ? 'Скрыть перевод' : 'Показать перевод'}</button></p>
      <p class="center"><button class="btn gold" id="go">${ctx.L.nextLabel || 'Вопросы по тексту ➜'}</button></p></div>`);
    app.querySelectorAll('.exb').forEach(b => b.onclick = () => speak(t[+b.dataset.k].en));
    $('rd').onclick = () => speak(t.map(s => s.en).join(' '));
    $('tr').onclick = () => { showRu = !showRu; draw(); };
    $('go').onclick = cb;
  };
  draw();
}

/* Чтение: расставь события сказки по порядку */
function storyOrder(ctx, cb) {
  const ev = ctx.L.order.map(i => ctx.L.text[i]); let pos = 0, wrong = 0;
  const idx = shuffle(ev.map((_, k) => k));
  frame(ctx, `<div class="card center"><h3>Расставь события по порядку</h3><p>Нажимай на события в том порядке, как они были в сказке.</p>
    <div class="lyrics" id="placed">${ev.map((_, k) => `<div class="sl slot-ev" data-k="${k}">${k + 1}. ...</div>`).join('')}</div>
    <div id="msg" class="msg">&nbsp;</div>
    <div class="lyrics">${idx.map(k => `<button class="btn sec exb evt" data-k="${k}">${ev[k].en}<br><small>${ev[k].ru}</small></button>`).join('')}</div></div>`);
  const slots = app.querySelectorAll('.slot-ev');
  app.querySelectorAll('.evt').forEach(b => b.onclick = () => {
    if (pos >= ev.length) return;
    const k = +b.dataset.k;
    if (k === pos) {
      slots[pos].innerHTML = `${pos + 1}. ${ev[k].en}`; slots[pos].classList.add('on'); b.disabled = true; b.style.visibility = 'hidden';
      speak(ev[k].en); sfx('ok'); pos++;
      if (pos === ev.length) {
        $('msg').textContent = praise(); ctx.asked++; if (wrong === 0) ctx.ok++; logQ(wrong === 0);
        waitSpeech(1600, cb);
      }
    } else {
      wrong++; b.classList.add('bad'); sfx('bad'); $('msg').textContent = 'Почти! Что было раньше всего? 💪';
      setTimeout(() => b.classList.remove('bad'), 450);
      if (wrong >= 2) { const h = [...app.querySelectorAll('.evt')].find(x => !x.disabled && +x.dataset.k === pos); if (h) h.classList.add('hint'); }
    }
  });
}

/* Грамматика: вставь пропущенное слово */
function gapQuiz(o, done) {
  const ctx = o.ctx, total = o.items.length; let i = 0;
  const next = () => (i >= total ? done() : ask(o.items[i]));
  function ask(g) {
    let tries = 0, locked = false;
    const head = o.boss
      ? `<div>${o.bossIcon || '👾'} <span class="hp"><i style="width:${(total - i) / total * 100}%"></i></span></div>`
      : `<div class="prog">${o.items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
    const hasGap = g.en.includes('___');
    const full = g.en.replace('___', g.ans);
    frame(ctx, `<div class="card center">${head}${o.title ? `<h3>${o.title}</h3>` : `<h3>${hasGap ? 'Выбери подходящее слово' : 'Выбери правильный ответ'}</h3>`}
      <p class="ru">${g.ru}</p><div class="gsent">${g.en.replace('___', '<span class="gap" id="gp">___</span>')}</div>
      <p><button class="speak" id="sp">🔊</button></p><div id="msg" class="msg">&nbsp;</div>
      <div class="opts gapo ${hasGap ? '' : 'long'}">${shuffle(g.opts).map(x => `<button class="opt gapb" data-v="${x}"><span class="ot">${q.em && q.em[x] ? q.em[x] + ' ' : ''}${x}</span></button>`).join('')}</div></div>`);
    $('sp').onclick = () => speak(full);
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return;
      if (b.dataset.v === g.ans) {
        locked = true; b.classList.add('good'); sfx('ok');
        if (hasGap) { $('gp').textContent = g.ans; $('gp').classList.add('okgap'); }
        speak(full);
        $('msg').textContent = praise();
        if (o.counted) { ctx.asked++; if (tries === 0) ctx.ok++; }
        grSrs(g, tries === 0); save();
        i++; waitSpeech(1700, next);
      } else {
        if (shieldUse(ctx)) { b.classList.add('bad'); b.disabled = true; sfx('bad'); $('msg').textContent = '🛡️ Щит защитил: ошибка не считается!'; return; }
        tries++; b.classList.add('bad'); b.disabled = true; sfx('bad'); $('msg').textContent = 'Почти! Прочитай перевод и попробуй ещё 💪';
        if (tries >= 2) app.querySelectorAll('.opt').forEach(x => { if (x.dataset.v === g.ans) x.classList.add('hint'); });
      }
    });
    hintUI(ctx, () => {
      const bad = [...app.querySelectorAll('.opt')].filter(x => x.dataset.v !== g.ans && !x.disabled);
      if (bad.length < 2) return false;
      shuffle(bad).slice(0, Math.min(2, bad.length - 1)).forEach(x => { x.disabled = true; x.style.opacity = '.3'; });
      tries = Math.max(tries, 1); return true;
    });
  }
  next();
}

/* Собери предложение из слов */
function sentBuild(ctx, items, cb) {
  let i = 0;
  const ask = () => {
    if (i >= items.length) return cb();
    const s = items[i], tk = s.en.split(' '); let pos = 0, wrong = 0;
    frame(ctx, `<div class="card center"><div class="prog">${items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <h3>Собери предложение</h3><p class="ru">${s.ru}</p><p><button class="speak" id="sp">🔊</button></p>
      <div class="sline">${tk.map(() => '<span class="sw"></span>').join('')}</div><div id="msg" class="msg">&nbsp;</div>
      <div class="tiles">${shuffle(tk.map((t, k) => k)).map(k => `<button class="tile wt" data-t="${tk[k]}">${tk[k]}</button>`).join('')}</div></div>`);
    $('sp').onclick = () => speak(s.en);
    speakLater(s.en, 350);
    const slots = app.querySelectorAll('.sw');
    app.querySelectorAll('.tile').forEach(t => t.onclick = () => {
      if (pos >= tk.length) return;
      if (t.dataset.t === tk[pos]) {
        slots[pos].textContent = tk[pos]; slots[pos].classList.add('f'); t.disabled = true; pos++; sfx('ok');
        if (pos === tk.length) {
          $('msg').textContent = praise(); speak(s.en); ctx.asked++; if (wrong === 0) ctx.ok++; logQ(wrong === 0);
          i++; waitSpeech(1700, ask);
        }
      } else {
        wrong++; t.classList.add('bad'); sfx('bad'); $('msg').textContent = 'Почти! Подумай, какое слово идёт дальше 💪';
        setTimeout(() => t.classList.remove('bad'), 450);
        if (wrong >= 2) { const h = [...app.querySelectorAll('.tile')].find(x => !x.disabled && x.dataset.t === tk[pos]); if (h) h.classList.add('hint'); }
      }
    });
  };
  ask();
}

function intro(ctx, cb) {
  const ws = ctx.L.words; let i = 0;
  const show = () => {
    const w = WORDS[ws[i]]; ensureWord(w.id);
    frame(ctx, `<div class="card center">${i === 0 ? `<div class="story">${ctx.L.story}</div>` : ''}
      <div class="bigemoji">${w.e}</div>
      ${w.L ? `<div class="letter">${w.L}${w.L.toLowerCase()}</div>` : ''}
      <div class="en">${w.en}</div><div class="ru">${w.ru}</div>
      <p><button class="speak" id="sp">🔊</button></p>
      <p>Повтори вслух за роботом! (${i + 1} из ${ws.length})</p>
      <p>${i > 0 ? '<button class="btn sec" id="pv">⬅</button>' : ''}<button class="btn gold" id="nx">${i < ws.length - 1 ? 'Дальше ➜' : 'К играм ➜'}</button></p></div>`);
    $('sp').onclick = () => speak(w.en);
    speakLater(w.en, 350);
    if ($('pv')) $('pv').onclick = () => { i--; show(); };
    $('nx').onclick = () => { if (i < ws.length - 1) { i++; show(); } else { save(); cb(); } };
  };
  show();
}

function distract(id, n, ctx) {
  let pool = ctx.L.words.filter(x => x !== id);
  const seen = Object.keys(S.words).filter(x => x !== id && !pool.includes(x));
  pool = shuffle(pool).concat(shuffle(seen));
  if (pool.length < n) pool = pool.concat(shuffle(Object.keys(WORDS).filter(x => x !== id && !pool.includes(x))));
  return pool.slice(0, n);
}

/* Игра-вопросы: listen (слушай→картинка), see (картинка→слово), mine (слушай→блок со словом) */
function quiz(o, done) {
  const ctx = o.ctx, total = o.items.length; let i = 0;
  const next = () => (i >= total ? done() : ask(WORDS[o.items[i]]));
  function ask(w) {
    const mode = typeof o.mode === 'function' ? o.mode(i) : o.mode;
    const n = mode === 'mine' ? 6 : 4;
    const opts = shuffle([w.id].concat(distract(w.id, n - 1, ctx)));
    let tries = 0, locked = false;
    const head = o.boss
      ? `<div>${o.bossIcon || '👾'} <span class="hp"><i style="width:${(total - i) / total * 100}%"></i></span></div>`
      : `<div class="prog">${o.items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
    const prompt = mode === 'see'
      ? `<div class="bigemoji">${w.e}</div><p>Как это по-английски?</p>`
      : `<button class="speak" id="sp">🔊</button><p>${mode === 'mine' ? 'Найди блок с этим словом и копай!' : 'Послушай и найди картинку'}</p>`;
    const optHTML = opts.map(id => {
      const x = WORDS[id];
      return `<button class="opt ${mode}" data-id="${id}">${mode === 'listen' ? `<span class="oe">${x.e}</span>` : `<span class="ot">${x.en}</span>`}</button>`;
    }).join('');
    frame(ctx, `<div class="card center">${head}${o.title ? `<h3>${o.title}</h3>` : ''}${prompt}<div id="msg" class="msg">&nbsp;</div><div class="opts ${mode}">${optHTML}</div></div>`);
    if ($('sp')) { $('sp').onclick = () => speak(w.en); speakLater(w.en, 350); }
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return;
      if (b.dataset.id === w.id) {
        locked = true; b.classList.add('good'); sfx('ok'); speak(w.en);
        $('msg').textContent = praise();
        if (o.counted) { ctx.asked++; if (tries === 0) ctx.ok++; }
        srs(w.id, tries === 0); save(); i++;
        waitSpeech(1200, next);
      } else {
        if (shieldUse(ctx)) { b.classList.add('bad'); b.disabled = true; sfx('bad'); $('msg').textContent = '🛡️ Щит защитил: ошибка не считается!'; return; }
        tries++; b.classList.add('bad'); b.disabled = true; sfx('bad');
        $('msg').textContent = 'Почти! Попробуй ещё 💪';
        if (tries >= 2) app.querySelectorAll('.opt').forEach(x => { if (x.dataset.id === w.id) x.classList.add('hint'); });
      }
    });
    hintUI(ctx, () => {
      const bad = [...app.querySelectorAll('.opt')].filter(x => x.dataset.id !== w.id && !x.disabled);
      if (bad.length < 2) return false;
      shuffle(bad).slice(0, 2).forEach(x => { x.disabled = true; x.style.opacity = '.3'; });
      tries = Math.max(tries, 1); return true;
    });
  }
  next();
}

/* Игра «Найди пару» */
function memory(ctx, cb) {
  const ids = sample(ctx.L.words, Math.min(6, ctx.L.words.length));
  const cards = shuffle(ids.flatMap(id => [{ id, t: 'e' }, { id, t: 'w' }]));
  frame(ctx, `<div class="card center"><h3>Найди пары: картинка и слово</h3><div id="msg" class="msg">&nbsp;</div>
    <div class="mem">${cards.map((c, k) => `<button class="mc" data-k="${k}"><span class="b">⛏️</span><span class="f ${c.t}">${c.t === 'e' ? WORDS[c.id].e : WORDS[c.id].en}</span></button>`).join('')}</div></div>`);
  let open = [], matched = 0, mism = 0, lock = false;
  app.querySelectorAll('.mc').forEach(b => b.onclick = () => {
    const k = +b.dataset.k;
    if (lock || b.classList.contains('open') || b.classList.contains('ok')) return;
    b.classList.add('open');
    if (cards[k].t === 'w') speak(WORDS[cards[k].id].en);
    open.push(k);
    if (open.length < 2) return;
    const [a, c] = open; open = [];
    if (cards[a].id === cards[c].id) {
      matched++; sfx('ok'); $('msg').textContent = praise();
      app.querySelectorAll('.mc').forEach(x => { if (+x.dataset.k === a || +x.dataset.k === c) { x.classList.remove('open'); x.classList.add('ok'); } });
      speak(WORDS[cards[a].id].en);
      if (matched === ids.length) {
        ctx.asked += ids.length; ctx.ok += ids.length - Math.min(ids.length, Math.floor(mism / 2));
        logQn(ids.length, ids.length - Math.min(ids.length, Math.floor(mism / 2)));
        ids.forEach(id => ensureWord(id)); save(); sfx('win');
        waitSpeech(1400, cb);
      }
    } else {
      mism++; lock = true; sfx('bad'); $('msg').textContent = 'Не пара. Запомни и попробуй ещё!';
      setTimeout(() => { app.querySelectorAll('.mc.open').forEach(x => x.classList.remove('open')); lock = false; }, 1000);
    }
  });
}

/* Игра «Собери слово» */
function build(ctx, cb) {
  const cand = ctx.L.words.filter(id => WORDS[id].en.length <= 8);
  const ids = sample(cand, Math.min(4, cand.length)); let i = 0;
  const ask = () => {
    if (i >= ids.length) return cb();
    const w = WORDS[ids[i]], word = w.en; let pos = 0, wrong = 0;
    const tiles = shuffle(word.split(''));
    frame(ctx, `<div class="card center"><div class="prog">${ids.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <h3>Собери слово из букв</h3><div class="bigemoji">${w.e}</div><button class="speak" id="sp">🔊</button>
      <div class="slots">${word.split('').map(() => '<span class="slot"></span>').join('')}</div>
      <div id="msg" class="msg">&nbsp;</div>
      <div class="tiles">${tiles.map(ch => `<button class="tile" data-ch="${ch}">${ch}</button>`).join('')}</div></div>`);
    $('sp').onclick = () => speak(w.en); speakLater(w.en, 350);
    const slots = app.querySelectorAll('.slot');
    app.querySelectorAll('.tile').forEach(t => t.onclick = () => {
      if (pos >= word.length) return;
      if (t.dataset.ch === word[pos]) {
        slots[pos].textContent = word[pos]; slots[pos].classList.add('f'); t.disabled = true; pos++; sfx('ok');
        if (pos === word.length) {
          $('msg').textContent = praise(); speak(word);
          ctx.asked++; if (wrong === 0) ctx.ok++;
          srs(w.id, wrong === 0); save(); i++; waitSpeech(1300, ask);
        }
      } else {
        wrong++; t.classList.add('bad'); sfx('bad'); $('msg').textContent = 'Почти! Попробуй другую букву 💪';
        setTimeout(() => t.classList.remove('bad'), 450);
        if (wrong >= 2) { const h = [...app.querySelectorAll('.tile')].find(x => !x.disabled && x.dataset.ch === word[pos]); if (h) h.classList.add('hint'); }
      }
    });
  };
  ask();
}

/* ---------- награда ---------- */
function reward(ctx) {
  const L = ctx.L, acc = ctx.asked ? ctx.ok / ctx.asked : 1;
  const stars = acc >= .9 ? 3 : acc >= .7 ? 2 : 1;
  const rec = S.lessons[L.id] || (S.lessons[L.id] = { stars: 0, done: false });
  const first = !rec.done, prevStars = rec.stars || 0;
  rec.done = true; rec.stars = Math.max(rec.stars, stars);
  logDone('les');
  // повторение тоже оплачивается, но вдвое меньше изучения; за одно и то же занятие в день — не больше двух раз
  if (S.repDay !== today()) { S.repDay = today(); S.repCnt = {}; }
  const times = S.repCnt[L.id] = (S.repCnt[L.id] || 0) + 1;
  const better = !first && stars > prevStars ? stars - prevStars : 0;
  let base = first ? 2 * stars + 5 + (ctx.boss ? 20 : 0) : (times <= 2 ? stars : 0) + 3 * better;
  const cb = (first || times <= 2) ? 2 * Math.floor(maxCombo / 5) : 0; base += cb;
  const xpGain = first ? 10 + 5 * stars + (ctx.boss ? 20 : 0) : times <= 2 ? 4 + 2 * stars : 2;
  addXp(xpGain);
  let em = Math.round(base * emMult()), potion = false;
  if (S.potionOn && base > 0) { em *= 2; potion = true; }
  if (S.potionOn && base > 0) S.potionOn = false;
  const sk = touchStreak(); em += sk.bonus;
  const before = petStage(); S.petXp += first ? stars : (times <= 2 ? 1 : 0); const after = petStage();
  S.emeralds += em; save(); sfx('win');
  const wd = W();
  const last = widx() + 1 >= WS().length;
  const extra = ctx.boss && first ? `<div class="cert"><h2>🏆 Сертификат героя 🏆</h2><p><b>${S.name}</b> ${wd.boss.cert ? wd.boss.cert + '<br>' + wd.name + '!' : 'победил(а) Забываку<br>и вернул(а) все слова: ' + wd.name + '!'}</p><p>${new Date().toLocaleDateString('ru-RU')}</p></div><p>${last ? 'Следующий мир — скоро!' : '🔓 Открыт следующий мир! Выбери его на карте.'}</p>` : '';
  const repNote = first ? '' : (times <= 2 ? '<p>🔁 Повторение: награда вдвое меньше, зато знания крепче!</p>' : '<p>🔁 Сегодня этот урок уже повторяли дважды: изумрудов за ещё один раз нет, лучше выбери другой урок или тренировку.</p>');
  app.innerHTML = `<div class="card center"><h1>${ctx.boss ? 'Босс побеждён! 🎉' : 'Урок пройден! 🎉'}</h1>
    <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '☆'}</span>`).join('')}</div>
    <p>Правильных с первой попытки: ${ctx.ok} из ${ctx.asked}</p>
    <p class="chip">+${em} 💎</p> <span class="chip">⭐ +${Math.round(xpGain * (1 + upLv('brain') * .15))} опыта</span>
    ${cb ? `<p>🔥 Комбо ×${maxCombo}: +${cb} 💎</p>` : ''}
    ${better ? `<p>📈 Результат лучше прежнего: +${3 * better} 💎</p>` : ''}
    ${emMult() > 1 ? `<p><small>Бонус экипировки и улучшений: +${Math.round((emMult() - 1) * 100)}%</small></p>` : ''}
    ${potion ? '<p>🧪 Зелье удвоило награду!</p>' : ''}
    ${sk.msg ? `<p>${sk.msg}</p>` : ''}
    ${lvlNote ? `<p>${lvlNote}</p>` : ''}
    ${repNote}
    ${after > before ? `<p>${petE(after)} ${S.petName || 'Кубик'} вырос! Теперь он — ${PET_STAGES[after][2]}!</p>` : `<p>${petE(after)} ${S.petName || 'Кубик'} стал чуть сильнее</p>`}
    ${stars < 3 ? '<p>Хочешь 3 звезды? Можно пройти ещё раз — это быстро!</p>' : ''}
    ${extra}
    <p><button class="btn gold" id="mp">На карту ➜</button><button class="btn sec" id="rp">Ещё раз</button></p></div>`;
  $('mp').onclick = map; $('rp').onclick = () => (ctx.boss ? startBoss() : startLesson(ctx.i));
}

/* ---------- босс ---------- */
function startBoss() {
  if (isGen()) return mathBoss();
  const BS = W().boss, bi = BS.bossIcon || '👾';
  const vocab = [].concat(...W().lessons.filter(l => l.words).map(l => l.words)).filter((x, k, a) => a.indexOf(x) === k);
  const gaps = [].concat(...W().lessons.filter(l => l.gaps).map(l => l.gaps));
  const L = { id: BS.id, title: BS.title, words: vocab };
  const ctx = { L, i: -1, asked: 0, ok: 0, boss: true };
  const modes = ['see', 'listen', 'mine'];
  ctx.steps = [
    ['Замок', cb => {
      frame(ctx, `<div class="card center"><h1>${BS.icon} ${BS.title}</h1><div class="bigemoji">${bi}</div>
        <p>«Ха-ха! Вы никогда не вернёте слова!»</p><p>Отвечай на вопросы — каждый верный ответ ранит босса. Ошибки не страшны, подсказки помогут!</p>
        <button class="btn gold" id="fi">В бой! ⚔️</button></div>`);
      $('fi').onclick = cb;
    }],
    ['Бой: слова', cb => quiz({ ctx, boss: true, bossIcon: bi, counted: true, mode: k => modes[k % 3], items: sample(vocab, gaps.length ? 8 : 10) }, cb)]
  ];
  if (gaps.length) ctx.steps.push(['Бой: грамматика', cb => gapQuiz({ ctx, boss: true, bossIcon: bi, counted: true, items: sample(gaps, 6) }, cb)]);
  runSteps(ctx, () => reward(ctx));
}

/* ---------- математика ---------- */
const specOf = a => ({ g: a[0], l: a[1] });
const mkey = sp => sp.g + sp.l;
const keySpec = k => ({ g: k.slice(0, -1), l: +k.slice(-1) });
// уровень сложности темы: стартовый + поправка, которую игра сама подбирает по ответам ребёнка
const mathLv = sp => { const r = S.mt[mkey(sp)]; return Math.max(1, Math.min(3, sp.l + (r ? r.adj || 0 : 0))); };
function mathNote(sp, ok) {
  const r = S.mt[mkey(sp)] || (S.mt[mkey(sp)] = { seen: 0, miss: 0, hist: [], adj: 0 });
  r.seen++; if (!ok) r.miss++;
  r.hist.push(ok ? 1 : 0); if (r.hist.length > 6) r.hist.shift();
  if (r.hist.length >= 5) {
    const acc = r.hist.reduce((a, b) => a + b, 0) / r.hist.length;
    if (acc >= 0.9 && sp.l + r.adj < 3) { r.adj++; r.hist = []; } else if (acc <= 0.5 && sp.l + r.adj > 1) { r.adj--; r.hist = []; }
  }
  r.last = today();
}
const mixSpecs = (gens, n) => shuffle(Array.from({ length: n }, (_, k) => specOf(gens[k % gens.length])));
const subjPrefix = () => S.subj === 'ru' ? 'r_' : S.subj === 'ow' ? 'o_' : S.subj === 'izo' ? 'i_' : '';
const mathWeak = (pref = subjPrefix()) => Object.keys(S.mt || {}).filter(k => pref ? k.startsWith(pref) : !/^[roi]_/.test(k)).filter(k => {
  const r = S.mt[k]; if (!r || (r.seen || 0) < 3) return false;
  const h = r.hist || [];
  return (h.length >= 3 ? h.reduce((a, b) => a + b, 0) / h.length : 1 - (r.miss || 0) / r.seen) < 0.7;
});
function mathTopicsHtml() {
  const rows = Object.keys(S.mt || {}).filter(k => S.mt[k].seen).map(k => {
    const r = S.mt[k], g = k.slice(0, -1), acc = Math.round(100 * (r.seen - r.miss) / r.seen);
    return `<tr><td>${MTOP[g] || g} (уровень ${Math.max(1, Math.min(3, +k.slice(-1) + (r.adj || 0)))})</td><td>${acc}%</td><td>задач: ${r.seen}</td></tr>`;
  }).join('');
  return rows ? `<table>${rows}</table><p><small>Уровень (1–3) игра подбирает сама: после 5 верных подряд задания усложняются, при ошибках — упрощаются.</small></p>` : '<p>Пока нет данных — ребёнок ещё не решал задачи.</p>';
}
function mathRule(ctx, cb) {
  const r = ctx.L.rule;
  frame(ctx, `<div class="card"><div class="story">${ctx.L.story}</div><h2>${r.title}</h2><div class="rule">${r.html}</div>
    <h3>Примеры:</h3>${r.ex.map(e => `<div class="exb mex"><b>${e[0]}</b><br><small>${e[1]}</small></div>`).join('')}
    <p class="center"><button class="btn gold" id="go">${ctx.L.go || 'Понятно, решаем ➜'}</button></p></div>`);
  $('go').onclick = cb;
}
let mathKeyFn = null;
document.addEventListener('keydown', e => { if (mathKeyFn) mathKeyFn(e); });
function mathQuiz(o, done) {
  const ctx = o.ctx, total = o.items.length, seen = new Set(); let i = 0;
  const next = () => { if (i >= total) { mathKeyFn = null; return done(); } ask(o.items[i]); };
  function askWord(sp, q) {
    let tries = 0, locked = false, buf = '';
    const norm = s => s.toLowerCase().replace(/ё/g, 'е');
    const head = o.boss
      ? `<div>${o.bossIcon || '👾'} <span class="hp"><i style="width:${(total - i) / total * 100}%"></i></span></div>`
      : `<div class="prog">${o.items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
    const letters = [...'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'];
    const box = () => `<b class="mbox wbox">${buf || '&nbsp;'}</b>`;
    frame(ctx, `<div class="card center">${head}${o.title ? `<h3>${o.title}</h3>` : ''}
      <div class="mq long">${q.q}</div>${q.sent ? `<div class="sent">${q.sent.replace('____', '<span class="gapb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')}</div>` : ''}<p class="clue">${q.clue || '&nbsp;'}</p>
      ${speechOn() ? '<p><button class="btn sec" id="rsay">🔊 Послушать</button></p>' : ''}
      <div class="mans" id="mans">${box()}</div>
      <div class="rukeys">${letters.map(c => `<button class="btn sec kp" data-k="${c}">${c}</button>`).join('')}<button class="btn sec kp" data-k="⌫">⌫</button><button class="btn gold kp" data-k="✓">✓</button></div>
      <div id="msg" class="msg">&nbsp;</div><div id="nxw"></div></div>`);
    const my = screenId;
    const count = ok => { if (o.counted) { ctx.asked++; if (ok) ctx.ok++; } mathNote(sp, ok); logQ(ok); save(); };
    const solved = () => { locked = true; sfx('ok'); $('msg').textContent = praise(); count(tries === 0); i++; setTimeout(() => { if (screenId === my) next(); }, 900); };
    const reveal = () => {
      locked = true; $('msg').innerHTML = `Правильно пишется: <b>${q.ans}</b><br><small>${q.why}</small>`; count(false); i++;
      $('nxw').innerHTML = '<p><button class="btn gold" id="nx">Дальше ➜</button></p>'; $('nx').onclick = next;
    };
    const wrong = () => {
      if (shieldUse(ctx)) { buf = ''; sfx('bad'); $('mans').innerHTML = box(); $('msg').textContent = '🛡️ Щит защитил: ошибка не считается!'; return; }
      tries++; buf = ''; sfx('bad'); $('mans').innerHTML = box(); if (tries >= 2) return reveal(); $('msg').textContent = 'Почти! Проверь буквы ещё раз 💪';
    };
    const submit = () => { if (locked || !buf) return; if (norm(buf) === norm(q.ans) || (q.alts || []).some(a => norm(a) === norm(buf))) { $('mans').innerHTML = box(); solved(); } else wrong(); };
    const press = k => {
      if (locked) return;
      if (k === '✓') return submit();
      if (k === '⌫') buf = buf.slice(0, -1); else if (buf.length < 16) buf += k;
      $('mans').innerHTML = box();
    };
    const sayIt = () => { try { const vs = speechSynthesis.getVoices(), v = vs.find(x => /^ru/i.test(x.lang)); if (!v) { $('msg').textContent = 'На этом устройстве нет русского голоса: читай подсказку 🙂'; return; } hardStop(); const u = new SpeechSynthesisUtterance(q.say); u.lang = 'ru-RU'; u.voice = v; u.rate = .7; speechSynthesis.speak(u); } catch (e) {} };
    app.querySelectorAll('.kp').forEach(b => b.onclick = () => press(b.dataset.k));
    if ($('rsay')) $('rsay').onclick = sayIt;
    hintUI(ctx, () => { $('msg').textContent = `💡 Слово начинается на «${q.ans[0].toLowerCase()}», в нём букв: ${q.ans.length}`; tries = Math.max(tries, 1); return true; });
    mathKeyFn = e => {
      if (screenId !== my) return;
      if (/^[а-яё]$/i.test(e.key)) press(e.key.toLowerCase()); else if (e.key === 'Backspace') press('⌫'); else if (e.key === 'Enter') press('✓');
    };
  }
  function ask(sp) {
    let q = MQ[sp.g](mathLv(sp));
    for (let t = 0; t < 25 && seen.has(q.q + (q.sent || '') + '|' + q.ans); t++) q = MQ[sp.g](mathLv(sp)); // тот же вопрос в одном задании не повторяем
    seen.add(q.q + (q.sent || '') + '|' + q.ans);
    if (q.word) return askWord(sp, q);
    const isEq = !q.opts && !q.parts && /x/.test(q.q);
    const parts = q.opts ? null : (q.parts || [{ l: isEq ? 'x' : '', a: q.ans }]);
    let tries = 0, locked = false, pi = 0, buf = '';
    const head = o.boss
      ? `<div>${o.bossIcon || '👾'} <span class="hp"><i style="width:${(total - i) / total * 100}%"></i></span></div>`
      : `<div class="prog">${o.items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
    const qtext = q.q + (q.opts || /[=?]/.test(q.q) || (q.parts && !isEq) ? '' : ' =');
    const boxes = () => parts.map((p, k) => `<div class="mrow ${k === pi ? 'cur' : ''}">${p.l ? `<span>${p.l}${p.l === 'x' ? ' =' : ':'}</span>` : ''}<b class="mbox">${k < pi ? p.a : k === pi ? (buf || '&nbsp;') : '&nbsp;'}</b></div>`).join('');
    frame(ctx, `<div class="card center">${head}${o.title ? `<h3>${o.title}</h3>` : ''}
      ${q.pic ? `<div class="qpic">${q.pic}</div>` : ''}<div class="mq${qtext.length > 34 ? ' long' : ''}">${qtext}</div>
      ${q.opts ? `<div class="opts mopts${q.opts.some(x => String(x).length > 8) ? ' longopts' : ''}">${q.opts.map(x => `<button class="opt" data-v="${x}"><span class="ot">${x}</span></button>`).join('')}</div>`
        : `<div class="mans" id="mans">${boxes()}</div><div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button class="btn kp ${k === '✓' ? 'gold' : 'sec'}" data-k="${k}">${k}</button>`).join('')}</div>`}
      <div id="msg" class="msg">&nbsp;</div><div id="nxw"></div></div>`);
    const my = screenId;
    const ansText = q.opts ? q.ans : parts.map(p => (p.l ? p.l + ' ' : '') + p.a).join(', ');
    const count = ok => { if (o.counted) { ctx.asked++; if (ok) ctx.ok++; } mathNote(sp, ok); logQ(ok); save(); };
    const solved = () => { locked = true; sfx('ok'); $('msg').textContent = praise(); count(tries === 0); i++; setTimeout(() => { if (screenId === my) next(); }, 900); };
    const reveal = () => {
      locked = true; $('msg').innerHTML = `Правильный ответ: <b>${ansText}</b><br><small>${q.why}</small>`; count(false); i++;
      $('nxw').innerHTML = '<p><button class="btn gold" id="nx">Дальше ➜</button></p>'; $('nx').onclick = next;
    };
    const wrong = () => {
      if (shieldUse(ctx)) { buf = ''; sfx('bad'); if (!q.opts) $('mans').innerHTML = boxes(); $('msg').textContent = '🛡️ Щит защитил: ошибка не считается!'; return; }
      tries++; buf = ''; sfx('bad'); if (!q.opts) $('mans').innerHTML = boxes(); if (tries >= 2) return reveal(); $('msg').textContent = 'Почти! Подумай ещё раз 💪'; };
    const submit = () => {
      if (locked || buf === '') return;
      if (+buf === parts[pi].a) { pi++; buf = ''; if (pi >= parts.length) return solved(); sfx('ok'); $('mans').innerHTML = boxes(); } else wrong();
    };
    const press = k => {
      if (locked || q.opts) return;
      if (k === '✓') return submit();
      if (k === '⌫') buf = buf.slice(0, -1); else if (buf.length < 8) buf += k;
      $('mans').innerHTML = boxes();
    };
    app.querySelectorAll('.kp').forEach(b => b.onclick = () => press(b.dataset.k));
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return;
      if (b.dataset.v === String(q.ans)) { b.classList.add('good'); solved(); } else { b.classList.add('bad'); b.disabled = true; wrong(); }
    });
    hintUI(ctx, () => {
      if (q.opts) {
        const bad = [...app.querySelectorAll('.opt')].filter(x => x.dataset.v !== String(q.ans) && !x.disabled);
        if (bad.length < 2) return false;
        bad[0].disabled = true; bad[0].style.opacity = '.3';
      } else {
        const a = parts[pi].a;
        $('msg').textContent = a >= 10 ? `💡 Ответ начинается с цифры ${String(a)[0]}` : `💡 Ответ от ${Math.max(0, a - 2)} до ${a + 2}`;
      }
      tries = Math.max(tries, 1); return true;
    });
    mathKeyFn = e => {
      if (screenId !== my) return;
      if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫'); else if (e.key === 'Enter') press('✓');
    };
  }
  next();
}
function mathBoss() {
  const BS = W().boss, specs = [];
  W().lessons.forEach(l => l.gens.forEach(g => specs.push(specOf(g))));
  const ctx = { L: { id: BS.id, title: BS.title }, i: -1, asked: 0, ok: 0, boss: true };
  ctx.steps = [
    ['Башня', cb => {
      frame(ctx, `<div class="card center"><h1>${BS.icon} ${BS.title}</h1><div class="bigemoji">${BS.bossIcon}</div>
        <p>${BS.story}</p><p>Каждый верный ответ ранит босса. Ошибки не страшны: после второй ошибки покажу решение!</p><button class="btn gold" id="fi">В бой! ⚔️</button></div>`);
      $('fi').onclick = cb;
    }],
    ['Бой', cb => mathQuiz({ ctx, boss: true, bossIcon: BS.bossIcon, counted: true, items: sample(specs, 12) }, cb)]
  ];
  runSteps(ctx, () => reward(ctx));
}
function mathTraining() {
  epoch++; newScreen();
  const weak = mathWeak();
  const ds = diarySpecs();
  let pool = ds.slice(0, 4).concat(weak.map(keySpec));
  if (!pool.length) pool = [].concat(...genWorlds().map(w => w.lessons)).filter(l => (S.lessons[l.id] || {}).done).flatMap(l => l.gens.map(specOf));
  if (!pool.length) { toast('Сначала пройди хотя бы один урок 🙂'); return; }
  const ctx = { L: { id: 'mtr', title: 'Тренировка' }, asked: 0, ok: 0 };
  ctx.steps = [[weak.length ? 'Слабые места' : 'Повторение', cb => mathQuiz({ ctx, counted: true, title: ds.length ? '📓 Подтягиваем темы из дневника' : weak.length ? '💪 Подтягиваем слабые места' : '🔁 Повторяем пройденное', items: shuffle(Array.from({ length: 10 }, (_, k) => pool[k % pool.length])) }, cb)]];
  runSteps(ctx, () => {
    const em = Math.round((2 + ctx.ok) * emMult()); addXp(5 + ctx.ok); S.emeralds += em; logDone('tr'); save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>Тренировка окончена! 💪</h1><p>Правильно с первой попытки: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>
      <p><button class="btn gold" id="mp">На карту ➜</button><button class="btn sec" id="rp">Ещё раз</button></p></div>`;
    $('mp').onclick = map; $('rp').onclick = mathTraining;
  });
}

/* ---------- магазин ---------- */
const SHOP_TABS = [
  { k: 'hat', t: '🎩 Шляпы', src: HATS, none: 'Без шляпы' }, { k: 'face', t: '😎 Лицо', src: FACES, none: 'Без украшения' },
  { k: 'back', t: '🧣 Спина', src: BACKS, none: 'Без украшения' }, { k: 'hand', t: '⛏️ В руке', src: HANDS, none: 'Пусто' },
  { k: 'hue', t: '🎨 Цвет' }, { k: 'pet', t: '🐾 Питомцы' }, { k: 'theme', t: '🗺️ Фон' },
  { k: 'title', t: '🏷️ Звание', src: TITLES, none: 'Без звания' },
  { k: 'up', t: '⚡ Улучшения' }, { k: 'cons', t: '🧪 Запасы' }
];
let shopTab = 'up';
// карточка редкого предмета: открыт, если получена нужная ачивка
function rareCard(it, pic, key, on, onLabel, offLabel, extra = '') {
  const a = ACH.find(x => x.id === it.a);
  if (S.ach[it.a]) {
    return `<div class="item rare">${pic}⭐ ${it.n}<br>${extra}<button class="btn small ${on ? 'gold' : 'sec'}" data-eq="${key}">${on ? onLabel : offLabel}</button></div>`;
  }
  return `<div class="item rare lock"><div class="ie">🔒</div>${it.n}<br><small>🏆 Награда за «${a ? a.t : '?'}»</small></div>`;
}
const owns = (key, p) => p === 0 || S.owned.includes(key);

function shop() {
  const tab = SHOP_TABS.find(t => t.k === shopTab) || SHOP_TABS[0];
  const btn = (own, on, key, p, onLabel, offLabel) => own
    ? `<button class="btn small ${on ? 'gold' : 'sec'}" data-eq="${key}">${on ? onLabel : offLabel}</button>`
    : `<button class="btn small ${S.emeralds >= p ? '' : 'sec'}" data-buy="${key}" data-p="${p}">💎 ${p}</button>${S.emeralds >= p ? '' : `<button class="btn small ${S.goal && S.goal.k === key ? 'gold' : 'sec'}" data-goal="${key}" data-p="${p}" title="Копить на это">🎯</button>`}`;
  let cards = '', head = '';
  if (tab.src) {
    cards = Object.keys(tab.src).sort((a, b) => tab.src[a].p - tab.src[b].p).map(k => {
      const it = tab.src[k];
      if (it.a) return rareCard(it, `<div class="ie">${it.e}</div>`, k, S[tab.k] === k, 'Надето ✓', 'Надеть');
      const pk = perkOf(it);
      return `<div class="item"><div class="ie">${it.e}</div>${it.n}${pk ? `<br><small>⚡ +${pk}% 💎</small>` : ''}<br>${btn(owns(k, 0) && S.owned.includes(k), S[tab.k] === k, k, it.p, 'Надето ✓', 'Надеть')}</div>`;
    }).join('') + (S[tab.k] ? `<div class="item"><div class="ie">🚫</div>${tab.none}<br><button class="btn small sec" data-eq="">Снять</button></div>` : '');
  } else if (tab.k === 'up') {
    head = `<p>Улучшения работают всегда и усиливаются с уровнем. Экипировка с ценой от 100 💎 тоже даёт бонус к изумрудам, пока надета: сейчас <b>+${gearPerk()}%</b>.</p>`;
    cards = Object.keys(UPGRADES).map(k => {
      const u = UPGRADES[k], lv = upLv(k), max = u.cost.length;
      const pips = [...Array(max)].map((_, i) => i < lv ? '🟩' : '⬜').join('');
      const nextP = u.cost[lv];
      return `<div class="item up"><div class="ie">${u.e}</div><b>${u.n}</b><br><small>${lv ? u.d(lv) : 'Ещё не куплено'}</small><br>${pips}<br>`
        + (lv >= max ? '<small>Максимум ✓</small>' : `<small>Дальше: ${u.d(lv + 1)}</small><br><button class="btn small ${S.emeralds >= nextP ? '' : 'sec'}" data-up="${k}" data-p="${nextP}">⬆ 💎 ${nextP}</button>${S.emeralds >= nextP ? '' : `<button class="btn small ${S.goal && S.goal.k === 'up_' + k + '_' + (lv + 1) ? 'gold' : 'sec'}" data-goal="up_${k}_${lv + 1}" data-p="${nextP}" title="Копить на это">🎯</button>`}`) + '</div>';
    }).join('');
  } else if (tab.k === 'cons') {
    head = '<p>Расходуемые вещи: пригодятся в нужный момент. Зелье включается кнопкой «Выпить» перед уроком.</p>';
    cards = Object.keys(CONS).map(k => {
      const c = CONS[k], n = (S.inv && S.inv[k]) || 0, full = n >= c.max;
      return `<div class="item"><div class="ie">${c.e}</div><b>${c.n}</b><br><small>${c.d}</small><br><small>В запасе: <b>${n}</b></small><br>`
        + `<button class="btn small ${S.emeralds >= c.p && !full ? '' : 'sec'}" data-cons="${k}" data-p="${c.p}">${full ? 'Полный запас' : '💎 ' + c.p}</button>`
        + (k === 'potion' && n > 0 ? `<button class="btn small ${S.potionOn ? 'gold' : ''}" data-drink="1">${S.potionOn ? 'Действует ✓' : '🧪 Выпить'}</button>` : '') + '</div>';
    }).join('');
  } else if (tab.k === 'hue') {
    cards = HUES.map(h => {
      const key = 'hue' + h.h;
      return `<div class="item"><div class="ie">${hero(48, h.h)}</div>${h.n}<br>${btn(owns(key, h.p), S.hue === h.h, key, h.p, 'Выбран ✓', 'Выбрать')}</div>`;
    }).join('');
  } else if (tab.k === 'pet') {
    head = `<p>Имя питомца: <input type="text" id="pn" maxlength="12" value="${(S.petName || 'Кубик').replace(/"/g, '&quot;')}" style="max-width:220px"></p>`;
    cards = Object.keys(PET_LINES).sort((a, b) => PET_LINES[a].p - PET_LINES[b].p).map(k => {
      const p = PET_LINES[k], key = 'pet_' + k;
      if (p.a) return rareCard(p, `<div class="ie">${p.line[3]}</div>`, k, S.pet === k, 'Мой питомец ✓', 'Выбрать', `<small>${p.line.slice(1).join(' ')}</small><br>`);
      return `<div class="item"><div class="ie">${p.line[3]}</div>${p.n}<br><small>${p.line.slice(1).join(' ')}</small><br>${btn(owns(key, p.p), S.pet === k, key, p.p, 'Мой питомец ✓', 'Выбрать')}</div>`;
    }).join('');
  } else {
    cards = Object.keys(THEMES).sort((a, b) => THEMES[a].p - THEMES[b].p).map(k => {
      const t = THEMES[k];
      if (t.a) return rareCard(t, `<div class="swatch" style="background:${t.bg}"></div>`, k, S.theme === k, 'Выбран ✓', 'Выбрать');
      return `<div class="item"><div class="swatch" style="background:${t.bg}"></div>Фон: ${t.n}<br>${btn(owns(k, t.p) || S.owned.includes(k), S.theme === k, k, t.p, 'Выбран ✓', 'Выбрать')}</div>`;
    }).join('');
  }
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center">${hero(90)} <span class="pet">${petE(petStage())}</span></div><span class="chip">💎 ${S.emeralds}</span></div>
    <div class="card"><div class="center">${SHOP_TABS.map(t => `<button class="btn small ${t.k === tab.k ? 'gold' : 'sec'}" data-tab="${t.k}">${t.t}</button>`).join('')}</div>
      ${head}<div class="shop" style="margin-top:12px">${cards}</div></div>`;
  $('bk').onclick = map;
  app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { shopTab = b.dataset.tab; shop(); });
  if ($('pn')) $('pn').oninput = e => { S.petName = e.target.value.trim() || 'Кубик'; save(); };
  const equip = key => {
    if (tab.src) S[tab.k] = key || null;
    else if (tab.k === 'hue') S.hue = +key.replace('hue', '');
    else if (tab.k === 'pet') S.pet = key.replace('pet_', '');
    else { S.theme = key; applyTheme(); }
    save(); shop();
  };
  app.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => equip(b.dataset.eq));
  app.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => {
    const k = b.dataset.goal;
    S.goal = (S.goal && S.goal.k === k) ? null : { k, p: +b.dataset.p };
    save(); toast(S.goal ? '🎯 Цель выбрана: ' + goalKeyName(k) : 'Цель снята'); shop();
  });
  app.querySelectorAll('[data-up]').forEach(b => b.onclick = () => {
    const k = b.dataset.up, p = +b.dataset.p;
    if (S.emeralds < p) return toast(`Не хватает ${p - S.emeralds} 💎. Копи изумруды: уроки, повторение и задание дня!`);
    S.emeralds -= p; S.up = S.up || {}; S.up[k] = upLv(k) + 1; sfx('ok'); save(); toast(UPGRADES[k].e + ' ' + UPGRADES[k].n + ': уровень ' + S.up[k] + '!'); shop();
    setTimeout(checkAch, 300);
  });
  app.querySelectorAll('[data-cons]').forEach(b => b.onclick = () => {
    const k = b.dataset.cons, c = CONS[k], p = +b.dataset.p; S.inv = S.inv || {};
    if ((S.inv[k] || 0) >= c.max) return toast('Запас уже полный');
    if (S.emeralds < p) return toast(`Не хватает ${p - S.emeralds} 💎`);
    S.emeralds -= p; S.inv[k] = Math.min(c.max, (S.inv[k] || 0) + (c.pack || 1)); sfx('ok'); save(); shop();
  });
  app.querySelectorAll('[data-drink]').forEach(b => b.onclick = () => {
    if (S.potionOn || !(S.inv && S.inv.potion > 0)) return;
    S.inv.potion--; S.potionOn = true; save(); toast('🧪 Зелье выпито: следующий урок даст ×2 💎'); shop();
  });
  app.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
    const p = +b.dataset.p;
    if (S.emeralds < p) return toast(`Не хватает ${p - S.emeralds} 💎. Пройди ещё урок! 💎`);
    S.emeralds -= p; S.owned.push(b.dataset.buy); sfx('ok'); equip(b.dataset.buy);
    setTimeout(checkAch, 300);
  });
}

/* ---------- родителям ---------- */
/* ---------- «Ещё» и PIN для родителей ---------- */
function more() {
  epoch++; newScreen();
  app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Карта</button><h2>📚 Ещё</h2>
    <div class="moregrid"><button class="btn" id="m1">💬 Диалоги</button><button class="btn" id="m2">🎵 Песенки</button><button class="btn" id="m3">🎧 Аудирование</button><button class="btn" id="m4">📖 Словарик</button></div></div>`;
  $('bk').onclick = map; $('m1').onclick = dialogs; $('m2').onclick = songs; $('m3').onclick = listening; $('m4').onclick = vocab;
}
const PIN_KEY = 'engAdventure_pin';
// сброс PIN: по семейному коду (если включено облако) или решив пример, который ребёнку не под силу
function pinReset() {
  epoch++; newScreen();
  const a = 37 + Math.floor(Math.random() * 40), b = 23 + Math.floor(Math.random() * 40);
  const viaCloud = cloudOn();
  app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Назад</button><h2>Сброс PIN-кода</h2>
    <p>${viaCloud ? 'Введите семейный код (он показан в облаке на любом другом устройстве):' : 'Для родителей: сколько будет ' + a + ' × ' + b + '?'}</p>
    <input type="text" id="pa" maxlength="12" ${viaCloud ? 'style="text-transform:uppercase"' : 'inputmode="numeric"'}>
    <p><button class="btn gold" id="ok">Сбросить</button></p><p class="pmsg" id="pm">&nbsp;</p></div>`;
  $('bk').onclick = parentGate;
  $('ok').onclick = () => {
    const v = $('pa').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const good = viaCloud ? v === CL.code : +v === a * b;
    if (!good) { $('pm').textContent = 'Неверно'; return; }
    try { localStorage.removeItem(PIN_KEY); } catch (e) {}
    parentGate();
  };
}
const getPin = () => { try { return localStorage.getItem(PIN_KEY) || ''; } catch (e) { return ''; } };
// дневник открывается на ребёнке с тем же именем, что и у игрока (если такой есть)
function diaryHref() {
  try {
    const st = JSON.parse(localStorage.getItem('school-off:v1')) || {};
    const c = (st.children || []).find(x => String(x.name).trim().toLowerCase() === String(S.name).trim().toLowerCase());
    return 'school/index.html' + (c ? '#/child/' + c.id + '/diary' : '');
  } catch (e) { return 'school/index.html'; }
}
function parentGate() {
  epoch++; newScreen();
  const have = getPin();
  let step = have ? 'enter' : 'new', first = '', cur = '';
  const draw = (msg) => {
    const title = step === 'enter' ? 'Введите PIN-код' : step === 'new' ? 'Придумайте PIN-код (4 цифры)' : 'Повторите PIN-код';
    app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Карта</button><h2>🔒 Для родителей</h2>
      <p>${title}</p><div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < cur.length ? 'on' : ''}"></i>`).join('')}</div>
      <p class="pmsg">${msg || '&nbsp;'}</p>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, ''].map(k => k === '' ? '<span></span>' : `<button class="btn" data-k="${k}">${k}</button>`).join('')}</div>
      ${step === 'enter' ? '<p><button class="btn small sec" id="fg">Забыли код?</button></p>' : ''}</div>`;
    if ($('fg')) $('fg').onclick = pinReset;
    $('bk').onclick = map;
    app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if (k === '⌫') cur = cur.slice(0, -1); else if (cur.length < 4) cur += k;
      if (cur.length < 4) return draw();
      if (step === 'enter') {
        if (cur === have) return parent();
        cur = ''; return draw('Неверный код, попробуйте ещё раз');
      }
      if (step === 'new') { first = cur; cur = ''; step = 'again'; return draw(); }
      if (cur === first) { try { localStorage.setItem(PIN_KEY, cur); } catch (e) {} cloudPin(); return parent(); }
      cur = ''; first = ''; step = 'new'; draw('Коды не совпали, начните заново');
    });
  };
  draw();
}

function diaryLinkHtml() {
  const sd = schoolData();
  if (!sd || !(sd.children || []).length) return '<p>Данных дневника на этом устройстве пока нет. Откройте дневник (📓 на карте) и добавьте ребёнка, либо включите облако, чтобы данные пришли с другого устройства.</p>';
  const ad = adaptLoad();
  const opts = '<option value="">Автоматически (по имени игрока)</option>' + sd.children.map(c => `<option value="${c.id}" ${S.schoolChild === c.id ? 'selected' : ''}>${esc(c.name)} (${esc(c.grade)} кл.)</option>`).join('');
  const sel = `<p>Какой ребёнок из дневника — это «${esc(S.name)}»: <select id="sch" style="font:inherit;font-size:1.05rem;padding:6px;border:3px solid #1b1b1b;border-radius:8px">${opts}</select></p>`;
  if (!ad) return sel + '<p>Совпадения по имени нет — выберите ребёнка из списка.</p>';
  const row = (sj, nm) => { const f = ad.a[sj]; return `<tr><td>${nm}</td><td>${f.avg === null ? 'нет оценок' : 'средний ' + f.avg}</td><td>${f.focus ? '📌 ' + esc(f.reasons.join(', ')) : 'всё хорошо'}${f.exams.length ? '<br>📅 ' + esc(f.exams[0].text) + ' (' + f.exams[0].days + ' дн.)' : ''}</td></tr>`; };
  const dl = (ad.a.eng.topics.length || ad.a.eng.exams.length) ? engDiaryLessons() : [];
  return `${sel}<table>${row('math', 'Математика')}${row('eng', 'Английский')}${row('ru', 'Русский язык')}${row('ow', 'Окружающий мир')}${row('izo', 'ИЗО')}</table>${dl.length ? `<p>📓 Темы английского из записей: ${dl.map(l => esc(l.title)).join(', ')} — они попадут в тренировку.</p>` : ''}<p><small>Игра сама подстраивается: при просадке по предмету уроки получают больше повторений, темы из ваших записей (например, «таблица умножения») попадают в тренировку, а за проверенную вами домашку ребёнок получает изумруды.</small></p>`;
}
/* ---------- ИЗО: рисование по шагам и галерея ---------- */
const GAL = {
  db: null,
  open() {
    if (GAL.db) return Promise.resolve(GAL.db);
    return new Promise((res, rej) => { const r = indexedDB.open('engGallery', 1); r.onupgradeneeded = () => r.result.createObjectStore('g', { keyPath: 'id', autoIncrement: true }); r.onsuccess = () => { GAL.db = r.result; res(GAL.db); }; r.onerror = () => rej(r.error); });
  },
  tx(mode, fn) { return GAL.open().then(db => new Promise((res, rej) => { const t = db.transaction('g', mode), rq = fn(t.objectStore('g')); t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); })); },
  all() { return GAL.tx('readonly', s => s.getAll()); },
  add(r) { return GAL.tx('readwrite', s => s.add(r)); },
  put(r) { return GAL.tx('readwrite', s => s.put(r)); },
  del(id) { return GAL.tx('readwrite', s => s.delete(id)); }
};
const IZ_PAL = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#4fc3f7', '#1e63d8', '#8e24aa', '#f48fb1', '#795548', '#222222'];
function drawLesson(ctx, spec, done) {
  const tol = spec.tol || 24, steps = spec.steps, prev = [];
  let k = 0;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const near = (p, arr, r) => { for (let i = 0; i < arr.length; i++) if (dist(p, arr[i]) <= r) return true; return false; };
  const dots = () => `<div class="prog">${steps.map((_, n) => `<i class="${n < k ? 'd' : ''}"></i>`).join('')}</div>`;
  const shell = (title, text, btns) => frame(ctx, `<div class="card center">${dots()}<h3>${title}</h3><p class="dtxt">${text}</p>
    <canvas id="cv" width="640" height="480" class="dcv"></canvas><div class="dbtns">${btns}</div><div id="msg" class="msg">&nbsp;</div></div>`);
  const stroke = (g, pts, col, w, dash) => { if (pts.length < 1) return; g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []); g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); pts.forEach(p => g.lineTo(p[0], p[1])); if (pts.length === 1) g.lineTo(pts[0][0] + .1, pts[0][1]); g.stroke(); };
  const bg = g => { g.fillStyle = '#fffdf5'; g.fillRect(0, 0, 640, 480); };
  const attach = (cv, onStroke) => {
    let cur = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 640 / r.width, (e.clientY - r.top) * 480 / r.height]; };
    cv.style.touchAction = 'none';
    cv.onpointerdown = e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} cur = [pos(e)]; onStroke('start', cur); };
    cv.onpointermove = e => { if (!cur) return; e.preventDefault(); cur.push(pos(e)); onStroke('move', cur); };
    const end = () => { if (!cur) return; const c = cur; cur = null; onStroke('end', c); };
    cv.onpointerup = end; cv.onpointercancel = end;
  };
  const gallerySave = cv => { try { cv.toBlob(b => { if (b) GAL.add({ t: Date.now(), title: ctx.L.title, blob: b }).catch(() => {}); }, 'image/png'); } catch (e) {} };
  function colorStep() {
    const my0 = screenId;
    shell('Раскрась рисунок', 'Выбери цвет и раскрась рисунок, как хочешь. Потом нажми «Готово».', `${IZ_PAL.map(c => `<button class="sw" data-c="${c}" style="background:${c}"></button>`).join('')}<button class="btn small sec" id="clr">🧽 Заново</button><button class="btn gold" id="fin">Готово ✓</button>`);
    const my = screenId, cv = $('cv'), g = cv.getContext('2d');
    let col = IZ_PAL[0]; const paint = [];
    const redraw = () => { bg(g); paint.forEach(s => stroke(g, s.p, s.c, 26)); prev.forEach(s => stroke(g, s, '#333', 5)); };
    redraw();
    app.querySelectorAll('.sw').forEach(b => b.onclick = () => { col = b.dataset.c; app.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
    app.querySelector('.sw').classList.add('on');
    let live = null;
    attach(cv, (ph, pts) => { if (ph === 'start') { live = { c: col, p: pts }; paint.push(live); } redraw(); });
    $('clr').onclick = () => { paint.length = 0; redraw(); };
    $('fin').onclick = () => { if (screenId !== my) return; redraw(); gallerySave(cv); sfx('ok'); done(); };
  }
  function step() {
    if (k >= steps.length) return spec.color ? colorStep() : done();
    const st = steps[k], T = [].concat(...st.s), tries0 = { n: 0 };
    shell(`Шаг ${k + 1} из ${steps.length}`, st.t, '<button class="btn small sec" id="clr">🧽 Заново</button><button class="btn gold" id="chk">Готово ✓</button>');
    const my = screenId, cv = $('cv'), g = cv.getContext('2d');
    let mine = [], hint = false, locked = false;
    const redraw = () => {
      bg(g); prev.forEach(s => stroke(g, s, '#333', 5));
      st.s.forEach(s => { stroke(g, s, hint ? '#3b6fd8' : '#9db7ea', hint ? 9 : 7, [2, 14]); if (s.length) { g.fillStyle = '#2e7d32'; g.beginPath(); g.arc(s[0][0], s[0][1], 9, 0, 7); g.fill(); } });
      mine.forEach(s => stroke(g, s, '#d81b60', 6));
    };
    redraw();
    attach(cv, (ph, pts) => { if (locked) return; if (ph === 'start') mine.push(pts); redraw(); });
    $('clr').onclick = () => { if (locked) return; mine = []; redraw(); $('msg').innerHTML = '&nbsp;'; };
    hintUI(ctx, () => { hint = true; redraw(); $('msg').textContent = '💡 Зелёная точка — где начинать. Веди линию по точкам.'; tries0.n = Math.max(tries0.n, 1); return true; });
    const count = ok => { ctx.asked++; if (ok) ctx.ok++; logQ(ok); save(); };
    const accept = ok => { locked = true; count(ok); st.s.forEach(s => prev.push(s)); k++; setTimeout(() => { if (screenId === my) step(); }, ok ? 800 : 1400); };
    $('chk').onclick = () => {
      if (locked) return;
      const U = []; mine.forEach(s => { for (let i = 0; i < s.length; i++) { U.push(s[i]); if (i) { const n = Math.floor(dist(s[i - 1], s[i]) / 6); for (let j = 1; j <= n; j++) U.push([s[i - 1][0] + (s[i][0] - s[i - 1][0]) * j / (n + 1), s[i - 1][1] + (s[i][1] - s[i - 1][1]) * j / (n + 1)]); } } });
      if (U.length < 5) { $('msg').textContent = 'Сначала обведи пунктир пальцем ✏️'; return; }
      const P = [].concat(...prev);
      const cov = T.filter(p => near(p, U, tol)).length / T.length, prec = U.filter(p => near(p, T, tol * 1.7) || near(p, P, tol * 1.7)).length / U.length;
      if (cov >= .7 && prec >= .6) { sfx('ok'); $('msg').textContent = praise(); accept(tries0.n === 0); }
      else {
        tries0.n++;
        if (tries0.n >= 2) { sfx('bad'); hint = true; mine = []; redraw(); $('msg').textContent = 'Ничего, получится! Вот как надо. Идём дальше 🙂'; accept(false); }
        else { sfx('bad'); mine = []; redraw(); $('msg').textContent = cov < .7 ? 'Почти! Обведи пунктир до конца, от зелёной точки ✏️' : 'Почти! Старайся держаться ближе к пунктиру ✏️'; }
      }
    };
  }
  step();
}
const IZ_IDEAS = ['Космический корабль', 'Мой любимый зверь', 'Замок на горе', 'Робот-помощник', 'Домик в лесу', 'Подводный мир', 'Радуга после дождя', 'Дракон', 'Мой дом', 'Зимний вечер', 'Лето на море', 'Город будущего', 'Весёлый цветок', 'Корабль в шторм', 'Волшебная птица', 'Моя семья', 'Пещера с сокровищами', 'Ночное небо', 'Осенний лес', 'Машина мечты', 'Сказочный остров', 'Динозавр', 'Мой друг', 'Праздничный салют'];
const IZ_PAL2 = IZ_PAL.concat(['#ffffff', '#9e9e9e', '#b5e48c', '#7e57c2']);
function izoFree(rec) {
  epoch++; newScreen();
  app.innerHTML = `<div class="card center"><button class="btn small sec" id="bk">⬅ Карта</button><h3>🖌️ ${rec ? 'Дорисовываем: ' + esc(rec.title) : 'Свободное рисование'}</h3>
    <p class="dtxt" ${rec ? 'hidden' : ''}>💡 Идея: <b id="idea">${IZ_IDEAS[Math.floor(Math.random() * IZ_IDEAS.length)]}</b> <button class="btn small sec" id="dice">🎲 Другая</button></p>
    <canvas id="cv" width="640" height="480" class="dcv"></canvas>
    <div class="dbtns" id="pal">${IZ_PAL2.map(c => `<button class="sw" data-c="${c}" style="background:${c}"></button>`).join('')}</div>
    <div class="dbtns"><button class="btn small sec" data-sz="6">• Тонко</button><button class="btn small sec" data-sz="14">● Средне</button><button class="btn small sec" data-sz="28">⬤ Толсто</button>
      <button class="btn small sec" id="er">🧽 Ластик</button><button class="btn small sec" id="sym">🦋 Зеркало: выкл</button></div>
    <div class="dbtns"><button class="btn small sec" id="un">↩️ Отменить</button><button class="btn small red" id="cl">🗑️ Очистить</button><button class="btn gold" id="sv">💾 В галерею</button></div>
    <div id="msg" class="msg">&nbsp;</div></div>`;
  const my = screenId, cv = $('cv'), g = cv.getContext('2d'), BG = '#fffdf5';
  let col = IZ_PAL2[0], sz = 14, eraser = false, sym = false, base = null; const groups = [];
  if (rec) { const im = new Image(); im.onload = () => { base = im; redraw(); }; im.src = URL.createObjectURL(rec.blob); }
  const redraw = () => { g.fillStyle = BG; g.fillRect(0, 0, 640, 480); if (base) g.drawImage(base, 0, 0, 640, 480); g.lineCap = 'round'; g.lineJoin = 'round'; groups.forEach(gr => gr.forEach(s => { g.strokeStyle = s.c; g.lineWidth = s.w; g.beginPath(); g.moveTo(s.p[0][0], s.p[0][1]); s.p.forEach(p => g.lineTo(p[0], p[1])); if (s.p.length === 1) g.lineTo(s.p[0][0] + .1, s.p[0][1]); g.stroke(); })); };
  redraw();
  const mark = () => { app.querySelectorAll('.sw').forEach(x => x.classList.toggle('on', !eraser && x.dataset.c === col)); app.querySelectorAll('[data-sz]').forEach(x => x.classList.toggle('gold', +x.dataset.sz === sz)); $('er').classList.toggle('gold', eraser); };
  app.querySelectorAll('.sw').forEach(b => b.onclick = () => { col = b.dataset.c; eraser = false; mark(); });
  app.querySelectorAll('[data-sz]').forEach(b => b.onclick = () => { sz = +b.dataset.sz; mark(); });
  $('er').onclick = () => { eraser = !eraser; mark(); };
  $('sym').onclick = () => { sym = !sym; $('sym').textContent = '🦋 Зеркало: ' + (sym ? 'вкл' : 'выкл'); $('sym').classList.toggle('gold', sym); $('msg').textContent = sym ? 'Всё, что ты рисуешь слева, повторится справа — это симметрия!' : '\u00a0'; };
  $('un').onclick = () => { groups.pop(); redraw(); };
  $('cl').onclick = () => { if (!groups.length || confirm('Очистить рисунок?')) { groups.length = 0; redraw(); } };
  $('dice').onclick = () => { $('idea').textContent = IZ_IDEAS[Math.floor(Math.random() * IZ_IDEAS.length)]; };
  $('bk').onclick = map;
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 640 / r.width, (e.clientY - r.top) * 480 / r.height]; };
  let cur = null;
  cv.style.touchAction = 'none';
  cv.onpointerdown = e => {
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    const c = eraser ? BG : col, w = eraser ? Math.max(sz, 18) : sz, a = { c, w, p: [pos(e)] }, gr = [a];
    if (sym) gr.push({ c, w, p: [[640 - a.p[0][0], a.p[0][1]]], mir: a });
    groups.push(gr); cur = gr; redraw();
  };
  cv.onpointermove = e => { if (!cur) return; e.preventDefault(); const p = pos(e); cur[0].p.push(p); if (cur[1]) cur[1].p.push([640 - p[0], p[1]]); redraw(); };
  cv.onpointerup = cv.onpointercancel = () => { cur = null; };
  $('sv').onclick = () => {
    if (!groups.length) { $('msg').textContent = 'Сначала нарисуй что-нибудь ✏️'; return; }
    cv.toBlob(b => {
      if (!b || screenId !== my) return;
      const job = rec ? GAL.put({ id: rec.id, t: Date.now(), title: rec.title, blob: b }) : GAL.add({ t: Date.now(), title: 'Свободный рисунок: ' + $('idea').textContent, blob: b }).then(id => { rec = { id, title: 'Свободный рисунок: ' + $('idea').textContent, blob: b }; });
      job.then(() => {
        let extra = '';
        if (S.izoDay !== today()) { S.izoDay = today(); const em = Math.round(3 * emMult()); S.emeralds += em; addXp(5); extra = ` +${em} 💎 за рисунок дня!`; logDone('les'); }
        save(); sfx('ok'); if (screenId === my) $('msg').textContent = '✅ Рисунок сохранён в галерее! Его можно дорисовать позже.' + extra;
      }).catch(() => { if (screenId === my) $('msg').textContent = 'Не получилось сохранить: галерея недоступна.'; });
    }, 'image/png');
  };
  mark();
}
function izoGallery() {
  epoch++; newScreen();
  app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Карта</button><h2>🖼️ Моя галерея</h2><div id="gl" class="bkl"><small>Загрузка…</small></div><p id="gm"></p></div>`;
  $('bk').onclick = map;
  const draw = () => GAL.all().then(a => {
    a = (a || []).slice().reverse();
    $('gl').innerHTML = a.length ? a.map(r => `<div class="bki gi"><img src="${URL.createObjectURL(r.blob)}" alt=""><small>${esc(r.title)}</small><span><button class="btn small gold" data-e="${r.id}">✏️</button><button class="btn small" data-s="${r.id}">⬇️</button><button class="btn small red" data-d="${r.id}">✖</button></span></div>`).join('') : '<small>Здесь появятся твои рисунки. Раскрась рисунок в уроке ИЗО или нарисуй свой и сохрани. Любой рисунок можно дорисовать кнопкой ✏️.</small>';
    app.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { if (confirm('Удалить рисунок?')) GAL.del(+b.dataset.d).then(draw); });
    app.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { const r = a.find(x => x.id === +b.dataset.e); if (r) izoFree(r); });
    app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const r = a.find(x => x.id === +b.dataset.s); if (!r) return; const l = document.createElement('a'); l.href = URL.createObjectURL(r.blob); l.download = 'risunok-' + r.id + '.png'; document.body.appendChild(l); l.click(); l.remove(); });
  }).catch(() => { $('gm').textContent = 'Галерея недоступна в этом браузере.'; });
  draw();
}

/* ---------- фото учебников (оглавления): хранятся на устройстве, можно скачать и передать разработчику ---------- */
const BK = {
  db: null,
  open() {
    if (BK.db) return Promise.resolve(BK.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('engBooks', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('p', { keyPath: 'id', autoIncrement: true });
      r.onsuccess = () => { BK.db = r.result; res(BK.db); };
      r.onerror = () => rej(r.error);
    });
  },
  tx(mode, fn) { return BK.open().then(db => new Promise((res, rej) => { const t = db.transaction('p', mode), rq = fn(t.objectStore('p')); t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); })); },
  all() { return BK.tx('readonly', s => s.getAll()); },
  add(rec) { return BK.tx('readwrite', s => s.add(rec)); },
  del(id) { return BK.tx('readwrite', s => s.delete(id)); },
  shrink(file) {
    return new Promise((res, rej) => {
      const im = new Image(), u = URL.createObjectURL(file);
      im.onload = () => {
        const k = Math.min(1, 1800 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        c.toBlob(b => b ? res(b) : rej(new Error('toBlob')), 'image/jpeg', .82);
      };
      im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('img')); };
      im.src = u;
    });
  }
};
const BK_SUBJ = [['math', 'Математика'], ['ru', 'Русский язык'], ['ow', 'Окружающий мир'], ['izo', 'ИЗО'], ['eng', 'Английский'], ['other', 'Другое']];
function booksHtml() {
  const sel = (id, arr) => `<select id="${id}" style="font:inherit;font-size:1.05rem;padding:6px;border:3px solid #1b1b1b;border-radius:8px">${arr.map(a => `<option value="${a[0]}">${a[1]}</option>`).join('')}</select>`;
  return `<p>Сфотографируйте <b>оглавление</b> учебника (и, если есть, рабочей тетради), чтобы игра совпала с вашими темами. Фото остаются на этом устройстве.</p>
    <p>Предмет: ${sel('bks', BK_SUBJ)} Класс: ${sel('bkc', [[1, '1'], [2, '2'], [3, '3'], [4, '4']])}</p>
    <p><label class="btn small gold" style="display:inline-block">📷 Снять<input type="file" id="bkcam" accept="image/*" capture="environment" hidden></label>
    <label class="btn small" style="display:inline-block">🖼️ Из галереи<input type="file" id="bkgal" accept="image/*" multiple hidden></label>
    <button class="btn small sec" id="bkdl">⬇️ Скачать все</button></p>
    <div id="bkl" class="bkl"></div><p id="bkm"></p>`;
}
function booksInit() {
  if (!$('bkl')) return;
  const nm = r => `${(BK_SUBJ.find(x => x[0] === r.subj) || [0, r.subj])[1]}, ${r.cls} кл.`;
  const fname = (r, k) => `uchebnik-${r.subj}-${r.cls}kl-${k + 1}.jpg`;
  let list = [];
  const draw = () => BK.all().then(a => {
    list = a || [];
    $('bkl').innerHTML = list.length ? list.map(r => `<div class="bki"><img src="${URL.createObjectURL(r.blob)}" alt=""><small>${nm(r)}</small><button class="btn small red" data-d="${r.id}">✖</button></div>`).join('') : '<small>Фото пока нет.</small>';
    app.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { if (confirm('Удалить это фото?')) BK.del(+b.dataset.d).then(draw); });
  }).catch(() => { $('bkm').textContent = 'Хранилище фото недоступно в этом браузере.'; });
  const take = files => {
    const fs = [...files]; if (!fs.length) return;
    $('bkm').textContent = 'Сохраняю…';
    Promise.all(fs.map(f => BK.shrink(f).then(blob => BK.add({ subj: $('bks').value, cls: $('bkc').value, blob, t: Date.now() })))).then(() => { $('bkm').textContent = '✅ Сохранено: ' + fs.length; draw(); }).catch(() => { $('bkm').textContent = '❌ Не получилось сохранить фото.'; });
  };
  $('bkcam').onchange = e => { take(e.target.files); e.target.value = ''; };
  $('bkgal').onchange = e => { take(e.target.files); e.target.value = ''; };
  $('bkdl').onclick = () => {
    if (!list.length) { $('bkm').textContent = 'Сначала добавьте фото.'; return; }
    const cnt = {};
    list.forEach((r, k) => { const key = r.subj + r.cls; cnt[key] = (cnt[key] || 0); const n = cnt[key]++; setTimeout(() => { const a = document.createElement('a'); a.href = URL.createObjectURL(r.blob); a.download = fname(r, n); document.body.appendChild(a); a.click(); a.remove(); }, k * 400); });
    $('bkm').textContent = 'Скачиваю файлов: ' + list.length + '. Пришлите их разработчику.';
  };
  draw();
}
function parent() {
  const rows = WORLDS.concat(MWORLDS, RWORLDS, OWORLDS, IWORLDS).map(wd => `<tr><th colspan="2">${wd.name}</th></tr>` + wd.lessons.map((l, k) => {
    const r = S.lessons[l.id] || {};
    return `<tr><td>${k + 1}. ${l.icon} ${l.title}${l.type === 'gram' ? ' (грамматика)' : l.type === 'read' ? ' (чтение)' : ''}</td><td>${r.done ? '⭐'.repeat(r.stars) : '—'}</td></tr>`;
  }).join('')).join('');
  const wk = weakItems();
  const weak = wk.words.slice(0, 12)
    .map(id => `<tr><td>${WORDS[id].e} ${WORDS[id].en}</td><td>${WORDS[id].ru}</td><td>ошибок: ${S.words[id].miss}</td></tr>`).join('')
    + wk.gaps.slice(0, 8).map(k => `<tr><td colspan="2">${GAPIDX[k].en.replace('___', '<b>' + GAPIDX[k].ans + '</b>')}</td><td>ошибок: ${S.gr[k].miss}</td></tr>`).join('');
  const learned = Object.keys(S.words).filter(id => S.words[id].seen > 0).length;
  const wkStart = addDays(today(), -6);
  const fam = PR.list.length > 1 ? `<div class="card"><h3>👨‍👩‍👧 Все игроки (последние 7 дней)</h3><table><tr><th>Игрок</th><th>Минут</th><th>Верно</th><th>Локаций</th><th>Серия</th></tr>${PR.list.map(pl => {
    const st = pl.id === PR.cur ? S : loadState(pl.key); let sec = 0, q = 0, ok = 0;
    Object.keys(st.log || {}).forEach(d => { if (d >= wkStart) { const x = st.log[d]; sec += x.sec || 0; q += x.q || 0; ok += x.ok || 0; } });
    return `<tr><td>${esc(pl.name)}</td><td>${Math.round(sec / 60)}</td><td>${q ? Math.round(100 * ok / q) + '%' : '—'}</td><td>${Object.values(st.lessons || {}).filter(x => x.done).length}</td><td>${st.streak || 0}</td></tr>`;
  }).join('')}</table><p><small>Подробный отчёт по каждому: выберите игрока на экране «Кто занимается?», затем «Родителям».</small></p></div>` : '';
  app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Карта</button><button class="btn small gold" id="frp">📊 Семейный отчёт</button><button class="btn small gold" id="rpt">📊 Отчёт по английскому</button>${location.protocol === 'file:' ? '' : '<button class="btn small gold" id="dpar">📓 Дневник (править)</button>'}<h2>Для родителей</h2>
    <p>Выучено слов: <b>${learned}</b> из ${Object.keys(WORDS).length}. Серия: <b>${shownStreak()}</b> дн. Изумрудов: ${S.emeralds}.</p>
    <p>Лучше заниматься по 10–15 минут каждый день. Хвалите за старание, а не за оценки.</p></div>
    ${fam}<div class="card"><h3>Прогресс по локациям</h3><table>${rows}</table></div>
    <div class="card"><h3>Слабые места (слова и правила; уходят после 3 верных ответов подряд)</h3>${weak ? `<table>${weak}</table><p>Совет: повторите их без экрана — покажите предмет и попросите назвать, спрячьте карточки по комнате, сыграйте «Покажи и назови».</p>` : '<p>Пока нет данных — всё идёт хорошо!</p>'}</div>
    <div class="card"><h3>🧮 Математика по темам</h3>${mathTopicsHtml()}</div>
    <div class="card"><h3>🎁 Семейные призы</h3>
      <p>Договоритесь с ребёнком о награде в жизни за получение наград в игре (например, «поход в кино» или «выбрать мультфильм»). Ребёнок увидит их на экране «Награды».</p>
      ${(S.prizes || []).map((p, k) => `<p>За <b>${p.need}</b> наград: <input type="text" data-pz="${k}" maxlength="50" placeholder="Например: мороженое" value="${(p.text || '').replace(/"/g, '&quot;')}"></p>`).join('')}</div>
    <div class="card"><h3>☁️ Синхронизация между устройствами</h3>
      <p>${cloudOn() ? 'Включена. Семейный код: <b>' + esc(CL.code) + '</b>. ' + esc(cloudStatus()) : 'Не включена: прогресс хранится только на этом устройстве.'}</p>
      <button class="btn small gold" id="clp">Настроить / войти по коду</button></div>
    <div class="card"><h3>📓 Связь с дневником</h3>${diaryLinkHtml()}</div>
    <div class="card"><h3>📷 Фото учебников</h3>${booksHtml()}</div>
    <div class="card"><h3>Настройки</h3>
      <button class="btn small" id="vc">🔊 Проверить озвучку</button>
      <p>Скорость речи робота: <select id="rt" style="font:inherit;font-size:1.1rem;padding:6px;border:3px solid #1b1b1b;border-radius:8px">
        ${[[0.6, 'Медленно'], [0.7, 'Чуть медленнее'], [0.8, 'Обычно'], [0.95, 'Быстро']].map(o => `<option value="${o[0]}" ${(S.rate || 0.8) === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></p>
      <button class="btn small" id="dgp">🔎 Разведка (определить уровень)</button>
      <button class="btn small ${S.strict ? 'red' : ''}" id="strict">${S.strict ? '🔒 Строгий режим: ВКЛ (без подсказок и щита)' : 'Строгий режим: выкл'}</button>
      <button class="btn small gold" id="ua">${S.unlockAll ? 'Закрыть уроки по порядку' : 'Открыть все уроки'}</button>
      <button class="btn small red" id="rs">Сбросить всё</button>
      <p id="vm"></p>
      <p>Копия прогресса (скопируйте текст, чтобы перенести на планшет, и вставьте там):</p>
      <textarea id="ex">${JSON.stringify(S)}</textarea>
      <button class="btn small" id="im">Загрузить из текста</button></div>`;
  $('bk').onclick = map;
  $('rpt').onclick = weeklyReport;
  $('frp').onclick = familyReport;
  if ($('sch')) $('sch').onchange = () => { S.schoolChild = $('sch').value; save(); parent(); };
  if ($('dpar')) $('dpar').onclick = () => { try { sessionStorage.setItem('school-off:edit', String(Date.now())); } catch (e) {} location.href = 'school/index.html'; };
  $('strict').onclick = () => { S.strict = !S.strict; save(); parent(); };
  $('clp').onclick = () => cloudScreen(parent);
  booksInit();
  $('rt').onchange = e => { S.rate = +e.target.value; save(); speak('Hello! I am a robot.'); };
  app.querySelectorAll('[data-pz]').forEach(i => i.oninput = () => { S.prizes[+i.dataset.pz].text = i.value; save(); });
  const vstat = () => {
    let list = ''; try { list = speechSynthesis.getVoices().map(v => v.name + ' (' + v.lang + ')').join('; '); } catch (e) {}
    $('vm').innerHTML = hasEnVoice()
      ? '✅ Английский голос найден: ' + esc(enVoice ? enVoice.name : '') + '. Если звука нет — проверьте громкость.'
      : '❌ Английский голос не найден' + (list ? ' (есть только: ' + esc(list) + ')' : '') + '. Слова читаются русским голосом и звучат непонятно. Откройте игру в Google Chrome с интернетом (там есть «Google US English») или установите английский голос в настройках системы.';
  };
  vstat();
  $('vc').onclick = () => { speak('Hello! I am a robot.'); vstat(); };
  $('dgp').onclick = diagIntro;
  $('ua').onclick =() => { S.unlockAll = !S.unlockAll; save(); parent(); };
  $('rs').onclick = () => { if (confirm(`Удалить весь прогресс игрока «${S.name}»? Другие игроки не затронутся.`)) { S = defState(); save(); applyTheme(); welcome(); } };
  $('im').onclick = () => {
    try { S = Object.assign(defState(), JSON.parse($('ex').value)); save(); applyTheme(); toast('Прогресс загружен ✅'); map(); }
    catch (e) { toast('Не получилось прочитать текст ❌'); }
  };
}

/* ---------- награды и ачивки ---------- */
const allLessons = () => [].concat(...WORLDS.map(w => w.lessons));
const doneLessons = () => allLessons().filter(l => (S.lessons[l.id] || {}).done);
const cntDone = obj => Object.values(obj || {}).filter(x => x.done).length;
const A = (cat, id, i, t, d, goal, r, val) => ({ cat, id, i, t, d, goal, r, val });
const ACH_CATS = ['Старт', 'Уроки', 'Звёзды', 'Миры', 'Слова', 'Серия', 'Прогресс', 'Разнообразие', 'Питомец', 'Богатство'];
const ACH = [
  A('Старт', 'first', '👣', 'Первые шаги', 'Пройди первую локацию', 1, 5, () => doneLessons().length),
  A('Старт', 'diag', '🔎', 'Разведчик', 'Пройди «Разведку»', 1, 10, () => (S.diagRun ? 1 : 0)),
  A('Старт', 'hat', '🎩', 'Модник', 'Купи шляпу для робота', 1, 5, () => S.owned.filter(k => HATS[k]).length),
  A('Старт', 'theme', '🎨', 'Дизайнер', 'Купи новый фон карты', 1, 5, () => S.owned.filter(k => THEMES[k] && k !== 'theme0').length),
  A('Уроки', 'l5', '🥉', 'Новичок', 'Пройди 5 локаций', 5, 5, () => doneLessons().length),
  A('Уроки', 'l15', '🥈', 'Ученик', 'Пройди 15 локаций', 15, 10, () => doneLessons().length),
  A('Уроки', 'l30', '🥇', 'Знаток', 'Пройди 30 локаций', 30, 20, () => doneLessons().length),
  A('Уроки', 'l60', '🏆', 'Мастер острова', 'Пройди 60 локаций', 60, 40, () => doneLessons().length),
  A('Уроки', 'gram', '✍️', 'Грамотей', 'Пройди 10 грамматических локаций', 10, 15, () => doneLessons().filter(l => l.type === 'gram').length),
  A('Звёзды', 's30', '⭐', 'Звёздочёт', 'Собери 30 звёзд за локации', 30, 10, () => doneLessons().reduce((s, l) => s + (S.lessons[l.id].stars || 0), 0)),
  A('Звёзды', 's100', '🌟', 'Звёздный путь', 'Собери 100 звёзд за локации', 100, 25, () => doneLessons().reduce((s, l) => s + (S.lessons[l.id].stars || 0), 0)),
  A('Звёзды', 't10', '🎖️', 'Отличник', 'Получи 3 звезды в 10 локациях', 10, 15, () => doneLessons().filter(l => S.lessons[l.id].stars === 3).length),
  A('Звёзды', 't30', '👑', 'Супер-отличник', 'Получи 3 звезды в 30 локациях', 30, 30, () => doneLessons().filter(l => S.lessons[l.id].stars === 3).length),
  A('Миры', 'b1', '👾', 'Победитель Забывака', 'Победи босса мира 1', 1, 15, () => ((S.lessons[WORLDS[0].boss.id] || {}).done ? 1 : 0)),
  A('Миры', 'b2', '👹', 'Укротитель путаницы', 'Победи босса мира 2', 1, 20, () => ((S.lessons[WORLDS[1].boss.id] || {}).done ? 1 : 0)),
  A('Миры', 'b3', '🧙', 'Победитель цитадели', 'Победи босса мира 3', 1, 25, () => ((S.lessons[WORLDS[2].boss.id] || {}).done ? 1 : 0)),
  A('Миры', 'all', '🏝️', 'Покоритель острова', 'Победи всех трёх боссов', 3, 50, () => WORLDS.filter(w => (S.lessons[w.boss.id] || {}).done).length),
  A('Слова', 'w25', '📖', 'Первая коллекция', 'Собери 25 слов в словарик', 25, 5, () => collectedSet().size),
  A('Слова', 'w100', '🗣️', 'Полиглот', 'Собери 100 слов', 100, 15, () => collectedSet().size),
  A('Слова', 'w200', '📚', 'Живой словарь', 'Собери 200 слов', 200, 30, () => collectedSet().size),
  A('Слова', 'g25', '🥇', 'Золотой запас', '25 слов с золотой медалью', 25, 20, () => [...collectedSet()].filter(id => medal(id).m === '🥇').length),
  A('Слова', 'sets', '🏅', 'Коллекционер тем', 'Полностью собери 10 тем в словарике', 10, 20, () => Object.keys(S.sets || {}).length),
  A('Прогресс', 'lv5', '⭐', 'Пятый уровень', 'Достигни 5 уровня', 5, 25, () => level()),
  A('Прогресс', 'lv10', '🌟', 'Десятый уровень', 'Достигни 10 уровня', 10, 60, () => level()),
  A('Прогресс', 'up5', '⚡', 'Улучшатель', 'Купи 5 уровней улучшений', 5, 40, () => Object.values(S.up || {}).reduce((a, b) => a + b, 0)),
  A('Серия', 'st3', '🔥', 'Огонёк', 'Занимайся 3 дня подряд', 3, 5, () => Math.max(S.maxStreak || 0, shownStreak())),
  A('Серия', 'st7', '🔥', 'Целая неделя', 'Занимайся 7 дней подряд', 7, 10, () => Math.max(S.maxStreak || 0, shownStreak())),
  A('Серия', 'st14', '🚀', 'Две недели', 'Занимайся 14 дней подряд', 14, 20, () => Math.max(S.maxStreak || 0, shownStreak())),
  A('Серия', 'st30', '🛡️', 'Железная воля', 'Занимайся 30 дней подряд', 30, 50, () => Math.max(S.maxStreak || 0, shownStreak())),
  A('Серия', 'd10', '📆', 'Постоянство', 'Занимайся в 10 разных дней', 10, 15, () => S.totalDays || 0),
  A('Серия', 'd30', '🗓️', 'Привычка', 'Занимайся в 30 разных дней', 30, 40, () => S.totalDays || 0),
  A('Разнообразие', 'song', '🎤', 'Артист', 'Спой 5 рифмовок', 5, 10, () => cntDone(S.songs)),
  A('Разнообразие', 'dlg', '💬', 'Болтун', 'Пройди 5 диалогов', 5, 10, () => cntDone(S.dlg)),
  A('Разнообразие', 'aud', '🎧', 'Слухач', 'Пройди 5 аудирований', 5, 10, () => cntDone(S.audio)),
  A('Разнообразие', 'aud25', '👂', 'Тонкий слух', 'Пройди 25 аудирований', 25, 25, () => cntDone(S.audio)),
  A('Разнообразие', 'aud60', '🎶', 'Мастер слуха', 'Пройди 60 аудирований', 60, 40, () => cntDone(S.audio)),
  A('Разнообразие', 'tale', '📜', 'Сказочник', 'Прочитай 5 сказок и басен', 5, 15, () => TALES.filter(t => (S.lessons[t.id] || {}).done).length),
  A('Разнообразие', 'tr', '💪', 'Тренер', 'Пройди 5 тренировок слабых мест', 5, 10, () => (S.cnt || {}).tr || 0),
  A('Разнообразие', 'card', '🃏', 'Мастер карточек', 'Пройди 10 сессий с карточками', 10, 10, () => (S.cnt || {}).card || 0),
  A('Питомец', 'p2', '🐥', 'Подросток', 'Выращи питомца до стадии «Подросток»', 1, 5, () => (petStage() >= 2 ? 1 : 0)),
  A('Питомец', 'p3', '🦖', 'Взрослый друг', 'Выращи питомца до стадии «Взрослый»', 1, 10, () => (petStage() >= 3 ? 1 : 0)),
  A('Питомец', 'p5', '🐲', 'Легенда', 'Выращи питомца до стадии «Легенда»', 1, 30, () => (petStage() >= 5 ? 1 : 0)),
  A('Питомец', 'pets', '🐾', 'Зверинец', 'Купи нового питомца', 1, 10, () => S.owned.filter(k => k.startsWith('pet_')).length),
  A('Богатство', 'shop10', '🛍️', 'Модный остров', 'Купи 10 вещей в магазине', 10, 20, () => Math.max(0, S.owned.length - 1)),
  A('Богатство', 'shop25', '🛒', 'Магазин-мастер', 'Купи 25 вещей в магазине', 25, 40, () => Math.max(0, S.owned.length - 1)),
  A('Богатство', 'e100', '💎', 'Копилка', 'Накопи 100 изумрудов', 100, 10, () => S.maxEm || 0),
  A('Богатство', 'e300', '💰', 'Сокровищница', 'Накопи 300 изумрудов', 300, 20, () => S.maxEm || 0)
];
const tierOf = a => (a.r >= 25 ? 'gold' : a.r >= 10 ? 'silver' : 'bronze');

function checkAch() {
  S.maxEm = Math.max(S.maxEm || 0, S.emeralds);
  const got = [];
  ACH.forEach(a => {
    if (S.ach[a.id]) return;
    let v = 0; try { v = a.val(); } catch (e) {}
    if (v >= a.goal) { S.ach[a.id] = today(); S.emeralds += a.r; got.push(a); }
  });
  if (!got.length) return;
  S.maxEm = Math.max(S.maxEm, S.emeralds); save(); sfx('win');
  const ov = document.createElement('div'); ov.className = 'overlay';
  const shown = got.slice(0, 3);
  ov.innerHTML = `<div class="card center wc"><h2>🏆 Новая награда!</h2>
    ${shown.map(a => `<div class="story ${tierOf(a)}"><span style="font-size:2.6rem">${a.i}</span><br><b>${a.t}</b><br><small>${a.d}</small><br><span class="chip">+${a.r} 💎</span></div>`).join('')}
    ${got.length > 3 ? `<p>…и ещё ${got.length - 3}! Загляни в «Награды».</p>` : ''}
    ${got.map(a => rareFor(a.id)).flat().length ? `<div class="story gold">🎁 Открыт редкий предмет:<br><b>${got.map(a => rareFor(a.id)).flat().join(', ')}</b><br><small>Загляни в магазин!</small></div>` : ''}
    <p><button class="btn gold" id="ax">Ура! ➜</button></p></div>`;
  document.body.appendChild(ov);
  $('ax').onclick = () => { ov.remove(); if (document.getElementById('awc')) awards(); };
}

function awards() {
  const have = ACH.filter(a => S.ach[a.id]).length;
  const secs = ACH_CATS.map(c => {
    const list = ACH.filter(a => a.cat === c);
    return `<h3>${c} <small>${list.filter(a => S.ach[a.id]).length}/${list.length}</small></h3><div class="shop">` + list.map(a => {
      const got = S.ach[a.id]; let v = 0; try { v = a.val(); } catch (e) {}
      const pct = Math.min(100, Math.round(v / a.goal * 100));
      return got
        ? `<div class="item ach ${tierOf(a)}"><div class="ie">${a.i}</div><b>${a.t}</b><br><small>${a.d}</small><br><small>✅ ${new Date(got + 'T00:00:00').toLocaleDateString('ru-RU')}</small></div>`
        : `<div class="item ach lock"><div class="ie">🔒</div><b>${a.t}</b><br><small>${a.d}</small>${rareFor(a.id).length ? `<br><small>🎁 ${rareFor(a.id).join(', ')}</small>` : ''}<div class="bar"><i style="width:${pct}%"></i></div><small>${Math.min(v, a.goal)} / ${a.goal} · +${a.r} 💎</small></div>`;
    }).join('') + '</div>';
  }).join('');
  const prizes = (S.prizes || []).filter(p => p.text && p.text.trim()).map(p => {
    const ok = have >= p.need;
    return `<div class="item ach ${ok ? 'gold' : 'lock'}"><div class="ie">${ok ? '🎁' : '🔒'}</div><b>${p.text}</b><br><small>${ok ? 'Приз открыт! Покажи родителям 🎉' : `Нужно наград: ${have} / ${p.need}`}</small></div>`;
  }).join('');
  app.innerHTML = `<div class="card top" id="awc"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center"><h2>🏆 Мои награды</h2></div><span class="chip">💎 ${S.emeralds}</span></div>
    <div class="card"><p>Получено наград: <b>${have}</b> из ${ACH.length}</p><div class="bar"><i style="width:${Math.round(have / ACH.length * 100)}%"></i></div>
      ${prizes ? `<h3>🎁 Семейные призы</h3><div class="shop">${prizes}</div>` : ''}${secs}</div>`;
  $('bk').onclick = map;
}

/* ---------- мой словарик ---------- */
function vocabTopics() {
  const taken = {}, out = [];
  WORLDS.forEach((wd, wi) => wd.lessons.forEach(l => {
    if (!l.words) return;
    const ws = l.words.filter(id => WORDS[id] && !taken[id]);
    ws.forEach(id => { taken[id] = 1; });
    if (ws.length) out.push({ id: l.id, title: l.title, icon: l.icon, world: wi, words: ws });
  }));
  return out;
}
// слово «собрано», если ребёнок отвечал на него или прошёл локацию с ним
function collectedSet() {
  const s = new Set();
  Object.keys(S.words).forEach(id => { if (WORDS[id] && S.words[id].seen > 0) s.add(id); });
  WORLDS.forEach(wd => wd.lessons.forEach(l => { if ((S.lessons[l.id] || {}).done) (l.words || []).forEach(id => s.add(id)); }));
  return s;
}
function medal(id) {
  const w = S.words[id];
  if (!w) return { m: '🥉', t: 'Учу' };
  if (w.box >= 4) return { m: '🥇', t: 'Знаю отлично' };
  if (w.box >= 2) return { m: '🥈', t: 'Знаю хорошо' };
  return { m: '🥉', t: 'Учу' };
}
let EXAMPLES = null;
function exampleOf(id) {
  if (!EXAMPLES) {
    EXAMPLES = {};
    WORLDS.forEach(wd => wd.lessons.forEach(l => (l.sents || []).forEach(s => {
      Object.keys(WORDS).forEach(k => {
        if (EXAMPLES[k]) return;
        const re = new RegExp('(^|[^A-Za-z])' + WORDS[k].en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z]|$)', 'i');
        if (re.test(s.en)) EXAMPLES[k] = s;
      });
    })));
  }
  return EXAMPLES[id];
}
const vf = { world: -1, weak: false, q: '' };

function vocab() {
  newScreen();
  const topics = vocabTopics(), col = collectedSet(), weak = new Set(weakItems().words);
  // награда за полностью собранную тему (один раз)
  let gift = 0;
  topics.forEach(t => { if (t.words.every(id => col.has(id)) && !S.sets[t.id]) { S.sets[t.id] = 1; gift += 5; } });
  gift = Math.min(gift, 20); // после «Разведки» сразу открывается много тем, поэтому награда за один заход ограничена
  if (gift) { S.emeralds += gift; save(); toast(`🏅 Тема собрана! +${gift} 💎`); }
  const total = Object.keys(WORDS).length, mine = col.size, gold = [...col].filter(id => medal(id).m === '🥇').length;
  const q = vf.q.trim().toLowerCase();
  const sections = topics.filter(t => vf.world < 0 || t.world === vf.world).map(t => {
    const have = t.words.filter(id => col.has(id)).length;
    let ws = t.words;
    if (vf.weak) ws = ws.filter(id => weak.has(id));
    if (q) ws = ws.filter(id => col.has(id) && (WORDS[id].en.toLowerCase().includes(q) || WORDS[id].ru.toLowerCase().includes(q)));
    if (!ws.length) return '';
    const cards = ws.map(id => {
      const w = WORDS[id];
      return col.has(id)
        ? `<button class="vc" data-id="${id}"><span class="vm">${medal(id).m}</span>${weak.has(id) ? '<span class="vw">❗</span>' : ''}<div class="ve">${w.e}</div><b>${w.en}</b><small>${w.ru}</small></button>`
        : `<div class="vc lock"><div class="ve">❓</div><b>???</b><small>${t.title}</small></div>`;
    }).join('');
    return `<h3>${t.icon} ${t.title} <small>${have}/${t.words.length}</small> ${have === t.words.length ? '🏅' : ''}</h3><div class="vgrid">${cards}</div>`;
  }).join('');
  const chips = [-1, ...WORLDS.map((_, i) => i)].map(k => `<button class="btn small ${vf.world === k ? 'gold' : 'sec'}" data-vw="${k}">${k < 0 ? 'Все' : WORLDS[k].name.split(' · ')[0]}</button>`).join('');
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center"><h2>📖 Мой словарик</h2></div><button class="btn small gold" id="fc">🃏 Карточки</button></div>
    <div class="card"><p>Собрано слов: <b>${mine}</b> из ${total} · 🥇 знаю отлично: <b>${gold}</b></p>
      <div class="bar"><i style="width:${Math.round(mine / total * 100)}%"></i></div>
      <p>${chips} <button class="btn small ${vf.weak ? 'red' : 'sec'}" id="vk">❗ Только слабые (${weak.size})</button></p>
      <input type="text" id="vq" placeholder="🔎 Найти слово (по-английски или по-русски)" value="${vf.q.replace(/"/g, '&quot;')}">
      <p><small>🥉 учу · 🥈 знаю хорошо · 🥇 знаю отлично. Нажми на карточку — послушаешь слово и увидишь пример.</small></p>
      ${sections || '<p>Здесь пока ничего нет. Проходи локации — и слова появятся в словарике!</p>'}</div>`;
  $('bk').onclick = map; $('fc').onclick = flashcards;
  $('vk').onclick = () => { vf.weak = !vf.weak; vocab(); };
  app.querySelectorAll('[data-vw]').forEach(b => b.onclick = () => { vf.world = +b.dataset.vw; vocab(); });
  $('vq').oninput = e => { vf.q = e.target.value; const pos = e.target.selectionStart; vocab(); const n = $('vq'); n.focus(); n.setSelectionRange(pos, pos); };
  app.querySelectorAll('.vc[data-id]').forEach(b => b.onclick = () => wordCard(b.dataset.id));
}

function wordCard(id) {
  const w = WORDS[id], r = S.words[id] || {}, md = medal(id), ex = exampleOf(id);
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.innerHTML = `<div class="card center wc"><div class="ve" style="font-size:5rem">${w.e}</div><div class="en">${w.en}</div><div class="ru">${w.ru}</div>
    <p>${md.m} ${md.t}${r.miss ? ` · ошибок: ${r.miss}` : ''}</p>
    ${ex ? `<p class="story">${ex.en}<br><small>${ex.ru}</small></p>` : ''}
    <p><button class="speak" id="ws">🔊</button></p><p><button class="btn gold" id="wx">Закрыть</button></p></div>`;
  document.body.appendChild(ov);
  const close = () => { hardStop(); ov.remove(); };
  ov.onclick = e => { if (e.target === ov) close(); };
  $('wx').onclick = close;
  $('ws').onclick = () => speak(w.en);
  speak(w.en);
}

/* карточки: смотрим на картинку, вспоминаем слово, переворачиваем и проверяем себя */
function flashcards() {
  const col = [...collectedSet()];
  if (!col.length) { toast('Сначала пройди хотя бы одну локацию 🙂'); return; }
  const wk = weakItems().words.filter(id => col.includes(id));
  const due = shuffle(col.filter(id => !wk.includes(id) && S.words[id] && S.words[id].due <= today()));
  const rest = shuffle(col.filter(id => !wk.includes(id) && !due.includes(id)));
  const deck = [...wk.slice(0, 5), ...due.slice(0, 5), ...rest].filter((x, k, a) => a.indexOf(x) === k).slice(0, 10);
  let i = 0, known = 0;
  const show = () => {
    newScreen(); // слово предыдущей карточки больше не должно звучать
    if (i >= deck.length) return end();
    const w = WORDS[deck[i]]; let flipped = false;
    app.innerHTML = `<div class="topline"><button class="btn small sec" id="exit">⬅ Словарик</button><div class="stepname">Карточка ${i + 1} из ${deck.length}</div></div>
      <div class="card center"><div class="prog">${deck.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <div class="flash" id="fl"><div class="ve" style="font-size:min(30vw,8rem)">${w.e}</div><p id="fh">Вспомни слово по-английски и скажи вслух. Потом нажми на карточку!</p></div>
      <div id="fb"></div></div>`;
    $('exit').onclick = vocab;
    $('fl').onclick = () => {
      if (flipped) { speak(w.en); return; }
      flipped = true; speak(w.en);
      $('fl').classList.add('flip');
      $('fl').innerHTML = `<div class="ve" style="font-size:3rem">${w.e}</div><div class="en">${w.en}</div><div class="ru">${w.ru}</div><small>нажми, чтобы послушать ещё раз</small>`;
      $('fb').innerHTML = '<p><button class="btn" id="fk">✅ Знал(а)</button><button class="btn sec" id="fr">🔁 Ещё повторю</button></p>';
      $('fk').onclick = () => { known++; srs(w.id, true); save(); i++; show(); };
      $('fr').onclick = () => { srs(w.id, false); save(); i++; show(); };
    };
  };
  function end() {
    logDone('card');
    const em = Math.min(10, known), sk = touchStreak(); S.emeralds += em + sk.bonus; S.petXp += 1; save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>Карточки пройдены! 🃏</h1><p>Знал(а) сразу: <b>${known} из ${deck.length}</b></p><p class="chip">+${em + sk.bonus} 💎</p>${sk.msg ? `<p>${sk.msg}</p>` : ''}
      <p>${known === deck.length ? 'Ты знаешь все эти слова!' : 'Слова, которые вызвали сомнения, вернутся в «Разминках» и «Тренировке».'}</p>
      <p><button class="btn gold" id="vb">В словарик ➜</button><button class="btn sec" id="ag">Ещё раз</button></p></div>`;
    $('vb').onclick = vocab; $('ag').onclick = flashcards;
  }
  show();
}

/* ---------- недельный отчёт для родителей ---------- */
const dayName = d => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'short' });
function aggDays(list) {
  const t = { sec: 0, q: 0, ok: 0, les: 0, dlg: 0, song: 0, aud: 0, tr: 0, card: 0, active: 0 };
  list.forEach(d => {
    const r = S.log[d]; if (!r) return;
    Object.keys(t).forEach(k => { if (k !== 'active') t[k] += r[k] || 0; });
    if ((r.q || 0) > 0 || (r.les || 0) > 0 || (r.sec || 0) >= 60) t.active++;
  });
  return t;
}
/* ---------- семейный отчёт: одна страница за неделю по всем детям и предметам ---------- */
function familyReport() {
  const t0 = today(), days = [0, 1, 2, 3, 4, 5, 6].map(k => addDays(t0, k - 6)), prev = [0, 1, 2, 3, 4, 5, 6].map(k => addDays(t0, k - 13));
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const agg = (st, ds) => { const r = { sec: 0, q: 0, ok: 0, act: 0 }; ds.forEach(d => { const x = (st.log || {})[d]; if (x && (x.sec || x.q)) { r.act++; r.sec += x.sec || 0; r.q += x.q || 0; r.ok += x.ok || 0; } }); return r; };
  const subj = [['eng', '🇬🇧 Английский', WORLDS], ['math', '🧮 Математика', MWORLDS], ['ru', '📝 Русский', RWORLDS], ['ow', '🌍 Окр. мир', OWORLDS], ['izo', '🎨 ИЗО', IWORLDS]];
  const weakOf = st => Object.keys(st.mt || {}).filter(k => { const r = st.mt[k]; if (!r || (r.seen || 0) < 3) return false; const h = r.hist || []; return (h.length >= 3 ? h.reduce((a, b) => a + b, 0) / h.length : 1 - (r.miss || 0) / r.seen) < 0.7; })
    .map(k => MTOP[k.slice(0, -1)]).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 5);
  const kids = PR.list.map(pl => {
    const st = pl.id === PR.cur ? S : loadState(pl.key), w = agg(st, days), p = agg(st, prev);
    const done = subj.map(([k, nm, ws]) => { let d = 0, n = 0; ws.forEach(x => x.lessons.forEach(l => { n++; if ((st.lessons || {})[l.id] && st.lessons[l.id].done) d++; })); return [nm, d, n]; });
    const wordsWeak = Object.keys(st.words || {}).filter(id => WORDS[id] && (st.words[id].miss || 0) >= 2 && (st.words[id].box || 0) < 2).slice(0, 5).map(id => WORDS[id].en);
    return { name: pl.name, w, p, done, weak: weakOf(st), wordsWeak, streak: st.streak || 0, strict: !!st.strict };
  });
  const lines = [`Семейный отчёт за неделю: ${fmtDate(days[0])} — ${fmtDate(t0)}`, ''];
  const cards = kids.map(k => {
    const min = Math.round(k.w.sec / 60), pmin = Math.round(k.p.sec / 60), acc = k.w.q ? Math.round(k.w.ok / k.w.q * 100) : null;
    const trend = k.p.sec ? (min > pmin ? ` (▲ +${min - pmin} мин)` : min < pmin ? ` (▼ −${pmin - min} мин)` : ' (как раньше)') : '';
    const tips = [];
    if (k.w.act === 0) tips.push('на этой неделе занятий не было: начните с 10 минут в день');
    else if (k.w.act < 3) tips.push(`занятия в ${k.w.act} из 7 дней: лучше понемногу каждый день`);
    else if (k.w.act >= 5) tips.push('отличная регулярность, похвалите за старание');
    if (acc !== null && k.w.q >= 15 && acc < 60) tips.push('много ошибок: повторите уроки с одной звездой и «Тренировку»');
    if (acc !== null && k.w.q >= 15 && acc >= 85) tips.push('результаты высокие: можно браться за новые темы');
    if (k.weak.length) tips.push('слабые темы: ' + k.weak.join(', '));
    if (k.wordsWeak.length) tips.push('трудные слова: ' + k.wordsWeak.join(', '));
    lines.push(`${k.name}: занималось дней ${k.w.act} из 7, ${min} мин${trend}, ответов ${k.w.q}${acc !== null ? ', верно ' + acc + '%' : ''}, серия ${k.streak} дн.`);
    lines.push('  Пройдено уроков: ' + k.done.map(d => `${d[0].replace(/^\S+\s/, '')} ${d[1]}/${d[2]}`).join('; '));
    if (tips.length) lines.push('  Заметки: ' + tips.join('; '));
    lines.push('');
    return `<div class="card"><h3>${esc(k.name)}</h3>
      <div class="shop"><div class="item"><div class="ie" style="font-size:2rem">${k.w.act}/7</div>дней</div><div class="item"><div class="ie" style="font-size:2rem">${min}</div>минут${trend}</div><div class="item"><div class="ie" style="font-size:2rem">${acc !== null ? acc + '%' : '–'}</div>верно с 1-й попытки</div><div class="item"><div class="ie" style="font-size:2rem">🔥 ${k.streak}</div>дней подряд</div></div>
      <table>${k.done.map(d => `<tr><td>${d[0]}</td><td><div class="bar"><i style="width:${d[2] ? Math.round(d[1] / d[2] * 100) : 0}%"></i></div></td><td>${d[1]}/${d[2]}</td></tr>`).join('')}</table>
      ${tips.length ? `<ul>${tips.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}</div>`;
  }).join('');
  const text = lines.join('\n').trim();
  app.innerHTML = `<div class="card noprint"><button class="btn small sec" id="bk">⬅ Родителям</button></div>
    <div class="card"><h2>📊 Семейный отчёт</h2><p>${fmtDate(days[0])} — ${fmtDate(t0)}. Открывайте раз в неделю, например в воскресенье вечером.</p></div>${cards}
    <div class="card noprint"><button class="btn small" id="cp">📋 Скопировать</button>${navigator.share ? '<button class="btn small gold" id="sh">📤 Отправить</button>' : ''}<a class="btn small" id="ml" href="mailto:?subject=${encodeURIComponent('Семейный отчёт за неделю')}&body=${encodeURIComponent(text)}">✉️ Письмом</a><button class="btn small sec" id="pr">🖨 Печать</button>
      <textarea id="rt" readonly>${esc(text)}</textarea></div>`;
  $('bk').onclick = parent;
  $('cp').onclick = () => { const t = $('rt'); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand('copy'); } toast('Скопировано'); };
  if ($('sh')) $('sh').onclick = () => navigator.share({ title: 'Семейный отчёт за неделю', text }).catch(() => {});
  $('pr').onclick = () => window.print();
}
function weeklyReport() {
  const t0 = today();
  const days = [0, 1, 2, 3, 4, 5, 6].map(k => addDays(t0, k - 6));
  const prevDays = [0, 1, 2, 3, 4, 5, 6].map(k => addDays(t0, k - 13));
  const w = aggDays(days), p = aggDays(prevDays);
  const min = Math.round(w.sec / 60), pmin = Math.round(p.sec / 60);
  const acc = w.q ? Math.round(w.ok / w.q * 100) : 0, pacc = p.q ? Math.round(p.ok / p.q * 100) : 0;
  const newWords = Object.values(S.words).filter(x => x.first >= days[0] && x.first <= t0).length;
  const prog = WORLDS.map(wd => `${wd.name}: ${wd.lessons.filter(l => (S.lessons[l.id] || {}).done).length} из ${wd.lessons.length}`);
  const wk = weakItems(), weakN = wk.words.length + wk.gaps.length;
  const weakList = wk.words.slice(0, 6).map(id => `${WORDS[id].en} — ${WORDS[id].ru}`);
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  // советы по правилам
  const recs = [];
  if (w.active === 0) recs.push('На этой неделе занятий не было. Начните с 10 минут: достаточно одной локации в день, лучше в одно и то же время.');
  else if (w.active < 3) recs.push(`Занятия были в ${w.active} из 7 дней. Короткие занятия каждый день работают лучше одного длинного. Договоритесь о постоянном времени, например после ужина.`);
  else if (w.active >= 5) recs.push('Отличная регулярность! Похвалите за старание, а не за оценки.');
  if (w.q >= 15 && acc < 60) recs.push('Много ошибок. Это нормально, когда тема новая. Пройдите ещё раз локации с 1 звездой и пользуйтесь «Тренировкой».');
  if (w.q >= 15 && acc >= 85) recs.push('Результаты высокие. Можно идти дальше или попросить ребёнка «научить» вас новым словам: объяснять другому полезно.');
  if (w.active > 0 && min / w.active > 25) recs.push('Занятия в среднем длиннее 25 минут. Для этого возраста лучше 10–15 минут, чтобы не уставал.');
  if (w.active > 0 && min / w.active < 8) recs.push('Занятия очень короткие (в среднем меньше 8 минут). Можно добавить диалог или песенку, это весело и закрепляет слова.');
  if (weakN > 0) recs.push(`В «💪 Тренировке» ждут слабые места (${weakN}). 5 минут в день, и их станет заметно меньше.`);
  if (weakList.length) recs.push('Поиграйте без экрана: покажите предметы или картинки и попросите назвать по-английски. Начните со слов: ' + weakList.slice(0, 4).map(x => x.split(' — ')[0]).join(', ') + '.');
  if (!(w.song + w.dlg + w.aud)) recs.push('Попробуйте «Песенки», «Диалоги» и «Аудирование»: они разнообразят занятия, а речь и слух тоже нужно тренировать.');
  if (!recs.length) recs.push('Всё идёт хорошо. Продолжайте в том же ритме.');

  const cmp = (a, b, unit) => b === 0 && a === 0 ? '' : a > b ? ` (▲ +${a - b}${unit} к прошлой неделе)` : a < b ? ` (▼ −${b - a}${unit} к прошлой неделе)` : ' (как на прошлой неделе)';
  const text = [
    `Недельный отчёт: ${S.name || 'ребёнок'}, ${fmtDate(days[0])} — ${fmtDate(t0)}`,
    `Занималось дней: ${w.active} из 7${cmp(w.active, p.active, '')}`,
    `Время: ${min} мин${cmp(min, pmin, ' мин')}`,
    `Ответов: ${w.q}, верных с первой попытки: ${acc}%${w.q && p.q ? cmp(acc, pacc, '%') : ''}`,
    `Пройдено за неделю: уроков ${w.les}, диалогов ${w.dlg}, песенок ${w.song}, аудирований ${w.aud}, тренировок ${w.tr}, повторений карточек ${w.card}`,
    `Новых слов: ${newWords}`, `Прогресс: ${prog.join('; ')}`,
    `Серия дней подряд: ${shownStreak()}`,
    weakN ? `Слабые места (${weakN}): ${weakList.join('; ')}` : 'Слабых мест нет',
    'Рекомендации:', ...recs.map(r => '— ' + r)
  ].join('\n');

  const bars = days.map(d => {
    const m = Math.round(((S.log[d] || {}).sec || 0) / 60), h = Math.min(100, m * 4);
    return `<div class="wd"><small>${m ? m + ' м' : '–'}</small><div class="wb" style="height:${m ? Math.max(h, 8) : 3}px"></div><b>${dayName(d)}</b></div>`;
  }).join('');
  const stat = (n, l) => `<div class="item"><div class="ie" style="font-size:2rem">${n}</div>${l}</div>`;

  app.innerHTML = `<div class="card noprint"><button class="btn small sec" id="bk">⬅ Родителям</button></div>
    <div class="card"><h2>📊 Недельный отчёт: ${S.name || ''}</h2><p>${fmtDate(days[0])} — ${fmtDate(t0)}</p>
      <div class="shop">${stat(`${w.active}/7`, 'дней занимались')}${stat(min + ' мин', 'время занятий')}${stat(w.q ? acc + '%' : '–', 'верно с 1-й попытки')}${stat(w.q, 'ответов')}${stat(newWords, 'новых слов')}${stat('🔥 ' + shownStreak(), 'дней подряд')}</div>
      ${(p.q || p.sec) ? `<p><small>Прошлая неделя: ${p.active}/7 дней, ${pmin} мин, ${p.q} ответов${p.q ? ', ' + pacc + '% верно' : ''}.</small></p>` : ''}
      <h3>Минуты по дням</h3><div class="wk">${bars}</div></div>
    <div class="card"><h3>Что пройдено</h3>
      <p>Уроков: <b>${w.les}</b> · Диалогов: <b>${w.dlg}</b> · Песенок: <b>${w.song}</b> · Аудирований: <b>${w.aud}</b> · Тренировок: <b>${w.tr}</b> · Карточек: <b>${w.card}</b></p>
      <h3>Общий прогресс</h3><ul>${prog.map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div class="card"><h3>Слабые места${weakN ? ' (' + weakN + ')' : ''}</h3>${weakN ? `<p>${weakList.join(' · ')}${weakN > weakList.length ? ' …' : ''}</p>` : '<p>Слабых мест нет 🎉</p>'}</div>
    <div class="card"><h3>💡 Рекомендации</h3><ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul>
      <p><small>Статистика копится с момента обновления игры; время считается по касаниям экрана.</small></p></div>
    <div class="card noprint"><button class="btn small" id="cp">📋 Скопировать отчёт текстом</button><button class="btn small sec" id="pr">🖨 Печать</button>
      <textarea id="rt" readonly>${text}</textarea></div>`;
  $('bk').onclick = parent;
  $('pr').onclick = () => window.print();
  $('cp').onclick = () => {
    const ta = $('rt'); ta.select();
    const done = () => toast('Отчёт скопирован. Вставьте в чат или письмо ✅');
    try { navigator.clipboard.writeText(text).then(done, () => { document.execCommand('copy'); done(); }); }
    catch (e) { try { document.execCommand('copy'); done(); } catch (e2) { toast('Выделите текст и скопируйте вручную'); } }
  };
}

/* ---------- аудирование ---------- */
const audioOpen = a => S.unlockAll || (S.lessons[a.req] || {}).done;

let audWorld = -1;
function listening() {
  hardStop();
  if (audWorld < 0) audWorld = Math.min(S.world, WORLDS.length - 1);
  const list = AUDIOS.filter(a => a.world === audWorld);
  const doneN = list.filter(a => (S.audio[a.id] || {}).done).length, openN = list.filter(audioOpen).length;
  const groups = [];
  list.forEach(a => { const g = a.grp || 'Первые рассказы'; let o = groups.find(x => x.g === g); if (!o) { o = { g, items: [] }; groups.push(o); } o.items.push(a); });
  const secs = groups.map(gr => {
    const open = gr.items.filter(audioOpen), lockedN = gr.items.length - open.length;
    const reqs = [...new Set(gr.items.filter(a => !audioOpen(a)).map(a => a.req))].map(lessonTitle).join(', ');
    const cards = open.map(a => {
      const rec = S.audio[a.id] || {};
      return `<div class="item"><div class="ie">${a.icon}</div><b>${a.title}</b><br><div>${rec.done ? '⭐'.repeat(rec.stars) : '&nbsp;'}</div><button class="btn small ${rec.done ? 'sec' : 'gold'}" data-a="${a.id}">${rec.done ? 'Ещё раз' : 'Слушать'}</button></div>`;
    }).join('');
    const lock = lockedN ? `<div class="item" style="opacity:.6"><div class="ie">🔒</div><b>Ещё ${lockedN}</b><br><small>Нужно пройти: ${reqs}</small></div>` : '';
    return `<h3>${gr.g} <small>${gr.items.filter(a => (S.audio[a.id] || {}).done).length}/${gr.items.length}</small></h3><div class="shop">${cards}${lock}</div>`;
  }).join('');
  const chips = WORLDS.map((wd, i) => `<button class="btn small ${i === audWorld ? 'gold' : 'sec'}" data-aw="${i}">${wd.name}</button>`).join('');
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center"><h2>🎧 Аудирование</h2></div><button class="btn small gold" id="rnd">🎲 Случайный рассказ</button></div>
    <div class="card"><p>Слушай короткие рассказы. Текст спрятан — нужно понять всё на слух! Слушать можно сколько угодно раз, в том числе медленнее.</p>
      <div class="center">${chips}</div><p>Прослушано в этом мире: <b>${doneN}</b> из ${list.length} (открыто: ${openN})</p>${secs}</div>`;
  $('bk').onclick = map;
  app.querySelectorAll('[data-aw]').forEach(b => b.onclick = () => { audWorld = +b.dataset.aw; listening(); });
  app.querySelectorAll('[data-a]').forEach(b => b.onclick = () => playAudio(AUDIOS.find(a => a.id === b.dataset.a)));
  $('rnd').onclick = () => {
    const pool = list.filter(a => audioOpen(a) && !(S.audio[a.id] || {}).done), any = list.filter(audioOpen);
    const src = pool.length ? pool : any;
    if (!src.length) return toast('Пройди хотя бы одну локацию этого мира 🙂');
    playAudio(src[Math.random() * src.length | 0]);
  };
}

// экран с рассказом: только звук, без текста
function listenCard(ctx, a, cb) {
  let token = 0;
  frame(ctx, `<div class="card center"><div class="story">${a.intro}</div><h2>${a.icon} ${a.title}</h2>
    <p>Слушай внимательно — текст спрятан! Потом ответишь на вопросы.</p>
    <div class="prog" id="dots">${a.text.map(() => '<i></i>').join('')}</div>
    <p><button class="speak" id="pl">🎧</button></p>
    <p><button class="btn small sec" id="slow">🐢 Медленнее</button><button class="btn small sec" id="st">⏹ Стоп</button></p>
    <p><button class="btn gold" id="go">К вопросам ➜</button></p></div>`);
  const dots = app.querySelectorAll('#dots i');
  const plBtn = $('pl');
  const stop = () => { token++; hardStop(); dots.forEach(d => d.classList.remove('d')); };
  const play = async rate => {
    const my = ++token; dots.forEach(d => d.classList.remove('d'));
    for (let k = 0; k < a.text.length; k++) {
      if (my !== token) return;
      if (!plBtn.isConnected) { hardStop(); return; } // экран уже сменился
      await speakP(a.text[k].en, rate);
      if (my !== token || !plBtn.isConnected) { if (!plBtn.isConnected) hardStop(); return; }
      dots[k].classList.add('d');
      await new Promise(r => setTimeout(r, 450));
    }
  };
  $('pl').onclick = () => play(.75);
  $('slow').onclick = () => play(.55);
  $('st').onclick = stop;
  $('go').onclick = () => { stop(); cb(); };
  setTimeout(() => play(.75), 500);
}

// «Что ты услышал?» — слышит предложение, выбирает его написанное
function listenPick(ctx, items, cb) {
  let i = 0;
  const ask = () => {
    if (i >= items.length) return cb();
    const it = items[i]; let tries = 0, locked = false;
    frame(ctx, `<div class="card center"><div class="prog">${items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <h3>Что ты услышал?</h3><p><button class="speak" id="sp">🔊</button></p><p><button class="btn small sec" id="slow">🐢 Медленнее</button></p>
      <div id="msg" class="msg">&nbsp;</div>
      <div class="opts gapo long">${shuffle(it.opts).map(x => `<button class="opt gapb" data-v="${x.replace(/"/g, '&quot;')}"><span class="ot">${x}</span></button>`).join('')}</div></div>`);
    $('sp').onclick = () => speak(it.say);
    $('slow').onclick = () => speakP(it.say, .5);
    speakLater(it.say, 400);
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return;
      if (b.dataset.v === it.say) {
        locked = true; b.classList.add('good'); sfx('ok'); $('msg').textContent = praise();
        ctx.asked++; if (tries === 0) ctx.ok++; logQ(tries === 0); i++; waitSpeech(1300, ask);
      } else {
        tries++; b.classList.add('bad'); b.disabled = true; sfx('bad'); $('msg').textContent = 'Почти! Нажми 🔊 или 🐢 и послушай ещё раз 💪';
        if (tries >= 2) app.querySelectorAll('.opt').forEach(x => { if (x.dataset.v === it.say) x.classList.add('hint'); });
      }
    });
  };
  ask();
}

function playAudio(a) {
  const ctx = { L: Object.assign({}, a, { story: 'Вот текст, который ты слушал(а). Прочитай и сравни со своим пониманием!', nextLabel: 'Готово ➜' }), asked: 0, ok: 0 };
  ctx.steps = [['Слушаем', cb => listenCard(ctx, a, cb)],
    ['Вопросы', cb => gapQuiz({ ctx, counted: true, title: 'Ответь по рассказу', items: a.qs }, cb)],
    ['Что услышал', cb => listenPick(ctx, a.pick, cb)],
    ['Текст', cb => readCard(ctx, cb)]];
  runSteps(ctx, () => {
    const acc = ctx.asked ? ctx.ok / ctx.asked : 1, stars = acc >= .9 ? 3 : acc >= .7 ? 2 : 1;
    logDone('aud');
    const rec = S.audio[a.id] || (S.audio[a.id] = { stars: 0, done: false });
    const first = !rec.done; rec.done = true; rec.stars = Math.max(rec.stars, stars);
    const sk = touchStreak(), em = 2 * stars + (first ? 5 : 0) + sk.bonus;
    S.emeralds += em; S.petXp += 1; save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>Ты понял(а) рассказ! 🎧</h1>
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '☆'}</span>`).join('')}</div>
      <p>Верно с первой попытки: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>${sk.msg ? `<p>${sk.msg}</p>` : ''}
      ${stars < 3 ? '<p>Хочешь 3 звезды? Послушай ещё раз — со второго раза понятнее!</p>' : ''}
      <p><button class="btn gold" id="au">К аудированию ➜</button><button class="btn sec" id="rp">Ещё раз</button></p></div>`;
    $('au').onclick = listening; $('rp').onclick = () => playAudio(a);
  });
}

/* ---------- песенки и рифмовки ---------- */
// читает фразу и сообщает, когда закончила (с запасным таймером, если озвучки нет)
function speakP(t, rate) { return new Promise(res => say(t, rate || .7, 0, res)); }
const songOpen = s => S.unlockAll || (S.lessons[s.req] || {}).done;

function songs() {
  hardStop();
  const cards = WORLDS.map((wd, wi) => `<h3>${wd.name}</h3><div class="shop">` + SONGS.filter(s => s.world === wi).map(s => {
    const rec = S.songs[s.id] || {}, ok = songOpen(s);
    return `<div class="item" style="${ok ? '' : 'opacity:.6'}"><div class="ie">${ok ? s.icon : '🔒'}</div><b>${s.title}</b><br>
      ${ok ? `<div>${rec.done ? '⭐'.repeat(rec.stars) : '&nbsp;'}</div><button class="btn small ${rec.done ? 'sec' : 'gold'}" data-s="${s.id}">${rec.done ? 'Ещё раз' : 'Петь'}</button>`
           : `<small>Нужно пройти: ${lessonTitle(s.req)}</small>`}</div>`;
  }).join('') + '</div>').join('');
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center"><h2>🎵 Песенки и рифмовки</h2></div></div>
    <div class="card"><p>Рифмовки помогают запоминать слова и фразы. Слушай робота, пой вместе с ним и допевай рифмы!</p>${cards}</div>`;
  $('bk').onclick = map;
  app.querySelectorAll('[data-s]').forEach(b => b.onclick = () => playSong(SONGS.find(s => s.id === b.dataset.s)));
}

/* текст песенки с подсветкой строк и «петь вместе» */
function songCard(ctx, s, cb, sing) {
  let token = 0, showRu = false;
  const draw = () => {
    frame(ctx, `<div class="card"><h2>${s.icon} ${s.title}</h2>
      <p>${sing ? 'Теперь спой сам(а)! Робот споёт первым, а ты повторяй вслух. Можно петь вместе с мамой или папой.' : 'Нажми «Петь вместе» — робот прочитает рифмовку по строчкам. Повторяй вслух!'}</p>
      <div class="lyrics">${s.lines.map((l, k) => `<div class="sl" data-k="${k}">🔊 ${l.en}${showRu ? `<br><small>${l.ru}</small>` : ''}</div>`).join('')}</div>
      <p class="center"><button class="btn" id="pl">▶ Петь вместе</button><button class="btn sec" id="st">⏹ Стоп</button><button class="btn small sec" id="tr">${showRu ? 'Скрыть перевод' : '🇷🇺 Показать перевод'}</button></p>
      <p class="center"><button class="btn gold" id="go">${sing ? 'Я спел(а)! ➜' : 'Допой слова ➜'}</button></p></div>`);
    const lines = app.querySelectorAll('.sl');
    const hl = k => lines.forEach((x, j) => x.classList.toggle('on', j === k));
    lines.forEach((x, k) => x.onclick = () => { token++; hl(k); speak(s.lines[k].en); });
    const plBtn = $('pl');
    plBtn.onclick = async () => {
      const my = ++token;
      for (let k = 0; k < s.lines.length; k++) {
        if (my !== token) return;
        if (!plBtn.isConnected) { hardStop(); return; } // экран уже сменился
        hl(k); await speakP(s.lines[k].en, .7);
        if (my !== token || !plBtn.isConnected) { if (!plBtn.isConnected) hardStop(); return; }
        await new Promise(r => setTimeout(r, 250));
      }
      if (my === token) hl(-1);
    };
    $('st').onclick = () => { token++; hardStop(); hl(-1); };
    $('tr').onclick = () => { token++; hardStop(); showRu = !showRu; draw(); };
    $('go').onclick = () => { token++; hardStop(); cb(); };
  };
  draw();
}

function playSong(s) {
  const items = s.lines.map(songGap).filter(Boolean);
  const ctx = { L: s, asked: 0, ok: 0 };
  ctx.steps = [['Слушаем', cb => songCard(ctx, s, cb, false)],
    ['Допой слово', cb => gapQuiz({ ctx, counted: true, title: 'Допой рифму!', items: shuffle(items) }, cb)],
    ['Поём сами', cb => songCard(ctx, s, cb, true)]];
  runSteps(ctx, () => {
    const acc = ctx.asked ? ctx.ok / ctx.asked : 1, stars = acc >= .9 ? 3 : acc >= .7 ? 2 : 1;
    logDone('song');
    const rec = S.songs[s.id] || (S.songs[s.id] = { stars: 0, done: false });
    const first = !rec.done; rec.done = true; rec.stars = Math.max(rec.stars, stars);
    const sk = touchStreak(), em = 2 * stars + (first ? 5 : 0) + sk.bonus;
    S.emeralds += em; S.petXp += 1; save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>Отлично спел(а)! 🎤</h1>
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '☆'}</span>`).join('')}</div>
      <p>Рифм с первой попытки: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>${sk.msg ? `<p>${sk.msg}</p>` : ''}
      <p>Спой рифмовку маме или папе — и она запомнится надолго!</p>
      <p><button class="btn gold" id="sg">К песенкам ➜</button><button class="btn sec" id="rp">Ещё раз</button></p></div>`;
    $('sg').onclick = songs; $('rp').onclick = () => playSong(s);
  });
}

/* ---------- диалоги ---------- */
function lessonTitle(id) {
  for (const wd of WORLDS) for (const l of wd.lessons) if (l.id === id) return l.icon + ' ' + l.title;
  return '';
}
const dlgOpen = d => S.unlockAll || (S.lessons[d.req] || {}).done;

function dialogs() {
  hardStop();
  const cards = WORLDS.map((wd, wi) => {
    const list = DIALOGS.filter(d => d.world === wi);
    return `<h3>${wd.name}</h3><div class="shop">` + list.map(d => {
      const rec = S.dlg[d.id] || {}, ok = dlgOpen(d);
      return `<div class="item" style="${ok ? '' : 'opacity:.6'}"><div class="ie">${ok ? d.icon : '🔒'}</div><b>${d.title}</b><br>${d.npc.e} ${d.npc.name}<br>
        ${ok ? `<div>${rec.done ? '⭐'.repeat(rec.stars) : '&nbsp;'}</div><button class="btn small ${rec.done ? 'sec' : 'gold'}" data-d="${d.id}">${rec.done ? 'Ещё раз' : 'Поговорить'}</button>`
             : `<small>Нужно пройти: ${lessonTitle(d.req)}</small>`}</div>`;
    }).join('') + '</div>';
  }).join('');
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center"><h2>💬 Диалоги</h2></div></div>
    <div class="card"><p>Поговори с жителями острова по-английски! Выбирай подходящие ответы. Диалоги открываются, когда пройдена нужная тема.</p>${cards}</div>`;
  $('bk').onclick = map;
  app.querySelectorAll('[data-d]').forEach(b => b.onclick = () => playDialog(DIALOGS.find(d => d.id === b.dataset.d)));
}

function playDialog(d) {
  const hist = []; let i = 0, ok1 = 0, showRu = false;
  const render = () => {
    newScreen();
    const t = d.turns[i]; let tries = 0, locked = false;
    const log = hist.map(h => `<div class="bub npc"><span class="av">${d.npc.e}</span><p>${h.en}</p></div><div class="bub me"><p>${h.ans}</p><span class="av">${hero(34)}</span></div>`).join('');
    app.innerHTML = `<div class="topline"><button class="btn small sec" id="exit">⬅ Диалоги</button><div class="stepname">${d.icon} ${d.title} · ${i + 1}/${d.turns.length}</div></div>
      <div class="card"><div class="chat">${log}
        <div class="bub npc"><span class="av">${d.npc.e}</span><p>${t.en}${showRu ? `<br><small>${t.ru}</small>` : ''}</p><button class="btn small sec" id="sp">🔊</button></div></div>
        <p class="center"><button class="btn small sec" id="tr">${showRu ? 'Скрыть перевод' : '🇷🇺 Показать перевод'}</button></p>
        <div id="msg" class="msg center">Выбери ответ:</div>
        <div class="opts gapo long">${shuffle(t.opts).map(x => `<button class="opt gapb" data-v="${x.replace(/"/g, '&quot;')}"><span class="ot">${x}</span></button>`).join('')}</div></div>`;
    $('exit').onclick = () => { stopAll(); dialogs(); };
    $('sp').onclick = () => speak(t.en);
    $('tr').onclick = () => { showRu = !showRu; render(); };
    speakLater(t.en, 300);
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return;
      if (b.dataset.v === t.ans) {
        locked = true; b.classList.add('good'); sfx('ok'); speak(t.ans); $('msg').textContent = praise();
        if (tries === 0) ok1++;
        grSrs(t, tries === 0); save();
        hist.push(t); i++;
        waitSpeech(1500, () => (i >= d.turns.length ? finish() : render()));
      } else {
        tries++; b.classList.add('bad'); b.disabled = true; sfx('bad');
        $('msg').textContent = 'Почти! Нажми «Показать перевод» и подумай ещё 💪';
        if (tries >= 2) app.querySelectorAll('.opt').forEach(x => { if (x.dataset.v === t.ans) x.classList.add('hint'); });
      }
    });
  };
  function finish() {
    const n = d.turns.length, stars = ok1 === n ? 3 : ok1 >= n * .7 ? 2 : 1;
    const rec = S.dlg[d.id] || (S.dlg[d.id] = { stars: 0, done: false });
    const first = !rec.done; rec.done = true; rec.stars = Math.max(rec.stars, stars);
    logDone('dlg');
    const sk = touchStreak(); const em = 2 * stars + (first ? 5 : 0) + sk.bonus;
    S.emeralds += em; S.petXp += 1; save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>Диалог пройден! 🎉</h1>
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '☆'}</span>`).join('')}</div>
      <p>Верно с первой попытки: ${ok1} из ${n}</p><p class="chip">+${em} 💎</p>${sk.msg ? `<p>${sk.msg}</p>` : ''}
      <div class="chat" style="text-align:left">${d.turns.map(h => `<div class="bub npc"><span class="av">${d.npc.e}</span><p>${h.en}</p></div><div class="bub me"><p>${h.ans}</p><span class="av">${hero(34)}</span></div>`).join('')}</div>
      <p>Прочитай диалог вслух по ролям: сначала за ${d.npc.name}, потом за себя!</p>
      <p><button class="btn gold" id="dl">К диалогам ➜</button><button class="btn sec" id="rp">Ещё раз</button></p></div>`;
    $('dl').onclick = dialogs; $('rp').onclick = () => playDialog(d);
  }
  render();
}

/* ---------- тренировка слабых мест ---------- */
function training() {
  const wk0 = weakItems(), dl = engDiaryLessons();
  const dW = [].concat(...dl.map(l => l.words || [])), dG = [].concat(...dl.map(l => l.gaps || [])).map(gkey).filter(k => GAPIDX[k]);
  const wk = { words: [...new Set(dW.slice(0, 6).concat(wk0.words))], gaps: [...new Set(dG.slice(0, 4).concat(wk0.gaps))] };
  let wN = Math.min(wk.words.length, 6), gN = Math.min(wk.gaps.length, 4);
  if (wN < 6) gN = Math.min(wk.gaps.length, 10 - wN);
  if (gN < 4) wN = Math.min(wk.words.length, 10 - gN);
  if (!wN && !gN) {
    app.innerHTML = `<div class="card center"><h1>💪 Тренировка</h1><div style="font-size:5rem">✅</div>
      <p>Слабых мест пока нет! Робот будет добавлять сюда слова и правила, в которых ты ошибаешься.</p>
      <p>Проходи новые локации — и если что-то не получится, оно появится здесь.</p>
      <p><button class="btn gold" id="mp">На карту ➜</button></p></div>`;
    $('mp').onclick = map; return;
  }
  const words = wk.words.slice(0, wN), gaps = wk.gaps.slice(0, gN).map(k => GAPIDX[k]);
  const ctx = { L: { title: 'Тренировка', words: words.length ? words : Object.keys(WORDS).slice(0, 6) }, i: -1, asked: 0, ok: 0 };
  const modes = ['see', 'listen', 'mine'];
  ctx.steps = [];
  if (words.length) ctx.steps.push(['Слова', cb => quiz({ ctx, counted: true, mode: k => modes[k % 3], items: shuffle(words) }, cb)]);
  if (gaps.length) ctx.steps.push(['Правила', cb => gapQuiz({ ctx, counted: true, items: shuffle(gaps) }, cb)]);
  app.innerHTML = `<div class="card center"><h1>💪 Тренировка</h1><div style="font-size:5rem">🤖</div>
    <p>Робот-тренер подобрал то, что получалось хуже всего: <b>${words.length}</b> ${words.length === 1 ? 'слово' : 'слов'} и <b>${gaps.length}</b> ${gaps.length === 1 ? 'правило' : 'правил'}.</p>
    ${dl.length ? `<p>📓 Темы из дневника: ${dl.map(l => esc(l.title)).join(', ')}.</p>` : ''}
    <p>Это быстро — около 5 минут. Три верных ответа подряд, и слово перестаёт быть «слабым»!</p>
    <p><button class="btn gold" id="go">Начать ➜</button><button class="btn sec" id="bk">Не сейчас</button></p></div>`;
  $('bk').onclick = map;
  $('go').onclick = () => runSteps(ctx, () => {
    logDone('tr');
    const em = Math.round(Math.min(10, ctx.ok) * emMult()), sk = touchStreak(); addXp(5 + ctx.ok); S.emeralds += em + sk.bonus; S.petXp += 1; save(); sfx('win');
    const now = weakItems(), left = now.words.length + now.gaps.length, before = wk0.words.length + wk0.gaps.length;
    app.innerHTML = `<div class="card center"><h1>Тренировка пройдена! 🎉</h1>
      <p>Верно с первой попытки: <b>${ctx.ok} из ${ctx.asked}</b></p><p class="chip">+${em + sk.bonus} 💎</p>
      ${sk.msg ? `<p>${sk.msg}</p>` : ''}
      <p>${left === 0 ? '🌟 Слабых мест не осталось!' : left < before ? `Стало лучше! Осталось слабых мест: <b>${left}</b>. Потренируйся ещё завтра.` : `Слабых мест: <b>${left}</b>. Слово уходит из списка после 3 верных ответов подряд — приходи тренироваться каждый день по чуть-чуть.`}</p>
      <p><button class="btn gold" id="mp">На карту ➜</button>${left ? '<button class="btn sec" id="ag">Ещё раз</button>' : ''}</p></div>`;
    $('mp').onclick = map; if ($('ag')) $('ag').onclick = training;
  });
}

/* ---------- разведка (диагностика) ---------- */
function diagIntro() {
  app.innerHTML = `<div class="card center"><h1>🔎 Разведка</h1><div style="font-size:5rem">🤖</div>
    <p>Робот хочет узнать, что ты уже умеешь, чтобы тебе не было скучно на лёгком. Это не оценка, ошибаться можно!</p>
    <p>Вопросы идут от простых к сложным. Если станет трудно, мы просто остановимся и начнём с нужного места.</p>
    <p><button class="btn gold" id="d1">Начать разведку ➜</button></p>
    <p><button class="btn small sec" id="d2">Пропустить и начать с самого начала</button></p></div>`;
  $('d1').onclick = diag;
  $('d2').onclick = () => { S.diagDone = true; save(); map(); };
}

function diagQ(L, used) {
  if (L.type === 'gram' || L.type === 'read') {
    const arr = L.type === 'gram' ? L.gaps : L.qs;
    let c = arr.filter(x => !used.includes(x)); if (!c.length) c = arr;
    const g = sample(c, 1)[0]; used.push(g);
    return { kind: 'gap', g, text: L.type === 'read' ? L.text : null };
  }
  let ids = L.words.filter(x => !used.includes(x)); if (!ids.length) ids = L.words;
  const id = sample(ids, 1)[0]; used.push(id);
  let pool = shuffle(L.words.filter(x => x !== id));
  if (pool.length < 3) pool = pool.concat(shuffle(Object.keys(WORDS).filter(x => x !== id && !pool.includes(x))));
  return { kind: 'word', id, opts: shuffle([id].concat(pool.slice(0, 3))) };
}

function diag() {
  const flat = [];
  WORLDS.forEach((wd, wi) => wd.lessons.forEach((L, li) => flat.push({ wi, li, L })));
  let p = flat.findIndex(f => !(S.lessons[f.L.id] || {}).done);
  if (p < 0) { S.diagDone = true; save(); toast('Все локации уже пройдены 🎉'); return map(); }
  const MAX = 75; let asked = 0, passed = 0, stopped = false;

  function ask(f, used, cb) {
    const q = diagQ(f.L, used);
    let prompt, optHTML, ans, sayOk;
    if (q.kind === 'word') {
      const w = WORDS[q.id]; ans = q.id; sayOk = w.en;
      prompt = `<div class="bigemoji">${w.e}</div><p>Как это по-английски?</p>`;
      optHTML = q.opts.map(id => `<button class="opt see" data-v="${id}"><span class="ot">${WORDS[id].en}</span></button>`).join('');
    } else {
      const g = q.g, hasGap = g.en.includes('___'); ans = g.ans; sayOk = g.en.replace('___', g.ans);
      const text = q.text ? `<div class="rule" style="text-align:left;font-size:1rem">${q.text.map(s => s.en).join(' ')}</div>` : '';
      prompt = `${text}<p class="ru">${g.ru}</p><div class="gsent">${g.en.replace('___', '<span class="gap">___</span>')}</div>`;
      optHTML = shuffle(g.opts).map(x => `<button class="opt gapb" data-v="${x}"><span class="ot">${x}</span></button>`).join('');
      q.long = !hasGap;
    }
    app.innerHTML = `<div class="topline"><button class="btn small sec" id="exit">⬅ Карта</button><div class="stepname">Разведка · вопрос ${asked + 1}</div></div>
      <div class="card center">${prompt}<div id="msg" class="msg">&nbsp;</div>
      <div class="opts ${q.kind === 'word' ? 'see' : 'gapo' + (q.long ? ' long' : '')}">${optHTML}</div></div>`;
    $('exit').onclick = () => { stopped = true; stopAll(); map(); };
    let locked = false;
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (locked) return; locked = true;
      const ok = b.dataset.v === ans;
      b.classList.add(ok ? 'good' : 'bad');
      if (!ok) app.querySelectorAll('.opt').forEach(x => { if (x.dataset.v === ans) x.classList.add('good'); });
      sfx(ok ? 'ok' : 'bad'); speak(sayOk);
      $('msg').textContent = ok ? praise() : 'Ничего, запомним: ' + sayOk;
      asked++;
      waitSpeech(ok ? 1000 : 2200, () => { if (!stopped) cb(ok); });
    });
  }

  function lessonLoop() {
    if (p >= flat.length || asked >= MAX) return finish();
    const f = flat[p], used = [];
    const pass = () => {
      S.lessons[f.L.id] = { stars: 2, done: true };
      (f.L.words || []).forEach(id => { const w = ensureWord(id); w.first = 'diag'; w.seen = 1; w.box = 1; w.due = addDays(today(), 1); });
      if (f.li === WORLDS[f.wi].lessons.length - 1) S.lessons[WORLDS[f.wi].boss.id] = { stars: 2, done: true };
      S.emeralds += 2; passed++; save(); p++; lessonLoop();
    };
    ask(f, used, ok1 => ok1 ? pass() :
      ask(f, used, ok2 => !ok2 ? finish() :
        ask(f, used, ok3 => ok3 ? pass() : finish())));
  }

  function finish() {
    S.diagDone = true; S.diagRun = true;
    const ni = flat.findIndex(f => !(S.lessons[f.L.id] || {}).done);
    S.world = ni < 0 ? WORLDS.length - 1 : flat[ni].wi;
    save(); sfx('win');
    const nf = ni < 0 ? null : flat[ni];
    app.innerHTML = `<div class="card center"><h1>Разведка завершена! 🎉</h1><div style="font-size:5rem">🤖</div>
      ${passed ? `<p>Ты уже знаешь ${passed} ${passed === 1 ? 'локацию' : 'локаций'} — их можно пропустить! <span class="chip">+${passed * 2} 💎</span></p>` : '<p>Мы начнём с самого начала — там много интересного и много наград!</p>'}
      ${nf ? `<p>Твоя стартовая локация: <b>${nf.L.icon} ${nf.L.title}</b> (${WORLDS[nf.wi].name}).</p>` : '<p>Остался только финальный босс!</p>'}
      <p>Пропущенные слова вернутся в «Разминках», чтобы ты их не забыл.</p>
      <p><button class="btn gold" id="mp">На карту ➜</button></p></div>`;
    $('mp').onclick = map;
  }

  lessonLoop();
}

/* ---------- старт ---------- */
applyTheme();
syncSoon(true);
if (PR.list.length > 1) players(); // на общем планшете сначала выбираем, кто занимается
else S.name ? map() : welcome();
})();
