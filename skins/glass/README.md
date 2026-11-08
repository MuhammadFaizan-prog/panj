# Glass

**Concept:** Liquid glass. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A floating frosted control pill.

- **Surface:** frosted translucent pill (`backdrop-filter`) with a soft specular edge.
- **Readability:** gradient scrim behind the pill so controls stay legible over white or busy video.
- **Fallback:** Compat-style solid surface where blur is unsupported or transparency is reduced.

## Status

P3 art and states done. Started from the Scaffold (`npx @videojs/cli@10.3.0 skin create glass --framework html --styling css --base scaffold --preset video`).

- **Pill:** one floating row at wide sizes (play · volume · scrubber · time · captions · settings · fullscreen); on players under 34rem the buttons sit on top and the scrubber runs along the bottom. Fullscreen moved from the top bar into the pill.
- **Glass:** `backdrop-filter: blur saturate brightness` on a light smoke tint, a 1px gradient specular rim (`::after` mask ring) and an inner light pool (`::before`). Same treatment on the centre play, top lenses, menus, volume capsule, tooltips, indicators and the error dialog.
- **Readability:** bottom-weighted gradient scrim + the blur's `brightness()`; white glyphs measure about 8:1 against the pill over a near-white frame.
- **Fallbacks:** no `backdrop-filter` → solid tint; `prefers-reduced-transparency` → near-opaque with a visible edge; `prefers-contrast: more` → black glass, white edge; `forced-colors` → system colours.
- **Motion:** spring on hover/press, fade-and-settle on show/hide, all via `--panj-motion-*`; hover/press scale only under `prefers-reduced-motion: no-preference`.
- **Icons:** hand-drawn set on a 24px grid (`src/video/icons.ts`, family `glass`).
- **Volume access** (`src/video/behaviour.ts`): Tab reaches the slider on every device; on touch the first tap on the speaker opens the slider and the next tap mutes; Esc from the slider returns focus to the speaker.

## Develop

```sh
pnpm --filter @panj/glass dev        # the CLI's skin workbench
pnpm --filter @panj/glass build
pnpm --filter @panj/glass typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="glass"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`; the fallbacks swap `--glass-tint` / `--glass-blur`.
- `src/video/glass.css`: the art and states, in a `glass` cascade layer after the Scaffold and the essentials.
- `src/video/icons.ts`, `src/video/behaviour.ts`: icon set and the volume-popover access fix.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
