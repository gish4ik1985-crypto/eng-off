// Мир 3 (4 класс, по мотивам Spotlight 4). Слова, грамматика и чтение текстов.
// type:'gram' — правило + пропуски + сборка предложений.
// type:'read' — текст (text:[{en,ru}]) + вопросы qs (те же поля, что у пропусков, но без ___) + сборка предложений.

// Страны
w('russia', 'Russia', 'Россия', '🥞'); w('england', 'England', 'Англия', '🎡'); w('france', 'France', 'Франция', '🗼');
w('america', 'America', 'Америка', '🗽'); w('egypt', 'Egypt', 'Египет', '🔺'); w('japan', 'Japan', 'Япония', '🗻'); w('china', 'China', 'Китай', '🥢');
// Город
w('shop', 'shop', 'магазин', '🏪'); w('park', 'park', 'парк', '🎠'); w('hospital', 'hospital', 'больница', '🏥');
w('bank', 'bank', 'банк', '🏦'); w('cinema', 'cinema', 'кино', '🎬'); w('museum', 'museum', 'музей', '🏛️'); w('bridge', 'bridge', 'мост', '🌉');
// Транспорт
w('bus', 'bus', 'автобус', '🚌'); w('plane', 'plane', 'самолёт', '✈️'); w('ship', 'ship', 'корабль', '🚢'); w('taxi', 'taxi', 'такси', '🚕');
w('metro', 'metro', 'метро', '🚇'); w('helicopter', 'helicopter', 'вертолёт', '🚁'); w('rocket', 'rocket', 'ракета', '🚀');
// Распорядок дня
w('breakfast', 'breakfast', 'завтрак', '🥣'); w('lunch', 'lunch', 'обед', '🥗'); w('dinner', 'dinner', 'ужин', '🍽️');
w('homework', 'homework', 'домашнее задание', '📝'); w('sleep', 'sleep', 'спать', '💤'); w('wash', 'wash', 'мыть', '🧼');
w('brush', 'brush', 'чистить', '🪥'); w('walk', 'walk', 'идти пешком', '🚶');
// Праздники
w('birthday', 'birthday', 'день рождения', '🎂'); w('present', 'present', 'подарок', '🎁'); w('party', 'party', 'вечеринка', '🎉');
w('christmas', 'Christmas', 'Рождество', '🎄'); w('fireworks', 'fireworks', 'салют', '🎆'); w('balloon', 'balloon', 'воздушный шар', '🎈'); w('candle', 'candle', 'свеча', '🕯️');
// Природа
w('mountain', 'mountain', 'гора', '⛰️'); w('river', 'river', 'река', '🏞️'); w('forest', 'forest', 'лес', '🌲'); w('sea', 'sea', 'море', '🌊');
w('island', 'island', 'остров', '🏝️'); w('desert', 'desert', 'пустыня', '🏜️'); w('volcano', 'volcano', 'вулкан', '🌋');

