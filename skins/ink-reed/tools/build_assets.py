"""Cut the /ink-reed page plate, the poster and the skin's sprites from Faizi's locked reference
(ink-reed-ref.webp, 1408x768).

Skin sprites (skins/ink-reed/src/assets/), every one in reference pixels, placed by src/video/ink-reed-ref.css:
  play-disc.webp    the raised paper disc with its blue halo, the triangle painted out (opaque, round, feathered)
  play.webp         the outlined play triangle (black ink with alpha)
  skip-back.webp    the -15 loop with its numerals          skip-forward.webp  the +15 loop
  speaker.webp      the speaker body                        waves.webp         its two sound waves
  bubble.webp       the captions speech bubble, letters painted out (the live "CC" label is text)
  fullscreen.webp   the four corner arrows
  pen-body.webp     the reed pen's tapered body: the played stroke, stretched with progress
  pen-nib.webp      the nib, its slit and the ink drop: the playhead (tip at NIB_TIP)
  frame-*.webp      the thin gold rule inside the card's edge: top, left and right strips (stretched along)
  gold-band.webp    the gold-leaf band along the foot of the card (stretched to the card width)
Page assets (apps/gallery/ink-reed/assets/):
  plate.webp     the reference itself (the live player covers its card)
  backdrop.webp  the paper, blurred and small, for phones and past the plate's aspect ratio
  poster.webp    the photo inside the video rectangle

    INK_REF=/path/ink-reed-ref.webp python3 build_assets.py [skin_out] [page_out]
"""
import os, shutil, sys
import numpy as np
from PIL import Image
import cv2

REF = os.environ.get('INK_REF', '/workspace/contra-videojs/locked/ink-reed-ref.webp')
HERE = os.path.dirname(os.path.abspath(__file__))
SKIN_OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '../src/assets')
PAGE_OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '../../../apps/gallery/ink-reed/assets')

CARD = (282, 65, 844, 638)          # x, y, w, h of the card = the player
VIDEO = (316, 97, 776, 432)         # live video rectangle
PAPER = np.array([249, 244, 232], np.float32)
# sprite boxes (x0, y0, x1, y1), reference pixels
BOX = {
    'play-disc': (314, 595, 394, 675),
    'play': (338, 612, 372, 656),
    'skip-back': (406, 610, 452, 656),
    'skip-forward': (480, 610, 526, 656),
    'speaker': (558, 614, 584, 654),
    'waves': (584, 614, 602, 654),
    'bubble': (634, 612, 678, 656),
    'fullscreen': (800, 612, 842, 654),
    'pen-body': (328, 555, 539, 584),
    'pen-nib': (539, 553, 603, 603),
    'gold-band': (294, 679, 1114, 692),
}
FRAME = {
    'frame-top': (291, 72, 1117, 80),
    'frame-left': (291, 80, 298, 679),
    'frame-right': (1110, 80, 1117, 679),
}
CC_LETTERS = (645, 622, 668, 640)   # the mockup's "CP", painted out of the bubble


def save(img, path, lossless=True, q=95):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(img).save(path, quality=q, method=6, lossless=lossless)


def ink_sprite(ref, box, erase=None, core=None):
    """Black ink with alpha: a = 1 - L / L(paper), so it composes back onto the paper exactly."""
    x0, y0, x1, y1 = box
    r = ref[y0:y1, x0:x1].astype(np.float32)
    L = r @ np.array([0.299, 0.587, 0.114], np.float32)
    Lp = float(PAPER @ np.array([0.299, 0.587, 0.114], np.float32))
    a = np.clip(1 - L / Lp, 0, 1)
    a[a < 0.035] = 0
    if erase is not None:
        ex0, ey0, ex1, ey1 = erase
        a[ey0 - y0:ey1 - y0, ex0 - x0:ex1 - x0] = 0
    if core is not None:
        # keep only ink connected to strong strokes (drops the disc halo / the track under the nib)
        strong = (a > core).astype(np.uint8)
        keep = cv2.dilate(strong, np.ones((5, 5), np.uint8)) > 0
        a[~keep] = 0
    rgba = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    rgba[..., 3] = (a * 255 + 0.5).astype(np.uint8)
    return rgba


def main():
    ref = np.array(Image.open(REF).convert('RGB'))
    H, W = ref.shape[:2]
    assert (W, H) == (1408, 768), (W, H)

    save(ink_sprite(ref, BOX['play']), f'{SKIN_OUT}/play.webp')
    save(ink_sprite(ref, BOX['pen-nib'], core=0.45), f'{SKIN_OUT}/pen-nib.webp')
    for name in ('skip-back', 'skip-forward', 'speaker', 'waves', 'fullscreen', 'pen-body'):
        save(ink_sprite(ref, BOX[name]), f'{SKIN_OUT}/{name}.webp')
    save(ink_sprite(ref, BOX['bubble'], erase=CC_LETTERS), f'{SKIN_OUT}/bubble.webp')

    # the disc: opaque, the triangle painted out, alpha fading where the halo meets the paper
    x0, y0, x1, y1 = BOX['play-disc']
    disc = ref[y0:y1, x0:x1].copy()
    tx0, ty0, tx1, ty1 = BOX['play']
    tri = np.zeros(disc.shape[:2], np.uint8)
    sub = ref[ty0:ty1, tx0:tx1].astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
    tri[ty0 - y0:ty1 - y0, tx0 - x0:tx1 - x0] = (sub < 228).astype(np.uint8) * 255
    tri = cv2.dilate(tri, np.ones((3, 3), np.uint8))
    disc = cv2.inpaint(disc, tri, 3, cv2.INPAINT_TELEA)
    yy, xx = np.mgrid[0:y1 - y0, 0:x1 - x0]
    rr = np.hypot(xx + 0.5 - (354 - x0), yy + 0.5 - (635 - y0))
    alpha = np.clip((40 - rr) / 4, 0, 1)
    save(np.dstack([disc, (alpha * 255 + 0.5).astype(np.uint8)]), f'{SKIN_OUT}/play-disc.webp')

    # the gold rule: its weight wanders along each side, so the three strips are cut, not drawn
    for name, (x0, y0, x1, y1) in FRAME.items():
        save(ref[y0:y1, x0:x1].copy(), f'{SKIN_OUT}/{name}.webp')

    x0, y0, x1, y1 = BOX['gold-band']
    save(ref[y0:y1, x0:x1].copy(), f'{SKIN_OUT}/gold-band.webp', lossless=False, q=92)

    # page
    os.makedirs(PAGE_OUT, exist_ok=True)
    shutil.copyfile(REF, f'{PAGE_OUT}/plate.webp')
    bd = cv2.GaussianBlur(ref.astype(np.float32), (0, 0), 20)
    Image.fromarray(np.clip(bd + 0.5, 0, 255).astype(np.uint8)).resize((704, 384), Image.LANCZOS).save(
        f'{PAGE_OUT}/backdrop.webp', quality=80, method=6)
    vx, vy, vw, vh = VIDEO
    save(ref[vy:vy + vh, vx:vx + vw].copy(), f'{PAGE_OUT}/poster.webp', lossless=False, q=94)
    print('ok')


if __name__ == '__main__':
    main()
