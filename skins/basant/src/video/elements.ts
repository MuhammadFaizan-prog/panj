// Two tiny helper elements for the Basant markup. Neither re-implements player behaviour:
// <basant-rate> mirrors the playback rate as the speed/settings trigger's face ("1x", "1.5x");
// <basant-clock> pads the minutes of the v10 <media-time> text it wraps ("03:12 / 09:45").

const formatRate = (rate: number) => `${Number.isFinite(rate) ? Number(rate.toFixed(2)) : 1}x`;

class BasantRateElement extends HTMLElement {
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

class BasantClockElement extends HTMLElement {
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

if (!customElements.get('basant-rate')) customElements.define('basant-rate', BasantRateElement);
if (!customElements.get('basant-clock')) customElements.define('basant-clock', BasantClockElement);
