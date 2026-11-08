"""Cut the /glass page plate and the paused-state poster from Faizi's locked reference (glass-ref.webp, 1376x768).

backdrop.webp: the reference blurred, for phones and for the hero's edges past the plate's aspect ratio.
plate.webp  : the reference with the video rectangle blacked out (the live player sits exactly on it).
poster.webp : the reference footage inside the video rectangle, with the painted control pill removed:
              inside the pill the frosted tint is undone (the live CSS pill puts it back with real backdrop blur)
              and the painted glyphs / rim are filled from their surroundings.

    GLASS_REF=/path/glass-ref.webp GLASS_OUT=/tmp/glass-out python3 build_assets.py

All plate measurements live in G; the pill's glass recipe (tint, brightness) lives in GLASS and must match
--glass-ref-* in src/video/glass.css.
"""
import json, os
import numpy as np
from PIL import Image
import cv2

REF = os.environ.get('GLASS_REF', '/workspace/contra-videojs/locked/glass-ref.webp')
OUT = os.environ.get('GLASS_OUT', '/tmp/glass-out')

G = {
    'W': 1376, 'H': 768,
    'video': (119, 58, 1137, 652), 'video_r': 26,
    'pill': (196, 557, 983, 117),
}
# CSS pill = backdrop-filter: blur() brightness(br) ; background rgb(T / a)
GLASS = {'br': 0.9, 'a': 0.30, 'T': (160, 195, 200)}

# painted controls to erase (plate px): circles (cx, cy, r) and boxes (x0, y0, x1, y1)
ERASE_CIRCLES = [(259.5, 615.5, 52)]
ERASE_BOXES = [
    (322, 594, 380, 640),    # speaker
    (398, 594, 952, 622),    # seek track, fill glow, thumb
    (610, 625, 768, 656),    # time
    (962, 597, 1017, 635),   # CC
    (1032, 595, 1087, 637),  # 1x
    (1104, 591, 1154, 640),  # fullscreen
]


def rrect(W, H, rect, r, shrink=0.0):
    x, y, w, h = rect
    x += shrink; y += shrink; w -= 2 * shrink; h -= 2 * shrink; r = max(r - shrink, 0.0)
    yy, xx = np.mgrid[0:H, 0:W] + 0.5
    cx = np.clip(xx, x + r, x + w - r); cy = np.clip(yy, y + r, y + h - r)
    d = np.hypot(xx - cx, yy - cy)
    inside = (xx >= x) & (xx <= x + w) & (yy >= y) & (yy <= y + h)
    return (np.clip(r - d + 0.5, 0, 1) * inside).astype(np.float32)


def fill_holes(img, known):
    """Smooth fill: multi-scale normalized convolution, keeping known pixels."""
    out = img.copy()
    k = known.astype(np.float32)
    est = np.zeros_like(img)
    have = np.zeros(k.shape, np.float32)
    for sigma in (120, 60, 30, 15, 8, 4, 2):
        num = cv2.GaussianBlur(img * k[..., None], (0, 0), sigma)
        den = cv2.GaussianBlur(k, (0, 0), sigma)[..., None]
        e = num / np.maximum(den, 1e-6)
        good = (den[..., 0] > (0.0 if sigma == 120 else 0.2))
        est[good] = e[good]
        have = np.maximum(have, good)
    out[~known] = est[~known]
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    ref = np.array(Image.open(REF).convert('RGB')).astype(np.float32)
    H, W = ref.shape[:2]
    assert (W, H) == (G['W'], G['H'])
    vx, vy, vw, vh = G['video']

    # ── plate: video rectangle blacked out ──
    vm = rrect(W, H, G['video'], G['video_r'])
    plate = ref * (1 - vm[..., None])
    Image.fromarray(np.clip(plate + 0.5, 0, 255).astype(np.uint8)).save(f'{OUT}/plate.webp', quality=92, method=6)

    # ── backdrop: the reference, heavily blurred (phones, and past the plate's aspect ratio) ──
    bd = cv2.GaussianBlur(ref, (0, 0), 24)
    Image.fromarray(np.clip(bd + 0.5, 0, 255).astype(np.uint8)).resize((688, 384), Image.LANCZOS).save(
        f'{OUT}/backdrop.webp', quality=80, method=6)

    # ── poster: undo the pill's tint, erase painted controls ──
    pm = rrect(W, H, G['pill'], G['pill'][3] / 2)
    inner = rrect(W, H, G['pill'], G['pill'][3] / 2, 4) > 0.999      # pill minus its rim band
    T = np.array(GLASS['T'], np.float32); a = GLASS['a']; br = GLASS['br']
    untinted = (ref - a * T) / ((1 - a) * br)
    erase = np.zeros((H, W), bool)
    yy, xx = np.mgrid[0:H, 0:W] + 0.5
    for cx, cy, r in ERASE_CIRCLES:
        erase |= np.hypot(xx - cx, yy - cy) <= r
    for x0, y0, x1, y1 in ERASE_BOXES:
        erase[y0:y1, x0:x1] = True
    known = inner & ~erase
    filled = fill_holes(np.where(known[..., None], untinted, 0), known)
    # boxes: interpolate between the clean rows just above and below (smoothed along x), which keeps the vertical
    # gradient of the glass instead of averaging it away
    for x0, y0, x1, y1 in ERASE_BOXES:
        top = cv2.GaussianBlur(filled[y0 - 1:y0, x0 - 8:x1 + 8], (0, 0), sigmaX=3, sigmaY=0.1)[0, 8:-8]
        bot = cv2.GaussianBlur(filled[y1:y1 + 1, x0 - 8:x1 + 8], (0, 0), sigmaX=3, sigmaY=0.1)[0, 8:-8]
        t = ((np.arange(y0, y1) - (y0 - 1)) / (y1 - (y0 - 1)))[:, None, None]
        filled[y0:y1, x0:x1] = top[None] * (1 - t) + bot[None] * t
    # blend by coverage so the pill's anti-aliased outer edge leaves no seam
    poster = ref * (1 - pm[..., None]) + filled * pm[..., None]
    crop = poster[vy:vy + vh, vx:vx + vw]
    Image.fromarray(np.clip(crop + 0.5, 0, 255).astype(np.uint8)).save(f'{OUT}/poster.webp', quality=94, method=6)
    clipped = float(((untinted[known] < 0) | (untinted[known] > 255)).mean())
    json.dump({'G': G, 'GLASS': GLASS, 'clipped_fraction': clipped}, open(f'{OUT}/meta.json', 'w'), indent=1)
    print('ok', OUT, 'clipped', round(clipped, 4))


if __name__ == '__main__':
    main()
