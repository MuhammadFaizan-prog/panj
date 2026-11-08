# Tracker: panj

Status key: ✅ done · 🔄 in progress · ⏳ next · ⛔ blocked

| Phase | Status | Commit | Notes |
|---|---|---|---|
| P0 REA map | ⏳ | | REA not installed (needs Faizi's OK); map from v10 source/docs + public Plyr demo |
| P1 Scaffold | ✅ local | see git log | 5 skins (CLI, html/css/scaffold/video), gallery MPA, docs, licence. Builds + typecheck pass; 6 routes 200. Push blocked: GitHub repo exists but is **public** |
| P2 Essentials | ⏳ | | Playwright suite + keyboard map in all 5 skins |
| P3 Art | ⏳ | | Phatta first (mockup concept-phatta.png) |
| P4 States | ⏳ | | |
| P5 Gauntlet | ⏳ | | |
| P6 A11y + QA | ⏳ | | |
| P7 Ship | ⏳ | | needs Faizi's OK (Vercel, Mux, portfolio, repo public) |

## Log

### 2026-11-08: P1 scaffold
- Verified v10 facts (Techspec.md): `@videojs/html@10.3.0`, `@videojs/cli@10.3.0 skin create` runs non-interactively.
- Generated 5 skins with `skin create --framework html --styling css --base scaffold --preset video`; removed CLI deploy scripts and host configs; added `data-skin`, `src/tokens.css`, `src/index.ts`, README briefs.
- `@panj/tokens` shared token package.
- `apps/gallery`: Vite multi-page, hub + 5 routes, public Mux demo MP4.
- Verification: `pnpm install` ok; `pnpm -r build` ok (6 packages); `pnpm -r typecheck` ok; dev server `/`, `/phatta`, `/glass`, `/basant`, `/ink-reed`, `/darkroom` → 200.
- Blocker: `MuhammadFaizan-prog/panj` already existed as a **public**, empty repo (created 2026-11-08 23:47 PKT). The Hark GitHub connector can't create repos or change visibility, so nothing was pushed.

## Open items
- Flip the GitHub repo to private, then push.
- Read the challenge close date and the one-vs-five-entries rule once the page is live.
- Add bright + dark sample clips for the readability gate (P5).
