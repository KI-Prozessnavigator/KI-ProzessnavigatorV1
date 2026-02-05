# Sicherheitsaudit – KI-Prozessnavigator (IONOS vCPU)

Kurzer Überblick über die Prüfung von **Konfiguration**, **Installation** und **Sicherheitslücken** sowie konkrete **Empfehlungen** zum Schutz vor Angriffen.

**Letzte Prüfung (nach SSL & DNS):** Stand mit aktivem SSL-Zertifikat (Let’s Encrypt) und konfigurierter Domain.

---

## 0. Sind wir sicher gegen Angriffe und Hacker?

**Kurz:** Sie sind **deutlich besser abgesichert** als viele kleine Websites. Ein Restrisiko bleibt immer (z. B. CSRF, Server-Pflege).

| Bereich | Status |
|--------|--------|
| **Transport (SSL/DNS)** | HTTPS aktiv; HTTP→HTTPS-Weiterleitung und HSTS in `.htaccess` ergänzt; keine Mixed-Content-Probleme in der Codebasis. |
| **Anwendung (Website)** | Security-Header, Rate Limiting, Honeypot, Validierung; sensible Dateien per `.htaccess` blockiert. |
| **Offen** | CSRF-Token für Formulare (mittleres Risiko); laufende Server-Pflege (Updates, Firewall, SSH). |

**Fazit:** Für eine Marketing-Website mit Kontaktformular ist das Niveau **gut**. Für „maximale“ Absicherung: CSRF umsetzen, Server-Checkliste (Abschnitt 3) regelmäßig abarbeiten und Zertifikat-Ablauf (Let’s Encrypt) im Blick behalten (Certbot verlängert automatisch, wenn Cronjob läuft).

---

## 1. Was bereits gut ist

| Bereich | Status |
|--------|--------|
| **Security-Header** | `.htaccess`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP gesetzt. |
| **PHP-Formulare** | Nur POST erlaubt; Eingaben validiert und mit `htmlspecialchars`/`filter_var` bereinigt. |
| **Rate Limiting** | Kontaktformular und Checkliste: Begrenzung pro IP (3 bzw. 5 Anfragen/Stunde). |
| **Honeypot** | Unsichtbares Feld „website“ gegen Bots; bei Befüllung → „Spam erkannt“. |
| **CORS** | Erlaubte Origins fest auf Domain + localhost; kein wildcard. |
| **Fehler nach außen** | Bei Fehlern nur generische Meldung; Details nur in `error_log`. |
| **Deploy** | `.env.deploy` in `.gitignore`; Zugangsdaten nicht im Repo. |

---

## 2. Gefundene Schwachstellen und Risiken

### 2.1 CSRF-Schutz fehlt (mittleres Risiko)

**Problem:** Kontaktformular und Checkliste senden **keinen CSRF-Token**. Ein Angreifer könnte von einer anderen Website aus in Ihrem Namen Anfragen an `php/send-email.php` oder `php/send-checklist.php` auslösen (wenn der Nutzer dort eingeloggt ist, ist das bei einer reinen Marketing-Website eher theoretisch; Risiko: Spam/Abuse).

**Empfehlung:**  
- CSRF-Token pro Session erzeugen, im Formular als verstecktes Feld mitsenden und im PHP prüfen.  
- `config.php` definiert bereits `CSRF_SECRET` – dieser wird in `send-email.php` und `send-checklist.php` derzeit **nicht** verwendet. Dort Token-Erzeugung und -Prüfung einbauen.

---

### 2.2 Konfiguration mit Passwort auf dem Server (hohe Priorität)

**Problem:** `php/config.php` liegt im Webroot und enthält (nach Ihrer Einrichtung auf dem Server) das **Google-App-Passwort**. Wenn Apache/PHP falsch konfiguriert sind oder ein anderer Fehler passiert, könnte die Datei als Quelltext ausgeliefert werden.

**Bereits umgesetzt:**  
- In der **.htaccess** wird der direkte Zugriff auf `php/config.php` mit `Require all denied` / RewriteRule blockiert, sodass die Datei nicht per Browser abrufbar ist.

**Zusätzlich empfohlen:**  
- Auf dem Server: `config.php` nur mit Rechten lesbar machen, die der Webserver braucht (z.B. `chmod 640`, Owner `root`, Group `www-data`).  
- Optional (fortgeschritten): Konfiguration in eine Datei **außerhalb** des Webroots legen (z.B. `/etc/ki-prozessnavigator/config.php`) und in den PHP-Skripten per `require` einbinden; dann ist sie gar nicht unter der URL erreichbar.

---

### 2.3 Verzeichnislisting (bereits abgestellt)

**Problem:** Ohne `Options -Indexes` könnten Besucher Verzeichnisinhalte auflisten.

**Umgesetzt:** In `.htaccess` wurde `Options -Indexes` gesetzt.

---

### 2.4 Sensible Dateien im Webroot (bereits abgesichert)

**Problem:** Dateien wie `.env`, `.env.deploy`, `.gitignore`, `config.php` dürfen nie per HTTP ausgeliefert werden.

