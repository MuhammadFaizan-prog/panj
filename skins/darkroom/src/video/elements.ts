// Darkroom hardware. Two small custom elements wire the parts of the unit that have no stock Video.js control; every
// other control on the deck is a stock v10 element (play, mute, volume, captions, fullscreen, time, settings menu).
//
// <dr-deck>  publishes the volume as --dr-vol (the knob's pointer turns with it), runs the 1× / 1.5× push buttons
//            (aria-pressed and their LEDs follow the playback rate, whoever changed it), and lets the in-picture
//            fullscreen corner press the deck's fullscreen key.
// <dr-film>  the strip of 35 mm film under the monitor. The film runs through a fixed gate as the video plays
//            (--dr-shift, in reference pixels), so the loupe always rings the current frame. It is a real slider:
//            drag the film to scrub, click a frame to jump to it, arrows step 5 s, Page keys 30 s, Home / End.

const MEDIA = 'video, audio, mux-video, hls-video';

/** Reference geometry, in reference pixels of the 756 px wide unit. */
export const FILM = {
  /** film length that passes the gate over the whole video: four repeats of the five-frame tile */
  length: 717 * 4,
  /** where the reference sits: 00:47 of 03:20 */
  refProgress: 47 / 200,
  /** the loupe's centre, from the unit's left edge */
  gate: 381,
  unit: 756,
};

type Media = HTMLMediaElement;

function findMedia(container: Element | null): Media | null {
  return (container?.querySelector(MEDIA) as Media | null) ?? null;
}

/** Stops a tap on the hardware from reaching the container's play/pause gesture. */
function shieldGestures(el: HTMLElement, signal: AbortSignal) {
  el.addEventListener('pointerup', (e) => e.stopPropagation(), { signal });
  el.addEventListener('click', (e) => {
    if (e.target === el) e.stopPropagation();
  }, { signal });
}

class DarkroomDeckElement extends HTMLElement {
  #abort: AbortController | null = null;

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const { signal } = this.#abort;
    shieldGestures(this, signal);

    const sync = () => {
      const media = findMedia(container);
      if (!media) return;
      this.style.setProperty('--dr-vol', String(Number.isFinite(media.volume) ? media.volume : 1));
      this.toggleAttribute('data-muted', media.muted || media.volume === 0);
      const rate = media.playbackRate;
      for (const btn of this.querySelectorAll<HTMLButtonElement>('button[data-rate]')) {
        btn.setAttribute('aria-pressed', String(Math.abs(Number(btn.dataset.rate) - rate) < 0.001));
      }
    };

    // media events do not bubble; a capturing listener on the container still sees them
    for (const type of ['volumechange', 'ratechange', 'loadedmetadata', 'emptied']) {
      container.addEventListener(type, sync, { capture: true, signal });
    }

    this.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-rate]');
      const media = findMedia(container);
      if (!btn || !media) return;
      media.playbackRate = Number(btn.dataset.rate);
    }, { signal });

    // the corner glyph in the picture presses the deck's fullscreen key
    container.addEventListener('click', (e) => {
      const proxy = (e.target as Element).closest('[data-dr-fullscreen]');
      if (!proxy) return;
      container.querySelector<HTMLElement>('media-fullscreen-button')?.click();
    }, { signal });
    const fsLabel = () => {
      const on = !!document.fullscreenElement && container.contains(document.fullscreenElement) || document.fullscreenElement === container;
      for (const el of container.querySelectorAll('[data-dr-fullscreen]')) el.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Enter fullscreen');
    };
    document.addEventListener('fullscreenchange', fsLabel, { signal });

    // the unit's clocks read MM:SS, as the reference does ("00:47 / 03:20"); Video.js drops the leading zero of
    // short durations, so a one-digit minute gets a CSS zero in front (the accessible label is untouched)
    const pad = () => {
      for (const t of container.querySelectorAll('media-time')) {
        t.toggleAttribute('data-dr-pad', /^\d:\d\d$/.test((t.textContent ?? '').trim()));
      }
    };
    const observer = new MutationObserver(pad);
    for (const group of container.querySelectorAll('media-time-group')) {
      observer.observe(group, { subtree: true, childList: true, characterData: true });
    }
    signal.addEventListener('abort', () => observer.disconnect());
    pad();

    sync();
    queueMicrotask(sync);
  }

  disconnectedCallback() {
    this.#abort?.abort();
    this.#abort = null;
  }
}

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(Number.isFinite(s) ? s : 0));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

