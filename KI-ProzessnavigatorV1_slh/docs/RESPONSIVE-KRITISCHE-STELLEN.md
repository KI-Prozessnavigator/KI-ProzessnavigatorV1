# Kritische Stellen für Mobile (<768px) – Responsive Retrofitting

**Einschränkung:** Desktop (ab 1024px) darf nicht verändert werden. Nur Analyse, keine Änderungsvorschläge.

---

## 1. Feste Breiten (width / min-width in px) ohne max-width

Elemente, die auf schmalen Viewports horizontalen Scroll oder Abschneiden verursachen können.

| Datei | Zeile | Kontext |
|-------|-------|---------|
| **css/main.css** | 1359 | `.trust-bar::before` – width: 200px |
| **css/main.css** | 1599–1600 | `.neural-network` – width: 200px; height: 200px |
| **css/main.css** | 1610–1611 | `.node--center` – width: 60px; height: 60px |
| **css/main.css** | 1637–1638 | `.orbit-icon` – width: 50px; height: 50px |
| **css/main.css** | 5663 | min-width: 280px (Cookie-Bereich) |
| **css/main.css** | 9125–9127 | `.result-card__circle-wrap` – width: 140px; height: 140px |
| **css/components.css** | 22 | width: 200px (Trust-Bar-Linie) |
| **css/components.css** | 171–172 | `.neural-network` – width: 200px; height: 200px |
| **css/components.css** | 209 | `.orbit-icon` – width: 50px |
| **css/components.css** | 792 | min-width: 80px |
| **css/responsive.css** | 144 | `.trust-badge` – min-width: 200px (innerhalb @media max-width: 992px) |
| **css/responsive.css** | 219–220 | `.hero::before` – width: 300px; height: 300px (innerhalb @media max-width: 576px) |
| **css/main.css** | 7605 | min-width: 200px (Hero, innerhalb @media max-width: 992px) |
| **css/calculator-redesign.css** | 31 | `#pricing .calculator__wrapper` – grid-template-columns: 380px 1fr |
| **css/calculator-redesign.css** | 191 | `#pricing .result-card--money` – min-width: 340px |
| **css/calculator-redesign.css** | 205 | `.btn--calculator` – min-width: 360px |
| **css/calculator-modern-compact.css** | 290 | min-width: 340px !important |
| **css/cookie-banner.css** | 43 | min-width: 280px |
| **css/test-usecases-responsive.css** | 30–32 | width/min-width/max-width: 320px |
| **css/utility.css** | 106 | width: 140px |

---

## 2. Absolute Positionierung mit Kollisionsrisiko

Positionierung, die auf kleinen Screens aus dem sichtbaren Bereich laufen oder überlappen kann.

| Datei | Zeile | Kontext |
|-------|-------|---------|
| **css/main.css** | 1353–1359 | `.trust-bar::before` – position: absolute; width: 200px; left: 50% |
| **css/main.css** | 1603–1626 | `.node` position: absolute; `.node--center` 60px; `.node--1` / `node--2` / `node--3` mit Prozent-Positionen (Eltern: .neural-network 200px) |
| **css/main.css** | 1629–1643 | `.orbit-icons` / `.orbit-icon` – position: absolute; inset: 0; width/height: 50px |
| **css/main.css** | 3067–3073 | `.play-button` – position: absolute; width: 70px; height: 70px; top: 50%; left: 50% |
| **css/main.css** | 4128–4132 | `.data-streams` – position: absolute; inset: -20% (ragt aus dem Container heraus) |
| **css/main.css** | 2915–2919 | `.pricing-card__badge` – position: absolute; top: -12px; left: 50% |
| **css/responsive.css** | 214–220 | `.hero::before` – position: absolute; top: -100px; right: -100px; width/height: 300px (innerhalb @media max-width: 576px) |

---

## 3. Schriftgrößen (px), die auf Mobile zu groß wirken können

Feste px-Werte ohne responsive Anpassung; auf kleinen Screens wirken sie oft übertrieben.

| Datei | Zeile | Kontext |
|-------|-------|---------|
| **css/main.css** | 9095 | `.result-card__icon-box` – font-size: 36px |
| **css/main.css** | 9112 | `.result-card__value-num` – font-size: 36px |
| **css/main.css** | 9113 | `.result-card__value-unit` – font-size: 16px |
| **css/main.css** | 9137 | `.result-card__percent` – font-size: 24px |
| **css/main.css** | 9180–9181 | `.result-card__monthly-label` / `.result-card__monthly-value` – 10px / 14px |
| **css/utility.css** | 76 | font-size: 36px |
| **css/utility.css** | 93–94 | `.result-card__value-num` 36px; `.result-card__value-unit` 16px |
| **css/utility.css** | 118 | `.result-card__percent` – font-size: 24px |
| **css/utility.css** | 161–162 | `.result-card__monthly-label` 10px; `.result-card__monthly-value` 14px |
| **css/calculator-modern-compact.css** | 175 | font-size: 28px !important |
| **css/calculator-modern-compact.css** | 209 | font-size: 18px !important |
| **css/live-impact-dashboard.css** | 54, 59 | font-size: 24px; 18px |
| **css/live-impact-dashboard.css** | 139, 161 | font-size: 32px; 36px |
| **css/live-impact-dashboard.css** | 256, 260, 275, 279, 287, 318, 322 | font-size: 32px, 28px, 16px, 28px, 24px, 24px, 20px (in Media Queries) |
| **css/neural-network-automation.css** | 205, 221, 226 | font-size: 10px; 9px; 18px |
| **css/solar-system.css** | 155, 166, 182 | font-size: 10px; 9px; 8px |

---

*Nur Auflistung kritischer Stellen; keine Änderungen am Code vorgenommen.*
