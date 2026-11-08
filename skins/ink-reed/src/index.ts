// Package entry for @panj/ink-reed, consumed by apps/gallery.
import '@videojs/html/video/player';
import './video/skin';
import { enhanceInkReed } from './behavior';
import template from './video/skin.html?raw';

export { enhanceInkReed };

export const SKIN_SLUG = 'ink-reed';
export const SKIN_NAME = "Ink & Reed";

const MEDIA_PLACEHOLDER = '<!-- Add a compatible media component here. -->';

/** Build a <video-player> wearing this skin, with `mediaHtml` (e.g. a <video> or <mux-video>) as its media. */
export function createSkinnedPlayer(mediaHtml: string, poster?: string): HTMLElement {
  const player = document.createElement('video-player');
  if (poster) player.setAttribute('poster', poster);
  player.innerHTML = template.replace(MEDIA_PLACEHOLDER, mediaHtml);
  enhanceInkReed(player);
  return player;
}
