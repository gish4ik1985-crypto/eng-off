// Данные мира 1 (2 класс, по мотивам Spotlight 2). Здесь удобно править слова и темы.
// w(английское, русское, эмодзи, [буква для азбуки])
const WORDS = {};
function w(id, en, ru, e, L) { WORDS[id] = { id, en, ru, e, L: L || '' }; }

// Приветствие
w('hello', 'hello', 'привет', '👋');
w('bye', 'bye', 'пока', '🚪');
w('yes', 'yes', 'да', '✅');
w('no', 'no', 'нет', '❌');
w('thanks', 'thanks', 'спасибо', '🙏');
w('sorry', 'sorry', 'извини', '😔');
// Азбука
w('apple', 'apple', 'яблоко', '🍎', 'A');
w('ball', 'ball', 'мяч', '⚽', 'B');
w('cat', 'cat', 'кошка', '🐱', 'C');
w('dog', 'dog', 'собака', '🐶', 'D');
w('egg', 'egg', 'яйцо', '🥚', 'E');
w('fish', 'fish', 'рыба', '🐟', 'F');
w('girl', 'girl', 'девочка', '👧', 'G');
w('hat', 'hat', 'шляпа', '🎩', 'H');
w('ice', 'ice', 'лёд', '🧊', 'I');
w('juice', 'juice', 'сок', '🧃', 'J');
w('kite', 'kite', 'воздушный змей', '🪁', 'K');
w('lion', 'lion', 'лев', '🦁', 'L');
w('monkey', 'monkey', 'обезьяна', '🐒', 'M');
w('nose', 'nose', 'нос', '👃', 'N');
w('owl', 'owl', 'сова', '🦉', 'O');
w('pig', 'pig', 'свинья', '🐷', 'P');
w('queen', 'queen', 'королева', '👸', 'Q');
w('robot', 'robot', 'робот', '🤖', 'R');
w('sun', 'sun', 'солнце', '☀️', 'S');
w('tree', 'tree', 'дерево', '🌳', 'T');
w('umbrella', 'umbrella', 'зонт', '☂️', 'U');
w('van', 'van', 'фургон', '🚐', 'V');
w('window', 'window', 'окно', '🪟', 'W');
w('box', 'box', 'коробка', '📦', 'X');
w('yacht', 'yacht', 'яхта', '⛵', 'Y');
w('zebra', 'zebra', 'зебра', '🦓', 'Z');
// Числа
['one','two','three','four','five','six','seven','eight','nine','ten'].forEach((n, i) => {
  w(n, n, String(i + 1), ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][i]);
});
// Цвета
w('red', 'red', 'красный', '🟥');
w('blue', 'blue', 'синий', '🟦');
w('green', 'green', 'зелёный', '🟩');
w('yellow', 'yellow', 'жёлтый', '🟨');
w('orange', 'orange', 'оранжевый', '🟧');
w('pink', 'pink', 'розовый', '🩷');
w('black', 'black', 'чёрный', '⬛');
w('white', 'white', 'белый', '⬜');
// Семья
w('mum', 'mum', 'мама', '👩');
w('dad', 'dad', 'папа', '👨');
w('brother', 'brother', 'брат', '👦');
w('sister', 'sister', 'сестра', '👱‍♀️');
w('grandma', 'grandma', 'бабушка', '👵');
w('grandpa', 'grandpa', 'дедушка', '👴');
w('baby', 'baby', 'малыш', '👶');
// Игрушки
w('doll', 'doll', 'кукла', '🪆');
w('car', 'car', 'машина', '🚗');
w('train', 'train', 'поезд', '🚂');
w('bike', 'bike', 'велосипед', '🚲');
w('teddy', 'teddy', 'плюшевый мишка', '🧸');
// Питомцы
w('bird', 'bird', 'птица', '🐦');
w('mouse', 'mouse', 'мышь', '🐭');
w('rabbit', 'rabbit', 'кролик', '🐰');
w('frog', 'frog', 'лягушка', '🐸');
w('horse', 'horse', 'лошадь', '🐴');
// Тело
w('eyes', 'eyes', 'глаза', '👀');
w('ears', 'ears', 'уши', '👂');
w('mouth', 'mouth', 'рот', '👄');
w('hand', 'hand', 'рука', '✋');
w('leg', 'leg', 'нога', '🦵');
w('foot', 'foot', 'ступня', '🦶');
// Еда
w('bread', 'bread', 'хлеб', '🍞');
w('milk', 'milk', 'молоко', '🥛');
w('cake', 'cake', 'торт', '🍰');
w('pizza', 'pizza', 'пицца', '🍕');
w('banana', 'banana', 'банан', '🍌');
// Одежда
w('shoes', 'shoes', 'ботинки', '👟');
w('socks', 'socks', 'носки', '🧦');
w('dress', 'dress', 'платье', '👗');
w('jeans', 'jeans', 'джинсы', '👖');
w('shirt', 'shirt', 'футболка', '👕');
w('coat', 'coat', 'пальто', '🧥');

