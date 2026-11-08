# Basant

**Concept:** Lahore kite festival. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

Basant on a Lahore rooftop.

- **Bar:** sky-blue control bar.
- **Spool:** a wooden *charkhi* on the left of the timeline.
- **Seek bar:** the *manja* kite string is the time slider.
- **Playhead:** a paper kite (*patang*) that tilts with scrub speed (no tilt under reduced motion).
- **Volume:** a kite on a string; kite height = level.

## Status

P3 art (in progress, not yet committed). Created with `npx @videojs/cli@10.3.0 skin create basant --framework html --styling css --base scaffold --preset video`, now fully restyled:

- **Bar:** opaque sky-blue strip with a marigold paper edge; navy ink for every glyph and the time (≥ 8.8:1), kite-paper button discs (44 px).
- **Seek:** the manja (twisted pink/marigold string, outlined in ink) unwinds from a wooden charkhi drawn in CSS left of the slider. The wound thread thins with progress (`--media-slider-fill`). The unflown part is a dotted trail.
- **Playhead:** an inline-SVG patang inside a 44 px thumb; sways while playing, tilts −14° while dragged. Both only under `prefers-reduced-motion: no-preference`.
- **Volume:** a second kite climbing a slanted string, inline in the bar (no hover popover), so it is in the Tab order and draggable on touch. Muted = the kite dips and fades.
- **Icons:** own `basant` family (`src/video/icons.ts`): play, pause, restart, volume, captions, fullscreen, charkhi settings and buffering spinner. Scaffold icons remain for airplay, cast, pip, menu chevrons/check.
- **Menus, tooltips, indicators, error dialog:** kite paper / navy tags with marigold rings.
- Public props: `--media-accent-color` (marigold), `--media-border-radius` (container corners).

Files: `src/tokens.css` (palette), `src/video/basant.css` (art, `@layer basant`, after essentials), `src/video/icons.ts`, `src/video/skin.html` (bottom bar rebuilt; fullscreen moved from the top row to the bar).

## Develop

```sh
pnpm --filter @panj/basant dev        # the CLI's skin workbench
pnpm --filter @panj/basant build
pnpm --filter @panj/basant typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="basant"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
