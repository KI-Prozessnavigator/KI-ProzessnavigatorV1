# Technisches Audit: KI-Prozessnavigator Website (Re-Audit nach Performance- & A11y-Optimierungen)

**Audit-Datum:** Januar 2026 (Re-Scan nach Performance-/A11y-/Security-Optimierungen)  
**Rolle:** Expert-Web-Auditor / Senior Full-Stack  
**Scope:** Gesamtes Projekt (HTML, CSS, JS, PHP, Assets)

---

## Executive Summary

| Bereich | Note (1–10) | Kurzbewertung |
|---------|--------------|----------------|
| **Architektur & Code-Qualität** | 7/10 | main.css-Bundle ✓, utility.css ✓; Dead Code (CSS/JS-Dateien) noch im Repo, keine Build-Pipeline, Unterseiten mit 8 CSS-Links |
| **Performance & Core Web Vitals** | 7,5/10 | 1 CSS-Request (main.css) ✓, Inline-Styles 118→22 ✓, preconnect entfernt ✓; main.css unminified, ~2.384 Zeilen index, kein loading="lazy" am Footer-Logo |
| **SEO & Semantik** | 8/10 | sitemap.xml ✓, robots.txt ✓, Schema.org auf Unterseiten ✓; og:image fehlt, lastmod in Sitemap fehlt |
| **Accessibility (A11y)** | 8/10 | Skip-Link ✓, :focus-visible an Formularen ✓, Modal-Focus-Trap ✓, Esc in Modals ✓; Kontrast nicht geprüft |
| **Best Practices & Sicherheit** | 8/10 | target="_blank" mit rel="noopener noreferrer" ✓, CSP + Security-Header ✓, main.js innerHTML reduziert ✓; contact-modal.js innerHTML (feste Strings) |

**Gesamtnote: 7,7/10** – Deutliche Verbesserung; verbleibende Hebel: Dead Code aufräumen, main.css minifizieren, og:image/lastmod, Lazy Loading, Unterseiten auf main.css umstellen.

---

## Critical Issues (sofort beheben)

| Priorität | Issue | Ort | Aktion |
|-----------|--------|-----|--------|
| **Mittel** | **Kein loading="lazy"** am Footer-Logo (unter dem Fold) | `index.html` Zeile 1447 | `<img ... loading="lazy">` ergänzen; Hero-Logo (Zeile 232) ohne lazy belassen |
| **Mittel** | **og:image fehlt** – Social-Sharing ohne Vorschaubild | `index.html` `<head>` | `<meta property="og:image" content="https://ki-prozessnavigator.de/assets/images/og-image.jpg">` (Bild anlegen falls nötig) |

**Hinweis:** Keine XSS-Critical: main.js nutzt textContent/insertAdjacentHTML/replaceChildren; contact-modal.js nutzt feste Strings; main.js Zeile 932 liest nur DOM.heroTitle.innerHTML (statischer Inhalt).

---

## Optimization Backlog (konkrete Code-Stellen)

### 1. Architektur & Code-Qualität

| # | Datei/Ordner | Problem | Empfohlene Aktion |
|---|--------------|---------|-------------------|
| 1 | `css/hero-3d.css`, `live-impact-dashboard.css`, `neural-network-automation.css`, `solar-system.css`, `ki-process-navigator.css` | Im Repo, nicht in main.css eingebunden (main.css = 13 Dateien ohne diese) | Löschen oder als „archiv“ kennzeichnen |
| 2 | `js/hero-3d.js`, `ki-process-navigator.js`, `solar-system-navigator.js`, `template-loader.js`, `neural-network-automation.js`, `live-impact-dashboard.js` | Nicht in index.html eingebunden | Löschen oder dokumentieren |
| 3 | `includes/header.html`, `includes/footer.html` | Werden in keiner HTML-Seite genutzt | Per Build/SSI einbinden oder Duplikation reduzieren |
| 4 | `impressum.html`, `datenschutz.html`, `agb.html` | Jeweils 8 separate CSS-`<link>` (reset, fonts, variables, styles, components, dark-mode, cookie-banner, responsive) | Auf `css/main.css` umstellen (1 Request) oder eigenes Subpage-Bundle |
| 5 | Projekt-Root | Kein package.json, kein Minify-Step | Optional: Build (z. B. Vite) für main.css minifizieren |

### 2. Performance & Core Web Vitals

| # | Datei/Zeile | Problem | Empfohlene Aktion |
|---|--------------|---------|-------------------|
| 6 | `css/main.css` | Gebündelt, aber unminified (~8.500+ Zeilen) | Über Build minifizieren (cssnano, clean-css) |
| 7 | `index.html` | Noch 22 Inline-`style="..."` (u. a. dynamische Höhen Monats-Balken, SVG stop-color, transition) | Wo möglich in utility.css auslagern; dynamische Werte (height %) ggf. per CSS-Variable/JS setzen |
| 8 | `index.html` Zeile 1447 | Footer-Logo ohne `loading="lazy"` | `loading="lazy"` ergänzen |
| 9 | `index.html` Zeilen 114–226 | Inline-`<style>` (Above-the-fold, Value-Calculator-Override, Cookie, Cursor-Blink) | Beibehalten oder in critical.css auslagern |

