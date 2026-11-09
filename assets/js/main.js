"use strict";

// Navegação e exploração visual. O fluxo demonstrativo da estadia fica em módulos separados.
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-navigation');
  const mobile = window.matchMedia('(max-width: 800px)');
  const accountMenu = document.querySelector('.account-menu');
  if (accountMenu) {
    const accountToggle = accountMenu.querySelector('summary');
    document.addEventListener('click', event => {
      if (!accountMenu.contains(event.target)) accountMenu.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && accountMenu.open) {
        accountMenu.open = false;
        accountToggle.focus();
      }
    });
    accountMenu.addEventListener('focusout', event => {
      if (event.relatedTarget && !accountMenu.contains(event.relatedTarget)) accountMenu.open = false;
    });
    menuButton?.addEventListener('click', () => { accountMenu.open = false; });
  }

  if (menuButton && navigation) {
    const setOpen = (open, returnFocus = false) => {
      navigation.hidden = mobile.matches && !open;
      menuButton.setAttribute('aria-expanded', String(open));
      if (returnFocus) menuButton.focus();
    };
    const syncMenu = () => {
      // Avoid leaving focus in a navigation panel that a resize has hidden.
      const focusInside = navigation.contains(document.activeElement);
      menuButton.hidden = !mobile.matches;
      setOpen(!mobile.matches, mobile.matches && focusInside);
    };
    menuButton.addEventListener('click', () => {
      setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    accountMenu?.addEventListener('toggle', () => {
      if (accountMenu.open && mobile.matches) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobile.matches && !navigation.hidden) {
        setOpen(false, true);
      }
    });
    if (mobile.addEventListener) mobile.addEventListener('change', syncMenu);
    else mobile.addListener(syncMenu);
    syncMenu();
  }

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const controls = carousel.querySelector('.carousel-controls');
    const previous = controls.querySelector('[data-direction="-1"]');
    const next = controls.querySelector('[data-direction="1"]');
    const count = controls.querySelector('.carousel-count');
    const cards = Array.from(track.children);
    if (!cards.length) return;
    const smoothCollection = carousel.dataset.scrollBehavior === 'smooth';
    const behavior = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

    cards.forEach((card, index) => {
      const heading = card.querySelector('h2, h3');
      card.setAttribute('aria-label', `${heading ? heading.textContent : 'Item'} — ${index + 1} de ${cards.length}`);
    });

    const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const positions = () => {
      const left = track.getBoundingClientRect().left;
      const scrollPadding = parseFloat(window.getComputedStyle(track).scrollPaddingLeft) || 0;
      return cards.map(card => Math.min(maximum(), Math.max(0,
        card.getBoundingClientRect().left - left - track.clientLeft + track.scrollLeft - scrollPadding)));
    };
    const update = () => {
      const max = maximum();
      const current = Math.max(0, track.scrollLeft);
      controls.hidden = max <= 2;
      const offsets = positions();
      previous.disabled = current <= offsets[0] + 2;
      next.disabled = current >= offsets[offsets.length - 1] - 2;
      let index = offsets.reduce((best, position, i) =>
        Math.abs(position - current) < Math.abs(offsets[best] - current) ? i : best, 0);
      if (max > 2 && current >= max - 2) index = cards.length - 1;
      const label = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      if (count.textContent !== label) count.textContent = label;
    };
    const suiteCarousel = carousel.classList.contains('suite-carousel');
    let suiteSliding = false;
    let suiteDestination = 0;
    let suiteTargetIndex = 0;
    let suiteTimer;
    let lastSuiteWheel = -Infinity;
    const releaseSuite = () => {
      clearTimeout(suiteTimer);
      suiteSliding = false;
    };
    const suiteIndex = () => {
      const offsets = positions();
      return offsets.reduce((best, offset, i) =>
        Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? i : best, 0);
    };
    const slideSuiteTo = index => {
      if (suiteSliding) {
        track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
        releaseSuite();
      }
      const offsets = positions();
      suiteTargetIndex = Math.max(0, Math.min(cards.length - 1, index));
      suiteDestination = offsets[suiteTargetIndex];
      if (Math.abs(track.scrollLeft - suiteDestination) < 2) return;
      suiteSliding = true;
      track.scrollTo({ left: suiteDestination, behavior: behavior() });
      // Compatibilidade com navegadores sem scrollend e com rolagens interrompidas.
      suiteTimer = setTimeout(releaseSuite, 1800);
    };
    if (suiteCarousel) {
      track.addEventListener('scroll', () => {
        if (suiteSliding && Math.abs(track.scrollLeft - suiteDestination) < 2) releaseSuite();
      }, { passive: true });
      track.addEventListener('scrollend', () => {
        if (Math.abs(track.scrollLeft - suiteDestination) < 2) releaseSuite();
      });
    }
    const go = direction => {
      if (suiteCarousel) {
        slideSuiteTo((suiteSliding ? suiteTargetIndex : suiteIndex()) + direction);
        return;
      }
      const offsets = positions();
      const current = track.scrollLeft;
      let destination;
      if (direction > 0) {
        destination = offsets.find(position => position > current + 2) ?? maximum();
      } else {
        destination = offsets.filter(position => position < current - 2).pop() ?? 0;
      }
      // As setas usam a mesma rolagem nativa suave em todos os carrosséis.
      track.scrollTo({ left: destination, behavior: behavior() });
      update();
    };
    previous.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        go(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        if (suiteCarousel) {
          slideSuiteTo(event.key === 'Home' ? 0 : cards.length - 1);
          return;
        }
        track.scrollTo({ left: event.key === 'Home' ? 0 : maximum(), behavior: behavior() });
        update();
      }
    });
    track.addEventListener('scroll', update, { passive: true });
    // Trackpads e rodas horizontais mantêm o comportamento nativo. A roda
    // vertical também explora a coleção, liberando a página ao chegar às bordas.
    let wheelTarget = null;
    let lastWheel = 0;
    let lastWheelDirection = 0;
    track.addEventListener('wheel', event => {
      if (event.ctrlKey) return;
      if (suiteCarousel) {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (!delta) return;
        const now = performance.now();
        const sameGesture = now - lastSuiteWheel < 240;
        lastSuiteWheel = now;
        const direction = Math.sign(delta);
        const index = suiteIndex();
        if (!sameGesture && !suiteSliding &&
            ((direction < 0 && index === 0 && track.scrollLeft <= 2) ||
             (direction > 0 && index === cards.length - 1 && track.scrollLeft >= maximum() - 2))) return;
        event.preventDefault();
        event.stopPropagation();
        // Todos os eventos de impulso/inércia pertencem ao mesmo gesto.
        // Não inicia outra transição enquanto a atual estiver em andamento.
        if (!sameGesture && !suiteSliding) slideSuiteTo(index + direction);
        return;
      }
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      if (smoothCollection) {
        const now = performance.now();
        const direction = Math.sign(event.deltaY);
        if (lastWheel > 0 && now - lastWheel < 240 && direction === lastWheelDirection) {
          lastWheel = now;
          event.preventDefault();
          return;
        }
        const atEdge = direction > 0 ? track.scrollLeft >= maximum() - 2 : track.scrollLeft <= 2;
        if (atEdge) return;
        event.preventDefault();
        event.stopPropagation();
        lastWheel = now;
        lastWheelDirection = direction;
        go(direction);
        return;
      }
      const scale = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? track.clientWidth : 1;
      const delta = event.deltaY * scale;
      const before = smoothCollection && wheelTarget !== null && performance.now() - lastWheel < 180
        ? wheelTarget : track.scrollLeft;
      const destination = Math.max(0, Math.min(maximum(), before + delta));
      if (Math.abs(destination - before) < 1) return;
      event.preventDefault();
      event.stopPropagation();
      if (smoothCollection) {
        wheelTarget = destination;
        lastWheel = performance.now();
        track.scrollTo({ left: destination, behavior: behavior() });
      } else track.scrollLeft = destination;
      update();
    }, { passive: false });

    // Touch and pen use the browser's native swipe behavior. Mouse users can
    // drag card backgrounds; links, buttons, and text inputs retain their actions.
    let drag = null;
    let suppressClick = false;
    track.addEventListener('pointerdown', event => {
      suppressClick = false;
      if (suiteCarousel && suiteSliding) {
        track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
        releaseSuite();
      }
      if (event.pointerType !== 'mouse' || event.button !== 0 ||
          event.target.closest('a, button, input, select, textarea, label') ||
          event.target.closest('.carousel-track') !== track) return;
      drag = { id: event.pointerId, startX: event.clientX, startLeft: track.scrollLeft, moved: false };
      suppressClick = false;
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    track.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const delta = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) < 6) return;
      drag.moved = true;
      track.classList.add('is-dragging');
      track.scrollLeft = drag.startLeft - delta;
    });
    const stopDrag = event => {
      if (!drag || event.pointerId !== drag.id) return;
      suppressClick = drag.moved;
      drag = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      update();
    };
    track.addEventListener('pointerup', stopDrag);
    track.addEventListener('pointercancel', stopDrag);
    track.addEventListener('lostpointercapture', stopDrag);
    track.addEventListener('click', event => {
      if (suppressClick && event.detail > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
      suppressClick = false;
    }, true);

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update);
      observer.observe(track);
      cards.forEach(card => observer.observe(card));
    } else {
      window.addEventListener('resize', update, { passive: true });
    }
    update();
  });
})();
