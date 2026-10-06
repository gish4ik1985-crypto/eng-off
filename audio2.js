// Много рассказов для аудирования: 12 шаблонов-тем × 9–12 вариантов (108 рассказов).
// В каждом рассказе свои имена, звери, цвета, дни, числа и действия, поэтому рассказы не повторяются.
// Это данные для AUDIOS: {id, world, req, grp, icon, title, intro, text, qs, pick}.
(function () {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  // три варианта ответа: верный и два других из списка (детерминированно, со сдвигом k)
  const opts3 = (ans, pool, k) => {
    const rest = pool.filter(x => x !== ans), a = rest[k % rest.length], b = rest[(k + 3) % rest.length];
    return [ans, a, b === a ? rest[(k + 1) % rest.length] : b];
  };
  const alt3 = (fn, val, pool, k) => opts3(fn(val), pool.map(fn), k);

  const NM = [['Max', 'Макс', 'm'], ['Ann', 'Аня', 'f'], ['Tom', 'Том', 'm'], ['Kate', 'Катя', 'f'], ['Ben', 'Бен', 'm'], ['Lily', 'Лили', 'f'],
    ['Sam', 'Сэм', 'm'], ['Zoe', 'Зои', 'f'], ['Dan', 'Дэн', 'm'], ['Mia', 'Мия', 'f'], ['Jack', 'Джек', 'm'], ['Eva', 'Ева', 'f']].map(([en, ru, g]) => ({ en, ru, g }));
  const he = n => (n.g === 'm' ? 'He' : 'She'), heRu = n => (n.g === 'm' ? 'Он' : 'Она');
  // цвета: en, формы ж/м/ср/мн
  const CLR = [['red', 'красная', 'красный', 'красное', 'красные'], ['blue', 'синяя', 'синий', 'синее', 'синие'], ['green', 'зелёная', 'зелёный', 'зелёное', 'зелёные'],
    ['yellow', 'жёлтая', 'жёлтый', 'жёлтое', 'жёлтые'], ['orange', 'оранжевая', 'оранжевый', 'оранжевое', 'оранжевые'], ['pink', 'розовая', 'розовый', 'розовое', 'розовые'],
    ['black', 'чёрная', 'чёрный', 'чёрное', 'чёрные'], ['white', 'белая', 'белый', 'белое', 'белые']].map(a => ({ en: a[0], f: a[1], m: a[2], n: a[3], pl: a[4] }));
  const GI = { f: 'f', m: 'm', n: 'n', pl: 'pl' };
  const NUMW = { 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };
  const years = n => (n % 10 === 1 && n !== 11 ? 'год' : (n % 10 >= 2 && n % 10 <= 4 && (n < 10 || n > 20) ? 'года' : 'лет'));
  const DAYS = [['Monday', 'понедельник', 'был'], ['Tuesday', 'вторник', 'был'], ['Wednesday', 'среда', 'была'], ['Thursday', 'четверг', 'был'],
    ['Friday', 'пятница', 'была'], ['Saturday', 'суббота', 'была'], ['Sunday', 'воскресенье', 'было']].map(a => ({ en: a[0], ru: a[1], was: a[2] }));

  const out = [];
  const add = (o) => { out.push(o); };

  /* ======== МИР 1 ======== */
  const PETS = [
    { en: 'cat', ru: 'кошка', acc: 'кошку', gen: 'кошки', g: 'f', can: ['jump', 'run'], cant: ['fly', 'swim'] },
    { en: 'dog', ru: 'собака', acc: 'собаку', gen: 'собаки', g: 'f', can: ['run', 'jump', 'swim'], cant: ['fly', 'sing'] },
    { en: 'rabbit', ru: 'кролик', acc: 'кролика', gen: 'кролика', g: 'm', can: ['jump', 'run'], cant: ['fly', 'swim'] },
    { en: 'bird', ru: 'птица', acc: 'птицу', gen: 'птицы', g: 'f', can: ['fly', 'sing'], cant: ['swim'] },
    { en: 'mouse', ru: 'мышь', acc: 'мышь', gen: 'мыши', g: 'f', can: ['run', 'jump'], cant: ['fly', 'sing'] },
    { en: 'frog', ru: 'лягушка', acc: 'лягушку', gen: 'лягушки', g: 'f', can: ['jump', 'swim'], cant: ['fly', 'sing'] },
    { en: 'horse', ru: 'лошадь', acc: 'лошадь', gen: 'лошади', g: 'f', can: ['run', 'jump'], cant: ['fly', 'sing'] },
    { en: 'monkey', ru: 'обезьяна', acc: 'обезьяну', gen: 'обезьяны', g: 'f', can: ['jump', 'run', 'dance'], cant: ['fly', 'swim'] },
    { en: 'pig', ru: 'свинья', acc: 'свинью', gen: 'свиньи', g: 'f', can: ['run'], cant: ['fly', 'sing'] },
    { en: 'lion', ru: 'лев', acc: 'льва', gen: 'льва', g: 'm', can: ['run', 'jump'], cant: ['fly', 'sing'] },
    { en: 'zebra', ru: 'зебра', acc: 'зебру', gen: 'зебры', g: 'f', can: ['run'], cant: ['fly', 'swim'] },
    { en: 'fish', ru: 'рыба', acc: 'рыбу', gen: 'рыбы', g: 'f', can: ['swim'], cant: ['fly', 'run'] }
  ];
  const VB = { jump: 'прыгать', run: 'бегать', swim: 'плавать', fly: 'летать', sing: 'петь', dance: 'танцевать' };

  // A. Знакомства
  for (let i = 0; i < 9; i++) {
    const n = NM[i % 12], age = 6 + (i % 4), sib = i % 2 ? 'sister' : 'brother', sibRu = sib === 'sister' ? 'сестра' : 'брат', sibDat = sib === 'sister' ? 'Моей сестре' : 'Моему брату';
    const sa = [4, 5, 6, 10, 11, 12][(i * 2 + 1) % 6], pet = PETS[(i * 5 + 1) % PETS.length], col = CLR[(i * 3 + 1) % 8];
    const ageFn = a => `I am ${NUMW[a]}.`;
    add({
      id: 'gA' + i, world: 0, req: 8, grp: 'Знакомства', icon: '👋', title: `Знакомься: ${n.ru}`, intro: 'Новый друг рассказывает о себе. Запоминай имя, возраст и питомца!',
      text: [{ en: `Hello! My name is ${n.en}.`, ru: `Привет! Меня зовут ${n.ru}.` }, { en: ageFn(age), ru: `Мне ${age} ${years(age)}.` },
        { en: `I have a ${sib}.`, ru: `У меня есть ${sibRu}.` }, { en: `My ${sib} is ${NUMW[sa]}.`, ru: `${sibDat} ${sa} ${years(sa)}.` },
        { en: `I have a ${pet.en}.`, ru: `У меня есть ${pet.ru}.` }, { en: `The ${pet.en} is ${col.en}.`, ru: `${cap(pet.ru)} ${col[pet.g]}.` }],
      qs: [{ en: 'What is the name of the child?', ru: 'Как зовут ребёнка?', ans: n.en, opts: opts3(n.en, NM.map(x => x.en), i) },
        { en: 'How old is the child?', ru: 'Сколько ребёнку лет?', ans: cap(NUMW[age]), opts: opts3(cap(NUMW[age]), [6, 7, 8, 9, 10].map(x => cap(NUMW[x])), i) },
        { en: 'Has the child got a brother or a sister?', ru: 'Кто есть у ребёнка: брат или сестра?', ans: cap('a ' + sib), opts: opts3(cap('a ' + sib), ['A brother', 'A sister', 'A baby'], 0) },
        { en: `What colour is the ${pet.en}?`, ru: `Какого цвета ${pet.gen}?`, ans: cap(col.en), opts: opts3(cap(col.en), CLR.map(c => cap(c.en)), i) }],
      pick: [{ say: ageFn(age), opts: alt3(ageFn, age, [6, 7, 8, 9, 10], i) },
        { say: `I have a ${sib}.`, opts: [`I have a ${sib}.`, `I have a ${sib === 'sister' ? 'brother' : 'sister'}.`, 'I have a baby.'] },
        { say: `The ${pet.en} is ${col.en}.`, opts: alt3(c => `The ${pet.en} is ${c}.`, col.en, CLR.map(c => c.en), i) }]
    });
  }

  // B. Что я люблю
  const FOODS = [['pizza', 'пиццу'], ['cake', 'торт'], ['bread', 'хлеб'], ['milk', 'молоко'], ['juice', 'сок'], ['cheese', 'сыр'], ['chicken', 'курицу'], ['rice', 'рис'], ['soup', 'суп'], ['chocolate', 'шоколад']];
  const TOYS = [['robot', 'робот', 'm'], ['car', 'машина', 'f'], ['ball', 'мяч', 'm'], ['doll', 'кукла', 'f'], ['kite', 'воздушный змей', 'm'], ['teddy', 'плюшевый мишка', 'm'], ['train', 'поезд', 'm'], ['bike', 'велосипед', 'm']];
  for (let i = 0; i < 9; i++) {
    const n = NM[(i + 3) % 12], f1 = FOODS[i % 10], f2 = FOODS[(i + 4) % 10], toy = TOYS[(i * 3 + 2) % 8], col = CLR[(i * 5 + 2) % 8];
    const likeFn = f => `I like ${f}.`;
    add({
      id: 'gB' + i, world: 0, req: 12, grp: 'Что я люблю', icon: '🍕', title: `Что любит ${n.ru}`, intro: 'Друг рассказывает, что он любит есть и во что играет.',
      text: [{ en: `Hi! I am ${n.en}.`, ru: `Привет! Я ${n.ru}.` }, { en: likeFn(f1[0]), ru: `Я люблю ${f1[1]}.` }, { en: likeFn(f2[0]), ru: `Я люблю ${f2[1]}.` },
        { en: `I have a ${toy[0]}.`, ru: `У меня есть ${toy[1]}.` }, { en: `The ${toy[0]} is ${col.en}.`, ru: `${cap(toy[1])} ${col[toy[2]]}.` }],
      qs: [{ en: `What does ${n.en} like?`, ru: `Что любит ${n.ru}?`, ans: `${cap(f1[0])} and ${f2[0]}`, opts: opts3(`${cap(f1[0])} and ${f2[0]}`, FOODS.map((f, k) => `${cap(f[0])} and ${FOODS[(k + 3) % 10][0]}`), i) },
        { en: 'What toy has the child got?', ru: 'Какая игрушка есть у ребёнка?', ans: cap(toy[0]), opts: opts3(cap(toy[0]), TOYS.map(t => cap(t[0])), i) },
        { en: `What colour is the ${toy[0]}?`, ru: `Какого цвета ${toy[1]}?`, ans: cap(col.en), opts: opts3(cap(col.en), CLR.map(c => cap(c.en)), i + 1) }],
      pick: [{ say: likeFn(f1[0]), opts: alt3(likeFn, f1[0], FOODS.map(f => f[0]), i) },
        { say: `I have a ${toy[0]}.`, opts: alt3(t => `I have a ${t}.`, toy[0], TOYS.map(t => t[0]), i) },
        { say: `The ${toy[0]} is ${col.en}.`, opts: alt3(c => `The ${toy[0]} is ${c}.`, col.en, CLR.map(c => c.en), i + 2) }]
    });
  }

  // C. Одежда и цвета
  const CLO = [['hat', 'шляпа', 'f'], ['shirt', 'футболка', 'f'], ['dress', 'платье', 'n'], ['coat', 'пальто', 'n'], ['jeans', 'джинсы', 'pl'], ['socks', 'носки', 'pl'], ['shoes', 'ботинки', 'pl']];
  for (let i = 0; i < 9; i++) {
    const n = NM[(i + 6) % 12], cl = [0, 1, 2].map(k => CLO[(i + k * 2) % 7]), cc = [0, 1, 2].map(k => CLR[(i * 3 + k * 3 + 1) % 8]);
    const be = c => (c[2] === 'pl' ? 'are' : 'is');
    const lines = cl.map((c, k) => ({ en: `The ${c[0]} ${be(c)} ${cc[k].en}.`, ru: `${cap(c[1])} ${cc[k][GI[c[2]]]}.` }));
    add({
      id: 'gC' + i, world: 0, req: 13, grp: 'Одежда и цвета', icon: '👗', title: `Одежда: ${n.ru}`, intro: `Посмотри на одежду ${n.ru}. Запоминай цвета!`,
      text: [{ en: `This is ${n.en}.`, ru: `Это ${n.ru}.` }, ...lines, { en: 'It is a nice day.', ru: 'Сегодня хороший день.' }],
      qs: cl.map((c, k) => ({ en: `What colour is the ${c[0]}?`, ru: `Какого цвета ${c[1]}?`, ans: cap(cc[k].en), opts: opts3(cap(cc[k].en), CLR.map(x => cap(x.en)), i + k) })),
      pick: cl.map((c, k) => ({ say: lines[k].en, opts: alt3(x => `The ${c[0]} ${be(c)} ${x}.`, cc[k].en, CLR.map(x => x.en), i + k) }))
    });
  }

  // D. Звери и что они умеют
  for (let i = 0; i < 9; i++) {
    const p = PETS[(i * 7 + 2) % PETS.length], col = CLR[(i * 3 + 4) % 8], can = p.can[i % p.can.length], cant = p.cant[i % p.cant.length];
    const pr = p.g === 'm' ? 'Он' : 'Она', pe = 'It';
    add({
      id: 'gD' + i, world: 0, req: 10, grp: 'Звери', icon: '🦁', title: `Зверь: ${cap(p.ru)}`, intro: 'Ребёнок рассказывает о зверьке. Что он умеет, а что нет?',
      text: [{ en: `I see a ${p.en}.`, ru: `Я вижу ${p.acc}.` }, { en: `The ${p.en} is ${col.en}.`, ru: `${cap(p.ru)} ${col[p.g]}.` }, { en: `${pe} can ${can}.`, ru: `${pr} умеет ${VB[can]}.` },
        { en: `${pe} can't ${cant}.`, ru: `${pr} не умеет ${VB[cant]}.` }, { en: `I like the ${p.en}!`, ru: `Мне нравится ${p.ru}!` }],
      qs: [{ en: 'What does the child see?', ru: 'Кого видит ребёнок?', ans: cap(p.en), opts: opts3(cap(p.en), PETS.map(x => cap(x.en)), i) },
        { en: `What colour is the ${p.en}?`, ru: `Какого цвета ${p.gen}?`, ans: cap(col.en), opts: opts3(cap(col.en), CLR.map(c => cap(c.en)), i + 2) },
        { en: `What can the ${p.en} do?`, ru: `Что умеет делать ${p.ru}?`, ans: cap(can), opts: opts3(cap(can), Object.keys(VB).map(cap), i) },
        { en: `What can't the ${p.en} do?`, ru: `Что не умеет делать ${p.ru}?`, ans: cap(cant), opts: opts3(cap(cant), Object.keys(VB).map(cap), i + 1) }],
      pick: [{ say: `I see a ${p.en}.`, opts: alt3(x => `I see a ${x}.`, p.en, PETS.map(x => x.en), i) },
        { say: `${pe} can ${can}.`, opts: alt3(x => `It can ${x}.`, can, Object.keys(VB), i) },
        { say: `${pe} can't ${cant}.`, opts: alt3(x => `It can't ${x}.`, cant, Object.keys(VB), i + 1) }]
    });
  }

  /* ======== МИР 2 ======== */
  const SUBJ = [['English', 'английский', 'английский'], ['Maths', 'математика', 'математику'], ['Art', 'рисование', 'рисование'], ['Music', 'музыка', 'музыку'], ['PE', 'физкультура', 'физкультуру'], ['Science', 'природоведение', 'природоведение']];
  const ACT = [['play football', 'play football', 'играю в футбол', 'plays football'], ['draw', 'draw', 'рисую', 'draws'], ['watch TV', 'watch TV', 'смотрю телевизор', 'watches TV'],
    ['play the guitar', 'play the guitar', 'играю на гитаре', 'plays the guitar'], ['read a book', 'read a book', 'читаю книгу', 'reads a book'], ['ride my bike', 'ride my bike', 'катаюсь на велосипеде', 'rides a bike'],
    ['play with my cat', 'play with my cat', 'играю с кошкой', 'plays with a cat'], ['listen to music', 'listen to music', 'слушаю музыку', 'listens to music'], ['do my homework', 'do my homework', 'делаю уроки', 'does homework']];
  // E. Школьный день
  for (let i = 0; i < 12; i++) {
    const d = DAYS[i % 5], s1 = SUBJ[i % 6], s2 = SUBJ[(i + 2) % 6], a = ACT[(i * 2 + 1) % 9];
    add({
      id: 'gE' + i, world: 1, req: 21, grp: 'Школьный день', icon: '🏫', title: `Школьный день №${i + 1}`, intro: 'Ребёнок рассказывает о школьном дне. Какие уроки? Что он делает после школы?',
      text: [{ en: `Today is ${d.en}.`, ru: `Сегодня ${d.ru}.` }, { en: 'I go to school.', ru: 'Я иду в школу.' }, { en: `I have ${s1[0]} and ${s2[0]}.`, ru: `У меня ${s1[1]} и ${s2[1]}.` },
        { en: `I like ${s2[0]}.`, ru: `Я люблю ${s2[2]}.` }, { en: `After school I ${a[0]}.`, ru: `После школы я ${a[2]}.` }],
      qs: [{ en: 'What day is it?', ru: 'Какой сегодня день?', ans: d.en, opts: opts3(d.en, DAYS.map(x => x.en), i) },
        { en: 'What lessons does the child have?', ru: 'Какие уроки у ребёнка?', ans: `${s1[0]} and ${s2[0]}`, opts: opts3(`${s1[0]} and ${s2[0]}`, SUBJ.map((s, k) => `${s[0]} and ${SUBJ[(k + 2) % 6][0]}`), i) },
        { en: 'Which lesson does the child like?', ru: 'Какой урок любит ребёнок?', ans: s2[0], opts: opts3(s2[0], SUBJ.map(s => s[0]), i) },
        { en: 'What does the child do after school?', ru: 'Что ребёнок делает после школы?', ans: cap(a[3]), opts: opts3(cap(a[3]), ACT.map(x => cap(x[3])), i) }],
      pick: [{ say: `Today is ${d.en}.`, opts: alt3(x => `Today is ${x}.`, d.en, DAYS.map(x => x.en), i) },
        { say: `I like ${s2[0]}.`, opts: alt3(x => `I like ${x}.`, s2[0], SUBJ.map(s => s[0]), i) },
        { say: `After school I ${a[0]}.`, opts: alt3(x => `After school I ${x}.`, a[0], ACT.map(x => x[0]), i) }]
    });
  }

  // F. Мой дом
  const ROOMS = { kitchen: ['на кухне', ['chair', 'lamp'], { chair: 'стул', lamp: 'лампа' }], bedroom: ['в спальне', ['bed', 'lamp', 'mirror', 'TV'], { bed: 'кровать', lamp: 'лампа', mirror: 'зеркало', TV: 'телевизор' }],
    bathroom: ['в ванной', ['mirror', 'lamp'], { mirror: 'зеркало', lamp: 'лампа' }], garden: ['в саду', ['chair'], { chair: 'стул' }] };
  const RN = Object.keys(ROOMS), FAM = [['Mum', 'Мама'], ['Dad', 'Папа'], ['Grandma', 'Бабушка'], ['Grandpa', 'Дедушка']];
  for (let i = 0; i < 12; i++) {
    const big = i % 2 === 0, fa = FAM[i % 4], fb = FAM[(i + 2) % 4];
    const r1 = RN[i % 4], r2 = RN[(i + 1) % 4];
    const room3 = i % 3 === 0 ? 'bedroom' : i % 3 === 1 ? 'kitchen' : 'bathroom', fur = ROOMS[room3][1][i % ROOMS[room3][1].length];
    const whereFn = (f, r) => `${f[0]} is in the ${r}.`;
    add({
      id: 'gF' + i, world: 1, req: 24, grp: 'Мой дом', icon: '🏠', title: `Мой дом №${i + 1}`, intro: 'Ребёнок показывает свой дом. Кто где находится?',
      text: [{ en: 'This is my house.', ru: 'Это мой дом.' }, { en: big ? 'It is big.' : 'It is small.', ru: big ? 'Он большой.' : 'Он маленький.' }, { en: whereFn(fa, r1), ru: `${fa[1]} ${ROOMS[r1][0]}.` },
        { en: whereFn(fb, r2), ru: `${fb[1]} ${ROOMS[r2][0]}.` }, { en: `There is a ${fur} in the ${room3}.`, ru: `${cap(ROOMS[room3][0])} есть ${ROOMS[room3][2][fur]}.` }],
      qs: [{ en: 'Is the house big or small?', ru: 'Дом большой или маленький?', ans: big ? 'Big' : 'Small', opts: [big ? 'Big' : 'Small', big ? 'Small' : 'Big', 'Very small'] },
        { en: `Where is ${fa[0]}?`, ru: `Где ${fa[1] === 'Мама' ? 'мама' : fa[1] === 'Папа' ? 'папа' : fa[1] === 'Бабушка' ? 'бабушка' : 'дедушка'}?`, ans: `In the ${r1}`, opts: opts3(`In the ${r1}`, RN.map(r => `In the ${r}`), i) },
        { en: `Where is ${fb[0]}?`, ru: `Где ${fb[1] === 'Мама' ? 'мама' : fb[1] === 'Папа' ? 'папа' : fb[1] === 'Бабушка' ? 'бабушка' : 'дедушка'}?`, ans: `In the ${r2}`, opts: opts3(`In the ${r2}`, RN.map(r => `In the ${r}`), i + 1) },
        { en: `What is in the ${room3}?`, ru: `Что есть ${ROOMS[room3][0]}?`, ans: `A ${fur}`, opts: opts3(`A ${fur}`, ['A bed', 'A lamp', 'A mirror', 'A TV', 'A chair'], i) }],
      pick: [{ say: whereFn(fa, r1), opts: alt3(r => whereFn(fa, r), r1, RN, i) },
        { say: whereFn(fb, r2), opts: alt3(r => whereFn(fb, r), r2, RN, i + 1) },
        { say: `There is a ${fur} in the ${room3}.`, opts: alt3(f => `There is a ${f} in the ${room3}.`, fur, ['bed', 'lamp', 'mirror', 'TV', 'chair'], i) }]
    });
  }

  // G. Времена года
  const SEAS = [
    { en: 'winter', loc: 'Зимой', acc: 'зиму', w: [['snowy', 'снежно'], ['cold', 'холодно']], h: [['play in the snow', 'играю в снегу', 'plays in the snow'], ['drink hot tea', 'пью горячий чай', 'drinks hot tea']] },
    { en: 'spring', loc: 'Весной', acc: 'весну', w: [['rainy', 'дождливо'], ['windy', 'ветрено'], ['warm', 'тепло']], h: [['draw flowers', 'рисую цветы', 'draws flowers'], ['ride my bike', 'катаюсь на велосипеде', 'rides a bike']] },
    { en: 'summer', loc: 'Летом', acc: 'лето', w: [['sunny', 'солнечно'], ['hot', 'жарко'], ['warm', 'тепло']], h: [['swim in the sea', 'плаваю в море', 'swims in the sea'], ['play football', 'играю в футбол', 'plays football'], ['eat ice cream', 'ем мороженое', 'eats ice cream']] },
    { en: 'autumn', loc: 'Осенью', acc: 'осень', w: [['rainy', 'дождливо'], ['windy', 'ветрено'], ['cold', 'холодно']], h: [['collect leaves', 'собираю листья', 'collects leaves'], ['read a book', 'читаю книгу', 'reads a book']] }
  ];
  for (let i = 0; i < 12; i++) {
    const n = NM[i % 12], s = SEAS[i % 4], w1 = s.w[i % s.w.length], w2 = s.w[(i + 1) % s.w.length], hb = s.h[Math.floor(i / 4) % s.h.length];
    const ww = w1[0] === w2[0] ? s.w[(i + 2) % s.w.length] : w2;
    add({
      id: 'gG' + i, world: 1, req: 34, grp: 'Времена года', icon: '🍂', title: `${{ winter: 'Зима', spring: 'Весна', summer: 'Лето', autumn: 'Осень' }[s.en]} глазами ${n.ru}`, intro: 'Ребёнок рассказывает о своём любимом времени года.',
      text: [{ en: `My name is ${n.en}.`, ru: `Меня зовут ${n.ru}.` }, { en: `In ${s.en} it is ${w1[0]} and ${ww[0]}.`, ru: `${s.loc} ${w1[1]} и ${ww[1]}.` }, { en: `I like ${s.en}.`, ru: `Я люблю ${s.acc}.` },
        { en: `In ${s.en} I ${hb[0]}.`, ru: `${s.loc} я ${hb[1]}.` }],
      qs: [{ en: 'Which season does the child like?', ru: 'Какое время года любит ребёнок?', ans: cap(s.en), opts: opts3(cap(s.en), SEAS.map(x => cap(x.en)), i) },
        { en: 'What is the weather like?', ru: 'Какая там погода?', ans: `${cap(w1[0])} and ${ww[0]}`, opts: opts3(`${cap(w1[0])} and ${ww[0]}`, ['Snowy and cold', 'Rainy and windy', 'Sunny and hot', 'Warm and sunny', 'Windy and cold'], i) },
        { en: 'What does the child do?', ru: 'Что делает ребёнок?', ans: cap(hb[2]), opts: opts3(cap(hb[2]), SEAS.flatMap(x => x.h.map(y => cap(y[2]))), i) }],
      pick: [{ say: `I like ${s.en}.`, opts: alt3(x => `I like ${x}.`, s.en, SEAS.map(x => x.en), i) },
        { say: `In ${s.en} it is ${w1[0]} and ${ww[0]}.`, opts: [`In ${s.en} it is ${w1[0]} and ${ww[0]}.`, `In ${SEAS[(i + 1) % 4].en} it is ${w1[0]} and ${ww[0]}.`, `In ${s.en} it is ${w1[0]}.`] },
        { say: `In ${s.en} I ${hb[0]}.`, opts: alt3(x => `In ${s.en} I ${x}.`, hb[0], SEAS.flatMap(x => x.h.map(y => y[0])), i) }]
    });
  }

  /* ======== МИР 3 ======== */
  // H. Вчера
  const PAST = [['went to the zoo', 'ходил в зоопарк', 'ходила в зоопарк'], ['ate a big pizza', 'съел большую пиццу', 'съела большую пиццу'], ['played football', 'играл в футбол', 'играла в футбол'],
    ['watched TV', 'смотрел телевизор', 'смотрела телевизор'], ['visited my grandma', 'навестил бабушку', 'навестила бабушку'], ['saw a film', 'посмотрел фильм', 'посмотрела фильм'],
    ['bought a book', 'купил книгу', 'купила книгу'], ['listened to music', 'слушал музыку', 'слушала музыку'], ['cooked a cake', 'приготовил торт', 'приготовила торт'],
    ['had a party', 'устроил вечеринку', 'устроила вечеринку'], ['read a book', 'читал книгу', 'читала книгу'], ['drew a picture', 'нарисовал картину', 'нарисовала картину']];
  const prRu = (a, n) => (n.g === 'm' ? a[1] : a[2]);
  for (let i = 0; i < 9; i++) {
    const n = NM[i % 12], d = DAYS[(i * 2 + 5) % 7], a1 = PAST[i % 12], a2 = PAST[(i + 4) % 12], a3 = PAST[(i + 8) % 12];
    const A = [a1, a2, a3], times = [['morning', 'Утром'], ['afternoon', 'Днём'], ['evening', 'Вечером']];
    const done = A.map(x => cap(x[0]));
    add({
      id: 'gH' + i, world: 2, req: 48, grp: 'Вчера', icon: '📅', title: `Вчера: ${n.ru}`, intro: `${n.ru} рассказывает, как провёл вчерашний день.`,
      text: [{ en: `My name is ${n.en}.`, ru: `Меня зовут ${n.ru}.` }, { en: `Yesterday was ${d.en}.`, ru: `Вчера ${d.was} ${d.ru}.` },
        ...A.map((x, k) => ({ en: `In the ${times[k][0]} I ${x[0]}.`, ru: `${times[k][1]} я ${prRu(x, n)}.` }))],
      qs: [{ en: 'What day was yesterday?', ru: 'Какой день был вчера?', ans: d.en, opts: opts3(d.en, DAYS.map(x => x.en), i) },
        ...A.map((x, k) => ({ en: `What did ${n.en} do in the ${times[k][0]}?`, ru: `Что делал${n.g === 'f' ? 'а' : ''} ${n.ru} ${['утром', 'днём', 'вечером'][k]}?`, ans: cap(x[0]), opts: opts3(cap(x[0]), PAST.map(y => cap(y[0])), i + k) }))],
      pick: A.map((x, k) => ({ say: `In the ${times[k][0]} I ${x[0]}.`, opts: alt3(y => `In the ${times[k][0]} I ${y}.`, x[0], PAST.map(y => y[0]), i + k) }))
    });
  }

  // I. Что происходит сейчас
  const ING = [['reading a book', 'читает книгу'], ['playing football', 'играет в футбол'], ['watching TV', 'смотрит телевизор'], ['drawing a picture', 'рисует картину'], ['cooking dinner', 'готовит ужин'],
    ['listening to music', 'слушает музыку'], ['swimming in the sea', 'плавает в море'], ['riding a bike', 'едет на велосипеде'], ['writing a letter', 'пишет письмо'], ['making a cake', 'печёт торт']];
  for (let i = 0; i < 9; i++) {
    const ns = [NM[i % 12], NM[(i + 4) % 12], NM[(i + 8) % 12]], as = [ING[i % 10], ING[(i * 3 + 1) % 10], ING[(i * 3 + 5) % 10]];
    const lines = ns.map((n, k) => ({ en: `${n.en} is ${as[k][0]}.`, ru: `${n.ru} ${as[k][1]}.` }));
    add({
      id: 'gI' + i, world: 2, req: 44, grp: 'Что происходит сейчас', icon: '🏞️', title: `В парке №${i + 1}`, intro: 'В парке гуляют друзья. Кто чем сейчас занят?',
      text: [{ en: 'It is a sunny day in the park.', ru: 'В парке солнечный день.' }, ...lines, { en: 'They are all happy.', ru: 'Все они счастливы.' }],
      qs: ns.map((n, k) => ({ en: `What is ${n.en} doing?`, ru: `Что делает ${n.ru}?`, ans: cap(as[k][0]), opts: opts3(cap(as[k][0]), ING.map(x => cap(x[0])), i + k) })),
      pick: ns.map((n, k) => ({ say: lines[k].en, opts: alt3(x => `${n.en} is ${x}.`, as[k][0], ING.map(x => x[0]), i + k) }))
    });
  }

  // J. Путешествие
  const CTRY = [['Italy', 'в Италию'], ['Spain', 'в Испанию'], ['Greece', 'в Грецию'], ['Japan', 'в Японию'], ['Egypt', 'в Египет'], ['France', 'во Францию'], ['China', 'в Китай'], ['Germany', 'в Германию'], ['Turkey', 'в Турцию'], ['America', 'в Америку']];
  const TRN = [['plane', 'на самолёте'], ['ship', 'на корабле'], ['train', 'на поезде'], ['bus', 'на автобусе']];
  const TACT = [['swim in the sea', 'плавать в море'], ['visit museums', 'посещать музеи'], ['take photos', 'фотографировать'], ['ride a bike', 'кататься на велосипеде'], ['eat local food', 'пробовать местную еду'], ['play volleyball', 'играть в волейбол']];
  const WTH = [['hot and sunny', 'жарко и солнечно'], ['warm and nice', 'тепло и приятно'], ['cold and snowy', 'холодно и снежно'], ['windy and cool', 'ветрено и прохладно']];
  for (let i = 0; i < 9; i++) {
    const n = NM[(i * 5 + 1) % 12], c = CTRY[i % 10], t = TRN[i % 4], a = TACT[(i * 2) % 6], w = WTH[i % 4];
    add({
      id: 'gJ' + i, world: 2, req: 83, grp: 'Путешествие', icon: '✈️', title: `Поездка ${c[1]}`, intro: `${n.ru} планирует поездку. Куда, на чём и что будет делать?`,
      text: [{ en: `${n.en} is going to go to ${c[0]}.`, ru: `${n.ru} собирается поехать ${c[1]}.` }, { en: `${he(n)} is going to go by ${t[0]}.`, ru: `${heRu(n)} поедет ${t[1]}.` },
        { en: `${he(n)} is going to ${a[0]}.`, ru: `${heRu(n)} собирается ${a[1]}.` }, { en: `It will be ${w[0]}.`, ru: `Будет ${w[1]}.` }],
      qs: [{ en: `Where is ${n.en} going to go?`, ru: `Куда поедет ${n.ru}?`, ans: c[0], opts: opts3(c[0], CTRY.map(x => x[0]), i) },
        { en: `How is ${n.g === 'm' ? 'he' : 'she'} going to travel?`, ru: 'На чём поедет?', ans: `By ${t[0]}`, opts: opts3(`By ${t[0]}`, TRN.map(x => `By ${x[0]}`).concat(['By car']), i) },
        { en: `What is ${n.g === 'm' ? 'he' : 'she'} going to do there?`, ru: 'Что собирается делать?', ans: cap(a[0]), opts: opts3(cap(a[0]), TACT.map(x => cap(x[0])), i) },
        { en: 'What will the weather be?', ru: 'Какой будет погода?', ans: cap(w[0]), opts: opts3(cap(w[0]), WTH.map(x => cap(x[0])), i) }],
      pick: [{ say: `${n.en} is going to go to ${c[0]}.`, opts: alt3(x => `${n.en} is going to go to ${x}.`, c[0], CTRY.map(x => x[0]), i) },
        { say: `${he(n)} is going to go by ${t[0]}.`, opts: alt3(x => `${he(n)} is going to go by ${x}.`, t[0], TRN.map(x => x[0]), i) },
        { say: `${he(n)} is going to ${a[0]}.`, opts: alt3(x => `${he(n)} is going to ${x}.`, a[0], TACT.map(x => x[0]), i) }]
    });
  }

  // K. Сравнения
  const CMP = [['An elephant', 'Слон', 'a mouse', 'мыши', 'bigger', 'больше', 'smaller'], ['A giraffe', 'Жираф', 'a dog', 'собаки', 'taller', 'выше', 'shorter'],
    ['A rocket', 'Ракета', 'a bus', 'автобуса', 'faster', 'быстрее', 'slower'], ['A whale', 'Кит', 'a shark', 'акулы', 'bigger', 'больше', 'smaller'],
    ['Summer', 'Лето', 'winter', 'зимы', 'warmer', 'теплее', 'colder'], ['A lion', 'Лев', 'a cat', 'кошки', 'stronger', 'сильнее', 'weaker'],
    ['A plane', 'Самолёт', 'a bike', 'велосипеда', 'faster', 'быстрее', 'slower'], ['A mountain', 'Гора', 'a house', 'дома', 'higher', 'выше', 'lower'],
    ['A hare', 'Заяц', 'a tortoise', 'черепахи', 'faster', 'быстрее', 'slower'], ['A snake', 'Змея', 'a mouse', 'мыши', 'longer', 'длиннее', 'shorter'],
    ['A tiger', 'Тигр', 'a rabbit', 'кролика', 'faster', 'быстрее', 'slower'], ['A ship', 'Корабль', 'a car', 'машины', 'bigger', 'больше', 'smaller']];
  const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
  const BN = ['мышь', 'собака', 'автобус', 'акула', 'зима', 'кошка', 'велосипед', 'дом', 'черепаха', 'мышь', 'кролик', 'машина']; // второй предмет в именительном падеже
  for (let i = 0; i < 9; i++) {
    const ix = [0, 1, 2].map(k => (i * 4 + k * 5) % 12), es = ix.map(j => CMP[j]);
    const lines = es.map(e => ({ en: `${e[0]} is ${e[4]} than ${e[2]}.`, ru: `${e[1]} ${e[5]} ${e[3]}.` }));
    add({
      id: 'gK' + i, world: 2, req: 52, grp: 'Сравнения', icon: '⚖️', title: `Что больше, что быстрее №${i + 1}`, intro: 'Кто больше, быстрее или выше? Слушай сравнения!',
      text: [{ en: "Let's compare!", ru: 'Давай сравним!' }, ...lines],
      qs: es.map((e, k) => ({ en: `Which is ${e[4]}, ${lc(e[0])} or ${e[2]}?`, ru: `Что ${e[5]}: ${lc(e[1])} или ${BN[ix[k]]}?`, ans: cap(e[0]), opts: [cap(e[0]), cap(e[2]), 'They are the same'] })),
      pick: es.map((e, k) => ({ say: lines[k].en, opts: [lines[k].en, `${cap(e[2])} is ${e[4]} than ${lc(e[0])}.`, `${e[0]} is ${e[6]} than ${e[2]}.`] }))
    });
  }

  // уровни: id, заголовки уже готовы; дописываем в общий список
  out.forEach(o => AUDIOS.push(o));
})();
