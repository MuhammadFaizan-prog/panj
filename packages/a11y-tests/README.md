# @panj/a11y-tests

Playwright gates run against the gallery for every skin, at **1440×900** (`desktop-1440`) and **390×844 with touch** (`mobile-390`).

| Spec | Checks |
|---|---|
| `essentials.spec.ts` | play/pause (button, Space, K) · seek (End/Home/←/→, slider thumb keys) + time display · mute (M, button) + volume (↓) · fullscreen (F, button) · captions (C, button) · speed menu (Enter opens, choose 1.5×, Esc closes and returns focus) · Ink & Reed ±15 s skip |
| `a11y-gates.spec.ts` | every visible control ≥ 44 px · Tab reaches every control with a visible ring · Esc closes the volume popover (desktop) · `prefers-reduced-motion` leaves no running transition/animation · no console errors |

Media is served from `fixtures/` (generated bright and dark VP9 clips, 30 s) by intercepting the public Mux sample URL, so the suite runs offline. Range requests are honoured so the media is seekable.

```sh
pnpm --filter @panj/a11y-tests test:install   # once: Chromium
pnpm test                                     # from the repo root; starts the gallery on :5199
pnpm --filter @panj/a11y-tests test -g "phatta:"   # one skin
```

Known skips: the volume popover test on `mobile-390` (the v10 Scaffold popover opens on hover only; touch users get mute + device volume) and the Ink & Reed centre skip buttons on `mobile-390` (shown on fine pointers only).
