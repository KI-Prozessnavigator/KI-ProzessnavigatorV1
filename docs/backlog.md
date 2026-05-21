# BACKLOG — KI-Prozessnavigator

Stand: 2026-05-21

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

## ERLEDIGT: 6-Phasen Website-Audit (21.05.2026)

- [x] Phase 1: SEO Emergencies (server.js 404, Telefonnummer, Kontrast, Meta-Tags, Footer)
- [x] Phase 2: Content Expansion (Geo 800+, Use-Cases 600+ Wörter)
- [x] Phase 3: Homepage Visual Overhaul (Spacing, Animations, Comparison, SVGs)
- [x] Phase 4: Subpage Visual Consistency (Animations, og-image, llms.txt)
- [x] Phase 5: Neue Seiten (Preise, 2 Case Studies, 3 Blog-Artikel)
- [x] Phase 6: QA & Polish (Links, Schema, A11y, Performance, Docs)

### Durch Audit erledigte Punkte:
- [x] **og-image.png** — og:image Meta-Tag auf allen Seiten gesetzt
- [x] **Mobile QA** — Touch Targets 44px, Breakpoints 640/1024/1280/1600px
- [x] **Desktop QA** — 1280px+ und 1600px+ Breakpoints für Spacing
- [x] **Animation-Timing** — CustomEase, SplitText, Premium-Stagger überarbeitet

---

## OFFEN: Features & Improvements

### SEO & Content
- [x] llms.txt erstellt (für KI-Crawler / GEO)
- [ ] feed.xml (RSS-Feed für Blog)
- [ ] Blog: Verwandte Artikel am Ende
- [ ] Blog: Inhaltsverzeichnis bei langen Artikeln
- [x] Interne Verlinkung verbessert (Case Studies, Blog-Querverweise)

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
- [x] Viewport-Tests: Breakpoints 640/1024/1280/1600px definiert und geprüft
- [ ] Tastatur-Navigation testen
- [x] Schema.org: BreadcrumbList + FAQPage auf allen relevanten Seiten
- [x] Alle Links geprüft (0 Broken Links)
- [ ] Cookie-Banner Consent-Flow testen
- [ ] portrait-sitzend.webp prüfen ob noch referenziert
- [ ] Wort-Rotator Breite auf verschiedenen Screens prüfen
- [ ] Donut-Chart Skalierung auf verschiedenen Screens prüfen
