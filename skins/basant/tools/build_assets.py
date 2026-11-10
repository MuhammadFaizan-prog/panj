"""Cut the /basant page plate, the poster and the skin's kite / charkhi sprites from Faizi's locked reference
(basant-ref.webp, 1376x768).

Skin sprites (skins/basant/src/assets/):
  charkhi.webp     the wooden spool at the left end of the seek string (static decoration)
  kite-seek.webp   the orange kite + tails: the seek thumb (the string's bridle point is its anchor)
  kite-volume.webp the blue kite + tails + spine: the volume thumb (anchor: the foot of its spine)
Page assets (apps/gallery/basant/assets/):
  plate.webp     the reference with the seek kite's tails (which hang below the card) filled from their surroundings;
                 the card itself is painted by the live player on top of it
  backdrop.webp  the reference, heavily blurred, for phones and past the plate's aspect ratio
  poster.webp    the photo inside the video rectangle with the centre play ring and the volume kite removed;
                 inside the ring the white haze is undone (the live ring puts it back)

    BASANT_REF=/path/basant-ref.webp python3 build_assets.py [skin_out] [page_out] [debug_out]

Every measurement is in reference pixels and must match B in src/video/basant-ref.css.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
import cv2

REF = os.environ.get('BASANT_REF', '/workspace/contra-videojs/locked/basant-ref.webp')
HERE = os.path.dirname(os.path.abspath(__file__))
SKIN_OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '../src/assets')
PAGE_OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '../../../apps/gallery/basant/assets')
DBG = sys.argv[3] if len(sys.argv) > 3 else None

B = {
    'W': 1376, 'H': 768,
    'card': (181, 103, 1014, 582),       # white rounded card = the player
    'video': (188, 110, 1000, 462),      # live video rectangle
    'bar_top': 579,                      # blue control bar: 579 .. card bottom (685)
    'bar_rgb': (140, 212, 249),
    'ring': (688.0, 384.0, 71.0),        # centre play ring: cx, cy, outer radius
    'string': ((574, 630.5), (775, 615.4)),   # seek string: spool tip -> kite bridle
    'charkhi_box': (398, 592, 582, 674),
    'seek_kite_box': (694, 580, 812, 722),     # sprite crop
    'volume_kite_box': (904, 548, 976, 668),   # sprite crop
    'caption_box': (30, 696, 222, 742),        # leftover "Dribbble Present" caption, painted out of the plate
}
VOL_DIAMOND = [(925.0, 566.8), (953.7, 554.7), (970.8, 583.8), (938.7, 603.0)]
VOL_TRACK = (940, 619, 947, 648)    # white fill (live), excluded from the volume sprite
SPEAKER = (928, 649, 960, 674)      # live mute glyph, excluded


def save(img, path, q=94, lossless=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(img).save(path, quality=q, method=6, lossless=lossless)


def fill_holes(img, known):
    out = img.copy()
    k = known.astype(np.float32)
    est = np.zeros_like(img)
    for sigma in (60, 30, 15, 8, 4, 2, 1):
        num = cv2.GaussianBlur(img * k[..., None], (0, 0), sigma)
        den = cv2.GaussianBlur(k, (0, 0), sigma)[..., None]
        e = num / np.maximum(den, 1e-6)
        good = den[..., 0] > (0.0 if sigma == 60 else 0.25)
        est[good] = e[good]
    out[~known] = est[~known]
    return out


def poly_mask(H, W, pts, grow=0.0):
    im = Image.new('L', (W * 4, H * 4), 0)
    ImageDraw.Draw(im).polygon([(x * 4, y * 4) for x, y in pts], fill=255)
    m = np.array(im.resize((W, H), Image.BOX)) > 40
    if grow:
        m = cv2.dilate(m.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(2 * grow + 1),) * 2)) > 0
    return m


def main():
    ref8 = np.array(Image.open(REF).convert('RGB'))
    ref = ref8.astype(np.float32)
    H, W = ref.shape[:2]
    assert (W, H) == (B['W'], B['H'])
    yy, xx = np.mgrid[0:H, 0:W]
    bar = np.array(B['bar_rgb'], np.float32)
    dbar = np.abs(ref - bar).max(axis=2)
    cx0, cy0, cw, ch = B['card']
    card_bottom = cy0 + ch
    in_bar = (yy >= B['bar_top']) & (yy < card_bottom) & (xx >= cx0) & (xx < cx0 + cw)
    (sx0, sy0), (sx1, sy1) = B['string']
    slope = (sy1 - sy0) / (sx1 - sx0)
    near_string = np.abs(yy - (sy0 + slope * (xx - sx0))) <= 3.2

    # ── seek kite: everything off the bar blue in its box (minus the string left of the kite), plus the tails
    #    below the card (warm colours on the dark backdrop) ──
    x0, y0, x1, y1 = B['seek_kite_box']
    box = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
    k_bar = box & in_bar & (yy < card_bottom - 2) & (dbar > 18) & ~(near_string & (xx < 748))
    warm = (ref[..., 0] > 120) & (ref[..., 0] - ref[..., 2] > 45)
    k_out = box & (yy >= card_bottom - 2) & warm
    k_out = cv2.dilate(k_out.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    seek = (k_bar | k_out) & box
    seek = cv2.morphologyEx(seek.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)) > 0
    seek_sprite = cv2.dilate(seek.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0

    # ── volume kite: diamond polygon over the video / white strip, off-blue pixels in the bar ──
    x0, y0, x1, y1 = B['volume_kite_box']
    vbox = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
    tx0, ty0, tx1, ty1 = VOL_TRACK
    px0, py0, px1, py1 = SPEAKER
    v_bar = vbox & in_bar & (yy >= B['bar_top'] + 3) & (dbar > 18)
    v_bar &= ~((xx >= tx0) & (xx < tx1) & (yy >= ty0) & (yy < ty1) & (ref.min(axis=2) > 200))
    v_bar &= ~((xx >= px0) & (xx < px1) & (yy >= py0) & (yy < py1))
    v_bar &= ~(xx >= 971)   # the divider
    v_poly = poly_mask(H, W, VOL_DIAMOND, grow=1.5) & (yy < B['bar_top'] + 6)
    vol = (v_bar | v_poly) & vbox
    vol = cv2.morphologyEx(vol.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)) > 0
    vol_sprite = cv2.dilate(vol.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0

    def sprite(mask, bx, feather=0.0):
        x0, y0, x1, y1 = bx
        a = mask[y0:y1, x0:x1].astype(np.float32)
        if feather:
            a = np.clip(cv2.GaussianBlur(a, (0, 0), feather) * 1.6, 0, 1) * (cv2.dilate(mask[y0:y1, x0:x1].astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)
            a = np.maximum(a, mask[y0:y1, x0:x1])
        rgba = np.dstack([ref8[y0:y1, x0:x1], (a * 255 + 0.5).astype(np.uint8)])
        return rgba

    # ── charkhi: static, the box with a soft-edged object mask ──
    x0, y0, x1, y1 = B['charkhi_box']
    cbox = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
    ch_m = cbox & (dbar > 10) & (xx < 575)
    ch_m = cv2.dilate(ch_m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    save(sprite(ch_m, B['charkhi_box'], feather=1.2), f'{SKIN_OUT}/charkhi.webp', lossless=True)
    save(sprite(seek_sprite, B['seek_kite_box']), f'{SKIN_OUT}/kite-seek.webp', lossless=True)
    save(sprite(vol_sprite, B['volume_kite_box']), f'{SKIN_OUT}/kite-volume.webp', lossless=True)

    # ── plate: fill the seek kite's tails that hang below the card ──
    hole = seek_sprite & (yy >= card_bottom - 1)
    hole = cv2.dilate(hole.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    # fill from the backdrop only (never from the card above it)
    below = yy >= card_bottom + 1
    src = np.where(below[..., None], ref, 0).astype(np.float32)
    plate = ref.copy()
    filled = fill_holes(src, below & ~hole)
    plate[hole] = filled[hole]
    # the mockup's leftover "Dribbble Present" caption under the card (bottom left): the backdrop there is heavily
    # blurred, so the letters are inpainted and the patch is smoothed to the blur of its surroundings
    lx0, ly0, lx1, ly1 = B['caption_box']
    win = np.clip(plate[ly0:ly1, lx0:lx1] + 0.5, 0, 255).astype(np.uint8)
    lum = win.astype(np.float32).mean(2)
    letters = (lum - cv2.GaussianBlur(lum, (0, 0), 6) > 12).astype(np.uint8)
    letters = cv2.dilate(letters, np.ones((7, 7), np.uint8))
    patch = cv2.inpaint(win, letters, 6, cv2.INPAINT_TELEA).astype(np.float32)
    patch = cv2.GaussianBlur(patch, (0, 0), 5)
    w = cv2.GaussianBlur(letters.astype(np.float32), (0, 0), 3)
    w = np.clip(w * 2.5, 0, 1)[..., None]
    plate[ly0:ly1, lx0:lx1] = plate[ly0:ly1, lx0:lx1] * (1 - w) + patch * w
    save(np.clip(plate + 0.5, 0, 255).astype(np.uint8), f'{PAGE_OUT}/plate.webp', q=92)
    bd = cv2.GaussianBlur(ref, (0, 0), 24)
    Image.fromarray(np.clip(bd + 0.5, 0, 255).astype(np.uint8)).resize((688, 384), Image.LANCZOS).save(
        f'{PAGE_OUT}/backdrop.webp', quality=80, method=6)

    # ── poster: the video rectangle without the ring, the triangle and the volume kite ──
    rcx, rcy, rr = B['ring']
    r = np.hypot(xx + 0.5 - rcx, yy + 0.5 - rcy)
    # inside the ring the reference lays a translucent warm-grey disc over the photo; undo it exactly
    # (the live ring paints the same disc back: --basant-ring-veil in basant-ref.css)
    VEIL_A, VEIL_C = 0.4, np.array([189, 180, 174], np.float32)
    inner = r < rr - 9.5
    untinted = ref.copy()
    untinted[inner] = (ref[inner] - VEIL_A * VEIL_C) / (1 - VEIL_A)
    tri = (ref.min(axis=2) > 222) & (r < rr - 14)
    tri = cv2.dilate(tri.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    ring_band = (r >= rr - 13) & (r <= rr + 3)
    erase = ring_band | tri | (vol_sprite & (yy < B['bar_top'] + 2))
    erase = cv2.dilate(erase.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    vx, vy, vw, vh = B['video']
    u8 = np.clip(untinted + 0.5, 0, 255).astype(np.uint8)
    filled = cv2.inpaint(u8, erase.astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA).astype(np.float32)
    crop = filled[vy:vy + vh, vx:vx + vw]
    save(np.clip(crop + 0.5, 0, 255).astype(np.uint8), f'{PAGE_OUT}/poster.webp', q=94)

    if DBG:
        os.makedirs(DBG, exist_ok=True)
        dbg = ref8.copy()
        dbg[seek] = (dbg[seek] * 0.4 + np.array([255, 0, 255]) * 0.6).astype(np.uint8)
        dbg[vol] = (dbg[vol] * 0.4 + np.array([0, 255, 0]) * 0.6).astype(np.uint8)
        dbg[ch_m] = (dbg[ch_m] * 0.6 + np.array([255, 0, 0]) * 0.4).astype(np.uint8)
        Image.fromarray(dbg[540:730, 380:1000]).resize((1240, 380), Image.NEAREST).save(f'{DBG}/masks.png')
    json.dump(B, open(os.path.join(DBG or '/tmp', 'basant-meta.json'), 'w'), indent=1)
    print('ok')


if __name__ == '__main__':
    main()
