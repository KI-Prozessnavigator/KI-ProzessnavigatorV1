# 📧 E-Mail Integration - Installations-Anleitung

## ✅ Was bereits fertig ist:

### Kontaktformular (Modal)
1. ✅ PHP-Backend `send-email.php` mit Spam-Schutz
2. ✅ JavaScript-Integration
3. ✅ Honeypot-Feld gegen Bots
4. ✅ Rate Limiting (max. 3 Anfragen/Stunde/IP)
5. ✅ Input-Validierung & Sanitization

### Checkliste (FAQ-Bereich)
1. ✅ PHP-Backend `send-checklist.php`
2. ✅ E-Mail an Kunde mit **10 Prozesse-Checkliste** (HTML)
3. ✅ **Einladung zum kostenlosen Beratungstermin** (Calendly-Link) in jeder E-Mail
4. ✅ Benachrichtigung an Sie bei neuem Lead
5. ✅ Honeypot + Rate Limiting (max. 5 Checklisten/Stunde/IP)

---

## 🚀 Installation (3 Schritte)

### **Schritt 1: Resend einrichten**

1. Resend-Konto erstellen: https://resend.com
2. Domain `ki-prozessnavigator.de` verifizieren (SPF/DKIM/DMARC).
3. API-Key erzeugen und sicher speichern.

---

### **Schritt 2: Environment-Variablen setzen (Server)**

Setzen Sie **keine** Secrets im Code. Verwenden Sie ENV‑Variablen:

- `RESEND_API_KEY` (Pflicht)
- `RESEND_FROM` (Pflicht, z. B. `KI‑Prozessnavigator <kontakt@ki-prozessnavigator.de>`)
- optional: `RECIPIENT_EMAIL` (Empfänger für Betreiber‑Mails)
- optional: `CSRF_SECRET`

**Optional:** Ändern Sie auch den CSRF Secret:

```php
define('CSRF_SECRET', 'IHR_GEHEIMER_SCHLUESSEL_123456789');
```

---

### **Schritt 3: Dateien auf IONOS hochladen**

Laden Sie diese Ordner/Dateien auf Ihren IONOS-Server:

```
/
├── php/
│   ├── config.php          ← WICHTIG: Mit Ihrem Passwort!
│   ├── send-email.php      ← Kontaktformular
│   └── send-checklist.php  ← Checkliste (FAQ)
├── js/
│   ├── contact-modal.js    ← Aktualisiert
│   └── main.js             ← Aktualisiert (Checkliste → PHP)
├── css/
│   └── components.css      ← Honeypot-Style für Lead-Form
└── index.html              ← Aktualisiert (Honeypot + Text)
```

**Wichtig:** Die `php/` Ordner-Struktur muss erhalten bleiben!

---

## 🧪 Testen

1. Öffnen Sie Ihre Website
2. Klicken Sie auf **"Beratung anfragen"**
3. Füllen Sie das Formular aus
4. Klicken Sie auf **"Anfrage absenden"**
5. **Prüfen Sie Ihr E-Mail-Postfach:** `d.buchele@ki-prozessnavigator.de`

**Tipp:** Wenn keine E-Mail ankommt, prüfen Sie Resend‑Logs und Domain‑DNS‑Records.

---

## 🛠️ Troubleshooting

### **Problem: Keine E-Mail kommt an**

1. **Prüfen Sie Resend‑Konfiguration:**
   - `RESEND_API_KEY` gesetzt?
   - `RESEND_FROM` Domain verifiziert?

2. **Prüfen Sie DNS‑Records:**
   - SPF/DKIM/DMARC laut Resend

3. **Prüfen Sie Server-Logs:**
   - IONOS Dashboard → Logs → PHP Error Log
   - Suchen Sie nach "Resend"

### **Problem: "Zu viele Anfragen"**

Das ist der **Rate Limiter**! Er blockiert:
- Mehr als 3 Anfragen pro Stunde von derselben IP

**Lösung:**
- Warten Sie 1 Stunde
- Oder öffnen Sie `php/config.php` und erhöhen Sie:

```php
define('MAX_REQUESTS_PER_HOUR', 10); // Statt 3
```

### **Problem: "Spam erkannt"**

Das Honeypot-Feld wurde ausgefüllt (nur Bots machen das).

**Lösung:** Nichts tun – das ist gewollt! 🎯

---

## 🔒 Spam-Schutz Features

Ihr Kontaktformular ist geschützt durch:

1. ✅ **Honeypot-Feld** (unsichtbar, fängt Bots)
2. ✅ **Rate Limiting** (max. 3 Anfragen/Stunde/IP)
3. ✅ **Input-Validierung** (server-seitig)
4. ✅ **E-Mail-Validierung** (nur echte E-Mails)
5. ✅ **CSRF-Schutz** (gegen Fake-Requests)
6. ✅ **XSS-Schutz** (Sanitization aller Eingaben)

---

## 📧 E-Mail Format

Sie erhalten E-Mails in diesem Format:

**Betreff:** 🚀 Neue Anfrage von [Name]

**Inhalt:**
- 👤 Name
- 📧 E-Mail (klickbar)
- 📞 Telefon
- 🏢 Unternehmen
- 👥 Unternehmensgröße
- 🎯 Interesse
- 💬 Nachricht
- 🕐 Zeitpunkt
- 🌐 IP-Adresse

---

## 🚀 Fertig!

Nach diesen 3 Schritten funktioniert Ihr Kontaktformular!

**Bei Fragen:** Kontaktieren Sie mich! 😊

---

## 📝 Resend statt SMTP

Der Versand erfolgt über die Resend‑API. SMTP/PHPMailer ist nicht mehr erforderlich.

---

## 🎯 Domain anpassen

Wenn Ihre Website live ist, passen Sie die Domain in `php/config.php` an:

```php
define('ALLOWED_ORIGINS', [
    'https://ki-prozessnavigator.de',      // Ihre echte Domain
    'https://www.ki-prozessnavigator.de'   // Mit www
]);
```

Entfernen Sie `http://localhost` aus der Liste!

---

**Viel Erfolg! 🚀**
