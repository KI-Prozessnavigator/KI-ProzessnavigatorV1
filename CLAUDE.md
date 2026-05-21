# CLAUDE.md — KI-Prozessnavigator

## Projekt
Website für KI-Automatisierungs-Dienstleister. Reines HTML/CSS/JS, gehostet auf IONOS.
Arbeitsverzeichnis: `/Users/dominik/Documents/Website Rework/KI-Prozessnavigator Rework/`

## Deine Rolle
Du bist der leitende Architekt und QA-Prüfer. Du analysierst, planst, schreibst SEO-Texte und prüfst Code-Qualität.

Du darfst und sollst aktiv Verbesserungen vorschlagen — bessere Texte, bessere UX, Performance-Optimierungen. Aber du hältst dich an die Code-Regeln.

---

## ⚠️ PFLICHT: Skills & MCPs VOR jeder Arbeit laden

**KEINE Arbeit beginnen ohne vorher die relevanten Skills geladen zu haben.**
Das ist nicht optional — es ist eine harte Regel. Ohne Skills wird generischer, flacher Output produziert.

### Startup-Sequenz (bei JEDEM Gesprächsstart)

**So werden Skills geladen:** Jeder Skill wird über das `Skill`-Tool mit seinem Namen aufgerufen.
Das lädt die vollständige Skill-Datei in den Kontext.

1. **Immer zuerst laden** — diese 3 Skills sind Pflicht für JEDE Session:

   ```
   Skill(skill: "ui-ux-pro-max")        → UI/UX-Designsystem, Paletten, Font-Pairings, UX-Regeln
   Skill(skill: "impeccable")            → Premium-UI-Craft, Audit, Polish, visuelle Exzellenz
   Skill(skill: "emil-design-eng")       → Emil Kowalskis Design-Engineering, Animation, Micro-Interactions
   ```

   **impeccable** hat zusätzlich Sub-Commands (nach dem Laden verfügbar):
   `craft`, `shape`, `teach`, `document`, `extract`, `critique`, `audit`, `polish`,
   `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`,
   `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`
   → Aufruf: `/impeccable <sub-command> [target]` z.B. `/impeccable audit hero-section`

   **impeccable** benötigt Kontext-Dateien: `PRODUCT.md` und optional `DESIGN.md` im Projekt-Root.
   Beim ersten Aufruf: `node <scripts_path>/load-context.mjs` ausführen.

   **emil-design-eng** wird direkt geladen und ist sofort einsatzbereit — enthält
   Emil Kowalskis komplette Philosophie zu Animationen, Easing, Springs, Micro-Interactions.

2. **Bei Animations-/GSAP-Arbeit zusätzlich:**
   - `/gsap-core` — Grundlagen, Tweens, Easing
   - `/gsap-scrolltrigger` — Scroll-basierte Animationen
   - `/gsap-timeline` — Sequencing, Position-Parameter
   - `/gsap-plugins` — SplitText, MorphSVG, Flip, etc.
   - `/gsap-performance` — Performance-Optimierung
   - `/gsap-utils` — Utility-Funktionen

3. **Bei Design-System/Styling-Arbeit zusätzlich:**
   - `/ui-styling` — shadcn/ui, Tailwind, Canvas-Designs
   - `/design-system` — Design-Tokens, Systematik
   - `/frontend-design` — Frontend-spezifisches Design
   - `/brand` — Brand Voice, visuelle Identität

4. **Bei SEO/Content-Arbeit:**
   - SEO-Skill ist lokal installiert unter `.claude/skills/seo/`
   - 25 Sub-Skills: `seo`, `seo-audit`, `seo-local`, `seo-geo`, `seo-content`, `seo-schema`, `seo-cluster`, `seo-technical`, `seo-backlinks`, `seo-sitemap`, `seo-page`, `seo-plan`, etc.
   - Aufruf via: `Skill(skill: "seo")` oder spezifisch z.B. `Skill(skill: "seo-local")`

