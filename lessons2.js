// Мир 2 (3 класс, по мотивам Spotlight 3). Слова + грамматические локации.
// Для слов-«картинок» вместо эмодзи можно указать короткий текст (дни недели).
// Предложение для сборки: {en, ru}. Пропуск: {en:'I ___ a robot.', ans:'am', opts:[...], ru:'...'}.

// Школа
w('pen', 'pen', 'ручка', '🖊️'); w('pencil', 'pencil', 'карандаш', '✏️'); w('book', 'book', 'книга', '📖');
w('bag', 'bag', 'рюкзак', '🎒'); w('ruler', 'ruler', 'линейка', '📏'); w('school', 'school', 'школа', '🏫');
w('teacher', 'teacher', 'учитель', '🧑‍🏫'); w('scissors', 'scissors', 'ножницы', '✂️');
// Дни недели
['Monday:понедельник:Пн', 'Tuesday:вторник:Вт', 'Wednesday:среда:Ср', 'Thursday:четверг:Чт', 'Friday:пятница:Пт', 'Saturday:суббота:Сб', 'Sunday:воскресенье:Вс']
  .forEach(s => { const [en, ru, e] = s.split(':'); w(en.toLowerCase(), en, ru, e); });
// Дом
w('house', 'house', 'дом', '🏠'); w('kitchen', 'kitchen', 'кухня', '🍳'); w('bedroom', 'bedroom', 'спальня', '🛌');
w('bathroom', 'bathroom', 'ванная', '🛁'); w('garden', 'garden', 'сад', '🌻'); w('key', 'key', 'ключ', '🔑');
// Мебель
w('chair', 'chair', 'стул', '🪑'); w('sofa', 'sofa', 'диван', '🛋️'); w('bed', 'bed', 'кровать', '🛏️');
w('lamp', 'lamp', 'лампа', '💡'); w('tv', 'TV', 'телевизор', '📺'); w('clock', 'clock', 'часы', '🕰️'); w('mirror', 'mirror', 'зеркало', '🪞');
// Хобби
w('swim', 'swim', 'плавать', '🏊'); w('run', 'run', 'бегать', '🏃'); w('jump', 'jump', 'прыгать', '🤸');
w('dance', 'dance', 'танцевать', '💃'); w('sing', 'sing', 'петь', '🎤'); w('draw', 'draw', 'рисовать', '🎨'); w('play', 'play', 'играть', '🎮');
// Зоопарк
w('elephant', 'elephant', 'слон', '🐘'); w('giraffe', 'giraffe', 'жираф', '🦒'); w('tiger', 'tiger', 'тигр', '🐯');
w('bear', 'bear', 'медведь', '🐻'); w('snake', 'snake', 'змея', '🐍'); w('parrot', 'parrot', 'попугай', '🦜');
w('crocodile', 'crocodile', 'крокодил', '🐊'); w('panda', 'panda', 'панда', '🐼');
// Еда
w('sandwich', 'sandwich', 'бутерброд', '🥪'); w('soup', 'soup', 'суп', '🍲'); w('rice', 'rice', 'рис', '🍚');
w('chicken', 'chicken', 'курица', '🍗'); w('chocolate', 'chocolate', 'шоколад', '🍫'); w('cheese', 'cheese', 'сыр', '🧀');
w('tomato', 'tomato', 'помидор', '🍅'); w('potato', 'potato', 'картошка', '🥔');
// Чувства
w('happy', 'happy', 'счастливый', '😀'); w('sad', 'sad', 'грустный', '😢'); w('angry', 'angry', 'злой', '😠');
w('tired', 'tired', 'уставший', '😴'); w('scared', 'scared', 'испуганный', '😱'); w('hot', 'hot', 'жарко', '🥵');
w('cold', 'cold', 'холодно', '🥶'); w('surprised', 'surprised', 'удивлённый', '😲');
// Времена года и погода
w('winter', 'winter', 'зима', '❄️'); w('spring', 'spring', 'весна', '🌷'); w('summer', 'summer', 'лето', '🏖️');
w('autumn', 'autumn', 'осень', '🍂'); w('sunny', 'sunny', 'солнечно', '🌤️'); w('rainy', 'rainy', 'дождливо', '🌧️');
w('windy', 'windy', 'ветрено', '💨'); w('snowy', 'snowy', 'снежно', '☃️');
// Профессии
w('doctor', 'doctor', 'врач', '🧑‍⚕️'); w('cook', 'cook', 'повар', '🧑‍🍳'); w('pilot', 'pilot', 'пилот', '🧑‍✈️');
w('farmer', 'farmer', 'фермер', '🧑‍🌾'); w('policeman', 'policeman', 'полицейский', '👮');
w('astronaut', 'astronaut', 'космонавт', '🧑‍🚀'); w('artist', 'artist', 'художник', '🧑‍🎨');

