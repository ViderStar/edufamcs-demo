/* EDU FAMCS platform — global behaviour (no inline scripts anywhere: CSP).
   - mobile menu (.menu-btn), user menu (<details class="user-menu">)
   - toasts auto-dismiss, copy buttons for .code blocks
   - KaTeX: lazy-loads vendor/katex and renders every .tex / .tex-block (also after htmx swaps)
   Feature JS goes to apps/<app>/static/<app>/<app>.js and is included via {% block page_js %}. */
(function () {
  'use strict';
  var root = document.documentElement;

  document.addEventListener('click', function (e) {
    var mb = e.target.closest('.menu-btn');
    if (mb) {
      var hdr = mb.closest('.hdr');
      var open = hdr.classList.toggle('open');
      mb.setAttribute('aria-expanded', open);
      return;
    }
    if (e.target.closest('.nav a')) {
      var h = document.querySelector('.hdr.open');
      if (h) h.classList.remove('open');
    }
    var x = e.target.closest('.toast .x');
    if (x) { dismiss(x.closest('.toast')); return; }
    var cp = e.target.closest('.code .copy');
    if (cp) { copyCode(cp); return; }
    document.querySelectorAll('details.user-menu[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details.user-menu[open]').forEach(function (d) { d.removeAttribute('open'); });
    var h = document.querySelector('.hdr.open');
    if (h) h.classList.remove('open');
  });

  function dismiss(t) {
    if (!t || t.classList.contains('is-leaving')) return;
    t.classList.add('is-leaving');
    setTimeout(function () { t.remove(); }, 220);
  }
  function armToasts(scope) {
    (scope || document).querySelectorAll('.toasts-region .toast:not([data-armed])').forEach(function (t) {
      t.setAttribute('data-armed', '1');
      if (!t.classList.contains('err')) setTimeout(function () { dismiss(t); }, 6000);
    });
  }

  function addCopyButtons(scope) {
    (scope || document).querySelectorAll('.code .code-head:not([data-copy])').forEach(function (h) {
      h.setAttribute('data-copy', '1');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'copy'; b.textContent = 'Копировать';
      h.appendChild(b);
    });
  }
  function copyCode(b) {
    var pre = b.closest('.code').querySelector('pre');
    if (!pre || !navigator.clipboard) return;
    navigator.clipboard.writeText(pre.innerText).then(function () {
      b.textContent = 'Скопировано';
      setTimeout(function () { b.textContent = 'Копировать'; }, 1600);
    });
  }

  /* KaTeX, loaded on demand */
  var katexPromise = null;
  function meta(name) { var m = document.querySelector('meta[name="' + name + '"]'); return m && m.content; }
  function loadKatex() {
    if (window.katex) return Promise.resolve();
    if (katexPromise) return katexPromise;
    katexPromise = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = meta('katex-css');
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = meta('katex-js'); s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    return katexPromise;
  }
  function renderMath(scope) {
    var nodes = (scope || document).querySelectorAll('.tex:not([data-rendered])');
    if (!nodes.length) return;
    // keep the TeX source before anything renders: several handlers (htmx settle, oob swap, page scripts) may call this
    // for the same node before KaTeX has loaded, and rendering twice would feed KaTeX its own output
    nodes.forEach(function (el) { if (!el.hasAttribute('data-tex')) el.setAttribute('data-tex', el.textContent); });
    loadKatex().then(function () {
      nodes.forEach(function (el) {
        if (el.hasAttribute('data-rendered')) return;
        try {
          window.katex.render(el.getAttribute('data-tex'), el, {
            displayMode: el.classList.contains('tex-block'),
            throwOnError: false, strict: 'ignore', output: 'htmlAndMathml'
          });
          el.setAttribute('data-rendered', '1');
        } catch (err) {}
      });
    }).catch(function () {});
  }

  function enhance(scope) { armToasts(scope); addCopyButtons(scope); renderMath(scope); }
  window.MLF = { enhance: enhance, renderMath: renderMath };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhance(); });
  else enhance();
  document.addEventListener('htmx:afterSettle', function (e) { enhance(e.target); });
  document.addEventListener('htmx:oobAfterSwap', function (e) { enhance(e.target); });
})();

// About: the history timeline scrolls sideways; the arrows move it by one year.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-tl-step]");
  if (!btn) return;
  const tl = document.querySelector(".ab-tl");
  const year = tl && tl.querySelector(".ab-year");
  if (!year) return;
  tl.scrollBy({ left: Number(btn.dataset.tlStep) * year.getBoundingClientRect().width, behavior: "smooth" });
});
