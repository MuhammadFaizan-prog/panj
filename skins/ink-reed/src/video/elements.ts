// <ink-rate> mirrors the playback rate as the speed/settings trigger's face ("1×", "1.5×"; the × is its own span). It does not
// re-implement player behaviour: the button still opens the stock v10 settings menu.

const formatRate = (rate: number) => `${Number.isFinite(rate) ? Number(rate.toFixed(2)) : 1}`;

class InkRateElement extends HTMLElement {
  #abort: AbortController | null = null;

  connectedCallback() {
    const container = this.closest('media-container');
    if (!container) return;
    this.#abort = new AbortController();
    const media = () => container.querySelector<HTMLMediaElement>('video, audio, mux-video, hls-video');
    const sync = (rate?: number) => {
      const next = formatRate(rate ?? media()?.playbackRate ?? 1);
      if (this.firstChild?.nodeValue === next && this.childNodes.length === 2) return;
      // the numerals, then a larger multiplication sign, as the reference sets it
      const x = document.createElement('span');
      x.className = 'ink-rate-x';
      x.textContent = '×';
      this.replaceChildren(document.createTextNode(next), x);
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

if (!customElements.get('ink-rate')) customElements.define('ink-rate', InkRateElement);

export {};
