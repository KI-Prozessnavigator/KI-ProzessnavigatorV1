# Claude Pro in Cursor – Terminal einbinden

So bindest du dein **Claude Pro** (claude.ai) in Cursor ein und arbeitest mit Claude direkt im integrierten Terminal an deinen Projekten.

---

## Übersicht

Du nutzt dafür **Claude Code** von Anthropic: eine CLI, die im Terminal läuft und sich optional mit Cursor verbindet. Mit einem **Claude Pro**- oder **Claude Max**-Abo meldest du dich mit deinem Claude.ai-Konto an – kein separater API-Key nötig.

---

## Schritt 1: Claude Code installieren (Windows)

Im **PowerShell**-Terminal (z. B. in Cursor: **Terminal → Neues Terminal**):

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Alternative mit WinGet:**

```powershell
winget install Anthropic.ClaudeCode
```

Nach der Installation: **Cursor neu starten** oder ein neues Terminal öffnen, damit `claude` im PATH ist.

---

## Schritt 2: Mit Claude Pro anmelden

Im Terminal ausführen:

```powershell
claude
```

Beim ersten Start wirst du aufgefordert, dich anzumelden. Wähle die Option für **Claude Pro / Claude.ai** und melde dich mit demselben Konto an, mit dem du Claude Pro nutzt.

---

## Schritt 3: Claude im Cursor-Terminal nutzen

1. In Cursor **Terminal öffnen**: `` Ctrl+` `` oder **Terminal → Neues Terminal**.
2. In dein Projektverzeichnis wechseln, z. B.:
   ```powershell
   cd c:\Users\Domin\Downloads\KI-ProzessnavigatorV1
   ```
3. Claude starten:
   ```powershell
   claude
   ```

Ab dann kannst du im gleichen Terminal mit Claude chatten und z. B. sagen: „Analysiere das Projekt“ oder „Erstelle eine Funktion für …“. Claude hat Zugriff auf das aktuelle Verzeichnis und kann Dateien lesen und Änderungen vorschlagen.

**Nützliche Befehle:**

| Befehl | Bedeutung |
|--------|-----------|
| `claude` | Interaktive Session starten |
| `claude "Frage oder Aufgabe"` | Session mit initialem Prompt starten |
| `claude -p "Frage"` | Einmalige Abfrage, dann beenden |
| `claude -c` | Letzte Konversation fortsetzen |
| `claude doctor` | Installation prüfen |

---

## Schritt 4 (optional): Cursor-Erweiterung für Claude Code

Wenn Claude Code **bereits installiert** ist, kannst du die offizielle Erweiterung in Cursor einbinden. Dann werden z. B. Diffs und Dateikontext zwischen Terminal-Claude und Cursor geteilt.

**4a) VSIX-Datei finden**

Typischer Pfad unter Windows:

```
%USERPROFILE%\.claude\local\node_modules\@anthropic-ai\claude-code\vendor\claude-code.vsix
```

Falls du Claude Code per WinGet installiert hast, kann die VSIX woanders liegen; dann zuerst `claude` einmal ausführen und danach im Benutzerordner `.claude` danach suchen.

**4b) Erweiterung in Cursor installieren**

In **PowerShell** (oder Cursor-Terminal):

```powershell
cursor --install-extension "$env:USERPROFILE\.claude\local\node_modules\@anthropic-ai\claude-code\vendor\claude-code.vsix"
```

Falls `cursor` nicht im PATH ist: in Cursor **Einstellungen → „Shell Command: Install 'cursor' command in PATH“** ausführen, dann Befehl erneut ausführen.

**4c) Cursor vollständig neu starten**

Damit die Erweiterung aktiv wird.

**4d) Verbindung testen**

- Terminal in Cursor öffnen.
- `claude` ausführen.
- Claude Code sollte Cursor als IDE erkennen und sich verbinden (z. B. Diffs im Editor anzeigen).

---

## Kurz-Checkliste

- [ ] Claude Code installiert (`irm https://claude.ai/install.ps1 | iex` oder WinGet).
- [ ] Mit Claude Pro / Claude.ai angemeldet (`claude` → Login).
- [ ] Im Cursor-Terminal im Projektordner: `claude` starten und Aufgabe stellen.
- [ ] (Optional) VSIX in Cursor installiert und Cursor neu gestartet.

---

## Häufige Probleme

**„claude“ wird nicht erkannt**  
- Cursor **komplett beenden** (alle Fenster schließen) und neu starten – das integrierte Terminal übernimmt die PATH erst dann.  
- Oder Claude mit vollem Pfad starten (funktioniert sofort in jedem Terminal):
  ```powershell
  & "$env:USERPROFILE\.local\bin\claude.exe"
  ```
- PATH prüfen/hinzufügen: Systemsteuerung → System → Erweiterte Systemeinstellungen → Umgebungsvariablen → Benutzer-PATH → `C:\Users\Domin\.local\bin` eintragen.

**„No Available IDEs Detected“**  
- `claude` immer **im integrierten Cursor-Terminal** starten, nicht in einer externen PowerShell.  
- Nach VSIX-Installation Cursor komplett schließen und neu starten.

**WSL / Git Bash**  
- Unter Windows wird auch **WSL** oder **Git für Windows** (Git Bash) unterstützt.  
- Für Git Bash optional:  
  `$env:CLAUDE_CODE_GIT_BASH_PATH = "C:\Program Files\Git\bin\bash.exe"`

---

## Offizielle Links

- [Claude Code – Setup (Anthropic)](https://docs.anthropic.com/de/docs/claude-code/setup)
- [Claude Code – CLI-Referenz](https://docs.anthropic.com/de/docs/claude-code/cli-reference)
- [Claude Pro / Preise](https://claude.ai/pricing)

Wenn du diese Schritte durchgehst, ist Claude Pro über das Cursor-Terminal eingebunden und du kannst damit direkt in deinen Projekten arbeiten.
