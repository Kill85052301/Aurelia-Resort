"use strict";
(() => {
 const root = document.documentElement;
 const reveal = () => root.removeAttribute('data-motion-pending');
 window.AureliaMotionBoot = { reveal, expired: false };
 if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.visibilityState !== 'hidden') {
  root.setAttribute('data-motion-pending', 'true');
  // A página permanece utilizável mesmo se algum arquivo de animação falhar.
  const fallback = setTimeout(() => { window.AureliaMotionBoot.expired = true; reveal(); }, 1200);
  window.AureliaMotionBoot.reveal = () => { clearTimeout(fallback); reveal(); };
 }
})();
