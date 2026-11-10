// Jaali hardware. Two small custom elements wire the parts of the carved unit that have no stock Video.js control;
// every other control is a stock v10 element (time slider, play, ±10 s seek, mute, volume, captions, fullscreen,
// time, settings menu).
//
// <jl-beads> the row of 27 star beads over the time slider. Beads behind the playhead are lit gold, the bead the
//            playhead is moving into carries the light streak, the rest stay recessed. It follows the slider's own
//            fill (or its pointer while dragging), so keyboard, drag and playback all light the same beads.
// <jl-deck>  the carved deck: previous / next jump between chapters when the media has a chapters track, otherwise
//            to the start and the end; it mirrors mute onto the volume stud, pads MM:SS clocks, and keeps taps on the
//            hardware from reaching the container's play/pause gesture.

const MEDIA = 'video, audio, mux-video, hls-video';

/** Reference geometry, in card pixels (reference pixel minus the card origin 173, 65). */
export const JAALI = {
  unit: 1030,
  /** bead centres */
  beads: [39, 74, 109, 145, 181, 216, 251, 287, 323, 358, 393, 429, 465, 501, 537, 574, 612,
    649, 687, 725, 763, 800, 838, 876, 914, 952, 989],
  /** the slider's run: the playhead dot rides x0..x1 */
  x0: 19,
  x1: 1008,
  /** a bead counts as passed once the dot is this close to its centre */
  reach: 4,
};

type Media = HTMLMediaElement;

function findMedia(container: Element | null): Media | null {
  return (container?.querySelector(MEDIA) as Media | null) ?? null;
}

/** Stops a tap on the hardware from reaching the container's play/pause gesture. */
function shieldGestures(el: HTMLElement, signal: AbortSignal) {
  // controls are already ignored by the gesture; only the carved surface between them needs shielding
  el.addEventListener('pointerup', (e) => {
    if (!(e.target as Element).closest('button, [role="button"], [role="slider"], media-menu')) e.stopPropagation();
  }, { signal });
}

class JaaliBeadsElement extends HTMLElement {
  #abort: AbortController | null = null;
  #raf = 0;
  #last = '';

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const { signal } = this.#abort;

    if (!this.childElementCount) {
      const frag = document.createDocumentFragment();
      JAALI.beads.forEach((cx, i) => {
        const b = document.createElement('span');
        b.className = 'jl-bead';
        b.style.setProperty('--i', String(i));
        b.style.setProperty('--cx', String(cx));
        frag.append(b);
      });
      const flare = document.createElement('span');
      flare.className = 'jl-flare';
      frag.append(flare);
      this.append(frag);
    }
    const beads = [...this.querySelectorAll<HTMLElement>('.jl-bead')];
    const flare = this.querySelector<HTMLElement>('.jl-flare')!;
    const slider = () => container.querySelector<HTMLElement>('media-time-slider');

    const progress = (): number => {
      const s = slider();
      if (s) {
        const name = s.hasAttribute('data-dragging') ? '--media-slider-pointer' : '--media-slider-fill';
        const raw = s.style.getPropertyValue(name) || getComputedStyle(s).getPropertyValue(name);
        const v = parseFloat(raw);
        if (Number.isFinite(v)) return Math.min(1, Math.max(0, v / 100));
      }
      const m = findMedia(container);
      return m && Number.isFinite(m.duration) && m.duration > 0 ? m.currentTime / m.duration : 0;
    };

