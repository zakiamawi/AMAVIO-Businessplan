(function () {
  "use strict";

  function openPage(page) {
    document.querySelector(`.main-nav [data-page-target="${page}"]`)?.click();
  }

  document.querySelector("[data-learning-go-quality]")?.addEventListener("click", () => openPage("learning-quality"));
  document.querySelector("[data-learning-go-feedback]")?.addEventListener("click", () => openPage("learning"));
}());
