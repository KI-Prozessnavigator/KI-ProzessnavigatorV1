# Roadmap: Audit 10/10 – Was muss angepasst werden?

**Ziel:** Jeden Audit-Bereich auf **10/10** bringen.  
**Basis:** Re-Audit (aktueller Stand ~5,8/10).

---

## 1. Architektur & Code-Qualität (aktuell 5/10 → 10/10)

### Was fehlt für 10/10

| Anpassung | Konkret | Aufwand |
|-----------|---------|--------|
| **Dead Code entfernen** | Ungenutzte Dateien löschen oder aus dem Build ausnehmen: `hero-3d.css` (nach Verschieben der Skip-Link-Styles), `live-impact-dashboard.css`, `neural-network-automation.css`, `solar-system.css`, `ki-process-navigator.css`; sowie `hero-3d.js`, `ki-process-navigator.js`, `solar-system-navigator.js`, `template-loader.js`, `neural-network-automation.js`, `live-impact-dashboard.js`. | Mittel |
| **Skip-Link-Styles verschieben** | `.skip-link` und `.skip-link:focus` aus `hero-3d.css` in `styles.css` oder `components.css` kopieren; danach `hero-3d.css` aus `index.html` entfernen. | Gering |
| **EmailJS entfernen** | Falls nirgends mehr genutzt: Script-Tag und `window.EMAILJS_CONFIG`-Block aus `index.html` entfernen. | Gering |
| **Build-Pipeline einführen** | z. B. Vite oder esbuild: CSS/JS bündeln und minifizieren, ggf. Tree-Shaking. Ein Einstieg: `npm init`, Vite hinzufügen, HTML auf gebündelte Assets umstellen. | Hoch |
| **Struktur klären** | Header/Footer per Include oder Template (z. B. beim Build) einbinden, damit keine Duplikation in index/datenschutz/impressum/agb. Optional: Komponenten- oder Atomic-Struktur (z. B. Ordner `components/`, `layouts/`). | Mittel |
| **HTML-Kommentar entfernen** | A/B-Varianten-Kommentar im Hero (index.html ca. Zeile 277–284) löschen. | Gering |

**Kern für 10/10:** Kein toter Code im Repo, klare Struktur, mindestens ein Build-Step (Bundle + Minify).

---

## 2. Performance & Core Web Vitals (aktuell 5/10 → 10/10)

### Was fehlt für 10/10

| Anpassung | Konkret | Aufwand |
|-----------|---------|--------|
| **CSS zusammenführen** | 15 CSS-Dateien zu wenigen oder einer gebündelten Datei (per Build). Weniger Requests, besseres Caching. | Mittel |
| **Inline-Styles reduzieren** | Value-Calculator- und Trust-Bar-Styles in Klassen auslagern (neue Klassen in CSS, im HTML nur class nutzen). Weniger HTML-Größe, bessere Wiederverwendung. | Mittel |
| **HTML schlanker machen** | Lange index.html durch Komponenten/Build oder Auslagerung von Inhalten (z. B. FAQ, Use Cases) in separate Dateien, die beim Build eingebunden werden. | Hoch |
| **Lazy Loading konsequent** | Alle Bilder unterhalb des Folds mit `loading="lazy"`; Hero-Logo ohne lazy (bereits so). Evtl. `fetchpriority="high"` nur für das erste sichtbare Bild. | Gering |
| **Kritische Ressourcen priorisieren** | Critical CSS weiter im Head; Rest asynchron oder per `media="print" onload="this.media='all'"` laden. Fonts bereits preload – beibehalten. | Mittel |
| **Externe Skripte optimieren** | Falls EmailJS bleibt: mit `async` oder `defer` und ggf. erst bei Bedarf (z. B. bei Klick auf „Kontakt“) laden. | Gering |

**Kern für 10/10:** Wenige, gebündelte Assets; wenig Inline-Styles; klare Priorisierung (Critical Path); LCP, FID, CLS messbar verbessern.

---

## 3. SEO & Semantik (aktuell 6/10 → 10/10)

### Was fehlt für 10/10

| Anpassung | Konkret | Aufwand |
|-----------|---------|--------|
| **Sitemap anlegen** | `sitemap.xml` im Root mit allen öffentlichen URLs (index, datenschutz, impressum, agb). In Google Search Console eintragen. | Gering |
| **Schema.org erweitern** | Pro Unterseite (datenschutz, impressum, agb) ein `WebPage`- oder `Article`-Schema mit `name`, `description`, `url`. Optional `BreadcrumbList` für Navigation. | Mittel |
| **Meta pro Seite** | Jede Seite mit eigenem `<title>`, `<meta name="description">`, `og:title`, `og:description`, `canonical` – bei euch weitgehend vorhanden; prüfen, ob alle Unterseiten vollständig sind. | Gering |
| **Überschriften-Hierarchie** | Eine H1, dann logische H2/H3/H4 ohne Sprünge (z. B. keine H2 nach H4). Im Audit prüfen und ggf. anpassen. | Gering |
| **robots.txt** | Falls noch nicht vorhanden: `robots.txt` mit Verweis auf `sitemap.xml`. | Gering |

**Kern für 10/10:** Sitemap, konsistente Meta-Daten, strukturierte Daten auf allen relevanten Seiten, saubere H1–H6-Struktur.

---

## 4. Accessibility (A11y) (aktuell 7/10 → 10/10)

### Was fehlt für 10/10

