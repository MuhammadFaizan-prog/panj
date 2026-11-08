// Two tiny helper elements for the Glass markup. Neither re-implements player behaviour:
// <glass-rate> mirrors the playback rate as the speed/settings trigger's face ("1x", "1.5x");
// <glass-clock> pads the minutes of the v10 <media-time> text it wraps ("02:48 / 06:15").

const formatRate = (rate: number) => `${Number.isFinite(rate) ? Number(rate.toFixed(2)) : 1}x`;

class GlassRateElement extends HTMLElement {
  #abort: AbortController | null = null;

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const media = () => container.querySelector<HTMLMediaElement>('video, audio, mux-video, hls-video');
    const sync = (rate?: number) => {
      const next = formatRate(rate ?? media()?.playbackRate ?? 1);
      if (this.textContent !== next) this.textContent = next;
    };
    // `ratechange` does not bubble; a capturing listener on the container still sees it.
    container.addEventListener('ratechange', (event) => sync((event.target as HTMLMediaElement | null)?.playbackRate), {
      capture: true,
      signal: this.#abort.signal,
    });
    sync();
  }

  disconnectedCallback() {
    this.#abort?.abort();
    this.#abort = null;
  }
}

const pad = (text: string) => text.replace(/^(-?)(\d):(\d\d)$/, (_m, sign: string, m: string, s: string) => `${sign}0${m}:${s}`);

class GlassClockElement extends HTMLElement {
  #observer: MutationObserver | null = null;

  connectedCallback() {
    const fix = () => {
      const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const value = (node.nodeValue ?? '').trim();
        const next = pad(value);
        if (next !== value) node.nodeValue = next;
      }
    };
    this.#observer = new MutationObserver(fix);
    this.#observer.observe(this, { subtree: true, childList: true, characterData: true });
    fix();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }
}

if (!customElements.get('glass-rate')) customElements.define('glass-rate', GlassRateElement);
if (!customElements.get('glass-clock')) customElements.define('glass-clock', GlassClockElement);
