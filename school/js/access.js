// Права доступа: по умолчанию дневник открыт только для просмотра (ребёнок).
// Править можно после ввода PIN-кода родителя (тот же код, что и в «Родителям» в игре).
// Это защита от случайных и «любопытных» нажатий, а не от взлома.

const PIN_KEY = 'engAdventure_pin';
export const FLAG = 'school-off:edit';
const LIFETIME = 30 * 60 * 1000; // режим правки сам выключается через 30 минут без действий

export const getPin = () => {
  try { return localStorage.getItem(PIN_KEY) || ''; } catch { return ''; }
};
export const canEdit = () => {
  try {
    const t = Number(sessionStorage.getItem(FLAG));
    return !!t && Date.now() - t < LIFETIME;
  } catch { return false; }
};
export const touch = () => {
  try { if (canEdit()) sessionStorage.setItem(FLAG, String(Date.now())); } catch { /* нет хранилища */ }
};
export function unlock(pin) {
  if (!getPin()) return 'nopin';
  if (String(pin).trim() !== getPin()) return 'bad';
  try { sessionStorage.setItem(FLAG, String(Date.now())); } catch { /* нет хранилища */ }
  return 'ok';
}
export const lock = () => {
  try { sessionStorage.removeItem(FLAG); } catch { /* нет хранилища */ }
};

// Действия, которые только листают и показывают: разрешены всем.
export const SAFE = new Set([
  'diary-shift', 'diary-now', 'toggle-sat', 'week-shift', 'week-now', 'task-filter', 'grade-filter',
  'totals-shift', 'totals-now', 'open-photo', 'close-lightbox', 'goto-grades', 'copy-summary',
]);

// В режиме просмотра перехватываем любые правки ещё до того, как их увидит само приложение.
function guard(e) {
  if (canEdit()) { touch(); return; }
  const el = e.target?.closest?.('[data-act]');
  if (el && !SAFE.has(el.dataset.act)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return;
  }
  if (e.target?.closest?.('dialog form, #dlg form')) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}
['click', 'change', 'input', 'submit', 'keydown'].forEach((t) => document.addEventListener(t, guard, true));

// После каждой отрисовки убираем из страницы всё, что правит данные.
export function apply(root) {
  if (canEdit()) return;
  root.querySelectorAll('[data-act]').forEach((el) => {
    if (SAFE.has(el.dataset.act)) return;
    if (el.matches('textarea, select, input')) {
      el.disabled = true;
    } else if (el.dataset.act === 'hw-status') {
      const s = document.createElement('span');
      s.className = el.className;
      s.textContent = el.textContent;
      el.replaceWith(s);
    } else {
      el.remove();
    }
  });
  root.querySelectorAll('.quick, .toolbar').forEach((q) => { if (!q.children.length) q.remove(); });
}
