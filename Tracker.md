# Tracker: panj

Status key: ✅ done · 🔄 in progress · ⏳ next · ⛔ blocked

| Phase | Status | Commit | Notes |
|---|---|---|---|
| P0 REA map | ⏳ | | REA not installed (needs Faizi's OK); map from v10 source/docs + public Plyr demo |
| P1 Scaffold | ✅ | aee2ea1 | 5 skins (CLI, html/css/scaffold/video), gallery MPA, docs, licence. Builds + typecheck pass; 6 routes 200 |
| P2 Essentials | ✅ | see log | All 5 skins: 116 Playwright checks pass at 1440/390 (6 documented skips) |
| P3 Art | ✅ | see log | Phatta ✅ · Glass ✅ · Basant ✅ · Ink & Reed ✅ · Darkroom ✅ (art per skin README; gallery page per skin) |
| P4 States | ✅ | see log | Phatta ✅ · Glass ✅ · Basant ✅ · Ink & Reed ✅ · Darkroom ✅ (hover/focus/active/disabled, loading, error dialog, touch volume) |
| P5 Gauntlet | ⏳ | | |
| P6 A11y + QA | ⏳ | | |
| P7 Ship | 🔄 | | `vercel.json` ready (static, see README › Deploy); deploying still needs Faizi's OK (Vercel, Mux, portfolio) |

## Log

### 2026-11-08: P1 scaffold
- Verified v10 facts (Techspec.md): `@videojs/html@10.3.0`, `@videojs/cli@10.3.0 skin create` runs non-interactively.
- Generated 5 skins with `skin create --framework html --styling css --base scaffold --preset video`; removed CLI deploy scripts and host configs; added `data-skin`, `src/tokens.css`, `src/index.ts`, README briefs.
- `@panj/tokens` shared token package.
- `apps/gallery`: Vite multi-page, hub + 5 routes, public Mux demo MP4.
- Verification: `pnpm install` ok; `pnpm -r build` ok (6 packages); `pnpm -r typecheck` ok; dev server `/`, `/phatta`, `/glass`, `/basant`, `/ink-reed`, `/darkroom` → 200.
- Repo: `MuhammadFaizan-prog/panj` already existed as a **public** empty repo (created 2026-11-08 23:47 PKT). Faizi approved pushing to it public (23:59: "its ok push it to public ones").

### 2026-11-09: P2 essentials
- `@panj/tokens/essentials.css` (imported by every skin, `utilities` layer): 44 px buttons, 44 px time-slider hit area, 44 px menu items and volume popover, light ring + dark halo focus on every control, controls stay visible while focus is inside, reduced motion zeroes every transition/animation, forced-colours focus.
- Scaffold centre seek buttons used `!important` 32 px; patched in each skin's `skin.css` to `max(44px, …)` (layers can't override an earlier-layer `!important`).
- Ink & Reed: skip buttons now ±15 s (`seconds="±15"`, labels 15).
- Gallery: English subtitles track (`public/captions/en.vtt`) so captions can be exercised.
- `packages/a11y-tests`: Playwright 1.56.1 suite (`essentials.spec.ts`, `a11y-gates.spec.ts`); local bright/dark VP9 fixtures served over the Mux sample URL with Range support.
- Verification: per skin 23 passed + 1 skipped (desktop-1440 + mobile-390); Ink & Reed ±15 s 1 passed + 1 skipped. Total 116 passed, 6 skipped, 0 failed. `pnpm -r build` and `pnpm -r typecheck` pass.
- Skips (by design): volume popover on touch is hover-only in the v10 Scaffold; centre skip buttons hidden on coarse pointers.

### 2026-11-09: P3 art + P4 states (all five skins), integration
- Art + states landed for Phatta (truck-art frame, day/night page), Glass (frosted pill, Film/Bright/Dark footage switch), Basant (kite-string seek, kite volume), Ink & Reed (paper bar, qalam timeline, RTL toggle), Darkroom (film-strip seek, LED time, inline fader). Each skin's README has the design notes.
- Touch volume per skin: Phatta and Ink & Reed show the slider inline on touch (popover on desktop); Glass opens its capsule on first tap; Basant and Darkroom always show an inline slider. Tab reaches the volume slider on every skin.
- Shared fixes: `@layer base, components, utilities;` first in `@panj/tokens/tokens.css` (production CSS chunk order no longer flips layers); gallery `#stage .media-skin` sizing moved to `@layer base` + `:where()` so skin layouts win; gallery pages reference their own CSS/TS by absolute path (`/phatta/…`), which fixed 404s when a route is opened without the trailing slash; `glass/`, `phatta/`, `ink-reed/` page scripts are typechecked.
- Visual fixes: Basant centre play/seek no longer sit under the two-row bar on phones; Ink & Reed poster and indicators stay in the picture cell instead of covering the paper bar.
- Tests: volume gate is popover-Esc where a desktop popover exists, otherwise Tab-to-slider + ↑/↓; Ink & Reed ±15 s runs on mobile too; new bright-footage check per skin; fullscreen test waits 300 ms before toggling back (headless cold-start race).
- Verification: 132 Playwright checks pass at 1440 + 390 against the production build (0 skipped, 0 flaky; earlier dev-server run also green); `pnpm -r build` and `pnpm -r typecheck` pass. Vercel build command verified from a clean clone.

## Open items
- Read the challenge close date and the one-vs-five-entries rule once the page is live.
- P5: readability gauntlet on real bright/dark footage (fixtures exist; bright-footage smoke check is in the suite).
- Darkroom at 390: the deck covers about two thirds of a 16:9 phone picture while controls are showing (auto-hides); consider a slimmer phone deck.
- Phatta Urdu line needs a Nastaliq/Naskh font on systems without one (falls back; one glyph showed as tofu in the sandbox).
