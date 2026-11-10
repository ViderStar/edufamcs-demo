/* Handbook article: highlight the current heading in the right-hand table of contents (scroll spy). */
(function () {
  'use strict';
  var links = document.querySelectorAll('.hb-toc > a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  var heads = [];
  links.forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var h = document.getElementById(id);
    if (h) { byId[id] = a; heads.push(h); }
  });
  if (!heads.length) return;
  var visible = {};
  function update() {
    var current = null;
    for (var i = 0; i < heads.length; i++) {
      if (visible[heads[i].id]) { current = heads[i].id; break; }
    }
    if (!current) {
      // nothing in view: the last heading above the viewport top wins
      for (var j = heads.length - 1; j >= 0; j--) {
        if (heads[j].getBoundingClientRect().top < 120) { current = heads[j].id; break; }
      }
    }
    links.forEach(function (a) { a.classList.remove('on'); });
    if (current && byId[current]) byId[current].classList.add('on');
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    update();
  }, { rootMargin: '-80px 0px -60% 0px' });
  heads.forEach(function (h) { io.observe(h); });
  // close the mobile TOC after a jump
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.hb-mtoc a');
    if (a) a.closest('details').removeAttribute('open');
  });
})();

/* Reading progress: how far the article text has scrolled past the top of the viewport. */
(function () {
  'use strict';
  var bar = document.querySelector('.hb-readbar');
  var prose = document.querySelector('.hb-main .prose');
  if (!bar || !prose) return;
  var ticking = false;
  function update() {
    ticking = false;
    var r = prose.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.6;
    var done = Math.min(Math.max(-r.top + 80, 0), Math.max(total, 1));
    bar.style.setProperty('--v', (total > 0 ? (100 * done / total) : 100).toFixed(1) + '%');
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
