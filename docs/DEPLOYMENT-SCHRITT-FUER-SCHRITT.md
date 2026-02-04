# Sehr detaillierte Schritt-für-Schritt-Deployment-Anleitung

Diese Anleitung übernimmt so weit wie möglich: Sie folgen den Schritten nacheinander. **Voraussetzung:** Im IONOS DCD haben Sie bereits einen **vCPU Server** provisioniert und sehen einen **grünen Haken** (Provisioning abgeschlossen).

---

## Übersicht der Schritte

| Schritt | Kurz |
|--------|------|
| 1 | **IP notieren** (vCPU → rechts → Netzwerk → Primäre IPv4) |
| 2 | **Firewall im DCD** prüfen (Ports 22, 80, 443) |
| 3 | **SSH-Verbindung** zum Server herstellen |
| 4 | **Webserver + Webroot** auf dem Server einrichten |
| 5 | **PHP** installieren (für Formulare) |
| 6 | **`.env.deploy`** lokal anlegen und ausfüllen |
| 7 | **Deploy-Skript** ausführen |
| 8 | **Rechte** auf dem Server setzen (optional) |
| 9 | **Domain** mit der Server-IP verbinden (DNS) |
| 10 | **Optional:** SSL (HTTPS) einrichten |

---

## Schritt 1: Öffentliche IP notieren

**Wo Sie die IP im DCD finden:**

