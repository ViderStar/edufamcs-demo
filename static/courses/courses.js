/* Courses: lite video embeds (nothing is requested from YouTube/VK until the click)
   and ←/→ to move between steps of a lesson. No inline scripts (CSP). */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.vlite-btn');
    if (!btn) return;
    var box = btn.closest('.vlite');
    var src = box && box.getAttribute('data-embed');
    if (!src || !/^https:\/\/(www\.youtube-nocookie\.com|vkvideo\.ru)\//.test(src)) return;
    var f = document.createElement('iframe');
    f.src = src;
    f.title = box.getAttribute('data-title') || 'Видео';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    box.classList.remove('vlite');
    box.innerHTML = '';
    box.appendChild(f);
  });

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var link = document.querySelector(e.key === 'ArrowLeft' ? '[data-step-prev]' : '[data-step-next]');
    if (link && link.href) { window.location.href = link.href; }
    else if (link && link.form) { link.form.requestSubmit(link); }
  });
})();

/* outerHTML swaps (quiz form) detach the event target: re-run math on the whole page (cheap: only unrendered nodes). */
document.addEventListener('htmx:afterSettle', function () {
  if (window.MLF && window.MLF.renderMath) window.MLF.renderMath(document);
});
