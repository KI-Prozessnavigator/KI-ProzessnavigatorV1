# PHP-Validierung in Cursor/VS Code einrichten

Wenn die Meldung erscheint: *"Cannot validate since a PHP installation could not be found. Use the setting 'php.validate.executablePath' to configure the PHP executable."*

---

## Wo eintragen?

**Im Projekt (empfohlen):**  
Datei **`.vscode/settings.json`** in diesem Workspace.

**Global (für alle Projekte):**  
Cursor → **File** → **Preferences** → **Settings** (oder `Ctrl+,`) → Suchfeld: `php.validate.executablePath` → **Edit in settings.json**. Dort erscheint Ihre Benutzer-`settings.json`.

---

## Was eintragen?

Den **vollständigen Pfad** zu Ihrer **php.exe** auf Windows, z. B.:

```json
"php.validate.executablePath": "C:\\php\\php.exe"
```

Backslashes müssen doppelt geschrieben werden: `\\`.

### Typische Pfade (Windows)

| Installation | Beispiel-Pfad |
|-------------|----------------|
| PHP einzeln installiert | `C:\\php\\php.exe` |
| XAMPP | `C:\\xampp\\php\\php.exe` |
| Laragon | `C:\\laragon\\bin\\php\\php-8.2.0-Win32-vs16-x64\\php.exe` |
| WAMP | `C:\\wamp64\\bin\\php\\php8.2\\php.exe` |

Den genauen Ordner bei Ihnen ggf. im Explorer prüfen (z. B. unter `C:\xampp\php\` oder `C:\laragon\bin\php\`).

---

## Wenn Sie noch kein PHP auf dem PC haben

1. **PHP installieren** (eine der Optionen):
   - [windows.php.net](https://windows.php.net/download/) – ZIP entpacken, z. B. nach `C:\php`
   - Oder **XAMPP** / **Laragon** installieren (enthält PHP)
2. In **`.vscode/settings.json`** den Pfad zu `php.exe` eintragen (siehe oben).
3. Cursor neu starten oder die PHP-Datei erneut öffnen.

---

## Meldung ignorieren?

Die Website läuft auf dem **Server** (IONOS); PHP wird dort ausgeführt. Die Validierung im Editor ist **nur für Hinweise** (Syntax, Fehler beim Tippen).  
Sie können die Meldung also ignorieren und weiter an den Dateien arbeiten – das Kontaktformular auf dem Server funktioniert unabhängig davon.

Wenn Sie die Meldung loswerden möchten, reicht das Eintragen von `php.validate.executablePath` in `.vscode/settings.json` wie oben.
