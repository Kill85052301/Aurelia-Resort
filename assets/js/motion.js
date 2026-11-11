"use strict";
(() => {
 const boot = window.AureliaMotionBoot;
 const gsap = window.gsap;
 const ScrollTrigger = window.ScrollTrigger;
 if (!gsap || !ScrollTrigger || boot?.expired) { boot?.reveal(); return; }
 gsap.registerPlugin(ScrollTrigger);
 const main = document.querySelector('main');
 if (!main) { boot?.reveal(); return; }
 const media = gsap.matchMedia();
 let leaving = false;
 try {
 media.add('(prefers-reduced-motion: no-preference)', context => {
  const events = new AbortController();
  const on = (node, name, fn, options = {}) => node.addEventListener(name, fn, { ...options, signal: events.signal });
  const timelines = [];
  const timeline = options => { const tl = gsap.timeline(options); timelines.push(tl); return tl; };
  // Funções registradas no contexto também são revertidas ao mudar a preferência de movimento.
  const safe = fn => {
   const key = 'effect' + Math.random().toString(36).slice(2);
   context.add(key, fn);
   return (...args) => context[key](...args);
  };
  const revealed = new Set();
  const reveal = (element, targets) => {
   const fresh = Array.from(targets).filter(target => !revealed.has(target));
   if (!fresh.length) return;
   fresh.forEach(target => revealed.add(target));
   gsap.set(fresh, { y: 16, opacity: 0 });
   ScrollTrigger.create({ trigger: element, start: 'top 94%', once: true,
    onEnter: safe(() => timeline({ defaults: { duration: .65, ease: 'power3.out' } })
     .to(fresh, { y: 0, opacity: 1, stagger: .055, clearProps: 'transform,opacity' })) });
  };
  const hero = document.querySelector('.home-hero');
  if (hero) {
   const tl = timeline({ defaults: { ease: 'power3.out' } });
   const image = hero.querySelector('.art-hero img');
   if (image) tl.from(image, { scale: 1.055, duration: 1.65, clearProps: 'transform' }, 0);
   const title = hero.querySelector('h1');
   if (title) tl.from(title, { clipPath: 'inset(0 0 100% 0)', y: 20, duration: .95, clearProps: 'clipPath,transform' }, .08);
   tl.from(hero.querySelectorAll('.hero-copy > p, .edition-index, .hero-footnote, .hero-index'),
    { y: 12, opacity: 0, duration: .7, stagger: .065, clearProps: 'transform,opacity' }, .12);
  }
  const intro = document.querySelector('.page-intro, .credits-intro, .catalog-hero');
  if (intro) timeline().from(intro, { y: 12, opacity: 0, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' });

  document.querySelectorAll('.experience-card').forEach(card => {
   const photo = card.querySelector('.experience-photo');
   const copy = card.querySelectorAll('h3, .card-copy p, .experience-more');
   gsap.set(photo, { clipPath: 'inset(0 0 100% 0)' });
   gsap.set(copy, { y: 14, opacity: 0 });
   ScrollTrigger.create({ trigger: card, start: 'top 94%', once: true, onEnter: safe(() => {
    timeline({ defaults: { ease: 'power3.out' } })
     .to(photo, { clipPath: 'inset(0 0 0% 0)', duration: .85, clearProps: 'clipPath' }, 0)
     .to(copy, { y: 0, opacity: 1, duration: .6, stagger: .08, clearProps: 'transform,opacity' }, .1);
   }) });
   const image = card.querySelector('img');
   if (image && ScrollTrigger.isTouch === 0) gsap.fromTo(image, { scale: 1.04, yPercent: -1 },
    { scale: 1.04, yPercent: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });

  // Cada grupo entra uma vez, evitando efeitos sobrepostos em pais e filhos.
  const groups = main.querySelectorAll(
   '.home-benefits > div, .home-collection .section-heading, .home-suite-grid .card-copy, ' +
   '.editorial-stay, .home-experiences .section-heading, .hospitality-panel, ' +
   '.catalog-list > .eyebrow, .catalog-list > h2, .suite-compare, .catalog-room .room-copy, ' +
   '.catalog-comfort, .escape-nav > div, .escape-collection > header, ' +
   '.escape-benefits, .booking-card, .booking-info > div, ' +
   '.contact-view, .contact-layout > section, .contact-band > div, ' +
   '.main-checkout > section, .review-benefits > div'
  );
  groups.forEach(group => {
   if (group.closest('[data-carousel]')) return;
   reveal(group, [group]);
  });
  on(window, 'load', () => ScrollTrigger.refresh(), { once: true });
  const footer = document.querySelector('.site-footer');
  if (footer) reveal(footer, [footer]);
  document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(field => {
   on(field, 'focus', safe(() => {
    if (!field.disabled) gsap.to(field, { boxShadow: '0 0 0 3px rgba(132,104,57,.13)', duration: .18, overwrite: 'auto' });
   }));
   on(field, 'blur', safe(() => gsap.to(field, { boxShadow: '0 0 0 0px rgba(132,104,57,0)', duration: .18, clearProps: 'boxShadow', overwrite: 'auto' })));
  });
  // Navegação normal preservada para âncoras, modificadores, downloads e links externos.
  let destination = null;
  let fallback;
  const cancelNavigation = () => {
   destination = null;
   clearTimeout(fallback);
  };
  on(window, 'pagehide', cancelNavigation);
  on(document, 'click', safe(event => {
   const link = event.target.closest('a[href]');
   if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
       link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
   const url = new URL(link.href, location.href);
   if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.pathname === location.pathname) return;
   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
   event.preventDefault();
   if (leaving) return;
   leaving = true;
   destination = url.href;
   const navigate = () => {
    if (destination !== url.href) return;
    cancelNavigation();
    location.assign(url.href);
   };
   fallback = setTimeout(navigate, 450);
   gsap.to(main, { opacity: 0, duration: .16, ease: 'power1.in', overwrite: 'auto',
    onComplete: navigate });
  }));
  const finish = () => {
   timelines.forEach(tl => { if (tl.isActive()) tl.progress(1); });
  };
  on(document, 'focusin', event => {
   // Evita focar conteúdo ainda oculto durante uma entrada curta.
   if (main.contains(event.target)) finish();
  });
  window.addEventListener('pageshow', event => {
   if (event.persisted) { finish(); leaving = false; gsap.set(main, { clearProps: 'opacity' }); ScrollTrigger.refresh(); }
  }, { signal: events.signal });
  let refreshFrame = 0;
  const refreshImages = () => {
   if (refreshFrame) return;
   refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
   });
  };
  document.querySelectorAll('img').forEach(img => {
   if (!img.complete) on(img, 'load', refreshImages, { once: true });
  });
  return () => { events.abort(); cancelAnimationFrame(refreshFrame); cancelNavigation(); leaving = false; };
 });
 } finally { boot?.reveal(); }
})();
