"use strict";

// Seleção demonstrativa da estadia. Nenhum dado pessoal ou pagamento é armazenado.
(() => {
  const storageKey = "aurelia.stay.v1";
  const suites = Object.freeze({
    "ocean-terrace": { name: "Suíte Terraço do Mar", capacity: 2, rate: 850 },
    "private-pool": { name: "Suíte Piscina Privativa", capacity: 3, rate: 1250 },
    "signature-residence": { name: "Residência Exclusiva Aurelia", capacity: 4, rate: 2400 }
  });
  const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };
  const parseDate = value => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day ? date : null;
  };
  const validate = selection => {
    const error = (field, message) => ({ valid: false, field, message });
    if (!selection || typeof selection !== "object" || Array.isArray(selection) || selection.version !== 1) {
      return error("suite", "Selecione sua estadia para continuar.");
    }
    if (typeof selection.suiteId !== "string" || !Object.prototype.hasOwnProperty.call(suites, selection.suiteId)) {
      return error("suite", "Escolha uma das suítes da coleção.");
    }
    const arrival = parseDate(selection.arrival);
    const departure = parseDate(selection.departure);
    if (!arrival) return error("arrival", "Informe uma data de entrada válida.");
    if (selection.arrival < today()) return error("arrival", "A data de entrada deve ser hoje ou uma data futura.");
    if (!departure) return error("departure", "Informe uma data de saída válida.");
    if (departure <= arrival) return error("departure", "A data de saída deve ser posterior à data de entrada.");
    if (!Number.isInteger(selection.adults) || selection.adults < 1 || selection.adults > 4) {
      return error("adults", "Selecione de 1 a 4 adultos para a estadia.");
    }
    const suite = suites[selection.suiteId];
    if (selection.adults > suite.capacity) {
      return error("adults", `${suite.name} acomoda até ${suite.capacity} hóspedes no total.`);
    }
    const maximumChildren = suite.capacity - selection.adults;
    if (!Number.isInteger(selection.children) || selection.children < 0 || selection.children > maximumChildren) {
      return error("children", `A quantidade de crianças deve estar entre 0 e ${maximumChildren} para esta ocupação.`);
    }
    if (!Number.isFinite(selection.selectedAt) || selection.selectedAt > Date.now() ||
        Date.now() - selection.selectedAt >= 24 * 60 * 60 * 1000) {
      return error("suite", "Sua seleção expirou. Preencha novamente os detalhes da estadia.");
    }
    return { valid: true, suite, nights: Math.round((departure - arrival) / 86400000) };
  };
  const clear = () => {
    try { sessionStorage.removeItem(storageKey); } catch { /* Armazenamento indisponível. */ }
  };
  const read = () => {
    try {
      const selection = JSON.parse(sessionStorage.getItem(storageKey));
      if (validate(selection).valid) return selection;
      clear();
    } catch { clear(); }
    return null;
  };
  const save = selection => {
    if (!validate(selection).valid) return false;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(selection));
      return read() !== null;
    } catch { return false; }
  };
  let redirecting = false;
  const redirect = () => {
    if (redirecting) return;
    redirecting = true;
    window.location.replace(new URL("reservations.html?motivo=selecao", window.location.href).href);
  };
  window.AureliaStay = Object.freeze({ suites, today, parseDate, validate, read, save, clear, redirect });

  // Executado no cabeçalho do checkout, antes de revelar o conteúdo da página.
  if (document.documentElement.dataset.checkoutGuard === "true") {
    if (!read()) redirect();
  }
})();
