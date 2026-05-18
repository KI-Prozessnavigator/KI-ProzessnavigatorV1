# Handoff → Aktiv-CSS: Token- & Klassen-Mapping

> **Pflichtlektüre für Cursor**, wenn du eine Komponente aus `_handoff/` übernimmst.
>
> **Direktive:** Das Handoff ist DESIGN-REFERENZ. Du übersetzt Handoff-Werte in unsere existierenden Tokens und Klassen.
> NIEMALS umgekehrt: Wir passen weder `tokens.css` noch `base.css` an, nur weil das Handoff andere Variablen nutzt.
> Wenn ein Handoff-Wert keine direkte Entsprechung hat, wähle die nächstbeste Variable aus unserer Skala.

---

## 🎨 Token-Mapping (Handoff-Variable → unsere Variable)

### Akzent
| Handoff-Variable | Unsere Variable | Anmerkung |
|---|---|---|
| `--accent-h: 240` (Indigo) | `--accent-h: 220` (Blau) | Wir bleiben bei Blau |
| `--accent-h2: 195` (Cyan) | `--accent-h2: 155` (Grün) | Wir bleiben bei Grün |
| `--accent` | `--accent` | identisch |
| `--accent-2` | `--accent2` *(ohne Bindestrich)* | unsere Schreibweise |
| `--accent-soft` | `--accent-dim` | Tint mit niedriger Opazität |
| `--accent-grad` | `--accent-grad` | ✅ vorhanden in tokens.css |

### Text
| Handoff-Variable | Unsere Variable |
|---|---|
| `--fg` | `--fg` |
| `--fg-2` | `--fg-muted` |
| `--fg-3` | `--fg-faint` |

### Border
| Handoff-Variable | Unsere Variable |
|---|---|
| `--border` | `--border` |
| `--border-strong` | `--border-focus` |

> Wir haben zusätzlich `--border-dim` für sehr dezente Trennlinien — kein Handoff-Pendant nötig.

### Surface / Background
| Handoff-Variable | Unsere Variable |
|---|---|
| `--bg`, `--bg-2`, `--bg-3` | `--bg`, `--bg-2`, `--bg-3` (identisch) |
| `--surface`, `--surface-2` | `--surface`, `--surface-2` (identisch) |

### Schatten
| Handoff-Variable | Unsere Variable |
|---|---|
| `--shadow-sm` | `--shadow-sm` |
| `--shadow-md` | `--shadow-md` |
| `--shadow-lg` | `--shadow-lg` |
| `--shadow-glow` | `--shadow-accent` |

> Wir haben zusätzlich `--shadow-xl` für Modals — kein Handoff-Pendant.

### Radien — ⚠️ Achtung: andere Pixelwerte unter ähnlichen Namen!
**Mapping nach PIXELWERT, nicht nach Variablennamen:**

| Handoff-Pixelwert | Unsere Variable |
|---|---|
| 6 px (`--r-xs` im Handoff) | `--r-sm` (4 px) — nächstkleinere Stufe |
| 8 px (`--r-sm` im Handoff) | `--r-md` (8 px) |
| 12 px (`--r-md` im Handoff) | `--r-lg` (12 px) |
| 16 px (`--r-lg` im Handoff) | `--r-xl` (16 px) |
| 24 px (`--r-xl` im Handoff) | `--r-2xl` (24 px) |
| 32 px (`--r-2xl` im Handoff) | `--r-3xl` (32 px) |
| 999 px (`--r-pill` im Handoff) | `--r-full` |

> **Regel:** Lies den tatsächlichen Pixelwert aus dem Handoff-CSS und finde unsere passende Variable über die Tabelle. Niemals den gleichen Variablennamen kopieren.

### Layout
| Handoff-Variable | Unsere Variable |
|---|---|
| `--max-w` (1240 px) | `--container-max` (1200 px) |
| `--gutter` clamp(16,4vw,48) | bereits in `.container` als `clamp(1.25rem, 5vw, 3rem)` (gleicher Wert) |

### Typografie
| Handoff-Variable | Unsere Variable |
|---|---|
| `--font-display`, `--font-body`, `--font-mono` | identisch übernehmbar |

---

## 🧱 Klassen-Mapping

### Headlines & Lead (alle in `base.css` vorhanden)
| Handoff-Klasse | Unsere Klasse | Verwendung |
|---|---|---|
| `.h-display` | `.h-display` | auf `<h1>` der Hero-Sektion |
| `.h-section` | `.h-section` | auf `<h2>` jeder Sektion |
| `.h-section--small` | `.h-section--small` | wenn kleinere Section-Headline gewünscht |
| `.lede` | `.lede` | Intro-Absatz unter der Headline (max 60ch) |
| `.eyebrow` | `.eyebrow` | Mini-Label über der Headline (mono, uppercase) |
| `.eyebrow .idx` | `.eyebrow .idx` | nummerierter Index-Pill innerhalb des Eyebrows |

