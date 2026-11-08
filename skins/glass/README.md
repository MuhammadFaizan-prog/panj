# Glass

**Concept:** Liquid glass. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A floating frosted control pill.

- **Surface:** frosted translucent pill (`backdrop-filter`) with a soft specular edge.
- **Readability:** gradient scrim behind the pill so controls stay legible over white or busy video.
- **Fallback:** Compat-style solid surface where blur is unsupported or transparency is reduced.

## Status

P1 scaffold. Created with `npx @videojs/cli@10.3.0 skin create glass --framework html --styling css --base scaffold --preset video`. Essential controls work with the Scaffold's neutral styling. **No art yet.**

## Develop

```sh
pnpm --filter @panj/glass dev        # the CLI's skin workbench
pnpm --filter @panj/glass build
pnpm --filter @panj/glass typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="glass"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
