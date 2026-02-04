# SSL (HTTPS) auf dem Server einrichten – Schritt für Schritt

Diese Anleitung übernimmt die Einrichtung von HTTPS mit **Certbot** (Let’s Encrypt) auf Ihrem vCPU-Server. Sie führen die Befehle nacheinander aus.

**Voraussetzung:** Die Domain **ki-prozessnavigator.de** zeigt per DNS bereits auf Ihre Server-IP (213.165.76.107), und **Apache** läuft. **http://ki-prozessnavigator.de** sollte im Browser erreichbar sein.

---

## Übersicht

1. Per SSH auf den Server einloggen.
2. Certbot installieren.
3. Certbot ausführen (Zertifikat anfordern, Apache wird automatisch konfiguriert).
4. Prüfen: **https://ki-prozessnavigator.de** im Browser aufrufen.

---

## Schritt 1: Per SSH einloggen

**Auf Ihrem PC** (PowerShell oder Terminal):

```bash
ssh root@213.165.76.107
```

(Ersetzen Sie die IP durch Ihre vCPU-Server-IP, falls anders.) Passwort eingeben. Sie sind eingeloggt, wenn Sie z. B. `root@...:~#` sehen.

---

## Schritt 2: Certbot installieren

**Auf dem Server** (in der SSH-Session) diesen Befehl ausführen (kopieren, einfügen, Enter):

```bash
apt update && apt install -y certbot python3-certbot-apache
```

Warten, bis die Installation fertig ist (keine weiteren Eingaben nötig).

---

## Schritt 3: Zertifikat anfordern und Apache einrichten

Certbot richtet das Zertifikat ein und konfiguriert Apache für HTTPS (inkl. Weiterleitung von HTTP → HTTPS).

### Variante A: Alles in einem Befehl (ohne Rückfragen)

Ersetzen Sie **IHRE@EMAIL.DE** durch Ihre echte E-Mail-Adresse (für Ablauf-Benachrichtigungen von Let’s Encrypt). Dann den gesamten Befehl kopieren und auf dem Server einfügen:

```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --non-interactive --agree-tos -m IHRE@EMAIL.DE
```

Fertig – Certbot hat das Zertifikat angefordert und Apache angepasst.

### Variante B: Mit Rückfragen (wenn Sie die Meldungen sehen möchten)

Nur diesen Befehl ausführen:

```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de
```

Certbot fragt dann:

| Frage | Was eingeben |
|-------|----------------|
| **E-Mail-Adresse** | Ihre E-Mail (für Ablauf-Hinweise) → Enter |
| **AGB von Let's Encrypt (Terms of Service)** | **Y** (Yes) → Enter |
| **E-Mail von EFF** (Newsletter) | **N** (No) oder **Y** – beliebig → Enter |
| **HTTP → HTTPS Weiterleitung?** | **2** (Redirect) wählen, damit alle Besucher automatisch auf HTTPS umgeleitet werden → Enter |

Danach zeigt Certbot eine Erfolgsmeldung und Apache ist für HTTPS eingerichtet.

---

## Schritt 4: Prüfen

1. **Im Browser:** **https://ki-prozessnavigator.de** und **https://www.ki-prozessnavigator.de** aufrufen.
2. **Schloss-Symbol** in der Adresszeile sollte erscheinen (verbindung sicher).
3. **http://ki-prozessnavigator.de** sollte automatisch auf **https://** umgeleitet werden (wenn Sie bei der Frage „Redirect“ gewählt haben).

---

## Automatische Verlängerung

Certbot legt einen **Timer** an, der das Zertifikat vor Ablauf erneuert. Prüfen (optional):

```bash
systemctl status certbot.timer
```

Sollte **active (waiting)** anzeigen. Manuell testen:

```bash
certbot renew --dry-run
```

Wenn hier keine Fehler erscheinen, funktioniert die automatische Verlängerung.

---

## Kurz: Alles zum Kopieren (einmal nacheinander ausführen)

**1. SSH einloggen (auf Ihrem PC):**
```bash
ssh root@213.165.76.107
```

**2. Certbot installieren (auf dem Server):**
```bash
apt update && apt install -y certbot python3-certbot-apache
```

**3. Zertifikat einrichten – E-Mail ersetzen (auf dem Server):**
```bash
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de --non-interactive --agree-tos -m IHRE@EMAIL.DE
```

**4. Im Browser testen:** https://ki-prozessnavigator.de

---

## Wenn etwas schiefgeht

- **„Connection refused“ oder Timeout:** Firewall prüfen – Port **443** (HTTPS) muss **eingehend** offen sein (im DCD: Network Security Group; auf dem Server: `ufw allow 443/tcp && ufw reload`).
- **„Domain not found“ / Validierung schlägt fehl:** DNS prüfen – `nslookup ki-prozessnavigator.de` muss Ihre Server-IP (213.165.76.107) zeigen. Einige Minuten warten und erneut versuchen.
- **Apache-Fehler nach Certbot:** Apache neu starten: `systemctl restart apache2`.

Diese Anleitung übernimmt die SSL-Einrichtung; Sie führen nur die Befehle aus und ersetzen die E-Mail-Adresse.
