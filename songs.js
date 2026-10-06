// Рифмовки и песенки (тексты оригинальные, под темы уроков).
// line: {en, ru, gap?, opts?} — gap: слово в конце строки, которое ребёнок «допевает» (opts — варианты).
// req — id локации, после которой рифмовка открывается; world — мир (0, 1, 2).
const SONGS = [
  { id: 's1', world: 0, req: 6, icon: '🔢', title: 'Считалка шахтёра', lines: [
    { en: 'One, two, I see you!', ru: 'Раз, два, я вижу тебя!', gap: 'you', opts: ['you', 'hand', 'fish'] },
    { en: 'Three, four, a robot at the door!', ru: 'Три, четыре, робот у двери!', gap: 'door', opts: ['door', 'dog', 'cat'] },
    { en: 'Five, six, we dig with picks!', ru: 'Пять, шесть, мы копаем кирками!', gap: 'picks', opts: ['picks', 'dogs', 'cats'] },
    { en: 'Seven, eight, we all wait!', ru: 'Семь, восемь, мы все ждём!', gap: 'wait', opts: ['wait', 'run', 'tree'] },
    { en: "Nine, ten, let's count again!", ru: 'Девять, десять, давай посчитаем снова!', gap: 'again', opts: ['again', 'mouse', 'apple'] }] },
  { id: 's2', world: 0, req: 7, icon: '🌈', title: 'Цветная кричалка', lines: [
    { en: 'Red, red, go to bed!', ru: 'Красный, красный, иди спать!', gap: 'bed', opts: ['bed', 'dog', 'pen'] },
    { en: 'Blue, blue, I love you!', ru: 'Синий, синий, я люблю тебя!', gap: 'you', opts: ['you', 'cat', 'hat'] },
    { en: "Green, green, a frog I've seen!", ru: 'Зелёный, зелёный, лягушку я видел!', gap: 'seen', opts: ['seen', 'dog', 'big'] },
    { en: 'Yellow, yellow, say hello!', ru: 'Жёлтый, жёлтый, скажи привет!', gap: 'hello', opts: ['hello', 'pizza', 'ball'] },
    { en: 'Black, black, a cat in a sack!', ru: 'Чёрный, чёрный, кот в мешке!', gap: 'sack', opts: ['sack', 'dog', 'tree'] },
    { en: 'White, white, a snowy night!', ru: 'Белый, белый, снежная ночь!', gap: 'night', opts: ['night', 'bread', 'milk'] }] },
  { id: 's3', world: 0, req: 11, icon: '🧍', title: 'Робот-зарядка', lines: [
    { en: 'Eyes, eyes, I can see!', ru: 'Глаза, глаза, я могу видеть!', gap: 'see', opts: ['see', 'hand', 'nose'] },
    { en: 'Ears, ears, listen to me!', ru: 'Уши, уши, слушайте меня!', gap: 'me', opts: ['me', 'red', 'cake'] },
    { en: 'Nose, nose, smell a rose!', ru: 'Нос, нос, понюхай розу!', gap: 'rose', opts: ['rose', 'dog', 'juice'] },
    { en: 'Mouth, mouth, I can shout!', ru: 'Рот, рот, я могу кричать!', gap: 'shout', opts: ['shout', 'fish', 'pen'] },
    { en: 'Hands, hands, clap, clap, clap!', ru: 'Руки, руки, хлоп, хлоп, хлоп!' },
    { en: 'Feet, feet, tap, tap, tap!', ru: 'Ноги, ноги, топ, топ, топ!' }] },

  { id: 's4', world: 1, req: 22, icon: '📅', title: 'Неделька', lines: [
    { en: 'Monday, Tuesday, I go to school.', ru: 'Понедельник, вторник, я иду в школу.' },
    { en: 'Wednesday, Thursday, I am cool.', ru: 'Среда, четверг, я крутой.', gap: 'cool', opts: ['cool', 'big', 'tall'] },
    { en: 'Friday, Friday, hip-hip hooray!', ru: 'Пятница, пятница, ура-ура!' },
    { en: 'Saturday, Sunday, time to play!', ru: 'Суббота, воскресенье — время играть!', gap: 'play', opts: ['play', 'school', 'sing'] },
    { en: 'Seven days in a week, hey!', ru: 'Семь дней в неделе, эй!' }] },
  { id: 's5', world: 1, req: 28, icon: '🦸', title: 'Я умею!', lines: [
    { en: 'I can swim like a fish.', ru: 'Я умею плавать, как рыба.' },
    { en: 'I can run, I can make a wish!', ru: 'Я умею бегать, я могу загадать желание!', gap: 'wish', opts: ['wish', 'dog', 'tree'] },
    { en: 'I can dance, I can sing,', ru: 'Я умею танцевать, я умею петь,' },
    { en: 'I can do everything!', ru: 'Я умею делать всё!', gap: 'everything', opts: ['everything', 'anything', 'nothing'] },
    { en: "But I can't fly like a bird,", ru: 'Но я не умею летать, как птица,' },
    { en: 'Can you say it? Say the word!', ru: 'Можешь сказать это? Скажи слово!', gap: 'word', opts: ['word', 'sun', 'cat'] }] },
  { id: 's6', world: 1, req: 34, icon: '🍂', title: 'Времена года', lines: [
    { en: 'Winter is cold, winter is white,', ru: 'Зима холодная, зима белая,' },
    { en: 'Snow falls down in the night.', ru: 'Снег падает вниз ночью.', gap: 'night', opts: ['night', 'apple', 'school'] },
    { en: 'Spring is green, flowers grow,', ru: 'Весна зелёная, цветы растут,' },
    { en: 'Sunny days are on the go!', ru: 'Солнечные дни спешат!', gap: 'go', opts: ['go', 'bus', 'red'] },
    { en: 'Summer is hot, the sun is high,', ru: 'Лето жаркое, солнце высоко,' },
    { en: 'Swim in the sea and watch the sky.', ru: 'Плавай в море и смотри на небо.', gap: 'sky', opts: ['sky', 'tree', 'milk'] },
    { en: 'Autumn is windy, leaves are brown,', ru: 'Осень ветреная, листья коричневые,' },
    { en: 'They fall and dance all over town.', ru: 'Они падают и танцуют по всему городу.', gap: 'town', opts: ['town', 'park', 'tree'] }] },

  { id: 's7', world: 2, req: 43, icon: '🚌', title: 'Транспортная кричалка', lines: [
    { en: 'Bus, bus, come with us!', ru: 'Автобус, автобус, поехали с нами!', gap: 'us', opts: ['us', 'hat', 'cake'] },
    { en: 'Taxi, taxi, stop, stop, stop!', ru: 'Такси, такси, стоп, стоп, стоп!' },
    { en: 'Plane, plane, in the sky,', ru: 'Самолёт, самолёт, в небе,' },
    { en: 'Fly so high, goodbye, goodbye!', ru: 'Лети так высоко, до свидания, до свидания!', gap: 'goodbye', opts: ['goodbye', 'bus', 'rice'] },
    { en: 'Ship, ship, on the sea,', ru: 'Корабль, корабль, на море,' },
    { en: 'Come, come, sail with me!', ru: 'Плыви, плыви со мной!', gap: 'me', opts: ['me', 'red', 'pen'] },
    { en: 'Rocket, rocket, one, two, three,', ru: 'Ракета, ракета, раз, два, три,' },
    { en: 'Fly to the stars with me!', ru: 'Лети к звёздам со мной!' }] },
  { id: 's8', world: 1, req: 45, icon: '⏰', title: 'Утро робота', lines: [
    { en: "Wake up, wake up, it's seven o'clock!", ru: 'Просыпайся, просыпайся, уже семь часов!' },
    { en: 'Get up, get up, tick-tock, tick-tock!', ru: 'Вставай, вставай, тик-так, тик-так!' },
    { en: 'Breakfast, lunch and dinner too,', ru: 'Завтрак, обед и ужин тоже,' },
    { en: 'Homework time, I know what to do!', ru: 'Время домашки, я знаю, что делать!', gap: 'do', opts: ['do', 'eat', 'bus'] },
    { en: 'Brush your teeth and go to bed,', ru: 'Почисти зубы и иди спать,' },
    { en: 'Sleep tight, robot, rest your head!', ru: 'Спи крепко, робот, положи голову!', gap: 'head', opts: ['head', 'hat', 'hand'] }] },
  { id: 's9', world: 2, req: 49, icon: '🦘', title: 'Вчера в зоопарке', lines: [
    { en: 'Yesterday I went to the zoo,', ru: 'Вчера я ходил в зоопарк,' },
    { en: 'I saw a tiger and a kangaroo!', ru: 'Я видел тигра и кенгуру!', gap: 'kangaroo', opts: ['kangaroo', 'mouse', 'cake'] },
    { en: 'I ate some cake, I had a ball,', ru: 'Я съел торт, я отлично повеселился,' },
    { en: 'It was the best day of all!', ru: 'Это был лучший день из всех!', gap: 'all', opts: ['all', 'red', 'fun'] },
    { en: 'I bought a robot, big and red,', ru: 'Я купил большого красного робота,' },
    { en: 'Then I went home and slept in bed.', ru: 'Потом пошёл домой и спал в кровати.', gap: 'bed', opts: ['bed', 'hat', 'tree'] }] }
];

// превращает строку с рифмой в задание «вставь слово» (для игры и для «Тренировки»)
function songGap(l) {
  if (!l.gap) return null;
  if (!l._g) {
    const k = l.en.toLowerCase().lastIndexOf(l.gap.toLowerCase());
    l._g = { en: l.en.slice(0, k) + '___' + l.en.slice(k + l.gap.length), ans: l.gap, opts: l.opts, ru: l.ru };
  }
  return l._g;
}
