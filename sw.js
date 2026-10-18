/* Офлайн-режим: игра и дневник сохраняются на устройстве и открываются без интернета.
   VERSION и FILES вписывает build.py — не правьте их руками. Новый sw.js = новая версия игры:
   браузер скачает её в фоне, а старую копию удалит. Прогресс (localStorage, IndexedDB) здесь не хранится и не трогается. */
const VERSION = '20261018182545';
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
  'style.css?v=20261018182545',
  'config.js?v=20261018182545',
  'lessons.js?v=20261018182545',
  'lessons2.js?v=20261018182545',
  'lessons3.js?v=20261018182545',
  'lessons4.js?v=20261018182545',
  'lessons5.js?v=20261018182545',
  'dialogs.js?v=20261018182545',
  'songs.js?v=20261018182545',
  'audio.js?v=20261018182545',
  'extra.js?v=20261018182545',
  'audio2.js?v=20261018182545',
  'math.js?v=20261018182545',
  'math12.js?v=20261018182545',
  'math4.js?v=20261018182545',
  'ru.js?v=20261018182545',
  'ow.js?v=20261018182545',
  'pdd.js?v=20261018182545',
  'lit.js?v=20261018182545',
  'logic.js?v=20261018182545',
  'att.js?v=20261018182545',
  'izo.js?v=20261018182545',
  'content2.js?v=20261018182545',
  'content3.js?v=20261018182545',
  'content4.js?v=20261018182545',
  'content5.js?v=20261018182545',
  'content6.js?v=20261018182545',
  'content7.js?v=20261018182545',
  'it_a.js?v=20261018182545',
  'it_b.js?v=20261018182545',
  'it_c.js?v=20261018182545',
  'it_d.js?v=20261018182545',
  'it_e.js?v=20261018182545',
  'it_f.js?v=20261018182545',
  'it_g.js?v=20261018182545',
  'tr_en.js?v=20261018182545',
  'tr_it.js?v=20261018182545',
  'compounds.js?v=20261018182545',
  'sortdata.js?v=20261018182545',
  'lang.js?v=20261018182545',
  'more.js?v=20261018182545',
  'adapt.js?v=20261018182545',
  'game.js?v=20261018182545',
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
  if (req.method === 'GET' && /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) { // шрифт: один раз из сети, дальше с устройства
    e.respondWith(caches.open('fonts-v1').then(c => c.match(req).then(h => h || fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }))));
    return;
  }
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
