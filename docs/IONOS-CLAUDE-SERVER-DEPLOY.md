# IONOS Deploy – Anleitung

Deployment der KI-Prozessnavigator-Website auf einen IONOS Cloud Server (oder beliebigen Server mit SSH/SCP).

## Voraussetzungen

- SSH-Zugang zum Server (Benutzer + Host, optional SSH-Key)
- Auf dem Rechner: PowerShell, OpenSSH (z. B. `scp` verfügbar)

## Konfiguration

1. Im Projektroot die Datei `.env.deploy` anlegen (nicht committen – steht in `.gitignore`):
   - `.env.deploy.example` kopieren nach `.env.deploy`
   - Werte eintragen:
     - **IONOS_HOST** – IP oder Hostname des Servers
     - **IONOS_USER** – SSH-Benutzer (z. B. `root`)
     - **IONOS_WEBROOT** – Zielverzeichnis auf dem Server (z. B. `/var/www/html`)
     - **IONOS_PORT** – SSH-Port (meist `22`)
     - **IONOS_SSH_KEY** – (optional) Pfad zum privaten SSH-Key für passwortlosen Upload

2. `php/config.php` auf dem Server einmalig anlegen bzw. anpassen (Resend, CORS, etc.). Siehe `php/INSTALLATION.md`.

## Deploy ausführen

Im Projektordner in PowerShell:

```powershell
.\deploy-ionos.ps1
```

Das Skript:

- Liest `.env.deploy`
- Kopiert alle Projektdateien (ohne `.git`, `__MACOSX`, `.env.deploy`, `.DS_Store`, `deploy-ionos.ps1`, Backups) in ein temporäres Verzeichnis
- Überschreibt **nicht** `php/config.php` auf dem Server (damit Ihre Zugangsdaten erhalten bleiben)
- Lädt per SCP den Inhalt in `IONOS_WEBROOT` hoch

## Was wird deployed?

- Alle HTML-Seiten (z. B. `index.html`, `agb.html`, `datenschutz.html`, `impressum.html`, `ueber-uns.html`)
- `assets/`, `css/`, `includes/`, `js/` vollständig
- `php/` inkl. `send-email.php`, `send-checklist.php`, `templates/`, `config.php.example` (nicht die lokale `config.php`)
- `.htaccess`, `_headers`, `robots.txt`, `sitemap.xml`

Nicht mit hochgeladen: `.git`, `.env.deploy`, `__MACOSX`, `.DS_Store`, `node_modules`, `*.backup`, das Skript selbst.

## Fehlerbehebung

- **„.env.deploy nicht gefunden“** – Datei aus `.env.deploy.example` anlegen und ausfüllen.
- **„FEHLER: In .env.deploy fehlt: …“** – Fehlende Variable in `.env.deploy` eintragen.
- **SCP-Verbindung schlägt fehl** – Host/Port/User prüfen; bei Key: `IONOS_SSH_KEY` auf gültigen Pfad setzen (z. B. `C:\Users\IhrName\.ssh\id_rsa`).
- **PHP/Seite funktioniert nicht** – Siehe `php/INSTALLATION.md` (Resend, ENV-Variablen, `config.php` auf dem Server).
