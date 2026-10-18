// Bunique — final cinematic scroll system. Native JS/CSS only; no animation CDN.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.querySelector('.scroll-progress');
  const glow = document.querySelector('.cursor-glow');
  const stories = [...document.querySelectorAll('.scroll-story')];
  const allMotionCards = [...document.querySelectorAll('.service-card,.process-card,.platform-cards span,.logo-strip span,.category-card,.trust-card,.industry-grid span,.testimonial,.insight')];
  const clamp = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
  let raf = 0;

  function update() {
    raf = 0;
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight || 800;
    const vw = window.innerWidth || 390;
    const maxScroll = document.documentElement.scrollHeight - vh;
    if (progressBar) progressBar.style.width = `${maxScroll > 0 ? scrollY / maxScroll * 100 : 0}%`;
    if (reduceMotion) return;

    // Hero has a layered depth effect while the page moves.
    const hero = document.querySelector('.hero');
    if (hero) {
      const r = hero.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height));
      hero.style.setProperty('--hero-parallax', `${-p * 95}px`);
      hero.style.setProperty('--hero-copy-shift', `${-p * 28}px`);
      hero.style.setProperty('--hero-visual-shift', `${Math.sin(p * Math.PI) * -22}px`);
      hero.style.setProperty('--hero-rotate', `${vw > 900 ? (p - .5) * -5 : 0}deg`);
      hero.style.setProperty('--hero-sheen', `${-120 + p * 260}%`);
    }

    // Section backgrounds and headings follow scroll progress continuously.
    document.querySelectorAll('.section-observe').forEach(section => {
      const r = section.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height));
      section.style.setProperty('--section-progress', p.toFixed(3));
      section.classList.toggle('in-view', r.top < vh * .78 && r.bottom > vh * .18);
    });
    stories.forEach(section => {
      const r = section.getBoundingClientRect();
      const p = clamp((vh * .92 - r.top) / (vh * .92 + r.height * .20));
      section.style.setProperty('--story-progress', p.toFixed(3));
      section.classList.toggle('is-story-active', r.top < vh * .72 && r.bottom > vh * .28);
      const heading = section.querySelector('.section-heading');
      if (heading) {
        const hr = heading.getBoundingClientRect();
        const hp = clamp((vh * .85 - hr.top) / (vh * .72));
        heading.style.setProperty('--cinematic-heading-y', `${(0.5-p)*46}px`);
        heading.style.setProperty('--cinematic-heading-opacity', `${.72 + .28 * clamp(hp*1.35)}`);
      }
    });

    // Each card has its own scroll-linked arc, not just a one-time fade-in.
    allMotionCards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      if (r.bottom < -vh * .25 || r.top > vh * 1.25) return;
      const center = r.top + r.height / 2;
      const normalized = clamp((center + vh * .12) / (vh * 1.24));
      const distance = (normalized - .5) * 2; // -1 at top, +1 at bottom
      const enter = clamp((vh * 1.12 - r.top) / (vh * .82));
      const exit = clamp((r.bottom + vh * .18) / (vh * .85));
      const visibility = Math.min(enter, exit);
      const y = distance * (vw > 900 ? 38 : 24) * (1 - visibility * .2);
      const scale = .965 + (1 - Math.abs(distance)) * .035;
      const rotate = vw > 900 ? distance * ((i % 2) ? 1.8 : -1.8) : 0;
      card.style.setProperty('--cinematic-y', `${y.toFixed(1)}px`);
      card.style.setProperty('--cinematic-scale', scale.toFixed(3));
      card.style.setProperty('--cinematic-rotate', `${rotate.toFixed(2)}deg`);
    });
  }
  function requestUpdate(){ if(!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  window.addEventListener('orientationchange', requestUpdate, {passive:true});
  update();

  if (glow && !reduceMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => { glow.style.left=`${e.clientX}px`; glow.style.top=`${e.clientY}px`; }, {passive:true});
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.06, rootMargin:'0px 0px -18px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    if (reduceMotion || !('IntersectionObserver' in window)) { el.textContent = `${target}+`; return; }
    const counter = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const start = performance.now(), duration = 1250;
      function tick(now) { const p = clamp((now-start)/duration); el.textContent = `${Math.round(target*(1-Math.pow(1-p,3)))}+`; if(p<1) requestAnimationFrame(tick); }
      requestAnimationFrame(tick); counter.disconnect();
    }, {threshold:.5});
    counter.observe(el);
  });

  document.querySelectorAll('.magnetic').forEach(btn => {
    if (reduceMotion) return;
    btn.addEventListener('pointermove', e => {
      if (vwSmall()) return;
      const r = btn.getBoundingClientRect();
      btn.style.translate = `${(e.clientX-r.left-r.width/2)*.075}px ${(e.clientY-r.top-r.height/2)*.075}px`;
    });
    btn.addEventListener('pointerleave', () => btn.style.translate = '');
  });
  function vwSmall(){ return window.innerWidth < 800; }

  document.querySelectorAll('.service-card,.category-card,.trust-card,.insight,.process-card').forEach(card => {
    if (reduceMotion) return;
    card.addEventListener('pointermove', e => {
      if (window.innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-4;
      const ry = ((e.clientX-r.left)/r.width-.5)*4;
      card.style.setProperty('--pointer-rx', `${rx}deg`);
      card.style.setProperty('--pointer-ry', `${ry}deg`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  const menuBtn = document.querySelector('.menu-btn'), nav = document.querySelector('.desktop-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('mobile-open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.setAttribute('aria-label','Open menu');
    }));
  }
})();
