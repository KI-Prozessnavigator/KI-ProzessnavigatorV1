# Test-Anleitung: Datenschutz-Links

## So testen Sie, ob alle Links funktionieren:

### 1. Footer-Link testen
1. Öffnen Sie `index.html` im Browser
2. Scrollen Sie ganz nach unten zum Footer
3. Rechte Spalte "Rechtliches" → Klicken Sie auf **"Datenschutz"**
4. ✅ Sie sollten zur Datenschutzseite weitergeleitet werden

### 2. FAQ-Link testen
1. Öffnen Sie `index.html` im Browser
2. Scrollen Sie zur FAQ-Sektion
3. Klicken Sie auf die Frage **"Was passiert mit unseren Daten? (DSGVO)"**
4. Die Antwort klappt auf
5. Am Ende der Antwort sehen Sie: **"→ Vollständige Datenschutzerklärung lesen"**
6. Klicken Sie darauf
7. ✅ Sie sollten zur Datenschutzseite weitergeleitet werden

### 3. Formular-Links testen
1. Öffnen Sie `index.html` im Browser
2. Scrollen Sie zum Lead-Formular (Checkliste herunterladen)
3. Bei der Checkbox sehen Sie: "Ich stimme der **Datenschutzerklärung** zu..."
4. Klicken Sie auf "Datenschutzerklärung" (ist ein Link)
5. ✅ Neue Tab öffnet sich mit der Datenschutzseite

### 4. Cookie-Banner-Link testen
1. Öffnen Sie `index.html` im Browser (evtl. Cookies löschen)
2. Cookie-Banner erscheint am unteren Rand
3. Text: "...welche Cookie-Kategorien Sie zulassen möchten. **Datenschutzerklärung**"
4. Klicken Sie auf "Datenschutzerklärung"
5. ✅ Sie sollten zur Datenschutzseite weitergeleitet werden

### 5. Zurück-Navigation testen
1. Wenn Sie auf der Datenschutzseite sind
2. Oben im Hero-Bereich: **"← Zurück zur Startseite"**
3. Klicken Sie darauf
4. ✅ Sie sollten zurück zur Hauptseite gelangen

## Erwartetes Verhalten:

### Datenschutzseite sollte zeigen:
- ✅ Gleicher Header wie Hauptseite
- ✅ Gleicher Footer wie Hauptseite
- ✅ "Zurück zur Startseite"-Button funktioniert
- ✅ Alle 7 Datenschutz-Sections sind sichtbar
- ✅ Design passt zur Hauptseite (Dark Mode, Farben, Schriften)

### Links sollten:
- ✅ Von Footer → Datenschutzseite führen
- ✅ Von FAQ → Datenschutzseite führen
- ✅ Von allen Formularen → Datenschutzseite führen (neue Tabs)
- ✅ Von Cookie-Banner → Datenschutzseite führen

## Fehlersuche:

Falls Links nicht funktionieren:
1. **Browser-Cache leeren** (Strg + F5)
2. **Prüfen Sie, ob `datenschutz.html` im gleichen Ordner wie `index.html` liegt**
3. **Prüfen Sie die Browser-Konsole** (F12) auf Fehler

## ✅ Erfolgreich, wenn:
- Alle 7+ Datenschutz-Links funktionieren
- Datenschutzseite korrekt angezeigt wird
- Zurück-Navigation funktioniert
- Design ist konsistent
