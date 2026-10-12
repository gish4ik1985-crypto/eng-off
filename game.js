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
  t_r7: { e: '🏆', n: 'Мастер острова', p: 999, a: 'l60' },
  t_s_math: { e: '🧮', n: 'Великий математик', p: 999, a: 'math_l3' }, t_s_ru: { e: '✒️', n: 'Мастер русского', p: 999, a: 'ru_l3' },
  t_s_ow: { e: '🔭', n: 'Учёный-натуралист', p: 999, a: 'ow_l3' }, t_s_izo: { e: '🖌️', n: 'Художник-мастер', p: 999, a: 'izo_l3' },
  t_s_pdd: { e: '🚦', n: 'Инспектор дорог', p: 999, a: 'pdd_l3' }, t_s_lit: { e: '📖', n: 'Книжный мудрец', p: 999, a: 'lit_l3' },
  t_s_logic: { e: '♟️', n: 'Гроссмейстер', p: 999, a: 'logic_l3' }, t_s_att: { e: '🎯', n: 'Снайпер внимания', p: 999, a: 'att_l3' },
  t_s_all: { e: '🦉', n: 'Энциклопедист', p: 999, a: 'multi5' }, t_s_boss: { e: '🗡️', n: 'Охотник на боссов', p: 999, a: 'multiB' }
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
// ---- вещи «за знания»: купить можно, только когда пройдено нужное число уроков предмета (need: [предмет, уроков]; '*' — число разных предметов) ----
// [ключ, слот, картинка, название, цена, предмет, уроков, доп. (линия питомца или фон)]
const KNOW_LIST = [
  ['k_eng_h', 'hat', '💂', 'Шапка гвардейца', 14, 'eng', 3], ['k_eng_i', 'hand', '☂️', 'Лондонский зонт', 12, 'eng', 8],
  ['k_eng_b', 'back', '🚌', 'Красный автобус', 22, 'eng', 15], ['k_eng_t', 'theme', '', 'Лондон', 30, 'eng', 20, 'linear-gradient(#b0c4de,#6d8fb3 65%,#c0392b 65%)'],
  ['k_eng_ti', 'title', '🎡', 'Знаток английского', 25, 'eng', 30],
  ['k_it_i', 'hand', '🍝', 'Тарелка пасты', 10, 'it', 3], ['k_it_b', 'back', '🛵', 'Мотороллер', 20, 'it', 8],
  ['k_it_t', 'theme', '', 'Венеция', 30, 'it', 12, 'linear-gradient(#ffcc80,#ffab91 45%,#4fc3f7 45%,#0277bd)'], ['k_it_ti', 'title', '🏛️', 'Синьор итальянский', 25, 'it', 20],
  ['k_math_i', 'hand', '📐', 'Угольник', 8, 'math', 2], ['k_math_h', 'hat', '🧠', 'Большой мозг', 14, 'math', 5],
  ['k_math_b', 'back', '🧮', 'Счёты', 18, 'math', 10], ['k_math_p', 'pet', '', 'Числовой зверёк', 40, 'math', 15, ['🥚', '🔢', '➕', '✖️', '🧮', '♾️']],
  ['k_math_t', 'theme', '', 'Тетрадь в клетку', 30, 'math', 25, 'repeating-linear-gradient(0deg,transparent 0 23px,#bcd7f5 23px 24px),repeating-linear-gradient(90deg,#f4f9ff 0 23px,#bcd7f5 23px 24px)'],
  ['k_ru_i', 'hand', '✒️', 'Перо', 8, 'ru', 2], ['k_ru_b', 'back', '📜', 'Свиток правил', 14, 'ru', 5],
  ['k_ru_i2', 'hand', '🖋️', 'Золотая ручка', 20, 'ru', 10], ['k_ru_ti', 'title', '✍️', 'Каллиграф', 20, 'ru', 15],
  ['k_ru_t', 'theme', '', 'Пропись', 25, 'ru', 20, 'repeating-linear-gradient(0deg,#fffdf0 0 30px,#9ec5e8 30px 31px)'],
  ['k_ow_h', 'hat', '🌻', 'Подсолнух', 8, 'ow', 2], ['k_ow_i', 'hand', '🔍', 'Лупа', 12, 'ow', 5],
  ['k_ow_b', 'back', '🦔', 'Ёжик', 16, 'ow', 8], ['k_ow_p', 'pet', '', 'Северный друг', 45, 'ow', 12, ['🥚', '🐧', '🦭', '🦌', '🐋', '🌌']],
  ['k_ow_t', 'theme', '', 'Северное сияние', 35, 'ow', 20, 'linear-gradient(#0b3d2e,#1de9b6 55%,#7c4dff)'],
  ['k_izo_i', 'hand', '🖍️', 'Восковой мелок', 8, 'izo', 2], ['k_izo_h', 'hat', '🎨', 'Шляпа-палитра', 14, 'izo', 5],
  ['k_izo_b', 'back', '🖼️', 'Картина в раме', 18, 'izo', 10], ['k_izo_t', 'theme', '', 'Мастерская', 30, 'izo', 15, 'linear-gradient(135deg,#ffcdd2,#fff59d,#b3e5fc,#e1bee7)'],
  ['k_izo_ti', 'title', '🌈', 'Юный художник', 20, 'izo', 25],
  ['k_pdd_i', 'hand', '🛑', 'Знак «Стоп»', 8, 'pdd', 2], ['k_pdd_h', 'hat', '🚨', 'Мигалка', 12, 'pdd', 4],
  ['k_pdd_b', 'back', '🚲', 'Велосипед', 18, 'pdd', 6], ['k_pdd_ti', 'title', '🦺', 'Безопасный пешеход', 15, 'pdd', 8],
  ['k_pdd_p', 'pet', '', 'Машинка', 45, 'pdd', 12, ['🥚', '🛴', '🚲', '🛵', '🚗', '🚒']],
  ['k_pdd_t', 'theme', '', 'Город', 30, 'pdd', 18, 'linear-gradient(#90caf9 0 62%,#757575 62% 64%,#9e9e9e 64%)'],
  ['k_lit_i', 'hand', '🪶', 'Гусиное перо', 8, 'lit', 3], ['k_lit_b', 'back', '📚', 'Стопка книг', 14, 'lit', 6],
  ['k_lit_p', 'pet', '', 'Сказочный друг', 45, 'lit', 10, ['🥚', '🐸', '🦢', '🐺', '🦊', '🐉']],
  ['k_lit_t', 'theme', '', 'Сказочный лес', 30, 'lit', 15, 'linear-gradient(#a5d6a7,#2e7d32 60%,#4a148c)'], ['k_lit_ti', 'title', '📜', 'Сказитель', 20, 'lit', 20],
  ['k_logic_i', 'hand', '♟️', 'Пешка', 8, 'logic', 2], ['k_logic_h', 'hat', '🧩', 'Шапка-пазл', 14, 'logic', 5],
  ['k_logic_b', 'back', '🎲', 'Игральный кубик', 16, 'logic', 8], ['k_logic_ti', 'title', '🤔', 'Мыслитель', 20, 'logic', 12],
  ['k_logic_t', 'theme', '', 'Шахматная доска', 30, 'logic', 18, 'repeating-conic-gradient(#f0d9b5 0 25%,#b58863 0 50%) 0 0/96px 96px'],
  ['k_att_h', 'hat', '🎯', 'Мишень', 8, 'att', 2], ['k_att_f', 'face', '👀', 'Зоркие глаза', 12, 'att', 4],
  ['k_att_b', 'back', '🛰️', 'Спутник', 16, 'att', 7], ['k_att_p', 'pet', '', 'Сова-наблюдатель', 40, 'att', 10, ['🥚', '🐥', '🐤', '🦉', '🦅', '🌠']],
  ['k_att_t', 'theme', '', 'Тихая гавань', 25, 'att', 12, 'linear-gradient(#e0f7fa,#b2dfdb)'],
  ['k_all_i', 'hand', '🌐', 'Глобус', 12, '*', 3], ['k_all_h', 'hat', '🪐', 'Сатурн на голове', 20, '*', 5],
  ['k_all_b', 'back', '🎓', 'Диплом знатока', 25, '*', 7], ['k_all_t', 'theme', '', 'Вселенная знаний', 40, '*', 9, 'linear-gradient(#0b1030,#3a1c71 50%,#d76d77 80%,#ffaf7b)']
];
const KNOW = {}; // ключ магазина → { it, tab }
KNOW_LIST.forEach(([k, slot, e, n, p, subj, cnt, x]) => {
  const need = [subj, cnt];
  if (slot === 'pet') { PET_LINES[k] = { n, p, need, line: x }; KNOW['pet_' + k] = { it: PET_LINES[k], tab: 'pet' }; return; }
  if (slot === 'theme') { THEMES[k] = { n, p, need, bg: x }; KNOW[k] = { it: THEMES[k], tab: 'theme' }; return; }
  const src = { hat: HATS, face: FACES, back: BACKS, hand: HANDS, title: TITLES }[slot];
  src[k] = { e, n, p, need }; if (slot !== 'title') ITEMS[k] = src[k]; KNOW[k] = { it: src[k], tab: slot };
});
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
  subj: 'eng', mworld: 0, rworld: 0, oworld: 0, iworld: 0, pworld: 0, lworld: 0, gworld: 0, off: {}, focus: false, hrs: {}, wds: {}, plan: { on: false }, wish: [], aworld: 0, izoDay: '', strict: false, itworld: 0, onlineTts: false, mt: {}, xp: 0, up: {}, inv: {}, potionOn: false, chestDay: '', goal: null, repDay: '', repCnt: {}, hwPaid: {}, schoolChild: '', sets: {}, log: {}, dlg: {}, songs: {}, audio: {}, lessons: {}, words: {}, streak: 0, lastDay: '', bonusGiven: {}, petXp: 0, mute: false, unlockAll: false, world: 0, gr: {}, diagDone: false
});
// предметы: английский (WORLDS) и математика (MWORLDS); у каждого свои миры
const skind = () => S.subj === 'it' ? 'it' : S.subj === 'ru' ? 'ru' : S.subj === 'ow' ? 'ow' : S.subj === 'izo' ? 'izo' : S.subj === 'pdd' ? 'pdd' : S.subj === 'lit' ? 'lit' : S.subj === 'logic' ? 'logic' : S.subj === 'att' ? 'att' : S.subj === 'math' ? 'math' : 'eng';
const isGen = () => S.subj === 'math' || S.subj === 'ru' || S.subj === 'ow' || S.subj === 'izo' || S.subj === 'pdd' || S.subj === 'lit' || S.subj === 'logic' || S.subj === 'att'; // предметы с генерируемыми заданиями
const genWorlds = () => S.subj === 'ru' ? RWORLDS : S.subj === 'ow' ? OWORLDS : S.subj === 'izo' ? IWORLDS : S.subj === 'pdd' ? PWORLDS : S.subj === 'lit' ? LWORLDS : S.subj === 'logic' ? GWORLDS : S.subj === 'att' ? AWORLDS : MWORLDS;
const WS = () => isGen() ? genWorlds() : WORLDS;
const widx = () => S.subj === 'it' ? (S.itworld || 0) : S.subj === 'math' ? (S.mworld || 0) : S.subj === 'ru' ? (S.rworld || 0) : S.subj === 'ow' ? (S.oworld || 0) : S.subj === 'izo' ? (S.iworld || 0) : S.subj === 'pdd' ? (S.pworld || 0) : S.subj === 'lit' ? (S.lworld || 0) : S.subj === 'logic' ? (S.gworld || 0) : S.subj === 'att' ? (S.aworld || 0) : S.world;
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
// Важно: на планшете звук разрешается только по «настоящему» нажатию — когда палец отпущен (touchend/pointerup/click),
// касание (touchstart/pointerdown) не считается. Поэтому будим на каждом нажатии, пока звук реально не заработает,
// и снова — если планшет его усыпил (после сворачивания игры, блокировки экрана, звонка).
let speechPrimed = false;
try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} // iPad: звуки игры слышны и при беззвучном режиме, как у видео
function unlockAudio() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state !== 'running') {
      const r = ac.resume(); if (r && r.catch) r.catch(() => {});
      const b = ac.createBuffer(1, 1, 22050), s = ac.createBufferSource(); s.buffer = b; s.connect(ac.destination); s.start(0); // тихий «щелчок» — так iOS открывает звук
    }
  } catch (e) {}
  if (!speechPrimed) try { if ('speechSynthesis' in window) { speechPrimed = true; const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
}
['pointerup', 'touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, unlockAudio, { capture: true, passive: true }));
/* Речь: одно «состояние речи» на всё приложение.
   seq — номер последней фразы (старые фразы и их отложенные запуски отменяются),
   until — когда фраза должна закончиться по расчёту, ended — подтвердил ли браузер конец,
   sfxUntil — до какого момента звучит звуковой сигнал (речь стартует после него, чтобы они не мешали друг другу). */
const SPK = { seq: 0, until: 0, ended: true, sfxUntil: 0 };
const speechOn = () => 'speechSynthesis' in window;
let enVoice = null; // голос изучаемого языка (английского или итальянского)
let LNOW = LANGINFO.en; // сведения о текущем языке изучения
const LN = () => LNOW;
// выбор голоса: родитель может выбрать сам (хранится на этом устройстве — у каждого планшета свои голоса),
// иначе берём лучший: британский для английского, «живые» нейросетевые голоса выше простых, шуточные голоса Apple — никогда
const VOICE_KEY = () => 'engAdventure_voice_' + (LNOW === LANGINFO.it ? 'it' : 'en');
const voiceWish = v => { try { if (v === undefined) return localStorage.getItem(VOICE_KEY()) || ''; localStorage.setItem(VOICE_KEY(), v); } catch (e) { return ''; } };
const FUN_VOICES = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i;
function voiceScore(v) {
  const base = LNOW.tts.replace('-', '[-_]');
  let sc = new RegExp('^' + base, 'i').test(v.lang) ? 50 : LNOW.re.test(v.lang) ? 20 : -999;
  if (/natural|neural|online|enhanced|premium|siri/i.test(v.name)) sc += 30;
  if (/google/i.test(v.name)) sc += 20;
  if (/compact/i.test(v.name)) sc -= 10;
  if (FUN_VOICES.test(v.name)) sc -= 200;
  return sc;
}
const langVoices = () => { try { return speechSynthesis.getVoices().filter(v => LNOW.re.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a)); } catch (e) { return []; } };
function pickVoice() {
  try {
    const vs = langVoices(), want = voiceWish();
    enVoice = (want && vs.find(v => v.name === want)) || vs.find(v => voiceScore(v) > 0) || null;
  } catch (e) {}
  return enVoice;
}
if (speechOn()) { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', () => { pickVoice(); setTimeout(() => { try { voiceCheck(); } catch (e) {} }, 300); }); } catch (e) {} }

function tones(freqs, kind) {
  if (kind === 'bad' && S.focus) { setTimeout(() => { const h = $('hintb'); if (h) h.classList.add('nudge'); }, 300); return; } // «Спокойный фокус»: без звука ошибки, мягко подсвечиваем подсказку
  if (S.mute) return;
  if (kind === 'bad' && !SPK.ended && Date.now() < SPK.until) return; // не перебиваем речь сигналом ошибки
  SPK.sfxUntil = Date.now() + freqs.length * 120 + 80;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state !== 'running') { const r = ac.resume(); if (r && r.catch) r.catch(() => {}); }
    freqs.forEach((f, k) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = S.focus ? 'sine' : 'square'; o.frequency.value = f; g.gain.value = S.focus ? .025 : .05;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime + k * .12; o.start(t); o.stop(t + .11);
    });
  } catch (e) {}
}
const sfx = k => { try { fx(k); budReact(k); } catch (e) {} return tones({ ok: [523, 659, 784], bad: [200, 160], win: [523, 659, 784, 1047, 1319] }[k], k); };
// праздничные эффекты: искорки там, где ребёнок нажал верный ответ, и конфетти при победе (в спокойном режиме — нет)
const FXP = { x: 0, y: 0, t: 0 };
document.addEventListener('pointerdown', e => { FXP.x = e.clientX; FXP.y = e.clientY; FXP.t = Date.now(); }, true);
function fxPiece(txt, css, frames, ms, delay) {
  const el = document.createElement('div'); el.className = 'fx'; el.textContent = txt; Object.assign(el.style, css);
  document.body.appendChild(el);
  const a = el.animate ? el.animate(frames, { duration: ms, delay: delay || 0, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }) : null;
  setTimeout(() => el.remove(), ms + (delay || 0) + 60); return a;
}
function fx(k) {
  if (S.focus || !document.body.animate || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const W0 = innerWidth, H0 = innerHeight;
  if (k === 'ok') {
    const near = Date.now() - FXP.t < 2000, x = near ? FXP.x : W0 / 2, y = near ? FXP.y : H0 / 2;
    const cols = ['#ffc400', '#ff6a9a', '#3fd06a', '#4f9fff', '#b06cff'];
    for (let i = 0; i < 12; i++) {
      const ang = i / 12 * Math.PI * 2 + Math.random() * .4, d = 46 + Math.random() * 46, dx = Math.cos(ang) * d, dy = Math.sin(ang) * d;
      fxPiece(i % 3 ? '✦' : '★', { color: cols[i % cols.length], fontSize: (14 + Math.random() * 12) + 'px', textShadow: '0 1px 2px rgba(0,0,0,.25)' },
        [{ transform: `translate(${x}px,${y}px) translate(-50%,-50%) scale(.3)`, opacity: 1 }, { transform: `translate(${x + dx}px,${y + dy}px) translate(-50%,-50%) scale(1.1) rotate(${dx > 0 ? 90 : -90}deg)`, opacity: 0 }], 650);
    }
  } else if (k === 'win') {
    const cols = ['#ffc400', '#ff6a9a', '#3fd06a', '#4f9fff', '#b06cff', '#ff8a3d'];
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * W0, dx = (Math.random() - .5) * 160, r = Math.random() * 720 - 360, w = 7 + Math.random() * 7;
      fxPiece('', { width: w + 'px', height: (w * 1.6) + 'px', background: cols[i % cols.length], borderRadius: i % 4 ? '2px' : '50%' },
        [{ transform: `translate(${x}px,-30px) rotate(0deg)`, opacity: 1 }, { transform: `translate(${x + dx}px,${H0 * .55}px) rotate(${r / 2}deg)`, opacity: 1, offset: .55 }, { transform: `translate(${x + dx * 1.6}px,${H0 + 30}px) rotate(${r}deg)`, opacity: .9 }],
        1900 + Math.random() * 900, Math.random() * 500);
    }
  }
}

// say: говорит t (rate — скорость). Если уже что-то говорится, сначала останавливает, ждёт немного (иначе на Android
// слово «съедается») и говорит новое. done вызывается, когда фраза закончилась или отменена.
let ONLINE_AUDIO = null; // запасная озвучка через интернет (только если включена родителем и на устройстве нет голоса языка)
function sayOnline(t, rate, delay, done) {
  const my = ++SPK.seq; let fin = false; const finish = () => { if (!fin) { fin = true; if (done) done(); } };
  try { speechSynthesis.cancel(); } catch (e) {}
  if (ONLINE_AUDIO) { try { ONLINE_AUDIO.pause(); } catch (e) {} ONLINE_AUDIO = null; }
  const wait = Math.max(delay || 0, SPK.sfxUntil - Date.now(), 0);
  SPK.ended = false; SPK.until = Date.now() + wait + Math.max(1500, t.length * 120 + 1000);
  setTimeout(finish, wait + t.length * 150 + 6000);
  setTimeout(() => {
    if (my !== SPK.seq) return finish();
    try {
      const a = new Audio('https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=' + (LNOW === LANGINFO.it ? 'it' : 'en-GB') + '&q=' + encodeURIComponent(t));
      ONLINE_AUDIO = a; a.playbackRate = rate && rate < .8 ? .85 : 1;
      a.onended = a.onerror = () => { if (my === SPK.seq) SPK.ended = true; finish(); };
      const pr = a.play(); if (pr && pr.catch) pr.catch(() => { if (my === SPK.seq) SPK.ended = true; finish(); });
    } catch (e) { finish(); }
  }, wait);
}
// нет на устройстве голоса нужного языка (иначе слова читает русский голос: max → «мах») — при интернете берём онлайн-голос сам,
// если родитель не выключил это (S.ttsAuto === false); S.onlineTts — включено родителем вручную
const noLangVoice = () => { try { return !speechOn() || (speechSynthesis.getVoices().length > 0 && !speechSynthesis.getVoices().some(v => LNOW.re.test(v.lang))); } catch (e) { return false; } };
const useOnlineTts = () => { try { return navigator.onLine && (S.onlineTts || S.ttsAuto !== false) && noLangVoice(); } catch (e) { return false; } };
function say(t, rate, delay, done) {
  if (tmLocked) { if (done) done(); return; }
  if (useOnlineTts()) return sayOnline(t, rate, delay, done);
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
      const u = new SpeechSynthesisUtterance(t); u.lang = LNOW.tts; u.rate = rate || .8;
      try { const v = enVoice || pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } } catch (e) { enVoice = null; } // сбой голоса не должен заглушать речь
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
  if (ONLINE_AUDIO) { try { ONLINE_AUDIO.pause(); } catch (e) {} ONLINE_AUDIO = null; }
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
function newScreen() { screenId++; hardStop(); tmFree = false; budHide(); }
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
function logQn(n, okN) {
  const d = dayRec(); d.q += n; d.ok += okN;
  const nw = new Date(), h = nw.getHours(), wd = (nw.getDay() + 6) % 7; S.hrs = S.hrs || {}; S.wds = S.wds || {};
  const a = S.hrs[h] || (S.hrs[h] = { q: 0, ok: 0 }), b = S.wds[wd] || (S.wds[wd] = { q: 0, ok: 0 });
  a.q += n; a.ok += okN; b.q += n; b.ok += okN;
}
let combo = 0, maxCombo = 0; // серия верных ответов подряд в текущем занятии
function logQ(ok) {
  logQn(1, ok ? 1 : 0);
  if (ok) petEarn();
  if (ok) { combo++; maxCombo = Math.max(maxCombo, combo); addXp(1); if ([3, 5, 10, 15, 20].includes(combo)) budSay(combo >= 10 ? `${combo} подряд!!! Ты чемпион! 🏆` : `${combo} подряд! 🔥`, true); } else combo = 0;
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
function buildGapIdx() {
  Object.keys(GAPIDX).forEach(k => delete GAPIDX[k]);
  WORLDS.forEach(wd => wd.lessons.forEach(l => (l.gaps || []).forEach(g => { GAPIDX[gkey(g)] = g; }))); // вопросы по тексту без самого текста в «Тренировку» не берём
  DIALOGS.forEach(d => d.turns.forEach(t => { GAPIDX[gkey(t)] = t; })); // реплики диалогов тоже попадают в «Тренировку»
  SONGS.forEach(s => s.lines.forEach(l => { const g = songGap(l); if (g) GAPIDX[gkey(g)] = g; })); // и рифмы из песенок
}
buildGapIdx();
// смена языка изучения: подменяем данные на месте (слова, миры, диалоги, песенки, аудирование)
let curLang = 'en';
function langUse(code) {
  if (code === curLang) return;
  const pack = code === 'it' ? IT_PACK : EN_PACK;
  Object.keys(WORDS).forEach(k => delete WORDS[k]); Object.assign(WORDS, pack.WORDS);
  [[WORLDS, pack.WORLDS], [DIALOGS, pack.DIALOGS], [SONGS, pack.SONGS], [AUDIOS, pack.AUDIOS], [TALES, pack.TALES]].forEach(([arr, src]) => { arr.length = 0; src.forEach(x => arr.push(x)); });
  curLang = code; LNOW = LANGINFO[code]; enVoice = null;
  EXAMPLES = null; ENG_IDX = null; audWorld = -1; try { vf.world = -1; } catch (e) {}
  buildGapIdx(); if (speechOn()) pickVoice();
}
const syncLang = () => langUse(S.subj === 'it' ? 'it' : 'en');
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
    .filter(id => WORDS[id] && !L.words.includes(id) && S.words[id].due <= today() && S.words[id].seen > 0) // только слова текущего языка (английский и итальянский учатся в одном профиле)
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
  document.body.classList.toggle('calm', !!S.focus);
  document.body.classList.add('th-' + (THEMES[S.theme] ? S.theme : 'theme0'));
  const hx = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(t.bg || ''); // тёмный фон — подписи вне карточек делаем светлыми
  if (hx && parseInt(hx[1], 16) * .3 + parseInt(hx[2], 16) * .59 + parseInt(hx[3], 16) * .11 < 110) document.body.classList.add('dark');
}

/* ---------- 🏡 Домик питомца: сытость, настроение, чистота, желание дня ----------
   Питомец никогда не болеет и не «умирает»: показатели медленно снижаются, но не ниже 15%, и он просто скучает.
   Вкусняшки 🍪 — только за учёбу (каждые 4 верных ответа), играть с ним — тоже через вопросы. */
