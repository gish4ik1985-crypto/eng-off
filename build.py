"""Собирает всю игру в ОДИН файл english-selfstudy.html (удобно скинуть на планшет).
Запуск:  python build.py
"""
import re, pathlib

root = pathlib.Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')

css = (root / 'style.css').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')

def inline(m):
    js = (root / m.group(1)).read_text(encoding='utf-8')
    return '<script>\n' + js + '\n</script>'

html = re.sub(r'<script src="([^"]+)"></script>', inline, html)
out = root / 'english-selfstudy.html'
out.write_text(html, encoding='utf-8')
print('Готово:', out, round(out.stat().st_size / 1024), 'КБ')