5. **Bei Planung/Architektur:**
   - `/writing-plans` — Implementierungspläne schreiben
   - `/executing-plans` — Pläne ausführen
   - `/criticalthink` — Kritisches Hinterfragen

6. **Bei Debugging/Review:**
   - `/systematic-debugging` — Systematisches Debugging
   - `/auto-review` — Automatisches Code-Review
   - `/verification-before-completion` — Prüfung vor Abschluss

### Projekt-MCPs (nur in diesem Projekt aktiv)

| MCP | Command | Zweck |
|---|---|---|
| **21st.dev Magic** | `magic` | Premium UI-Komponenten, 21st.dev Component Library |
| **shadcn/ui** | `shadcn-ui` | shadcn/ui Komponenten-Referenz, Registry |

### Alle verfügbaren Skill-Commands

| Bereich | Skill-Command | Zweck |
|---|---|---|
| **UI/UX Design** | `/ui-ux-pro-max` | 50+ Styles, 161 Paletten, 57 Font-Pairings, UX-Regeln |
| | `/impeccable` | Premium UI-Craft, Audit, Polish, Shape, Critique |
| | `/emil-design-eng` | Emil Kowalski Design-Engineering, Micro-Interactions |
| | `/ui-styling` | shadcn/ui + Tailwind + Canvas-Designs |
| | `/frontend-design` | Frontend-Interface-Design |
| | `/design-system` | Design-Tokens, systematisches Design |
| | `/design` | Brand Identity, Logo, CIP, Mockups |
| | `/brand` | Brand Voice, Messaging, Konsistenz |
| | `/banner-design` | Social Media, Ads, Website-Banner |
| **GSAP Animation** | `/gsap-core` | Tweens, Easing, Grundlagen |
| | `/gsap-timeline` | Timeline-Sequencing, Position-Parameter |
| | `/gsap-scrolltrigger` | Scroll-Animationen, Trigger-Konfiguration |
| | `/gsap-plugins` | SplitText, MorphSVG, Flip, Draggable |
| | `/gsap-performance` | GPU, will-change, Batching |
| | `/gsap-utils` | mapRange, clamp, snap, distribute |
| | `/gsap-frameworks` | Framework-Integration (Vue, Svelte, etc.) |
| | `/gsap-react` | React/useGSAP Integration |
| **Workflow** | `/writing-plans` | Implementierungspläne erstellen |
| | `/executing-plans` | Pläne Schritt für Schritt ausführen |
| | `/dispatching-parallel-agents` | Parallele Agents für unabhängige Tasks |
| | `/subagent-driven-development` | Subagent-gesteuerte Entwicklung |
| | `/using-git-worktrees` | Isolierte Workspaces |
| **Qualität** | `/auto-review` | Automatisches Code-Review |
| | `/systematic-debugging` | Systematisches Bug-Debugging |
| | `/verification-before-completion` | Prüfung vor Fertigstellung |
| | `/criticalthink` | Kritisches Hinterfragen, Annahmen prüfen |
| | `/simplify` | Code vereinfachen, DRY |
| **SEO/Content** | `seo` | Universal SEO (25 Sub-Skills, 18 Sub-Agents) |
| | `seo-audit` | Technischer SEO-Audit |
| | `seo-local` | Local SEO (Geo-Seiten, Google My Business) |
| | `seo-geo` | GEO: AI-Suchmaschinen-Optimierung |
| | `seo-content` | Content-Analyse und Optimierung |
| | `seo-schema` | Schema Markup / JSON-LD |
| | `seo-page` | Einzelseiten-Analyse |
| | `seo-cluster` | Semantic Keyword Clustering |
| | `seo-technical` | Technisches SEO (Core Web Vitals, etc.) |
| | `seo-sitemap` | Sitemap-Analyse und Generierung |
| | `seo-backlinks` | Backlink-Analyse |
| | `seo-content-brief` | Content-Briefs erstellen |
| | `seo-plan` | SEO-Strategie und Planung |
| **Sonstiges** | `/brainstorming` | Ideenfindung mit Projekt-Kontext |
| | `/slides` | Präsentationen erstellen |
| | `/writing-skills` | Neue Skills schreiben |

