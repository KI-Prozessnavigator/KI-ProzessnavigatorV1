# PROJEKT-AUDIT ERGEBNIS — KI-ProzessnavigatorV1

Datum: 03.05.2026
Durchgeführt von: Claude Code

---

## 1. Dateistruktur

| Datei/Ordner | Zeilen/Größe | Entscheidung |
|---|---|---|
| css/main.css | 6.558 | KILL – Inhalt in 4 neue Dateien migrieren |
| css/main-v4.css | 10.461 | KILL – totes File, nirgends geladen |
| css/responsive.css | 1.948 | KILL – Breakpoints direkt zu Komponente |
| css/background-override.css | 150 | KILL – Override-File, regelwidrig |
| css/hero-override.css | 381 | KILL – Override-File, regelwidrig |
| css/final-cta-override.css | 242 | KILL – Override-File, regelwidrig |
| css/use-cases-override.css | 233 | KILL – Override-File, regelwidrig |
| css/problem-awareness.css | 305 | KILL – in components.css migrieren |
| css/zusammenarbeit.css | 432 | KILL – in components.css migrieren |
| css/calculator-v3.css | 332 | KILL – in components.css migrieren |
| css/blog.css | 608 | KILL – in components.css migrieren |
| css/contact-modal.css | 2.186 | KILL – in components.css migrieren |
| css/cookie-banner.css | 585 | KILL – in components.css migrieren |
| **CSS gesamt** | **24.421** | → 0 Dateien (alles neu) |
| js/main.js | 1.198 | KEEP – gut strukturiert |
| js/contact-modal.js | 489 | KEEP – funktional |
| js/cookie-banner.js | 368 | KEEP – DSGVO-konform |
| js/value-calculator.js | 225 | KEEP – ROI-Kalkulator |
| js/background-parallax.js | 30 | KEEP – klein, sauber |
| index.html | ~2.900 | NEUBAUEN – zu verschmutzt |
| ueber-uns.html | 1.105 | NEUBAUEN – 1 style-Block (400+ Zeilen) |
| blog.html | ~250 | NEUBAUEN – <style>-Block + Inline-Styles |
| impressum.html | – | NEUBAUEN – sauber |
| datenschutz.html | – | NEUBAUEN – sauber |
| agb.html | – | NEUBAUEN – sauber |
| barrierefreiheit.html | – | NEUBAUEN – sauber |
| blog/*.html (9 Artikel) | – | KEEP Inhalt, HTML neubauen |
| server.js | 456 | KEEP – produktionsreif (Resend, Rate-Limit) |
| package.json | 18 | KEEP |
| deploy/ki-prozessnavigator.conf | 99 | KEEP – Nginx, sauber |
| deploy-ionos.ps1 | – | KEEP – nicht anfassen |
| robots.txt | 3 | KEEP – ok |
| sitemap.xml | – | KEEP – updaten wenn neue URLs |
| assets/gbp.jsonld | 67 | KEEP – LocalBusiness-Schema |
| assets/fonts/Lato-*.woff2 | ~84 KB | KILL – falscher Font (brauchen Geist) |
| assets/fonts/Montserrat-*.woff2 | 206 KB | KILL – falscher Font (brauchen JetBrains Mono) |
| assets/icons/favicon.svg | 12 KB | KEEP |
| assets/icons/apple-touch-icon.png | 7 KB | KEEP |
| assets/icons/logo.png | 7 KB | KEEP |
| assets/images/logo.svg | 32 KB | KEEP |
| assets/images/logo.png | 2 KB | KEEP |
| assets/images/dominik-buchele.png | 1,88 MB | KEEP – in WebP konvertieren! |
| assets/images/Porträt sitzend... .png | 589 KB | KEEP – in WebP konvertieren! |
| assets/images/illustration-sales.svg | 2 KB | KEEP – prüfen ob noch genutzt |
| build_main_v4.js | – | KILL – totes Build-Script |
| start-lokal.bat | – | KILL – Windows-Batch, obsolet |
| includes/header.html | – | KILL – wird neu per SSI |
| includes/footer.html | – | KILL – wird neu per SSI |
| .vscode/settings.json | – | KILL – IDE-Config, nicht ins Repo |
| .env | – | KILL – NIEMALS in Rework kopieren! |
| docs/FIX-REDIRECT-LOOP.md | – | KILL – nur relevante nginx-Lösung ist deploy/ |
| docs/NGINX-SETUP.md | – | KILL – obsolet, nginx-Config ist deploy/ |
| docs/nginx-slug-urls.conf | – | KILL – in deploy/ schon drin |

---

## 2. CSS-Analyse

### !important pro Datei (Gesamt: 1.658)

| Datei | !important |
|---|---|
| main-v4.css | 691 |
| responsive.css | 368 |
| contact-modal.css | 300 |
| main.css | 262 |
| final-cta-override.css | 17 |
| zusammenarbeit.css | 13 |
| blog.css | 4 |
| cookie-banner.css | 2 |
| background-override.css | 1 |
| hero-override.css | 0 |
| use-cases-override.css | 0 |
| problem-awareness.css | 0 |
| calculator-v3.css | 0 |

**Fazit: 1.658 !important in 13 CSS-Dateien. Das Hauptproblem war das iterative Override-System.**

### :root-Blöcke
- `css/main.css` enthält den einzigen `:root`-Block mit Design-Tokens
- Farben sind Hex/RGB/rgba gemischt (nicht oklch) → kompletter Neuanfang mit oklch

### Farb-Inventur (Hardcoded außerhalb von Variablen)
- `#0077FF` (Primärblau) – ~200x in main.css direkt als Wert
- `#00D4FF` (Cyan/Neon) – ~80x
- `#00D98F` (Grün/Neon) – ~60x
- `rgba(0, 119, 255, ...)` – ~150x
- `#0a0e1a` (Hintergrundfarbe) – ~50x
- `#f3f4f6`, `#d1d5db`, `#9ca3af` (Grautöne) – ~100x
- **Alle müssen Token-Variablen werden**

### Doppelte Selektoren
- Breakpoints in `responsive.css` wiederholen Selektoren aus `main.css`
- Override-Dateien re-definieren was `main.css` definiert hat (Ursache der !important-Eskalation)
- Keine echte Unique-Zuordnung mehr möglich ohne Re-Audit der gesamten main.css

### CSS-Loadout pro HTML-Seite

| Seite | CSS-Dateien | style-Blöcke |
|---|---|---|
| index.html | 9 (main, contact-modal, responsive, zusammenarbeit, hero-override, problem-awareness, use-cases-override, calculator-v3, background-override, final-cta-override) | 3 |
| ueber-uns.html | 5 (main, responsive, contact-modal, cookie-banner, background-override) | 1 |
| blog.html | 5 (main, responsive, background-override, blog, cookie-banner) | 1 |
| impressum.html | 4 (main, cookie-banner, responsive, background-override) | 1 |
| blog/*.html | 5 (../main, ../responsive, ../background-override, ../blog, ../cookie-banner) | je 1 |

**→ Im Rework: Jede Seite lädt genau 4 CSS-Dateien. Keine style-Blöcke.**

### Tote CSS-Dateien (nie geladen)
- `css/main-v4.css` – **10.461 Zeilen, wird von keiner HTML-Seite geladen**

---

## 3. HTML-Analyse

### Inline-Styles pro Seite

| Seite | Inline-Styles |
|---|---|
| index.html | ~60 |
| blog.html | 12 |
| impressum.html | 12 |
| ueber-uns.html | 8 |

**→ Ziel: 0 Inline-Styles im Rework**

### style-Blöcke pro Seite

| Seite | style-Blöcke | Umfang |
|---|---|---|
| index.html | 3 | kritisches CSS + 2 weitere |
| ueber-uns.html | 1 | ~400 Zeilen Seiten-CSS |
| blog.html | 1 | kritisches CSS |
| impressum.html | 1 | kritisches CSS |

**→ Ziel: 0 style-Blöcke im Rework**

### Meta-Tags pro Seite (V1-Status)

| Seite | Title | Description | Canonical | OG |
|---|---|---|---|---|
| index.html | ✓ (zu lang: 68 Zeichen) | ✓ | ✓ | ✓ (kein og:image richtig) |
| ueber-uns.html | ✓ | ✓ | ✓ | ✓ |
| blog.html | ✓ | ✓ | ✓ | ✓ |
| impressum.html | ✓ | ✓ | ✗ | ✗ |
| datenschutz.html | ✓ | ✓ | ✗ | ✗ |
| agb.html | ✓ | ✓ | ✗ | ✗ |

### H-Hierarchie

- **index.html**: 1x `<h1>` (Hero) → mehrere `<h2>` (Sections) → `<h3>` (Cards) ✓
- **ueber-uns.html**: 1x `<h1>` (Über mich) → `<h2>` (Sections) → `<h3>` (Value Cards) ✓
- **blog.html**: Unklar – `<style>`-Block lässt Struktur vermuten ✓ (wahrscheinlich korrekt)
- **Blog-Artikel**: Je 1x `<h1>` (Artikel-Titel) → H2/H3 Abschnitte ✓

### Duplicate Content
- `/vorteile`, `/use-cases`, `/ablauf`, `/faq`, `/kontakt` → alle nginx-seitig zu `index.html` geleitet
- **Das ist technisch kein Duplicate Content für Crawler**, aber diese Seiten haben keinen eigenen Inhalt und keine eigene URL-Identität
- **→ Lösung: Neue eigenständige HTML-Dateien für jede URL (Backlog Phase 3)**

---

## 4. JS-Analyse

| Datei | Zeilen | Zustand | Entscheidung |
|---|---|---|---|
| js/main.js | 1.198 | Gut strukturiert, `'use strict'`, saubere Architektur | KEEP – leicht refactorn |
| js/contact-modal.js | 489 | Multi-Step-Form, Fetch-API, validiert | KEEP |
| js/cookie-banner.js | 368 | DSGVO-konform, 4 Kategorien, localStorage | KEEP |
| js/value-calculator.js | 225 | ROI-Kalkulator-Logik | KEEP |
| js/background-parallax.js | 30 | Einfacher Hintergrund-Effekt | KEEP |

**Probleme im main.js:**
- `injectAnimationStyles()` injiziert CSS via JS-String → verletzt CSS-Architektur-Regeln. Im Rework: Animation-CSS in components.css
- `showNotification()` setzt `style.cssText` direkt auf Elemente → verletzt Inline-Style-Regel. Im Rework: CSS-Klassen
- `initScrollProgress()` setzt `style.cssText` → verletzt Inline-Style-Regel

**Was der JS-Stack gut kann (behalten):**
- Navigation (Burger-Toggle, Scroll, Active-State)
- FAQ Accordion
- IntersectionObserver für Scroll-Animationen
- Lazy Loading
- Contact Modal Focus Trap (A11y korrekt!)
- WirVsDu-Toggle (Tab-Panels)
- Use Cases Tabs mit Keyboard-Navigation
- `initBeratungsplaetzeCount()` (tagesbasiert)
- GTM DataLayer Integration

---

## 5. Assets-Inventur

### Fonts (assets/fonts/)
| Datei | Größe | Entscheidung |
|---|---|---|
| Lato-Regular.woff2 | 28 KB | KILL – falscher Font |
| Lato-Bold.woff2 | 28 KB | KILL – falscher Font |
| Lato-Light.woff2 | 28 KB | KILL – falscher Font |
| Montserrat-VariableFont_wght.woff2 | 206 KB | KILL – falscher Font |

**→ Benötigt: Geist-Sans WOFF2 (Regular, Medium, SemiBold, Bold) + JetBrains Mono WOFF2**

### Icons (assets/icons/)
| Datei | Größe | Entscheidung |
|---|---|---|
| favicon.svg | 12 KB | KEEP |
| apple-touch-icon.png | 7 KB | KEEP |
| favicon.png | 7 KB | KEEP (Fallback) |
| logo.png | 7 KB | KEEP |

### Images (assets/images/)
| Datei | Größe | Entscheidung |
|---|---|---|
| dominik-buchele.png | 1,88 MB | KEEP → WebP konvertieren (Ziel: <200 KB) |
| Porträt sitzend... .png | 589 KB | KEEP → WebP konvertieren (Ziel: <100 KB) |
| logo.svg | 32 KB | KEEP |
| logo.png | 2 KB | KEEP |
| illustration-sales.svg | 2 KB | KEEP – prüfen ob im Rework genutzt |

### Schema (assets/)
| Datei | Entscheidung |
|---|---|
| gbp.jsonld | KEEP – LocalBusiness JSON-LD (vollständig, korrekt) |

---

## 6. Deploy/Config

| Datei | Entscheidung | Notizen |
|---|---|---|
| deploy-ionos.ps1 | KEEP – nicht anfassen | Deployment-Script für IONOS |
| deploy/ki-prozessnavigator.conf | KEEP – updaten | Nginx-Config mit Clean-URL-Redirects |
| server.js | KEEP | Resend-Backend (Checkliste + Kontakt), Rate-Limiting, Honeypot |
| package.json | KEEP | 5 Deps: dotenv, express, express-rate-limit, helmet, resend |
| robots.txt | KEEP – updaten | Sitemap-URL korrekt |
| sitemap.xml | KEEP – updaten | Neue URLs ergänzen wenn fertig |

**nginx-Redirect-Problem (gelöst):** `/vorteile`, `/use-cases`, etc. werden aktuell auf `index.html` gemappt. Im Rework: Jede URL bekommt eine eigene HTML-Datei → nginx-Config muss angepasst werden.

**Achtung server.js:**
- Läuft auf Port 3000 (intern), IONOS proxied vermutlich drauf
- Zwei API-Routen: `POST /api/send-email` und `POST /api/send-checklist`
- Hat CORS, CSRF-Origin-Check, Rate-Limiting – sauber implementiert

---

## 7. Kill-Liste (NICHT in Rework kopieren)

```
css/                     ← Komplett neu
build_main_v4.js         ← Totes Build-Script
start-lokal.bat          ← Windows-Batch, obsolet
assets/fonts/*.woff2     ← Falsche Fonts (Lato/Montserrat)
includes/                ← Wird neu via SSI
.vscode/                 ← IDE-Config
.env                     ← Enthält echte Credentials!
docs/FIX-REDIRECT-LOOP.md ← Obsolet
docs/NGINX-SETUP.md      ← Obsolet
docs/nginx-slug-urls.conf ← Obsolet (liegt jetzt in deploy/)
```

---

## 8. Migrations-Empfehlung pro Datei

### Sofort-Maßnahmen (vor HTML-Arbeit)
1. **Geist-Fonts beschaffen** und in `assets/fonts/` ablegen
2. **Bilder zu WebP** konvertieren: `dominik-buchele.png` (1,88 MB → ~100 KB), Porträt (589 KB → ~50 KB)
3. **tokens.css erstellen** (oklch-System, Blau→Grün, Light+Dark)
4. **base.css erstellen** (Reset, @font-face mit Geist/JetBrains, Container)

### CSS-Migrations-Reihenfolge
1. Header/Nav (auf jeder Seite, höchste Priorität)
2. Hero (Startseite)
3. Cookie-Banner + Contact-Modal (JS-abhängig, früh migrieren)
4. Footer (auf jeder Seite)
5. Alle Startseiten-Komponenten (Problem, Tabs, Calculator, DSGVO, FAQ, CTA)
6. Blog-Styles
7. Legal-Seiten-Styles
8. Über-uns-Seite

### JS-Anpassungen notwendig
- `injectAnimationStyles()` → CSS-Klassen in components.css
- `showNotification()` → Klassen-basiert statt `style.cssText`
- `initScrollProgress()` → Klassen-basiert
- Sonst: kein Breaking Change erwartet

### Blog-Artikel (9 Stück)
- **Inhalt**: KEEP – unique, SEO-optimiert, gut strukturiert
- **HTML**: Neubauen mit neuem Layout, neuen CSS-Klassen
- **CSS**: blog.css-Inhalt in components.css migrieren

### Neue Seiten (hat V1 nicht)
- vorteile.html
- use-cases.html (eigenständig)
- use-cases/handwerk.html, agenturen.html, dienstleister.html, it-dienstleister.html
- ablauf.html
- faq.html (+ FAQ-Schema)
- kontakt.html
- 404.html
- danke.html
- geo/augsburg.html, muenchen.html, bayern.html
