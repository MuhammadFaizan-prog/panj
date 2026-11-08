"""Cut the /darkroom page plate, the poster and the skin's sprites from Faizi's locked reference
(darkroom-ref.webp, 1408x768).

The player is the whole film-lab unit: the red-lit monitor bezel, the strip of 35 mm film under it and the matte deck
(card 326, 55, 756 x 648 in reference pixels). Everything is cut in reference pixels and placed by
src/video/darkroom.css in "card pixels" (reference pixel minus the card origin).

Skin sprites (skins/darkroom/src/assets/):
  card.webp        the unit itself: bezel, deck, knob scale, button bezels. Live parts are painted out: the LED digits
                   (live text), the knob's pointer (a CSS line that turns with the volume), the "GC" mockup label is
                   relettered "CC". The video and film rectangles are covered by live layers.
  film.webp        the film band (y 430-581) with the red loupe ring painted out
  film-tile.webp   five frames of that band, gap to gap (x 345-1062): repeats seamlessly as the film runs
  loupe.webp       the red grease-pencil ring, its cross and shadow over the current frame (alpha), fixed in the gate
                   (x 580-840; solved as the most transparent layer that restores the reference over film.webp)
  leds.webp        status LEDs, 4 positions x [on, off], 32 x 16 each
  rate-faces.webp  the 1x and 1.5x push-button faces, [1x on, 1x off, 1.5x on, 1.5x off], 52 x 52 each
  play-live.webp   the play/pause button face while playing (the play triangle lit, the pause bars dark)
Page assets (apps/gallery/darkroom/assets/):
  plate.webp       the reference itself (the live player covers its unit)
  backdrop.webp    the dark wall, blurred and small, for past the plate's aspect ratio and phones
  poster.webp      the photo inside the video rectangle, the in-video controls painted out

    DR_REF=/path/darkroom-ref.webp python3 build_assets.py [skin_out] [page_out]
"""
import os, sys
import numpy as np
from PIL import Image
import cv2

REF = os.environ.get('DR_REF', '/workspace/contra-videojs/locked/darkroom-ref.webp')
HERE = os.path.dirname(os.path.abspath(__file__))
SKIN_OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '../src/assets')
PAGE_OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '../../../apps/gallery/darkroom/assets')

CARD = (326, 55, 756, 648)           # x, y, w, h: the player
VIDEO = (349, 73, 710, 345)          # live video rectangle
FILM_Y = (430, 582)                  # the moving film band (rows y0..y1-1)
TILE_X = (345, 1062)                 # five frames, gap centre to gap centre
RING = np.array([215, 50, 40], np.float32)   # grease-pencil red
LEDS = [(882, 613), (933, 613), (984, 613), (1036, 613)]   # CC, 1x, 1.5x, fullscreen
LED_BOX = (32, 16)
BTN = [(881.5, 645.5), (932.5, 645.5), (983.5, 645.5), (1035.5, 645.5)]
FACE = 52
KNOB = (509.5, 644.5)
DISPLAY = (582, 616, 828, 674)       # digit window, inner
PLAY = (352, 612, 438, 681)


def save(img, path, lossless=True, q=95):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(img).save(path, quality=q, method=6, lossless=lossless)


def ring_split(ref):
    """Split the film band into (film without the ring, ring alpha). Frames are grey and the base is a dark warm
    brown, so the red ring separates on R-G: p = (1-a) b + a RING."""
    y0, y1 = FILM_Y
    band = ref[y0:y1].astype(np.float32)
    d = band[..., 0] - band[..., 1]
    near = (d > 40).astype(np.uint8)
    near[:, :590] = 0
    near[:, 830:] = 0
    near = cv2.dilate(near, np.ones((5, 5), np.uint8)) > 0
    d0 = 7.0
    a = np.clip((d - d0) / (RING[0] - RING[1] - d0), 0, 1)
    a[~near] = 0
    a[a < 0.04] = 0
    # The ring is drawn with a soft dark shadow, so a plain unmix leaves a ghost in the film. Instead the film is
    # inpainted across a band around the ring, and the loupe sprite is solved per pixel as the most transparent
    # colour that puts the reference back over that film: (1 - alpha) film + alpha colour = reference.
    band_m = cv2.dilate((a > 0.02).astype(np.uint8), np.ones((11, 11), np.uint8))
    film = cv2.inpaint(band.astype(np.uint8), band_m, 5, cv2.INPAINT_TELEA)
    F = film.astype(np.float32)
    P = band
    up = np.where(P > F, (P - F) / np.maximum(255 - F, 1), (F - P) / np.maximum(F, 1))
    alpha = np.clip(up.max(2), 0, 1)
    alpha[band_m == 0] = 0
    alpha = np.ceil(alpha * 255) / 255
    col = (P - (1 - alpha[..., None]) * F) / np.maximum(alpha[..., None], 1e-3)
    rgba = np.zeros(band.shape[:2] + (4,), np.uint8)
    rgba[..., :3] = np.clip(np.round(col), 0, 255).astype(np.uint8)
    rgba[..., 3] = np.round(alpha * 255).astype(np.uint8)
    rgba[alpha == 0, :3] = 0
    return film, rgba


