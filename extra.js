// Дополнительный контент: диалоги, рифмовки и рассказы для аудирования.
// Добавляется к DIALOGS, SONGS и AUDIOS (файлы dialogs.js, songs.js, audio.js).

DIALOGS.push(
  { id: 'd10', world: 0, req: 9, icon: '🧸', title: 'Магазин игрушек', npc: { name: 'Продавец', e: '🧑‍💼' }, turns: [
    { en: 'Hello! Can I help you?', ru: 'Привет! Могу вам помочь?', ans: 'Yes, please. I want a robot.', opts: ['Yes, please. I want a robot.', 'I am a robot.', 'No, goodbye.'] },
    { en: 'What colour?', ru: 'Какого цвета?', ans: 'Blue, please.', opts: ['Blue, please.', 'Yes, it is.', 'It is a car.'] },
    { en: 'Here you are.', ru: 'Вот, пожалуйста.', ans: 'Thank you!', opts: ['Thank you!', 'Sorry, no.', 'Hello!'] },
    { en: 'Bye!', ru: 'Пока!', ans: 'Bye!', opts: ['Bye!', 'Yes, please.', 'It is blue.'] }] },
  { id: 'd11', world: 0, req: 19, icon: '☀️', title: 'Какая погода?', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'Hello! What is the weather like?', ru: 'Привет! Какая сегодня погода?', ans: 'It is sunny.', opts: ['It is sunny.', 'It is Monday.', 'I am happy.'] },
    { en: 'Is it hot?', ru: 'Жарко?', ans: 'Yes, it is.', opts: ['Yes, it is.', 'Yes, I am.', "No, I can't."] },
    { en: "Let's play outside!", ru: 'Давай поиграем на улице!', ans: "OK! Let's go!", opts: ["OK! Let's go!", 'No, I am a cat.', 'It is windy.'] },
    { en: 'Do you like summer?', ru: 'Ты любишь лето?', ans: 'Yes, I do!', opts: ['Yes, I do!', 'Yes, it is!', "No, I can't!"] }] },
  { id: 'd12', world: 1, req: 26, icon: '⚽', title: 'Где мой мяч?', npc: { name: 'Брат', e: '👦' }, turns: [
    { en: 'Where is my ball?', ru: 'Где мой мяч?', ans: 'It is under the chair.', opts: ['It is under the chair.', 'It is a ball.', 'Yes, it is.'] },
    { en: 'Is it in the box?', ru: 'Он в коробке?', ans: "No, it isn't.", opts: ["No, it isn't.", "No, I don't.", 'Yes, he is.'] },
    { en: 'Is it on the bed?', ru: 'Он на кровати?', ans: 'Yes, it is!', opts: ['Yes, it is!', 'Yes, I can!', 'No, I am.'] },
    { en: 'Thank you!', ru: 'Спасибо!', ans: "You're welcome!", opts: ["You're welcome!", 'Goodbye, mum.', 'I am five.'] }] },
  { id: 'd13', world: 1, req: 45, icon: '🥣', title: 'Мой день', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'What time do you get up?', ru: 'Во сколько ты встаёшь?', ans: 'I get up at seven.', opts: ['I get up at seven.', 'I am seven.', 'It is Monday.'] },
    { en: 'What do you have for breakfast?', ru: 'Что ты ешь на завтрак?', ans: 'I have eggs and milk.', opts: ['I have eggs and milk.', 'I go to school.', 'I am happy.'] },
    { en: 'Do you do your homework after school?', ru: 'Ты делаешь уроки после школы?', ans: 'Yes, I do.', opts: ['Yes, I do.', 'Yes, I am.', 'Yes, it is.'] },
    { en: 'When do you go to bed?', ru: 'Когда ты ложишься спать?', ans: "At nine o'clock.", opts: ["At nine o'clock.", 'In the kitchen.', 'With my cat.'] }] },
  { id: 'd14', world: 2, req: 76, icon: '🛒', title: 'В магазине', npc: { name: 'Продавец', e: '🧑‍💼' }, turns: [
    { en: 'Can I help you?', ru: 'Могу вам помочь?', ans: 'Yes, please. I want some milk.', opts: ['Yes, please. I want some milk.', 'No, I am a robot.', 'It is a shop.'] },
    { en: 'How much milk do you want?', ru: 'Сколько молока вы хотите?', ans: 'Two bottles, please.', opts: ['Two bottles, please.', 'I like milk.', 'Yes, I do.'] },
    { en: 'Anything else?', ru: 'Что-нибудь ещё?', ans: 'Yes, a lemon and some honey.', opts: ['Yes, a lemon and some honey.', "No, I can't.", 'I was at home.'] },
    { en: 'Here you are.', ru: 'Вот, пожалуйста.', ans: 'Thank you very much!', opts: ['Thank you very much!', 'Goodbye, milk.', 'I am sorry, no.'] }] },
  { id: 'd15', world: 2, req: 83, icon: '🧭', title: 'Планы на лето', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'Where are you going to go in summer?', ru: 'Куда ты поедешь летом?', ans: 'I am going to go to Italy.', opts: ['I am going to go to Italy.', 'I went to Italy.', 'I am go Italy.'] },
    { en: 'How are you going to travel?', ru: 'Как вы поедете?', ans: 'We are going to fly.', opts: ['We are going to fly.', 'We flew yesterday.', 'We going fly.'] },
    { en: 'What are you going to do there?', ru: 'Что вы там будете делать?', ans: 'I am going to swim in the sea.', opts: ['I am going to swim in the sea.', 'I swam in the sea.', 'I am swimming yesterday.'] },
    { en: 'Sounds great!', ru: 'Звучит здорово!', ans: 'Thanks! See you!', opts: ['Thanks! See you!', "No, I don't.", 'It was sunny.'] }] },
  { id: 'd16', world: 2, req: 71, icon: '🧔', title: 'Кто на фото?', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'Who is this man?', ru: 'Кто этот мужчина?', ans: 'He is my uncle.', opts: ['He is my uncle.', 'She is my aunt.', 'It is my CD.'] },
    { en: 'Has he got glasses?', ru: 'У него есть очки?', ans: 'Yes, he has.', opts: ['Yes, he has.', 'Yes, he is.', 'Yes, it does.'] },
    { en: 'Who is this woman?', ru: 'Кто эта женщина?', ans: 'She is my aunt.', opts: ['She is my aunt.', 'He is my uncle.', 'They are my cousins.'] },
    { en: 'Is she tall?', ru: 'Она высокая?', ans: 'No, she is short.', opts: ['No, she is short.', 'No, she has.', 'Yes, she can.'] }] }
);

