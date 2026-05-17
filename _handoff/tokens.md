# Design Tokens — Referenz

Alle Variablen sind in `styles.css` unter `:root` (Light Mode) und `[data-theme="dark"]` (Dark Mode) definiert. **Niemals Hex-Codes oder Pixel-Werte hardcoden — immer die Variable nutzen.**

---

## 1. Typografie

| Variable | Wert (Default) | Wofür |
|---|---|---|
| `--font-display` | `"Geist", "Inter", system-ui, sans-serif` | Headlines, Buttons, große Zahlen |
| `--font-body` | `"Geist", "Inter", system-ui, sans-serif` | Fließtext |
| `--font-mono` | `"JetBrains Mono", "Geist Mono", ui-monospace` | Eyebrows, Codes, Labels, Zahlen-Sublabels |

**Type-Klassen** (statt `font-size` selbst zu setzen):
- `.h-display` — Hero-Headline (clamp 44–84 px)
- `.h-section` — Sektion-Headline (clamp 36–60 px)
- `.lede` — Intro-Absatz unter Headline (17–18 px, max 60ch)
- `.eyebrow` — Mini-Label über Headline (Mono, 12 px, uppercase)

---

## 2. Farben

### Akzent (eine Zeile ändern → ganze Site folgt)

| Variable | Default | Wirkung |
|---|---|---|
| `--accent-h` | `240` (Indigo) | Primärer Hue. **Nur Zahl, kein `deg`.** |
| `--accent-h2` | `195` (Cyan) | Sekundär-Hue für Gradient |
| `--accent` | `oklch(0.62 0.22 var(--accent-h))` | Buttons, Links, Highlights |
| `--accent-2` | `oklch(0.78 0.18 var(--accent-h2))` | Gradient-Endpunkt |
| `--accent-soft` | `oklch(... / 0.12)` | Background-Tint, Selection |
| `--accent-grad` | `linear-gradient(135deg, accent → accent-2)` | Logo, CTA-Buttons, Headlines |

**Vordefinierte Paletten** (in `app.jsx` → `ACCENTS`):
- Indigo · Cyan: `--accent-h: 240`, `--accent-h2: 195`
- Violet · Indigo: `--accent-h: 285`, `--accent-h2: 260`
- Cyan · Mint: `--accent-h: 200`, `--accent-h2: 170`
- Amber · Orange: `--accent-h: 55`, `--accent-h2: 30`

### Background / Surface

| Variable | Light | Dark | Wofür |
|---|---|---|---|
| `--bg` | `oklch(0.985 ...)` | `oklch(0.13 ...)` | Body-Background |
| `--bg-2` | hellgrau | dunkelgrau | Sektion-Wechsel |
| `--bg-3` | – | – | Tiefste Background-Stufe |
| `--surface` | `#ffffff` | `oklch(0.18 ...)` | Cards, Panels, Buttons-BG |
| `--surface-2` | `oklch(0.975 ...)` | `oklch(0.21 ...)` | Erhöhte Cards mit Sheen |

### Borders & Text

| Variable | Wofür |
|---|---|
| `--border` | Standard Card- & Input-Border |
| `--border-strong` | Hover-Border, Focus-Ring |
| `--fg` | Haupttext (max. Kontrast) |
| `--fg-2` | Sekundärtext (Lede, Beschreibungen) |
| `--fg-3` | Muted (Captions, Labels) |

### Schatten

| Variable | Wofür |
|---|---|
| `--shadow-sm` | Subtile Card-Erhebung |
| `--shadow-md` | Standard-Card-Hover |
| `--shadow-lg` | Modal, Floating-Panel |
| `--shadow-glow` | Akzent-Glow (CTA-Hover, Hero-Visual) |

---

## 3. Geometrie / Radien

| Variable | Wert | Wofür |
|---|---|---|
| `--r-xs` | 6 px | Mini-Pills, Badges |
| `--r-sm` | 8 px | Inputs, kleine Buttons |
| `--r-md` | 12 px | Standard-Buttons, Tabs |
| `--r-lg` | 16 px | Cards, Panels |
| `--r-xl` | 24 px | Große Hero-Visuals, Cards mit Statement |
| `--r-2xl` | 32 px | Final-CTA-Block, ROI-Output |
| `--r-pill` | 999 px | Pills, Tags, Eyebrow |

---

## 4. Layout

| Variable | Wert | Wofür |
|---|---|---|
| `--max-w` | `1240px` | Container max-width |
| `--gutter` | `clamp(16px, 4vw, 48px)` | Container horizontaler Padding |

**Wichtig:** Kein eigener `max-width` auf Sections — immer `<div class="container">` als Wrapper innerhalb der Section.

---

## 5. Breakpoints (Mobile-first wäre besser, aktuell Desktop-first)

| Breakpoint | Geräte | Was passiert |
|---|---|---|
| `≤ 980 px` | Tablet | 2-spaltige Grids → 1 Spalte; Headlines schrumpfen |
| `≤ 720 px` | Mobile | Burger-Menü; Hero-Stats 2-spaltig; CTAs full-width |
| `≤ 600 px` | Schmal | Steps-Grid → 1 Spalte |
| `≤ 380 px` | Mini-Phone | Hero-Stats 1-spaltig; Footer 1-spaltig |
| `(hover: none)` | Touch | 44 px Mindest-Hit-Target |

---

## 6. Theming wechseln

```html
<!-- Light Mode (Default) -->
<html data-theme="light">

<!-- Dark Mode -->
<html data-theme="dark">
```

JS-Toggle:
```js
document.documentElement.dataset.theme = 'dark';
```

Akzentfarbe live wechseln:
```js
document.documentElement.style.setProperty('--accent-h', 285);
document.documentElement.style.setProperty('--accent-h2', 260);
```
