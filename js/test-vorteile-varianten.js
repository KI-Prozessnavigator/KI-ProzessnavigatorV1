/**
 * Varianten-Labor – isolierte Interaktionen
 * - Variante B: Tabs/Panel
 * - Variante C: Modal mit Fokus-Management
 * - Variante D: Scrollytelling Step Indicator
 * - Variante E: Diagnose-Card Stepper
 */

'use strict';

function qs(root, sel) { return (root || document).querySelector(sel); }
function qsa(root, sel) { return Array.from((root || document).querySelectorAll(sel)); }

// ==========================================================
// Variante B: Tabs + Panel
// ==========================================================

const TAB_DATA = {
  a: {
    title: 'Fachkräfte in Administrationsschleifen',
    meta: 'Messbarer Verlust: 8–12 Stunden pro Mitarbeiter und Woche.',
    text: 'Vertriebsmitarbeiter pflegen CRM-Felder manuell. Buchhalter kopieren Rechnungsdaten zwischen Systemen. Controller erstellen Reports aus fünf Excel-Dateien.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  },
  b: {
    title: 'Datenschutzbedenken als Innovationsbremse',
    meta: 'Konsequenz: Wettbewerber automatisieren bereits.',
    text: 'Die Rechtsabteilung blockiert KI-Projekte mit Verweis auf DSGVO-Risiken. Verständlich – 73 % der deutschen Unternehmen nennen Compliance als Haupthürde für KI-Adoption (Bitkom, 2024).',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  },
  c: {
    title: 'KI-Tools ohne Systemanbindung',
    meta: 'Ergebnis: Investition ohne Prozesseffekt.',
    text: 'Lizenzen für ChatGPT, Copilot oder spezialisierte Tools sind vorhanden. Aber: keine API-Verbindung zu CRM, ERP oder Buchhaltung. Mitarbeiter exportieren, kopieren, importieren – manuell.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
  }
};

function initVariantBTabs() {
  const root = qs(document, '[data-tabs-root]');
  if (!root) return;

  const tabs = qsa(root, '.vTab');
  const titleEl = qs(root, '[data-panel-title]');
  const metaEl = qs(root, '[data-panel-meta]');
  const textEl = qs(root, '[data-panel-text]');
  const iconEl = qs(root, '[data-panel-icon]');

  function setActive(key) {
    const data = TAB_DATA[key];
    if (!data) return;

    tabs.forEach(btn => {
      const isActive = btn.dataset.tab === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.tabIndex = isActive ? 0 : -1;
    });

    if (titleEl) titleEl.textContent = data.title;
    if (metaEl) metaEl.textContent = data.meta;
    if (textEl) textEl.textContent = data.text;
    if (iconEl) iconEl.innerHTML = data.icon;
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.tab));
    btn.addEventListener('keydown', (e) => {
      const currentIndex = tabs.indexOf(btn);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(currentIndex + 1) % tabs.length];
        next.focus();
        setActive(next.dataset.tab);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        prev.focus();
        setActive(prev.dataset.tab);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        setActive(tabs[0].dataset.tab);
      }
      if (e.key === 'End') {
        e.preventDefault();
        const last = tabs[tabs.length - 1];
        last.focus();
        setActive(last.dataset.tab);
      }
    });
  });

  setActive('a');
}

// ==========================================================
// Variante C: Modal (Fokus rein/raus, ESC, Click-outside)
// ==========================================================

function initVariantCModal() {
  const root = qs(document, '[data-modal-root]');
  if (!root) return;

  const modalWrap = qs(root, '.vModal');
  if (!modalWrap) return;

  const dialog = qs(modalWrap, '.vModal__dialog');
  const closeTriggers = qsa(modalWrap, '[data-modal-close]');
  const titleEl = qs(modalWrap, '#vmodal-title');
  const metaEl = qs(modalWrap, '#vmodal-meta');
  const descEl = qs(modalWrap, '#vmodal-desc');

  const openCards = qsa(root, '[data-modal-open]');

  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastActiveEl = null;
  let isOpen = false;

  function getFocusable() {
    return qsa(dialog, FOCUSABLE).filter(el => el.offsetParent !== null);
  }

  function open(card) {
    if (!card) return;

    lastActiveEl = document.activeElement;
    isOpen = true;

    if (titleEl) titleEl.textContent = card.getAttribute('data-title') || '';
    if (metaEl) metaEl.textContent = card.getAttribute('data-meta') || '';
    if (descEl) descEl.textContent = card.getAttribute('data-text') || '';

    modalWrap.hidden = false;
    modalWrap.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusables = getFocusable();
    (focusables[0] || dialog).focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    modalWrap.hidden = true;
    modalWrap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveEl && typeof lastActiveEl.focus === 'function') {
      lastActiveEl.focus();
    }
    lastActiveEl = null;
  }

  openCards.forEach(card => {
    const btn = qs(card, '.vCard__more');
    const openHandler = () => open(card);
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); openHandler(); });
    card.addEventListener('click', (e) => {
      // Avoid double-trigger: if user clicked a link/button inside card.
      if (e.target && (e.target.closest && e.target.closest('button'))) return;
      openHandler();
    });
  });

  closeTriggers.forEach(el => el.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusables = getFocusable();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || active === dialog) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Ensure dialog is focusable.
  if (dialog && !dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
}

// ==========================================================
// Variante D: Scrollytelling Step Indicator (IntersectionObserver)
// ==========================================================

