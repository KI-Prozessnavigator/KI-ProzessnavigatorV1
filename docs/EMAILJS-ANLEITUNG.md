# EmailJS Setup-Anleitung

## ✅ Schritt 1: EmailJS Account erstellen

1. **Registrierung:**
   - Gehen Sie zu: https://www.emailjs.com/
   - Klicken Sie auf "Sign Up" (kostenlos)
   - Bestätigen Sie Ihre E-Mail-Adresse

## ✅ Schritt 2: E-Mail-Service verbinden

1. Nach dem Login klicken Sie auf **"Email Services"**
2. Klicken Sie auf **"Add New Service"**
3. Wählen Sie Ihren E-Mail-Provider:
   - **Gmail** (empfohlen)
   - Outlook
   - Yahoo
   - Oder andere
4. Verbinden Sie Ihr E-Mail-Konto
5. **Notieren Sie die Service ID** (z.B. "service_abc123")

## ✅ Schritt 3: E-Mail-Template erstellen

1. Gehen Sie zu **"Email Templates"**
2. Klicken Sie auf **"Create New Template"**
3. Geben Sie einen Namen ein: `checkliste_download`

### Template-Konfiguration:

**Subject (Betreff):**
```
Ihre kostenlose Checkliste - 10 Prozesse zur Automatisierung
```

**Content (Inhalt):**
```html
Hallo,

vielen Dank für Ihr Interesse an unserer Checkliste!

Hier ist Ihre kostenlose Checkliste: "10 Prozesse, die Sie JETZT automatisieren sollten"

📥 [LINK ZUR PDF HIER EINFÜGEN]

Die Checkliste enthält:
✅ 10 konkrete Prozesse zur Automatisierung
✅ Einsparpotenziale für jede Branche
✅ Praktische Umsetzungstipps

Bei Fragen oder Interesse an einer persönlichen Beratung stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr KI-Prozessnavigator Team

---
Diese E-Mail wurde an {{user_email}} gesendet.
```

**Wichtige Template-Variablen:**
- `{{user_email}}` - Die E-Mail-Adresse des Kunden
- `{{to_email}}` - Empfänger-Adresse

4. **Speichern Sie das Template**
5. **Notieren Sie die Template ID** (z.B. "template_xyz789")

## ✅ Schritt 4: Public Key finden

1. Gehen Sie zu **"Account"** (oben rechts)
2. Klicken Sie auf **"General"**
3. Kopieren Sie Ihren **"Public Key"** (z.B. "abc123xyz")

## ✅ Schritt 5: Werte in die Website eintragen

Öffnen Sie die Datei: `index.html`

Suchen Sie nach dieser Stelle (circa Zeile 2702-2710):

```javascript
window.EMAILJS_CONFIG = {
    PUBLIC_KEY: 'IHR_PUBLIC_KEY_HIER',  // ← HIER EINTRAGEN
    SERVICE_ID: 'IHR_SERVICE_ID_HIER',  // ← HIER EINTRAGEN
    TEMPLATE_ID: 'IHR_TEMPLATE_ID_HIER' // ← HIER EINTRAGEN
};
```

**Ersetzen Sie die Werte mit Ihren Zugangsdaten:**

```javascript
window.EMAILJS_CONFIG = {
    PUBLIC_KEY: 'abc123xyz',           // Ihr Public Key
    SERVICE_ID: 'service_abc123',      // Ihre Service ID
    TEMPLATE_ID: 'template_xyz789'     // Ihre Template ID
};
```

## ✅ Schritt 6: Testen

1. Öffnen Sie `index.html` im Browser
2. Scrollen Sie zum Checkliste-Formular
3. Geben Sie Ihre eigene E-Mail-Adresse ein
4. Klicken Sie auf "Checkliste herunterladen"
5. Überprüfen Sie Ihr Postfach (auch Spam-Ordner!)

## 📧 E-Mail-Inhalt später ändern

### Option 1: Im EmailJS Dashboard (empfohlen)
1. Login auf https://dashboard.emailjs.com/
2. Gehen Sie zu "Email Templates"
3. Klicken Sie auf Ihr Template "checkliste_download"
4. Bearbeiten Sie Subject und Content
5. Klicken Sie "Save"
6. **FERTIG!** Die Änderungen sind sofort aktiv.

### Option 2: Neues Template erstellen
1. Erstellen Sie ein neues Template in EmailJS
2. Notieren Sie die neue Template ID
3. Tragen Sie die neue Template ID in `index.html` ein

## 🔧 Fehlersuche

### Problem: "E-Mail-Service ist noch nicht konfiguriert"
**Lösung:** Überprüfen Sie, ob Sie die drei Werte in `index.html` korrekt eingetragen haben.

### Problem: E-Mail kommt nicht an
**Lösung 1:** Überprüfen Sie den Spam-Ordner
**Lösung 2:** Prüfen Sie in EmailJS unter "History", ob die E-Mail gesendet wurde
**Lösung 3:** Überprüfen Sie die E-Mail-Service-Verbindung in EmailJS

### Problem: Fehler in der Browser-Konsole
**Lösung:** 
1. Öffnen Sie die Browser-Konsole (F12)
2. Prüfen Sie die Fehlermeldung
3. Häufige Ursachen:
   - Falsche Service ID / Template ID / Public Key
   - E-Mail-Service nicht verbunden
   - EmailJS-Kontingent aufgebraucht (200 E-Mails/Monat kostenlos)

## 📊 EmailJS Dashboard

Im EmailJS Dashboard können Sie:
- ✅ Gesendete E-Mails ansehen (History)
- ✅ E-Mail-Templates bearbeiten
- ✅ Mehrere Templates erstellen (z.B. für Kontaktformular)
- ✅ Statistiken einsehen
- ✅ Upgrade auf mehr E-Mails/Monat (bei Bedarf)

## 🎯 Nächste Schritte

1. ✅ PDF-Checkliste erstellen und hosten (z.B. auf Ihrer Website oder Google Drive)
2. ✅ Link zur PDF im E-Mail-Template einfügen
3. ✅ Formular testen
4. ✅ Bei Bedarf: Gleiche Integration für Kontaktformular einrichten

## 📞 Support

Bei Fragen zur EmailJS-Integration:
- EmailJS Dokumentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/docs/faq/

---
**Viel Erfolg! 🚀**
