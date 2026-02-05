# www.ki-prozessnavigator.de: "Nicht sicher" / ERR_CERT_COMMON_NAME_INVALID

## Was die Meldung bedeutet

**ERR_CERT_COMMON_NAME_INVALID** bzw. **"Dies ist keine sichere Verbindung"** bei **https://www.ki-prozessnavigator.de** heißt: Das SSL-Zertifikat gilt **nur** für **ki-prozessnavigator.de**, nicht für **www.ki-prozessnavigator.de**. Der Browser lehnt die Verbindung deshalb ab.

## Loesung: Zertifikat um www erweitern

Das Skript **.\scripts\ssl-www-hinzufuegen.ps1** wurde angepasst. Es macht jetzt **zwei Schritte**:

1. **ServerAlias www.ki-prozessnavigator.de** in der Apache-SSL-Konfiguration setzen (damit Certbot den VHost findet).
2. **Certbot --expand** ausfuehren, damit das Zertifikat um **www.ki-prozessnavigator.de** erweitert wird.

**Bitte erneut ausfuehren:**

```powershell
.\scripts\ssl-www-hinzufuegen.ps1
```

Danach **https://www.ki-prozessnavigator.de** im Browser testen (evtl. Cache leeren oder Inkognito-Fenster). Die Seite sollte mit Schloss-Symbol laden.

---

## Falls das Skript fehlschlaegt: Manuell auf dem Server

1. **Per SSH einloggen:**

   ```powershell
   ssh root@213.165.76.107
   ```

2. **ServerAlias setzen** (falls noch nicht vorhanden):

   ```bash
   grep -q "ServerAlias www.ki-prozessnavigator.de" /etc/apache2/sites-available/000-default-le-ssl.conf || sed -i "/ServerName ki-prozessnavigator.de/a ServerAlias www.ki-prozessnavigator.de" /etc/apache2/sites-available/000-default-le-ssl.conf
   systemctl reload apache2
   ```

3. **Zertifikat um www erweitern:**

   ```bash
   certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --expand
   ```

   (E-Mail und AGB ggf. bestaetigen. Certbot erweitert das bestehende Zertifikat um www.)

4. **Apache neu laden:**

   ```bash
   systemctl reload apache2
   ```

5. **Verbindung beenden:** `exit`

6. **Im Browser testen:** https://www.ki-prozessnavigator.de

Nach dem Erweitern enthaelt das Zertifikat **ki-prozessnavigator.de** und **www.ki-prozessnavigator.de** – die Warnung **ERR_CERT_COMMON_NAME_INVALID** sollte verschwinden.
