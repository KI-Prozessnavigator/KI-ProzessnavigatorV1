# SSL einrichten – ganz einfach (Schritt für Schritt)

Sie müssen **nichts kopieren** und **kein Zertifikat** irgendwo einfügen. Ein Programm auf dem Server (Certbot) holt das Zertifikat automatisch und richtet alles ein. Sie führen nur **einen Befehl** auf Ihrem PC aus und geben **einmal** Ihr Server-Passwort ein.

---

## Was Sie brauchen

- Ihren **Projektordner** (der Ordner, in dem z. B. `deploy-ionos.ps1` und der Ordner `scripts` liegen).
- Ihr **Server-Passwort** (das Sie beim Anlegen des vCPU-Servers vergeben haben).

**Kein Zertifikat zum Kopieren** – das erledigt der Server selbst.

---

## Schritt 1: PowerShell in diesem Ordner öffnen

1. Öffnen Sie den **Windows-Explorer** (Ordner-Symbol in der Taskleiste).
2. Gehen Sie in den **Projektordner** (z. B. `C:\Users\Domin\Downloads\KI-ProzessnavigatorV1`).
   - Darin müssen die Ordner `scripts` und `docs` liegen sowie die Datei `deploy-ionos.ps1`.
3. Klicken Sie **in die Adresszeile** oben (wo der Pfad steht).
4. Tippen Sie dort: **`powershell`** und drücken Sie **Enter**.

Es öffnet sich ein **blaues Fenster** (PowerShell) – und Sie sind **bereits in diesem Ordner**. Das ist wichtig.

**Alternative:** In Cursor unten auf **„Terminal“** klicken; wenn dort „PowerShell“ steht, sind Sie im richtigen Ordner. Sonst mit `cd` in den Projektordner wechseln, z. B.:
```powershell
cd C:\Users\Domin\Downloads\KI-ProzessnavigatorV1
```

---

## Schritt 2: Diesen einen Befehl ausführen

Im **PowerShell-Fenster** (das blaue Fenster):

1. Tippen Sie **genau** das hier (oder kopieren Sie es):
   ```powershell
   .\scripts\ssl-einrichten-remote.ps1
   ```
2. Drücken Sie **Enter**.

Es erscheint eine Zeile wie:  
`Verbinde mit root@213.165.76.107 – Sie werden nach dem Passwort gefragt.`

---

## Schritt 3: Passwort eingeben (einmal)

Die nächste Zeile lautet in der Regel:

`root@213.165.76.107's password:`

1. **Tippen Sie Ihr Server-Passwort** (z. B. das, das Sie beim Anlegen des Servers vergeben haben).
2. **Wichtig:** Beim Tippen erscheint **nichts** (keine Sternchen, kein Cursor) – das ist bei SSH so. Einfach Passwort eintippen und **Enter** drücken.

Danach passiert alles **automatisch** auf dem Server (Installation von Certbot, Anfordern des Zertifikats, Einrichten von HTTPS). Das kann **1–2 Minuten** dauern. Sie müssen nichts mehr eingeben.

---

## Schritt 4: Fertig – testen

Am Ende erscheint etwas wie:

`SSL eingerichtet. Im Browser testen: https://ki-prozessnavigator.de`

1. Öffnen Sie Ihren **Browser** (Chrome, Edge, Firefox, …).
2. Geben Sie in die Adresszeile ein: **https://ki-prozessnavigator.de**
3. Drücken Sie **Enter**.

Die Seite sollte laden und **links in der Adresszeile ein Schloss-Symbol** zeigen („Verbindung sicher“). Dann ist SSL aktiv.

---

## Kurz zusammengefasst

| Schritt | Wo | Was tun |
|--------|-----|--------|
| 1 | Explorer | In den Projektordner gehen, in die Adresszeile `powershell` tippen, Enter. |
| 2 | PowerShell (blaues Fenster) | `.\scripts\ssl-einrichten-remote.ps1` eintippen oder einfügen, Enter. |
| 3 | PowerShell | Wenn nach Passwort gefragt wird: Server-Passwort eintippen (nichts sichtbar), Enter. |
| 4 | Browser | https://ki-prozessnavigator.de aufrufen und Schloss prüfen. |

**Terminal / CMD / PowerShell:** Sie brauchen **PowerShell** (nicht CMD). Wenn Sie in Cursor „Terminal“ öffnen und dort „PowerShell“ steht, können Sie Schritt 2 dort ausführen – Sie müssen nur im richtigen Ordner sein (Projektordner mit `scripts` und `deploy-ionos.ps1`).

**Zertifikat:** Es gibt nichts zum Reinkopieren. Der Server holt das Zertifikat selbst (über Certbot/Let’s Encrypt) und richtet alles ein. Sie führen nur das Skript auf Ihrem PC aus.

---

## Wenn etwas nicht klappt

- **„Der Befehl wurde nicht gefunden“ / Skript läuft nicht:** Sie sind nicht im Projektordner. In der PowerShell zuerst `cd C:\Users\Domin\Downloads\KI-ProzessnavigatorV1` (Pfad ggf. anpassen) und dann erneut `.\scripts\ssl-einrichten-remote.ps1`.
- **„Zugriff verweigert“ / Skript darf nicht ausgeführt werden:** In der PowerShell einmal ausführen: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` und mit **J** bestätigen. Danach Skript erneut starten.
- **Passwort wird nicht akzeptiert:** Prüfen Sie das Passwort (Groß-/Kleinschreibung). Wenn Sie es geändert haben, das neue verwenden.
- **Verbindung bricht ab / Timeout:** Firewall prüfen (Port 22 für SSH vom PC zum Server offen). Prüfen, ob der Server läuft (im IONOS DCD nachsehen).

Wenn Sie diese Schritte genau so durchgehen, ist SSL eingerichtet – ohne etwas manuell zu kopieren oder ein Zertifikat irgendwo einzufügen.