def paint_digits(card):
    x0, y0, x1, y1 = DISPLAY
    cx0, cy0 = x0 - CARD[0], y0 - CARD[1]
    win = card[cy0:cy0 + (y1 - y0), cx0:cx0 + (x1 - x0)]
    d = win[..., 0].astype(int) - win[..., 1].astype(int)
    m = (d > 70).astype(np.uint8)
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    out = cv2.inpaint(win, m, 4, cv2.INPAINT_TELEA)
    # the LED glow around the digits goes too: replace the window with a smooth fit of the unlit glass
    # (row/column separable, from pixels far from any digit)
    far = cv2.dilate(m, np.ones((9, 9), np.uint8)) == 0
    smooth = cv2.GaussianBlur(out, (0, 0), 6)
    out = np.where(far[..., None], out, smooth)
    card[cy0:cy0 + (y1 - y0), cx0:cx0 + (x1 - x0)] = out


def paint_pointer(card):
    """Remove the red pointer line from the knob cap (the cap is neutral metal)."""
    kx, ky = KNOB[0] - CARD[0], KNOB[1] - CARD[1]
    r = 26
    x0, y0 = int(kx - r), int(ky - r)
    cap = card[y0:y0 + 2 * r, x0:x0 + 2 * r]
    d = cap[..., 0].astype(int) - np.maximum(cap[..., 1], cap[..., 2]).astype(int)
    m = (d > 22).astype(np.uint8)
    yy, xx = np.mgrid[0:2 * r, 0:2 * r]
    rr = np.hypot(xx - r + 0.5, yy - r + 0.5)
    ang = np.degrees(np.arctan2(xx - r + 0.5, -(yy - r + 0.5)))
    # only the pointer: a narrow wedge towards -146 degrees (the warm rim highlight up top stays)
    m[(rr > r - 1) | (rr < 5) | (np.abs(ang + 146) > 14)] = 0
    m = cv2.dilate(m, np.ones((3, 3), np.uint8))
    card[y0:y0 + 2 * r, x0:x0 + 2 * r] = cv2.inpaint(cap, m, 3, cv2.INPAINT_TELEA)


def reletter_cc(card):
    """The mockup reads "GC"; reletter it "CC" by copying the second letter over the first."""
    cx, cy = BTN[0][0] - CARD[0], BTN[0][1] - CARD[1]
    # letters span roughly cx-10..cx+10, cy-5..cy+6; the C is ~9px wide
    lx0, lx1 = int(cx - 10), int(cx - 1)
    rx0 = int(cx + 1)
    ys = slice(int(cy - 7), int(cy + 8))
    left = card[ys, lx0:lx1].astype(np.float32)
    right = card[ys, rx0:rx0 + (lx1 - lx0)].astype(np.float32)
    # keep the left side's face shading: transplant only the ink (darkness relative to each side's face)
    def face(p):
        return cv2.GaussianBlur(p, (0, 0), 3)
    Lr = right.mean(2)
    ink = np.clip((np.percentile(Lr, 90) - Lr) / max(np.percentile(Lr, 90) - Lr.min(), 1), 0, 1)
    base = cv2.inpaint(left.astype(np.uint8), (left.mean(2) < np.percentile(left.mean(2), 60)).astype(np.uint8), 3,
                       cv2.INPAINT_TELEA).astype(np.float32)
    inkc = right[ink > 0.8].mean(0) if (ink > 0.8).any() else np.array([30, 28, 26], np.float32)
    new = base * (1 - ink[..., None]) + inkc * ink[..., None]
    card[ys, lx0:lx1] = np.clip(new, 0, 255).astype(np.uint8)


def crop_c(img, cx, cy, w, h):
    x0, y0 = int(np.floor(cx - w / 2)), int(np.floor(cy - h / 2))
    return img[y0:y0 + h, x0:x0 + w].copy()


def rate_faces(ref):
    """[1x on, 1x off, 1.5x on, 1.5x off]: the lit (red) rim is swapped between the two faces."""
    f1 = crop_c(ref, *BTN[1], FACE, FACE).astype(np.float32)
    f15 = crop_c(ref, *BTN[2], FACE, FACE).astype(np.float32)
    yy, xx = np.mgrid[0:FACE, 0:FACE]
    rr = np.hypot(xx - FACE / 2 + 0.5, yy - FACE / 2 + 0.5)
    # rim annulus with soft edges (face ~r15, bezel ~r23; the lit glow spills to ~r25)
    w = np.clip((rr - 13.5) / 2, 0, 1) * np.clip((26.5 - rr) / 2, 0, 1)
    w = w[..., None]
    f1_off = f1 * (1 - w) + f15 * w
    f15_on = f15 * (1 - w) + f1 * w
    faces = [f1, f1_off, f15_on, f15]
    return np.concatenate([np.clip(f, 0, 255).astype(np.uint8) for f in faces], axis=1)


