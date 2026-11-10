"""Cut the /jaali page plate, the poster and the skin's sprites from Faizi's locked reference
(jaali-ref.webp, 1376x768).

The player is the carved sandstone unit: the frame with its floral corner filigree, the star-lattice jaali window the
video sits behind, the dark time strip, the row of 8-point star beads (the seek bar) and the carved deck with the
lapis-and-ivory pill (prev, rewind, play, fast-forward, next) and three ivory studs (volume, settings, fullscreen).
Card: (173, 65, 1030 x 703) in reference pixels. Everything is cut in reference pixels; src/video/jaali.css places it
in "card pixels" (reference pixel minus the card origin).

Skin sprites (skins/jaali/src/assets/):
  card.webp     the unit, RGBA. Inside the video rectangle only the jaali lattice and the corner filigree are opaque;
                the landscape behind the lattice is transparent (the live video shows through). Painted out: the time
                text (live), the playhead flare, the played groove and its glowing dot (all live layers).
  beads.webp    the seek beads, 27 columns of 40 x 42 cells: row 0 lit, row 1 recessed, row 2 the playhead bead.
                A bead in a state the reference does not show borrows the star from a bead that does, over its own
                patch of stone.
  flare.webp    the playhead's light streak above the head bead (added with plus-lighter)
  groove.webp   the played groove under the beads, the whole run (x 192-1181), synthesised past the reference's end
  thumb.webp    the glowing dot that rides the end of the groove (RGBA)
  pause.webp    the play disc with the lapis triangle repainted as two bars (shown while playing)
  muted.webp    the volume stud with its sound waves replaced by a cross (shown while muted)
  pill.webp     the lapis/ivory pill with the play disc, RGBA, for the phone deck
  open.webp     a mask for card.webp once playback has started: opaque everywhere except the lattice bars, which it
                cuts away so only the frame and its corner filigree stay over the picture (alpha = corners / card)
Page assets (apps/gallery/jaali/assets/):
  plate.webp    the reference itself (the live player covers its unit)
  backdrop.webp the alcove, blurred and small, for past the plate's aspect ratio and phones
  poster.webp   the landscape inside the video rectangle with the lattice lifted out

    JAALI_REF=/path/jaali-ref.webp python3 build_assets.py [skin_out] [page_out] [debug_out]
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
import cv2

REF = os.environ.get('JAALI_REF', '/workspace/contra-videojs/locked/jaali-ref.webp')
HERE = os.path.dirname(os.path.abspath(__file__))
SKIN_OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '../src/assets')
PAGE_OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '../../../apps/gallery/jaali/assets')
DBG = sys.argv[3] if len(sys.argv) > 3 else None

CARD = (173, 65, 1030, 703)                  # x, y, w, h
VIDEO = (200, 82, 981, 491)                  # live video rectangle
BEADS = [212, 247, 282, 318, 354, 389, 424, 460, 496, 531, 566, 602, 638, 674, 710, 747, 785,
         822, 860, 898, 936, 973, 1011, 1049, 1087, 1125, 1162]
BEAD_CY = 635
CELL = (40, 42)                              # bead cell, top at y 612
CELL_Y = 612
LIT, HEAD = 16, 16                           # reference: beads 0..15 lit, 16 is the playhead bead
GROOVE = (192, 1181, 653, 663)               # x0, x1, y0, y1 (the dark groove itself is y 656-659)
GROOVE_END = 741                             # the reference's groove stops under the dot
DOT = (747, 658.5)
LATTICE_AXES = (488, 258)                 # the rosette's mirror axes, in window pixels
TEXT_BOXES = [(200, 583, 300, 602), (1076, 583, 1176, 602)]
FLARE = (765, 584, 806, 612)                 # x0, y0, x1, y1: light streak over the strip
PLAY = (687.5, 711.5)
PILL = (482, 662, 894, 762)
VOL = (1037.5, 712)
# the window's inner edge, where the corner filigree stops (traced on the reference)
WINDOW = [
    (352, 82), (1000, 82), (1030, 97), (1060, 120), (1080, 150), (1095, 190), (1110, 225), (1125, 255), (1145, 285),
    (1165, 315), (1181, 340), (1181, 342), (1160, 365), (1145, 390), (1125, 425), (1107, 460), (1092, 495),
    (1075, 525), (1050, 550), (1020, 573), (352, 573), (330, 560), (310, 535), (292, 500), (277, 460), (262, 420),
    (245, 385), (225, 360), (200, 340), (200, 337), (220, 320), (245, 295), (265, 260), (280, 220), (287, 190),
    (297, 155), (310, 130), (330, 105),
]


def save(img, path, lossless=True, q=95):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(img).save(path, quality=q, method=6, lossless=lossless)


def dbg(img, name):
    if DBG:
        os.makedirs(DBG, exist_ok=True)
        Image.fromarray(img).save(os.path.join(DBG, name))


def window_mask(shape):
    im = Image.new('L', (shape[1] * 4, shape[0] * 4), 0)
    ImageDraw.Draw(im).polygon([(x * 4, y * 4) for x, y in WINDOW], fill=255)
    return np.array(im.resize((shape[1], shape[0]), Image.LANCZOS)).astype(np.float32) / 255


def detect_bars(win):
    """Thin carved bars: straight (line-segment support), and darker than the sunlit landscape or lighter and
    warmer than the shadowed tree."""
    g = cv2.cvtColor(win, cv2.COLOR_RGB2GRAY).astype(np.float32)
    segs = cv2.createLineSegmentDetector(cv2.LSD_REFINE_STD).detect(g.astype(np.uint8))[0].reshape(-1, 4)
    support = np.zeros(g.shape, np.uint8)
    for x0, y0, x1, y1 in segs:
        if np.hypot(x1 - x0, y1 - y0) > 16:
            cv2.line(support, (int(round(x0)), int(round(y0))), (int(round(x1)), int(round(y1))), 1, 7)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
    black = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, k)
    top = cv2.morphologyEx(g, cv2.MORPH_TOPHAT, k)
    warm = (win[..., 0].astype(np.float32) - win[..., 2]) > 12
    bars = ((black > 14) | ((top > 12) & warm & (g < 120))).astype(np.uint8) & support
    n, lab, st, _ = cv2.connectedComponentsWithStats(bars, 8)
    keep = np.zeros(n, bool)
    keep[1:] = st[1:, cv2.CC_STAT_AREA] >= 80
    return cv2.morphologyEx(keep[lab].astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))


def lattice(ref):
    """The jaali is a rosette with two mirror axes (window x 488, y 258). The sunlit upper-right quadrant is the
    clean one; it is confirmed against the mirrored upper-left (the tree's branches are not symmetric, the bars are)
    and the result is mirrored into all four quadrants, colours and all. Returns (scene, alpha, colour)."""
    x, y, w, h = VIDEO
    win = ref[y:y + h, x:x + w]
    bars = detect_bars(win)
    AX, AY = LATTICE_AXES
    q = bars[:AY, AX:].copy()                                   # upper right, master
    ql = bars[:AY, AX - q.shape[1] + 1:AX + 1][:, ::-1] if AX - q.shape[1] + 1 >= 0 else None
    if ql is None:
        ql = np.zeros_like(q)
        part = bars[:AY, :AX + 1][:, ::-1]
        ql[:, :part.shape[1]] = part
    q = q & cv2.dilate(ql, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(q, 8)
    keep = np.zeros(n, bool)
    keep[1:] = st[1:, cv2.CC_STAT_AREA] >= 40
    q = keep[lab].astype(np.uint8)
    qc = win[:AY, AX:].astype(np.float32)
    full = np.zeros((h, w), np.uint8)
    col = np.zeros((h, w, 3), np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    sy = np.where(yy < AY, yy, 2 * AY - 1 - yy)                 # mirror rows about the horizontal axis
    sx = np.abs(xx - AX)                                         # mirror columns about the vertical axis
    ok = (sy >= 0) & (sy < AY) & (sx < q.shape[1])
    full[ok] = q[sy[ok], sx[ok]]
    col[ok] = qc[sy[ok], sx[ok]]
    full = cv2.morphologyEx(full, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    hole = cv2.dilate(full | bars, np.ones((5, 5), np.uint8))
    scene = cv2.inpaint(win, hole, 7, cv2.INPAINT_TELEA)
    a = np.clip(cv2.GaussianBlur(full.astype(np.float32), (0, 0), 0.9) * 1.8, 0, 1)
    col = cv2.inpaint(np.clip(col, 0, 255).astype(np.uint8), (1 - cv2.dilate(full, np.ones((3, 3), np.uint8))), 3,
                      cv2.INPAINT_TELEA)
    return scene, a, col


def solve_over(P, S, a):
    """colour C so that (1 - a) S + a C = P"""
    a3 = np.maximum(a[..., None], 1e-3)
    C = (P.astype(np.float32) - (1 - a[..., None]) * S.astype(np.float32)) / a3
    return np.clip(np.round(C), 0, 255).astype(np.uint8)


def inpaint_box(img, box, mask):
    x0, y0, x1, y1 = box
    sub = img[y0:y1, x0:x1]
    img[y0:y1, x0:x1] = cv2.inpaint(sub, mask.astype(np.uint8), 4, cv2.INPAINT_TELEA)


def text_mask(img, box, thr=26):
    x0, y0, x1, y1 = box
    L = img[y0:y1, x0:x1].astype(np.float32).mean(2)
    bg = cv2.medianBlur(np.clip(L, 0, 255).astype(np.uint8), 15).astype(np.float32)
    m = (L > bg + thr).astype(np.uint8)
    return cv2.dilate(m, np.ones((5, 5), np.uint8))


def cell(img, i):
    cx = BEADS[i]
    return img[CELL_Y:CELL_Y + CELL[1], cx - 20:cx + 20].astype(np.float32)


def star_mask():
    yy, xx = np.mgrid[0:CELL[1], 0:CELL[0]]
    r = np.hypot(xx - 19.5, yy - (BEAD_CY - CELL_Y - 0.5))
    return np.clip((19.0 - r) / 3.0, 0, 1)[..., None]


def open_mask(alpha_win, corners, shape):
    """card alpha x mask = the corner rim's alpha, so the lattice bars vanish and the frame stays exactly as painted"""
    x, y, w, h = VIDEO
    keep = np.where(alpha_win > 0, corners / np.maximum(alpha_win, 1e-6), 1.0)
    m = np.full((*shape, 4), 0, np.uint8)
    m[..., 3] = 255
    m[y:y + h, x:x + w, 3] = np.round(np.clip(keep, 0, 1) * 255).astype(np.uint8)
    return m


def main():
    ref = np.array(Image.open(REF).convert('RGB'))
    assert ref.shape[:2] == (768, 1376), ref.shape
    clean = ref.copy()

    # ── live text, flare, groove and dot leave the card ──
    for box in TEXT_BOXES:
        inpaint_box(clean, box, text_mask(ref, box))
    fx0, fy0, fx1, fy1 = FLARE
    fl = ref[fy0:fy1, fx0:fx1].astype(np.float32).mean(2)
    fmask = (fl > np.median(fl) + 14).astype(np.uint8)
    fmask = cv2.dilate(fmask, np.ones((5, 5), np.uint8))
    inpaint_box(clean, FLARE, fmask)
    gx0, gx1, gy0, gy1 = GROOVE
    gb = (gx0 - 2, gy0 - 2, 764, gy1 + 4)
    gm = np.zeros((gb[3] - gb[1], gb[2] - gb[0]), np.uint8)
    gm[656 - 1 - gb[1]:659 + 2 - gb[1], :] = 1                      # the groove rows
    yy, xx = np.mgrid[gb[1]:gb[3], gb[0]:gb[2]]
    gm[np.hypot(xx - DOT[0], yy - DOT[1]) < 9] = 1                  # the dot and its glow
    gm[:, GROOVE_END + 3 - gb[0]:] &= (np.hypot(xx - DOT[0], yy - DOT[1]) < 9)[:, GROOVE_END + 3 - gb[0]:].astype(np.uint8)
    inpaint_box(clean, gb, gm)

    # ── the window: lattice and corners stay, the landscape goes ──
    scene, a, lcol = lattice(ref)
    x, y, w, h = VIDEO
    wm = window_mask(ref.shape[:2])[y:y + h, x:x + w]
    corners = np.clip(cv2.dilate((1 - wm), np.ones((5, 5), np.uint8)), 0, 1)   # the filigree rim keeps its shadow
    alpha_win = np.maximum(a, corners)
    rgb_win = np.where((corners > 0.5)[..., None], ref[y:y + h, x:x + w], lcol).astype(np.uint8)

    cx0, cy0, cw, ch = CARD
    card = np.dstack([clean, np.full(ref.shape[:2], 255, np.uint8)])
    card[y:y + h, x:x + w, :3] = rgb_win
    card[y:y + h, x:x + w, 3] = np.round(alpha_win * 255).astype(np.uint8)
    card[y:y + h, x:x + w, :3][alpha_win == 0] = 0
    save(card[cy0:cy0 + ch, cx0:cx0 + cw], os.path.join(SKIN_OUT, 'card.webp'))
    save(open_mask(alpha_win, corners, card.shape[:2])[cy0:cy0 + ch, cx0:cx0 + cw], os.path.join(SKIN_OUT, 'open.webp'))

    # ── beads ──
    sm = star_mask()
    rows = []
    for state in ('lit', 'off', 'head'):
        row = []
        for i in range(len(BEADS)):
            own = cell(ref, i)
            if state == 'lit':
                src = i if i < LIT else 9 + (i % 7)
            elif state == 'off':
                src = i if i > HEAD else 17 + (i % 10)
            else:
                src = HEAD
            if src == i:
                c = own
            else:
                c = cell(ref, src) * sm + own * (1 - sm)
            row.append(c)
        rows.append(np.concatenate(row, axis=1))
    beads = np.clip(np.concatenate(rows, axis=0), 0, 255).astype(np.uint8)
    save(beads, os.path.join(SKIN_OUT, 'beads.webp'))

    # ── flare: what the streak adds over the cleaned strip ──
    add = np.clip(ref[fy0:fy1, fx0:fx1].astype(np.int16) - clean[fy0:fy1, fx0:fx1].astype(np.int16), 0, 255)
    save(add.astype(np.uint8), os.path.join(SKIN_OUT, 'flare.webp'))

    # ── groove: the reference's run, then the same profile carried over the clean stone ──
    G = ref[gy0:gy1, gx0:gx1].astype(np.float32)
    C = clean[gy0:gy1, gx0:gx1].astype(np.float32)
    seg = slice(560 - gx0, 735 - gx0)
    ratio = (G[:, seg] / np.maximum(C[:, seg], 1)).mean(1, keepdims=True)
    synth = C * ratio[..., None] if ratio.ndim == 2 else C * ratio
    run = G.copy()
    run[:, GROOVE_END - gx0:] = synth[:, GROOVE_END - gx0:]
    save(np.clip(run, 0, 255).astype(np.uint8), os.path.join(SKIN_OUT, 'groove.webp'))

    # ── thumb: the dot, solved as the most transparent layer over the clean stone ──
    tx0, ty0 = int(DOT[0]) - 12, int(DOT[1]) - 8
    P = ref[ty0:ty0 + 16, tx0:tx0 + 24].astype(np.float32)
    B = clean[ty0:ty0 + 16, tx0:tx0 + 24].astype(np.float32)
    # the groove passes under the left half: compare against the groove run there
    B2 = B.copy()
    rr0 = ty0 - gy0
    for yy_ in range(16):
        gy_ = rr0 + yy_
        if 0 <= gy_ < run.shape[0]:
            B2[yy_, :] = np.where((np.arange(24) + tx0 < DOT[0])[:, None], run[gy_, tx0 - gx0:tx0 - gx0 + 24], B[yy_])
    up = np.where(P > B2, (P - B2) / np.maximum(255 - B2, 1), 0)
    ta = np.clip(up.max(2), 0, 1)
    ta = np.ceil(ta * 255) / 255
    tc = solve_over(P, B2, ta)
    thumb = np.dstack([tc, np.round(ta * 255).astype(np.uint8)])
    save(thumb, os.path.join(SKIN_OUT, 'thumb.webp'))

    # ── pause face: the lapis triangle becomes two bars ──
    px0, py0 = int(PLAY[0] - 38), int(PLAY[1] - 38)
    face = ref[py0:py0 + 76, px0:px0 + 76].copy()
    f = face.astype(np.float32)
    blue = (f[..., 2] - f[..., 0] > 40)
    yy, xx = np.mgrid[0:76, 0:76]
    inner = np.hypot(xx - 37.5, yy - 37.5) < 27
    tri = blue & inner
    tri_d = cv2.dilate(tri.astype(np.uint8), np.ones((5, 5), np.uint8)) & inner.astype(np.uint8)
    lapis = f[tri].copy()
    face = cv2.inpaint(face, tri_d, 6, cv2.INPAINT_TELEA)
    S = 8
    bars = Image.new('L', (76 * S, 76 * S), 0)
    d = ImageDraw.Draw(bars)
    for bx in (37.5 - 9.5, 37.5 + 3.5):
        d.rounded_rectangle([bx * S, 24.5 * S, (bx + 6) * S, 51.5 * S], radius=1.5 * S, fill=255)
    bm = np.array(bars.resize((76, 76), Image.LANCZOS)).astype(np.float32) / 255
    edge = np.clip(cv2.dilate(bm, np.ones((3, 3), np.uint8)) - bm, 0, 1)
    rng = np.random.default_rng(7)
    tex = lapis[rng.integers(0, len(lapis), size=(76, 76))]
    tex = cv2.GaussianBlur(tex, (0, 0), 0.6)
    outline = np.array([14, 26, 70], np.float32)
    ff = face.astype(np.float32)
    ff = ff * (1 - edge[..., None] * 0.8) + outline * edge[..., None] * 0.8
    ff = ff * (1 - bm[..., None]) + tex * bm[..., None]
    save(np.clip(ff, 0, 255).astype(np.uint8), os.path.join(SKIN_OUT, 'pause.webp'))

    # ── muted face: the sound waves give way to a cross ──
    vx0, vy0 = int(VOL[0] - 24), int(VOL[1] - 24)
    vf = ref[vy0:vy0 + 48, vx0:vx0 + 48].copy()
    v = vf.astype(np.float32)
    vblue = (v[..., 2] - v[..., 0] > 30) | (v.mean(2) < 90)
    yy, xx = np.mgrid[0:48, 0:48]
    face_r = np.hypot(xx - 23.5, yy - 23.5) < 16
    waves = vblue & face_r & (xx >= 25)
    speaker = vblue & face_r & (xx < 25)
    vf = cv2.inpaint(vf, cv2.dilate(waves.astype(np.uint8), np.ones((3, 3), np.uint8)), 4, cv2.INPAINT_TELEA)
    ink = v[speaker].mean(0) if speaker.any() else np.array([30, 50, 150], np.float32)
    cross = Image.new('L', (48 * S, 48 * S), 0)
    d = ImageDraw.Draw(cross)
    for (a0, b0, a1, b1) in ((28, 19, 37, 28), (28, 28, 37, 19)):
        d.line([a0 * S, b0 * S, a1 * S, b1 * S], fill=255, width=int(2.4 * S))
    cm = np.array(cross.resize((48, 48), Image.LANCZOS)).astype(np.float32)[..., None] / 255
    vf = np.clip(vf.astype(np.float32) * (1 - cm) + ink * cm, 0, 255).astype(np.uint8)
    save(vf, os.path.join(SKIN_OUT, 'muted.webp'))

    # ── pill for the phone deck: the lapis/ivory body and the play disc, soft-edged ──
    qx0, qy0, qx1, qy1 = PILL
    pill = ref[qy0:qy1, qx0:qx1].copy()
    pm = Image.new('L', ((qx1 - qx0) * S, (qy1 - qy0) * S), 0)
    d = ImageDraw.Draw(pm)
    d.rounded_rectangle([3 * S, 19 * S, (qx1 - qx0 - 3) * S, 81 * S], radius=31 * S, fill=255)
    d.ellipse([(PLAY[0] - qx0 - 47) * S, (PLAY[1] - qy0 - 47) * S, (PLAY[0] - qx0 + 47) * S, (PLAY[1] - qy0 + 47) * S], fill=255)
    pma = np.array(pm.resize((qx1 - qx0, qy1 - qy0), Image.LANCZOS))
    save(np.dstack([pill, pma]), os.path.join(SKIN_OUT, 'pill.webp'))

    # ── page ──
    save(ref, os.path.join(PAGE_OUT, 'plate.webp'), lossless=False, q=97)
    small = cv2.resize(ref, (172, 96), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 3)
    save(small, os.path.join(PAGE_OUT, 'backdrop.webp'), lossless=False, q=85)
    save(scene, os.path.join(PAGE_OUT, 'poster.webp'), lossless=False, q=95)

    if DBG:
        dbg((a * 255).astype(np.uint8), 'lattice-alpha.png')
        dbg(np.clip(scene * (1 - a[..., None]) + lcol * a[..., None], 0, 255).astype(np.uint8), 'window-comp.png')
        dbg(scene, 'scene.png')
        dbg(clean[560:680, 170:1210], 'clean-strip.png')
        comp = card[cy0:cy0 + ch, cx0:cx0 + cw].astype(np.float32)
        bg = np.zeros_like(comp[..., :3]); bg[:] = (40, 160, 60)
        al = comp[..., 3:4] / 255
        dbg(np.clip(comp[..., :3] * al + bg * (1 - al), 0, 255).astype(np.uint8), 'card-over-green.png')
    print('ok', json.dumps({'card': card.shape, 'lattice_px': int((a > 0.5).sum()), 'beads': beads.shape}))


if __name__ == '__main__':
    main()
