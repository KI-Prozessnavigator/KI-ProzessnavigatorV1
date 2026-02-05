/**
 * KI-Prozess Navigator Animation
 * ==============================
 * Erstellt animierte Datenpartikel und interaktive Effekte
 */

'use strict';

class KIProcessNavigator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.particles = [];
        this.animationId = null;
        this.isVisible = true;
        this.svg = null;

        this.loadSVG();
    }

    async loadSVG() {
        try {
            const response = await fetch('assets/images/ki-process-navigator.svg');
            const svgText = await response.text();
            this.container.innerHTML = svgText;
            this.svg = this.container.querySelector('.ki-process-navigator');
            
            if (this.svg) {
                this.init();
            }
        } catch (error) {
            console.error('Fehler beim Laden der SVG-Grafik:', error);
            // Fallback anzeigen
            this.container.innerHTML = `
                <div class="hero-3d-fallback">
                    <div class="fallback-orb"></div>
                    <div class="fallback-ring fallback-ring--1"></div>
                    <div class="fallback-ring fallback-ring--2"></div>
                    <div class="fallback-ring fallback-ring--3"></div>
                </div>
            `;
        }
    }

    init() {
        this.createParticles();
        this.addEventListeners();
        this.animate();
        console.log('🎨 KI-Prozess Navigator initialized');
    }

    createParticles() {
        const particlesGroup = this.svg.querySelector('.data-particles');
        if (!particlesGroup) return;

        // Input connection paths (from modules to center)
        const inputPaths = [
            { start: { x: 190, y: 120 }, end: { x: 300, y: 280 } },
            { start: { x: 190, y: 220 }, end: { x: 300, y: 290 } },
            { start: { x: 190, y: 320 }, end: { x: 300, y: 300 } },
            { start: { x: 190, y: 420 }, end: { x: 300, y: 310 } },
            { start: { x: 190, y: 520 }, end: { x: 300, y: 320 } }
        ];

        // Output connection paths (from center to output modules)
        const outputPaths = [
            { start: { x: 500, y: 280 }, end: { x: 610, y: 250 } },
            { start: { x: 500, y: 320 }, end: { x: 610, y: 370 } }
        ];

        // Create particles for input connections
        inputPaths.forEach((path, index) => {
            for (let i = 0; i < 3; i++) {
                const particle = this.createParticle(path, 'input', index * 0.4 + i * 0.2);
                particlesGroup.appendChild(particle);
                this.particles.push({
                    element: particle,
                    path: path,
                    type: 'input',
                    progress: (index * 0.4 + i * 0.2) % 1,
                    speed: 0.005 + Math.random() * 0.003
                });
            }
        });

        // Create particles for output connections
        outputPaths.forEach((path, index) => {
            for (let i = 0; i < 3; i++) {
                const particle = this.createParticle(path, 'output', index * 0.4 + i * 0.2);
                particlesGroup.appendChild(particle);
                this.particles.push({
                    element: particle,
                    path: path,
                    type: 'output',
                    progress: (index * 0.4 + i * 0.2) % 1,
                    speed: 0.005 + Math.random() * 0.003
                });
            }
        });
    }

    createParticle(path, type, initialProgress) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '3');
        circle.setAttribute('class', `data-particle data-particle--${type}`);
        circle.setAttribute('opacity', '0');
        
        const initialPos = this.getPointOnPath(path, initialProgress);
        circle.setAttribute('cx', initialPos.x);
        circle.setAttribute('cy', initialPos.y);
        
        return circle;
    }

    getPointOnPath(path, progress) {
        return {
            x: path.start.x + (path.end.x - path.start.x) * progress,
            y: path.start.y + (path.end.y - path.start.y) * progress
        };
    }

    addEventListeners() {
        // Module hover effects
        const modules = this.svg.querySelectorAll('.input-module, .output-module');
        modules.forEach(module => {
            module.addEventListener('mouseenter', () => {
                this.highlightModule(module);
            });
            
            module.addEventListener('mouseleave', () => {
                this.unhighlightModule(module);
            });
        });

        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);
    }

    highlightModule(module) {
        const rect = module.querySelector('rect:first-of-type');
        if (rect) {
            rect.style.transition = 'all 0.3s ease';
            rect.style.strokeWidth = '4';
        }
    }

    unhighlightModule(module) {
        const rect = module.querySelector('rect:first-of-type');
        if (rect) {
            rect.style.strokeWidth = '2';
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        // Animate particles
        this.particles.forEach(particle => {
            particle.progress += particle.speed;
            
            if (particle.progress > 1) {
                particle.progress = 0;
            }

            const pos = this.getPointOnPath(particle.path, particle.progress);
            particle.element.setAttribute('cx', pos.x);
            particle.element.setAttribute('cy', pos.y);

            // Fade in/out at start and end
            if (particle.progress < 0.1) {
                particle.element.setAttribute('opacity', particle.progress * 8);
            } else if (particle.progress > 0.9) {
                particle.element.setAttribute('opacity', (1 - particle.progress) * 8);
            } else {
                particle.element.setAttribute('opacity', '0.8');
            }
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kiProcessNavigator = new KIProcessNavigator('ki-process-navigator-container');
});
