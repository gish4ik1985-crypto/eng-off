/* Офлайн-режим: игра и дневник сохраняются на устройстве и открываются без интернета.
   VERSION и FILES вписывает build.py — не правьте их руками. Новый sw.js = новая версия игры:
   браузер скачает её в фоне, а старую копию удалит. Прогресс (localStorage, IndexedDB) здесь не хранится и не трогается. */
const VERSION = '20261011161013';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'config.js',
  'style.css?v=20261011161013',
  'config.js?v=20261011161013',
  'lessons.js?v=20261011161013',
  'lessons2.js?v=20261011161013',
  'lessons3.js?v=20261011161013',
  'lessons4.js?v=20261011161013',
  'lessons5.js?v=20261011161013',
  'dialogs.js?v=20261011161013',
  'songs.js?v=20261011161013',
  'audio.js?v=20261011161013',
  'extra.js?v=20261011161013',
  'audio2.js?v=20261011161013',
  'math.js?v=20261011161013',
  'math12.js?v=20261011161013',
  'math4.js?v=20261011161013',
  'ru.js?v=20261011161013',
  'ow.js?v=20261011161013',
  'pdd.js?v=20261011161013',
  'lit.js?v=20261011161013',
  'logic.js?v=20261011161013',
  'att.js?v=20261011161013',
  'izo.js?v=20261011161013',
  'content2.js?v=20261011161013',
  'content3.js?v=20261011161013',
  'content4.js?v=20261011161013',
  'content5.js?v=20261011161013',
  'content6.js?v=20261011161013',
  'content7.js?v=20261011161013',
  'it_a.js?v=20261011161013',
  'it_b.js?v=20261011161013',
  'it_c.js?v=20261011161013',
  'it_d.js?v=20261011161013',
  'it_e.js?v=20261011161013',
  'it_f.js?v=20261011161013',
  'it_g.js?v=20261011161013',
  'tr_en.js?v=20261011161013',
  'tr_it.js?v=20261011161013',
  'compounds.js?v=20261011161013',
  'lang.js?v=20261011161013',
  'adapt.js?v=20261011161013',
  'game.js?v=20261011161013',
  'school/',
  'school/index.html',
  'school/css/style.css',
  'school/icon.svg',
  'school/js/access.js',
  'school/js/app.js',
  'school/js/cloud.js',
  'school/js/diary.js',
  'school/js/grades.js',
  'school/js/logic.js',
  'school/js/remind.js',
  'school/js/store.js',
  'school/js/week.js'
];
const CACHE = 'sa-' + VERSION;

self.addEventListener('install', e => {
  // cache: 'reload' — берём файлы с сервера, а не из старого кеша браузера
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('sa-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const keep = (req, r) => { if (r && r.ok && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)).catch(() => {}); } return r; };
const local = req => caches.match(req, { ignoreVary: true, ignoreSearch: req.mode === 'navigate' }).then(h => h || (req.mode === 'navigate'
  ? caches.match(new URL(req.url).pathname.includes('/school/') ? 'school/index.html' : './', { ignoreVary: true }) : null));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return; // облако, онлайн-озвучка — напрямую в сеть
  if (/[?&]v=/.test(url.search)) { // файл с версией в адресе не меняется — сразу с устройства
    e.respondWith(caches.match(req, { ignoreVary: true }).then(h => h || fetch(req).then(r => keep(req, r))));
    return;
  }
  // страницы и файлы без версии: сначала из сети (так приходят обновления); нет сети или она медленная — с устройства
  e.respondWith(new Promise(res => {
    let done = false;
    const give = r => { if (!done && r) { done = true; res(r); } return done; };
    const slow = setTimeout(() => local(req).then(give), 4000);
    fetch(req).then(r => { clearTimeout(slow); give(keep(req, r)); },
      () => { clearTimeout(slow); local(req).then(h => give(h) || give(Response.error())); });
  }));
});

// экран «Родителям» спрашивает, всё ли сохранено на устройстве
self.addEventListener('message', e => {
  if (e.data !== 'status' || !e.ports[0]) return;
  caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.match(f, { ignoreVary: true }))))
    .then(a => e.ports[0].postMessage({ ver: VERSION, need: FILES.length, have: a.filter(Boolean).length }));
});
