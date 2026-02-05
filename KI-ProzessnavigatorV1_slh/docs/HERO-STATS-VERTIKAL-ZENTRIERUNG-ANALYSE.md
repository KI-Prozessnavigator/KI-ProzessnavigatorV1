# Ursachenanalyse: Angaben nicht vertikal mittig zwischen den Trennlinien

## Ausgangslage
- `.stat` hat `display: flex; flex-direction: column; align-items: center; justify-content: center`.
- Trotzdem erscheinen Zahl + Label nicht vertikal mittig in der Spalte.

## Ursache 1: Kein „Restraum“ zum Zentrieren (Hauptursache)

**Mechanismus:**
- `.hero__stats` hat nur `min-height: 10rem`, keine feste `height`.
- Mit `display: flex` und `align-items: stretch` bestimmt die **Höhe des Inhalts** die Höhe der Spalten.
- Jede `.stat` ist so hoch wie ihr Inhalt:  
  `stat__number` (2.75rem) + `margin-top` (~0.75rem) + `stat__label` (2.75rem) ≈ **6,25rem**.
- Die Spalte ist also nur so hoch wie dieser Inhalt – es gibt **keinen zusätzlichen vertikalen Platz**.
- `justify-content: center` verteilt nur **freien Platz**; wenn der Container genau so hoch wie der Inhalt ist, passiert optisch nichts → Inhalt klebt oben.

**Kurz:** Zentrierung wirkt nur, wenn der Container **höher** ist als Zahl + Label. Aktuell ist die Spalte genau so hoch wie der Inhalt, daher kein sichtbarer Effekt.

## Ursache 2: Doppelte `.stat`-Regeln in Media Queries

In **main.css** (Media Query) gibt es zwei Blöcke für `.stat`:
1. Erster Block: `justify-content: flex-start` (Zeile ~7257)
2. Zweiter Block: `justify-content: center` (Zeile ~7278)

Der zweite Block überschreibt den ersten, daher gilt am Ende `center`. Das ist korrekt, aber die Reihenfolge ist verwirrend und fehleranfällig (z.B. wenn die zweite Regel später entfernt wird).

## Ursache 3: Grid in Media Query

In kleineren Viewports nutzt `.hero__stats` `display: grid`. Die Grid-Zellen (`.stat`) werden standardmäßig in der Zeile gestreckt. Die Zeilenhöhe ergibt sich wieder aus dem **Inhalt** – also erneut keine feste Spaltenhöhe, kein Restraum, `justify-content: center` hat keinen sichtbaren Effekt.

## Lösung (technisch)

Damit die Angaben **vertikal mittig** zwischen den Trennlinien liegen:

1. **Feste oder Mindesthöhe für die Spalten**  
   Entweder:
   - `.hero__stats` mit fester Höhe (z.B. `height: 10rem` oder `min-height: 10rem` beibehalten und zusätzlich z.B. `height: 10rem`), **oder**
   - `.stat` mit **Mindesthöhe** (z.B. `min-height: 8rem`), die größer ist als der Inhalt (~6,25rem).

2. Dann hat jede Spalte **mehr Höhe als Zahl + Label**. Der verbleibende Platz wird von `justify-content: center` genutzt → der Block aus Zahl + Label sitzt vertikal mittig.

3. **Media Queries aufräumen**: Ersten `.stat`-Block in der Media Query auf `justify-content: center` setzen (oder den Block zusammenführen), damit keine widersprüchlichen Werte mehr vorkommen.

## Zusammenfassung

| Punkt | Befund |
|--------|--------|
| Hauptgrund | Spaltenhöhe = Inhaltshöhe → kein Restraum → `justify-content: center` hat keinen sichtbaren Effekt. |
| Zusätzlich | Doppelte/gegensätzliche `.stat`-Regeln in MQ; Grid-Zeilenhöhe ebenfalls inhaltsgetrieben. |
| Fix | Feste oder Mindesthöhe für `.hero__stats` bzw. `.stat` einführen, sodass die Spalte höher ist als der Inhalt. |
