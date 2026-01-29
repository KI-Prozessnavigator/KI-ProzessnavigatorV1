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
    
    DOM.sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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
            const targetPosition = section.offsetTop - headerHeight;
            
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
    element.innerHTML = '';
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
                    element.innerHTML += tagBuffer;
                }
            } else {
                element.innerHTML += char;
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
    
    // Simulate API call
    setTimeout(() => {
        if (formType === 'lead-form') {
            showNotification('🎉 Vielen Dank! Die Checkliste wird an Ihre E-Mail gesendet.', 'success');
        } else {
            showNotification('✅ Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.', 'success');
        }
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Schließen">&times;</button>
    `;
    
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
    
    // Initialize enhanced features
    initAnimatedCounters();
    initScrollProgress();
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
    
    console.log('🚀 KI-Prozessnavigator initialized');
    console.log('♿ Accessibility features enabled');
    console.log('✨ Enhanced animations enabled');
}

// ===== Use Cases Slider =====
function initUseCasesSlider() {
    const slider = document.getElementById('usecases-slider');
    const prevBtn = document.getElementById('usecases-prev');
    const nextBtn = document.getElementById('usecases-next');
    const dotsContainer = document.getElementById('usecases-dots');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Original-Karten
    const originalCards = Array.from(slider.querySelectorAll('.usecase-card'));
    const totalCards = originalCards.length;
    
    // Klone für Endlos-Loop erstellen (3 Karten am Anfang und Ende)
    const cloneCount = 3;
    
    // Klone am Ende hinzufügen (erste 3 Karten)
    for (let i = 0; i < cloneCount; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('usecase-card--clone');
        clone.setAttribute('data-clone-of', i);
        slider.appendChild(clone);
    }
    
    // Klone am Anfang hinzufügen (letzte 3 Karten)
    for (let i = totalCards - 1; i >= totalCards - cloneCount; i--) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('usecase-card--clone');
        clone.setAttribute('data-clone-of', i);
        slider.insertBefore(clone, slider.firstChild);
    }
    
    // Alle Karten (inkl. Klone)
    const allCards = Array.from(slider.querySelectorAll('.usecase-card'));
    
    // Start-Index: Überspringe die Klone am Anfang
    let currentIndex = cloneCount;
    let isTransitioning = false;
    let cardsPerView = getCardsPerView();
    
    function getCardsPerView() {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Event Listener für Transition-Ende
    let pendingTransitionCallback = null;
    
    slider.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'transform' && pendingTransitionCallback) {
            console.log('🎯 TransitionEnd Event gefeuert!');
            const callback = pendingTransitionCallback;
            pendingTransitionCallback = null;
            callback();
        }
    });
    
    function updateSlider(smooth = true, onComplete = null) {
        if (!allCards[0]) return;
        
        const cardWidth = allCards[0].offsetWidth;
        const gap = 24; // var(--space-6) = 1.5rem = 24px
        
        // EINFACHE Berechnung: Verschiebe um currentIndex Karten nach links
        const offset = currentIndex * (cardWidth + gap);
        
        // Langsame, sanfte Transition
        slider.style.transition = smooth ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        slider.style.transform = `translateX(-${offset}px)`;
        
        console.log(`📍 UpdateSlider: Index=${currentIndex} (real: ${currentIndex - cloneCount}), Offset=${offset}px, Smooth=${smooth}`);
        
        // Buttons nie deaktivieren
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Update dots
        updateDots();
        
        // Nach Transition: Callback aufrufen (mit transitionend event)
        if (smooth && onComplete) {
            pendingTransitionCallback = onComplete;
            // Fallback falls transitionend nicht feuert
            setTimeout(() => {
                if (pendingTransitionCallback === onComplete) {
                    console.log('⚠️ Fallback timeout - transitionend nicht gefeuert');
                    pendingTransitionCallback = null;
                    onComplete();
                }
            }, 1000);
        } else if (!smooth && onComplete) {
            // Kein smooth = sofort callback
            onComplete();
        }
    }
    
    function handleInfiniteLoopJump() {
        console.log(`🔍 Prüfe Loop: currentIndex=${currentIndex}, Grenze=${cloneCount + totalCards} (${cloneCount}+${totalCards})`);
        
        // Wenn wir bei den Klonen am Ende sind (nach Karte 10)
        if (currentIndex >= cloneCount + totalCards) {
            console.log(`🔄🔄🔄 ENDLOS-LOOP AKTIV! ${currentIndex} >= ${cloneCount + totalCards}`);
            console.log(`🔄 Springe von Index ${currentIndex} zu Index ${cloneCount}`);
            
            // Springe instant zurück zur echten ersten Karte
            currentIndex = cloneCount;
            
            const cardWidth = allCards[0].offsetWidth;
            const gap = 24;
            const offset = currentIndex * (cardWidth + gap);
            
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${offset}px)`;
            updateDots();
            
            // Force reflow
            void slider.offsetHeight;
            
            console.log(`✅ Loop abgeschlossen! Neue Position: ${currentIndex}`);
            return true;
        }
        // Wenn wir bei den Klonen am Anfang sind (vor Karte 1)
        else if (currentIndex < cloneCount) {
            console.log(`🔄🔄🔄 ENDLOS-LOOP AKTIV! ${currentIndex} < ${cloneCount}`);
            console.log(`🔄 Springe von Index ${currentIndex} zu Index ${cloneCount + totalCards - 1}`);
            
            // Springe instant zur echten letzten Karte
            currentIndex = cloneCount + totalCards - 1;
            
            const cardWidth = allCards[0].offsetWidth;
            const gap = 24;
            const offset = currentIndex * (cardWidth + gap);
            
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${offset}px)`;
            updateDots();
            
            // Force reflow
            void slider.offsetHeight;
            
            console.log(`✅ Loop abgeschlossen! Neue Position: ${currentIndex}`);
            return true;
        }
        
        console.log(`➖ Kein Loop nötig`);
        return false;
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'usecases__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Gehe zu Karte ${i + 1}`);
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                stopAutoScroll();
                
                // Setze auf echte Karte (nicht Klon)
                currentIndex = cloneCount + i;
                updateSlider(true);
                
                setTimeout(() => {
                    isTransitioning = false;
                    resetAutoScroll();
                }, 1000);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.usecases__dot');
        
        // Berechne echten Index (ohne Klone): 0-9 für 10 Karten
        let realIndex = currentIndex - cloneCount;
        
        // Normalisiere für Klone
        if (realIndex < 0) {
            realIndex = totalCards + realIndex;
        } else if (realIndex >= totalCards) {
            realIndex = realIndex - totalCards;
        }
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const oldCardsPerView = cardsPerView;
            cardsPerView = getCardsPerView();
            
            if (oldCardsPerView !== cardsPerView) {
                console.log(`📱 Resize: cardsPerView changed from ${oldCardsPerView} to ${cardsPerView}`);
            }
            
            applyCentering();
            updateSlider(false);
        }, 250);
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (isTransitioning) return;
        
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            isTransitioning = true;
            stopAutoScroll();
            
            if (diff > 0) {
                currentIndex++;
            } else {
                currentIndex--;
            }
            
            updateSlider(true, () => {
                handleInfiniteLoopJump();
                isTransitioning = false;
                resetAutoScroll();
            });
        }
    }
    
    // Auto-scroll feature - eine Karte alle 6 Sekunden
    let autoScrollInterval;
    let isAutoScrollActive = true;
    
    function startAutoScroll() {
        if (!isAutoScrollActive || autoScrollInterval) return;
        
        console.log('✅ Auto-Scroll gestartet (alle 6 Sekunden)');
        
        autoScrollInterval = setInterval(() => {
            if (isTransitioning) {
                console.log('⏸️ Auto-Scroll übersprungen (isTransitioning=true)');
                return;
            }
            
            isTransitioning = true;
            
            // Eine Karte vorwärts
            const oldIndex = currentIndex;
            currentIndex++;
            console.log(`➡️ Auto-Scroll: ${oldIndex} → ${currentIndex} (Soll bei ${cloneCount + totalCards} zurückspringen)`);
            
            // Animiere und dann prüfe Loop
            updateSlider(true, () => {
                // Nach Animation: Prüfe ob wir bei Klonen sind
                const looped = handleInfiniteLoopJump();
                if (looped) {
                    console.log(`✅ Loop ausgeführt, neue Position: ${currentIndex}`);
                }
                isTransitioning = false;
            });
            
        }, 6000); // Alle 6 Sekunden
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    function resetAutoScroll() {
        stopAutoScroll();
        if (isAutoScrollActive) {
            // Längere Pause nach manueller Interaktion
            setTimeout(() => {
                if (isAutoScrollActive) {
                    startAutoScroll();
                }
            }, 8000); // Restart nach 8 Sekunden Pause
        }
    }
    
    // Pausiere Auto-Scroll bei Hover über Slider oder Karten
    slider.addEventListener('mouseenter', () => {
        stopAutoScroll();
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isAutoScrollActive) {
            startAutoScroll();
        }
    });
    
    // Pausiere bei Hover über alle Karten (inkl. Klone)
    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            stopAutoScroll();
        });
        card.addEventListener('mouseleave', () => {
            if (isAutoScrollActive && !autoScrollInterval) {
                setTimeout(() => {
                    if (isAutoScrollActive && !autoScrollInterval) {
                        startAutoScroll();
                    }
                }, 2000);
            }
        });
    });
    
    // Pausiere Auto-Scroll bei manueller Interaktion
    // Manuelle Navigation mit Pfeilen
    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        stopAutoScroll();
        
        currentIndex--;
        updateSlider(true, () => {
            handleInfiniteLoopJump();
            isTransitioning = false;
            resetAutoScroll();
        });
    });
    
    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        stopAutoScroll();
        
        currentIndex++;
        updateSlider(true, () => {
            handleInfiniteLoopJump();
            isTransitioning = false;
            resetAutoScroll();
        });
    });
    
    // Funktion um Zentrierung zu berechnen und anzuwenden
    function applyCentering() {
        if (!allCards[0]) return;
        
        const cardWidth = allCards[0].offsetWidth;
        const gap = 24;
        // Wrapper hat padding, also innere Breite verwenden
        const wrapperElement = slider.parentElement;
        const wrapperStyle = window.getComputedStyle(wrapperElement);
        const wrapperPadding = parseFloat(wrapperStyle.paddingLeft) + parseFloat(wrapperStyle.paddingRight);
        const containerWidth = wrapperElement.offsetWidth - wrapperPadding;
        
        const totalVisibleWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1));
        const sidePadding = Math.max(0, (containerWidth - totalVisibleWidth) / 2);
        
        // Setze Padding auf den Grid für Zentrierung
        slider.style.paddingLeft = `${sidePadding}px`;
        slider.style.paddingRight = `${sidePadding}px`;
        
        console.log(`📐 Zentrierung: Container=${containerWidth}px (ohne wrapper padding), Visible=${totalVisibleWidth}px, Padding=${sidePadding}px`);
    }
    
    // Initialize
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 UseCase Slider Initialisierung`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Total Cards (original): ${totalCards}`);
    console.log(`📊 Clone Count: ${cloneCount}`);
    console.log(`📊 Alle Karten (inkl. Klone): ${allCards.length}`);
    console.log(`📊 Cards Per View: ${cardsPerView}`);
    console.log(`📊 Start Index: ${currentIndex} (sollte ${cloneCount} sein für erste echte Karte)`);
    console.log(`📊 Loop-Grenze: Index >= ${cloneCount + totalCards} (${cloneCount} + ${totalCards})`);
    console.log(`${'='.repeat(60)}\n`);
    
    applyCentering();
    createDots();
    updateSlider(false); // Initial ohne Animation
    
    // Kleine Verzögerung vor Auto-Scroll Start
    setTimeout(() => {
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
