// /ink-reed showcase: mounts the Ink & Reed player on the reference's sheet and wires the right-to-left demo toggle.
// The media is the shared public sample (the a11y suite intercepts that URL); it opens on the reference's photo
// (assets/poster.webp, cut by skins/ink-reed/tools/build_assets.py). The toggle only sets `dir` on the stage.
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/ink-reed';

import { mediaHtml } from '../src/media';
import podcastPoster from './assets/poster.webp?url';

const stage = document.getElementById('stage');
stage?.replaceChildren(createSkinnedPlayer(mediaHtml(), podcastPoster));

const toggle = document.getElementById('rtl-toggle');
if (toggle && stage) {
  toggle.addEventListener('click', () => {
    const rtl = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(rtl));
    if (rtl) stage.setAttribute('dir', 'rtl');
    else stage.removeAttribute('dir');
  });
}
