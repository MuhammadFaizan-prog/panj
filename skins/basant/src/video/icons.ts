// Basant icon family. Hand-authored 24×24 SVGs, drawn for this skin (no third-party art).
// Colour comes from `currentColor`, so every icon follows the skin's ink token.
// Registered as family "basant"; the Scaffold family still supplies the icons not redrawn here.

const svg = (body: string, fill = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${fill}" aria-hidden="true">${body}</svg>`;

// Play, pause and the speaker are drawn in the reference's own pixel boxes (see basant-ref.css), so the live
// glyphs land where the locked reference paints them.

/** Play: the reference's rounded white triangle, in the 142px box of the centre ring. */
const ringBox = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142 142" fill="currentColor" aria-hidden="true">${body}</svg>`;
const play = ringBox('<path d="M52.3 41.6 101.6 70.6 52.3 99.6z" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>');

/** Pause: two rounded spars in the same box. */
const pause = ringBox('<rect x="50" y="42" width="15" height="58" rx="5"/><rect x="77" y="42" width="15" height="58" rx="5"/>');

/** Restart: string looping back onto the spool. */
const restart = svg(
  '<path d="M12 5a7 7 0 1 1-6.6 4.7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M3.6 4.4 5 10.2l5.6-1.6z" fill="currentColor"/>',
  'none'
);

/** Speaker (reference box 32 x 26) with two sound arcs. */
const speakerBox = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 26" fill="none" aria-hidden="true">${body}</svg>`;
const speaker = '<path d="M6.4 8.6h4.6L17.2 3.6v18.8L11 17.4H6.4a1 1 0 0 1-1-1V9.6a1 1 0 0 1 1-1z" fill="currentColor"/>';
const volumeHigh = speakerBox(
  speaker +
    '<path d="M19.6 9.6a4.6 4.6 0 0 1 0 6.8M22.4 6.6a8.8 8.8 0 0 1 0 12.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
);
const volumeLow = speakerBox(speaker + '<path d="M19.6 9.6a4.6 4.6 0 0 1 0 6.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>');
/** Muted: the string is cut. */
const volumeOff = speakerBox(
  speaker + '<path d="m20 9.4 6 6.6m0-6.6-6 6.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
);

/** Fullscreen: four arrows pulling out of the disc's centre (reference box 48 x 48). */
const discBox = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">${body}</svg>`;
const arrowOut = '<path d="M12.6 13.2 19.6 13.6 13 20.2z"/><path d="M15.2 16 21 21.6" stroke="currentColor" stroke-width="3"/>';
const arrowIn = '<path d="M21 21.4 12.6 21 20.6 12.9z"/><path d="M17.9 18.3 11.8 12.4" stroke="currentColor" stroke-width="3.7"/>';
const four = (a: string) =>
  `<g>${a}</g><g transform="matrix(-1 0 0 1 48 0)">${a}</g><g transform="matrix(1 0 0 -1 0 48)">${a}</g><g transform="matrix(-1 0 0 -1 48 48)">${a}</g>`;
const fullscreenEnter = discBox(four(arrowOut));
const fullscreenExit = discBox(four(arrowIn));

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
