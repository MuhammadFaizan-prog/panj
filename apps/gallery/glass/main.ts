// /glass showcase: mounts the Glass player and swaps its footage (Film / Bright / Dark).
// Film is the shared public sample (the a11y suite intercepts that URL). Bright and Dark are short
// abstract clips generated for this page (footage/*.webm, ~60 KB each) to stress-test legibility.
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/glass';

import { SAMPLE } from '../src/media';
import brightClip from './footage/bright.webm?url';
import darkClip from './footage/dark.webm?url';

type Footage = 'film' | 'bright' | 'dark';

const FOOTAGE: Record<Footage, { src: string; poster?: string; note: string; theme: 'light' | 'dark' }> = {
  film: {
    src: SAMPLE.src,
    poster: SAMPLE.poster,
    note: 'Film: the public Video.js demo clip, mostly mid-tones.',
    theme: 'dark',
  },
  bright: {
    src: brightClip,
    note: 'Bright: a near-white test clip made for this page, the hardest case for white controls.',
    theme: 'light',
  },
  dark: {
    src: darkClip,
    note: 'Dark: a near-black test clip made for this page, the hardest case for a dark glass edge.',
    theme: 'dark',
  },
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
  document.documentElement.dataset.theme = f.theme;
  if (note) note.textContent = f.note;
  for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.footage === kind));
}

for (const b of buttons) b.addEventListener('click', () => show(b.dataset.footage as Footage));

const asked = new URLSearchParams(location.search).get('footage');
show(asked === 'bright' || asked === 'dark' ? asked : 'film');
