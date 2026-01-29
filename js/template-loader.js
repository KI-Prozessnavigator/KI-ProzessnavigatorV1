/**
 * Template Loader - Lädt Header und Footer dynamisch
 * ====================================================
 * Ermöglicht zentrale Verwaltung von Header und Footer
 */

'use strict';

// Template-Pfade
const TEMPLATES = {
    header: 'includes/header.html',
    footer: 'includes/footer.html'
};

/**
 * Lädt ein HTML-Template von einem Pfad
 * @param {string} path - Pfad zum Template
 * @returns {Promise<string>} - Template HTML
 */
async function loadTemplate(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Fehler beim Laden von ${path}:`, error);
        return '';
    }
}

/**
 * Lädt Header-Template
 */
async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const headerHTML = await loadTemplate(TEMPLATES.header);
        headerPlaceholder.outerHTML = headerHTML;
        
        // Trigger custom event für Header-geladen
        document.dispatchEvent(new CustomEvent('headerLoaded'));
    }
}

/**
 * Lädt Footer-Template
 */
async function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerHTML = await loadTemplate(TEMPLATES.footer);
        footerPlaceholder.outerHTML = footerHTML;
        
        // Trigger custom event für Footer-geladen
        document.dispatchEvent(new CustomEvent('footerLoaded'));
    }
}

/**
 * Initialisiert Templates beim Seitenload
 */
async function initTemplates() {
    await Promise.all([
        loadHeader(),
        loadFooter()
    ]);
    
    console.log('✅ Templates geladen (Header & Footer)');
}

// Auto-Init beim DOM-Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTemplates);
} else {
    initTemplates();
}