const PET_ACC = [[3, '🎀', 'Бантик'], [7, '🎩', 'Шляпа'], [14, '👑', 'Корона'], [30, '🌈', 'Радуга']];
// желания питомца — всегда про учёбу. s — предмет (желание выпадает, только если предмет включён у ребёнка)
const PET_SUBJ_TXT = { eng: 'по английскому', math: 'по математике', ru: 'по русскому языку', ow: 'по окружающему миру', lit: 'по чтению', pdd: 'по ПДД', logic: 'по логике', att: 'на внимание' };
const PET_WISHES = [
  { k: 'ok', n: 15, t: 'Ответь верно на 15 вопросов в любых предметах — я буду за тебя болеть!' },
  { k: 'ok', n: 25, t: 'Давай сегодня 25 верных ответов? Это будет праздник!' },
  { k: 'lesson', n: 1, t: 'Пройди со мной один урок — новый или повтори старый!' },
  { k: 'lesson', n: 2, t: 'Пройди два урока — я так люблю, когда ты учишься!' },
  { k: 'subjs', n: 2, t: 'Позанимайся двумя разными предметами (в каждом — 3 верных ответа)!' },
  { k: 'subjs', n: 3, t: 'Хочу три разных предмета сегодня (в каждом — 3 верных ответа)!' },
  ...Object.keys(PET_SUBJ_TXT).map(s => ({ k: 'okS', s, n: s === 'math' || s === 'eng' ? 10 : 8, t: `Ответь верно на ${s === 'math' || s === 'eng' ? 10 : 8} вопросов ${PET_SUBJ_TXT[s]}!` }))
];
const petSubj = () => (skind() === 'it' ? '' : skind()); // итальянский не считается — это язык для родителя
const petWishOk = w => !w.s || (subjOn(w.s) && S.subj !== undefined && SUBJ_META[w.s]);
function petPickWish(c, avoid) {
  const pool = PET_WISHES.map((w, k) => k).filter(k => petWishOk(PET_WISHES[k]) && k !== avoid);
  c.wish = pool[Math.floor(Math.random() * pool.length)]; c.wp = 0; c.wDone = false; c.dOk = c.dOk || {};
}
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
function petC() {
  if (!S.petCare) S.petCare = { full: 80, joy: 80, clean: 80, t: Date.now(), treats: 2, okN: 0, day: '', wish: -1, wp: 0, wDone: false, streak: 0, lastWish: '', acc: '', pats: 0 };
  const c = S.petCare, now = Date.now(), h = Math.min(96, Math.max(0, (now - (c.t || now)) / 3600000));
  if (h > 0.02) { // медленно скучает: за сутки сытость −48, настроение −36, чистота −24, но не ниже 15
    c.full = Math.max(15, c.full - h * 2); c.joy = Math.max(15, c.joy - h * 1.5); c.clean = Math.max(15, c.clean - h); c.t = now;
  }
  const day = todayKey();
  if (c.day !== day || c.ver !== 2) { // новый день (или старые желания про еду/игру): новое желание про учёбу
    if (c.day !== day) { c.pats = 0; c.bonus = 0; c.dOk = {}; c.dLess = 0; c.base = 0; c.baseS = {}; c.baseL = 0; }
    c.day = day; c.ver = 2; petPickWish(c);
  }
  return c;
}
function petEarn() {
  const sj = petSubj(); if (!sj) return;
  const c = petC(); c.okN = (c.okN || 0) + 1;
  if (c.okN % 4 === 0) c.treats = Math.min(30, (c.treats || 0) + 1);
  c.dOk = c.dOk || {}; c.dOk[sj] = (c.dOk[sj] || 0) + 1;
  petWishStep('ok', sj);
}
// прогресс желания считается заново из дневных счётчиков — так он верен, даже если желание сменилось посреди дня
function petWishStep(k, sj) {
  const c = petC(), w = PET_WISHES[c.wish]; if (!w || c.wDone) return;
  if (k === 'lesson') { if (!petSubj()) return; c.dLess = (c.dLess || 0) + 1; }
  const d = c.dOk || {}, sum = Object.values(d).reduce((a, b) => a + b, 0);
  const val = w.k === 'ok' ? sum - (c.base || 0) : w.k === 'okS' ? (d[w.s] || 0) - ((c.baseS || {})[w.s] || 0) : w.k === 'lesson' ? (c.dLess || 0) - (c.baseL || 0) : w.k === 'subjs' ? Object.values(d).filter(v => v >= 3).length : c.wp;
  c.wp = Math.max(0, val);
  if (c.wp >= w.n) {
    c.wDone = true; const bonus = (c.bonus || 0) > 0;
    if (!bonus) { const y = new Date(Date.now() - 864e5), yk = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate(); c.streak = c.lastWish === yk ? (c.streak || 0) + 1 : (c.lastWish === c.day ? c.streak : 1); c.lastWish = c.day; }
    const em = bonus ? 5 : 10, tr = bonus ? 2 : 3;
    c.joy = 100; c.treats = Math.min(30, (c.treats || 0) + tr); S.emeralds += em; save();
    setTimeout(() => toast(`${petE(petStage())} Желание исполнено! +${em} 💎 +${tr} 🍪`), 600);
  }
}
// после исполненного желания можно взять ещё одно (до 2 в день, награда поменьше)
function petBonusWish() {
  const c = petC(); if (!c.wDone || (c.bonus || 0) >= 2) return false;
  c.bonus = (c.bonus || 0) + 1; const d = c.dOk || {};
  c.base = Object.values(d).reduce((a, b) => a + b, 0); c.baseS = { ...d }; c.baseL = c.dLess || 0;
  const subjsDone = Object.values(d).filter(v => v >= 3).length;
  for (let tr = 0; tr < 20; tr++) { petPickWish(c, c.wish); const w = PET_WISHES[c.wish]; if (w.k !== 'subjs' || w.n > subjsDone) break; }
  save(); return true;
}
const petMoodOf = c => { const m = Math.min(c.full, c.joy, c.clean); return m >= 70 ? 2 : m >= 40 ? 1 : 0; };
function petSay(c) {
  const nm = S.petName || 'Кубик', w = PET_WISHES[c.wish];
  if (c.full < 40) return c.treats ? `${nm} проголодался! Покорми его 🍪` : `${nm} проголодался… Ответь верно на 4 вопроса — получишь 🍪`;
  if (c.clean < 40) return `${nm} испачкался — помой его 🛁`;
  if (c.joy < 40) return `${nm} скучает. Поиграй с ним 🎾`;
  if (w && !c.wDone) return `⭐ Желание дня: ${w.t}`;
  if (c.wDone && (c.bonus || 0) < 2) return `Желание исполнено! Хочешь ещё одно? Загляни в домик ⭐`;
  return [`${nm} счастлив и гордится тобой! Завтра будет новое желание`, `${nm} ждёт тебя завтра — будем учиться вместе 💕`, `${nm} говорит: ты молодец, что учишься!`][new Date().getMinutes() % 3];
}
function petHome(back) {
  if (tmGate()) return; tmInLesson = false;
  epoch++; newScreen();
  const c = petC(), nm = esc(S.petName || 'Кубик'), st = petStage(); petGifts();
  const ownAcc = PET_ACC.filter(a => (c.best = Math.max(c.best || 0, c.streak || 0)) >= a[0]);
  const draw = msg => {
    petWishStep('');
    const w = PET_WISHES[c.wish], mood = petMoodOf(c);
    const bar = (e, n, v, cls) => `<div class="pbar"><span>${e} ${n}</span><div class="bar ${cls}"><i style="width:${Math.round(v)}%"></i></div></div>`;
    const next = PET_ACC.find(a => (c.best || 0) < a[0]);
    app.innerHTML = `<div class="card toprow"><button class="btn sec" id="bk">⬅ Назад</button><h2>🏡 Домик: ${nm}</h2><span class="chip">🍪 ${c.treats || 0}</span></div>
      <div class="card center proom ${mood === 0 ? 'sad' : ''}">
        <div class="pbub" id="pbub">${esc(msg || petSay(c))}</div>
        <div class="pstage" id="pst"><span class="pacc">${c.acc || ''}</span><span class="pme m${mood}" id="pme">${petE(st)}</span>${c.clean < 40 ? '<span class="pdirt">💩</span>' : ''}</div>
        <div class="prug"></div>${(c.gifts || []).length ? `<div class="pdeco">${c.gifts.map(e => `<span>${e}</span>`).join('')}</div>` : ''}
        <div class="pbars">${bar('🍎', 'Сытость', c.full, 'pf')}${bar('🎾', 'Настроение', c.joy, 'pj')}${bar('🛁', 'Чистота', c.clean, 'pc')}</div>
        <div class="pacts"><button class="btn gold" id="pfd">🍎 Покормить <small>(🍪 ${c.treats || 0})</small></button><button class="btn" id="ppl">🎾 Поиграть</button><button class="btn sec" id="pwh">🛁 Помыть</button></div>
        <p class="phint">Погладь питомца — просто нажми на него 🤚</p>
      </div>
      <div class="card"><h3>⭐ Желание дня</h3>${w ? `<p>${esc(w.t)}</p><div class="bar goal"><i style="width:${Math.min(100, Math.round(c.wp / w.n * 100))}%"></i></div><p><small>${c.wDone ? ((c.bonus || 0) < 2 ? '✅ Исполнено!' : '✅ Исполнено! Завтра будет новое желание') : `${Math.min(c.wp, w.n)} из ${w.n} · награда: ${(c.bonus || 0) ? '+5 💎 +2 🍪' : '+10 💎 +3 🍪'}`}</small></p>${c.wDone && (c.bonus || 0) < 2 ? '<p><button class="btn gold" id="pbw">⭐ Ещё желание (+5 💎 +2 🍪)</button></p>' : ''}` : ''}
        ${(() => { const sk = shownStreak(), nx = PET_GIFTS.find(gf => !(c.gifts || []).includes(gf[1])); return `<p>📚 Учишься дней подряд: <b>${sk}</b> ${nx ? `<small>· ${nx[0] > sk ? `ещё ${nx[0] - sk} дн. до подарка` : 'подарок уже ждёт'}: ${nx[1]} ${nx[2]} +${nx[3]} 🍪</small>` : '<small>· все подарки собраны! 🏆</small>'}</p>`; })()}
        <p>🔥 Желания подряд: <b>${c.streak || 0}</b> ${next ? `<small>· через ${next[0] - (c.best || 0)} дн. — подарок питомцу: ${next[1]} ${next[2]}</small>` : ''}</p>
        ${ownAcc.length ? `<p>Наряд: ${['', ...ownAcc.map(a => a[1])].map(e => `<button class="btn small ${c.acc === e ? 'gold' : 'sec'}" data-acc="${e}">${e || 'без наряда'}</button>`).join('')}</p>` : ''}
        <p><small>🍪 Вкусняшки дают за учёбу: каждые 4 верных ответа в любом предмете. Желания питомца — тоже про учёбу.</small></p></div>`;
    $('bk').onclick = back || home;
    app.querySelectorAll('[data-acc]').forEach(b => b.onclick = () => { c.acc = b.dataset.acc; save(); draw(); });
    if ($('pbw')) $('pbw').onclick = () => { if (petBonusWish()) { sfx('ok'); draw('Ура! Новое желание — я в тебя верю!'); } };
    const pet = $('pme');
    const fly = (txt, n) => { const r = pet.getBoundingClientRect(); for (let k = 0; k < n; k++) fxPiece(txt, { fontSize: '26px' }, [{ transform: `translate(${r.left + r.width / 2 + (Math.random() - .5) * 60}px,${r.top + 20}px)`, opacity: 1 }, { transform: `translate(${r.left + r.width / 2 + (Math.random() - .5) * 140}px,${r.top - 90}px)`, opacity: 0 }], 900, k * 90); };
    const bounce = () => { pet.classList.remove('hop'); void pet.offsetWidth; pet.classList.add('hop'); };
    pet.onclick = () => {
      if ((c.pats || 0) >= 8) { $('pbub').textContent = `${nm} уже совсем довольный 😊`; bounce(); return; }
      c.pats = (c.pats || 0) + 1; c.joy = Math.min(100, c.joy + 3); save(); bounce(); fly('💕', 4); sfx('ok');
      $('pbub').textContent = ['Мрр! Приятно!', 'Ещё-ещё!', 'Ты мой лучший друг!', 'Хи-хи, щекотно!'][c.pats % 4];
      app.querySelector('.pj i').style.width = Math.round(c.joy) + '%';
    };
    $('pfd').onclick = () => {
      if (!(c.treats > 0)) { $('pbub').textContent = 'Вкусняшек нет. Ответь верно на 4 вопроса в любом уроке — и я получу 🍪'; return; }
      if (c.full >= 98) { $('pbub').textContent = 'Я уже сыт, спасибо! 😋'; return; }
      c.treats--; c.full = Math.min(100, c.full + 30); c.joy = Math.min(100, c.joy + 5); save();
      const food = ['🍪', '🍎', '🍓', '🥕', '🍰', '🍌'][Math.floor(Math.random() * 6)];
      const b = $('pfd').getBoundingClientRect(), r = pet.getBoundingClientRect();
      fxPiece(food, { fontSize: '40px' }, [{ transform: `translate(${b.left + b.width / 2}px,${b.top}px)` }, { transform: `translate(${r.left + r.width / 2 - 20}px,${r.top + r.height / 2 - 20}px) scale(.4)`, opacity: .2 }], 600);
      setTimeout(() => { sfx('ok'); draw('Ням-ням! Вкуснотища! 😋'); $('pme').classList.add('hop'); }, 620);
    };
    $('pwh').onclick = () => {
      if (c.clean >= 98) { $('pbub').textContent = 'Я и так чистенький! ✨'; return; }
      $('pbub').textContent = 'Потри меня пальцем, как губкой 🧽';
      let rub = 0, last = 0; pet.classList.add('rub');
      const st2 = $('pst');
      st2.onpointermove = e => {
        if (e.pointerType === 'mouse' && !e.buttons) return; const now = Date.now(); if (now - last < 60) return; last = now; rub++;
        fxPiece('🫧', { fontSize: (16 + Math.random() * 16) + 'px' }, [{ transform: `translate(${e.clientX - 10}px,${e.clientY - 10}px)`, opacity: 1 }, { transform: `translate(${e.clientX - 10 + (Math.random() - .5) * 60}px,${e.clientY - 70}px)`, opacity: 0 }], 800);
        c.clean = Math.min(100, c.clean + 2.5); app.querySelector('.pc i').style.width = Math.round(c.clean) + '%';
        if (c.clean >= 100) { st2.onpointermove = null; save(); sfx('ok'); draw('Ура, я чистый! Сверкаю! ✨'); fly('✨', 6); }
      };
      st2.onpointerup = () => save();
    };
    $('ppl').onclick = () => petPlay(c, () => petHome(back));
  };
  draw();
}
// игра с питомцем = 3 быстрых вопроса (слова пройденного языка или устный счёт)
function petPlay(c, back) {
  epoch++; newScreen();
  const lang = !isGen() && !isIt() && Object.keys(WORDS).length;
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const mk = () => {
    if (lang) {
      const pool = practiceWords().filter(id => WORDS[id] && WORDS[id].e), id = pool[R(0, pool.length - 1)];
      const others = shuffle(pool.filter(x => x !== id && WORDS[x].e !== WORDS[id].e)).slice(0, 2);
      return { q: `<div class="bigemoji">${WORDS[id].e}</div><p>Как это ${LN().adv}?</p>`, opts: shuffle([id, ...others]).map(x => [x, WORDS[x].en]), ans: id, say: WORDS[id].en };
    }
    const op = R(0, 2), a = op === 2 ? R(2, 9) : R(5, 50), b = op === 2 ? R(2, 9) : R(2, op ? a - 1 : 40), r = op === 0 ? a + b : op === 1 ? a - b : a * b;
    const opts = shuffle([...new Set([r, r + R(1, 3), Math.max(0, r - R(1, 3)), r + 10])].slice(0, 3));
    if (!opts.includes(r)) opts[0] = r;
    return { q: `<div class="mq">${a} ${['+', '−', '×'][op]} ${b} = ?</div>`, opts: shuffle(opts).map(x => [String(x), x]), ans: String(r) };
  };
  let i = 0, ok = 0;
  const ask = () => {
    if (i >= 3) {
      c.joy = Math.min(100, c.joy + 10 + ok * 8); save(); sfx(ok >= 2 ? 'win' : 'ok');
      app.innerHTML = `<div class="card center"><div class="pme m2 hop" style="font-size:96px">${petE(petStage())}</div><h2>${ok === 3 ? 'Ура! Ты угадал всё!' : 'Было весело!'}</h2><p>${esc(S.petName || 'Кубик')} радуется: верно ${ok} из 3</p><p><button class="btn gold" id="pb">🏡 В домик</button><button class="btn sec" id="pa">🎾 Ещё раз</button></p></div>`;
      $('pb').onclick = back; $('pa').onclick = () => petPlay(c, back); return;
    }
    const q = mk(); let tries = 0;
    app.innerHTML = `<div class="card center"><div class="prog">${[0, 1, 2].map(k => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div><h3>🎾 ${esc(S.petName || 'Кубик')} спрашивает</h3>${q.q}
      <div class="opts mopts">${q.opts.map(([v, txt]) => `<button class="opt" data-v="${esc(v)}"><span class="ot">${esc(String(txt))}</span></button>`).join('')}</div><div id="msg" class="msg">&nbsp;</div>
      <p><button class="btn small sec" id="pb">🏡 В домик</button></p></div>`;
    $('pb').onclick = back;
    const my = screenId;
    app.querySelectorAll('.opt').forEach(bt => bt.onclick = () => {
      if (bt.dataset.v === q.ans) { bt.classList.add('good'); if (!tries) ok++; logQ(!tries); sfx('ok'); if (q.say) speak(q.say); i++; setTimeout(() => { if (screenId === my) ask(); }, 900); app.querySelectorAll('.opt').forEach(x => x.onclick = null); }
      else { tries++; bt.classList.add('bad'); bt.disabled = true; sfx('bad'); $('msg').textContent = 'Почти! Ещё разок 💪'; }
    });
  };
  ask();
}

/* ---------- подарки питомцу за серию дней учёбы (остаются навсегда, даже если серия прервётся) ---------- */
const PET_GIFTS = [[2, '🧸', 'Мишка-игрушка', 3], [3, '🛏️', 'Лежанка', 3], [5, '🪴', 'Цветок в горшке', 4], [7, '🖼️', 'Картина на стену', 5], [10, '🎈', 'Воздушные шарики', 5],
  [14, '🛝', 'Горка', 6], [21, '🏰', 'Игрушечный замок', 7], [30, '🌟', 'Звёздный ночник', 8], [50, '🚀', 'Ракета', 10], [100, '🏆', 'Золотой кубок', 15]];
function petGifts() { // выдаёт новые подарки за серию; возвращает список полученных
  const c = petC(), st = shownStreak(); c.gifts = c.gifts || [];
  const fresh = PET_GIFTS.filter(gf => st >= gf[0] && !c.gifts.includes(gf[1]));
  if (fresh.length) {
    fresh.forEach(gf => { c.gifts.push(gf[1]); c.treats = Math.min(30, (c.treats || 0) + gf[3]); });
    c.joy = 100; save();
    const gf = fresh[fresh.length - 1];
    setTimeout(() => toast(`🎁 ${st} ${st % 10 === 1 && st % 100 !== 11 ? 'день' : [2, 3, 4].includes(st % 10) && ![12, 13, 14].includes(st % 100) ? 'дня' : 'дней'} учёбы подряд! Питомцу подарок: ${gf[1]} ${gf[2]} и +${fresh.reduce((a, x) => a + x[3], 0)} 🍪`), 900);
  }
  return c.gifts;
}

/* ---------- питомец-спутник: сидит в уголке во время занятий, подбадривает (но никогда не подсказывает ответ) ---------- */
const BUD = { el: null, on: false, last: 0, idleT: 0, hideT: 0, at: 0 };
const BUD_OK = ['Так держать!', 'Я горжусь тобой!', 'Ура! 🎉', 'Умница!', 'Здорово получается!', 'Ты сегодня в ударе!', 'Вот это да! 🤩', 'Мне нравится учиться с тобой!'];
const BUD_BAD = ['Ничего, ошибки помогают учиться 💪', 'Не спеши, прочитай ещё раз 👀', 'Я верю в тебя!', 'Подумай спокойно — у тебя получится', 'Ошибаться — это нормально, так мозг растёт 🧠', 'Вдохни-выдохни и попробуй ещё 🌬️'];
const BUD_IDLE = ['Я тут, рядом 🙂 Прочитай задание ещё раз', 'Не торопись — я подожду', 'Если трудно — послушай ещё раз 🔊', 'Ты справишься, я знаю!'];
const pick = a => a[Math.floor(Math.random() * a.length)];
function budEl() {
  if (BUD.el) return BUD.el;
  const d = document.createElement('div'); d.id = 'buddy';
  d.innerHTML = '<div class="bbub" id="bbub"></div><button class="bpet" id="bpet" aria-label="Питомец"></button>';
  document.body.appendChild(d); BUD.el = d;
  d.querySelector('#bpet').onclick = () => budSay(pick(['Мне нравится учиться с тобой! 💕', 'Хи-хи, щекотно!', 'Давай дальше вместе!', 'Я с тобой!']), true);
  return d;
}
// питомец сидит в верхней строке урока (так он никогда не закрывает кнопки); вне урока — ненадолго в левом нижнем углу
function budPlace(inline) {
  const el = budEl(), tl = inline && document.querySelector('.topline');
  el.classList.toggle('inl', !!tl);
  if (tl) tl.appendChild(el); else if (el.parentNode !== document.body) document.body.appendChild(el);
}
function budShow() {
  if (S.petBuddy === false || !S.name) return budHide();
  budPlace(true);
  const el = budEl(), c = petC();
  el.querySelector('#bpet').innerHTML = (c.acc ? `<span class="bacc">${c.acc}</span>` : '') + petE(petStage());
  el.classList.add('on'); BUD.on = true; BUD.at = Date.now(); budIdle();
}
function budHide() { if (BUD.el && Date.now() > (BUD.keep || 0)) BUD.el.classList.remove('on'); BUD.on = false; clearTimeout(BUD.idleT); }
function budSay(txt, force) {
  if (S.petBuddy === false || !S.name) return;
  const now = Date.now();
  if (!force && (!BUD.on || now - BUD.last < (S.focus ? 14000 : 7000))) return;
  BUD.last = now;
  const el = budEl(), b = el.querySelector('#bbub'), p = el.querySelector('#bpet');
  if (!BUD.on) { budPlace(false); el.classList.add('on'); BUD.keep = now + 4500; setTimeout(() => { if (!BUD.on && Date.now() >= BUD.keep) el.classList.remove('on'); }, 4600); }
  b.textContent = txt; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  clearTimeout(BUD.hideT); BUD.hideT = setTimeout(() => b.classList.remove('show'), 4000);
  if (!S.focus) { p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); }
}
function budIdle() { clearTimeout(BUD.idleT); BUD.idleT = setTimeout(() => { if (BUD.on) { budSay(pick(BUD_IDLE)); budIdle(); } }, 35000); }
document.addEventListener('pointerdown', () => { if (BUD.on) budIdle(); }, true);
function budReact(k) {
  if (k === 'ok') { if (Math.random() < .22) budSay(pick(BUD_OK)); }
  else if (k === 'bad') { if (Math.random() < .5) budSay(pick(BUD_BAD)); }
  else if (k === 'win' && Date.now() - BUD.at < 20000) budSay(pick(['Мы справились! Я так рад! 🎉', 'Ура! Ещё один шаг к знаниям!', 'Ты лучший ученик на свете! 🏆']), true);
}
function budStep(ctx) { // начало, середина и последний шаг урока
  if (!ctx || !ctx.steps) return;
  const n = ctx.steps.length, k = ctx.cur; ctx._bud = ctx._bud || {};
  const once = (key, txt) => { if (!ctx._bud[key]) { ctx._bud[key] = 1; setTimeout(() => budSay(txt, true), 400); } };
  if (k === 0) once('s', pick(['Я рядом! Начинаем 💪', 'Учимся вместе! Я буду болеть за тебя', 'Поехали! Я с тобой 🙂']));
  else if (n >= 4 && k === Math.floor(n / 2)) once('m', 'Половина пути позади! 🚀');
  else if (n >= 3 && k === n - 1) once('l', 'Последний шаг! Почти всё! 🏁');
}

/* ---------- каркас экранов ---------- */
function frame(ctx, inner) {
  newScreen(); // новый экран: то, что говорилось на предыдущем, больше не звучит
  const dots = ctx.steps.map((s, k) => `<i class="${k < ctx.cur ? 'd' : k === ctx.cur ? 'c' : ''}"></i>`).join('');
  app.innerHTML = `<div class="topline"><button class="btn small sec" id="exit">⬅ Карта</button><div class="dots">${dots}</div>${combo >= 3 && !S.focus ? `<span class="chip cmb">🔥 ×${combo}</span>` : ''}<div class="stepname">${ctx.steps[ctx.cur][0]}</div></div>${S.focus ? `<div class="calmbar" title="Шаг ${ctx.cur + 1} из ${ctx.steps.length}"><i style="width:${Math.round(ctx.cur / ctx.steps.length * 100)}%"></i></div>` : ''}${inner}`;
  $('exit').onclick = () => { stopAll(); map(); };
  window.scrollTo(0, 0);
  budShow(); budStep(ctx);
}
const CALM_BREAKS = [['🙆', 'Встань и потянись вверх, как большое дерево. Задержись на 5 вдохов.'], ['🦘', 'Сделай 10 прыжков на месте.'], ['🌬️', 'Вдохни носом на 4 счёта, выдохни ртом на 6. Повтори 3 раза.'], ['👀', 'Найди глазами 5 предметов синего цвета в комнате.'],
  ['🐶', 'Потряси руками и ногами, как мокрая собачка, 10 секунд.'], ['💧', 'Сделай несколько глотков воды.'], ['🧍', 'Встань спиной к стене и посчитай вслух до 10.'], ['👏', 'Похлопай в ладоши в ритме: 3 быстрых и 1 медленный. Повтори 5 раз.']];
let calmBrk = 0;
// короткая пауза на движение между блоками (режим «Спокойный фокус»)
function calmBreak(ctx, cb) {
  const [e, txt] = CALM_BREAKS[calmBrk++ % CALM_BREAKS.length], left = ctx.steps.length - ctx.cur;
  frame(ctx, `<div class="card center"><div class="bigem">${e}</div><h3>Минутка отдыха</h3><p class="dtxt">${txt}</p><p><small>Блок готов! Осталось шагов: ${left}.</small></p>
    <p id="cbt" class="pmsg">Отдых: 20 с</p><p><button class="btn gold big" id="cbg">Готов продолжить ➜</button></p></div>`);
  const my = screenId; let n = 20;
  const iv = setInterval(() => { if (screenId !== my) return clearInterval(iv); n--; const el = $('cbt'); if (!el) return clearInterval(iv); el.textContent = n > 0 ? 'Отдых: ' + n + ' с' : 'Можно продолжать 🙂'; if (n <= 0) clearInterval(iv); }, 1000);
  $('cbg').onclick = () => { clearInterval(iv); cb(); };
}
function runSteps(ctx, final) {
  ctx.cur = 0; combo = 0; maxCombo = 0; lvlNote = ''; ctx.lastBreak = Date.now();
  const go = () => {
    if (ctx.cur >= ctx.steps.length) return final();
    ctx.steps[ctx.cur][1](() => {
      ctx.cur++;
      if (S.focus && ctx.cur < ctx.steps.length && !/^(Правило|Новые слова|Читаем|Замок)/.test(ctx.steps[ctx.cur - 1][0]) && Date.now() - ctx.lastBreak > 90000) { ctx.lastBreak = Date.now(); calmBreak(ctx, go); } else go();
    });
  };
  go();
}