**Umgesetzt:**  
- In `.htaccess` blockiert ein `<FilesMatch>` den Zugriff auf `.env`, `.env.deploy`, `.gitignore`, `config.php`.  
- Zusätzlich wird `php/config.php` per `RewriteRule` mit 403 beantwortet.

**Hinweis:** `.env.deploy` wird vom Deploy-Skript **nicht** auf den Server kopiert (nur lokal genutzt). Falls Sie jemals eine `.env` auf dem Server anlegen, bleibt sie durch die Regel geschützt.

---

### 2.5 Session-basiertes Rate Limiting (geringes Risiko)

**Problem:** Rate Limiting nutzt PHP-Sessions. Session-ID steht im Cookie; bei Session-Fixation oder gestohlenem Cookie könnte theoretisch die Zählung umgangen werden. Für ein Kontaktformular ist das Risiko in der Praxis gering.

**Empfehlung (optional):**  
- Nach erfolgreicher Formularabgabe `session_regenerate_id(true)` aufrufen.  
- Für noch härteres Limiting: Zähler pro IP in einer kleinen Datei oder Datenbank statt nur in der Session (z.B. in `/var/lib/php/sessions` oder eigenem Ordner außerhalb Webroot).

---

### 2.6 CORS und Aufruf per IP

**Hinweis:** `ALLOWED_ORIGINS` enthält nur `https://ki-prozessnavigator.de`, `https://www...` und `http://localhost`. Wenn jemand die Seite per **IP** (z.B. `http://213.165.76.107`) aufruft und dort das Formular nutzt, kann der Browser wegen CORS die Antwort blockieren. Sobald Sie nur noch über die Domain erreichbar sind, ist das unkritisch. Optional können Sie für Tests temporär `http://213.165.76.107` in die erlaubten Origins aufnehmen und für Produktion wieder entfernen.

---

## 3. SSL, DNS und Transport-Sicherheit (nach Einrichtung)

| Prüfpunkt | Ergebnis |
|-----------|----------|
| **SSL-Zertifikat** | Let's Encrypt (Certbot) eingerichtet für `ki-prozessnavigator.de` und `www.ki-prozessnavigator.de`. |
| **HTTP→HTTPS** | In `.htaccess` 301-Weiterleitung ergänzt (Fallback, falls Apache-VHost es nicht setzt). Certbot richtet i.d.R. bereits Redirect im VHost ein. |
| **HSTS** | Header `Strict-Transport-Security` in `.htaccess` gesetzt (nur bei HTTPS). Reduziert Risiko von Downgrade-Angriffen. |
| **Mixed Content** | Keine problematischen `http://`-Ressourcen; SVG-Namespace ist kein Netzwerkaufruf. Canonical und Schema.org nutzen `https://`. |
| **CORS / Formulare** | Erlaubte Origins: `https://ki-prozessnavigator.de`, `https://www...`, `http://localhost` – Formulare laufen unter HTTPS. |
| **DNS** | A-Records für Domain und www auf Server-IP; SSL greift unter Domain-Namen. |

**Empfehlung:** Certbot-Ablauf prüfen: `certbot renew --dry-run` auf dem Server (Cronjob für automatische Verlängerung sollte aktiv sein).

---

## 4. Server-Seite (IONOS vCPU) – Checkliste

Diese Punkte betreffen die **Installation und Konfiguration auf dem Server** (nicht nur den Code):

| Maßnahme | Status / Empfehlung |
|----------|---------------------|
| **Firewall** | Nur Ports 22 (SSH), 80 (HTTP), 443 (HTTPS) von außen freigeben. |
| **SSH** | SSH-Key-Login nutzen; Passwort-Login deaktivieren; Fail2ban optional. |
| **Updates** | Regelmäßig `apt update && apt upgrade` (oder automatische Sicherheitsupdates). |
| **HTTPS** | SSL-Zertifikat (z.B. Let’s Encrypt ✅ SSL (Let's Encrypt) eingerichtet; HTTP→HTTPS und HSTS in `.htaccess` ergänzt. |
| **PHP** | `display_errors = Off`, `log_errors = On`; `error_log` außerhalb Webroot oder geschützt. |
| **Dateirechte** | Webroot: `chown -R www-data:www-data`, Verzeichnisse 755, Dateien 644; `config.php` z.B. 640. |
| **.htaccess** | Nach dem Deploy prüfen, ob Apache `.htaccess` auswertet (`AllowOverride` mind. `FileInfo`/`All` für das Webroot). |

---

## 5. Kurzfassung: Was Sie tun sollten

1. **Sofort (bereits im Repo umgesetzt):**  
   - Verzeichnislisting aus, Zugriff auf `.env*`, `config.php`, `.gitignore` in `.htaccess` blockiert.

2. **Bald:**  
   - CSRF-Token für Kontaktformular und Checkliste implementieren (Secret in `config.php` nutzen).  
   - Auf dem Server: Dateirechte für `config.php` verschärfen (z.B. 640).

3. **Server-Pflege:**  
   - Firewall nur 22/80/443; SSH härten; Updates; HTTPS mit Redirect; PHP-Fehler nur ins Log.

Wenn Sie möchten, kann als Nächstes die **konkrete CSRF-Implementierung** (PHP + JavaScript) Schritt für Schritt beschrieben werden.
