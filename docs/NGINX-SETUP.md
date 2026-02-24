# Nginx: Slug-URLs aktivieren (ohne .html)

Auf dem IONOS-VPS läuft **Nginx** (kein Apache). Nginx liest **keine** `.htaccess`-Dateien – daher greifen die Redirects erst, wenn die Regeln in der Nginx-Konfiguration stehen.

## Schritte auf dem Server (per SSH)

1. **VHost-Config für ki-prozessnavigator.de finden**
   ```bash
   grep -r "ki-prozessnavigator\|server_name" /etc/nginx/
   ```

2. **In der passenden `server { }`-Block** die Zeilen aus `docs/nginx-slug-urls.conf` einfügen (am besten direkt nach `server_name` / vor anderen `location`-Blöcken).

   Oder per Include einbinden (wenn die Datei z. B. nach `/var/www/html/nginx-slug-urls.conf` kopiert wurde):
   ```nginx
   include /var/www/html/nginx-slug-urls.conf;
   ```

3. **Konfiguration prüfen und Nginx neu laden**
   ```bash
   nginx -t && systemctl reload nginx
   ```
   **Falls `reload` mit „Permission denied“ fehlschlägt (z. B. nach SCP aus /tmp):** Auf dem Server ist SELinux aktiv. Konfig-Datei muss den Kontext `httpd_config_t` haben:
   ```bash
   restorecon -v /etc/nginx/conf.d/ki-prozessnavigator.conf
   systemctl reload nginx
   ```

4. **Test**
   - `curl -I https://ki-prozessnavigator.de/impressum.html` → sollte `301` und `Location: …/impressum` zeigen
   - `curl -I https://ki-prozessnavigator.de/impressum` → sollte `200` zeigen
