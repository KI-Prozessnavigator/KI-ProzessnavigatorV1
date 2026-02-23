# 🚀 PHP E-Mail Setup - Schritt für Schritt

> Hinweis: Der Versand erfolgt über die Resend API (kein SMTP/PHPMailer erforderlich).

## ✅ Checkliste zum Abhaken

### Phase 1: Resend einrichten

- [ ] Resend Konto erstellen: https://resend.com
- [ ] Domain `ki-prozessnavigator.de` verifizieren (SPF/DKIM/DMARC)
- [ ] API Key erzeugen und sicher speichern
- [ ] Absender festlegen (z. B. `kontakt@ki-prozessnavigator.de`)

---

### Phase 2: Server-Status prüfen

Hinweis: Die Test-Seiten wurden aus Sicherheitsgründen aus dem Repo entfernt.
Falls Sie PHP prüfen wollen, nutzen Sie die IONOS Tools oder führen Sie lokale Tests über Ihren Hosting-Support durch.

---

### Phase 3: Environment-Variablen setzen (Server)

Setzen Sie auf dem Server folgende ENV‑Variablen:

- `RESEND_API_KEY` (Pflicht)
- `RESEND_FROM` (Pflicht, z. B. `KI‑Prozessnavigator <kontakt@ki-prozessnavigator.de>`)
- optional: `RECIPIENT_EMAIL`
- optional: `CSRF_SECRET`

---

### Phase 4: Dateien hochladen

Laden Sie den kompletten `php/` Ordner auf Ihren Server:

```
/
├── php/
│   ├── config.php          ← Mit Ihrem Passwort!
│   ├── send-email.php
│   ├── send-checklist.php
│   └── INSTALLATION.md
```

**Wichtig:** Struktur beibehalten! Der `php/` Ordner muss im Root-Verzeichnis sein.

---

### Phase 5: Backend testen

#### Test 1: Backend erreichbar?

Öffnen Sie: `https://ihre-domain.de/php/send-email.php`

**Erwartung:**
```json
{"success":false,"message":"Nur POST-Requests erlaubt"}
```

✅ **Gut!** Backend antwortet.

❌ **404 Fehler:** Upload prüfen
❌ **500 Fehler:** Server-Logs prüfen

#### Test 2: Formular testen

1. Öffnen Sie Ihre Website: `https://ihre-domain.de`
2. Klicken Sie auf **"Beratung anfragen"** (oder einen CTA-Button)
3. Modal öffnet sich
4. Wählen Sie einen Pfad (z.B. "Direkte Anfrage")
5. Füllen Sie alle Felder aus:
   - Vorname: Ihr Name
   - Nachname: Ihr Name
   - E-Mail: Ihre Test-E-Mail
   - Firma: Test GmbH
   - Nachricht: "Test"
6. ✅ Datenschutzerklärung akzeptieren
7. Klicken Sie **"Anfrage absenden"**

#### Test 3: E-Mail prüfen

1. Öffnen Sie: `d.buchele@ki-prozessnavigator.de`
2. Suchen Sie nach: "🚀 Neue Anfrage von [Ihr Name]"
3. **Auch Spam-Ordner prüfen!**
4. Wenn im Spam: Als "Kein Spam" markieren

---

## 🐛 Troubleshooting

### Problem: "500 Internal Server Error"

**Lösung:**
1. IONOS Dashboard → Logs → PHP Error Log
2. Suchen Sie nach "Contact Form Error"
3. Häufig: Resend API Key fehlt oder Domain nicht verifiziert

### Problem: "Resend API Error"

**Lösung:**
1. Prüfen ob `RESEND_API_KEY` gesetzt ist
2. Prüfen ob die Domain in Resend verifiziert ist
3. DNS‑Records (SPF/DKIM/DMARC) kontrollieren

### Problem: "Zu viele Anfragen"

**Erklärung:** Rate Limiter (Spam-Schutz) aktiv

**Lösung:**
- 1 Stunde warten
- Oder in `config.php` Zeile 20 ändern:
  ```php
  define('MAX_REQUESTS_PER_HOUR', 10); // Statt 3
  ```

### Problem: E-Mail kommt nicht an

**Checkliste:**
- [ ] Spam-Ordner geprüft?
- [ ] Resend‑Logs geprüft?
- [ ] DNS‑Records korrekt?
- [ ] Server-Logs geprüft?
- [ ] 2FA bei Google aktiv?

---

## ✅ Erfolg!

Wenn Sie eine E-Mail erhalten haben:

1. ✅ Server-Tests abgeschlossen (über IONOS/Hosting-Tools)
2. ✅ Resend API Key sicher speichern
3. ✅ Website-Entwicklung fortsetzen
4. ✅ Bei Problemen: Server-Logs prüfen

**Gratulation! Ihr Kontaktformular ist jetzt live!** 🎉

---

## 📞 Hilfe benötigt?

Falls Probleme auftreten:
1. Browser-Konsole prüfen (F12)
2. Server PHP Error Logs prüfen
3. Test-Scripts erneut ausführen
4. Resend Support oder IONOS Support kontaktieren (DNS/Ports)

---

**Version:** 1.0 | **Datum:** 09.02.2026