/* если на устройстве нет английского голоса, слова читаются русским голосом и ничего не понятно — предупреждаем родителей */
let voiceDismissed = false; // «Понятно» нажато — до перезапуска больше не напоминаем
const hasEnVoice = () => { try { return speechSynthesis.getVoices().some(v => LNOW.re.test(v.lang)); } catch (e) { return false; } };
const voiceCount = () => { try { return speechSynthesis.getVoices().length; } catch (e) { return 0; } };
function voiceCheck() {
  const box = $('vw');
  if (isGen() || voiceDismissed || !box || !speechOn()) return;
  if (!voiceCount() || hasEnVoice()) return; // голоса ещё не загрузились или нужный язык есть
  const lg = LN();
  box.innerHTML = `<div class="card" style="background:#ffe3e0"><b>🔇 На этом устройстве нет голоса для языка: ${lg.adj}.</b> Слова читаются русским голосом, поэтому звучат непонятно, «обрываются» или «пропадают».
    <ul><li><b>Проще всего:</b> откройте игру в <b>Google Chrome</b> при подключённом интернете, там появляется голос «${lg.chrome}».</li>
    <li><b>Windows:</b> Параметры → Время и язык → Язык и регион → Добавить язык → ${lg.win} → после установки включите «Преобразование текста в речь», затем перезапустите браузер.</li>
    <li><b>Android:</b> Настройки → Язык и ввод → Синтез речи → Google → Установить голосовые данные → ${lg.short}.</li>
    <li><b>iPad:</b> Настройки → Универсальный доступ → Устный контент → Голоса → ${lg.short}.</li></ul>
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
  if (tmGate()) return; tmInLesson = false;
  homeView = true;
  const cards = PR.list.map(p => {
    const st = loadState(p.key), done = Object.values(st.lessons || {}).filter(x => x.done).length;
    return `<div class="item"><div class="ie">${hero(56, st.hue, st)}</div><b>${esc(p.name)}</b><br><small>💎 ${st.emeralds || 0} · пройдено локаций: ${done}</small><br>
      <button class="btn small ${p.id === PR.cur ? 'gold' : ''}" data-pl="${p.id}">Играть</button><br>
      <button class="btn small sec" data-ren="${p.id}" title="Переименовать">✏️</button><button class="btn small sec" data-del="${p.id}" title="Удалить">🗑</button></div>`;
  }).join('');
  app.innerHTML = `<div class="card top">${S.name ? '<button class="btn small sec" id="bk">⬅ Карта</button>' : ''}<div class="grow center"><h2>👤 Кто занимается?</h2></div></div>
    <div class="card"><div class="shop">${cards}<div class="item"><div class="ie">➕</div><b>Новый игрок</b><br><button class="btn small gold" id="np">Добавить</button></div></div>
      <p><button class="btn small sec" id="cl">☁️ Семейный код (вход с другого устройства)</button>${cloudOn() ? ' <button class="btn small sec" id="rsg">😴 Пауза для отдыха (родителям)</button>' : ''}</p>
      <p><small>У каждого игрока свой прогресс, награды, питомец и недельный отчёт. ${cloudOn() ? 'Прогресс синхронизируется с облаком.' : 'Данные хранятся на этом устройстве.'}</small></p></div>`;
  if ($('bk')) $('bk').onclick = map;
  const dupes = PR.list.filter(p => { const st = p.id === PR.cur ? S : loadState(p.key); return emptySt(st) && PR.list.some(q => q !== p && String(q.name).trim().toLowerCase() === String(p.name).trim().toLowerCase() && !emptySt(q.id === PR.cur ? S : loadState(q.key))); });
  if (dupes.length) {
    const b = document.createElement('p'); b.innerHTML = `<button class="btn small red" id="dd">🧹 Убрать пустые дубли (${dupes.length})</button> <small>удаляются только игроки с тем же именем, у которых ничего не пройдено и 0 изумрудов</small>`;
    $('cl').parentNode.before(b);
    $('dd').onclick = () => {
      if (!confirm('Будут удалены пустые копии (ничего не пройдено, 0 изумрудов): ' + dupes.map(d => d.name).join(', ') + '. Игроки с прогрессом останутся. Продолжить?')) return;
      dupes.forEach(d => {
        try { localStorage.removeItem(d.key); } catch (e) {}
        cloudDeactivate(d.cid);
        PR.list = PR.list.filter(x => x !== d);
        if (PR.cur === d.id) { const keep = PR.list.find(x => String(x.name).trim().toLowerCase() === String(d.name).trim().toLowerCase()) || PR.list[0]; PR.cur = keep.id; KEYNOW = keep.key; S = loadState(KEYNOW); }
      });
      saveCL(); savePR(); applyTheme(); players();
    };
  }
  { const my = screenId; cloudAuto().then(ch => { if (ch && screenId === my) players(); }); }
  $('cl').onclick = () => cloudScreen(players);
  if ($('rsg')) $('rsg').onclick = () => parentGate('time');
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
    cloudDeactivate(p.cid);
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
const codeOk = c => /^[A-Z0-9]{6,12}$/.test(c);
if (CL.code && !codeOk(CL.code)) { CL.code = ''; CL.err = ''; saveCL(); } // испорченный код — сбрасываем, чтобы можно было ввести правильный
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
  ['hrs', 'wds'].forEach(k => { m[k] = keyed(a[k], b[k], (p, q) => (p.q || 0) >= (q.q || 0) ? p : q); });
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
    if (!p.cid) { // сначала сверяемся с облаком: возможно, такой игрок там уже есть (тогда сольём, а не создадим двойника)
      await cloudAuto();
      if (!p.cid) { if (!autoOk) throw new Error('нет связи'); p.cid = newCid(); savePR(); }
    }
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
// удалённого на устройстве игрока помечаем в таблице как неактивного (столбец activate = false); если нет связи — повторим позже
function cloudDeactivate(cid) {
  if (!cid) return;
  CL.skip = (CL.skip || []).concat(cid); CL.del = (CL.del || []).concat(cid); saveCL();
  if (cloudOn()) flushDel();
}
let delBusy = false;
async function flushDel() {
  if (!cloudOn() || delBusy || !(CL.del || []).length) return;
  delBusy = true;
  try { for (const cid of CL.del.slice()) { await api('setactive', { id: cid, active: false }); CL.del = CL.del.filter(x => x !== cid); saveCL(); } } catch (e) {}
  delBusy = false;
}
async function cloudPin() {
  if (!cloudOn() || !getPin()) return;
  try { await api('setpin', { pin: getPin() }); } catch (e) {}
}

// автоматически: игроки из облака появляются на этом устройстве, а игроки только с этого устройства уходят в облако.
// Если локальный игрок без привязки к облаку совпадает по имени с игроком в облаке — прогресс сливается (ничего не теряется), перед этим делается копия
// «пустой» игрок: ничего не пройдено, нет изумрудов и опыта (обычно двойник, созданный по ошибке)
const emptySt = st => !Object.values(st.lessons || {}).some(x => x && x.done) && !(st.emeralds > 0) && !(st.xp > 0) && !Object.keys(st.words || {}).length;
// смена семейного кода: копируем все записи семьи (игроки, сводки, дневник) под новый код,
// в старой семье оставляем запись «__moved» — остальные устройства сами перейдут на новый код
async function cloudRename(newCode) {
  const old = CL.code;
  if (!codeOk(newCode)) throw new Error('код — от 6 до 12 латинских букв или цифр');
  if (newCode === old) throw new Error('это и есть текущий код');
  syncBusy = true;
  try {
    const all = (await api('join', {})).players.filter(x => x.id !== '__moved');
    CL.code = newCode;
    const r = await api('init', {});
    if (!r.created && r.players.some(x => !String(x.id).startsWith('__') && !all.some(a => a.id === x.id))) throw new Error('код ' + newCode + ' уже занят другой семьёй — выберите другой');
    for (const c of all) {
      CL.code = old; const d = await api('pull', { id: c.id });
      if (!d.state) continue;
      CL.code = newCode; await api('push', { id: c.id, name: d.name || c.name, ts: d.ts || c.ts || 0, state: d.state });
    }
    CL.code = old; await api('push', { id: '__moved', name: '__moved', ts: Date.now(), state: JSON.stringify({ to: newCode }) });
    CL.code = newCode; CL.err = ''; saveCL(); await cloudPin();
  } catch (e) { CL.code = old; saveCL(); throw e; } finally { syncBusy = false; }
}
// скачать одного игрока из облака на это устройство (если его ещё нет)
async function cloudImportOne(c) {
  let p = PR.list.find(x => x.cid === c.id); if (p) return p;
  const r = await api('pull', { id: c.id });
  if (!r.state) throw new Error('в облаке нет данных игрока «' + (c.name || '?') + '»');
  JSON.parse(r.state); // проверка, что данные целые
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  p = { id, name: r.name || c.name || 'Игрок', key: KEY + '_' + id, cid: c.id };
  localStorage.setItem(p.key, r.state); // если не поместится — ошибка будет видна на экране
  PR.list.push(p); savePR(); return p;
}
let autoP = null, autoOk = false;
function cloudAuto() {
  if (!cloudOn()) return Promise.resolve(false);
  if (!autoP) autoP = cloudAutoRun().then(r => { autoP = null; return r; });
  return autoP;
}
async function cloudAutoRun() {
  let changed = false; autoOk = false;
  flushDel();
  try {
    const jr = await api('join', {}); let raw = jr.players;
    if (jr.pin && !getPin()) { try { localStorage.setItem(PIN_KEY, jr.pin); } catch (e) {} }
    if (raw.some(x => x.id === '__moved')) { // семья сменила код на другом устройстве — переходим следом
      const mv = await api('pull', { id: '__moved' }); const to = mv.state ? JSON.parse(mv.state).to : '';
      if (to && codeOk(to) && to !== CL.code) { CL.code = to; saveCL(); toast('☁️ Семейный код изменён на ' + to); raw = (await api('join', {})).players; }
    }
    const list = raw.filter(x => !String(x.id).startsWith('__'));
    const nm = x => String(x || '').trim().toLowerCase(), skip = CL.skip || [];
    const errs = [];
    for (const c of list) try {
      if (PR.list.some(x => x.cid === c.id) || skip.includes(c.id)) continue;
      const r = await api('pull', { id: c.id }); if (!r.state) continue;
      if (PR.list.some(x => nm(x.name) === nm(c.name)) && emptySt(JSON.parse(r.state))) { CL.skip = (CL.skip || []).concat(c.id); saveCL(); continue; } // пустой двойник не создаём
      const loc = PR.list.find(x => (!x.cid || !raw.some(r2 => r2.id === x.cid)) && nm(x.name) === nm(c.name)); // свой игрок без привязки к этой семье — сливаем, а не делаем двойника
      if (loc) {
        const cur = loc.id === PR.cur, mine = cur ? S : loadState(loc.key);
        try { localStorage.setItem(loc.key + '_backup_' + today(), JSON.stringify(mine)); } catch (e) {}
        const merged = mergeState(mine, JSON.parse(r.state));
        if (cur) { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, merged); lastSnap[loc.key] = snapOf(S); }
        try { localStorage.setItem(loc.key, JSON.stringify(merged)); } catch (e) {}
        loc.cid = c.id; savePR(); cloudDirty();
      } else {
        const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        localStorage.setItem(KEY + '_' + id, r.state);
        PR.list.push({ id, name: r.name || c.name || 'Игрок', key: KEY + '_' + id, cid: c.id });
        savePR();
      }
      changed = true;
    } catch (e) { errs.push((c.name || '?') + ': ' + String(e.message || e)); }
    if (errs.length) { CL.err = 'не загрузились: ' + errs.join('; '); saveCL(); }
    // игроки этого устройства, которых нет в облаке этой семьи (новые или привязанные к прежнему семейному коду), — отправляем в облако
    for (const p of PR.list.filter(x => !x.cid || !raw.some(c => c.id === x.cid))) {
      const st = p.id === PR.cur ? S : loadState(p.key); if (!st.name) continue;
      if (!p.cid) { p.cid = newCid(); savePR(); }
      await api('push', { id: p.cid, name: st.name, ts: st._ts || Date.now(), state: JSON.stringify(st) });
    }
    autoOk = !errs.length;
  } catch (e) { CL.err = String(e.message || e); saveCL(); }
  return changed;
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && needPush) cloudSync(false); });
window.addEventListener('online', () => { if (needPush) cloudSync(false); });

function cloudScreen(back, autoCode) {
  epoch++; newScreen();
  let msg = '', cloudPlayers = null, gone = false; // gone — уже ушли на другой экран (к игрокам), больше не перерисовываем облако
  const draw = () => {
    if (gone) return;
    const urlBlock = cloudUrl() ? '' : '<p>1) Вставьте ссылку на облако (её выдаёт тот, кто настраивал, см. cloud/НАСТРОЙКА.md):</p><input type="text" id="cu" placeholder="https://script.google.com/macros/s/.../exec">';
    let body;
    if (!cloudOn()) {
      body = `${urlBlock}<p>${cloudUrl() ? '' : '2) '}Семейный код (6 знаков):</p><input type="text" id="cc" maxlength="12" placeholder="например ABC234" style="text-transform:uppercase" autocapitalize="characters" autocomplete="off">
        <p><button class="btn gold" id="cj">Войти по коду</button> <button class="btn small sec" id="cn">Создать новый семейный код</button></p>
        <p><small>Новый код создаёт родитель один раз на первом устройстве. Остальные устройства входят по этому же коду, потом выбирают игрока.</small></p>`;
    } else {
      const have = new Set(PR.list.map(x => x.cid).filter(Boolean));
      const remote = (cloudPlayers || []).map(c => `<p><b>${esc(c.name)}</b> ${have.has(c.id) ? '(уже на этом устройстве)' : ''} <button class="btn small gold" data-dl="${c.id}">${have.has(c.id) ? 'Играть' : 'Загрузить сюда'}</button></p>`).join('') || '<p>В облаке пока нет игроков.</p>';
      const up = PR.list.filter(x => !x.cid).map(x => `<p>${esc(x.name)} <button class="btn small" data-up="${x.id}">Отправить в облако</button></p>`).join('');
      const missing = (cloudPlayers || []).filter(c => !have.has(c.id));
      const dlAll = missing.length ? `<p><button class="btn gold" id="cdla">⬇️ Загрузить ${missing.length > 1 ? 'всех игроков (' + missing.length + ')' : 'игрока'} на это устройство</button></p>` : '';
      const none = cloudPlayers && !cloudPlayers.length ? `<p class="story"><b>Для кода ${esc(CL.code)} в облаке нет игроков.</b> Проверьте код на старом устройстве: «🔒 Родителям» → «☁️ Связь». Если код другой — нажмите «Выйти с этого устройства» и введите правильный.</p>` : '';
      body = `<p>Семейный код: <b style="font-size:1.6rem;letter-spacing:3px">${esc(CL.code)}</b></p><p><small>${esc(cloudStatus())}</small></p>
        ${none}${dlAll}<h3>Игроки в облаке</h3>${remote}${up ? '<h3>Только на этом устройстве</h3>' + up : ''}
        <h3>✏️ Свой семейный код</h3><p>Можно заменить код на свой, который легко запомнить: от 6 до 12 латинских букв или цифр. Все игроки и дневник перенесутся, другие устройства перейдут на новый код сами.</p>
        <p><input type="text" id="ncode" maxlength="12" placeholder="новый код" style="text-transform:uppercase;max-width:220px" autocapitalize="characters" autocomplete="off"> <button class="btn small" id="crn">Сменить код</button></p>
        <h3>📲 Подключить новое устройство</h3><p>Откройте эту ссылку на новом планшете или в другом браузере — вход по семейному коду произойдёт сам, игроки появятся.</p>
        <p><input type="text" id="clink" readonly value="${esc(location.href.split('#')[0].split('?')[0] + '#family=' + CL.code)}"> <button class="btn small gold" id="clk">📋 Скопировать</button></p>
        <p><small>Или на новом устройстве на первом экране нажмите «☁️ Войти по семейному коду» и введите код.</small></p>
        <p><button class="btn small" id="cs">🔄 Синхронизировать сейчас</button> <button class="btn small red" id="co">Выйти с этого устройства</button></p>`;
    }
    app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Назад</button><h2>☁️ Облако</h2>${body}<p class="pmsg">${esc(msg)}</p></div>`;
    $('bk').onclick = () => { gone = true; (PR.list.length && back === welcome ? players : back)(); }; // игроки уже есть — к ним, а не к вводу нового имени
    const run = async (fn) => { let pr; try { pr = fn(); } catch (e) { pr = Promise.reject(e); } msg = 'Подождите...'; draw(); const my = screenId; try { await pr; msg = ''; } catch (e) { msg = 'Не получилось: ' + String(e.message || e); } if (screenId === my) draw(); };
    const readUrl = () => { if ($('cu')) { const u = $('cu').value.trim(); if (u) { CL.url = u; saveCL(); } } if (!cloudUrl()) throw new Error('вставьте ссылку на облако'); };
    const login = async (code, create) => {
      readUrl();
      CL.code = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
      // вход по коду — только «join»: он ничего не создаёт в таблице (раньше «init» с ошибочным кодом заводил пустую семью)
      let r;
      if (create) r = await api('init', {});
      else try { r = await api('join', {}); } catch (e) { CL.code = ''; throw new Error(/нет/i.test(String(e.message)) ? 'такого семейного кода нет. Проверьте код на старом устройстве: «🔒 Родителям» → «☁️ Связь»' : String(e.message || e)); }
      if (create && !r.created) { CL.code = ''; throw new Error('код занят, попробуйте ещё раз'); }
      CL.err = ''; saveCL(); cloudPlayers = r.players.filter(x => !String(x.id).startsWith('__'));
      if (r.pin) { try { localStorage.setItem(PIN_KEY, r.pin); } catch (e) {} } else await cloudPin();
      await cloudAuto();
    };
    const importAll = async () => {
      const list = (cloudPlayers || []).filter(c => !PR.list.some(x => x.cid === c.id)), errs = [];
      for (let k = 0; k < list.length; k++) {
        msg = `Загружаю: ${list[k].name} (${k + 1} из ${list.length})…`; draw();
        try { await cloudImportOne(list[k]); } catch (e) { errs.push(list[k].name + ': ' + String(e.message || e)); }
      }
      if (errs.length) throw new Error('не загрузились — ' + errs.join('; '));
    };
    const afterJoin = async () => {
      if (cloudOn() && cloudPlayers && cloudPlayers.length) await importAll();
      if (PR.list.length && cloudOn()) { gone = true; toast('☁️ Игроки загружены из облака'); players(); }
    };
    if ($('cdla')) $('cdla').onclick = () => run(afterJoin);
    if ($('crn')) $('crn').onclick = () => {
      const nc = $('ncode').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!codeOk(nc)) { msg = 'Код — от 6 до 12 латинских букв или цифр.'; return draw(); }
      if (!confirm('Сменить семейный код на ' + nc + '? Все игроки и дневник перенесутся под новый код.')) return;
      run(async () => { await cloudRename(nc); cloudPlayers = null; cloudPlayers = (await api('join', {})).players.filter(x => !String(x.id).startsWith('__')); toast('✅ Новый семейный код: ' + nc); });
    };
    if ($('cj')) $('cj').onclick = () => run(() => {
      const c = $('cc').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!codeOk(c)) throw new Error(`семейный код — от 6 до 12 латинских букв или цифр, а введено знаков: ${c.length}. Код показан на старом устройстве: «🔒 Родителям» → «☁️ Связь» → облако.`);
      return login(c, false).then(afterJoin);
    });
    if ($('cc') && autoCode) { $('cc').value = autoCode; const c = autoCode; autoCode = ''; run(() => login(c, false).then(afterJoin)); return; }
    if ($('clk')) $('clk').onclick = () => {
      const v = $('clink').value, ok = () => toast('📋 Ссылка скопирована — отправьте её себе и откройте на новом устройстве');
      try { navigator.clipboard.writeText(v).then(ok, () => { $('clink').select(); document.execCommand('copy'); ok(); }); } catch (e) { $('clink').select(); try { document.execCommand('copy'); ok(); } catch (x) {} }
    };
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
      const c = (cloudPlayers || []).find(x => x.id === cid) || { id: cid, name: '' };
      const p = await cloudImportOne(c);
      newPlayerFrom = null; savePR(); gone = true; useProfile(p.id);
    }));
  };
  draw();
  if (cloudOn() && !cloudPlayers) (async () => { try { cloudPlayers = (await api('join', {})).players.filter(x => !String(x.id).startsWith('__')); draw(); } catch (e) { msg = 'Нет связи: ' + String(e.message || e); draw(); } })();
}

