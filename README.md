# KI-Prozessnavigator

Eine moderne One-Page Website zur Bewerbung von KI-gestützter Prozessoptimierung.

## 📁 Projektstruktur

```
KI-ProzessnavigatorV1/
├── index.html              # Hauptseite (Onepager)
├── css/
│   ├── reset.css           # CSS Reset & Normalize
│   ├── variables.css       # Design System (Farben, Fonts, Spacing)
│   ├── styles.css          # Hauptstyles
│   └── responsive.css      # Responsive Breakpoints
├── js/
│   └── main.js             # Interaktive Funktionalität
├── assets/
│   ├── icons/
│   │   └── favicon.svg     # Favicon
│   └── images/             # Bilder (leer)
└── README.md               # Diese Datei
```

## 🎨 Design System

### Farben
- **Primary (Petrol):** `#0d7377` - Vertrauenswürdig, professionell
- **Accent (Coral):** `#e85a4f` - Aufmerksamkeitsstark, warm
- **Neutrals:** Warme Grautöne für Text und Hintergründe

### Typografie
- **Überschriften:** Instrument Serif (elegant, markant)
- **Fließtext:** Plus Jakarta Sans (modern, lesbar)

### Breakpoints
- Mobile: < 576px
- Tablet: < 768px
- Desktop: < 992px
- Large: > 1400px

## 🚀 Features

- ✅ Responsive Design (Mobile-First)
- ✅ Smooth Scrolling Navigation
- ✅ Mobile Hamburger Menu
- ✅ Scroll-Animationen
- ✅ Kontaktformular + Checkliste (Backend via PHP)
- ✅ Accessibility-optimiert
- ✅ Performance-optimiert

## 💻 Lokale Entwicklung

1. Projekt-Ordner öffnen
2. Mit einem lokalen Server starten:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js (npx)
   npx serve
   
   # VS Code: Live Server Extension
   ```
3. Im Browser öffnen: `http://localhost:8000`

## 📧 PHP Backend (Kontaktformular & Checkliste)

Es gibt zwei JSON-Endpunkte:

- `php/send-email.php`: Kontakt/Anfrage aus dem Kontakt-Modal (`js/contact-modal.js`)
- `php/send-checklist.php`: Checkliste/Lead Magnet (`js/main.js`)

### Abhängigkeiten (PHPMailer)

Für zuverlässigen SMTP-Versand wird PHPMailer genutzt (Fallback ist `mail()`, je nach Hosting oft eingeschränkt).

Installieren:

```bash
composer install --no-dev
```

### Konfiguration (keine Secrets im Repo)

Die Werte werden über Environment-Variablen gesetzt (auf dem Hosting).
Wichtige Variablen:

- `SMTP_PASSWORD` (Pflicht in Prod)
- optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`
- optional: `RECIPIENT_EMAIL`
- optional: `CSRF_SECRET`

## 📋 Nächste Schritte

1. **Content erstellen:**
   - Service-Cards mit Icons und Beschreibungen
   - Prozess-Timeline mit Schritten
   - About-Section mit Team/Unternehmen
   
2. **Bilder hinzufügen:**
   - Hero-Grafik oder Foto
   - Service-Icons
   - Team-Fotos (falls gewünscht)

3. **Backend/Integration:**
   - Kontaktformular an API anbinden
   - Analytics integrieren

## 📝 Lizenz

© 2026 KI-Prozessnavigator. Alle Rechte vorbehalten.

