# Deploy auf IONOS Cloud Server (per Terminal)

Die Website kann per SSH/SCP auf einen **IONOS Cloud Server** (VPS) hochgeladen werden – ohne WordPress Hosting.

**Vollständige Anleitung** (Domain von WP Hosting freigeben, Data Center mit Canvas, Deploy, Domain verbinden): [IONOS-CLAUDE-SERVER-DEPLOY.md](IONOS-CLAUDE-SERVER-DEPLOY.md).

---

## Voraussetzungen

- **IONOS Cloud Server** (VPS) mit einer öffentlichen IP oder Hostname
- **SSH-Zugang** (Benutzer + Passwort oder SSH-Key)
- Auf dem Server: **Webroot** vorhanden (z.B. `/var/www/html`) und Webserver (Apache/Nginx) konfiguriert
- **Windows:** OpenSSH-Client (meist ab Windows 10 vorhanden; sonst unter „Optionale Features“ aktivieren)

---

## 1. Konfiguration anlegen

Im Projektordner:

1. Datei **`.env.deploy.example`** als **`.env.deploy`** kopieren.
2. **`.env.deploy`** bearbeiten und eintragen:

| Variable        | Bedeutung |
|-----------------|-----------|
| `IONOS_HOST`    | IP oder Hostname des Cloud Servers (z.B. `123.45.67.89` oder `vps.ihredomain.de`) |
| `IONOS_USER`    | SSH-Benutzer (z.B. `root` oder ein Benutzer mit Schreibrechten) |
| `IONOS_WEBROOT` | Verzeichnis auf dem Server für die Website (z.B. `/var/www/html`) |
| `IONOS_PORT`    | Optional, Standard: `22` |
| `IONOS_SSH_KEY` | Optional: Pfad zu Ihrem privaten SSH-Key (z.B. `C:\Users\IhrName\.ssh\id_rsa`) für passwortlosen Zugang |

**Wichtig:** `.env.deploy` enthält Zugangsdaten und wird nicht ins Git übernommen. Niemals Token/Passwörter im Chat oder in öffentlichen Dateien eintragen.

---

## 2. Deploy ausführen

Im Projektordner im **Terminal** (PowerShell):

```powershell
.\deploy-ionos.ps1
```

- Beim ersten Mal ggf. Host-Key bestätigen (`yes`).
- Wenn **kein** `IONOS_SSH_KEY` gesetzt ist: Passwort für den SSH-Benutzer eingeben.

Das Skript kopiert nur die nötigen Dateien (HTML, CSS, JS, assets, includes, php) in ein temporäres Verzeichnis und lädt sie per **scp** in `IONOS_WEBROOT` hoch.

---

## 3. Server vorbereiten (einmalig)

Auf dem IONOS Cloud Server muss ein Webserver laufen und das Webroot zeigen:

- **Apache:** z.B. DocumentRoot auf `/var/www/html` (oder Ihren `IONOS_WEBROOT`)
- **Nginx:** `root` auf dasselbe Verzeichnis

PHP muss installiert sein, wenn Sie die Formulare (Kontakt/Checkliste) nutzen wollen. Danach `php/config.php` auf dem Server anpassen (E-Mail, erlaubte Domains).

---

## Kurz

1. `.env.deploy` aus `.env.deploy.example` anlegen und Host/User/Webroot (und optional Key) eintragen.
2. `.\deploy-ionos.ps1` ausführen.
3. Zugangsdaten nur lokal in `.env.deploy` halten, nie teilen oder committen.
