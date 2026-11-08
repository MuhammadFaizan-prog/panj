# panj

Five Video.js v10 skins: **Phatta**, **Glass**, **Basant**, **Ink & Reed**, **Darkroom**. Built for the Contra × Mux Video.js v10 Skins Design Challenge.

| Skin | Concept |
|---|---|
| [Phatta](skins/phatta) | Pakistani truck art |
| [Glass](skins/glass) | Liquid glass |
| [Basant](skins/basant) | Lahore kite festival |
| [Ink & Reed](skins/ink-reed) | Urdu calligraphy podcast player |
| [Darkroom](skins/darkroom) | Film lab |

Built on `@videojs/html@10.3.0` (HTML custom elements). Each skin started from the v10 Scaffold skin via `@videojs/cli skin create`.

```sh
pnpm install
pnpm dev      # gallery: /, /phatta, /glass, /basant, /ink-reed, /darkroom
pnpm build
```

## Deploy (Vercel, static)

`vercel.json` at the repo root carries the settings; nothing needs setting in the dashboard beyond importing the repo.

| Setting | Value |
|---|---|
| Framework preset | Other |
| Root directory | `.` (repo root) |
| Install command | `pnpm install` |
| Build command | `pnpm --filter @panj/gallery build` |
| Output directory | `apps/gallery/dist` |

Rewrites map `/phatta`, `/glass`, `/basant`, `/ink-reed` and `/darkroom` to each page's `index.html`; built pages load assets from absolute `/assets/…` paths, so the routes work with or without a trailing slash.

Docs: [PRD](PRD.md) · [Techspec](Techspec.md) · [Appflow](Appflow.md) · [Schema](Schema.md) · [Implementation plan](ImplementationPlan.md) · [Tracker](Tracker.md) · [Rules](Rules.md) · [Security](Security.md) · [Structure](Structure.md)

Licence: Apache-2.0 © 2026 Muhammad Faizan.
