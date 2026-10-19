/* Английский «Spotlight 3» (учебник «Английский в фокусе», 3 класс, Быкова, Дули, Поспелова, Эванс; книга лежит в books/spot3):
   мир уроков по модулям учебника. Слова взяты из Word List учебника (с. 172–177) по юнитам, грамматика — по модулям.
   Уроки идут по порядку учебника, в каждом указана страница. Если слово уже есть в игре, берётся готовое (общий прогресс).
   Файл подключается после more.js (использует помощники IS, GP, LG из it_a.js): другие миры не меняются. */
(() => {
  const slug = s => 'sp_' + s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const byEn = {}; Object.values(EN_PACK.WORDS).forEach(x => { const k = x.en.toLowerCase(); if (!byEn[k]) byEn[k] = x.id; });
  const ew = spec => {
    const [en, ru, e, L] = spec.split('|'), k = en.toLowerCase();
    if (byEn[k]) return byEn[k];
    const id = slug(en), o = { id, en, ru, e: e || '📘', L: L || '' };
    EN_PACK.WORDS[id] = o; if (typeof WORDS !== 'undefined') WORDS[id] = o; byEn[k] = id; return id;
  };
  const BK = 'spot3';
  const LWE = (id, icon, title, story, page, words, sents) => ({ id, title, icon, words: words.map(ew), story, sents: IS(sents), book: { id: BK, page } });
  const LGE = (id, icon, title, story, page, rt, rhtml, ex, gaps, sents) => Object.assign(LG(id, icon, title, story, rt, rhtml, ex, gaps, sents), { book: { id: BK, page } });

  const L = [
    /* ---------- Starter Unit (с. 4) ---------- */
    LWE(42001, '👋', 'Welcome back!', 'Лулу и Ларри вернулись в школу. Поздоровайся с ними и вспомни первые слова.', 4, ['welcome back|с возвращением|👋', 'everyone|все, каждый|👥', 'today|сегодня|📆', 'day|день|📅', 'little|маленький|🐭', 'duck|утка|🦆', 'think|думать|🤔', 'again|снова|🔁'],
      ['Welcome back, everyone!|С возвращением, все!', 'Hello! Nice to see you again!|Привет! Рад снова тебя видеть!', 'I think it is a nice day today.|Я думаю, сегодня хороший день.']),
    LWE(42002, '🎨', 'Colours and numbers', 'Раскрась мир и посчитай: цвета и числа из Starter Unit.', 4, ['red|красный|🟥', 'blue|синий|🟦', 'green|зелёный|🟩', 'yellow|жёлтый|🟨', 'pink|розовый|🩷', 'black|чёрный|⬛', 'white|белый|⬜', 'brown|коричневый|🟫'],
      ['The duck is yellow.|Утка жёлтая.', 'The pencil case is pink.|Пенал розовый.', 'What colour is the sun?|Какого цвета солнце?']),
    LWE(42003, '📞', 'Phone number', 'Спроси номер телефона нового друга.', 4, ['phone number|номер телефона|📞', 'pencil case|пенал|🎒', 'begin|начинать|▶️', 'one|один|1️⃣', 'two|два|2️⃣', 'three|три|3️⃣', 'four|четыре|4️⃣', 'five|пять|5️⃣'],
      ['What is your phone number?|Какой у тебя номер телефона?', 'Let’s begin!|Давайте начнём!', 'My phone number is five, four, three.|Мой номер телефона пять, четыре, три.']),

    /* ---------- Module 1: School days! (с. 9) ---------- */
    LWE(42004, '🎒', 'School again! (1)', 'Ларри и Лулу идут в школу. Что лежит в портфеле?', 10, ['school|школа|🏫', 'school bag|школьный портфель|🎒', 'pen|ручка|🖊️', 'pencil|карандаш|✏️', 'rubber|ластик|🧽', 'ruler|линейка|📏', 'book|книга|📖', 'pencil case|пенал|🎒'],
      ['What’s this? It’s a school bag!|Что это? Это школьный портфель!', 'I have a pen and a pencil.|У меня есть ручка и карандаш.', 'This is my ruler.|Это моя линейка.']),
    LWE(42005, '⏰', 'School again! (2)', 'Не опаздывай! Слова про время и числа.', 11, ['be late|опаздывать|⏰', 'come|приходить|🚶', 'get|получать|🎁', 'number|номер, число|🔢', 'once more|ещё раз|🔁', 'plus|плюс|➕', 'time|время|⌚'],
      ['Don’t be late for school!|Не опаздывай в школу!', 'Come here, please.|Подойди сюда, пожалуйста.', 'Two plus two is four.|Два плюс два — четыре.']),
    LGE(42006, '🌉', 'I am, you are, he is', 'Мост «Я есть»: глагол to be.', 11, 'Глагол to be: am, is, are', '<ul><li><b>I am</b> (I’m) — я</li><li><b>You are</b> (You’re) — ты, вы</li><li><b>He / She / It is</b> — он / она / оно</li></ul>Вопрос: <b>Are you…?</b> <b>Is he…?</b>',
      ['I am Maya.|Я Майя.', 'She is my friend.|Она моя подруга.', 'You are a pupil.|Ты ученик.'],
      ['I ___ Larry.|am|am/is/are|Я Ларри.', 'You ___ my friend.|are|am/is/are|Ты мой друг.', 'She ___ Lulu.|is|am/is/are|Она Лулу.', 'It ___ a duck.|is|is/are/am|Это утка.', '___ you Maya?|Are|Is/Are/Am|Ты Майя?', 'He ___ a boy.|is|am/is/are|Он мальчик.', 'I ___ in class.|am|am/are/is|Я в классе.'],
      ['I am a pupil.|Я школьник.', 'You are my friend.|Ты мой друг.']),
    LWE(42007, '📚', 'School subjects (1)', 'Расписание уроков в шахте знаний.', 14, ['Art|изобразительное искусство|🎨', 'Maths|математика|➗', 'Music|музыка|🎵', 'PE|физкультура|🏃', 'Science|естествознание|🔬', 'Geography|география|🌍', 'History|история|🏰'],
      ['I like Art.|Мне нравится ИЗО.', 'We have Maths today.|Сегодня у нас математика.', 'PE is fun!|Физкультура — это весело!']),
    LWE(42008, '🗓️', 'School subjects (2)', 'Ещё слова про школу.', 15, ['subject|школьный предмет|📚', 'object|предмет|🧸', 'year|год|📆', 'come on|смелее|👉', 'once more|ещё раз|🔁', 'school|школа|🏫'],
      ['What is your favourite subject?|Какой твой любимый предмет?', 'Come on, let’s go!|Давай, пойдём!', 'I am eight years old.|Мне восемь лет.']),
    LGE(42009, '📣', 'Give commands', 'Учитель даёт команды. Повтори их!', 16, 'Повелительное наклонение', '<ul><li><b>Sit down!</b> — Садись!</li><li><b>Stand up!</b> — Встань!</li><li><b>Open your book!</b> — Открой книгу!</li><li><b>Don’t talk!</b> — Не разговаривай!</li></ul>',
      ['Open your book!|Открой книгу!', 'Close your pencil case!|Закрой пенал!', 'Don’t run!|Не беги!'],
      ['___ down!|Sit|Sit/Sits/Sitting|Садись!', '___ up!|Stand|Stand/Stands/Standing|Встань!', '___ your book!|Open|Open/Opens/Opening|Открой книгу!', '___ run in class!|Don’t|Don’t/Doesn’t/Isn’t|Не бегай в классе!', 'Close your ___!|book|book/books/booking|Закрой книгу!', '___ the door!|Close|Close/Closes/Closing|Закрой дверь!'],
      ['Sit down, please.|Сядь, пожалуйста.', 'Open your book.|Открой книгу.']),

    /* ---------- Module 2: Family moments! (с. 25) ---------- */
    LWE(42010, '👨‍👩‍👧', 'A new member! (family)', 'Нарисуй семейное дерево: кто есть кто.', 26, ['big brother|старший брат|👦', 'little sister|младшая сестра|👧', 'family tree|родословное древо|🌳', 'of course|конечно|👍', 'mother|мама|👩', 'father|папа|👨'],
      ['This is my big brother.|Это мой старший брат.', 'She is my little sister.|Это моя младшая сестра.', 'Is this your mother? Of course!|Это твоя мама? Конечно!']),
    LWE(42011, '👵', 'A happy family!', 'Дедушки и бабушки приехали в гости!', 30, ['grandfather|дедушка|👴', 'grandmother|бабушка|👵', 'baby|малыш|👶', 'big|большой|🐘', 'small|маленький|🐜', 'tall|высокий|🦒', 'great|замечательный|🌟'],
      ['My grandmother is great!|Моя бабушка замечательная!', 'The baby is small.|Малыш маленький.', 'My father is tall.|Мой папа высокий.']),
    LGE(42012, '👤', 'My, your, his, her', 'Чьё это? Притяжательные местоимения.', 27, 'my, your, his, her', '<ul><li><b>my</b> — мой, моя</li><li><b>your</b> — твой, ваш</li><li><b>his</b> — его (мальчик)</li><li><b>her</b> — её (девочка)</li></ul>',
      ['This is my mother.|Это моя мама.', 'That is his dog.|Это его собака.', 'She is her sister.|Это её сестра.'],
      ['This is ___ mother. (я)|my|my/your/his|Это моя мама.', 'Is this ___ book? (ты)|your|my/your/her|Это твоя книга?', 'Tom has a dog. ___ dog is big.|His|His/Her/My|У Тома собака. Его собака большая.', 'Kate has a cat. ___ cat is small.|Her|His/Her/Your|У Кейт кошка. Её кошка маленькая.', 'I love ___ family. (я)|my|my/your/her|Я люблю свою семью.', '___ name is Maya. (она)|Her|His/Her/My|Её зовут Майя.'],
      ['This is my family.|Это моя семья.', 'Her name is Kate.|Её зовут Кейт.']),
    LGE(42013, '👪', 'Plurals: more than one', 'Одна книга — много книг: добавляем -s.', 31, 'Множественное число: -s', '<b>Один</b> предмет → <b>много</b>: добавь <b>-s</b>.<br>a book → books, a pen → pens, a ruler → rulers.',
      ['one pen — two pens|одна ручка — две ручки', 'a bag — bags|сумка — сумки'],
      ['one book — two ___|books|books/book/bookes|Одна книга — две книги.', 'one pen — three ___|pens|pens/pen/penes|Одна ручка — три ручки.', 'a ruler — five ___|rulers|rulers/ruler/rulerses|Линейка — пять линеек.', 'a bag — two ___|bags|bag/bags/bagses|Сумка — две сумки.', 'one cat — four ___|cats|cats/cat/cates|Одна кошка — четыре кошки.'],
      ['I have two pens.|У меня две ручки.', 'These are my books.|Это мои книги.']),

    /* ---------- Module 3: All the things I like! (с. 41) ---------- */
    LWE(42014, '🧀', 'He loves jelly!', 'Любимая еда Бетси и её друзей.', 42, ['cheese|сыр|🧀', 'chicken|курица|🍗', 'egg|яйцо|🥚', 'jelly|желе|🍮', 'lemonade|лимонад|🍋', 'cake|торт|🎂'],
      ['I like cheese.|Я люблю сыр.', 'He loves jelly!|Он обожает желе!', 'She likes lemonade.|Ей нравится лимонад.']),
    LWE(42015, '🥕', 'In my lunch box!', 'Что в твоём ланч-боксе? Хрустим и жуём!', 46, ['lunch box|коробка с завтраком|🍱', 'carrot|морковь|🥕', 'potato|картофель|🥔', 'rice|рис|🍚', 'pasta|макароны|🍝', 'sausage|сосиска|🌭', 'crunch|хрустеть|😋', 'munch|жевать|😋'],
      ['I have a carrot in my lunch box.|У меня в ланч-боксе морковь.', 'Here you are.|Вот, пожалуйста.', 'Munch, munch, crunch!|Ам-ам, хрум!']),
    LWE(42016, '🛒', 'Shopping list', 'Составь список покупок.', 47, ['shopping list|список покупок|📝', 'drink|пить|🥤', 'dry|сухой|🏜️', 'need|нуждаться|🙏', 'find out|выяснять|🔍', 'Here you are.|Вот, пожалуйста.|🤝'],
      ['I need a shopping list.|Мне нужен список покупок.', 'Let’s find out!|Давай выясним!', 'Here you are. Thank you!|Вот, пожалуйста. Спасибо!']),
    LGE(42017, '❤️', 'I like / I don’t like', 'Скажи, что нравится, а что нет.', 43, 'like / don’t like', '<ul><li><b>I like</b> cheese. — Я люблю сыр.</li><li><b>I don’t like</b> eggs. — Я не люблю яйца.</li><li><b>He / She likes</b> cake.</li><li><b>Do you like</b> jelly? — <b>Yes, I do. / No, I don’t.</b></li></ul>',
      ['I like cake.|Я люблю торт.', 'She likes jelly.|Ей нравится желе.', 'Do you like rice? Yes, I do.|Ты любишь рис? Да.'],
      ['I ___ cheese.|like|like/likes/liking|Я люблю сыр.', 'She ___ lemonade.|likes|like/likes/liking|Ей нравится лимонад.', 'I ___ like eggs.|don’t|don’t/doesn’t/isn’t|Я не люблю яйца.', '___ you like jelly?|Do|Do/Does/Are|Ты любишь желе?', 'Yes, I ___.|do|do/does/am|Да, люблю.', 'No, I ___.|don’t|don’t/doesn’t/aren’t|Нет, не люблю.'],
      ['I like cake.|Я люблю торт.', 'Do you like jelly?|Ты любишь желе?']),
    LGE(42018, '🍎', 'Do you like…? (food)', 'Закажи еду в кафе.', 48, 'Do you like…?', 'Вопрос: <b>Do you like…?</b> Ответ: <b>Yes, I do.</b> или <b>No, I don’t.</b><br>Просьба: <b>Can I have… , please?</b> — Можно мне…?',
      ['Can I have a cake, please?|Можно мне торт, пожалуйста?'],
      ['Do you like ___? (сыр)|cheese|cheese/cheeses/chees|Любишь сыр?', 'Can I ___ a cake, please?|have|have/has/having|Можно мне торт?', 'Do you like carrots? Yes, I ___.|do|do/don’t/am|Да, люблю.', 'Do you like pasta? No, I ___.|don’t|do/don’t/doesn’t|Нет, не люблю.', 'Here ___ are.|you|you/your/I|Вот, пожалуйста.'],
      ['Can I have an egg, please?|Можно мне яйцо?']),

    /* ---------- Module 4: Come in and play! (с. 57) ---------- */
    LWE(42019, '🧸', 'Toys for little Betsy!', 'В магазине игрушек: чьи это игрушки?', 58, ['aeroplane|самолёт|✈️', 'elephant|слон|🐘', 'musical box|музыкальная шкатулка|🎶', 'rocking horse|лошадка-качалка|🐴', 'tea set|чайный сервиз|🫖', 'whose|чей|❓', 'Let me see.|Дай подумать.|🤔'],
      ['Whose is this aeroplane?|Чей это самолёт?', 'It’s Betsy’s tea set.|Это чайный сервиз Бетси.', 'Let me see.|Дай подумать.']),
    LWE(42020, '🛋️', 'In my room!', 'Мебель и вещи в комнате.', 62, ['armchair|кресло|🛋️', 'computer|компьютер|💻', 'desk|парта, письменный стол|🪑', 'playroom|игровая комната|🎠', 'TV|телевизор|📺', 'car|автомобиль|🚗'],
      ['There is a computer on the desk.|На столе компьютер.', 'This is my playroom.|Это моя игровая комната.', 'The car is in the room.|Машина в комнате.']),
    LGE(42021, '👉', 'This / that, these / those', 'Показываем близко и далеко.', 59, 'this, that, these, those', '<ul><li><b>This</b> — это (рядом, один)</li><li><b>That</b> — то (далеко, один)</li><li><b>These</b> — эти (рядом, много)</li><li><b>Those</b> — те (далеко, много)</li></ul>',
      ['This is a car.|Это машина (рядом).', 'Those are cars.|То — машины (далеко).'],
      ['___ is my desk. (рядом, один)|This|This/That/These|Это мой стол.', '___ is a plane. (далеко, один)|That|This/That/Those|То — самолёт.', '___ are my books. (рядом, много)|These|These/Those/This|Это мои книги.', '___ are elephants. (далеко, много)|Those|These/Those/That|То слоны.', '___ is my teddy.|This|This/These/Those|Это мой мишка.'],
      ['This is my room.|Это моя комната.', 'Those are big elephants.|То большие слоны.']),
    LGE(42022, '👑', 'Betsy’s toy: ’s', 'Чьё это? Притяжательный падеж.', 60, 'Притяжательный падеж: ’s', 'Чтобы сказать, чей предмет, добавь <b>’s</b>: <b>Betsy’s</b> tea set — чайный сервиз <b>Бетси</b>. <b>Mum’s</b> car — машина <b>мамы</b>.<br>Вопрос: <b>Whose</b> toy is this? — Чья это игрушка?',
      ['It’s Betsy’s tea set.|Это чайный сервиз Бетси.', 'Whose car is this?|Чья это машина?'],
      ['This is ___ car. (Tom)|Tom’s|Tom/Tom’s/Toms|Это машина Тома.', 'It is ___ doll. (Kate)|Kate’s|Kate’s/Kates/Kate|Это кукла Кейт.', '___ ball is this?|Whose|Whose/Who/What|Чей это мяч?', 'This is my ___ room. (mum)|mum’s|mum/mum’s/mums|Это комната мамы.', 'The ___ toy is big. (baby)|baby’s|baby/babys/baby’s|Игрушка малыша большая.'],
      ['Whose toy is this?|Чья это игрушка?', 'It is Betsy’s toy.|Это игрушка Бетси.']),

    /* ---------- Module 5: Furry friends! (с. 73) ---------- */
    LWE(42023, '🐄', 'Cows are funny! (body)', 'Части тела: у кого какой хвост?', 74, ['body|тело|🧍', 'head|голова|🗣️', 'leg|нога|🦵', 'foot|ступня|🦶', 'mouth|рот|👄', 'tail|хвост|🐕', 'tooth|зуб|🦷', 'long|длинный|📏'],
      ['The cow has a long tail.|У коровы длинный хвост.', 'I have two feet.|У меня две ступни.', 'This is my head.|Это моя голова.']),
    LWE(42024, '🐭', 'Irregular plurals', 'Особые множественные числа: man — men, mouse — mice.', 77, ['man|мужчина|👨', 'men|мужчины|👨‍👨‍👦', 'woman|женщина|👩', 'women|женщины|👩‍👩‍👧', 'mouse|мышь|🐭', 'mice|мыши|🐁', 'feet|ступни|🦶', 'teeth|зубы|🦷', 'sheep|овца, овцы|🐑'],
      ['One mouse, two mice.|Одна мышь, две мыши.', 'The women are tall.|Женщины высокие.', 'I clean my teeth.|Я чищу зубы.']),
    LWE(42025, '🐢', 'Clever animals!', 'Умные животные и что они умеют.', 82, ['parrot|попугай|🦜', 'rabbit|кролик|🐰', 'seahorse|морской конёк|🐴', 'spider|паук|🕷️', 'tortoise|черепаха|🐢', 'crawl|ползать|🐛', 'talk|говорить|💬', 'walk|ходить|🚶'],
      ['A parrot can talk.|Попугай умеет говорить.', 'A spider can crawl.|Паук умеет ползать.', 'A tortoise can’t run.|Черепаха не умеет бегать.']),
    LGE(42026, '🐦', 'can / can’t', 'Что умеют животные?', 80, 'can / can’t — «умею / не умею»', '<ul><li><b>can</b> — умею, могу</li><li><b>can’t</b> — не умею, не могу</li><li><b>Can</b> you swim? — <b>Yes, I can. / No, I can’t.</b></li></ul>',
      ['A bird can fly.|Птица умеет летать.', 'A fish can’t run.|Рыба не умеет бегать.', 'Can you jump? Yes, I can.|Ты умеешь прыгать? Да.'],
      ['A cat ___ jump.|can|can/can’t/is|Кошка умеет прыгать.', 'A fish ___ run.|can’t|can/can’t/is|Рыба не умеет бегать.', 'A parrot ___ talk.|can|can/can’t/does|Попугай умеет говорить.', '___ you swim?|Can|Can/Do/Are|Ты умеешь плавать?', 'Yes, I ___.|can|can/can’t/do|Да, умею.', 'No, I ___.|can’t|can/can’t/don’t|Нет, не умею.'],
      ['A bird can fly.|Птица умеет летать.', 'I can swim.|Я умею плавать.']),
    LGE(42027, '🐾', 'have got / has got', 'У кого что есть? У меня есть…', 78, 'have got / has got', '<ul><li><b>I / You have got</b> — у меня / у тебя есть</li><li><b>He / She / It has got</b> — у него / у неё есть</li><li>Отрицание: <b>haven’t got / hasn’t got</b></li></ul>',
      ['I have got a cat.|У меня есть кошка.', 'She has got a long tail.|У неё длинный хвост.'],
      ['I ___ got a rabbit.|have|have/has/am|У меня есть кролик.', 'She ___ got a parrot.|has|have/has/is|У неё есть попугай.', 'The cow ___ got a tail.|has|have/has/is|У коровы есть хвост.', 'We ___ got two cats.|have|have/has/are|У нас две кошки.', 'He ___ got a dog.|hasn’t|hasn’t/haven’t/isn’t|У него нет собаки.'],
      ['I have got a pet.|У меня есть питомец.', 'It has got long legs.|У него длинные ноги.']),
    LWE(42028, '🔢', 'Numbers 11–50', 'Считаем дальше: от одиннадцати до пятидесяти.', 84, ['eleven|одиннадцать|11', 'twelve|двенадцать|12', 'fifteen|пятнадцать|15', 'eighteen|восемнадцать|18', 'twenty|двадцать|20', 'thirty|тридцать|30', 'forty|сорок|40', 'fifty|пятьдесят|50'],
      ['I am eight. My brother is twelve.|Мне восемь. Моему брату двенадцать.', 'There are twenty pupils.|Двадцать учеников.', 'Count to fifty!|Сосчитай до пятидесяти!']),

    /* ---------- Module 6: Home, sweet home! (с. 89) ---------- */
    LWE(42029, '👵', 'Grandma! Grandpa!', 'В гостях у бабушки и дедушки: где что стоит.', 90, ['behind|позади, сзади|🔙', 'in front of|перед|⬆️', 'next to|рядом, близко|↔️', 'room|комната|🚪', 'present|подарок|🎁', 'bloom|цвести|🌸'],
      ['The cat is behind the sofa.|Кошка за диваном.', 'The present is in front of you.|Подарок перед тобой.', 'The flowers bloom in spring.|Цветы цветут весной.']),
    LWE(42030, '🏠', 'My house!', 'Кухня и гостиная: назови вещи в доме.', 94, ['cooker|кухонная плита|🍳', 'cupboard|шкаф, буфет|🗄️', 'fridge|холодильник|🧊', 'mirror|зеркало|🪞', 'sofa|диван|🛋️', 'How many…?|Сколько…?|🔢'],
      ['The milk is in the fridge.|Молоко в холодильнике.', 'How many rooms are there?|Сколько там комнат?', 'There is a mirror in the room.|В комнате есть зеркало.']),
    LGE(42031, '📍', 'There is / there are', 'Что где находится?', 91, 'There is / There are', '<ul><li><b>There is</b> a sofa. — Есть (один) диван.</li><li><b>There are</b> two chairs. — Есть (много) стулья.</li><li>Вопрос: <b>Is there…? Are there…?</b></li></ul>',
      ['There is a sofa in the room.|В комнате есть диван.', 'There are two cats.|Есть две кошки.'],
      ['There ___ a fridge.|is|is/are/am|Есть холодильник.', 'There ___ two chairs.|are|is/are/am|Есть два стула.', 'There ___ a mirror in the room.|is|is/are/have|В комнате есть зеркало.', 'There ___ three cupboards.|are|is/are/has|Есть три шкафа.', '___ there a cooker?|Is|Is/Are/Do|Есть ли плита?', '___ there two beds?|Are|Is/Are/Do|Есть ли две кровати?'],
      ['There is a cat on the sofa.|На диване кошка.', 'There are two rooms.|Есть две комнаты.']),
    LGE(42032, '📦', 'Plurals: -es, -ies, -ves', 'Ещё правила множественного числа.', 98, 'Множественное число: -es, -ies, -ves', '<ul><li>-s, -ss, -sh, -ch, -x → <b>-es</b>: box — boxes, bus — buses</li><li>согласная + y → <b>-ies</b>: baby — babies</li><li>-f / -fe → <b>-ves</b>: knife — knives</li></ul>',
      ['one box — two boxes|одна коробка — две', 'one baby — two babies|один малыш — двое'],
      ['one box — two ___|boxes|boxes/boxs/boxies|Две коробки.', 'one baby — two ___|babies|babies/babys/babyes|Двое малышей.', 'one bus — two ___|buses|buses/buss/busies|Два автобуса.', 'one knife — two ___|knives|knives/knifes/knifies|Два ножа.', 'one watch — two ___|watches|watches/watchs/watchies|Двое часов.'],
      ['There are two boxes.|Есть две коробки.', 'I see three babies.|Я вижу трёх малышей.']),

    /* ---------- Module 7: A Day off! (с. 105) ---------- */
    LWE(42033, '🏖️', 'We’re having a great time!', 'Выходной день у моря.', 106, ['day off|выходной день|🏖️', 'make a sandcastle|строить замок из песка|🏰', 'paint a picture|рисовать картину|🖼️', 'watch TV|смотреть телевизор|📺', 'piano|пианино|🎹', 'face|лицо|🙂', 'drive|водить машину|🚗', 'over there|вон там|👉'],
      ['I am making a sandcastle.|Я строю замок из песка.', 'She is painting a picture.|Она рисует картину.', 'We are watching TV.|Мы смотрим телевизор.']),
    LWE(42034, '🪁', 'In the park!', 'Парк, гонки и игры.', 110, ['park|парк|🌳', 'race|гонка|🏁', 'soccer|футбол|⚽', 'basketball|баскетбол|🏀', 'fly a kite|запускать воздушного змея|🪁', 'ride a bike|кататься на велосипеде|🚲', 'laugh|смеяться|😄', 'sleep|спать|😴'],
      ['I am riding a bike in the park.|Я катаюсь на велосипеде в парке.', 'They are flying a kite.|Они запускают змея.', 'We play soccer.|Мы играем в футбол.']),
    LWE(42035, '🌭', 'Fabulous park day', 'Праздник в парке!', 112, ['fabulous|потрясающий|🌟', 'hot dog|хот-дог|🌭', 'bell|колокольчик|🔔', 'ring|звенеть|🔔', 'mac|плащ, макинтош|🧥'],
      ['This park day is fabulous!|Этот день в парке потрясающий!', 'The bell is ringing.|Колокольчик звенит.', 'I like hot dogs.|Я люблю хот-доги.']),
    LGE(42036, '🏃', 'Present Continuous', 'Что делаешь прямо сейчас? am / is / are + -ing.', 107, 'Present Continuous — «делаю сейчас»', '<ul><li><b>I am</b> playing — я играю (сейчас)</li><li><b>He / She is</b> sleeping</li><li><b>We / You / They are</b> running</li></ul>К глаголу добавляем <b>-ing</b>: play → playing.',
      ['I am riding a bike.|Я катаюсь на велосипеде.', 'She is painting a picture.|Она рисует картину.', 'They are laughing.|Они смеются.'],
      ['I am ___ a bike. (ride)|riding|riding/ride/rides|Я катаюсь на велосипеде.', 'She is ___ a picture. (paint)|painting|painting/paint/paints|Она рисует картину.', 'They ___ playing soccer.|are|is/are/am|Они играют в футбол.', 'He ___ sleeping.|is|is/are/am|Он спит.', 'We are ___ TV. (watch)|watching|watching/watch/watches|Мы смотрим телевизор.', 'I ___ flying a kite.|am|am/is/are|Я запускаю змея.'],
      ['I am playing in the park.|Я играю в парке.', 'We are having fun.|Нам весело.']),
    LGE(42037, '💚', 'like + -ing', 'Любишь заниматься чем-то? like + -ing.', 114, 'like + -ing', 'После <b>like</b> глагол с <b>-ing</b>: <b>I like swimming.</b> — Я люблю плавать.<br><b>She likes dancing.</b> — Она любит танцевать.',
      ['I like swimming.|Я люблю плавать.', 'He likes reading.|Он любит читать.'],
      ['I like ___. (swim)|swimming|swimming/swim/swims|Я люблю плавать.', 'She likes ___. (dance)|dancing|dancing/dance/dances|Она любит танцевать.', 'We like ___ football. (play)|playing|playing/play/plays|Мы любим играть в футбол.', 'He likes ___. (read)|reading|reading/read/reads|Он любит читать.', 'They like ___ a kite. (fly)|flying|flying/fly/flies|Они любят запускать змея.'],
      ['I like drawing.|Я люблю рисовать.', 'She likes singing.|Она любит петь.']),

    /* ---------- Module 8: Day by day! (с. 121) ---------- */
    LWE(42038, '📅', 'Days of the week', 'Неделя: от понедельника до воскресенья.', 122, ['Monday|понедельник|1️⃣', 'Tuesday|вторник|2️⃣', 'Wednesday|среда|3️⃣', 'Thursday|четверг|4️⃣', 'Friday|пятница|5️⃣', 'Sunday|воскресенье|☀️'],
      ['On Monday I have Maths.|В понедельник у меня математика.', 'I go to the park on Sunday.|В воскресенье я иду в парк.', 'Friday is fun!|Пятница — это весело!']),
    LWE(42039, '📺', 'A fun day!', 'Мультфильмы, викторины и часы.', 123, ['cartoon|мультфильм|📺', 'clock|часы|🕒', 'hand|стрелка|🕐', 'join|присоединяться|🤝', 'quiz|викторина|❓', 'afternoon|день, после полудня|🌤️'],
      ['I watch a cartoon.|Я смотрю мультфильм.', 'The clock is on the wall.|Часы на стене.', 'Join us for a quiz!|Присоединяйся к викторине!']),
    LWE(42040, '🛏️', 'On Sundays', 'Распорядок дня: от утра до ночи.', 128, ['morning|утро|🌅', 'evening|вечер|🌆', 'night|ночь|🌙', 'have breakfast|завтракать|🥣', 'have lunch|обедать|🍲', 'have supper|ужинать|🍽️', 'have a shower|принимать душ|🚿', 'go to bed|ложиться спать|🛏️'],
      ['I have breakfast in the morning.|Я завтракаю утром.', 'I go to bed at night.|Я ложусь спать ночью.', 'We have supper in the evening.|Мы ужинаем вечером.']),
    LWE(42041, '🎧', 'Free time on Sundays', 'Чем заняться в воскресенье.', 129, ['listen to music|слушать музыку|🎧', 'visit|навещать, посещать|🏠', 'relative|родственник|👪', 'noon|полдень|🕛', 'midnight|полночь|🕛', 'time|время|⌚'],
      ['I listen to music on Sunday.|В воскресенье я слушаю музыку.', 'We visit our relatives.|Мы навещаем родственников.', 'It is noon.|Сейчас полдень.']),
    LGE(42042, '⏰', 'Present Simple: every day', 'Что ты делаешь каждый день?', 124, 'Present Simple — «обычно делаю»', '<ul><li>I / You / We / They <b>get up</b> at seven.</li><li>He / She / It <b>gets up</b> at seven (<b>+s</b>).</li><li>Вопрос: <b>Do you…? Does he…?</b></li></ul>',
      ['I get up at seven.|Я встаю в семь.', 'She goes to school at eight.|Она идёт в школу в восемь.', 'Do you have lunch at one?|Ты обедаешь в час?'],
      ['I ___ up at seven.|get|get/gets/getting|Я встаю в семь.', 'He ___ breakfast at eight.|has|have/has/having|Он завтракает в восемь.', 'She ___ to school.|goes|go/goes/going|Она ходит в школу.', 'We ___ lunch at one.|have|have/has/having|Мы обедаем в час.', '___ you go to bed at nine?|Do|Do/Does/Are|Ты ложишься спать в девять?', '___ he watch TV?|Does|Do/Does/Is|Он смотрит телевизор?'],
      ['I get up at seven.|Я встаю в семь.', 'She has lunch at one.|Она обедает в час.']),
    LGE(42043, '🕒', 'What time is it?', 'Который час? Предлоги времени at, on, in.', 126, 'Время и предлоги at / on / in', '<ul><li><b>at</b> seven o’clock — в семь часов</li><li><b>on</b> Monday — в понедельник</li><li><b>in</b> the morning — утром</li></ul>Вопрос: <b>What time is it?</b> — <b>It’s</b> two o’clock.',
      ['It’s three o’clock.|Сейчас три часа.', 'I get up at seven.|Я встаю в семь.', 'On Sunday I visit my granny.|В воскресенье я навещаю бабушку.'],
      ['I get up ___ seven o’clock.|at|at/on/in|Я встаю в семь часов.', 'I have lunch ___ Monday.|on|at/on/in|В понедельник я обедаю…', 'I go to school ___ the morning.|in|at/on/in|Утром я иду в школу.', 'What ___ is it?|time|time/clock/hour|Который час?', 'It’s ten ___.|o’clock|o’clock/clock/hours|Десять часов.', 'We play ___ Sunday.|on|at/on/in|В воскресенье мы играем.'],
      ['What time is it?|Который час?', 'It is five o’clock.|Сейчас пять часов.']),

    /* ---------- Fun at school, праздники ---------- */
    LWE(42044, '📐', 'Fun at school: shapes', 'Фигуры и считаем в уме: add, take away.', 20, ['circle|круг|⭕', 'square|квадрат|🟦', 'triangle|треугольник|🔺', 'add|добавлять|➕', 'take away|вычитать|➖', 'map|карта|🗺️', 'title|название|🏷️'],
      ['A circle is round.|Круг круглый.', 'Add two and three.|Прибавь два и три.', 'Take away one.|Вычти один.']),
    LWE(42045, '🐊', 'Reptiles and mammals', 'Рептилии, млекопитающие и сказки.', 34, ['crocodile|крокодил|🐊', 'lizard|ящерица|🦎', 'reptile|рептилия|🐍', 'mammal|млекопитающее|🐻', 'whale|кит|🐋', 'fairy tale|сказка|📖', 'family crest|фамильный герб|🛡️', 'child|ребёнок|🧒'],
      ['A crocodile is a reptile.|Крокодил — рептилия.', 'A whale is a mammal.|Кит — млекопитающее.', 'I like fairy tales.|Я люблю сказки.']),
    LWE(42046, '🧠', 'Smart words', 'Слова для умных и любопытных.', 56, ['because|потому что|💡', 'belong|принадлежать|🏷️', 'design|придумывать, конструировать|✏️', 'figure out|вычислять, выяснять|🧩', 'hear|слышать|👂', 'know|знать|🧠', 'knew|знал|🧠', 'painting|картина|🖼️'],
      ['I know the answer!|Я знаю ответ!', 'I like it because it is fun.|Мне это нравится, потому что весело.', 'This book belongs to me.|Эта книга принадлежит мне.']),
    LWE(42047, '🏃', 'Arthur and Rascal', 'История про Артура и его питомца Раскала.', 130, ['be careful|быть осторожным|⚠️', 'catch|ловить|🤲', 'drop|бросать, ронять|⬇️', 'go home|идти домой|🏠', 'help|помогать|🆘', 'naughty|непослушный|😈', 'next door|по соседству|🏘️', 'picnic|пикник|🧺', 'prize|приз|🏆', 'quick|быстрый|⚡', 'silly|глупый|🤪', 'winner|победитель|🥇'],
      ['Be careful, Rascal!|Осторожно, Раскал!', 'Rascal is a naughty dog.|Раскал — непослушный пёс.', 'Who is the winner?|Кто победитель?']),
    LWE(42048, '🎄', 'Merry Christmas, everybody!', 'Рождественские слова.', 138, ['Christmas tree|рождественская ёлка|🎄', 'Christmas pudding|рождественский пудинг|🍮', 'mince pie|пирожок с мясом|🥧', 'turkey|индейка|🦃', 'wish|желать|🌠', 'bring|приносить|🎁', 'smell|чувствовать запах|👃', 'next year|в следующем году|📆'],
      ['Merry Christmas, everybody!|С Рождеством, все!', 'I wish you a happy Christmas.|Желаю тебе счастливого Рождества.', 'I can smell the turkey.|Я чувствую запах индейки.'])
  ];
  const world = { name: 'Мир · 📖 Spotlight 3 (по учебнику)', lessons: L, open: true, boss: { id: 42100, title: 'Английский в фокусе', icon: '📘', bossIcon: '🧌', story: 'Босс из учебника проверит слова и грамматику всех модулей Spotlight 3.', cert: 'прошёл(а) учебник Spotlight 3' } };
  EN_PACK.WORLDS.push(world);
  if (typeof WORLDS !== 'undefined' && WORLDS !== EN_PACK.WORLDS) WORLDS.push(world);
})();