### 3. SEO & Semantik

| # | Datei/Zeile | Problem | Empfohlene Aktion |
|---|--------------|---------|-------------------|
| 10 | `index.html` `<head>` | Kein `og:image` | og:image-Meta ergänzen; Bild anlegen/hosten |
| 11 | `sitemap.xml` | Keine `lastmod`-Angaben | Pro `<url>` optional `<lastmod>2026-01-30</lastmod>` |
| 12 | Alle Seiten | Kein BreadcrumbList-Schema | Optional: BreadcrumbList JSON-LD auf Unterseiten |

### 4. Accessibility (A11y)

| # | Datei/Zeile | Problem | Empfohlene Aktion |
|---|--------------|---------|-------------------|
| 13 | Projekt | Kontrast (dunkles Theme) nicht systematisch geprüft | Mit axe DevTools / WAVE / Contrast Checker prüfen (WCAG AA: 4,5:1 Fließtext, 3:1 große Texte) |
| 14 | `js/cookie-banner.js` | Cookie-Modal: Fokus-Falle nicht geprüft | Analog zum Kontakt-Modal Fokus-Trap prüfen/ergänzen |

### 5. Best Practices & Sicherheit

| # | Datei/Zeile | Problem | Empfohlene Aktion |
|---|--------------|---------|-------------------|
| 15 | `js/main.js` Zeile 932 | `DOM.heroTitle.innerHTML` (nur Lesen für Typewriter) | Risiko gering; bei dynamischem Inhalt escapen oder textContent |
| 16 | `js/contact-modal.js` 455, 494, 496, 518, 524 | `innerHTML` mit festen Strings / gespeichertem Button-Text | Keine Aktion; Quellen sind kontrolliert |

---

## Quick Wins (maximaler Impact, minimaler Aufwand)

| Reihenfolge | Aktion | Aufwand | Impact |
|-------------|--------|---------|--------|
| 1 | **Footer-Logo** in index.html mit `loading="lazy"` | 2 Min | LCP/Performance |
| 2 | **og:image** im index.html `<head>` ergänzen (Bild ggf. anlegen) | 10 Min | Social Sharing, SEO |
| 3 | **lastmod** in sitemap.xml pro URL | 5 Min | SEO |
| 4 | **Unterseiten** (impressum, datenschutz, agb) auf `css/main.css` umstellen | 10 Min | Weniger Requests, einheitliches Styling |
| 5 | **Dead-CSS/JS-Dateien** löschen oder in README als „nicht verwendet“ dokumentieren | 10 Min | Klarheit |

---

## Detaillierte Analyse

### 1. Architektur & Code-Qualität

**Redundanz & Dead Code**

- **index.html** lädt nur noch **css/main.css** (1 Request); main.css bündelt reset, fonts, variables, styles, components, dark-mode, value-calculator, cookie-banner, contact-modal, responsive, value-calculator-override, value-calculator-white-text, utility. ✓
- **utility.css** enthält ausgelagerte Inline-Styles (u-text-white, result-card__*, etc.). ✓
- **Dead CSS** im Repo (nicht in main.css): hero-3d.css, live-impact-dashboard.css, neural-network-automation.css, solar-system.css, ki-process-navigator.css.
- **Dead JS** im Repo (nicht in index): hero-3d.js, ki-process-navigator.js, solar-system-navigator.js, template-loader.js, neural-network-automation.js, live-impact-dashboard.js.
- **Unterseiten** laden jeweils 8 CSS-Dateien; kein main.css.

**Struktur**

- Kein Atomic Design / Clean Architecture; flache Struktur.
- Kein Build-Step (kein Minify für main.css).
- includes/header.html und includes/footer.html vorhanden, ungenutzt.

**Abhängigkeiten**

- Kein package.json; keine externen CDN-Skripte; preconnect entfernt ✓.

---

### 2. Performance & Core Web Vitals

**Rendering & DOM**

- **index.html** ~2.384 Zeilen; **22 Inline-Styles** (deutlich reduziert).
- main.css ein Request ✓; Inhalt unminified.

**Assets**

- **Lazy Loading:** Kein `loading="lazy"` auf den 2 Bildern (Hero-Logo korrekt ohne lazy; Footer-Logo sollte lazy haben).
- **Preload:** Fonts mit preload ✓.
- **Skripte:** main.js, value-calculator.js, cookie-banner.js, contact-modal.js mit defer ✓.

**Bundle-Größe**

- **main.css** ~8.500+ Zeilen – ein Request, aber unminified; Optimierungspotenzial.

---

### 3. SEO & Semantik

**HTML-Struktur**

- Eine H1 pro Seite ✓; logische H2; alt-Texte bei Bildern ✓; canonical, description, og:title, og:description auf index ✓; Unterseiten mit eigenem title/description/canonical ✓.

**Structured Data**

