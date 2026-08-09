document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('loading');
        initAnimations();
      }, 500);
    }, 1200);
  } else {
    document.body.classList.remove('loading');
    initAnimations();
  }

  // Mobile Navbar Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('nav-active'));
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Lightbox Logic (Gallery Page)
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.querySelector('.lightbox');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn    = lightbox.querySelector('.lightbox-close');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.querySelector('img').src;
        lightbox.classList.add('active');
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => {
      if (e.target !== lightboxImg) lightbox.classList.remove('active');
    });
  }
  // ── Slideshow Logic ───────────────────────────────────────────────
  const slideshows = document.querySelectorAll('.slideshow-container');
  slideshows.forEach(container => {
    const slides = container.querySelectorAll('.slide');
    if (slides.length > 1) {
      let currentSlide = 0;
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 2000);
    }
  });
  // ── Premium Products Auto-Slider ───────────────────────────────
  const premiumContainer = document.querySelector('.premium-feature-container');
  if (premiumContainer) {
    const textSlides = premiumContainer.querySelectorAll('.premium-slide');
    const imgSlides = premiumContainer.querySelectorAll('.premium-img');
    if (textSlides.length > 1 && imgSlides.length === textSlides.length) {
      let currentPremium = 0;
      setInterval(() => {
        textSlides[currentPremium].classList.remove('active');
        imgSlides[currentPremium].classList.remove('active');
        currentPremium = (currentPremium + 1) % textSlides.length;
        textSlides[currentPremium].classList.add('active');
        imgSlides[currentPremium].classList.add('active');
      }, 4000); // 4 seconds
    }
  }

});

/* ─── Scroll Reveal (IntersectionObserver) ─────────────────────────────── */
function setupScrollReveals() {
  // All animatable selectors
  const allSelectors = [
    '.gsap-reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.reveal-flip'
  ].join(',');

  const allEls = document.querySelectorAll(allSelectors);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-init');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  allEls.forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });

  // Stagger containers — reveal all children at once; CSS delays handle stagger
  document.querySelectorAll('.gsap-stagger').forEach(container => {
    const staggerObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(entry.target.children).forEach(child => {
            child.classList.add('reveal-scale'); // scale-in for cards
            child.classList.add('reveal-init');
          });
          // Tiny delay so reveal-init paints before is-visible
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              Array.from(entry.target.children).forEach(child => {
                child.classList.remove('reveal-init');
                child.classList.add('is-visible');
              });
            });
          });
          staggerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    staggerObs.observe(container);
  });
}


function initAnimations() {
  // Setup reliable scroll reveals via IntersectionObserver (no GSAP needed)
  setupScrollReveals();

  // ── GSAP: Hero animations ──────────────────────────────────────────────
  if (typeof gsap === 'undefined') return;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.fromTo('.hero-title',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   delay: 0.2, ease: 'power3.out' });
    gsap.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1,   delay: 0.4, ease: 'power3.out' });
    gsap.fromTo('.hero-cta',      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
  }

  // ── GSAP: Page header on inner pages ──────────────────────────────────
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    gsap.fromTo('.page-header h1, .page-header p',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.3, ease: 'power3.out' }
    );
  }

  // ── GSAP: BMW Wheel scroll animation (Home only) ────────────────────
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const scrollSection = document.querySelector('.scroll-section');
    if (scrollSection) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection,
          start: 'top top',
          end: '+=70%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });
      tl.fromTo('.wheel-container',
        { x: '50%', rotation: 0 },
        {
          x: () => -(window.innerWidth - document.querySelector('.wheel-container').offsetWidth),
          rotation: -720,
          ease: 'none',
          duration: 1
        }
      )
      .to('.detail-text-container', { opacity: 0, x: -50, duration: 0.25, ease: 'power2.inOut' }, 0.3)
      .to('.porsche-container', { opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.6)
      .to('.reveal-text', { opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.6);
    }
  }

  // ── About Page Stats Count-up ──────────────────────────────────────
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(stat, { innerHTML: target, duration: 2, snap: { innerHTML: 1 }, ease: 'power1.out' });
        }
      });
    });
  }

  ScrollTrigger.refresh();
}
