# Animationen & Motion-Patterns

Alle Bewegungen aus dem Projekt — copy/paste-ready für Cursor & Claude Code.
Keine externen Libraries (kein Framer Motion, kein GSAP). Alles nur CSS + bisschen JS.

**Grundregeln:**
- Easing: `cubic-bezier(0.2, 0.7, 0.2, 1)` für Reveals · `cubic-bezier(0.65, 0, 0.35, 1)` für Sliding-Indicator · `ease` für Hover.
- Dauern: Hover **150–200ms**, Reveals **600–700ms**, Marquee **60s**, Pulse **1.6s**.
- Immer `prefers-reduced-motion` respektieren — am Ende der Datei steht ein globaler Override.

---

## 1. Hover: Card lift + border + shadow

Standard-Pattern für jede Karte (Pain, Step, Bento, Pricing).

```css
.card {
  border: 1px solid var(--border);
  background: var(--surface);
  transition: border-color 0.2s ease,
              transform 0.2s ease,
              box-shadow 0.2s ease;
}
.card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

## 2. Hover: Button-Pfeil schiebt nach rechts

```css
.btn .arrow { display: inline-block; transition: transform 0.2s ease; }
.btn:hover .arrow { transform: translateX(3px); }
```

```html
<a class="btn btn-primary">Erstgespräch <span class="arrow">→</span></a>
```

## 3. Pulse: grüner Live-Dot

```css
.live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: oklch(0.7 0.18 145);
  box-shadow: 0 0 0 3px oklch(0.7 0.18 145 / 0.2);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px oklch(0.7 0.18 145 / 0.2); }
  50%      { box-shadow: 0 0 0 6px oklch(0.7 0.18 145 / 0); }
}
```

## 4. Marquee: endlose Logo-Leiste

Trick: Inhalt zweimal hintereinander rendern, von 0 bis -50% schieben → nahtlose Schleife.

```css
.marquee { overflow: hidden; }
.marquee-track {
  display: flex; width: max-content; gap: 48px;
  animation: marquee 60s linear infinite;
}
.marquee:hover .marquee-track { animation-play-state: paused; }
.marquee::before, .marquee::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2;
  pointer-events: none;
}
.marquee::before { left: 0;  background: linear-gradient(to right, var(--bg-2), transparent); }
.marquee::after  { right: 0; background: linear-gradient(to left,  var(--bg-2), transparent); }
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

```jsx
const items = ['Microsoft', 'OpenAI', 'n8n', 'Make', 'Airtable'];
<div className="marquee">
  <div className="marquee-track">
    {[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
  </div>
</div>
```

## 5. Scroll-Reveal (IntersectionObserver)

CSS:

```css
.reveal {
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.in { opacity: 1; transform: translateY(0); }
```

JS — einmal global registrieren:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

Tipp: bei React-Komponenten zusätzlich einen `MutationObserver` schalten, damit später eingefügte `.reveal`-Elemente nachregistriert werden.

## 6. Sliding Tab-Indicator

Genutzt im Module-Bereich. Die Pille gleitet zwischen Tabs.

```css
.module-tabs {
  position: relative;
  display: flex; gap: 6px;
  padding: 6px;
  background: var(--surface-2);
  border-radius: var(--r-pill);
}
.module-tabs::before {
  content: "";
  position: absolute; top: 6px; bottom: 6px;
  left: var(--indicator-x, 6px);
  width: var(--indicator-w, 100px);
  background: var(--surface);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1),
              width 0.35s cubic-bezier(0.65, 0, 0.35, 1),
              left 0.35s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 0;
}
.module-tabs button { position: relative; z-index: 1; }
```

```jsx
useEffect(() => {
  const btn = tabsRef.current?.querySelector('[aria-pressed="true"]');
  if (!btn) return;
  tabsRef.current.style.setProperty('--indicator-x', btn.offsetLeft + 'px');
  tabsRef.current.style.setProperty('--indicator-w', btn.offsetWidth + 'px');
}, [active]);
```

## 7. Bar-Chart Wachstum (staggered)

```css
.bar { transform-origin: bottom; }
.bar-fill {
  background: var(--accent-grad);
  animation: barGrow 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes barGrow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
```

```jsx
{bars.map((h, i) => (
  <div className="bar" style={{ height: `${h}%` }}>
    <div className="bar-fill" style={{ animationDelay: `${i * 60}ms` }} />
  </div>
))}
```

## 8. Spinner

```css
.spinner {
  width: 12px; height: 12px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

## 9. Mouse-Tracking Spotlight (Hero)

Folgt dem Cursor, sehr subtil. JS schreibt Position in Custom Properties — CSS rendert Gradient.

```css
body::after {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    400px circle at var(--mx, 50%) var(--my, 30%),
    oklch(0.62 0.22 var(--accent-h) / 0.06),
    transparent 60%
  );
  transition: background-position 0.4s ease;
}
```

```js
window.addEventListener('pointermove', (e) => {
  document.body.style.setProperty('--mx', e.clientX + 'px');
  document.body.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });
