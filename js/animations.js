(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var plugins = [ScrollTrigger];
  if (typeof ScrollSmoother !== 'undefined') plugins.push(ScrollSmoother);
  if (typeof SplitText !== 'undefined') plugins.push(SplitText);
  if (typeof DrawSVGPlugin !== 'undefined') plugins.push(DrawSVGPlugin);
  if (typeof CustomEase !== 'undefined') plugins.push(CustomEase);
  if (typeof ScrollToPlugin !== 'undefined') plugins.push(ScrollToPlugin);
  gsap.registerPlugin.apply(gsap, plugins);

  var hasSplitText = typeof SplitText !== 'undefined';
  var hasDrawSVG = typeof DrawSVGPlugin !== 'undefined';
  var hasCustomEase = typeof CustomEase !== 'undefined';

  /* ── Premium Easing Curves ── */
  if (hasCustomEase) {
    CustomEase.create('enterExpo', '0.16, 1, 0.3, 1');
    CustomEase.create('moveQuart', '0.25, 1, 0.5, 1');
    CustomEase.create('snapBack', '0.34, 1.56, 0.64, 1');
  }

  var EASE_ENTER = hasCustomEase ? 'enterExpo' : 'power3.out';
  var EASE_MOVE = hasCustomEase ? 'moveQuart' : 'power2.out';
  var EASE_SNAP = hasCustomEase ? 'snapBack' : 'back.out(1.5)';

  /* ── Reduced Motion ── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.gs-reveal').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.defaults({ ease: EASE_ENTER, duration: 0.7 });
  gsap.ticker.lagSmoothing(0);

  /* ── ScrollSmoother ── */
  var smoother = null;
  if (typeof ScrollSmoother !== 'undefined' && document.querySelector('#smooth-wrapper')) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 0.6,
      effects: true,
      smoothTouch: false
    });
  }

  /* ── Smooth Anchor Scrolling ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (smoother) {
        smoother.scrollTo(target, true, 'top top');
      } else {
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 0.8, ease: EASE_MOVE });
      }
    });
  });

  /* ── Hero ── */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var reveals = hero.querySelectorAll('.gs-reveal');
    reveals.forEach(function (el) { gsap.set(el, { opacity: 1 }); });

    var tl = gsap.timeline({ delay: 0.15 });

    var eyebrow = hero.querySelector('.hero__headline .eyebrow');
    if (eyebrow) {
      tl.fromTo(eyebrow,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_ENTER }
      );
    }

    var title = hero.querySelector('.hero__title');
    if (title && hasSplitText) {
      var splitTitle = SplitText.create(title, {
        type: 'words',
        aria: 'auto'
      });
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 24,
        stagger: 0.04,
        duration: 0.6,
        ease: EASE_ENTER
      }, '-=0.2');
    } else if (title) {
      tl.fromTo(title,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE_ENTER },
        '-=0.2'
      );
    }

    var subtitle = hero.querySelector('.hero__subtitle');
    if (subtitle) {
      tl.fromTo(subtitle,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_ENTER },
        '-=0.3'
      );
    }

    var content = hero.querySelector('.hero__content');
    if (content) {
      tl.fromTo(content,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: EASE_ENTER },
        '-=0.2'
      );
    }

    var visual = hero.querySelector('.hero__visual');
    if (visual) {
      tl.fromTo(visual,
        { opacity: 0, x: 30, scale: 0.97 },
        { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: EASE_ENTER },
        '-=0.4'
      );
    }

    var actions = hero.querySelector('.hero__actions');
    if (actions) {
      tl.fromTo(actions,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE_ENTER },
        '-=0.4'
      );
    }

    var proof = hero.querySelector('.hero__proof');
    if (proof) {
      tl.fromTo(proof,
        { opacity: 0, y: 10, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: EASE_ENTER },
        '-=0.2'
      );
    }

    var bottom = hero.querySelector('.hero__bottom');
    if (bottom) {
      tl.fromTo(bottom,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );
    }

    var wfLines = hero.querySelectorAll('.wf-line');
    if (wfLines.length) {
      wfLines.forEach(function (line) {
        var length = line.getTotalLength ? line.getTotalLength() : 200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.2,
          delay: 0.8 + Math.random() * 0.4,
          ease: EASE_MOVE
        });
      });
    }
  }

  /* ── Subpage Hero (SplitText on H1) ── */
  function initSubpageHero() {
    var heroes = gsap.utils.toArray('.subpage-hero');
    heroes.forEach(function (hero) {
      var header = hero.querySelector('.section-header');
      if (header) gsap.set(header, { opacity: 1 });

      var h1 = hero.querySelector('h1');
      if (h1 && hasSplitText) {
        var split = SplitText.create(h1, {
          type: 'words',
          aria: 'auto'
        });
        gsap.from(split.words, {
          opacity: 0, y: 20, stagger: 0.035, duration: 0.55, ease: EASE_ENTER
        });
      } else if (h1) {
        gsap.fromTo(h1,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: EASE_ENTER }
        );
      }

      var eyebrow = hero.querySelector('.eyebrow');
      if (eyebrow) {
        gsap.fromTo(eyebrow,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: EASE_ENTER }
        );
      }

      var lead = hero.querySelector('.section-header__lead');
      if (lead) {
        gsap.fromTo(lead,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: EASE_ENTER }
        );
      }
    });
  }

  /* ── 3D Card Tilt (mouse-follow) ── */
  function initCardTilt() {
    var cards = document.querySelectorAll('.card--module, .card--consequence');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 6,
          duration: 0.4,
          ease: EASE_MOVE,
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: EASE_MOVE
        });
      });
    });
  }

  /* ── Section Headers with SplitText ── */
  function initSectionHeaders() {
    gsap.utils.toArray('.section-header.gs-reveal').forEach(function (header) {
      if (header.closest('.subpage-hero')) return;
      gsap.set(header, { opacity: 1 });

      var eyebrow = header.querySelector('.eyebrow');
      if (eyebrow) {
        gsap.fromTo(eyebrow,
          { opacity: 0, y: 10 },
          {
            opacity: 1, y: 0, duration: 0.4, ease: EASE_ENTER,
            scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }

      var h2 = header.querySelector('h2');
      if (h2 && hasSplitText) {
        var split = SplitText.create(h2, {
          type: 'lines, words',
          linesClass: 'split-line',
          mask: 'lines',
          aria: 'auto'
        });

        gsap.from(split.lines, {
          y: '100%',
          opacity: 0,
          stagger: 0.07,
          duration: 0.65,
          ease: EASE_ENTER,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      } else if (h2) {
        gsap.fromTo(h2,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: EASE_ENTER,
            scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }

      var lead = header.querySelector('.section-header__lead');
      if (lead) {
        gsap.fromTo(lead,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0, duration: 0.55, delay: 0.15,
            ease: EASE_ENTER,
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
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.65,
          ease: EASE_ENTER,
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
        { opacity: 0.1 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2
          }
        }
      );
    });

    var painSvg = section.querySelector('.pain-story__illustration');
    if (painSvg && hasDrawSVG) {
      var strokes = painSvg.querySelectorAll('[stroke]');
      if (strokes.length) {
        gsap.from(strokes, {
          drawSVG: '0%',
          stagger: 0.12,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: painSvg,
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: 1.2
          }
        });
      }
    } else if (painSvg) {
      gsap.fromTo(painSvg,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: painSvg, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ── Cards with Staggered Scale Entrance ── */
  function initCards() {
    var consequenceCards = gsap.utils.toArray('.consequences__grid .card');
    if (consequenceCards.length) {
      gsap.fromTo(consequenceCards,
        { opacity: 0, y: 32, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.08, duration: 0.6, ease: EASE_ENTER,
          scrollTrigger: { trigger: consequenceCards[0].parentElement, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    var svgIcons = document.querySelectorAll('.consequences__grid .card__icon svg [stroke]');
    if (svgIcons.length && hasDrawSVG) {
      gsap.from(svgIcons, {
        drawSVG: '0%',
        duration: 0.8,
        stagger: 0.08,
        ease: EASE_MOVE,
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
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.08, duration: 0.65, ease: EASE_ENTER,
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
        { opacity: 0, scale: 0.94, y: 24 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.9, ease: EASE_ENTER,
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );
    }

    var text = section.querySelector('.founder__text');
    if (text) {
      gsap.fromTo(text,
        { opacity: 0, x: 24 },
        {
          opacity: 1, x: 0, duration: 0.8, delay: 0.15, ease: EASE_ENTER,
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
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
      { opacity: 0, y: 28, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.7, ease: EASE_ENTER,
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    var checkmarks = grid.querySelectorAll('.transformation__col--after .check-list__icon polyline');
    if (checkmarks.length && hasDrawSVG) {
      gsap.from(checkmarks, {
        drawSVG: '0%',
        duration: 0.5,
        stagger: 0.1,
        ease: EASE_MOVE,
        scrollTrigger: { trigger: '.transformation', start: 'top 65%', toggleActions: 'play none none none' }
      });
    }
  }

  /* ── Comparison Section ── */
  function initComparison() {
    var grid = document.querySelector('.comparison__grid');
    if (!grid) return;

    var cols = grid.querySelectorAll('.comparison__col');
    gsap.fromTo(cols,
      { opacity: 0, y: 28, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.65, ease: EASE_ENTER,
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );

    var items = grid.querySelectorAll('.comparison__list li');
    if (items.length) {
      gsap.fromTo(items,
        { opacity: 0, x: -12 },
        {
          opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: EASE_ENTER,
          scrollTrigger: { trigger: grid, start: 'top 78%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ── Process Timeline ── */
  function initTimeline() {
    var timeline = document.querySelector('.process__timeline');
    if (!timeline) return;

    var isHorizontal = window.matchMedia('(min-width: 1024px)').matches;
    var lineFill = timeline.querySelector('.process__line-fill');

    if (lineFill) {
      if (isHorizontal) {
        gsap.fromTo(lineFill,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1
            }
          }
        );
      } else {
        gsap.fromTo(lineFill,
          { scaleY: 0, transformOrigin: 'top center' },
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
    }

    var steps = gsap.utils.toArray('.process-step');
    steps.forEach(function (step, i) {
      var dot = step.querySelector('.process-step__dot');
      var content = step.querySelector('.process-step__content');

      if (dot) {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.45,
            ease: EASE_SNAP,
            scrollTrigger: {
              trigger: step,
              start: 'top 78%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (content) {
        gsap.fromTo(content,
          { opacity: 0, y: 24, rotateX: isHorizontal ? 6 : 0 },
          {
            opacity: 1, y: 0, rotateX: 0, duration: 0.65,
            delay: i * 0.08,
            ease: EASE_ENTER,
            transformPerspective: 600,
            scrollTrigger: {
              trigger: step,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    if (hasDrawSVG) {
      var stepIcons = timeline.querySelectorAll('.process-step__icon svg [stroke]');
      stepIcons.forEach(function (el) {
        gsap.from(el, {
          drawSVG: '0%',
          duration: 0.9,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el.closest('.process-step'),
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        });
      });
    }
  }

  /* ── Calculator ── */
  function initCalculator() {
    var calc = document.querySelector('.calculator');
    if (!calc) return;

    var grid = calc.querySelector('.calculator__grid');
    var results = calc.querySelector('.calculator__results');
    var donutFill = calc.querySelector('.donut-chart__fill');

    if (grid) {
      gsap.fromTo(grid,
        { opacity: 0, y: 32, rotateX: 4, transformPerspective: 800 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.9,
          ease: EASE_ENTER,
          scrollTrigger: { trigger: calc, start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    }

    if (donutFill) {
      gsap.fromTo(donutFill,
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        {
          scale: 1, opacity: 1,
          duration: 0.7,
          ease: EASE_SNAP,
          scrollTrigger: { trigger: results || calc, start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    }

    if (results) {
      results.addEventListener('mousemove', function (e) {
        var rect = results.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        results.style.setProperty('--mouse-x', x + '%');
        results.style.setProperty('--mouse-y', y + '%');
      });

      gsap.to(results, {
        rotateY: 0, rotateX: 0,
        scrollTrigger: {
          trigger: results,
          start: 'top 90%',
          end: 'top 45%',
          scrub: 1,
          onUpdate: function (self) {
            var p = self.progress;
            var tiltX = (1 - p) * 4;
            gsap.set(results, { rotateX: tiltX, transformPerspective: 800 });
          }
        }
      });
    }

    var amountValue = calc.querySelector('.calculator__amount-value');
    if (amountValue) {
      var targetText = amountValue.textContent.trim();
      var targetNum = parseFloat(targetText.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(targetNum)) {
        var counter = { val: 0 };
        gsap.to(counter, {
          val: targetNum,
          duration: 1.8,
          ease: EASE_MOVE,
          scrollTrigger: {
            trigger: amountValue,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          onUpdate: function () {
            amountValue.textContent = Math.round(counter.val).toLocaleString('de-DE');
          }
        });
      }
    }
  }

  /* ── Modules (DrawSVG on card icons) ── */
  function initModules() {
    var grid = document.querySelector('.modules__grid');
    if (!grid) return;

    var cardIcons = grid.querySelectorAll('.card__icon svg [stroke]');
    if (cardIcons.length && hasDrawSVG) {
      gsap.from(cardIcons, {
        drawSVG: '0%',
        duration: 0.8,
        stagger: 0.05,
        ease: EASE_MOVE,
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  /* ── DSGVO ── */
  function initDSGVO() {
    var section = document.querySelector('.dsgvo');
    if (!section) return;

    var items = section.querySelectorAll('.dsgvo__item');
    if (!items.length) return;

    items.forEach(function (item, i) {
      var wrapper = item.querySelector('.dsgvo__anim-wrapper');
      if (!wrapper) return;

      var icon = wrapper.querySelector('svg');
      if (!icon) return;

      gsap.fromTo(icon,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.55,
          delay: i * 0.1,
          ease: EASE_SNAP,
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );

      if (hasDrawSVG) {
        var strokes = icon.querySelectorAll('[stroke]:not([stroke="none"])');
        strokes.forEach(function (el, j) {
          gsap.from(el, {
            drawSVG: '0%',
            duration: 0.7,
            delay: i * 0.1 + j * 0.08 + 0.15,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          });
        });
      }
    });
  }

  /* ── Testimonial ── */
  function initTestimonial() {
    var card = document.querySelector('.testimonial__card');
    if (!card) return;

    gsap.fromTo(card,
      { opacity: 0, y: 24, scale: 0.98 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE_ENTER,
        scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── FAQ ── */
  function initFAQ() {
    var items = gsap.utils.toArray('.accordion__item');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, y: 12 },
      {
        opacity: 1, y: 0, stagger: 0.05, duration: 0.45, ease: EASE_ENTER,
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: 'top 82%',
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
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1, scale: 1, duration: 0.65, ease: EASE_ENTER,
        scrollTrigger: { trigger: magnet, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Final CTA ── */
  function initFinalCTA() {
    var section = document.querySelector('.final-cta');
    if (!section) return;

    var heading = section.querySelector('h2');
    if (heading && hasSplitText) {
      var splitCTA = SplitText.create(heading, {
        type: 'words',
        aria: 'auto'
      });
      gsap.from(splitCTA.words, {
        opacity: 0, y: 20, stagger: 0.03, duration: 0.55, ease: EASE_ENTER,
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' }
      });
    }

    var btn = section.querySelector('.btn--glow-pulse');
    if (btn) {
      gsap.fromTo(btn,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.55, ease: EASE_ENTER,
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
          ease: EASE_MOVE,
          snap: { innerText: 1 },
          delay: 1.0,
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
          ease: EASE_MOVE,
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

  /* ── Section Parallax ── */
  function initParallax() {
    var sections = gsap.utils.toArray('.section, .hero, .calculator, .dsgvo, .faq-section, .final-cta');
    sections.forEach(function (section) {
      var header = section.querySelector('.section-header');
      if (header) {
        gsap.to(header, {
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      }

      var bg = section.querySelector('.hero__bg, .bg-glow');
      if (bg) {
        gsap.to(bg, {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2
          }
        });
      }
    });
  }

  /* ── Subtle 3D on Section Transitions ── */
  function initSectionTransitions() {
    var sections = gsap.utils.toArray('main > section, main > .section');
    sections.forEach(function (section, i) {
      if (i === 0) return;
      gsap.fromTo(section,
        { rotateX: 1.5, transformPerspective: 1200, transformOrigin: 'center top' },
        {
          rotateX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            end: 'top 65%',
            scrub: 1
          }
        }
      );
    });
  }

  /* ── Init ── */
  function init() {
    initHero();
    initSubpageHero();
    initCounters();
    initWordRotator();
    initSectionHeaders();
    initScrollReveals();
    initPainStory();
    initCards();
    initCardTilt();
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
    initParallax();
    initSectionTransitions();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
