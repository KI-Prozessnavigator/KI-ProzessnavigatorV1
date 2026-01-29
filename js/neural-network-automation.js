/**
 * Process Automation Neural Network Visualization
 * ==============================================
 * Futuristische neuronale Netzwerk-Animation für Prozessautomatisierung
 */

'use strict';

class ProcessNeuralNetwork {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.svg = null;
        this.particles = [];
        this.nodes = {
            input: [],
            processing: [],
            output: []
        };
        this.connections = [];
        this.animationId = null;
        this.isVisible = true;
        this.time = 0;
        this.scrollProgress = 0;

        // Konfiguration
        this.config = {
            width: 900,
            height: 500,
            nodeSize: 18,
            particleSpeed: 0.01,
            colors: {
                primary: '#0077FF',
                email: '#00D4FF',
                form: '#00FF88',
                chat: '#FF6B9D',
                call: '#FFB800',
                ai: '#9D4EDD',
                automation: '#06FFA5',
                success: '#00FF88'
            }
        };

        // Prozess-Definitionen
        this.processes = {
            input: [
                { id: 'email', icon: '📧', label: 'E-Mail', x: 100, y: 80, color: 'email' },
                { id: 'form', icon: '📝', label: 'Formulare', x: 100, y: 180, color: 'form' },
                { id: 'chat', icon: '💬', label: 'Chat', x: 100, y: 280, color: 'chat' },
                { id: 'call', icon: '📞', label: 'Anrufe', x: 100, y: 380, color: 'call' },
                { id: 'data', icon: '📊', label: 'Daten', x: 100, y: 480, color: 'email' }
            ],
            processing: [
                { id: 'ai1', icon: '🤖', label: 'AI-Analyse', x: 350, y: 150, color: 'ai' },
                { id: 'auto', icon: '⚙️', label: 'Automation', x: 450, y: 250, color: 'automation' },
                { id: 'ai2', icon: '🧠', label: 'Intelligence', x: 350, y: 350, color: 'ai' },
                { id: 'filter', icon: '🔍', label: 'Filter', x: 550, y: 200, color: 'automation' },
                { id: 'transform', icon: '🔄', label: 'Transform', x: 550, y: 300, color: 'ai' }
            ],
            output: [
                { id: 'done', icon: '✅', label: 'Erledigt', x: 800, y: 100, color: 'success' },
                { id: 'report', icon: '📈', label: 'Reports', x: 800, y: 200, color: 'success' },
                { id: 'alert', icon: '🔔', label: 'Alerts', x: 800, y: 300, color: 'success' },
                { id: 'send', icon: '📤', label: 'Versandt', x: 800, y: 400, color: 'success' }
            ]
        };

