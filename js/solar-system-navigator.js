/**
 * Solar System Navigator - Sonnensystem-Visualisierung mit Tool-Logos
 * ===================================================================
 * Zeigt Software-Tools als rotierende Icons auf Orbital-Ringen
 */

'use strict';

class SolarSystemNavigator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.svg = null;
        this.orbits = [];
        this.icons = [];
        this.animationId = null;
        this.isVisible = true;
        this.scrollProgress = 0;
        
        // Tool-Definitionen mit Original-Logo-URLs
        this.tools = {
            // Innerster Ring - Automatisierungstools (Core)
            automation: [
                { name: 'n8n', logoUrl: 'https://n8n.io/favicon.ico', color: '#FF6D5A' },
                { name: 'OpenAI', logoUrl: 'https://cdn.simpleicons.org/openai/412991', color: '#412991' },
                { name: 'GitHub', logoUrl: 'https://cdn.simpleicons.org/github/ffffff', color: '#ffffff' }
            ],
            // Mittlerer Ring - Communication
            communication: [
                { name: 'MS Teams', logoUrl: 'https://cdn.simpleicons.org/microsoftteams/6264A7', color: '#6264A7' },
                { name: 'Slack', logoUrl: 'https://cdn.simpleicons.org/slack/4A154B', color: '#4A154B' },
                { name: 'WhatsApp', logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366', color: '#25D366' }
            ],
            // Äußerer Ring - Sales, Operations, HR
            business: [
                { name: 'HubSpot', logoUrl: 'https://cdn.simpleicons.org/hubspot/FF7A59', color: '#FF7A59' },
                { name: 'LinkedIn', logoUrl: 'https://cdn.simpleicons.org/linkedin/0A66C2', color: '#0A66C2' },
                { name: 'Mailchimp', logoUrl: 'https://cdn.simpleicons.org/mailchimp/FFE01B', color: '#FFE01B' },
                { name: 'Xentral', logoUrl: 'https://cdn.simpleicons.org/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMyMDNBOEMiLz48cGF0aCBkPSJNNiA4SDE4TTYgMTJIMThNNiAxNkgxMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=/203A8C', color: '#203A8C' },
                { name: 'Lexoffice', logoUrl: 'https://cdn.simpleicons.org/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzAwN2FmZiIvPjxwYXRoIGQ9Ik04IDhMMTYgMTZNMTYgOEw4IDE2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==/007aff', color: '#007aff' },
                { name: 'Odoo', logoUrl: 'https://cdn.simpleicons.org/odoo/714B67', color: '#714B67' },
                { name: 'Personio', logoUrl: 'https://cdn.simpleicons.org/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzI0MjQyNCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+/242424', color: '#242424' },
                { name: 'Clockodo', logoUrl: 'https://cdn.simpleicons.org/data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI5IiBzdHJva2U9IiMzQzlCRDkiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMiA3VjEyTDE1IDE1IiBzdHJva2U9IiMzQzlCRDkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+/3C9BD9', color: '#3C9BD9' }
            ]
        };

        this.init();
    }

    init() {
        this.createSVG();
        this.createSun();
        this.createOrbits();
        this.createIcons();
        this.addEventListeners();
        this.animate();
        console.log('🌟 Solar System Navigator initialized');
    }

    createSVG() {
        // Größere SVG für bessere Sichtbarkeit
        const svgNS = 'http://www.w3.org/2000/svg';
        this.svg = document.createElementNS(svgNS, 'svg');
        this.svg.setAttribute('viewBox', '0 0 800 800');
        this.svg.setAttribute('class', 'solar-system-svg');
        this.svg.setAttribute('role', 'img');
        this.svg.setAttribute('aria-label', 'Interaktives Sonnensystem der verwendeten Automatisierungs-Tools');

        // Defs für Glow-Effekte und Gradients
        const defs = document.createElementNS(svgNS, 'defs');
        
        // Glow Filter
        const filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id', 'glow');
        filter.setAttribute('x', '-50%');
        filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%');
        filter.setAttribute('height', '200%');
        
        const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '8');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        
        const feMerge = document.createElementNS(svgNS, 'feMerge');
        const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        defs.appendChild(filter);

        // Icon Glow Filter (stärker)
        const iconFilter = document.createElementNS(svgNS, 'filter');
        iconFilter.setAttribute('id', 'icon-glow');
        iconFilter.setAttribute('x', '-100%');
        iconFilter.setAttribute('y', '-100%');
        iconFilter.setAttribute('width', '300%');
        iconFilter.setAttribute('height', '300%');
        
        const iconBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        iconBlur.setAttribute('stdDeviation', '4');
        iconBlur.setAttribute('result', 'coloredBlur');
        
        const iconMerge = document.createElementNS(svgNS, 'feMerge');
        const iconMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
        iconMergeNode1.setAttribute('in', 'coloredBlur');
        const iconMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
        iconMergeNode2.setAttribute('in', 'SourceGraphic');
        
        iconMerge.appendChild(iconMergeNode1);
        iconMerge.appendChild(iconMergeNode2);
        iconFilter.appendChild(iconBlur);
        iconFilter.appendChild(iconMerge);
        defs.appendChild(iconFilter);

        this.svg.appendChild(defs);
        this.container.appendChild(this.svg);
    }

    createSun() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const centerX = 400;
        const centerY = 400;

        // Äußerer Glow
        const outerGlow = document.createElementNS(svgNS, 'circle');
        outerGlow.setAttribute('cx', centerX);
        outerGlow.setAttribute('cy', centerY);
        outerGlow.setAttribute('r', '80');
        outerGlow.setAttribute('fill', '#0077FF');
        outerGlow.setAttribute('opacity', '0.15');
        outerGlow.setAttribute('class', 'sun-glow');
        this.svg.appendChild(outerGlow);

        // Mittlerer Glow
        const middleGlow = document.createElementNS(svgNS, 'circle');
        middleGlow.setAttribute('cx', centerX);
        middleGlow.setAttribute('cy', centerY);
        middleGlow.setAttribute('r', '60');
        middleGlow.setAttribute('fill', '#0077FF');
        middleGlow.setAttribute('opacity', '0.3');
        middleGlow.setAttribute('class', 'sun-glow');
        this.svg.appendChild(middleGlow);

        // Hauptkörper - behält die blaue Farbe
        const sun = document.createElementNS(svgNS, 'circle');
        sun.setAttribute('cx', centerX);
        sun.setAttribute('cy', centerY);
        sun.setAttribute('r', '45');
        sun.setAttribute('fill', '#0077FF');
        sun.setAttribute('filter', 'url(#glow)');
        sun.setAttribute('class', 'sun-core');
        this.svg.appendChild(sun);

        this.sun = { element: sun, x: centerX, y: centerY };
    }

    createOrbits() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const centerX = 400;
        const centerY = 400;

        // Orbit-Radien (vergrößert für bessere Sichtbarkeit)
        const orbitRadii = [
            { radius: 120, tools: this.tools.automation, name: 'automation', speed: 0.0008 },
            { radius: 200, tools: this.tools.communication, name: 'communication', speed: 0.0006 },
            { radius: 280, tools: this.tools.business, name: 'business', speed: 0.0004 }
        ];

        orbitRadii.forEach((orbit, index) => {
            const circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute('cx', centerX);
            circle.setAttribute('cy', centerY);
            circle.setAttribute('r', orbit.radius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', '#0077FF');
            circle.setAttribute('stroke-width', '1.5');
            circle.setAttribute('stroke-dasharray', '8 4');
            circle.setAttribute('opacity', '0.4');
            circle.setAttribute('class', `orbit orbit-${index + 1}`);
            
            this.svg.appendChild(circle);
            this.orbits.push({
                element: circle,
                radius: orbit.radius,
                tools: orbit.tools,
                name: orbit.name,
                speed: orbit.speed
            });
        });
    }

    createIcons() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const centerX = 400;
        const centerY = 400;

        this.orbits.forEach((orbit, orbitIndex) => {
            const toolCount = orbit.tools.length;
            
            orbit.tools.forEach((tool, toolIndex) => {
                // Gleichmäßige Verteilung der Icons auf dem Ring
                const angleOffset = (Math.PI * 2 * toolIndex) / toolCount;
                
                // Icon-Gruppe
                const iconGroup = document.createElementNS(svgNS, 'g');
                iconGroup.setAttribute('class', `tool-icon tool-icon-${orbit.name}`);
                iconGroup.setAttribute('data-tool', tool.name);

                // Glow-Kreis hinter dem Icon
                const glowCircle = document.createElementNS(svgNS, 'circle');
                glowCircle.setAttribute('r', '22');
                glowCircle.setAttribute('fill', tool.color);
                glowCircle.setAttribute('opacity', '0.25');
                glowCircle.setAttribute('filter', 'url(#icon-glow)');
                iconGroup.appendChild(glowCircle);

                // Icon-Container mit transparentem Hintergrund
                const iconBg = document.createElementNS(svgNS, 'circle');
                iconBg.setAttribute('r', '18');
                iconBg.setAttribute('fill', 'rgba(255, 255, 255, 0.08)');
                iconBg.setAttribute('stroke', tool.color);
                iconBg.setAttribute('stroke-width', '2');
                iconBg.setAttribute('class', 'icon-bg');
                iconGroup.appendChild(iconBg);

                // Logo als Image (wird via CDN geladen)
                const image = document.createElementNS(svgNS, 'image');
                image.setAttribute('width', '24');
                image.setAttribute('height', '24');
                image.setAttribute('x', '-12');
                image.setAttribute('y', '-12');
                image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', tool.logoUrl);
                image.setAttribute('class', 'icon-image');
                iconGroup.appendChild(image);

                // Label unterhalb des Icons
                const label = document.createElementNS(svgNS, 'text');
                label.setAttribute('y', '32');
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('fill', '#ffffff');
                label.setAttribute('font-size', '11');
                label.setAttribute('font-weight', '600');
                label.setAttribute('opacity', '0.7');
                label.setAttribute('class', 'icon-label');
                label.textContent = tool.name;
                iconGroup.appendChild(label);

                this.svg.appendChild(iconGroup);

                this.icons.push({
                    element: iconGroup,
                    orbit: orbit,
                    tool: tool,
                    angle: angleOffset,
                    angleOffset: angleOffset,
                    orbitIndex: orbitIndex
                });
            });
        });
    }

    addEventListeners() {
        // Scroll-triggered Animation
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Icon Hover-Effekte
        this.icons.forEach(icon => {
            icon.element.addEventListener('mouseenter', () => {
                this.highlightIcon(icon);
            });
            
            icon.element.addEventListener('mouseleave', () => {
                this.unhighlightIcon(icon);
            });

            // Click-Event für Tool-Info (optional)
            icon.element.addEventListener('click', () => {
                this.showToolInfo(icon.tool);
            });
        });

        // Intersection Observer für Performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);

        // Resize Handler
        window.addEventListener('resize', this.debounce(() => {
            // Optional: Responsive Anpassungen
        }, 250));
    }

    updateScrollProgress() {
        const containerRect = this.container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Berechne Scroll-Progress (0 = oben, 1 = unten durch Viewport)
        if (containerRect.top < windowHeight && containerRect.bottom > 0) {
            this.scrollProgress = 1 - (containerRect.top / windowHeight);
            this.scrollProgress = Math.max(0, Math.min(1, this.scrollProgress));
        }
    }

    highlightIcon(icon) {
        const iconBg = icon.element.querySelector('.icon-bg');
        const label = icon.element.querySelector('.icon-label');
        
        if (iconBg) {
            iconBg.setAttribute('fill', 'rgba(255, 255, 255, 0.15)');
            iconBg.setAttribute('stroke-width', '3');
            iconBg.setAttribute('r', '20');
        }
        
        if (label) {
            label.setAttribute('opacity', '1');
            label.setAttribute('font-size', '12');
        }

        icon.element.style.cursor = 'pointer';
        icon.element.style.transition = 'all 0.3s ease';
    }

    unhighlightIcon(icon) {
        const iconBg = icon.element.querySelector('.icon-bg');
        const label = icon.element.querySelector('.icon-label');
        
        if (iconBg) {
            iconBg.setAttribute('fill', 'rgba(255, 255, 255, 0.08)');
            iconBg.setAttribute('stroke-width', '2');
            iconBg.setAttribute('r', '18');
        }
        
        if (label) {
            label.setAttribute('opacity', '0.7');
            label.setAttribute('font-size', '11');
        }
    }

    showToolInfo(tool) {
        console.log(`Tool clicked: ${tool.name}`);
        // Optional: Tooltip oder Modal mit Tool-Information anzeigen
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        const time = Date.now() * 0.001;
        const centerX = 400;
        const centerY = 400;

        // Animiere Sonne (Pulsieren)
        if (this.sun) {
            const scale = 1 + Math.sin(time * 2) * 0.05;
            this.sun.element.setAttribute('r', 45 * scale);
        }

        // Animiere Icons auf Orbits + Scroll-Effekt
        this.icons.forEach(icon => {
            // Basis-Rotation + Scroll-beschleunigte Rotation
            const baseRotation = time * icon.orbit.speed;
            const scrollBoost = this.scrollProgress * 0.002;
            const totalRotation = baseRotation + (time * scrollBoost);
            
            icon.angle = icon.angleOffset + totalRotation;

            // Position auf Orbit berechnen
            const x = centerX + Math.cos(icon.angle) * icon.orbit.radius;
            const y = centerY + Math.sin(icon.angle) * icon.orbit.radius;

            // Icon-Gruppe positionieren
            icon.element.setAttribute('transform', `translate(${x}, ${y})`);

            // Scroll-basierte Opacity-Änderung (wird sichtbarer beim Scrollen)
            const opacity = 0.6 + (this.scrollProgress * 0.4);
            icon.element.setAttribute('opacity', opacity);
        });

        // Animiere Orbits (leichtes Pulsieren)
        this.orbits.forEach((orbit, index) => {
            const dashOffset = (time * 10 * (index + 1)) % 100;
            orbit.element.setAttribute('stroke-dashoffset', dashOffset);
        });
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ki-process-navigator-container');
    if (container) {
        window.solarSystemNavigator = new SolarSystemNavigator('ki-process-navigator-container');
    }
});
