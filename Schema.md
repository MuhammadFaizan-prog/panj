# Schema: panj

No database. Two data models matter: the **player state** each skin styles, and the **design tokens** each skin sets.

## 1. Player state (owned by Video.js, read by skins)

The `<video-player>` store holds state; UI elements reflect it as `data-*` attributes and CSS custom properties. Skins only *read* it in CSS. Names below are the ones the Scaffold styles; confirm each in the P2 map before relying on new ones.

| State | Where it appears | Skin must style |
|---|---|---|
| paused / playing | `data-paused` on play button and container | play ⇄ pause icon, controls pinned while paused |
| ended | `data-ended` | restart icon |
| waiting / buffering | `<media-buffering-indicator>` visible | loading treatment |
| seeking | `data-seeking` on time slider | thumb pressed state |
| progress | `--media-slider-fill` (percent) | fill + thumb position |
| buffered | `--media-slider-buffer` (percent) | buffer bar |
| muted / volume level | `data-muted`, volume slider fill | mute icon variants (off/low/high), volume fill |
| fullscreen | `data-fullscreen` | enter ⇄ exit icon |
| captions on | captions button state | on/off icon |
| controls visible | `data-visible` on controls content | show/hide; keep shown with `:has(:focus-visible)` |
| menu / popover open | `data-open` on popup | open/close, Esc returns focus |
| error | `<media-error-dialog>` open | readable dialog |
| interaction | `:hover`, `:focus-visible`, `:active` | hover, visible focus, pressed |
| user prefs | `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` | motion off, solid surfaces |

## 2. Design tokens

Order of application (later wins): Scaffold theme → `@panj/tokens` → `skins/<slug>/src/tokens.css`, all scoped to `.media-skin[data-skin]`.

### Shared (`packages/tokens/tokens.css`)

| Token | Default | Purpose |
|---|---|---|
| `--panj-target-min` | `44px` | minimum hit area (gate 6) |
| `--panj-focus-width` | `2px` | focus ring width |
| `--panj-focus-offset` | `2px` | focus ring offset |
| `--panj-focus-color` | `#fff` | ring colour |
| `--panj-focus-halo` | `rgb(0 0 0 / .8)` | outer halo so focus shows on bright frames |
| `--panj-motion-fast / base / slow` | `120ms / 200ms / 400ms` → `0ms` under reduced motion | all transitions and animations |
| `--panj-scrim` | dark gradient | readability layer behind controls |

### Per skin (`src/tokens.css`)

Every skin sets `--panj-surface`, `--panj-on-surface`, `--panj-accent`, then its own art tokens:

| Skin | Art tokens (planned, P3) |
|---|---|
| Phatta | `--panj-rail`, `--panj-border-*`, `--panj-track` (chamak-patti), `--panj-thumb` (brass), `--panj-bell` |
| Glass | `--panj-surface` (frosted alpha), `--panj-blur`, `--panj-edge` (specular), `--panj-scrim` |
| Basant | `--panj-sky`, `--panj-string`, `--panj-spool`, `--panj-kite-*` |
| Ink & Reed | `--panj-paper`, `--panj-ink`, `--panj-gold`, `--panj-skip-step` (15 s) |
| Darkroom | `--panj-safelight`, `--panj-film`, `--panj-segment`, `--panj-led` |

Each skin also maps its accent to the public `--media-accent-color` so it can be restyled like a packaged skin.

## 3. Gallery data

`apps/gallery/src/media.ts` holds the sample media `{ src, poster }`. The route list lives in `vite.config.ts` (`ROUTES`) and the hub HTML. No runtime fetching.
