"use strict";

document.querySelectorAll("[data-experience-dialog]").forEach(button => {
  const dialog = document.getElementById(button.dataset.experienceDialog);
  button.addEventListener("click", () => dialog.showModal());
  dialog.querySelector(".experience-dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
