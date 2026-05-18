# BACKLOG — Offene Aufgaben

Letzte Aktualisierung: 03.05.2026

## Legende
- [ ] Offen
- [x] Erledigt
- [!] Blockiert (Grund dahinter)

---

## PHASE 0: AUDIT & VORBEREITUNG

- [ ] Kompletter Projekt-Audit durchführen
- [ ] Audit-Ergebnis in docs/audit-ergebnis.md dokumentieren
- [ ] Alten Website-Text in docs/content-aktuell.md erfassen
- [ ] Tote Dateien löschen (main-v4.css, build_main_v4.js, start-lokal.bat)
- [ ] Geist-Font WOFF2 beschaffen und in assets/fonts/ ablegen
- [ ] SSI auf IONOS testen
- [ ] Bilder-Inventur: was wird genutzt, was kann weg?
- [ ] Bilder in WebP konvertieren
- [ ] Git-Branch: rebuild/v2

## PHASE 1: CSS-MIGRATION

- [ ] tokens.css erstellen (Claude Design Werte, Blau→Grün)
- [ ] base.css erstellen (Reset, @font-face, Container, Buttons)
- [ ] components.css Grundgerüst erstellen (Kommentar-Header)
- [ ] pages.css erstellen (leer)
- [ ] Komponente migrieren: Header/Nav
- [ ] Komponente migrieren: Hero
- [ ] Komponente migrieren: Marquee (Tool-Logos)
- [ ] Komponente migrieren: Problem-Awareness
- [ ] Komponente migrieren: Founder-Card
- [ ] Komponente migrieren: Vergleichs-Slider (Wir vs. Du)
- [ ] Komponente migrieren: ROI-Calculator
- [ ] Komponente migrieren: Use-Case Tabs / Bento
- [ ] Komponente migrieren: Process Steps
- [ ] Komponente migrieren: DSGVO Section
- [ ] Komponente migrieren: FAQ Accordion
- [ ] Komponente migrieren: Final CTA
- [ ] Komponente migrieren: Footer
- [ ] Komponente migrieren: Contact Modal
- [ ] Komponente migrieren: Cookie Banner
- [ ] Komponente migrieren: Blog-Cards / Blog-Detail
- [ ] Komponente migrieren: Legal-Pages
- [ ] Alle alten CSS-Dateien löschen (13 Dateien → 0)

## PHASE 2: HTML-BEREINIGUNG

- [ ] index.html: Inline-Styles entfernen (60+ Stück)
- [ ] index.html: <style>-Blöcke entfernen (3 Stück)
- [ ] index.html: CSS-Links auf neue 4 Dateien umstellen
- [ ] index.html: Header/Footer durch SSI-Includes ersetzen
- [ ] ueber-uns.html: bereinigen + Content erweitern
- [ ] blog.html: bereinigen
- [ ] impressum.html: bereinigen + Rechts-Fixes
- [ ] datenschutz.html: bereinigen + Rechts-Fixes
- [ ] agb.html: bereinigen + Rechts-Fixes
- [ ] barrierefreiheit.html: bereinigen + BFSG-Update
- [ ] Blog-Artikel (9 Stück): bereinigen

## PHASE 3: NEUE SEITEN

- [ ] vorteile.html (eigenständiger Content — NICHT = Startseite!)
- [ ] use-cases.html (eigenständiger Content — NICHT = Startseite!)
- [ ] ablauf.html (eigenständiger Content — NICHT = Startseite!)
- [ ] faq.html (eigenständiger Content + FAQ-Schema)
- [ ] kontakt.html
- [ ] 404.html (Custom-Fehlerseite mit Navigation + CTA)
- [ ] danke.html (Bestätigungsseite für Conversion-Tracking)

## PHASE 4: BRANCHEN- & GEO-LANDINGPAGES

- [ ] use-cases/handwerk.html
- [ ] use-cases/agenturen.html
- [ ] use-cases/dienstleister.html
- [ ] use-cases/it-dienstleister.html
- [ ] geo/augsburg.html
- [ ] geo/muenchen.html
- [ ] geo/bayern.html

## PHASE 5: SEO & SCHEMA

