/* Runs in <head> before paint. The theme follows the system; the old manual switch is gone, so drop its saved choice. */
(function () {
  try { localStorage.removeItem('mlf-theme'); } catch (e) {}
})();
