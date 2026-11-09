"use strict";

(() => {
  const stay = window.AureliaStay;
  if (!stay) return;
  let validityTimer;
  const render = () => {
    clearTimeout(validityTimer);
    const selection = stay.read();
    if (!selection) {
      document.documentElement.removeAttribute("data-checkout-ready");
      stay.redirect();
      return;
    }
    const result = stay.validate(selection);
    if (!result.valid) {
      document.documentElement.removeAttribute("data-checkout-ready");
      stay.redirect();
      return;
    }
    const { suite, nights } = result;
    const photoNames = { 'ocean-terrace': 'ocean-suite', 'private-pool': 'pool-suite', 'signature-residence': 'residence' };
    const photo = document.querySelector('.summary-photo img');
    if (photo) {
      const name = photoNames[selection.suiteId];
      photo.srcset = `assets/images/${name}-640.webp 640w, assets/images/${name}-1280.webp 1280w`;
      photo.src = `assets/images/${name}-1280.webp`;
      photo.alt = `Fotografia ilustrativa da categoria ${suite.name}`;
    }
    const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" });
    const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
    const guests = `${selection.adults} ${selection.adults === 1 ? "adulto" : "adultos"}` +
      (selection.children ? ` e ${selection.children} ${selection.children === 1 ? "criança" : "crianças"}` : "; sem crianças");
    const values = {
      suite: suite.name, arrival: date.format(stay.parseDate(selection.arrival)),
      departure: date.format(stay.parseDate(selection.departure)), guests,
      nights: `${nights} ${nights === 1 ? "diária" : "diárias"}`,
      rate: money.format(suite.rate), subtotal: money.format(suite.rate * nights)
    };
    for (const [key, value] of Object.entries(values)) {
      document.getElementById(`summary-${key}`).textContent = value;
    }
    document.documentElement.dataset.checkoutReady = "true";
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const deadline = Math.min(midnight.getTime(), selection.selectedAt + 86400000);
    validityTimer = setTimeout(render, Math.max(0, deadline - Date.now()) + 1);
  };
  render();
  // Revalida também quando o navegador recupera a página pelo histórico.
  window.addEventListener("pageshow", render);
  window.addEventListener("pagehide", () => clearTimeout(validityTimer));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") render();
  });
})();
