/**
 * Atelier & Grain - Interactive 3D Furniture Visualizer
 * Real-time Three.js rendering engine with procedural timber grain generation,
 * dynamic geometry synthesis, realistic PBR materials, lighting presets, and camera controls.
 */

class FurnitureStudio3D {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.furnitureGroup = new THREE.Group();
        this.floorGroup = new THREE.Group();
        this.lights = {};
        this.activeConfig = null;
        this.woodTexture = null;
        this.bumpTexture = null;
        this.isExploded = false;
        this.currentLighting = 'studio';

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x131211);
        this.scene.fog = new THREE.FogExp2(0x131211, 0.08);

        // Camera setup
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
        this.camera.position.set(3.2, 2.2, 3.6);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // Orbit Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // prevent going under floor
        this.controls.minDistance = 1.2;
        this.controls.maxDistance = 8.0;
        this.controls.target.set(0, 0.75, 0);

        // Add groups
        this.scene.add(this.furnitureGroup);
        this.scene.add(this.floorGroup);

        this.setupLighting();
        this.setupFloor();
        this.setupResizeListener();
        this.animate();
    }

    setupLighting() {
        // Ambient soft fill
        const ambient = new THREE.AmbientLight(0xfff7ed, 0.65);
        this.scene.add(ambient);
        this.lights.ambient = ambient;

        // Key Light (warm studio flood)
        const keyLight = new THREE.DirectionalLight(0xfffaed, 1.4);
        keyLight.position.set(4, 5, 3.5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.0005;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 15;
        keyLight.shadow.camera.left = -3;
        keyLight.shadow.camera.right = 3;
        keyLight.shadow.camera.top = 3;
        keyLight.shadow.camera.bottom = -3;
        this.scene.add(keyLight);
        this.lights.keyLight = keyLight;

        // Fill Light (soft cool reflection)
        const fillLight = new THREE.DirectionalLight(0xced8e8, 0.45);
        fillLight.position.set(-4, 3, -2);
        this.scene.add(fillLight);
        this.lights.fillLight = fillLight;

        // Rim / Backlight for sculptural contour separation
        const rimLight = new THREE.SpotLight(0xffd59e, 0.9, 12, Math.PI / 5, 0.4);
        rimLight.position.set(-2, 4, 3);
        rimLight.target = this.furnitureGroup;
        this.scene.add(rimLight);
        this.lights.rimLight = rimLight;
    }

    setupFloor() {
        // Luxury studio floor with soft subtle reflection ring
        const floorGeo = new THREE.PlaneGeometry(20, 20);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x181615,
            roughness: 0.85,
            metalness: 0.1
        });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = 0;
        floorMesh.receiveShadow = true;
        this.floorGroup.add(floorMesh);

        // Circular pedestal shadow catcher
        const circleGeo = new THREE.CircleGeometry(2.4, 64);
        const circleMat = new THREE.MeshStandardMaterial({
            color: 0x1f1d1b,
            roughness: 0.6,
            metalness: 0.05
        });
        const circleMesh = new THREE.Mesh(circleGeo, circleMat);
        circleMesh.rotation.x = -Math.PI / 2;
        circleMesh.position.y = 0.002;
        circleMesh.receiveShadow = true;
        this.floorGroup.add(circleMesh);
    }

    setLightingEnvironment(envName) {
        this.currentLighting = envName;
        if (envName === 'studio') {
            this.scene.background = new THREE.Color(0x131211);
            this.scene.fog.color.setHex(0x131211);
            this.lights.ambient.color.setHex(0xfff7ed);
            this.lights.ambient.intensity = 0.65;
            this.lights.keyLight.color.setHex(0xfffaed);
            this.lights.keyLight.intensity = 1.4;
            this.lights.rimLight.color.setHex(0xffd59e);
            this.lights.rimLight.intensity = 0.9;
        } else if (envName === 'golden-hour') {
            this.scene.background = new THREE.Color(0x1c1510);
            this.scene.fog.color.setHex(0x1c1510);
            this.lights.ambient.color.setHex(0xff9944);
            this.lights.ambient.intensity = 0.8;
            this.lights.keyLight.color.setHex(0xffad54);
            this.lights.keyLight.intensity = 1.9;
            this.lights.rimLight.color.setHex(0xff7722);
            this.lights.rimLight.intensity = 1.2;
        } else if (envName === 'minimal-gallery') {
            this.scene.background = new THREE.Color(0x0e0e0f);
            this.scene.fog.color.setHex(0x0e0e0f);
            this.lights.ambient.color.setHex(0xeeeeee);
            this.lights.ambient.intensity = 0.45;
            this.lights.keyLight.color.setHex(0xffffff);
            this.lights.keyLight.intensity = 1.6;
            this.lights.rimLight.color.setHex(0x99ccff);
            this.lights.rimLight.intensity = 0.6;
        }
    }

    /**
     * Generates a high-fidelity procedural wood grain texture on an offscreen canvas
     * tailored to the chosen species, rings, cathedrals, and color stains.
     */
    generateWoodTexture(woodData, finishData) {
        const width = 1024;
        const height = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, woodData.baseColor);
        grad.addColorStop(0.5, woodData.secondaryColor);
        grad.addColorStop(1, woodData.highlightColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Procedural wood rings and cathedral grain lines
        const numRings = Math.floor(woodData.grainFrequency * 4);
        ctx.lineWidth = 1.2;

        for (let i = 0; i < numRings; i++) {
            const y = (i / numRings) * height;
            ctx.beginPath();
            ctx.strokeStyle = i % 2 === 0 ? woodData.secondaryColor : woodData.highlightColor;
            ctx.globalAlpha = 0.35 + Math.sin(i * 0.4) * 0.15;

            // Curved grain cathedral waveform
            ctx.moveTo(0, y);
            for (let x = 0; x <= width; x += 32) {
                const wave1 = Math.sin((x / width) * Math.PI * 3 + i * 0.2) * 22;
                const wave2 = Math.cos((x / width) * Math.PI * 6) * 8;
                const cathedralPeak = Math.exp(-Math.pow((x - width * 0.48) / 180, 2)) * 45;
                ctx.lineTo(x, y + wave1 + wave2 + (i % 3 === 0 ? cathedralPeak : 0));
            }
            ctx.stroke();
        }

        // Medullary rays / pore flecks
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = woodData.secondaryColor;
        for (let j = 0; j < 3500; j++) {
            const px = Math.random() * width;
            const py = Math.random() * height;
            const pLen = 6 + Math.random() * 20;
            ctx.fillRect(px, py, 1.2, pLen);
        }

        // Apply chosen finish tint overlay
        if (finishData && finishData.opacity > 0) {
            ctx.globalAlpha = finishData.opacity;
            ctx.fillStyle = finishData.tintHex;
            ctx.fillRect(0, 0, width, height);
        }

        // Reset alpha
        ctx.globalAlpha = 1.0;

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1.5, 1.5);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * Builds the procedural 3D model according to current configuration
     */
    updateModel(config) {
        this.activeConfig = config;

        // Clear existing furniture mesh
        while (this.furnitureGroup.children.length > 0) {
            const obj = this.furnitureGroup.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
            this.furnitureGroup.remove(obj);
        }

        // Generate wood materials
        const woodTexture = this.generateWoodTexture(config.wood, config.finish);
        this.woodTexture = woodTexture;

        const woodMaterial = new THREE.MeshStandardMaterial({
            map: woodTexture,
            roughness: config.wood.roughness,
            metalness: config.wood.metalness,
            bumpScale: 0.04
        });

        // Determine base/leg material
        let legMaterial;
        if (config.leg.colorHex === null) {
            // Matching solid wood
            legMaterial = woodMaterial;
        } else {
            legMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(config.leg.colorHex),
                roughness: config.leg.roughness,
                metalness: config.leg.metalness
            });
        }

        // Build based on product type
        switch (config.product.id) {
            case 'dining-table':
                this.buildDiningTable(config, woodMaterial, legMaterial);
                break;
            case 'lounge-chair':
                this.buildLoungeChair(config, woodMaterial, legMaterial);
                break;
            case 'executive-desk':
                this.buildExecutiveDesk(config, woodMaterial, legMaterial);
                break;
            case 'coffee-table':
                this.buildCoffeeTable(config, woodMaterial, legMaterial);
                break;
            default:
                this.buildDiningTable(config, woodMaterial, legMaterial);
        }

        // Re-center target
        this.controls.target.set(0, 0.72, 0);
    }

    /**
     * Synthesizes 3D Dining Table with selected edge profile, live-edge curvature, and legs
     */
    buildDiningTable(config, woodMat, legMat) {
        const length = (config.dimensions.length / 100); // meters
        const width = (config.dimensions.width / 100);
        const thickness = (config.dimensions.thickness / 100);
        const tableHeight = 0.75;

        // Tabletop slab
        let topGeo;
        if (config.style.id === 'live-edge') {
            // Sculpted organic slab with rounded wavy edge profiles
            const shape = new THREE.Shape();
            const halfL = length / 2;
            const halfW = width / 2;
            const segments = 16;

            // Generate organic perimeter
            shape.moveTo(-halfL, -halfW);
            // Front live edge with organic ripples
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = -halfL + t * length;
                const ripple = Math.sin(t * Math.PI * 4) * 0.035 + Math.cos(t * Math.PI * 2) * 0.02;
                shape.lineTo(x, -halfW + ripple);
            }
            shape.lineTo(halfL, halfW);
            // Back live edge with organic ripples
            for (let i = segments - 1; i >= 0; i--) {
                const t = i / segments;
                const x = -halfL + t * length;
                const ripple = Math.sin(t * Math.PI * 3 + 1.2) * 0.03 - Math.cos(t * Math.PI * 2) * 0.015;
                shape.lineTo(x, halfW + ripple);
            }
            shape.closePath();

            const extrudeSettings = {
                depth: thickness,
                bevelEnabled: true,
                bevelSegments: 4,
                steps: 2,
                bevelSize: 0.012,
                bevelThickness: 0.012
            };
            topGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            topGeo.rotateX(Math.PI / 2);
        } else {
            // Minimalist / Trestle / Pedestal Rectangular or Beveled Slab
            topGeo = new THREE.BoxGeometry(length, thickness, width, 8, 2, 8);
        }

        const topMesh = new THREE.Mesh(topGeo, woodMat);
        topMesh.position.y = tableHeight;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        this.furnitureGroup.add(topMesh);

        // Add brass butterfly bowties if addon selected
        if (config.addons && config.addons.includes('brass-bowtie')) {
            const brassMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                roughness: 0.25,
                metalness: 0.85
            });

            [-0.35, 0.4].forEach(xOff => {
                const bowtie = this.createBowtieMesh(brassMat);
                bowtie.position.set(length * xOff, tableHeight + thickness / 2 + 0.002, 0.05);
                bowtie.rotation.y = Math.PI / 4 + Math.random() * 0.2;
                this.furnitureGroup.add(bowtie);
            });
        }

        // Add Base / Legs
        const legSpacingX = length * 0.65;
        const legSpacingZ = width * 0.6;
        const legH = tableHeight - thickness / 2;

        if (config.leg.id === 'steel-black' || config.leg.id === 'brushed-brass') {
            // Trapezoid architectural blade legs
            [-legSpacingX / 2, legSpacingX / 2].forEach(x => {
                const trapShape = new THREE.Shape();
                const topW = width * 0.7;
                const botW = width * 0.85;
                trapShape.moveTo(-topW / 2, 0);
                trapShape.lineTo(topW / 2, 0);
                trapShape.lineTo(botW / 2, -legH);
                trapShape.lineTo(-botW / 2, -legH);
                trapShape.closePath();

                // Hollow inner opening
                const hole = new THREE.Path();
                const innerTopW = topW - 0.12;
                const innerBotW = botW - 0.12;
                const innerH = legH - 0.1;
                hole.moveTo(-innerTopW / 2, -0.05);
                hole.lineTo(innerTopW / 2, -0.05);
                hole.lineTo(innerBotW / 2, -innerH);
                hole.lineTo(-innerBotW / 2, -innerH);
                hole.closePath();
                trapShape.holes.push(hole);

                const trapGeo = new THREE.ExtrudeGeometry(trapShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004 });
                const trapMesh = new THREE.Mesh(trapGeo, legMat);
                trapMesh.rotation.y = Math.PI / 2;
                trapMesh.position.set(x, tableHeight - thickness / 2, 0.03);
                trapMesh.castShadow = true;
                trapMesh.receiveShadow = true;
                this.furnitureGroup.add(trapMesh);
            });
        } else if (config.leg.id === 'fluted-pedestal-base') {
            // Sculptural fluted columns
            [-length * 0.28, length * 0.28].forEach(x => {
                const pedGroup = new THREE.Group();
                const columnRadius = Math.min(0.22, width * 0.25);
                const colGeo = new THREE.CylinderGeometry(columnRadius, columnRadius * 1.1, legH, 32);
                const colMesh = new THREE.Mesh(colGeo, legMat);
                colMesh.position.y = legH / 2;
                colMesh.castShadow = true;
                pedGroup.add(colMesh);

                // Fluted vertical ribs
                for (let r = 0; r < 16; r++) {
                    const angle = (r / 16) * Math.PI * 2;
                    const ribGeo = new THREE.CylinderGeometry(0.015, 0.015, legH, 8);
                    const ribMesh = new THREE.Mesh(ribGeo, legMat);
                    ribMesh.position.set(Math.cos(angle) * columnRadius, legH / 2, Math.sin(angle) * columnRadius);
                    ribMesh.castShadow = true;
                    pedGroup.add(ribMesh);
                }

                pedGroup.position.set(x, 0, 0);
                this.furnitureGroup.add(pedGroup);
            });
        } else if (config.leg.id === 'spider-steel') {
            // Sculptural spider cross frame
            const hubGeo = new THREE.BoxGeometry(0.25, 0.08, 0.25);
            const hubMesh = new THREE.Mesh(hubGeo, legMat);
            hubMesh.position.y = legH * 0.75;
            this.furnitureGroup.add(hubMesh);

            const corners = [
                [-legSpacingX / 2, -legSpacingZ / 2],
                [legSpacingX / 2, -legSpacingZ / 2],
                [-legSpacingX / 2, legSpacingZ / 2],
                [legSpacingX / 2, legSpacingZ / 2]
            ];

            corners.forEach(([cx, cz]) => {
                const strutGeo = new THREE.CylinderGeometry(0.025, 0.03, legH * 1.05, 12);
                const strutMesh = new THREE.Mesh(strutGeo, legMat);
                strutMesh.position.set(cx * 0.5, legH / 2, cz * 0.5);
                strutMesh.lookAt(cx, 0, cz);
                strutMesh.rotateX(Math.PI / 4);
                strutMesh.castShadow = true;
                this.furnitureGroup.add(strutMesh);
            });
        } else {
            // Solid matching 4 tapered round/square timber legs
            const corners = [
                [-legSpacingX / 2, -legSpacingZ / 2],
                [legSpacingX / 2, -legSpacingZ / 2],
                [-legSpacingX / 2, legSpacingZ / 2],
                [legSpacingX / 2, legSpacingZ / 2]
            ];

            corners.forEach(([cx, cz]) => {
                const legGeo = new THREE.CylinderGeometry(0.045, 0.028, legH, 16);
                const legMesh = new THREE.Mesh(legGeo, legMat);
                legMesh.position.set(cx, legH / 2, cz);
                legMesh.castShadow = true;
                this.furnitureGroup.add(legMesh);
            });
        }
    }

    /**
     * Synthesizes 3D Lounge Armchair
     */
    buildLoungeChair(config, woodMat, legMat) {
        const chairGroup = new THREE.Group();

        // Cushion Fabric Material (Soft warm ivory bouclé)
        const fabricMat = new THREE.MeshStandardMaterial({
            color: 0xede6dc,
            roughness: 0.9,
            metalness: 0.02
        });

        // Seat cushion
        const seatGeo = new THREE.BoxGeometry(0.64, 0.14, 0.62, 4, 4, 4);
        const seatMesh = new THREE.Mesh(seatGeo, fabricMat);
        seatMesh.position.set(0, 0.38, 0.02);
        seatMesh.rotation.x = 0.08; // subtle relaxed recline
        seatMesh.castShadow = true;
        chairGroup.add(seatMesh);

        // Angled Backrest cushion
        const backGeo = new THREE.BoxGeometry(0.60, 0.55, 0.12, 4, 4, 4);
        const backMesh = new THREE.Mesh(backGeo, fabricMat);
        backMesh.position.set(0, 0.68, -0.28);
        backMesh.rotation.x = -0.28; // ergonomic recline angle
        backMesh.castShadow = true;
        chairGroup.add(backMesh);

        // Sculptural steam-bent wood armrests & frame
        [-0.36, 0.36].forEach(x => {
            const armCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(x, 0.02, 0.35),
                new THREE.Vector3(x, 0.52, 0.28),
                new THREE.Vector3(x, 0.54, -0.15),
                new THREE.Vector3(x, 0.02, -0.38)
            ]);
            const armGeo = new THREE.TubeGeometry(armCurve, 32, 0.03, 12, false);
            const armMesh = new THREE.Mesh(armGeo, woodMat);
            armMesh.castShadow = true;
            chairGroup.add(armMesh);
        });

        // Rear spine and crossbars
        const crossGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.68, 12);
        crossGeo.rotateZ(Math.PI / 2);
        const crossMesh1 = new THREE.Mesh(crossGeo, woodMat);
        crossMesh1.position.set(0, 0.30, -0.12);
        chairGroup.add(crossMesh1);

        const crossMesh2 = new THREE.Mesh(crossGeo, woodMat);
        crossMesh2.position.set(0, 0.82, -0.36);
        chairGroup.add(crossMesh2);

        this.furnitureGroup.add(chairGroup);
    }

    /**
     * Synthesizes 3D Executive Studio Desk
     */
    buildExecutiveDesk(config, woodMat, legMat) {
        const deskGroup = new THREE.Group();
        const length = config.dimensions.length / 100;
        const width = config.dimensions.width / 100;
        const thickness = 0.05;
        const deskHeight = 0.75;

        // Desktop top slab
        const topGeo = new THREE.BoxGeometry(length, thickness, width, 4, 2, 4);
        const topMesh = new THREE.Mesh(topGeo, woodMat);
        topMesh.position.set(0, deskHeight, 0);
        topMesh.castShadow = true;
        deskGroup.add(topMesh);

        // Concealed dual drawer compartment
        if (config.style.id === 'architect-drawers') {
            const drawerGeo = new THREE.BoxGeometry(length * 0.88, 0.10, width * 0.85);
            const drawerMesh = new THREE.Mesh(drawerGeo, woodMat);
            drawerMesh.position.set(0, deskHeight - 0.075, 0);
            drawerMesh.castShadow = true;
            deskGroup.add(drawerMesh);

            // Brass drawer pulls
            const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
            [-length * 0.22, length * 0.22].forEach(x => {
                const pullGeo = new THREE.BoxGeometry(0.12, 0.015, 0.02);
                const pullMesh = new THREE.Mesh(pullGeo, brassMat);
                pullMesh.position.set(x, deskHeight - 0.075, width / 2 + 0.01);
                deskGroup.add(pullMesh);
            });
        }

        // Concealed Qi Charger Ring if selected
        if (config.addons && config.addons.includes('qi-wireless')) {
            const ringGeo = new THREE.RingGeometry(0.035, 0.042, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xb59048, side: THREE.DoubleSide });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = -Math.PI / 2;
            ringMesh.position.set(length * 0.35, deskHeight + thickness / 2 + 0.001, -width * 0.25);
            deskGroup.add(ringMesh);
        }

        // Legs
        const legSpacingX = length * 0.84;
        const legSpacingZ = width * 0.78;
        const legH = deskHeight - thickness / 2;

        const corners = [
            [-legSpacingX / 2, -legSpacingZ / 2],
            [legSpacingX / 2, -legSpacingZ / 2],
            [-legSpacingX / 2, legSpacingZ / 2],
            [legSpacingX / 2, legSpacingZ / 2]
        ];

        corners.forEach(([cx, cz]) => {
            const legGeo = new THREE.CylinderGeometry(0.038, 0.022, legH, 16);
            const legMesh = new THREE.Mesh(legGeo, legMat);
            legMesh.position.set(cx, legH / 2, cz);
            legMesh.castShadow = true;
            deskGroup.add(legMesh);

            // Brass foot ferrule
            const ferruleGeo = new THREE.CylinderGeometry(0.024, 0.022, 0.06, 16);
            const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
            const ferruleMesh = new THREE.Mesh(ferruleGeo, ferruleMat);
            ferruleMesh.position.set(cx, 0.03, cz);
            deskGroup.add(ferruleMesh);
        });

        this.furnitureGroup.add(deskGroup);
    }

    /**
     * Synthesizes 3D Pebble / Organic Coffee Table
     */
    buildCoffeeTable(config, woodMat, legMat) {
        const tableGroup = new THREE.Group();
        const length = config.dimensions.length / 100;
        const width = config.dimensions.width / 100;
        const thickness = 0.055;
        const tableHeight = 0.40;

        let topGeo;
        if (config.style.id === 'round-crossbeam') {
            topGeo = new THREE.CylinderGeometry(length / 2, length / 2, thickness, 48);
        } else {
            // Asymmetric organic pebble shape
            const pebbleShape = new THREE.Shape();
            const numPts = 32;
            for (let i = 0; i < numPts; i++) {
                const angle = (i / numPts) * Math.PI * 2;
                const rX = (length / 2) * (1 + 0.15 * Math.sin(angle * 2) - 0.12 * Math.cos(angle * 3));
                const rZ = (width / 2) * (1 + 0.18 * Math.cos(angle * 2));
                const x = Math.cos(angle) * rX;
                const z = Math.sin(angle) * rZ;
                if (i === 0) pebbleShape.moveTo(x, z);
                else pebbleShape.lineTo(x, z);
            }
            pebbleShape.closePath();

            topGeo = new THREE.ExtrudeGeometry(pebbleShape, {
                depth: thickness,
                bevelEnabled: true,
                bevelThickness: 0.015,
                bevelSize: 0.018,
                bevelSegments: 4
            });
            topGeo.rotateX(Math.PI / 2);
        }

        const topMesh = new THREE.Mesh(topGeo, woodMat);
        topMesh.position.set(0, tableHeight, 0);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        tableGroup.add(topMesh);

        // Three sculptural low tripod organic legs
        const legH = tableHeight - thickness / 2;
        const tripodAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
        tripodAngles.forEach(ang => {
            const dist = length * 0.30;
            const lx = Math.cos(ang) * dist;
            const lz = Math.sin(ang) * (dist * 0.7);

            const legGeo = new THREE.CylinderGeometry(0.065, 0.038, legH, 24);
            const legMesh = new THREE.Mesh(legGeo, legMat);
            legMesh.position.set(lx, legH / 2, lz);
            legMesh.rotation.z = Math.cos(ang) * 0.12;
            legMesh.rotation.x = Math.sin(ang) * 0.12;
            legMesh.castShadow = true;
            tableGroup.add(legMesh);
        });

        this.furnitureGroup.add(tableGroup);
    }

    createBowtieMesh(material) {
        const shape = new THREE.Shape();
        shape.moveTo(-0.035, -0.018);
        shape.lineTo(0.035, -0.005);
        shape.lineTo(0.035, 0.005);
        shape.lineTo(-0.035, 0.018);
        shape.lineTo(-0.01, 0.0);
        shape.closePath();

        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.005, bevelEnabled: false });
        geo.rotateX(Math.PI / 2);
        return new THREE.Mesh(geo, material);
    }

    setCameraView(viewName) {
        if (!this.camera || !this.controls) return;

        const duration = 800;
        const startPos = this.camera.position.clone();
        let targetPos = new THREE.Vector3(3.2, 2.2, 3.6);

        if (viewName === 'perspective') {
            targetPos.set(3.0, 2.1, 3.2);
        } else if (viewName === 'top') {
            targetPos.set(0.01, 4.2, 0.01);
        } else if (viewName === 'front') {
            targetPos.set(0, 1.2, 3.8);
        } else if (viewName === 'detail') {
            targetPos.set(1.1, 1.15, 1.1);
        }

        const startTime = performance.now();
        const animateCam = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease in out quad
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            this.camera.position.lerpVectors(startPos, targetPos, ease);
            this.controls.update();

            if (progress < 1) requestAnimationFrame(animateCam);
        };
        requestAnimationFrame(animateCam);
    }

    toggleExplode() {
        this.isExploded = !this.isExploded;
        const targetY = this.isExploded ? 0.35 : 0;
        const topMesh = this.furnitureGroup.children[0];
        if (topMesh) {
            topMesh.position.y += targetY * (this.isExploded ? 1 : -1);
        }
    }

    captureSnapshot() {
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/jpeg', 0.95);
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            if (!this.container) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}