- [ ] Meta-Tags für alle Seiten (Title, Description, Canonical, OG)
- [ ] JSON-LD: LocalBusiness (Startseite)
- [ ] JSON-LD: FAQPage (FAQ-Seite)
- [ ] JSON-LD: Article (Blog-Artikel)
- [ ] JSON-LD: BreadcrumbList (alle Unterseiten)
- [ ] JSON-LD: Service (Use-Case-Seiten)
- [ ] Breadcrumb-Navigation (HTML + CSS + Schema)
- [ ] Lokale Keywords auf Startseite einarbeiten (Augsburg, Bayern)
- [ ] Interne Verlinkung: jede Seite → 2-3 andere Seiten
- [ ] sitemap.xml aktualisieren (alle neuen URLs)
- [ ] robots.txt aktualisieren
- [ ] llms.txt erstellen (für KI-Crawler / GEO)
- [ ] feed.xml (RSS-Feed für Blog)

## PHASE 6: FEHLENDE FEATURES

- [ ] Sticky Mobile CTA (erscheint nach Hero-Scroll)
- [ ] Testimonials / Kundenstimmen (mind. 3-4 mit Name + Branche)
- [ ] Theme-Toggle (Light ↔ Dark) + JS
- [ ] Mouse-Spotlight Ambient-Effekt (aus Claude Design)
- [ ] Preconnect-Tags für externe Ressourcen (Calendly etc.)
- [ ] Print-Stylesheet (@media print in pages.css)
- [ ] Blog: Verwandte Artikel am Ende
- [ ] Blog: Autor-Info mit Person-Schema
- [ ] Blog: Inhaltsverzeichnis bei langen Artikeln
- [ ] Blog: Social-Sharing-Buttons

## PHASE 7: RECHTS-FIXES

- [ ] Datenschutz: Cookie-Banner ↔ DSE konsistent machen
- [ ] Datenschutz: _ga/_gid unter Statistik (nicht Marketing)
- [ ] Datenschutz: Vimeo-Abschnitt entfernen (nicht genutzt)
- [ ] Datenschutz: Facebook-Pixel-Abschnitt ergänzen
- [ ] Datenschutz: Aufbewahrungsfristen konkretisieren
- [ ] Datenschutz: Newsletter/E-Mail-Marketing-Abschnitt
- [ ] AGB: B2C-Gewährleistung klarer formulieren (§ 6.3)
- [ ] AGB: Quellcode-Eigentumsklausel differenzieren (§ 8.5)
- [ ] Barrierefreiheit: Datum hinzufügen
- [ ] Barrierefreiheit: BFSG-Prüfung Zuständigkeit
- [ ] Footer-Links: konsistent (mit oder ohne .html)
- [ ] Checklisten-Download: Double-Opt-In sicherstellen

## PHASE 8: PERFORMANCE & CONFIG

- [ ] .htaccess: SSI aktivieren
- [ ] .htaccess: Gzip-Kompression
- [ ] .htaccess: Browser-Cache-Header
- [ ] .htaccess: Saubere URLs (ohne .html)
- [ ] .htaccess: HTTPS erzwingen
- [ ] .htaccess: Security-Headers (X-Content-Type, X-Frame, Referrer-Policy)
- [ ] .htaccess: Content Security Policy
- [ ] .htaccess: 301-Redirects für geänderte URLs
- [ ] .htaccess: ErrorDocument 404 /404.html
- [ ] manifest.json (PWA/Favicon-Referenzen)
- [ ] Analytics-Konzept dokumentieren (Events, Conversions)

## PHASE 9: QA & LAUNCH

- [ ] Lighthouse: Performance ≥ 90
- [ ] Lighthouse: SEO ≥ 95
- [ ] Lighthouse: Accessibility ≥ 90
- [ ] Viewport-Test: 375px (iPhone SE)
- [ ] Viewport-Test: 390px (iPhone 14)
- [ ] Viewport-Test: 412px (Samsung Galaxy)
- [ ] Viewport-Test: 768px (iPad)
- [ ] Viewport-Test: 1024px (iPad Pro)
- [ ] Viewport-Test: 1280px (Laptop)
- [ ] Viewport-Test: 1920px (Desktop)
- [ ] Tastatur-Navigation testen
- [ ] Cookie-Banner Consent-Flow testen
- [ ] Contact-Modal testen
- [ ] Alle Links prüfen (keine 404)
- [ ] Alle Formulare testen
- [ ] Schema.org validieren (Rich Results Test)
- [ ] Google Search Console: Sitemap einreichen
- [ ] Google Business Profil: URL aktualisieren
- [ ] 0 !important im CSS (Finale Prüfung)
- [ ] 0 Inline-Styles im HTML (Finale Prüfung)
- [ ] Kein Duplicate Content (Finale Prüfung)