- Organization, SoftwareApplication, FAQPage (index); WebPage für Impressum, Datenschutz, AGB ✓.
- sitemap.xml ✓; robots.txt ✓.
- **Fehlend:** og:image; lastmod in sitemap; optional BreadcrumbList.

---

### 4. Accessibility (A11y)

**Positiv**

- Skip-Link „Zum Hauptinhalt springen“ mit `#main-content` ✓.
- **:focus-visible** an Form-Inputs (contact-modal, styles, value-calculator) mit sichtbarem Outline ✓.
- **Modal-Focus-Trap** für Kontakt-Modal in main.js (initContactModalFocusTrap) ✓; Tab bleibt im Modal, Esc schließt, Fokus zurück.
- ARIA an Modals/Cookie-Buttons ✓; alle target="_blank" mit rel="noopener noreferrer" ✓.

**Zu verbessern**

- Kontrast (dunkles Theme) mit Tool prüfen.
- Cookie-Modal: Fokus-Falle prüfen/ergänzen.

---

### 5. Best Practices & Sicherheit

**Security-Header**

- **_headers**, **netlify.toml**, **.htaccess**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, **Content-Security-Policy** ✓.

**target="_blank" & rel**

- Alle Links mit target="_blank" haben rel="noopener noreferrer" ✓.

**XSS / innerHTML**

- main.js: Notification per insertAdjacentHTML + textContent ✓; Typewriter per insertAdjacentHTML/insertAdjacentText ✓; Dots per replaceChildren ✓; nur Lesen: DOM.heroTitle.innerHTML.
- contact-modal.js: innerHTML nur mit festen Strings / processRecommendations (festes Objekt) – geringes Risiko.

---

## Was muss man machen, um eine 10/10 Audit zu bekommen?

Um in allen fünf Bereichen auf **10/10** zu kommen, sind folgende Anpassungen nötig:

### Architektur & Code-Qualität (7 → 10)

1. **Dead Code entfernen:** Ungenutzte CSS- und JS-Dateien löschen oder aus dem Build ausnehmen (hero-3d.css, live-impact-dashboard.*, neural-network-automation.*, solar-system.*, ki-process-navigator.*, template-loader.js).
2. **Build-Pipeline:** Mindestens ein Minify-Step für main.css (z. B. Vite, cssnano); optional JS bündeln/minifizieren.
3. **Unterseiten:** impressum, datenschutz, agb auf main.css (oder eigenes Subpage-Bundle) umstellen – ein CSS-Request pro Seite.
4. **Struktur:** Header/Footer per Include oder Build einbinden, um Duplikation zu vermeiden.

### Performance (7,5 → 10)

5. **main.css minifizieren** (Build).
6. **Verbleibende Inline-Styles** wo möglich in CSS-Klassen auslagern; dynamische Werte (z. B. height %) per CSS-Variable oder JS setzen.
7. **Lazy Loading:** Footer-Logo mit `loading="lazy"`; alle Bilder unterhalb des Folds mit lazy; erstes sichtbares Bild ohne lazy.
8. **Optional:** Critical CSS auslagern; Rest asynchron laden.

### SEO (8 → 10)

9. **og:image** für Social Sharing ergänzen.
10. **lastmod** in sitemap.xml pro URL.
11. **Optional:** BreadcrumbList-Schema auf Unterseiten; og:url auf allen Seiten.

### Accessibility (8 → 10)

12. **Kontrast** mit axe/WAVE prüfen; WCAG AA (4,5:1 Fließtext, 3:1 große Texte) sicherstellen.
13. **Cookie-Modal:** Fokus-Falle implementieren (analog Kontakt-Modal); Esc und Rückfokus prüfen.
14. **Optional:** prefers-reduced-motion für Animationen berücksichtigen.

### Best Practices & Sicherheit (8 → 10)

15. **CSP** ggf. verschärfen (z. B. style-src ohne 'unsafe-inline' nur wenn kein Inline-Style nötig).
16. **main.js Zeile 932:** Bei dynamischem Hero-Titel-Inhalt escapen oder nur textContent nutzen.

**Kurz-Checkliste 10/10**

- [ ] Kein Dead Code (CSS/JS nur eingebunden, wenn genutzt).
- [ ] Build mit Minify für CSS (und optional JS).
- [ ] Unterseiten mit einem CSS-Bundle (main.css oder Subpage-Bundle).
- [ ] Sitemap + robots.txt + lastmod; og:image + konsistente Meta.
- [ ] Lazy Loading für Bilder unter dem Fold.
- [ ] Alle target="_blank" mit rel="noopener noreferrer".
- [ ] Skip-Link, :focus-visible, Modal-Focus-Trap (Kontakt + Cookie).
- [ ] Kontrast WCAG AA geprüft.
- [ ] Security-Header inkl. CSP.
- [ ] Kein innerHTML mit ungeprüften Nutzerdaten.

Wenn diese Punkte umgesetzt sind, sind die Voraussetzungen für ein **10/10-Audit** in allen fünf Bereichen erfüllt.
