#!/usr/bin/env python3
"""Make compressed copies of game images, keeping the originals.

Usage: python tools/compress_images.py <folder> [<folder> ...]

- Opaque PNG/JPG -> <name>_q85.jpg (quality 85, progressive)
- Images with transparency -> <name>_q85.webp (quality 85, keeps alpha)
- Files already ending in _q85 are skipped, so the script can be re-run safely.
"""
import os
import sys
from PIL import Image

EXTS = ('.png', '.jpg', '.jpeg')


def compress(path):
    base, _ = os.path.splitext(path)
    im = Image.open(path)
    im.load()
    transparent = False
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        im = im.convert('RGBA')
        transparent = im.getchannel('A').getextrema()[0] < 255
    if transparent:
        out = base + '_q85.webp'
        im.save(out, 'WEBP', quality=85, method=4)
    else:
        out = base + '_q85.jpg'
        im.convert('RGB').save(out, 'JPEG', quality=85, optimize=True, progressive=True)
    return out


def main(folders):
    count = 0
    for root_folder in folders:
        for d, _, files in os.walk(root_folder):
            for f in sorted(files):
                base, ext = os.path.splitext(f)
                if ext.lower() not in EXTS or base.endswith('_q85'):
                    continue
                path = os.path.join(d, f)
                try:
                    out = compress(path)
                    print(f"{path} {os.path.getsize(path)} -> {os.path.basename(out)} {os.path.getsize(out)}")
                    count += 1
                except Exception as e:
                    print(f"ERROR {path}: {e}")
    print(f"done: {count} image(s) compressed")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1:])
