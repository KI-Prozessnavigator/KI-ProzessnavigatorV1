# vCPU-Passwort ändern, Anpassungen deployen, Google Workspace

## 1. vCPU-Passwort ändern – ja, empfohlen

**Warum:** Das Passwort wurde früher im Chat genannt – aus Sicherheitsgründen sollten Sie es wechseln.

**Wo:** **Auf dem Server** (per SSH eingeloggt, wo `root@ubuntu` steht).

**Befehl:**

```bash
passwd
```

- Aktuelles Passwort eingeben (das alte vCPU-Passwort).
- Neues, sicheres Passwort eingeben (z. B. 12+ Zeichen, Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen).
- Passwort zur Bestätigung nochmal eingeben.
- **Neues Passwort notieren** und sicher aufbewahren – Sie brauchen es für SSH-Login, falls Sie mal ohne SSH-Key einloggen (z. B. IONOS-Konsole).

**Hinweis:** Wenn Sie **nur** per SSH-Key einloggen (`.env.deploy` mit `IONOS_SSH_KEY`), fragt SSH normalerweise kein Passwort. Das Passwort brauchen Sie trotzdem z. B. für `sudo` (falls Sie später einen anderen Benutzer nutzen) oder für die IONOS-Konsole/Recovery.

---

## 2. Anpassungen an der Website: lokal bearbeiten, dann auf Server deployen

**Ablauf:**

| Schritt | Wo | Was |
|--------|-----|-----|
| 1. Bearbeiten | **Ihr PC** – Projektordner `KI-ProzessnavigatorV1` im Editor (z. B. Cursor/VS Code) | HTML, CSS, JS, PHP, Bilder usw. **lokal** ändern und speichern. |
| 2. Testen (optional) | **Ihr PC** – Browser oder lokaler Server | Seite lokal prüfen (z. B. Live-Server, oder direkt Dateien öffnen). |
| 3. Deploy | **Ihr PC** – **PowerShell** im Projektordner | `.\deploy-ionos.ps1` ausführen. Das Skript kopiert die aktuellen Dateien per SCP auf den Server nach `/var/www/html`. |
| 4. Rechte (falls nötig) | **Auf dem Server** (SSH) | Nach dem Deploy bei 403-Fehlern: `chown -R www-data:www-data /var/www/html` (siehe Anleitung). |
| 5. Prüfen | **Browser** | **https://ki-prozessnavigator.de** (oder **http://213.165.76.107**) mit Strg+F5 testen. |

**Kurz:** Immer **lokal** im Projektordner bearbeiten → speichern → **`.\deploy-ionos.ps1`** ausführen → Änderungen sind auf dem Server. Kein direkter Edit auf dem Server nötig (außer z. B. `php/config.php` mit sensiblen Daten – die können Sie auch lokal anpassen und mit deployen, wenn sie in `.env` o. Ä. ausgelagert sind, oder einmalig auf dem Server bearbeiten).

---

## 3. Google Workspace und Domain (vorher WordPress, jetzt eigener Server)

**Situation:** Die Domain **ki-prozessnavigator.de** lief vorher über **WordPress** (IONOS WP-Hosting). Jetzt zeigt die Domain per DNS (A-Record) auf **Ihren vCPU-Server** mit der neuen Website. **Google Workspace** (E-Mail, Kalender usw.) ist mit derselben Domain verbunden (E-Mail z. B. @ki-prozessnavigator.de).

**Wichtig:**

| Thema | Was tun |
|-------|---------|
| **E-Mail (Google Workspace)** | **Nichts an der Domain/DNS ändern**, die für E-Mail nötig ist. Die **MX-Einträge** und ggf. **TXT (SPF, DKIM, DMARC)** müssen weiterhin auf **Google** zeigen (z. B. `mx00.ionos.de` / Google MX, je nachdem wie Sie E-Mail betreiben). Sie haben nur **A-Records** für **@** und **www** auf Ihre Server-IP (213.165.76.107) gesetzt – das betrifft **nur den Webverkehr** (HTTP/HTTPS). **MX, TXT, CNAME** für Mail haben Sie nicht geändert → E-Mail über IONOS/Google Workspace läuft weiter. |
| **Website vs. E-Mail** | **A-Record @** = ki-prozessnavigator.de zeigt auf den Server (Website). **MX-Records** = wohin E-Mails für @ki-prozessnavigator.de gehen (z. B. IONOS Mail oder Google). Beides kann gleichzeitig gelten: A für Website, MX für E-Mail. Wenn Ihre E-Mails über **Google Workspace** laufen, müssen die **MX-Einträge** in IONOS auf die **Google MX-Server** zeigen (nicht auf 213.165.76.107). Das haben Sie typischerweise schon so eingerichtet; nur die A-Records haben Sie neu gesetzt. |
| **Google Workspace „Domain verbunden“** | Wenn Google Workspace bereits mit **ki-prozessnavigator.de** verbunden ist (Verifizierung über DNS-TXT oder CNAME), bleibt das bestehen. Sie haben nur **A-Records** hinzugefügt/geändert. **TXT/CNAME für Google** (Domain-Verifizierung, MX für Gmail) **nicht löschen oder überschreiben**. Wenn Sie unsicher sind: In IONOS unter DNS prüfen – alle Einträge, die **Mail / Google / Verifizierung** zugeordnet sind, unverändert lassen. |

**Kurz:**

- **vCPU-Passwort:** Auf dem Server mit `passwd` ändern, neues Passwort sicher notieren.
- **Anpassungen:** Lokal im Projekt bearbeiten → **`.\deploy-ionos.ps1`** ausführen → Änderungen sind live.
- **Google Workspace:** A-Records für Website (@, www) auf Ihren Server sind OK. MX/TXT/CNAME für E-Mail und Google-Verifizierung **nicht** anrühren – dann funktionieren E-Mail und Google Workspace weiter wie bisher.
