# Design-System Handoff — KI-Prozessnavigator

Dieses Verzeichnis enthält das vollständige Design-System für die Übernahme in dein Cursor-Projekt.

---

## 📁 Inhalt

| Datei | Zweck |
|---|---|
| **`styles.css`** | Source of Truth. Alle Tokens, Komponenten, Responsive-Regeln. ~1240 Zeilen, mit Inhaltsverzeichnis oben. |
| **`tokens.md`** | Referenz aller CSS-Variablen (Farben, Type, Radien, Spacing). |
| **`STYLEGUIDE.md`** | **Pflichtlektüre für Cursor.** 5 Kernregeln + Workflow-Patterns. |
| **`animations.md`** | Alle Motion- & Container-Patterns (Hover, Reveal, Marquee, Spotlight, Tabs, …). |
| **`svg-visuals.md`** | Hero-Visuals: Workflow-Diagramm, Live-Counter, Inbox-Animation. |
| **`components.html`** | Live-Preview + Copy/Paste-Snippets aller Komponenten. Im Browser öffnen. |
| **`README.md`** | Diese Datei. |

---

## 🚀 Setup in deinem Projekt

### 1. Dateien rüberkopieren
Kopiere `styles.css` in dein Projekt (z.B. `src/styles.css` oder `public/styles.css`).

### 2. Im HTML einbinden
```html
<link rel="stylesheet" href="styles.css"/>
```

### 3. Theme setzen
```html
<html lang="de" data-theme="light">
<!-- oder data-theme="dark" -->
```

### 4. Fonts laden (Geist + JetBrains Mono)
Im `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
```

### 5. Body-Wrapper
```html
<body>
  <div id="root">
    <!-- App hier -->
  </div>
</body>
```

---

## 🤖 Cursor-Anleitung

**Bevor du Cursor irgendwas mit CSS machen lässt:** lass es `STYLEGUIDE.md` und `tokens.md` lesen. Beste Methode:

```
@STYLEGUIDE.md @tokens.md @styles.css

Bitte halte dich exakt an die Regeln im STYLEGUIDE und nutze
nur Variablen aus tokens.md. Niemals !important. Niemals Hex-Codes
außerhalb von :root.
```

Dann kommt `!important`-Salat fast nicht mehr vor.

---

## 🎨 Schnell-Anpassungen

**Akzentfarbe ändern** (eine Zeile):
```css
:root {
  --accent-h: 285;   /* Violet statt Indigo */
  --accent-h2: 260;
}
```

**Light → Dark wechseln:**
```js
document.documentElement.dataset.theme = 'dark';
```

**Andere Schriftart:**
```css
:root {
  --font-display: "Inter", sans-serif;
}
```

**Container schmaler:**
```css
:root { --max-w: 1080px; }
```

---

## ⚠️ Was nicht übernommen wurde

- React-spezifische Komponenten (`hero.jsx`, `sections.jsx` etc.) sind **nicht** als Komponenten-Code dabei. Die HTML-Struktur findest du in `components.html`, die JSX/JS-Snippets für animierte Elemente in `animations.md` und `svg-visuals.md`.
- Der `tweaks-panel.css` ist **nicht** dabei — der war nur für die Design-Phase.

---

## 📋 Was du noch tun solltest

1. **Texte überarbeiten** — alle Texte aktuell sind Platzhalter
2. **Echtes Founder-Foto** statt Streifen-Placeholder
3. **Tool-Logos als SVG** statt Text-Pills im Marquee
4. **Auf echtem Handy testen** — nicht im DevTools-Simulator
5. **Lighthouse-Check** für Performance + Accessibility nach Übernahme

---

## ❓ Fragen

Wenn etwas unklar ist:
- Komponente fehlt in `components.html`? → schau in `Startseite Redesign.html` und kopiere die HTML-Struktur
- CSS-Variable nicht aufgeführt? → siehe `:root` in `styles.css`, Zeile 1–60
- Mobile-Verhalten unklar? → siehe `#RESPONSIVE`-Anker in `styles.css`
