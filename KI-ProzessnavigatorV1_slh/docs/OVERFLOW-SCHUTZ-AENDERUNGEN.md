# Änderungsliste: Globaler Overflow-Schutz

**Datei:** `css/main.css`  
**Eingefügt:** Block „Globaler Overflow-Schutz“ am **Anfang** der Datei (vor dem CSS Reset).  
**Keine bestehenden Regeln gelöscht oder überschrieben** – nur ergänzt.

---

## Hinzugefügte Zeilen (zur Kontrolle)

| Zeilen | Inhalt |
|--------|--------|
| **1–3** | Kommentar: `/* Globaler Overflow-Schutz */` |
| **4–6** | `* { box-sizing: border-box; }` |
| **8–11** | `html { overflow-x: hidden; max-width: 100vw; }` |
| **13–18** | `body { overflow-x: hidden; max-width: 100vw; margin: 0; padding: 0; }` |
| **20–29** | Kommentar + `section, .container, .wrapper, main, header, footer { max-width: 100vw; overflow-x: hidden; }` |
| **31–36** | Kommentar + `p, h1, h2, h3, h4, h5, h6, span, div, a { word-wrap: break-word; overflow-wrap: break-word; hyphens: auto; }` |
| **38–39** | Leerzeile + Beginn CSS Reset (unverändert) |

**Gesamt:** 48 neue Zeilen (Zeilen 1–48), danach unveränderter CSS Reset ab Zeile 39/40.

---

## Prüfung: Bereits vorhandene Regeln (nicht überschrieben)

| Regel | Befund |
|-------|--------|
| `* { box-sizing: border-box }` | War bereits in `*, *::before, *::after` (jetzt Zeile 43). Neu: zusätzlicher Selektor `*` am Anfang – ergänzt, überschreibt nicht. |
| `html` | Zusätzliche Eigenschaften `overflow-x: hidden`, `max-width: 100vw`. Bestehende `html`-Regel (scroll-behavior, text-size-adjust) bleibt ab Zeile 48 unverändert. |
| `body` | Zusätzliche Eigenschaften overflow/max-width/margin/padding. Bestehende `body`-Regel (min-height, line-height, font-smoothing) bleibt ab Zeile 55 unverändert. |
| `.container` | Bekommt `max-width: 100vw` und `overflow-x: hidden`. Spätere Regel `.container { max-width: min(var(--container-max), 100vw); ... }` (weiter unten) bleibt; `.solutions > .container { overflow: visible }` überschreibt overflow dort wie gewünscht. |
| `p, h1…h6` | Bereits `overflow-wrap: break-word` (weiter unten). Neu: zusätzlich `word-wrap`, `hyphens`, und Erweiterung um `span, div, a` – nur ergänzt. |

---

## Übersicht

- **Geändert:** keine bestehenden Zeilen geändert.
- **Eingefügt:** 1 Block (Zeilen 1–48) am Anfang von `css/main.css`.
- **Gelöscht:** nichts.
