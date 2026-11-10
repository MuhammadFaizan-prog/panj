// /jaali showcase: the Jaali unit in the reference's sandstone alcove. The media is the shared public sample (the a11y
// suite intercepts that URL); it opens on the reference's landscape (assets/poster.webp, cut by
// skins/jaali/tools/build_assets.py).
import '@videojs/html/i18n';
import { createSkinnedPlayer } from '@panj/jaali';

import { mediaHtml } from '../src/media';
import poster from './assets/poster.webp?url';

document.getElementById('stage')?.replaceChildren(createSkinnedPlayer(mediaHtml(), poster));
