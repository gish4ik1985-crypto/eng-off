// Диалоги: персонаж говорит реплику, ребёнок выбирает ответ.
// turn: {en: реплика персонажа, ru: перевод, ans: верный ответ, opts: [ответы, верный в списке]}
// req — id локации, после которой диалог открывается. world — номер мира (0, 1, 2).
const DIALOGS = [
  { id: 'd1', world: 0, req: 1, icon: '👋', title: 'Знакомство', npc: { name: 'Житель', e: '🧑‍🌾' }, turns: [
    { en: 'Hello!', ru: 'Привет!', ans: 'Hello!', opts: ['Hello!', 'Goodbye!', 'No.'] },
    { en: 'What is your name?', ru: 'Как тебя зовут?', ans: 'My name is Bolt.', opts: ['My name is Bolt.', 'I am nine.', 'Yes, please.'] },
    { en: 'How are you?', ru: 'Как дела?', ans: "I'm fine, thanks.", opts: ["I'm fine, thanks.", 'My name is Bolt.', 'Goodbye.'] },
    { en: 'Goodbye!', ru: 'До свидания!', ans: 'Bye!', opts: ['Bye!', 'Hello!', 'Yes.'] }] },
  { id: 'd2', world: 0, req: 8, icon: '👨‍👩‍👧', title: 'Моя семья', npc: { name: 'Подруга', e: '👧' }, turns: [
    { en: 'Who is this?', ru: 'Кто это?', ans: 'This is my mum.', opts: ['This is my mum.', 'I am happy.', 'It is red.'] },
    { en: 'Is she a teacher?', ru: 'Она учитель?', ans: 'No, she is a doctor.', opts: ['No, she is a doctor.', 'Yes, I am.', 'She is red.'] },
    { en: 'Is this your dad?', ru: 'Это твой папа?', ans: 'Yes, it is.', opts: ['Yes, it is.', 'No, I am.', 'It is a cat.'] },
    { en: 'Do you like your family?', ru: 'Ты любишь свою семью?', ans: 'Yes, I do!', opts: ['Yes, I do!', 'No, goodbye.', 'I am a robot.'] }] },
  { id: 'd3', world: 0, req: 12, icon: '🥖', title: 'В пекарне', npc: { name: 'Пекарь', e: '🧑‍🍳' }, turns: [
    { en: 'Hello! What do you want?', ru: 'Привет! Что ты хочешь?', ans: 'A cake, please.', opts: ['A cake, please.', 'I am a robot.', 'Goodbye.'] },
    { en: 'Milk or juice?', ru: 'Молоко или сок?', ans: 'Milk, please.', opts: ['Milk, please.', 'Yes, I can.', 'Two.'] },
    { en: 'Here you are.', ru: 'Вот, пожалуйста.', ans: 'Thank you!', opts: ['Thank you!', 'Sorry, no.', 'Hello, mum.'] },
    { en: 'Bye!', ru: 'Пока!', ans: 'Bye!', opts: ['Bye!', 'Yes, please.', 'Cake.'] }] },

  { id: 'd4', world: 1, req: 21, icon: '🏫', title: 'В школе', npc: { name: 'Учитель', e: '🧑‍🏫' }, turns: [
    { en: 'Good morning!', ru: 'Доброе утро!', ans: 'Good morning!', opts: ['Good morning!', 'Goodbye!', 'Thank you.'] },
    { en: 'What day is it today?', ru: 'Какой сегодня день?', ans: 'It is Monday.', opts: ['It is Monday.', 'It is hot.', 'It is a pen.'] },
    { en: 'Where is your pen?', ru: 'Где твоя ручка?', ans: 'It is in my bag.', opts: ['It is in my bag.', 'It is Friday.', 'I am happy.'] },
    { en: 'Open your book, please.', ru: 'Открой книгу, пожалуйста.', ans: 'OK!', opts: ['OK!', 'I am tired.', 'Goodbye.'] }] },
  { id: 'd5', world: 1, req: 28, icon: '🏟️', title: 'Что ты умеешь?', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'Can you swim?', ru: 'Ты умеешь плавать?', ans: 'Yes, I can.', opts: ['Yes, I can.', 'Yes, I am.', 'No, I have.'] },
    { en: 'Can you dance?', ru: 'Ты умеешь танцевать?', ans: "No, I can't.", opts: ["No, I can't.", "No, I don't am.", 'Yes, I do.'] },
    { en: 'What can you do?', ru: 'Что ты умеешь делать?', ans: 'I can run and jump.', opts: ['I can run and jump.', 'I am nine.', 'It is a dog.'] },
    { en: 'Can a fish fly?', ru: 'Рыба умеет летать?', ans: "No, it can't.", opts: ["No, it can't.", "No, it isn't.", 'Yes, it is.'] }] },
  { id: 'd6', world: 1, req: 31, icon: '🍲', title: 'В кафе', npc: { name: 'Официант', e: '🧑‍🍳' }, turns: [
    { en: 'What would you like?', ru: 'Что бы вы хотели?', ans: "I'd like chicken and rice, please.", opts: ["I'd like chicken and rice, please.", 'I can swim.', 'It is Sunday.'] },
    { en: 'Do you like soup?', ru: 'Ты любишь суп?', ans: "No, I don't.", opts: ["No, I don't.", "No, I can't.", 'Yes, he does.'] },
    { en: 'Anything to drink?', ru: 'Что-нибудь выпить?', ans: 'Juice, please.', opts: ['Juice, please.', 'It is hot.', 'Bye, mum.'] },
    { en: 'Here you are.', ru: 'Вот, пожалуйста.', ans: 'Thanks!', opts: ['Thanks!', 'No, I am.', 'Hello!'] }] },

  { id: 'd7', world: 2, req: 43, icon: '✈️', title: 'В аэропорту', npc: { name: 'Пилот', e: '🧑‍✈️' }, turns: [
    { en: 'Where are you from?', ru: 'Откуда ты?', ans: 'I am from Russia.', opts: ['I am from Russia.', 'I am nine.', 'It is a plane.'] },
    { en: 'Where do you want to go?', ru: 'Куда ты хочешь поехать?', ans: 'I want to go to Japan.', opts: ['I want to go to Japan.', 'I am happy.', 'Yes, please.'] },
    { en: 'How do you want to go?', ru: 'Как ты хочешь добраться?', ans: 'By plane.', opts: ['By plane.', "At seven o'clock.", 'In Japan.'] },
    { en: 'Have a nice trip!', ru: 'Счастливого пути!', ans: 'Thank you!', opts: ['Thank you!', 'Sorry, no.', 'I am from Russia.'] }] },
  { id: 'd8', world: 1, req: 46, icon: '🕰️', title: 'Который час?', npc: { name: 'Часовщик', e: '🧙' }, turns: [
    { en: 'What time is it?', ru: 'Который час?', ans: 'It is half past eight.', opts: ['It is half past eight.', 'It is Monday.', 'I am eight.'] },
    { en: 'What time do you get up?', ru: 'Во сколько ты встаёшь?', ans: "I get up at seven o'clock.", opts: ["I get up at seven o'clock.", 'I like pizza.', 'I am in the park.'] },
    { en: 'What do you do after school?', ru: 'Что ты делаешь после школы?', ans: 'I play with my cat.', opts: ['I play with my cat.', 'It is nine.', 'I am Bolt.'] },
    { en: 'Do you go to bed late?', ru: 'Ты поздно ложишься спать?', ans: 'No, I go to bed at nine.', opts: ['No, I go to bed at nine.', 'Yes, it is.', 'It is a bed.'] }] },
  { id: 'd9', world: 2, req: 48, icon: '⚒️', title: 'Что было вчера?', npc: { name: 'Друг', e: '🧒' }, turns: [
    { en: 'What did you do yesterday?', ru: 'Что ты делал вчера?', ans: 'I played football.', opts: ['I played football.', 'I play football yesterday.', 'I am playing football.'] },
    { en: 'Where were you?', ru: 'Где ты был?', ans: 'I was in the park.', opts: ['I was in the park.', 'I were in the park.', 'I am in park.'] },
    { en: 'Did you watch TV?', ru: 'Ты смотрел телевизор?', ans: "No, I didn't.", opts: ["No, I didn't.", "No, I don't.", 'Yes, I does.'] },
    { en: 'Was it fun?', ru: 'Было весело?', ans: 'Yes, it was!', opts: ['Yes, it was!', 'Yes, I were!', 'Yes, it are!'] }] }
];
