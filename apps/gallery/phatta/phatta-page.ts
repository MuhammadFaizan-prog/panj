// /phatta page chrome: the day/night toggle.
// Starts from the visitor's prefers-color-scheme (set before first paint by the inline script in index.html),
// follows later scheme changes until the visitor picks a mode themselves.

type Mode = 'day' | 'night';

export function initModeToggle(): void {
  const root = document.documentElement;
  const button = document.querySelector<HTMLButtonElement>('.ph-mode');
  if (!button) return;

  const scheme = globalThis.matchMedia?.('(prefers-color-scheme: light)');
  let chosen = false;

  const apply = (mode: Mode) => {
    root.dataset.mode = mode;
    button.setAttribute('aria-pressed', String(mode === 'day'));
  };

  apply(root.dataset.mode === 'day' ? 'day' : 'night');

  button.addEventListener('click', () => {
    chosen = true;
    apply(root.dataset.mode === 'day' ? 'night' : 'day');
  });

  scheme?.addEventListener('change', (event) => {
    if (!chosen) apply(event.matches ? 'day' : 'night');
  });
}
