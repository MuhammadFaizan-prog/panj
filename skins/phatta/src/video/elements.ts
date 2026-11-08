// Two tiny helper elements for the Phatta markup. Neither re-implements player behaviour:
// <phatta-rate> only mirrors the playback rate as the speed button's painted "1×" label, and
// <phatta-volume> only picks how the v10 volume popover is laid out for the current pointer.

const formatRate = (rate: number) => `${Number.isFinite(rate) ? Number(rate.toFixed(2)) : 1}×`;

/** Shows the media's current playback rate ("1×", "1.5×") as the speed/settings trigger's face. */
class PhattaRateElement extends HTMLElement {
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
    container.addEventListener(
      'ratechange',
      (event) => sync((event.target as HTMLMediaElement | null)?.playbackRate),
      { capture: true, signal: this.#abort.signal },
    );
    sync();
  }

  disconnectedCallback() {
    this.#abort?.abort();
    this.#abort = null;
  }
}

/**
 * Wraps the mute button and its volume popover.
 * Fine pointers keep the v10 hover/focus popover (vertical brass slider; Tab from mute reaches it).
 * Touch screens never hover, so the popover would never open there: on `(hover: none)` the slider turns
 * horizontal and CSS shows it inline beside the mute button, so volume is usable by touch and by Tab.
 */
class PhattaVolumeElement extends HTMLElement {
  #query: MediaQueryList | null = null;
  #onChange = () => this.#apply();

  connectedCallback() {
    this.#query = globalThis.matchMedia?.('(hover: none)') ?? null;
    this.#query?.addEventListener('change', this.#onChange);
    this.#apply();
    // When streamed by the HTML parser the slider may not exist yet.
    queueMicrotask(() => this.#apply());
  }

  disconnectedCallback() {
    this.#query?.removeEventListener('change', this.#onChange);
    this.#query = null;
  }

  #apply() {
    const inline = this.#query?.matches ?? false;
    this.toggleAttribute('data-inline', inline);
    const slider = this.querySelector('media-volume-slider') as (HTMLElement & { orientation?: string }) | null;
    if (!slider) return;
    const orientation = inline ? 'horizontal' : 'vertical';
    slider.setAttribute('orientation', orientation);
    slider.orientation = orientation;
  }
}

export function definePhattaElements(): void {
  const registry = globalThis.customElements;
  if (!registry) return;
  if (!registry.get('phatta-rate')) registry.define('phatta-rate', PhattaRateElement);
  if (!registry.get('phatta-volume')) registry.define('phatta-volume', PhattaVolumeElement);
}
