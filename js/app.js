/* ═══════════════════════════════════════════════════════════
   KI-Prozessnavigator — App Core
   Navigation, Accordion, Scroll, Tracking
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme Toggle ── */
  function getPreferredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initThemeToggle();

  /* ── Header Scroll State ── */
  var header = document.getElementById('header');
  var lastScroll = 0;
  var scrollThreshold = 50;

  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    if (y > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile Navigation ── */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Menu schliessen' : 'Menu offnen');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active Nav Link ── */
  var navLinks = document.querySelectorAll('.nav__link');
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var content = document.getElementById(trigger.getAttribute('aria-controls'));
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', String(!isOpen));
      trigger.parentElement.classList.toggle('is-open', !isOpen);

      if (isOpen) {
        content.setAttribute('hidden', '');
      } else {
        content.removeAttribute('hidden');
      }
    });
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ── Scroll-to-Top Button ── */
  var scrollBtn = document.getElementById('scroll-to-top');

  if (scrollBtn) {
    var showThreshold = 500;

    function toggleScrollBtn() {
      if (window.scrollY > showThreshold) {
        scrollBtn.classList.add('is-visible');
      } else {
        scrollBtn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggleScrollBtn, { passive: true });
    toggleScrollBtn();

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mouse Spotlight (Desktop only) ── */
  if (window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', function (e) {
      document.body.style.setProperty('--mouse-x', e.clientX + 'px');
      document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    }, { passive: true });
  }

  /* ── GTM DataLayer Helpers ── */
  window.dataLayer = window.dataLayer || [];

  document.querySelectorAll('.btn-primary, .btn--glow-pulse').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.dataLayer.push({
        event: 'cta_click',
        cta_text: btn.textContent.trim(),
        cta_url: btn.getAttribute('href') || ''
      });
    });
  });

  /* ── Include Loader (SSI fallback for local dev) ── */
  document.querySelectorAll('main').forEach(function () {
    var comments = [];
    var walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT, null, false);
    while (walker.nextNode()) {
      var val = walker.currentNode.nodeValue.trim();
      if (val.indexOf('#include virtual=') === 0) {
        comments.push(walker.currentNode);
      }
    }

    comments.forEach(function (comment) {
      var match = comment.nodeValue.match(/virtual="([^"]+)"/);
      if (!match) return;

      fetch(match[1])
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          if (!html) return;
          var temp = document.createElement('div');
          temp.innerHTML = html;
          while (temp.firstChild) {
            comment.parentNode.insertBefore(temp.firstChild, comment);
          }
          comment.parentNode.removeChild(comment);

          if (html.indexOf('id="header"') !== -1) {
            header = document.getElementById('header');
            navToggle = document.getElementById('nav-toggle');
            navMenu = document.getElementById('nav-menu');
            if (navToggle && navMenu) {
              navToggle.addEventListener('click', function () {
                var isOpen = navMenu.classList.toggle('is-open');
                navToggle.classList.toggle('is-open', isOpen);
                navToggle.setAttribute('aria-expanded', String(isOpen));
                document.body.style.overflow = isOpen ? 'hidden' : '';
              });
            }
            initThemeToggle();
          }

          if (html.indexOf('scroll-to-top') !== -1) {
            scrollBtn = document.getElementById('scroll-to-top');
            if (scrollBtn) {
              toggleScrollBtn();
              scrollBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }
          }
        })
        .catch(function () {});
    });
  });
})();