const LESSONS = [
  { id: 1, title: 'Точка спавна', icon: '🏕️', words: ['hello','bye','yes','no','thanks','sorry'],
    story: 'Ты появился в мире блоков! Злой Забывака украл английские слова. Давай вернём первые — слова вежливости.' },
  { id: 2, title: 'Яблочная роща', icon: '🍎', words: ['apple','ball','cat','dog','egg','fish'],
    story: 'Забывака спрятал буквы A–F в яблочной роще. Найди их!' },
  { id: 3, title: 'Лавовая пещера', icon: '🌋', words: ['girl','hat','ice','juice','kite','lion'],
    story: 'В пещере горячо! Здесь спрятаны буквы G–L.' },
  { id: 4, title: 'Деревня жителей', icon: '🏘️', words: ['monkey','nose','owl','pig','queen','robot'],
    story: 'Жители деревни забыли буквы M–R. Помоги им вспомнить.' },
  { id: 5, title: 'Снежные горы', icon: '🏔️', words: ['sun','tree','umbrella','van','window','box','yacht','zebra'],
    story: 'Последние буквы S–Z замело снегом. Откопай их!' },
  { id: 6, title: 'Шахта чисел', icon: '⛏️', words: ['one','two','three','four','five','six','seven','eight','nine','ten'],
    story: 'В шахте Забывака спрятал цифры. Добудь их киркой!' },
  { id: 7, title: 'Радужная поляна', icon: '🌈', words: ['red','blue','green','yellow','orange','pink','black','white'],
    story: 'Забывака выкрасил всё в серый. Верни цвета!' },
  { id: 8, title: 'Домик семьи', icon: '🏠', words: ['mum','dad','brother','sister','grandma','grandpa','baby'],
    story: 'В домике вся семья ждёт тебя. Поздоровайся с каждым!' },
  { id: 9, title: 'Мастерская игрушек', icon: '🧰', words: ['robot','car','train','bike','doll','teddy','ball'],
    story: 'В мастерской роботы собирают игрушки. Но названия пропали!' },
  { id: 10, title: 'Загон питомцев', icon: '🐾', words: ['cat','dog','bird','mouse','rabbit','frog','horse'],
    story: 'Питомцы сбежали из загона. Назови их — и они вернутся.' },
  { id: 11, title: 'Лаборатория робота', icon: '🧪', words: ['eyes','ears','nose','mouth','hand','leg','foot'],
    story: 'Робот-учёный собирает нового робота. Подскажи названия частей тела.' },
  { id: 12, title: 'Пекарня', icon: '🥖', words: ['bread','milk','cake','pizza','banana','apple','juice'],
    story: 'Из пекарни пахнет вкусным! Только все ценники забыты.' },
  { id: 13, title: 'Гардероб', icon: '👚', words: ['hat','shoes','socks','dress','jeans','shirt','coat'],
    story: 'Забывака перемешал всю одежду. Разложи по названиям.' }
];

const BOSS = { id: 14, title: 'Замок Забывака', icon: '🏰' };
