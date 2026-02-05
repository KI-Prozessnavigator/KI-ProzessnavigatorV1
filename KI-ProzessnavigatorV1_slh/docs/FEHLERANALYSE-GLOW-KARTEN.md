# Fehlersuche: Glow beim Hover weiterhin abgeschnitten

## Ursache

Der Glow wird von **`overflow-x: hidden`** auf **`html`** und **`body`** abgeschnitten.

- **main.css Zeile 16–17:** `html { overflow-x: hidden; max-width: 100vw; }`
- **main.css Zeile 26–27:** `body { overflow-x: hidden; max-width: 100vw; }`
- **responsive.css Zeile 178–180** (max-width: 576px): `html, body { overflow-x: hidden; max-width: 100vw; }` wird auf Mobile erneut gesetzt.

Alles, was horizontal über den Viewport hinausgeht (auch Box-Shadow), wird dabei abgeschnitten. Der Glow (`--shadow-neon-blue`: 0 0 20px, 0 0 40px, 0 0 60px) reicht etwa **60px** neben der Karte.

Aktuell:
- Section: `padding-inline: clamp(1.5rem, 4vw, 2.5rem)` (min 24px)
- Container: auf Mobile in responsive.css `padding-inline: var(--space-4)` = 16px
- Grid: `padding-inline: clamp(2rem, 5vw, 4rem)` (min 32px)

Theoretisch: 24 + 16 + 32 = 72px bis zur ersten Karte, Glow 60px → 12px Abstand zum Viewportrand. Trotzdem kann der Glow abgeschnitten wirken, weil:
1. Die Glow-Ausdehnung in manchen Browsern etwas größer als 60px ist,
2. oder andere Breakpoints/Viewports weniger Padding haben,
3. oder `overflow-x: hidden` den sichtbaren Bereich streng auf 100vw begrenzt und der Schatten trotz Padding am Rand gekappt wird.

## Mögliche Anpassungen (nur mit Ihrer Freigabe)

**Option A – overflow-x nur für den Inhalt lockern (empfohlen)**  
- `overflow-x: hidden` bei `html`/`body` **nicht** entfernen (verhindert horizontale Scrollbalken).
- Stattdessen das seitliche Platzangebot für den Glow **deutlich** vergrößern, damit der Schatten nirgends den Viewportrand erreicht:
  - z. B. `.problems__grid` / `.solutions__grid`: **mindestens 4rem (64px)** seitliches Padding, z. B. `padding-inline: clamp(4rem, 6vw, 5rem);`
  - optional: Section `.problems` / `.solutions` ebenfalls etwas mehr Padding, z. B. `padding-inline: clamp(2rem, 5vw, 3rem);`
- Damit liegt die erste Karte weiter innen, und der Glow bleibt überall innerhalb des sichtbaren Bereichs.

**Option B – overflow-x an html/body entfernen**  
- `overflow-x: hidden` bei `html` und `body` (und ggf. in responsive.css) entfernen.
- Vorteil: Glow kann nirgends mehr abgeschnitten werden.
- Nachteil: Wenn irgendwo anderes Inhalt über die Breite hinausragt, entsteht ein horizontaler Scrollbalken.

---

**Bitte geben Sie Freigabe:**  
Soll ich **Option A** umsetzen (mehr Padding, overflow-x bleibt), **Option B** (overflow-x entfernen), oder eine andere Variante (z. B. nur an bestimmten Breakpoints)?  
Erst nach Ihrer Antwort nehme ich Änderungen vor.
