// /basant showcase: mounts the Basant player and swaps its footage (Film / Bright / Dark).
// Film is the shared public sample (the a11y suite intercepts that URL) and opens on the reference's photo
// (assets/poster.webp, cut by skins/basant/tools/build_assets.py). Bright and Dark are the short abstract clips
// made for the Glass page, reused here to check the centre ring over the hardest frames.
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/basant';

import { SAMPLE } from '../src/media';
import brightClip from '../glass/footage/bright.webm?url';
import darkClip from '../glass/footage/dark.webm?url';
import rooftopsPoster from './assets/poster.webp?url';

type Footage = 'film' | 'bright' | 'dark';

const FOOTAGE: Record<Footage, { src: string; poster?: string; note: string }> = {
  film: { src: SAMPLE.src, poster: rooftopsPoster, note: 'Film: the public Video.js demo clip, opening on the rooftops.' },
  bright: { src: brightClip, note: 'Bright: a near-white test clip, the hardest case for the white play glyph.' },
  dark: { src: darkClip, note: 'Dark: a near-black test clip, the hardest case for the ring and the kites.' },
};

const media = (src: string) =>
  `<video src="${src}" playsinline crossorigin preload="metadata" loop>` +
  `<track kind="subtitles" label="English" srclang="en" src="${SAMPLE.captions}">` +
  `</video>`;

const stage = document.getElementById('stage');
const note = document.getElementById('footage-note');
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-footage]')];

function show(kind: Footage): void {
  if (!stage) return;
  const f = FOOTAGE[kind];
  stage.replaceChildren(createSkinnedPlayer(media(f.src), f.poster));
  if (note) note.textContent = f.note;
  for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.footage === kind));
}

for (const b of buttons) b.addEventListener('click', () => show(b.dataset.footage as Footage));

const asked = new URLSearchParams(location.search).get('footage');
show(asked === 'bright' || asked === 'dark' ? asked : 'film');
