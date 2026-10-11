"""Собирает всю игру в ОДИН файл english-selfstudy.html (удобно скинуть на планшет).
Заодно обновляет версию в index.html и список файлов для офлайн-режима в sw.js.
Запуск:  python build.py
"""
import re, pathlib, time

root = pathlib.Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')
# версия в адресах файлов: после обновления браузер и GitHub Pages не показывают старые скрипты и стили из кеша
ver = time.strftime('%Y%m%d%H%M%S')
html = re.sub(r'(<script src="[^"?]+|<link rel="stylesheet" href="[^"?]+)(\?v=\w+)?"', lambda m: m.group(1) + '?v=' + ver + '"', html)
(root / 'index.html').write_text(html, encoding='utf-8', newline='')

# офлайн-режим: что сохранить на устройстве — игра (с версией в адресе), иконки и дневник
files = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'config.js']
files += re.findall(r'<(?:script src|link rel="stylesheet" href)="([^"]+\?v=\w+)"', html)
school = root / 'school'
files += ['school/', 'school/index.html'] + sorted(p.relative_to(root).as_posix() for p in [school / 'icon.svg', *school.glob('css/*.css'), *school.glob('js/*.js')])
for f in files:
    assert f.endswith('/') or (root / f.split('?')[0]).is_file(), 'нет файла ' + f
sw = (root / 'sw.js').read_text(encoding='utf-8')
sw = re.sub(r"const VERSION = '\w*';", "const VERSION = '" + ver + "';", sw, count=1)
sw = re.sub(r'const FILES = \[.*?\];', 'const FILES = [\n' + ',\n'.join("  '" + f + "'" for f in files) + '\n];', sw, count=1, flags=re.S)
(root / 'sw.js').write_text(sw, encoding='utf-8', newline='')

css = (root / 'style.css').read_text(encoding='utf-8')
html = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda m: '<style>\n' + css + '\n</style>', html)

def inline(m):
    js = (root / m.group(1)).read_text(encoding='utf-8')
    return '<script>\n' + js + '\n</script>'

html = re.sub(r'<script src="([^"?]+)[^"]*"></script>', inline, html)
out = root / 'english-selfstudy.html'
out.write_text(html, encoding='utf-8')
print('Готово:', out, round(out.stat().st_size / 1024), 'КБ; офлайн-файлов:', len(files))
