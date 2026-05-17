/**
 * build_main_v4.js
 * 
 * Baut css/main-v4.css aus allen Quelldateien zusammen.
 * NUR concat – kein !important wird entfernt.
 * 
 * Quellen:
 *   - css/main.css (6214 Zeilen)
 *   - css/background-override.css
 *   - css/hero-override.css
 *   - css/problem-awareness.css
 *   - css/calculator-v3.css
 *   - css/use-cases-override.css
 *   - css/zusammenarbeit.css
 *   - css/final-cta-override.css
 *   - css/responsive.css
 *   - index.html (3 Inline-Style-Bloecke)
 */

const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'css');
const mainLines = fs.readFileSync(path.join(cssDir, 'main.css'), 'utf8').split('\n');
const htmlLines = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').split('\n');

function ex(start, end) {
    return mainLines.slice(start - 1, end).join('\n');
}

function readCss(name) {
    return fs.readFileSync(path.join(cssDir, name), 'utf8');
}

function extractInlineBlock(startLine, endLine) {
    const block = htmlLines.slice(startLine - 1, endLine);
    const result = [];
    let inside = false;
    for (const line of block) {
        const trimmed = line.trim();
        if (trimmed === '<style>' || trimmed.startsWith('<style>')) {
            inside = true;
            continue;
        }
        if (trimmed === '</style>' || trimmed.startsWith('</style>')) {
            inside = false;
            continue;
        }
        if (inside) {
            result.push(line);
        }
    }
    return result.join('\n');
}

const inlineBlock1 = extractInlineBlock(215, 230);
const inlineBlock2 = extractInlineBlock(241, 297);
const inlineBlock3 = extractInlineBlock(298, 356);

const output = [];

function section(title, ...parts) {
    output.push('/* ============================================');
    output.push('   ' + title);
    output.push('   ============================================ */');
    output.push('');
    for (const part of parts) {
        if (part && part.trim()) {
            output.push(part.trim());
            output.push('');
        }
    }
    output.push('');
}

// ─── LAYER 1: FONTS ────────────────────────────
section('LAYER 1: FONTS – Self-hosted (DSGVO-konform)',
    ex(1, 39)
);

// ─── LAYER 2: CSS VARIABLES ────────────────────
section('LAYER 2: CSS VARIABLES',
    ex(189, 445)
);

// ─── LAYER 3: RESET + GLOBAL BASE ─────────────
section('LAYER 3: RESET + GLOBAL BASE',
    '/* --- Overflow-Schutz + Element-Resets --- */',
    ex(40, 188),
    '/* --- Body, Container, Typografie --- */',
    ex(446, 531),
    '/* --- Section-Basis --- */',
    ex(752, 780),
    '/* --- html/body/main overflow-x clip --- */',
    ex(5916, 5920),
    '/* --- Critical CSS (aus index.html Inline-Block 1) --- */',
    inlineBlock1
);

// ─── LAYER 4: HEADER + NAVIGATION ─────────────
section('LAYER 4: HEADER + NAVIGATION',
    ex(534, 707)
);

// ─── LAYER 5: BACKGROUND ──────────────────────
section('LAYER 5: BACKGROUND – Dot-Grid + Glow-Spots (ehemals background-override.css)',
    readCss('background-override.css')
);

// ─── LAYER 6a: HERO ───────────────────────────
section('LAYER 6a: HERO',
    '/* --- Hero Basis (aus main.css) --- */',
    ex(783, 992),
    '/* --- Trust-Bar --- */',
    ex(1217, 1268),
    '/* --- Logo-Carousel --- */',
    ex(2372, 2503),
    '/* --- Hero 3D + Decorations --- */',
    ex(2559, 2639),
    '/* --- hero-override.css (integriert) --- */',
    readCss('hero-override.css')
);

// ─── LAYER 6b: PROBLEM-AWARENESS ──────────────
section('LAYER 6b: PROBLEM-AWARENESS + FOUNDER (ehemals problem-awareness.css)',
    readCss('problem-awareness.css')
);

// ─── LAYER 6c: WIR-VS-DU ─────────────────────
section('LAYER 6c: WIR-VS-DU',
    ex(5922, 6214)
);

// ─── LAYER 6d: ERSPARNISRECHNER ───────────────
section('LAYER 6d: ERSPARNISRECHNER (ehemals calculator-v3.css)',
    readCss('calculator-v3.css')
);

// ─── LAYER 6e: USE CASES TABS ─────────────────
section('LAYER 6e: USE CASES TABS (ehemals use-cases-override.css)',
    readCss('use-cases-override.css')
);

// ─── LAYER 6f: ZUSAMMENARBEIT / ABLAUF ────────
section('LAYER 6f: ZUSAMMENARBEIT / ABLAUF (ehemals zusammenarbeit.css)',
    readCss('zusammenarbeit.css'),
    '/* --- Ablauf-Basis (aus main.css) --- */',
    ex(3060, 3083)
);

// ─── LAYER 6g: DSGVO ─────────────────────────
section('LAYER 6g: DSGVO',
    ex(1271, 1487)
);

