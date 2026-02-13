/**
 * KI-Prozessnavigator - Main JavaScript
 * =====================================
 * Handles interactive functionality for the landing page
 */

'use strict';

// ===== DOM Elements =====
const DOM = {
    header: document.getElementById('header'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    contactForm: document.getElementById('contact-form'),
    leadForm: document.getElementById('lead-form'),
    sections: document.querySelectorAll('section[id]'),
    faqItems: document.querySelectorAll('.faq-item'),
    scrollToTop: document.getElementById('scroll-to-top'),
    heroTitle: document.querySelector('.typewriter'),
};

// ===== State =====
const state = {
    isMenuOpen: false,
    lastScrollY: 0,
    hasTyped: false,
    theme: 'dark'
};

// ===== Utility Functions =====

function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Theme Functions =====

function initTheme() {
    // Set theme to dark permanently
    state.theme = 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
}

// ===== Navigation Functions =====

function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    
    DOM.navToggle.classList.toggle('active', state.isMenuOpen);
    DOM.navMenu.classList.toggle('active', state.isMenuOpen);
    document.body.classList.toggle('menu-open', state.isMenuOpen);
    
    DOM.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
    DOM.navToggle.setAttribute('aria-label', state.isMenuOpen ? 'Menü schließen' : 'Menü öffnen');
}

function closeMenu() {
    if (state.isMenuOpen) {
        state.isMenuOpen = false;
        DOM.navToggle.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        DOM.header.classList.add('scrolled');
    } else {
        DOM.header.classList.remove('scrolled');
    }
    
    // Show/hide scroll-to-top button
    if (DOM.scrollToTop) {
        if (scrollY > 500) {
            DOM.scrollToTop.classList.add('visible');
        } else {
            DOM.scrollToTop.classList.remove('visible');
        }
    }
    
    state.lastScrollY = scrollY;
}

function highlightActiveSection() {
    const scrollY = window.scrollY;
    const viewportMiddle = scrollY + (window.innerHeight / 2);
    
    DOM.sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + sectionHeight;
        const sectionId = section.getAttribute('id');
        
        // Prüfe ob die Mitte des Viewports in der Sektion ist
        if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function scrollToSection(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
        e.preventDefault();
        const section = document.querySelector(href);
        
        if (section) {
            const headerHeight = DOM.header.offsetHeight;
            let targetPosition = section.offsetTop - headerHeight;
            
            // DSGVO Sektion mittig positionieren
            if (href === '#dsgvo') {
                const viewportHeight = window.innerHeight;
                const sectionHeight = section.offsetHeight;
                // Zentriere die Sektion: Sektion-Mitte = Viewport-Mitte (mit 60px mehr Abstand OBEN)
                targetPosition = section.offsetTop - (viewportHeight / 2) + (sectionHeight / 2) - 60;
            }
            // Ersparnis-Sektion mittig: alles (Rechner + CTA) auf einen Blick
            if (href === '#pricing') {
                const viewportHeight = window.innerHeight;
                const sectionHeight = section.offsetHeight;
                targetPosition = section.offsetTop - (viewportHeight / 2) + (sectionHeight / 2) + 20;
            }
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            closeMenu();
        }
    }
}

function scrollToTopHandler() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== Typewriter Effect =====

function typeWriter(element, text, speed = 50) {
    if (!element || state.hasTyped) return;
    
    state.hasTyped = true;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    let isTag = false;
    let tagBuffer = '';
    
    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            
            // Handle HTML tags
            if (char === '<') {
                isTag = true;
                tagBuffer = '';
            }
            
            if (isTag) {
                tagBuffer += char;
                if (char === '>') {
                    isTag = false;
                    element.insertAdjacentHTML('beforeend', tagBuffer);
                }
            } else {
                element.insertAdjacentText('beforeend', char);
            }
            
            i++;
            setTimeout(type, isTag ? 0 : speed);
        }
    }
    
    // Start after a short delay
    setTimeout(type, 500);
}

// ===== FAQ Accordion =====

function initFAQ() {
    DOM.faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                DOM.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
                question.setAttribute('aria-expanded', !isActive);
            });
        }
    });
}

// ===== Scroll Animations =====

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate-visible');
                }, delay * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });
    
    // Observe section headers
    document.querySelectorAll('.section__header').forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });
}

