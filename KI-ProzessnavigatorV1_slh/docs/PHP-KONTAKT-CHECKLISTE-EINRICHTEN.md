# PHP: Kontaktformular und Checkliste einrichten

Damit das **Kontaktformular** und die **Checkliste** auf https://ki-prozessnavigator.de funktionieren, muss **PHP** laufen und die Datei **php/config.php** auf dem Server angepasst werden.

---

## 1. PHP auf dem Server pruefen

**Per SSH einloggen:** `ssh root@213.165.76.107`

**PHP-Version anzeigen:**
```bash
php -v
```
(Sollte z. B. PHP 8.x anzeigen.)

**Apache-PHP-Modul pruefen:**
```bash
apache2ctl -M | grep php
```
(Sollte `php` oder `php8` anzeigen.)

**Falls PHP fehlt oder kein Modul:**
```bash
apt update && apt install -y php libapache2-mod-php php-mbstring php-curl
systemctl restart apache2
```

---

## 2. php/config.php auf dem Server anpassen

Die Formulare laden **php/config.php**. Auf dem Server liegt die Datei unter **/var/www/html/php/config.php**.

**Bearbeiten:** `nano /var/www/html/php/config.php`

### 2.1 SMTP / E-Mail-Versand (wichtig)

Ohne gueltige SMTP-Daten werden keine E-Mails versendet.

**Gmail (Empfehlung):**
- **SMTP_USERNAME:** Ihre Gmail-Adresse (z. B. d.buchele@ki-prozessnavigator.de oder eine Gmail-Adresse).
- **SMTP_PASSWORD:** Ein **App-Passwort** von Google (nicht Ihr normales Gmail-Passwort).
  - Anleitung: [Google App-Passwoerter](https://support.google.com/accounts/answer/185833)
  - In Google-Konto: Sicherheit → 2-Faktor-Aktivierung aktivieren → App-Passwoerter erstellen → 16-stelliges Passwort eintragen.

**IONOS-E-Mail (Alternative):**
- SMTP-Daten aus dem IONOS-Kundenbereich (E-Mail-Einstellungen) eintragen:
  - SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD.

**RECIPIENT_EMAIL:** E-Mail-Adresse, an die Kontakt- und Checklisten-Anfragen gesendet werden (z. B. d.buchele@ki-prozessnavigator.de).

### 2.2 ALLOWED_ORIGINS (CORS)

Bereits korrekt, wenn folgende Eintraege vorhanden sind:
```php
'https://ki-prozessnavigator.de',
'https://www.ki-prozessnavigator.de',
```
Falls nicht, ergaenzen und speichern.

### 2.3 CSRF_SECRET (fest setzen)

In der Vorlage steht evtl. `bin2hex(random_bytes(16))` – das erzeugt bei jedem Aufruf einen anderen Wert und bricht die Formulare.

**Ersetzen durch einen festen Zufallsstring**, z. B.:
```php
define('CSRF_SECRET', 'IhrFesterGeheimerStringMindestens32ZeichenLang123');
```
(Einen eigenen langen Zufallsstring waehlen und nur einmal setzen, danach nicht mehr aendern.)

**Speichern in nano:** Strg+O, Enter, Strg+X.

---

## 3. Rechte pruefen

Apache (Benutzer **www-data**) muss die Dateien in **/var/www/html/php/** lesen koennen:

```bash
chown -R www-data:www-data /var/www/html/php
chmod 644 /var/www/html/php/*.php
```

**config.php** darf nicht von außen lesbar sein (z. B. ueber https://ki-prozessnavigator.de/php/config.php). Apache liefert nur .php aus und fuehrt sie aus; der Inhalt von config.php wird nicht an den Browser gesendet. Optional: **config.php** ausserhalb des Webroots ablegen und in send-email.php/send-checklist.php den Pfad anpassen – fuer den Einstieg reicht obige Konfiguration.

---

## 4. Testen

1. **Kontaktformular:** Auf https://ki-prozessnavigator.de das Kontaktformular oeffnen, ausfuellen und absenden. Es sollte eine Bestaetigung erscheinen und eine E-Mail an RECIPIENT_EMAIL ankommen.
2. **Checkliste:** Checkliste ausfuellen und absenden. E-Mail sollte ankommen.

**Falls Fehler:** Browser-Konsole (F12 → Console) und Netzwerk-Tab pruefen – ob **php/send-email.php** bzw. **php/send-checklist.php** mit 200 oder mit Fehlercode aufgerufen werden. Auf dem Server: **Apache-Fehlerprotokoll** ansehen:
```bash
tail -50 /var/log/apache2/error.log
```

---

## 5. Kurz-Checkliste

- [ ] PHP installiert (`php -v`, `apache2ctl -M | grep php`)
- [ ] **/var/www/html/php/config.php** auf dem Server bearbeitet:
  - [ ] **SMTP_PASSWORD** = Google App-Passwort (oder IONOS-SMTP-Passwort)
  - [ ] **RECIPIENT_EMAIL** = gewuenschte Empfaenger-Adresse
  - [ ] **ALLOWED_ORIGINS** enthaelt https://ki-prozessnavigator.de und https://www.ki-prozessnavigator.de
  - [ ] **CSRF_SECRET** = fester Zufallsstring (kein random_bytes im Produktivbetrieb)
- [ ] Rechte: `chown -R www-data:www-data /var/www/html/php`
- [ ] Kontaktformular und Checkliste auf der Website testen

Wenn diese Punkte erledigt sind, sollten Kontaktformular und Checkliste funktionieren.
