# CHANGELOG

Alle Änderungen am Projekt werden hier dokumentiert.

## [21.05.2026] — Kompletter Website-Audit: 6 Phasen

### Phase 1: SEO Emergency Fixes
- server.js SPA-Fallback liefert 404 statt 200 für unbekannte URLs
- Telefonnummer auf allen Seiten korrigiert (+49 175 5526398)
- Blog-URLs in SSOT-Docs an tatsächliche Dateinamen angepasst
- --color-text-muted auf #b4b9c4 für WCAG AA Kontrast angepasst
- JSON-LD Schema auf Homepage erweitert (sameAs, areaServed)
- Meta-Descriptions für Impressum und Datenschutz ergänzt
- Canonical-Tags auf allen Seiten verifiziert
- SEO-Textregeln in .cursor/rules/project.md verankert
- Footer: fehlende Links und Telefonnummer korrigiert
- Blog-Titel SEO-optimiert

### Phase 2: Content Expansion
- 3 Geo-Seiten auf 800+ Wörter erweitert (Augsburg, München, Bayern)
- 4 Use-Case-Seiten auf 600+ Wörter erweitert mit branchenspezifischen Modulen
- Blog-Übersichtsseite verifiziert und aktualisiert

### Phase 3: Homepage Visual Overhaul
- 1280px+ und 1600px+ Breakpoints für Spacing
- Hero: Social-Proof-Badge (5.0 Google) und Trust-Line
- Neue Vergleichssektion "Selbst machen vs. KI-Prozessnavigator"
- GSAP-Animationen komplett überarbeitet (CustomEase, SplitText, Stagger)
- SVG aria-hidden="true" auf allen dekorativen SVGs (Homepage)
- font-feature-settings 'cv01', 'cv02' für Inter Variable
- min-height: 44px auf allen Buttons (Touch Targets)

### Phase 4: Subpage Visual Consistency
- Subpage-Hero SplitText-Animation auf allen Unterseiten
- og:image Meta-Tag auf allen Seiten ergänzt
- llms.txt für KI-Suchmaschinen erstellt
- SVG-Farbtokens auf Unterseiten standardisiert

### Phase 5: Neue Content-Seiten
- preise.html: 3-Stufen-Preismodell (Starter, Professional, Enterprise)
- use-cases/case-study-leadrecherche.html: Lead-Recherche 5h auf 30 Min
- use-cases/case-study-rechnungen.html: Rechnungsverarbeitung 0% Fehler
- blog/n8n-vs-make-vs-zapier.html: Tool-Vergleich
- blog/dsgvo-checkliste-ki-tools.html: 10-Punkte DSGVO-Checkliste
- blog/ki-fuer-kleine-unternehmen.html: KI-Einstieg ohne Technik-Wissen
- Navigation, Footer, Sitemap mit allen neuen Seiten aktualisiert
- CSS: Pricing-Card-Styles (.card--featured, .card__price, .card__list)

### Phase 6: QA & Polish
- Interne Links: 0 Broken Links verifiziert
- Case-Study-Links auf use-cases.html Hub-Seite ergänzt
- BreadcrumbList JSON-LD auf 10 weiteren Seiten ergänzt
- FAQPage Schema auf ablauf.html ergänzt
- aria-hidden="true" auf allen 120+ dekorativen SVGs sitewide
- Dokumentation aktualisiert (changelog, backlog, seo-meta-tags)

## [18.05.2026] — Animation & Visual Polish + Deep Cleanup

### Animations & Visual Features
- Hero: Neue Headline mit Wort-Rotation (kopieren/nachfassen/abtippen/verwalten/koordinieren)
- Hero: Dashboard-Mockup mit KPIs, Chart, Workflow-Status, Activity-Feed, Toast
- Live-Ticker mit Workflow-Events zwischen Hero und Marquee
- Marquee: Glass-Container mit Borders
- Consequence Cards: 200ms Stagger
- Module Cards: 3D-Tilt + 6 Icon-Micro-Animationen
- Timeline: Pulsing Cyan Dot
- CTA-Sektion: Glow-Pulse
- Calculator: Donut-Chart SVG
- Transformation: Checkmark SVG Stroke-Animation
- Scroll-CountUp (`data-scroll-count`)
- Dot-Pattern Hintergrund

### Umlaut-Fixes
- ~80 fehlende Umlaute gefixt (index, faq, vorteile, ueber-uns, header)

### Projekt-Cleanup
- V1 (459 MB) + altes Projekt (490 MB) gelöscht
- Obsolete Dateien entfernt (_handoff, build_main_v4, .htaccess, start-lokal.bat)
- Nicht-referenzierte Assets gelöscht
- Veraltete Docs entfernt, aktive docs/ konsolidiert
- Config-Dateien (CLAUDE.md, .cursor/rules/project.md) von toten Referenzen bereinigt

## [17.05.2026] — Website-Rework Phasen 0–6

- Phase 0+1: @layer CSS-Architektur, Design-Tokens, Fonts
- Phase 2: Homepage mit 15+ Sektionen
- Phase 4: Alle Subpages + Legal Pages
- Phase 5: GSAP Animationen, Calculator, Accordion, Cookie-Banner
- Phase 6: 9 Blog-Artikel, 3 Geo-Seiten, 4 Use-Case-Seiten, Nginx-Config, Print Stylesheet

## [05.05.2026] — Projekt-Setup

- CLAUDE.md + .cursor/rules/project.md angelegt
- docs/ Ordner mit SEO-Docs, Backlog, Content
- CSS @layer-Architektur entworfen

## [03.05.2026] — Projektpaket angelegt

- Projekt-Ordner erstellt, Grundstruktur aufgesetzt
