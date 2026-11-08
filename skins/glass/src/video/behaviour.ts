// Glass: small interaction fixes layered on the v10 elements. No player behaviour is re-implemented;
// this only decides *when* the stock volume popover opens.
//
// The Scaffold's volume popover is `open-on-hover`. v10 opens it on focus only where the device has
// hover + a fine pointer, and never on touch, so:
//   • touch: the slider was unreachable (a tap on the speaker only muted);
//   • keyboard on a no-hover device (tablet + keyboard): Tab skipped the slider.
// Fix: on touch, the first tap on the speaker reveals the slider (the next tap mutes as usual);
// on keyboard focus without hover, focusing the speaker reveals the slider so Tab reaches it.
// The popover's own logic still closes it on Esc, outside tap and focus leaving.
// Esc from inside the popover hands focus back to the speaker (v10 leaves it on <body>), without
// letting that focus re-open the popover.

type Popover = HTMLElement & { open: boolean };

const canOpenOnFocusNatively = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

function popoverFor(root: HTMLElement, mute: Element): Popover | null {
  const id = mute.getAttribute('commandfor');
  if (!id) return null;
  const el = root.querySelector<Popover>(`#${CSS.escape(id)}`);
  return el && !el.hidden ? el : null;
}

const muteFrom = (target: EventTarget | null) =>
  target instanceof Element ? target.closest('media-mute-button') : null;

/** Wire the Glass interaction fixes onto a `<video-player>` (or any ancestor of the skin). */
export function enhanceGlass(root: HTMLElement): void {
  let returningFocus: Element | null = null;

  // A focus we hand back after Esc must not re-open the popover (v10 opens it on focus where hover exists).
  root.addEventListener(
    'focusin',
    (event) => {
      if (!returningFocus || event.target !== returningFocus) return;
      returningFocus = null;
      event.stopImmediatePropagation();
    },
    true,
  );

  // `open-change` does not bubble; capture still sees it on the way down.
  root.addEventListener(
    'open-change',
    (event) => {
      const popover = event.target;
      if (!(popover instanceof HTMLElement) || popover.localName !== 'media-volume-popover') return;
      const { open, reason } = (event as CustomEvent<{ open: boolean; reason?: string }>).detail ?? {};
      if (open || reason !== 'escape') return;
      const active = document.activeElement;
      if (active && active !== document.body && !popover.contains(active)) return;
      const trigger = root.querySelector<HTMLElement>(`[commandfor="${CSS.escape(popover.id)}"]`);
      if (!trigger) return;
      returningFocus = trigger;
      trigger.focus({ preventScroll: true });
      if (returningFocus === trigger) returningFocus = null;
    },
    true,
  );

  // Capture on the ancestor runs before the mute button's own click handler.
  root.addEventListener(
    'click',
    (event) => {
      const mute = muteFrom(event.target);
      if (!mute) return;
      const type = (event as PointerEvent).pointerType;
      if (type !== 'touch' && type !== 'pen') return;
      const popover = popoverFor(root, mute);
      if (!popover || popover.hasAttribute('data-open')) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      popover.open = true;
    },
    true,
  );

  root.addEventListener('focusin', (event) => {
    if (canOpenOnFocusNatively()) return;
    const mute = muteFrom(event.target);
    if (!mute || !mute.matches(':focus-visible')) return;
    const popover = popoverFor(root, mute);
    if (popover && !popover.hasAttribute('data-open')) popover.open = true;
  });
}
