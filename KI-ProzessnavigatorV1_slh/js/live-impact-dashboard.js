/**
 * Live Impact Dashboard
 * ====================
 * Animiert die Counter und aktualisiert sie periodisch
 */

'use strict';

class LiveImpactDashboard {
    constructor() {
        this.dashboard = document.querySelector('.live-impact-dashboard');
        if (!this.dashboard) return;

        this.counters = this.dashboard.querySelectorAll('[data-animate="counter"]');
        this.hasAnimated = false;
        
        this.init();
    }

    init() {
        this.observeVisibility();
        console.log('📊 Live Impact Dashboard initialized');
    }

    observeVisibility() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                        
                        // Starte periodische Updates nach der ersten Animation
                        setTimeout(() => {
                            this.startPeriodicUpdates();
                        }, 3000);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '0px'
            }
        );

        observer.observe(this.dashboard);
    }

    animateCounters() {
        this.counters.forEach((counter, index) => {
            const delay = parseInt(counter.dataset.delay || 0);
            
            setTimeout(() => {
                const numberElement = counter.querySelector('.stat-number');
                const target = parseInt(numberElement.dataset.target);
                
                this.animateValue(numberElement, 0, target, 2000);
            }, delay);
        });
    }

    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 
                ? 1 
                : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(start + (range * easeProgress));
            element.textContent = this.formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = this.formatNumber(end);
            }
        };

        requestAnimationFrame(updateValue);
    }

    formatNumber(num) {
        // Formatiere Zahlen mit Tausendertrennzeichen (Punkt)
        if (num >= 10000) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return num.toString();
    }

    startPeriodicUpdates() {
        // Aktualisiere die Zahlen alle 5 Sekunden leicht (simuliert Live-Daten)
        setInterval(() => {
            this.updateValues();
        }, 5000);
    }

    updateValues() {
        this.counters.forEach(counter => {
            const numberElement = counter.querySelector('.stat-number');
            const currentValue = parseInt(numberElement.textContent.replace(/\./g, ''));
            const target = parseInt(numberElement.dataset.target);
            
            // Zufällige kleine Änderung (+/- 2-5%)
            const variance = Math.floor(target * (Math.random() * 0.03 + 0.02));
            const change = Math.random() > 0.5 ? variance : -variance;
            const newValue = Math.max(Math.floor(target * 0.95), currentValue + change);
            
            // Sanfte Aktualisierung
            this.animateValue(numberElement, currentValue, newValue, 1000);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.liveImpactDashboard = new LiveImpactDashboard();
});
