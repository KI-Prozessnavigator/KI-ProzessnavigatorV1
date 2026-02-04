# SSL-Site fehlt (000-default-le-ssl) – was tun?

## Was der Fehler bedeutet

**"ERROR: Site 000-default-le-ssl does not exist!"** heißt: Auf dem Server gibt es die Apache-Konfiguration für HTTPS (SSL) nicht. Ohne diese Konfiguration lauscht Apache nicht auf Port 443 – deshalb funktioniert **https://ki-prozessnavigator.de** nicht, **http://213.165.76.107** aber schon.

## Warum wird kein Passwort abgefragt?

Wenn beim Ausführen von **.\scripts\server-apache-repair.ps1** **kein Passwort** erscheint, nutzt Ihr PC sehr wahrscheinlich einen **SSH-Key** (öffentlicher Key liegt auf dem Server). Dann fragt SSH kein Passwort – das ist normal und gewollt.

Falls Sie **doch** ein Passwort eingeben wollen: Key vom Server entfernen oder ein anderes Terminal nutzen, in dem noch kein Key verwendet wird. Für die Reparatur ist beides egal – das Skript läuft so oder so.

## Lösung: SSL und SSL-Site erneut einrichten

Die SSL-Site wird von **Certbot** angelegt. Wenn sie fehlt, Certbot noch einmal laufen lassen (nur Hauptdomain, ohne www – dann keine „vhost ambiguity“):

### Option A: Nur Hauptdomain (empfohlen, weniger Fehler)

Im Terminal (Cursor: Strg+ö) ausführen:

```powershell
.\scripts\ssl-einrichten-remote.ps1
```

**Falls** das Skript wieder **www** mit anfordert und einen Fehler meldet: Option B nutzen.

### Option B: Certbot nur für ki-prozessnavigator.de (ohne www)

Dann wird nur eine Domain angefordert, die SSL-Site wird trotzdem angelegt. Einmal per SSH auf den Server und dort ausführen:

**1. Per SSH einloggen** (im Terminal):

```powershell
ssh root@213.165.76.107
```

Wenn hier **nach Passwort gefragt** wird: Passwort eingeben. Wenn nicht: SSH-Key ist aktiv (siehe oben).

**2. Auf dem Server diesen Befehl ausführen** (nur Hauptdomain, ohne www):

```bash
certbot --apache -d ki-prozessnavigator.de --non-interactive --agree-tos -m d.buchele@ki-prozessnavigator.de --expand
```

**3. Apache neu starten:**

```bash
systemctl restart apache2
```

**4. Verbindung beenden:**

```bash
exit
```

**5. Im Browser testen:** https://ki-prozessnavigator.de

Danach sollte die SSL-Site **000-default-le-ssl.conf** existieren und **https://ki-prozessnavigator.de** mit Schloss laufen. **www** können Sie später mit **.\scripts\ssl-fix-www.ps1** oder einer weiteren Certbot-Erweiterung nachziehen.

## Kurz

1. **Kein Passwort** = SSH-Key wird genutzt, normal.
2. **SSL-Site fehlt** = Certbot erneut ausführen (Option A oder B).
3. Danach **.\scripts\server-apache-repair.ps1** erneut ausführen, dann **https://ki-prozessnavigator.de** testen.
