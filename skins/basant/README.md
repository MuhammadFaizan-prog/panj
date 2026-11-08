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

P1 scaffold. Created with `npx @videojs/cli@10.3.0 skin create basant --framework html --styling css --base scaffold --preset video`. Essential controls work with the Scaffold's neutral styling. **No art yet.**

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
