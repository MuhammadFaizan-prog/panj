# Phatta

**Concept:** Pakistani truck art. One of the five skins in [panj](../../README.md) for the Contra Video.js v10 Skins Design Challenge.

## Brief

A player dressed like the back panel of a Pakistani Bedford truck.

- **Seek bar:** *chamak-patti* crystal-bead strip: marigold/gold beads for the played part, silver for the rest, a still conic glint that sweeps only on hover/scrub (never under `prefers-reduced-motion`).
- **Playhead:** polished brass ball, with a cream painted time tag on hover.
- **Rail:** black lacquer control strip with a slim red-green-gold vine border (hand-drawn SVG tile) and a chrome rim.
- **Buttons:** round, brass-ringed, cream icons (the skin's own `phatta` icon family). One play/pause toggle; one volume control; CC, speed (`1×`, the live rate) and fullscreen on the right.
- **Time:** cream sign-painter numerals.
- **Page:** the `/phatta` gallery page is the back of the truck: carved crown lettered "DEKH MAGAR PYAR SE", peacock + rose side panels, chrome bumper, brass bells (sway on hover only, still under reduced motion, never a hit area) and two painted-eye mudflaps. Night (default) and day, with a toggle that starts from `prefers-color-scheme`.

## Status

P3 art + states. Built from the Scaffold (`npx @videojs/cli@10.3.0 skin create phatta --framework html --styling css --base scaffold --preset video`).

- `src/video/phatta.css`: all Phatta paint, in `@layer phatta` (after the Scaffold's `components` and the shared `utilities`). Paint sits inside `@media not (forced-colors: active)`, so forced-colours mode keeps the Scaffold's system-colour styling.
- `src/video/icons.ts`: the `phatta` icon family (original SVG).
- `src/video/elements.ts`: `<phatta-rate>` mirrors the playback rate onto the speed button; `<phatta-volume>` lays the v10 volume popover out inline (horizontal slider) on `(hover: none)` screens, so volume is usable by touch and by Tab there. Fine pointers keep the hover/focus popover (Tab from mute moves into its slider).
- Removed from the Scaffold markup: centre play and ±10 s buttons, title, AirPlay, Cast and PiP buttons (hotkeys, error dialog, status announcer and indicators stay).
- Design reference: `contra-videojs/locked/phatta-{night,day,workshop}.webp` (Faizi's locked mockups). No raster copies of them ship; all art is hand-written SVG/CSS.

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
