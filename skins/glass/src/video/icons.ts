// Glass icon set: hand-drawn for this skin on a 24px grid.
// Filled, softly rounded glyphs for the primary transport (play, pause) and 1.75px round-capped strokes for
// everything else, so the set reads as one family at 20px over frosted glass.
import { registerIcons } from '@videojs/html/icons';

const svg = (body: string, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"${extra}>${body}</svg>`;

const stroke = (d: string) =>
  `<path d="${d}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Speaker body shared by the volume glyphs. */
const speaker = stroke('M4 9.75h2.6L11 6v12l-4.4-3.75H4z');

export const glassIcons = {
  // Transport: a rounded filled triangle and two soft bars.
  play: svg('<path d="M8 5.6c0-.95 1.03-1.54 1.85-1.06l9.3 5.43a1.25 1.25 0 0 1 0 2.16l-9.3 5.43C9.03 18.04 8 17.45 8 16.5z" fill="currentColor"/>'),
  pause: svg('<rect x="6.5" y="5" width="3.75" height="14" rx="1.4" fill="currentColor"/><rect x="13.75" y="5" width="3.75" height="14" rx="1.4" fill="currentColor"/>'),
  restart: svg(stroke('M4.75 12a7.25 7.25 0 1 0 2.2-5.2') + stroke('M4.5 4.5v3.75h3.75')),
  seek: svg(stroke('M19.25 12a7.25 7.25 0 1 1-2.2-5.2') + stroke('M19.5 4.5v3.75h-3.75')),

  // Volume: the waves step away as the level drops.
  'volume-high': svg(speaker + stroke('M14.5 9.5a3.5 3.5 0 0 1 0 5') + stroke('M17 7a7 7 0 0 1 0 10')),
  'volume-low': svg(speaker + stroke('M14.5 9.5a3.5 3.5 0 0 1 0 5')),
  'volume-off': svg(speaker + stroke('m15 9.5 5 5') + stroke('m20 9.5-5 5')),

  // Screen.
  'fullscreen-enter': svg(stroke('M4.75 9V6.25c0-.83.67-1.5 1.5-1.5H9') + stroke('M15 4.75h2.75c.83 0 1.5.67 1.5 1.5V9') + stroke('M19.25 15v2.75c0 .83-.67 1.5-1.5 1.5H15') + stroke('M9 19.25H6.25c-.83 0-1.5-.67-1.5-1.5V15')),
  'fullscreen-exit': svg(stroke('M9 4.75V7.5c0 .83-.67 1.5-1.5 1.5H4.75') + stroke('M19.25 9H16.5c-.83 0-1.5-.67-1.5-1.5V4.75') + stroke('M15 19.25V16.5c0-.83.67-1.5 1.5-1.5h2.75') + stroke('M4.75 15H7.5c.83 0 1.5.67 1.5 1.5v2.75')),
  'pip-enter': svg(stroke('M19.25 11V7.25a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v9.5a2 2 0 0 0 2 2H10') + '<rect x="13" y="13.5" width="7.5" height="5.5" rx="1.25" fill="currentColor"/>'),
  'pip-exit': svg(stroke('M19.25 11V7.25a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v9.5a2 2 0 0 0 2 2H10') + stroke('M13.75 13.75h6v5h-6z')),
  'airplay-enter': svg(stroke('M7 17.25H6.25a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5h11.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H17') + '<path d="M12 14.5 16 19.25H8z" fill="currentColor"/>'),
  'airplay-exit': svg(stroke('M7 17.25H6.25a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5h11.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H17') + stroke('M12 14.5 16 19.25H8z')),
  'cast-enter': svg(stroke('M4.75 9V7.25a1.5 1.5 0 0 1 1.5-1.5h11.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H13') + stroke('M4.75 12.5a6 6 0 0 1 5.75 5.75') + stroke('M4.75 15.75a2.75 2.75 0 0 1 2.5 2.5')),
  'cast-exit': svg(stroke('M4.75 9V7.25a1.5 1.5 0 0 1 1.5-1.5h11.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H13') + stroke('M4.75 12.5a6 6 0 0 1 5.75 5.75') + '<circle cx="5.5" cy="17.5" r="1.25" fill="currentColor"/>'),

  // Captions: an outlined card when off, a filled card with knocked-out lines when on.
  'captions-off': svg('<rect x="3.75" y="5.75" width="16.5" height="12.5" rx="3" stroke="currentColor" stroke-width="1.75"/>' + stroke('M7.5 13.75h3.5') + stroke('M13.5 13.75h3') + stroke('M7.5 10.5h2') + stroke('M12 10.5h4.5')),
  'captions-on': svg('<path fill-rule="evenodd" d="M6.75 5h10.5A3.75 3.75 0 0 1 21 8.75v6.5A3.75 3.75 0 0 1 17.25 19H6.75A3.75 3.75 0 0 1 3 15.25v-6.5A3.75 3.75 0 0 1 6.75 5Zm.75 4.6a.9.9 0 0 0 0 1.8h2a.9.9 0 0 0 0-1.8Zm4.5 0a.9.9 0 0 0 0 1.8h4.5a.9.9 0 0 0 0-1.8Zm-4.5 3.25a.9.9 0 0 0 0 1.8H11a.9.9 0 0 0 0-1.8Zm6 0a.9.9 0 0 0 0 1.8h3a.9.9 0 0 0 0-1.8Z" fill="currentColor"/>'),

  // Settings and menus.
  gear: svg(stroke('M10.3 4.3c.4-1.1 1.9-1.1 2.4 0l.3.8c.2.6.9.9 1.5.6l.8-.3c1.1-.5 2.1.5 1.6 1.6l-.3.8c-.3.6 0 1.3.6 1.5l.8.3c1.1.4 1.1 1.9 0 2.4l-.8.3c-.6.2-.9.9-.6 1.5l.3.8c.5 1.1-.5 2.1-1.6 1.6l-.8-.3c-.6-.3-1.3 0-1.5.6l-.3.8c-.4 1.1-1.9 1.1-2.4 0l-.3-.8c-.2-.6-.9-.9-1.5-.6l-.8.3c-1.1.5-2.1-.5-1.6-1.6l.3-.8c.3-.6 0-1.3-.6-1.5l-.8-.3c-1.1-.4-1.1-1.9 0-2.4l.8-.3c.6-.2.9-.9.6-1.5l-.3-.8c-.5-1.1.5-2.1 1.6-1.6l.8.3c.6.3 1.3 0 1.5-.6z') + '<circle cx="11.5" cy="11.5" r="2.4" stroke="currentColor" stroke-width="1.75"/>'),
  chevron: svg(stroke('m9.5 6.5 5.5 5.5-5.5 5.5')),
  check: svg(stroke('m5.5 12.5 4 4 9-9.5')),
  speed: svg(stroke('M4.6 16.5a8 8 0 1 1 14.8 0') + stroke('m12 13 3.5-4')),
  switches: svg(stroke('M4.75 8h9') + stroke('M17.75 8h1.5') + '<circle cx="15.75" cy="8" r="2" stroke="currentColor" stroke-width="1.75"/>' + stroke('M19.25 16h-9') + stroke('M6.25 16h-1.5') + '<circle cx="8.25" cy="16" r="2" stroke="currentColor" stroke-width="1.75"/>'),
  speech: svg(stroke('M6.25 5.25h11.5a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H11l-4 3v-3h-.75a1.5 1.5 0 0 1-1.5-1.5v-8a1.5 1.5 0 0 1 1.5-1.5z') + stroke('M8.5 9.5h7') + stroke('M8.5 12.5h4.5')),

  // A faint full ring with a bright arc that turns; --media-spinner-animation is `none` under reduced motion.
  spinner: svg(
    '<style>@keyframes glass-spin{to{transform:rotate(360deg)}}</style>' +
      '<circle cx="12" cy="12" r="8.25" stroke="currentColor" stroke-opacity=".22" stroke-width="2"/>' +
      '<path d="M12 3.75A8.25 8.25 0 0 1 20.25 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="transform-box:view-box;transform-origin:center;animation:var(--media-spinner-animation, glass-spin 0.9s cubic-bezier(.5,.15,.5,.85) infinite)"/>',
  ),
} as const;

registerIcons('glass', glassIcons);
