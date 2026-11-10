# Jaali

**Concept:** Film lab. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A photo jaali / film lab.

- **Light:** safelight-red theme.
- **Scrubbing:** contact-sheet film strip (sprocket holes; thumbnails via a VTT sprite and `media-slider-thumbnail`).
- **Time:** red seven-segment readout.
- **Buttons:** hardware-style push buttons with LED state.

## Status

Pixel-matched to Faizi's locked reference (`jaali-ref.webp`, 1408 x 768): the player is the whole film-lab unit,
756 x 648 reference pixels, and `/jaali` places it on the reference itself. Gauntlet at 1408 x 768 (paused at
00:47 / 03:20, captions on, 1x): 0.15% of pixels differ outside the video, 0.42% over the full frame; what remains is
the live clock text and the relettered "CC" key.

- **Monitor**: the picture in the safelight bezel; a thin seek line, play/pause, time, settings and fullscreen sit on
  a scrim along its foot and fade with the controls.
- **Film strip** (`<dr-film>`, `role="slider"`): the film runs through a fixed gate as the video plays, so the red
  loupe always rings the current frame. Drag to scrub, click a frame to jump to it, arrows 5 s, Page keys 30 s.
- **Deck**: the play key lights the state it is in; the knob is the volume (drag up or down, or Tab + arrows; its
  pointer follows the level and greys when muted) and its cap mutes; the seven-segment clock reads MM:SS in an
  original font refit to the reference (`tools/make-segment-font.py`); the CC, 1x, 1.5x and fullscreen keys light
  their LEDs (and the active speed its red rim) from the player's state, whoever changed it.
- **Phones**: under a 35rem player the deck becomes two rows of the same parts with 44 px targets, under the film,
  so it never covers the picture.
- **Materials**: cut from the reference by `tools/build_assets.py` (card, film, loupe, LEDs, key faces, the play key
  lit, and the page plate, backdrop and poster). The clock digits (`rgb(204 58 52)`, 40 px, about 3.8:1 on the
  unlit glass, large text) and every state are live.

## Develop

```sh
pnpm --filter @panj/jaali dev        # the CLI's skin workbench
pnpm --filter @panj/jaali build
pnpm --filter @panj/jaali typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="jaali"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens` (with contrast notes).
- `src/video/jaali.css`: the unit, in reference pixels (unlayered; restates the 44 px targets and keeps the essentials' focus rings).
- `src/video/elements.ts`: `<dr-deck>` (volume, speed keys, fullscreen corner, MM:SS) and `<dr-film>` (the film seek).
- `tools/build_assets.py`: cuts the materials from the reference (needs numpy, Pillow, OpenCV; output is committed).
- `tools/make-segment-font.py`: regenerates the LED font (needs `fonttools`; output is committed).
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
