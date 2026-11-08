// Ink & Reed gallery page: the right-to-left demo toggle. It only sets `dir` on the stage; the skin does the rest.
const toggle = document.getElementById('rtl-toggle');
const stage = document.getElementById('stage');

if (toggle && stage) {
  toggle.addEventListener('click', () => {
    const rtl = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(rtl));
    if (rtl) stage.setAttribute('dir', 'rtl');
    else stage.removeAttribute('dir');
  });
}
