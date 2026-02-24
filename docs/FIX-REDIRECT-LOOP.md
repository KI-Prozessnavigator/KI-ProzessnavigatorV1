# Redirect-Schleife beheben (ERR_TOO_MANY_REDIRECTS)

## Ursache
Die Regel `location = /index.html { return 301 /; }` führt zusammen mit `try_files $uri $uri/ /index.html` zu einer Endlosschleife: Anfrage an `/` → Nginx liefert intern `/index.html` → die Regel antwortet mit 301 auf `/` → Browser fragt wieder `/` an.

## Sofort-Fix auf dem Server (SSH)

```bash
# 1. Einloggen
ssh root@87.106.166.120

# 2. Zeile mit "location = /index.html" entfernen (in beiden server-Blöcken)
sed -i '/location = \/index\.html { return 301 \/; }/d' /etc/nginx/conf.d/ki-prozessnavigator.conf

# 3. Config prüfen
nginx -t

# 4. Nginx neu laden
systemctl reload nginx
```

Danach die Domain im Browser testen (ggf. Cookies löschen oder Inkognito-Fenster).

## Zweiter Domain-Eintrag / „WordPress“ bei IONOS

Wenn im Internet ein zweiter Eintrag oder eine WordPress-Ansicht erscheint, obwohl Sie kein WordPress nutzen:

1. **IONOS Kundenmenü → Domain & SSL:** Prüfen, ob für ki-prozessnavigator.de mehrere Einträge oder Weiterleitungen existieren (z. B. von www auf nicht-www oder umgekehrt). Nur eine Weiterleitung auf den VPS (A-Record oder CNAME) verwenden.
2. **IONOS „Websites & Shops“ / „Hosting“:** Prüfen, ob ein alter WordPress- oder Website-Baukasten-Eintrag auf die gleiche Domain zeigt. Deaktivieren oder entfernen, damit nur der VPS (87.106.166.120) die Domain bedient.
3. **DNS:** Nur die gewünschten A-/CNAME-Records auf die VPS-IP zeigen lassen; keine doppelten oder veralteten Einträge.

Nach dem Nginx-Fix und dem Bereinigen doppelter Einträge sollte die Domain wieder normal erreichbar sein.
