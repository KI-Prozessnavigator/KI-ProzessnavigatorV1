# Ursachenanalyse: Angaben nicht mittig zwischen den blauen Trennlinien

## Ziel
Die Angaben (10h+/ Woche, Zeitersparnis, –70 %, Routinearbeit, 0, DSGVO-Vorfälle, 3, Plätze Verfügbarkeit) sollen **mittig** in jeder Spalte zwischen den blauen Trennlinien stehen – horizontal und vertikal zentriert.

## Beobachtung
- Inhalt wirkt **nach rechts oben** verschoben statt mittig.
- Nutzerwunsch: „Angaben nach links schieben“ → Inhalt soll mittig liegen.

---

## Mögliche Ursachen

### 1. **`.stat__inner` wird breiter als der Inhalt**
- Wenn `.stat__inner` oder seine Kinder (`.stat__number`, `.stat__label`) irgendwo **`width: 100%`** haben, füllt der Block die ganze Spalte.
- Dann zentriert Flex nur einen **volleyballen** Block – der Text darin kann trotzdem links/rechts ausgerichtet wirken oder durch andere Regeln verschoben werden.
- **Prüfung:** In main.css ist für `.hero__stats .stat__number` und `.hero__stats .stat__label` bereits `width: auto` gesetzt. In **Media Queries** (main.css, responsive.css) stehen aber **`.stat__number`** und **`.stat__label` ohne `.hero__stats`** – dort wird **kein width** gesetzt, es könnte also von woanders `width: 100%` kommen oder das Standardverhalten den Block auf volle Breite ziehen.

### 2. **Asymmetrisches Padding**
- **Ungleiches Padding** (z. B. mehr links als rechts) verschiebt den Inhalt sichtbar.
- Aktuell: `.hero__stats .stat` hat `padding: var(--space-2) var(--space-3)` (gleich links/rechts). Die Sonderregel für die letzte Spalte (`padding-right: 0`) wurde entfernt.
- Wenn **andere Dateien** (z. B. components.css, dark-mode.css) **`.stat`** ohne `.hero__stats` überschreiben und z. B. `padding-right: var(--space-8)` setzen, gilt das für alle Stats und kann den Inhalt nach links drücken (mehr Platz rechts = Inhalt wirkt links). Umgekehrt: mehr Padding links schiebt den Inhalt nach rechts.

### 3. **Media Queries ohne `.hero__stats`**
- In **main.css** und **responsive.css** stehen in Media Queries Regeln für **`.stat`**, **`.stat__inner`**, **`.stat__number`**, **`.stat__label`** **ohne** das Präfix `.hero__stats`.
- Diese Regeln gelten für **jedes** Element mit diesen Klassen (nicht nur in der Hero-Stats-Box).
- **Spezifität:** `.hero__stats .stat` (2 Klassen) schlägt `.stat` (1 Klasse). Trotzdem: Wenn in der Media Query z. B. `padding` oder `align-items` für `.stat` gesetzt werden und unsere Basis-Regel davor steht, gewinnt die spätere Regel bei **gleicher** Spezifität – hier gewinnt aber weiterhin `.hero__stats .stat`, solange es nicht überschrieben wird.
- **Risiko:** In anderen Breakpoints oder bei anderer Ladereihenfolge könnten die unspezifischen `.stat`-Regeln unsere Zentrierung/Padding-Regeln überschreiben oder ergänzen und so die Mitte verschieben.

### 4. **`align-items` / `justify-content` werden überschrieben**
- Wenn irgendwo **`.stat { align-items: flex-end }`** oder **`justify-content: flex-end`** gesetzt wird, rückt der Inhalt nach rechts bzw. unten.
- In main.css ist für `.hero__stats .stat` **`align-items: center !important`** und **`justify-content: center !important`** gesetzt – das sollte andere Werte überschreiben, sofern keine andere `!important`-Regel greift.

### 5. **Komponenten-/Layout-CSS**
- **components.css** enthält `.stat { padding-right: var(--space-8); }` und `.stat:last-child { padding-right: 0; }`.
- **components.css** wird in **index.html nicht** per `<link>` geladen (nur main.css, calculator-redesign.css, contact-modal.css). Daher greifen diese Regeln nur, wenn main.css (oder eine andere geladene Datei) components.css per `@import` einbindet – derzeit nicht.  
- Sollte components.css später doch geladen werden, würde **asymmetrisches Padding** (z. B. nur `padding-right`) den Inhalt aus der Mitte schieben.

