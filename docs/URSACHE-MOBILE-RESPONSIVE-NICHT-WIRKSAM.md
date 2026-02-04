# Ursache: Mobile Responsive-Anpassungen wirken nicht

## Kernproblem

**Die Startseite `index.html` lädt die Datei `css/responsive.css` nicht.**

Alle vorgenommenen Änderungen (Overflow-Schutz, Hero-Stats-Skalierung, Rechner-Skalierung, @media (max-width: 1023px)) liegen in **css/responsive.css**. Diese Datei wird auf der **Hauptseite** nie eingebunden – daher greifen die Anpassungen dort nicht.

---

## Beweis

### index.html (Startseite – Hero Stats & Ersparnis-Rechner)

Geladene Stylesheets (Zeilen 115–117):

- `css/main.css`
- `css/calculator-redesign.css`
- `css/contact-modal.css`

**→ `css/responsive.css` fehlt.**

### impressum.html / agb.html / datenschutz.html

Diese Seiten laden u. a.:

- reset.css, fonts.css, variables.css, main.css, styles.css, components.css, dark-mode.css, cookie-banner.css
- **css/responsive.css** (Zeile 31)

**→ Nur auf den Unterseiten wird responsive.css geladen.**

---

## Folge

- Auf **index.html** (Startseite) werden **keine** Regeln aus responsive.css angewendet.
- Hero-Stats, Ersparnis-Rechner, Overflow-Fixes und alle @media (max-width: 1023px)-Anpassungen existieren nur in responsive.css und sind auf der Startseite daher **nicht aktiv**.
- Die Anpassungen sind im Code korrekt, werden aber auf der Seite, die du testest, gar nicht geladen.

---

## Lösung

**`css/responsive.css` in `index.html` einbinden** – nach den anderen Stylesheets, damit die Responsive-Regeln die Basis-Styles überschreiben können.

Beispiel (nach contact-modal.css):

```html
<link rel="stylesheet" href="css/responsive.css">
```

Damit greifen alle Mobile/Tablet-Anpassungen auch auf der Startseite.
