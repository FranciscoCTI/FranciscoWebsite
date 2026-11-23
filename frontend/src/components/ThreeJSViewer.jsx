import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { materialAO } from 'three/src/nodes/accessors/MaterialNode.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { createCube, createText, createTextAsync } from './geometryMethods';
import { createHouse } from './houseMethods';
import {
    createStretchableBox,
    createStretchableCylinder,
    createFaceStretchController
} from './faceStretching';
import { blueMaterial, redMaterial, greenMaterial, brownMaterial, blackMaterial, whiteMaterial, roofMaterial, lineMat, reflectiveMaterial, highlightingMaterial } from '../materials/materialsFile';
import { Vector3, Vector2 } from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


const ThreeJSViewer = () => {
    const containerRef = useRef(null);
    const guiContainerRef = useRef(null);
    const [houseToggle, setHouseToggle] = useState(false);

    const houseToggleRef = useRef(houseToggle);

    useEffect(() => {
        houseToggleRef.current = houseToggle;
    }, [houseToggle]);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const currentGUIContainer = guiContainerRef.current;
        const width = currentContainer.clientWidth;
        const height = currentContainer.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080); // Dark background

        const gridHelper = new THREE.GridHelper(100, 100, 0xfffaf0, 0xffffff);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.25;
        scene.add(gridHelper);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = -70;
        camera.position.y = 40;
        camera.position.x = 50;


        //#region Renderer Setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        currentContainer.appendChild(renderer.domElement);
        //#endregion

        //#region Objects

        //#region knots
        const knotGeom = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
        const knot1 = new THREE.Mesh(knotGeom, blueMaterial);
        knot1.position.set(10, 0, 2); // Center the object
        knot1.userData.isVolumetric = true;
        scene.add(knot1);

        createTextAsync(scene, "This is clickable", knot1.position.clone().add(new THREE.Vector3(0, 0, -3)), Math.PI / 2, whiteMaterial);

        const knot2 = new THREE.Mesh(knotGeom, greenMaterial);
        knot2.position.set(14, 0, 2) // Position it to the left of the reflective sphere  
        knot2.userData.isVolumetric = true;
        scene.add(knot2);

        createTextAsync(scene, "This is clickable", knot2.position.clone().add(new THREE.Vector3(0, 0, -3)), Math.PI / 2, whiteMaterial);

        const knot3 = new THREE.Mesh(knotGeom, redMaterial);
        knot3.position.set(18, 0, 2) // Position it to the left of the reflective sphere  
        scene.add(knot3);

        createTextAsync(scene, "This is NOT clickable", knot3.position.clone().add(new THREE.Vector3(0, 0, -3)), Math.PI / 2, whiteMaterial);

        const dodecahedronGeometry = new THREE.DodecahedronGeometry(2.5, 1);
        const reflectiveMesh = new THREE.Mesh(dodecahedronGeometry, reflectiveMaterial);

        const dodePos = reflectiveMesh.position;
        dodePos.x = 5;
        dodePos.y = 4;
        //scene.add(reflectiveMesh);

        const geoCenter = new THREE.SphereGeometry(0.3, 32, 16);
        const meshCenter = new THREE.Mesh(geoCenter, blackMaterial);
        scene.add(meshCenter);

        //#endregion

        //#region first house
        const path = new THREE.CurvePath();
        const v1 = new THREE.Vector3(-3, 0, -3);
        const v2 = new THREE.Vector3(2, 0, -3);
        const v3 = new THREE.Vector3(2, 0, 3);
        const v4 = new THREE.Vector3(-3, 0, 3);

        path.add(new THREE.LineCurve3(v1, v2));
        path.add(new THREE.LineCurve3(v2, v3));
        path.add(new THREE.LineCurve3(v3, v4));
        path.add(new THREE.LineCurve3(v4, v1));
        //path.closePath();

        const shape = new THREE.Shape();
        const shapeWidth = 0.3;
        const shapeHeight = 3;

        shape.moveTo(-shapeWidth / 2, -shapeHeight / 2);
        shape.lineTo(shapeWidth / 2, -shapeHeight / 2);
        shape.lineTo(shapeWidth / 2, shapeHeight / 2);
        shape.lineTo(-shapeWidth / 2, shapeHeight / 2);
        shape.closePath();

        const extrudeSettings = {
            steps: 22,
            bevelEnabled: false,
            extrudePath: path
        };

        const room1 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const brush1 = new Brush(room1, blueMaterial);
        //const weldedGeometry = BufferGeometryUtils.mergeVertices(geometryExtrusion);
        //const extrudedMesh = new THREE.Mesh(geometryExtrusion, redMaterial);
        brush1.position.z = 10;
        brush1.position.y = 1.5;
        brush1.userData.isVolumetric = true;

        brush1.updateMatrixWorld();
        //scene.add(extrudedMesh);

        //const room2 = new THREE.Mesh(geometryExtrusion, blueMaterial);
        const brush2 = new Brush(room1, blueMaterial);
        brush2.position.x = 5;
        brush2.position.y = 1.5;
        brush2.position.z = 12;
        brush2.userData.isVolumetric = true;
        //brush2.updateMatrixWorld();
        //scene.add(room2);

        const evaluator = new Evaluator();

        const resultGeometry = evaluator.evaluate(brush1, brush2, ADDITION);
        resultGeometry.material = blueMaterial;
        resultGeometry.userData.isVolumetric = true;

        scene.add(resultGeometry);

        //#endregion

        //#region house for real

        const houses = new THREE.Object3D();

        for (let i = 0; i < 5; i++) {

            const house = createHouse(new THREE.Vector3(-20, 0, i * 17), Math.PI / 2);

            houses.add(house);
        }

        scene.add(houses);

        //#endregion

        // #endregion

        //#region 3d matrix 
        //const onlyCube = createCube(1, 3, 2, new Vector3(0, 0, 2), redMaterial, scene);
        //scene.add(onlyCube);

        let index = 10;
        let multiplier = 0.1;
        let rotation = Math.PI / 2;
        const paraleles = new THREE.Object3D();
        scene.add(paraleles);

        const disp = new Vector3(15, 0, 10);

        function generateCubes() {

            for (let i = paraleles.children.length - 1; i >= 0; i--) {
                const child = paraleles.children[i];
                paraleles.remove(child);
                if (child.geometry) child.geometry.dispose();
            }

            for (let i = 0; i < index; i++) {
                for (let j = 0; j < index; j++) {
                    for (let r = 0; r < index; r++) {
                        const wi = i * multiplier;
                        const he = r * multiplier;
                        const de = j * multiplier;
                        const personalizedCube = createCube(wi, he, de, new Vector3(i - wi / 2, r, j - de / 2 + de).addScaledVector(disp, 1), redMaterial);
                        personalizedCube.rotation.y = rotation;

                        paraleles.add(personalizedCube);
                    }
                }
            }
        }
        generateCubes()


        //#endregion

        //#region Face Stretching Solids Studio (Placed in open +X, -Z quadrant)
        const stretchSolidsGroup = new THREE.Group();
        scene.add(stretchSolidsGroup);

        // Ground podium floor to demarcate the Face Stretching zone
        const podiumGeom = new THREE.BoxGeometry(20, 0.04, 34);
        const podiumMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.9,
            metalness: 0.1,
            transparent: true,
            opacity: 0.45
        });
        const studioPodium = new THREE.Mesh(podiumGeom, podiumMat);
        studioPodium.position.set(32.5, -0.02, -17);
        studioPodium.receiveShadow = true;
        stretchSolidsGroup.add(studioPodium);

        // 1. Classic Cube (Crimson)
        const stretchCube = createStretchableBox(
            stretchSolidsGroup,
            { x: 27, y: 3, z: -28 },
            { x: 6, y: 6, z: 6 },
            0xdc143c,
            'CUBE'
        );

        // 2. Structural Column (Royal Blue)
        const stretchColumn = createStretchableBox(
            stretchSolidsGroup,
            { x: 38, y: 5.5, z: -28 },
            { x: 3, y: 11, z: 3 },
            0x2563eb,
            'COLUMN'
        );

        // 3. Partition Wall (Warm Amber)
        const stretchWall = createStretchableBox(
            stretchSolidsGroup,
            { x: 27, y: 2.5, z: -17 },
            { x: 8, y: 5, z: 1.5 },
            0xd97706,
            'WALL'
        );

        // 4. Horizontal Beam (Teal / Cyan)
        const stretchBeam = createStretchableBox(
            stretchSolidsGroup,
            { x: 38, y: 1.25, z: -17 },
            { x: 2.5, y: 2.5, z: 10 },
            0x0891b2,
            'BEAM'
        );

        // 5. Floor Slab / Platform (Emerald Green)
        const stretchSlab = createStretchableBox(
            stretchSolidsGroup,
            { x: 27, y: 0.6, z: -6 },
            { x: 8, y: 1.2, z: 8 },
            0x10b981,
            'SLAB'
        );

        // 6. Round Column / Cylinder (Purple)
        const stretchCylinder = createStretchableCylinder(
            stretchSolidsGroup,
            { x: 38, y: 3.5, z: -6 },
            2.5,
            7,
            0x8b5cf6,
            'CYLINDER'
        );

        // Ground Labels for each solid
        createTextAsync(
            stretchSolidsGroup,
            "1. Cube",
            new THREE.Vector3(25, 0.1, -24),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "2. Column",
            new THREE.Vector3(36, 0.1, -24),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "3. Wall",
            new THREE.Vector3(25, 0.1, -13),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "4. Beam",
            new THREE.Vector3(36, 0.1, -11),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "5. Slab",
            new THREE.Vector3(25, 0.1, -1),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "6. Cylinder",
            new THREE.Vector3(35.5, 0.1, -1.5),
            Math.PI / 2,
            whiteMaterial
        );

        createTextAsync(
            stretchSolidsGroup,
            "Face-Stretching Studio: Click any face -> Drag -> Click to lock",
            new THREE.Vector3(22.5, 0.1, -33),
            Math.PI / 2,
            whiteMaterial
        );
        //#endregion

        // #region Lighting and Controls
        const allLights = new THREE.Object3D();
        const allLightHelpers = new THREE.Object3D();

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
        allLights.add(ambientLight);


        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.target.position.set(5, 0, 0);
        allLights.add(directionalLight);

        const direLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        allLightHelpers.add(direLightHelper);

        const pointLight = new THREE.PointLight(0x64E538, 3);
        pointLight.position.set(5, 1.5, 12);
        allLights.add(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight);
        allLightHelpers.add(pointLightHelper);

        const pointLight1 = new THREE.PointLight(0xffffff, 1);
        pointLight1.position.set(1, 5, 1);
        allLights.add(pointLight1);
        const pointLight1Helper = new THREE.PointLightHelper(pointLight1);
        allLightHelpers.add(pointLight1Helper);


        scene.add(allLights);
        scene.add(allLightHelpers);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;

        const faceController = createFaceStretchController({
            scene,
            camera,
            renderer,
            controls
        });
        // #endregion

        //#region GUI
        const gui = new GUI({
            container: currentGUIContainer, // <--- This forces it to live inside your div!
            title: 'Franciscos Controls',
            // Optional title header
        });

        const geomFolder = gui.addFolder("Geometry");
        const archFolder = gui.addFolder("Architecture");

        const matrixFolder = geomFolder.addFolder("3D Matrix");

        const iluminationFolder = gui.addFolder("Ilumination");
        const lightsFolder = iluminationFolder.addFolder("Lights");
        const lightHelperFolder = iluminationFolder.addFolder("Helpers");

        const guiParams = {
            showHouse: houses.visible,
            showKnot1: knot1.visible,
            showKnot2: knot2.visible,
            showKnot3: knot3.visible,
            showLights: allLights.visible,
            showLightHelpers: allLightHelpers.visible,
            Show3dMatrix: paraleles.visible,
            index: 10,
            multiplier: 0.1,
            rotation: Math.PI / 2
        };

        archFolder.add(guiParams, 'showHouse').onChange((value) => houses.visible = value);

        geomFolder.add(guiParams, 'showKnot1').onChange((value) => knot1.visible = value);
        geomFolder.add(guiParams, 'showKnot2').onChange((value) => knot2.visible = value);
        geomFolder.add(guiParams, 'showKnot3').onChange((value) => knot3.visible = value);

        const stretchFolder = geomFolder.addFolder("Face Stretching");
        guiParams.showStretchables = true;
        stretchFolder.add(guiParams, 'showStretchables').name('Show Studio Solids').onChange((val) => {
            stretchSolidsGroup.visible = val;
        });
        guiParams.resetShapes = () => {
            // 1. Cube
            stretchCube.geometry.dispose();
            stretchCube.geometry = new THREE.BoxGeometry();
            stretchCube.scale.set(6, 6, 6);
            stretchCube.position.set(27, 3, -28);

            // 2. Column
            stretchColumn.geometry.dispose();
            stretchColumn.geometry = new THREE.BoxGeometry();
            stretchColumn.scale.set(3, 11, 3);
            stretchColumn.position.set(38, 5.5, -28);

            // 3. Wall
            stretchWall.geometry.dispose();
            stretchWall.geometry = new THREE.BoxGeometry();
            stretchWall.scale.set(8, 5, 1.5);
            stretchWall.position.set(27, 2.5, -17);

            // 4. Beam
            stretchBeam.geometry.dispose();
            stretchBeam.geometry = new THREE.BoxGeometry();
            stretchBeam.scale.set(2.5, 2.5, 10);
            stretchBeam.position.set(38, 1.25, -17);

            // 5. Slab
            stretchSlab.geometry.dispose();
            stretchSlab.geometry = new THREE.BoxGeometry();
            stretchSlab.scale.set(8, 1.2, 8);
            stretchSlab.position.set(27, 0.6, -6);

            // 6. Cylinder
            stretchCylinder.geometry.dispose();
            stretchCylinder.geometry = new THREE.CylinderGeometry(2.5, 2.5, 7, 32);
            stretchCylinder.position.set(38, 3.5, -6);
        };
        stretchFolder.add(guiParams, 'resetShapes').name('Reset All Solids');

        matrixFolder.add(guiParams, 'Show3dMatrix').onChange((value) => paraleles.visible = value);
        matrixFolder.add(guiParams, 'index', 1, 20, 1).name('Grid Count').onChange((value) => {
            index = value;
            generateCubes()
        });

        matrixFolder.add(guiParams, 'multiplier', 0, 0.06, 0.01).name('Size Multiplier').onChange((value) => {
            multiplier = value;
            generateCubes()
        });
        matrixFolder.add(guiParams, 'rotation', 0, Math.PI, 0.01).name('Element Rotation').onChange((value) => {
            rotation = value;
            generateCubes()
        });

        lightsFolder.add(guiParams, 'showLights').onChange((value) => allLights.visible = value);

        lightHelperFolder.add(guiParams, 'showLightHelpers').onChange((value) => allLightHelpers.visible = value);
        //#endregion

        // 5. Animation Loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate the object slightly every frame
            knot1.rotation.y += 0.01;
            knot2.rotation.y += 0.01;
            knot3.rotation.y += 0.01;
            reflectiveMesh.rotation.y += 0.01;

            controls.update();

            renderer.render(scene, camera);
        };

        animate();

        // 6. Handle Window/Container Resize
        const handleResize = () => {
            if (!currentContainer) return;
            const newWidth = currentContainer.clientWidth;
            const newHeight = currentContainer.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        //#region house spawning ground
        const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
        groundGeometry.rotateX(-Math.PI / 2); // Rotate flat onto the XZ plane

        // Invisible material so it doesn't block your visual scene
        const groundMaterial = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
        const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);

        // Tag it so we can easily target it
        groundPlane.userData.isGround = true;
        scene.add(groundPlane);
        groundPlane.updateMatrixWorld(true);
        //#endregion

        //#region Highlighting and Face Stretching Interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        let highlightingMesh = null;
        let originalMaterial = null;

        const canvas = renderer.domElement;

        const getCanvasMouse = (event, target) => {
            const rect = canvas.getBoundingClientRect();
            target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            target.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            return (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );
        };

        function onPointerDown(event) {
            if (event.target.closest('button') || event.target.closest('#newHouseButton')) {
                return;
            }
            if (currentGUIContainer && currentGUIContainer.contains(event.target)) {
                return;
            }
            if (event.button !== 0) return;

            const isInside = getCanvasMouse(event, mouse);

            // If user is currently dragging a face, drop it
            if (faceController.isDragging()) {
                faceController.dropDraggable(mouse);
                return;
            }

            if (!isInside) return;

            // Ensure raycaster is updated with current camera and mouse NDC
            raycaster.setFromCamera(mouse, camera);
            scene.updateMatrixWorld(true);

            if (houseToggleRef.current) {
                instantiateHouse();
                return;
            }

            // Check if user clicked a stretchable solid face
            const handled = faceController.handleClick(mouse);
            if (handled) {
                clearHighlight();
                return;
            }

            markGeometry();
        }

        function onPointerMove(event) {
            const isInside = getCanvasMouse(event, mouse);

            if (!isInside && !faceController.isDragging()) {
                faceController.handleMouseOut();
                return;
            }

            faceController.handleMouseMove(mouse);
        }

        function onPointerOut(event) {
            if (!event.relatedTarget && !faceController.isDragging()) {
                faceController.handleMouseOut();
            }
        }

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('mouseout', onPointerOut);

        function markGeometry() {
            raycaster.setFromCamera(mouse, camera);
            const volumetricObjects = [];

            paraleles.traverse((child) => {
                if (child.isMesh && child.userData.isVolumetric) {
                    volumetricObjects.push(child);
                }
            });

            scene.traverse((child) => {
                if (child.userData.isVolumetric) {
                    volumetricObjects.push(child);
                }
            });

            const intersects = raycaster.intersectObjects(volumetricObjects, true);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;

                if (clickedMesh.isMesh) {
                    highlightObject(clickedMesh);
                } else {
                    clearHighlight();
                }
            } else {
                clearHighlight();
            }
        }

        function instantiateHouse() {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(groundPlane, false);

            if (intersects.length > 0) {
                const hitPoint = intersects[0].point;
                const spawnPosition = new THREE.Vector3(hitPoint.x, 0, hitPoint.z);
                spawnHouseAt(spawnPosition);
            }
        }

        function highlightObject(mesh) {
            if (highlightingMesh && highlightingMesh !== mesh) {
                highlightingMesh.material = originalMaterial;
            }
            if (highlightingMesh === mesh) {
                clearHighlight();
                return;
            }

            highlightingMesh = mesh;
            originalMaterial = mesh.material;

            mesh.material = highlightingMaterial;
        }

        function clearHighlight() {
            if (highlightingMesh) {
                highlightingMesh.material = originalMaterial;
                highlightingMesh = null;
                originalMaterial = null;
            }
        }

        function spawnHouseAt(pos) {
            const newHouse = createHouse(pos.add(new THREE.Vector3(0, 0, 40)), Math.PI / 2);
            scene.add(newHouse);
            houses.add(newHouse);
        }
        //#endregion

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('mouseout', onPointerOut);
            faceController.dispose();
            gui.destroy();
            stretchSolidsGroup.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
                    else child.material.dispose();
                }
            });
            if (currentContainer && renderer.domElement) {
                currentContainer.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Canvas fills the whole box */}
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Floating GUI Container positioned absolutely on top */}
            <div
                ref={guiContainerRef}
                style={{
                    position: 'absolute',
                    top: '10px',   // Distance from top
                    right: '10px', // Distance from right
                    zIndex: 10     // Ensures it sits above the canvas
                }}
            />
            <button
                id="newHouseButton"
                onClick={(e) => {
                    e.stopPropagation();
                    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
                    setHouseToggle(prev => !prev);

                }}
            >
                {houseToggle ? 'Disable House creation' : 'Enable house creation'}</button>
            <div style={{
                position: 'absolute',
                top: '75px',
                left: '20px',
                zIndex: 20,
                padding: '6px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: '#e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                pointerEvents: 'none'
            }}>
                <strong>{houseToggle ? 'Active (Spawning)' : 'Inactive (Selecting)'}</strong>
            </div>
        </div>);

};


export default ThreeJSViewer;