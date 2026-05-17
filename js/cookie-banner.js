'use strict';

(function() {
    const CONFIG = {
        STORAGE_KEY: 'ki-navigator-cookie-consent',
        CONSENT_VERSION: '1.0', // Erhöhen bei Änderungen an Cookie-Kategorien
        CONSENT_DURATION_DAYS: 365,
        CATEGORIES: ['essential', 'analytics', 'marketing', 'external']
    };

    const elements = {
        banner: document.getElementById('cookie-banner'),
        modal: document.getElementById('cookie-modal'),
        modalBackdrop: document.getElementById('cookie-modal-backdrop'),
        modalClose: document.getElementById('cookie-modal-close'),
        
        acceptAllBtn: document.getElementById('cookie-accept-all'),
        essentialOnlyBtn: document.getElementById('cookie-essential-only'),
        settingsBtn: document.getElementById('cookie-settings'),
        
        saveSelectionBtn: document.getElementById('cookie-save-selection'),
        modalAcceptAllBtn: document.getElementById('cookie-modal-accept-all'),
        
        analyticsToggle: document.getElementById('cookie-analytics'),
        marketingToggle: document.getElementById('cookie-marketing'),
        externalToggle: document.getElementById('cookie-external')
    };

    let currentConsent = {
        essential: true, // Immer true
        analytics: false,
        marketing: false,
        external: false
    };

    /**
     * Lädt gespeicherte Einstellungen
     */
    function loadConsent() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!stored) return null;
            
            const data = JSON.parse(stored);
            
            // Prüfe ob Consent noch gültig ist
            if (data.expiry && new Date(data.expiry) < new Date()) {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                return null;
            }
            
            // Prüfe Consent-Version
            if (data.version !== CONFIG.CONSENT_VERSION) {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                return null;
            }
            
            return data;
        } catch (e) {
            console.error('Cookie consent load error:', e);
            return null;
        }
    }

    /**
     * Speichert Consent-Einstellungen
     */
    function saveConsent(consent) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + CONFIG.CONSENT_DURATION_DAYS);
        
        const data = {
            version: CONFIG.CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            expiry: expiry.toISOString(),
            consent: {
                essential: true, // Immer true
                analytics: consent.analytics || false,
                marketing: consent.marketing || false,
                external: consent.external || false
            }
        };
        
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            currentConsent = data.consent;

            // dataLayer Consent Update (für GTM/Consent Mode)
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'consent_update',
                analytics_storage: data.consent.analytics ? 'granted' : 'denied',
                ad_storage: data.consent.marketing ? 'granted' : 'denied',
                ad_user_data: data.consent.marketing ? 'granted' : 'denied',
                ad_personalization: data.consent.marketing ? 'granted' : 'denied'
            });
            
            // Trigger Custom Event für andere Scripts
            window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
                detail: data.consent
            }));
            
            // Apply consent (aktiviere/deaktiviere Tracking)
            applyConsent(data.consent);
            
        } catch (e) {
            console.error('Cookie consent save error:', e);
        }
    }

    /**
     * Wendet Consent-Einstellungen an
     * Hier können externe Tracking-Scripte aktiviert/deaktiviert werden
     */
    function applyConsent(consent) {
        // Google Analytics
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied',
                'ad_user_data': consent.marketing ? 'granted' : 'denied',
                'ad_personalization': consent.marketing ? 'granted' : 'denied'
            });
        }
        
        // Facebook Pixel
        if (typeof window.fbq === 'function') {
            if (consent.marketing) {
                window.fbq('consent', 'grant');
            } else {
                window.fbq('consent', 'revoke');
            }
        }
        
        // Setze data-attribute für CSS-basiertes Blocking
        document.documentElement.setAttribute('data-consent-analytics', consent.analytics);
        document.documentElement.setAttribute('data-consent-marketing', consent.marketing);
        document.documentElement.setAttribute('data-consent-external', consent.external);
    }

    // ==========================================
    // UI Functions
    // ==========================================

    /**
     * Zeigt das Banner an
     */
    function showBanner() {
        if (elements.banner) {
            elements.banner.removeAttribute('hidden');
            elements.banner.style.animation = 'slideUp 0.5s ease forwards';
        }
    }

    /**
     * Versteckt das Banner
     */
    function hideBanner() {
        if (elements.banner) {
            elements.banner.style.animation = 'none';
            elements.banner.style.transform = 'translateY(100%)';
            elements.banner.style.opacity = '0';
            elements.banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            
            setTimeout(() => {
                elements.banner.setAttribute('hidden', '');
            }, 300);
        }
    }

    /**
     * Öffnet das Einstellungs-Modal
     */
    function openModal() {
        if (elements.modal) {
            // Lade aktuelle Einstellungen in Toggles
            updateTogglesFromConsent();
            
            elements.modal.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus Trap
            elements.modalClose?.focus();
        }
    }

    /**
     * Schließt das Einstellungs-Modal
     */
    function closeModal() {
        if (elements.modal) {
            elements.modal.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }
    }

    /**
     * Aktualisiert die Toggles basierend auf aktuellen Consent-Einstellungen
     */
    function updateTogglesFromConsent() {
        if (elements.analyticsToggle) {
            elements.analyticsToggle.checked = currentConsent.analytics;
        }
        if (elements.marketingToggle) {
            elements.marketingToggle.checked = currentConsent.marketing;
        }
        if (elements.externalToggle) {
            elements.externalToggle.checked = currentConsent.external;
        }
    }

    /**
     * Liest Consent-Einstellungen aus den Toggles
     */
    function getConsentFromToggles() {
        return {
            essential: true,
            analytics: elements.analyticsToggle?.checked || false,
            marketing: elements.marketingToggle?.checked || false,
            external: elements.externalToggle?.checked || false
        };
    }

    // ==========================================
    // Event Handlers
    // ==========================================

    /**
     * Alle Cookies akzeptieren
     */
    function handleAcceptAll() {
        saveConsent({
            essential: true,
            analytics: true,
            marketing: true,
            external: true
        });
        hideBanner();
        closeModal();
    }

    /**
     * Nur notwendige Cookies
     */
    function handleEssentialOnly() {
        saveConsent({
            essential: true,
            analytics: false,
            marketing: false,
            external: false
        });
        hideBanner();
        closeModal();
    }

    /**
     * Ausgewählte Cookies speichern
     */
    function handleSaveSelection() {
        const consent = getConsentFromToggles();
        saveConsent(consent);
        hideBanner();
        closeModal();
    }

    /**
     * Einstellungen öffnen
     */
    function handleOpenSettings() {
        openModal();
    }

    // ==========================================
    // Initialization
    // ==========================================

    function init() {
        // Prüfe ob bereits Consent erteilt wurde
        const stored = loadConsent();
        
        if (stored && stored.consent) {
            // Consent vorhanden - anwenden und Banner nicht zeigen
            currentConsent = stored.consent;
            applyConsent(currentConsent);
            
            if (elements.banner) {
                elements.banner.setAttribute('hidden', '');
            }
        } else {
            // Kein Consent - Banner zeigen
            showBanner();
            
            // Default: Alle Cookies blockieren bis Consent erteilt
            applyConsent({
                essential: true,
                analytics: false,
                marketing: false,
                external: false
            });
        }
        
        // Event Listeners - Banner
        elements.acceptAllBtn?.addEventListener('click', handleAcceptAll);
        elements.essentialOnlyBtn?.addEventListener('click', handleEssentialOnly);
        elements.settingsBtn?.addEventListener('click', handleOpenSettings);
        
        // Event Listeners - Modal
        elements.saveSelectionBtn?.addEventListener('click', handleSaveSelection);
        elements.modalAcceptAllBtn?.addEventListener('click', handleAcceptAll);
        elements.modalClose?.addEventListener('click', closeModal);
        elements.modalBackdrop?.addEventListener('click', closeModal);
        
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (elements.modal && !elements.modal.hasAttribute('hidden')) {
                    closeModal();
                }
            }
        });
    }

    // ==========================================
    // Public API
    // ==========================================

    /**
     * Öffentliche Methode zum Öffnen der Cookie-Einstellungen
     * Kann über Footer-Link aufgerufen werden
     */
    window.openCookieSettings = function() {
        // Zeige Banner wieder
        if (elements.banner) {
            elements.banner.removeAttribute('hidden');
            elements.banner.style.transform = '';
            elements.banner.style.opacity = '';
            elements.banner.style.transition = '';
            elements.banner.style.animation = 'slideUp 0.5s ease forwards';
        }
        
        // Öffne Modal
        openModal();
    };

    /**
     * Prüft ob eine bestimmte Cookie-Kategorie erlaubt ist
     */
    window.hasCookieConsent = function(category) {
        return currentConsent[category] || false;
    };

    /**
     * Gibt alle aktuellen Consent-Einstellungen zurück
     */
    window.getCookieConsent = function() {
        return { ...currentConsent };
    };

    // ==========================================
    // Start
    // ==========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