| Anpassung | Konkret | Aufwand |
|-----------|---------|--------|
| **rel="noreferrer" ergänzen** | In index.html Zeile 1528 beim Datenschutz-Link (Lead-Magnet) `rel="noopener noreferrer"` setzen. | Gering |
| **Skip-Link immer sichtbar bei Fokus** | Sicherstellen, dass `.skip-link:focus` gut sichtbar und kontrastreich ist (Styles in zentraler CSS-Datei, siehe Architektur). | Gering |
| **Kontrast prüfen** | Alle Texte und UI-Elemente mit Tool (z. B. axe DevTools, WAVE, Contrast Checker) prüfen; Mindestkontrast WCAG AA (4.5:1 für Fließtext, 3:1 für große Texte). Dunkles Theme gezielt prüfen. | Mittel |
| **Tastaturbedienbarkeit** | Alle interaktiven Elemente per Tab erreichbar; Modals mit Fokus-Falle (Tab bleibt im Modal) und Esc zum Schließen; Fokus nach Schließen auf auslösendes Element zurück. | Mittel |
| **Fokus-Indikatoren** | Kein `outline: none` ohne Ersatz; sichtbare Fokus-Rahmen für Links, Buttons, Inputs (z. B. mit `:focus-visible`). | Gering |
| **ARIA wo nötig** | Modals mit `aria-modal="true"`, `aria-labelledby`, `aria-describedby`; dynamische Bereiche mit `aria-live` wenn Inhalte sich ändern. Bereits teils umgesetzt – vollständig prüfen. | Mittel |
| **Reduced Motion** | Optional: `prefers-reduced-motion: reduce` in CSS berücksichtigen (Animationen reduzieren oder abschaltbar). | Gering |

**Kern für 10/10:** WCAG 2.1 AA durchgängig; alle Zielgruppen (Tastatur, Screenreader, Kontrast) abgedeckt; Fokus und ARIA konsistent.

---

## 5. Best Practices & Sicherheit (aktuell 6/10 → 10/10)

### Was fehlt für 10/10

| Anpassung | Konkret | Aufwand |
|-----------|---------|--------|
| **Security-Headers (statische Seiten)** | Bei GitHub Pages: `_headers` (z. B. bei Cloudflare Pages) oder bei Netlify `_headers`/`netlify.toml` mit z. B. `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, optional CSP. | Gering–Mittel |
| **CSP (Content-Security-Policy)** | Wenn möglich serverseitig oder per _headers: CSP setzen (script-src, style-src, etc.), um XSS und unerwünschte Skripte einzuschränken. | Mittel |
| **SRI für externe Skripte** | Falls CDN-Skripte bleiben (z. B. EmailJS): `integrity` und `crossorigin` ergänzen, sofern der Anbieter Hashes liefert. | Gering |
| **Kein innerHTML für Nutzerdaten** | Bereits erledigt bei Notifications. Alle anderen innerHTML-Stellen prüfen: Nur feste Templates oder vorher escapen/sanitizen. | Gering |
| **PHP-Header ergänzen** | In `send-email.php` und `send-checklist.php` zusätzlich z. B. `X-Content-Type-Options: nosniff` (bereits teils vorhanden), `Referrer-Policy`, ggf. CSP für API-Responses. | Gering |

**Kern für 10/10:** Security-Headers überall wo möglich; keine ungeprüften Nutzerdaten in innerHTML; externe Skripte mit SRI.

---

## Priorisierung: Reihenfolge für maximalen Nutzen

### Phase 1 – Quick Wins (ca. 1–2 Stunden)
1. rel="noreferrer" bei Zeile 1528 ergänzen.  
2. A/B-Kommentar im Hero entfernen.  
3. Skip-Link-Styles in `styles.css`/`components.css` verschieben, `hero-3d.css` aus index entfernen.  
4. EmailJS entfernen, falls nicht genutzt.  
5. `sitemap.xml` anlegen und in Search Console eintragen.  
6. `robots.txt` mit Sitemap-Verweis.

### Phase 2 – Struktur & Aufräumen (ca. ½ Tag)
7. Dead CSS/JS-Dateien löschen oder dokumentieren.  
8. Inline-Styles schrittweise in Klassen auslagern (Value Calculator, Trust Bar).  
9. Schema.org für datenschutz/impressum/agb (WebPage/BreadcrumbList).  
10. Kontrast-Check (axe/WAVE) und Fokus-Styles prüfen.

### Phase 3 – Build & Performance (ca. 1–2 Tage)
11. Build mit Vite (oder ähnlich): CSS/JS bündeln und minifizieren.  
12. Critical CSS optimieren; Rest verzögert laden.  
13. Header/Footer per Include oder Build einbinden.

### Phase 4 – A11y & Security (ca. ½ Tag)
14. Tastatur- und Fokus-Management in Modals (Fokus-Falle, Esc, Rückfokus).  
15. Security-Headers (_headers oder Server-Config).  
16. Optional: SRI für externe Skripte, CSP, Reduced Motion.

---

## Kurz-Checkliste „10/10“

- [ ] Kein Dead Code (CSS/JS nur eingebunden, wenn genutzt).  
- [ ] Build-Pipeline (Bundle + Minify) vorhanden.  
- [ ] Sitemap + robots.txt + Schema auf allen relevanten Seiten.  
- [ ] Alle `target="_blank"` mit `rel="noopener noreferrer"`.  
- [ ] Skip-Link in zentraler CSS-Datei, Fokus sichtbar.  
- [ ] Kontrast WCAG AA; Fokus-Indikatoren überall.  
- [ ] Modals tastaturbedienbar (Fokus-Falle, Esc).  
- [ ] Security-Headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, ggf. CSP).  
- [ ] Kein innerHTML mit ungeprüften Nutzerdaten.  
- [ ] Externe Skripte mit SRI, wenn angeboten.

Wenn diese Punkte umgesetzt sind, sind die Voraussetzungen für ein **10/10-Audit** in allen fünf Bereichen erfüllt.
