# PRD: panj

Five Video.js v10 skins for the **Contra × Mux Video.js v10 Skins Design Challenge** ($10K: 5K / 3K / 2K). Judges: Sam Potts (Plyr) and Steve Heffernan (Video.js). Owner: Muhammad Faizan (Faizi).

*Panj* is Urdu/Punjabi for "five".

## Problem

Video players look interchangeable. The challenge asks for a v10 skin with a point of view that still works as a player: every essential control, every state, readable over any frame, usable by keyboard and touch. Rival entries are already posted, so the bar is live now.

## Goal

Ship five skins, each a distinct visual identity rooted in a real place or craft, that beat the v10 Default skin and Plyr in blind side-by-side critique while passing every challenge gate.

| Skin | Concept | Signature |
|---|---|---|
| Phatta | Pakistani truck art | Black lacquer rail, painted floral border, chamak-patti seek bar, brass playhead, bell fringe |
| Glass | Liquid glass | Floating frosted pill, scrim for bright video, no-blur fallback |
| Basant | Lahore kite festival | Sky bar, charkhi spool, manja string seek bar, paper-kite playhead, kite-on-string volume |
| Ink & Reed | Urdu calligraphy podcast player | Cream paper, reed-pen ink stroke seek bar, ink-drop playhead, ±15 s skip, gold edge, RTL-ready |
| Darkroom | Film lab | Safelight red, contact-sheet film strip scrubber, red seven-segment time, hardware buttons with LEDs |

## Users

- **Judges**: open a public URL, poke every control, check keyboard and mobile, compare with Default and Plyr.
- **Developers**: drop a skin into a v10 `<video-player>` and restyle it with tokens.
- **Viewers**: watch video without the skin getting in the way.

## Challenge gates (must pass, every skin)

1. **Essential controls**: play/pause, seek (time slider), current/duration time, volume and mute, fullscreen.
2. **Responsive** at desktop and mobile sizes (320 to 1440 px; checked at 1440 and 390).
3. **Keyboard operable**: every control reachable and usable by keyboard; menus and popovers close with **Esc**.
4. **Visible focus** on every control, over bright and dark frames.
5. **Readable over bright and dark video**: controls and text at ≥ 4.5:1 against sampled frames.
6. **Touch targets ≥ 44 px.**
7. **`prefers-reduced-motion`** respected: no shimmer, sway, tilt or transitions.
8. **Public URL, no login**: a v10 player playing video with the skin.
9. **Apache-2.0 licence** for entries.
10. Submission includes a visual plus a few sentences on the design thinking.

Bonus: a Mux asset (`<mux-video>` with a public playback ID); running on a real site (faizi-dev.vercel.app). Both at P7, with Faizi's approval.

## Scope

In: five skin packages (HTML custom elements + CSS + inline SVG), one gallery app with a hub and one route per skin, scripted a11y and visual gates, write-ups.

Out: a new player engine, React wrappers, analytics, any backend or database, paid services.

## Success

- All 10 gates pass for all five skins (scripted, see ImplementationPlan.md §Verification).
- Each skin wins two consecutive blind critic rounds against v10 Default and Plyr.
- Live gallery URL, no login, Lighthouse a11y ≥ 95, no console errors.

## Open questions

- Close date: read it once the challenge page is live (countdown suggests it opens ~Mon 2026-11-09 22:00 PKT).
- Whether one person may submit five entries. Fallback: submit Phatta and link the gallery.
