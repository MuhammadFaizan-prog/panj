# Appflow: panj

## Routes

| Route | Page | Content |
|---|---|---|
| `/` | Hub | Title, one-line pitch, five cards (name + concept) linking to each skin |
| `/phatta` | Skin page | Back link, name, concept, a v10 player wearing Phatta, playing the sample video |
| `/glass` | Skin page | same, Glass |
| `/basant` | Skin page | same, Basant |
| `/ink-reed` | Skin page | same, Ink & Reed |
| `/darkroom` | Skin page | same, Darkroom |

Later (P5/P7): a bright/dark footage switch on each skin page, and a design-thinking blurb plus cover image.

## Judge flow

1. Open the public URL (no login) → hub.
2. Pick a skin → its page loads only that skin.
3. Press play (click, tap, Space or K) → video plays, controls auto-hide when idle.
4. Seek by dragging, clicking the track, or ←/→ (±5 s; ±15 s on Ink & Reed's skip buttons).
5. Volume: popover slider or ↑/↓; M mutes.
6. F or the button → fullscreen; Esc exits.
7. Open the settings menu → arrow keys move, Esc closes it and returns focus to its trigger.
8. Tab through everything: focus ring visible on every control, in visual order.
9. Resize to mobile → layout fits, targets stay ≥ 44 px.
10. Back link → hub.

## Player state flow

```
idle(poster) ─play→ loading/waiting ─canplay→ playing ⇄ paused
                         ↑                    │
                         └──── seeking ←──────┘
playing ─end→ ended ─play→ playing (restart icon)
any ─error→ error dialog ─close→ previous
controls: visible ⇄ hidden (idle timeout; always visible while paused or while focus is inside)
```

Every state above gets a designed look in every skin (P4 checklist in ImplementationPlan.md).
