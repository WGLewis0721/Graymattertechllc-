#!/usr/bin/env python3
"""Produce a labeled real before/after PNG comparison. Never substitutes wireframe for an after image."""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageDraw


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--before', type=Path, required=True)
    parser.add_argument('--after', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--root', type=Path, help='Project root, if comparison should update screen evidence manifest')
    parser.add_argument('--screen', help='Screen ID to attach comparison (requires --root)')
    args = parser.parse_args()
    if not args.before.is_file() or not args.after.is_file():
        parser.error('Both real before and after screenshots must exist')
    if 'wireframes' in args.after.parts:
        parser.error('A draft wireframe cannot stand in for a real after screenshot')
    a = Image.open(args.before).convert('RGB')
    b = Image.open(args.after).convert('RGB')
    pane_w, pane_h = 650, 960
    output = Image.new('RGB', (pane_w*2+60, pane_h+100), '#f5f6f8')
    draw = ImageDraw.Draw(output)
    for ix, (img, label) in enumerate(((a, 'BEFORE: original screenshot'), (b, 'AFTER: implemented screen'))):
        img.thumbnail((pane_w, pane_h), Image.Resampling.LANCZOS)
        x = 20 + ix*(pane_w+20)
        draw.text((x, 20), label, fill='#152238')
        output.paste(img, (x, 55))
        draw.rectangle((x-1, 54, x+img.width, 55+img.height), outline='#aeb8c2', width=2)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    output.save(args.out)
    if args.root or args.screen:
        if not args.root or not args.screen:
            parser.error('--root and --screen must be specified together')
        root = args.root.resolve()
        manifest_path = root/'design/screens.json'
        manifest = json.loads(manifest_path.read_text())
        match = next((s for s in manifest['screens'] if s['id'] == args.screen), None)
        if match is None:
            parser.error('Screen not listed in design/screens.json')
        def relative(path):
            value = path.resolve()
            if not value.is_relative_to(root):
                parser.error('Screenshots and comparison must be under project root')
            return value.relative_to(root).as_posix()
        before, after, comparison = map(relative, (args.before, args.after, args.out))
        if before not in manifest.get('baseline_screenshots', []):
            manifest.setdefault('baseline_screenshots', []).append(before)
        for dest, key in ((manifest, 'after_screenshots'), (match, 'after_screenshots')):
            if after not in dest.setdefault(key, []):
                dest[key].append(after)
        for dest, key in ((manifest, 'comparison_images'), (match, 'comparison_images')):
            if comparison not in dest.setdefault(key, []):
                dest[key].append(comparison)
        manifest_path.write_text(json.dumps(manifest, indent=2)+'\n')
    print(f'Wrote before/after comparison: {args.out}')


if __name__ == '__main__':
    main()