---

## Warum „einfach nach links schieben“ nicht greift

- **Nur „nach links schieben“** (z. B. mit `margin-right: auto` oder `transform: translateX(-…))` behebt nicht die Ursache:
  - Wenn der **Block** (`.stat__inner`) zu breit ist, sitzt er zwar weiter links, aber nicht **mittig** in der Spalte.
  - Wenn **Padding** asymmetrisch ist, verschiebt man nur das Symptom; bei anderen Viewports oder Änderungen kommt die Verschiebung zurück.
- Ziel ist: **Ein schmaler Block (nur so breit wie Zahl + Label)** wird in der Spalte **horizontal und vertikal zentriert**. Dafür müssen Blockbreite und Abstände (Padding/Margin) konsistent sein.

---

## Konkrete Maßnahmen (Fix)

1. **Blockbreite und Zentrierung erzwingen**
   - `.hero__stats .stat__inner`:
     - **`width: max-content;`** → Block ist nur so breit wie der Inhalt (Zahl + Label).
     - **`margin: 0 auto;`** → Block wird in der Spalte horizontal zentriert (funktioniert, weil der Vater `.stat` Flex-Container ist und der Block schmaler als die Spalte ist).
   - So ist die horizontale Mitte unabhängig von eventuell vererbten oder später geladenen `width`-Werten.

2. **Media Queries anpassen**
   - In **main.css** und **responsive.css** alle Regeln für Stats in der Hero-Section mit **`.hero__stats`** versehen (z. B. `.hero__stats .stat`, `.hero__stats .stat__number` usw.), damit nur die Hero-Stats betroffen sind und keine anderen `.stat`-Blöcke.

3. **Padding einheitlich halten**
   - Kein Sonder-Padding für die letzte Spalte; überall **`padding: var(--space-2) var(--space-3);`** für `.hero__stats .stat` (bereits umgesetzt).

4. **Optional: leichte Korrektur nach links**
   - Wenn nach dem obigen Fix der Inhalt im Browser **immer noch** leicht rechts wirkt (z. B. durch Schrift/Subpixel), kann man **nur für die Anzeige** nachjustieren:
   - z. B. `.hero__stats .stat__inner { transform: translateX(-2px); }` oder eine kleine negative `margin-left` – nur als letzter Feinschliff, nicht als Hauptlösung.

---

## Kurzfassung

| Vermutung | Status |
|-----------|--------|
| `.stat__inner` oder Kinder zu breit (z. B. width: 100%) | Mit `width: auto` an Zahl/Label adressiert; mit `width: max-content` am Inner-Block abgesichert. |
| Asymmetrisches Padding (z. B. nur rechts) | Padding vereinheitlicht; Sonderregel letzte Spalte entfernt. |
| Media Queries ohne `.hero__stats` überschreiben Zentrierung | Sollte mit spezifischeren Selektoren in MQ abgesichert werden. |
| „Einfach nach links schieben“ reicht nicht | Zentrierung über schmalen Block + `margin: 0 auto` ist die stabile Lösung. |

**Hauptmaßnahme:** `.hero__stats .stat__inner` mit **`width: max-content`** und **`margin: 0 auto`** setzen, damit der Inhalt zuverlässig mittig zwischen den blauen Trennlinien steht; bei Bedarf in den Media Queries dieselbe Logik mit `.hero__stats`-Präfix verwenden.

---

## Konkreter Fix (nach Nutzerwunsch)

- **15px nach links:** `.hero__stats .stat__inner { transform: translateX(-15px); }` – verschiebt alle Angaben (10h+/ Woche, Zeitersparnis, –70 %, Routinearbeit, 0, DSGVO-Vorfälle, 3, Plätze Verfügbarkeit) um 15px nach links.
- **Vertikal mittig erzwingen:**  
  - `.hero__stats { height: 11rem !important; min-height: 11rem !important; }`  
  - `.hero__stats .stat { min-height: 9rem !important; justify-content: center !important; align-self: stretch !important; }`  
  Damit hat die Spalte feste Höhe und der Inhalt wird vertikal zentriert; andere Stylesheets können das nicht mehr überschreiben.
