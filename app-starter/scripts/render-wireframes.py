#!/usr/bin/env python3
"""Render editable SVG and matching PNG draft wireframes from structured per-screen layouts."""
import argparse
import html
import json
import re
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:
    raise SystemExit('Pillow is required: python3 -m pip install Pillow') from exc

INK = '#243448'
LIGHT = '#f3f5f7'
EDGE = '#c5ced8'
MID = '#dce4ec'
ACCENT = '#b5c5d8'


def text_font(size):
    for font in ('DejaVuSans.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        try:
            return ImageFont.truetype(font, size)
        except OSError:
            pass
    return ImageFont.load_default()


def drawing(root, screen, layout, variant):
    platform = root.joinpath('design/screens.json')
    kind = json.loads(platform.read_text())['platform']
    if variant == 'desktop':
        width, height = (1440, 900) if kind == 'web' else (820, 1180)
    else:
        width, height = (390, 844) if kind == 'web' else (393, 852)
    margin = 72 if variant == 'desktop' else 22
    image = Image.new('RGB', (width, height), LIGHT)
    draw = ImageDraw.Draw(image)
    elements = []

    def box(x, y, w, h, fill, label='', label_size=18):
        x, y, w, h = (int(z) for z in (x, y, w, h))
        draw.rounded_rectangle((x, y, x+w, y+h), radius=min(15, h//8), fill=fill, outline=EDGE, width=2)
        elements.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{EDGE}" stroke-width="2"/>')
        if label:
            label = str(label)[:70]
            draw.text((x+16, y+12), label, font=text_font(label_size), fill=INK)
            elements.append(f'<text x="{x+16}" y="{y+12+label_size}" font-size="{label_size}" fill="{INK}" font-family="sans-serif">{html.escape(label)}</text>')

    box(0, 0, width, 62, '#e8eef5', f'DRAFT WIREFRAME • {screen["name"]}', 16)
    box(margin, 86, width-2*margin, 60, '#e9eef3', 'Logo   /   Navigation   /   Actions', 15)
    y = 172
    sections = layout.get('sections', [])
    for section in sections:
        label = section.get('label', 'Content block')
        kind = section.get('kind', 'content')
        desired = int(section.get('height', 160))
        remain = height - y - 105
        if remain < 60:
            break
        h = min(desired if variant == 'desktop' else int(desired*0.85), remain)
        fill = ACCENT if kind in ('hero', 'cta') else MID if kind == 'media' else '#e9edf2'
        box(margin, y, width-2*margin, h, fill, label, 18 if variant == 'desktop' else 15)
        if kind == 'hero' and h >= 130:
            box(margin+18, y+62, min(width-2*margin-36, 230), 42, '#ffffff', 'Primary action', 14)
        y += h+18
    if y < height-66:
        box(margin, height-80, width-2*margin, 44, '#dce3ea', 'Footer / secondary links', 13)
    image_draw = ImageDraw.Draw(image)
    image_draw.text((margin, height-27), 'DRAFT • Validate against approved plan before implementation', font=text_font(11), fill=INK)
    elements.append(f'<text x="{margin}" y="{height-12}" font-size="12" fill="{INK}" font-family="sans-serif">DRAFT • Review before implementation</text>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="100%" height="100%" fill="{LIGHT}"/>' + ''.join(elements) + '</svg>'
    return image, svg


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', type=Path, default=Path.cwd())
    p.add_argument('--only', help='Render just one screen ID')
    args = p.parse_args()
    root = args.root.resolve()
    manifest = json.loads((root/'design/screens.json').read_text())
    export = root/'design/wireframes/exports'
    export.mkdir(parents=True, exist_ok=True)
    done = []
    for screen in manifest['screens']:
        if args.only and screen['id'] != args.only:
            continue
        spec = root/'design/wireframes'/f'{screen["id"]}.json'
        layout = json.loads(spec.read_text(encoding='utf-8'))
        if layout.get('screen_id') != screen['id']:
            raise SystemExit(f'Mismatched wireframe layout: {spec}')
        for variant in ('desktop', 'mobile'):
            image, svg = drawing(root, screen, layout, variant)
            basename = f'{screen["id"]}-{variant}'
            image.save(export/f'{basename}.png')
            (export/f'{basename}.svg').write_text(svg, encoding='utf-8')
            done.append(str(export/f'{basename}.png'))
    if not done:
        raise SystemExit(f'No screen found: {args.only}')
    print(f'Exported {len(done)} draft PNG wireframes and matching SVG sources to {export}')


if __name__ == '__main__':
    main()
