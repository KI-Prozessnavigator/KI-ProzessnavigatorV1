# Firewall: Leeres QUELL-IP (Source IP) = 0.0.0.0/0?

## Ihre Frage

Sie haben in der IONOS Firewall die richtigen Ports (22, 80, 443) eingestellt, aber **kein "0.0.0.0/0"** in der Spalte **QUELL-IP** (Source IP).

## Antwort

Bei vielen Firewall-Oberflächen (auch IONOS) bedeutet ein **leeres** Feld **QUELL-IP** (Source IP):

- **Alle Quellen** – Verbindungen von **überall** werden erlaubt.
- Das entspricht in der Praxis **0.0.0.0/0** (jede IPv4-Adresse).

Sie müssen **nichts** eintragen, wenn die Regeln für Port 22, 80 und 443 **INGRESS** (eingehend) sind und **QUELL-IP leer** ist. Dann ist der Zugriff von außen auf diese Ports bereits erlaubt.

---

## Optional: 0.0.0.0/0 explizit eintragen

Falls Sie es **explizit** machen wollen:

1. **Firewall-Regel bearbeiten** (z. B. Stift-Symbol).
2. Bei **QUELL-IP** (Source IP) eintragen: **0.0.0.0/0**
3. Speichern.

Damit ist dieselbe Wirkung wie bei „leer = alle“ nur klar dokumentiert.

---

## Warum https://ki-prozessnavigator.de trotzdem nicht geht

Sie schreiben: **http://213.165.76.107** funktioniert, Firewall-Ports sind richtig.

Dann liegt das Problem sehr wahrscheinlich **nicht** an der Firewall, sondern an einem der folgenden Punkte:

### 1. DNS: Zeigt die Domain auf Ihre IP?

Im Browser oder in der PowerShell:

```powershell
nslookup ki-prozessnavigator.de
```

Unter **Address** muss **213.165.76.107** stehen. Wenn eine **andere** IP erscheint, zeigt die Domain noch woanders hin (z. B. altes Hosting) → bei IONOS unter **Domain & SSL** → **ki-prozessnavigator.de** → **DNS** den **A-Record** für **@** und **www** auf **213.165.76.107** setzen und speichern.

### 2. Apache und SSL auf dem Server

Wenn **http://213.165.76.107** geht, aber **https://ki-prozessnavigator.de** (nach DNS-Korrektur) nicht:

- Apache muss auf **Port 443** lauschen.
- Die SSL-Site (z. B. 000-default-le-ssl.conf) muss aktiv sein.

Einmal ausführen (im Projektordner im Terminal):

```powershell
.\scripts\server-apache-repair.ps1
```

(Passwort eingeben, wenn gefragt.) Das Skript startet Apache, aktiviert die SSL-Site und startet Apache neu.

### 3. Mit https per IP testen

Im Browser: **https://213.165.76.107**

- **Lädt (evtl. mit Zertifikatswarnung):** SSL und Apache auf 443 sind ok, dann liegt es sehr wahrscheinlich am **DNS** (Domain zeigt nicht auf 213.165.76.107).
- **Verbindung abgelehnt:** Apache hört nicht auf 443 oder SSL-Site ist nicht aktiv → **server-apache-repair.ps1** ausführen.

---

## Kurz

- **Leeres QUELL-IP** = in der Regel **alle Quellen** (wie 0.0.0.0/0). Sie müssen nichts ändern, wenn die Regeln für 22, 80, 443 so eingetragen sind.
- Optional können Sie **0.0.0.0/0** explizit eintragen.
- Da **http://213.165.76.107** funktioniert: Als Nächstes **DNS** prüfen (nslookup) und ggf. **.\scripts\server-apache-repair.ps1** ausführen, danach **https://ki-prozessnavigator.de** testen.