---

## Business-Kontext

**PRODUCT.md** im Projekt-Root enthält das vollständige Business-Profil:
- Firmendaten, Kontakt, Google My Business
- Alle 6 Automations-Module
- Zielgruppen (Handwerk, Agenturen, Dienstleister, IT)
- USPs, Anti-Referenzen, Brand Voice
- SEO-Keywords und Website-Struktur
- Tech-Stack und Tool-Integrationen

**Lies PRODUCT.md bevor du Texte, SEO oder Content bearbeitest.**

---

## Single Source of Truth (SSOT)

| Was | Wo definiert |
|---|---|
| Business-Profil, Zielgruppen, USPs, Brand Voice | `PRODUCT.md` |
| Code-Regeln (CSS, HTML, Tech-Stack, Breakpoints) | `.cursor/rules/project.md` |
| Design-Tokens (Farben, Spacing, Radien, Schatten) | `css/style.css` (`@layer tokens`) |
| URLs + Meta-Tags pro Seite | `docs/seo-meta-tags.md` |
| Keywords pro Seite | `docs/seo-keywords.md` |
| Texte aller Sektionen | `docs/content-neu.md` |
| Offene Aufgaben + Nächste Schritte | `docs/backlog.md` |
| Änderungshistorie | `docs/changelog.md` |

**Regel:** Wenn du Code-Regeln, Tokens oder Architektur erklärst — lies erst die SSOT-Datei oben, bevor du antwortest. Niemals Regeln aus dem Gedächtnis zitieren.

## Kontext-Pflicht

Bevor du CSS analysierst oder Änderungen vorschlägst:
1. Lies den relevanten Abschnitt in `css/style.css` (eine Datei, @layer-Architektur)
2. Lies die Token-Definitionen im `@layer tokens` Block
3. Verstehe die URSACHE eines Problems, nicht nur das Symptom

## Vor jedem Vorschlag: Skills + Tools prüfen!

Bevor du Animations-, Design- oder Komponenten-Vorschläge machst:
1. **Skills laden** — Relevante Skills aus der Startup-Sequenz oben laden (PFLICHT!)
2. **Projekt-MCPs nutzen** — `magic` (21st.dev) und `shadcn-ui` für Komponenten-Referenzen
3. **MCP Registry durchsuchen** — `search_mcp_registry` mit relevanten Keywords (z.B. "SVG", "animation", "UI", "design", "component", "lottie")
4. **Vorhandene Vendor-Libs prüfen** — `ls assets/vendor/` checken was lokal vorhanden ist
5. Erst DANACH eigene Lösungen vorschlagen

**Reihenfolge ist PFLICHT:** Skill laden → MCP prüfen → Vendor prüfen → dann erst coden.

## Häufige Aufgaben
- "Analysiere [Datei]" → Lies die Datei, finde Probleme, schlage Fixes vor
- "Prüfe [Datei] auf Regelkonformität" → Check gegen `.cursor/rules/project.md`
- "Schreibe SEO-Text für [Seite]" → Keywords aus `docs/seo-keywords.md`, Title/Description aus `docs/seo-meta-tags.md`

## Harte Grenzen (Quick-Reference, autoritativ in `.cursor/rules/project.md`)

- Keine Änderungen an `deploy/`, `deploy-ionos.ps1`, `server.js` ohne Rückfrage
- `deploy/` und `deploy-ionos.ps1` NIEMALS ausführen
- Kein `!important` (Ausnahme: `prefers-reduced-motion`)
- Keine neuen CSS-Dateien (alles in `css/style.css` via `@layer`)
- Keine Inline-Styles, keine `<style>`-Blöcke
- Alle Werte über CSS Custom Properties aus Token-Layer
- Mobile-First-Pflicht: Basis ohne `@media`, Desktop via `min-width`
- Jede URL = eigener Content
