# Nächste Schritte: Domain verbinden, SSL, PHP prüfen

## 1. Domain verbinden (IONOS – im Browser)

**Wo:** [my.ionos.com](https://my.ionos.com) → anmelden.

| Schritt | Aktion |
|--------|--------|
| 1 | **Domain & SSL** → **ki-prozessnavigator.de** auswählen. |
| 2 | **DNS** (bzw. „DNS-Einstellungen anpassen“) öffnen. |
| 3 | **A-Record** für **@** (Hauptdomain): **Wert/Ziel** = **213.165.76.107** |
| 4 | **A-Record** für **www**: **Wert/Ziel** = **213.165.76.107** |
| 5 | **Speichern.** DNS-Änderung kann 5–30 Minuten dauern. |

Danach: **http://ki-prozessnavigator.de** und **http://www.ki-prozessnavigator.de** sollten auf Ihre Website zeigen.

---

## 2. SSL (HTTPS) – auf dem Server per SSH

**Vollständige Schritt-für-Schritt-Anleitung (übernimmt alles):** [SSL-AUF-SERVER-EINRICHTEN.md](SSL-AUF-SERVER-EINRICHTEN.md)  
**Nur Befehle zum Kopieren:** [SERVER-BEFEHLE-SSL-EINMAL-EINFUEGEN.txt](SERVER-BEFEHLE-SSL-EINMAL-EINFUEGEN.txt)

**Wo:** Im **Terminal**, wo Sie per SSH eingeloggt sind (`ssh root@213.165.76.107`), **nachdem** die Domain (ki-prozessnavigator.de) per DNS auf 213.165.76.107 zeigt.

**Befehle nacheinander auf dem Server ausführen:**

```bash
apt update && apt install -y certbot python3-certbot-apache
```

```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --non-interactive --agree-tos -m IHRE@EMAIL.DE
```

(**IHRE@EMAIL.DE** durch Ihre E-Mail ersetzen – für Ablauf-Benachrichtigungen. Keine weiteren Rückfragen.)

**Oder mit Rückfragen** (E-Mail, AGB, Redirect):

```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de
```

- E-Mail angeben (für Ablauf-Benachrichtigungen).
- AGB von Let’s Encrypt mit **Y** bestätigen.
- Optional: E-Mail für Newsletter **N** (Nein).
- HTTP → HTTPS Weiterleitung: **2** (Redirect) wählen.
- Certbot richtet HTTPS ein und leitet HTTP → HTTPS um.

**Erfolg:** **https://ki-prozessnavigator.de** und **https://www.ki-prozessnavigator.de** funktionieren mit Schloss-Symbol.

---

## 3. PHP prüfen

**3.1 PHP-Version auf dem Server prüfen**

Auf dem Server (SSH):

```bash
php -v
```

Sollte z. B. `PHP 8.x.x` anzeigen.

**3.2 PHP-Info-Seite (nur zum Testen)**

Auf dem Server:

```bash
echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php
chown www-data:www-data /var/www/html/phpinfo.php
```

Im Browser: **http://213.165.76.107/phpinfo.php** (oder nach Domain/SSL: **https://ki-prozessnavigator.de/phpinfo.php**) aufrufen. Es erscheint die PHP-Konfiguration.

**Wichtig:** Nach dem Prüfen wieder löschen (Sicherheit):

```bash
rm /var/www/html/phpinfo.php
```

**3.3 Formulare / php/config.php**

- Kontakt-/Checklisten-Formulare nutzen die Skripte unter **php/** (z. B. `send-email.php`).
- Auf dem Server **php/config.php** anpassen: E-Mail, SMTP, ALLOWED_ORIGINS, CSRF_SECRET (siehe [IONOS-CLAUDE-SERVER-DEPLOY.md](IONOS-CLAUDE-SERVER-DEPLOY.md) → „php/config.php auf dem Server anpassen“).
- Nach SSL: In **ALLOWED_ORIGINS** **https://ki-prozessnavigator.de** und **https://www.ki-prozessnavigator.de** eintragen.

---

## Reihenfolge

1. **Domain verbinden** (IONOS DNS) → warten bis erreichbar.
2. **SSL** (Certbot auf dem Server) → HTTPS aktiv.
3. **PHP prüfen** (php -v, ggf. phpinfo, dann phpinfo.php löschen; config.php anpassen).
