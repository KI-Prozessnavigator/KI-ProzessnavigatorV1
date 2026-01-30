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

### **Schritt 1: Google App-Passwort erstellen**

Da Sie Gmail verwenden, benötigen Sie ein **App-spezifisches Passwort** (nicht Ihr normales Passwort!):

1. Gehen Sie zu: https://myaccount.google.com/security
2. Klicken Sie auf **"2-Faktor-Authentifizierung"** (muss aktiviert sein!)
3. Scrollen Sie runter zu **"App-Passwörter"**
4. Klicken Sie auf **"App-Passwörter"**
5. Wählen Sie:
   - App: **"Mail"**
   - Gerät: **"Windows-Computer"** (oder beliebig)
6. Klicken Sie auf **"Generieren"**
7. **Kopieren Sie das 16-stellige Passwort** (z.B. `abcd efgh ijkl mnop`)

---

### **Schritt 2: Konfiguration anpassen**

Öffnen Sie die Datei: **`php/config.php`**

Ersetzen Sie diese Zeile:

```php
define('SMTP_PASSWORD', 'HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN');
```

Mit Ihrem Google App-Passwort (OHNE Leerzeichen!):

```php
define('SMTP_PASSWORD', 'abcdefghijklmnop');
```

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

**Tipp:** Wenn keine E-Mail ankommt, prüfen Sie auch den **Spam-Ordner**!

---

## 🛠️ Troubleshooting

### **Problem: Keine E-Mail kommt an**

1. **Prüfen Sie `php/config.php`:**
   - Ist das Google App-Passwort richtig eingetragen?
   - Keine Leerzeichen im Passwort!

2. **Prüfen Sie Spam-Ordner**

3. **Prüfen Sie Server-Logs:**
   - IONOS Dashboard → Logs → PHP Error Log
   - Suchen Sie nach "Contact Form Error"

4. **Testen Sie manuell:**
   - Öffnen Sie: `https://ihre-domain.de/php/send-email.php`
   - Sollte einen Fehler zeigen (weil keine POST-Daten)

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

## 📝 Optional: PHPMailer installieren (empfohlen)

Für **noch zuverlässigeren** E-Mail-Versand:

1. **Via Composer (empfohlen):**
   ```bash
   cd /pfad/zu/ihrer/website
   composer require phpmailer/phpmailer
   ```

2. **Oder manuell:**
   - Download: https://github.com/PHPMailer/PHPMailer/releases
   - Entpacken nach `vendor/phpmailer/`

**Das System funktioniert auch OHNE PHPMailer** (nutzt dann PHP's native `mail()` Funktion).

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
