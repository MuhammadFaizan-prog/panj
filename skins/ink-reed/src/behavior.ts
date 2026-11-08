// Ink & Reed behaviour shims. Small adapters around v10 elements; none re-implements player behaviour.
//
// 1. Right-to-left timeline. v10 sliders measure the pointer from the left edge and step up on ArrowRight, whatever
//    the writing direction. Under dir="rtl" this skin draws the stroke right to left (CSS scaleX(-1)), so input is
//    mirrored here to match what the eye sees: pointer x is reflected inside the slider box, ArrowLeft/ArrowRight swap.
// 2. Touch volume. The Scaffold's volume popover opens on hover only. On devices without hover the slider is shown
//    inline (CSS) and turned horizontal here so it can be dragged with a thumb.
// 3. Esc in the volume popover returns focus to the speaker button without reopening the popover.

const MIRRORED = Symbol('ink-reed-mirrored');
type Marked = Event & { [MIRRORED]?: true };

const POINTER_TYPES = ['pointerdown', 'pointermove', 'pointerup'] as const;

function isMirrored(slider: Element): boolean {
  const skin = slider.closest('.media-skin');
  if (skin?.getAttribute('data-ink-timeline') === 'ltr') return false;
  if (slider.localName === 'media-volume-slider' && slider.getAttribute('orientation') !== 'horizontal') return false;
  return getComputedStyle(slider).direction === 'rtl';
}

function mirrorPointer(slider: HTMLElement): void {
  const relay = (event: Event) => {
    const e = event as PointerEvent & Marked;
    if (e[MIRRORED] || !isMirrored(slider)) return;
    const rect = slider.getBoundingClientRect();
    const clientX = rect.left + rect.right - e.clientX;
    const clone = new PointerEvent(e.type, {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      isPrimary: e.isPrimary,
      width: e.width,
      height: e.height,
      pressure: e.pressure,
      tiltX: e.tiltX,
      tiltY: e.tiltY,
      button: e.button,
      buttons: e.buttons,
      clientX,
      clientY: e.clientY,
      screenX: e.screenX + (clientX - e.clientX),
      screenY: e.screenY,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    }) as PointerEvent & Marked;
    clone[MIRRORED] = true;
    e.stopImmediatePropagation();
    (e.target ?? slider).dispatchEvent(clone);
    if (clone.defaultPrevented) e.preventDefault();
  };
  for (const type of POINTER_TYPES) slider.addEventListener(type, relay, { capture: true });
}

function mirrorArrows(slider: HTMLElement): void {
  slider.addEventListener(
    'keydown',
    (event) => {
      const e = event as KeyboardEvent & Marked;
      if (e[MIRRORED] || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || !isMirrored(slider)) return;
      const key = e.key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
      const clone = new KeyboardEvent('keydown', {
        key,
        code: key,
        bubbles: true,
        cancelable: true,
        composed: true,
        repeat: e.repeat,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
      }) as KeyboardEvent & Marked;
      clone[MIRRORED] = true;
      e.stopImmediatePropagation();
      e.preventDefault();
      (e.target ?? slider).dispatchEvent(clone);
    },
    { capture: true },
  );
}

function touchVolume(root: HTMLElement): void {
  const slider = root.querySelector<HTMLElement>('.media-volume-slider');
  if (!slider || typeof matchMedia !== 'function') return;
  const noHover = matchMedia('(hover: none)');
  const apply = () => slider.setAttribute('orientation', noHover.matches ? 'horizontal' : 'vertical');
  apply();
  noHover.addEventListener('change', apply);
}

function escapeReturnsFocus(root: HTMLElement): void {
  const popover = root.querySelector<HTMLElement>('media-volume-popover');
  const mute = root.querySelector<HTMLElement>('media-mute-button');
  if (!popover || !mute) return;
  let quiet = false;
  popover.addEventListener('open-change', (event) => {
    const detail = (event as CustomEvent<{ open: boolean; reason?: string }>).detail;
    if (detail?.open || detail?.reason !== 'escape') return;
    if (!popover.contains(document.activeElement)) return;
    quiet = true;
    mute.focus();
    queueMicrotask(() => (quiet = false));
  });
  // The popover opens when its trigger gains focus; swallow that one focus so Esc really closes it.
  mute.parentElement?.addEventListener(
    'focusin',
    (event) => {
      if (quiet && event.target === mute) event.stopPropagation();
    },
    { capture: true },
  );
}

/** Wire the Ink & Reed shims onto one skinned player (idempotent per element). */
export function enhanceInkReed(player: HTMLElement): void {
  const root = player.querySelector<HTMLElement>('.media-skin[data-skin="ink-reed"]');
  if (!root || root.dataset.inkEnhanced) return;
  root.dataset.inkEnhanced = '';
  for (const slider of root.querySelectorAll<HTMLElement>('media-time-slider, media-volume-slider')) {
    mirrorPointer(slider);
    mirrorArrows(slider);
  }
  touchVolume(root);
  escapeReturnsFocus(root);
}
