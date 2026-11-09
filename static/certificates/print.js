// Print page: print button + fit the A4 sheet to narrow screens (screen only; print uses real size).
(function () {
  "use strict";
  var MM = 96 / 25.4;
  function fit() {
    var w = 297 * MM + 32;
    var k = Math.min(1, (window.innerWidth || w) / w);
    document.documentElement.style.setProperty("--fit", k.toFixed(4));
  }
  document.addEventListener("DOMContentLoaded", function () {
    fit();
    window.addEventListener("resize", fit);
    var btn = document.querySelector("[data-print]");
    if (btn) btn.addEventListener("click", function () { window.print(); });
  });
})();
