"use strict";

(() => {
  const form = document.getElementById('reservation-form');
  const stay = window.AureliaStay;
  if (!form || !stay) return;

  const fields = Object.fromEntries(['suite', 'arrival', 'departure', 'adults', 'children']
    .map(id => [id, document.getElementById(id)]));
  const error = document.getElementById('reservation-error');
  const capacity = document.getElementById('suite-capacity');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' });
  const currentYear = Number(stay.today().slice(0, 4));
  const pickers = {};

  // Os controles são criados uma única vez. Apenas o seletor que recebeu uma
  // alteração pode atualizar seu próprio dia, mês, ano e valor ISO oculto.
  const createPicker = id => {
    const group = document.getElementById(`${id}-group`);
    const parts = Object.fromEntries(['day', 'month', 'year']
      .map(part => [part, document.getElementById(`${id}-${part}`)]));
    const help = document.getElementById(`${id}-help`);
    for (let day = 1; day <= 31; day++) parts.day.add(new Option(String(day).padStart(2, '0'), String(day)));
    months.forEach((month, index) => parts.month.add(new Option(month, String(index + 1))));
    for (let year = currentYear; year <= currentYear + 20; year++) parts.year.add(new Option(String(year), String(year)));
    // Listas sem placeholders: não presume uma data antes da escolha do visitante.
    for (const part of Object.values(parts)) part.selectedIndex = -1;

    const sync = () => {
      const today = stay.today();
      const minimum = id === 'arrival' ? today : new Date(
        stay.parseDate(fields.arrival.value >= today ? fields.arrival.value : today).getTime() + 86400000
      ).toISOString().slice(0, 10);
      const [minYear, minMonth, minDay] = minimum.split('-').map(Number);
      // Mantém o horizonte de anos atualizado mesmo com a aba aberta na virada do ano.
      const lastYear = Number(parts.year.options[parts.year.options.length - 1].value);
      for (let year = lastYear + 1; year <= minYear + 20; year++) {
        parts.year.add(new Option(String(year), String(year)));
      }
      const month = Number(parts.month.value);
      const year = Number(parts.year.value);
      for (const option of parts.year.options) {
        option.disabled = Boolean(option.value) && Number(option.value) < minYear;
        option.hidden = option.disabled;
      }
      const effectiveYear = year || minYear;
      for (const option of parts.month.options) {
        option.disabled = Boolean(option.value) && (effectiveYear < minYear ||
          (effectiveYear === minYear && Number(option.value) < minMonth));
        option.hidden = option.disabled;
      }
      // Sem ano definido, fevereiro oferece 29 dias; a escolha do ano decide
      // se o dia 29 continua disponível. Não há normalização silenciosa de datas.
      const maximum = month ? new Date(Date.UTC(year || 2000, month, 0)).getUTCDate() : 31;
      let removedDay = false;
      for (const option of parts.day.options) {
        const effectiveMonth = month || minMonth;
        option.disabled = Boolean(option.value) && (Number(option.value) > maximum ||
          effectiveYear < minYear || (effectiveYear === minYear &&
            (effectiveMonth < minMonth || (effectiveMonth === minMonth && Number(option.value) < minDay))));
        option.hidden = option.disabled;
      }
      if (Number(parts.day.value) > maximum) {
        parts.day.value = '';
        removedDay = true;
      }
      const complete = parts.day.value && parts.month.value && parts.year.value;
      const iso = complete ? `${parts.year.value}-${parts.month.value.padStart(2, '0')}-${parts.day.value.padStart(2, '0')}` : '';
      fields[id].value = stay.parseDate(iso) ? iso : '';
      return removedDay ? `O mês selecionado tem ${maximum} dias. Escolha outro dia.` : '';
    };
    const set = iso => {
      const date = stay.parseDate(iso);
      if (!date) return;
      const year = date.getUTCFullYear();
      if (!Array.from(parts.year.options).some(option => option.value === String(year))) {
        parts.year.add(new Option(String(year), String(year)));
      }
      parts.year.value = String(year);
      parts.month.value = String(date.getUTCMonth() + 1);
      parts.day.value = String(date.getUTCDate());
      sync();
    };
    const mark = message => {
      group.classList.toggle('has-date-error', Boolean(message));
      for (const part of Object.values(parts)) {
        if (message) part.setAttribute('aria-invalid', 'true');
        else part.removeAttribute('aria-invalid');
      }
      help.textContent = message || (fields[id].value
        ? dateFormat.format(stay.parseDate(fields[id].value)) : 'Escolha o dia, o mês e o ano.');
    };
    group.addEventListener('change', event => {
      if (!event.target.matches('[data-date-part]')) return;
      const message = sync();
      if (id === 'arrival') pickers.departure.sync();
      refreshDateFeedback();
      if (message) mark(message);
    });
    return { group, parts, sync, set, mark };
  };

  const refreshDateFeedback = () => {
    const arrival = fields.arrival.value;
    const departure = fields.departure.value;
    pickers.arrival.mark(arrival && arrival < stay.today()
      ? 'A entrada deve ser hoje ou uma data futura.' : '');
    pickers.departure.mark(departure && arrival && departure <= arrival
      ? 'A saída deve ser posterior à entrada. Ajuste a data de saída.'
      : departure && departure <= stay.today() ? 'A saída deve ser posterior à data de hoje.' : '');
  };
  const bookingPhoto = document.querySelector('.booking-photo');
  const suiteImages = {
    'ocean-terrace': 'ocean-suite',
    'private-pool': 'pool-suite',
    'signature-residence': 'residence'
  };
  const rateFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const updateCapacity = () => {
    if (bookingPhoto) {
      const image = suiteImages[fields.suite.value] || 'ocean-suite';
      const imageUrl = new URL('assets/images/' + image + '-1280.webp', document.baseURI);
      const background = 'url("' + imageUrl.href + '")';
      if (bookingPhoto.style.getPropertyValue('--booking-image') !== background) {
        bookingPhoto.style.setProperty('--booking-image', background);
      }
    }
    const suite = stay.suites[fields.suite.value];
    capacity.textContent = suite
      ? `${suite.name}: até ${suite.capacity} hóspedes no total, incluindo adultos e crianças. Diária ilustrativa a partir de ${rateFormat.format(suite.rate)}.`
      : 'Selecione uma suíte para consultar a ocupação máxima.';
  };
  const updateGuestOptions = () => {
    const suite = stay.suites[fields.suite.value];
    fields.adults.disabled = !suite;
    fields.children.disabled = !suite;
    if (!suite) return;

    // Ao mudar para uma suíte menor, preserva primeiro os adultos e ajusta
    // as crianças ao espaço restante. Nenhum campo de data é alterado.
    const adults = Math.max(1, Math.min(Number(fields.adults.value) || 1, 4, suite.capacity));
    const children = Math.max(0, Math.min(Number(fields.children.value) || 0, suite.capacity - adults));
    fields.adults.value = String(adults);
    fields.children.value = String(children);
    const limits = { adults: Math.min(4, suite.capacity - children), children: suite.capacity - adults };
    for (const id of ['adults', 'children']) {
      for (const option of fields[id].options) {
        const unavailable = Number(option.value) > limits[id];
        option.disabled = unavailable;
        option.hidden = unavailable;
      }
    }
  };
  const clearError = () => {
    error.hidden = true;
    for (const id of ['suite', 'adults', 'children']) fields[id].removeAttribute('aria-invalid');
  };
  const showError = (message, field) => {
    error.textContent = message;
    error.hidden = false;
    if (pickers[field]) pickers[field].mark(message);
    else if (fields[field]) fields[field].setAttribute('aria-invalid', 'true');
    error.focus();
  };

  pickers.arrival = createPicker('arrival');
  pickers.departure = createPicker('departure');
  const saved = stay.read();
  if (saved) {
    fields.suite.value = saved.suiteId;
    fields.adults.value = saved.adults;
    fields.children.value = saved.children;
    pickers.arrival.set(saved.arrival);
    pickers.departure.set(saved.departure);
  }
  const requested = new URLSearchParams(window.location.search).get('suite');
  if (requested && Object.prototype.hasOwnProperty.call(stay.suites, requested)) fields.suite.value = requested;

  form.noValidate = true;
  form.querySelector('fieldset').disabled = false;
  document.getElementById('continue-stay').disabled = false;
  // Escolhas de suíte e ocupação nunca reconstroem nem sincronizam as datas.
  const updateGuests = event => {
    clearError();
    if ([fields.suite, fields.adults, fields.children].includes(event.target)) {
      updateGuestOptions();
      updateCapacity();
    }
  };
  form.addEventListener('input', updateGuests);
  form.addEventListener('change', updateGuests);
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError();
    pickers.arrival.sync();
    pickers.departure.sync();
    refreshDateFeedback();
    const selection = {
      version: 1, suiteId: fields.suite.value,
      arrival: fields.arrival.value, departure: fields.departure.value,
      adults: Number(fields.adults.value), children: Number(fields.children.value),
      selectedAt: Date.now()
    };
    const result = stay.validate(selection);
    if (!result.valid) return showError(result.message, result.field);
    if (!stay.save(selection)) {
      return showError('Não foi possível guardar a seleção nesta sessão. Permita o armazenamento de sessão no navegador e tente novamente.');
    }
    window.location.assign(new URL('checkout.html', window.location.href).href);
  });
  const reason = new URLSearchParams(window.location.search).get('motivo');
  if (reason === 'selecao') {
    error.textContent = 'Para acessar a revisão, selecione uma suíte, as datas e o número de hóspedes. Uma seleção anterior pode ter expirado.';
    error.hidden = false;
  } else if (reason === 'javascript') {
    error.textContent = 'O JavaScript precisa estar ativo para acessar a revisão demonstrativa da estadia.';
    error.hidden = false;
  }
  // O histórico pode restaurar os selects. Recompõe apenas seus valores ISO,
  // sem carregar novamente a sessão ou sobrescrever as escolhas do visitante.
  window.addEventListener('pageshow', () => {
    updateGuestOptions();
    updateCapacity();
    pickers.arrival.sync();
    pickers.departure.sync();
    refreshDateFeedback();
  });
  updateGuestOptions();
  updateCapacity();
  const refreshDateLimits = () => {
    pickers.arrival.sync();
    pickers.departure.sync();
    refreshDateFeedback();
  };
  let midnightTimer;
  const scheduleMidnight = () => {
    clearTimeout(midnightTimer);
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    midnightTimer = setTimeout(() => {
      refreshDateLimits();
      scheduleMidnight();
    }, midnight.getTime() - now.getTime() + 100);
  };
  const resumeDateLimits = () => { refreshDateLimits(); scheduleMidnight(); };
  window.addEventListener('focus', resumeDateLimits);
  window.addEventListener('pageshow', resumeDateLimits);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resumeDateLimits();
  });
  // Também acompanha alterações de relógio/fuso enquanto a página está visível.
  setInterval(() => {
    if (document.visibilityState === 'visible') resumeDateLimits();
  }, 60000);
  resumeDateLimits();
})();
