# config.php auf dem Server – genau das eintragen

Auf dem **Server** fehlen in `config.php` vermutlich die Zeilen für **SMTP_PASSWORD** und **CSRF_SECRET**. So fügen Sie sie ein und füllen sie aus.

---

## Schritt 1: Datei auf dem Server öffnen

Im Terminal (SSH):  
`nano /var/www/html/php/config.php`

---

## Schritt 2: An die richtige Stelle gehen

- Mit den **Pfeiltasten** nach unten fahren, bis Sie diese Zeile sehen:
  ```php
  define('SMTP_USERNAME', 'd.buchele@ki-prozessnavigator.de');
  ```
- Setzen Sie den Cursor **ans Ende dieser Zeile** (hinter das `);`).
- Drücken Sie **Enter**, damit eine **neue leere Zeile** darunter entsteht.

---

## Schritt 3: Diese Zeilen EINMAL einfügen (kopieren & einfügen)

In die neue Zeile (direkt unter `SMTP_USERNAME`) fügen Sie **genau diesen Block** ein:

```php
// SMTP_PASSWORD: Google App-Passwort oder IONOS-SMTP-Passwort eintragen
define('SMTP_PASSWORD', 'HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN');
```

Also: Zuerst die Kommentarzeile, in der nächsten Zeile die `define('SMTP_PASSWORD', ...);`.

---

## Schritt 4: Ihr echtes Passwort eintragen

- Ersetzen Sie **nur den Text zwischen den Anführungszeichen**:
  - **Vorher:** `'HIER_IHR_GOOGLE_APP_PASSWORT_EINTRAGEN'`
  - **Nachher:** Ihr 16-stelliges **Google-App-Passwort** (ohne Leerzeichen)  
    Oder, wenn Sie IONOS-Mail nutzen: Ihr **IONOS-SMTP-Passwort**.

Beispiel (mit Platzhalter – ersetzen Sie durch Ihr Passwort):  
`define('SMTP_PASSWORD', 'abcd efgh ijkl mnop');`  
→ Eintragen: `define('SMTP_PASSWORD', 'IhrEchtesAppPasswort16Zeichen');`

---

## Schritt 5: CSRF_SECRET – prüfen und ggf. ergänzen

- Mit den **Pfeiltasten** weiter nach unten scrollen.
- Suchen Sie eine Zeile mit **CSRF_SECRET** oder **random_bytes**.

**Falls Sie eine Zeile sehen wie:**  
`define('CSRF_SECRET', ... random_bytes(16) ...);`  
→ Diese Zeile **komplett ersetzen** durch (einen eigenen langen Text können Sie statt dem Beispiel verwenden):  
`define('CSRF_SECRET', 'IhrFesterGeheimerStringMindestens32ZeichenLang123');`

**Falls es keine CSRF_SECRET-Zeile gibt:**  
- Gehen Sie ans Ende der Datei (vor `?>`) und fügen Sie vor `?>` diese Zeilen ein:
```php
// CSRF-Schutz (fester Wert, nicht ändern)
define('CSRF_SECRET', 'IhrFesterGeheimerStringMindestens32ZeichenLang123');
```

---

## Schritt 6: Speichern und schließen

- **Strg+O** (Speichern), dann **Enter**.
- **Strg+X** (Editor verlassen).

---

## Kurz-Checkliste

| Wo | Was |
|----|-----|
| **Unter der Zeile** `define('SMTP_USERNAME', ...);` | Die zwei Zeilen für **SMTP_PASSWORD** einfügen (siehe Schritt 3). |
| **In der Zeile** `define('SMTP_PASSWORD', '...');` | Zwischen den Anführungszeichen **Ihr Google-App-Passwort** (oder IONOS-SMTP-Passwort) eintragen. |
| **Zeile mit** `random_bytes(16)` | Durch **eine** Zeile ersetzen: `define('CSRF_SECRET', 'IhrFesterGeheimerString...');` |

Wenn Sie diese drei Dinge erledigt haben, ist die config.php auf dem Server korrekt eingetragen.
