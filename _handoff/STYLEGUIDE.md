# Styleguide für Cursor / KI-Assistenten

> **Lies das BEVOR du CSS oder neue Komponenten schreibst.**
> Dieser Styleguide ist das Gesetz für dieses Projekt. Brich keine Regel ohne expliziten Auftrag.

---

## Die 5 Kernregeln

### 1. **Niemals `!important`.**
Wenn du das Gefühl hast, du brauchst `!important`, ist 99 % der Zeit dein Selektor zu schwach oder du überschreibst die falsche Stelle. Lösung:
- Erweitere die existierende Klasse statt sie zu überschreiben
- Erhöhe die Spezifität minimal (`.section .card` statt `.card`)
- Nur **eine** Ausnahme: `_overrides.css` für Drittanbieter-Widgets, mit Kommentar warum.

### 2. **Niemals Hex-Codes oder feste Pixelwerte hardcoden.**
Falsch:
```css
.my-card { background: #fff; border: 1px solid #e5e5e5; padding: 16px; border-radius: 12px; }
```
Richtig:
```css
.my-card { background: var(--surface); border: 1px solid var(--border); padding: 16px; border-radius: var(--r-md); }
```
Wenn ein Token fehlt → in `:root` neu anlegen, nicht inline lösen.

### 3. **Komponenten-Klassen wiederverwenden, nicht neu erfinden.**
Bevor du `.my-button-blue` schreibst, prüfe:
- Button? → `.btn`, `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-sm`
- Headline? → `.h-display`, `.h-section`
- Mini-Label? → `.eyebrow`
- Card? → kopiere Struktur von `.pain-card` oder `.bento .cell`
- Section? → `<section class="section"><div class="container">…`

Nur wenn nichts passt → neue Klasse in passender Sektion in `styles.css` (siehe Inhaltsverzeichnis oben in der Datei).

### 4. **Inline-Styles nur für dynamische Werte.**
✅ Erlaubt: `style={{ transform: \`translateX(\${x}px)\` }}` (JS-getrieben)
❌ Verboten: `style="color: blue; padding: 12px"` (statisch)

Statische Styles → CSS-Klasse. Sonst kann das Design-System nichts mehr garantieren.

### 5. **Mobile zuerst denken.**
Es gibt schon Breakpoints für `≤ 980px`, `≤ 720px`, `≤ 600px`, `≤ 380px`. Wenn du eine neue Komponente baust:
- **Direkt überlegen**, wie sie auf 390 px aussieht
- Touch-Targets ≥ 44 px
- Kein horizontales Scrollen außer bewusst (Tabs, Marquee)
- Headlines mit `clamp()` statt fixed font-size

---

## Workflow-Regeln

### Wenn du eine neue Sektion baust:
1. Wrapper: `<section class="section" id="anker">`
2. Container: `<div class="container">`
3. Header-Block: `<div class="section-header"><div class="left"><span class="eyebrow"><span class="idx">XX</span>Label</span><h2 class="h-section">…</h2></div><p class="lede">…</p></div>`
4. Inhalt drunter

### Wenn du eine neue Card baust:
- Border: `1px solid var(--border)`
- Background: `linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 60%)`
- Border-Radius: `var(--r-lg)`
- Padding: `24px`
- Hover: `border-color: var(--border-strong); transform: translateY(-2px); box-shadow: var(--shadow-md)`
- Transition: `border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease`

### Wenn du Farbe brauchst:
- Akzent: `var(--accent)` oder `var(--accent-grad)`
- Standardtext: `var(--fg)`
- Sekundärtext: `var(--fg-2)`
- Muted: `var(--fg-3)`
- Niemals `color: black` oder `color: #333`.

### Wenn du Spacing brauchst:
Nutze 8-px-Grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128. Keine 13 px, 27 px etc.

### Wenn du Animationen brauchst:
- Hover-Transitions: `0.2s ease`
- Größere Bewegungen: `0.35s cubic-bezier(0.65, 0, 0.35, 1)`
- Scroll-Reveals: existieren schon — füge der Komponente einfach `class="reveal"` (oder lass den Observer in `app.jsx` automatisch erkennen)
- **Immer** `prefers-reduced-motion` respektieren

---

## Checkliste vor jedem Commit

- [ ] Kein `!important`
- [ ] Keine Hex-Codes außerhalb `:root`
- [ ] Keine festen Pixelwerte für Farben/Borders/Radien (nur Spacing okay)
- [ ] Mobile geprüft (Browser-DevTools auf 390 px)
- [ ] Dark Mode geprüft (Klassen funktionieren in beiden Themes)
- [ ] Touch-Targets ≥ 44 px auf Touch-Geräten
- [ ] Keine neuen Schriftarten ohne Update von `--font-display` / `--font-mono`

---

## Was ist NEU machen erlaubt?

✅ Neue Komponenten-Klasse in `styles.css` unter passender Sektion (mit `#ANKER`-Kommentar oben)
✅ Neue Variable in `:root` und `[data-theme="dark"]` (beide!) wenn ein semantisch neuer Wert nötig ist
✅ Neue Sub-Variante einer bestehenden Klasse (`.btn-tertiary`, `.h-section--small`)
✅ Neue Media-Query in `#RESPONSIVE`-Block

❌ Eigenes Reset
❌ Eigene Theming-Logik (`data-theme` ist gesetzt)
❌ Eigene Spacing-/Radien-Skala
❌ Tailwind/UnoCSS dazumischen
❌ CSS-in-JS für statische Styles

---

## Referenz-Dateien

- `styles.css` — Source of Truth, mit Inhaltsverzeichnis
- `tokens.md` — alle Variablen erklärt
- `components.html` — Copy/Paste-Snippets aller Komponenten
- `README.md` — Einstieg & Setup
