# 🚀 PHP E-Mail Setup - Schritt für Schritt

## ✅ Checkliste zum Abhaken

### Phase 1: Google App-Passwort erstellen

- [ ] Öffnen: https://myaccount.google.com/apppasswords
- [ ] Anmelden mit: d.buchele@ki-prozessnavigator.de
- [ ] App wählen: "Mail"
- [ ] Gerät wählen: "Windows-Computer"
- [ ] "Generieren" klicken
- [ ] **16-stelliges Passwort kopieren** (z.B. `abcd efgh ijkl mnop`)
- [ ] Leerzeichen entfernen → `abcdefghijklmnop`
- [ ] Passwort sicher notieren (nicht im Chat posten!)

---

### Phase 2: Server-Status prüfen

#### Schritt 1: Test-Dateien hochladen

Laden Sie diese 2 Dateien auf Ihren IONOS-Server hoch:
- `test.php` → Root-Verzeichnis
- `test-smtp.php` → Root-Verzeichnis

#### Schritt 2: PHP-Test ausführen

1. Öffnen Sie: `https://ihre-domain.de/test.php`
2. **Erwartung:** Bunte Seite mit PHP-Version
3. **Falls Download/Fehler:** PHP ist nicht aktiv → IONOS Support kontaktieren

#### Schritt 3: SMTP-Test ausführen

1. Öffnen Sie: `https://ihre-domain.de/test-smtp.php`
2. Prüfen Sie die Ergebnisse:
   - ✅ **Gmail SMTP grün:** Perfekt, nutzen Sie Gmail!
   - ⚠️ **Gmail rot, IONOS grün:** Nutzen Sie IONOS SMTP
   - ❌ **Alle rot:** IONOS Support kontaktieren (Port 587 freischalten)

#### Schritt 4: Test-Dateien löschen (Sicherheit!)

Nach erfolgreichen Tests vom Server entfernen:
- `test.php` löschen
- `test-smtp.php` löschen

---

### Phase 3: Konfiguration anpassen

#### Option A: Gmail SMTP (wenn Test erfolgreich)

Öffnen Sie: `php/config.php`

**Zeile 15 ändern:**
```php
// VORHER:
define('SMTP_PASSWORD', 'HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN');

// NACHHER (Ihr Google App-Passwort OHNE Leerzeichen):
define('SMTP_PASSWORD', 'abcdefghijklmnop');
```

**Zeile 37 ändern (optional):**
```php
// VORHER:
define('CSRF_SECRET', 'AENDERN_SIE_DIESEN_GEHEIMEN_SCHLUESSEL_' . bin2hex(random_bytes(16)));

// NACHHER (eigenen langen String wählen):
define('CSRF_SECRET', 'MeinGeheimerSchluessel2026KiProzessnavigator');
```

#### Option B: IONOS SMTP (falls Gmail nicht funktioniert)

Öffnen Sie: `php/config.php`

**Zeilen 8-15 ändern:**
```php
// SMTP Konfiguration für IONOS
define('SMTP_HOST', 'smtp.ionos.de');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'd.buchele@ki-prozessnavigator.de');
define('SMTP_PASSWORD', 'ihr-ionos-mail-passwort');
```

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
3. Häufig: Falsches Passwort in `config.php`

### Problem: "SMTP Error: Could not authenticate"

**Lösung:**
1. Neues Google App-Passwort generieren
2. Ohne Leerzeichen in `config.php` eintragen
3. Datei erneut hochladen

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
- [ ] test-smtp.php erfolgreich?
- [ ] Passwort korrekt (ohne Leerzeichen)?
- [ ] Server-Logs geprüft?
- [ ] 2FA bei Google aktiv?

---

## ✅ Erfolg!

Wenn Sie eine E-Mail erhalten haben:

1. ✅ Test-Dateien vom Server löschen (`test.php`, `test-smtp.php`)
2. ✅ Google App-Passwort sicher speichern
3. ✅ Website-Entwicklung fortsetzen
4. ✅ Bei Problemen: Server-Logs prüfen

**Gratulation! Ihr Kontaktformular ist jetzt live!** 🎉

---

## 📞 Hilfe benötigt?

Falls Probleme auftreten:
1. Browser-Konsole prüfen (F12)
2. Server PHP Error Logs prüfen
3. Test-Scripts erneut ausführen
4. IONOS Support kontaktieren (bei Port-Problemen)

---

**Version:** 1.0 | **Datum:** 09.02.2026
