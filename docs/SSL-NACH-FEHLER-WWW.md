# SSL: Was passiert ist und was Sie tun

## Was schon funktioniert

Im Terminal stand:

- **Successfully received certificate.** – Zertifikat wurde angefordert.
- **Successfully deployed certificate for ki-prozessnavigator.de** – HTTPS fuer die Hauptdomain ist eingerichtet.

**https://ki-prozessnavigator.de** sollte bereits mit Schloss-Symbol funktionieren. Bitte zuerst im Browser testen.

---

## Was der Fehler bedeutet

Der Hinweis **"vhost ambiguity for www.ki-prozessnavigator.de"** betrifft nur **www**. Apache kennt den Namen **www.ki-prozessnavigator.de** im SSL-VHost noch nicht. Das Zertifikat gilt trotzdem fuer **ki-prozessnavigator.de** und **www.ki-prozessnavigator.de**.

---

## Option 1: Nur Hauptdomain nutzen

Wenn Ihnen **https://ki-prozessnavigator.de** reicht, muessen Sie nichts mehr tun. SSL ist fertig.

---

## Option 2: Auch https://www.ki-prozessnavigator.de aktivieren

Einmal im Terminal (Cursor: Strg+oe) ausfuehren:

```powershell
.\scripts\ssl-fix-www.ps1
```

Wenn nach dem Passwort gefragt wird: Server-Passwort eingeben, Enter.

Das Skript setzt auf dem Server **ServerAlias www.ki-prozessnavigator.de** und laedt Apache neu. Danach sollte **https://www.ki-prozessnavigator.de** ebenfalls funktionieren.

---

## Kurz

1. **https://ki-prozessnavigator.de** im Browser oeffnen – sollte schon mit Schloss laufen.
2. Optional: **.\scripts\ssl-fix-www.ps1** ausfuehren, dann **https://www.ki-prozessnavigator.de** testen.

Die Meldung "Fehler (Exit-Code 1)" kam, weil Certbot bei **www** nicht weiterkonfigurieren konnte – die Hauptdomain ist aber bereits per HTTPS erreichbar.
