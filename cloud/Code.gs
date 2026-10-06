/* Остров английских слов: облачное хранилище прогресса (Google Apps Script).
   Вставьте этот код в Google-таблицу: Расширения -> Apps Script. Подробности: cloud/НАСТРОЙКА.md */

var CHUNK = 40000; // в одну ячейку помещается не больше 50 000 знаков

function sheet_(name, head) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.getRange(1, 1, s.getMaxRows(), head.length).setNumberFormat('@'); // всё как текст (иначе 0123 станет 123)
    s.appendRow(head);
  }
  return s;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var out;
  try {
    lock.waitLock(25000);
    out = handle_(JSON.parse(e.postData.contents));
  } catch (err) {
    out = { ok: false, err: String(err) };
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Остров английских слов: облако работает');
}

function handle_(r) {
  var code = String(r.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length < 6) return { ok: false, err: 'Код слишком короткий' };
  var fam = sheet_('Семьи', ['Код', 'PIN', 'Создана']);
  var fv = fam.getDataRange().getValues(), fr = -1;
  for (var i = 1; i < fv.length; i++) if (String(fv[i][0]) === code) { fr = i + 1; break; }
  var pin = fr > 0 ? String(fv[fr - 1][1] || '') : '';

  if (r.op === 'init') {
    if (fr < 0) { fam.appendRow([code, '', new Date().toISOString()]); return { ok: true, created: true, pin: '', players: [] }; }
    return { ok: true, created: false, pin: pin, players: players_(code) };
  }
  if (fr < 0) return { ok: false, err: 'Такого семейного кода нет' };

  if (r.op === 'join') return { ok: true, pin: pin, players: players_(code) };
  if (r.op === 'setpin') { fam.getRange(fr, 2).setValue(String(r.pin || '')); return { ok: true }; }

  var key = code + '|' + String(r.id || '');
  var data = sheet_('data', ['key', 'ts', 'part', 'chunk', 'name']);
  if (r.op === 'pull') {
    var v = data.getDataRange().getValues(), parts = [], ts = 0, name = '';
    for (var j = 1; j < v.length; j++) if (String(v[j][0]) === key) { parts[Number(v[j][2])] = String(v[j][3]); ts = Number(v[j][1]); name = String(v[j][4]); }
    if (!parts.length) return { ok: true, state: null };
    return { ok: true, state: parts.join(''), ts: ts, name: name };
  }
  if (r.op === 'push') {
    var all = data.getDataRange().getValues();
    for (var k = all.length - 1; k >= 1; k--) if (String(all[k][0]) === key) data.deleteRow(k + 1);
    var st = String(r.state || ''), n = 0;
    for (var p = 0; p < st.length || n === 0; p += CHUNK, n++) data.appendRow([key, String(r.ts || 0), String(n), st.substr(p, CHUNK), String(r.name || '')]);
    report_(key, String(r.name || ''), st);
    return { ok: true };
  }
  return { ok: false, err: 'unknown op' };
}

function players_(code) {
  var data = sheet_('data', ['key', 'ts', 'part', 'chunk', 'name']);
  var v = data.getDataRange().getValues(), out = [];
  for (var i = 1; i < v.length; i++) {
    var k = String(v[i][0]);
    if (k.indexOf(code + '|') === 0 && Number(v[i][2]) === 0) out.push({ id: k.substr(code.length + 1), name: String(v[i][4]), ts: Number(v[i][1]) });
  }
  return out;
}

// читаемая таблица для родителей: по строке на каждый день занятий
function report_(key, name, stateJson) {
  var log = {};
  try { log = JSON.parse(stateJson).log || {}; } catch (e) {}
  var sh = sheet_('Отчёт', ['key', 'Игрок', 'Дата', 'Минут', 'Вопросов', 'Верных', '% верных', 'Уроков', 'Диалогов', 'Песен', 'Аудио', 'Тренировок', 'Карточек']);
  var v = sh.getDataRange().getValues(), keep = [v[0]];
  for (var i = 1; i < v.length; i++) if (String(v[i][0]) !== key) keep.push(v[i]);
  Object.keys(log).sort().forEach(function (d) {
    var x = log[d];
    keep.push([key, name, d, Math.round((x.sec || 0) / 60), x.q || 0, x.ok || 0, x.q ? Math.round(100 * (x.ok || 0) / x.q) : 0, x.les || 0, x.dlg || 0, x.song || 0, x.aud || 0, x.tr || 0, x.card || 0]);
  });
  sh.clearContents();
  if (sh.getMaxRows() < keep.length + 1) sh.insertRowsAfter(sh.getMaxRows(), keep.length - sh.getMaxRows() + 50);
  sh.getRange(1, 1, keep.length, 13).setNumberFormat('@').setValues(keep.map(function (row) { return row.map(String); }));
}