def leds(ref):
    w, h = LED_BOX
    on_src = {0: 0, 1: 1, 2: 1, 3: 0}      # lit LED pixels: own where the reference is lit, else a lit neighbour
    off_src = {0: 2, 1: 2, 2: 2, 3: 3}
    rows = []
    for i, (cx, cy) in enumerate(LEDS):
        on = crop_c(ref, *LEDS[on_src[i]], w, h)
        off = crop_c(ref, *LEDS[off_src[i]], w, h)
        rows.append(np.concatenate([on, off], axis=1))
    return np.concatenate(rows, axis=0)


def play_live(ref):
    x0, y0, x1, y1 = PLAY
    face = ref[y0:y1, x0:x1].astype(np.float32)
    R, G, B = face[..., 0], face[..., 1], face[..., 2]
    L = face.mean(2)
    # the pause bars: the bright red glyph in the right half of the face
    bars = ((R - G) > 110) & (R > 185)
    bars[:, : int((x1 - x0) * 0.55)] = False
    bars[:16] = False
    bars[-16:] = False
    # the play triangle: the dark glyph on the brushed face, left half
    tri = L < 50
    tri[:, : int((x1 - x0) * 0.2)] = False
    tri[:, int((x1 - x0) * 0.52):] = False
    tri[: int((y1 - y0) * 0.3)] = False
    tri[int((y1 - y0) * 0.72):] = False
    out = face.copy()
    dark = face[tri].mean(0) if tri.any() else np.array([30, 30, 30], np.float32)
    lit = face[bars].mean(0) if bars.any() else RING
    soft_b = cv2.GaussianBlur(bars.astype(np.float32), (0, 0), 0.7)[..., None]
    soft_t = cv2.GaussianBlur(tri.astype(np.float32), (0, 0), 0.7)[..., None]
    out = out * (1 - soft_b) + dark * soft_b
    glow = cv2.GaussianBlur(tri.astype(np.float32), (0, 0), 3)[..., None]
    out = out * (1 - soft_t) + lit * soft_t
    out = out + glow * np.array([60, 6, 4], np.float32) * 0.6
    return np.clip(out, 0, 255).astype(np.uint8)


def poster(ref):
    x, y, w, h = VIDEO
    v = ref[y:y + h, x:x + w].copy()
    L = v.mean(2)
    m = np.zeros(L.shape, np.uint8)
    # the in-video bar: track and thumb (y 370-382), the play icon, time, gear and fullscreen (y 386-410)
    for (a0, b0, a1, b1, t) in [(10, 296, 700, 310, 60), (30, 310, 175, 338, 60), (612, 310, 680, 338, 70)]:
        sub = L[b0:b1, a0:a1]
        m[b0:b1, a0:a1] = (sub > t).astype(np.uint8)
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    return cv2.inpaint(v, m, 5, cv2.INPAINT_TELEA)


def main():
    ref = np.array(Image.open(REF).convert('RGB'))
    assert ref.shape[:2] == (768, 1408), ref.shape
    x, y, w, h = CARD
    card = ref[y:y + h, x:x + w].copy()
    paint_digits(card)
    paint_pointer(card)
    reletter_cc(card)
    save(card, os.path.join(SKIN_OUT, 'card.webp'))

    film, ring = ring_split(ref)
    save(film[:, x:x + w], os.path.join(SKIN_OUT, 'film.webp'))
    save(film[:, TILE_X[0]:TILE_X[1]], os.path.join(SKIN_OUT, 'film-tile.webp'))
    rx0, rx1 = 580, 840
    save(ring[:, rx0:rx1], os.path.join(SKIN_OUT, 'loupe.webp'))
    save(leds(ref), os.path.join(SKIN_OUT, 'leds.webp'))
    save(rate_faces(ref), os.path.join(SKIN_OUT, 'rate-faces.webp'))
    save(play_live(ref), os.path.join(SKIN_OUT, 'play-live.webp'))

    save(ref, os.path.join(PAGE_OUT, 'plate.webp'), lossless=False, q=97)
    small = cv2.resize(ref, (176, 96), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 3)
    save(small, os.path.join(PAGE_OUT, 'backdrop.webp'), lossless=False, q=85)
    save(poster(ref), os.path.join(PAGE_OUT, 'poster.webp'), lossless=False, q=95)
    print('ok', {'card': card.shape, 'film': film.shape, 'ring_px': int((ring[..., 3] > 0).sum())})


if __name__ == '__main__':
    main()