function initVariantDStory() {
  const root = qs(document, '[data-scroll-story]');
  if (!root) return;

  const scenes = qsa(root, '.vD__scene[data-scene]');
  const indicators = qsa(root, '.vD__step[data-step-indicator]');
  if (scenes.length === 0 || indicators.length === 0) return;

  function setActive(sceneId) {
    indicators.forEach(li => {
      li.classList.toggle('is-active', li.dataset.stepIndicator === String(sceneId));
    });
  }

  // Fallback: set first active
  setActive(1);

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    // choose the most visible intersecting scene
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => (b.intersectionRatio - a.intersectionRatio));
    if (visible.length === 0) return;
    const id = visible[0].target.getAttribute('data-scene');
    if (id) setActive(id);
  }, {
    root: null,
    threshold: [0.25, 0.4, 0.6, 0.8]
  });

  scenes.forEach(scene => observer.observe(scene));
}

// ==========================================================
// Variante E: Diagnose-Card Stepper
// ==========================================================

const STEPPER_DATA = {
  a: {
    title: 'Fachkräfte in Administrationsschleifen',
    meta: 'Messbarer Verlust: ca. 15h Routinearbeit pro Mitarbeiter/Woche.',
    problem: 'Manuelle Übergaben kosten Zeit: CRM-Felder pflegen, Rechnungsdaten übertragen, Reports aus Excel zusammensuchen – jede Woche wieder.',
    fix: [
      'Prozess-Mapping: Wo entstehen manuelle Übergaben?',
      'Systemanbindung (CRM/ERP/Buchhaltung) via API/Automations',
      'Automatisierte Übergabe + Monitoring'
    ],
    kpis: [
      { before: '15h', after: '4–5h', label: 'Routinearbeit pro Mitarbeiter/Woche' }
    ],
    icon: TAB_DATA.a.icon
  },
  b: {
    title: 'KI-Tools ohne Systemanbindung',
    meta: 'Ergebnis: Technologie-Investition ohne Prozesseffekt.',
    problem: 'Tools sind da – aber ohne API-Verbindung bleibt es bei Export → Copy → Import. Das fühlt sich nach Fortschritt an, ist aber Mehrarbeit.',
    fix: [
      'Priorisierte Integrations-Roadmap (Quick Wins zuerst)',
      'End‑to‑End Automations: Input → Verarbeitung → Zielsystem',
      'Qualitätschecks + Ownership (wer überwacht was?)'
    ],
    kpis: [
      { before: '20%', after: '65%', label: 'Zeit für Kundenbetreuung' }
    ],
    icon: TAB_DATA.c.icon
  },
  c: {
    title: 'Datenschutzbedenken als Innovationsbremse',
    meta: 'Konsequenz: Projekte werden gestoppt oder nie gestartet.',
    problem: 'Compliance ist richtig – aber ohne klares DSGVO-Setup bleibt nur „Nein“ als sichere Antwort. Das bremst Innovation und Umsetzung.',
    fix: [
      'Datenflüsse klar dokumentieren (was, wohin, warum)',
      'DSGVO-konforme Architektur & Berechtigungen',
      'Hosting in DE + Lösch-/Audit-Konzept'
    ],
    kpis: [
      { before: 'Risiko', after: '0', label: 'DSGVO-Verstöße / Jahr (Zielbild)' }
    ],
    icon: TAB_DATA.b.icon
  }
};

function initVariantEStepper() {
  const root = qs(document, '[data-stepper-root]');
  if (!root) return;

  const segs = qsa(root, '.vSeg[data-step]');
  const titleEl = qs(root, '[data-stepper-title]');
  const metaEl = qs(root, '[data-stepper-meta]');
  const problemEl = qs(root, '[data-stepper-problem]');
  const fixEl = qs(root, '[data-stepper-fix]');
  const kpiEl = qs(root, '[data-stepper-kpi]');
  const iconEl = qs(root, '[data-stepper-icon]');

  function setActive(key) {
    const data = STEPPER_DATA[key];
    if (!data) return;

    segs.forEach(btn => {
      const isActive = btn.dataset.step === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.tabIndex = isActive ? 0 : -1;
    });

    if (titleEl) titleEl.textContent = data.title;
    if (metaEl) metaEl.textContent = data.meta;
    if (problemEl) problemEl.textContent = data.problem;
    if (iconEl) iconEl.innerHTML = data.icon || '';

    if (fixEl) {
      fixEl.innerHTML = '';
      data.fix.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        fixEl.appendChild(li);
      });
    }

    if (kpiEl) {
      kpiEl.innerHTML = '';
      data.kpis.forEach(kpi => {
        const div = document.createElement('div');
        div.className = 'vKpi';
        if (kpi.before !== undefined && kpi.after !== undefined) {
          div.innerHTML = `<span class="vKpi__values"><span class="vKpi__before">${kpi.before}</span><span class="vKpi__arrow" aria-hidden="true">→</span><span class="vKpi__after">${kpi.after}</span></span><small>${kpi.label}</small>`;
        } else if (kpi.value !== undefined) {
          div.innerHTML = `${kpi.value}<small>${kpi.label}</small>`;
        } else {
          div.innerHTML = `<small>${kpi.label}</small>`;
        }
        kpiEl.appendChild(div);
      });
    }
  }

  segs.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.step));
  });

  setActive('a');
}

// ==========================================================
// Init
// ==========================================================

function initVariantLab() {
  initVariantBTabs();
  initVariantCModal();
  initVariantDStory();
  initVariantEStepper();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVariantLab);
} else {
  initVariantLab();
}

