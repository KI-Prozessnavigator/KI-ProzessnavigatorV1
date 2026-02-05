# SICHTBARKEITS-ANALYSE - DEBUGGING

**Datum**: 2026-02-04
**Status**: 🔍 ANALYSE LÄUFT

---

## ✅ **WAS FUNKTIONIERT (laut User):**
- Position ist KORREKT
- Burger-Menü ist an der richtigen Stelle
- Balken sind nicht mehr verschoben

## ❌ **WAS NICHT FUNKTIONIERT:**
- Menü ist beim Ausklappen NICHT SICHTBAR
- Menüpunkte werden nicht angezeigt

---

## 🔍 **ANALYSE SCHRITT 1: CSS-Regeln prüfen**

### **Aktuelle .active Regel (Zeile 1947-1959):**
```css
body #nav-menu.active,
#nav-menu.active {
    max-height: 600px !important;  /* ✅ SOLLTE sichtbar machen */
    padding: 20px 0 !important;     /* ✅ Gibt Höhe */
    overflow-y: auto !important;    /* ✅ Erlaubt Scrollen */
    overflow-x: visible !important; /* ✅ Erlaubt Überlauf */
    display: flex !important;       /* ✅ Flex Container */
    flex-direction: column !important; /* ✅ Untereinander */
}
```

**Diese Regel sieht KORREKT aus!**

### **Menüpunkte-Regel (Zeile 1962-1973):**
```css
body #nav-menu .nav__link {
    display: block !important;      /* ✅ Sichtbar */
    width: 100% !important;
    padding: 18px 30px !important;  /* ✅ Gibt Höhe */
    color: #fefdfb !important;      /* ✅ Weiße Schrift */
    opacity: 1 !important;          /* ✅ Nicht transparent */
    visibility: visible !important; /* ✅ Sichtbar */
}
```

**Diese Regel sieht auch KORREKT aus!**

---

## 🔍 **ANALYSE SCHRITT 2: Mögliche Ursachen**

### **Möglichkeit 1: JavaScript setzt .active NICHT**
**Test:**
```javascript
// In Browser Console:
document.getElementById('nav-menu').classList.contains('active')
// Sollte TRUE sein nach Klick auf Burger
```

**Wenn FALSE:**
→ JavaScript-Problem, nicht CSS-Problem

---

### **Möglichkeit 2: Spezifität zu niedrig**
**Vergleich:**
```
Meine Regel:  #nav-menu.active          = 1,1,0 (ID + Klasse)
Andere Regel: .header .nav__menu.active = 0,3,0 (3 Klassen)
```

**Spezifität:** 1,1,0 > 0,3,0 ✅ (ID gewinnt!)

---

### **Möglichkeit 3: z-index Problem**
**z-index Hierarchie:**
```
Header:  z-index: 1000
Menü:    z-index: 1001  (höher als Header ✅)
Burger:  z-index: 1002  (höchste ✅)
Backdrop: z-index: 999  (unter Header ✅)
```

**z-index sieht korrekt aus!**

---

### **Möglichkeit 4: overflow: hidden auf parent**
**Wenn `.header` oder `.nav` `overflow: hidden` hat:**
→ Menü wird abgeschnitten

**Test nötig:**
```css
.header {
    overflow: visible !important;  /* Statt hidden */
}
```

---

### **Möglichkeit 5: Menü-Items haben keine Höhe**
**Wenn `.nav__item` oder `.nav__link` `height: 0` oder `display: none` hat:**
→ Menü existiert, aber ist 0px hoch

**Test nötig:**
```css
.nav__item {
    min-height: 50px !important;
}
```

---

### **Möglichkeit 6: Transition blockiert**
**Wenn `transition: max-height 0.4s` nicht funktioniert:**
→ Menü springt nicht auf 600px

**Test nötig:**
```css
#nav-menu.active {
    max-height: 600px !important;
    transition: none !important;  /* Sofort, keine Animation */
}
```

---

## 🔧 **NÄCHSTE SCHRITTE:**

### **Ich schlage vor:**

**Option 1: overflow: hidden auf Header entfernen**
```css
@media (max-width: 1024px) {
    .header {
        overflow: visible !important;
    }
}
```

**Option 2: Menü-Items min-height geben**
```css
#nav-menu .nav__item {
    min-height: 60px !important;
}
```

**Option 3: Transition deaktivieren (Test)**
```css
#nav-menu.active {
    transition: none !important;
    max-height: 9999px !important;  /* Garantiert groß genug */
}
```

---

## 📋 **DEBUGGING-CHECKLISTE FÜR USER:**

**Bitte in Browser testen:**

1. **F12** öffnen → **Elements** Tab
2. **Klick auf Burger-Menü**
3. **Rechtsklick auf `<ul id="nav-menu">` Element**
4. **Prüfen:**
   - [ ] Hat es die Klasse `.active`?
   - [ ] Computed Styles: `max-height: 600px` oder `0px`?
   - [ ] Computed Styles: `display: flex` oder `none`?
   - [ ] Computed Styles: `overflow: hidden` oder `auto`?
   - [ ] Computed Styles: `opacity: 1` oder `0`?
   - [ ] Computed Styles: `visibility: visible` oder `hidden`?
   - [ ] Computed Styles: `z-index: 1001`?
   - [ ] Computed Styles: `top: 70px`?
   - [ ] Box-Model: Höhe > 0px?

---

## 🎯 **VERDACHT:**

Basierend auf der Analyse vermute ich **EINES der folgenden Probleme:**

1. **`.active` Klasse wird NICHT gesetzt** (JavaScript-Problem)
2. **`.header` hat `overflow: hidden`** (schneidet Menü ab)
3. **Menü-Container hat keine Höhe** (wegen fehlender Items-Höhe)

---

**WELCHE DEBUGGING-INFO KÖNNEN SIE MIR GEBEN?**

Bitte in Browser:
```
1. F12 öffnen
2. Klick auf Burger
3. Elements Tab: <ul id="nav-menu"> Element prüfen
4. Screenshot von den "Computed" Styles machen
```

**ODER sagen Sie mir, welche der 3 Optionen ich testen soll:**
- Option 1: `.header { overflow: visible }`
- Option 2: `.nav__item { min-height: 60px }`
- Option 3: `.active { transition: none; max-height: 9999px }`

---

**Version**: 10.0
**Status**: 🔍 WARTE AUF DEBUGGING-INFO
