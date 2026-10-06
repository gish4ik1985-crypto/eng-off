// Подгонка под Spotlight 2, 3 и 4 (Быкова, Дули и др.).
// 1) новые слова и локации, которых не хватало; 2) порядок локаций в мирах по модулям учебника.
// Номера id не менялись у старых локаций, поэтому прогресс сохраняется.

// ---------- новые слова ----------
// Школа (Spotlight 3, модуль 1)
w('english', 'English', 'английский', '🔤'); w('maths', 'Maths', 'математика', '➗'); w('art', 'Art', 'рисование', '🖼️');
w('music', 'Music', 'музыка', '🎵'); w('pe', 'PE', 'физкультура', '🤾'); w('science', 'Science', 'природоведение', '🔬'); w('geography', 'Geography', 'география', '🌍');
// Числа
['eleven:11', 'twelve:12', 'thirteen:13', 'fourteen:14', 'fifteen:15', 'sixteen:16', 'seventeen:17', 'eighteen:18', 'nineteen:19', 'twenty:20', 'thirty:30', 'forty:40', 'fifty:50']
  .forEach(s => { const [en, n] = s.split(':'); w(en, en, n, n); });
// Игрушки и вещи (Spotlight 3, модуль 4)
w('computer', 'computer', 'компьютер', '💻'); w('phone', 'phone', 'телефон', '📱'); w('camera', 'camera', 'фотоаппарат', '📷');
w('guitar', 'guitar', 'гитара', '🎸'); w('piano', 'piano', 'пианино', '🎹'); w('drum', 'drum', 'барабан', '🥁'); w('puzzle', 'puzzle', 'пазл', '🧩');
// Семья и вещи (Spotlight 4, модуль 1)
w('uncle', 'uncle', 'дядя', '🧔'); w('aunt', 'aunt', 'тётя', '👩‍🦳'); w('cousin', 'cousin', 'двоюродный брат/сестра', '🧑‍🤝‍🧑');
w('glasses', 'glasses', 'очки', '👓'); w('hair', 'hair', 'волосы', '💇'); w('watch', 'watch', 'наручные часы', '⌚'); w('cd', 'CD', 'диск', '💿');
// Места (модуль 2)
w('station', 'station', 'станция', '🚉'); w('cafe', 'cafe', 'кафе', '☕'); w('theatre', 'theatre', 'театр', '🎭');
w('bakery', 'bakery', 'булочная', '🥖'); w('library', 'library', 'библиотека', '📚'); w('supermarket', 'supermarket', 'супермаркет', '🛒');
// Спорт
w('tennis', 'tennis', 'теннис', '🎾'); w('basketball', 'basketball', 'баскетбол', '🏀'); w('volleyball', 'volleyball', 'волейбол', '🏐');
w('hockey', 'hockey', 'хоккей', '🏒'); w('skate', 'skate', 'кататься на коньках', '⛸️'); w('ski', 'ski', 'кататься на лыжах', '⛷️'); w('cycling', 'cycling', 'велоспорт', '🚴');
// Еда 2 (модуль 3)
w('lemon', 'lemon', 'лимон', '🍋'); w('mango', 'mango', 'манго', '🥭'); w('butter', 'butter', 'масло', '🧈'); w('coconut', 'coconut', 'кокос', '🥥');
w('honey', 'honey', 'мёд', '🍯'); w('tea', 'tea', 'чай', '🍵'); w('bottle', 'bottle', 'бутылка', '🍾');
// Зоопарк 2 (модуль 4)
w('dolphin', 'dolphin', 'дельфин', '🐬'); w('seal', 'seal', 'тюлень', '🦭'); w('whale', 'whale', 'кит', '🐋'); w('hippo', 'hippo', 'бегемот', '🦛');
w('shark', 'shark', 'акула', '🦈'); w('octopus', 'octopus', 'осьминог', '🐙'); w('turtle', 'turtle', 'черепаха', '🐢');
// Месяцы
['January:январь:Янв', 'February:февраль:Фев', 'March:март:Мар', 'April:апрель:Апр', 'May:май:Май', 'June:июнь:Июн', 'July:июль:Июл', 'August:август:Авг', 'September:сентябрь:Сен', 'October:октябрь:Окт', 'November:ноябрь:Ноя', 'December:декабрь:Дек']
  .forEach(s => { const [en, ru, e] = s.split(':'); w(en.toLowerCase(), en, ru, e); });
