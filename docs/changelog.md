# CHANGELOG

Alle Änderungen am Projekt werden hier dokumentiert.

## [05.05.2026] — Konsolidierung & Design-Handoff-Integration

### Architektur / Doku-Konsistenz
- CLAUDE.md komplett refactored: dient jetzt als SSOT-Index, dupliziert keine Code-Regeln mehr
- `.cursor/rules/project.md` neu angelegt im Rework-Projekt (Cursor-Konvention) — dort liegen die Code-Regeln autoritativ
- Alte `cursor-rules-project.md` im Workspace-Parent zum Stub mit Verweis reduziert
- Tote Pfade gefixt: `audit-aktuell.md` → `audit-ergebnis.md`, `project-constitution.md` aus Referenzen entfernt (nicht existent, nicht nötig)

### Design-System / Handoff-Integration
- `_handoff/` Design-System ins Projekt aufgenommen (read-only Referenz)
- `docs/handoff-mapping.md` neu: Token- und Klassen-Übersetzung Handoff → Aktiv-CSS, inkl. Mobile-First-Umkehrung der Breakpoints
- `css/tokens.css`: `--accent-grad` und `--accent-grad-soft` ergänzt (Linear-Gradient für Logo, CTA, Headlines)
- `css/base.css`: Headline-Klassen ergänzt — `.h-display`, `.h-section` (+ `--small`), `.lede`, `.eyebrow` (+ `.idx`). Alle Mobile-First mit clamp().

### Content
- `docs/content-neu.md` vereinheitlicht: TEIL 2 (eigenständige Seiten /ablauf, /datenschutz-ki, /faq, /ueber-uns, /blog + 9 Blog-Artikel) integriert
- Sektionen 11/12/13 der Startseite ausgeschrieben mit kurzen Versionen + Verweisen auf TEIL 2
- Quelldatei archiviert nach `docs/_archiv/`

### Offen
- Geo-URL-Struktur (Phase 4) — wird später entschieden, wenn Hauptseiten stehen
- Bilder-Konvertierung nach WebP (`dominik-buchele.png`, Porträt) — Backlog Phase 0
- Geist + JetBrains Mono WOFF2 in `assets/fonts/` ablegen — Backlog Phase 0

---

## [03.05.2026] — Projektpaket angelegt

### Phase 0: Vorbereitung
- CLAUDE.md angelegt (Claude Code Regeln)
- .cursor/rules/project.md angelegt (Cursor-Regeln)
- docs/ Ordner mit Backlog, SEO-Docs, Audit-Templates angelegt
- Nächster Schritt: Projekt-Audit durchführen
