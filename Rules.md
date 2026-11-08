# Rules: panj

## Process

- Docs first; code follows the approved plan (ImplementationPlan.md).
- One phase at a time. Each phase: update Tracker.md, commit, push, report Done / Changed / Verification / Risks / Next with the hash.
- If something loops more than twice, stop and report.

## Never without Faizi's explicit OK

- Make the repo public (only at submission).
- Create a Vercel project or deploy anything.
- Create a Mux account or upload media.
- Touch faizi-dev.vercel.app or any other repo.
- Install or run REA.
- Use any paid service.

## Code

- Skins are HTML custom elements from `@videojs/html@10.3.0`. Do not hand-roll player behaviour a v10 element already provides.
- Pin Video.js packages to the same exact version across the workspace.
- Every skin rule is scoped to `.media-skin[data-skin="<slug>"]`. Never restyle another skin.
- Keep `data-theme="scaffold"` on the root unless the skin replaces every Scaffold token.
- Art is inline SVG + CSS. No raster images inside controls.
- All motion goes through `--panj-motion-*`; reduced motion must stop shimmer, sway, tilt and transitions.
- Hit areas ≥ `--panj-target-min` (44 px), even when the visible glyph is smaller.
- Focus: visible ring + halo on every focusable element; never `outline: none` without a replacement.
- Source order = visual order.
- Keep the error dialog, hotkeys and status announcer in every skin.
- Don't edit the CLI workbench (`skins/*/apps/preview`) except `src/frame/player.ts`.
- The CLI's deploy scripts stay removed.

## Definition of done (per change)

`pnpm install` clean · `pnpm build` passes for every package · `pnpm typecheck` passes · gallery serves all 6 routes · Playwright suite green (from P2) · no console errors.

## Commits

Conventional style (`feat:`, `fix:`, `docs:`, `chore:`, `test:`), committed as `MuhammadFaizan-prog <130775084+MuhammadFaizan-prog@users.noreply.github.com>`.
