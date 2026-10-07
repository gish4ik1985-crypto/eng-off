// Облако дневника: тот же семейный код и та же Google-таблица, что и у игры (см. ../cloud/НАСТРОЙКА.md).
// Хранится одним документом; побеждает более новая версия. Фотографии остаются на устройстве, где их сделали.

const CK = 'engAdventure_cloud';
const ID = '__school';

function cfg() {
  let cl = {};
  try { cl = JSON.parse(localStorage.getItem(CK)) || {}; } catch { /* нет данных */ }
  const url = cl.url || (typeof globalThis.CLOUD_URL === 'string' ? globalThis.CLOUD_URL : '');
  return { url, code: cl.code || '' };
}
export const on = () => {
  const c = cfg();
  return !!(c.url && c.code);
};
async function api(op, data = {}) {
  const c = cfg();
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(c.url, { method: 'POST', body: JSON.stringify({ op, code: c.code, id: ID, ...data }), signal: ctl.signal });
    const j = await r.json();
    if (!j.ok) throw new Error(j.err || 'ошибка облака');
    return j;
  } finally { clearTimeout(t); }
}
// вернёт более свежую версию из облака или null
export async function pull(localTs) {
  if (!on()) return null;
  try {
    const r = await api('pull');
    if (!r.state) return null;
    const s = JSON.parse(r.state);
    return (s._ts || 0) > (localTs || 0) ? s : null;
  } catch { return null; }
}
// сводка, которую игра отправляет в облако для ребёнка с таким именем
export async function pullSummary(nameLower) {
  if (!on()) return null;
  try {
    const list = (await api('join')).players || [];
    const p = list.find((x) => String(x.id).startsWith('__sum_') && String(x.name).trim().toLowerCase() === nameLower);
    if (!p) return null;
    const r = await api('pull', { id: p.id });
    return r.state ? JSON.parse(r.state) : null;
  } catch { return null; }
}
let timer = 0;
export function pushSoon(state) {
  if (!on()) return;
  clearTimeout(timer);
  timer = setTimeout(async () => {
    try { await api('push', { name: ID, ts: state._ts || 0, state: JSON.stringify(state) }); } catch { /* повторится при следующем изменении */ }
  }, 3000);
}
