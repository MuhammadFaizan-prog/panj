# Darkroom

**Concept:** Film lab. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A photo darkroom / film lab.

- **Light:** safelight-red theme.
- **Scrubbing:** contact-sheet film strip (sprocket holes; thumbnails via a VTT sprite and `media-slider-thumbnail`).
- **Time:** red seven-segment readout.
- **Buttons:** hardware-style push buttons with LED state.

## Status

P1 scaffold. Created with `npx @videojs/cli@10.3.0 skin create darkroom --framework html --styling css --base scaffold --preset video`. Essential controls work with the Scaffold's neutral styling. **No art yet.**

## Develop

```sh
pnpm --filter @panj/darkroom dev        # the CLI's skin workbench
pnpm --filter @panj/darkroom build
pnpm --filter @panj/darkroom typecheck
```

- `src/video/skin.html`: the skin markup (Video.js HTML custom elements). Root carries `data-theme="scaffold" data-skin="darkroom"`.
- `src/video/skin.ts`: registers the elements and icons the markup uses, imports the CSS.
- `src/tokens.css`: this skin's tokens, on top of `@panj/tokens`.
- `src/index.ts`: package entry, `createSkinnedPlayer(mediaHtml, poster)`, used by `apps/gallery`.
- `apps/preview/`: the CLI workbench. Leave it as generated except `src/frame/player.ts`.

The CLI's deploy scripts were removed; only the gallery is deployed, and only with approval (../../Rules.md).

## Licence

Apache-2.0.