// ===== Form Handling =====

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const formType = e.target.id;
    
    // Basic validation
    const email = data.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Wird gesendet...';
    submitBtn.disabled = true;
    
    // Lead-Form: Checkliste per PHP (E-Mail an Kunde + Einladung zum Termin)
    if (formType === 'lead-form') {
        sendChecklisteViaPHP(data, submitBtn, originalText, e.target);
    } else {
        // Kontaktformular - Benachrichtigung (Versand ggf. über PHP-Backend)
        setTimeout(() => {
            showNotification('✅ Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

// Checkliste per PHP (E-Mail an Kunde mit Checkliste + Calendly-Einladung)
function sendChecklisteViaPHP(data, submitBtn, originalText, form) {
    const payload = {
        email: (data.email || '').trim(),
        website: (data.website || '')  // Honeypot
    };

    fetch('php/send-checklist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(function (response) {
            return response.json().then(function (result) {
                return { ok: response.ok, result };
            });
        })
        .then(function ({ ok, result }) {
            if (ok && result.success) {
                showNotification(result.message || '🎉 Vielen Dank! Die Checkliste wurde an Ihre E-Mail gesendet – inkl. Einladung zum kostenlosen Termin.', 'success');
                form.reset();
            } else {
                showNotification(result.message || 'Fehler beim Versenden. Bitte versuchen Sie es später erneut.', 'error');
            }
        })
        .catch(function (err) {
            console.error('Checklist send error:', err);
            showNotification('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        })
        .finally(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.insertAdjacentHTML('beforeend', `
        <span class="notification__message"></span>
        <button class="notification__close" aria-label="Schließen">&times;</button>
    `);
    notification.querySelector('.notification__message').textContent = message;
    
    const colors = {
        success: 'var(--color-primary)',
        error: 'var(--color-accent)',
        info: 'var(--color-neutral-700)'
    };
    
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${colors[type]};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 400px;
        font-size: 0.9rem;
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(120%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
    
    const removeNotification = () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    };
    
    closeBtn.addEventListener('click', removeNotification);
    setTimeout(removeNotification, 5000);
}

// ===== Animation Styles =====

function injectAnimationStyles() {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        .animate-hidden {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .animate-visible {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .scroll-to-top {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        /* Typewriter cursor effect */
        .typewriter::after {
            content: '|';
            animation: blink 1s infinite;
            color: var(--color-primary);
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* Process flow animation */
        .usecase-card:hover .flow-step--ai {
            animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        /* Pricing card hover */
        .pricing-card:hover .price-amount {
            color: var(--color-primary);
            transition: color 0.3s;
        }
    `;
    document.head.appendChild(style);
}

// ===== Video Placeholder Handler =====

function initVideoPlaceholders() {
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('📹 Demo-Video wird geladen...', 'info');
            // In production: Open video modal or embed YouTube player
        });
    });
}

// ===== Animated Counter =====

function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-expo)
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (target - start) * easeOutExpo);
        
        element.textContent = current.toLocaleString('de-DE');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('de-DE');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-count]');
    
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counterElements.forEach(el => {
            counterObserver.observe(el);
        });
    }
}

// ===== Parallax Effect for Hero =====

function initParallaxEffect() {
    if (prefersReducedMotion()) return;
    
    const hero = document.querySelector('.hero');
    const hero3D = document.querySelector('.hero-3d-wrapper');
    
    if (!hero || !hero3D) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrollY < heroHeight) {
            const parallaxValue = scrollY * 0.3;
            hero3D.style.transform = `translateY(${parallaxValue}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ===== Magnetic Button Effect =====

function initMagneticButtons() {
    if (prefersReducedMotion()) return;
    
    const magneticBtns = document.querySelectorAll('.btn--neon');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== Scroll Progress Indicator =====

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-neon), var(--color-primary));
        z-index: 9999;
        transition: width 0.1s ease;
        pointer-events: none;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }, 16));
}

// ===== Card Tilt Effect =====

function initCardTiltEffect() {
    if (prefersReducedMotion()) return;
    
    // Nur Pricing Cards haben den Tilt-Effekt, Use Cases nicht
    const tiltCards = document.querySelectorAll('.pricing-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

// ===== Smooth Anchor Links =====

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', scrollToSection);
    });
}

// ===== Event Listeners =====

function initEventListeners() {
    // Mobile menu toggle
    if (DOM.navToggle) {
        DOM.navToggle.addEventListener('click', toggleMenu);
    }
    
    // Close menu when nav link is clicked
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(handleScroll, 50));
    window.addEventListener('scroll', throttle(highlightActiveSection, 100));
    
    // Form submissions
    if (DOM.contactForm) {
        DOM.contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (DOM.leadForm) {
        DOM.leadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Scroll to top
    if (DOM.scrollToTop) {
        DOM.scrollToTop.addEventListener('click', scrollToTopHandler);
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMenu();
        }
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !DOM.navMenu.contains(e.target) && 
            !DOM.navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Handle resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && state.isMenuOpen) {
            closeMenu();
        }
    }, 250));
}

// ===== Lazy Loading =====

function initLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            img.classList.add('lazy-placeholder');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Lazy load sections/components
    const lazyComponents = document.querySelectorAll('[data-lazy]');
    
    if ('IntersectionObserver' in window) {
        const componentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        lazyComponents.forEach(component => {
            componentObserver.observe(component);
        });
    }
}

// ===== Accessibility Enhancements =====

function initAccessibility() {
    // Handle focus visibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Announce dynamic content changes to screen readers
    window.announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    };
    
    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('[role="button"]').forEach(el => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
        
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
    
    // Add focus indicators for pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
    });
}

// ===== Reduced Motion Check =====

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== Contact Modal Focus Trap (A11y) =====

function initContactModalFocusTrap() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusables() {
        return Array.from(modal.querySelectorAll(FOCUSABLE)).filter(function (el) {
            return el.offsetParent !== null && !el.hasAttribute('hidden');
        });
    }

    let previousActiveElement = null;
    let trapKeydown = null;

    function attachTrap() {
        const focusables = getFocusables();
        if (focusables.length === 0) return;
        previousActiveElement = document.activeElement;
        focusables[0].focus();

        trapKeydown = function (e) {
            if (e.key !== 'Tab') return;
            const focusables = getFocusables();
            if (focusables.length === 0) return;
            const current = focusables.indexOf(document.activeElement);
            if (current === -1) {
                focusables[0].focus();
                e.preventDefault();
                return;
            }
            if (e.shiftKey) {
                if (current === 0) {
                    e.preventDefault();
                    focusables[focusables.length - 1].focus();
                }
            } else {
                if (current === focusables.length - 1) {
                    e.preventDefault();
                    focusables[0].focus();
                }
            }
        };
        document.addEventListener('keydown', trapKeydown);
    }

    function detachTrap() {
        if (trapKeydown) {
            document.removeEventListener('keydown', trapKeydown);
            trapKeydown = null;
        }
        if (previousActiveElement && typeof previousActiveElement.focus === 'function' && document.contains(previousActiveElement)) {
            previousActiveElement.focus();
        }
        previousActiveElement = null;
    }

    const observer = new MutationObserver(function (mutations) {
        const hasActive = modal.classList.contains('active');
        if (hasActive) {
            setTimeout(attachTrap, 50);
        } else {
            detachTrap();
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

// ===== Beratungsplätze-Countdown (Montag 7 → Samstag 2, Montag Reset) =====
function initBeratungsplaetzeCount() {
    const el = document.getElementById('beratungsplaetze-count');
    if (!el) return;
    const day = new Date().getDay(); // 0=Sonntag, 1=Montag, …, 6=Samstag
    const slots = day === 0 ? 2 : Math.max(2, 8 - day); // Mo=7, Di=6, …, Sa=2, So=2
    el.textContent = '\u00A0' + String(slots) + '\u00A0';
}

// ===== Vorteile/Diagnose Stepper (Problems Section) =====
function initVorteileStepper() {
    var root = document.getElementById('vorteile-stepper');
    if (!root) return;

    var buttons = Array.from(root.querySelectorAll('.vSeg[data-step]'));
    if (buttons.length === 0) return;

    var iconEl = root.querySelector('[data-stepper-icon]');
    var titleEl = root.querySelector('[data-stepper-title]');
    var metaEl = root.querySelector('[data-stepper-meta]');
    var stateEl = root.querySelector('[data-stepper-problem]');
    var fixEl = root.querySelector('[data-stepper-fix]');
    var kpiEl = root.querySelector('[data-stepper-kpi]');

    var DATA = {
        a: {
            title: 'Fachkräfte in Administrationsschleifen',
            meta: 'Messbarer Verlust: ca. 15h Routinearbeit pro Mitarbeiter/Woche.',
            state: 'Manuelle Übergaben kosten Zeit: CRM-Felder pflegen, Rechnungsdaten übertragen, Reports aus Excel zusammensuchen – jede Woche wieder.',
            fix: [
                'Prozess-Mapping: Wo entstehen manuelle Übergaben?',
                'Systemanbindung (CRM/ERP/Buchhaltung) via API/Automations',
                'Automatisierte Übergabe + Monitoring'
            ],
            kpi: { before: '15h', after: '4–5h', label: 'Routinearbeit pro Mitarbeiter/Woche' },
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
        },
        b: {
            title: 'KI-Tools ohne Systemanbindung',
            meta: 'Ergebnis: Technologie-Investition ohne Prozesseffekt.',
            state: 'Lizenzen für ChatGPT, Copilot oder spezialisierte Tools sind vorhanden. Aber: keine API-Verbindung zu CRM, ERP oder Buchhaltung. Mitarbeiter exportieren, kopieren, importieren – manuell.',
            fix: [
                'Priorisierte Integrations-Roadmap (Quick Wins zuerst)',
                'End‑to‑End Automations: Input → Verarbeitung → Zielsystem',
                'Qualitätschecks + Ownership (wer überwacht was?)'
            ],
            kpi: { before: '20%', after: '65%', label: 'Zeit für Kundenbetreuung' },
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
        },
        c: {
            title: 'Datenschutzbedenken als Innovationsbremse',
            meta: 'Konsequenz: Projekte werden gestoppt oder nie gestartet.',
            state: 'Die Rechtsabteilung blockiert KI-Projekte mit Verweis auf DSGVO-Risiken. Verständlich – ohne sauberes Setup bleibt nur „Nein“ als sichere Antwort. Das bremst Innovation und Umsetzung.',
            fix: [
                'Datenflüsse klar dokumentieren (was, wohin, warum)',
                'DSGVO-konforme Architektur & Berechtigungen',
                'Hosting in DE + Lösch-/Audit-Konzept'
            ],
            kpi: { before: 'Risiko', after: '0', label: 'DSGVO-Verstöße / Jahr (Zielbild)' },
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        }
    };

    function render(key) {
        var d = DATA[key];
        if (!d) return;

        buttons.forEach(function (btn) {
            var isActive = btn.getAttribute('data-step') === key;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.tabIndex = isActive ? 0 : -1;
        });

        if (iconEl) iconEl.innerHTML = d.icon || '';
        if (titleEl) titleEl.textContent = d.title || '';
        if (metaEl) metaEl.textContent = d.meta || '';
        if (stateEl) stateEl.textContent = d.state || '';

        if (fixEl) {
            fixEl.innerHTML = '';
            (d.fix || []).forEach(function (txt) {
                var li = document.createElement('li');
                li.textContent = txt;
                fixEl.appendChild(li);
            });
        }

        if (kpiEl) {
            var k = d.kpi || {};
            kpiEl.innerHTML =
                '<div class="vKpi">' +
                '  <span class="vKpi__values">' +
                '    <span class="vKpi__before">' + (k.before || '') + '</span>' +
                '    <span class="vKpi__arrow" aria-hidden="true">→</span>' +
                '    <span class="vKpi__after">' + (k.after || '') + '</span>' +
                '  </span>' +
                '  <small>' + (k.label || '') + '</small>' +
                '</div>';
        }
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            render(btn.getAttribute('data-step'));
        });
    });

    // Ensure first state is consistent
    render('a');
}

// ===== Initialization =====

function init() {
    // Check for reduced motion preference
    if (prefersReducedMotion()) {
        document.body.classList.add('reduce-motion');
    }
    
    // Inject animation styles
    injectAnimationStyles();
    
    // Initialize components
    initEventListeners();
    initFAQ();
    initScrollAnimations();
    initVideoPlaceholders();
    initSmoothAnchors();
    initLazyLoading();
    initAccessibility();
    initContactModalFocusTrap();
    initVorteileStepper();
    
    // Initialize enhanced features
    initAnimatedCounters();
    initScrollProgress();
    initBeratungsplaetzeCount(); // Beratungsplätze: Mo 7 → Sa 2, Mo Reset
    initUseCasesSlider(); // Use Cases Slider
    
    // Initialize motion effects (respects reduced motion)
    if (!prefersReducedMotion()) {
        initParallaxEffect();
        initMagneticButtons();
        initCardTiltEffect();
    }
    
    // Initial scroll check
    handleScroll();
    highlightActiveSection();
    
    // Typewriter effect for hero (skip if reduced motion)
    if (DOM.heroTitle && !prefersReducedMotion()) {
        const originalText = DOM.heroTitle.innerHTML;
        typeWriter(DOM.heroTitle, originalText, 40);
    }
}

// ===== Use Cases Slider =====
function initUseCasesSlider() {
    var slider = document.getElementById('usecases-slider');
    var prevBtn = document.getElementById('usecases-prev');
    var nextBtn = document.getElementById('usecases-next');
    var dotsContainer = document.getElementById('usecases-dots');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Original-Karten
    var originalCards = Array.from(slider.querySelectorAll('.usecase-card'));
    var totalCards = originalCards.length;
    
    // Klone für Endlos-Loop (3 Karten am Anfang und Ende)
    var cloneCount = 3;
    
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Hilfsfunktion: Klon erstellen und Animations-Attribute/Klassen entfernen
    // (sonst bleiben Klone durch animate-hidden unsichtbar, da der IntersectionObserver
    //  sie nie beobachtet)
    function createClone(card) {
        var clone = card.cloneNode(true);
        clone.classList.add('usecase-card--clone');
        clone.classList.remove('animate-hidden');
        clone.classList.add('animate-visible');
        clone.removeAttribute('data-animate');
        clone.removeAttribute('data-delay');
        clone.setAttribute('aria-hidden', 'true');
        return clone;
    }
    
    // Klone am Ende hinzufügen (erste 3 Karten)
    for (var i = 0; i < cloneCount; i++) {
        slider.appendChild(createClone(originalCards[i]));
    }
    
    // Klone am Anfang hinzufügen (letzte 3 Karten)
    for (var i = totalCards - 1; i >= totalCards - cloneCount; i--) {
        slider.insertBefore(createClone(originalCards[i]), slider.firstChild);
    }
    
    // Alle Karten (inkl. Klone)
    var allCards = Array.from(slider.querySelectorAll('.usecase-card'));
    
    // Konstanten
    var ANIM_MS = 800;
    var ANIM_CSS = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    var GAP = 24;
    
    // State
    var currentIndex = cloneCount; // Starte bei erster echten Karte
    var isTransitioning = false;
    var cardsPerView = getCardsPerView();
    var safetyTimer = null;
    
    // ---- Hilfsfunktionen ----
    
    function getOffset(idx) {
        if (!allCards[0]) return 0;
        return idx * (allCards[0].offsetWidth + GAP);
    }
    
    function setPosition(idx, animate) {
        var offset = getOffset(idx);
        slider.style.transition = animate ? ANIM_CSS : 'none';
        slider.style.transform = 'translateX(-' + offset + 'px)';
    }
    
    function getRealIndex() {
        return ((currentIndex - cloneCount) % totalCards + totalCards) % totalCards;
    }
    
    function updateDots() {
        if (!dotsContainer) return;
        var realIdx = getRealIndex();
        var dots = dotsContainer.querySelectorAll('.usecases__dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === realIdx);
        });
    }
    
    // ---- Sicherheits-Reset: Wenn isTransitioning >2s hängt, force-reset ----
    function startSafetyTimer() {
        clearSafetyTimer();
        safetyTimer = setTimeout(function() {
            isTransitioning = false;
        }, ANIM_MS + 1200);
    }
    
    function clearSafetyTimer() {
        if (safetyTimer) {
            clearTimeout(safetyTimer);
            safetyTimer = null;
        }
    }
    
    // ---- Zentrale Slide-Funktion: "Jump BEFORE Animate" ----
    
    function slideBy(delta, afterDone) {
        if (isTransitioning) return;
        isTransitioning = true;
        startSafetyTimer();
        
        var nextIndex = currentIndex + delta;
        
        // PRE-CHECK: Würde nextIndex in den Klon-Bereich landen?
        if (nextIndex >= cloneCount + totalCards) {
            // Vorwärts-Grenze erreicht: Repositioniere zum äquivalenten Klon am ANFANG
            // z.B. Index 16 (echte Karte 13) → Index 2 (Klon von Karte 13)
            currentIndex = currentIndex - totalCards;
            slider.classList.add('usecases__grid--no-transition');
            setPosition(currentIndex, false);
            void slider.offsetWidth; // Force Reflow
            slider.classList.remove('usecases__grid--no-transition');
        } else if (nextIndex < cloneCount) {
            // Rückwärts-Grenze erreicht: Repositioniere zum äquivalenten Klon am ENDE
            // z.B. Index 3 (echte Karte 0) → Index 17 (Klon von Karte 0)
            currentIndex = currentIndex + totalCards;
            slider.classList.add('usecases__grid--no-transition');
            setPosition(currentIndex, false);
            void slider.offsetWidth; // Force Reflow
            slider.classList.remove('usecases__grid--no-transition');
        }
        
        // JETZT normal animieren (1 Karte vorwärts/rückwärts)
        currentIndex += delta;
        setPosition(currentIndex, true);
        updateDots();
        
        // Nach Animation: Transition fertig
        setTimeout(function() {
            clearSafetyTimer();
            isTransitioning = false;
            if (afterDone) afterDone();
        }, ANIM_MS + 100);
    }
    
    function slideTo(targetRealIndex, afterDone) {
        if (isTransitioning) return;
        isTransitioning = true;
        startSafetyTimer();
        
        currentIndex = cloneCount + targetRealIndex;
        setPosition(currentIndex, true);
        updateDots();
        
        setTimeout(function() {
            clearSafetyTimer();
            isTransitioning = false;
            if (afterDone) afterDone();
        }, ANIM_MS + 100);
    }
    
    // ---- Dots ----
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.replaceChildren();
        
        for (var i = 0; i < totalCards; i++) {
            var dot = document.createElement('button');
            dot.className = 'usecases__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Gehe zu Karte ' + (i + 1));
            dot.addEventListener('click', (function(idx) {
                return function() {
                    stopAutoScroll();
                    slideTo(idx, function() {
                        resetAutoScroll();
                    });
                };
            })(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // ---- Resize ----
    
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            cardsPerView = getCardsPerView();
            applyCentering();
            setPosition(currentIndex, false);
            updateDots();
        }, 250);
    });
    
    // ---- Touch/Swipe ----
    
    var touchStartX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            stopAutoScroll();
            slideBy(diff > 0 ? 1 : -1, function() {
                resetAutoScroll();
            });
        }
    }, { passive: true });
    
    // ---- Auto-Scroll ----
    
    var autoScrollInterval = null;
    var autoScrollEnabled = true;
    
    function startAutoScroll() {
        if (!autoScrollEnabled || autoScrollInterval) return;
        
        autoScrollInterval = setInterval(function() {
            if (isTransitioning) return;
            slideBy(1);
        }, 6000);
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    function resetAutoScroll() {
        stopAutoScroll();
        if (autoScrollEnabled) {
            setTimeout(function() {
                if (autoScrollEnabled) startAutoScroll();
            }, 8000);
        }
    }
    
    // Hover pausiert Auto-Scroll
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', function() {
        if (autoScrollEnabled && !autoScrollInterval) startAutoScroll();
    });
    
    allCards.forEach(function(card) {
        card.addEventListener('mouseenter', stopAutoScroll);
        card.addEventListener('mouseleave', function() {
            if (autoScrollEnabled && !autoScrollInterval) {
                setTimeout(function() {
                    if (autoScrollEnabled && !autoScrollInterval) startAutoScroll();
                }, 2000);
            }
        });
    });
    
    // ---- Navigation Buttons ----
    
    prevBtn.addEventListener('click', function() {
        stopAutoScroll();
        slideBy(-1, function() {
            resetAutoScroll();
        });
    });
    
    nextBtn.addEventListener('click', function() {
        stopAutoScroll();
        slideBy(1, function() {
            resetAutoScroll();
        });
    });
    
    // ---- Zentrierung ----
    
    function applyCentering() {
        if (!allCards[0]) return;
        var cardWidth = allCards[0].offsetWidth;
        var wrapperElement = slider.parentElement;
        var wrapperStyle = window.getComputedStyle(wrapperElement);
        var wrapperPadding = parseFloat(wrapperStyle.paddingLeft) + parseFloat(wrapperStyle.paddingRight);
        var containerWidth = wrapperElement.offsetWidth - wrapperPadding;
        var totalVisibleWidth = (cardWidth * cardsPerView) + (GAP * (cardsPerView - 1));
        var sidePadding = Math.max(0, (containerWidth - totalVisibleWidth) / 2);
        slider.style.paddingLeft = sidePadding + 'px';
        slider.style.paddingRight = sidePadding + 'px';
    }
    
    // ---- Init ----
    
    applyCentering();
    createDots();
    setPosition(currentIndex, false);
    updateDots();
    
    setTimeout(function() {
        startAutoScroll();
    }, 1000);
}

// ===== Initialize Theme =====
initTheme();

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

