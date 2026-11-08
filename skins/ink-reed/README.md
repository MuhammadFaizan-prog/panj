# Ink & Reed

**Concept:** Urdu calligraphy podcast player. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A podcast-style player on a page of Urdu calligraphy.

- **Surface:** cream paper.
- **Seek bar:** reed-pen (*qalam*) ink stroke; an SVG path that thickens as it progresses.
- **Playhead:** ink drop.
- **Controls:** ±15 s skip back / forward.
- **Type:** serif time; RTL-ready.
- **Trim:** thin gold edge.

## Status

P3 art and states done (unverified in a browser at time of writing; see the build report).

- **Layout:** a podcast leaf. The picture sits in a cream paper card; the bar sits on the paper *below* the picture, so control contrast never depends on the frame. The bar does not auto-hide (it covers nothing). Fullscreen keeps the same leaf.
- **Timeline:** one hand-drawn reed-stroke shape (`--ink-stroke`) masks the fill, buffer and a faint ghost. Fill and buffer span the whole track and are clipped to progress, so the stroke is a hairline at the start and full reed width at the end. Unplayed part is a ruled guideline at 4.5:1.
- **Playhead:** the slider thumb is the nib (`--ink-nib`) with an ink drop (`--ink-drop`) under the tip. The drop gathers slowly while playing (the only ambient motion; off under reduced motion).
- **Controls:** play, −15 s, +15 s, mute + volume, | captions, settings (eight-point star), PiP/AirPlay/Cast when available, fullscreen, then serif time at the far end. Icons are the hand-drawn `ink` family in `src/video/icons.ts`; menu glyphs stay Scaffold.
- **Volume:** desktop = paper slip popover with a vertical stroke (opens on hover and on keyboard focus; Esc closes it and returns focus to the speaker). Touch (`hover: none`) = the slider sits inline beside the speaker, horizontal.
- **RTL:** under `dir="rtl"` the bar mirrors and the timeline is written right to left; `src/behavior.ts` mirrors pointer x and ArrowLeft/ArrowRight on the sliders so input matches the picture. Opt out with `data-ink-timeline="ltr"` on the container.
- **Focus:** ink ring + gold halo on everything focusable. **Targets:** every control 44 px.

Files: `src/tokens.css` (palette + SVG art as data URIs), `src/video/ink-reed.css` (all skin rules, unlayered, scoped to `[data-skin="ink-reed"]`), `src/video/icons.ts`, `src/behavior.ts`, `src/video/skin.html` (restructured: no top or centre groups; everything in the bottom bar in visual order).

## Develop

```sh
pnpm --filter @panj/ink-reed dev        # the CLI's skin workbench
pnpm --filter @panj/ink-reed build
pnpm --filter @panj/ink-reed typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="ink-reed"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
