# Responsive-Analyse – CSS & HTML

Analyse aller CSS-Dateien und HTML-Komponenten auf Responsive-Probleme (Stand: Februar 2025).

---

## 1. Fehlende oder problematische Media Queries

### 1.1 CSS-Dateien **ohne** Media Queries

Diese Dateien enthalten **keine** `@media`-Regeln. Bei Layout- oder Typografie-Regeln kann das auf kleinen Viewports zu Problemen führen.

| Datei | Hinweis |
|-------|--------|
| **css/dark-mode.css** | Keine Breakpoints – nur Theme-Overrides; i. d. R. unkritisch. |
| **css/fonts.css** | Nur @font-face – keine Media Queries nötig. |
| **css/styles.css** | Enthält Layout (Container, Header, overflow) – **keine** responsiven Anpassungen. |
| **css/utility.css** | Enthält Result-Card-Styles und feste font-size (px) – **keine** Media Queries. |
| **css/test-backgrounds.css** | Test-Styles, feste Breiten/Icons – keine Breakpoints. |
| **css/test-ersparnis.css** | Dokumentation/Test – keine echten Media Queries. |
| **css/value-calculator-override.css** | Nur Farb-Overrides – keine Layout-Media Queries. |
| **css/value-calculator-white-text.css** | Nur Textfarbe – keine Media Queries nötig. |

**Empfehlung:**  
- **styles.css**: Prüfen, ob diese Datei parallel zu main.css/responsive.css geladen wird. Falls ja: entweder Media Queries ergänzen oder Layout-Verantwortung in main.css/responsive.css legen.  
- **utility.css**: Wenn Result-Cards auf Mobilgeräten genutzt werden, responsive Anpassungen (z. B. kleinere Schrift, weniger Padding) in Media Queries erwägen.

### 1.2 Inkonsistente Breakpoints

Verschiedene Dateien nutzen unterschiedliche Breakpoint-Werte (z. B. 480, 576, 640, 768, 900, 992, 1024, 1200 px). Das ist nicht per se falsch, kann aber Wartung erschweren.

- **calculator-redesign.css**: 900px, 768px  
- **calculator-modern-compact.css**: 900px, 768px  
- **responsive.css** / **main.css**: 375px, 480px, 576px, 768px, 992px, 1400px, 1600px  
- **value-calculator.css**: 480px, 768px, 1024px  
- **cookie-banner.css**: 640px  
- **ki-process-navigator.css** / **solar-system.css**: 576px, 768px, 992px, 1200px  

**Empfehlung:** Breakpoints in **css/variables.css** als Custom Properties definieren (z. B. `--bp-sm`, `--bp-md`, `--bp-lg`) und in Media Queries einheitlich nutzen.

---

## 2. Feste Breiten (width / min-width in px) ohne max-width

### 2.1 Layout-relevante feste Breiten (potenziell problematisch auf kleinen Screens)

| Datei | Zeile | Regel | Hinweis |
|-------|-------|--------|---------|
| **css/components.css** | 22 | `width: 200px` | .trust-bar::before – Dekolinie; evtl. max-width: 100% |
| **css/components.css** | 171 | `width: 200px` | .neural-network – feste Größe, auf sehr kleinen Screens evtl. zu groß |
| **css/components.css** | 792 | `min-width: 80px` | Button/Control – kann auf schmalen Viewports stören |
| **css/components.css** | 796 | `width: 40px` | In Media Query – prüfen ob Kontext passt |
| **css/responsive.css** | 219 | `width: 300px` | In @media (max-width: 576px) – Hero/Graphic, prüfen |
| **css/responsive.css** | 144 | `min-width: 200px` | Hero – auf sehr schmalen Geräten evtl. overflow |
| **css/main.css** | 1317 | `width: 200px` | .neural-network |
| **css/main.css** | 1557 | `width: 200px` | (Duplikat/Kopie von components) |
| **css/main.css** | 5523 | `min-width: 280px` | Cookie-Banner-Bereich – auf &lt;320px evtl. abschneiden |
| **css/test-usecases-responsive.css** | 30–32 | `width: 320px`, `min-width: 320px`, `max-width: 320px` | Use-Case-Card – 320px fix kann auf kleinen Geräten stören |
| **css/test-ersparnis.css** | 49 | `min-width: 320px` | Calculator-Wrapper – schmale Viewports |
| **css/calculator-modern-compact.css** | 23 | `max-width: 1160px` | Container – OK, hat max-width |
| **css/calculator-modern-compact.css** | 290 | `min-width: 340px !important` | Result-Card – ohne Media-Anpassung auf Mobil evtl. horizontaler Scroll |
| **css/calculator-redesign.css** | 9 | `max-width: 1180px` | #pricing .container – OK |
| **css/calculator-redesign.css** | 31 | `grid-template-columns: 380px 1fr` | Feste 380px-Spalte – unter 768px per Media auf 1fr; unter 380px prüfen |
| **css/calculator-redesign.css** | 191 | `min-width: 340px !important` | .result-card--money – wie oben |
| **css/calculator-redesign.css** | 205 | `min-width: 360px !important` | .btn--calculator – in 768px Media auf 100%; unter 360px prüfen |
| **css/cookie-banner.css** | 43 | `min-width: 280px` | Banner-Container – sehr schmale Screens |
| **css/value-calculator.css** | 224 | `min-width: 50px` | Input/Control – eher unkritisch |

