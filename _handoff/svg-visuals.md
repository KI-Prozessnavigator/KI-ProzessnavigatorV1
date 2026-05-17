# SVG-Visuals & Live-Demos

Die animierten Mock-Diagramme aus dem Hero (Workflow-Nodes, Live-Dashboard, Inbox) sind komplett in **inline-SVG + React state** gebaut — kein D3, kein Chart-Lib.

---

## 1. SVG-Workflow mit fließenden Verbindungen (n8n-Style)

Knoten als `<rect>` + animierte Bezier-Kanten zwischen ihnen. Aktiver Knoten bekommt einen pulsierenden Ring.

**Edge-Animation:** `strokeDasharray` + animierter `strokeDashoffset` lässt einen "Datenpaket"-Punkt entlang der Linie laufen.

```jsx
<svg viewBox="0 0 660 280">
  <defs>
    <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stopColor="oklch(0.62 0.22 var(--accent-h))" stopOpacity="0.15"/>
      <stop offset="100%" stopColor="oklch(0.78 0.18 var(--accent-h2))" stopOpacity="0.6"/>
    </linearGradient>
  </defs>
  {edges.map(([a, b], i) => {
    const A = pos(a), B = pos(b);
    const mx = (A.x + B.x) / 2;
    const d = `M ${A.x + 70} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${B.x} ${B.y}`;
    return (
      <g key={i}>
        <path d={d} stroke="var(--border-strong)" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d={d} stroke="url(#edgeGrad)" strokeWidth="2" fill="none"
              strokeDasharray="6 200">
          <animate attributeName="stroke-dashoffset"
                   from="206" to="0" dur="2s"
                   begin={`${i * 0.4}s`}
                   repeatCount="indefinite"/>
        </path>
      </g>
    );
  })}
  {nodes.map((n, i) => (
    <g key={n.id} transform={`translate(${n.x}, ${n.y - 22})`}>
      <rect width="140" height="44" rx="10"
            fill="var(--surface)" stroke="var(--border-strong)"/>
      {tick % nodes.length === i && (
        <rect x="-1" y="-1" width="142" height="46" rx="11"
              fill="none" stroke="var(--accent)" strokeWidth="2"/>
      )}
      <circle cx="22" cy="22" r="13" fill="var(--accent-soft)"/>
      <text x="22" y="27" textAnchor="middle" fontSize="14"
            fill="var(--accent)" fontFamily="var(--font-mono)">{n.icon}</text>
    </g>
  ))}
</svg>
```

Tick wird von `setInterval` getrieben — alle 1.8s einer weiter.

## 2. Live-Counter mit easeOutCubic

Eine echte React-Animation. Steigt von 0 auf Zielwert in 1.5s mit gefühltem Ease-Out.

```jsx
const [val, setVal] = useState(0);
useEffect(() => {
  let r;
  const start = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - start) / 1500);
    const ease = 1 - Math.pow(1 - p, 3);
    setVal(Math.round(ease * 1540));
    if (p < 1) r = requestAnimationFrame(tick);
  };
  r = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(r);
}, []);
```

## 3. Inbox: zeilenweise Verarbeitung

Eine Liste, in der jede Zeile nacheinander von "wird verarbeitet" auf "fertig" springt. Klassisches `setInterval` + Index.

```jsx
useEffect(() => {
  let i = 0;
  const id = setInterval(() => {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, done: true } : it));
    i++;
    if (i >= items.length) {
      setTimeout(() => { setItems(seed.map(s => ({ ...s }))); i = 0; }, 1200);
    }
  }, 700);
  return () => clearInterval(id);
}, []);
```

CSS für den State-Wechsel:

```css
.inbox-row { transition: opacity 0.3s, background 0.3s; }
.inbox-row.is-done { background: var(--surface-2); opacity: 0.7; }
.status-pending .spinner { /* siehe animations.md #8 */ }
```

---

## Cursor-Prompts

> "Bau einen Workflow-Diagramm-Mock mit 6 Knoten und animierten Edges wie in `_handoff/svg-visuals.md` Pattern 1. Nutze die Token aus `tokens.md`."

> "Mach einen Live-KPI-Counter mit easeOutCubic von 0 auf 1540 in 1.5s — Pattern 2."

> "Liste mit fortschrittlicher Verarbeitung Zeile für Zeile — Pattern 3, alle 700ms ein Schritt weiter."

Alle Visuals sind **deterministisch** (kein echtes Backend) — sie sind Marketing-Mockups, keine Live-Daten.
