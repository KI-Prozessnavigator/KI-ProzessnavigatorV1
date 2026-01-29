# Header & Footer - Zentrale Verwaltung

## ✅ Was wurde eingerichtet?

Header und Footer werden jetzt **automatisch** von zentralen Dateien geladen:
- `includes/header.html` → Header für alle Seiten
- `includes/footer.html` → Footer für alle Seiten

## 🎯 Wie funktioniert es?

### Betroffe Seiten:
- ✅ `impressum.html`
- ✅ `datenschutz.html`
- ✅ Weitere Unterseiten können hinzugefügt werden

### Technologie:
- `js/template-loader.js` lädt Header und Footer automatisch beim Seitenaufruf

## 📝 Header oder Footer ändern

### Option 1: Zentrale Dateien bearbeiten (EMPFOHLEN)

**Um Header zu ändern:**
1. Öffnen Sie: `includes/header.html`
2. Nehmen Sie Ihre Änderungen vor
3. Speichern Sie die Datei
4. ✅ **FERTIG!** Alle Unterseiten zeigen den neuen Header

**Um Footer zu ändern:**
1. Öffnen Sie: `includes/footer.html`
2. Nehmen Sie Ihre Änderungen vor
3. Speichern Sie die Datei
4. ✅ **FERTIG!** Alle Unterseiten zeigen den neuen Footer

### Beispiele für häufige Änderungen:

#### Logo ändern
**Datei:** `includes/header.html`
```html
<img src="assets/images/logo.svg" alt="KI-Prozessnavigator Logo" height="40">
```
Ändern Sie `logo.svg` zu Ihrem neuen Logo.

#### Kontaktdaten im Footer ändern
**Datei:** `includes/footer.html`
```html
<address class="footer__address">
    Breslauer Straße 11<br>
    86690 Mertingen
</address>
```

#### Social Media Links ändern
**Datei:** `includes/footer.html`
```html
<a href="#" class="social-link" aria-label="Instagram">
```
Ersetzen Sie `#` mit Ihrem Instagram-Link.

## 🆕 Neue Unterseite hinzufügen

Wenn Sie eine neue Unterseite erstellen (z.B. `agb.html`):

### Schritt 1: Header-Platzhalter einfügen
Statt den kompletten Header-Code zu kopieren, fügen Sie ein:
```html
<body>
    <!-- Header wird automatisch geladen -->
    <div id="header-placeholder"></div>
    
    <main>
        <!-- Ihr Seiteninhalt -->
    </main>
```

### Schritt 2: Footer-Platzhalter einfügen
Am Ende der Seite vor `</body>`:
```html
    <!-- Footer wird automatisch geladen -->
    <div id="footer-placeholder"></div>
    
    <!-- Scripts -->
    <script src="js/template-loader.js"></script>
    <script src="js/main.js" defer></script>
    <script src="js/cookie-banner.js" defer></script>
</body>
```

### Vollständiges Beispiel:
```html
<!DOCTYPE html>
<html lang="de" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>AGB - KI-Prozessnavigator</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Header wird automatisch geladen -->
    <div id="header-placeholder"></div>
    
    <main>
        <section>
            <div class="container">
                <h1>Allgemeine Geschäftsbedingungen</h1>
                <!-- Ihr Inhalt -->
            </div>
        </section>
    </main>
    
    <!-- Footer wird automatisch geladen -->
    <div id="footer-placeholder"></div>
    
    <!-- Scripts -->
    <script src="js/template-loader.js"></script>
    <script src="js/main.js" defer></script>
    <script src="js/cookie-banner.js" defer></script>
</body>
</html>
```

## ⚠️ Wichtig: Hauptseite (index.html)

Die **Hauptseite** (`index.html`) verwendet KEIN automatisches Laden!
- Header und Footer sind dort direkt im HTML-Code
- Wenn Sie Header/Footer auf der Hauptseite ändern möchten, bearbeiten Sie `index.html` direkt
- Die Includes (`includes/header.html` und `includes/footer.html`) sind NUR für Unterseiten

## 🔧 Fehlerbehebung

### Problem: Header/Footer wird nicht angezeigt

**Lösung 1:** Browser-Cache leeren
- Drücken Sie `Strg + F5` (Windows) oder `Cmd + Shift + R` (Mac)

**Lösung 2:** Überprüfen Sie die Browser-Konsole
- Drücken Sie `F12`
- Gehen Sie zum Tab "Console"
- Suchen Sie nach Fehlermeldungen
- Häufige Fehler:
  - "Failed to fetch includes/header.html" → Pfad ist falsch
  - "CORS policy" → Sie müssen die Seite über einen Webserver öffnen (nicht direkt als Datei)

**Lösung 3:** Webserver verwenden
Wenn Sie die Seite lokal testen, öffnen Sie sie über einen Webserver:
```bash
# Python 3
python -m http.server 8000

# Dann im Browser öffnen:
http://localhost:8000
```

### Problem: Änderungen werden nicht übernommen

**Lösung:** Hard Reload
- `Strg + F5` oder `Strg + Shift + R`
- Das lädt die Seite komplett neu ohne Cache

## 📊 Vorteile dieser Lösung

✅ **Zentrale Verwaltung**: Einmal ändern, überall aktiv
✅ **Zeitersparnis**: Keine doppelte Pflege mehr
✅ **Konsistenz**: Alle Seiten sehen immer gleich aus
✅ **Einfach**: Kein Build-Tool oder Backend nötig
✅ **Skalierbar**: Neue Seiten in 2 Minuten erstellt

## 🎓 Technische Details

### Wie funktioniert template-loader.js?

1. Beim Seitenaufruf sucht das Script nach:
   - `<div id="header-placeholder"></div>`
   - `<div id="footer-placeholder"></div>`

2. Lädt die HTML-Dateien:
   - `includes/header.html`
   - `includes/footer.html`

3. Ersetzt die Platzhalter mit dem geladenen Inhalt

4. Feuert Events:
   - `headerLoaded` → Header wurde geladen
   - `footerLoaded` → Footer wurde geladen

### Browser-Kompatibilität
- ✅ Chrome/Edge (ab Version 90)
- ✅ Firefox (ab Version 88)
- ✅ Safari (ab Version 14)
- ✅ Opera (ab Version 76)

## 📞 Weitere Hilfe benötigt?

Falls Sie Probleme haben oder Fragen zur Einrichtung:
1. Prüfen Sie die Browser-Konsole (F12)
2. Stellen Sie sicher, dass Sie einen Webserver verwenden
3. Vergleichen Sie Ihre Datei mit den Beispielen oben

---
**Viel Erfolg! 🚀**
