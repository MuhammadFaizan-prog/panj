# Phatta

**Concept:** Pakistani truck art. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A player dressed like the back panel of a Pakistani Bedford truck.

- **Rail:** black lacquer control rail.
- **Border:** hand-painted (SVG) truck-art floral border framing the controls.
- **Seek bar:** *chamak-patti* reflective strip (conic-gradient shimmer, frozen under `prefers-reduced-motion`).
- **Playhead:** brass stud.
- **Fringe:** bell fringe under the rail that sways on hover (still under reduced motion).
- **Time:** sign-painter numerals.

## Status

P1 scaffold. Created with `npx @videojs/cli@10.3.0 skin create phatta --framework html --styling css --base scaffold --preset video`. Essential controls work with the Scaffold's neutral styling. **No art yet.**

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

Apache-2.0.
