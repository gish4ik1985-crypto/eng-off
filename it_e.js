/* Итальянский: рассказы для аудирования. 12 тем × 10 вариантов = 120 рассказов. В каждом свои имена, животные, цвета, дни, числа и места,
   поэтому рассказы не повторяются. Формат как у английского: {id, world, req, grp, icon, title, intro, text, qs, pick}. */
const IT_AUDIOS = [];
(function () {
  const L = (en, ru) => ({ en, ru });
  const opts3 = (ans, pool, k) => { const rest = pool.filter(x => x !== ans), a = rest[k % rest.length], b = rest[(k + 3) % rest.length]; return [ans, a, b === a ? rest[(k + 1) % rest.length] : b]; };
  const Q = (en, ru, ans, pool, k) => ({ en, ru, ans, opts: opts3(ans, pool, k) });
  const pick = (say, pool, k) => ({ say, opts: opts3(say, pool, k) });
  const years = n => (n % 10 === 1 && n !== 11 ? 'год' : (n % 10 >= 2 && n % 10 <= 4 && (n < 10 || n > 20) ? 'года' : 'лет'));
  const NM = [['Marco', 'Марко', 'Марко', 'm'], ['Anna', 'Анна', 'Анны', 'f'], ['Luca', 'Лука', 'Луки', 'm'], ['Sofia', 'София', 'Софии', 'f'], ['Paolo', 'Паоло', 'Паоло', 'm'], ['Giulia', 'Джулия', 'Джулии', 'f'],
    ['Matteo', 'Маттео', 'Маттео', 'm'], ['Chiara', 'Кьяра', 'Кьяры', 'f'], ['Davide', 'Давиде', 'Давиде', 'm'], ['Elena', 'Елена', 'Елены', 'f'], ['Franco', 'Франко', 'Франко', 'm'], ['Sara', 'Сара', 'Сары', 'f']]
    .map(([it, ru, gen, g]) => ({ it, ru, gen, g }));
  const NUMW = { 6: 'sei', 7: 'sette', 8: 'otto', 9: 'nove', 10: 'dieci', 11: 'undici', 12: 'dodici' };
  const DAYS = [['lunedì', 'понедельник'], ['martedì', 'вторник'], ['mercoledì', 'среда'], ['giovedì', 'четверг'], ['venerdì', 'пятница'], ['sabato', 'суббота'], ['domenica', 'воскресенье']].map(([it, ru]) => ({ it, ru }));
  const NAMES = NM.map(n => n.it);
  const out = [];

  /* ======== МИР 1 ======== */
  // 1. Знакомство
  for (let i = 0; i < 10; i++) {
    const n = NM[i], age = 6 + (i % 7), sib = i % 2 ? ['una sorella', 'сестра'] : ['un fratello', 'брат'], pool = [6, 7, 8, 9, 10, 11, 12].map(x => NUMW[x]);
    out.push({
      id: 'iA' + i, world: 0, req: 509, grp: 'Знакомство', icon: '👋', title: `Знакомься, это ${n.ru}`, intro: 'Новый друг хочет познакомиться. Послушай, что он расскажет!',
      text: [L(`Ciao! Mi chiamo ${n.it}.`, `Привет! Меня зовут ${n.ru}.`), L(`Ho ${NUMW[age]} anni.`, `Мне ${age} ${years(age)}.`), L('Questa è la mia mamma.', 'Это моя мама.'), L('Questo è il mio papà.', 'Это мой папа.'), L(`Ho ${sib[0]}.`, `У меня есть ${sib[1]}.`)],
      qs: [Q('Come si chiama?', 'Как его зовут?', n.it, NAMES, i), Q('Quanti anni ha?', 'Сколько ему лет?', NUMW[age], pool, i), Q('Chi ha?', 'Кто у него есть?', sib[0].replace(/^un[ao]? /, m => m) === sib[0] ? sib[0] : sib[0], ['un fratello', 'una sorella', 'un cane'], i)],
      pick: [pick(`Ho ${NUMW[age]} anni.`, pool.map(x => `Ho ${x} anni.`), i), pick(`Mi chiamo ${n.it}.`, NAMES.map(x => `Mi chiamo ${x}.`), i + 1), pick(`Ho ${sib[0]}.`, ['Ho un fratello.', 'Ho una sorella.', 'Ho un cane.'], i)]
    });
  }
  // 2. Питомцы
  const PETS = [['gatto', 'кот', 'm'], ['cane', 'собака', 'm'], ['coniglio', 'кролик', 'm'], ['uccello', 'птица', 'm'], ['cavallo', 'лошадь', 'm'], ['pesce', 'рыбка', 'm'], ['rana', 'лягушка', 'f'], ['topo', 'мышь', 'm'], ['gatto', 'кот', 'm'], ['cane', 'собака', 'm']];
  const CLRS = [['nero', 'nera', 'чёрный', 'чёрная'], ['bianco', 'bianca', 'белый', 'белая'], ['rosso', 'rossa', 'красный', 'красная'], ['giallo', 'gialla', 'жёлтый', 'жёлтая'], ['grigio', 'grigia', 'серый', 'серая'], ['marrone', 'marrone', 'коричневый', 'коричневая']];
  const DOES = [['salta', 'прыгает'], ['corre', 'бегает'], ['nuota', 'плавает'], ['vola', 'летает'], ['dorme', 'спит'], ['mangia', 'ест']];
  for (let i = 0; i < 10; i++) {
    const p = PETS[i], n = NM[(i * 5) % 12], c = CLRS[i % 6], d = DOES[(i * 2) % 6], f = p[2] === 'f';
    out.push({
      id: 'iB' + i, world: 0, req: 511, grp: 'Мой питомец', icon: '🐾', title: `Питомец №${i + 1}`, intro: 'Ребёнок рассказывает о своём питомце. Какой он? Что умеет?',
      text: [L(`Ho ${f ? 'una' : 'un'} ${p[0]}.`, `У меня есть ${p[1]}.`), L(`Si chiama ${n.it}.`, `${f ? 'Её' : 'Его'} зовут ${n.ru}.`), L(`È ${f ? c[1] : c[0]}.`, `${f ? 'Она' : 'Он'} ${f ? c[3] : c[2]}.`), L(`${f ? 'La' : 'Il'} ${p[0]} ${d[0]}.`, `${p[1][0].toUpperCase() + p[1].slice(1)} ${d[1]}.`), L('Mi piace molto!', f ? 'Она мне очень нравится!' : 'Он мне очень нравится!')],
      qs: [Q('Che animale ha?', 'Какое животное у него есть?', p[0], PETS.map(x => x[0]).filter((x, k, a) => a.indexOf(x) === k), i), Q('Come si chiama?', 'Как его зовут?', n.it, NAMES, i), Q('Che cosa fa?', 'Что он делает?', d[0], DOES.map(x => x[0]), i)],
      pick: [pick(`Ho ${f ? 'una' : 'un'} ${p[0]}.`, ['Ho un gatto.', 'Ho un cane.', 'Ho un coniglio.', `Ho ${f ? 'una' : 'un'} ${p[0]}.`].filter((x, k, a) => a.indexOf(x) === k), i), pick(`Si chiama ${n.it}.`, NAMES.map(x => `Si chiama ${x}.`), i), pick(`${f ? 'La' : 'Il'} ${p[0]} ${d[0]}.`, DOES.map(x => `${f ? 'La' : 'Il'} ${p[0]} ${x[0]}.`), i)]
    });
  }
  // 3. День рождения
  const GIFT = [['un robot', 'робот'], ['una bambola', 'кукла'], ['una palla', 'мяч'], ['un libro', 'книга'], ['una bicicletta', 'велосипед'], ['un orsacchiotto', 'плюшевый мишка']];
  const GUS = [['al cioccolato', 'шоколадный'], ['alla fragola', 'клубничный'], ['al limone', 'лимонный'], ['alla vaniglia', 'ванильный']];
  for (let i = 0; i < 10; i++) {
    const n = NM[i], age = 6 + (i % 7), g = GIFT[i % 6], gu = GUS[i % 4], balls = 3 + (i % 6);
    out.push({
      id: 'iC' + i, world: 0, req: 516, grp: 'День рождения', icon: '🎂', title: `День рождения №${i + 1}`, intro: 'Сегодня праздник! Послушай, как проходит вечеринка.',
      text: [L(`Oggi è il compleanno di ${n.it}.`, `Сегодня день рождения ${n.gen}.`), L(`${n.it} ha ${NUMW[age]} anni.`, `${n.g === 'm' ? 'Ему' : 'Ей'} ${age} ${years(age)}.`), L(`Ci sono ${balls} palloncini.`, `Есть ${balls} воздушных ${balls < 5 ? 'шарика' : 'шариков'}.`), L(`La torta è ${gu[0]}.`, `Торт ${gu[1]}.`), L(`Il regalo è ${g[0]}.`, `Подарок — ${g[1]}.`)],
      qs: [Q('Di chi è il compleanno?', 'У кого день рождения?', n.it, NAMES, i), Q('Quanti anni ha?', 'Сколько ему лет?', NUMW[age], [6, 7, 8, 9, 10, 11, 12].map(x => NUMW[x]), i), Q('Qual è il regalo?', 'Какой подарок?', g[0], GIFT.map(x => x[0]), i), Q('Com’è la torta?', 'Какой торт?', gu[0], GUS.map(x => x[0]), i)],
      pick: [pick(`Oggi è il compleanno di ${n.it}.`, NAMES.map(x => `Oggi è il compleanno di ${x}.`), i), pick(`Il regalo è ${g[0]}.`, GIFT.map(x => `Il regalo è ${x[0]}.`), i), pick(`La torta è ${gu[0]}.`, GUS.map(x => `La torta è ${x[0]}.`), i)]
    });
  }
  // 4. Погода
  const WE = [['c’è il sole', 'светит солнце', 'gli occhiali da sole', 'солнечные очки'], ['piove', 'идёт дождь', 'l’ombrello', 'зонтик'], ['nevica', 'идёт снег', 'la sciarpa e i guanti', 'шарф и перчатки'], ['tira vento', 'дует ветер', 'la giacca', 'куртку'], ['ci sono le nuvole', 'облачно', 'il maglione', 'свитер']];
  for (let i = 0; i < 10; i++) {
    const w = WE[i % 5], d = DAYS[i % 7], cold = i % 5 === 2 || i % 5 === 4;
    out.push({
      id: 'iD' + i, world: 0, req: 518, grp: 'Погода', icon: '⛅', title: `Погода №${i + 1}`, intro: 'Какая сегодня погода? Что надеть?',
      text: [L(`Oggi è ${d.it}.`, `Сегодня ${d.ru}.`), L(`Fuori ${w[0]}.`, `На улице ${w[1]}.`), L(cold ? 'Fa freddo.' : 'Non fa freddo.', cold ? 'Холодно.' : 'Не холодно.'), L(`Metto ${w[2]}.`, `Я надеваю ${w[3]}.`)],
      qs: [Q('Che giorno è oggi?', 'Какой сегодня день?', d.it, DAYS.map(x => x.it), i), Q('Che tempo fa?', 'Какая погода?', w[0], WE.map(x => x[0]), i), Q('Che cosa mette?', 'Что он надевает?', w[2], WE.map(x => x[2]), i)],
      pick: [pick(`Oggi è ${d.it}.`, DAYS.map(x => `Oggi è ${x.it}.`), i), pick(`Fuori ${w[0]}.`, WE.map(x => `Fuori ${x[0]}.`), i), pick(`Metto ${w[2]}.`, WE.map(x => `Metto ${x[2]}.`), i)]
    });
  }

  /* ======== МИР 2 ======== */
  // 5. Школьный день
  const SUBJ = [['la matematica', 'математика', 'matematica'], ['l’arte', 'рисование', 'arte'], ['la musica', 'музыка', 'musica'], ['la ginnastica', 'физкультура', 'ginnastica'], ['l’italiano', 'итальянский язык', 'italiano'], ['la storia', 'история', 'storia'], ['la geografia', 'география', 'geografia']];
  const AFTER = [['gioco a calcio', 'играю в футбол'], ['vado al parco', 'иду в парк'], ['leggo un libro', 'читаю книгу'], ['guardo un film', 'смотрю фильм'], ['faccio i compiti', 'делаю уроки'], ['disegno', 'рисую']];
  for (let i = 0; i < 10; i++) {
    const d = DAYS[i % 5], a = SUBJ[i % 7], b = SUBJ[(i + 3) % 7], like = SUBJ[(i + (i % 2 ? 3 : 0)) % 7], af = AFTER[i % 6];
    out.push({
      id: 'iE' + i, world: 1, req: 535, grp: 'Школьный день', icon: '🏫', title: `Школьный день №${i + 1}`, intro: 'Ребёнок рассказывает о школе. Какие уроки? Что он делает после школы?',
      text: [L(`Oggi è ${d.it}.`, `Сегодня ${d.ru}.`), L('Vado a scuola.', 'Я иду в школу.'), L(`Ho ${a[2]} e ${b[2]}.`, `У меня ${a[1]} и ${b[1]}.`), L(`Mi piace ${like[0]}.`, `Мне нравится ${like[1]}.`), L(`Dopo la scuola ${af[0]}.`, `После школы я ${af[1]}.`)],
      qs: [Q('Che giorno è?', 'Какой сегодня день?', d.it, DAYS.map(x => x.it), i), Q('Quali materie ha?', 'Какие у него уроки?', `${a[2]} e ${b[2]}`, SUBJ.map((x, k) => `${x[2]} e ${SUBJ[(k + 2) % 7][2]}`), i), Q('Che cosa fa dopo la scuola?', 'Что он делает после школы?', af[0], AFTER.map(x => x[0]), i)],
      pick: [pick(`Oggi è ${d.it}.`, DAYS.map(x => `Oggi è ${x.it}.`), i), pick(`Ho ${a[2]} e ${b[2]}.`, SUBJ.map((x, k) => `Ho ${x[2]} e ${SUBJ[(k + 2) % 7][2]}.`), i), pick(`Dopo la scuola ${af[0]}.`, AFTER.map(x => `Dopo la scuola ${x[0]}.`), i)]
    });
  }
  // 6. В кафе
  const FOOD = [['un panino', 'бутерброд'], ['una pizza', 'пиццу'], ['un gelato', 'мороженое'], ['una torta', 'торт'], ['un biscotto', 'печенье'], ['una banana', 'банан']];
  const DRINK = [['il succo', 'сок'], ['l’acqua', 'воду'], ['il latte', 'молоко'], ['il tè', 'чай'], ['la cioccolata', 'горячий шоколад']];
  for (let i = 0; i < 10; i++) {
    const f = FOOD[i % 6], dr = DRINK[i % 5], n = NM[(i * 7) % 12], price = 3 + (i % 8);
    out.push({
      id: 'iF' + i, world: 1, req: 537, grp: 'В кафе', icon: '☕', title: `В кафе №${i + 1}`, intro: 'Ребёнок пришёл в кафе. Что он закажет?',
      text: [L(`${n.it} è al bar.`, `${n.ru} в кафе.`), L(`Vuole ${f[0]}.`, `${n.g === 'm' ? 'Он' : 'Она'} хочет ${f[1]}.`), L(`Beve ${dr[0]}.`, `${n.g === 'm' ? 'Он' : 'Она'} пьёт ${dr[1]}.`), L(`Costa ${NUMW[Math.min(Math.max(price, 6), 12)] || 'otto'} euro.`, `Это стоит ${Math.min(Math.max(price, 6), 12)} евро.`)],
      qs: [Q('Dov’è?', 'Где он(а)?', 'Al bar', ['Al bar', 'A scuola', 'Al parco'], i), Q('Che cosa vuole?', 'Что он(а) хочет?', f[0], FOOD.map(x => x[0]), i), Q('Che cosa beve?', 'Что он(а) пьёт?', dr[0], DRINK.map(x => x[0]), i)],
      pick: [pick(`Vuole ${f[0]}.`, FOOD.map(x => `Vuole ${x[0]}.`), i), pick(`Beve ${dr[0]}.`, DRINK.map(x => `Beve ${x[0]}.`), i), pick(`${n.it} è al bar.`, NAMES.map(x => `${x} è al bar.`), i)]
    });
  }
  // 7. Моя комната
  const ROOMS = [['la camera', 'комната'], ['la cucina', 'кухня'], ['il bagno', 'ванная'], ['il giardino', 'сад']];
  const THINGS = [['un letto', 'кровать'], ['una lampada', 'лампа'], ['una sedia', 'стул'], ['un divano', 'диван'], ['una finestra', 'окно'], ['un tavolo', 'стол']];
  const TOYS = [['un robot', 'робот'], ['una palla', 'мяч'], ['un libro', 'книга'], ['un orsacchiotto', 'плюшевый мишка'], ['una bambola', 'кукла']];
  for (let i = 0; i < 10; i++) {
    const r = ROOMS[i % 4], t = THINGS[i % 6], t2 = THINGS[(i + 2) % 6], toy = TOYS[i % 5];
    out.push({
      id: 'iG' + i, world: 1, req: 543, grp: 'Моя комната', icon: '🏠', title: `Моя комната №${i + 1}`, intro: 'Ребёнок показывает свой дом. Что где стоит?',
      text: [L(`${/^il /.test(r[0]) ? 'Questo' : 'Questa'} è ${r[0]}.`, `Это ${r[1]}.`), L(`C’è ${t[0]}.`, `Тут есть ${t[1]}.`), L(`Vicino c’è ${t2[0]}.`, `Рядом есть ${t2[1]}.`), L(`Sopra c’è ${toy[0]}.`, `Сверху лежит ${toy[1]}.`), L('Mi piace la mia casa!', 'Мне нравится мой дом!')],
      qs: [Q('Che stanza è?', 'Что это за комната?', r[0], ROOMS.map(x => x[0]), i), Q('Che cosa c’è?', 'Что там есть?', t[0], THINGS.map(x => x[0]), i), Q('Che cosa c’è sopra?', 'Что лежит сверху?', toy[0], TOYS.map(x => x[0]), i)],
      pick: [pick(`${/^il /.test(r[0]) ? 'Questo' : 'Questa'} è ${r[0]}.`, ROOMS.map(x => `${/^il /.test(x[0]) ? 'Questo' : 'Questa'} è ${x[0]}.`), i), pick(`C’è ${t[0]}.`, THINGS.map(x => `C’è ${x[0]}.`), i), pick(`Sopra c’è ${toy[0]}.`, TOYS.map(x => `Sopra c’è ${x[0]}.`), i)]
    });
  }
  // 8. Спорт
  const SPORT = [['il calcio', 'футбол', 'gioca a calcio', 'играет в футбол'], ['il tennis', 'теннис', 'gioca a tennis', 'играет в теннис'], ['il nuoto', 'плавание', 'nuota', 'плавает'], ['la pallavolo', 'волейбол', 'gioca a pallavolo', 'играет в волейбол'], ['lo sci', 'лыжи', 'scia', 'катается на лыжах'], ['il ciclismo', 'велоспорт', 'va in bicicletta', 'ездит на велосипеде']];
  for (let i = 0; i < 10; i++) {
    const n = NM[(i * 3) % 12], s = SPORT[i % 6], d = DAYS[(i + 1) % 7];
    out.push({
      id: 'iH' + i, world: 1, req: 536, grp: 'Спорт', icon: '⚽', title: `Любимый спорт №${i + 1}`, intro: 'Ребёнок рассказывает о любимом спорте.',
      text: [L(`Mi chiamo ${n.it}.`, `Меня зовут ${n.ru}.`), L(`Mi piace ${s[0]}.`, `Мне нравится ${s[1]}.`), L(`${d.it === 'domenica' ? 'La' : 'Il'} ${d.it} ${s[2].replace(/^(gioca|nuota|scia|va)/, m => ({ gioca: 'gioco', nuota: 'nuoto', scia: 'scio', va: 'vado' }[m]))}.`, `В ${d.ru.replace(/а$/, 'у').replace(/я$/, 'ю')} я ${s[3].replace(/^играет/, 'играю').replace(/^плавает/, 'плаваю').replace(/^катается/, 'катаюсь').replace(/^ездит/, 'езжу')}.`), L('Che bello lo sport!', 'Как здорово заниматься спортом!')],
      qs: [Q('Come si chiama?', 'Как его зовут?', n.it, NAMES, i), Q('Che sport piace?', 'Какой спорт ему нравится?', s[0], SPORT.map(x => x[0]), i), Q('Quando fa sport?', 'Когда он занимается?', d.it, DAYS.map(x => x.it), i)],
      pick: [pick(`Mi chiamo ${n.it}.`, NAMES.map(x => `Mi chiamo ${x}.`), i), pick(`Mi piace ${s[0]}.`, SPORT.map(x => `Mi piace ${x[0]}.`), i), pick('Che bello lo sport!', ['Che bello lo sport!', 'Che brutto il cane!', 'Che bella la luna!'], i)]
    });
  }

  /* ======== МИР 3 ======== */
  // 9. Город Италии
  const CITY = [['Roma', 'Рим', 'il Colosseo', 'Колизей', 'la pasta', 'пасту'], ['Venezia', 'Венецию', 'la gondola', 'гондолу', 'il gelato', 'мороженое'], ['Firenze', 'Флоренцию', 'il duomo', 'собор', 'la pizza', 'пиццу'], ['Napoli', 'Неаполь', 'il Vesuvio', 'Везувий', 'la pizza', 'пиццу'],
    ['Milano', 'Милан', 'il duomo', 'собор', 'il risotto', 'ризотто'], ['Torino', 'Турин', 'la montagna', 'горы', 'il cioccolato', 'шоколад']];
  for (let i = 0; i < 10; i++) {
    const c = CITY[i % 6], n = NM[(i * 5 + 1) % 12];
    out.push({
      id: 'iI' + i, world: 2, req: 601, grp: 'Город Италии', icon: '🇮🇹', title: `Путешествие №${i + 1}`, intro: 'Турист рассказывает о своей поездке по Италии.',
      text: [L(`Mi chiamo ${n.it}.`, `Меня зовут ${n.ru}.`), L(`Oggi sono a ${c[0]}.`, `Сегодня я в городе: ${c[1].replace(/ю$/, 'я')}.`), L(`Vedo ${c[2]}.`, `Я вижу ${c[3]}.`), L(`Mangio ${c[4]}.`, `Я ем ${c[5]}.`), L('Mi piace molto l’Italia!', 'Мне очень нравится Италия!')],
      qs: [Q('Dov’è oggi?', 'Где он сегодня?', c[0], CITY.map(x => x[0]), i), Q('Che cosa vede?', 'Что он видит?', c[2], CITY.map(x => x[2]).filter((x, k, a) => a.indexOf(x) === k), i), Q('Che cosa mangia?', 'Что он ест?', c[4], ['la pasta', 'il gelato', 'la pizza', 'il risotto', 'il cioccolato'], i)],
      pick: [pick(`Oggi sono a ${c[0]}.`, CITY.map(x => `Oggi sono a ${x[0]}.`), i), pick(`Vedo ${c[2]}.`, CITY.map(x => `Vedo ${x[2]}.`).filter((x, k, a) => a.indexOf(x) === k), i), pick(`Mangio ${c[4]}.`, ['la pasta', 'il gelato', 'la pizza', 'il risotto', 'il cioccolato'].map(x => `Mangio ${x}.`), i)]
    });
  }
  // 10. В магазине
  const ITEMS = [['una borsa', 'сумку'], ['un cappello', 'шляпу'], ['una palla', 'мяч'], ['un libro', 'книгу'], ['una maglia', 'кофту'], ['un orsacchiotto', 'плюшевого мишку']];
  for (let i = 0; i < 10; i++) {
    const it = ITEMS[i % 6], price = 6 + (i % 7), have = i % 2 ? Math.min(12, price + 2) : Math.max(6, price - 1), can = have >= price;
    out.push({
      id: 'iJ' + i, world: 2, req: 606, grp: 'В магазине', icon: '🛍️', title: `В магазине №${i + 1}`, intro: 'Ребёнок хочет купить вещь. Хватит ли ему денег?',
      text: [L('Sono nel negozio.', 'Я в магазине.'), L(`Vorrei ${it[0]}.`, `Я бы хотел ${it[1]}.`), L(`Costa ${NUMW[price]} euro.`, `Это стоит ${price} евро.`), L(`Ho ${NUMW[have]} euro.`, `У меня ${have} евро.`)],
      qs: [Q('Che cosa vuole?', 'Что он хочет?', it[0], ITEMS.map(x => x[0]), i), Q('Quanto costa?', 'Сколько это стоит?', NUMW[price], [6, 7, 8, 9, 10, 11, 12].map(x => NUMW[x]), i), Q('Ha abbastanza soldi?', 'Хватает ли ему денег?', can ? 'Sì' : 'No', ['Sì', 'No', 'Non lo so'], i)],
      pick: [pick('Sono nel negozio.', ['Sono nel negozio.', 'Sono nel parco.', 'Sono nella scuola.'], i), pick(`Vorrei ${it[0]}.`, ITEMS.map(x => `Vorrei ${x[0]}.`), i), pick(`Costa ${NUMW[price]} euro.`, [6, 7, 8, 9, 10, 11, 12].map(x => `Costa ${NUMW[x]} euro.`), i)]
    });
    out[out.length - 1].qs[2].ans = can ? 'Sì' : 'No';
  }
  // 11. Поездка
  const VEH = [['in treno', 'на поезде'], ['in aereo', 'на самолёте'], ['in autobus', 'на автобусе'], ['in macchina', 'на машине'], ['in nave', 'на корабле']];
  for (let i = 0; i < 10; i++) {
    const c = CITY[i % 6], v = VEH[i % 5], h = 2 + (i % 5), n = NM[(i * 7 + 2) % 12];
    out.push({
      id: 'iK' + i, world: 2, req: 607, grp: 'В дороге', icon: '🧳', title: `Поездка №${i + 1}`, intro: 'Семья отправляется в путешествие. Куда и как они едут?',
      text: [L(`Siamo in viaggio, io e ${n.it}.`, `Мы в пути: я и ${n.ru}.`), L(`Andiamo a ${c[0]} ${v[0]}.`, `Мы едем в город ${c[0]} ${v[1]}.`), L(`Il viaggio dura ${['', '', 'due', 'tre', 'quattro', 'cinque', 'sei'][h]} ore.`, `Дорога занимает ${h} ${h < 5 ? 'часа' : 'часов'}.`), L('Ho il biglietto e la valigia.', 'У меня есть билет и чемодан.')],
      qs: [Q('Dove vanno?', 'Куда они едут?', c[0], CITY.map(x => x[0]), i), Q('Come viaggiano?', 'Как они едут?', v[0], VEH.map(x => x[0]), i), Q('Che cosa hanno?', 'Что у них есть?', 'Il biglietto e la valigia', ['Il biglietto e la valigia', 'Il gelato e la palla', 'Il gatto e il cane'], i)],
      pick: [pick(`Andiamo a ${c[0]} ${v[0]}.`, VEH.map(x => `Andiamo a ${c[0]} ${x[0]}.`), i), pick(`Siamo in viaggio, io e ${n.it}.`, NAMES.map(x => `Siamo in viaggio, io e ${x}.`), i), pick('Ho il biglietto e la valigia.', ['Ho il biglietto e la valigia.', 'Ho il gelato e la palla.', 'Ho il gatto e il cane.'], i)]
    });
  }
  // 12. Ресторан
  const DISH = [['gli spaghetti', 'спагетти'], ['la lasagna', 'лазанью'], ['il risotto', 'ризотто'], ['la pizza', 'пиццу'], ['il tiramisù', 'тирамису']];
  for (let i = 0; i < 10; i++) {
    const dsh = DISH[i % 5], dr = DRINK[(i + 1) % 5], price = 10 + 2 * (i % 6), n = NM[(i * 5 + 3) % 12];
    out.push({
      id: 'iL' + i, world: 2, req: 605, grp: 'В ресторане', icon: '🍽️', title: `В ресторане №${i + 1}`, intro: 'Вечером семья ужинает в итальянском ресторане.',
      text: [L('Siamo al ristorante.', 'Мы в ресторане.'), L('Il cameriere porta il menù.', 'Официант приносит меню.'), L(`${n.it} mangia ${dsh[0]}.`, `${n.ru} ест ${dsh[1]}.`), L(`Beve ${dr[0]}.`, `${n.g === 'm' ? 'Он' : 'Она'} пьёт ${dr[1]}.`), L(`Il conto è ${price} euro.`, `Счёт — ${price} евро.`)],
      qs: [Q('Dove sono?', 'Где они?', 'Al ristorante', ['Al ristorante', 'A scuola', 'In piscina'], i), Q('Che cosa mangia?', 'Что он(а) ест?', dsh[0], DISH.map(x => x[0]), i), Q('Che cosa beve?', 'Что он(а) пьёт?', dr[0], DRINK.map(x => x[0]), i), Q('Quanto è il conto?', 'Сколько составляет счёт?', `${price} euro`, [10, 12, 14, 16, 18, 20].map(x => `${x} euro`), i)],
      pick: [pick('Il cameriere porta il menù.', ['Il cameriere porta il menù.', 'Il cuoco porta il gatto.', 'Il medico porta il libro.'], i), pick(`${n.it} mangia ${dsh[0]}.`, DISH.map(x => `${n.it} mangia ${x[0]}.`), i), pick(`Il conto è ${price} euro.`, [10, 12, 14, 16, 18, 20].map(x => `Il conto è ${x} euro.`), i)]
    });
  }
  out.forEach(o => IT_AUDIOS.push(o));
})();
