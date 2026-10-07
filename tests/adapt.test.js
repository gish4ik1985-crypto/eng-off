const test = require('node:test'), assert = require('node:assert');
const A = require('../adapt.js');
const school = (extra = {}) => Object.assign({
  subjects: [{ id: 'm', name: 'Математика' }, { id: 'r', name: 'Русский язык' }, { id: 'e', name: 'Английский язык' }],
  grades: [], tasks: [], remarks: []
}, extra);
const T = '2026-10-07';

test('предметы сопоставляются по названию', () => {
  assert.equal(A.gameSubject('Математика'), 'math');
  assert.equal(A.gameSubject('Английский язык'), 'eng');
  assert.equal(A.gameSubject('Русский язык'), null);
});
test('низкий средний балл даёт сильный фокус', () => {
  const s = school({ grades: [3, 3, 2, 4].map((v, i) => ({ childId: 'c', subjectId: 'm', value: v, date: `2026-10-0${i + 1}` })) });
  const r = A.analyze(s, 'c', T);
  assert.equal(r.math.focus, 2);
  assert.equal(r.eng.focus, 0);
});
test('хорошие оценки: фокуса нет', () => {
  const s = school({ grades: [5, 5, 4, 5].map((v, i) => ({ childId: 'c', subjectId: 'm', value: v, date: `2026-10-0${i + 1}` })) });
  assert.equal(A.analyze(s, 'c', T).math.focus, 0);
});
test('чужие оценки и старые оценки не учитываются', () => {
  const s = school({ grades: [{ childId: 'x', subjectId: 'm', value: 2, date: '2026-10-05' }, { childId: 'c', subjectId: 'm', value: 2, date: '2026-08-01' }] });
  assert.equal(A.analyze(s, 'c', T).math.focus, 0);
});
test('контрольная впереди попадает в exams, прошедшая и проверенная нет', () => {
  const s = school({ tasks: [
    { childId: 'c', subjectId: 'm', text: 'Контрольная по умножению', due: '2026-10-10', status: 'todo' },
    { childId: 'c', subjectId: 'm', text: 'Контрольная', due: '2026-10-01', status: 'todo' },
    { childId: 'c', subjectId: 'e', text: 'Тест', due: '2026-10-09', status: 'checked' }] });
  const r = A.analyze(s, 'c', T);
  assert.equal(r.math.exams.length, 1);
  assert.equal(r.math.exams[0].days, 3);
  assert.equal(r.eng.exams.length, 0);
});
test('темы берутся из невыполненных заданий, замечаний и комментариев', () => {
  const s = school({
    tasks: [{ childId: 'c', subjectId: 'm', text: 'Таблица умножения на 7', due: '2026-10-06', status: 'todo' }],
    grades: [{ childId: 'c', subjectId: 'm', value: 2, date: '2026-10-05', comment: 'ошибки в уравнениях' }] });
  const o = A.analyze(s, 'c', T).math;
  assert.equal(o.topics.length, 2);
  const gens = o.topics.flatMap(A.mathGensFromText);
  assert.ok(gens.includes('mul') && gens.includes('eq'));
});
test('ключевые слова', () => {
  assert.deepEqual(A.mathGensFromText('периметр прямоугольника').sort(), ['area4', 'geo1', 'geom']);
  assert.deepEqual(A.mathGensFromText('рисование'), []);
});
test('награда за проверенную домашку выдаётся один раз', () => {
  const s = school({ tasks: [
    { id: 'a', childId: 'c', status: 'checked', due: '2026-10-05' }, { id: 'b', childId: 'c', status: 'done', due: '2026-10-05' },
    { id: 'c1', childId: 'c', status: 'checked', due: '2026-10-04' }, { id: 'z', childId: 'x', status: 'checked', due: '2026-10-05' }] });
  assert.deepEqual(A.homeworkToPay(s, 'c', { c1: 1 }, T).map(t => t.id), ['a']);
});
test('сводка для дневника', () => {
  const st = { name: 'Маша', log: { '2026-10-06': { sec: 600, q: 10, ok: 8 }, '2026-09-01': { sec: 6000, q: 5, ok: 5 } }, mt: { mul1: { seen: 10, miss: 4 }, mul2: { seen: 10, miss: 1 } }, lessons: { 1: { done: true } } };
  const r = A.summary(st, T, { mul: 'Таблица умножения' });
  assert.equal(r.week.min, 10);
  assert.equal(r.math[0].acc, 75);
  assert.equal(r.doneLessons, 1);
});
