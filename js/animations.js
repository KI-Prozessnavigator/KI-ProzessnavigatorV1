(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
    ScrollToPlugin
  );

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.gs-reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  CustomEase.create('smooth', '0.22, 1, 0.36, 1');
  CustomEase.create('snapBack', '0.34, 1.56, 0.64, 1');

  gsap.defaults({ ease: 'smooth', duration: 0.8 });
  gsap.ticker.lagSmoothing(0);

  var smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 0.6,
    effects: true,
    smoothTouch: false
  });

  /* ── Smooth Anchor Scrolling ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      smoother.scrollTo(target, true, 'top top');
    });
  });

  /* ── Hero ── */
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
      var splitTitle = SplitText.create(title, {
        type: 'words, chars',
        charsClass: 'hero-char',
        aria: 'auto'
      });
      tl.from(splitTitle.chars, {
        opacity: 0,
        y: 40,
        rotationX: -40,
        stagger: 0.02,
        duration: 0.6,
        ease: 'snapBack'
      }, '-=0.1');
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
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.5, ease: 'snapBack' },
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

    var visual = hero.querySelector('.hero__visual');
    if (visual) {
      tl.fromTo(visual,
        { opacity: 0, x: 40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.8'
      );
    }
  }

  /* ── Section Headers with SplitText ── */
  function initSectionHeaders() {
    gsap.utils.toArray('.section-header.gs-reveal').forEach(function (header) {
      gsap.set(header, { opacity: 1 });

      var h2 = header.querySelector('h2');
      if (h2) {
        var split = SplitText.create(h2, {
          type: 'lines, words',
          linesClass: 'split-line',
          mask: 'lines',
          aria: 'auto'
        });

        gsap.from(split.lines, {
          y: '100%',
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'smooth',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }

      var lead = header.querySelector('.section-header__lead');
      if (lead) {
        gsap.fromTo(lead,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: 0.2,
            scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }

      var eyebrow = header.querySelector('.eyebrow');
      if (eyebrow) {
        gsap.fromTo(eyebrow,
          { opacity: 0, y: 12 },
          {
            opacity: 1, y: 0, duration: 0.5,
            scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }
    });
  }

  /* ── Generic Scroll Reveals ── */
  function initScrollReveals() {
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
        { opacity: 0.12 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 1.5
          }
        }
      );
    });

    var painSvg = section.querySelector('.pain-story__illustration');
    if (painSvg) {
      var strokes = painSvg.querySelectorAll('[stroke]');
      if (strokes.length) {
        gsap.from(strokes, {
          drawSVG: '0%',
          stagger: 0.15,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: painSvg,
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: 1.5
          }
        });
      }
    }
  }

  /* ── Cards with Stagger ── */
  function initCards() {
    var consequenceCards = gsap.utils.toArray('.consequences__grid .card');
    if (consequenceCards.length) {
      gsap.fromTo(consequenceCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.12, duration: 0.6,
          scrollTrigger: { trigger: consequenceCards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    var svgIcons = document.querySelectorAll('.consequences__grid .card__icon svg [stroke]');
    if (svgIcons.length) {
      gsap.from(svgIcons, {
        drawSVG: '0%',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.consequences__grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
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
          stagger: 0.1, duration: 0.7,
          scrollTrigger: { trigger: cards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  /* ── Founder ── */
  function initFounder() {
    var section = document.querySelector('.founder');
    if (!section) return;

    var image = section.querySelector('.founder__image');
    if (image) {
      gsap.fromTo(image,
        { opacity: 0, scale: 0.92, y: 30 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
    }

    var text = section.querySelector('.founder__text');
    if (text) {
      gsap.fromTo(text,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.9, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ── Transformation ── */
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

    var checkmarks = grid.querySelectorAll('.transformation__col--after .check-list__icon polyline');
    if (checkmarks.length) {
      gsap.from(checkmarks, {
        drawSVG: '0%',
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.transformation', start: 'top 65%', toggleActions: 'play none none none' }
      });
    }
  }

  /* ── Comparison Table ── */
  function initComparison() {
    var table = document.querySelector('.comparison__table');
    if (!table) return;

    var rows = table.querySelectorAll('.comparison__row:not(.comparison__row--header)');
    gsap.fromTo(rows,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, stagger: 0.08, duration: 0.5,
        scrollTrigger: { trigger: table, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Process Timeline (DrawSVG line + step entrance) ── */
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
            scrub: 1.2
          }
        }
      );
    }

    var dots = timeline.querySelectorAll('.process-step__dot');
    dots.forEach(function (dot) {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5,
          ease: 'snapBack',
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
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
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

    var stepIcons = timeline.querySelectorAll('.process-step__icon svg [stroke]');
    stepIcons.forEach(function (el) {
      gsap.from(el, {
        drawSVG: '0%',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el.closest('.process-step__content'),
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ── Calculator ── */
  function initCalculator() {
    var calc = document.querySelector('.calculator');
    if (!calc) return;

    gsap.fromTo(calc.querySelector('.calculator__grid'),
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8,
        scrollTrigger: { trigger: calc, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Modules (DrawSVG on card icons) ── */
  function initModules() {
    var grid = document.querySelector('.modules__grid');
    if (!grid) return;

    var cardIcons = grid.querySelectorAll('.card__icon svg [stroke]');
    if (cardIcons.length) {
      gsap.from(cardIcons, {
        drawSVG: '0%',
        duration: 0.8,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  /* ── DSGVO (DrawSVG animated icons) ── */
  function initDSGVO() {
    var icons = document.querySelector('.dsgvo__icons');
    if (!icons) return;

    var allStrokes = icons.querySelectorAll('[stroke]');
    if (!allStrokes.length) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: icons,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    var shieldBody = icons.querySelector('.dsgvo__shield-body');
    var shieldCheck = icons.querySelector('.dsgvo__shield-check');
    var lockBody = icons.querySelector('.dsgvo__lock-body');
    var lockShackle = icons.querySelector('.dsgvo__lock-shackle');
    var docPage = icons.querySelector('.dsgvo__doc-page');
    var docFold = icons.querySelector('.dsgvo__doc-fold');

    if (shieldBody) tl.from(shieldBody, { drawSVG: '0%', duration: 0.8, ease: 'power2.inOut' }, 0);
    if (shieldCheck) tl.from(shieldCheck, { drawSVG: '0%', duration: 0.4, ease: 'power2.out' }, 0.5);
    if (lockBody) tl.from(lockBody, { drawSVG: '0%', duration: 0.6, ease: 'power2.inOut' }, 0.15);
    if (lockShackle) tl.from(lockShackle, { drawSVG: '0%', duration: 0.5, ease: 'power2.out' }, 0.4);
    if (docPage) tl.from(docPage, { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' }, 0.3);
    if (docFold) tl.from(docFold, { drawSVG: '0%', duration: 0.4, ease: 'power2.out' }, 0.7);
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

  /* ── FAQ ── */
  function initFAQ() {
    var items = gsap.utils.toArray('.accordion__item');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, y: 15 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.5,
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

  /* ── Number CountUp (Hero) ── */
  function initCounters() {
    var statValues = document.querySelectorAll('.hero__stat-value[data-count]');
    if (!statValues.length) return;

    statValues.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';

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
    initSectionHeaders();
    initScrollReveals();
    initPainStory();
    initCards();
    initFounder();
    initTransformation();
    initComparison();
    initTimeline();
    initCalculator();
    initModules();
    initDSGVO();
    initTestimonial();
    initFAQ();
    initLeadMagnet();
    initFinalCTA();
    initScrollCounters();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