```

Tipp zur Größe: 400px = dezent, 600px = auffällig, 800px = zuviel.

## 10. Sticky Header mit Scroll-Detect

```css
.site-header {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--bg) 75%, transparent);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.site-header.scrolled {
  border-bottom-color: var(--border);
}
```

```js
window.addEventListener('scroll', () => {
  document.querySelector('.site-header')
    .classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });
```

## 11. Burger-Menü Animation

```css
.nav-burger span {
  display: block; width: 18px; height: 2px;
  background: var(--fg); border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.nav-burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
.nav-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav-burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
```

## 12. FAQ-Toggle (+ → ×)

```css
.faq-item .toggle {
  width: 24px; height: 24px;
  border-radius: 50%; border: 1px solid var(--border-strong);
  display: grid; place-items: center;
  transition: transform 0.2s;
}
.faq-item[open] .toggle {
  transform: rotate(45deg);
  background: var(--accent); color: white;
  border-color: var(--accent);
}
```

```html
<details class="faq-item">
  <summary>Frage <span class="toggle">+</span></summary>
  <div class="body">Antwort</div>
</details>
```

---

# Container-Patterns

## A. Glassmorphism-Card

```css
.card-glass {
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
}
```

## B. Karte mit Top-Edge-Glow (Dark Mode)

```css
[data-theme="dark"] .card::before {
  content: "";
  position: absolute; inset: 0; pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(180deg,
    oklch(1 0 0 / 0.06) 0%,
    transparent 30%);
}
.card { position: relative; isolation: isolate; }
```

## C. Page-Hintergrund-Gradient (Hero-Bereich)

```css
.hero-bg {
  position: absolute;
  inset: -10% -10% auto -10%;
  height: 90%;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 50% 50% at 30% 20%, oklch(0.62 0.22 var(--accent-h) / 0.20), transparent 60%),
    radial-gradient(ellipse 40% 40% at 80% 30%, oklch(0.78 0.18 var(--accent-h2) / 0.18), transparent 60%);
  filter: blur(40px);
}
```

## D. Subtiles Dot-Grid (Linear/Vercel-Style)

```css
body::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  background-image: radial-gradient(circle at center,
    oklch(0.14 0.018 252 / 0.09) 1px, transparent 1.5px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 80%);
}
```

## E. CTA-Block mit Mesh-Gradient + Karo

```css
.cta-block {
  position: relative;
  padding: 80px;
  border-radius: var(--r-2xl);
  background: oklch(0.13 0.012 250);
  color: white;
  overflow: hidden; isolation: isolate;
}
.cta-block::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse 50% 80% at 20% 80%, oklch(0.62 0.22 var(--accent-h) / 0.35), transparent 60%),
    radial-gradient(ellipse 50% 80% at 80% 20%, oklch(0.78 0.18 var(--accent-h2) / 0.30), transparent 60%);
}
.cta-block::after {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background-image:
    linear-gradient(to right, oklch(1 0 0 / 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, oklch(1 0 0 / 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
}
```

## F. Variant-Switcher Pille

```css
.switcher {
  display: inline-flex; padding: 4px; gap: 2px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}
.switcher button {
  padding: 6px 14px; border: 0; background: transparent;
  border-radius: var(--r-pill);
  font-family: var(--font-mono); font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--fg-3); cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.switcher button[aria-pressed="true"] {
  background: var(--surface); color: var(--fg);
  box-shadow: var(--shadow-sm);
}
```

## G. Visual-Toolbar (mac-window-Style)

```css
.visual-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono); font-size: 11px;
  color: var(--fg-3);
}
.visual-toolbar .dots { display: inline-flex; gap: 6px; }
.visual-toolbar .dots span {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--border-strong);
}
```

---

# Globaler Reduced-Motion Override

**Immer am Ende der CSS-Datei haben:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  body::after { display: none; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

---

# Cursor-Prompts (so triggerst du diese Patterns)

> "Mach diese Card hover-fähig wie in `_handoff/animations.md` Pattern 1."

> "Bau eine endlose Logo-Leiste — siehe `_handoff/animations.md` Pattern 4 (Marquee)."

> "Sektion soll beim Scrollen einfaden — Pattern 5 (Scroll-Reveal). Nutze die CSS-Klasse `.reveal` aus `styles.css`."

> "Tabs sollen einen sliding indicator haben wie Pattern 6."

> "Hero soll einen Spotlight bekommen, der dem Cursor folgt — Pattern 9, 400px Radius."

> "CTA-Block ganz unten mit Mesh-Gradient + Karomuster — Container-Pattern E."

Wichtig in jedem Prompt: **Token-System aus `tokens.md` benutzen, kein `!important`, keine neuen Custom Properties anlegen.**
