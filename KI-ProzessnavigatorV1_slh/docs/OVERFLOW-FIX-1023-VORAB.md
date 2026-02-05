# Overflow-Fix @media (max-width: 1023px) – Code zur Freigabe

**Alle neuen Regeln sind ausschließlich in einem `@media (max-width: 1023px)` Block.**  
Desktop (ab 1024px) bleibt unverändert.

---

## Einfügeort

**Datei:** `css/responsive.css`  
**Position:** Am Ende der Datei (nach der letzten schließenden Klammer).

---

## Vollständiger Code (zum Einfügen)

```css
/* ==========================================
   Overflow-Schutz Mobile/Tablet (max-width: 1023px)
   Desktop ab 1024px bleibt unverändert.
   ========================================== */
@media (max-width: 1023px) {
    /* 1. Globaler Overflow-Schutz */
    html,
    body {
        overflow-x: hidden;
        width: 100%;
    }

    /* 2. Haupt-Content-Wrapper: Sicherheitsabstände */
    .container {
        padding-left: 16px;
        padding-right: 16px;
        width: 100%;
        box-sizing: border-box;
    }

    /* 3. Feste Breiten überschreiben (gleiche Selektoren wie Original) */
    .trust-bar .container {
        width: 100%;
        max-width: 100vw;
        min-width: 0;
        box-sizing: border-box;
    }

    .trust-badge {
        width: 100%;
        max-width: 100vw;
        min-width: 0;
        box-sizing: border-box;
    }

    .neural-network {
        width: 100%;
        max-width: 100vw;
        min-width: 0;
        box-sizing: border-box;
    }

    .result-card__circle-wrap {
        width: 100%;
        max-width: 100vw;
        min-width: 0;
        box-sizing: border-box;
    }

    /* 4. Dekorative absolute Elemente: nicht über Rand ragen */
    .trust-bar::before {
        display: none;
    }

    .node,
    .orbit-icon {
        max-width: 100%;
        box-sizing: border-box;
    }
}
```

---

## Bestätigung

- Alle neuen Regeln stehen **ausschließlich** innerhalb von `@media (max-width: 1023px) { ... }`.
- Es wird **kein** Desktop-Code geändert oder gelöscht.
- Es werden nur Eigenschaften **überschrieben**, Selektoren entsprechen dem Original (.container, .trust-bar .container, .trust-badge, .neural-network, .result-card__circle-wrap, .trust-bar::before, .node, .orbit-icon).
- Globaler Overflow: `html, body` nur für Viewport ≤1023px.
- Sicherheitsabstände: `.container` erhält `padding-left/right: 16px` nur in dieser Media Query.
- Feste Breiten: `width: 100%`, `max-width: 100vw`, `min-width: 0`, `box-sizing: border-box` nur in dieser Media Query.
- Dekorative Elemente: `.trust-bar::before` wird ausgeblendet; `.node` und `.orbit-icon` auf `max-width: 100%` begrenzt.

Wenn du möchtest, kann ich diesen Block als Nächstes in `responsive.css` einfügen.
