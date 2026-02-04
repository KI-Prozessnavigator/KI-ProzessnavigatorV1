# Website nicht erreichbar (ERR_CONNECTION_REFUSED) – Fix

Wenn **https://ki-prozessnavigator.de** und **https://www.ki-prozessnavigator.de** mit „Verbindung abgelehnt“ antworten, pruefen Sie der Reihe nach:

---

## Schritt 1: Per IP testen (auf Ihrem PC)

Im Browser oeffnen: **http://213.165.76.107**

- **Laedt die Seite:** Problem liegt sehr wahrscheinlich am **DNS** (Domain zeigt auf falsche IP) oder an der **Firewall** nur fuer die Domain. Dann Schritt 2 und 3 trotzdem pruefen.
- **Laedt nicht (auch Verbindung abgelehnt):** Apache laeuft nicht oder Firewall blockiert. **Schritt 2 und 3** ausfuehren.

---

## Schritt 2: Apache auf dem Server reparieren (ein Skript)

In Cursor **Terminal** oeffnen (Strg+oe), dann ausfuehren:

```powershell
.\scripts\server-apache-repair.ps1
```

Wenn nach dem **Passwort** gefragt wird: Server-Passwort eingeben, Enter.

Das Skript macht auf dem Server:
- Apache starten und beim Boot aktivieren
- SSL-Site aktivieren (000-default-le-ssl.conf)
- Konfiguration pruefen
- Apache neu starten
- Anzeigen, ob Port 80 und 443 offen sind

Danach erneut **http://213.165.76.107** und **https://ki-prozessnavigator.de** im Browser testen.

---

## Schritt 3: Firewall im IONOS DCD pruefen

Im **Data Center Designer** [dcd.ionos.com](https://dcd.ionos.com):

1. **Security** (links) -> **Network Security Groups** oeffnen.
2. Die **Security Group** Ihres vCPU-Servers oeffnen.
3. Pruefen: Es muss **eingehende Regeln (Inbound)** geben fuer:
   - **Port 80** (TCP)
   - **Port 443** (TCP)
4. Fehlen die Regeln: **Neue Regel** anlegen, Richtung **Inbound**, Protokoll **TCP**, Port **80** bzw. **443**, Quelle z.B. **0.0.0.0/0**, speichern.

Ohne diese Regeln kann von ausserhalb niemand auf Ihre Website zugreifen.

---

## Schritt 4: DNS pruefen (falls nur Domain nicht geht, IP aber schon)

In der **PowerShell** auf Ihrem PC:

```powershell
nslookup ki-prozessnavigator.de
```

Unter „Address“ muss **213.165.76.107** stehen. Wenn eine **andere** IP erscheint: Bei IONOS unter **Domain & SSL** -> **ki-prozessnavigator.de** -> **DNS** den **A-Record** fuer **@** und **www** auf **213.165.76.107** setzen und speichern.

---

## Kurz-Reihenfolge

1. **http://213.165.76.107** im Browser testen.
2. **.\scripts\server-apache-repair.ps1** ausfuehren (Passwort eingeben).
3. **Firewall im DCD** pruefen: Port 80 und 443 Inbound erlaubt.
4. **https://ki-prozessnavigator.de** erneut testen.
