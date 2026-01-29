# Datenschutz-Unterseite - Dokumentation

## Übersicht

Die Datenschutz-Unterseite wurde als separate HTML-Seite implementiert, die das gleiche Design wie die Hauptseite verwendet und dynamisch Header und Footer teilt.

## Struktur

### Neue Dateien

1. **datenschutz.html** - Die Datenschutz-Unterseite
   - Vollständiger Datenschutztext in strukturierten Sections
   - Gleiches Design wie die Hauptseite
   - Responsive Layout
   - "Zurück zur Startseite"-Button im Hero

2. **includes/header.html** - Header-Template
   - Wiederverwendbarer Header für alle Seiten
   - Wird dynamisch geladen

3. **includes/footer.html** - Footer-Template
   - Wiederverwendbarer Footer für alle Seiten
   - Wird dynamisch geladen

4. **js/template-loader.js** - Template-Loader Script
   - Lädt Header und Footer dynamisch
   - Funktioniert für alle Seiten

## Aktualisierte Links

Folgende Links wurden auf `datenschutz.html` aktualisiert:

### In index.html:
- Footer → "Rechtliches" → "Datenschutz"
- Lead-Formular (Checkliste) → Datenschutz-Checkbox
- Kontakt-Modal → Datenschutz-Checkbox
- Analyse-Modal → Datenschutz-Checkbox
- Cookie-Banner → Datenschutz-Link
- Cookie-Modal → Datenschutz-Link
- FAQ-Sektion → "Was passiert mit unseren Daten?" → Link zur vollständigen Datenschutzerklärung

## Funktionsweise

### Template-System

1. **Automatisches Laden**
   - `template-loader.js` lädt automatisch beim Seitenaufruf
   - Sucht nach `<div id="header-placeholder"></div>`
   - Sucht nach `<div id="footer-placeholder"></div>`
   - Ersetzt diese durch die tatsächlichen Templates

2. **Events**
   - `headerLoaded` - wird gefeuert, wenn Header geladen ist
   - `footerLoaded` - wird gefeuert, wenn Footer geladen ist

### Zentrale Verwaltung

Änderungen an Header oder Footer müssen nur in den Template-Dateien vorgenommen werden:
- `includes/header.html` - Änderungen gelten für alle Seiten
- `includes/footer.html` - Änderungen gelten für alle Seiten

## Navigation

### Von der Hauptseite zur Datenschutzseite:
- Footer: "Rechtliches" → "Datenschutz"
- FAQ: "Was passiert mit unseren Daten?" → Link
- Alle Formulare: Datenschutz-Checkbox-Link

### Von der Datenschutzseite zurück:
- Hero-Bereich: "← Zurück zur Startseite"-Link
- Footer: Navigation zur Hauptseite

## Styling

Die Datenschutzseite verwendet:
- Alle Standard-CSS-Dateien der Hauptseite
- Zusätzliche inline Styles für datenschutz-spezifische Elemente:
  - `.privacy-hero` - Hero-Bereich mit Zurück-Button
  - `.privacy-section` - Strukturierte Content-Sections
  - `.privacy-contact` - Hervorgehobene Kontaktbox

## Responsive Design

Die Datenschutzseite ist vollständig responsive:
- **Desktop**: 3-Spalten Layout, große Schriftgrößen
- **Tablet**: 2-Spalten Layout, mittlere Schriftgrößen
- **Mobile**: 1-Spalte Layout, kompakte Darstellung

## SEO

Die Datenschutzseite ist für SEO optimiert:
- `noindex, follow` - Nicht in Suchmaschinen-Index, aber Links folgen
- Canonical URL gesetzt
- Strukturierte Überschriften (H1, H2, H3)
- Semantisches HTML

## Datenschutz-Inhalt

Der Datenschutztext enthält folgende Abschnitte:

1. **Datenschutz auf einen Blick**
   - Allgemeine Hinweise
   - Datenerfassung
   - Ihre Rechte

2. **Allgemeine Hinweise und Pflichtinformationen**
   - Verantwortliche Stelle (Ihre Kontaktdaten)
   - Rechtsgrundlagen
   - SSL-Verschlüsselung
   - Widerrufsrechte

3. **Datenerfassung auf dieser Website**
   - Cookies
   - Server-Log-Dateien
   - Kontaktformular
   - Calendly (für zukünftige Nutzung)

4. **Soziale Medien**
   - Instagram, TikTok, Facebook, LinkedIn

5. **Analyse-Tools und Werbung**
   - Google Tag Manager
   - Google Analytics
   - Google Ads

6. **Plugins und Tools**
   - YouTube (erweiterter Datenschutz)
   - Vimeo (ohne Tracking)

7. **Audio- und Videokonferenzen**
   - Google Meet

## Zukünftige Erweiterungen

Um weitere Unterseiten hinzuzufügen (z.B. Impressum, AGB):

1. Neue HTML-Datei erstellen (z.B. `impressum.html`)
2. Header und Footer Platzhalter einfügen:
   ```html
   <div id="header-placeholder"></div>
   <!-- Content hier -->
   <div id="footer-placeholder"></div>
   ```
3. Template-Loader Script einbinden:
   ```html
   <script src="js/template-loader.js"></script>
   ```
4. Links in Footer aktualisieren

## Wartung

### Header/Footer ändern:
1. Datei öffnen: `includes/header.html` oder `includes/footer.html`
2. Änderungen vornehmen
3. Speichern - Änderungen gelten automatisch für alle Seiten

### Datenschutztext aktualisieren:
1. Datei öffnen: `datenschutz.html`
2. Relevante Section finden
3. Text anpassen
4. Speichern

## Testing

Vor dem Launch testen:
- [ ] Datenschutzseite öffnet sich korrekt
- [ ] Header und Footer laden korrekt
- [ ] Alle Links funktionieren
- [ ] Navigation zurück zur Hauptseite funktioniert
- [ ] Responsive Design auf verschiedenen Geräten
- [ ] Alle Formulare haben funktionierende Datenschutz-Links

## Browser-Kompatibilität

Die Lösung funktioniert in:
- Chrome/Edge (alle Versionen)
- Firefox (alle Versionen)
- Safari (alle Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

**Wichtig**: `fetch()` API wird verwendet - funktioniert in allen modernen Browsern.
