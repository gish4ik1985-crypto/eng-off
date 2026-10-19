#!/usr/bin/env python
"""Добавить учебник в проект одной командой: PDF -> страницы-картинки -> распознанный текст (всё локально, без интернета и без лимитов).

  python tools/book.py <файл.pdf> <id-книги> [--dpi 92] [--quality 58] [--lang rus] [--no-ocr]
  пример:  python tools/book.py "C:/Users/me/Desktop/russkiy-3-1.pdf" rus3-1

Что делает:
  1. books/<id>/pNNN.jpg  — страницы (номер файла = номер страницы PDF, обложка = p000);
  2. books/<id>/text.json — распознанный текст каждой страницы (tools/ocr/ocr.js, Tesseract);
  3. подсказывает, какую запись добавить в books/books.js (название, предмет, класс, оглавление).
Нужно один раз:  pip install pymupdf pillow   и   cd tools/ocr && npm install
Если у PDF уже есть текстовый слой, он берётся без распознавания."""
import argparse, json, os, subprocess, sys
import warnings
warnings.filterwarnings('ignore')
import pymupdf
from PIL import Image

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('pdf'); ap.add_argument('id')
ap.add_argument('--dpi', type=int, default=92); ap.add_argument('--quality', type=int, default=58)
ap.add_argument('--lang', default='rus'); ap.add_argument('--no-ocr', action='store_true')
a = ap.parse_args()

out = os.path.join(root, 'books', a.id)
os.makedirs(out, exist_ok=True)
doc = pymupdf.open(a.pdf)
layer = {}
for i, p in enumerate(doc):
    pm = p.get_pixmap(dpi=a.dpi)
    Image.frombytes('RGB', (pm.width, pm.height), pm.samples).save(os.path.join(out, 'p%03d.jpg' % i), 'JPEG', quality=a.quality, optimize=True, progressive=True)
    t = p.get_text().strip()
    if len(t) > 40: layer[i] = t
mb = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) / 1e6
print(f'Страниц: {len(doc)}, размер картинок: {mb:.1f} МБ -> {out}')

tj = os.path.join(out, 'text.json')
if len(layer) > len(doc) // 2:
    json.dump({str(k): v for k, v in layer.items()}, open(tj, 'w', encoding='utf-8'), ensure_ascii=False)
    print('В PDF есть текстовый слой — распознавание не нужно.')
elif not a.no_ocr:
    ocr = os.path.join(root, 'tools', 'ocr')
    if not os.path.isdir(os.path.join(ocr, 'node_modules')):
        subprocess.check_call('npm install', cwd=ocr, shell=True)
    subprocess.check_call(['node', 'ocr.js', out, '--lang', a.lang], cwd=ocr)
print(f"\nОсталось добавить запись в books/books.js:\n  {{ id: '{a.id}', subj: 'ru', cls: 3, pages: {len(doc)}, dir: 'books/{a.id}/', title: '…', authors: '…', toc: [['Глава', 5, 0]] }}")
