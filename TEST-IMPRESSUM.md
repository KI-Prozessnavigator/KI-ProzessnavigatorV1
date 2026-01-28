# Test-Anleitung: Impressum-Seite

## ✅ Schnelltest

### 1. Impressum-Link im Footer testen
1. Öffnen Sie `index.html` im Browser
2. Scrollen Sie ganz nach unten zum Footer
3. Rechte Spalte "Rechtliches" → Klicken Sie auf **"Impressum"**
4. ✅ Sie sollten zur Impressum-Seite weitergeleitet werden

### 2. Impressum-Link im Cookie-Modal testen
1. Öffnen Sie `index.html` im Browser
2. Klicken Sie im Cookie-Banner auf "Einstellungen"
3. Am unteren Rand des Modals: **"Impressum"**
4. Klicken Sie darauf
5. ✅ Sie sollten zur Impressum-Seite weitergeleitet werden

### 3. Navigation auf der Impressum-Seite testen
1. Wenn Sie auf der Impressum-Seite sind
2. Oben im Hero-Bereich: **"← Zurück zur Startseite"**
3. Klicken Sie darauf
4. ✅ Sie sollten zurück zur Hauptseite gelangen

### 4. Footer auf der Impressum-Seite testen
1. Wenn Sie auf der Impressum-Seite sind
2. Scrollen Sie zum Footer
3. Klicken Sie auf **"Datenschutz"**
4. ✅ Sie sollten zur Datenschutz-Seite wechseln

## 📋 Vollständiger Funktionstest

### Design & Layout
- [ ] Header wird korrekt angezeigt (gleiches Design wie Hauptseite)
- [ ] Footer wird korrekt angezeigt (gleiches Design wie Hauptseite)
- [ ] Hero-Bereich mit Titel "Impressum" und "Zurück"-Button
- [ ] Alle Sections sind ordentlich strukturiert
- [ ] Kontaktbox ist hervorgehoben (grüner Gradient)
- [ ] Info-Items (USt-ID, Kontakt) sind optisch ansprechend

### Responsive Design
- [ ] Desktop: Alles lesbar und gut strukturiert
- [ ] Tablet: Layout passt sich an
- [ ] Mobile: Schriftgröße angepasst, keine horizontale Scrollbar

### Inhalte
- [ ] Name und Anschrift sichtbar
- [ ] Kontaktdaten (Telefon, E-Mail) vorhanden
- [ ] Telefon- und E-Mail-Links funktionieren
- [ ] Umsatzsteuer-ID korrekt angezeigt
- [ ] Redaktionell Verantwortlicher genannt
- [ ] EU-Streitschlichtung vorhanden
- [ ] Verbraucherstreitbeilegung vorhanden
- [ ] Haftungsausschlüsse vorhanden
- [ ] Urheberrecht beschrieben

### Links & Navigation
- [ ] "Zurück zur Startseite" (Hero) funktioniert
- [ ] "Zurück zur Startseite" (unten) funktioniert
- [ ] EU-Streitschlichtungs-Link öffnet externe Seite
- [ ] Footer-Links funktionieren (Datenschutz, etc.)

### SEO & Meta
- [ ] Seiten-Titel: "Impressum | KI-Prozessnavigator"
- [ ] Meta-Description vorhanden
- [ ] robots: "noindex, follow" (korrekt für Impressum)
- [ ] Favicon wird angezeigt

## 🔗 Wo ist das Impressum verlinkt?

```
┌─────────────────────────────────────────────┐
│           HAUPTSEITE (index.html)           │
└─────────────────────────────────────────────┘

1. 🔗 FOOTER (ganz unten)
   └─ "Rechtliches" Spalte
      └─ [Impressum] ← Klick hier
           ↓
        führt zu impressum.html

2. 🔗 COOKIE-MODAL
   └─ Unten im Modal: "Datenschutzerklärung | Impressum"
      └─ [Impressum] ← Klick hier
           ↓
        führt zu impressum.html


┌─────────────────────────────────────────────┐
│     IMPRESSUM-SEITE (impressum.html)        │
└─────────────────────────────────────────────┘

🔙 ZURÜCK-BUTTONS
   └─ Oben: "← Zurück zur Startseite"
   └─ Unten: Button "← Zurück zur Startseite"
        ↓
     führt zurück zu index.html

🔗 FOOTER
   └─ "Rechtliches" → Datenschutz
        ↓
     führt zu datenschutz.html
```

## ⚠️ Häufige Probleme & Lösungen

### Problem: Impressum-Seite wird nicht gefunden (404)
**Lösung**: 
- Prüfen Sie, ob `impressum.html` im gleichen Ordner wie `index.html` liegt
- Browser-Cache leeren (Strg + F5)

### Problem: Header/Footer werden nicht angezeigt
**Lösung**:
- Prüfen Sie, ob `js/template-loader.js` vorhanden ist
- Prüfen Sie, ob `includes/header.html` und `includes/footer.html` vorhanden sind
- Browser-Console öffnen (F12) und auf Fehler prüfen

### Problem: Styling sieht anders aus als Hauptseite
**Lösung**:
- Alle CSS-Dateien müssen geladen werden (siehe `<head>` der impressum.html)
- Browser-Cache leeren

## 📱 Mobile-Test

Testen Sie die Impressum-Seite auf verschiedenen Bildschirmgrößen:
- [ ] Smartphone (< 640px): Kompakte Darstellung
- [ ] Tablet (640px - 1024px): Medium Layout
- [ ] Desktop (> 1024px): Volle Breite

**Tipp**: Browser-DevTools → Toggle Device Toolbar (Strg + Shift + M)

## ✅ Erfolgreich, wenn:

- ✅ Impressum-Link im Footer führt zur Impressum-Seite
- ✅ Impressum-Link im Cookie-Modal führt zur Impressum-Seite
- ✅ Impressum-Seite zeigt korrektes Design (wie Hauptseite)
- ✅ Header und Footer werden dynamisch geladen
- ✅ Alle Inhalte sind vollständig und lesbar
- ✅ Navigation zurück zur Hauptseite funktioniert
- ✅ Responsive Design funktioniert auf allen Geräten
- ✅ Alle Links (Telefon, E-Mail, externe Links) funktionieren

---

**Status**: Impressum-Seite ist voll funktionsfähig! ✅
