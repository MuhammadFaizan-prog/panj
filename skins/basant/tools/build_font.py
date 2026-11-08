"""Build src/assets/fonts/nunito-var.woff2 ("Basant Nunito") from Nunito[wght].ttf (SIL OFL 1.1, no Reserved Font
Name; https://github.com/googlefonts/nunito). Two changes so the clock sets like the locked reference:
  - "1" maps to Nunito's footless one (one.ss01) with a proportional advance (the reference's "03:12" has a narrow 1);
  - the family is renamed "Basant Nunito", as the OFL asks of modified versions.
Subset to Basic Latin plus a few marks.

    python3 build_font.py /path/Nunito[wght].ttf [out.woff2]
"""
import os, sys
from fontTools.ttLib import TTFont
from fontTools import subset

SRC = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '../src/assets/fonts/nunito-var.woff2')
ONE_ADVANCE, ONE_LSB = 363, 86

f = TTFont(SRC)
glyf, hmtx = f['glyf'], f['hmtx']
g = glyf['one.ss01']
dx = ONE_LSB - g.xMin
coords = g.getCoordinates(glyf)[0]
for i in range(len(coords)):
    coords[i] = (coords[i][0] + dx, coords[i][1])
g.recalcBounds(glyf)
hmtx['one.ss01'] = (ONE_ADVANCE, g.xMin)
# variable phantom points: keep the advance fixed across weights by dropping the advance deltas
if 'gvar' in f:
    n = len(coords)
    for var in f['gvar'].variations.get('one.ss01', []):
        c = var.coordinates
        if len(c) >= n + 4:
            c[n + 1] = (0, 0) if c[n + 1] is not None else None   # right side bearing phantom point
            c[n] = (0, 0) if c[n] is not None else None           # left phantom point
if 'HVAR' in f:
    del f['HVAR']   # advances come from gvar phantom points instead (Chrome supports both)
for table in f['cmap'].tables:
    if ord('1') in table.cmap:
        table.cmap[ord('1')] = 'one.ss01'
for rec in f['name'].names:
    if rec.nameID in (1, 4, 16):
        rec.string = rec.toUnicode().replace('Nunito', 'Basant Nunito')
    elif rec.nameID == 6:
        rec.string = rec.toUnicode().replace('Nunito', 'BasantNunito')
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.name_IDs = ['*']
sub = subset.Subsetter(opts)
sub.populate(unicodes=list(range(0x20, 0x7F)) + [0xA0, 0xD7, 0x2013, 0x2014, 0x2026, 0x2212])
sub.subset(f)
f.flavor = 'woff2'
f.save(OUT)
print('ok', OUT)
