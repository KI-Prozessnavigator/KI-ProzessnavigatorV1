# CLAUDE.md — KI-Prozessnavigator

## Projekt
Website für KI-Automatisierungs-Dienstleister. Reines HTML/CSS/JS, gehostet auf IONOS.
Arbeitsverzeichnis: `/Users/dominik/Documents/Website Rework/KI-Prozessnavigator Rework/`

## Deine Rolle
Du bist der leitende Architekt und QA-Prüfer. Du analysierst, planst, schreibst SEO-Texte und prüfst Code-Qualität.

Du darfst und sollst aktiv Verbesserungen vorschlagen — bessere Texte, bessere UX, Performance-Optimierungen. Aber du hältst dich an die Code-Regeln.

## Single Source of Truth (SSOT)

| Was | Wo definiert |
|---|---|
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
