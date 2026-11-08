// /darkroom showcase: the Darkroom unit on the reference's wall. The media is the shared public sample (the a11y
// suite intercepts that URL) with the Mux storyboard as a thumbnails track; it opens on the reference's photo
// (assets/poster.webp, cut by skins/darkroom/tools/build_assets.py).
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/darkroom';

import { mediaHtml, SAMPLE } from '../src/media';
import poster from './assets/poster.webp?url';

const id = /stream\.mux\.com\/([^/.?]+)/.exec(SAMPLE.src)?.[1];
// captions stay textTracks[0]; the storyboard follows it
const html = id
  ? mediaHtml().replace('</video>', `<track kind="metadata" label="thumbnails" default src="https://image.mux.com/${id}/storyboard.vtt"></video>`)
  : mediaHtml();

document.getElementById('stage')?.replaceChildren(createSkinnedPlayer(html, poster));
