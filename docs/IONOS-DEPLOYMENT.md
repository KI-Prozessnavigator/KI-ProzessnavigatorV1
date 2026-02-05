# IONOS: Projekt für SFTP-Upload vorbereiten

Diese Anleitung erklärt, wie Sie das Projekt so aufbereiten, dass Sie es per SFTP auf IONOS hochladen können und die Website über HTML (und optional PHP) läuft.

---

## 1. Ordnerstruktur beibehalten

Laden Sie **alle relevanten Dateien und Ordner** in den **Webroot** Ihres IONOS-Hostings hoch. Der Webroot heißt bei IONOS meist:

- **`/`** (Stamm des Webspace) oder  
- **`htdocs`** / **`www`** (je nach Tarif)

Die **Startseite** muss nach dem Upload so erreichbar sein:
- `https://ihredomain.de/` → zeigt `index.html`

### Diese Ordner/Dateien müssen hochgeladen werden

| Hochladen | Inhalt |
|-----------|--------|
| **Im Root** | `index.html`, `agb.html`, `datenschutz.html`, `impressum.html`, `.htaccess`, `robots.txt`, `sitemap.xml` |
| **css/** | Alle `.css`-Dateien |
| **js/** | Alle `.js`-Dateien |
| **assets/** | `icons/`, `images/`, ggf. `fonts/` (siehe unten) |
| **includes/** | `header.html`, `footer.html` |
| **php/** | `config.php`, `send-checklist.php`, `send-email.php` (für Formulare) |

Struktur auf dem Server sollte so aussehen:

```
htdocs/  (oder Ihr Webroot)
├── index.html
├── agb.html
├── datenschutz.html
├── impressum.html
├── .htaccess
├── robots.txt
├── sitemap.xml
├── css/
├── js/
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/     ← nur falls Sie Schriften selbst hosten
├── includes/
└── php/
```

---

## 2. Optional: Nicht hochladen (Aufräumen)

Diese Dateien/Ordner werden für die **laufende Website** nicht benötigt und können beim Upload weggelassen werden:

- **docs/** – nur Dokumentation
- **netlify.toml** – nur für Netlify
- **_headers** – nur für Netlify
- **index.html.backup**, **index.html.backup-original**
- **TEST-*.md**, **README.md** (wenn Sie sie nicht öffentlich haben wollen)
- **.DS_Store** (Mac-Systemdateien)

---

## 3. .htaccess (bereits vorbereitet)

Die vorhandene `.htaccess` ist Apache-kompatibel (IONOS nutzt Apache). Sie enthält u.a.:

- Security-Header
- Optional: `DirectoryIndex index.html index.php` (falls Ihr Tarif das unterstützt)

Falls die Security-Header auf IONOS Fehler erzeugen (z.B. „Internal Server Error“), können Sie in der `.htaccess` vorübergehend den Block mit `Header set …` auskommentieren oder entfernen.

---

## 4. PHP-Konfiguration (Formulare/E-Mail)

Wenn Sie die **Kontakt- und Checklisten-Formulare** nutzen wollen, muss PHP auf IONOS laufen (ist bei Webhosting normalerweise aktiv).

### php/config.php anpassen

1. **E-Mail-Empfänger**  
   - `RECIPIENT_EMAIL` auf die gewünschte Adresse setzen.

2. **SMTP (z.B. Gmail)**  
   - `SMTP_USERNAME`, `SMTP_PASSWORD` (App-Passwort) eintragen.  
   - Oder: IONOS-E-Mail nutzen (SMTP-Daten aus dem IONOS-Kundenbereich).

3. **Erlaubte Domains (CORS)**  
   - In `ALLOWED_ORIGINS` die **echte IONOS-Domain** eintragen, z.B.:
   - `https://ihredomain.de`
   - `https://www.ihredomain.de`
   - Lokale Tests: `http://localhost` kann drin bleiben.

4. **Sicherheit**  
   - `CSRF_SECRET` nur einmal setzen und dann nicht mehr ändern (z.B. langer Zufallsstring).

Ohne Anpassung von `config.php` funktionieren die Formulare nicht; die Seite selbst (HTML/CSS/JS) läuft trotzdem.

---

## 5. Schriften (assets/fonts)

Die Seite verweist in `css/fonts.css` und in `index.html` auf:

- `assets/fonts/PlusJakartaSans-VariableFont_wght.woff2`
- `assets/fonts/InstrumentSerif-Regular.woff2` (bzw. die in fonts.css genannten Dateien)

- **Option A:** Ordner **assets/fonts/** anlegen und die passenden `.woff2`-Dateien dort ablegen, dann mit hochladen.  
- **Option B:** Wenn der Ordner fehlt, laden die Schriften nicht; der Browser nutzt Fallback-Schriften – die Seite bleibt nutzbar.

---

## 6. SFTP-Zugang bei IONOS

1. Im **IONOS Kundenbereich** (Contract & Products → Ihr Hosting/Package) **FTP/SFTP-Zugang** öffnen.
2. **SFTP-Benutzer** und **Passwort** notieren (oder anlegen).
3. **Host:** oft `ihredomain.de` oder `ftp.ihredomain.de` (steht in der IONOS-Hilfe).
4. **Port:** meist **22** (SFTP).
5. Mit einem **SFTP-Client** verbinden, z.B.:
   - FileZilla („Server: SFTP“)
   - WinSCP (Windows)
   - Cyberduck
   - In Cursor/VS Code: SFTP-Extension

6. In den **Webroot** wechseln (z.B. `htdocs` oder das angezeigte Stammverzeichnis des Webspace).
7. Alle oben genannten Ordner und Dateien dorthin hochladen, **Struktur beibehalten**.

---

## 7. Nach dem Upload prüfen

- **Startseite:** `https://ihredomain.de/` → sollte `index.html` anzeigen.
- **Unterseiten:** `https://ihredomain.de/datenschutz.html`, `impressum.html`, `agb.html`.
- **CSS/JS:** Keine 404-Fehler in der Browser-Konsole (F12 → Network/Console).
- **Header/Footer:** Werden per `template-loader.js` aus `includes/` geladen – nur möglich, wenn `includes/` mit hochgeladen wurde.
- **Formulare:** Testabsendung; wenn Fehler, `php/config.php` und PHP-Version auf IONOS prüfen.

---

## 8. Kurz-Checkliste

- [ ] Alle Ordner `css/`, `js/`, `assets/`, `includes/`, `php/` in den Webroot hochgeladen
- [ ] `index.html`, `agb.html`, `datenschutz.html`, `impressum.html` im Root
- [ ] `.htaccess` mit hochgeladen (kein Build nötig)
- [ ] `php/config.php` angepasst (E-Mail, ALLOWED_ORIGINS, CSRF_SECRET)
- [ ] Optional: `assets/fonts/` mit `.woff2`-Dateien
- [ ] Im Browser: Startseite und Unterseiten ohne 404, Formulare getestet

Wenn Sie diese Schritte befolgen, ist das Projekt für IONOS vorbereitet und die Website läuft über HTML (und bei Bedarf PHP) nach dem SFTP-Upload.