const LESSONS2 = [
  { id: 21, title: 'Школа блоков', icon: '🏫', words: ['pen', 'pencil', 'book', 'bag', 'ruler', 'school', 'teacher', 'scissors'],
    story: 'Забывака вернулся и перепутал всё в школе! Верни названия школьных вещей.',
    sents: [{ en: 'This is my book.', ru: 'Это моя книга.' }, { en: 'I have a pencil.', ru: 'У меня есть карандаш.' }, { en: 'She is my teacher.', ru: 'Она моя учительница.' }] },
  { id: 22, title: 'Календарь шахтёра', icon: '📅', words: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    story: 'Забывака разорвал календарь. Собери дни недели по порядку!',
    sents: [{ en: 'Today is Monday.', ru: 'Сегодня понедельник.' }, { en: 'I like Saturday.', ru: 'Я люблю субботу.' }, { en: 'Sunday is a happy day.', ru: 'Воскресенье — весёлый день.' }] },
  { id: 23, title: 'Мост «Я есть»', icon: '🌉', type: 'gram',
    story: 'Мост через лаву держится на маленьких словах am, is, are. Поставь их на место!',
    rule: { title: 'am / is / are — «быть»', html: '<ul><li><b>I am</b> — я</li><li><b>he / she / it is</b> — он / она / оно</li><li><b>we / you / they are</b> — мы / вы / они</li></ul>' ,
      ex: [['I am a robot.', 'Я — робот.'], ['She is my mum.', 'Она — моя мама.'], ['They are friends.', 'Они — друзья.']] },
    gaps: [
      { en: 'I ___ a robot.', ans: 'am', opts: ['am', 'is', 'are'], ru: 'Я — робот.' },
      { en: 'He ___ my brother.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Он — мой брат.' },
      { en: 'We ___ friends.', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Мы — друзья.' },
      { en: 'She ___ a teacher.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Она — учитель.' },
      { en: 'They ___ happy.', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Они счастливы.' },
      { en: 'It ___ a cat.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Это кошка.' },
      { en: 'You ___ my friend.', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Ты — мой друг.' },
      { en: 'I ___ nine.', ans: 'am', opts: ['am', 'is', 'are'], ru: 'Мне девять.' }],
    sents: [{ en: 'I am a robot.', ru: 'Я — робот.' }, { en: 'She is my mum.', ru: 'Она — моя мама.' }, { en: 'We are friends.', ru: 'Мы — друзья.' }, { en: 'They are in the garden.', ru: 'Они в саду.' }] },
  { id: 24, title: 'Домик в лесу', icon: '🏡', words: ['house', 'kitchen', 'bedroom', 'bathroom', 'garden', 'key'],
    story: 'Ты нашёл большой дом. Но двери закрыты — нужно назвать комнаты!',
    sents: [{ en: 'This is my house.', ru: 'Это мой дом.' }, { en: 'I am in the garden.', ru: 'Я в саду.' }, { en: 'Mum is in the kitchen.', ru: 'Мама на кухне.' }] },
  { id: 25, title: 'Мебельная мастерская', icon: '🛋️', words: ['chair', 'sofa', 'bed', 'lamp', 'tv', 'clock', 'mirror'],
    story: 'В мастерской роботы делают мебель. Помоги им с названиями!',
    sents: [{ en: 'This is my bed.', ru: 'Это моя кровать.' }, { en: 'I am on the sofa.', ru: 'Я на диване.' }, { en: 'Look at the clock.', ru: 'Посмотри на часы.' }] },
  { id: 26, title: 'Башня «Где что лежит»', icon: '🗼', type: 'gram',
    story: 'В башне всё разбросано. Скажи, где что лежит: in, on, under — и сколько предметов: is или are.',
    rule: { title: 'there is / there are, in / on / under', html: '<ul><li><b>There is</b> — есть один предмет</li><li><b>There are</b> — есть много предметов</li><li><b>in</b> — в, <b>on</b> — на, <b>under</b> — под</li></ul>',
      ex: [['There is a cat on the bed.', 'На кровати есть кошка.'], ['There are two books.', 'Там две книги.'], ['The ball is under the chair.', 'Мяч под стулом.']] },
    gaps: [
      { en: 'There ___ a lamp in the room.', ans: 'is', opts: ['is', 'are'], ru: 'В комнате есть лампа.' },
      { en: 'There ___ two beds.', ans: 'are', opts: ['is', 'are'], ru: 'Там две кровати.' },
      { en: 'There ___ three cats.', ans: 'are', opts: ['is', 'are'], ru: 'Там три кошки.' },
      { en: 'There ___ a TV.', ans: 'is', opts: ['is', 'are'], ru: 'Там есть телевизор.' },
      { en: 'The cat is ___ the box.', ans: 'under', opts: ['in', 'on', 'under'], ru: 'Кошка ПОД коробкой.' },
      { en: 'The book is ___ the desk.', ans: 'on', opts: ['in', 'on', 'under'], ru: 'Книга НА столе.' },
      { en: 'The fish is ___ the water.', ans: 'in', opts: ['in', 'on', 'under'], ru: 'Рыба В воде.' },
      { en: 'The ball is ___ the bed.', ans: 'under', opts: ['in', 'on', 'under'], ru: 'Мяч ПОД кроватью.' }],
    sents: [{ en: 'There is a cat on the bed.', ru: 'На кровати есть кошка.' }, { en: 'There are two books.', ru: 'Там две книги.' }, { en: 'The ball is under the chair.', ru: 'Мяч под стулом.' }, { en: 'The robot is in the box.', ru: 'Робот в коробке.' }] },
  { id: 27, title: 'Арена героев', icon: '🏟️', words: ['swim', 'run', 'jump', 'dance', 'sing', 'draw', 'play'],
    story: 'На арене проходят соревнования! Узнай, что умеют делать участники.',
    sents: [{ en: 'I can swim.', ru: 'Я умею плавать.' }, { en: 'She can dance.', ru: 'Она умеет танцевать.' }, { en: 'We can run and jump.', ru: 'Мы умеем бегать и прыгать.' }] },
  { id: 28, title: 'Мост «Могу — не могу»', icon: '🧗', type: 'gram',
    story: 'Стражи пропускают только тех, кто знает, что можно и что нельзя: can и can\'t!',
    rule: { title: 'can / can\'t — «могу / не могу»', html: '<ul><li><b>can</b> — умею, могу</li><li><b>can\'t</b> — не умею, не могу</li><li>После can глагол без изменений: I can swim.</li></ul>',
      ex: [['I can swim.', 'Я умею плавать.'], ['A fish can\'t fly.', 'Рыба не умеет летать.'], ['Can you jump?', 'Ты умеешь прыгать?']] },
    gaps: [
      { en: 'Birds ___ fly.', ans: 'can', opts: ['can', "can't"], ru: 'Птицы умеют летать.' },
      { en: 'Fish ___ fly.', ans: "can't", opts: ['can', "can't"], ru: 'Рыбы не умеют летать.' },
      { en: 'Robots ___ run.', ans: 'can', opts: ['can', "can't"], ru: 'Роботы умеют бегать.' },
      { en: 'A pig ___ fly.', ans: "can't", opts: ['can', "can't"], ru: 'Свинья не умеет летать.' },
      { en: 'Elephants ___ swim.', ans: 'can', opts: ['can', "can't"], ru: 'Слоны умеют плавать.' },
      { en: 'A mouse ___ drive a car.', ans: "can't", opts: ['can', "can't"], ru: 'Мышь не умеет водить машину.' },
      { en: 'I ___ dance.', ans: 'can', opts: ['can', "can't"], ru: 'Я умею танцевать.' }],
    sents: [{ en: 'I can swim.', ru: 'Я умею плавать.' }, { en: "She can't run.", ru: 'Она не умеет бегать.' }, { en: 'Robots can dance.', ru: 'Роботы умеют танцевать.' }, { en: 'Can you jump?', ru: 'Ты умеешь прыгать?' }] },
  { id: 29, title: 'Зоопарк кубов', icon: '🦒', words: ['elephant', 'giraffe', 'tiger', 'bear', 'snake', 'parrot', 'crocodile', 'panda'],
    story: 'Звери в зоопарке разбежались! Назови каждого, чтобы вернуть в вольер.',
    sents: [{ en: 'I see a tiger.', ru: 'Я вижу тигра.' }, { en: 'I like parrots.', ru: 'Я люблю попугаев.' }, { en: 'Look at the elephant.', ru: 'Посмотри на слона.' }] },
  { id: 30, title: 'Башня «Есть у меня»', icon: '🧰', type: 'gram',
    story: 'В башне хранятся сокровища. Скажи, у кого что есть: have got или has got.',
    rule: { title: 'have got / has got — «у меня есть»', html: '<ul><li><b>I, you, we, they have got</b></li><li><b>he, she, it has got</b></li></ul>',
      ex: [['I have got a robot.', 'У меня есть робот.'], ['He has got a bike.', 'У него есть велосипед.'], ['We have got a cat.', 'У нас есть кошка.']] },
    gaps: [
      { en: 'I ___ got a dog.', ans: 'have', opts: ['have', 'has'], ru: 'У меня есть собака.' },
      { en: 'She ___ got a bike.', ans: 'has', opts: ['have', 'has'], ru: 'У неё есть велосипед.' },
      { en: 'We ___ got a house.', ans: 'have', opts: ['have', 'has'], ru: 'У нас есть дом.' },
      { en: 'He ___ got a robot.', ans: 'has', opts: ['have', 'has'], ru: 'У него есть робот.' },
      { en: 'They ___ got two cats.', ans: 'have', opts: ['have', 'has'], ru: 'У них две кошки.' },
      { en: 'It ___ got four legs.', ans: 'has', opts: ['have', 'has'], ru: 'У него четыре лапы.' },
      { en: 'My mum ___ got a car.', ans: 'has', opts: ['have', 'has'], ru: 'У моей мамы есть машина.' },
      { en: 'You ___ got a pen.', ans: 'have', opts: ['have', 'has'], ru: 'У тебя есть ручка.' }],
    sents: [{ en: 'I have got a robot.', ru: 'У меня есть робот.' }, { en: 'He has got a bike.', ru: 'У него есть велосипед.' }, { en: 'We have got a cat.', ru: 'У нас есть кошка.' }, { en: 'She has got blue eyes.', ru: 'У неё голубые глаза.' }] },
  { id: 31, title: 'Кафе «Крафт»', icon: '🍲', words: ['sandwich', 'soup', 'rice', 'chicken', 'chocolate', 'cheese', 'tomato', 'potato'],
    story: 'В кафе пахнет вкусно, но меню забыто. Помоги повару!',
    sents: [{ en: 'I like chicken.', ru: 'Я люблю курицу.' }, { en: "I don't like soup.", ru: 'Я не люблю суп.' }, { en: 'He likes cheese.', ru: 'Он любит сыр.' }] },
  { id: 32, title: 'Крепость «Люблю — не люблю»', icon: '🏯', type: 'gram',
    story: 'Забывака путает глаголы! Добавь -s, где нужно, и найди don\'t или doesn\'t.',
    rule: { title: 'Present Simple — «что я делаю обычно»', html: '<ul><li>I / you / we / they: <b>like</b></li><li>he / she / it: <b>likes</b> (добавляем -s)</li><li>Не люблю: <b>I don\'t like</b>, <b>she doesn\'t like</b></li><li>Вопрос: <b>Do</b> you like…? <b>Does</b> he like…?</li></ul>',
      ex: [['I like pizza.', 'Я люблю пиццу.'], ['She likes milk.', 'Она любит молоко.'], ["I don't like soup.", 'Я не люблю суп.'], ['Does he like cats?', 'Он любит кошек?']] },
    gaps: [
      { en: 'I ___ pizza.', ans: 'like', opts: ['like', 'likes'], ru: 'Я люблю пиццу.' },
      { en: 'She ___ milk.', ans: 'likes', opts: ['like', 'likes'], ru: 'Она любит молоко.' },
      { en: 'He ___ to school.', ans: 'goes', opts: ['go', 'goes'], ru: 'Он ходит в школу.' },
      { en: 'We ___ English.', ans: 'learn', opts: ['learn', 'learns'], ru: 'Мы учим английский.' },
      { en: 'The cat ___ fish.', ans: 'eats', opts: ['eat', 'eats'], ru: 'Кошка ест рыбу.' },
      { en: 'I ___ like soup.', ans: "don't", opts: ["don't", "doesn't"], ru: 'Я не люблю суп.' },
      { en: 'She ___ like cheese.', ans: "doesn't", opts: ["don't", "doesn't"], ru: 'Она не любит сыр.' },
      { en: '___ you like cats?', ans: 'Do', opts: ['Do', 'Does'], ru: 'Ты любишь кошек?' },
      { en: '___ he like pizza?', ans: 'Does', opts: ['Do', 'Does'], ru: 'Он любит пиццу?' }],
    sents: [{ en: 'I like pizza.', ru: 'Я люблю пиццу.' }, { en: 'She likes milk.', ru: 'Она любит молоко.' }, { en: "I don't like soup.", ru: 'Я не люблю суп.' }, { en: 'Does he like cats?', ru: 'Он любит кошек?' }] },
  { id: 33, title: 'Деревня настроений', icon: '😀', words: ['happy', 'sad', 'angry', 'tired', 'scared', 'hot', 'cold', 'surprised'],
    story: 'Жители деревни забыли, как сказать о чувствах. Подскажи им!',
    sents: [{ en: 'I am happy.', ru: 'Я счастлив.' }, { en: 'She is sad.', ru: 'Она грустная.' }, { en: 'We are tired.', ru: 'Мы устали.' }] },
  { id: 34, title: 'Четыре сезона', icon: '🍂', words: ['winter', 'spring', 'summer', 'autumn', 'sunny', 'rainy', 'windy', 'snowy'],
    story: 'Забывака перепутал времена года и погоду. Расставь по местам!',
    sents: [{ en: 'It is winter.', ru: 'Сейчас зима.' }, { en: 'It is sunny today.', ru: 'Сегодня солнечно.' }, { en: 'I like summer.', ru: 'Я люблю лето.' }] },
  { id: 35, title: 'Космодром профессий', icon: '🚀', words: ['doctor', 'cook', 'pilot', 'farmer', 'policeman', 'astronaut', 'artist'],
    story: 'На космодроме работают разные герои. Кто есть кто?',
    sents: [{ en: 'My dad is a doctor.', ru: 'Мой папа — врач.' }, { en: 'I am an astronaut.', ru: 'Я — космонавт.' }, { en: 'She is a pilot.', ru: 'Она — пилот.' }] }
];

const BOSS2 = { id: 40, title: 'Крепость Путаницы', icon: '🏯', bossIcon: '👹' };

const WORLDS = [
  { name: 'Мир 1 · 2 класс', lessons: LESSONS, boss: BOSS },
  { name: 'Мир 2 · 3 класс', lessons: LESSONS2, boss: BOSS2 }
];