// ─── LAYER 6h: FAQ + LEAD-MAGNET ──────────────
section('LAYER 6h: FAQ + LEAD-MAGNET',
    ex(1705, 1995)
);

// ─── LAYER 6i: FINAL CTA ─────────────────────
section('LAYER 6i: FINAL CTA (ehemals final-cta-override.css)',
    '/* --- Final-CTA Basis (aus main.css) --- */',
    ex(1997, 2065),
    '/* --- Social-Proof + @media 576px --- */',
    ex(2276, 2369),
    '/* --- final-cta-override.css (integriert) --- */',
    readCss('final-cta-override.css')
);

// ─── LAYER 7: FOOTER ─────────────────────────
section('LAYER 7: FOOTER',
    '/* --- Footer Basis --- */',
    ex(1037, 1128),
    '/* --- Footer Grid, Social-Links, Heading, Links, Bottom --- */',
    ex(2078, 2200)
);

// ─── LAYER 8: GEMEINSAME KOMPONENTEN ──────────
section('LAYER 8: GEMEINSAME KOMPONENTEN',
    '/* --- Buttons --- */',
    ex(709, 751),
    ex(2066, 2075),
    '/* --- About, Contact, Form --- */',
    ex(995, 1034),
    '/* --- Accessibility + Animationen --- */',
    ex(1130, 1211),
    '/* --- Pricing --- */',
    ex(1489, 1704),
    '/* --- Scroll-to-Top, Back-to-Start, Btn-Icon, Pricing-Guarantee --- */',
    ex(2203, 2273),
    '/* --- Skip-Link + Btn--Neon --- */',
    ex(2508, 2556),
    '/* --- Lazy-Loading + Shimmer --- */',
    ex(2641, 2654),
    '/* --- Cookie-Banner + Cookie-Modal (Basis in main.css) --- */',
    ex(3086, 3632),
    '/* --- Form Checkbox --- */',
    ex(3633, 3670),
    '/* --- Contact-Modal (Basis in main.css) --- */',
    ex(3675, 4606),
    '/* --- Utility-Klassen --- */',
    ex(5561, 5572),
    '/* --- Inline-Style-Fixes (aus index.html Block 2) --- */',
    inlineBlock2,
    '/* --- Inline-Style-Fixes (aus index.html Block 3) --- */',
    inlineBlock3
);

// ─── DARK THEME OVERRIDES ─────────────────────
section('DARK THEME OVERRIDES',
    '/* --- Dark-Theme Block 1 (Header, Nav, Hero, Pricing, Form, FAQ, Footer, etc.) --- */',
    ex(2655, 3057),
    '/* --- Dark-Theme Block 2 (DSGVO, Pricing, FAQ, Final-CTA, Hero, etc.) --- */',
    ex(5582, 5915)
);

// ─── LAYER 9: RESPONSIVE ─────────────────────
section('LAYER 9: RESPONSIVE',
    '/* --- Nav Responsive (aus main.css) --- */',
    ex(4607, 4622),
    '/* --- Responsive Breakpoints (aus main.css) --- */',
    ex(4623, 5448),
    '/* --- Large Screens + Print + Contrast + Reduced-Motion (aus main.css) --- */',
    ex(5451, 5558),
    '/* --- responsive.css (integriert) --- */',
    readCss('responsive.css')
);

// ─── OUTPUT ──────────────────────────────────
const result = output.join('\n');
fs.writeFileSync(path.join(cssDir, 'main-v4.css'), result, 'utf8');

const lineCount = result.split('\n').length;
const importantCount = (result.match(/!important/g) || []).length;
const layerHeaders = (result.match(/LAYER \d/g) || []).length;

console.log('=== main-v4.css erstellt ===');
console.log('  Zeilen:     ' + lineCount);
console.log('  !important: ' + importantCount);
console.log('  Layer:      ' + layerHeaders);
console.log('');
console.log('Quelldateien:');
console.log('  main.css:              ' + mainLines.length + ' Zeilen');
console.log('  background-override:   ' + readCss('background-override.css').split('\n').length + ' Zeilen');
console.log('  hero-override:         ' + readCss('hero-override.css').split('\n').length + ' Zeilen');
console.log('  problem-awareness:     ' + readCss('problem-awareness.css').split('\n').length + ' Zeilen');
console.log('  calculator-v3:         ' + readCss('calculator-v3.css').split('\n').length + ' Zeilen');
console.log('  use-cases-override:    ' + readCss('use-cases-override.css').split('\n').length + ' Zeilen');
console.log('  zusammenarbeit:        ' + readCss('zusammenarbeit.css').split('\n').length + ' Zeilen');
console.log('  final-cta-override:    ' + readCss('final-cta-override.css').split('\n').length + ' Zeilen');
console.log('  responsive:            ' + readCss('responsive.css').split('\n').length + ' Zeilen');
console.log('  index.html (3 Bloecke): ' + (inlineBlock1 + inlineBlock2 + inlineBlock3).split('\n').length + ' Zeilen');
