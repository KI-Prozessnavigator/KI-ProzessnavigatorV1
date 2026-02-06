# Ursachenanalyse: Trennlinie und „Mehr lesen“ nicht auf gleicher Höhe (ohne Anpassung)

## Ausgangslage

In der Sektion **„Diese Probleme kennen Sie?“** (Problem-Cards mit Pop-up) sollen der Trennstrich und der Link „Mehr lesen“ in allen drei Karten auf **derselben horizontalen Höhe** wie in der ersten Karte liegen. Ohne gezielte CSS-Anpassungen gelingt das nicht.

---

## 1. Warum die Höhe ohne Anpassung unterschiedlich ist

### 1.1 Gleiche Struktur, unterschiedlicher Inhalt

Alle drei Karten haben **dieselbe HTML-Struktur**:

```
.problem-card
  ├── .problem-card__icon
  ├── .problem-card__title
  ├── .problem-card__text        (im Popup-Modus: display: none)
  ├── .problem-card__footnote
  ├── .problem-card__separator
  └── .problem-card__more-area   ("Mehr lesen")
```

Unterschiedlich ist nur der **Inhalt** von Titel und Fußnote:

| Karte | Titel | Fußnote (sichtbar) |
|-------|--------|---------------------|
| 1 | „Fachkräfte in Administrationsschleifen“ | „Messbarer Verlust: 8–12 Stunden …“ |
| 2 | „Datenschutzbedenken als Innovationsbremse“ | „Konsequenz: Wettbewerber …“ |
| 3 | „KI-Tools ohne Systemanbindung“ | „Ergebnis: Technologie-Investition …“ |

Länge und Zeilenumbruch von Titel und Fußnote sind also von Karte zu Karte verschieden.

### 1.2 Layout ohne Sonderregeln: rein inhaltsgetrieben

Ohne die speziellen Regeln für `.problems__grid--popup` gilt:

- **Karte:** `display: flex; flex-direction: column;` (main.css)
- **Titel / Fußnote:** keine `height`, keine `min-height` → Höhe ergibt sich nur aus Inhalt und Zeilenumbruch
- **Trennstrich:** z.B. `margin-top: 3rem` (fester Abstand nach oben)

Damit berechnet sich die **vertikale Position des Trennstrichs** so:

```
Position Trennstrich = 
  Höhe(Icon) 
  + Höhe(Titel)      ← variiert (Textlänge, Umbruch)
  + Höhe(Fußnote)    ← variiert (Textlänge, Umbruch)
  + margin-top (3rem)
```

- **Karte 1:** kürzerer Titel, eine Zeile Fußnote → wenig Höhe über dem Trennstrich → Trennstrich sitzt **höher** (näher am oberen Kartenrand).
- **Karten 2 & 3:** längerer Titel (mehr Zeilen) und/oder andere Fußnote → mehr Höhe über dem Trennstrich → Trennstrich sitzt **tiefer**.

Ohne weitere Vorgaben hat das Layout **keine gemeinsame Bezugslinie** für den Trennstrich; er hängt nur von der jeweiligen Inhaltshöhe ab.

---

## 2. Technische Ursachen im Detail

### 2.1 Keine feste Höhe für den Bereich „über“ dem Trennstrich

- Weder Titel noch Fußnote haben **feste oder Mindesthöhen**.
- Die Karte hat **keine feste Gesamthöhe** und wächst mit dem Inhalt.
- Es gibt **kein gemeinsames Raster** (z.B. feste Zeilenhöhen oder ein Grid mit festen Zeilen), das den Trennstrich auf eine einheitliche Höhe zwingt.

Folge: Jede Karte hat einen anderen „Stapel“ aus Icon + Titel + Fußnote; der Trennstrich folgt jeweils diesem Stapel und liegt dadurch auf unterschiedlichen Höhen.

### 2.2 Flexbox ohne Zwang zur Ausrichtung

