# Phatta

**Concept:** Pakistani truck art. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A player dressed like the back panel of a Pakistani Bedford truck, cloned pixel for pixel from Faizi's reference art.

- **Seek bar:** *chamak-patti* crystal-bead strip: gold beads for the played part, silver for the rest (two sprite layers, the gold one clipped to progress), a polished brass ball playhead and a cream time tag that rides above it with the live time.
- **Rail:** black lacquer strip with a red-green floral border and a chrome rim.
- **Buttons:** round brass-ringed buttons with cream painted icons: play/pause, volume (with an inline brass rail), CC, speed (`1×`, the live rate) and fullscreen. Gold glow ring on hover, open and captions-on; pressed state; cream ring + black halo on keyboard focus.
- **Time:** sign-painter serif numerals, padded like the paint (`02:14 / 07:48`).
- **Page:** the `/phatta` gallery page is the back of the truck (night by default, day on the toggle, choice remembered), with swaying bells, twinkling LEDs and headlights that brighten while the video plays.

## How it is built: raster plate + live controls

The art is raster on purpose. Faizi's reference images (`contra-videojs/locked/phatta-{night,day,workshop}.webp`) are our own AI-generated art and ship with the repo under Apache-2.0. Instead of redrawing them, the build cuts them up:

- **Plates** (`apps/gallery/phatta/assets/{night,day}/plate@{1,2}x.webp`): each reference with its painted footage blacked out and the painted control content (time text, icons, volume rail, tag and ball) erased, so live controls never double up. 2x is a Lanczos upscale with a light unsharp mask.
- **Sprites** (`src/assets/{night,day}/`): every control piece cropped from the plate at the exact rectangle it is shown at: the full-width gold and silver bead strips (extended along the 5 px bead period), ball, tag, painted icons (play and pause are the two halves of the painted ▶II glyph), volume rail and knob, ring and strip pieces for the flow layout. Small sprites are inlined by Vite.
- **Fonts** (`src/assets/fonts/`): Source Serif 4 Bold for the numerals and Inter Medium for the tag, subset to digits (2 KB each, SIL OFL).
- **Geometry** (`src/video/phatta-geometry.css`, generated): plate-pixel positions of every control, relative to the video rectangle.

Two layouts share one stylesheet (`src/video/phatta.css`):

- **plate**: inside an element with `data-phatta-plate`, each control sits on its painted spot. The page puts the media container on the plate's video rectangle and sets `--phatta-k` (CSS px per plate px, a registered `<length>`), so everything scales as one unit. The strip is always shown.
- **flow** (default, phones, fullscreen, any other embed): the bead strip with its brass end caps over a 9-sliced lacquer panel, buttons as ring sprites. With `data-phatta-below` on an ancestor the strip hangs under the video instead of over it.

Pixel check: at the reference viewport (1376×768 night, 1312×816 day), with the player paused at the reference progress and volume, 0.27% (night) and 0.31% (day) of the pixels outside the video differ by more than 26/255 on any channel; what remains is the live serif text, the play glyph (▶ instead of the painted ▶II while paused) and the day/night toggle, which the plate does not paint.

Removed from the Scaffold markup: centre play and ±10 s buttons, title, AirPlay, Cast and PiP buttons, and the volume popover (the rail is inline). Hotkeys, error dialog, status announcer and indicators stay.

- `src/video/elements.ts`: `<phatta-rate>` mirrors the playback rate on the speed button; `<phatta-clock>` pads the minutes of the `<media-time>` text it wraps.
- `src/video/icons.ts`: the `phatta` SVG icon family, used for the states the plate does not paint (muted, fullscreen exit, replay) and in menus.

## Develop

```sh
pnpm --filter @panj/phatta dev        # the CLI's skin workbench
pnpm --filter @panj/phatta build
pnpm --filter @panj/phatta typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="phatta"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0. The reference art the plates and sprites are cut from is our own AI-generated work, released with the repo under the same licence. Source Serif 4 and Inter are SIL Open Font License 1.1.
