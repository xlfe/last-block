#!/usr/bin/env python3
"""Prepare ignored static output from hand-authored source and original inputs."""
from pathlib import Path
import shutil
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Asset preparation needs Pillow for Python 3. Add it to the project environment, then rerun npm run build. No files were prepared.')

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = {
    'route-desk.jpg': 'PXL_20261023_062931472.jpg',
    'mimic-board.jpg': 'PXL_20261023_063018289.jpg',
    'power-desk.jpg': 'PXL_20261023_062925354.jpg',
}
SOURCES = ('index.html', 'styles.css', 'app.mjs', 'sim.mjs', 'sound.mjs', 'network.mjs', 'network-ui.mjs', 'network-data.mjs', 'network-paths.mjs', 'network-renderer.mjs', 'graph.css', 'workspace.css')
for name in (*[ROOT / 'app' / name for name in SOURCES], *[ROOT / 'images' / name for name in PHOTOS.values()]):
    if not name.is_file():
        sys.exit(f'Required source input missing: {name.relative_to(ROOT)}')
output = ROOT / 'dist'
(output / 'assets').mkdir(parents=True, exist_ok=True)
for name in SOURCES:
    shutil.copyfile(ROOT / 'app' / name, output / name)
for destination, original in PHOTOS.items():
    with Image.open(ROOT / 'images' / original) as image:
        prepared = ImageOps.exif_transpose(image).convert('RGB')
        prepared.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        prepared.save(output / 'assets' / destination, 'JPEG', quality=85, optimize=True)
print('Prepared dist/ from app/ and three original photographic inputs.')