        this.init();
    }

    init() {
        this.createSVG();
        this.createBackground();
        this.createConnections();
        this.createNodes();
        this.createParticles();
        this.addEventListeners();
        this.animate();
        console.log('🧠 Process Neural Network initialized');
    }

    createSVG() {
        const svgNS = 'http://www.w3.org/2000/svg';
        this.svg = document.createElementNS(svgNS, 'svg');
        this.svg.setAttribute('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
        this.svg.setAttribute('class', 'neural-network-svg');
        this.svg.setAttribute('role', 'img');
        this.svg.setAttribute('aria-label', 'Process Automation Neural Network');

        // Defs für Glow-Filter
        const defs = document.createElementNS(svgNS, 'defs');
        
        // Neon Glow Filter
        const filter = document.createElementNS(svgNS, 'filter');
        filter.setAttribute('id', 'neural-glow');
        filter.setAttribute('x', '-50%');
        filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%');
        filter.setAttribute('height', '200%');
        
        const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '4');
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
        
        this.svg.appendChild(defs);
        this.container.appendChild(this.svg);
    }

    createBackground() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const bgGroup = document.createElementNS(svgNS, 'g');
        bgGroup.setAttribute('class', 'neural-background');

        // Grid-Linien (dezent)
        for (let i = 0; i < this.config.width; i += 100) {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', i);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', i);
            line.setAttribute('y2', this.config.height);
            line.setAttribute('stroke', 'rgba(0, 119, 255, 0.05)');
            line.setAttribute('stroke-width', '1');
            bgGroup.appendChild(line);
        }

        for (let i = 0; i < this.config.height; i += 100) {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', i);
            line.setAttribute('x2', this.config.width);
            line.setAttribute('y2', i);
            line.setAttribute('stroke', 'rgba(0, 119, 255, 0.05)');
            line.setAttribute('stroke-width', '1');
            bgGroup.appendChild(line);
        }

        this.svg.appendChild(bgGroup);
    }

    createConnections() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const connectionsGroup = document.createElementNS(svgNS, 'g');
        connectionsGroup.setAttribute('class', 'neural-connections');

        // Input → Processing
        this.processes.input.forEach(input => {
            this.processes.processing.forEach((proc, index) => {
                // Nicht alle verbinden, nur ausgewählte für bessere Visualisierung
                if (index % 2 === 0 || Math.random() > 0.5) {
                    this.createConnection(connectionsGroup, input, proc, this.config.colors[input.color]);
                }
            });
        });

        // Processing → Processing
        for (let i = 0; i < this.processes.processing.length - 1; i++) {
            if (i % 2 === 0) {
                this.createConnection(
                    connectionsGroup,
                    this.processes.processing[i],
                    this.processes.processing[i + 1],
                    this.config.colors.automation
                );
            }
        }

        // Processing → Output
        this.processes.processing.forEach((proc, index) => {
            this.processes.output.forEach((output, outIndex) => {
                if ((index + outIndex) % 2 === 0) {
                    this.createConnection(connectionsGroup, proc, output, this.config.colors.success);
                }
            });
        });

        this.svg.appendChild(connectionsGroup);
    }

    createConnection(group, from, to, color) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const path = document.createElementNS(svgNS, 'path');
        
        const midX = (from.x + to.x) / 2;
        const d = `M ${from.x} ${from.y} Q ${midX} ${(from.y + to.y) / 2} ${to.x} ${to.y}`;
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.3');
        path.setAttribute('filter', 'url(#neural-glow)');
        path.setAttribute('class', 'neural-connection');
        
        group.appendChild(path);
        this.connections.push({ path, from, to, color });
    }

    createNodes() {
        const svgNS = 'http://www.w3.org/2000/svg';

        // Input Nodes
        const inputGroup = document.createElementNS(svgNS, 'g');
        inputGroup.setAttribute('class', 'neural-nodes neural-nodes--input');
        this.processes.input.forEach(node => {
            this.createNode(inputGroup, node, 'input');
        });
        this.svg.appendChild(inputGroup);

        // Processing Nodes
        const processingGroup = document.createElementNS(svgNS, 'g');
        processingGroup.setAttribute('class', 'neural-nodes neural-nodes--processing');
        this.processes.processing.forEach(node => {
            this.createNode(processingGroup, node, 'processing');
        });
        this.svg.appendChild(processingGroup);

        // Output Nodes
        const outputGroup = document.createElementNS(svgNS, 'g');
        outputGroup.setAttribute('class', 'neural-nodes neural-nodes--output');
        this.processes.output.forEach(node => {
            this.createNode(outputGroup, node, 'output');
        });
        this.svg.appendChild(outputGroup);
    }

    createNode(group, node, type) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const nodeGroup = document.createElementNS(svgNS, 'g');
        nodeGroup.setAttribute('class', `neural-node neural-node--${type}`);
        nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        nodeGroup.setAttribute('data-id', node.id);

        // Glow-Kreis (Hintergrund)
        const glow = document.createElementNS(svgNS, 'circle');
        glow.setAttribute('r', this.config.nodeSize + 4);
        glow.setAttribute('fill', this.config.colors[node.color]);
        glow.setAttribute('opacity', '0.2');
        glow.setAttribute('filter', 'url(#neural-glow)');
        glow.setAttribute('class', 'node-glow');
        nodeGroup.appendChild(glow);

        // Hexagon (Hauptform)
        const hexagon = this.createHexagon(this.config.nodeSize);
        hexagon.setAttribute('fill', 'rgba(20, 32, 56, 0.9)');
        hexagon.setAttribute('stroke', this.config.colors[node.color]);
        hexagon.setAttribute('stroke-width', '2');
        hexagon.setAttribute('class', 'node-hexagon');
        nodeGroup.appendChild(hexagon);

        // Icon (Text)
        const icon = document.createElementNS(svgNS, 'text');
        icon.setAttribute('text-anchor', 'middle');
        icon.setAttribute('dominant-baseline', 'central');
        icon.setAttribute('font-size', '20');
        icon.setAttribute('class', 'node-icon');
        icon.textContent = node.icon;
        nodeGroup.appendChild(icon);

        // Label
        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('y', this.config.nodeSize + 20);
        label.setAttribute('font-size', '11');
        label.setAttribute('fill', '#ffffff');
        label.setAttribute('opacity', '0.7');
        label.setAttribute('class', 'node-label');
        label.textContent = node.label;
        nodeGroup.appendChild(label);

        // Pulse-Kreis (Animation)
        const pulse = document.createElementNS(svgNS, 'circle');
        pulse.setAttribute('r', this.config.nodeSize);
        pulse.setAttribute('fill', 'none');
        pulse.setAttribute('stroke', this.config.colors[node.color]);
        pulse.setAttribute('stroke-width', '2');
        pulse.setAttribute('opacity', '0');
        pulse.setAttribute('class', 'node-pulse');
        nodeGroup.appendChild(pulse);

        group.appendChild(nodeGroup);
        this.nodes[type].push({ element: nodeGroup, data: node, pulse, glow });
    }

    createHexagon(size) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const hexagon = document.createElementNS(svgNS, 'polygon');
        const points = [];
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = size * Math.cos(angle);
            const y = size * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        
        hexagon.setAttribute('points', points.join(' '));
        return hexagon;
    }

    createParticles() {
        // Partikel für jede wichtige Verbindung erstellen
        this.connections.forEach((conn, index) => {
            if (index % 2 === 0) { // Nicht zu viele Partikel
                for (let i = 0; i < 2; i++) {
                    this.createParticle(conn, i * 0.5);
                }
            }
        });
    }

    createParticle(connection, offset) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const particle = document.createElementNS(svgNS, 'circle');
        particle.setAttribute('r', '3');
        particle.setAttribute('fill', connection.color);
        particle.setAttribute('opacity', '0');
        particle.setAttribute('filter', 'url(#neural-glow)');
        particle.setAttribute('class', 'neural-particle');
        
        this.svg.appendChild(particle);
        
        this.particles.push({
            element: particle,
            connection: connection,
            progress: offset,
            speed: this.config.particleSpeed
        });
    }

    addEventListeners() {
        // Node Hover-Effekte
        this.svg.addEventListener('mouseover', (e) => {
            const node = e.target.closest('.neural-node');
            if (node) {
                this.highlightNode(node);
            }
        });

        this.svg.addEventListener('mouseout', (e) => {
            const node = e.target.closest('.neural-node');
            if (node) {
                this.unhighlightNode(node);
            }
        });

        // Scroll-Integration
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const maxScroll = 1000;
                    this.scrollProgress = Math.min(scrollY / maxScroll, 1);
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);
    }

    highlightNode(nodeElement) {
        const glow = nodeElement.querySelector('.node-glow');
        const pulse = nodeElement.querySelector('.node-pulse');
        const label = nodeElement.querySelector('.node-label');
        
        if (glow) glow.setAttribute('opacity', '0.5');
        if (pulse) {
            pulse.setAttribute('opacity', '0.8');
            pulse.style.animation = 'neural-pulse 1s ease-out infinite';
        }
        if (label) label.setAttribute('opacity', '1');
    }

    unhighlightNode(nodeElement) {
        const glow = nodeElement.querySelector('.node-glow');
        const pulse = nodeElement.querySelector('.node-pulse');
        const label = nodeElement.querySelector('.node-label');
        
        if (glow) glow.setAttribute('opacity', '0.2');
        if (pulse) {
            pulse.setAttribute('opacity', '0');
            pulse.style.animation = 'none';
        }
        if (label) label.setAttribute('opacity', '0.7');
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        this.time += 0.01 + (this.scrollProgress * 0.02);

        // Animiere Partikel
        this.particles.forEach(particle => {
            particle.progress += particle.speed * (1 + this.scrollProgress);
            
            if (particle.progress > 1) {
                particle.progress = 0;
            }

            // Berechne Position auf Pfad
            const conn = particle.connection;
            const midX = (conn.from.x + conn.to.x) / 2;
            const t = particle.progress;
            
            // Quadratische Bezier-Kurve
            const x = (1-t)*(1-t)*conn.from.x + 2*(1-t)*t*midX + t*t*conn.to.x;
            const y = (1-t)*(1-t)*conn.from.y + 2*(1-t)*t*((conn.from.y + conn.to.y)/2) + t*t*conn.to.y;
            
            particle.element.setAttribute('cx', x);
            particle.element.setAttribute('cy', y);

            // Fade in/out
            const opacity = t < 0.1 ? t * 10 : (t > 0.9 ? (1 - t) * 10 : 0.8);
            particle.element.setAttribute('opacity', opacity);
        });

        // Processing-Nodes pulsieren
        this.nodes.processing.forEach((node, index) => {
            const phase = this.time + index * 0.5;
            const scale = 1 + Math.sin(phase) * 0.05;
            const rotation = Math.sin(phase * 0.5) * 2;
            node.element.style.transform = `translate(${node.data.x}px, ${node.data.y}px) scale(${scale}) rotate(${rotation}deg)`;
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
    window.processNeuralNetwork = new ProcessNeuralNetwork('ki-process-navigator-container');
});
