# Deploy-Anleitung ab SSH – wo was eingeben

**Kurz:**  
- **Ihr PC (Terminal/PowerShell)** = Befehle laufen auf Ihrem Windows-Rechner.  
- **Auf dem Server (IONOS vCPU)** = Befehle laufen auf dem Linux-Server, nachdem Sie per SSH eingeloggt sind.  
- **IONOS Webseite** = nur Klicks im Browser (DCD, Domain & SSL), keine Befehle.

---

## Übersicht: Wo wird was gemacht?

| Schritt | Wo? | Was? |
|--------|-----|------|
| SSH-Verbindung aufbauen | **Ihr PC – Terminal/PowerShell** | Befehl `ssh root@IHRE_IP` |
| Webserver & PHP einrichten | **Auf dem Server** (in der SSH-Session) | Befehle `apt install …` usw. |
| `.env.deploy` anlegen | **Ihr PC – Editor** | Datei kopieren und IP eintragen |
| Deploy ausführen | **Ihr PC – PowerShell** im Projektordner | `.\deploy-ionos.ps1` |
| Rechte (optional) | **Auf dem Server** | `chown …` |
| Domain verbinden | **IONOS Webseite** (my.ionos.com) | DNS A-Record setzen |

---

## 1. SSH – auf Ihrem PC (Terminal oder PowerShell)

**Wo:** Auf **Ihrem Windows-PC** – **Terminal** (CMD) oder **PowerShell** öffnen (nicht im IONOS-DCD, nicht im Browser).

**Befehl:**

```bash
ssh root@IHRE_IP
```

- **IHRE_IP** ersetzen durch die **Primäre IPv4** Ihres vCPU Servers (z. B. `ssh root@123.45.67.89`).
- Frage „Are you sure you want to continue connecting (yes/no)?“ → **`yes`** eingeben, Enter.
- Passwort eingeben (das Sie beim Anlegen der VM/Storage gesetzt haben).

**Erfolg:** Die Zeile beginnt z. B. mit `root@…` – Sie sind **auf dem Server** eingeloggt. Alle folgenden Befehle bis „exit“ geben Sie **in dieser gleichen Fenster-Session** ein (also auf dem Server).

---

## 2. Webserver einrichten – auf dem Server

**Wo:** **Auf dem Server** – also **im gleichen Terminal-Fenster**, in dem Sie nach `ssh root@IHRE_IP` eingeloggt sind (Prompt `root@…`). **Nicht** auf dem PC in einem neuen Fenster.

**Befehle nacheinander eingeben (jeweils Enter):**

```bash
apt update && apt upgrade -y
```

```bash
apt install -y apache2
```

```bash
systemctl start apache2
```

```bash
systemctl enable apache2
```

---

## 3. PHP einrichten (optional, für Formulare) – auf dem Server

**Wo:** Weiter **auf dem Server** (gleiche SSH-Session).

**Befehle:**

```bash
apt install -y php libapache2-mod-php php-mbstring php-curl
```

```bash
systemctl restart apache2
```

---

## 4. SSH beenden (optional) – auf dem Server

**Wo:** In der gleichen Session auf dem Server.

**Befehl:**

```bash
exit
```

Damit sind Sie wieder auf Ihrem PC. Sie können die Session auch offen lassen und in einem **zweiten** Terminal auf dem PC die nächsten Schritte machen.

---

## 5. `.env.deploy` anlegen – auf Ihrem PC (Editor)

**Wo:** Auf **Ihrem PC** – im **Projektordner** (z. B. `KI-ProzessnavigatorV1`).

**Schritte:**

1. Datei **`.env.deploy.example`** kopieren und als **`.env.deploy`** speichern.
2. **`.env.deploy`** im Editor öffnen.
3. **`IONOS_HOST=`** durch Ihre **notierte Server-IP** ersetzen (z. B. `IONOS_HOST=123.45.67.89`).
4. Speichern. Rest (IONOS_USER=root, IONOS_WEBROOT=/var/www/html, IONOS_PORT=22) kann so bleiben.

**Nicht** im Terminal eingeben – nur die Datei bearbeiten.

---

## 6. Deploy ausführen – auf Ihrem PC (PowerShell)

**Wo:** Auf **Ihrem PC** – **PowerShell** öffnen, in den **Projektordner** wechseln (z. B. `cd C:\Users\Domin\Downloads\KI-ProzessnavigatorV1`).

**Befehl:**

```powershell
.\deploy-ionos.ps1
```

- Host-Key-Abfrage → **`yes`** eingeben.
- Passwort für `root` eingeben (falls kein SSH-Key in `.env.deploy` eingetragen ist).

**Erfolg:** Dateien werden auf den Server nach `/var/www/html` hochgeladen.

**Test:** Im Browser **`http://IHRE_IP`** aufrufen (IHRE_IP durch Ihre Server-IP ersetzen) – Ihre Website sollte erscheinen.

---

## 7. Rechte setzen (wichtig bei 403 Forbidden) – auf dem Server

**Wo:** **Auf dem Server** (per SSH eingeloggt, wo `root@ubuntu` steht).

Wenn CSS, JS, Fonts oder Bilder mit **403 Forbidden** fehlschlagen, fehlen meist Rechte für Apache (www-data). Dann auf dem Server ausführen:

```bash
chown -R www-data:www-data /var/www/html
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
```

Danach im Browser **Strg+F5** (Hard Refresh). Die 403-Fehler sollten verschwinden.

---

## 8. Domain verbinden – IONOS Webseite (kein Terminal)

**Wo:** **Im Browser** – [my.ionos.com](https://my.ionos.com) → anmelden.

**Schritte:**

1. **Domain & SSL** → **ki-prozessnavigator.de** auswählen.
2. **DNS** (bzw. „DNS-Einstellungen anpassen“) öffnen.
3. **A-Record** für **@** (Hauptdomain): **Wert/Ziel** = Ihre **Server-IP** (Primäre IPv4).
4. **A-Record** für **www**: **Wert/Ziel** = dieselbe **Server-IP**.
5. **Speichern.**

**Keine Befehle** – nur Klicks und Einträge in der IONOS-Oberfläche.

---

## 9. SSL (optional) – auf dem Server

**Wo:** **Auf dem Server** (per SSH eingeloggt), **nachdem** die Domain per DNS auf die Server-IP zeigt.

**Befehle auf dem Server:**

```bash
apt install -y certbot python3-certbot-apache
```

```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de
```

E-Mail angeben und Anweisungen von Certbot folgen. Danach läuft die Seite per **https://**.

---

## Kurz-Merkblatt

| Wo | Was eingeben / tun |
|----|---------------------|
| **PC – Terminal/PowerShell** | `ssh root@IHRE_IP` → Passwort → (später) `exit` |
| **PC – gleiches Fenster nach Login** = **Server** | `apt update …`, `apt install apache2`, `systemctl start apache2`, PHP-Befehle, `chown …`, Certbot |
| **PC – Editor** | `.env.deploy` aus `.env.deploy.example` erstellen, IP eintragen |
| **PC – PowerShell im Projektordner** | `.\deploy-ionos.ps1` |
| **Browser – IONOS** | Domain & SSL → DNS → A-Record für @ und www auf Server-IP setzen |

**Merksatz:** Alles, was Sie **nach** `ssh root@IHRE_IP` und vor `exit` in **demselben** Fenster eingeben, läuft **auf dem Server**. Alles andere (neues Fenster vor SSH, Editor, Deploy-Skript, IONOS-Webseite) ist **Ihr PC** bzw. **Browser**.
