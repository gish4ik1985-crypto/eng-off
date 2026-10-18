// Права доступа: по умолчанию дневник открыт только для просмотра (ребёнок).
// Править можно после ввода пароля администратора (Haw, тот же, что и в игре). Пароль хранится только в виде хэша.
// Это защита от случайных и «любопытных» нажатий, а не от взлома.

const ADMIN_SALT = 'haw-eng-1|', ADMIN_HASH = 'd519a3b9ab0112739de672eaeccd2f1e429de23aac42f50f6c14b48ced923f90';
function sha256(ascii) {
  const rr = (v, a) => (v >>> a) | (v << (32 - a)), maxWord = Math.pow(2, 32); let result = '', i, j;
  const words = [], bits = ascii.length * 8, hash = sha256.h = sha256.h || [], k = sha256.k = sha256.k || []; let pc = k.length; const comp = {};
  for (let c = 2; pc < 64; c++) { if (!comp[c]) { for (i = 0; i < 313; i += c) comp[i] = c; hash[pc] = (Math.pow(c, .5) * maxWord) | 0; k[pc++] = (Math.pow(c, 1 / 3) * maxWord) | 0; } }
  ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); if (j >> 8) return ''; words[i >> 2] |= j << ((3 - i) % 4) * 8; }
  words[words.length] = (bits / maxWord) | 0; words[words.length] = bits;
  let h = hash;
  for (j = 0; j < words.length;) {
    const w = words.slice(j, j += 16), old = h; h = h.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2], a = h[0], e = h[4];
      const t1 = h[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & h[5]) ^ (~e & h[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
      const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
      h = [(t1 + t2) | 0].concat(h); h[4] = (h[4] + t1) | 0;
    }
    for (i = 0; i < 8; i++) h[i] = (h[i] + old[i]) | 0;
  }
  for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { const b = (h[i] >> (j * 8)) & 255; result += (b < 16 ? 0 : '') + b.toString(16); }
  return result;
}
const adminCheck = v => { const t = String(v || ''); return /^[ -~]{1,64}$/.test(t) && sha256(ADMIN_SALT + t) === ADMIN_HASH; };
export const FLAG = 'school-off:edit';
const LIFETIME = 30 * 60 * 1000; // режим правки сам выключается через 30 минут без действий

export const getPin = () => 'admin'; // совместимость: пароль администратора есть всегда
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
  if (!adminCheck(String(pin).trim())) return 'bad';
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

// После каждой отрисовки убираем из страницы всё, что правит данные:
// кнопки удаляются, поля ввода превращаются в обычный текст.
export function apply(root) {
  if (canEdit()) return;
  root.querySelectorAll('[data-act]').forEach((el) => {
    if (SAFE.has(el.dataset.act)) return;
    if (el.matches('textarea')) {
      const d = document.createElement('div');
      const text = el.value.trim();
      if (!text) { el.remove(); return; } // пустое поле в режиме просмотра не показываем
      d.className = 'rotext';
      d.textContent = text;
      el.replaceWith(d);
    } else if (el.matches('select, input')) {
      const sp = document.createElement('span');
      const opt = el.matches('select') ? el.selectedOptions[0]?.textContent ?? '' : el.value;
      sp.className = `roval ${[...el.classList].join(' ')}`;
      sp.textContent = opt && opt !== '—' ? opt : '—';
      if (sp.textContent === '—' && el.dataset.act === 'grade-edit') { el.remove(); return; }
      el.replaceWith(sp);
    } else if (el.dataset.act === 'hw-status') {
      if (!el.dataset.id) { el.remove(); return; } // нет задания — нечего показывать
      const s = document.createElement('span');
      s.className = el.className;
      s.textContent = el.textContent;
      el.replaceWith(s);
    } else {
      el.remove();
    }
  });
  root.querySelectorAll('.quick, .actions, .toolbar, .nolesson + .dnotes .chip').forEach((q) => { if (!q.children.length && !q.textContent.trim()) q.remove(); });
}
