/* ═══════════════════════════════════════════════════════════
   KI-Prozessnavigator — GSAP Animations
   ScrollTrigger-based scroll animations
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.gs-reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.defaults({ ease: 'power3.out', duration: 0.7 });
  gsap.ticker.lagSmoothing(0);

  /* ── Hero Entrance ── */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var tl = gsap.timeline({ delay: 0.3 });

    var eyebrow = hero.querySelector('.eyebrow');
    if (eyebrow) {
      tl.fromTo(eyebrow,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }

    var title = hero.querySelector('.hero__title');
    if (title) {
      tl.fromTo(title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );
    }

    var desc = hero.querySelector('.hero__description');
    if (desc) {
      tl.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }

    var stats = hero.querySelectorAll('.hero__stat');
    if (stats.length) {
      tl.fromTo(stats,
        { opacity: 0, y: 15, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
        '-=0.3'
      );
    }

    var ctaRow = hero.querySelector('.hero__cta-row');
    if (ctaRow) {
      tl.fromTo(ctaRow,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }

    var rating = hero.querySelector('.hero__rating');
    if (rating) {
      tl.fromTo(rating,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
      );
    }

    var dashboard = hero.querySelector('.hero__dashboard');
    if (dashboard) {
      tl.fromTo(dashboard,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8 },
        '-=0.5'
      );
    }
  }

  /* ── Generic Scroll Reveals ── */
  function initScrollReveals() {
    gsap.utils.toArray('.section-header.gs-reveal').forEach(function (header) {
      gsap.fromTo(header,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.gs-reveal').forEach(function (el) {
      if (el.closest('.hero') || el.classList.contains('section-header')) return;

      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  /* ── Pain Story: Scroll-Scrubbed Text Reveal ── */
  function initPainStory() {
    var section = document.querySelector('.pain-story');
    if (!section) return;

    var paragraphs = section.querySelectorAll('.pain-story__text p, .pain-story__callout');
    if (!paragraphs.length) return;

    paragraphs.forEach(function (p) {
      gsap.fromTo(p,
        { opacity: 0.15 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1.2
          }
        }
      );
    });
  }

  /* ── Cards with Stagger (3D entrance) ── */
  function initCards() {
    var consequenceCards = gsap.utils.toArray('.consequences__grid .card');
    if (consequenceCards.length) {
      gsap.fromTo(consequenceCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.2, duration: 0.6,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          scrollTrigger: { trigger: consequenceCards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    var otherGroups = [
      '.modules__grid .card',
      '.dsgvo__grid .card',
      '.final-cta__cards .card'
    ];

    otherGroups.forEach(function (selector) {
      var cards = gsap.utils.toArray(selector);
      if (!cards.length) return;

      gsap.fromTo(cards,
        { opacity: 0, y: 50, rotateX: 6 },
        {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.12, duration: 0.7,
          scrollTrigger: { trigger: cards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  /* ── Founder Section ── */
  function initFounder() {
    var section = document.querySelector('.founder');
    if (!section) return;

    var image = section.querySelector('.founder__image');
    if (image) {
      gsap.fromTo(image,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.8,
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
    }

    var text = section.querySelector('.founder__text');
    if (text) {
      gsap.fromTo(text,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.8, delay: 0.15,
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ── Transformation Columns ── */
  function initTransformation() {
    var grid = document.querySelector('.transformation__grid');
    if (!grid) return;

    var cols = grid.querySelectorAll('.transformation__col');
    gsap.fromTo(cols,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.2, duration: 0.7,
        scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Comparison Table ── */
  function initComparison() {
    var table = document.querySelector('.comparison__table');
    if (!table) return;

    var cols = table.querySelectorAll('.comparison__col');
    gsap.fromTo(cols,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.7,
        scrollTrigger: { trigger: table, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Process Timeline (Scroll-linked line draw) ── */
  function initTimeline() {
    var timeline = document.querySelector('.process__timeline');
    if (!timeline) return;

    var lineFill = timeline.querySelector('.process__line-fill');
    if (lineFill) {
      gsap.fromTo(lineFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        }
      );
    }

    var dots = timeline.querySelectorAll('.process-step__dot');
    dots.forEach(function (dot, i) {
      gsap.fromTo(dot,
        { scale: 0.5, opacity: 0.3 },
        {
          scale: 1, opacity: 1, duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    var steps = timeline.querySelectorAll('.process-step__content');
    steps.forEach(function (step, i) {
      gsap.fromTo(step,
        { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
        {
          opacity: 1, x: 0, duration: 0.7,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ── Calculator ── */
  function initCalculator() {
    var calc = document.querySelector('.calculator');
    if (!calc) return;

    gsap.fromTo(calc.querySelector('.calculator__grid'),
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8,
        scrollTrigger: { trigger: calc, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Testimonial ── */
  function initTestimonial() {
    var card = document.querySelector('.testimonial__card');
    if (!card) return;

    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── FAQ Accordion Items ── */
  function initFAQ() {
    var items = gsap.utils.toArray('.accordion__item');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, y: 15 },
      {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.5,
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  /* ── Lead Magnet ── */
  function initLeadMagnet() {
    var magnet = document.querySelector('.lead-magnet__card');
    if (!magnet) return;

    gsap.fromTo(magnet,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 0.7,
        scrollTrigger: { trigger: magnet, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Final CTA ── */
  function initFinalCTA() {
    var section = document.querySelector('.final-cta');
    if (!section) return;

    var btn = section.querySelector('.btn--glow-pulse');
    if (btn) {
      gsap.fromTo(btn,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: btn, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ── Parallax Glow Orbs ── */
  function initParallaxGlows() {
    var glows = gsap.utils.toArray('.bg-glow');
    if (!glows.length) return;

    var speeds = [100, 60, 30];
    glows.forEach(function (glow, i) {
      gsap.to(glow, {
        y: function () { return gsap.utils.random(-speeds[i] || -50, speeds[i] || 50); },
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2
        }
      });
    });
  }

  /* ── Number CountUp ── */
  function initCounters() {
    var statValues = document.querySelectorAll('.hero__stat-value[data-count]');
    if (!statValues.length) return;

    statValues.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var startText = el.textContent;

      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          delay: 1.2,
          onUpdate: function () {
            el.textContent = prefix + Math.round(parseFloat(el.textContent)) + suffix;
          },
          onStart: function () {
            el.textContent = prefix + '0' + suffix;
          }
        }
      );
    });
  }

  /* ── Word Rotator ── */
  function initWordRotator() {
    var rotator = document.querySelector('.word-rotator');
    if (!rotator) return;

    var words = rotator.querySelectorAll('.word-rotator__word');
    if (words.length < 2) return;

    var current = 0;
    setInterval(function () {
      words[current].classList.remove('is-active');
      current = (current + 1) % words.length;
      words[current].classList.add('is-active');
    }, 2500);
  }

  /* ── Scroll-Triggered CountUp (sitewide) ── */
  function initScrollCounters() {
    var counters = document.querySelectorAll('[data-scroll-count]');
    if (!counters.length) return;

    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-scroll-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';

      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          onUpdate: function () {
            el.textContent = prefix + Math.round(parseFloat(el.textContent)) + suffix;
          },
          onStart: function () {
            el.textContent = prefix + '0' + suffix;
          }
        }
      );
    });
  }

  /* ── Init ── */
  function init() {
    initHero();
    initCounters();
    initWordRotator();
    initScrollReveals();
    initPainStory();
    initCards();
    initFounder();
    initTransformation();
    initComparison();
    initTimeline();
    initCalculator();
    initTestimonial();
    initFAQ();
    initLeadMagnet();
    initFinalCTA();
    initParallaxGlows();
    initScrollCounters();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