1. Im **Data Center Designer (DCD)** [dcd.ionos.com](https://dcd.ionos.com) Ihr **Data Center** mit dem provisionierten vCPU Server öffnen (Canvas-Ansicht).
2. Auf den **vCPU Server** (Cube) auf dem Canvas **klicken**.
3. **Rechts** öffnet sich das Detail-Panel zur VM.
4. Im Panel den Bereich **„Netzwerk“** öffnen (bzw. **Network**).
5. Dort finden Sie **„Primäre IPv4“** (bzw. **Primary IPv4**) – das ist Ihre **öffentliche IP-Adresse**.

**Was Sie tun:**

- Die **Primäre IPv4**-Adresse **kopieren** oder **aufschreiben** (z. B. `123.45.67.89`).
- Diese Adresse brauchen Sie für:
  - SSH-Verbindung (Schritt 3),
  - `.env.deploy` als `IONOS_HOST` (Schritt 6),
  - DNS A-Record für Ihre Domain (Schritt 9).

---

## Schritt 2: Firewall im DCD prüfen

Damit Sie per SSH auf den Server kommen und die Website von außen erreichbar ist, müssen die Ports **22** (SSH), **80** (HTTP) und **443** (HTTPS) **eingehend** erlaubt sein.

**Wo Sie die Firewall im DCD finden:**

1. Links in der Navigation: **Security** → **Network Security Groups** (oder beim Data Center die zugeordnete **Security Group** öffnen).
2. Oder: Beim **vCPU Server** klicken → rechts im Panel den Bereich **Netzwerk / Security** (bzw. **Network / Security**) öffnen und die zugehörige Security Group anzeigen.

**Was Sie prüfen/anlegen:**

- Es muss **eingehende Regeln (Inbound)** geben für:
  - **Port 22** (TCP) – SSH,
  - **Port 80** (TCP) – HTTP,
  - **Port 443** (TCP) – HTTPS.
- Falls eine dieser Regeln fehlt: **Neue Regel** anlegen, Richtung **Inbound**, Protokoll **TCP**, Port **22** bzw. **80** bzw. **443**, Quelle z. B. **0.0.0.0/0** (alle) oder eingeschränkt nach Bedarf.
- Änderungen **speichern**.

---

## Schritt 3: SSH-Verbindung zum Server herstellen

**Auf Ihrem PC (Windows):**

1. **PowerShell** oder **Windows Terminal** öffnen.
2. Befehl ausführen (ersetzen Sie `IHRE_IP` durch die **Primäre IPv4** aus Schritt 1):

```powershell
ssh root@IHRE_IP
```

Beispiel, wenn die IP `123.45.67.89` ist:

```powershell
ssh root@123.45.67.89
```

3. Beim ersten Mal erscheint eine Meldung zum **Host-Key** – mit **`yes`** bestätigen.
4. **Passwort** eingeben (das Sie beim Anlegen der VM im DCD gesetzt haben) und mit **Enter** bestätigen.

**Erfolg:** Sie sind auf dem Server eingeloggt; die Eingabezeile zeigt etwas wie `root@...:~#`.

**Falls SSH nicht verbindet:**

- Prüfen Sie Schritt 2 (Firewall: Port 22 offen).
- Prüfen Sie, dass Sie die **richtige IP** (Primäre IPv4) verwenden.
- Unter Windows: **OpenSSH-Client** aktivieren (Einstellungen → Apps → Optionale Features → OpenSSH-Client).

---

## Schritt 4: Webserver und Webroot auf dem Server einrichten

**Sie sind per SSH auf dem Server eingeloggt (root).** Führen Sie die folgenden Befehle **nacheinander** aus (jeweils Enter drücken).

### 4.1 System aktualisieren

```bash
apt update && apt upgrade -y
```

### 4.2 Apache installieren

```bash
apt install -y apache2
```

### 4.3 Apache starten und beim Boot starten lassen

```bash
systemctl start apache2
systemctl enable apache2
```

### 4.4 Webroot prüfen

Der Standard-Webroot unter Ubuntu/Apache ist **`/var/www/html`**. Dort sollen die Website-Dateien liegen.

Prüfen, ob das Verzeichnis existiert:

```bash
ls -la /var/www/html
```

Falls dort schon eine Datei `index.html` liegt (Apache-Defaultseite), ist das in Ordnung – das Deploy-Skript überschreibt den Inhalt mit Ihrer Website.

**DocumentRoot** muss auf `/var/www/html` zeigen. Standard-Konfiguration prüfen:

```bash
grep -r "DocumentRoot" /etc/apache2/sites-enabled/
```

Typisch ist: `DocumentRoot /var/www/html`. Falls etwas anderes steht und Sie unsicher sind, können Sie es so lassen und erst nach dem Deploy testen; bei Standard-Ubuntu-Apache ist `/var/www/html` in der Regel schon korrekt.

---

## Schritt 5: PHP installieren (für Kontakt- und Checklisten-Formulare)

**Nur nötig, wenn Sie die PHP-Formulare (Kontakt, Checkliste) nutzen wollen.** Wenn Sie nur die statische Website ohne Formulare brauchen, können Sie Schritt 5 überspringen.

Auf dem Server (weiter per SSH als root):

```bash
apt install -y php libapache2-mod-php php-mbstring php-curl
```

Apache neu starten, damit PHP geladen wird:

```bash
systemctl restart apache2
```

**PHP testen (optional):** Nach dem Deploy können Sie eine Datei `info.php` mit Inhalt `<?php phpinfo(); ?>` in `/var/www/html` anlegen und im Browser `http://IHRE_IP/info.php` aufrufen – dann wieder löschen.

---

## Schritt 6: `.env.deploy` lokal anlegen und ausfüllen

**Jetzt auf Ihrem Windows-PC** – im **Projektordner** des KI-Prozessnavigators (dort, wo `deploy-ionos.ps1` und `index.html` liegen).

### 6.1 Datei anlegen

1. Die Datei **`.env.deploy.example`** als Vorlage **kopieren** und die Kopie **`.env.deploy`** nennen (im gleichen Ordner).
2. **`.env.deploy`** mit einem Editor öffnen (z. B. Cursor, Notepad).

### 6.2 Werte eintragen

Ersetzen Sie die Platzhalter durch **Ihre** Werte. **Keine Passwörter oder Keys hier im Chat eintragen** – nur lokal in `.env.deploy` speichern.

| Variable | Was eintragen | Beispiel |
|----------|----------------|----------|
| `IONOS_HOST` | Die **Primäre IPv4** aus Schritt 1 | `123.45.67.89` |
| `IONOS_USER` | SSH-Benutzer (meist `root`) | `root` |
| `IONOS_WEBROOT` | Webroot auf dem Server | `/var/www/html` |
| `IONOS_PORT` | SSH-Port (meist 22) | `22` |
| `IONOS_SSH_KEY` | Optional: Pfad zu Ihrem privaten SSH-Key (z. B. `C:\Users\IhrName\.ssh\id_rsa`). Leer lassen = Passwort beim Upload | auskommentiert lassen oder Pfad eintragen |

**Beispiel einer ausgefüllten `.env.deploy`** (mit Platzhalter-IP – ersetzen Sie durch Ihre echte IP):

```env
# IONOS Cloud Server – Deploy-Konfiguration (lokal, nicht committen!)
IONOS_HOST=123.45.67.89
IONOS_USER=root
IONOS_WEBROOT=/var/www/html
IONOS_PORT=22
# IONOS_SSH_KEY=C:\Users\IhrName\.ssh\id_rsa
```

3. Datei **speichern**. `.env.deploy` wird von Git ignoriert – keine Zugangsdaten ins Repository.

---

## Schritt 7: Deploy-Skript ausführen

**Auf Ihrem Windows-PC**, im **Projektordner** (dort, wo `deploy-ionos.ps1` und `.env.deploy` liegen).

1. **PowerShell** öffnen (Rechtsklick im Explorer → „PowerShell hier öffnen“ oder `cd` in den Projektordner).
2. Befehl ausführen:

```powershell
.\deploy-ionos.ps1
```

3. Beim ersten Mal: SSH-Host-Key mit **`yes`** bestätigen.
4. Wenn **kein** `IONOS_SSH_KEY` in `.env.deploy` eingetragen ist: **Passwort** für den SSH-Benutzer (root) eingeben.

**Erfolg:** Am Ende erscheint eine Meldung wie „Deploy abgeschlossen. Website unter Ihrem Server/Domain prüfen.“

**Test:** Im Browser **`http://IHRE_IP`** aufrufen (IHRE_IP = Primäre IPv4). Es sollte die Startseite des KI-Prozessnavigators erscheinen.

---

## Schritt 8: Rechte auf dem Server setzen (optional)

Damit der Webserver (Apache) alle hochgeladenen Dateien lesen kann, können Sie auf dem Server die Besitzerrechte anpassen. **Per SSH einloggen** (wie Schritt 3), dann:

```bash
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
```

Falls Sie später wieder per Deploy-Skript hochladen, müssen Sie ggf. erneut als root schreiben können – dann vor dem nächsten Deploy z. B.:

```bash
chown -R root:root /var/www/html
```

und nach dem Deploy wieder `chown -R www-data:www-data /var/www/html`. Oder Sie lassen root als Besitzer; Apache kann oft trotzdem lesen. Bei Problemen (403 Forbidden) diesen Schritt ausführen.

---

## Schritt 9: Domain mit der Server-IP verbinden (DNS)

**Ziel:** Die Domain (z. B. **ki-prozessnavigator.de**) soll auf die **Primäre IPv4** Ihres vCPU Servers zeigen.

1. Im **IONOS Kundenbereich** anmelden: [my.ionos.com](https://my.ionos.com).
2. **Domain & SSL** öffnen und Ihre **Domain** auswählen (z. B. ki-prozessnavigator.de).
3. **Falls Sie die Domain zuvor vom WordPress-Hosting getrennt haben:** Auf **„Domain zurücksetzen“** → **„Verwendungsart oder DNS zurücksetzen“** klicken, damit die Domain nicht mehr an das alte Hosting gebunden ist.
4. **„DNS-Einstellungen anpassen“** (bzw. Reiter **DNS**) öffnen.
5. **A-Record** für die Hauptdomain setzen:
   - **Name / Host:** `@` (oder das Feld für die Hauptdomain, je nach IONOS-Oberfläche).
   - **Wert / Ziel / Zielhost:** Die **Primäre IPv4** aus Schritt 1 (z. B. `123.45.67.89`).
   - **TTL:** z. B. 3600 oder Standard.
6. **A-Record für www** (optional):
   - **Name / Host:** `www`
   - **Wert / Ziel:** dieselbe **Primäre IPv4**.
7. Alte Einträge, die noch auf eine andere IP oder das alte Hosting zeigen, **anpassen oder löschen**.
8. **Speichern.**

**Hinweis:** DNS-Änderungen können einige Minuten bis wenige Stunden brauchen (meist unter 1 Stunde). Danach sollte **http://ihredomain.de** (und ggf. **http://www.ihredomain.de**) Ihre Website anzeigen.

---

## Schritt 10: Optional – SSL (HTTPS) einrichten

Aktuell läuft die Website per **HTTP**. Für **HTTPS** brauchen Sie ein TLS-Zertifikat.

**Typische Vorgehensweise auf dem Server (Ubuntu/Apache):**

1. Per SSH einloggen (Schritt 3).
2. **Certbot** installieren (Let’s Encrypt):

```bash
apt install -y certbot python3-certbot-apache
```

3. Zertifikat anfordern (ersetzen Sie `ihredomain.de` durch Ihre Domain):

```bash
certbot --apache -d ihredomain.de -d www.ihredomain.de
```

4. Anweisungen von Certbot folgen (E-Mail angeben, AGB akzeptieren). Certbot richtet die Apache-Virtual-Host-Konfiguration für HTTPS ein und erneuert das Zertifikat automatisch.

**Vorher:** Stellen Sie sicher, dass die **Domain bereits per DNS auf die Server-IP** zeigt (Schritt 9), sonst schlägt die Let’s-Encrypt-Prüfung fehl.

---

## Optional: PHP-Konfiguration auf dem Server (Formulare)

Wenn Sie Schritt 5 (PHP) ausgeführt haben und die **Kontakt- oder Checklisten-Formulare** nutzen wollen, müssen Sie auf dem Server die Datei **`php/config.php`** anpassen (E-Mail-Empfänger, SMTP, erlaubte Domains). Die Datei liegt nach dem Deploy unter **`/var/www/html/php/config.php`**.

**Per SSH einloggen**, dann z. B.:

```bash
nano /var/www/html/php/config.php
```

Anpassen (Beispielwerte – nur lokal auf dem Server, nicht im Chat teilen):

- **RECIPIENT_EMAIL:** E-Mail-Adresse, an die Formulare gesendet werden.
- **SMTP_***:** Falls Sie E-Mails über Gmail/Google senden: SMTP-Daten und **App-Passwort** eintragen (nicht Ihr normales Google-Passwort).
- **ALLOWED_ORIGINS:** Ihre echte Domain, z. B. `https://ki-prozessnavigator.de`, `https://www.ki-prozessnavigator.de`.
- **CSRF_SECRET:** Einen festen, zufälligen Wert setzen (nur einmal, danach nicht mehr ändern).

Speichern in nano: **Strg+O**, Enter, **Strg+X**.

---

## Kurz-Checkliste (zum Abhaken)

- [ ] **Schritt 1:** Primäre IPv4 unter vCPU → rechts → Netzwerk notiert
- [ ] **Schritt 2:** Firewall: Ports 22, 80, 443 eingehend erlaubt
- [ ] **Schritt 3:** SSH mit `ssh root@IHRE_IP` funktioniert
- [ ] **Schritt 4:** Apache installiert, gestartet, Webroot `/var/www/html`
- [ ] **Schritt 5:** PHP installiert (falls Formulare genutzt werden)
- [ ] **Schritt 6:** `.env.deploy` mit IONOS_HOST=Primäre IPv4 angelegt
- [ ] **Schritt 7:** `.\deploy-ionos.ps1` erfolgreich ausgeführt, `http://IHRE_IP` zeigt die Website
- [ ] **Schritt 8:** Optional: `chown -R www-data:www-data /var/www/html`
- [ ] **Schritt 9:** DNS A-Record(s) für Domain (und www) auf die Primäre IPv4 gesetzt
- [ ] **Schritt 10:** Optional: SSL mit Certbot eingerichtet
- [ ] Keine Passwörter/Keys im Chat oder in öffentlichen Dateien – nur in `.env.deploy` bzw. auf dem Server in `php/config.php`

---

## Referenz: Wo finde ich was?

| Was | Wo |
|-----|-----|
| **Primäre IPv4** | DCD → vCPU Server anklicken → **rechts** im Panel → **Netzwerk** → **Primäre IPv4** |
| **Firewall / Ports** | DCD → links **Security** → **Network Security Groups** (oder beim vCPU Server → Netzwerk/Security) |
| **SSH-Zugang** | `ssh root@IHRE_IP` (IHRE_IP = Primäre IPv4) |
| **Webroot** | `/var/www/html` (Standard unter Ubuntu/Apache) |
| **Deploy-Konfiguration** | Lokal: `.env.deploy` im Projektordner (aus `.env.deploy.example` kopieren) |
| **DNS A-Record** | IONOS Kundenbereich → **Domain & SSL** → Ihre Domain → **DNS-Einstellungen anpassen** |

Diese Anleitung ist die detaillierte Ausführung der Phasen aus **IONOS-CLAUDE-SERVER-DEPLOY.md**.
