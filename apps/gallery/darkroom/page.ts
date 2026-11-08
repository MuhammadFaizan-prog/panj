// /darkroom showcase: the Darkroom unit on the reference's wall. The media is the shared public sample (the a11y
// suite intercepts that URL); it opens on the reference's photo (assets/poster.webp, cut by
// skins/darkroom/tools/build_assets.py).
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/darkroom';

import { mediaHtml } from '../src/media';
import poster from './assets/poster.webp?url';

document.getElementById('stage')?.replaceChildren(createSkinnedPlayer(mediaHtml(), poster));
