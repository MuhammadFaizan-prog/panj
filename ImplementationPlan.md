# Implementation plan: panj

Source: Faizi's detailed plan (PANJ-PLAN, approved 2026-11-08 "ok go"). Every phase updates Tracker.md, is committed and pushed, and is reported as Done / Changed / Verification / Risks / Next with the commit hash.

## Hard gates (from PRD.md)

Essential controls · responsive 320–1440 · keyboard + Esc closes menus · visible focus · readable over bright and dark video · 44 px targets · `prefers-reduced-motion` · public URL, no login · Apache-2.0 · visual + design-thinking blurb.

## Architecture

- pnpm workspace: `skins/{phatta,glass,basant,ink-reed,darkroom}`, `apps/gallery` (Vite multi-page: `/`, `/phatta`, `/glass`, `/basant`, `/ink-reed`, `/darkroom`), `packages/tokens`, later `packages/a11y-tests`.
- Each skin starts from the v10 Scaffold skin source (`@videojs/html/video`: `<video-player>` → custom skin wrapping `<video>` / `<mux-video>`). Components: media-play-button, media-time-slider, media-time, media-mute-button, media-volume-slider/popover, media-fullscreen-button, media-captions-button, playback-rate menu, media-menu/popover, media-buffering-indicator, media-error-dialog, media-hotkey, media-status-announcer.
- Art as inline SVG + CSS only.

## Phase 0: REA mapping (observe before building)

Lawful use only: open-source code and public pages. **REA is not installed until Faizi says so.** Until then, map by reading the v10 source/docs and the public Plyr demo.

Targets: the v10 Default skin demo and the Plyr demo (plyr.io). Output `docs/research/rea-map.md`:

- control tree
- state attributes each skin styles (paused, seeking, waiting, ended, fullscreen, muted, captions)
- keyboard map (Space/K, ←/→ ±5 s, ↑/↓ volume, M, F, C, Esc)
- focus order
- menu behaviour
- hover and idle-hide timing

Exit: a checklist so every state is designed in all five skins.

## Phases

| Phase | Work | Exit check |
|---|---|---|
| **P1 Scaffold** | 5 skin packages from `skin create --framework html --base scaffold --preset video`; gallery routes; sample video; docs; licence | All 6 routes 200; every package builds and typechecks |
| **P2 Essentials** | Full v10 behaviour in each skin with neutral styling: play/pause, seek, time, volume/mute, fullscreen, captions, rate menu, hotkeys; 44 px targets; focus ring with halo; Playwright suite | Keyboard map + REA checklist pass in all 5 skins (Playwright) |
| **P3 Art** | Each skin's identity (briefs below), Phatta first, matching its mockup | Mockup parity |
| **P4 States** | Loading, buffering, ended, error, captions, menus, idle-hide, designed per skin | Every state designed |
| **P5 Gauntlet** | Critic loop (below) | Wins vs the bar |
| **P6 A11y + QA** | axe at 1440/390, contrast sampling, reduced motion, touch, forced colours | 0 violations |
| **P7 Ship** | Vercel deploy, Mux asset, portfolio embed, write-ups, Contra posts. **Needs Faizi's OK.** | Live URLs, no login |

## Skin briefs (P3)

- **Phatta:** black lacquer rail; SVG truck-art border; chamak-patti seek bar (conic-gradient shimmer, frozen under reduced motion); brass playhead; bell fringe that sways on hover; sign-painter numerals for the time.
- **Glass:** floating frosted pill with `backdrop-filter`, plus a gradient scrim so it reads over white video; Compat-style fallback without blur.
- **Basant:** sky bar; charkhi spool on the left; the manja string is the time slider; a paper-kite thumb that tilts with scrub speed; a kite on a string for volume.
- **Ink & Reed:** cream paper; reed-pen stroke progress (SVG path that thickens); ink-drop thumb; ±15 s skip; serif time; gold edge; RTL-ready.
- **Darkroom:** safelight-red theme; film-strip thumbnail scrubber (`media-slider-thumbnail` via a VTT sprite); red seven-segment time; hardware-style buttons with LED state.

## Gauntlet loop (P5, per skin)

- **Bar:** the v10 Default skin and Plyr, the judges' own work. Same two references every round.
- **Each round:**
  1. Builder improves the skin.
  2. Capture fixed screenshots: 1440 and 390 px × bright and dark clip × states (idle, hover, menu open, focus, buffering).
  3. A fresh critic agent sees an unlabeled pair (ours vs the bar), picks a winner, and gives its top 3 fixes. Legibility is judged too.
- **Exit:** ours wins clearly in 2 consecutive blind rounds and every gate passes. No fixed round cap; stop and report if 3 rounds show no progress.

## Verification gates (scripted)

- Playwright: keyboard map; Esc closes menus and restores focus; focus visible; every target ≥ 44 px; reduced motion → no animation; fullscreen toggles.
- axe-core: 0 violations at 1440 and 390.
- Contrast: controls ≥ 4.5:1 over sampled bright and dark frames.
- Lighthouse a11y ≥ 95. Build passes; no console errors.

## Ship (P7, needs Faizi's OK)

- One Vercel project serving `panj.vercel.app/<skin>`.
- Mux free account; one asset with a public playback ID, used in all five skins.
- One skin embedded on faizi-dev.vercel.app.
- Repo goes public only at submission, on Faizi's OK.
- Per skin: cover image, 20 s screen clip, 3–4 sentences of design thinking, posted with #videojsskinschallenge.

## Timeline (PKT)

| Day | Work |
|---|---|
| Mon 9 | Docs approved, REA map, P1–P2 |
| Tue 10 | P3 art for Phatta and Basant; gauntlet |
| Wed 11 | Glass, Ink & Reed, Darkroom; gauntlet |
| Thu 12 | P4–P6 |
| Fri 13 | Ship. Submit the strongest skin first if the close date turns out earlier. |

## Risks

- Close date unknown; read it when the challenge goes live.
- Five entries per person may not be allowed. Fallback: submit Phatta, link the gallery.
- Backdrop-blur performance on mobile (Glass).
- Art clutter hurting legibility; the critic judges legibility too.
- Overlap with Clocked edits until Nov 11.
