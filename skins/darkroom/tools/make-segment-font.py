"""Build the Darkroom seven-segment LED font (original, hand-authored geometry).

Run:  python3 skins/darkroom/tools/make-segment-font.py
Out:  skins/darkroom/src/fonts/darkroom-segments.woff

Glyphs: 0-9 : - / . and space. Every other character falls back to the next font in the stack.
Needs fontTools (pip install fonttools). The output is committed, so the build does not need Python.
"""
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

UPM = 1000
ASC, DESC = 800, -200
SLANT = 0.0   # upright, as the locked reference's LED module

# Digit cell (font units)
# Geometry measured off the locked reference (darkroom-ref.webp) at font-size 40px (25 units per pixel):
# digits 18 x 29.5 px outer, 4 px segments, 21.5 px pitch.
X0, X1 = 40, 490          # left / right outer edges
Y0, Y1 = 0, 737           # bottom / top outer edges
T = 92                    # segment thickness
G = 12                    # gap between segments
YM = (Y0 + Y1) / 2


def hseg(xa, xb, y):
    h = T / 2
    return [(xa, y), (xa + h, y - h), (xb - h, y - h), (xb, y), (xb - h, y + h), (xa + h, y + h)]


def vseg(x, ya, yb):
    h = T / 2
    return [(x, ya), (x + h, ya + h), (x + h, yb - h), (x, yb), (x - h, yb - h), (x - h, ya + h)]


L, R = X0 + T / 2, X1 - T / 2
B, TOP = Y0 + T / 2, Y1 - T / 2
SEG = {
    "a": hseg(L + G, R - G, TOP),
    "b": vseg(R, YM + G, TOP - G),
    "c": vseg(R, B + G, YM - G),
    "d": hseg(L + G, R - G, B),
    "e": vseg(L, B + G, YM - G),
    "f": vseg(L, YM + G, TOP - G),
    "g": hseg(L + G, R - G, YM),
}
DIGITS = {
    "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
    "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg",
}
NAMES = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
    "6": "six", "7": "seven", "8": "eight", "9": "nine",
    ":": "colon", "-": "hyphen", "/": "slash", ".": "period", " ": "space",
}


def rect(x, y, w, h):
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]


def skew(poly):
    return [(round(x + y * SLANT), round(y)) for x, y in poly]


def clockwise(poly):
    area = sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]))
    return poly if area < 0 else list(reversed(poly))  # TrueType outer contours run clockwise


def draw(polys):
    pen = TTGlyphPen(None)
    for poly in polys:
        pts = clockwise(skew(poly))
        pen.moveTo(pts[0])
        for p in pts[1:]:
            pen.lineTo(p)
        pen.closePath()
    return pen.glyph()


glyphs, advances = {".notdef": draw([rect(60, 0, 400, 700)])}, {".notdef": 520}
for ch, segs in DIGITS.items():
    glyphs[NAMES[ch]] = draw([SEG[s] for s in segs])
    advances[NAMES[ch]] = 537
dot = 88
glyphs["colon"] = draw([rect(53, 112, dot, 100), rect(53, 512, dot, 100)])
advances["colon"] = 237
glyphs["period"] = draw([rect(77, 0, dot, dot)])
advances["period"] = 250
glyphs["hyphen"] = draw([hseg(40, 360, YM)])
advances["hyphen"] = 400
glyphs["slash"] = draw([[(0, 0), (75, 0), (325, 675), (250, 675)]])
advances["slash"] = 400
glyphs["space"] = TTGlyphPen(None).glyph()
advances["space"] = 0  # the clocks never need one; markup whitespace stays invisible

order = [".notdef"] + [n for n in NAMES.values()]
fb = FontBuilder(UPM, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap({ord(c): n for c, n in NAMES.items()})
fb.setupGlyf({n: glyphs[n] for n in order})
fb.setupHorizontalMetrics({n: (advances[n], glyphs[n].xMin if hasattr(glyphs[n], "xMin") else 0) for n in order})
fb.setupHorizontalHeader(ascent=ASC, descent=DESC)
fb.setupNameTable({"familyName": "Darkroom Segments", "styleName": "Regular",
                   "copyright": "(c) 2026 Muhammad Faizan, Apache-2.0"})
fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, usWinAscent=ASC, usWinDescent=-DESC)
fb.setupPost()
out = Path(__file__).resolve().parent.parent / "src" / "fonts" / "darkroom-segments.woff"
out.parent.mkdir(parents=True, exist_ok=True)
fb.font.flavor = "woff"
fb.save(str(out))
print(out, out.stat().st_size, "bytes")
