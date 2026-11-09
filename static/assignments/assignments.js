/* assignments: show the chosen file name in the dropzone and pre-check its size (server re-validates). */
(function () {
  function bind(root) {
    root.querySelectorAll("[data-drop]").forEach(function (zone) {
      if (zone.dataset.bound) return;
      zone.dataset.bound = "1";
      var input = zone.querySelector("input[type=file]");
      var name = zone.querySelector("[data-drop-name]");
      if (!input || !name) return;
      var initial = name.textContent;
      input.addEventListener("change", function () {
        var f = input.files && input.files[0];
        var maxMb = parseInt(input.dataset.max || "20", 10);
        zone.classList.remove("has-file");
        if (!f) { name.textContent = initial; return; }
        if (f.size > maxMb * 1024 * 1024) {
          input.value = "";
          name.textContent = "Файл больше " + maxMb + " МБ";
          return;
        }
        name.textContent = f.name;
        zone.classList.add("has-file");
      });
    });
  }
  document.addEventListener("DOMContentLoaded", function () { bind(document); });
})();