class DarkroomFilmElement extends HTMLElement {
  #abort: AbortController | null = null;
  #raf = 0;

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const { signal } = this.#abort;
    shieldGestures(this, signal);
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;

    const media = () => findMedia(container);
    /** reference pixels per CSS pixel */
    const scale = () => FILM.unit / Math.max(1, this.getBoundingClientRect().width);

    const paint = () => {
      const m = media();
      const d = m && Number.isFinite(m.duration) && m.duration > 0 ? m.duration : 0;
      const t = m ? m.currentTime : 0;
      const p = d ? t / d : 0;
      this.style.setProperty('--dr-shift', String(((d ? p : FILM.refProgress) - FILM.refProgress) * FILM.length));
      this.setAttribute('aria-valuemax', String(Math.round(d)));
      this.setAttribute('aria-valuenow', String(Math.round(t)));
      this.setAttribute('aria-valuetext', `${fmt(t)} of ${fmt(d)}`);
    };

    const loop = () => {
      paint();
      const m = media();
      this.#raf = m && !m.paused && !m.ended ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!this.#raf) this.#raf = requestAnimationFrame(loop);
    };
    for (const type of ['timeupdate', 'durationchange', 'loadedmetadata', 'seeking', 'seeked', 'emptied']) {
      container.addEventListener(type, paint, { capture: true, signal });
    }
    container.addEventListener('play', kick, { capture: true, signal });
    container.addEventListener('playing', kick, { capture: true, signal });

    const seekTo = (t: number) => {
      const m = media();
      if (!m || !Number.isFinite(m.duration) || m.duration <= 0) return;
      m.currentTime = Math.min(m.duration, Math.max(0, t));
      paint();
    };

    // drag the film to scrub; a click without a drag jumps to the frame under the pointer
    let drag: { id: number; x0: number; t0: number; moved: boolean } | null = null;
    this.addEventListener('pointerdown', (e) => {
      const m = media();
      if (!m || e.button !== 0) return;
      drag = { id: e.pointerId, x0: e.clientX, t0: m.currentTime, moved: false };
      this.setPointerCapture(e.pointerId);
      this.setAttribute('data-dragging', '');
    }, { signal });
    this.addEventListener('pointermove', (e) => {
      const m = media();
      if (!drag || e.pointerId !== drag.id || !m) return;
      const dx = (e.clientX - drag.x0) * scale();
      if (Math.abs(dx) > 3) drag.moved = true;
      if (drag.moved) seekTo(drag.t0 - (dx / FILM.length) * m.duration);
    }, { signal });
    const end = (e: PointerEvent) => {
      const m = media();
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved && m && e.type === 'pointerup') {
        const r = this.getBoundingClientRect();
        const x = (e.clientX - r.left) * scale();
        seekTo(m.currentTime + ((x - FILM.gate) / FILM.length) * m.duration);
      }
      drag = null;
      this.removeAttribute('data-dragging');
    };
    this.addEventListener('pointerup', end, { signal });
    this.addEventListener('pointercancel', end, { signal });

    this.addEventListener('keydown', (e) => {
      const m = media();
      if (!m) return;
      const step: Record<string, number> = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 };
      let handled = true;
      if (e.key in step) seekTo(m.currentTime + step[e.key]);
      else if (e.key === 'Home') seekTo(0);
      else if (e.key === 'End') seekTo(m.duration);
      else handled = false;
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { signal });

    paint();
    queueMicrotask(paint);
  }

  disconnectedCallback() {
    this.#abort?.abort();
    this.#abort = null;
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }
}

if (!customElements.get('dr-deck')) customElements.define('dr-deck', DarkroomDeckElement);
if (!customElements.get('dr-film')) customElements.define('dr-film', DarkroomFilmElement);

export {};
