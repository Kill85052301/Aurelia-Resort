"use strict";

(() => {
  const dialog = document.getElementById("photography-credits");
  if (!dialog) return;
  document.querySelectorAll("[data-credits-link]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      dialog.showModal();
    });
  });
  dialog.querySelector(".credits-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
