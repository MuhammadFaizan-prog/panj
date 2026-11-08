// Basant icon family. Hand-authored 24×24 SVGs, drawn for this skin (no third-party art).
// Colour comes from `currentColor`, so every icon follows the skin's ink token.
// Registered as family "basant"; the Scaffold family still supplies the icons not redrawn here.

const svg = (body: string, fill = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${fill}" aria-hidden="true">${body}</svg>`;

/** Play: a rounded paper-kite triangle with a little bridle notch. */
const play = svg('<path d="M8.2 4.6c-.9-.6-2.2 0-2.2 1.1v12.6c0 1.1 1.3 1.7 2.2 1.1l9.7-6.3c.8-.5.8-1.7 0-2.2z"/>');

/** Pause: two bamboo kite spars. */
const pause = svg(
  '<rect x="6" y="4.5" width="4" height="15" rx="1.6"/><rect x="14" y="4.5" width="4" height="15" rx="1.6"/>' +
    '<path d="M6 9h4M14 9h4M6 15h4M14 15h4" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>'
);

/** Restart: string looping back onto the spool. */
const restart = svg(
  '<path d="M12 5a7 7 0 1 1-6.6 4.7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M3.6 4.4 5 10.2l5.6-1.6z" fill="currentColor"/>',
  'none'
);

/** Speaker with sound as two kite-string arcs. */
const speaker = '<path d="M4 9.2h3.2L12 5v14l-4.8-4.2H4a1 1 0 0 1-1-1V10.2a1 1 0 0 1 1-1z" fill="currentColor"/>';
const volumeHigh = svg(
  speaker +
    '<path d="M15.2 9a4.2 4.2 0 0 1 0 6M17.8 6.4a8 8 0 0 1 0 11.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'none'
);
const volumeLow = svg(speaker + '<path d="M15.2 9a4.2 4.2 0 0 1 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>', 'none');
/** Muted: the string is cut. */
const volumeOff = svg(
  speaker + '<path d="m15.5 9.5 5 5m0-5-5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  'none'
);

/** Fullscreen: four kite corners pulling outward. */
const fullscreenEnter = svg(
  '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  'none'
);
const fullscreenExit = svg(
  '<path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  'none'
);

/** Captions: a paper tag. */
const captionsOff = svg(
  '<rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M7 11h3M12.5 11H17M7 14.5h6M15 14.5h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  'none'
);
const captionsOn = svg(
  '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/>' +
    '<path d="M7 11h3M12.5 11H17M7 14.5h6M15 14.5h2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'
);

/** Settings: the charkhi (string spool) seen end-on, six spokes. */
const charkhi = svg(
  '<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="12" cy="12" r="2.4" fill="currentColor"/>' +
    '<path d="M12 4.2v15.6M5.2 8.1l13.6 7.8M5.2 15.9l13.6-7.8" stroke="currentColor" stroke-width="1.6"/>',
  'none'
);

/** Buffering: the same spool, spun by CSS while the indicator is visible (not under reduced motion). */
const spinner = svg(
  '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="12" cy="12" r="2.6" fill="currentColor"/>' +
    '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M12 3a9 9 0 0 1 9 9" stroke="#f5b301" stroke-width="2.6" stroke-linecap="round"/>',
  'none'
);

export const basantIcons = {
  play,
  pause,
  restart,
  'volume-high': volumeHigh,
  'volume-low': volumeLow,
  'volume-off': volumeOff,
  'fullscreen-enter': fullscreenEnter,
  'fullscreen-exit': fullscreenExit,
  'captions-off': captionsOff,
  'captions-on': captionsOn,
  gear: charkhi,
  spinner,
};