SONGS.push(
  { id: 's10', world: 0, req: 10, icon: '🐾', title: 'Мои питомцы', lines: [
    { en: 'Cat, cat, sit on my mat!', ru: 'Кошка, кошка, садись на мой коврик!', gap: 'mat', opts: ['mat', 'dog', 'red'] },
    { en: 'Dog, dog, jump and run!', ru: 'Собака, собака, прыгай и беги!' },
    { en: 'Bird, bird, sing a word!', ru: 'Птичка, птичка, спой словечко!', gap: 'word', opts: ['word', 'hat', 'cake'] },
    { en: 'Mouse, mouse, in my house!', ru: 'Мышка, мышка, в моём доме!', gap: 'house', opts: ['house', 'bird', 'red'] },
    { en: 'Rabbit, rabbit, jump, jump, jump!', ru: 'Кролик, кролик, прыг, прыг, прыг!' }] },
  { id: 's11', world: 1, req: 63, icon: '👨‍👩‍👧', title: 'Моя большая семья', lines: [
    { en: 'Mum is great and Dad is too,', ru: 'Мама чудесная, и папа тоже,' },
    { en: 'I love them and they love you!', ru: 'Я люблю их, и они любят тебя!', gap: 'you', opts: ['you', 'cat', 'red'] },
    { en: 'Brother plays and sister sings,', ru: 'Брат играет, а сестра поёт,' },
    { en: 'Baby laughs at everything!', ru: 'Малыш смеётся над всем!', gap: 'everything', opts: ['everything', 'bread', 'window'] },
    { en: 'My family is big and bright,', ru: 'Моя семья большая и яркая,' },
    { en: 'We say "Good night!" every night.', ru: 'Мы говорим «Спокойной ночи!» каждую ночь.', gap: 'night', opts: ['night', 'school', 'apple'] }] },
  { id: 's12', world: 2, req: 78, icon: '🗓️', title: 'Двенадцать месяцев', lines: [
    { en: 'January, February, snow and ice,', ru: 'Январь, февраль — снег и лёд,' },
    { en: 'March and April, rain is nice!', ru: 'Март и апрель — дождик хорош!', gap: 'nice', opts: ['nice', 'red', 'run'] },
    { en: 'May and June, the sun is high,', ru: 'Май и июнь — солнце высоко,' },
    { en: 'July, August, blue sky!', ru: 'Июль, август — голубое небо!', gap: 'sky', opts: ['sky', 'tree', 'milk'] },
    { en: 'September, October, leaves are brown,', ru: 'Сентябрь, октябрь — листья коричневые,' },
    { en: 'November, December, snow comes down!', ru: 'Ноябрь, декабрь — снег идёт вниз!', gap: 'down', opts: ['down', 'tree', 'bus'] }] }
);

