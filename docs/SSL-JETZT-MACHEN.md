# SSL JETZT EINRICHTEN – NUR DIESE SCHRITTE

Sie machen **genau 4 Dinge**. Nichts anderes.

---

## SCHRITT 1: In Cursor das Terminal öffnen

Sie haben Cursor offen (dieses Programm, in dem Sie diese Datei lesen).

1. Drücken Sie auf der Tastatur: **Strg + ö** (Control + Backtick – die Taste links neben der 1, unter Esc).
2. **ODER:** Oben in der Menüleiste auf **„Terminal“** klicken → **„Neues Terminal“** auswählen.

Unten erscheint ein **schwarzes oder blaues Fenster** mit Text. Das ist das **Terminal**. Sie müssen **nirgendwo anders** hin – bleiben Sie in Cursor.

Am Ende der Zeile steht oft etwas wie:
`PS C:\Users\Domin\Downloads\KI-ProzessnavigatorV1>`
Das bedeutet: Sie sind **schon im richtigen Ordner**. Weiter zu Schritt 2.

Falls dort ein **anderer** Pfad steht (z.B. nur `PS C:\Users\Domin>`):
- Tippen Sie **genau** das hier ein (alles in eine Zeile):
  ```
  cd C:\Users\Domin\Downloads\KI-ProzessnavigatorV1
  ```
- Drücken Sie **Enter**.
- Jetzt steht am Ende der Zeile: `...\KI-ProzessnavigatorV1>`. Weiter zu Schritt 2.

---

## SCHRITT 2: Diesen Befehl eintippen

Im Terminal (das Fenster unten) tippen Sie **genau** das hier:

```
.\scripts\ssl-einrichten-remote.ps1
```

- Punkt, Backslash, scripts, Backslash, ssl-einrichten-remote, Punkt, ps1
- **Keine** Anführungszeichen.
- Dann **Enter** drücken.

Sie sehen danach z.B.:
`Verbinde mit root@213.165.76.107 – Sie werden nach dem Passwort gefragt.`

Und in der nächsten Zeile etwas wie:
`root@213.165.76.107's password:`

Weiter zu Schritt 3.

---

## SCHRITT 3: Ihr Server-Passwort eingeben

Die Zeile **root@213.165.76.107's password:** wartet auf Ihr Passwort.

1. **Tippen Sie Ihr Passwort** (das vom vCPU-Server, z.B. das, das Sie beim Anlegen vergeben haben).
2. **Wichtig:** Es erscheint **nichts** beim Tippen – kein Stern, kein Punkt. Das ist normal. Einfach tippen und **Enter** drücken.

Wenn das Passwort stimmt, läuft alles automatisch weiter (Installation, Zertifikat). Das dauert etwa 1–2 Minuten. Sie müssen **nichts mehr** tippen.

---

## SCHRITT 4: Fertig – im Browser testen

Wenn unten im Terminal steht:
`SSL eingerichtet. Im Browser testen: https://ki-prozessnavigator.de`

1. Öffnen Sie Ihren **Browser** (Chrome, Edge, Firefox).
2. Oben in die Adresszeile klicken.
3. Tippen Sie: **https://ki-prozessnavigator.de**
4. **Enter** drücken.

Die Seite sollte laden und **links in der Adresszeile ein Schloss** zeigen. Dann ist SSL an.

---

## ZUSAMMENFASSUNG – NUR DIESE 4 SCHRITTE

| # | Wo | Was genau tun |
|---|-----|----------------|
| 1 | **Cursor** | **Strg + ö** drücken → Terminal erscheint unten. Wenn Pfad nicht „...\KI-ProzessnavigatorV1“ ist: `cd C:\Users\Domin\Downloads\KI-ProzessnavigatorV1` eingeben, Enter. |
| 2 | **Terminal (unten)** | `.\scripts\ssl-einrichten-remote.ps1` eingeben, Enter. |
| 3 | **Terminal** | Wenn „password:“ erscheint: Server-Passwort eintippen (nichts sichtbar), Enter. |
| 4 | **Browser** | https://ki-prozessnavigator.de aufrufen, Schloss prüfen. |

**Projektordner:** Das ist der Ordner **KI-ProzessnavigatorV1** auf Ihrem PC. In Cursor sind Sie bereits **in** diesem Projekt – wenn Sie das Terminal in Cursor öffnen (Strg+ö), sind Sie automatisch in diesem Ordner. Sie müssen **nicht** im Explorer irgendwo hinklicken.

**Konsole:** Das **Terminal** in Cursor (unten, schwarzes/blaues Fenster). Kein anderes Programm nötig.

**Eingaben:** Nur Schritt 2 (der Befehl) und Schritt 3 (Passwort). Sonst nichts.
