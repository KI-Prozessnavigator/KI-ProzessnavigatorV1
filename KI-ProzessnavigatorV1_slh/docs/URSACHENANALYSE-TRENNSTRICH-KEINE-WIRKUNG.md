# Ursachenanalyse: Trennlinie / „Mehr lesen“ – Anpassungen haben keine sichtbare Wirkung

## Beobachtung

Die Ausrichtung von Trennstrich und „Mehr lesen“ an der Unterkante des Containers (inkl. `margin-top: auto`, `height: 100%`, 3 Spalten ab 900px) zeigt **keinen sichtbaren Unterschied**. Die Elemente bleiben inhaltabhängig auf unterschiedlichen Höhen.

---

## Ursache: Grid wird in späterer Media-Query überschrieben

### Ablauf

1. **Gewünschte Regel (main.css, ca. Zeile 1864)**  
   ```css
   @media (min-width: 900px) {
       .problems__grid--popup {
           grid-template-columns: repeat(3, 1fr);
       }
   }
   ```  
   → Ab 900px: 3 Spalten, eine Zeile, gleiche Kartenhöhe → Trennstrich kann mit `margin-top: auto` an die Unterkante.

2. **Überschreibende Regel (main.css, ca. Zeile 7625)**  
   ```css
   @media (max-width: 992px) {
       .problems__grid,
       .solutions__grid {
           grid-template-columns: 1fr;
           gap: var(--space-3);
       }
   }
   ```  
   → Bis 992px: **alle** `.problems__grid` (also auch `.problems__grid--popup`) bekommen `grid-template-columns: 1fr`.

3. **Ergebnis im Bereich 900px–992px**  
   - Beide Media-Queries greifen.  
   - Die spätere Regel (max-width: 992px) gewinnt.  
   - `.problems__grid--popup` hat effektiv **eine Spalte** → Karten stehen untereinander, jede Zeile hat nur eine Karte, Zeilenhöhe = Inhaltshöhe der jeweiligen Karte.  
   - `height: 100%` und `margin-top: auto` funktionieren zwar, aber pro **einzeln stehender** Karte → Trennstrich liegt am unteren Kartenrand, die „Unterkanten“ sind auf der Seite trotzdem auf **unterschiedlichen** vertikalen Positionen.  
   - Daher **kein sichtbarer Effekt** der Unterkanten-Ausrichtung.

### Warum „ändert sich nichts“

- Die Unterkanten-Ausrichtung setzt voraus: **drei Karten in einer Zeile** und **eine gemeinsame Zeilenhöhe**.  
- Genau das wird zwischen 900px und 992px durch die spätere Media-Query verhindert (1 Spalte).  
- Unter 900px war ohnehin 1 Spalte vorgesehen; über 992px könnte die 3-Spalten-Regel greifen – aber viele Nutzer testen im Bereich **900–992px** (Tablet/kleiner Desktop), wo die Überschreibung aktiv ist.

---

## Weitere mögliche Einflüsse

- **Reihenfolge der Stylesheets:** responsive.css lädt nach main.css; darin gibt es weitere `@media (max-width: …)` mit `.problems__grid` / `.solutions__grid`. Wenn dort ebenfalls `grid-template-columns: 1fr` gesetzt wird, gilt dasselbe: spätere Regel kann die 3-Spalten-Regel aus main.css aufheben.  
- **Spezifität:** `.problems__grid, .solutions__grid` und `.problems__grid--popup` sind gleich spezifisch (eine Klasse). Entscheidend ist die **Reihenfolge** im Gesamt-CSS (inkl. Media-Queries).  
- **Cache:** Alte CSS-Version kann den Eindruck erwecken, „es ändert sich nichts“ – Hard-Reload (Strg+F5) ist zum Testen nötig.

---

## Maßnahme (technisch)

Damit die Anpassungen sichtbar werden:

1. **3-Spalten-Regel für die Popup-Grid durchsetzen**  
   Im Bereich, in dem die Grid-Spalten überschrieben werden (z. B. 900px–992px), muss `.problems__grid--popup` ausdrücklich **3 Spalten** behalten und die 1-Spalten-Regel darf nicht auf die Popup-Grid angewendet werden (oder die 3-Spalten-Regel muss mit höherer Spezifität / später / `!important` gewinnen).

2. **Konkret**  
   - Entweder: In der `@media (max-width: 992px)`-Regel die Ausnahme ergänzen, z. B.  
     `.problems__grid:not(.problems__grid--popup), .solutions__grid { grid-template-columns: 1fr; }`  
     sodass nur die **Nicht-Popup**-Grids auf 1 Spalte gehen.  
   - Oder: Die 3-Spalten-Regel für `.problems__grid--popup` mit `!important` versehen und in einer Media-Query platzieren, die im gleichen Viewport-Bereich greift und **nach** der 1-Spalten-Regel steht (z. B. `@media (min-width: 900px) { .problems__grid--popup { grid-template-columns: repeat(3, 1fr) !important; } }`).

Nach der Korrektur haben die drei Karten zwischen 900px und 992px (und darüber) wieder eine gemeinsame Zeilenhöhe; Trennstrich und „Mehr lesen“ liegen dann sichtbar auf einer horizontalen Linie an der Unterkante.

Stand: 2026-02-05
