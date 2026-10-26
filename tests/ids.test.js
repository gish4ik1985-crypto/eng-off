// Номера уроков и боссов должны быть уникальны во ВСЕХ мирах и предметах: прогресс хранится по номеру,
// и совпадение номеров заставило бы один урок «засчитываться» за другой.
const test = require('node:test'), assert = require('node:assert');
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = path.join(__dirname, '..');

test('номера уроков и боссов не повторяются между мирами', () => {
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const order = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1].split('?')[0]).filter(s => !['game.js', 'config.js'].includes(s) && !s.startsWith('http'));
  const ctx = { console, Math, localStorage: { getItem() { return null; } } }; ctx.window = ctx; vm.createContext(ctx);
  for (const f of order) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8') + '\n;', ctx, { filename: f });
  const seen = new Map(), dups = [];
  for (const n of ['EN_PACK.WORLDS', 'IT_PACK.WORLDS', 'MWORLDS', 'RWORLDS', 'OWORLDS', 'IWORLDS', 'PWORLDS', 'LWORLDS', 'GWORLDS', 'AWORLDS']) {
    vm.runInContext(n, ctx).forEach(w => [w.boss].concat(w.lessons).forEach(l => {
      const where = n + ' / ' + w.name + ' / ' + l.title;
      if (seen.has(l.id)) dups.push(l.id + ': ' + seen.get(l.id) + '  <>  ' + where); else seen.set(l.id, where);
    }));
  }
  assert.deepStrictEqual(dups, []);
});
