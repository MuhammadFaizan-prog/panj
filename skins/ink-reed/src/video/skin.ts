import '../styles/video/scaffold.css';
import './skin.css';
import '@panj/tokens/tokens.css';
import '@panj/tokens/essentials.css';
import '../tokens.css';
import './ink-reed.css';
import './ink-reed-ref.css';
import './elements';
import '@videojs/html/i18n';
import '@videojs/html/ui/container';
import '@videojs/html/ui/poster';
import '@videojs/html/ui/error-dialog';
import '@videojs/html/ui/dialog-backdrop';
import '@videojs/html/ui/dialog-popup';
import '@videojs/html/ui/dialog-title';
import '@videojs/html/ui/dialog-description';
import '@videojs/html/ui/dialog-close';
import '@videojs/html/ui/controls';
import '@videojs/html/ui/controls-backdrop';
import '@videojs/html/ui/controls-group';
import '@videojs/html/ui/buffering-indicator';
import '@videojs/html/ui/controls-content';
import '@videojs/html/ui/tooltip-group';
import '@videojs/html/ui/airplay-button';
import '@videojs/html/ui/tooltip';
import '@videojs/html/ui/tooltip-label';
import '@videojs/html/ui/tooltip-shortcut';
import '@videojs/html/ui/cast-button';
import '@videojs/html/ui/pip-button';
import '@videojs/html/ui/fullscreen-button';
import '@videojs/html/ui/seek-button';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/time-slider';
import '@videojs/html/ui/time-slider-chapters';
import '@videojs/html/ui/slider-track';
import '@videojs/html/ui/slider-buffer';
import '@videojs/html/ui/slider-fill';
import '@videojs/html/ui/slider-thumb';
import '@videojs/html/ui/slider-preview';
import '@videojs/html/ui/slider-thumbnail';
import '@videojs/html/ui/slider-value';
import '@videojs/html/ui/time-slider-chapter-title';
import '@videojs/html/ui/mute-button';
import '@videojs/html/ui/volume-popover';
import '@videojs/html/ui/volume-slider';
import '@videojs/html/ui/time-group';
import '@videojs/html/ui/time';
import '@videojs/html/ui/time-separator';
import '@videojs/html/ui/captions-button';
import '@videojs/html/ui/menu';
import '@videojs/html/ui/menu-content';
import '@videojs/html/ui/menu-item';
import '@videojs/html/ui/menu-separator';
import '@videojs/html/ui/quality-radio-group';
import '@videojs/html/ui/menu-radio-item';
import '@videojs/html/ui/menu-item-indicator';
import '@videojs/html/ui/audio-track-radio-group';
import '@videojs/html/ui/playback-rate-radio-group';
import '@videojs/html/ui/captions-radio-group';
import '@videojs/html/ui/hotkey';
import '@videojs/html/ui/gesture';
import '@videojs/html/ui/status-announcer';
import '@videojs/html/ui/volume-indicator';
import '@videojs/html/ui/volume-indicator-fill';
import '@videojs/html/ui/volume-indicator-value';
import '@videojs/html/ui/status-indicator';
import '@videojs/html/ui/status-indicator-value';
import '@videojs/html/ui/seek-indicator';
import '@videojs/html/ui/seek-indicator-value';
import { registerIcons } from '@videojs/html/icons';
import {
  captionsOffIcon as captionsOffIconScaffold,
  checkIcon as checkIconScaffold,
  chevronIcon as chevronIconScaffold,
  speechIcon as speechIconScaffold,
  speedIcon as speedIconScaffold,
  switchesIcon as switchesIconScaffold,
} from '@videojs/html/icons/scaffold';

import * as ink from './icons';

// Menu glyphs stay on the Scaffold set; every control on the bar uses the hand-drawn "ink" family.
registerIcons('scaffold', {
  'captions-off': captionsOffIconScaffold,
  check: checkIconScaffold,
  chevron: chevronIconScaffold,
  speech: speechIconScaffold,
  speed: speedIconScaffold,
  switches: switchesIconScaffold,
});

registerIcons('ink', {
  'airplay-enter': ink.airplayEnter,
  'airplay-exit': ink.airplayExit,
  'captions-off': ink.captionsOff,
  'captions-on': ink.captionsOn,
  'cast-enter': ink.castEnter,
  'cast-exit': ink.castExit,
  'fullscreen-enter': ink.fullscreenEnter,
  'fullscreen-exit': ink.fullscreenExit,
  pause: ink.pause,
  'pip-enter': ink.pipEnter,
  'pip-exit': ink.pipExit,
  play: ink.play,
  restart: ink.restart,
  settings: ink.settings,
  'skip-back': ink.skipBack,
  'skip-forward': ink.skipForward,
  spinner: ink.spinner,
  'volume-high': ink.volumeHigh,
  'volume-low': ink.volumeLow,
  'volume-off': ink.volumeOff,
});
