#!/usr/bin/env node
/* Офлайн-распознавание страниц учебника (Tesseract через tesseract.js, всё считается на этом компьютере).
   Использование:  node ocr.js <папка со страницами pNNN.jpg> [--lang rus] [--workers 4] [--pages 10-20] [--force]
   Результат: <папка>/text.json  { "12": "текст страницы", ... }. Уже распознанные страницы пропускаются (можно прерывать и запускать снова).
   Языковой файл скачивается один раз в tools/ocr/.lang, дальше интернет не нужен. */
const fs = require('fs'), path = require('path'), os = require('os');
const { createWorker, createScheduler } = require('tesseract.js');

const args = process.argv.slice(2), dir = args.find(a => !a.startsWith('--') && !/^\d/.test(a));
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
if (!dir) { console.log('Использование: node ocr.js <папка со страницами> [--lang rus] [--workers 4] [--pages 10-20] [--force]'); process.exit(1); }
const lang = opt('lang', 'rus'), force = args.includes('--force');
const workers = Math.max(1, Math.min(+opt('workers', Math.max(1, Math.min(4, os.cpus().length - 1))), 8));
const files = fs.readdirSync(dir).filter(f => /^p\d+\.(jpe?g|png)$/i.test(f)).sort();
const range = (opt('pages', '') || '').split('-').map(Number);
const outFile = path.join(dir, 'text.json');
const text = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
const num = f => parseInt(f.slice(1), 10);
const todo = files.filter(f => (force || !(num(f) in text)) && (!range[0] || (num(f) >= range[0] && num(f) <= (range[1] || range[0]))));
const clean = t => (t || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/-\n(?=[а-яё])/g, '').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const save = () => fs.writeFileSync(outFile, JSON.stringify(text, null, 0), 'utf8');

(async () => {
  console.log(`Страниц всего: ${files.length}, к распознаванию: ${todo.length}, потоков: ${workers}, язык: ${lang}`);
  if (!todo.length) return console.log('Всё уже распознано (чтобы сделать заново: --force).');
  const sch = createScheduler(), cache = path.join(__dirname, '.lang');
  fs.mkdirSync(cache, { recursive: true });
  for (let i = 0; i < workers; i++) sch.addWorker(await createWorker(lang, 1, { cachePath: cache, logger: () => {} }));
  let done = 0; const t0 = Date.now();
  await Promise.all(todo.map(f => sch.addJob('recognize', path.join(dir, f)).then(r => {
    text[num(f)] = clean(r.data.text); done++;
    if (done % 5 === 0 || done === todo.length) { save(); const el = (Date.now() - t0) / 1000; console.log(`${done}/${todo.length}  (${Math.round(el)} с, осталось ≈ ${Math.round(el / done * (todo.length - done))} с)`); }
  }).catch(e => console.log('Ошибка на', f, e.message))));
  save(); await sch.terminate();
  console.log('Готово:', outFile);
})();
