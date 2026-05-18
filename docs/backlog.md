# BACKLOG — KI-Prozessnavigator

Stand: 2026-05-18

## Legende
- [x] Erledigt
- [ ] Offen
- [!] Blockiert (Grund dahinter)

---

## ERLEDIGT (Referenz)

- [x] Projekt-Cleanup: V1 + "KI-Prozessnavigator Website" gelöscht
- [x] Ordnerstruktur konsolidiert (docs, CLAUDE.md, Assets)
- [x] CSS-Architektur: 1 Datei, @layer System, Design-Tokens
- [x] 30+ HTML-Seiten gebaut (Homepage, Subpages, Blog, Geo, Use-Cases, Legal)
- [x] GSAP + ScrollTrigger Animationen (Hero, Cards, Timeline, etc.)
- [x] SSI für Header/Footer/Cookie-Banner
- [x] Nginx-Config (deploy/ki-prozessnavigator.conf)
- [x] ~80 Umlaut-Fehler global gefixt
- [x] Dot-Pattern Hintergrund
- [x] Hero: Wort-Rotation (kopieren/nachfassen/abtippen/verwalten/koordinieren)
- [x] Hero: Dashboard-Mockup (KPIs, Chart, Workflows, Feed, Toast)
- [x] Live-Ticker zwischen Hero und Marquee
- [x] Marquee: Glass-Container mit Borders
- [x] Consequence Cards: 200ms Stagger
- [x] Module Cards: 3D-Tilt + Icon-Micro-Animationen
- [x] Timeline: Pulsing Cyan Dot
- [x] CTA: Glow-Pulse Effekt
- [x] Calculator: Donut-Chart mit dynamischem Update
- [x] Transformation: Checkmark SVG Stroke-Animation
- [x] Scroll-CountUp für data-scroll-count Elemente
- [x] Process→CTA Spacing Fix
- [x] Print Stylesheet
- [x] Broken Blog-Links gefixt (/#dsgvo, /#ersparnis)

---

## NÄCHSTER SCHRITT: Visuelles Audit (Neuer Chat)

Im nächsten Chat soll zuerst ein **komplettes visuelles Audit** der Website durchgeführt werden:

1. **Sektion für Sektion durchgehen** — jede Sektion am Bildschirm anschauen
2. **Design-Konsistenz prüfen** — Abstände, Farben, Typografie, Card-Styles
3. **Animationen bewerten** — Timing, Easing, ob es sich premium anfühlt
4. **Ideen für jede Sektion entwickeln** — was kann optisch/animatorisch verbessert werden
5. **Stück für Stück umsetzen** — nicht alles auf einmal, sondern iterativ

### Bekannte offene Punkte für das Audit:

- [ ] **og-image.png fehlt** — wird im HTML referenziert, existiert nicht
- [ ] **portrait-sitzend.webp** — prüfen ob noch referenziert
- [ ] **Formatierungen verfeinern** — Abstände, Größen, Typografie pro Sektion
- [ ] **Animation-Timing** — Dashboard-Animationen, Ticker-Speed, Stagger-Werte tunen
- [ ] **Mobile QA** — alle Sektionen auf 375px-412px prüfen
- [ ] **Desktop QA** — alle Sektionen auf 1280px-1920px prüfen
- [ ] **Hero-Dashboard Responsive** — auf verschiedenen Breakpoints testen
- [ ] **Wort-Rotator** — Breite der Wörter checken (verändert sie Layout?)
- [ ] **Vorher/Nachher Pipeline** — Aktuell vereinfacht, ggf. auf volle SVG-Pipeline upgraden
- [ ] **Ticker-Inhalt** — sind die Events authentisch genug?
- [ ] **Donut-Chart** — Skalierung/Position auf verschiedenen Screens prüfen

---

## OFFEN: Features & Improvements

### SEO & Content
- [ ] llms.txt erstellen (für KI-Crawler / GEO)
- [ ] feed.xml (RSS-Feed für Blog)
- [ ] Blog: Verwandte Artikel am Ende
- [ ] Blog: Inhaltsverzeichnis bei langen Artikeln
- [ ] Interne Verlinkung verbessern (jede Seite → 2-3 andere)

### UX & Features
- [ ] Sticky Mobile CTA (erscheint nach Hero-Scroll)
- [ ] Weitere Testimonials (mind. 3-4 mit Name + Branche)

### Rechts-Fixes
- [ ] Datenschutz: Cookie-Banner <-> DSE konsistent machen
- [ ] Datenschutz: Aufbewahrungsfristen konkretisieren
- [ ] AGB: B2C-Gewährleistung klarer formulieren
- [ ] Barrierefreiheit: BFSG-Prüfung

### Performance
- [ ] Content Security Policy Header
- [ ] manifest.json (PWA/Favicon)
- [ ] Lighthouse Audit: Performance >= 90, SEO >= 95, a11y >= 90

### QA & Launch
- [ ] Viewport-Tests: 375px, 390px, 768px, 1024px, 1280px, 1920px
- [ ] Tastatur-Navigation testen
- [ ] Schema.org validieren (Rich Results Test)
- [ ] Alle Links prüfen (keine 404)
- [ ] Cookie-Banner Consent-Flow testen
