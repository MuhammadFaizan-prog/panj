// Ink & Reed icon family ("ink"): hand-authored for this skin, 24×24 grid, currentColor.
// Shapes lean calligraphic: tapered strokes, a reed-cut nib angle, an eight-point star for settings.

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${body}</svg>`;

const line = (d: string, w = 1.7) =>
  `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// A triangle whose sides bow very slightly, like a brushed wedge.
export const play = svg('<path d="M7.6 4.3c0-1 1.1-1.6 1.9-1.1l10.4 7.4c.8.6.8 1.8 0 2.4L9.5 20.4c-.8.5-1.9-.1-1.9-1.1C7.9 14.2 7.9 9.4 7.6 4.3z"/>');

// Two reed strokes, each wider at the head than at the tail.
export const pause = svg(
  '<path d="M6.4 4.2c1-.5 2.6-.5 3.6 0-.2 5.2-.2 10.4 0 15.6-.9.5-2.1.5-3 0-.4-5.2-.6-10.4-.6-15.6z"/>' +
    '<path d="M14 4.2c1-.5 2.6-.5 3.6 0-.2 5.2-.2 10.4 0 15.6-.9.5-2.1.5-3 0-.4-5.2-.6-10.4-.6-15.6z"/>',
);

export const restart = svg(line('M5.2 9.2A7.6 7.6 0 1 1 4.6 14') + '<path d="M2.6 5.4l.9 5.3 5-1.8z"/>');

// ±15 s: an open loop with a nib-shaped arrowhead; the "15" is the button's own text label.
export const skipBack = svg(line('M12 4.6a7.6 7.6 0 1 1-7.2 5.2') + '<path d="M13.2 1.6 8.6 4.6l4.6 3z"/>');
export const skipForward = svg(line('M12 4.6a7.6 7.6 0 1 0 7.2 5.2') + '<path d="M10.8 1.6l4.6 3-4.6 3z"/>');

const speaker = '<path d="M3.6 9.2c0-.6.4-1 1-1h2.8l4.4-3.7c.6-.5 1.6-.1 1.6.8v13.4c0 .9-1 1.3-1.6.8l-4.4-3.7H4.6c-.6 0-1-.4-1-1z"/>';
export const volumeHigh = svg(speaker + line('M16 9.2c1.2 1.6 1.2 4 0 5.6') + line('M18.6 6.6c2.6 3 2.6 7.8 0 10.8'));
export const volumeLow = svg(speaker + line('M16 9.2c1.2 1.6 1.2 4 0 5.6'));
// Muted: two crossed reed strokes where the waves were.
export const volumeOff = svg(speaker + line('M15.6 9.4l5.2 5.2', 1.8) + line('M20.8 9.4l-5.2 5.2', 1.8));

// Captions: a speech leaf with "CC"; "on" adds a ruled underline beneath, like a marked line in a manuscript.
const bubble = line('M4.4 5h15.2c.8 0 1.4.6 1.4 1.4v9c0 .8-.6 1.4-1.4 1.4h-8.2l-4 3.2v-3.2H4.4c-.8 0-1.4-.6-1.4-1.4v-9C3 5.6 3.6 5 4.4 5z', 1.6);
const cc = line('M10.3 9.3a2.1 2.1 0 1 0 0 3.1', 1.5) + line('M16.1 9.3a2.1 2.1 0 1 0 0 3.1', 1.5);
export const captionsOff = svg(bubble + cc);
export const captionsOn = svg(
  '<path fill-rule="evenodd" d="M4.4 4.2h15.2c1.2 0 2.2 1 2.2 2.2v9c0 1.2-1 2.2-2.2 2.2h-7.9l-4.2 3.3c-.5.4-1.3 0-1.3-.6v-2.7h-2C3.2 17.6 2.2 16.6 2.2 15.4v-9c0-1.2 1-2.2 2.2-2.2zm5.2 4c-1.8 0-3 1.3-3 2.9s1.2 2.9 3 2.9c.8 0 1.4-.3 1.9-.7l-.9-1c-.3.2-.6.3-1 .3-.9 0-1.5-.6-1.5-1.5s.6-1.5 1.5-1.5c.4 0 .7.1 1 .3l.9-1c-.5-.4-1.1-.7-1.9-.7zm5.8 0c-1.8 0-3 1.3-3 2.9s1.2 2.9 3 2.9c.8 0 1.4-.3 1.9-.7l-.9-1c-.3.2-.6.3-1 .3-.9 0-1.5-.6-1.5-1.5s.6-1.5 1.5-1.5c.4 0 .7.1 1 .3l.9-1c-.5-.4-1.1-.7-1.9-.7z"/>',
);

// Settings: an eight-point star (two interlaced squares) around a dot.
export const settings = svg(
  line('M12 2.8l2.7 2.7h3.8v3.8l2.7 2.7-2.7 2.7v3.8h-3.8L12 21.2l-2.7-2.7H5.5v-3.8L2.8 12l2.7-2.7V5.5h3.8z', 1.5) +
    '<circle cx="12" cy="12" r="2.4"/>',
);

export const fullscreenEnter = svg(
  line('M4 9V5.2C4 4.5 4.5 4 5.2 4H9') + line('M15 4h3.8c.7 0 1.2.5 1.2 1.2V9') + line('M20 15v3.8c0 .7-.5 1.2-1.2 1.2H15') + line('M9 20H5.2C4.5 20 4 19.5 4 18.8V15'),
);
export const fullscreenExit = svg(
  line('M9 4v3.8C9 8.5 8.5 9 7.8 9H4') + line('M20 9h-3.8C15.5 9 15 8.5 15 7.8V4') + line('M15 20v-3.8c0-.7.5-1.2 1.2-1.2H20') + line('M4 15h3.8c.7 0 1.2.5 1.2 1.2V20'),
);

export const pipEnter = svg(line('M20 11V6.2C20 5.5 19.5 5 18.8 5H5.2C4.5 5 4 5.5 4 6.2v11.6c0 .7.5 1.2 1.2 1.2H10', 1.6) + '<rect x="12.5" y="13" width="9" height="6.5" rx="1"/>');
export const pipExit = svg(line('M20 11V6.2C20 5.5 19.5 5 18.8 5H5.2C4.5 5 4 5.5 4 6.2v11.6c0 .7.5 1.2 1.2 1.2H10', 1.6) + line('M13.5 14h7v5h-7z', 1.5));

export const airplayEnter = svg(line('M7 17H5.2C4.5 17 4 16.5 4 15.8V5.2C4 4.5 4.5 4 5.2 4h13.6c.7 0 1.2.5 1.2 1.2v10.6c0 .7-.5 1.2-1.2 1.2H17', 1.6) + '<path d="M12 13.6l5 6.4H7z"/>');
export const airplayExit = airplayEnter;

export const castEnter = svg(
  line('M4 8V6.2C4 5.5 4.5 5 5.2 5h13.6c.7 0 1.2.5 1.2 1.2v11.6c0 .7-.5 1.2-1.2 1.2H14', 1.6) +
    line('M4 12.2a7 7 0 0 1 6.8 6.8', 1.6) +
    line('M4 15.6a3.4 3.4 0 0 1 3.4 3.4', 1.6) +
    '<circle cx="4.6" cy="18.6" r="1.1"/>',
);
export const castExit = castEnter;

// Buffering: an ink ring with a gap, drawn thick-to-thin.
export const spinner = svg('<path d="M12 3.2a8.8 8.8 0 1 1-8.6 7 1 1 0 0 1 2 .4A6.8 6.8 0 1 0 12 5.2a1 1 0 0 1 0-2z" opacity=".9"/>');
