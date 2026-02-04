# Troubleshooting: „Die Website ist nicht erreichbar“ / ERR_CONNECTION_REFUSED

Wenn **https://ki-prozessnavigator.de** (oder **http://**) mit **„Verbindung abgelehnt“** (ERR_CONNECTION_REFUSED) antwortet, antwortet am Ziel **kein Dienst** auf Port 80 (HTTP) bzw. 443 (HTTPS). Diese Schritte helfen, die Ursache einzugrenzen.

---

## Schnell-Check: Erreichbarkeit per IP

**Auf Ihrem PC (PowerShell oder Browser):**

1. **Per IP testen (HTTP):** Im Browser **`http://213.165.76.107`** aufrufen (ersetzen Sie die IP durch **Ihre** Primäre IPv4 aus dem DCD, falls anders).
   - **Funktioniert:** Website erscheint → Problem liegt sehr wahrscheinlich an **DNS** oder Sie rufen **https://** auf, obwohl noch **kein SSL** eingerichtet ist (siehe unten).
   - **Funktioniert nicht** (auch „Verbindung abgelehnt“) → Problem liegt am **Server** (Apache läuft nicht oder Firewall blockiert).

2. **DNS prüfen:** In der PowerShell ausführen:
   ```powershell
   nslookup ki-prozessnavigator.de
   ```
   Unter „Address“ sollte die **IP Ihres vCPU Servers** stehen (z. B. 213.165.76.107). Wenn eine andere IP erscheint, zeigt die Domain noch auf das alte Hosting → DNS bei IONOS prüfen (A-Record auf die richtige IP setzen).

---

## Ursache 1: Sie rufen https:// auf, SSL ist aber noch nicht eingerichtet

**Symptom:** `http://ki-prozessnavigator.de` funktioniert, `https://ki-prozessnavigator.de` lehnt die Verbindung ab.

**Grund:** Ohne SSL lauscht der Server nur auf **Port 80** (HTTP). **Port 443** (HTTPS) ist erst nach der Einrichtung von Certbot aktiv.

**Lösung (kurzfristig):** **http://ki-prozessnavigator.de** nutzen (ohne „s“).

**Lösung (dauerhaft):** SSL auf dem Server einrichten (Certbot), siehe [NÄCHSTE-SCHRITTE-DOMAIN-SSL-PHP.md](NÄCHSTE-SCHRITTE-DOMAIN-SSL-PHP.md) → Abschnitt „SSL (HTTPS)“.

---

## Ursache 2: Apache läuft nicht oder lauscht nicht auf Port 80/443

**Auf dem Server per SSH einloggen** (z. B. `ssh root@213.165.76.107`), dann nacheinander ausführen:

### Apache-Status prüfen

```bash
systemctl status apache2
```

- **Active: active (running)** → Apache läuft.
- **Active: inactive (dead)** → Apache starten:

```bash
systemctl start apache2
systemctl enable apache2
```

### Prüfen, ob Apache auf Port 80 (und ggf. 443) lauscht

```bash
ss -tlnp | grep -E ':80|:443'
```

Erwartung: Es erscheinen Zeilen mit `:80` und nach SSL-Einrichtung `:443`. Wenn **nichts** erscheint, lauscht kein Webserver → Apache starten (siehe oben) oder Apache-Konfiguration prüfen.

### Apache neu starten

```bash
systemctl restart apache2
```

Danach erneut **http://IHRE_IP** im Browser testen.

---

## Ursache 3: Firewall blockiert Port 80/443

### A) Firewall im IONOS DCD (Network Security Group)

- Im **Data Center Designer** [dcd.ionos.com](https://dcd.ionos.com): **Security** → **Network Security Groups** (oder beim vCPU Server → Netzwerk/Security).
- Prüfen: Es müssen **eingehende Regeln (Inbound)** für **Port 80** (TCP) und **Port 443** (TCP) existieren (Quelle z. B. 0.0.0.0/0).
- Fehlen die Regeln: Anlegen, speichern, 1–2 Minuten warten und erneut testen.

### B) Firewall auf dem Server (UFW)

Per SSH auf dem Server:

```bash
ufw status
```

- **Status: active** und Port 80/443 **nicht** in der Liste → Ports freigeben:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw reload
```

- **Status: inactive** → UFW blockiert nicht; Problem liegt woanders (z. B. DCD-Firewall oder Apache).

---

## Ursache 4: DNS zeigt noch auf falsche IP

- **nslookup ki-prozessnavigator.de** (siehe oben): Wenn die angezeigte IP **nicht** die Ihres vCPU Servers ist, zeigt die Domain noch auf das alte Hosting.
- **Lösung:** Im IONOS Kundenbereich [my.ionos.com](https://my.ionos.com) → **Domain & SSL** → **ki-prozessnavigator.de** → **DNS** → **A-Record** für **@** und **www** auf die **Primäre IPv4** Ihres vCPU Servers setzen (z. B. 213.165.76.107) → Speichern.
- DNS-Änderung kann 5–30 Minuten dauern; danach erneut testen.

---

## Checkliste (der Reihe nach prüfen)

| Schritt | Aktion | Ergebnis |
|--------|--------|----------|
| 1 | Im Browser **http://213.165.76.107** aufrufen (IP durch Ihre ersetzen). | Lädt die Website? → DNS/HTTPS prüfen. Lädt nicht? → Server/Firewall prüfen. |
| 2 | **nslookup ki-prozessnavigator.de** – zeigt die Ausgabe Ihre Server-IP? | Ja → DNS ok. Nein → A-Record bei IONOS anpassen. |
| 3 | **https** vs. **http:** Haben Sie schon SSL (Certbot) eingerichtet? | Nein → vorerst **http://** nutzen oder SSL einrichten. |
| 4 | Auf dem Server: **systemctl status apache2** | active (running)? Sonst: start/enable. |
| 5 | Auf dem Server: **ss -tlnp \| grep -E ':80\|:443'** | Zeilen mit :80 (und :443 nach SSL)? Sonst: Apache starten/konfigurieren. |
| 6 | Im DCD: **Security** → **Network Security Groups** – Port 80 und 443 **Inbound** erlaubt? | Sonst: Regeln anlegen. |
| 7 | Auf dem Server: **ufw status** – Port 80/443 erlaubt? | Sonst: ufw allow 80/tcp, 443/tcp, reload. |

---

## Kurz: Typische Reihenfolge bei „Verbindung abgelehnt“

1. **http://IHRE_SERVER_IP** im Browser testen (z. B. http://213.165.76.107).
2. Wenn das **nicht** geht: Auf dem Server **Apache starten** (`systemctl start apache2 && systemctl enable apache2`) und **Firewall** (DCD + ggf. UFW) für 80/443 prüfen.
3. Wenn **http://IP** geht, aber **ki-prozessnavigator.de** nicht: **DNS** prüfen (nslookup, A-Record auf Ihre Server-IP).
4. Wenn **http://ki-prozessnavigator.de** geht, **https://** aber nicht: **SSL** noch nicht eingerichtet → vorerst **http://** nutzen oder Certbot ausführen (siehe NÄCHSTE-SCHRITTE-DOMAIN-SSL-PHP.md).