### 2.2 Kleine feste Breiten (Icons, Borders, Spacer – meist unkritisch)

Diese sind i. d. R. bewusst fest (Icons, Trennlinien, kleine UI-Elemente). Nur zur Vollständigkeit:  
Vorkommen u. a. in **components.css**, **main.css**, **responsive.css**, **contact-modal.css**, **value-calculator.css**, **hero-3d.css**, **styles.css**, **calculator-redesign.css**, **calculator-modern-compact.css**, **test-backgrounds.css**, **utility.css**, **cookie-banner.css**, **live-impact-dashboard.css**, **solar-system.css** (z. B. width: 1px, 2px, 6px, 8px, 10px, 16px, 18px, 20px, 24px, 28px, 32px, 40px, 44px, 48px, 50px, 52px, 60px, 64px, 70px, 88px, 90px, 140px).

**Empfehlung:**  
- Für **Layout-Container und Karten**: wo sinnvoll `max-width: 100%` ergänzen oder in Media Queries `width`/`min-width` reduzieren.  
- **min-width: 340px / 360px** (Calculator/Buttons): Sicherstellen, dass in Breakpoints ≤768px bzw. ≤480px auf `min-width: 0` oder `100%` umgestellt wird (teilweise bereits umgesetzt).

---

## 3. Overflow-Probleme (overflow: hidden / visible)

### 3.1 overflow: hidden – potenziell problematisch

Wenn Inhalte (z. B. Text, Buttons) abgeschnitten werden oder horizontaler Scroll verhindert wird, wo er nötig wäre.

| Datei | Zeile | Kontext | Hinweis |
|-------|--------|---------|---------|
| **css/responsive.css** | 81 | `body.menu-open { overflow: hidden }` | Absichtlich (Menü offen), OK. |
| **css/main.css** | 7379 | `body.menu-open { overflow: hidden }` | Wie oben. |
| **css/main.css** | 2458–2459 | .usecase-flow – `min-height`, `overflow: hidden` | Bei langem Inhalt auf Mobil prüfen, ob nichts Wichtiges abgeschnitten wird. |
| **css/main.css** | 2320–2321 | In Media Query – `overflow: visible !important` | Korrektur für Use-Cases – OK. |
| **css/contact-modal.css** | 50 | .contact-modal – `overflow: hidden` | Modal-Container – üblich; Inhalt sollte in scrollbarem Bereich liegen. |
| **css/value-calculator.css** | 9, 303, 397 | `overflow: hidden` | Sektionen – prüfen ob auf kleinen Screens kein Inhalt fehlt. |
| **css/calculator-redesign.css** | 224 | select `overflow: hidden` | Verstecktes Native-Select – OK. |

Übrige `overflow: hidden` in **components.css**, **main.css**, **hero-3d.css**, **contact-modal.css**, **styles.css**, **live-impact-dashboard.css** betreffen Karten, Modals, Accordions, Clipping – in der Regel unkritisch, solange der sichtbare Inhalt scrollbar oder begrenzt ist.

### 3.2 overflow: visible – bewusst eingesetzt

| Datei | Zeile | Kontext | Hinweis |
|-------|--------|---------|---------|
| **css/main.css** | 1650–1651, 1669, 1679, 1693 | .solutions, .container, .solutions__grid | Für Glow-Effekt – Kommentar bestätigt Absicht. |
| **css/main.css** | 9970–9971 | .solutions__grid `overflow: visible !important` | Wie oben. |
| **css/components.css** | 567 | Section – `overflow: visible` | Hover-Effekt – OK. |
| **css/components.css** | 2304 | Rundes Element – `overflow: visible` | OK. |
| **css/main.css** | 4011–4012 | Rundes Element – `overflow: visible` | OK. |
| **css/hero-3d.css** | 114 | `overflow: visible` | Ringe nicht abschneiden – OK. |
| **css/test-usecases-responsive.css** | 104 | `overflow: visible !important` | Use-Cases Mobile – OK. |
| **css/solar-system.css** | 22 | `overflow: visible` | OK. |
| **css/contact-modal.css** | 1410–1411 | .solutions__grid | Konsistenz mit main. |

**Empfehlung:**  
- **body** hat in **main.css** kein globales `overflow-x: hidden` (nur .header und .contact-modal__scroll-area). Wenn es dennoch horizontalen Scroll gibt, Ursache in breiten Elementen (z. B. feste min-width) suchen und dort mit max-width/Media Queries begrenzen.

---

## 4. Viewport-Meta-Tags

### 4.1 Vorhanden (OK)

| Datei | Zeile | Inhalt |
|-------|--------|--------|
| **index.html** | 5 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **impressum.html** | 5 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **agb.html** | 5 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| **datenschutz.html** | 5 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |

### 4.2 Kein eigenes Viewport-Tag (unerheblich)

