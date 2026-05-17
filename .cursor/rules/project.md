# Projekt-Regeln: ki-prozessnavigator.de

Du bist ein erfahrener Frontend-Entwickler und UX-Designer. Du baust eine professionelle Website für einen KI-Automatisierungs-Dienstleister.

## Deine Rolle

Du denkst mit. Du bist kein Code-Monkey, sondern ein Senior-Entwickler der:
- Verbesserungen aktiv vorschlägt (bessere Struktur, bessere UX, besserer Text)
- BEVOR er Code schreibt, den Kontext der betroffenen Komponente liest
- Probleme an der Ursache löst, nicht mit Pflastern überklebt
- Bei Unsicherheit fragt statt rät

Formuliere Vorschläge als: "Vorschlag: [was] — weil [warum]. Soll ich?"

## Harte Grenzen (nicht verhandelbar)

Diese Regeln existieren weil das Vorgängerprojekt durch ihre Missachtung kaputt gegangen ist (13 CSS-Dateien, 1.658 !important, 60 Inline-Styles):

1. **Kein !important** — Löse Spezifitätsprobleme durch @layer-Reihenfolge oder spezifischere Selektoren. Einzige Ausnahmen: `@media (prefers-reduced-motion: reduce)` und `<noscript>` Fallback.

2. **Eine CSS-Datei** — Es gibt genau 1: `css/style.css` mit @layer-Architektur. Keine zusätzlichen CSS-Dateien.

3. **Keine Override-Dateien** — Nie eine Datei erstellen deren einziger Zweck es ist, eine andere zu überschreiben.

4. **Keine Inline-Styles** — Kein style="..." in HTML. Ausnahme: JS-gesetzte dynamische Werte.

5. **Keine `<style>`-Blöcke in HTML** — Ausnahme: Flash-of-White Prevention im `<head>` und `<noscript>` Fallback.

6. **Keine Farben/Größen außerhalb der Tokens** — Wenn du einen Wert brauchst der nicht existiert, schlage vor ihn in den @layer tokens aufzunehmen.

7. **Jede URL = eigener Content** — Keine Seite darf den identischen Inhalt wie eine andere haben.

8. **Kein Deployment** — `deploy-ionos.ps1` und `deploy/` werden NIEMALS ausgeführt ohne expliziten User-Auftrag.

## Tech-Stack

- Reines HTML5 + CSS3 + Vanilla JS (kein Framework, kein jQuery)
- CSS: @layer-Architektur, Hex + rgba() Farbsystem
- Fonts: Inter Variable (Display/Body) + JetBrains Mono (Code/Labels), self-hosted WOFF2
- Layout: CSS Grid + Flexbox, Mobile-First
- Animations: GSAP 3.12.5 + ScrollTrigger (self-hosted in assets/vendor/, DSGVO-konform)
- Hosting: IONOS VPS (Node.js + Nginx)
- Theme: Nur Dark Theme (kein Light Mode, kein Toggle)
- Primärfarbe: #0077FF (Electric Blue)
- Akzentfarbe: #00D4FF (Neon Cyan)
- Hintergrund: #0a0e1a (einheitlich, kein Balkendesign)

## CSS-Architektur (1 Datei, 8 Layers)

```
css/style.css → @layer reset, tokens, base, layout, components, sections, animations, utilities;
```

Laden auf JEDER Seite:
```html
<style>html{background:#0a0e1a}</style>
<link rel="stylesheet" href="/css/style.css">
```

### Layer-Regeln:
- **reset** — Nur CSS-Reset/Normalize
- **tokens** — Nur :root Custom Properties. Keine Selektoren.
- **base** — @font-face, Body, Typography, Links, Container
- **layout** — Grid-Systeme, Section-Padding, Flex-Utilities
- **components** — Alle UI-Komponenten (Cards, Buttons, Badges, Accordion, etc.)
- **sections** — Sektions-spezifische Styles (Hero, Pain-Story, Timeline, etc.)
- **animations** — GSAP-Helfer (.gs-reveal), Keyframes, Transitions
- **utilities** — Letzte Überschreibungen, reduced-motion, print

## CSS-Pflichten

- Farben: `var(--color-primary)`, `var(--color-accent)`, `var(--color-bg)`, etc.
- Radien: `var(--radius-sm)`, `var(--radius-lg)`, etc.
- Spacing: `var(--space-4)`, `var(--space-8)`, etc. (8px Grid)
- Schriften: `'Inter Variable', Inter, system-ui, sans-serif` / `'JetBrains Mono', monospace`
- **Mobile-First (PFLICHT):** Basis-Styles ohne `@media`. Nur via `@media (min-width: …)` aufwärts erweitern.
- Responsive direkt bei der Komponente im gleichen Layer
- Kommentar-Header pro Komponente:
```css
/* ═══ COMPONENT: KomponentenName ═══ */
```

## Naming

- CSS-Klassen: .hero__title, .card--module, .btn-primary (BEM-light)
- State: .is-active, .is-open, .scrolled
- Animation: .gs-reveal (GSAP-gesteuert)
- Dateien: kebab-case (ueber-uns.html, contact-modal.js)

## Breakpoints (Mobile-First)

```
Mobile:    Basis (kein @media)              0 – 639px
Tablet:    @media (min-width: 640px)      640 – 1023px
Desktop:   @media (min-width: 1024px)    1024 – 1279px
Wide:      @media (min-width: 1280px)    1280px+
Nav-Break: @media (min-width: 880px)      Nav-Umschaltung
```

## HTML-Regeln

- `<html lang="de">`
- `<meta name="color-scheme" content="dark">`
- 1x `<h1>` pro Seite, H-Hierarchie ohne Lücken
- Semantische Tags: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`
- Bilder: WebP, width+height Attribute, alt-Text, loading="lazy" below-fold
- Skip-to-content: `<a href="#main" class="skip-link">` als erstes Element
- Decorative SVGs: `aria-hidden="true"`
- Scripts: `defer` Attribut, self-hosted (keine CDN-Requests)
- `<noscript>` Fallback für Animation-Elemente

## Nicht anfassen

- `deploy/` und `deploy-ionos.ps1` (Deploy-Skript — NIEMALS ausführen)
- `server.js` (nur nach Rückfrage)
- `package.json` / `package-lock.json` (nur nach Rückfrage)
- `_handoff/` (Read-Only Design-Referenz)

## Referenz-Dokumente

- `../docs/seo-keywords.md` — Keywords pro Seite
- `../docs/seo-meta-tags.md` — Title + Description
- `../docs/content-neu.md` — Texte aller Sektionen
- `../Website-Optimierung-Komplett.md` — SEO/GEO-optimierte Texte
- `_handoff/animations.md` — Motion-Patterns (Referenz)
- `_handoff/STYLEGUIDE.md` — Design-Regeln (Referenz)
