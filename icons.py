"""Рисует иконки приложения (запуск: python icons.py). Рисунок: открытая книга и звезда на голубом фоне. Рисует PNG и SVG с одинаковым рисунком."""
import math, pathlib
from PIL import Image, ImageDraw

root = pathlib.Path(__file__).parent
BG, INK, PAGE, LINE, STAR = '#8ed1fc', '#1b1b1b', '#ffffff', '#64b5f6', '#ffd54f'


def bez(p0, p1, p2, p3, n=40):
    return [tuple((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d for a, b, c, d in zip(p0, p1, p2, p3)) for t in (i / n for i in range(n + 1))]


def shapes():
    # координаты в системе 512×512, как в icon.svg
    left = bez((256, 196), (210, 168), (150, 162), (104, 172)) + bez((104, 372), (150, 362), (210, 368), (256, 396))
    right = [(512 - x, y) for x, y in left]
    lines = []
    for k, y in enumerate((214, 250, 286, 322)):
        lines.append([(132, y - 6 + k * 2), (226, y + 6 + k * 2)])
        lines.append([(512 - 132, y - 6 + k * 2), (512 - 226, y + 6 + k * 2)])
    star = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        r = 64 if i % 2 == 0 else 28
        star.append((256 + r * math.cos(a), 112 + r * math.sin(a)))
    return left, right, lines, star


def render(size, rounded, scale):
    S = 4 * size
    k = S / 512
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(110 * k), fill=BG)
    else:
        d.rectangle([0, 0, S, S], fill=BG)
    tr = lambda pts: [((256 + (x - 256) * scale) * k, (256 + (y - 256) * scale) * k) for x, y in pts]
    w = lambda v: max(1, int(v * k * scale))
    left, right, lines, star = shapes()

    def poly(pts, fill, width):
        p = tr(pts)
        d.polygon(p, fill=fill)
        d.line(p + [p[0]], fill=INK, width=w(width), joint='curve')
        for x, y in p:
            r = w(width) / 2
            d.ellipse([x - r, y - r, x + r, y + r], fill=INK) if (x, y) in (p[0], p[len(p) // 2 - 1], p[len(p) // 2], p[-1]) else None

    poly(left, PAGE, 16)
    poly(right, PAGE, 16)
    for ln in lines:
        d.line(tr(ln), fill=LINE, width=w(10))
    poly(star, STAR, 12)
    return img.resize((size, size), Image.LANCZOS)


render(192, True, 1).save(root / 'icon-192.png')
render(512, True, 1).save(root / 'icon-512.png')
render(512, False, .8).save(root / 'icon-maskable-512.png')  # для Android: рисунок в безопасной зоне, фон до краёв
render(180, False, .9).convert('RGB').save(root / 'apple-touch-icon.png')  # iPad сам скругляет углы

left, right, lines, star = shapes()
P = lambda pts: ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="{BG}"/><g stroke="{INK}" stroke-linejoin="round"><polygon points="{P(left)}" fill="{PAGE}" stroke-width="16"/><polygon points="{P(right)}" fill="{PAGE}" stroke-width="16"/><polygon points="{P(star)}" fill="{STAR}" stroke-width="12"/></g><g stroke="{LINE}" stroke-width="10" stroke-linecap="round">{''.join(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}"/>' for a, b in lines)}</g></svg>
'''
(root / 'icon.svg').write_text(svg, encoding='utf-8', newline='')
print('ok')
