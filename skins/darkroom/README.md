# Darkroom

**Concept:** Film lab. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A photo darkroom / film lab.

- **Light:** safelight-red theme.
- **Scrubbing:** contact-sheet film strip (sprocket holes; thumbnails via a VTT sprite and `media-slider-thumbnail`).
- **Time:** red seven-segment readout.
- **Buttons:** hardware-style push buttons with LED state.

## Status

P3 art and states built (not yet committed). What is on the deck:

- **Film-strip seek bar**: sprocket rebate top and bottom, contact-sheet frames; played frames glow as if developed, buffered stock is a shade lighter. **One** playhead: an amber loupe bracket with a black keyline (the thumb, `role="slider"`).
- **Hover preview**: a print on paper. On `/darkroom` the gallery page adds the sample's Mux storyboard as a `thumbnails` metadata track, so `media-slider-thumbnail` shows real frames; without that track the preview is the LED time chip only.
- **Seven-segment time**: an original LED font (`src/fonts/darkroom-segments.woff`, 1.2 KB, built by `tools/make-segment-font.py`, inlined by Vite). Digits `#ff7a45` on `#170605` (7.6:1).
- **Hardware buttons** with status LEDs: playing, muted (amber), captions on, PiP, fullscreen, settings open. LEDs are a bonus cue; icons and aria carry the state.
- **Volume**: an inline console fader next to mute instead of the hover-only popover, so it is reachable by Tab and draggable on touch. Hidden where the platform owns volume (the slider reports `hidden`).
- **Layout**: PiP and fullscreen moved from the top bar to the right of the deck. Under a 34rem player: PiP button (hotkey `i` stays) and duration hide. Under 21rem: the captions button hides (Settings → Captions and `c` stay).
- **Layering**: art lives in `@layer utilities.darkroom`, which beats the Scaffold but loses to the shared essentials, so 44 px targets, focus rings and reduced motion always win.

Safelight red (`#ff3d1f`) is decoration only; essential text is warm white (16.3:1) or amber (11:1) on an opaque deck.

## Develop

```sh
pnpm --filter @panj/darkroom dev        # the CLI's skin workbench
pnpm --filter @panj/darkroom build
pnpm --filter @panj/darkroom typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="darkroom"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens` (with contrast notes).
- `src/video/darkroom.css`: the art layer.
- `tools/make-segment-font.py`: regenerates the LED font (needs `fonttools`; output is committed).
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