AUDIOS.push(
  { id: 'a10', world: 0, req: 16, icon: '🎂', title: 'Мой день рождения', intro: 'Мальчик рассказывает о своём празднике. Слушай и запоминай!',
    text: [{ en: 'Today is my birthday.', ru: 'Сегодня мой день рождения.' }, { en: 'I am seven.', ru: 'Мне семь лет.' }, { en: 'I have a big cake.', ru: 'У меня большой торт.' },
      { en: 'There are seven candles.', ru: 'На нём семь свечей.' }, { en: 'Mum and Dad give me a present.', ru: 'Мама и папа дарят мне подарок.' }, { en: 'It is a robot!', ru: 'Это робот!' }],
    qs: [{ en: 'How old is the boy?', ru: 'Сколько лет мальчику?', ans: 'Seven', opts: ['Seven', 'Six', 'Eight'] },
      { en: 'What is on the cake?', ru: 'Что на торте?', ans: 'Seven candles', opts: ['Seven candles', 'Two candles', 'A robot'] },
      { en: 'What is the present?', ru: 'Какой подарок?', ans: 'A robot', opts: ['A robot', 'A ball', 'A doll'] },
      { en: 'Who gives the present?', ru: 'Кто дарит подарок?', ans: 'Mum and Dad', opts: ['Mum and Dad', 'The teacher', 'The cat'] }],
    pick: [{ say: 'I have a big cake.', opts: ['I have a big cake.', 'I have a big cat.', 'I have a small cake.'] },
      { say: 'There are seven candles.', opts: ['There are seven candles.', 'There are eleven candles.', 'There is one candle.'] },
      { say: 'It is a robot!', opts: ['It is a robot!', 'It is a rabbit!', 'It is a rocket!'] }] },
  { id: 'a11', world: 1, req: 31, icon: '🍲', title: 'В кафе', intro: 'Двое друзей пришли в кафе. Что они любят?',
    text: [{ en: 'Tom and Ann are in a cafe.', ru: 'Том и Аня в кафе.' }, { en: 'Tom likes pizza and juice.', ru: 'Том любит пиццу и сок.' }, { en: "Ann doesn't like pizza.", ru: 'Аня не любит пиццу.' },
      { en: 'She likes soup and tea.', ru: 'Она любит суп и чай.' }, { en: 'They are happy.', ru: 'Они счастливы.' }],
    qs: [{ en: 'Where are they?', ru: 'Где они?', ans: 'In a cafe', opts: ['In a cafe', 'At school', 'In a zoo'] },
      { en: 'What does Tom like?', ru: 'Что любит Том?', ans: 'Pizza and juice', opts: ['Pizza and juice', 'Soup and tea', 'Cake and milk'] },
      { en: "What doesn't Ann like?", ru: 'Что не любит Аня?', ans: 'Pizza', opts: ['Pizza', 'Soup', 'Tea'] },
      { en: 'What does Ann like?', ru: 'Что любит Аня?', ans: 'Soup and tea', opts: ['Soup and tea', 'Pizza and juice', 'Rice and milk'] }],
    pick: [{ say: 'Tom likes pizza and juice.', opts: ['Tom likes pizza and juice.', 'Tom like pizza and juice.', 'Tom likes pizza and tea.'] },
      { say: "Ann doesn't like pizza.", opts: ["Ann doesn't like pizza.", "Ann doesn't like soup.", 'Ann likes pizza.'] },
      { say: 'She likes soup and tea.', opts: ['She likes soup and tea.', 'She likes soup and milk.', 'He likes soup and tea.'] }] },
  { id: 'a12', world: 2, req: 83, icon: '🧭', title: 'Планы на каникулы', intro: 'Девочка рассказывает, как её семья проведёт лето.',
    text: [{ en: 'In summer my family is going to go to Spain.', ru: 'Летом моя семья поедет в Испанию.' }, { en: 'We are going to fly by plane.', ru: 'Мы полетим на самолёте.' },
      { en: 'My brother is going to swim in the sea.', ru: 'Мой брат будет плавать в море.' }, { en: 'I am going to play volleyball on the beach.', ru: 'Я буду играть в волейбол на пляже.' },
      { en: 'It will be hot and sunny.', ru: 'Будет жарко и солнечно.' }],
    qs: [{ en: 'Where is the family going to go?', ru: 'Куда поедет семья?', ans: 'Spain', opts: ['Spain', 'Italy', 'Greece'] },
      { en: 'How are they going to travel?', ru: 'Как они поедут?', ans: 'By plane', opts: ['By plane', 'By ship', 'By bus'] },
      { en: 'What is the brother going to do?', ru: 'Что будет делать брат?', ans: 'Swim in the sea', opts: ['Swim in the sea', 'Play volleyball', 'Sleep'] },
      { en: 'What will the weather be?', ru: 'Какой будет погода?', ans: 'Hot and sunny', opts: ['Hot and sunny', 'Cold and snowy', 'Rainy'] }],
    pick: [{ say: 'We are going to fly by plane.', opts: ['We are going to fly by plane.', 'We flew by plane.', 'We are going to go by ship.'] },
      { say: 'I am going to play volleyball on the beach.', opts: ['I am going to play volleyball on the beach.', 'I played volleyball on the beach.', 'I am going to play tennis on the beach.'] },
      { say: 'It will be hot and sunny.', opts: ['It will be hot and sunny.', 'It was hot and sunny.', 'It will be cold and snowy.'] }] }
);