/* ---------- приветствие ---------- */
function welcome() {
  let hue = S.hue;
  app.innerHTML = `<div class="card center">
    <h1>🎒 Школьный ассистент 🤖</h1>
    ${cloudOn() && !PR.list.some(x => x.cid) ? `<div class="story famjoin"><p><b>☁️ Устройство подключено к семье</b> (код ${esc(CL.code)}).</p>
      <p><button class="btn gold" id="clw">⬇️ Загрузить игроков из облака</button></p></div>` : ''}
    ${cloudUrl() && !cloudOn() ? `<div class="story famjoin"><p><b>Уже занимаетесь на другом устройстве?</b> Войдите по семейному коду — все игроки и их прогресс появятся здесь.</p>
      <p><button class="btn gold" id="clw">☁️ Войти по семейному коду</button></p><p><small>Код есть на старом устройстве: «🔒 Родителям» → «☁️ Связь».</small></p></div>` : ''}
    <p>Вместе с роботом учим английский и итальянский, считаем, пишем, изучаем мир и рисуем. Злой Забывака украл знания, и только ты можешь их вернуть!</p>
    <p>Как тебя зовут?</p><input type="text" id="nm" maxlength="14" placeholder="Твоё имя" value="${esc(S.name)}">
    <p>Выбери своего робота:</p><div id="heroes"></div>
    <p><button class="btn gold" id="go">Начать приключение ➜</button></p>
    ${newPlayerFrom ? '<p><button class="btn small sec" id="wb">⬅ Назад к игрокам</button></p>' : ''}
    ${cloudUrl() || cloudOn() ? '' : '<p><button class="btn small sec" id="clw">☁️ У меня уже есть семейный код</button></p>'}</div>`;
  if ($('wb')) $('wb').onclick = cancelNewPlayer;
  if ($('clw')) $('clw').onclick = () => cloudScreen(welcome);
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
const focusOf = subj => {
  const b = (ADP && ADP.a[subj]) || noFocus, w = (S.wish || []).filter(x => x.subj === subj && String(x.text || '').trim()).map(x => String(x.text).trim());
  return w.length ? Object.assign({}, b, { topics: (b.topics || []).concat(w), focus: Math.max(b.focus || 0, 1), reasons: (b.reasons || []).concat(['по рекомендациям родителей']) }) : b;
};
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
  if (S.subj !== 'eng') return []; // дневник сопоставляется только с уроками английского
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
  if (tmGate()) return;
  const WL = W().lessons, i = nextIdx();
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
  const name = { math: 'математике', ru: 'русскому языку', ow: 'окружающему миру', izo: 'ИЗО', pdd: 'ПДД и ОБЖ', lit: 'литературному чтению', logic: 'логике', att: 'вниманию', eng: 'английскому', it: 'итальянскому' }[sj];
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
// Основные уроки идут по порядку. Бонусные (lesson.bonus) — дополнительный материал: они не блокируют основные уроки и босса,
// поэтому новый контент не сбивает прогресс: что было пройдено, остаётся пройденным и открытым.
function unlocked(i) {
  const L = W().lessons, l = L[i], done = x => (S.lessons[x.id] || {}).done;
  if (S.unlockAll || i === 0 || done(l)) return true;
  let j = i - 1; while (j >= 0 && L[j].bonus) j--;
  return j < 0 || !!done(L[j]);
}
// какой урок идёт следующим: сначала основные, потом босс, потом бонусные
function nextIdx() {
  const L = W().lessons, done = x => (S.lessons[x.id] || {}).done;
  let i = L.findIndex(l => !l.bonus && !done(l));
  if (i >= 0) return i;
  if (!done(W().boss)) return -1;
  return L.findIndex(l => !done(l));
}
/* ---------- главный экран и карта предмета ---------- */
// Два уровня, чтобы ребёнок не путался: сначала главный экран (крупно: играть, предметы, магазин, награды),
// и только внутри предмета — карта уроков, тренировка и задание дня.
let homeView = true;
const SUBJ_META = { eng: ['🇬🇧', 'Английский', () => EN_PACK.WORLDS], it: ['🇮🇹', 'Итальянский', () => IT_PACK.WORLDS], math: ['🧮', 'Математика', () => MWORLDS], ru: ['📝', 'Русский язык', () => RWORLDS], ow: ['🌍', 'Окружающий мир', () => OWORLDS], izo: ['🎨', 'ИЗО', () => IWORLDS], pdd: ['🚦', 'ПДД и ОБЖ', () => PWORLDS], lit: ['📖', 'Литературное чтение', () => LWORLDS], logic: ['🧩', 'Логика и шахматы', () => GWORLDS], att: ['🎯', 'Внимание', () => AWORLDS] };
const subjProgress = key => { const ws = SUBJ_META[key][2](); let d = 0, n = 0; ws.forEach(w => { w.lessons.forEach(l => { n++; if ((S.lessons[l.id] || {}).done) d++; }); }); return [d, n]; };
function mapTail() {
  syncSoon(); writeSummary(); knowNews();
  setTimeout(checkAch, 500); // награды, которые зависят от покупок и состояния (шляпы, питомец и др.)
}
const subjOn = k => !(S.off && S.off[k]);
function home() {
  if (tmGate()) return; tmInLesson = false;
  if (!subjOn(S.subj)) { const f = Object.keys(SUBJ_META).find(subjOn); if (f) { S.subj = f; save(); } }
  syncLang(); epoch++; newScreen(); applyTheme(); adaptLoad(); payHomework();
  const st = petStage(), nxt = PET_STAGES[st + 1];
  const petPct = nxt ? Math.round((S.petXp - PET_STAGES[st][0]) / (nxt[0] - PET_STAGES[st][0]) * 100) : 100;
  const cur = skind(), meta = SUBJ_META[cur];
  const WL = W().lessons, nextI = nextIdx(), bossDone = (S.lessons[W().boss.id] || {}).done;
  const what = nextI >= 0 ? `${WL[nextI].icon} ${WL[nextI].title}` : (bossDone ? 'повторяем' : `${W().boss.icon} ${W().boss.title}`);
  const tiles = Object.keys(SUBJ_META).filter(subjOn).map(k => { const m = SUBJ_META[k], [d, n] = subjProgress(k); return `<button class="sjt ${k === cur ? 'cur' : ''}" data-sj="${k}"><span class="te">${m[0]}</span><span class="tn">${m[1]}</span><span class="tp"><i style="width:${n ? Math.round(d / n * 100) : 0}%"></i></span></button>`; }).join('');
  app.innerHTML = `<div class="card top">
      <div>${hero(72)}</div>
      <div class="grow"><h2>Привет, ${S.name}!</h2>${S.title && TITLES[S.title] ? `<div><small>${TITLES[S.title].e} ${TITLES[S.title].n}</small></div>` : ''}
        <span class="chip">💎 ${S.emeralds}</span><span class="chip">⭐ Ур. ${level()}</span><span class="chip">🔥 ${shownStreak()} дн.</span>${S.potionOn ? '<span class="chip">🧪 ×2</span>' : ''}${(S.inv && S.inv.freeze) ? `<span class="chip">❄️ ${S.inv.freeze}</span>` : ''}
        <div>${petE(st)} ${S.petName || 'Кубик'} · ${PET_STAGES[st][2]}<div class="bar"><i style="width:${petPct}%"></i></div></div>
        <div><small>⭐ Опыт до уровня ${level() + 1}</small><div class="bar xp"><i style="width:${levelPct()}%"></i></div></div>${goalHtml()}</div>
    </div>
    ${(() => { petGifts(); const pc = petC(), md = petMoodOf(pc); return `<button class="petcall m${md}" id="phm"><span class="pce">${pc.acc || ''}${petE(st)}</span><span class="pct"><b>🏡 ${esc(S.petName || 'Кубик')}</b><span>${esc(petSay(pc))}</span></span>${pc.treats ? `<span class="chip">🍪 ${pc.treats}</span>` : ''}</button>`; })()}
    <div class="center"><button class="btn play huge" id="play">▶ Играть</button><div class="sjhint">${meta[0]} ${meta[1]}: ${what}</div></div>
    <h3 class="center">Выбери предмет</h3>
    <div class="sjgrid">${tiles}</div>
    <div class="center bigrow"><button class="btn gold big" id="shop">🛒 Магазин${(S.kNew || []).length ? ` <span class="knew">🔓${S.kNew.length}</span>` : ''}</button><button class="btn gold big" id="awb">🏆 Награды ${achList().filter(a => S.ach[a.id]).length}/${achList().length}</button>${S.plan && S.plan.on ? '<button class="btn gold big" id="plan">📅 Мой день</button>' : ''}${location.protocol === 'file:' ? '' : '<button class="btn sec big" id="dia">📓 Дневник</button>'}</div>
    <div class="mini2"><button class="ib" id="who" title="Сменить игрока">👤</button><button class="ib" id="mute" title="Звук">${S.mute ? '🔇' : '🔊'}</button>${cloudOn() ? `<button class="ib" id="cld" title="Облако">${CL.err ? '⚠️' : '☁️'}</button>` : ''}<button class="ib" id="parent" title="Родителям">🔒</button></div>`;
  $('play').onclick = () => { homeView = false; playNext(); };
  $('phm').onclick = () => petHome(home);
  app.querySelectorAll('[data-sj]').forEach(b => b.onclick = () => { S.subj = b.dataset.sj; homeView = false; save(); map(); });
  if ($('plan')) $('plan').onclick = planScreen;
  $('shop').onclick = shop; $('awb').onclick = awards; $('parent').onclick = parentGate; $('who').onclick = players;
  if ($('dia')) $('dia').onclick = () => { location.href = diaryHref(); };
  if ($('cld')) $('cld').onclick = () => toast(CL.err ? 'Нет связи с облаком — всё сохранено на устройстве и отправится позже' : 'Прогресс сохранён в облаке ☁️');
  $('mute').onclick = () => { S.mute = !S.mute; save(); home(); };
  mapTail();
}
function map() {
  if (tmGate()) return; tmInLesson = false;
  if (homeView) return home();
  syncLang();
  epoch++; newScreen();
  applyTheme();
  const WL = W().lessons, BS = W().boss;
  const nextI = nextIdx();
  const allDone = WL.every(l => l.bonus || (S.lessons[l.id] || {}).done); // основные уроки пройдены
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
  for (let r = 0; r * 3 < items.length; r++) rows += `<div class="row ${r % 2 ? 'rev' : ''} n${items.slice(r * 3, r * 3 + 3).length}">${items.slice(r * 3, r * 3 + 3).join('')}</div>`;
  adaptLoad(); payHomework();
  const cur = nextI >= 0 ? WL[nextI] : null;
  const missionHtml = missionCard();
  const nWeak = isGen() ? mathWeak().length : weakCount();
  const meta = SUBJ_META[skind()];
  const tabs = WS().length > 1 ? WS().map((wd, k) => `<button class="btn small ${k === widx() ? 'gold' : 'sec'}" data-w="${k}">${worldOpen(k) ? '' : '🔒 '}${(/(\d)\s*класс/.exec(wd.name) || [0, 0])[1] ? (/(\d)\s*класс/.exec(wd.name)[1]) + ' класс' : wd.name.split(' · ').pop()}</button>`).join('') : '';
  const extra = skind() === 'math' ? '<button class="btn sec" id="col">🧮 Столбик</button><button class="btn sec" id="tfm">⚡ Правда или нет?</button><button class="btn sec" id="srt">🧺 Разложи</button>' : skind() === 'ru' || skind() === 'ow' ? '<button class="btn sec" id="srt">🧺 Разложи</button>' : skind() === 'izo' ? '<button class="btn gold" id="free">🖌️ Рисовать самому</button><button class="btn sec" id="gal">🖼️ Мои рисунки</button>' : (!isGen() ? `${skind() === 'eng' && !S.diagDone && !Object.keys(S.lessons).length ? '<button class="btn gold" id="dg">🔎 Разведка</button>' : ''}<button class="btn sec" id="more">📚 Ещё</button><button class="btn sec" id="dict">📕 Словарь</button>` : '');
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
  if ($('srt')) $('srt').onclick = () => sortGame(skind());
  if ($('col')) $('col').onclick = () => colGame(); if ($('tfm')) $('tfm').onclick = () => tfGame('math');
  if ($('dict')) $('dict').onclick = () => dictScreen(map);
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
    if (S.subj === 'it') S.itworld = k; else if (S.subj === 'math') S.mworld = k; else if (S.subj === 'ru') S.rworld = k; else if (S.subj === 'ow') S.oworld = k; else if (S.subj === 'izo') S.iworld = k; else if (S.subj === 'pdd') S.pworld = k; else if (S.subj === 'lit') S.lworld = k; else if (S.subj === 'logic') S.gworld = k; else if (S.subj === 'att') S.aworld = k; else S.world = k;
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
  if (tmGate()) return; tmInLesson = true;
  const L = W().lessons[i], ctx = { L, i, asked: 0, ok: 0 };
  ctx.steps = [];
  if (L.type === 'math') {
    ctx.steps.push(['Правило', cb => mathRule(ctx, cb)]);
    ctx.steps.push(['Тренируемся', cb => mathQuiz({ ctx, counted: true, items: mixSpecs(L.gens, focusOf(skind()).focus ? 12 : 8) }, cb)]);
    const ds = focusOf(skind()).focus || focusOf(skind()).exams.length ? diarySpecs().slice(0, 4) : [];
    if (ds.length) ctx.steps.push(['Из дневника', cb => mathQuiz({ ctx, counted: true, title: '📓 Темы из дневника', items: ds }, cb)]);
    ctx.steps.push(['Мини-тест', cb => mathQuiz({ ctx, counted: true, title: 'Мини-тест', items: mixSpecs(L.gens, 6) }, cb)]);
  } else if (L.type === 'dict') {
    ctx.steps.push(['Правило', cb => mathRule(ctx, cb)]);
    ctx.steps.push(['Диктант', cb => dictLesson(ctx, L, cb)]);
  } else if (L.type === 'att') {
    ctx.steps.push(['Правило', cb => mathRule(ctx, cb)]);
    ctx.steps.push(['Игра', cb => attGame(ctx, L, cb)]);
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
    { const ty = sample(L.words.filter(typoOk), 3); if (ty.length >= 2) ctx.steps.push(['Исправь ошибку', cb => typoGame(ctx, ty, cb)]); }
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
      ${t.map((s, k) => `<button class="btn sec exb" data-k="${k}">🔊 ${s.en}${sentTrSmall(s.en)}${showRu ? `<small class="exru">${s.ru}</small>` : ''}</button>`).join('')}
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
  if (S.focus && !o.boss && o.items.length > 5) o = Object.assign({}, o, { items: o.items.slice(0, 5) }); // «Спокойный фокус»: короткие блоки
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
      <p class="ru">${g.ru}</p><div class="gsent">${g.en.replace('___', '<span class="gap" id="gp">___</span>')}</div>${o.tr && !hasGap ? sentTrHtml(g.en) : ''}
      <p><button class="speak" id="sp">🔊</button></p><div id="msg" class="msg">&nbsp;</div>
      <div class="opts gapo ${hasGap ? '' : 'long'}">${shuffle(g.opts).map(x => `<button class="opt gapb" data-v="${x}"><span class="ot">${x}</span>${o.tr ? sentTrSmall(x) : ''}</button>`).join('')}</div></div>`);
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
      <div class="en">${w.en}</div>${trHtml(w.id)}<div class="ru">${w.ru}</div>
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
  const seen = Object.keys(S.words).filter(x => WORDS[x] && x !== id && !pool.includes(x));
  pool = shuffle(pool).concat(shuffle(seen));
  if (pool.length < n) pool = pool.concat(shuffle(Object.keys(WORDS).filter(x => x !== id && !pool.includes(x))));
  return pool.slice(0, n);
}

/* Игра-вопросы: listen (слушай→картинка), see (картинка→слово), mine (слушай→блок со словом) */
function quiz(o, done) {
  if (S.focus && !o.boss && o.items.length > 5) o = Object.assign({}, o, { items: o.items.slice(0, 5) }); // «Спокойный фокус»: короткие блоки
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
      ? `<div class="bigemoji">${w.e}</div><p>Как это ${LN().adv}?</p>`
      : `<button class="speak" id="sp">🔊</button><p>${mode === 'mine' ? 'Найди блок с этим словом и копай!' : 'Послушай и найди картинку'}</p>`;
    const optHTML = opts.map(id => {
      const x = WORDS[id];
      return `<button class="opt ${mode}" data-id="${id}">${mode === 'listen' ? `<span class="oe">${x.e}</span>` : `<span class="ot">${x.en}</span>${trSmall(id)}`}</button>`;
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
    <div class="mem">${cards.map((c, k) => `<button class="mc" data-k="${k}"><span class="b">⛏️</span><span class="f ${c.t}">${c.t === 'e' ? WORDS[c.id].e : WORDS[c.id].en + trSmall(c.id)}</span></button>`).join('')}</div></div>`);
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
  const stars = acc >= .9 ? 3 : (acc >= .7 || S.focus) ? 2 : 1; // в «Спокойном фокусе» за пройденный урок не меньше двух звёзд
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
  petWishStep('lesson');
  const before = petStage(); S.petXp += first ? stars : (times <= 2 ? 1 : 0); const after = petStage();
  S.emeralds += em; save(); sfx('win');
  const wd = W();
  const last = widx() + 1 >= WS().length;
  const extra = ctx.boss && first ? `<div class="cert"><h2>🏆 Сертификат героя 🏆</h2><p><b>${S.name}</b> ${wd.boss.cert ? wd.boss.cert + '<br>' + wd.name + '!' : 'победил(а) Забываку<br>и вернул(а) все слова: ' + wd.name + '!'}</p><p>${new Date().toLocaleDateString('ru-RU')}</p></div><p>${last ? 'Следующий мир — скоро!' : '🔓 Открыт следующий мир! Выбери его на карте.'}</p>` : '';
  const repNote = first ? '' : (times <= 2 ? '<p>🔁 Повторение: награда вдвое меньше, зато знания крепче!</p>' : '<p>🔁 Сегодня этот урок уже повторяли дважды: изумрудов за ещё один раз нет, лучше выбери другой урок или тренировку.</p>');
  app.innerHTML = `<div class="card center"><h1>${ctx.boss ? 'Босс побеждён! 🎉' : 'Урок пройден! 🎉'}</h1>
    <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '<i class="soff">⭐</i>'}</span>`).join('')}</div>
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
  if (S.subj === 'att') return attBoss();
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
const subjPrefix = () => S.subj === 'ru' ? 'r_' : S.subj === 'ow' ? 'o_' : S.subj === 'izo' ? 'i_' : S.subj === 'pdd' ? 'p_' : S.subj === 'lit' ? 'l_' : S.subj === 'logic' ? 'g_' : S.subj === 'att' ? 'a_' : '';
const mathWeak = (pref = subjPrefix()) => Object.keys(S.mt || {}).filter(k => pref ? k.startsWith(pref) : !/^[roiplga]_/.test(k)).filter(k => {
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
document.addEventListener('keydown', e => { if (mathKeyFn && !tmLocked) mathKeyFn(e); });
function mathQuiz(o, done) {
  if (S.focus && !o.boss && o.items.length > 5) o = Object.assign({}, o, { items: o.items.slice(0, 5) }); // «Спокойный фокус»: короткие блоки
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
      ${q.opts ? `<div class="opts mopts${q.opts.some(x => String(x).length > 8) ? ' longopts' : ''}">${q.opts.map(x => `<button class="opt" data-v="${x}"><span class="ot">${q.em && q.em[x] ? q.em[x] + ' ' : ''}${x}</span></button>`).join('')}</div>`
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
  W().lessons.filter(l => !l.bonus).forEach(l => l.gens.forEach(g => specs.push(specOf(g))));
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
  if (S.subj === 'att') { toast('Тренируйся в любом уроке: их можно проходить снова 🎯'); return; }
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
  { k: 'know', t: '📚 За знания' },
  { k: 'hat', t: '🎩 Шляпы', src: HATS, none: 'Без шляпы' }, { k: 'face', t: '😎 Лицо', src: FACES, none: 'Без украшения' },
  { k: 'back', t: '🧣 Спина', src: BACKS, none: 'Без украшения' }, { k: 'hand', t: '⛏️ В руке', src: HANDS, none: 'Пусто' },
  { k: 'hue', t: '🎨 Цвет' }, { k: 'pet', t: '🐾 Питомцы' }, { k: 'theme', t: '🗺️ Фон' },
  { k: 'title', t: '🏷️ Звание', src: TITLES, none: 'Без звания' },
  { k: 'up', t: '⚡ Улучшения' }, { k: 'cons', t: '🧪 Запасы' }
];
let shopTab = 'know';
// карточка редкого предмета: открыт, если получена нужная ачивка
function rareCard(it, pic, key, on, onLabel, offLabel, extra = '') {
  const a = ACH.find(x => x.id === it.a);
  if (S.ach[it.a]) {
    return `<div class="item rare">${pic}⭐ ${it.n}<br>${extra}<button class="btn small ${on ? 'gold' : 'sec'}" data-eq="${key}">${on ? onLabel : offLabel}</button></div>`;
  }
  return `<div class="item rare lock"><div class="ie">🔒</div>${it.n}<br><small>🏆 Награда за «${a ? a.t : '?'}»</small></div>`;
}
const owns = (key, p) => p === 0 || S.owned.includes(key);

/* ---------- магазин: вещи «за знания» и товар дня ---------- */
const needCnt = s => (s === '*' ? subjStarted() : subjDone(s).length);
const needVis = it => !it.need || it.need[0] === '*' || subjOn(it.need[0]);
const needOk = it => !it.need || needCnt(it.need[0]) >= it.need[1];
const urokW = n => (n % 10 === 1 && n % 100 !== 11 ? 'урок' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'урока' : 'уроков');
const needTxt = (it, short) => { const r = Math.max(0, it.need[1] - needCnt(it.need[0])); return it.need[0] === '*' ? `Начни ещё ${r} ${r === 1 ? 'предмет' : r < 5 ? 'предмета' : 'предметов'}` : `Ещё ${r} ${urokW(r)}` + (short ? '' : ` · ${SUBJ_META[it.need[0]][0]} ${SUBJ_META[it.need[0]][1]}`); };
const knowPic = (key, it) => KNOW[key] && KNOW[key].tab === 'theme' ? `<div class="swatch" style="background:${it.bg}"></div>` : KNOW[key] && KNOW[key].tab === 'pet' ? `<div class="ie">${it.line[3]}</div>` : `<div class="ie">${it.e}</div>`;
function knowLock(key, it, short) {
  const c = Math.min(needCnt(it.need[0]), it.need[1]);
  return `<div class="item know lock">${knowPic(key, it)}<b>${it.n}</b><small>🔒 ${needTxt(it, short)}</small><div class="bar"><i style="width:${Math.round(c / it.need[1] * 100)}%"></i></div><small>${c} / ${it.need[1]}</small></div>`;
}
const knowOpen = () => Object.keys(KNOW).filter(k => needVis(KNOW[k].it) && needOk(KNOW[k].it));
// после урока: сообщаем, что в магазине открылись новые вещи
function knowNews() {
  S.kSeen = S.kSeen || {}; S.kNew = S.kNew || [];
  const nw = knowOpen().filter(k => !S.kSeen[k]); if (!nw.length) return;
  nw.forEach(k => { S.kSeen[k] = 1; if (!S.kNew.includes(k)) S.kNew.push(k); }); save();
  const sb = $('shop'); if (sb) { const c = sb.querySelector('.knew'); if (c) c.textContent = '🔓' + S.kNew.length; else sb.insertAdjacentHTML('beforeend', ` <span class="knew">🔓${S.kNew.length}</span>`); }
  toast(nw.length === 1 ? `🔓 В магазине открылось: ${KNOW[nw[0]].it.e || '🎁'} ${KNOW[nw[0]].it.n}` : `🔓 В магазине открылось новых вещей: ${nw.length}! Загляни в «📚 За знания»`);
}
// товар дня: каждый день другой, скидка 40%
const DEAL_SRC = () => [['hat', HATS], ['face', FACES], ['back', BACKS], ['hand', HANDS], ['theme', THEMES]];
function dealOf() {
  const all = []; // полный список не зависит от покупок — товар дня не меняется в течение дня, пока его не купили
  DEAL_SRC().forEach(([tab, src]) => Object.keys(src).forEach(k => { if (!src[k].a && src[k].p > 0) all.push([k, tab, src[k]]); }));
  let h = 0; for (const ch of today() + (S.name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < all.length; i++) {
    const [k, tab, it] = all[(h + i) % all.length];
    if (needVis(it) && needOk(it) && !S.owned.includes(k)) return { k, tab, it, p: Math.max(5, Math.round(it.p * .6 / 5) * 5) };
  }
  return null;
}
function shop() {
  if (tmGate()) return; tmInLesson = false;
  const tab = SHOP_TABS.find(t => t.k === shopTab) || SHOP_TABS[0];
  const deal = dealOf();
  const btn = (own, on, key, p0, onLabel, offLabel) => { const p = deal && deal.k === key ? deal.p : p0; return own
    ? `<button class="btn small ${on ? 'gold' : 'sec'}" data-eq="${key}">${on ? onLabel : offLabel}</button>`
    : `${p !== p0 ? `<small>🔥 Товар дня: <s>${p0}</s></small>` : ''}<button class="btn small ${S.emeralds >= p ? '' : 'sec'}" data-buy="${key}" data-p="${p}">💎 ${p}</button>${S.emeralds >= p ? '' : `<button class="btn small ${S.goal && S.goal.k === key ? 'gold' : 'sec'}" data-goal="${key}" data-p="${p}" title="Копить на это">🎯</button>`}`; };
  const byNeed = (src, a, b) => (needOk(src[a]) ? 0 : 1) - (needOk(src[b]) ? 0 : 1) || src[a].p - src[b].p;
  let cards = '', head = '';
  if (tab.src) {
    cards = Object.keys(tab.src).sort((a, b) => byNeed(tab.src, a, b)).map(k => {
      const it = tab.src[k];
      if (!needVis(it)) return '';
      if (!needOk(it)) return knowLock(k, it);
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
    cards = Object.keys(PET_LINES).sort((a, b) => byNeed(PET_LINES, a, b)).map(k => {
      const p = PET_LINES[k], key = 'pet_' + k;
      if (!needVis(p)) return '';
      if (!needOk(p)) return knowLock(key, p);
      if (p.a) return rareCard(p, `<div class="ie">${p.line[3]}</div>`, k, S.pet === k, 'Мой питомец ✓', 'Выбрать', `<small>${p.line.slice(1).join(' ')}</small><br>`);
      return `<div class="item"><div class="ie">${p.line[3]}</div>${p.n}<br><small>${p.line.slice(1).join(' ')}</small><br>${btn(owns(key, p.p), S.pet === k, key, p.p, 'Мой питомец ✓', 'Выбрать')}</div>`;
    }).join('');
  } else if (tab.k === 'know') {
    S.kNew = []; save();
    head = '<p>Эти вещи открываются за учёбу: пройди уроки по предмету — и вещь можно купить. Чем больше знаешь, тем больше открыто!</p>';
    cards = Object.keys(SUBJ_META).concat('*').filter(s => s === '*' || subjOn(s)).map(s => {
      const keys = Object.keys(KNOW).filter(k => KNOW[k].it.need[0] === s); if (!keys.length) return '';
      const nm = s === '*' ? '🌈 Все предметы' : SUBJ_META[s][0] + ' ' + SUBJ_META[s][1], c = needCnt(s);
      return `<h3 class="kh">${nm} <small>${s === '*' ? 'предметов начато: ' : 'пройдено: '}${c}</small></h3>` + keys.map(k => {
        const { it, tab: tb } = KNOW[k];
        if (!needOk(it)) return knowLock(k, it, true);
        const own = S.owned.includes(k);
        return `<div class="item know">${knowPic(k, it)}<b>${it.n}</b><small>${own ? '✅ Уже есть' : '🔓 Открыто!'}</small><button class="btn small ${own ? 'sec' : 'gold'}" data-gotab="${tb}">${own ? 'Надеть ➜' : '💎 ' + (deal && deal.k === k ? deal.p : it.p) + ' ➜'}</button></div>`;
      }).join('');
    }).join('');
  } else {
    cards = Object.keys(THEMES).sort((a, b) => byNeed(THEMES, a, b)).map(k => {
      const t = THEMES[k];
      if (!needVis(t)) return '';
      if (!needOk(t)) return knowLock(k, t);
      if (t.a) return rareCard(t, `<div class="swatch" style="background:${t.bg}"></div>`, k, S.theme === k, 'Выбран ✓', 'Выбрать');
      return `<div class="item"><div class="swatch" style="background:${t.bg}"></div>Фон: ${t.n}<br>${btn(owns(k, t.p) || S.owned.includes(k), S.theme === k, k, t.p, 'Выбран ✓', 'Выбрать')}</div>`;
    }).join('');
  }
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Карта</button><div class="grow center">${hero(90)} <span class="pet">${petE(petStage())}</span></div><span class="chip">💎 ${S.emeralds}</span></div>
    <div class="card"><div class="center">${SHOP_TABS.map(t => `<button class="btn small ${t.k === tab.k ? 'gold' : 'sec'}" data-tab="${t.k}">${t.t}</button>`).join('')}</div>
      ${deal ? `<div class="deal">🔥 <b>Товар дня</b> (только сегодня, −40%): ${deal.it.e || '🗺️'} ${deal.it.n} — <s>${deal.it.p}</s> <b>${deal.p} 💎</b> ${deal.tab === tab.k ? '' : `<button class="btn small gold" data-gotab="${deal.tab}">Посмотреть ➜</button>`}</div>` : ''}
      ${head}<div class="shop" style="margin-top:12px">${cards}</div></div>`;
  $('bk').onclick = map;
  app.querySelectorAll('[data-gotab]').forEach(b => b.onclick = () => { shopTab = b.dataset.gotab; shop(); window.scrollTo(0, 0); });
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


/* ---------- тренажёры внимания ---------- */
function attGame(ctx, L, cb) {
  const lv = L.lv || 1;
  const fin = (asked, ok) => { ctx.asked += asked; ctx.ok += ok; logQn(asked, ok); save(); cb(); };
  ({ gonogo: attGoNoGo, simon: attSimon, odd: attOdd, pairs: attPairs, rhythm: attRhythm })[L.game](lv, ctx, fin);
}
function attBoss() {
  const BS = W().boss, ctx = { L: { id: BS.id, title: BS.title }, i: -1, asked: 0, ok: 0, boss: true };
  ctx.steps = [['Башня', cb => {
    frame(ctx, `<div class="card center"><h1>${BS.icon} ${BS.title}</h1><div class="bigemoji">${BS.bossIcon}</div><p>${BS.story}</p><p>Пять испытаний подряд. Ошибки не страшны!</p><button class="btn gold" id="fi">В бой! ⚔️</button></div>`);
    $('fi').onclick = cb;
  }]].concat([['Жми или стой', 'gonogo'], ['Цепочка', 'simon'], ['Лишний', 'odd'], ['Пары', 'pairs'], ['Ритм', 'rhythm']].map(([nm, gm]) => [nm, cb => attGame(ctx, { game: gm, lv: 3 }, cb)]));
  runSteps(ctx, () => reward(ctx));
}
function attGoNoGo(lv, ctx, fin) {
  const n = [10, 14, 18][lv - 1], dur = [1500, 1200, 1000][lv - 1];
  frame(ctx, `<div class="card center"><h3>Жми или стой</h3><p class="dtxt">🟢 появился — жми кнопку. 🔴 появился — не жми. Всего ${n} картинок.</p><p><button class="btn gold big" id="gs">Начать ➜</button></p></div>`);
  $('gs').onclick = () => {
    frame(ctx, `<div class="card center"><div class="prog">${Array.from({ length: n }, () => '<i></i>').join('')}</div><div class="bigem att-stim" id="gst">⚪</div><p><button class="btn gold huge" id="gtap">ЖМИ!</button></p><div id="msg" class="msg">&nbsp;</div></div>`);
    const my = screenId, st = $('gst'), dots = [...app.querySelectorAll('.prog i')];
    let k = 0, ok = 0, tapped = false, isT = false, open = false;
    $('gtap').onpointerdown = () => { if (open && !tapped) { tapped = true; st.style.opacity = .55; } };
    const trial = () => {
      if (screenId !== my) return;
      if (k >= n) return fin(n, ok);
      isT = Math.random() < .65; tapped = false; open = true; st.style.opacity = 1; st.textContent = isT ? '🟢' : '🔴';
      setTimeout(() => {
        if (screenId !== my) return; open = false;
        const good = isT === tapped; if (good) { ok++; dots[k].classList.add('d'); $('msg').textContent = '✓'; } else $('msg').textContent = isT ? 'Надо было нажать' : 'Тут надо было подождать';
        st.textContent = '⚪'; k++; setTimeout(trial, 450);
      }, dur);
    };
    setTimeout(trial, 700);
  };
}
function attSimon(lv, ctx, fin) {
  const rounds = [[3, 4, 4], [3, 4, 5, 5], [4, 5, 6, 6]][lv - 1], cols = ['#e53935', '#fdd835', '#43a047', '#1e63d8'];
  let r = 0, ok = 0;
  const round = () => {
    if (r >= rounds.length) return fin(rounds.length, ok);
    const len = rounds[r], seq = Array.from({ length: len }, () => MR(0, 3));
    frame(ctx, `<div class="card center"><div class="prog">${rounds.map((_, k) => `<i class="${k < r ? 'd' : ''}"></i>`).join('')}</div><h3 id="sh">Смотри внимательно 👀</h3>
      <div class="simon">${cols.map((c, i) => `<button class="sbtn" data-i="${i}" style="background:${c}" disabled></button>`).join('')}</div><div id="msg" class="msg">&nbsp;</div></div>`);
    const my = screenId, btns = [...app.querySelectorAll('.sbtn')];
    const flash = (i, ms) => { btns[i].classList.add('lit'); setTimeout(() => { if (btns[i]) btns[i].classList.remove('lit'); }, ms); };
    seq.forEach((v, k) => setTimeout(() => { if (screenId === my) flash(v, 450); }, 800 + k * 750));
    setTimeout(() => {
      if (screenId !== my) return;
      $('sh').textContent = 'Теперь повтори! 👆'; btns.forEach(b => { b.disabled = false; });
      let pos = 0, failed = false;
      const off = () => btns.forEach(x => { x.disabled = true; });
      btns.forEach(b => b.onclick = () => {
        if (failed) return; const i = +b.dataset.i; flash(i, 200);
        if (i !== seq[pos]) { failed = true; $('msg').textContent = 'Ничего страшного, пробуем дальше 🙂'; off(); r++; setTimeout(() => { if (screenId === my) round(); }, 1300); return; }
        if (++pos === len) { ok++; sfx('ok'); $('msg').textContent = 'Верно! ⭐'; off(); r++; setTimeout(() => { if (screenId === my) round(); }, 900); }
      });
    }, 800 + len * 750 + 300);
  };
  round();
}
function attRhythm(lv, ctx, fin) {
  const sets = [[[600, 600], [800, 800], [500, 500]], [[450, 450, 900], [900, 450, 450], [450, 900, 450]], [[450, 450, 900, 450, 450], [900, 450, 450, 900, 450], [450, 900, 450, 450, 900]]][lv - 1], order = RS(sets);
  let r = 0, ok = 0;
  const round = () => {
    if (r >= order.length) return fin(order.length, ok);
    const pat = order[r], beats = pat.length + 1;
    frame(ctx, `<div class="card center"><div class="prog">${order.map((_, k) => `<i class="${k < r ? 'd' : ''}"></i>`).join('')}</div><h3 id="rh">Слушай и смотри 👀</h3><div class="att-stim"><span id="rdot" class="rdot"></span></div>
      <p><button class="btn gold huge" id="rtap" disabled>ТАП!</button></p><p><button class="btn small sec" id="rrep" disabled>🔁 Послушать ещё раз</button></p><div id="msg" class="msg">&nbsp;</div></div>`);
    const my = screenId, dot = $('rdot'), beat = (f, ms) => { dot.classList.add('on'); tones([f], 'beat'); setTimeout(() => { if (dot) dot.classList.remove('on'); }, ms); };
    let taps = [], listening = false;
    const play = after => {
      const times = [0]; pat.forEach(p => times.push(times[times.length - 1] + p));
      times.forEach(tm => setTimeout(() => { if (screenId === my) beat(660, 200); }, 700 + tm));
      setTimeout(() => { if (screenId === my) after(); }, 700 + times[times.length - 1] + 500);
    };
    const ask = () => { $('rh').textContent = 'Теперь ты! Нажимай в том же ритме 👆'; $('rtap').disabled = false; $('rrep').disabled = false; taps = []; listening = true; };
    play(ask);
    $('rrep').onclick = () => { if (!listening) return; listening = false; taps = []; $('rtap').disabled = true; $('rrep').disabled = true; $('rh').textContent = 'Слушай ещё раз 👀'; play(ask); };
    $('rtap').onpointerdown = () => {
      if (!listening) return; taps.push(performance.now()); beat(440, 150);
      if (taps.length < beats) return;
      listening = false; $('rtap').disabled = true; $('rrep').disabled = true;
      const good = pat.every((p, i) => Math.abs((taps[i + 1] - taps[i]) - p) <= Math.max(220, p * .4));
      if (good) { ok++; sfx('ok'); $('msg').textContent = 'Точно в ритм! ⭐'; } else $('msg').textContent = 'Почти! В следующий раз получится 🙂';
      r++; setTimeout(() => { if (screenId === my) round(); }, 1400);
    };
  };
  round();
}
const AT_ODD = [[['🍎', '🚗'], ['🐱', '🏠'], ['⭐', '🍌'], ['🌳', '🐟']], [['🍎', '🍏'], ['🔵', '🟣'], ['🐶', '🐕'], ['🌹', '🌷'], ['🟢', '🟡']], [['😀', '😃'], ['🙂', '🙃'], ['⭐', '🌟'], ['🔶', '🔸'], ['🌕', '🌝']]];
function attOdd(lv, ctx, fin) {
  const size = [3, 4, 5][lv - 1], rounds = 6; let r = 0, ok = 0;
  const round = () => {
    if (r >= rounds) return fin(rounds, ok);
    const [a, b] = MP(AT_ODD[lv - 1]), pair = MR(0, 1) ? [a, b] : [b, a], pos = MR(0, size * size - 1); let first = true;
    frame(ctx, `<div class="card center"><div class="prog">${Array.from({ length: rounds }, (_, k) => `<i class="${k < r ? 'd' : ''}"></i>`).join('')}</div><h3>Найди того, кто отличается</h3>
      <div class="oddgrid" style="grid-template-columns:repeat(${size},1fr)">${Array.from({ length: size * size }, (_, i) => `<button class="oddb" data-i="${i}">${i === pos ? pair[1] : pair[0]}</button>`).join('')}</div><div id="msg" class="msg">&nbsp;</div></div>`);
    const my = screenId;
    app.querySelectorAll('.oddb').forEach(bt => bt.onclick = () => {
      if (+bt.dataset.i === pos) { if (first) ok++; sfx('ok'); $('msg').textContent = 'Нашёл! ⭐'; r++; app.querySelectorAll('.oddb').forEach(x => { x.disabled = true; }); setTimeout(() => { if (screenId === my) round(); }, 800); }
      else { first = false; bt.disabled = true; $('msg').textContent = 'Почти! Посмотри ещё раз 🙂'; }
    });
  };
  round();
}
function attPairs(lv, ctx, fin) {
  const np = [3, 4, 6][lv - 1], cols = [3, 4, 4][lv - 1], emo = RS(['🐱', '🐶', '🍎', '⭐', '🚗', '🌳', '🐟', '🎈', '🍌', '🦋']).slice(0, np), cards = RS(emo.concat(emo));
  frame(ctx, `<div class="card center"><h3>Найди пары</h3><p><small>Открывай по две карточки</small></p><div class="oddgrid" style="grid-template-columns:repeat(${cols},1fr)">${cards.map((_, i) => `<button class="oddb back" data-i="${i}">❓</button>`).join('')}</div><div id="msg" class="msg">&nbsp;</div></div>`);
  const my = screenId, btns = [...app.querySelectorAll('.oddb')]; let open = [], found = 0, miss = 0, lock = false;
  btns.forEach((bt, i) => bt.onclick = () => {
    if (lock || open.includes(i) || bt.classList.contains('done')) return;
    bt.textContent = cards[i]; bt.classList.remove('back'); open.push(i);
    if (open.length < 2) return;
    const [a, b] = open;
    if (cards[a] === cards[b]) { btns[a].classList.add('done'); btns[b].classList.add('done'); open = []; found++; sfx('ok'); $('msg').textContent = 'Пара! ⭐'; if (found === np) setTimeout(() => { if (screenId === my) fin(np + miss, np); }, 900); }
    else { miss++; lock = true; setTimeout(() => { if (screenId !== my) return; [a, b].forEach(x => { btns[x].textContent = '❓'; btns[x].classList.add('back'); }); open = []; lock = false; }, 900); }
  });
}

/* ---------- «Мой день»: утренний и вечерний план в картинках ---------- */
const PLAN_DEF = {
  morning: [['wake', '⏰', 'Проснуться'], ['wash', '🧼', 'Умыться и почистить зубы'], ['move', '🤸', 'Зарядка'], ['eat', '🥣', 'Позавтракать'], ['bag', '🎒', 'Собрать рюкзак']],
  evening: [['hw', '📚', 'Сделать уроки'], ['play', '🎮', 'Позаниматься в Ассистенте'], ['eat2', '🍽️', 'Поужинать'], ['shower', '🚿', 'Принять душ'], ['read', '📖', 'Почитать 10 минут'], ['bed', '😴', 'Лечь спать вовремя']]
};
const planItems = part => {
  const p = S.plan || {}, hid = p.hide || {};
  return PLAN_DEF[part].filter(x => !hid[x[0]]).map(x => ({ id: x[0], e: x[1], t: x[2] })).concat((p.own || []).filter(x => x.part === part).map(x => ({ id: x.id, e: x.e || '✅', t: x.t })));
};
function planScreen() {
  if (tmGate()) return;
  epoch++; newScreen(); tmInLesson = false; applyTheme();
  S.plan = S.plan || { on: true }; if (S.plan.day !== today()) { S.plan.day = today(); S.plan.done = {}; }
  const done = S.plan.done = S.plan.done || {};
  const isDone = it => it.id === 'play' ? ((S.log[today()] || {}).les >= 1 || done.play) : !!done[it.id];
  const part = (nm, key) => { const its = planItems(key); return its.length ? `<h3>${nm}</h3><div class="planlist">${its.map(it => `<button class="plan ${isDone(it) ? 'on' : ''}" data-pi="${it.id}"><span class="pe">${it.e}</span><span class="pt">${esc(it.t)}</span><span class="pk">${isDone(it) ? '✅' : '⬜'}</span></button>`).join('')}</div>` : ''; };
  const all = planItems('morning').concat(planItems('evening')), nd = all.filter(isDone).length, pct = all.length ? Math.round(nd / all.length * 100) : 0;
  app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Домой</button><h2>📅 Мой день</h2>
    <div class="calmbar"><i style="width:${pct}%"></i></div><p class="center">Сделано: <b>${nd}</b> из ${all.length}</p>${part('🌅 Утро', 'morning')}${part('🌙 Вечер', 'evening')}<div id="pm" class="msg">&nbsp;</div></div>`;
  $('bk').onclick = home;
  app.querySelectorAll('[data-pi]').forEach(b => b.onclick = () => {
    const id = b.dataset.pi; if (id === 'play' && (S.log[today()] || {}).les >= 1) return;
    done[id] = !done[id]; save();
    const now = all.filter(it => it.id === 'play' ? ((S.log[today()] || {}).les >= 1 || done.play) : !!done[it.id]).length, key = 'P' + today();
    if (now === all.length && all.length && !S.bonusGiven[key]) { S.bonusGiven[key] = 1; S.emeralds += 5; save(); sfx('win'); toast('🎉 Весь план выполнен! +5 💎'); }
    planScreen();
  });
}

/* ---------- родителям ---------- */
/* ---------- «Ещё» и PIN для родителей ---------- */
/* ---------- словарь: все слова языка с транскрипцией, переводом и поиском ---------- */
const isIt = () => LNOW === LANGINFO.it;
const trOf = id => (isIt() ? (typeof IT_TR !== 'undefined' ? IT_TR[id] : '') : (typeof EN_TR !== 'undefined' ? EN_TR[id] : '')) || '';
// транскрипция под словом: у английского — международная [ ], у итальянского — как читается русскими буквами
const trSmall = id => { const r = trOf(id); return r ? `<small class="otr">${isIt() ? r : '[' + r + ']'}</small>` : ''; }; // транскрипция в карточке ответа
// транскрипция целой фразы: по словам; если хоть одно слово неизвестно — не показываем (лучше ничего, чем с пропусками)
let enTrMap = null;
function trWord(w) {
  if (isIt()) return (typeof IT_TRX !== 'undefined' && IT_TRX[w]) || '';
  if (typeof EN_TRX !== 'undefined' && EN_TRX[w]) return EN_TRX[w];
  if (!enTrMap) { enTrMap = {}; if (typeof EN_TR !== 'undefined') Object.values(EN_PACK.WORDS).forEach(x => { const k = x.en.toLowerCase(); if (EN_TR[x.id] && !k.includes(' ')) enTrMap[k] = EN_TR[x.id]; }); }
  return enTrMap[w] || '';
}
function sentTr(text) {
  const parts = String(text || '').replace(/[’‘]/g, "'").toLowerCase().match(/[a-zàèéìòóù]+(?:'[a-zàèéìòóù]+)*|\d+/g);
  if (!parts) return '';
  const out = [];
  for (const p of parts) { if (/^\d+$/.test(p)) { out.push(p); continue; } const r = trWord(p); if (!r) return ''; out.push(r); }
  return out.join(' ');
}
const trWrap = r => (isIt() ? r : '[' + r + ']');
const sentTrHtml = text => { const r = sentTr(text); return r ? `<span class="strn">${trWrap(r)}</span>` : ''; };
const sentTrSmall = text => { const r = sentTr(text); return r ? `<small class="otr">${trWrap(r)}</small>` : ''; };
const trHtml = id => { const r = trOf(id); return r ? `<div class="trn">${isIt() ? 'читается: ' + r : '[' + r + ']'}</div>` : ''; };
const dNorm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ё/g, 'е').replace(/[’'?!.,]/g, ' ').replace(/\s+/g, ' ').trim();
let dictQ = '', dictL = null;
function dictScreen(back) {
  if (tmGate()) return; tmInLesson = false;
  if (dictL !== LNOW) { dictQ = ''; dictL = LNOW; } // другой язык — поиск с чистого листа
  epoch++; newScreen();
  const it = isIt(), col = collectedSet(), ids = Object.keys(WORDS);
  const lang = it ? 'итальянский' : 'английский', adv = it ? 'по-итальянски' : 'по-английски';
  app.innerHTML = `<div class="card top"><button class="btn small sec" id="bk">⬅ Назад</button><div class="grow center"><h2>📕 Словарь: ${lang}</h2></div></div>
    <div class="card dsearch"><input type="search" id="dq" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="🔎 Напиши слово ${adv} или по-русски" value="${esc(dictQ)}">
      <p class="dn" id="dn"></p></div><div class="card"><div id="dl" class="dlist"></div></div>`;
  $('bk').onclick = back || map;
  const row = id => {
    const w = WORDS[id], r = trOf(id);
    return `<div class="drow" data-say="${id}"><span class="de">${w.e}</span><div class="dw"><b class="df">${esc(w.en)}</b>${r ? ` <span class="dt">${it ? r : '[' + r + ']'}</span>` : ''}<div class="dr">${esc(w.ru)}</div></div>${col.has(id) ? '<span class="dk" title="Уже есть в моём словарике">✅</span>' : ''}<button class="ib dsp" data-say="${id}" title="Послушать">🔊</button></div>`;
  };
  const draw = () => {
    const q = dNorm(dictQ);
    let list;
    if (!q) {
      list = ids.slice().sort((a, b) => dNorm(WORDS[a].en).localeCompare(dNorm(WORDS[b].en)));
      let L = '';
      $('dl').innerHTML = list.map(id => { const f = dNorm(WORDS[id].en)[0].toUpperCase(), h = f !== L ? `<h3 class="dlet">${f}</h3>` : ''; L = f; return h + row(id); }).join('');
      $('dn').textContent = `В словаре ${list.length} слов. Нажми на слово, чтобы его послушать.`;
      return;
    }
    const score = id => {
      const f = dNorm(WORDS[id].en), r = dNorm(WORDS[id].ru), parts = r.split(/[,;()/]\s*/).map(x => x.trim()).filter(Boolean);
      if (f === q || parts.includes(q)) return 0;
      if (f.startsWith(q) || parts.some(p => p.startsWith(q))) return 1;
      if ((' ' + f).includes(' ' + q) || (' ' + r).includes(' ' + q)) return 2;
      if (f.includes(q) || r.includes(q)) return 3;
      return 9;
    };
    list = ids.map(id => [id, score(id)]).filter(x => x[1] < 9).sort((a, b) => a[1] - b[1] || WORDS[a[0]].ru.length - WORDS[b[0]].ru.length || dNorm(WORDS[a[0]].en).localeCompare(dNorm(WORDS[b[0]].en))).map(x => x[0]);
    $('dl').innerHTML = list.length ? list.map(row).join('') : `<p class="center">🤔 Такого слова в словаре пока нет. Проверь, как написано, или попробуй ${/[а-я]/.test(q) ? adv : 'по-русски'}.</p>`;
    $('dn').textContent = list.length ? `Нашлось: ${list.length}` : '';
  };
  draw();
  $('dq').oninput = e => { dictQ = e.target.value; draw(); };
  $('dl').onclick = e => { const el = e.target.closest('[data-say]'); if (el) speak(WORDS[el.dataset.say].en); };
}

/* ---------- «Слова из слов» и «Исправь ошибку» ---------- */
const COMP = () => (isIt() ? (typeof IT_COMP !== 'undefined' ? IT_COMP : []) : (typeof EN_COMP !== 'undefined' ? EN_COMP : []));
// длинное слово собираем из двух слов: sun + glasses = sunglasses
function compGame(ctx, items, cb) {
  const all = COMP(); let i = 0;
  const ask = () => {
    if (i >= items.length) return cb();
    const c = items[i]; let pos = 0, wrong = 0;
    const others = shuffle([...new Set(all.filter(x => x !== c).flatMap(x => x.p))].filter(p => !c.p.includes(p))).slice(0, 2);
    frame(ctx, `<div class="card center"><div class="prog">${items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <h3>🔗 Собери слово из двух слов</h3><div class="bigemoji">${c.e}</div><p class="ru">${c.ru}</p>
      <div class="cparts"><span class="cslot" id="c0">?</span><b>+</b><span class="cslot" id="c1">?</span></div>
      <div id="msg" class="msg">Какие два слова спрятались внутри?</div>
      <div class="tiles">${shuffle(c.p.concat(others)).map(p => `<button class="tile wt" data-p="${esc(p)}">${esc(p)}</button>`).join('')}</div></div>`);
    app.querySelectorAll('.tile').forEach(b => b.onclick = () => {
      if (pos >= 2) return;
      if (b.dataset.p === c.p[pos]) {
        $('c' + pos).textContent = c.p[pos]; $('c' + pos).classList.add('f'); b.disabled = true; sfx('ok'); speak(c.p[pos]); pos++;
        if (pos < 2) return;
        ctx.asked++; if (!wrong) ctx.ok++; logQ(!wrong); save();
        $('msg').innerHTML = `<b>${esc(c.p[0])}</b> (${c.pr[0]}) + <b>${esc(c.p[1])}</b> (${c.pr[1]}) = <b>${esc(c.w)}</b> — ${c.ru}<span class="strn">${trWrap(c.tr)}</span>`;
        setTimeout(() => speak(c.w), 700); i++; waitSpeech(3000, ask, 7000);
      } else {
        wrong++; b.classList.add('bad'); sfx('bad'); setTimeout(() => b.classList.remove('bad'), 450);
        $('msg').textContent = pos ? 'Не подходит. Какое слово идёт второе? 💡' : 'Не подходит. С какого слова начинается? 💡';
        if (wrong >= 2) { const h = [...app.querySelectorAll('.tile')].find(x => !x.disabled && x.dataset.p === c.p[pos]); if (h) h.classList.add('hint'); }
      }
    });
  };
  ask();
}
// слово с одной ошибкой: переставлены, пропущена, лишняя или не та гласная
const typoOk = id => !!WORDS[id] && /^[A-Za-zàèéìòóù]{3,12}$/.test(WORDS[id].en);
function typoOf(w) {
  const V = 'aeiou', lw = w.toLowerCase(), real = new Set(Object.values(WORDS).map(x => x.en.toLowerCase()));
  for (let n = 0; n < 40; n++) {
    const k = Math.floor(Math.random() * 4), i = Math.floor(Math.random() * w.length);
    let r = null;
    if (k === 0 && w.length >= 4 && i < w.length - 1 && lw[i] !== lw[i + 1]) r = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    else if (k === 1 && w.length >= 4 && i > 0) r = w.slice(0, i) + w.slice(i + 1);
    else if (k === 2) r = w.slice(0, i + 1) + w[i] + w.slice(i + 1);
    else if (k === 3 && V.includes(lw[i])) { const o = V.replace(lw[i], ''); r = w.slice(0, i) + o[Math.floor(Math.random() * o.length)] + w.slice(i + 1); }
    if (r && r.toLowerCase() !== lw && !real.has(r.toLowerCase())) return r;
  }
  return null;
}
function typoGame(ctx, ids, cb) {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].concat(isIt() ? ['àèéìòù'] : []);
  let i = 0;
  const ask = () => {
    if (i >= ids.length) return cb();
    const w = WORDS[ids[i]], right = w.en, bad = typoOf(right);
    if (!bad) { i++; return ask(); }
    let typed = '', wrong = 0, done = false;
    frame(ctx, `<div class="card center"><div class="prog">${ids.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
      <h3>✏️ Исправь ошибку</h3><div class="bigemoji">${w.e}</div><p class="ru">${w.ru}</p>
      <p>Робот написал с ошибкой: <span class="typo">${esc(bad)}</span> <button class="btn small sec" id="sp">🔊</button></p>
      <p>Напиши правильно:</p><div class="tbox" id="tb">&nbsp;</div><div class="thint" id="th"></div>
      <div id="msg" class="msg">&nbsp;</div>
      <div class="lkeys">${rows.map(r => `<div class="lrow">${[...r].map(ch => `<button class="btn sec kp" data-k="${ch}">${ch}</button>`).join('')}</div>`).join('')}
        <div class="lrow"><button class="btn sec" data-k="⌫">⌫ Стереть</button><button class="btn gold" id="tok">Проверить ✓</button></div></div></div>`);
    const show = () => { $('tb').textContent = typed || '\u00a0'; };
    $('sp').onclick = () => speak(right);
    app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (done) return; const k = b.dataset.k; if (k === '⌫') typed = typed.slice(0, -1); else if (typed.length < 16) typed += k; show(); });
    $('tok').onclick = () => {
      if (done || !typed) return;
      const low = s => s.toLowerCase(), plain = s => low(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (plain(typed) === plain(right)) {
        done = true; ctx.asked++; if (!wrong) ctx.ok++; logQ(!wrong); srs(w.id, !wrong); save(); sfx('ok'); speak(right);
        $('tb').classList.add('ok'); $('tb').innerHTML = `${esc(right)} ✅${trSmall(w.id)}`;
        $('msg').textContent = low(typed) === low(right) ? praise() : 'Верно! Только не забудь значок над буквой: ' + right;
        i++; waitSpeech(1800, ask, 6000);
      } else {
        wrong++; sfx('bad');
        let p = 0; while (p < typed.length && p < right.length && plain(typed[p]) === plain(right[p])) p++;
        $('msg').textContent = p ? `Первые буквы верно (${p}), дальше ошибка — проверь 💪` : 'Пока не так. Посмотри на картинку и послушай слово 🔊';
        if (wrong >= 2) $('th').textContent = 'Подсказка: ' + right;
      }
    };
  };
  ask();
}
// отдельные игры в «📚 Ещё»
function practiceWords() {
  const col = [...collectedSet()];
  if (col.length >= 6) return col;
  return [...new Set(col.concat(...WORLDS[0].lessons.slice(0, 3).map(l => l.words || [])))];
}
function wordGame(kind) {
  if (tmGate()) return; tmInLesson = true;
  const comp = kind === 'comp', items = comp ? sample(COMP(), 6) : sample(practiceWords().filter(typoOk), 6);
  if (!items.length) { toast('Сначала пройди пару уроков'); return more(); }
  const ctx = { L: { id: 'wg_' + kind, icon: comp ? '🔗' : '✏️', title: comp ? 'Слова из слов' : 'Исправь ошибку' }, asked: 0, ok: 0 };
  ctx.steps = [[ctx.L.title, cb => (comp ? compGame(ctx, items, cb) : typoGame(ctx, items, cb))]];
  runSteps(ctx, () => {
    const em = Math.min(6, ctx.ok); S.emeralds += em; S.petXp += 1; save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>${ctx.L.icon} ${ctx.L.title}: готово!</h1><p>Верно с первой попытки: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>
      <p><button class="btn gold" id="ag">Ещё раз</button><button class="btn sec" id="mo">📚 Ещё</button></p></div>`;
    $('ag').onclick = () => wordGame(kind); $('mo').onclick = more;
  });
}

/* ---------- «Скажи сам»: ребёнок говорит слово, робот проверяет произношение ---------- */
const SRec = () => window.SpeechRecognition || window.webkitSpeechRecognition || null;
const sayNorm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// услышанное совпадает со словом? (одна из версий распознавания содержит слово или очень похожа на него)
function sayMatch(alts, target) {
  const w = sayNorm(target);
  return alts.some(a => {
    const h = sayNorm(a); if (!h) return false;
    if ((' ' + h + ' ').includes(' ' + w + ' ')) return true;
    const near = x => lev(x, w) <= (w.length <= 3 ? 0 : w.length <= 5 ? 1 : Math.floor(w.length / 4)); // dog ≠ dock, но elephant ≈ elefant
    return near(h) || h.split(' ').some(near);
  });
}
function sayGame() {
  if (tmGate()) return; tmInLesson = true;
  const ids = sample(practiceWords().filter(id => WORDS[id] && /^[A-Za-zàèéìòóù' ]{2,16}$/.test(WORDS[id].en)), 6);
  if (!ids.length) { toast('Сначала пройди пару уроков'); return more(); }
  let mic = !!SRec(); // нет распознавания речи (или оно не работает) — ребёнок оценивает себя сам
  const ctx = { L: { id: 'wg_say', icon: '🎤', title: 'Скажи сам' }, asked: 0, ok: 0 };
  const step = cb => {
    let i = 0;
    const ask = () => {
      if (i >= ids.length) return cb();
      const w = WORDS[ids[i]]; let tries = 0, rec = null, busy = false;
      frame(ctx, `<div class="card center"><div class="prog">${ids.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>
        <h3>🎤 Скажи ${LN().adv}</h3><div class="bigemoji">${w.e}</div><div class="en">${esc(w.en)}</div>${trSmall(w.id)}<p class="ru">${w.ru}</p>
        <p><button class="btn sec" id="sl">🔊 Послушать</button></p>
        <div id="sbox">${mic ? '<button class="btn play huge mic" id="sm">🎤 Скажи</button>' : '<p>Послушай робота и повтори вслух 2 раза.</p><p><button class="btn gold" id="sy">😊 Получилось</button><button class="btn sec" id="sn">🔁 Ещё раз послушать</button></p>'}</div>
        <div id="msg" class="msg">${mic ? 'Сначала послушай, потом нажми «Скажи» и произнеси слово' : '&nbsp;'}</div></div>`);
      const my = screenId;
      const done = ok => {
        ctx.asked++; if (ok) ctx.ok++; logQ(ok); srs(w.id, ok); save(); i++;
        setTimeout(() => { if (screenId === my) ask(); }, ok ? 1600 : 2200);
      };
      const toSelf = why => { mic = false; $('msg').textContent = why; $('sbox').innerHTML = '<p><button class="btn gold" id="sy">😊 Получилось</button><button class="btn sec" id="sn">🔁 Ещё раз послушать</button></p>'; bindSelf(); };
      const bindSelf = () => {
        $('sy').onclick = () => { sfx('ok'); $('msg').textContent = praise(); $('sbox').innerHTML = ''; done(true); };
        $('sn').onclick = () => speak(w.en);
      };
      $('sl').onclick = () => speak(w.en);
      speak(w.en, 300);
      if (!mic) return bindSelf();
      $('sm').onclick = () => {
        if (busy) return;
        const R = SRec(); hardStop();
        try { rec = new R(); } catch (e) { return toSelf('На этом устройстве робот не умеет слушать. Повтори вслух и оцени себя сам 🙂'); }
        rec.lang = LNOW.tts === 'en-GB' ? 'en-GB' : LNOW.tts; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
        busy = true; $('sm').classList.add('on'); $('sm').textContent = '👂 Слушаю…'; $('msg').textContent = 'Говори!';
        let got = false;
        rec.onresult = e => {
          got = true; if (screenId !== my) return;
          const alts = [...e.results[0]].map(r => r.transcript);
          if (sayMatch(alts, w.en)) {
            sfx('ok'); $('msg').innerHTML = `${praise()} Робот понял: <b>${esc(alts[0] || w.en)}</b>`; $('sbox').innerHTML = ''; done(tries === 0);
          } else {
            tries++; sfx('bad');
            $('msg').innerHTML = `Робот услышал: <b>${esc(alts[0] || '…')}</b>. ${tries >= 3 ? 'Ничего, это трудное слово! Идём дальше 💪' : 'Послушай ещё раз и скажи чётче 💪'}`;
            if (tries >= 3) { $('sbox').innerHTML = ''; done(false); }
          }
        };
        rec.onerror = e => {
          got = true; busy = false; if (screenId !== my) return;
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') return toSelf('Микрофон не разрешён. Родители могут разрешить его в настройках браузера. А пока повтори вслух и оцени себя сам 🙂');
          if (e.error === 'network') return toSelf('Для проверки нужен интернет. Повтори вслух и оцени себя сам 🙂');
          $('msg').textContent = e.error === 'no-speech' ? 'Не слышу. Нажми «Скажи» и скажи погромче 🙂' : 'Не получилось расслышать, попробуй ещё раз';
        };
        rec.onend = () => {
          busy = false; if (screenId !== my || !$('sm')) return;
          $('sm').classList.remove('on'); $('sm').textContent = '🎤 Скажи';
          if (!got) $('msg').textContent = 'Не слышу. Нажми «Скажи» и скажи погромче 🙂';
        };
        try { rec.start(); } catch (e) { busy = false; toSelf('Микрофон сейчас занят. Повтори вслух и оцени себя сам 🙂'); }
      };
    };
    ask();
  };
  ctx.steps = [['Скажи сам', step]];
  runSteps(ctx, () => {
    const em = Math.min(8, 2 + ctx.ok); S.emeralds += em; S.petXp += 1; addXp(3 + ctx.ok); save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>🎤 Ты говоришь ${LN().adv}!</h1><p>Получилось с первого раза: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>
      <p><button class="btn gold" id="ag">Ещё раз</button><button class="btn sec" id="mo">📚 Ещё</button></p></div>`;
    $('ag').onclick = sayGame; $('mo').onclick = more;
  });
}

/* ---------- «Правда или нет?»: быстрые ответы одним касанием (слова или примеры) ---------- */
function tfGame(kind) {
  if (tmGate()) return; tmInLesson = true;
  const math = kind === 'math';
  const pool = math ? null : practiceWords().filter(id => WORDS[id] && WORDS[id].e);
  if (!math && pool.length < 4) { toast('Сначала пройди пару уроков'); return more(); }
  const timed = !S.focus, LIMIT = 45, NQ = 14; // в спокойном режиме — без таймера, 14 вопросов
  let lv = 0, streak = 0, score = 0, asked = 0, best = 0, endAt = 0, timer = 0, q = null, locked = false;
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const mathQ = () => {
    let a, b, op, r;
    if (lv === 0) { op = R(0, 1) ? '+' : '−'; a = R(2, 10); b = R(1, 9); if (op === '−' && b > a) [a, b] = [b, a]; }
    else if (lv === 1) { op = R(0, 1) ? '+' : '−'; a = R(11, 60); b = R(5, 39); if (op === '−' && b > a) [a, b] = [b, a]; }
    else { op = R(0, 2) ? '×' : ':'; a = R(2, 9); b = R(2, 9); if (op === ':') { const p = a * b; [a, b] = [p, b]; } }
    r = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
    const truth = Math.random() < .5;
    let shown = r;
    if (!truth) { const d = [1, 2, 10, -1, -2, -10][R(0, 5)]; shown = r + d; if (shown < 0 || shown === r) shown = r + 1; }
    return { html: `<div class="mq tfq">${a} ${op} ${b} = ${shown}</div>`, truth: shown === r, why: `${a} ${op} ${b} = ${r}` };
  };
  const wordQ = () => {
    const id = pool[R(0, pool.length - 1)], w = WORDS[id], truth = Math.random() < .5;
    let o = w;
    if (!truth) { const others = pool.filter(x => WORDS[x].e !== w.e && WORDS[x].en !== w.en); o = WORDS[others[R(0, others.length - 1)]]; }
    return { html: `<div class="bigemoji">${w.e}</div><div class="en tfq">${esc(o.en)}</div>`, truth: o === w, say: o.en, why: `${w.e} — ${w.en} (${w.ru})` };
  };
  const ctx = { L: { id: 'tf_' + kind, icon: '⚡', title: 'Правда или нет?' }, asked: 0, ok: 0 };
  const step = cb => {
    let live = 0, over = false;
    const finish = () => { if (over) return; over = true; clearInterval(timer); mathKeyFn = null; cb(); };
    const draw = () => {
      if (timed ? Date.now() >= endAt : asked >= NQ) return finish();
      q = math ? mathQ() : wordQ(); locked = false;
      frame(ctx, `<div class="card center tfcard">
        <div class="tftop">${timed ? '<div class="bar tfbar"><i id="tft"></i></div>' : `<div class="prog">${Array.from({ length: NQ }, (_, k) => `<i class="${k < asked ? 'd' : ''}"></i>`).join('')}</div>`}<span class="chip">⭐ ${score}</span></div>
        <h3>${math ? 'Пример решён верно?' : 'Картинка и слово совпадают?'}</h3>${q.html}
        <div class="tfbtns"><button class="btn tfb tfy" id="ty">✅ Да</button><button class="btn red tfb" id="tn">❌ Нет</button></div>
        <div id="msg" class="msg">&nbsp;</div></div>`);
      live = screenId; if (q.say) speak(q.say);
      const tick = () => { const el = $('tft'); if (el) el.style.width = Math.max(0, (endAt - Date.now()) / (LIMIT * 1000) * 100) + '%'; };
      if (timed) tick();
      const my = screenId;
      const answer = yes => {
        if (locked || screenId !== my) return; locked = true; asked++;
        const ok = yes === q.truth; ctx.asked++; logQ(ok);
        if (ok) { score++; ctx.ok++; streak++; best = Math.max(best, streak); sfx('ok'); if (math && streak % 4 === 0 && lv < 2) lv++; }
        else { streak = 0; sfx('bad'); if (math && lv > 0) lv--; }
        $(yes ? 'ty' : 'tn').classList.add(ok ? 'good' : 'shake');
        $('msg').innerHTML = ok ? praise() : `Неверно: ${esc(q.why)}`;
        setTimeout(() => { if (screenId === my) draw(); }, ok ? 450 : 1500);
      };
      $('ty').onclick = () => answer(true); $('tn').onclick = () => answer(false);
      mathKeyFn = e => { if (screenId !== my) return; if (e.key === 'ArrowLeft' || e.key === 'y' || e.key === '1') answer(true); if (e.key === 'ArrowRight' || e.key === 'n' || e.key === '2') answer(false); };
    };
    frame(ctx, `<div class="card center"><h1>⚡ Правда или нет?</h1><div class="bigemoji">${math ? '🧮' : '🖼️'}</div>
      <p>${math ? 'Смотри на пример и решай быстро: он решён верно?' : 'Посмотри на картинку и слово: они про одно и то же?'}</p>
      <p>${timed ? `У тебя <b>${LIMIT} секунд</b>. Чем больше верных ответов подряд — тем больше огонь 🔥` : `<b>${NQ} вопросов</b>, торопиться не нужно.`}</p>
      <button class="btn play huge" id="go">Старт!</button></div>`);
    $('go').onclick = () => {
      if (timed) { endAt = Date.now() + LIMIT * 1000; timer = setInterval(() => { if (screenId !== live) return clearInterval(timer); const el = $('tft'); if (el) el.style.width = Math.max(0, (endAt - Date.now()) / (LIMIT * 1000) * 100) + '%'; if (Date.now() >= endAt && !locked) finish(); }, 200); }
      draw();
    };
  };
  ctx.steps = [['Правда или нет?', step]];
  runSteps(ctx, () => {
    clearInterval(timer);
    const em = Math.min(10, Math.round(score / 2)); S.emeralds += em; S.petXp += 1; addXp(2 + score); save(); sfx('win');
    const key = 'tfBest_' + kind, rec = score > (S[key] || 0); if (timed && rec) { S[key] = score; save(); }
    app.innerHTML = `<div class="card center"><h1>⚡ Готово!</h1><div class="stars"><span>⭐</span></div>
      <p>Верных ответов: <b>${score}</b> из ${asked}${best >= 3 ? ` · лучшая серия 🔥 ${best}` : ''}</p>
      ${timed ? `<p>${rec ? '🏆 Новый рекорд!' : 'Рекорд: ' + (S[key] || 0)}</p>` : ''}<p class="chip">+${em} 💎</p>
      <p><button class="btn gold" id="ag">Ещё раз</button><button class="btn sec" id="mo">${math ? '🗺️ На карту' : '📚 Ещё'}</button></p></div>`;
    $('ag').onclick = () => tfGame(kind); $('mo').onclick = math ? map : more;
  });
}

/* ---------- «Столбик»: сложение и вычитание по разрядам, с переносом и заниманием ---------- */
function colGame(size) {
  if (tmGate()) return;
  if (!size) {
    epoch++; newScreen();
    app.innerHTML = `<div class="card center"><button class="btn small sec" id="bk">⬅ Карта</button><h1>🧮 Столбик</h1>
      <p>Пишем числа друг под другом и считаем <b>справа налево</b>: единицы, десятки, сотни. Робот подскажет, где запомнить единичку и где занять десяток.</p>
      <div class="bigrow"><button class="btn gold big" data-n="2">До 100</button><button class="btn gold big" data-n="3">До 1 000</button><button class="btn gold big" data-n="4">До 10 000</button></div></div>`;
    $('bk').onclick = map; app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => colGame(+b.dataset.n));
    return;
  }
  tmInLesson = true;
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), lo = 10 ** (size - 1), hi = 10 ** size - 1;
  const make = k => {
    const plus = k % 2 === 0;
    for (let t = 0; t < 200; t++) {
      let a = R(lo, hi), b = R(t % 3 ? lo : Math.max(2, lo / 10), hi); // иногда второе число короче — учимся писать разряд под разрядом
      if (plus) { if (a + b > hi) continue; } // «до 1 000» — сумма меньше 1 000
      else { if (b >= a) [a, b] = [b, a]; if (b === a) continue; }
      // хотим хотя бы один перенос / заём — ради этого упражнение и нужно
      const sa = String(a).split('').reverse(), sb = String(b).split('').reverse();
      let c = 0, hard = false;
      for (let i = 0; i < sa.length; i++) { const x = +sa[i], y = +(sb[i] || 0); if (plus ? x + y + c >= 10 : x - c < y) { hard = true; c = 1; } else c = 0; }
      if (hard || k === 0) return { a, b, plus };
    }
    return { a: 47, b: 38, plus };
  };
  const tasks = Array.from({ length: 6 }, (_, k) => make(k));
  const ctx = { L: { id: 'col' + size, icon: '🧮', title: 'Столбик' }, asked: 0, ok: 0 };
  const step = cb => {
    let ti = 0;
    const ask = () => {
      if (ti >= tasks.length) { mathKeyFn = null; return cb(); }
      const { a, b, plus } = tasks[ti], res = plus ? a + b : a - b;
      const A = String(a).split('').reverse().map(Number), B = String(b).split('').reverse().map(Number);
      const n = Math.max(A.length, String(res).length), W = n + 1; // ширина таблицы: место под знак
      const out = [], carry = []; // carry[i] — единичка (или заём) над разрядом i
      let errs = 0, tries = 0, col = 0, c = 0, locked = false;
      const resLen = String(res).length;
      const cell = (d, cls) => `<span class="cc ${cls || ''}">${d === undefined || d === null ? '' : d}</span>`;
      const row = (digs, sign, cls) => `<div class="crow ${cls || ''}">${cell(sign, 'sg')}${Array.from({ length: n }, (_, k) => { const i = n - 1 - k; return cell(digs[i], i === col && cls === 'res' ? 'cur' : ''); }).join('')}</div>`;
      const draw = msg => {
        const top = Array.from({ length: n }, (_, k) => { const i = n - 1 - k; return cell(carry[i] ? (plus ? '1' : '•') : '', 'cy' + (carry[i] ? ' on' : '')); }).join('');
        const sheet = `<div class="colw" id="colw" style="--n:${W}"><div class="crow">${cell('', 'sg')}${top}</div>${row(A, '', '')}${row(B, plus ? '+' : '−', 'b')}${row(out, '', 'res')}</div>`;
        if ($('colw')) { $('colw').outerHTML = sheet; $('msg').innerHTML = msg || '&nbsp;'; return; } // на каждую цифру обновляем только тетрадь — экран не мигает
        frame(ctx, `<div class="card center"><div class="prog">${tasks.map((_, k) => `<i class="${k < ti ? 'd' : ''}"></i>`).join('')}</div>
          <h3>${plus ? 'Сложи' : 'Вычти'} столбиком: ${a} ${plus ? '+' : '−'} ${b}</h3>
          ${sheet}<div id="msg" class="msg">${msg || '&nbsp;'}</div>
          <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '💡', 0, ''].map(k => k === '' ? '<span></span>' : `<button class="btn kp ${k === '💡' ? 'gold' : 'sec'}" data-k="${k}">${k}</button>`).join('')}</div>
          <div id="nxw"></div></div>`);
        my = screenId;
        app.querySelectorAll('.kp').forEach(btn => btn.onclick = () => press(btn.dataset.k));
      };
      const colInfo = () => {
        const x = A[col] || 0, y = B[col] || 0;
        if (plus) { const s = x + y + c; return { d: s % 10, nc: s >= 10 ? 1 : 0, txt: `${x} + ${y}${c ? ' + 1' : ''} = ${s}` + (s >= 10 ? `: пишем ${s % 10}, а 1 запоминаем (переносим в следующий разряд)` : `: пишем ${s}`) }; }
        const top = x - c, need = top < y;
        return { d: (need ? top + 10 : top) - y, nc: need ? 1 : 0, txt: top < 0 ? `Здесь 0, а единицу у него уже заняли — значит, занимаем у следующего соседа: 10 − 1 = 9, ${9} − ${y} = ${9 - y}` : (c ? `Здесь уже заняли единицу: ${x} − 1 = ${top}. ` : '') + (need ? `${top} меньше ${y} — занимаем десяток у соседа: ${top + 10} − ${y} = ${top + 10 - y}` : `${top} − ${y} = ${top - y}`) };
      };
      const names = ['единицы', 'десятки', 'сотни', 'тысячи', 'десятки тысяч'];
      let my = screenId;
      const press = k => {
        if (locked || screenId !== my) return;
        const info = colInfo();
        if (k === '💡') { tries = Math.max(tries, 1); errs++; $('msg').textContent = '💡 ' + info.txt; return; }
        if (+k === info.d) {
          out[col] = info.d; c = info.nc; if (c) carry[col + 1] = 1; sfx('ok');
          const said = info.txt; col++; tries = 0;
          if (col >= resLen) {
            locked = true; ctx.asked++; if (!errs) ctx.ok++; logQ(!errs); save();
            draw(`${said}.<br><b>${a} ${plus ? '+' : '−'} ${b} = ${res}</b> ${errs ? '✅' : praise()}`);
            ti++; setTimeout(() => { if (screenId === my) ask(); }, 2200);
          } else draw(`${said}. Теперь ${names[col]} 👉`);
        } else {
          tries++; errs++; sfx('bad');
          if (tries >= 2) { out[col] = info.d; c = info.nc; if (c) carry[col + 1] = 1; col++; tries = 0;
            if (col >= resLen) { locked = true; ctx.asked++; logQ(false); save(); draw(`Смотри: ${info.txt}.<br><b>${a} ${plus ? '+' : '−'} ${b} = ${res}</b>`); $('nxw').innerHTML = '<p><button class="btn gold" id="nx">Дальше ➜</button></p>'; $('nx').onclick = () => { ti++; ask(); }; return; }
            draw(`Смотри: ${info.txt}. Теперь ${names[col]} 👉`);
          } else $('msg').textContent = `Не так. Считаем ${names[col]}: ${plus ? 'сложи цифры этого столбика' + (c ? ' и не забудь единичку сверху' : '') : 'из верхней цифры вычти нижнюю' + (c ? ' (сверху точка — там уже заняли 1)' : '')} 💪`;
        }
      };
      mathKeyFn = e => { if (screenId !== my) return; if (/^[0-9]$/.test(e.key)) press(e.key); };
      if ($('colw')) $('colw').remove(); // новый пример — рисуем экран целиком
      draw(`Начинаем с единиц — справа 👉`);
    };
    ask();
  };
  ctx.steps = [['Столбик', step]];
  runSteps(ctx, () => {
    const em = Math.round((2 + ctx.ok) * emMult()); S.emeralds += em; S.petXp += 1; addXp(4 + ctx.ok); save(); sfx('win');
    app.innerHTML = `<div class="card center"><h1>🧮 Столбик освоен!</h1><p>Без единой ошибки: ${ctx.ok} из ${ctx.asked}</p><p class="chip">+${em} 💎</p>
      <p><button class="btn gold" id="ag">Ещё раз</button><button class="btn sec" id="mp">🗺️ На карту</button></p></div>`;
    $('ag').onclick = () => colGame(size); $('mp').onclick = map;
  });
}

/* ---------- общий финал для мини-игр ---------- */
function gameEnd(ctx, title, line, em, again, backTo) {
  S.emeralds += em; S.petXp += 1; addXp(2 + ctx.ok); save(); sfx('win');
  app.innerHTML = `<div class="card center"><h1>${title}</h1><p>${line}</p><p class="chip">+${em} 💎</p>
    <p><button class="btn gold" id="ag">Ещё раз</button><button class="btn sec" id="mo">${backTo === map ? '🗺️ На карту' : '📚 Ещё'}</button></p></div>`;
  $('ag').onclick = again; $('mo').onclick = backTo;
}
const langPool = (min, ok) => { // пройденные слова (или первые уроки), подходящие под условие
  let p = practiceWords().filter(id => WORDS[id] && ok(WORDS[id]));
  if (p.length < min) p = [...new Set(p.concat(Object.keys(WORDS).filter(id => ok(WORDS[id]))))].slice(0, Math.max(min, 12));
  return p;
};

/* ---------- «Лови слово»: падают слова, ловим перевод ---------- */
function catchGame() {
  if (tmGate()) return; tmInLesson = true;
  const pool = langPool(6, w => w.e && w.en.length <= 12);
  if (pool.length < 4) { toast('Сначала пройди пару уроков'); return more(); }
  const calm = !!S.focus, LIMIT = 60, GOAL = 12;
  let target = '', score = 0, hearts = 5, endAt = 0, spawnT = 0, tickT = 0, over = false, live = 0;
  const ctx = { L: { id: 'catch', icon: '🫧', title: 'Лови слово' }, asked: 0, ok: 0 };
  const step = cb => {
    frame(ctx, `<div class="card center catchcard">
      <div class="tftop">${calm ? `<div class="prog">${Array.from({ length: GOAL }, () => '<i></i>').join('')}</div>` : '<div class="bar tfbar"><i id="tft"></i></div>'}<span class="chip">⭐ <b id="csc">0</b></span>${calm ? '' : '<span class="chip" id="chs">❤️❤️❤️❤️❤️</span>'}</div>
      <div class="ctarget" id="ctg"></div>
      <div class="arena" id="ar"></div><div id="msg" class="msg">Лови пузырь с нужным словом, остальные пропускай 🙂</div></div>`);
    live = screenId;
    const ar = $('ar'), H = () => ar.clientHeight;
    const pick = () => { let n; do n = pool[Math.floor(Math.random() * pool.length)]; while (n === target && pool.length > 1); target = n; const w = WORDS[n]; $('ctg').innerHTML = `Лови: <span class="ce">${w.e}</span> <b>${esc(w.ru)}</b>`; };
    const finish = () => { if (over) return; over = true; clearInterval(tickT); clearTimeout(spawnT); ar.querySelectorAll('.bub2').forEach(x => x.remove()); setTimeout(cb, 600); };
    const lose = why => {
      if (calm) { $('msg').textContent = why; return; }
      hearts--; $('chs').textContent = '❤️'.repeat(Math.max(0, hearts)) + '🤍'.repeat(5 - Math.max(0, hearts)); $('msg').textContent = why;
      if (hearts <= 0) { $('msg').textContent = 'Сердечки закончились — отличная попытка!'; finish(); }
    };
    const spawn = () => {
      if (over || screenId !== live) return;
      const want = Math.random() < .45 || !ar.querySelector(`[data-id="${target}"]`) && Math.random() < .6;
      let id = target;
      if (!want) { const others = pool.filter(x => x !== target && WORDS[x].e !== WORDS[target].e); id = others[Math.floor(Math.random() * others.length)]; }
      const lane = Math.floor(Math.random() * 3), el = document.createElement('button');
      el.className = 'bub2'; el.dataset.id = id; el.textContent = WORDS[id].en; ar.appendChild(el);
      { const aw = ar.clientWidth, bw = el.offsetWidth; el.style.left = Math.min(aw - bw / 2 - 4, Math.max(bw / 2 + 4, aw * [.2, .5, .8][lane])) + 'px'; } // пузырь целиком внутри поля
      const dur = Math.max(2600, (calm ? 7000 : 5200) - score * 120);
      const a = el.animate([{ transform: 'translate(-50%,-70px)' }, { transform: `translate(-50%,${H() + 10}px)` }], { duration: dur, easing: 'linear', fill: 'forwards' });
      a.onfinish = () => { if (!el.isConnected) return; el.remove(); if (!over && el.dataset.id === target && screenId === live) lose(`Упустил «${WORDS[target].en}» 😮`); };
      el.onpointerdown = e => {
        e.preventDefault(); if (over || el.classList.contains('hit')) return;
        ctx.asked++;
        if (el.dataset.id === target) {
          el.classList.add('hit'); a.pause(); score++; ctx.ok++; logQ(true); sfx('ok'); speak(WORDS[target].en);
          $('csc').textContent = score; $('msg').innerHTML = `${praise()} <b>${esc(WORDS[target].en)}</b> — ${esc(WORDS[target].ru)}`;
          if (calm) { const ps = app.querySelectorAll('.prog i'); if (ps[score - 1]) ps[score - 1].className = 'd'; }
          setTimeout(() => el.remove(), 300);
          if (calm && score >= GOAL) return finish();
          pick();
        } else {
          logQ(false); sfx('bad'); el.classList.add('miss'); setTimeout(() => el.classList.remove('miss'), 400);
          lose(`Это «${WORDS[el.dataset.id].en}» — ${WORDS[el.dataset.id].ru}. А нужно: ${WORDS[target].ru}`);
        }
      };
      spawnT = setTimeout(spawn, Math.max(700, (calm ? 1700 : 1300) - score * 30));
    };
    pick();
    if (!calm) { endAt = Date.now() + LIMIT * 1000; tickT = setInterval(() => { if (screenId !== live) return clearInterval(tickT); const el = $('tft'); if (el) el.style.width = Math.max(0, (endAt - Date.now()) / (LIMIT * 1000) * 100) + '%'; if (Date.now() >= endAt) finish(); }, 200); }
    spawn();
  };
  ctx.steps = [['Лови слово', step]];
  runSteps(ctx, () => gameEnd(ctx, '🫧 Отличный улов!', `Поймано слов: <b>${score}</b>`, Math.min(10, Math.round(score * .7)), catchGame, more));
}

/* ---------- «Найди слова» (филворд): слова спрятаны по строкам и столбцам ---------- */
function wsGame() {
  if (tmGate()) return; tmInLesson = true;
  const N = 8, ok = w => /^[a-z]{3,7}$/i.test(w.en);
  const ids = [...new Set(sample(langPool(8, ok), 12))].filter((id, k, a) => a.findIndex(x => WORDS[x].en.toLowerCase() === WORDS[id].en.toLowerCase()) === k);
  if (ids.length < 4) { toast('Сначала пройди пару уроков'); return more(); }
  const grid = Array.from({ length: N }, () => Array(N).fill('')), placed = [];
  for (const id of ids) {
    if (placed.length >= 6) break;
    const w = WORDS[id].en.toLowerCase();
    for (let tr = 0; tr < 120; tr++) {
      const down = Math.random() < .5, r = Math.floor(Math.random() * (down ? N - w.length + 1 : N)), c = Math.floor(Math.random() * (down ? N : N - w.length + 1));
      const cells = [...w].map((_, k) => down ? [r + k, c] : [r, c + k]);
      if (cells.every(([y, x], k) => !grid[y][x] || grid[y][x] === w[k])) { cells.forEach(([y, x], k) => { grid[y][x] = w[k]; }); placed.push({ id, w, cells }); break; }
    }
  }
  const ABC = isIt() ? 'abcdefghilmnopqrstuvz' : 'abcdefghijklmnopqrstuvwxyz';
  grid.forEach(row => row.forEach((v, x) => { if (!v) row[x] = ABC[Math.floor(Math.random() * ABC.length)]; }));
  const ctx = { L: { id: 'ws', icon: '🔍', title: 'Найди слова' }, asked: 0, ok: 0 };
  const step = cb => {
    frame(ctx, `<div class="card center"><h3>🔍 Найди слова в сетке</h3><p class="wshint">Проведи пальцем по буквам слова — или нажми на первую и последнюю букву. Слова идут вправо ➡️ и вниз ⬇️</p>
      <div class="wsl">${placed.map((p, k) => `<span class="wsw" data-k="${k}">${WORDS[p.id].e} ${esc(p.w)}</span>`).join('')}</div>
      <div class="wsg" id="wsg" style="--n:${N}">${grid.map((row, y) => row.map((ch, x) => `<span class="wsc" data-y="${y}" data-x="${x}">${ch}</span>`).join('')).join('')}</div>
      <div id="msg" class="msg">&nbsp;</div><p><button class="btn small sec" id="wsh">💡 Подсказка</button></p></div>`);
    const gEl = $('wsg'), cellAt = (y, x) => gEl.querySelector(`[data-y="${y}"][data-x="${x}"]`);
    let start = null, anchor = null, sel = [], found = 0, hints = 0;
    const line = (a, b) => {
      if (a.y === b.y) { const s = Math.sign(b.x - a.x) || 1; return Array.from({ length: Math.abs(b.x - a.x) + 1 }, (_, k) => ({ y: a.y, x: a.x + k * s })); }
      if (a.x === b.x) { const s = Math.sign(b.y - a.y) || 1; return Array.from({ length: Math.abs(b.y - a.y) + 1 }, (_, k) => ({ y: a.y + k * s, x: a.x })); }
      return null;
    };
    const show = cells => { gEl.querySelectorAll('.wsc.sel').forEach(c => c.classList.remove('sel')); (cells || []).forEach(p => cellAt(p.y, p.x).classList.add('sel')); };
    const pos = el => el && el.classList.contains('wsc') ? { y: +el.dataset.y, x: +el.dataset.x } : null;
    const check = cells => {
      show(null); if (!cells || cells.length < 2) return false;
      const s = cells.map(p => grid[p.y][p.x]).join(''), key = cells.map(p => p.y + ',' + p.x);
      const k = placed.findIndex(p => !p.done && (s === p.w || [...s].reverse().join('') === p.w) && p.cells.every(([y, x]) => key.includes(y + ',' + x)));
      if (k < 0) { if (cells.length >= 3) { sfx('bad'); $('msg').textContent = `«${s}» — такого слова в списке нет. Ищи ещё!`; } return true; }
      const p = placed[k]; p.done = true; found++; ctx.asked++; ctx.ok++; logQ(true); sfx('ok'); speak(p.w);
      p.cells.forEach(([y, x]) => cellAt(y, x).classList.add('f', 'f' + (k % 6)));
      app.querySelector(`.wsw[data-k="${k}"]`).classList.add('done');
      $('msg').innerHTML = `${praise()} <b>${esc(p.w)}</b> — ${esc(WORDS[p.id].ru)}`;
      if (found >= placed.length) setTimeout(cb, 1500);
      return true;
    };
    gEl.onpointerdown = e => {
      const p = pos(e.target.closest('.wsc')); if (!p) return; e.preventDefault();
      start = p; sel = [p]; show(sel);
    };
    gEl.onpointermove = e => {
      if (!start) return;
      const p = pos(document.elementFromPoint(e.clientX, e.clientY)); if (!p) return;
      const l = line(start, p); if (l) { sel = l; show(sel); }
    };
    const up = () => {
      if (!start) return; const cells = sel; start = null;
      if (cells.length >= 2) { anchor = null; check(cells); return; }
      // нажатие на одну букву: первая — запомнили, вторая — слово от первой до второй
      if (!anchor) { anchor = cells[0]; show([anchor]); $('msg').textContent = 'Теперь нажми на последнюю букву слова'; return; }
      const l = line(anchor, cells[0]); anchor = null;
      if (!l) { show(null); $('msg').textContent = 'Слово должно идти по строке или по столбцу'; return; }
      check(l);
    };
    gEl.onpointerup = up; gEl.onpointercancel = () => { start = null; show(null); };
    $('wsh').onclick = () => {
      const p = placed.find(x => !x.done); if (!p) return; hints++;
      const [y, x] = p.cells[0], c = cellAt(y, x); c.classList.add('hl'); setTimeout(() => c.classList.remove('hl'), 2500);
      $('msg').textContent = `💡 Слово «${p.w}» начинается здесь`;
    };
  };
  ctx.steps = [['Найди слова', step]];
  runSteps(ctx, () => gameEnd(ctx, '🔍 Все слова найдены!', `Слов: ${ctx.ok}`, Math.min(8, 2 + ctx.ok), wsGame, more));
}

/* ---------- «Разложи по корзинам» ---------- */
function sortGame(kind) {
  if (tmGate()) return; tmInLesson = true;
  const lang = kind === 'lang', back = lang ? more : map;
  let title, baskets, items;
  if (lang) {
    const by = new Map();
    Object.keys(WORDS).forEach(id => { const w = WORDS[id], c = w.e && sortCatOf(w.ru); if (c) { if (!by.has(c)) by.set(c, []); by.get(c).push(id); } });
    const known = new Set(practiceWords());
    const cats = shuffle([...by.keys()].filter(c => by.get(c).length >= 4)).sort((a, b) => by.get(b).filter(x => known.has(x)).length - by.get(a).filter(x => known.has(x)).length).slice(0, 4);
    const two = shuffle(cats).slice(0, 2);
    if (two.length < 2) { toast('Сначала пройди пару уроков'); return more(); }
    title = 'Разложи слова по корзинам'; baskets = two.map(c => [c.n, c.e]);
    items = shuffle(two.flatMap((c, k) => sample(by.get(c).sort((a, b) => known.has(b) - known.has(a)).slice(0, 8), 5).map(id => ({ html: `<span class="se">${WORDS[id].e}</span><b>${esc(WORDS[id].en)}</b>`, say: WORDS[id].en, b: k, why: `${WORDS[id].en} — ${WORDS[id].ru}` }))));
  } else {
    const set = SORT_SETS[kind][Math.floor(Math.random() * SORT_SETS[kind].length)];
    title = set.t; baskets = set.b;
    const raw = set.gen ? Array.from({ length: 10 }, set.gen) : sample(set.w, Math.min(10, set.w.length));
    items = raw.map(([s, b]) => { const txt = set.strip ? s.split(set.strip).join('') : s; return { html: `<b>${esc(txt)}</b>`, b, why: set.strip ? s : '' }; });
  }
  const ctx = { L: { id: 'sort_' + kind, icon: '🧺', title: 'Разложи' }, asked: 0, ok: 0 };
  const step = cb => {
    let i = 0, tries = 0;
    frame(ctx, `<div class="card center"><h3>🧺 ${esc(title)}</h3><div class="prog" id="sp">${items.map(() => '<i></i>').join('')}</div>
      <div class="scard" id="sc"></div><div class="baskets b${baskets.length}">${baskets.map(([n, e], k) => `<button class="basket" data-b="${k}"><span class="be">${e}</span><span class="bn">${esc(n)}</span><span class="bin" id="bin${k}"></span></button>`).join('')}</div>
      <div id="msg" class="msg">Нажми на корзину, куда положить карточку</div></div>`);
    const my = screenId;
    const show = () => {
      if (i >= items.length) return setTimeout(cb, 700);
      tries = 0; const it = items[i]; $('sc').innerHTML = it.html; $('sc').className = 'scard in'; if (it.say) speak(it.say);
      app.querySelectorAll('.basket').forEach(b => b.classList.remove('hint', 'bad'));
    };
    app.querySelectorAll('.basket').forEach(bt => bt.onclick = () => {
      if (screenId !== my || i >= items.length || $('sc').classList.contains('go')) return;
      const it = items[i], k = +bt.dataset.b;
      if (k === it.b) {
        ctx.asked++; if (!tries) ctx.ok++; logQ(!tries); sfx('ok');
        const mini = document.createElement('span'); mini.innerHTML = it.html; $('bin' + k).appendChild(mini);
        $('sc').className = 'scard go'; app.querySelectorAll('#sp i')[i].className = 'd';
        $('msg').innerHTML = it.why ? `${praise()} <small>${esc(it.why)}</small>` : praise();
        i++; setTimeout(() => { if (screenId === my) show(); }, 450);
      } else {
        tries++; sfx('bad'); bt.classList.add('bad'); setTimeout(() => bt.classList.remove('bad'), 450);
        $('msg').textContent = tries >= 2 ? 'Подсказка: правильная корзина светится 💡' : 'Не сюда. Подумай ещё 💪';
        if (tries >= 2) app.querySelector(`.basket[data-b="${it.b}"]`).classList.add('hint');
      }
    });
    show();
  };
  ctx.steps = [['Разложи', step]];
  runSteps(ctx, () => gameEnd(ctx, '🧺 Всё разложено!', `С первого раза: ${ctx.ok} из ${ctx.asked}`, Math.min(8, 1 + Math.round(ctx.ok * .7)), () => sortGame(kind), back));
}

/* ---------- «Какой звук?» (английский): первая буква и одинаковый звук ---------- */
function phonGame() {
  if (tmGate()) return; tmInLesson = true;
  const has = id => WORDS[id] && WORDS[id].e;
  const ipa = id => (typeof EN_TR !== 'undefined' && EN_TR[id]) || '';
  // в группе — только слова, где звук действительно есть (по транскрипции)
  const groups = PHONICS.map(gr => ({ ...gr, list: gr.list.filter(id => has(id) && ipa(id).includes(gr.s)) })).filter(gr => gr.list.length >= 3);
  const noSound = (id, s) => ipa(id) && !ipa(id).includes(s.replace('ː', '')); // неверный вариант точно без этого звука (chicken не годится к pig)
  const firsts = Object.keys(WORDS).filter(id => has(id) && /^[a-z]/.test(WORDS[id].en) && !PHON_SKIP.has(id) && WORDS[id].en.length <= 9);
  if (groups.length < 3 || firsts.length < 6) { toast('Это упражнение для английского'); return more(); }
  const qs = Array.from({ length: 8 }, (_, k) => {
    if (k % 2 === 0) {
      const id = firsts[Math.floor(Math.random() * firsts.length)], L0 = WORDS[id].en[0].toLowerCase();
      const pool = [...'bcdfghjklmnprstvwyz' + 'aeiou'].filter(c => c !== L0);
      return { kind: 'first', id, ans: L0, opts: shuffle([L0, ...sample(pool, 2)]) };
    }
    const gr = groups[Math.floor(Math.random() * groups.length)], key = gr.list[0];
    const right = sample(gr.list.filter(x => x !== key), 1)[0];
    const others = shuffle([...new Set(groups.filter(o => o !== gr).flatMap(o => o.list))].filter(x => !gr.list.includes(x) && noSound(x, gr.s))).slice(0, 2);
    return { kind: 'sound', gr, key, ans: right, opts: shuffle([right, ...others]) };
  });
  const ctx = { L: { id: 'phon', icon: '🔤', title: 'Какой звук?' }, asked: 0, ok: 0 };
  const step = cb => {
    let i = 0;
    const ask = () => {
      if (i >= qs.length) return cb();
      const q = qs[i]; let tries = 0, locked = false;
      const head = `<div class="prog">${qs.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
      if (q.kind === 'first') {
        const w = WORDS[q.id];
        frame(ctx, `<div class="card center">${head}<h3>🔤 С какой буквы начинается слово?</h3><div class="bigemoji">${w.e}</div>
          <div class="en" id="pw">? ${'_ '.repeat(w.en.length - 1)}</div><p><button class="btn sec" id="pl">🔊 Послушать</button></p>
          <div class="opts phl">${q.opts.map(c => `<button class="opt" data-v="${c}"><span class="ot">${c}</span></button>`).join('')}</div><div id="msg" class="msg">&nbsp;</div></div>`);
        $('pl').onclick = () => speak(w.en); speak(w.en, 300);
      } else {
        frame(ctx, `<div class="card center">${head}<h3>👂 Найди слово с таким же звуком</h3>
          <p class="phkey"><span class="ce">${WORDS[q.key].e}</span> <b>${esc(WORDS[q.key].en)}</b> — звук <b class="phs">[${q.gr.s}]</b><br><small>${esc(q.gr.hint)}</small></p>
          <p><button class="btn sec" id="pl">🔊 Послушать все</button></p>
          <div class="opts see">${q.opts.map(id => `<button class="opt" data-v="${id}"><span class="oe">${WORDS[id].e}</span><span class="ot">${esc(WORDS[id].en)}</span>${trSmall(id)}</button>`).join('')}</div><div id="msg" class="msg">Нажми на картинку — робот прочитает слово</div></div>`);
        const all = async () => { const my = screenId; for (const x of [q.key, ...q.opts]) { if (screenId !== my) return; await speakP(WORDS[x].en, .75); await new Promise(r => setTimeout(r, 250)); } };
        $('pl').onclick = all; setTimeout(all, 300);
      }
      const my = screenId;
      app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (locked) return;
        const v = b.dataset.v; if (q.kind === 'sound') speak(WORDS[v].en);
        if (v === q.ans) {
          locked = true; b.classList.add('good'); ctx.asked++; if (!tries) ctx.ok++; logQ(!tries); sfx('ok');
          if (q.kind === 'first') { $('pw').textContent = WORDS[q.id].en; speak(WORDS[q.id].en); $('msg').innerHTML = `${praise()} <b>${esc(WORDS[q.id].en)}</b> — ${esc(WORDS[q.id].ru)}`; }
          else $('msg').innerHTML = `${praise()} В <b>${esc(WORDS[q.key].en)}</b> и <b>${esc(WORDS[v].en)}</b> один звук [${q.gr.s}]`;
          i++; setTimeout(() => { if (screenId === my) ask(); }, 1800);
        } else {
          tries++; sfx('bad'); b.classList.add('bad'); b.disabled = true;
          $('msg').textContent = q.kind === 'first' ? 'Послушай ещё раз первый звук 👂' : `В «${WORDS[v].en}» другой звук. Послушай ещё 👂`;
          if (tries >= 2) { const r = app.querySelector(`.opt[data-v="${q.ans}"]`); if (r) r.classList.add('hint'); }
        }
      });
    };
    ask();
  };
  ctx.steps = [['Какой звук?', step]];
  runSteps(ctx, () => gameEnd(ctx, '🔤 Ушки на макушке!', `С первого раза: ${ctx.ok} из ${ctx.asked}`, Math.min(8, 2 + ctx.ok), phonGame, more));
}

function more() {
  if (tmGate()) return; tmInLesson = false;
  epoch++; newScreen();
  app.innerHTML = `<div class="card"><button class="btn small sec" id="bk">⬅ Карта</button><h2>📚 Ещё</h2>
    <div class="moregrid"><button class="btn" id="m1">💬 Диалоги</button><button class="btn" id="m2">🎵 Песенки</button><button class="btn" id="m3">🎧 Аудирование</button><button class="btn" id="m4">📖 Словарик</button><button class="btn" id="m5">📕 Словарь</button><button class="btn" id="m6">🔗 Слова из слов</button><button class="btn" id="m7">✏️ Исправь ошибку</button><button class="btn" id="m8">🎤 Скажи сам</button><button class="btn" id="m9">⚡ Правда или нет?</button><button class="btn" id="m10">🫧 Лови слово</button><button class="btn" id="m11">🔍 Найди слова</button><button class="btn" id="m12">🧺 Разложи</button>${isIt() ? '' : '<button class="btn" id="m13">🔤 Какой звук?</button>'}</div></div>`;
  $('bk').onclick = map; $('m1').onclick = dialogs; $('m2').onclick = songs; $('m3').onclick = listening; $('m4').onclick = vocab; $('m5').onclick = () => dictScreen(more); $('m6').onclick = () => wordGame('comp'); $('m7').onclick = () => wordGame('typo'); $('m8').onclick = sayGame; $('m9').onclick = () => tfGame('word'); $('m10').onclick = catchGame; $('m11').onclick = wsGame; $('m12').onclick = () => sortGame('lang'); if ($('m13')) $('m13').onclick = phonGame;
}
const PIN_KEY = 'engAdventure_pin';
// сброс PIN: по семейному коду (если включено облако) или решив пример, который ребёнку не под силу
function pinReset() {
  epoch++; newScreen();
  const a = 37 + Math.floor(Math.random() * 40), b = 23 + Math.floor(Math.random() * 40);
  const viaCloud = cloudOn();
  if (TM.on && !viaCloud) { // с таймером решение примера ребёнок мог бы найти на калькуляторе
    app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Назад</button><h2>Сброс пароля</h2>
      <p>Пока включён таймер, пароль без облака сбросить нельзя — иначе ребёнок смог бы сам снять ограничение. Включите облако (семейный код) на другом устройстве или очистите данные сайта в браузере (прогресс на этом устройстве пропадёт — сначала сохраните копию).</p></div>`;
    $('bk').onclick = parentGate; return;
  }
  app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Назад</button><h2>Сброс пароля</h2>
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

/* ---------- таймер: сколько времени в день можно играть ---------- */
// хранится на устройстве (общий для всех игроков), чтобы смена игрока не обнуляла время
const TM_KEY = 'engAdventure_timer';
const TM = (() => { const t = { on: false, min: 30, day: '', used: 0, extra: 0 }; try { Object.assign(t, JSON.parse(localStorage.getItem(TM_KEY)) || {}); } catch (e) {} return t; })();
const tmSave = () => { try { localStorage.setItem(TM_KEY, JSON.stringify(TM)); } catch (e) {} };
let tmLocked = false, tmInLesson = false, tmFree = false, tmAct = Date.now(), tmLast = Date.now(), tmTick = 0, tmNoted = false, tmWarn = false;
const tmRoll = () => { if (TM.day !== today()) { TM.day = today(); TM.used = 0; TM.extra = 0; tmNoted = false; tmWarn = false; tmSave(); } };
const tmLimit = () => (TM.min + (TM.extra || 0)) * 60;
const tmUp = () => { tmRoll(); return !!TM.on && !!getPin() && TM.used >= tmLimit(); };
// вызывается в начале экранов: если время вышло — закрываем программу (экран под замком не меняется)
function tmGate() { if (restNow()) { restShowLock(); return true; } if (!tmUp()) return false; tmShowLock(); return true; }
function pinEntry(box, ok) {
  const have = getPin(), num = /^\d{4}$/.test(have); let cur = '';
  const draw = msg => {
    if (num) {
      box.innerHTML = `<p>Введите PIN-код</p><div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < cur.length ? 'on' : ''}"></i>`).join('')}</div><p class="pmsg">${msg || '&nbsp;'}</p>
        <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, ''].map(k => k === '' ? '<span></span>' : `<button class="btn" data-k="${k}">${k}</button>`).join('')}</div>`;
      box.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
        const k = b.dataset.k;
        if (k === '⌫') cur = cur.slice(0, -1); else if (cur.length < 4) cur += k;
        if (cur.length < 4) return draw();
        if (cur === have) return ok();
        cur = ''; draw('Неверный код, попробуйте ещё раз');
      });
    } else {
      box.innerHTML = `<p>Введите пароль</p><p><input type="password" class="pwi" id="pwi" autocomplete="off" maxlength="40"></p><p class="pmsg">${msg || '&nbsp;'}</p><p><button class="btn gold" id="pwo">Войти</button></p>`;
      const go = () => { if ($('pwi').value === have) return ok(); draw('Неверный пароль, попробуйте ещё раз'); };
      $('pwo').onclick = go; $('pwi').onkeydown = e => { if (e.key === 'Enter') go(); };
    }
  };
  draw();
}
// задать (или сменить) пароль: любые 4–20 знаков, цифры или буквы — родитель придумывает сам
function pinForm(box, done) {
  box.innerHTML = `<p>Придумайте пароль для родителей: от 4 до 20 знаков, цифры или буквы. Запомните его — ребёнок его знать не должен.</p>
    <p><input type="password" class="pwi" id="np1" placeholder="Новый пароль" maxlength="20" autocomplete="off"></p>
    <p><input type="password" class="pwi" id="np2" placeholder="Повторите пароль" maxlength="20" autocomplete="off"></p>
    <p><label><input type="checkbox" id="shw"> показать пароль</label></p>
    <p class="pmsg" id="pfm">&nbsp;</p><p><button class="btn gold" id="npo">Сохранить</button></p>`;
  $('shw').onchange = () => { $('np1').type = $('np2').type = $('shw').checked ? 'text' : 'password'; };
  const go = () => {
    const a = $('np1').value, b = $('np2').value;
    if (a.length < 4) { $('pfm').textContent = 'Слишком короткий: нужно хотя бы 4 знака'; return; }
    if (a !== b) { $('pfm').textContent = 'Пароли не совпали'; return; }
    try { localStorage.setItem(PIN_KEY, a); } catch (e) {}
    cloudPin(); done();
  };
  $('npo').onclick = go; $('np2').onkeydown = e => { if (e.key === 'Enter') go(); };
}
function tmShowLock() {
  if (tmLocked) return;
  tmLocked = true; hardStop();
  const ov = document.createElement('div'); ov.id = 'tmlock'; ov.className = 'tmlock'; document.body.appendChild(ov);
  const chip = $('tmchip'); if (chip) chip.style.display = 'none';
  const unlock = () => { tmLocked = false; tmInLesson = false; ov.remove(); };
  const pinStage = () => {
    ov.innerHTML = `<div class="card pinbox tmcard"><div class="bigem">😴</div><h2>Время на сегодня вышло</h2>
      <p>Роботу пора отдыхать. Сходи погуляй, порисуй на бумаге, поиграй в настоящий Minecraft из кубиков! Завтра продолжим.</p>
      <hr><p><b>Для родителей:</b></p><div id="lkbox"></div></div>`;
    pinEntry($('lkbox'), okStage);
  };
  const okStage = () => {
    ov.innerHTML = `<div class="card pinbox tmcard"><h2>🔓 Родитель</h2><p>Сегодня использовано: <b>${Math.round(TM.used / 60)}</b> мин из ${TM.min + (TM.extra || 0)}.</p>
      <p>Добавить ребёнку время:</p><div class="bigrow">${[5, 10, 15, 30].map(n => `<button class="btn gold" data-add="${n}">+${n} мин</button>`).join('')}</div>
      <p><button class="btn sec" id="lkp">⚙️ Настройки родителя</button></p></div>`;
    ov.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { TM.extra = (TM.extra || 0) + (+b.dataset.add); tmWarn = false; tmNoted = false; tmSave(); unlock(); home(); });
    $('lkp').onclick = () => { unlock(); tmFree = true; parent(); };
  };
  pinStage();
}
function tmChip() {
  let el = $('tmchip');
  if (!TM.on || !getPin() || tmLocked || tmFree) { if (el) el.style.display = 'none'; return; }
  if (!el) { el = document.createElement('div'); el.id = 'tmchip'; document.body.appendChild(el); }
  const left = Math.max(0, tmLimit() - TM.used), m = Math.ceil(left / 60);
  el.style.display = ''; el.textContent = '⏰ ' + (left > 0 ? m + ' мин' : 'время вышло'); el.classList.toggle('low', left <= 300);
  { const pc = S.focus ? Math.max(0, Math.min(100, Math.round(left / tmLimit() * 100))) : 0; el.style.background = S.focus ? `linear-gradient(90deg, ${left <= 300 ? '#ffb3a7' : '#c8f0d0'} ${pc}%, #fff ${pc}%)` : ''; }
}
/* ---------- пауза для отдыха: родитель включает её с любого устройства семьи (через облако) ---------- */
// в облаке запись «__rest»: { L: { '*' (все дети) | cid игрока: { u: до какого момента (мс), m: сообщение ребёнку, at: когда поставлена } } }
// на устройстве — последняя известная копия (пауза держится и без интернета, и после перезапуска)
const RS_KEY = 'engAdventure_rest', RS_PDEV = 'engAdventure_parentDev', RS_FOREVER = 9e15;
let RS = (() => { try { const r = JSON.parse(localStorage.getItem(RS_KEY)); if (r && r.L) return r; } catch (e) {} return { L: {} }; })();
const rsSave = () => { try { localStorage.setItem(RS_KEY, JSON.stringify(RS)); } catch (e) {} };
// устройство родителя: пауза на нём не включается (null — ещё не спрашивали)
const rsParentDev = v => { try { if (v === undefined) { const x = localStorage.getItem(RS_PDEV); return x === null ? null : x === '1'; } localStorage.setItem(RS_PDEV, v ? '1' : '0'); } catch (e) {} return null; };
let rsShown = false, rsGrace = 0, rsBusy = false, rsPolledAt = 0;
const rsActive = x => x && x.u > Date.now() && (x.at || 0) > (RS.ovr || 0); // ovr — родитель снял паузу на этом устройстве без интернета
// пауза, которая сейчас касается этого устройства и игрока (или null)
function restNow() {
  if (rsParentDev()) return null;
  const p = curPlayer();
  return ['*', p && p.cid].filter(Boolean).map(k => RS.L[k]).filter(rsActive).sort((a, b) => b.u - a.u)[0] || null;
}
const rsUntil = d => { const n = new Date(); return d === 'inf' ? RS_FOREVER : d === 'am' ? +new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 7, 0) : Date.now() + d * 60000; };
const rsWhen = u => { if (u >= RS_FOREVER) return 'пока не разрешите'; const d = new Date(u), hm = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); return (d.toDateString() === new Date().toDateString() ? 'до ' : 'до завтра, ') + hm; };
async function restPoll() {
  if (!cloudOn() || rsBusy) return;
  rsBusy = true;
  try {
    const r = await api('pull', { id: '__rest' }), ovr = RS.ovr;
    RS = r.state ? JSON.parse(r.state) : { L: {} }; RS.L = RS.L || {}; if (ovr) RS.ovr = ovr;
    rsSave(); rsPolledAt = Date.now(); restTick();
  } catch (e) {}
  rsBusy = false;
}
// записать паузу (val) или снять её (val = null) для ключей keys; extra — дополнительные изменения поверх
async function restSet(keys, val, extra) {
  const r = await api('pull', { id: '__rest' });
  const cur = r.state ? JSON.parse(r.state) : { L: {} }; cur.L = cur.L || {};
  keys.forEach(k => { if (val) cur.L[k] = val; else delete cur.L[k]; });
  if (extra) extra(cur.L);
  Object.keys(cur.L).forEach(k => { if (!(cur.L[k].u > Date.now())) delete cur.L[k]; }); // закончившиеся убираем
  cur._ts = Date.now();
  await api('push', { id: '__rest', name: '__rest', ts: cur._ts, state: JSON.stringify(cur) });
  const ovr = RS.ovr; RS = cur; if (ovr) RS.ovr = ovr; rsSave(); rsPolledAt = Date.now();
}
const restHome = () => (S.name ? home() : PR.list.length ? players() : welcome());
function restHide(ended) {
  const ov = $('rslock'); if (ov) ov.remove();
  rsShown = false; tmLocked = false; tmInLesson = false; rsGrace = 0;
  if (ended) toast('🌞 Перерыв закончился — можно заниматься!');
  restHome();
}
// раз в секунду: показать или убрать паузу
function restTick() {
  const r = restNow();
  if (rsShown) { if (!r) restHide(true); return; }
  if (!r) { rsGrace = 0; return; }
  if (tmFree || tmLocked) return; // открыт экран родителей или уже закрыто таймером
  if (tmInLesson && $('msg')) { // идёт задание — даём спокойно доделать (не дольше 2 минут)
    if (!rsGrace) { rsGrace = Date.now() + 120000; toast('😴 Родители просят отдохнуть. Доделай это задание — и перерыв!'); }
    if (Date.now() < rsGrace) return;
  }
  restShowLock();
}
function restShowLock() {
  if (rsShown || tmLocked || !restNow()) return;
  rsShown = true; tmLocked = true; hardStop(); budHide(); app.innerHTML = ''; // под замком ничего не видно; после паузы откроется главный экран
  const ov = document.createElement('div'); ov.id = 'rslock'; ov.className = 'tmlock'; document.body.appendChild(ov);
  const chip = $('tmchip'); if (chip) chip.style.display = 'none';
  const kidStage = () => {
    const r = restNow() || { u: 0 }, w = rsWhen(r.u); // «до 19:30» или «до завтра, 07:00»
    ov.innerHTML = `<div class="card pinbox tmcard"><div class="bigem">😴</div><h2>Время отдохнуть!</h2>
      ${r.m ? `<p class="rsmsg">💬 ${esc(r.m)}</p>` : '<p>Родители просят сделать перерыв.</p>'}
      <p>${r.u >= RS_FOREVER ? 'Когда родители разрешат, игра откроется сама.' : `Игра откроется сама ${w.startsWith('до завтра') ? 'завтра в ' + w.slice(11) : 'в ' + w.slice(3)}.`}</p>
      <p>Подвигайся, попей воды, поиграй с игрушками или выгляни в окно 🌤️</p>
      <hr><p><button class="btn small sec" id="rsp">🔒 Для родителей</button></p></div>`;
    $('rsp').onclick = pinStage;
  };
  const pinStage = () => {
    ov.innerHTML = `<div class="card pinbox tmcard"><h2>🔒 Для родителей</h2><div id="lkbox"></div><p><button class="btn small sec" id="rsb">⬅ Назад</button></p></div>`;
    $('rsb').onclick = kidStage;
    if (getPin()) pinEntry($('lkbox'), okStage);
    else $('lkbox').innerHTML = '<p>На этом устройстве ещё нет пароля родителей. Снимите паузу там, где её включили: «🔒 Родителям» → «⏰ Время и пароль».</p>';
  };
  const okStage = () => {
    ov.innerHTML = `<div class="card pinbox tmcard"><h2>🔓 Родитель</h2>
      <p><button class="btn gold" id="rso">▶️ Снять паузу — можно заниматься</button></p>
      <p><button class="btn sec" id="rsd">📱 Это моё устройство — на нём паузу не включать</button></p>
      <p class="pmsg" id="rsm">&nbsp;</p><p><button class="btn small sec" id="rsb">⬅ Назад</button></p></div>`;
    $('rsb').onclick = kidStage;
    $('rsd').onclick = () => { rsParentDev(true); toast('📱 Это устройство родителя: пауза на нём больше не включается'); restHide(); };
    $('rso').onclick = async () => {
      const p = curPlayer(), keys = ['*', p && p.cid].filter(Boolean);
      $('rsm').textContent = 'Подождите…';
      try {
        const star = RS.L['*'];
        // общую паузу для всех снимаем только с этого ребёнка: остальным дети её сохраняют
        await restSet(keys, null, L => { if (rsActive(star) && p && p.cid) PR.list.filter(x => x.cid && x.cid !== p.cid).forEach(x => { if (!rsActive(L[x.cid])) L[x.cid] = star; }); });
        toast('▶️ Пауза снята');
      } catch (e) { RS.ovr = Date.now(); rsSave(); toast('📴 Нет связи с облаком — пауза снята только на этом устройстве'); }
      restHide();
    };
  };
  kidStage();
}
setInterval(restTick, 1000);
setInterval(() => { if (document.visibilityState === 'visible') restPoll(); }, 60000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - rsPolledAt > 15000) restPoll(); });
window.addEventListener('online', () => restPoll());
// карточка для родителя (вкладка «Время и пароль»)
function restCardHtml() {
  if (!cloudOn()) return `<div class="card" id="rscard"><h3>😴 Пауза для отдыха — удалённо</h3><p>Чтобы включать паузу со своего телефона, подключите облако (семейный код) и на телефоне, и на планшете ребёнка.</p><button class="btn small gold" data-go="link">☁️ Настроить облако</button></div>`;
  const kids = PR.list.filter(x => x.cid), all = RS.L['*'];
  const row = (k, nm) => {
    const own = RS.L[k], eff = [own, k === '*' ? null : all].filter(rsActive).sort((a, b) => b.u - a.u)[0];
    return `<div class="rsrow"><p><b>${nm}</b> — ${eff ? `😴 отдыхает ${rsWhen(eff.u)}${!rsActive(own) ? ' <small>(пауза для всех)</small>' : ''}` : '✅ можно заниматься'}</p>
      <p>${[[15, '15 мин'], [30, '30 мин'], [60, '1 час'], ['am', 'до утра'], ['inf', 'пока не разрешу']].map(([d, n]) => `<button class="btn small" data-rs="${k}|${d}">${n}</button>`).join('')}${eff ? `<button class="btn small gold" data-rsoff="${k}">▶️ Разрешить</button>` : ''}</p></div>`;
  };
  return `<div class="card" id="rscard"><h3>😴 Пауза для отдыха — удалённо</h3>
    <p>Включите паузу с этого или любого другого устройства семьи — игра на планшете ребёнка закроется (текущее задание он спокойно доделает) и откроется сама, когда время выйдет или когда вы разрешите.</p>
    <p>Сообщение ребёнку (необязательно): <input type="text" id="rsmsg" maxlength="80" placeholder="Например: Пора ужинать 🍲" value="${esc(RS.lastMsg || '')}"></p>
    ${kids.length > 1 ? row('*', '👨‍👩‍👧 Все дети') : ''}${kids.map(x => row(x.cid, esc(x.name))).join('') || row('*', 'Все игроки')}
    <p><label class="subjopt"><input type="checkbox" id="rsdev" ${rsParentDev() ? 'checked' : ''}> 📱 Это моё устройство (родителя) — на нём пауза не включается</label></p>
    <p class="pmsg" id="rsst">&nbsp;</p>
    <p><small>Пауза доходит до планшета в течение минуты, если на нём есть интернет. Без интернета планшет узнает о паузе, как только подключится. ${rsPolledAt ? 'Обновлено в ' + new Date(rsPolledAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + '.' : ''}</small></p></div>`;
}
function restCardBind() {
  if (!$('rscard')) return;
  if (cloudOn() && Date.now() - rsPolledAt > 20000) { const my = screenId; restPoll().then(() => { if (screenId === my && $('rscard') && rsPolledAt) parent(); }); }
  const busy = async (fn, ok) => { const st = $('rsst'); if (st) st.textContent = 'Подождите…'; try { await fn(); toast(ok); parent(); } catch (e) { if ($('rsst')) $('rsst').textContent = 'Не получилось: ' + String(e.message || e) + '. Проверьте интернет.'; } };
  app.querySelectorAll('[data-rs]').forEach(b => b.onclick = () => {
    const [k, d] = b.dataset.rs.split('|'), m = ($('rsmsg').value || '').replace(/[<>&"]/g, '').trim();
    if (rsParentDev() === null && confirm('Это ваш телефон (а не планшет ребёнка)?\n\nОК — на этом устройстве игра не будет закрываться паузой.\nОтмена — это устройство ребёнка, пауза включится и здесь.')) rsParentDev(true);
    else if (rsParentDev() === null) rsParentDev(false);
    RS.lastMsg = m; rsSave();
    const u = rsUntil(d === 'am' || d === 'inf' ? d : +d);
    busy(() => restSet([k], { u, m, at: Date.now() }), `😴 Пауза включена: ${rsWhen(u)}`);
  });
  app.querySelectorAll('[data-rsoff]').forEach(b => b.onclick = () => {
    const k = b.dataset.rsoff, star = RS.L['*'];
    busy(() => restSet(k === '*' ? Object.keys(RS.L) : [k], null, L => {
      if (k !== '*' && rsActive(star)) { delete L['*']; PR.list.filter(x => x.cid && x.cid !== k).forEach(x => { if (!rsActive(L[x.cid])) L[x.cid] = star; }); } // снимаем общую паузу только с этого ребёнка
    }), '▶️ Пауза снята');
  });
  $('rsdev').onchange = e => { rsParentDev(e.target.checked); toast(e.target.checked ? '📱 На этом устройстве пауза не включается' : 'Пауза будет включаться и на этом устройстве'); };
}

/* ---------- полноэкранный режим (убирает вкладки и адресную строку браузера) ---------- */
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
const fsCan = () => { const e = document.documentElement; return !!(e.requestFullscreen || e.webkitRequestFullscreen); };
const fsWish = v => { try { if (v === undefined) return localStorage.getItem('engAdventure_fs') === '1'; localStorage.setItem('engAdventure_fs', v ? '1' : '0'); } catch (e) {} };
function fsEnter() {
  const e = document.documentElement;
  try { const r = (e.requestFullscreen || e.webkitRequestFullscreen).call(e); if (r && r.catch) r.catch(() => {}); } catch (x) {}
}
function fsExit() { try { const r = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (r && r.catch) r.catch(() => {}); } catch (x) {} }
const fsNative = () => { try { return matchMedia('(display-mode: fullscreen)').matches && !fsEl(); } catch (e) { return false; } };
function fsButton() {
  if (fsNative()) return;
  const b = document.createElement('button'); b.id = 'fsbtn'; b.className = 'fsbtn'; b.type = 'button';
  const upd = () => { b.textContent = fsEl() ? '🗗' : '⛶'; b.title = fsEl() ? 'Выйти из полного экрана' : 'Во весь экран'; };
  upd();
  b.onclick = () => {
    if (!fsCan()) { toast('Здесь полный экран из кнопки не работает. Откройте меню браузера → «Добавить на главный экран» и запускайте игру оттуда'); return; }
    if (fsEl()) { fsWish(false); fsExit(); } else { fsWish(true); fsEnter(); }
  };
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, upd));
  document.body.appendChild(b);
  // если полный экран был включён раньше, при первом касании включаем снова (браузер разрешает только после касания)
  const again = () => { if (fsWish() && fsCan() && !fsEl()) fsEnter(); document.removeEventListener('pointerup', again, true); };
  document.addEventListener('pointerup', again, true);
}
fsButton();
/* ---------- офлайн-режим и установка на главный экран (sw.js, manifest.webmanifest) ---------- */
let installEv = null, offToastAt = 0;
const offApp = () => { try { return fsNative() || matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const swOk = () => 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);
if (swOk()) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.ready.then(() => { // один раз сообщаем, что игра теперь есть на устройстве
    try { if (localStorage.getItem('engAdventure_offmsg')) return; localStorage.setItem('engAdventure_offmsg', '1'); } catch (e) { return; }
    toast('✅ Игра сохранена на устройстве — теперь откроется и без интернета');
  }).catch(() => {});
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEv = e; }); // своё окно браузера не показываем ребёнку — установка из «Родителям»
window.addEventListener('appinstalled', () => { installEv = null; });
window.addEventListener('offline', () => { if (Date.now() - offToastAt > 600000) { offToastAt = Date.now(); toast('📴 Нет интернета — играем дальше, всё сохраняется на устройстве'); } });
function offStatus() { // спрашиваем sw.js, все ли файлы игры сохранены на устройстве
  return new Promise(res => {
    const sw = swOk() && navigator.serviceWorker.controller;
    if (!sw) return res(null);
    const ch = new MessageChannel(), tm = setTimeout(() => res(null), 3000);
    ch.port1.onmessage = e => { clearTimeout(tm); res(e.data); };
    try { sw.postMessage('status', [ch.port2]); } catch (e) { clearTimeout(tm); res(null); }
  });
}
function offCard() {
  const st = $('offst'), inst = $('offinst'); if (!st || !inst) return;
  const vt = v => v.slice(6, 8) + '.' + v.slice(4, 6) + '.' + v.slice(0, 4) + ' ' + v.slice(8, 10) + ':' + v.slice(10, 12);
  if (!/^https?:$/.test(location.protocol)) st.textContent = 'Игра открыта из файла — она и так работает без интернета.';
  else if (!swOk()) st.textContent = '❌ Этот браузер не умеет сохранять игру для работы без интернета. Откройте её в Chrome или Safari.';
  else offStatus().then(r => {
    if (!$('offst')) return;
    $('offst').innerHTML = !r ? '⏳ Игра сохраняется на устройство. Пока есть интернет, откройте этот экран ещё раз через минуту.'
      : r.have >= r.need ? `✅ Игра и дневник сохранены на этом устройстве и <b>работают без интернета</b>. Версия от ${vt(String(r.ver))}.`
      : `⏳ Сохраняется на устройство: ${r.have} из ${r.need} файлов. Не закрывайте игру, пока есть интернет.`;
  });
  try { navigator.storage.persist().then(p => { if (p && $('offper')) $('offper').innerHTML = '<small>🔐 Браузер не будет сам удалять игру и прогресс с этого устройства.</small>'; }).catch(() => {}); } catch (e) {}
  inst.innerHTML = offApp() ? '<p>✅ Игра установлена как приложение: открывается значком с главного экрана, во весь экран, без вкладок браузера.</p>'
    : installEv ? '<p><button class="btn gold" id="offib">📲 Установить на главный экран</button></p><p><small>Игра будет открываться значком, как отдельное приложение во весь экран — без вкладок и адресной строки.</small></p>'
    : isIOS() ? '<p>Чтобы поставить игру значком на iPad: откройте её в Safari, нажмите «Поделиться» ⬆️ → «На экран „Домой“». Так она открывается во весь экран, и Safari не удалит прогресс, даже если долго не заходить.</p>'
    : '<p>Чтобы поставить игру значком на главный экран: меню браузера ⋮ → «Установить приложение» или «Добавить на главный экран». Тогда она будет открываться во весь экран, без вкладок.</p>';
  if ($('offib')) $('offib').onclick = () => { const ev = installEv; if (!ev) return; installEv = null; ev.prompt(); Promise.resolve(ev.userChoice).catch(() => {}).then(() => { if ($('offinst')) parent(); }); };
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { tmAct = Date.now(); }, true));
let nudgeScr = -1, nudge2 = -1;
setInterval(() => { // «Спокойный фокус»: если ребёнок завис над заданием, мягко возвращаем внимание
  if (!S.focus || !tmInLesson || tmLocked || tmFree || document.visibilityState !== 'visible' || !$('msg')) return;
  const idle = Date.now() - tmAct;
  if (idle > 25000 && nudgeScr !== screenId) { nudgeScr = screenId; toast('🤔 Подумай спокойно. Нужна подсказка? Нажми 💡'); const h = $('hintb'); if (h) h.classList.add('nudge'); }
  else if (idle > 70000 && nudge2 !== screenId) { nudge2 = screenId; toast('Я рядом! Давай вернёмся к заданию 🙂'); }
}, 2000);
setInterval(() => {
  const now = Date.now(), dt = Math.min(5, (now - tmLast) / 1000); tmLast = now;
  tmRoll();
  if (!TM.on || !getPin()) { tmChip(); return; }
  if (tmFree || tmLocked) { tmChip(); return; }
  // считаем только живое время: вкладка открыта и ребёнок что-то нажимал последние 1,5 минуты
  if (document.visibilityState === 'visible' && now - tmAct < 90000) { TM.used += dt; if (++tmTick % 5 === 0) tmSave(); }
  const left = tmLimit() - TM.used;
  if (left <= 0) {
    if (!tmInLesson) { tmSave(); tmShowLock(); }
    else if (!tmNoted) { tmNoted = true; tmSave(); toast('⏰ Время вышло! Доделай это упражнение — потом отдых'); }
  } else if (left <= 120 && !tmWarn) { tmWarn = true; toast('⏰ Осталось 2 минуты'); }
  tmChip();
}, 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { tmLast = Date.now(); if (!tmInLesson && tmUp()) tmShowLock(); } });

