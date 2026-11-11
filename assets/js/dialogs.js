"use strict";

(() => {
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-credits-link], [data-experience-dialog]");
    if (trigger) {
      const id = trigger.dataset.experienceDialog || "photography-credits";
      const dialog = document.getElementById(id);
      if (!dialog) return;
      event.preventDefault();
      if (!dialog.open) dialog.showModal();
      return;
    }
    const close = event.target.closest(".credits-close, .experience-dialog-close");
    if (close) {
      close.closest("dialog")?.close();
      return;
    }
    const dialog = event.target;
    if (!dialog.matches("dialog.credits-dialog, dialog.experience-dialog")) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