// Порядковые числительные
['first:1-й:1-й', 'second:2-й:2-й', 'third:3-й:3-й', 'fourth:4-й:4-й', 'fifth:5-й:5-й', 'sixth:6-й:6-й', 'seventh:7-й:7-й', 'eighth:8-й:8-й', 'ninth:9-й:9-й', 'tenth:10-й:10-й']
  .forEach(s => { const [en, ru, e] = s.split(':'); w(en, en, ru, e); });
// Страны Европы, одежда для отдыха (модуль 8)
w('greece', 'Greece', 'Греция', '🏺'); w('italy', 'Italy', 'Италия', '🍝'); w('spain', 'Spain', 'Испания', '🥘'); w('turkey', 'Turkey', 'Турция', '🕌'); w('germany', 'Germany', 'Германия', '🥨');
w('swimsuit', 'swimsuit', 'купальник', '🩱'); w('sunglasses', 'sunglasses', 'солнечные очки', '🕶️'); w('sandals', 'sandals', 'сандалии', '🩴');
w('shorts', 'shorts', 'шорты', '🩳'); w('scarf', 'scarf', 'шарф', '🧣'); w('gloves', 'gloves', 'перчатки', '🧤'); w('boots', 'boots', 'сапоги', '🥾');

const OPT = (a, b, c) => [a, b, c].filter(Boolean);
const NEWL = [
  // ===== Мир 1 (Spotlight 2) =====
  { id: 15, title: 'Мой дом', icon: '🏠', words: ['house', 'bed', 'chair', 'sofa', 'lamp', 'tv'],
    story: 'Ты нашёл свой первый дом из блоков! Давай расставим мебель.',
    sents: [{ en: 'This is my house.', ru: 'Это мой дом.' }, { en: 'I am on the sofa.', ru: 'Я на диване.' }, { en: 'I have a lamp.', ru: 'У меня есть лампа.' }] },
  { id: 16, title: 'День рождения', icon: '🎂', words: ['birthday', 'cake', 'balloon', 'present', 'candle', 'party'],
    story: 'Сегодня праздник! Подготовь вечеринку и спроси, сколько тебе лет.',
    sents: [{ en: 'Happy birthday!', ru: 'С днём рождения!' }, { en: 'How old are you?', ru: 'Сколько тебе лет?' }, { en: 'I am seven.', ru: 'Мне семь лет.' }] },
  { id: 17, title: 'Кто что умеет', icon: '🐦', type: 'gram',
    story: 'Животные хвастаются, что они умеют. Но Забывака всё перепутал!',
    rule: { title: 'can / can\'t — «умею / не умею»', html: '<ul><li><b>can</b> — умею, могу</li><li><b>can\'t</b> — не умею, не могу</li></ul>',
      ex: [['A bird can fly.', 'Птица умеет летать.'], ["A fish can't run.", 'Рыба не умеет бегать.'], ['I can jump.', 'Я умею прыгать.']] },
    gaps: [
      { en: 'A cat ___ jump.', ans: 'can', opts: ['can', "can't"], ru: 'Кошка умеет прыгать.' },
      { en: 'A fish ___ run.', ans: "can't", opts: ['can', "can't"], ru: 'Рыба не умеет бегать.' },
      { en: 'A dog ___ swim.', ans: 'can', opts: ['can', "can't"], ru: 'Собака умеет плавать.' },
      { en: 'A rabbit ___ fly.', ans: "can't", opts: ['can', "can't"], ru: 'Кролик не умеет летать.' },
      { en: 'A bird ___ fly.', ans: 'can', opts: ['can', "can't"], ru: 'Птица умеет летать.' },
      { en: 'I ___ sing.', ans: 'can', opts: ['can', "can't"], ru: 'Я умею петь.' }],
    sents: [{ en: 'I can jump.', ru: 'Я умею прыгать.' }, { en: 'A cat can run.', ru: 'Кошка умеет бегать.' }, { en: "A fish can't walk.", ru: 'Рыба не умеет ходить.' }] },
  { id: 18, title: 'Где игрушка?', icon: '🧸', type: 'gram',
    story: 'Игрушки спрятались! Скажи, где они: в коробке, на кровати или под стулом.',
    rule: { title: 'in / on / under — «где предмет»', html: '<ul><li><b>in</b> — в</li><li><b>on</b> — на</li><li><b>under</b> — под</li></ul>',
      ex: [['The ball is in the box.', 'Мяч в коробке.'], ['The doll is on the bed.', 'Кукла на кровати.'], ['The cat is under the chair.', 'Кошка под стулом.']] },
    gaps: [
      { en: 'The ball is ___ the box.', ans: 'in', opts: ['in', 'on', 'under'], ru: 'Мяч В коробке.' },
      { en: 'The doll is ___ the bed.', ans: 'on', opts: ['in', 'on', 'under'], ru: 'Кукла НА кровати.' },
      { en: 'The teddy is ___ the chair.', ans: 'under', opts: ['in', 'on', 'under'], ru: 'Мишка ПОД стулом.' },
      { en: 'The car is ___ the box.', ans: 'in', opts: ['in', 'on', 'under'], ru: 'Машинка В коробке.' },
      { en: 'The robot is ___ the table.', ans: 'on', opts: ['in', 'on', 'under'], ru: 'Робот НА столе.' },
      { en: 'The cat is ___ the bed.', ans: 'under', opts: ['in', 'on', 'under'], ru: 'Кошка ПОД кроватью.' }],
    sents: [{ en: 'The ball is in the box.', ru: 'Мяч в коробке.' }, { en: 'The doll is on the bed.', ru: 'Кукла на кровати.' }, { en: 'The cat is under the chair.', ru: 'Кошка под стулом.' }] },
  { id: 19, title: 'Лето в деревне', icon: '☀️', words: ['summer', 'winter', 'sunny', 'rainy', 'windy', 'snowy'],
    story: 'Наступило лето! Но Забывака хочет спрятать погоду. Верни её!',
    sents: [{ en: 'It is summer.', ru: 'Сейчас лето.' }, { en: 'It is sunny.', ru: 'Солнечно.' }, { en: 'I like summer.', ru: 'Я люблю лето.' }] },
  { id: 20, title: 'Это и эти', icon: '👉', type: 'gram',
    story: 'Забывака путает один предмет и много. Помоги расставить this и these!',
    rule: { title: 'this is / these are, a / an', html: '<ul><li><b>This is</b> — это (один предмет)</li><li><b>These are</b> — это (много предметов)</li><li><b>a</b> перед согласным, <b>an</b> перед гласным: an apple</li></ul>',
      ex: [['This is a robot.', 'Это робот.'], ['These are my toys.', 'Это мои игрушки.'], ['This is an apple.', 'Это яблоко.']] },
    gaps: [
      { en: '___ is a robot.', ans: 'This', opts: ['This', 'These'], ru: 'Это робот (один).' },
      { en: '___ are my toys.', ans: 'These', opts: ['This', 'These'], ru: 'Это мои игрушки (много).' },
      { en: '___ is my mum.', ans: 'This', opts: ['This', 'These'], ru: 'Это моя мама.' },
      { en: '___ are two cats.', ans: 'These', opts: ['This', 'These'], ru: 'Это две кошки.' },
      { en: 'This is ___ apple.', ans: 'an', opts: ['a', 'an'], ru: 'Это яблоко.' },
      { en: 'This is ___ ball.', ans: 'a', opts: ['a', 'an'], ru: 'Это мяч.' }],
    sents: [{ en: 'This is a robot.', ru: 'Это робот.' }, { en: 'These are my toys.', ru: 'Это мои игрушки.' }, { en: 'This is an apple.', ru: 'Это яблоко.' }] },

  // ===== Мир 2 (Spotlight 3) =====
  { id: 61, title: 'Школьные уроки', icon: '📚', words: ['english', 'maths', 'art', 'music', 'pe', 'science', 'geography'],
    story: 'В школе блоков новое расписание. Выучи названия уроков!',
    sents: [{ en: 'I like English.', ru: 'Я люблю английский.' }, { en: 'We have maths.', ru: 'У нас математика.' }, { en: 'I love art.', ru: 'Я обожаю рисование.' }] },
  { id: 62, title: 'Числа 11–20', icon: '🔢', words: ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
    story: 'В шахте нашлись числа посложнее! Досчитай до двадцати.',
    sents: [{ en: 'I am eleven.', ru: 'Мне одиннадцать.' }, { en: 'I have twelve pens.', ru: 'У меня двенадцать ручек.' }, { en: 'There are twenty books.', ru: 'Там двадцать книг.' }] },
  { id: 63, title: 'Моё, твоё, его, её', icon: '👨‍👩‍👧', type: 'gram',
    story: 'У каждого жителя семья. Скажи, чья мама, чей папа и чей питомец!',
    rule: { title: 'my / your / his / her — «мой, твой, его, её»', html: '<ul><li><b>my</b> — мой, <b>your</b> — твой</li><li><b>his</b> — его, <b>her</b> — её</li></ul>',
      ex: [['This is my mum.', 'Это моя мама.'], ['Is this your bag?', 'Это твоя сумка?'], ['His dog is big.', 'Его собака большая.'], ['Her cat is white.', 'Её кошка белая.']] },
    gaps: [
      { en: 'This is ___ mum.', ans: 'my', opts: ['my', 'your', 'his', 'her'], ru: 'Это моя мама.' },
      { en: 'Is this ___ bag?', ans: 'your', opts: ['my', 'your', 'his', 'her'], ru: 'Это твоя сумка?' },
      { en: 'Tom has a dog. ___ dog is big.', ans: 'His', opts: ['His', 'Her', 'My'], ru: 'У Тома есть собака. Его собака большая.' },
      { en: 'Ann has a cat. ___ cat is white.', ans: 'Her', opts: ['His', 'Her', 'My'], ru: 'У Ани есть кошка. Её кошка белая.' },
      { en: 'I love ___ family.', ans: 'my', opts: ['my', 'your', 'her'], ru: 'Я люблю свою семью.' },
      { en: 'Max, where is ___ ball?', ans: 'your', opts: ['my', 'your', 'his'], ru: 'Макс, где твой мяч?' },
      { en: 'This is Kate. This is ___ brother.', ans: 'her', opts: ['his', 'her', 'my'], ru: 'Это Катя. Это её брат.' }],
    sents: [{ en: 'This is my mum.', ru: 'Это моя мама.' }, { en: 'Is this your bag?', ru: 'Это твоя сумка?' }, { en: 'His dog is big.', ru: 'Его собака большая.' }, { en: 'Her cat is white.', ru: 'Её кошка белая.' }] },
  { id: 64, title: 'Один и много', icon: '👥', type: 'gram',
    story: 'Забывака превращает один предмет в много. Подбери правильные окончания!',
    rule: { title: 'Множественное число', html: '<ul><li>Обычно +<b>s</b>: cat → <b>cats</b></li><li>После s, x, ch: +<b>es</b>: box → <b>boxes</b></li><li>y → <b>ies</b>: baby → <b>babies</b></li><li>Особые: mouse → <b>mice</b>, child → <b>children</b>, foot → <b>feet</b></li></ul>',
      ex: [['I have two cats.', 'У меня две кошки.'], ['There are three boxes.', 'Там три коробки.'], ['Two mice are small.', 'Две мыши маленькие.']] },
    gaps: [
      { en: 'I have two ___.', ans: 'cats', opts: ['cat', 'cats', 'cates'], ru: 'У меня две кошки.' },
      { en: 'There are three ___.', ans: 'boxes', opts: ['box', 'boxs', 'boxes'], ru: 'Там три коробки.' },
      { en: 'I see four ___.', ans: 'mice', opts: ['mouse', 'mice', 'mouses'], ru: 'Я вижу четырёх мышей.' },
      { en: 'There are five ___.', ans: 'babies', opts: ['babys', 'babies', 'baby'], ru: 'Там пять малышей.' },
      { en: 'Two ___ are in the park.', ans: 'children', opts: ['child', 'childs', 'children'], ru: 'Двое детей в парке.' },
      { en: 'I see six ___.', ans: 'buses', opts: ['bus', 'buss', 'buses'], ru: 'Я вижу шесть автобусов.' },
      { en: 'These are my ___.', ans: 'feet', opts: ['foot', 'foots', 'feet'], ru: 'Это мои ноги (ступни).' }],
    sents: [{ en: 'I have two cats.', ru: 'У меня две кошки.' }, { en: 'There are three boxes.', ru: 'Там три коробки.' }, { en: 'I see four mice.', ru: 'Я вижу четырёх мышей.' }, { en: 'Two children are in the park.', ru: 'Двое детей в парке.' }] },
  { id: 66, title: 'Немного и ни одного', icon: '🍎', type: 'gram',
    story: 'В кладовой что-то есть, а чего-то нет. Скажи some или any!',
    rule: { title: 'some / any', html: '<ul><li><b>some</b> — немного, несколько (в утверждении): There is <b>some</b> milk.</li><li><b>any</b> — в вопросе и отрицании: Is there <b>any</b> cheese? There aren\'t <b>any</b> apples.</li></ul>',
      ex: [['There is some milk.', 'Есть немного молока.'], ['Is there any cheese?', 'Есть сыр?'], ["There aren't any apples.", 'Яблок нет.']] },
    gaps: [
      { en: 'There is ___ milk.', ans: 'some', opts: ['some', 'any'], ru: 'Есть немного молока.' },
      { en: 'Is there ___ cheese?', ans: 'any', opts: ['some', 'any'], ru: 'Есть сыр?' },
      { en: "There aren't ___ apples.", ans: 'any', opts: ['some', 'any'], ru: 'Яблок нет.' },
      { en: 'I have ___ eggs.', ans: 'some', opts: ['some', 'any'], ru: 'У меня есть несколько яиц.' },
      { en: 'Have you got ___ pens?', ans: 'any', opts: ['some', 'any'], ru: 'У тебя есть ручки?' },
      { en: 'She has ___ juice.', ans: 'some', opts: ['some', 'any'], ru: 'У неё есть немного сока.' }],
    sents: [{ en: 'There is some milk.', ru: 'Есть немного молока.' }, { en: 'Is there any cheese?', ru: 'Есть сыр?' }, { en: "There aren't any apples.", ru: 'Яблок нет.' }, { en: 'I have some eggs.', ru: 'У меня есть яйца.' }] },
  { id: 67, title: 'Игрушки и вещи', icon: '🎸', words: ['computer', 'phone', 'camera', 'guitar', 'piano', 'drum', 'puzzle'],
    story: 'Заходи в комнату и играй! Тут много интересных вещей.',
    sents: [{ en: 'I have a computer.', ru: 'У меня есть компьютер.' }, { en: 'This is my guitar.', ru: 'Это моя гитара.' }, { en: 'She plays the piano.', ru: 'Она играет на пианино.' }] },
  { id: 68, title: 'Это, то, эти, те', icon: '👈', type: 'gram',
    story: 'Одни предметы рядом, другие далеко. Выбери this, that, these или those!',
    rule: { title: 'this / that / these / those', html: '<ul><li><b>this</b> — этот (один, рядом); <b>these</b> — эти (много, рядом)</li><li><b>that</b> — тот (один, далеко); <b>those</b> — те (много, далеко)</li></ul>',
      ex: [['This is my bag.', 'Это моя сумка (рядом).'], ['That is a tree.', 'Вон то дерево (далеко).'], ['These are my books.', 'Это мои книги.'], ['Those are birds.', 'Вон те птицы.']] },
    gaps: [
      { en: '___ is my bag.', ans: 'This', opts: ['This', 'That', 'These'], ru: 'Это моя сумка (рядом, одна).' },
      { en: '___ are my books.', ans: 'These', opts: ['This', 'These', 'Those'], ru: 'Это мои книги (рядом).' },
      { en: '___ is a big tree.', ans: 'That', opts: ['This', 'That', 'Those'], ru: 'Вон то большое дерево (далеко).' },
      { en: '___ are birds.', ans: 'Those', opts: ['That', 'These', 'Those'], ru: 'Вон те птицы (далеко, много).' },
      { en: 'This is ___ egg.', ans: 'an', opts: ['a', 'an'], ru: 'Это яйцо.' },
      { en: 'That is ___ elephant.', ans: 'an', opts: ['a', 'an'], ru: 'Вон тот слон.' },
      { en: 'This is ___ dog.', ans: 'a', opts: ['a', 'an'], ru: 'Это собака.' }],
    sents: [{ en: 'This is my bag.', ru: 'Это моя сумка.' }, { en: 'That is a tree.', ru: 'Вон то дерево.' }, { en: 'These are my books.', ru: 'Это мои книги.' }, { en: 'Those are birds.', ru: 'Вон те птицы.' }] },
  { id: 69, title: 'Десятки', icon: '🔟', words: ['twenty', 'thirty', 'forty', 'fifty'],
    story: 'Теперь считаем десятками! Пока выучим до пятидесяти.',
    sents: [{ en: 'I have thirty cards.', ru: 'У меня тридцать карточек.' }, { en: 'My grandpa is fifty.', ru: 'Моему дедушке пятьдесят.' }, { en: 'There are forty pupils.', ru: 'Там сорок учеников.' }] },
  { id: 70, title: 'Выходной день', icon: '🏖️', type: 'gram',
    story: 'Сегодня выходной! Расскажи, кто чем занят прямо сейчас.',
    rule: { title: 'Present Continuous — «что делаю сейчас»', html: '<ul><li><b>am / is / are + глагол с -ing</b></li><li>I <b>am watching</b> TV — я смотрю телевизор</li><li>She <b>is painting</b> — она рисует</li></ul>',
      ex: [['I am watching TV.', 'Я смотрю телевизор.'], ['She is painting a picture.', 'Она рисует картину.'], ['We are making a sandcastle.', 'Мы строим замок из песка.']] },
    gaps: [
      { en: 'I am ___ TV.', ans: 'watching', opts: ['watching', 'watches', 'watch'], ru: 'Я смотрю телевизор.' },
      { en: 'She is ___ a picture.', ans: 'painting', opts: ['painting', 'paints', 'paint'], ru: 'Она рисует картину.' },
      { en: 'We are ___ a sandcastle.', ans: 'making', opts: ['making', 'make', 'makes'], ru: 'Мы строим замок из песка.' },
      { en: 'He is ___ a car.', ans: 'driving', opts: ['driving', 'drives', 'drive'], ru: 'Он ведёт машину.' },
      { en: 'They are ___ in the sea.', ans: 'swimming', opts: ['swimming', 'swim', 'swims'], ru: 'Они плавают в море.' },
      { en: 'I ___ having a great time.', ans: 'am', opts: ['am', 'is', 'are'], ru: 'Я отлично провожу время.' },
      { en: 'Mum ___ cooking.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Мама готовит.' }],
    sents: [{ en: 'I am watching TV.', ru: 'Я смотрю телевизор.' }, { en: 'She is painting a picture.', ru: 'Она рисует картину.' }, { en: 'We are making a sandcastle.', ru: 'Мы строим замок из песка.' }, { en: 'He is driving a car.', ru: 'Он ведёт машину.' }] },

  // ===== Мир 3 (Spotlight 4) =====
  { id: 71, title: 'Семья и вещи', icon: '🧔', words: ['uncle', 'aunt', 'cousin', 'glasses', 'hair', 'watch', 'cd'],
    story: 'Познакомься с родственниками! И посмотри, какие у них вещи.',
    sents: [{ en: 'This is my uncle.', ru: 'Это мой дядя.' }, { en: 'She is my aunt.', ru: 'Она моя тётя.' }, { en: 'He has got glasses.', ru: 'У него очки.' }] },
  { id: 72, title: 'Места в городе', icon: '🎭', words: ['station', 'cafe', 'theatre', 'bakery', 'library', 'supermarket'],
    story: 'В городе работают люди. Найди их места работы!',
    sents: [{ en: 'I go to the library.', ru: 'Я иду в библиотеку.' }, { en: 'The theatre is big.', ru: 'Театр большой.' }, { en: 'We are at the station.', ru: 'Мы на станции.' }] },
  { id: 73, title: 'Спорт и игры', icon: '🏀', words: ['tennis', 'basketball', 'volleyball', 'hockey', 'skate', 'ski', 'cycling'],
    story: 'Турнир на стадионе! Назови все виды спорта.',
    sents: [{ en: 'I play tennis.', ru: 'Я играю в теннис.' }, { en: 'He plays hockey.', ru: 'Он играет в хоккей.' }, { en: 'I like basketball.', ru: 'Я люблю баскетбол.' }] },
  { id: 74, title: 'Всегда, иногда, никогда', icon: '📆', type: 'gram',
    story: 'Забывака спрашивает, как часто ты что-то делаешь. Выбери правильное слово!',
    rule: { title: 'always / usually / sometimes / never, have to', html: '<ul><li><b>always</b> — всегда, <b>usually</b> — обычно</li><li><b>sometimes</b> — иногда, <b>never</b> — никогда</li><li><b>have to</b> — должен; <b>don\'t have to</b> — не обязан</li></ul>',
      ex: [['I always get up at seven.', 'Я всегда встаю в семь.'], ['She sometimes watches TV.', 'Она иногда смотрит телевизор.'], ["We never go to school on Sunday.", 'Мы никогда не ходим в школу в воскресенье.']] },
    gaps: [
      { en: 'I ___ get up at seven.', ans: 'always', opts: ['always', 'sometimes', 'never'], ru: 'Я всегда встаю в семь.' },
      { en: 'She ___ watches TV in the morning.', ans: 'sometimes', opts: ['always', 'sometimes', 'never'], ru: 'Она иногда смотрит телевизор утром.' },
      { en: 'We ___ go to school on Sunday.', ans: 'never', opts: ['always', 'usually', 'never'], ru: 'Мы никогда не ходим в школу в воскресенье.' },
      { en: 'He ___ eats breakfast.', ans: 'usually', opts: ['usually', 'never', 'sometimes'], ru: 'Он обычно завтракает.' },
      { en: 'I ___ wear a uniform.', ans: 'have to', opts: ['have to', "don't have to"], ru: 'Мне нужно носить форму.' },
      { en: 'On Sunday I ___ go to school.', ans: "don't have to", opts: ['have to', "don't have to"], ru: 'В воскресенье мне не нужно идти в школу.' }],
    sents: [{ en: 'I always get up at seven.', ru: 'Я всегда встаю в семь.' }, { en: 'She sometimes watches TV.', ru: 'Она иногда смотрит телевизор.' }, { en: 'We never go to school on Sunday.', ru: 'Мы никогда не ходим в школу в воскресенье.' }, { en: 'I have to wear a uniform.', ru: 'Мне нужно носить форму.' }] },
  { id: 75, title: 'Вкусные продукты', icon: '🍋', words: ['lemon', 'mango', 'butter', 'coconut', 'honey', 'tea', 'bottle'],
    story: 'Рынок полон вкусностей! Узнай, что где лежит.',
    sents: [{ en: 'I like honey.', ru: 'Я люблю мёд.' }, { en: 'I drink tea.', ru: 'Я пью чай.' }, { en: 'This is a lemon.', ru: 'Это лимон.' }] },
  { id: 76, title: 'Сколько? Много или мало', icon: '🛒', type: 'gram',
    story: 'В магазине всё нужно посчитать! Выбери how many или how much.',
    rule: { title: 'How many / How much', html: '<ul><li><b>How many</b> + то, что можно посчитать: How many apples?</li><li><b>How much</b> + то, что нельзя посчитать: How much milk?</li></ul>',
      ex: [['How many apples?', 'Сколько яблок?'], ['How much milk?', 'Сколько молока?'], ['How many eggs?', 'Сколько яиц?']] },
    gaps: [
      { en: 'How ___ apples?', ans: 'many', opts: ['many', 'much'], ru: 'Сколько яблок?' },
      { en: 'How ___ milk?', ans: 'much', opts: ['many', 'much'], ru: 'Сколько молока?' },
      { en: 'How ___ eggs?', ans: 'many', opts: ['many', 'much'], ru: 'Сколько яиц?' },
      { en: 'How ___ water?', ans: 'much', opts: ['many', 'much'], ru: 'Сколько воды?' },
      { en: 'How ___ cakes?', ans: 'many', opts: ['many', 'much'], ru: 'Сколько тортов?' },
      { en: 'How ___ juice?', ans: 'much', opts: ['many', 'much'], ru: 'Сколько сока?' }],
    sents: [{ en: 'How many apples?', ru: 'Сколько яблок?' }, { en: 'How much milk?', ru: 'Сколько молока?' }, { en: 'How many eggs?', ru: 'Сколько яиц?' }] },
  { id: 77, title: 'Океанариум', icon: '🐬', words: ['dolphin', 'seal', 'whale', 'hippo', 'shark', 'octopus', 'turtle'],
    story: 'В океанариуме все смешались! Назови обитателей воды.',
    sents: [{ en: 'I see a dolphin.', ru: 'Я вижу дельфина.' }, { en: 'The whale is big.', ru: 'Кит большой.' }, { en: 'I like turtles.', ru: 'Я люблю черепах.' }] },
  { id: 78, title: 'Месяцы года', icon: '🗓️', words: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    story: 'Забывака порвал календарь на месяцы! Собери их все.',
    sents: [{ en: 'My birthday is in May.', ru: 'Мой день рождения в мае.' }, { en: 'It is cold in January.', ru: 'В январе холодно.' }, { en: 'December is winter.', ru: 'Декабрь — это зима.' }] },
  { id: 79, title: 'Чьё это?', icon: '👤', type: 'gram',
    story: 'У всех вещей есть хозяин. Добавь \'s и скажи, чей это предмет!',
    rule: { title: 'Притяжательный падеж \'s', html: '<ul><li>Чей? — <b>имя + \'s</b>: Ann<b>\'s</b> bag — сумка Ани</li><li>dad<b>\'s</b> car — машина папы</li><li>the cat<b>\'s</b> tail — хвост кошки</li></ul>',
      ex: [["This is Ann's bag.", 'Это сумка Ани.'], ["That is my dad's car.", 'Вон машина моего папы.'], ["The cat's tail is long.", 'Хвост у кошки длинный.']] },
    gaps: [
      { en: 'This is ___ bag.', ans: "Ann's", opts: ['Ann', 'Anns', "Ann's"], ru: 'Это сумка Ани.' },
      { en: 'That is my ___ car.', ans: "dad's", opts: ['dad', 'dads', "dad's"], ru: 'Вон машина моего папы.' },
      { en: 'The ___ tail is long.', ans: "cat's", opts: ['cat', 'cats', "cat's"], ru: 'Хвост у кошки длинный.' },
      { en: 'These are my ___ books.', ans: "brother's", opts: ['brother', 'brothers', "brother's"], ru: 'Это книги моего брата.' },
      { en: 'Where is ___ ball?', ans: "Tom's", opts: ['Tom', 'Toms', "Tom's"], ru: 'Где мяч Тома?' },
      { en: 'This is my ___ house.', ans: "grandma's", opts: ['grandma', 'grandmas', "grandma's"], ru: 'Это дом моей бабушки.' }],
    sents: [{ en: "This is Ann's bag.", ru: 'Это сумка Ани.' }, { en: "That is my dad's car.", ru: 'Вон машина моего папы.' }, { en: "The cat's tail is long.", ru: 'Хвост у кошки длинный.' }] },
  { id: 80, title: 'Первый, второй, третий', icon: '🥇', words: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'],
    story: 'На гонках важно, кто пришёл первым! Выучи порядковые числа.',
    sents: [{ en: 'I am first.', ru: 'Я первый.' }, { en: 'He is second.', ru: 'Он второй.' }, { en: 'I am in the fourth grade.', ru: 'Я учусь в четвёртом классе.' }] },
  { id: 81, title: 'Страны Европы', icon: '🏺', words: ['greece', 'italy', 'spain', 'turkey', 'germany'],
    story: 'Продолжаем путешествие: теперь по Европе и не только.',
    sents: [{ en: 'We go to Greece.', ru: 'Мы едем в Грецию.' }, { en: 'Spain is hot.', ru: 'В Испании жарко.' }, { en: 'I want to go to Italy.', ru: 'Я хочу поехать в Италию.' }] },
  { id: 82, title: 'Одежда для отпуска', icon: '🧳', words: ['swimsuit', 'sunglasses', 'sandals', 'shorts', 'scarf', 'gloves', 'boots'],
    story: 'Собирай чемодан! Что надеть на море, а что в горы?',
    sents: [{ en: 'I wear shorts in summer.', ru: 'Летом я ношу шорты.' }, { en: 'Put on your scarf.', ru: 'Надень шарф.' }, { en: 'I have sunglasses.', ru: 'У меня есть солнечные очки.' }] },
  { id: 83, title: 'Планы на отпуск', icon: '🧭', type: 'gram',
    story: 'Время планировать! Расскажи, что ты собираешься делать.',
    rule: { title: 'be going to и will — «собираюсь» и «будет»', html: '<ul><li><b>am / is / are going to</b> + глагол — собираюсь, планирую</li><li><b>will</b> + глагол — будет (прогноз): It <b>will</b> be sunny.</li></ul>',
      ex: [['I am going to visit Italy.', 'Я собираюсь посетить Италию.'], ['She is going to swim.', 'Она собирается плавать.'], ['It will be sunny tomorrow.', 'Завтра будет солнечно.']] },
    gaps: [
      { en: 'I am ___ to visit Italy.', ans: 'going', opts: ['going', 'go', 'goes'], ru: 'Я собираюсь посетить Италию.' },
      { en: 'She ___ going to swim.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Она собирается плавать.' },
      { en: 'We ___ going to fly.', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Мы собираемся лететь.' },
      { en: 'It ___ be sunny tomorrow.', ans: 'will', opts: ['will', 'is', 'does'], ru: 'Завтра будет солнечно.' },
      { en: 'What ___ you going to do?', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Что ты собираешься делать?' },
      { en: 'He is going ___ travel by ship.', ans: 'to', opts: ['to', 'for', 'at'], ru: 'Он собирается плыть на корабле.' }],
    sents: [{ en: 'I am going to visit Italy.', ru: 'Я собираюсь посетить Италию.' }, { en: 'She is going to swim.', ru: 'Она собирается плавать.' }, { en: 'It will be sunny tomorrow.', ru: 'Завтра будет солнечно.' }, { en: 'What are you going to do?', ru: 'Что ты собираешься делать?' }] }
];

// ---------- порядок локаций по модулям учебника ----------
const POOL = {};
[].concat(LESSONS, LESSONS2, LESSONS3, NEWL).forEach(l => { POOL[l.id] = l; });
const ORDER = [
  // Мир 1 — Spotlight 2: Let's go, My letters, Me and my family, My house, I like food, Animals, Toys, We love summer
  [1, 2, 3, 4, 5, 8, 15, 6, 16, 12, 10, 17, 9, 18, 7, 11, 13, 19, 20],
  // Мир 2 — Spotlight 3: School days, Family moments, All the things I like, Come in and play, Furry friends, Home sweet home, A day off, Day by day
  [21, 61, 62, 23, 63, 64, 31, 66, 30, 67, 68, 29, 28, 69, 24, 25, 26, 27, 70, 22, 46, 45, 32, 34],
  // Мир 3 — Spotlight 4: Family & friends, A working day, Tasty treats, In the zoo, Where were you yesterday, Tell the story, Memories, Let's travel
  [71, 44, 35, 42, 72, 73, 74, 75, 76, 77, 78, 79, 52, 53, 80, 33, 47, 50, 48, 54, 49, 51, 41, 81, 43, 82, 83, 55]
];
WORLDS.forEach((wd, i) => { wd.lessons = ORDER[i].map(id => POOL[id]); });
