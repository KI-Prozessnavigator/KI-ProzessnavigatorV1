/**
 * Hero 3D Animation - Three.js
 * ============================
 * Creates an abstract AI neural network visualization
 */

'use strict';

class Hero3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.connections = [];
        this.nodes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.animationId = null;
        this.isVisible = true;

        this.init();
    }

    init() {
        // Check for WebGL support
        if (!this.webglAvailable()) {
            this.showFallback();
            return;
        }

        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createNeuralNetwork();
        this.createParticles();
        this.addEventListeners();
        this.animate();

        console.log('🎨 Hero 3D initialized');
    }

    webglAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    showFallback() {
        // Show CSS fallback animation
        this.container.innerHTML = `
            <div class="hero-3d-fallback" role="img" aria-label="KI-Netzwerk Visualisierung">
                <div class="fallback-orb"></div>
                <div class="fallback-ring fallback-ring--1"></div>
                <div class="fallback-ring fallback-ring--2"></div>
                <div class="fallback-ring fallback-ring--3"></div>
            </div>
        `;
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);
    }

    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.z = 6;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Accessibility
        this.renderer.domElement.setAttribute('role', 'img');
        this.renderer.domElement.setAttribute('aria-label', 'Interaktive 3D-Visualisierung eines KI-Netzwerks');
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x00FFA3, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Point lights for glow effect
        const pointLight1 = new THREE.PointLight(0x00FFA3, 1, 10);
        pointLight1.position.set(2, 2, 2);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0d7377, 0.8, 10);
        pointLight2.position.set(-2, -2, 2);
        this.scene.add(pointLight2);
    }

    createNeuralNetwork() {
        // Central core
        const coreGeometry = new THREE.IcosahedronGeometry(0.8, 2);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0x00FFA3,
            emissive: 0x00FFA3,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9,
            wireframe: false
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(core);
        this.core = core;

        // Wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFA3,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireframe = new THREE.Mesh(coreGeometry, wireframeMaterial);
        wireframe.scale.setScalar(1.02);
        this.scene.add(wireframe);
        this.wireframe = wireframe;

        // Outer nodes
        const nodePositions = [
            { x: 2, y: 1.5, z: 0.5 },
            { x: -2, y: 1, z: 1 },
            { x: 1.5, y: -1.5, z: 0.8 },
            { x: -1.5, y: -1, z: -0.5 },
            { x: 0, y: 2, z: -1 },
            { x: 0.5, y: -2, z: -0.8 },
            { x: -2.5, y: 0, z: 0.3 },
            { x: 2.5, y: 0, z: -0.3 }
        ];

        const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        
        nodePositions.forEach((pos, index) => {
            const nodeMaterial = new THREE.MeshPhongMaterial({
                color: index % 2 === 0 ? 0x00FFA3 : 0x0d7377,
                emissive: index % 2 === 0 ? 0x00FFA3 : 0x0d7377,
                emissiveIntensity: 0.5
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(pos.x, pos.y, pos.z);
            node.userData = { 
                originalPos: { ...pos },
                offset: Math.random() * Math.PI * 2
            };
            this.scene.add(node);
            this.nodes.push(node);

            // Create connection line to core
            this.createConnection(new THREE.Vector3(0, 0, 0), new THREE.Vector3(pos.x, pos.y, pos.z));
        });

        // Create connections between some nodes
        for (let i = 0; i < this.nodes.length - 1; i++) {
            if (Math.random() > 0.5) {
                const startPos = this.nodes[i].position;
                const endPos = this.nodes[i + 1].position;
                this.createConnection(startPos, endPos, 0.3);
            }
        }
    }

    createConnection(start, end, opacity = 0.6) {
        const points = [start.clone(), end.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x00FFA3,
            transparent: true,
            opacity: opacity
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.connections.push({ line, start: start.clone(), end: end.clone() });
    }

    createParticles() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Spherical distribution
            const radius = 3 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Color variation (neon green to teal)
            const colorChoice = Math.random();
            if (colorChoice > 0.5) {
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 0.64; // #00FFA3
            } else {
                colors[i * 3] = 0.05;
                colors[i * 3 + 1] = 0.45;
                colors[i * 3 + 2] = 0.47; // #0d7377
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        // Mouse move for parallax effect
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change (pause when not visible)
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });

        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    handleResize() {
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        const time = Date.now() * 0.001;

        // Rotate core
        if (this.core) {
            this.core.rotation.x = time * 0.2;
            this.core.rotation.y = time * 0.3;
        }

        if (this.wireframe) {
            this.wireframe.rotation.x = -time * 0.15;
            this.wireframe.rotation.y = -time * 0.2;
        }

        // Animate nodes (floating effect)
        this.nodes.forEach((node, index) => {
            const offset = node.userData.offset;
            const originalPos = node.userData.originalPos;
            
            node.position.x = originalPos.x + Math.sin(time + offset) * 0.1;
            node.position.y = originalPos.y + Math.cos(time * 0.8 + offset) * 0.15;
            node.position.z = originalPos.z + Math.sin(time * 0.6 + offset) * 0.1;
        });

        // Update connections
        this.connections.forEach((conn, index) => {
            if (index < this.nodes.length) {
                const positions = conn.line.geometry.attributes.position.array;
                positions[3] = this.nodes[index].position.x;
                positions[4] = this.nodes[index].position.y;
                positions[5] = this.nodes[index].position.z;
                conn.line.geometry.attributes.position.needsUpdate = true;
            }
        });

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.rotation.x = time * 0.02;
        }

        // Mouse parallax effect
        this.targetRotationY = this.mouseX * 0.3;
        this.targetRotationX = this.mouseY * 0.2;

        this.scene.rotation.y += (this.targetRotationY - this.scene.rotation.y) * 0.05;
        this.scene.rotation.x += (this.targetRotationX - this.scene.rotation.x) * 0.05;

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        window.hero3D = new Hero3D('hero-3d-container');
    } else {
        console.warn('Three.js not loaded, showing fallback');
        const container = document.getElementById('hero-3d-container');
        if (container) {
            container.innerHTML = `
                <div class="hero-3d-fallback" role="img" aria-label="KI-Netzwerk Visualisierung">
                    <div class="fallback-orb"></div>
                    <div class="fallback-ring fallback-ring--1"></div>
                    <div class="fallback-ring fallback-ring--2"></div>
                    <div class="fallback-ring fallback-ring--3"></div>
                </div>
            `;
        }
    }
});

