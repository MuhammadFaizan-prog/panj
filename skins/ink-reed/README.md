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

P1 scaffold. Created with `npx @videojs/cli@10.3.0 skin create ink-reed --framework html --styling css --base scaffold --preset video`. Essential controls work with the Scaffold's neutral styling. **No art yet.**

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