- **includes/header.html** – Fragment, kein `<head>`.
- **includes/footer.html** – Fragment.

**Ergebnis:** Keine fehlenden Viewport-Meta-Tags in den HTML-Seiten.

---

## 5. Nicht-responsive Schriftgrößen (font-size in px)

Alle folgenden Stellen setzen `font-size` in **px**. Ohne Anpassung in Media Queries bleiben die Größen auf allen Viewports gleich; sehr kleine px-Werte können auf kleinen Screens schwer lesbar sein, große auf großen Screens zu dominant.

### 5.1 main.css

| Zeile | Wert | Kontext (aus Grep) |
|-------|------|---------------------|
| 8932 | 36px | Result-Card |
| 8941 | 11px | |
| 8949 | 36px | .result-card__value-num |
| 8950 | 16px | .result-card__value-unit |
| 8952 | 13px | |
| 8974 | 24px | .result-card__percent |
| 8975 | 9px | .result-card__percent-label |
| 8976 | 12px | .result-card__meta |
| 8978 | 11px | |
| 9004 | 8px | .result-card__month-num |
| 9005 | 8px | .result-card__month-num--em |
| 9006 | 8px | .result-card__month-num--12 |
| 9017 | 10px | .result-card__monthly-label |
| 9018 | 14px | .result-card__monthly-value |

### 5.2 utility.css

| Zeile | Wert | Kontext |
|-------|------|---------|
| 76 | 36px | |
| 85 | 11px | |
| 93 | 36px | .result-card__value-num |
| 94 | 16px | .result-card__value-unit |
| 96 | 13px | |
| 118 | 24px | .result-card__percent |
| 119 | 9px | .result-card__percent-label |
| 120 | 12px | .result-card__meta |
| 122 | 11px | |
| 148 | 8px | .result-card__month-num |
| 149 | 8px | .result-card__month-num--em |
| 150 | 8px | .result-card__month-num--12 |
| 161 | 10px | .result-card__monthly-label |
| 162 | 14px | .result-card__monthly-value |

### 5.3 calculator-modern-compact.css

| Zeile | Wert |
|-------|------|
| 175 | 28px |
| 181 | 15px |
| 209 | 18px |
| 214 | 8px |
| 257 | 9px |

### 5.4 live-impact-dashboard.css

| Zeile | Wert |
|-------|------|
| 54 | 24px |
| 59 | 18px |
| 139 | 32px |
| 161 | 36px |
| 170 | 16px |
| 179 | 13px |
| 194 | 12px |
| 222 | 11px |
| 256 | 32px |
| 260 | 28px |
| 275 | 16px |
| 279 | 28px |
| 283 | 14px |
| 287 | 24px |
| 291 | 12px |
| 295 | 11px |
| 318 | 24px |
| 322 | 20px |

### 5.5 neural-network-automation.css

| Zeile | Wert |
|-------|------|
| 205 | 10px |
| 221 | 9px |
| 226 | 18px |

### 5.6 solar-system.css

| Zeile | Wert |
|-------|------|
| 155 | 10px |
| 166 | 9px |
| 182 | 8px |

### 5.7 test-backgrounds.css

| Zeile | Wert |
|-------|------|
| 854 | 14px |

### 5.8 test-ersparnis.css

| Zeile | Wert |
|-------|------|
| 65 | (Kommentar: font-size: 28px) |

**Empfehlung:**  
- Wo es Lesbarkeit und Hierarchie betrifft (Überschriften, Fließtext, Result-Cards):  
  - Entweder **rem/em** nutzen (z. B. über **variables.css**) oder  
  - **clamp()** / **Media Queries** mit kleineren px-Werten für max-width ≤768px bzw. ≤480px.  
- Sehr kleine Werte (8px, 9px, 10px) auf Touch-Geräten prüfen (Mindestgröße für Links/Buttons ca. 44px Touch-Target, Schrift mind. ~12px lesbar).

---

## 6. Kurz-Zusammenfassung

| Kategorie | Befund |
|------------|--------|
| **Media Queries** | 8 CSS-Dateien ohne @media; **styles.css** und **utility.css** prüfen, ob sie Layout/Typo ohne Breakpoints setzen. |
| **Feste Breiten** | Mehrere layout-relevante `width`/`min-width` (200px, 280px, 300px, 320px, 340px, 360px, 380px) – teils in Media Queries abgefangen; auf sehr schmalen Viewports (&lt;360px) prüfen. |
| **Overflow** | Überwiegend sinnvoll (Menü, Modals, Glow). Einzig bei Use-Case-/Calculator-Bereichen prüfen, ob kein Inhalt abgeschnitten wird. |
| **Viewport** | In allen 4 HTML-Seiten vorhanden – **keine fehlenden Viewport-Meta-Tags**. |
| **Schriftgrößen** | Viele feste **px**-Angaben, v. a. in main.css, utility.css, calculator-modern-compact.css, live-impact-dashboard.css; Empfehlung: rem/em oder responsive Anpassung für bessere Lesbarkeit. |

---

*Erstellt durch automatische Analyse der CSS- und HTML-Dateien.*
