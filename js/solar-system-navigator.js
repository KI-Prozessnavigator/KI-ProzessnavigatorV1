/**
 * Multi-Axis Gimbal Animation - Professional SaaS Motion Design
 * ============================================================
 * Erstellt eine futuristische 3D-Gimbal-Animation mit elliptischen Ringen
 */

'use strict';

class MultiAxisGimbal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.svg = null;
        this.rings = [];
        this.animationId = null;
        this.isVisible = true;
        this.time = 0;

        this.init();
    }

    init() {
        this.createSVG();
        this.createCore();
        this.createGimbalRings();
        this.addEventListeners();
        this.animate();
        console.log('🎯 Multi-Axis Gimbal Animation initialized');
    }

    createSVG() {
        const svgNS = 'http://www.w3.org/2000/svg';
        this.svg = document.createElementNS(svgNS, 'svg');
        this.svg.setAttribute('viewBox', '-100 -100 1000 1000');
        this.svg.setAttribute('class', 'gimbal-svg');
        this.svg.setAttribute('role', 'img');
        this.svg.setAttribute('aria-label', 'Multi-Axis Gimbal Animation');

        // Defs für Neon-Glow Filter
        const defs = document.createElementNS(svgNS, 'defs');
        
        // Premium Neon Glow Filter
        const filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id', 'neon-glow');
        filter.setAttribute('x', '-100%');
        filter.setAttribute('y', '-100%');
        filter.setAttribute('width', '300%');
        filter.setAttribute('height', '300%');
        
        // Blur für Glow
        const blur1 = document.createElementNS(svgNS, 'feGaussianBlur');
        blur1.setAttribute('in', 'SourceGraphic');
        blur1.setAttribute('stdDeviation', '4');
        blur1.setAttribute('result', 'blur1');
        
        const blur2 = document.createElementNS(svgNS, 'feGaussianBlur');
        blur2.setAttribute('in', 'SourceGraphic');
        blur2.setAttribute('stdDeviation', '8');
        blur2.setAttribute('result', 'blur2');
        
        const blur3 = document.createElementNS(svgNS, 'feGaussianBlur');
        blur3.setAttribute('in', 'SourceGraphic');
        blur3.setAttribute('stdDeviation', '12');
        blur3.setAttribute('result', 'blur3');
        
        // Merge alle Blur-Effekte
        const merge = document.createElementNS(svgNS, 'feMerge');
        ['blur3', 'blur2', 'blur1', 'SourceGraphic'].forEach(input => {
            const node = document.createElementNS(svgNS, 'feMergeNode');
            node.setAttribute('in', input);
            merge.appendChild(node);
        });
        
        filter.appendChild(blur1);
        filter.appendChild(blur2);
        filter.appendChild(blur3);
        filter.appendChild(merge);
        defs.appendChild(filter);

        // Core Glow Filter (stärker)
        const coreFilter = document.createElementNS(svgNS, 'filter');
        coreFilter.setAttribute('id', 'core-glow');
        coreFilter.setAttribute('x', '-150%');
        coreFilter.setAttribute('y', '-150%');
        coreFilter.setAttribute('width', '400%');
        coreFilter.setAttribute('height', '400%');
        
        const coreBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        coreBlur.setAttribute('in', 'SourceGraphic');
        coreBlur.setAttribute('stdDeviation', '15');
        coreBlur.setAttribute('result', 'glow');
        
        const coreMerge = document.createElementNS(svgNS, 'feMerge');
        const coreMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
        coreMergeNode1.setAttribute('in', 'glow');
        const coreMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
        coreMergeNode2.setAttribute('in', 'glow');
        const coreMergeNode3 = document.createElementNS(svgNS, 'feMergeNode');
        coreMergeNode3.setAttribute('in', 'SourceGraphic');
        
        coreMerge.appendChild(coreMergeNode1);
        coreMerge.appendChild(coreMergeNode2);
        coreMerge.appendChild(coreMergeNode3);
        
        coreFilter.appendChild(coreBlur);
        coreFilter.appendChild(coreMerge);
        defs.appendChild(coreFilter);

        this.svg.appendChild(defs);
        this.container.appendChild(this.svg);
    }

    createCore() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const centerX = 400;
        const centerY = 400;

        // Äußerer Glow (größter Radius)
        const outerGlow = document.createElementNS(svgNS, 'circle');
        outerGlow.setAttribute('cx', centerX);
        outerGlow.setAttribute('cy', centerY);
        outerGlow.setAttribute('r', '90');
        outerGlow.setAttribute('fill', '#0077FF');
        outerGlow.setAttribute('opacity', '0.15');
        this.svg.appendChild(outerGlow);

        // Mittlerer Glow
        const middleGlow = document.createElementNS(svgNS, 'circle');
        middleGlow.setAttribute('cx', centerX);
        middleGlow.setAttribute('cy', centerY);
        middleGlow.setAttribute('r', '70');
        middleGlow.setAttribute('fill', '#0077FF');
        middleGlow.setAttribute('opacity', '0.3');
        this.svg.appendChild(middleGlow);

        // Core mit starkem Glow
        const core = document.createElementNS(svgNS, 'circle');
        core.setAttribute('cx', centerX);
        core.setAttribute('cy', centerY);
        core.setAttribute('r', '55');
        core.setAttribute('fill', '#0077FF');
        core.setAttribute('filter', 'url(#core-glow)');
        this.svg.appendChild(core);

        this.core = { x: centerX, y: centerY };
    }

    createGimbalRings() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const centerX = 400;
        const centerY = 400;

        // 3 Gimbal-Ringe mit unterschiedlichen Achsen und Geschwindigkeiten
        const gimbalConfig = [
            { 
                rx: 200, ry: 140, 
                rotationX: 0, rotationY: 60, rotationZ: 0,
                speed: 0.4, direction: 1,
                dashArray: '12 6',
                color: '#0077FF'
            },
            { 
                rx: 200, ry: 140, 
                rotationX: 60, rotationY: 0, rotationZ: 60,
                speed: 0.35, direction: -1,
                dashArray: '10 5',
                color: '#00A3FF'
            },
            { 
                rx: 200, ry: 140, 
                rotationX: 30, rotationY: 30, rotationZ: 120,
                speed: 0.3, direction: 1,
                dashArray: '14 7',
                color: '#00D4FF'
            }
        ];

        gimbalConfig.forEach((config, index) => {
            const ellipse = document.createElementNS(svgNS, 'ellipse');
            ellipse.setAttribute('cx', centerX);
            ellipse.setAttribute('cy', centerY);
            ellipse.setAttribute('rx', config.rx);
            ellipse.setAttribute('ry', config.ry);
            ellipse.setAttribute('fill', 'none');
            ellipse.setAttribute('stroke', config.color);
            ellipse.setAttribute('stroke-width', '2');
            ellipse.setAttribute('stroke-dasharray', config.dashArray);
            ellipse.setAttribute('opacity', '0.6');
            ellipse.setAttribute('filter', 'url(#neon-glow)');
            ellipse.setAttribute('class', `gimbal-ring gimbal-ring-${index + 1}`);
            
            this.svg.appendChild(ellipse);
            
            this.rings.push({
                element: ellipse,
                rx: config.rx,
                ry: config.ry,
                rotationX: config.rotationX,
                rotationY: config.rotationY,
                rotationZ: config.rotationZ,
                currentRotation: config.rotationZ,
                speed: config.speed,
                direction: config.direction,
                dashOffset: 0,
                centerX: centerX,
                centerY: centerY
            });
        });
    }

    addEventListeners() {
        // Intersection Observer für Performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);

        // Smooth Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Optional: Responsive Anpassungen
            }, 150);
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        this.time += 0.016; // ~60fps

        // Animiere Gimbal-Ringe
        this.rings.forEach((ring, index) => {
            // Multi-Axis Rotation (simuliert 3D-Effekt)
            ring.currentRotation += ring.speed * ring.direction * 0.1;
            
            // Kombiniere Rotationen für 3D-Effekt
            const rotX = ring.rotationX;
            const rotY = ring.rotationY;
            const rotZ = ring.currentRotation;
            
            // Pseudo-3D Transform (SVG 2D-Approximation von 3D-Rotation)
            const scaleY = Math.cos(this.time * ring.speed * 0.5 + index) * 0.2 + 0.8;
            
            ring.element.setAttribute('transform', 
                `rotate(${rotZ} ${ring.centerX} ${ring.centerY}) scale(1, ${scaleY})`
            );
            
            // Animiere Stroke-Dash-Offset für fließende Lichtwellen
            ring.dashOffset += ring.speed * ring.direction * 0.5;
            ring.element.setAttribute('stroke-dashoffset', ring.dashOffset);
            
            // Subtile Opazitäts-Variation für Tiefeneffekt
            const opacity = 0.5 + Math.sin(this.time * 0.8 + index * 1.2) * 0.15;
            ring.element.setAttribute('opacity', opacity);
            
            // Dynamische Stroke-Width für Pulsieren
            const strokeWidth = 2 + Math.sin(this.time * 1.2 + index * 0.8) * 0.3;
            ring.element.setAttribute('stroke-width', strokeWidth);
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
    const container = document.getElementById('ki-process-navigator-container');
    if (container) {
        window.multiAxisGimbal = new MultiAxisGimbal('ki-process-navigator-container');
    }
});
