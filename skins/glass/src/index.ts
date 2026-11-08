// Package entry for @panj/glass, consumed by apps/gallery.
import '@videojs/html/video/player';
import './video/skin';
import { enhanceGlass } from './video/behaviour';
import template from './video/skin.html?raw';

export const SKIN_SLUG = 'glass';
export const SKIN_NAME = "Glass";

const MEDIA_PLACEHOLDER = '<!-- Add a compatible media component here. -->';

/** Build a <video-player> wearing this skin, with `mediaHtml` (e.g. a <video> or <mux-video>) as its media. */
export function createSkinnedPlayer(mediaHtml: string, poster?: string): HTMLElement {
  const player = document.createElement('video-player');
  if (poster) player.setAttribute('poster', poster);
  player.innerHTML = template.replace(MEDIA_PLACEHOLDER, mediaHtml);
  enhanceGlass(player);
  return player;
}
