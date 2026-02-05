# Ursachenanalyse: „3 Plätze Verfügbar“ – warum „Verfügbar“ abgeschnitten wird

## Kurzfassung

**Das Problem:** Die vierte Spalte hat **dieselbe Breite** wie die anderen drei. Der Text **„PLÄTZE VERFÜGBAR“** in einer Zeile (ohne Umbruch) ist bei aktueller Schriftgröße und Laufweite **breiter** als diese Spalte. Dadurch ist es unmöglich, den Text mittig zu platzieren und gleichzeitig vollständig sichtbar zu halten – ohne Schriftgröße, Umbruch oder Spaltenbreite zu ändern.

---

## Wo liegt das Problem genau?

### 1. Feste Spaltenbreite (Hauptursache)

**Datei:** `css/main.css`  
**Zeile:** ca. 1395–1396

```css
.hero__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    ...
}
```

- **`repeat(4, 1fr)`** bedeutet: Alle vier Spalten haben **exakt dieselbe Breite** (je 1/4 der nutzbaren Breite).
- Die nutzbare Breite ist: Containerbreite minus **`padding: var(--space-6) var(--space-8)`** (links/rechts je 2rem).
- Jede Spalte hat zusätzlich **`padding: var(--space-2) var(--space-3)`** (links/rechts je 0.75rem).
- **Ergebnis:** Die vierte Spalte hat **genau so viel Platz** wie die erste, zweite und dritte – nicht mehr.

### 2. Der Text ist breiter als die Spalte

**Label-Styles:** `css/main.css`, ca. 1530–1546

```css
.hero__stats .stat__label {
    font-size: var(--text-xs);        /* 0.75rem–0.875rem */
    letter-spacing: var(--tracking-wide);  /* 0.02em */
    text-transform: uppercase;
    ...
}
```

- **„PLÄTZE VERFÜGBAR“** in Großbuchstaben mit `letter-spacing: 0.02em` hat eine **Mindestbreite** (intrinsische Breite), die sich aus Schriftart, Schriftgröße und Zeichenanzahl ergibt.
- Die anderen Labels: „ZEITERSPARNIS“ (12 Zeichen), „ROUTINEARBEIT“ (14), „DSGVO-VORFÄLLE“ (14).
- **„PLÄTZE VERFÜGBAR“** hat 16 Zeichen (inkl. Leerzeichen) und ist damit der **längste** Label-Text.
- **Ergebnis:** Bei gleicher Spaltenbreite wie bei den anderen ist der Text in der vierten Spalte **breiter als der zur Verfügung stehende Platz**.

### 3. Der Konflikt

| Anforderung | Konsequenz |
|-------------|------------|
| Text **mittig** in der Spalte | Inhalt wird mit `justify-content: center` zentriert. |
| Text **einzeilig** (kein Umbruch) | `white-space: nowrap` → Mindestbreite = volle Textbreite. |
| **Gleiche** Spaltenbreite (1fr) | Vierte Spalte = gleiche Breite wie 1–3. |
| **Keine** kleinere Schrift | Schriftgröße bleibt, Textbreite bleibt. |

- Wenn **Textbreite > Spaltenbreite**, passen „mittig“, „einzeilig“ und „alles sichtbar“ **nicht gleichzeitig** in eine Spalte.
- Entweder wird abgeschnitten (`overflow: hidden`) oder der Text ragt raus (`overflow: visible`).

---

## Wo genau blockiert es?

1. **Grid-Definition**  
   `grid-template-columns: repeat(4, 1fr)` – erzwingt **gleiche** Breite für alle vier Spalten. Die vierte Spalte kann nicht breiter werden, um „PLÄTZE VERFÜGBAR“ unterzubringen.

2. **Feste Label-Breite**  
   Der Text „PLÄTZE VERFÜGBAR“ hat bei  
   - `font-size: var(--text-xs)`  
   - `letter-spacing: var(--tracking-wide)`  
   - `text-transform: uppercase`  
   eine **größere Mindestbreite** als der Platz in einer 1fr-Spalte (nach Abzug von Padding).

3. **Kein Spielraum**  
   Ohne eine der folgenden Änderungen ist das Ziel „mittig + einzeilig + voll sichtbar“ in der aktuellen Spaltenbreite **nicht erreichbar**:
   - Spalte 4 etwas breiter machen (Grid anpassen),
   - oder Schriftgröße/Laufweite nur für dieses Label reduzieren,
   - oder Umbruch erlauben,
   - oder Text kürzen (z. B. „Plätze frei“ / „Verfügbar“).

---

## Fazit

**Blockade:** Die **Spaltenbreite** (1fr für alle vier) ist **kleiner** als die **Mindestbreite des Textes** „PLÄTZE VERFÜGBAR“ bei unveränderter Schrift und einzeiliger Darstellung.  
**Ort:** Kombination aus  
- `grid-template-columns: repeat(4, 1fr)` in `.hero__stats` und  
- der intrinsischen Breite von `.hero__stats .stat__label` mit dem Text „PLÄTZE VERFÜGBAR“.

Um „3“ und „Plätze Verfügbar“ mittig zu platzieren **ohne** dass „Verfügbar“ abgeschnitten oder ausgeblendet wird, muss **mindestens eine** der genannten Größen (Spaltenbreite, Schrift, Umbruch oder Textlänge) angepasst werden.