### Buttons
| Handoff-Klasse | Unsere Klasse |
|---|---|
| `.btn` | `.btn` |
| `.btn-primary` | `.btn-primary` |
| `.btn-ghost` | `.btn-ghost` |
| `.btn-accent` *(Gradient-Variante)* | `.btn-primary` mit `background: var(--accent-grad)` als Inline-Anpassung im Komponenten-Block, ODER neue Modifier-Klasse `.btn-primary--grad` in components.css |
| `.btn-sm` | `.btn--sm` *(BEM-Modifier mit zwei Bindestrichen)* |

### Section-Wrapper
Handoff: `<section class="section"><div class="container">` → identisch übernehmbar.

### Card-Pattern (aus Handoff-STYLEGUIDE übersetzt in unsere Tokens)
```css
.card {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 60%);
  border-radius: var(--r-xl);                /* 16 px (= Handoff --r-lg) */
  padding: var(--space-6);                   /* 24 px */
  transition:
    border-color var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}
.card:hover {
  border-color: var(--border-focus);         /* = Handoff --border-strong */
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

---

## 📱 Mobile-First-Übersetzung — der wichtigste Schritt

**Das Handoff ist Desktop-First** (max-width-Queries: 980, 720, 600, 380 px).
**Unser Code ist Mobile-First** (min-width-Queries: 640, 880, 1024, 1280 px).

### Beim Übernehmen einer Komponente IMMER umkehren:

1. Identifiziere im Handoff den **Mobile-State** (= das, was in der kleinsten max-width-Query steht)
2. Mache diesen Mobile-State zur **Basis ohne `@media`** in components.css
3. Identifiziere den Desktop-State (= Werte oberhalb der Breakpoints im Handoff)
4. Hänge ihn als `@media (min-width: 1024px)` an die Komponente

### Breakpoint-Übersetzung
| Handoff (Desktop-First) | Unser Code (Mobile-First) |
|---|---|
| Basis (Desktop-Werte) | `@media (min-width: 1024px)` |
| `@media (max-width: 980px)` | Basis bis `@media (min-width: 1024px)` |
| `@media (max-width: 720px)` | Basis bis `@media (min-width: 880px)` |
| `@media (max-width: 600px)` | Basis bis `@media (min-width: 640px)` |
| `@media (max-width: 380px)` | Basis (kleinster Standard, kein eigenes @media nötig) |

### Konkretes Beispiel
**Handoff (Desktop-First):**
```css
.hero { padding: 96px 0; font-size: 84px; }
@media (max-width: 720px) {
  .hero { padding: 48px 0; font-size: 44px; }
}
```

**Aktiv-CSS (korrekt umgekehrt):**
```css
.hero {
  padding-block: var(--space-12);              /* 48 px Mobile-Basis */
}
.hero__title { /* nutzt .h-display aus base.css */ }

@media (min-width: 880px) {
  .hero { padding-block: var(--space-24); }    /* 96 px ab Tablet/Desktop */
}
```

---

## 🚫 Was NICHT übernommen wird

- **Google Fonts CDN** im Handoff-README → wir nutzen self-hosted WOFF2 (siehe `base.css` `@font-face`)
- **`_overrides.css`** für Drittanbieter-Widgets (im Handoff-Styleguide erlaubt) → bei uns NICHT erlaubt (4-Datei-Regel)
- **React/JSX-Snippets** in `svg-visuals.md` → in Vanilla JS umsetzen oder als HTML+CSS-only mit SMIL/CSS-Animationen
- **Handoff-Akzentfarbe Indigo/Cyan** → wir bleiben bei Blau (220) / Grün (155)
- **Handoff-Desktop-First-Breakpoints** → IMMER zu Mobile-First umdrehen

---

## ✅ Checkliste vor Komponenten-Einbau

- [ ] Habe ich jede Handoff-Variable über die Mapping-Tabelle übersetzt?
- [ ] Habe ich Radien nach PIXELWERT gemappt, nicht nach Variablenname?
- [ ] Habe ich die Breakpoints von Desktop-First auf Mobile-First umgekehrt?
- [ ] Habe ich die Headline-Klassen `.h-display` / `.h-section` / `.lede` / `.eyebrow` aus base.css genutzt (statt eigene Font-Sizes zu setzen)?
- [ ] Komponenten-Header in `components.css` gesetzt?
- [ ] `prefers-reduced-motion` respektiert?
- [ ] Auf 390 px im DevTools getestet?