function parentGate(tab) {
  epoch++; newScreen(); tmFree = true; // в настройках родителей время не считается
  const have = getPin();
  app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Карта</button><h2>🔒 Для родителей</h2><div id="pbox"></div>
    ${have ? '<p><button class="btn small sec" id="fg">Забыли пароль?</button></p>' : ''}</div>`;
  $('bk').onclick = map;
  if ($('fg')) $('fg').onclick = pinReset;
  if (have) pinEntry($('pbox'), () => parent(tab || 'main')); else pinForm($('pbox'), () => parent(tab || 'main'));
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
  const tol = spec.tol || 24, steps = spec.steps, prev = (spec.pre || []).slice();
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
  if (tmGate()) return; tmInLesson = true;
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
/* ---------- итальянский: диктант со вводом с экранной клавиатуры (слова и фразы) ---------- */
function dictLesson(ctx, spec, done) {
  const items = shuffle(spec.items).slice(0, spec.n || 8), total = items.length; let i = 0;
  const strip = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’'`´]/g, '’').replace(/[^a-z’ ]/g, '').replace(/\s+/g, ' ').trim();
  const exact = s => s.toLowerCase().normalize('NFC').replace(/[’'`´]/g, '’').replace(/[^a-zàèéìòù’ ]/g, '').replace(/\s+/g, ' ').trim();
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'àèéìòù’'];
  const next = () => { if (i >= total) { mathKeyFn = null; return done(); } ask(items[i]); };
  function ask(it) {
    let tries = 0, accent = 0, locked = false, buf = '';
    const head = `<div class="prog">${items.map((_, k) => `<i class="${k < i ? 'd' : ''}"></i>`).join('')}</div>`;
    const box = () => `<b class="mbox wbox">${esc(buf) || '&nbsp;'}</b>`;
    frame(ctx, `<div class="card center">${head}<h3>Диктант: ${i + 1} из ${total}</h3>${it.e ? `<div class="bigemoji">${it.e}</div>` : ''}<p class="clue">${esc(it.ru)}</p>
      <p><button class="speak" id="sp">🔊</button> <small>Послушай и напиши по-итальянски</small></p>
      <div class="mans" id="mans">${box()}</div>
      <div class="lkeys">${rows.map(r => `<div class="lrow">${[...r].map(c => `<button class="btn sec kp" data-k="${c}">${c}</button>`).join('')}</div>`).join('')}
        <div class="lrow"><button class="btn sec kp" data-k=" " style="min-width:160px">пробел</button><button class="btn sec kp" data-k="⌫">⌫</button><button class="btn gold kp" data-k="✓">✓</button></div></div>
      <div id="msg" class="msg">&nbsp;</div><div id="nxw"></div></div>`);
    const my = screenId;
    const count = ok => { ctx.asked++; if (ok) ctx.ok++; logQ(ok); save(); };
    const solved = () => { locked = true; sfx('ok'); $('msg').textContent = praise(); count(tries === 0 && accent === 0); i++; setTimeout(() => { if (screenId === my) next(); }, 900); };
    const reveal = () => { locked = true; $('msg').innerHTML = `Правильно пишется: <b>${esc(it.en)}</b>`; count(false); i++; $('nxw').innerHTML = '<p><button class="btn gold" id="nx">Дальше ➜</button></p>'; $('nx').onclick = next; speak(it.en); };
    const wrong = () => {
      if (shieldUse(ctx)) { buf = ''; sfx('bad'); $('mans').innerHTML = box(); $('msg').textContent = '🛡️ Щит защитил: ошибка не считается!'; return; }
      tries++; buf = ''; sfx('bad'); $('mans').innerHTML = box(); if (tries >= 2) return reveal(); $('msg').textContent = 'Почти! Проверь буквы и попробуй ещё раз 💪';
    };
    const submit = () => {
      if (locked || !buf.trim()) return;
      if (exact(buf) === exact(it.en)) { $('mans').innerHTML = box(); return solved(); }
      if (strip(buf) === strip(it.en)) { // буквы верные, не хватает знака ударения или он лишний
        accent++; if (accent >= 3) return reveal(); $('msg').textContent = 'Почти! Проверь значки ударения: à è é ì ò ù'; return;
      }
      wrong();
    };
    const press = k => {
      if (locked) return;
      if (k === '✓') return submit();
      if (k === '⌫') buf = buf.slice(0, -1); else if (buf.length < 40) buf += k;
      $('mans').innerHTML = box();
    };
    app.querySelectorAll('.kp').forEach(b => b.onclick = () => press(b.dataset.k));
    $('sp').onclick = () => speak(it.en);
    setTimeout(() => { if (screenId === my) speak(it.en); }, 350);
    hintUI(ctx, () => { $('msg').textContent = `💡 Начинается на «${it.en[0]}», букв: ${it.en.replace(/[^A-Za-zàèéìòù]/g, '').length}`; tries = Math.max(tries, 1); return true; });
    mathKeyFn = e => {
      if (screenId !== my) return;
      if (e.key === 'Backspace') press('⌫'); else if (e.key === 'Enter') press('✓'); else if (e.key.length === 1 && /[a-zA-Zàèéìòù’' ]/.test(e.key)) press(e.key.toLowerCase().replace("'", '’'));
    };
  }
  next();
}
function izoGallery() {
  if (tmGate()) return; tmInLesson = false;
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
const BK_SUBJ = [['math', 'Математика'], ['ru', 'Русский язык'], ['ow', 'Окружающий мир'], ['izo', 'ИЗО'], ['pdd', 'ПДД и ОБЖ'], ['lit', 'Литературное чтение'], ['logic', 'Логика и шахматы'], ['att', 'Внимание'], ['eng', 'Английский'], ['it', 'Итальянский'], ['other', 'Другое']];
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


// недельный график: минуты и точность за последние 8 недель
function weekHtml() {
  const log = S.log || {}, t0 = today(), wd = d => (new Date(d + 'T00:00:00').getDay() + 6) % 7, mon = addDays(t0, -wd(t0));
  const weeks = Array.from({ length: 8 }, (_, k) => { const st = addDays(mon, -7 * (7 - k)); let sec = 0, q = 0, ok = 0, act = 0; for (let i = 0; i < 7; i++) { const x = log[addDays(st, i)]; if (x && (x.sec || x.q)) { act++; sec += x.sec || 0; q += x.q || 0; ok += x.ok || 0; } } return { st, min: Math.round(sec / 60), q, pct: q ? Math.round(100 * ok / q) : null, act }; });
  if (!weeks.some(w => w.q)) return '<p>Пока нет данных: график появится после первых занятий.</p>';
  const W = 330, H = 120, bw = 28, gap = 12, maxM = Math.max(10, ...weeks.map(w => w.min));
  const lab = w => w.st.slice(8) + '.' + w.st.slice(5, 7);
  const bars = weeks.map((w, k) => { const h = Math.round(w.min / maxM * 80), x = 10 + k * (bw + gap); return `<rect x="${x}" y="${100 - h}" width="${bw}" height="${h}" rx="4" fill="#64b5f6"/><text x="${x + bw / 2}" y="${95 - h}" text-anchor="middle" font-size="11" fill="#333">${w.min}</text><text x="${x + bw / 2}" y="114" text-anchor="middle" font-size="9" fill="#666">${lab(w)}</text>`; }).join('');
  const pts = weeks.map((w, k) => w.pct === null ? null : [10 + k * (bw + gap) + bw / 2, 100 - Math.round(w.pct * .8)]);
  const line = pts.filter(Boolean).map((p, i, a) => i ? `<line x1="${a[i - 1][0]}" y1="${a[i - 1][1]}" x2="${p[0]}" y2="${p[1]}" stroke="#e8472b" stroke-width="3"/>` : '').join('') + pts.filter(Boolean).map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#e8472b"/>`).join('');
  const cur = weeks[7], prev = weeks[6], d = cur.pct !== null && prev.pct !== null ? cur.pct - prev.pct : null;
  const txt = `Эта неделя: <b>${cur.min}</b> мин, <b>${cur.act}</b> дн. занятий${cur.pct !== null ? `, верно <b>${cur.pct}%</b>` : ''}.` + (d !== null ? ` По сравнению с прошлой неделей точность ${d > 0 ? 'выросла на ' + d : d < 0 ? 'снизилась на ' + (-d) : 'не изменилась'} п. п.` : '') + (cur.act >= 4 ? ' 👏 Отличная регулярность!' : cur.act <= 1 && prev.act >= 3 ? ' Занятий стало меньше: попробуйте вернуть короткие ежедневные подходы.' : '');
  return `<svg viewBox="0 0 ${W + 20} ${H + 10}" style="width:100%;max-width:440px;background:#f6f1e3;border-radius:10px"><line x1="8" y1="100" x2="${W + 8}" y2="100" stroke="#999"/>${bars}${line}</svg>
    <p><small><span style="color:#64b5f6">■</span> минуты занятий за неделю &nbsp; <span style="color:#e8472b">●</span> % верных с первой попытки (по неделям, начало недели — понедельник)</small></p><p>${txt}</p>`;
}
// график концентрации: когда ребёнок отвечает лучше всего (данные копятся с момента обновления)
function concHtml() {
  const hrs = S.hrs || {}, wds = S.wds || {}, tot = Object.values(hrs).reduce((s, x) => s + (x.q || 0), 0);
  if (tot < 15) return '<p>Пока мало данных: график появится, когда ребёнок решит хотя бы 15 заданий. Данные копируются автоматически.</p>';
  const parts = [['🌅 Утро (6–11)', h => h >= 6 && h <= 11], ['☀️ День (12–16)', h => h >= 12 && h <= 16], ['🌆 Вечер (17–21)', h => h >= 17 && h <= 21], ['🌙 Ночью и очень рано', h => h >= 22 || h <= 5]];
  const rows = parts.map(([nm, f]) => { let q = 0, ok = 0; Object.keys(hrs).forEach(h => { if (f(+h)) { q += hrs[h].q || 0; ok += hrs[h].ok || 0; } }); return { nm, q, pct: q ? Math.round(100 * ok / q) : null }; });
  const ranked = rows.filter(r => r.q >= 15).sort((a, b) => b.pct - a.pct), best = ranked[0], worst = ranked.length > 1 ? ranked[ranked.length - 1] : null;
  const dn = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], wrow = dn.map((n, i) => { const x = wds[i] || { q: 0, ok: 0 }; return `<td><b>${n}</b><br>${x.q ? Math.round(100 * x.ok / x.q) + '%' : '—'}<br><small>${x.q || 0}</small></td>`; }).join('');
  return `<table><tr><th>Время суток</th><th>Верно с первой попытки</th><th>Заданий</th></tr>${rows.map(r => `<tr><td>${r.nm}</td><td>${r.pct === null ? '—' : r.pct + '%'}</td><td>${r.q}</td></tr>`).join('')}</table>
    <p><b>По дням недели</b> (верно / заданий):</p><table><tr>${wrow}</tr></table>
    ${best ? `<p>💡 Лучше всего получается: <b>${best.nm}</b> (${best.pct}%).${worst && worst.pct < best.pct - 8 ? ` Хуже всего: ${worst.nm} (${worst.pct}%): сложное лучше не ставить на это время.` : ''}</p>` : ''}<p><small>Точность считается по первым попыткам. Данные накапливаются с момента обновления игры.</small></p>`;
}
// экран родителей разбит на разделы (вкладки), чтобы не листать одну длинную страницу
let parentTab = 'main';
const PARENT_TABS = [['main', '🏠', 'Главное'], ['kid', '👦', 'Ученик'], ['stats', '📊', 'Успехи'], ['time', '⏰', 'Время и пароль'], ['link', '☁️', 'Связь'], ['set', '⚙️', 'Настройки']];
function parent(tab) {
  if (tab) parentTab = tab;
  if (!PARENT_TABS.some(x => x[0] === parentTab)) parentTab = 'main';
  const sel = 'font:inherit;font-size:1.1rem;padding:6px;border:3px solid #1b1b1b;border-radius:8px';
  const nm = esc(S.name);
  const sec = {};
  // --- главное ---
  const learned = Object.keys(S.words).filter(id => WORDS[id] && S.words[id].seen > 0).length;
  const wkStart = addDays(today(), -6);
  const fam = PR.list.length > 1 ? `<div class="card"><h3>👨‍👩‍👧 Все игроки (последние 7 дней)</h3><table><tr><th>Игрок</th><th>Минут</th><th>Верно</th><th>Локаций</th><th>Серия</th></tr>${PR.list.map(pl => {
    const st = pl.id === PR.cur ? S : loadState(pl.key); let s = 0, q = 0, ok = 0;
    Object.keys(st.log || {}).forEach(d => { if (d >= wkStart) { const x = st.log[d]; s += x.sec || 0; q += x.q || 0; ok += x.ok || 0; } });
    return `<tr><td>${esc(pl.name)}</td><td>${Math.round(s / 60)}</td><td>${q ? Math.round(100 * ok / q) + '%' : '—'}</td><td>${Object.values(st.lessons || {}).filter(x => x.done).length}</td><td>${st.streak || 0}</td></tr>`;
  }).join('')}</table><p><small>Настройки и отчёты ниже — для игрока «${nm}». Другого игрока выберите на экране «Кто занимается?» (👤).</small></p></div>` : '';
  const wk7 = (() => { let s = 0, q = 0, ok = 0, act = 0; for (let i = 0; i < 7; i++) { const x = (S.log || {})[addDays(today(), -i)]; if (x && (x.sec || x.q)) { act++; s += x.sec || 0; q += x.q || 0; ok += x.ok || 0; } } return { min: Math.round(s / 60), q, pct: q ? Math.round(100 * ok / q) : null, act }; })();
  sec.main = `<div class="card"><h3>Коротко про «${nm}»</h3>
      <div class="pstats"><div><b>${wk7.min}</b><small>минут за 7 дней</small></div><div><b>${wk7.act}</b><small>дней с занятиями</small></div><div><b>${wk7.pct === null ? '—' : wk7.pct + '%'}</b><small>верно с первой попытки</small></div><div><b>${shownStreak()}</b><small>дней подряд</small></div></div>
      <p>Пройдено локаций: <b>${Object.values(S.lessons || {}).filter(x => x.done).length}</b>. Выучено слов (${LN().adj}): <b>${learned}</b> из ${Object.keys(WORDS).length}. Изумрудов: ${S.emeralds}.</p>
      <p><button class="btn small gold" id="frp">📊 Семейный отчёт за неделю</button><button class="btn small gold" id="rpt">📊 Отчёт по ${S.subj === 'it' ? 'итальянскому' : 'английскому'}</button>${location.protocol === 'file:' ? '' : '<button class="btn small gold" id="dpar">📓 Дневник (править)</button>'}</p>
      <p><small>Лучше заниматься по 10–15 минут каждый день. Хвалите за старание, а не за оценки.</small></p></div>${fam}
    <div class="card"><h3>Быстрые переходы</h3><div class="ptiles">
      <button class="ptile" data-go="kid">📚 Предметы ученика</button><button class="ptile" data-go="kid">🧘 Спокойный фокус ${S.focus ? '✅' : ''}</button><button class="ptile" data-go="kid">📅 «Мой день» ${S.plan && S.plan.on ? '✅' : ''}</button>
      <button class="ptile" data-go="stats">📊 Недели и концентрация</button><button class="ptile" data-go="time">⏰ Таймер ${TM.on ? '✅ ' + (TM.min + (TM.extra || 0)) + ' мин' : ''}</button><button class="ptile" data-go="time">😴 Пауза для отдыха ${Object.values(RS.L).some(rsActive) ? '✅' : ''}</button><button class="ptile" data-go="link">☁️ Облако ${cloudOn() ? '✅' : ''}</button></div></div>`;
  // --- ученик ---
  sec.kid = `<div class="card"><h3>📚 Предметы ученика «${nm}»</h3>
      <p>Отметьте, что нужно изучать этому ребёнку. Скрытые предметы пропадают с главного экрана; прогресс по ним не теряется.</p>
      <div class="subjcols">${Object.keys(SUBJ_META).map(k => `<label class="subjopt"><input type="checkbox" data-so="${k}" ${subjOn(k) ? 'checked' : ''}> ${SUBJ_META[k][0]} ${SUBJ_META[k][1]}</label>`).join('')}</div>
      <p id="som"></p></div>
    <div class="card"><h3>🧘 Спокойный фокус</h3>
      <p>Для детей, которым трудно удерживать внимание (например, при СДВГ).</p>
      <button class="btn small ${S.focus ? 'red' : 'gold'}" id="focus">${S.focus ? '🧘 Спокойный фокус: ВКЛ (нажмите, чтобы выключить)' : 'Включить спокойный фокус'}</button>
      <details><summary>Что меняется</summary><p><small>Задания идут короткими блоками (не больше 5 подряд); каждые 1,5–2 минуты — минутка движения; без мигающих анимаций и серий «🔥»; звуки тише, ошибка без звука; за пройденный урок не меньше двух звёзд; вверху крупная полоска «где я в уроке»; если ребёнок надолго замер над заданием, игра мягко напоминает про подсказку. Это игровая помощь в учёбе, а не лечение.</small></p></details></div>
    <div class="card"><h3>🎯 Что подтянуть</h3>
      <p>Темы, которые советуют учитель, врач или психолог. Игра добавит их в «Тренировку» и задания дня.</p>
      ${[['math', 'Математика'], ['ru', 'Русский язык'], ['eng', 'Английский'], ['ow', 'Окружающий мир'], ['izo', 'ИЗО']].map(([k, n]) => `<p>${n}: <input type="text" data-wi="${k}" maxlength="120" placeholder="например: ${k === 'math' ? 'умножение, задачи на время' : k === 'ru' ? 'безударные гласные, словарные слова' : k === 'eng' ? 'цвета, числа, to be' : k === 'ow' ? 'времена года, части растения' : 'цветовой круг'}" value="${esc(((S.wish || []).find(x => x.subj === k) || {}).text || '')}"></p>`).join('')}<p id="wim" class="pmsg">&nbsp;</p></div>
    <div class="card"><h3>📅 «Мой день»</h3>
      <p>Утренний и вечерний план в картинках: ребёнок отмечает сделанное, за весь план — 5 💎.</p>
      <button class="btn small ${S.plan && S.plan.on ? 'red' : 'gold'}" id="pln">${S.plan && S.plan.on ? '📅 «Мой день»: ВКЛ (нажмите, чтобы выключить)' : 'Включить «Мой день»'}</button>
      <details ${S.plan && S.plan.on ? 'open' : ''}><summary>Пункты плана</summary>
      ${['morning', 'evening'].map(pt => `<h4>${pt === 'morning' ? '🌅 Утро' : '🌙 Вечер'}</h4>${PLAN_DEF[pt].map(x => `<label class="subjopt"><input type="checkbox" data-ph="${x[0]}" ${!((S.plan || {}).hide || {})[x[0]] ? 'checked' : ''}> ${x[1]} ${x[2]}</label>`).join('')}${((S.plan || {}).own || []).filter(o => o.part === pt).map(o => `<label class="subjopt">${o.e || '✅'} ${esc(o.t)} <button class="btn small sec" data-pdel="${o.id}">✖</button></label>`).join('')}`).join('')}
      <p>Добавить пункт: <select id="pnp" style="${sel}"><option value="morning">Утро</option><option value="evening">Вечер</option></select> <input type="text" id="pne" maxlength="2" style="width:3em" placeholder="🙂"> <input type="text" id="pnt" maxlength="40" placeholder="Что сделать"> <button class="btn small gold" id="pna">Добавить</button></p></details></div>
    <div class="card"><h3>🎁 Семейные призы</h3>
      <p>Договоритесь о награде в жизни за награды в игре (например, «поход в кино»). Ребёнок увидит их на экране «Награды».</p>
      ${(S.prizes || []).map((p, k) => `<p>За <b>${p.need}</b> наград: <input type="text" data-pz="${k}" maxlength="50" placeholder="Например: мороженое" value="${esc(p.text || '')}"></p>`).join('')}</div>
    <div class="card"><h3>🎓 Уровень и порядок уроков</h3>
      <button class="btn small ${S.strict ? 'red' : ''}" id="strict">${S.strict ? '🔒 Строгий режим: ВКЛ (без подсказок и щита)' : 'Строгий режим: выкл'}</button>
      <button class="btn small gold" id="ua">${S.unlockAll ? 'Закрыть уроки по порядку' : 'Открыть все уроки'}</button>
      <button class="btn small" id="dgp">🔎 Разведка (определить уровень в английском)</button></div>`;
  // --- успехи ---
  const wk = weakItems();
  const weak = wk.words.slice(0, 12).map(id => `<tr><td>${WORDS[id].e} ${WORDS[id].en}</td><td>${WORDS[id].ru}</td><td>ошибок: ${S.words[id].miss}</td></tr>`).join('')
    + wk.gaps.slice(0, 8).map(k => `<tr><td colspan="2">${GAPIDX[k].en.replace('___', '<b>' + GAPIDX[k].ans + '</b>')}</td><td>ошибок: ${S.gr[k].miss}</td></tr>`).join('');
  const prog = Object.keys(SUBJ_META).map(k => {
    const ws = SUBJ_META[k][2](), [d, n] = subjProgress(k);
    const rows = ws.map(wd => `<tr><th colspan="2">${wd.name}</th></tr>` + wd.lessons.map((l, i) => { const r = S.lessons[l.id] || {}; return `<tr><td>${i + 1}. ${l.icon} ${l.title}${l.bonus ? ' <small>(бонус)</small>' : ''}</td><td>${r.done ? '⭐'.repeat(r.stars) : '—'}</td></tr>`; }).join('')).join('');
    return `<details class="pdet"><summary>${SUBJ_META[k][0]} ${SUBJ_META[k][1]} — пройдено ${d} из ${n}${subjOn(k) ? '' : ' <small>(скрыт)</small>'}</summary><table>${rows}</table></details>`;
  }).join('');
  sec.stats = `<div class="card"><h3>📊 Недели: время и точность</h3>${weekHtml()}</div>
    <div class="card"><h3>📈 Когда занимается лучше всего</h3>${concHtml()}</div>
    <div class="card"><h3>💪 Слабые места (${LN().adj}: слова и правила)</h3>${weak ? `<table>${weak}</table><p><small>Уходят после 3 верных ответов подряд. Повторите их без экрана: покажите предмет и попросите назвать.</small></p>` : '<p>Пока нет данных — всё идёт хорошо!</p>'}</div>
    <div class="card"><h3>🧮 Темы математики, русского и других предметов</h3>${mathTopicsHtml()}</div>
    <div class="card"><h3>🗺️ Прогресс по предметам</h3><p><small>Нажмите на предмет, чтобы раскрыть список уроков.</small></p>${prog}</div>`;
  // --- время и пароль ---
  sec.time = `${restCardHtml()}<div class="card"><h3>⏰ Таймер игры</h3>
      <p>Ограничивает время в день на этом устройстве. Когда время выйдет, ребёнок доделает текущее упражнение, а при выходе из него программа закроется и откроется только по вашему паролю.</p>
      <button class="btn small ${TM.on ? 'red' : 'gold'}" id="tmon">${TM.on ? '⏰ Таймер: ВКЛ (нажмите, чтобы выключить)' : 'Включить таймер'}</button>
      <p>Времени в день: <select id="tmmin" style="${sel}">${[10, 15, 20, 30, 45, 60, 90, 120].map(n => `<option value="${n}" ${TM.min === n ? 'selected' : ''}>${n} мин</option>`).join('')}</select></p>
      <p>Сегодня использовано: <b>${Math.round(TM.used / 60)}</b> мин из ${TM.min + (TM.extra || 0)}. <button class="btn small sec" id="tmrs">Обнулить сегодня</button></p>
      <p><small>Считается только время, пока ребёнок что-то нажимает. Таймер общий для всех игроков на этом устройстве; на другом устройстве его нужно включить отдельно.</small></p></div>
    <div class="card"><h3>🔑 Пароль родителей</h3><p>Сейчас: ${/^\d{4}$/.test(getPin()) ? 'PIN-код из 4 цифр' : 'пароль'}. Можно задать любой свой — от 4 до 20 знаков.</p>
      <button class="btn small" id="chpin">Сменить пароль</button></div>`;
  // --- связь ---
  sec.link = `<div class="card"><h3>☁️ Синхронизация между устройствами</h3>
      <p>${cloudOn() ? 'Включена. Семейный код: <b>' + esc(CL.code) + '</b>. ' + esc(cloudStatus()) : 'Не включена: прогресс хранится только на этом устройстве.'}</p>
      <button class="btn small gold" id="clp">Настроить / войти по коду</button></div>
    <div class="card"><h3>📓 Связь с дневником</h3>${diaryLinkHtml()}</div>
    <div class="card"><h3>📷 Фото учебников</h3>${booksHtml()}</div>`;
  // --- настройки ---
  const vOpts = langVoices(), vNow = pickVoice();
  const vSel = vOpts.length ? `<p>Голос (${LN().adj}): <select id="vsel" style="${sel};max-width:100%"><option value="">Автоматически${vNow && !voiceWish() ? ' — ' + esc(vNow.name) : ''}</option>${vOpts.map(v => `<option value="${esc(v.name)}" ${voiceWish() === v.name ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></p>
      <p><small>Голос берётся из самого планшета, поэтому на разных устройствах он разный. Выберите тот, что звучит естественнее, и нажмите «Проверить озвучку». Для английского лучше британский (en-GB) — как в учебнике Spotlight. Выбор запоминается на этом устройстве.</small></p>` : '';
  sec.set = `<div class="card"><h3>📲 Приложение и работа без интернета</h3><p id="offst">Проверяю…</p><p id="offper"></p><div id="offinst"></div>
      <details><summary>Как это работает</summary><ul class="offl">
        <li>При первом запуске с интернетом игра и дневник сохраняются на устройство. Дальше они открываются и без интернета.</li>
        <li>Прогресс всегда хранится на самом устройстве — интернет для него не нужен.</li>
        <li>Без интернета не работают облако (всё отправится само, когда интернет появится), озвучка через интернет и обновления игры.</li>
        <li>Когда интернет есть, игра при запуске сама берёт новую версию. Если приложение долго не закрывали — нажмите «Проверить обновление».</li></ul></details>
      <p><button class="btn small sec" id="offupd">🔄 Проверить обновление</button></p></div>
    <div class="card"><h3>🔊 Озвучка</h3>${vSel}
      <button class="btn small" id="vc">🔊 Проверить озвучку</button>
      <p>Скорость речи робота: <select id="rt" style="${sel}">${[[0.6, 'Медленно'], [0.7, 'Чуть медленнее'], [0.8, 'Обычно'], [0.95, 'Быстро']].map(o => `<option value="${o[0]}" ${(S.rate || 0.8) === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></p>
      <button class="btn small ${S.ttsAuto !== false ? 'gold' : 'sec'}" id="otts">${S.ttsAuto !== false ? '🌐 Если нет голоса — озвучка через интернет: ВКЛ' : 'Если нет голоса — озвучка через интернет: выкл'}</button>
      <p><small>Если на планшете нет голоса для ${LN().gen}, слова читал бы русский голос — и звучали бы неправильно (max — «мах»). Тогда игра сама берёт британский голос Google через интернет. Без интернета — встроенный голос.${noLangVoice() ? ' <b>Сейчас на этом устройстве голоса нет — слова читаются через интернет.</b>' : ''}</small></p><p id="vm"></p></div>
    <div class="card"><h3>🐾 Питомец на занятиях</h3><button class="btn small ${S.petBuddy !== false ? 'gold' : 'sec'}" id="pbud">${S.petBuddy !== false ? '🐾 Питомец сидит рядом и подбадривает: ВКЛ' : 'Питомец рядом на занятиях: выкл'}</button>
      <p><small>Во время уроков питомец сидит в уголке и иногда говорит: хвалит за серию верных ответов, поддерживает после ошибки, напоминает не спешить. Ответов он не подсказывает. В «Спокойном фокусе» говорит реже и не прыгает.</small></p></div>
    <div class="card"><h3>💾 Копия прогресса</h3>
      <details><summary>Перенести прогресс вручную (без облака)</summary><p>Скопируйте текст и вставьте его на другом устройстве:</p><textarea id="ex">${esc(JSON.stringify(S))}</textarea><button class="btn small" id="im">Загрузить из текста</button></details></div>
    <div class="card"><h3>⚠️ Сброс</h3><button class="btn small red" id="rs">Сбросить весь прогресс игрока «${nm}»</button></div>`;

  app.innerHTML = `<div class="card ptop"><button class="btn small sec" id="bk">⬅ Карта</button><h2>🔒 Для родителей: ${nm}</h2>
      <div class="ptabs">${PARENT_TABS.map(([k, e, n]) => `<button class="ptab ${k === parentTab ? 'on' : ''}" data-tab="${k}">${e} ${n}</button>`).join('')}</div></div>${sec[parentTab]}`;
  window.scrollTo(0, 0);
  const on = (id, fn, ev = 'onclick') => { const e = $(id); if (e) e[ev] = fn; };
  app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => parent(b.dataset.tab));
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => parent(b.dataset.go));
  on('bk', map);
  on('rpt', weeklyReport);
  on('frp', familyReport);
  on('sch', () => { S.schoolChild = $('sch').value; save(); parent(); }, 'onchange');
  on('dpar', () => { try { sessionStorage.setItem('school-off:edit', String(Date.now())); } catch (e) {} location.href = 'school/index.html'; });
  on('strict', () => { S.strict = !S.strict; save(); parent(); });
  on('pbud', () => { S.petBuddy = S.petBuddy === false; if (S.petBuddy === false) budHide(); save(); parent(); });
  on('otts', () => { S.ttsAuto = S.ttsAuto === false; if (S.ttsAuto === false) S.onlineTts = false; save(); parent(); });
  on('offupd', () => {
    if (!navigator.onLine) { toast('Нет интернета — обновление проверим, когда он появится'); return; }
    toast('Проверяю обновление…'); save();
    const go = () => location.reload();
    if (!swOk()) return setTimeout(go, 400);
    Promise.race([navigator.serviceWorker.getRegistration().then(r => r && r.update()), new Promise(r => setTimeout(r, 5000))]).catch(() => {}).then(() => setTimeout(go, 400));
  });
  offCard();
  app.querySelectorAll('[data-so]').forEach(c => c.onchange = () => {
    S.off = S.off || {}; S.off[c.dataset.so] = !c.checked;
    if (!Object.keys(SUBJ_META).some(subjOn)) { S.off[c.dataset.so] = false; c.checked = true; $('som').textContent = 'Должен остаться хотя бы один предмет.'; return; }
    if (!subjOn(S.subj)) S.subj = Object.keys(SUBJ_META).find(subjOn);
    save(); $('som').textContent = 'Сохранено ✅';
  });
  on('pln', () => { S.plan = S.plan || {}; S.plan.on = !S.plan.on; save(); parent(); });
  app.querySelectorAll('[data-ph]').forEach(c => c.onchange = () => { S.plan = S.plan || {}; S.plan.hide = S.plan.hide || {}; S.plan.hide[c.dataset.ph] = !c.checked; save(); });
  app.querySelectorAll('[data-pdel]').forEach(b => b.onclick = () => { S.plan.own = (S.plan.own || []).filter(o => o.id !== b.dataset.pdel); save(); parent(); });
  on('pna', () => { const tx = $('pnt').value.replace(/[<>&"]/g, '').trim(); if (!tx) return; S.plan = S.plan || {}; S.plan.own = (S.plan.own || []).concat({ id: 'o' + Date.now().toString(36), part: $('pnp').value, e: $('pne').value.trim() || '✅', t: tx }); save(); parent(); });
  app.querySelectorAll('[data-wi]').forEach(i => i.oninput = () => { S.wish = (S.wish || []).filter(x => x.subj !== i.dataset.wi); if (i.value.trim()) S.wish.push({ subj: i.dataset.wi, text: i.value.trim() }); save(); if ($('wim')) $('wim').textContent = 'Сохранено ✅'; });
  on('focus', () => { S.focus = !S.focus; save(); applyTheme(); parent(); });
  restCardBind();
  on('tmon', () => { TM.on = !TM.on; tmRoll(); tmNoted = false; tmWarn = false; tmSave(); parent(); });
  on('tmmin', e => { TM.min = +e.target.value; tmNoted = false; tmWarn = false; tmSave(); parent(); }, 'onchange');
  on('tmrs', () => { TM.used = 0; TM.extra = 0; tmNoted = false; tmWarn = false; tmSave(); parent(); });
  on('chpin', () => {
    app.innerHTML = `<div class="card pinbox"><button class="btn small sec" id="bk">⬅ Назад</button><h2>🔑 Новый пароль</h2><div id="pbox"></div></div>`;
    $('bk').onclick = () => parent(); pinForm($('pbox'), () => { toast('Пароль сохранён ✅'); parent(); });
  });
  on('clp', () => cloudScreen(() => parent()));
  booksInit();
  on('rt', e => { S.rate = +e.target.value; save(); speak(LNOW === LANGINFO.it ? 'Ciao! Sono un robot.' : 'Hello! I am a robot.'); }, 'onchange');
  app.querySelectorAll('[data-pz]').forEach(i => i.oninput = () => { S.prizes[+i.dataset.pz].text = i.value; save(); });
  const vstat = () => {
    if (!$('vm')) return;
    let list = ''; try { list = speechSynthesis.getVoices().map(v => v.name + ' (' + v.lang + ')').join('; '); } catch (e) {}
    $('vm').innerHTML = hasEnVoice()
      ? '✅ Голос найден (' + LN().adj + '): ' + esc(enVoice ? enVoice.name : '') + '. Если звука нет — проверьте громкость.'
      : '❌ Голос для языка «' + LN().adj + '» не найден' + (list ? ' (есть только: ' + esc(list) + ')' : '') + '. Слова читаются русским голосом и звучат непонятно. Откройте игру в Google Chrome с интернетом или установите голос этого языка в настройках системы (Windows: Параметры → Время и язык → Язык → Добавить язык).';
  };
  vstat();
  const vTest = () => speak(LNOW === LANGINFO.it ? 'Ciao! Mi chiamo Marco. Ho un gatto.' : 'Hello! My name is Max. I have got a dog.');
  on('vc', () => { vTest(); vstat(); });
  on('vsel', e => { voiceWish(e.target.value); enVoice = null; pickVoice(); vTest(); vstat(); }, 'onchange');
  on('dgp', diagIntro);
  on('ua', () => { S.unlockAll = !S.unlockAll; save(); parent(); });
  on('rs', () => { if (confirm(`Удалить весь прогресс игрока «${S.name}»? Другие игроки не затронутся.`)) { S = defState(); save(); applyTheme(); welcome(); } });
  on('im', () => {
    try { S = Object.assign(defState(), JSON.parse($('ex').value)); save(); applyTheme(); toast('Прогресс загружен ✅'); map(); }
    catch (e) { toast('Не получилось прочитать текст ❌'); }
  });
}

/* ---------- награды и ачивки ---------- */
const allLessons = () => [].concat(...EN_PACK.WORLDS.concat(IT_PACK.WORLDS).map(w => w.lessons)); // достижения считаем по иностранным языкам (английский + итальянский)
const doneLessons = () => allLessons().filter(l => (S.lessons[l.id] || {}).done);
const cntDone = obj => Object.values(obj || {}).filter(x => x.done).length;
const A = (cat, id, i, t, d, goal, r, val) => ({ cat, id, i, t, d, goal, r, val });
// награды по остальным предметам: [ключ, первый урок, N уроков, много уроков, босс, отличник]
const SUBJ_ACH = {
  math: ['Первый пример', 'Счетовод', 'Математик', 'Гроза задач', 'Точный расчёт'],
  ru: ['Первое правило', 'Знаток букв', 'Знаток русского', 'Победитель Ошибок', 'Без единой ошибки'],
  ow: ['Юный натуралист', 'Исследователь', 'Знаток природы', 'Покоритель мира', 'Эрудит'],
  izo: ['Первый мазок', 'Художник', 'Мастер кисти', 'Победитель Серости', 'Зоркий глаз'],
  pdd: ['Пешеход', 'Знаток знаков', 'Безопасный герой', 'Хранитель дороги', 'Осторожный'],
  lit: ['Первая страница', 'Читатель', 'Книголюб', 'Хранитель сказок', 'Внимательный читатель'],
  logic: ['Первая загадка', 'Смекалистый', 'Логик', 'Шахматный боец', 'Стратег'],
  att: ['Внимательный', 'Зоркий', 'Сосредоточенный', 'Победитель Рассеянности', 'Мастер внимания']
};
const subjLessons = k => [].concat(...SUBJ_META[k][2]().map(w => w.lessons));
const subjDone = k => subjLessons(k).filter(l => (S.lessons[l.id] || {}).done);
const subjBoss = k => SUBJ_META[k][2]().filter(w => (S.lessons[w.boss.id] || {}).done).length;
const subjStarted = () => Object.keys(SUBJ_META).filter(k => subjDone(k).length).length;
const ACH_CATS = ['Старт', 'Уроки', 'Звёзды', 'Миры', 'Слова', 'Серия', 'Прогресс', 'Разнообразие', 'Питомец', 'Богатство', 'Все предметы'].concat(Object.keys(SUBJ_ACH).map(k => SUBJ_META[k][1]));
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
  A('Миры', 'b1', '👾', 'Победитель Забывака', 'Победи босса мира 1', 1, 15, () => ((S.lessons[EN_PACK.WORLDS[0].boss.id] || {}).done ? 1 : 0)),
  A('Миры', 'b2', '👹', 'Укротитель путаницы', 'Победи босса мира 2', 1, 20, () => ((S.lessons[EN_PACK.WORLDS[1].boss.id] || {}).done ? 1 : 0)),
  A('Миры', 'b3', '🧙', 'Победитель цитадели', 'Победи босса мира 3', 1, 25, () => ((S.lessons[EN_PACK.WORLDS[2].boss.id] || {}).done ? 1 : 0)),
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
  A('Питомец', 'p2', '🐥', 'Подросток', 'Вырасти питомца до стадии «Подросток»', 1, 5, () => (petStage() >= 2 ? 1 : 0)),
  A('Питомец', 'p3', '🦖', 'Взрослый друг', 'Вырасти питомца до стадии «Взрослый»', 1, 10, () => (petStage() >= 3 ? 1 : 0)),
  A('Питомец', 'p5', '🐲', 'Легенда', 'Вырасти питомца до стадии «Легенда»', 1, 30, () => (petStage() >= 5 ? 1 : 0)),
  A('Питомец', 'pets', '🐾', 'Зверинец', 'Купи нового питомца', 1, 10, () => S.owned.filter(k => k.startsWith('pet_')).length),
  A('Богатство', 'shop10', '🛍️', 'Модный остров', 'Купи 10 вещей в магазине', 10, 20, () => Math.max(0, S.owned.length - 1)),
  A('Богатство', 'shop25', '🛒', 'Магазин-мастер', 'Купи 25 вещей в магазине', 25, 40, () => Math.max(0, S.owned.length - 1)),
  A('Богатство', 'e100', '💎', 'Копилка', 'Накопи 100 изумрудов', 100, 10, () => S.maxEm || 0),
  A('Богатство', 'e300', '💰', 'Сокровищница', 'Накопи 300 изумрудов', 300, 20, () => S.maxEm || 0),
  A('Все предметы', 'multi3', '🌈', 'Разносторонний', 'Пройди уроки в 3 разных предметах', 3, 10, subjStarted),
  A('Все предметы', 'multi5', '🦉', 'Энциклопедист', 'Пройди уроки в 5 разных предметах', 5, 25, subjStarted),
  A('Все предметы', 'multiB', '🗡️', 'Охотник на боссов', 'Победи боссов в 3 разных предметах', 3, 30, () => Object.keys(SUBJ_META).filter(k => subjBoss(k)).length)
].concat(...Object.keys(SUBJ_ACH).map(k => {
  const [e, nm] = SUBJ_META[k], tl = SUBJ_ACH[k], c = nm, n = subjLessons(k).length;
  const g2 = Math.min(10, Math.ceil(n / 3)), g3 = Math.min(25, n - Math.max(3, Math.round(n * .15)));
  return [
    Object.assign(A(c, k + '_l1', e, tl[0], `Пройди первый урок: «${nm}»`, 1, 5, () => subjDone(k).length), { subj: k }),
    Object.assign(A(c, k + '_l2', '🥈', tl[1], `Пройди ${g2} уроков: «${nm}»`, g2, 10, () => subjDone(k).length), { subj: k }),
    Object.assign(A(c, k + '_l3', '🥇', tl[2], `Пройди ${g3} уроков: «${nm}»`, g3, 25, () => subjDone(k).length), { subj: k }),
    Object.assign(A(c, k + '_b', '👑', tl[3], `Победи босса: «${nm}»`, 1, 20, () => subjBoss(k)), { subj: k }),
    Object.assign(A(c, k + '_s3', '🎖️', tl[4], `Получи 3 звезды в ${Math.min(10, g2)} уроках: «${nm}»`, Math.min(10, g2), 15, () => subjDone(k).filter(l => S.lessons[l.id].stars === 3).length), { subj: k })
  ];
}));
const achList = () => ACH.filter(a => !a.subj || subjOn(a.subj)); // награды выключенных родителем предметов не показываем
const tierOf = a => (a.r >= 25 ? 'gold' : a.r >= 10 ? 'silver' : 'bronze');

function checkAch() {
  if (tmLocked || tmFree || (tmInLesson && $('msg'))) return; // не всплываем поверх задания, экрана родителей или замка — проверим при следующем заходе на карту
  S.maxEm = Math.max(S.maxEm || 0, S.emeralds);
  const got = [];
  achList().forEach(a => {
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
  if (tmGate()) return; tmInLesson = false;
  const vis = achList(), have = vis.filter(a => S.ach[a.id]).length;
  const secs = ACH_CATS.map(c => {
    const list = vis.filter(a => a.cat === c);
    if (!list.length) return '';
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
    <div class="card"><p>Получено наград: <b>${have}</b> из ${vis.length}</p><div class="bar"><i style="width:${Math.round(have / vis.length * 100)}%"></i></div>
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
        const re = new RegExp('(^|[^A-Za-zÀ-ÿ])' + WORDS[k].en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-zÀ-ÿ]|$)', 'i');
        if (re.test(s.en)) EXAMPLES[k] = s;
      });
    })));
  }
  return EXAMPLES[id];
}
const vf = { world: -1, weak: false, q: '' };

function vocab() {
  if (tmGate()) return; tmInLesson = false;
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
      <input type="text" id="vq" placeholder="🔎 Найти слово (${LN().adv} или по-русски)" value="${vf.q.replace(/"/g, '&quot;')}">
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
  ov.innerHTML = `<div class="card center wc"><div class="ve" style="font-size:5rem">${w.e}</div><div class="en">${w.en}</div>${trHtml(w.id)}<div class="ru">${w.ru}</div>
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
      <div class="flash" id="fl"><div class="ve" style="font-size:min(30vw,8rem)">${w.e}</div><p id="fh">Вспомни слово ${LN().adv} и скажи вслух. Потом нажми на карточку!</p></div>
      <div id="fb"></div></div>`;
    $('exit').onclick = vocab;
    $('fl').onclick = () => {
      if (flipped) { speak(w.en); return; }
      flipped = true; speak(w.en);
      $('fl').classList.add('flip');
      $('fl').innerHTML = `<div class="ve" style="font-size:3rem">${w.e}</div><div class="en">${w.en}</div>${trHtml(w.id)}<div class="ru">${w.ru}</div><small>нажми, чтобы послушать ещё раз</small>`;
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
  const subj = [['eng', '🇬🇧 Английский', EN_PACK.WORLDS], ['it', '🇮🇹 Итальянский', IT_PACK.WORLDS], ['math', '🧮 Математика', MWORLDS], ['ru', '📝 Русский', RWORLDS], ['ow', '🌍 Окр. мир', OWORLDS], ['izo', '🎨 ИЗО', IWORLDS], ['pdd', '🚦 ПДД и ОБЖ', PWORLDS], ['lit', '📖 Лит. чтение', LWORLDS], ['logic', '🧩 Логика', GWORLDS], ['att', '🎯 Внимание', AWORLDS]];
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
  $('bk').onclick = () => parent();
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
  $('bk').onclick = () => parent();
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
  if (tmGate()) return; tmInLesson = true;
  hardStop();
  if (audWorld < 0) audWorld = Math.min(widx(), WORLDS.length - 1);
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
      <div class="opts gapo long">${shuffle(it.opts).map(x => `<button class="opt gapb" data-v="${x.replace(/"/g, '&quot;')}"><span class="ot">${x}</span>${sentTrSmall(x)}</button>`).join('')}</div></div>`);
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
    ['Вопросы', cb => gapQuiz({ ctx, counted: true, title: 'Ответь по рассказу', items: a.qs, tr: true }, cb)],
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
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '<i class="soff">⭐</i>'}</span>`).join('')}</div>
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
  if (tmGate()) return; tmInLesson = true;
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
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '<i class="soff">⭐</i>'}</span>`).join('')}</div>
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
  if (tmGate()) return; tmInLesson = true;
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
    <div class="card"><p>Поговори с жителями ${LN().adv === 'по-итальянски' ? 'Италии' : 'острова'} ${LN().adv}! Выбирай подходящие ответы. Диалоги открываются, когда пройдена нужная тема.</p>${cards}</div>`;
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
        <div class="bub npc"><span class="av">${d.npc.e}</span><p>${t.en}${sentTrHtml(t.en)}${showRu ? `<small>${t.ru}</small>` : ''}</p><button class="btn small sec" id="sp">🔊</button></div></div>
        <p class="center"><button class="btn small sec" id="tr">${showRu ? 'Скрыть перевод' : '🇷🇺 Показать перевод'}</button></p>
        <div id="msg" class="msg center">Выбери ответ:</div>
        <div class="opts gapo long">${shuffle(t.opts).map(x => `<button class="opt gapb" data-v="${x.replace(/"/g, '&quot;')}"><span class="ot">${x}</span>${sentTrSmall(x)}</button>`).join('')}</div></div>`;
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
      <div class="stars">${[1, 2, 3].map(k => `<span style="animation-delay:${k * .25}s">${k <= stars ? '⭐' : '<i class="soff">⭐</i>'}</span>`).join('')}</div>
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
  if (tmGate()) return; tmInLesson = true;
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
      prompt = `<div class="bigemoji">${w.e}</div><p>Как это ${LN().adv}?</p>`;
      optHTML = q.opts.map(id => `<button class="opt see" data-v="${id}"><span class="ot">${WORDS[id].en}</span>${trSmall(id)}</button>`).join('');
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
const famLink = (/[#&]family=([A-Za-z0-9]{6,12})/.exec(location.hash) || [])[1] || '';
if (famLink) try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
applyTheme();
syncSoon(true); restPoll();
cloudAuto().then(ch => { if (ch && PR.list.length && !S.name) players(); });
if (famLink && !cloudOn() && cloudUrl()) cloudScreen(() => (PR.list.length ? players() : welcome()), famLink);
else if (PR.list.length > 1) players(); // на общем планшете сначала выбираем, кто занимается
else S.name ? map() : welcome();
})();
