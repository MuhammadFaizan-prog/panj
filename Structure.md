# Structure: panj

```
panj/
├── PRD.md  Techspec.md  Appflow.md  Schema.md  ImplementationPlan.md
├── Tracker.md  Rules.md  Security.md  Structure.md
├── README.md  LICENSE (Apache-2.0)  NOTICE
├── package.json            root scripts: dev (gallery), build (all), typecheck (all)
├── pnpm-workspace.yaml     skins/*, apps/*, packages/*
├── pnpm-lock.yaml
├── docs/
│   └── research/           P0 output: rea-map.md (planned)
├── packages/
│   ├── tokens/             @panj/tokens: shared --panj-* CSS tokens
│   └── a11y-tests/         planned (P2/P6): Playwright + axe suites
├── skins/
│   └── <slug>/             @panj/<slug>, one per skin: phatta, glass, basant, ink-reed, darkroom
│       ├── README.md       concept brief + status
│       ├── AGENTS.md       CLI-generated agent guide (deploy line removed)
│       ├── skin.json       CLI record: framework html, styling css, base scaffold, preset video, videojs 10.3.0
│       ├── package.json    exports "." → src/index.ts
│       ├── vite.config.ts  workbench build (CLI)
│       ├── src/
│       │   ├── index.ts           createSkinnedPlayer(mediaHtml, poster)
│       │   ├── tokens.css         this skin's tokens
│       │   ├── skin.css           global styles (workbench only)
│       │   ├── video/skin.html    skin markup (Video.js custom elements)
│       │   ├── video/skin.ts      element + icon registration, CSS imports
│       │   ├── video/skin.css     skin component styles
│       │   └── styles/            Scaffold theme + base CSS
│       └── apps/preview/   CLI workbench (sizes, ratios, RTL, locales)
└── apps/
    └── gallery/            @panj/gallery, Vite multi-page
        ├── index.html      hub "/"
        ├── <slug>/index.html   one entry per skin route
        ├── src/media.ts    sample media
        ├── src/mount.ts    mounts a skinned <video-player> into #stage
        ├── src/gallery.css page chrome
        └── vite.config.ts  MPA inputs + clean-route middleware (/phatta → /phatta/)
```

## Commands

```sh
pnpm install
pnpm dev                       # gallery at http://localhost:5173
pnpm build                     # every skin workbench + gallery
pnpm typecheck
pnpm --filter @panj/phatta dev # one skin's CLI workbench
```