- Die Karte ist ein Flex-Container mit `flex-direction: column`.
- Alle Kinder (Icon, Titel, Fußnote, Trennstrich, „Mehr lesen“) haben **kein** `align-self` oder vergleichbares, das sie auf eine gemeinsame horizontale Linie zwingt.
- Ohne **gleiche Kartenhöhe** (z.B. durch Grid) und ohne `margin-top: auto` am Trennstrich „klebt“ der Trennstrich direkt unter dem variablen Inhaltsblock → wieder unterschiedliche Höhen.

### 2.3 Grid gibt den Karten keine einheitliche Höhe (ohne Zusatz-CSS)

- `.problems__grid` ist ein CSS-Grid mit z.B. `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`.
- Standardmäßig haben die **Zeilen** eine Höhe, die sich aus dem **Inhalt** der Karten ergibt (implizit `grid-auto-rows: auto`).
- Die **Karten selbst** haben ohne `height: 100%` oder `align-items: stretch` **nicht** zwingend dieselbe Höhe wie die Zeile.

Selbst wenn die Zeile so hoch wie die höchste Karte wäre: Ohne dass die Karten diese Zeilenhöhe ausfüllen und der Trennstrich z.B. mit `margin-top: auto` nach unten gedrückt wird, bleiben die Trennstriche weiterhin auf unterschiedlichen Höhen, weil sie direkt unter dem unterschiedlich hohen Inhalt sitzen.

---

## 3. Warum „ohne Anpassung“ die gewünschte Höhe nicht erreicht werden kann

Kurz: **Weil die Position des Trennstrichs ausschließlich vom variablen Inhalt (Titel + Fußnote) abhängt und es keine Layout-Regel gibt, die sie an eine gemeinsame Linie koppelt.**

- **Inhalt:** unterschiedliche Textlängen und Zeilenumbrüche → unterschiedliche Höhen für Titel und Fußnote.
- **Layout:** reines Flex-Column mit variabler Kartenhöhe und festem `margin-top` am Trennstrich → keine gemeinsame Bezugslinie.
- **CSS:** weder feste/minimale Höhen für Titel/Fußnote noch ein Mechanismus (z.B. gleiche Kartenhöhe + `margin-top: auto`), der den Trennstrich auf dieselbe horizontale Höhe zwingt.

Ohne mindestens **eine** der folgenden Anpassungen kann die gewünschte einheitliche Höhe nicht erreicht werden:

1. **Feste oder Mindesthöhen** für Titel und/oder Fußnote, damit der Bereich über dem Trennstrich in allen Karten gleich hoch ist (Trennstrich liegt dann immer auf derselben Höhe).
2. **Gleiche Kartenhöhe** (z.B. Grid mit `align-items: stretch`, Karten mit `height: 100%`) plus **`margin-top: auto`** am Trennstrich, sodass Trennstrich und „Mehr lesen“ in allen Karten am unteren Kartenrand liegen (gleiche horizontale Höhe).
3. **Absolutpositionierung** des Trennstrichs (und ggf. „Mehr lesen“) innerhalb der Karte mit festem `top` – nur mit festem Kartenlayout sinnvoll und wartbar.

---

## 4. Fazit

- **Ursache:** Unterschiedlich lange Texte in Titel und Fußnote führen zu unterschiedlich hohen Inhaltsblöcken. Das Layout ist rein inhaltsgetrieben und hat keine Vorgabe für eine gemeinsame Höhe des Trennstrichs.
- **Ohne Anpassung** gibt es im aktuellen Aufbau **keine** CSS-Eigenschaft oder -Logik, die den Trennstrich (und „Mehr lesen“) auf dieselbe horizontale Höhe wie in der ersten Karte zwingt.
- **Mit Anpassung** (z.B. feste Mindesthöhen für Titel/Fußnote oder gleiche Kartenhöhe + `margin-top: auto`) ist die gewünschte einheitliche Höhe zuverlässig umsetzbar.

Stand: 2026-02-05