    const paint = () => {
      const dot = JAALI.x0 + progress() * (JAALI.x1 - JAALI.x0);
      let head = -1;
      const states = beads.map((_, i) => {
        if (JAALI.beads[i] <= dot + JAALI.reach) return 'lit';
        if (head < 0) {
          head = i;
          return 'head';
        }
        return 'off';
      });
      const key = states.join();
      if (key === this.#last) return;
      this.#last = key;
      states.forEach((s, i) => {
        if (beads[i].dataset.s !== s) beads[i].dataset.s = s;
      });
      if (head < 0) flare.hidden = true;
      else {
        flare.hidden = false;
        flare.style.setProperty('--cx', String(JAALI.beads[head]));
      }
    };

    const loop = () => {
      paint();
      const m = findMedia(container);
      const s = slider();
      const busy = (m && !m.paused && !m.ended) || s?.hasAttribute('data-dragging');
      this.#raf = busy ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!this.#raf) this.#raf = requestAnimationFrame(loop);
    };
    for (const type of ['timeupdate', 'durationchange', 'loadedmetadata', 'seeking', 'seeked', 'emptied', 'play', 'playing']) {
      container.addEventListener(type, kick, { capture: true, signal });
    }
    const observer = new MutationObserver(kick);
    const watch = () => {
      const s = slider();
      if (s) observer.observe(s, { attributes: true, attributeFilter: ['style', 'data-dragging', 'aria-valuenow'] });
    };
    watch();
    queueMicrotask(watch);
    signal.addEventListener('abort', () => observer.disconnect());
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

class JaaliDeckElement extends HTMLElement {
  #abort: AbortController | null = null;

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const { signal } = this.#abort;
    shieldGestures(this, signal);
    // the lattice lifts off the picture on the first play and stays off (paused too) until the source changes;
    // jaali.css keys the fade on this attribute
    const played = () => container.setAttribute('data-jl-played', '');
    container.addEventListener('play', played, { capture: true, signal });
    container.addEventListener('playing', played, { capture: true, signal });
    container.addEventListener('emptied', () => container.removeAttribute('data-jl-played'), { capture: true, signal });
    const m0 = findMedia(container);
    if (m0 && !m0.paused) played();
    const strip = container.querySelector<HTMLElement>('.jl-strip');
    if (strip) shieldGestures(strip, signal);
    const seek = container.querySelector<HTMLElement>('media-time-slider');
    if (seek) shieldGestures(seek, signal);

    /** chapter starts from a chapters track, if the media has one */
    const chapterStarts = (m: Media): number[] => {
      for (const track of Array.from(m.textTracks ?? [])) {
        if (track.kind !== 'chapters') continue;
        if (track.mode === 'disabled') track.mode = 'hidden';
        const cues = Array.from(track.cues ?? []);
        if (cues.length) return [...new Set([0, ...cues.map((c) => c.startTime)])].sort((a, b) => a - b);
      }
      return [];
    };

    const label = () => {
      const m = findMedia(container);
      const has = !!m && chapterStarts(m).length > 1;
      this.querySelector('[data-jl-skip="prev"]')?.setAttribute('aria-label', has ? 'Previous chapter' : 'Back to start');
      this.querySelector('[data-jl-skip="next"]')?.setAttribute('aria-label', has ? 'Next chapter' : 'Skip to end');
    };

    const skip = (dir: 'prev' | 'next') => {
      const m = findMedia(container);
      if (!m || !Number.isFinite(m.duration) || m.duration <= 0) return;
      const t = m.currentTime;
      const starts = chapterStarts(m);
      if (dir === 'prev') {
        if (starts.length > 1) {
          const cur = starts.filter((s) => s <= t + 0.01).pop() ?? 0;
          // a few seconds into a chapter, prev returns to its start; right at the start it goes one back
          const before = starts.filter((s) => s < cur).pop() ?? 0;
          m.currentTime = t - cur > 2 ? cur : before;
        } else {
          m.currentTime = 0;
        }
      } else {
        const next = starts.find((s) => s > t + 0.5);
        m.currentTime = next ?? m.duration;
      }
    };

    this.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLElement>('[data-jl-skip]');
      if (btn) skip(btn.dataset.jlSkip as 'prev' | 'next');
    }, { signal });

    const sync = () => {
      const m = findMedia(container);
      if (!m) return;
      this.toggleAttribute('data-muted', m.muted || m.volume === 0);
      label();
    };
    for (const type of ['volumechange', 'loadedmetadata', 'durationchange', 'emptied']) {
      container.addEventListener(type, sync, { capture: true, signal });
    }
    container.addEventListener('load', label, { capture: true, signal }); // a <track> finished loading

    // the strip reads MM:SS, as the reference does ("00:00 / 10:45"); Video.js drops the leading zero of short
    // durations, so a one-digit minute gets a CSS zero in front (the accessible label is untouched)
    const pad = () => {
      for (const t of container.querySelectorAll('media-time')) {
        const text = (t.textContent ?? '').replace(/[^\d:]/g, '');
        t.toggleAttribute('data-jl-pad', /^\d:\d\d$/.test(text));
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

if (!customElements.get('jl-beads')) customElements.define('jl-beads', JaaliBeadsElement);
if (!customElements.get('jl-deck')) customElements.define('jl-deck', JaaliDeckElement);

export {};