const LESSONS3 = [
  { id: 41, title: 'Остров стран', icon: '🌍', words: ['russia', 'england', 'france', 'america', 'egypt', 'japan', 'china'],
    story: 'Забывака спрятал названия стран. Отправляйся в кругосветное путешествие!',
    sents: [{ en: 'I live in Russia.', ru: 'Я живу в России.' }, { en: 'London is in England.', ru: 'Лондон находится в Англии.' }, { en: 'I want to go to Japan.', ru: 'Я хочу поехать в Японию.' }] },
  { id: 42, title: 'Город из блоков', icon: '🏙️', words: ['shop', 'park', 'hospital', 'bank', 'cinema', 'museum', 'bridge'],
    story: 'Ты строишь большой город. Подпиши все здания!',
    sents: [{ en: 'The park is big.', ru: 'Парк большой.' }, { en: 'I go to the cinema.', ru: 'Я хожу в кино.' }, { en: 'The museum is near the bridge.', ru: 'Музей рядом с мостом.' }] },
  { id: 43, title: 'Станция транспорта', icon: '🚉', words: ['bus', 'plane', 'ship', 'taxi', 'metro', 'helicopter', 'rocket'],
    story: 'На станции стоит весь транспорт. На чём отправимся дальше?',
    sents: [{ en: 'I go by bus.', ru: 'Я езжу на автобусе.' }, { en: 'We go by plane.', ru: 'Мы летим на самолёте.' }, { en: 'The rocket is fast.', ru: 'Ракета быстрая.' }] },
  { id: 44, title: 'Лаборатория «Сейчас»', icon: '🔬', type: 'gram',
    story: 'В лаборатории всё происходит прямо сейчас! Расскажи, кто что делает: am / is / are + -ing.',
    rule: { title: 'Present Continuous — «что происходит сейчас»', html: '<ul><li><b>am / is / are + глагол с -ing</b></li><li>I <b>am reading</b> — я (сейчас) читаю</li><li>She <b>is playing</b> — она (сейчас) играет</li><li>They <b>are running</b> — они (сейчас) бегут</li></ul>',
      ex: [['I am reading a book.', 'Я читаю книгу (сейчас).'], ['She is playing football.', 'Она играет в футбол.'], ['They are running.', 'Они бегут.']] },
    gaps: [
      { en: 'She is ___ a book.', ans: 'reading', opts: ['reading', 'reads', 'read'], ru: 'Она сейчас читает книгу.' },
      { en: 'They are ___ football.', ans: 'playing', opts: ['playing', 'plays', 'play'], ru: 'Они сейчас играют в футбол.' },
      { en: 'I am ___ now.', ans: 'sleeping', opts: ['sleeping', 'sleeps', 'sleep'], ru: 'Я сейчас сплю.' },
      { en: 'He ___ running.', ans: 'is', opts: ['am', 'is', 'are'], ru: 'Он бежит.' },
      { en: 'We ___ swimming.', ans: 'are', opts: ['am', 'is', 'are'], ru: 'Мы плывём.' },
      { en: 'Look! The cat is ___.', ans: 'jumping', opts: ['jumping', 'jumps', 'jump'], ru: 'Смотри! Кошка прыгает.' },
      { en: 'I ___ drawing a robot.', ans: 'am', opts: ['am', 'is', 'are'], ru: 'Я рисую робота.' },
      { en: 'The robots are ___.', ans: 'dancing', opts: ['dancing', 'dances', 'dance'], ru: 'Роботы танцуют.' }],
    sents: [{ en: 'I am reading a book.', ru: 'Я читаю книгу.' }, { en: 'She is playing football.', ru: 'Она играет в футбол.' }, { en: 'They are running.', ru: 'Они бегут.' }, { en: 'What are you doing?', ru: 'Что ты делаешь?' }] },
  { id: 45, title: 'День робота', icon: '⏰', words: ['breakfast', 'lunch', 'dinner', 'homework', 'sleep', 'wash', 'brush', 'walk'],
    story: 'Робот Болт расписывает свой день. Помоги ему с делами!',
    sents: [{ en: 'I eat breakfast.', ru: 'Я ем завтрак.' }, { en: 'I do my homework.', ru: 'Я делаю домашнее задание.' }, { en: 'I brush my teeth.', ru: 'Я чищу зубы.' }] },
  { id: 46, title: 'Башня часов', icon: '🕰️', type: 'gram',
    story: 'Часы на башне остановились! Скажи, который час, и они пойдут снова.',
    rule: { title: 'Который час?', html: '<ul><li><b>seven o\'clock</b> — ровно семь</li><li><b>half past eight</b> — половина девятого (8:30)</li><li><b>quarter past nine</b> — 9:15</li><li><b>quarter to ten</b> — без четверти десять (9:45)</li></ul>',
      ex: [["It is seven o'clock.", 'Сейчас ровно семь.'], ['It is half past eight.', 'Половина девятого.'], ['What time is it?', 'Который час?']] },
    gaps: [
      { en: 'It is seven ___.', ans: "o'clock", opts: ["o'clock", 'past', 'to'], ru: 'Сейчас ровно семь часов.' },
      { en: 'It is half ___ eight.', ans: 'past', opts: ['past', 'to', "o'clock"], ru: 'Половина девятого (8:30).' },
      { en: 'It is quarter ___ nine.', ans: 'past', opts: ['past', 'to'], ru: 'Четверть десятого (9:15).' },
      { en: 'It is quarter ___ ten.', ans: 'to', opts: ['past', 'to'], ru: 'Без четверти десять (9:45).' },
      { en: 'I get up at six ___.', ans: "o'clock", opts: ["o'clock", 'past', 'to'], ru: 'Я встаю в шесть часов.' },
      { en: 'What ___ is it?', ans: 'time', opts: ['time', 'day', 'old'], ru: 'Который час?' },
      { en: 'It is five ___ three.', ans: 'past', opts: ['past', 'to'], ru: 'Пять минут четвёртого (3:05).' }],
    sents: [{ en: "It is seven o'clock.", ru: 'Сейчас семь часов.' }, { en: 'I get up at seven.', ru: 'Я встаю в семь.' }, { en: 'What time is it?', ru: 'Который час?' }, { en: 'School starts at eight.', ru: 'Школа начинается в восемь.' }] },
  { id: 47, title: 'Портал «Вчера»', icon: '🌀', type: 'gram',
    story: 'Забывака открыл портал в прошлое! Чтобы пройти, нужно сказать, где ты был: was или were.',
    rule: { title: 'was / were — «был, была, были»', html: '<ul><li><b>I, he, she, it was</b></li><li><b>you, we, they were</b></li><li>Это прошедшее время от am / is / are</li></ul>',
      ex: [['I was at school yesterday.', 'Вчера я был в школе.'], ['They were happy.', 'Они были счастливы.'], ['Were you at home?', 'Ты был дома?']] },
    gaps: [
      { en: 'I ___ at school yesterday.', ans: 'was', opts: ['was', 'were'], ru: 'Вчера я был в школе.' },
      { en: 'They ___ happy.', ans: 'were', opts: ['was', 'were'], ru: 'Они были счастливы.' },
      { en: 'She ___ tired.', ans: 'was', opts: ['was', 'were'], ru: 'Она была уставшей.' },
      { en: 'We ___ in the park.', ans: 'were', opts: ['was', 'were'], ru: 'Мы были в парке.' },
      { en: 'It ___ cold yesterday.', ans: 'was', opts: ['was', 'were'], ru: 'Вчера было холодно.' },
      { en: 'You ___ late.', ans: 'were', opts: ['was', 'were'], ru: 'Ты опоздал.' },
      { en: 'The robots ___ in the box.', ans: 'were', opts: ['was', 'were'], ru: 'Роботы были в коробке.' },
      { en: 'He ___ at home.', ans: 'was', opts: ['was', 'were'], ru: 'Он был дома.' }],
    sents: [{ en: 'I was at school.', ru: 'Я был в школе.' }, { en: 'They were happy.', ru: 'Они были счастливы.' }, { en: 'It was cold yesterday.', ru: 'Вчера было холодно.' }, { en: 'Were you at home?', ru: 'Ты был дома?' }] },
  { id: 48, title: 'Кузница «Сделал вчера»', icon: '⚒️', type: 'gram',
    story: 'Кузнец рассказывает, что он делал вчера. Добавь к глаголам -ed!',
    rule: { title: 'Past Simple — правильные глаголы', html: '<ul><li>К глаголу добавляем <b>-ed</b>: play → <b>played</b>, cook → <b>cooked</b></li><li>Не делал: <b>didn\'t</b> + глагол (I <b>didn\'t play</b>)</li><li>Вопрос: <b>Did</b> you play…?</li></ul>',
      ex: [['I played football yesterday.', 'Вчера я играл в футбол.'], ['She cooked a cake.', 'Она испекла торт.'], ["I didn't play yesterday.", 'Вчера я не играл.']] },
    gaps: [
      { en: 'Yesterday I ___ football.', ans: 'played', opts: ['play', 'played', 'plays'], ru: 'Вчера я играл в футбол.' },
      { en: 'She ___ a cake.', ans: 'cooked', opts: ['cook', 'cooked', 'cooks'], ru: 'Она приготовила торт.' },
      { en: 'We ___ TV.', ans: 'watched', opts: ['watch', 'watched', 'watches'], ru: 'Мы смотрели телевизор.' },
      { en: 'He ___ to music.', ans: 'listened', opts: ['listen', 'listened', 'listens'], ru: 'Он слушал музыку.' },
      { en: 'I ___ the door.', ans: 'opened', opts: ['open', 'opened', 'opens'], ru: 'Я открыл дверь.' },
      { en: 'I ___ play yesterday.', ans: "didn't", opts: ["didn't", "don't"], ru: 'Вчера я не играл.' },
      { en: '___ you watch TV?', ans: 'Did', opts: ['Did', 'Do'], ru: 'Ты смотрел телевизор?' },
      { en: 'She ___ like the film.', ans: "didn't", opts: ["didn't", "doesn't"], ru: 'Ей не понравился фильм.' }],
    sents: [{ en: 'I played football yesterday.', ru: 'Вчера я играл в футбол.' }, { en: 'She cooked a cake.', ru: 'Она испекла торт.' }, { en: 'We watched TV.', ru: 'Мы смотрели телевизор.' }, { en: 'Did you play?', ru: 'Ты играл?' }] },
  { id: 49, title: 'Ворота «Особые глаголы»', icon: '🚪', type: 'gram',
    story: 'У ворот стоят хитрые глаголы. У них своё прошедшее время — просто запомни его!',
    rule: { title: 'Неправильные глаголы', html: '<ul><li>go → <b>went</b>, eat → <b>ate</b>, see → <b>saw</b></li><li>have → <b>had</b>, get → <b>got</b>, buy → <b>bought</b></li><li>make → <b>made</b></li></ul>',
      ex: [['I went to the zoo.', 'Я ходил в зоопарк.'], ['She ate an apple.', 'Она съела яблоко.'], ['We saw a tiger.', 'Мы видели тигра.']] },
    gaps: [
      { en: 'Yesterday I ___ to school.', ans: 'went', opts: ['go', 'went', 'goed'], ru: 'Вчера я ходил в школу.' },
      { en: 'She ___ an apple.', ans: 'ate', opts: ['eat', 'ate', 'eated'], ru: 'Она съела яблоко.' },
      { en: 'We ___ a big tiger.', ans: 'saw', opts: ['see', 'saw', 'seed'], ru: 'Мы видели большого тигра.' },
      { en: 'He ___ a new bike.', ans: 'bought', opts: ['buy', 'bought', 'buyed'], ru: 'Он купил новый велосипед.' },
      { en: 'I ___ a great time.', ans: 'had', opts: ['have', 'had', 'haved'], ru: 'Я отлично провёл время.' },
      { en: 'They ___ up at seven.', ans: 'got', opts: ['get', 'got', 'getted'], ru: 'Они встали в семь.' },
      { en: 'Mum ___ pizza.', ans: 'made', opts: ['make', 'made', 'maked'], ru: 'Мама сделала пиццу.' }],
    sents: [{ en: 'I went to the zoo.', ru: 'Я ходил в зоопарк.' }, { en: 'She ate an apple.', ru: 'Она съела яблоко.' }, { en: 'We saw a tiger.', ru: 'Мы видели тигра.' }, { en: 'He bought a bike.', ru: 'Он купил велосипед.' }] },
  { id: 50, title: 'Праздничная площадь', icon: '🎉', words: ['birthday', 'present', 'party', 'christmas', 'fireworks', 'balloon', 'candle'],
    story: 'Забывака украл праздник! Верни подарки, шарики и салют.',
    sents: [{ en: 'Happy birthday!', ru: 'С днём рождения!' }, { en: 'I like parties.', ru: 'Я люблю вечеринки.' }, { en: 'I get presents at Christmas.', ru: 'Я получаю подарки на Рождество.' }] },
  { id: 51, title: 'Дикая природа', icon: '🌋', words: ['mountain', 'river', 'forest', 'sea', 'island', 'desert', 'volcano'],
    story: 'Забывака стёр с карты горы и реки. Верни природу!',
    sents: [{ en: 'The mountain is high.', ru: 'Гора высокая.' }, { en: 'I see a river.', ru: 'Я вижу реку.' }, { en: 'There is a volcano on the island.', ru: 'На острове есть вулкан.' }] },
  { id: 52, title: 'Арена «Больше — меньше»', icon: '⚖️', type: 'gram',
    story: 'На арене всё сравнивают: кто больше, кто быстрее, кто лучше всех!',
    rule: { title: 'Сравнение прилагательных', html: '<ul><li>Сравнить: <b>big → bigger than</b> (больше чем)</li><li>Самый-самый: <b>the biggest</b></li><li>Особые: good → <b>better</b> → <b>the best</b></li></ul>',
      ex: [['An elephant is bigger than a mouse.', 'Слон больше мыши.'], ['He is the tallest boy.', 'Он самый высокий мальчик.'], ['This is the best pizza.', 'Это лучшая пицца.']] },
    gaps: [
      { en: 'An elephant is ___ than a mouse.', ans: 'bigger', opts: ['big', 'bigger', 'biggest'], ru: 'Слон больше мыши.' },
      { en: 'The mouse is ___ than the cat.', ans: 'smaller', opts: ['small', 'smaller', 'smallest'], ru: 'Мышь меньше кошки.' },
      { en: 'A giraffe is the ___ animal.', ans: 'tallest', opts: ['tall', 'taller', 'tallest'], ru: 'Жираф — самое высокое животное.' },
      { en: 'Summer is ___ than winter.', ans: 'warmer', opts: ['warm', 'warmer', 'warmest'], ru: 'Лето теплее зимы.' },
      { en: 'A rocket is ___ than a bus.', ans: 'faster', opts: ['fast', 'faster', 'fastest'], ru: 'Ракета быстрее автобуса.' },
      { en: 'This is the ___ pizza.', ans: 'best', opts: ['good', 'better', 'best'], ru: 'Это лучшая пицца.' },
      { en: 'My robot is ___ than your robot.', ans: 'better', opts: ['good', 'better', 'best'], ru: 'Мой робот лучше твоего.' }],
    sents: [{ en: 'An elephant is bigger than a mouse.', ru: 'Слон больше мыши.' }, { en: 'Summer is warmer than winter.', ru: 'Лето теплее зимы.' }, { en: 'He is the tallest boy.', ru: 'Он самый высокий мальчик.' }, { en: 'This is the best pizza.', ru: 'Это лучшая пицца.' }] },
  { id: 53, title: 'Правила королевства', icon: '📜', type: 'gram',
    story: 'Король издал законы! Разберись, что нужно, а что нельзя: must, mustn\'t, should.',
    rule: { title: 'must / mustn\'t / should', html: '<ul><li><b>must</b> — должен (обязательно)</li><li><b>mustn\'t</b> — нельзя</li><li><b>should</b> — стоит, следует (совет)</li></ul>',
      ex: [['You must do your homework.', 'Ты должен делать уроки.'], ["You mustn't run in school.", 'В школе нельзя бегать.'], ['You should wash your hands.', 'Тебе стоит мыть руки.']] },
    gaps: [
      { en: 'You ___ do your homework.', ans: 'must', opts: ['must', "mustn't", 'should'], ru: 'Ты должен делать уроки.' },
      { en: 'You ___ cross the road at a red light.', ans: "mustn't", opts: ['must', "mustn't"], ru: 'На красный свет дорогу переходить нельзя.' },
      { en: 'You ___ wash your hands.', ans: 'should', opts: ['should', "shouldn't"], ru: 'Тебе стоит мыть руки.' },
      { en: 'We ___ be late.', ans: "mustn't", opts: ['must', "mustn't"], ru: 'Нам нельзя опаздывать.' },
      { en: 'Children ___ sleep early.', ans: 'should', opts: ['should', "shouldn't"], ru: 'Детям стоит рано ложиться спать.' },
      { en: 'You ___ run in school.', ans: "mustn't", opts: ['must', "mustn't"], ru: 'В школе нельзя бегать.' },
      { en: 'You ___ eat vegetables.', ans: 'should', opts: ['should', "shouldn't"], ru: 'Тебе стоит есть овощи.' }],
    sents: [{ en: 'You must do your homework.', ru: 'Ты должен делать уроки.' }, { en: "You mustn't run in school.", ru: 'В школе нельзя бегать.' }, { en: 'You should wash your hands.', ru: 'Тебе стоит мыть руки.' }, { en: "We mustn't be late.", ru: 'Нам нельзя опаздывать.' }] },
  { id: 54, title: 'Открытка из Египта', icon: '✉️', type: 'read',
    story: 'Прилетела открытка от друга! Прочитай её и ответь на вопросы.',
    text: [
      { en: 'Hello, Max!', ru: 'Привет, Макс!' }, { en: 'I am in Egypt.', ru: 'Я в Египте.' }, { en: 'It is hot and sunny.', ru: 'Тут жарко и солнечно.' },
      { en: 'I am on the beach with my family.', ru: 'Я на пляже с семьёй.' }, { en: 'We swim in the sea.', ru: 'Мы плаваем в море.' },
      { en: 'Yesterday we visited the pyramids.', ru: 'Вчера мы ходили к пирамидам.' }, { en: 'They were very big!', ru: 'Они были очень большие!' }, { en: 'Bye, Tom.', ru: 'Пока, Том.' }],
    qs: [
      { en: 'Where is Tom?', ans: 'In Egypt', opts: ['In Egypt', 'In Japan', 'In France'], ru: 'Где Том?' },
      { en: 'What is the weather like?', ans: 'Hot and sunny', opts: ['Hot and sunny', 'Cold and rainy', 'Windy'], ru: 'Какая там погода?' },
      { en: 'Who is Tom with?', ans: 'His family', opts: ['His family', 'His friends', 'Alone'], ru: 'С кем Том?' },
      { en: 'What did Tom visit yesterday?', ans: 'The pyramids', opts: ['The pyramids', 'A museum', 'A zoo'], ru: 'Что Том посетил вчера?' }],
    sents: [{ en: 'I am in Egypt.', ru: 'Я в Египте.' }, { en: 'We swim in the sea.', ru: 'Мы плаваем в море.' }, { en: 'They were very big.', ru: 'Они были очень большие.' }] },
  { id: 55, title: 'Рассказ робота', icon: '📖', type: 'read',
    story: 'Робот Болт рассказывает о себе. Прочитай и проверь, всё ли понял.',
    text: [
      { en: 'My name is Bolt.', ru: 'Меня зовут Болт.' }, { en: 'I am a robot.', ru: 'Я робот.' }, { en: 'I live in a big house.', ru: 'Я живу в большом доме.' },
      { en: 'Every day I get up at seven o\'clock.', ru: 'Каждый день я встаю в семь часов.' }, { en: 'I eat breakfast and go to school.', ru: 'Я завтракаю и иду в школу.' },
      { en: 'At school I learn English.', ru: 'В школе я учу английский.' }, { en: 'After school I play with my cat.', ru: 'После школы я играю с кошкой.' },
      { en: 'I go to bed at nine o\'clock.', ru: 'Я ложусь спать в девять часов.' }],
    qs: [
      { en: 'What is Bolt?', ans: 'A robot', opts: ['A robot', 'A cat', 'A teacher'], ru: 'Кто такой Болт?' },
      { en: 'When does Bolt get up?', ans: "At seven o'clock", opts: ["At seven o'clock", "At nine o'clock", "At six o'clock"], ru: 'Когда Болт встаёт?' },
      { en: 'What does Bolt learn at school?', ans: 'English', opts: ['English', 'Music', 'Art'], ru: 'Что Болт учит в школе?' },
      { en: 'Who does Bolt play with?', ans: 'His cat', opts: ['His cat', 'His dog', 'His mum'], ru: 'С кем Болт играет?' }],
    sents: [{ en: 'My name is Bolt.', ru: 'Меня зовут Болт.' }, { en: 'I live in a big house.', ru: 'Я живу в большом доме.' }, { en: 'I learn English at school.', ru: 'Я учу английский в школе.' }] }
];

const BOSS3 = { id: 60, title: 'Цитадель Забывака', icon: '🏰', bossIcon: '🧙' };
WORLDS.push({ name: 'Мир 3 · 4 класс', lessons: LESSONS3, boss: BOSS3 });
