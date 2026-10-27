import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { materialAO } from 'three/src/nodes/accessors/MaterialNode.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { createRoom, createWallFromPoints, createRoomFromFootprint, createFloorFromFootprint, createFenestration, createSeveralFenestrations } from './geometryMethods';
import { blueMaterial, redMaterial, greenMaterial, brownMaterial, blackMaterial, whiteMaterial, lineMat, reflectiveMaterial } from '../materials/materialsFile';
import { Vector3 } from 'three';


const ThreeJSViewer = () => {
    const containerRef = useRef(null);
    const guiContainerRef = useRef(null);

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
        camera.position.z = 70;
        camera.position.y = 25;
        camera.position.x = 40;


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
        scene.add(knot1);

        const knot2 = new THREE.Mesh(knotGeom, greenMaterial);
        knot2.position.set(14, 0, 2) // Position it to the left of the reflective sphere  
        scene.add(knot2);

        const knot3 = new THREE.Mesh(knotGeom, redMaterial);
        knot3.position.set(18, 0, 2) // Position it to the left of the reflective sphere  
        scene.add(knot3);

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
        brush1.updateMatrixWorld();
        //scene.add(extrudedMesh);

        //const room2 = new THREE.Mesh(geometryExtrusion, blueMaterial);
        const brush2 = new Brush(room1, blueMaterial);
        brush2.position.x = 5;
        brush2.position.y = 1.5;
        brush2.position.z = 12;
        brush2.updateMatrixWorld();
        //scene.add(room2);

        const evaluator = new Evaluator();

        const resultGeometry = evaluator.evaluate(brush1, brush2, ADDITION);
        resultGeometry.material = blueMaterial;

        scene.add(resultGeometry);

        //#endregion

        //#region house for real
        const allLines = new THREE.Object3D();

        const hPoint1 = new THREE.Vector3(40, 0, 0);
        const hPoint2 = new THREE.Vector3(40, 0, 4);
        const hPoint3 = new THREE.Vector3(40, 0, 8);
        const hPoint4 = new THREE.Vector3(38, 0, 8);
        const hPoint5 = new THREE.Vector3(38, 0, 9);
        const hPoint6 = new THREE.Vector3(35, 0, 9);
        const hPoint7 = new THREE.Vector3(35, 0, 4);
        const hPoint8 = new THREE.Vector3(35, 0, 0);

        const hPoint9 = new THREE.Vector3(43, 0, 0);
        const hPoint10 = new THREE.Vector3(43, 0, 2);
        const hPoint11 = new THREE.Vector3(40, 0, 2);

        const hPoint12 = new THREE.Vector3(32, 0, 2);
        const hPoint13 = new THREE.Vector3(35, 0, 2);
        const hPoint14 = new THREE.Vector3(35, 0, 6);
        const hPoint15 = new THREE.Vector3(32, 0, 6);

        const pathR1 = new THREE.CurvePath();
        pathR1.add(new THREE.LineCurve3(hPoint1, hPoint2));
        pathR1.add(new THREE.LineCurve3(hPoint2, hPoint3));
        pathR1.add(new THREE.LineCurve3(hPoint3, hPoint4));
        pathR1.add(new THREE.LineCurve3(hPoint4, hPoint5));
        pathR1.add(new THREE.LineCurve3(hPoint5, hPoint6));
        pathR1.add(new THREE.LineCurve3(hPoint6, hPoint7));
        pathR1.add(new THREE.LineCurve3(hPoint7, hPoint8));
        pathR1.add(new THREE.LineCurve3(hPoint8, hPoint1));

        const pathR2 = new THREE.CurvePath();
        pathR2.add(new THREE.LineCurve3(hPoint1, hPoint9));
        pathR2.add(new THREE.LineCurve3(hPoint9, hPoint10));
        pathR2.add(new THREE.LineCurve3(hPoint10, hPoint11));

        const pathR3 = new THREE.CurvePath();
        pathR3.add(new THREE.LineCurve3(hPoint12, hPoint13));
        pathR3.add(new THREE.LineCurve3(hPoint13, hPoint14));
        pathR3.add(new THREE.LineCurve3(hPoint14, hPoint15));
        pathR3.add(new THREE.LineCurve3(hPoint15, hPoint12));

        const divisions = 100;
        const hPoints1 = pathR1.getPoints(divisions);
        const hGeometry1 = new THREE.BufferGeometry().setFromPoints(hPoints1);

        const hPoints2 = pathR2.getPoints(divisions);
        const hGeometry2 = new THREE.BufferGeometry().setFromPoints(hPoints2);

        const hPoints3 = pathR3.getPoints(divisions);
        const hGeometry3 = new THREE.BufferGeometry().setFromPoints(hPoints3);

        const pathLine1 = new THREE.Line(hGeometry1, lineMat);
        allLines.add(pathLine1);

        const pathLine2 = new THREE.Line(hGeometry2, lineMat);
        allLines.add(pathLine2);

        const pathLine3 = new THREE.Line(hGeometry3, lineMat);
        allLines.add(pathLine3);

        scene.add(allLines);

        //Create room geometry

        const pointsRoom1 = [
            hPoint1, hPoint2, hPoint3, hPoint4, hPoint5, hPoint6, hPoint7, hPoint8
        ];

        const pointsRoom2 = [
            hPoint12, hPoint13, hPoint14, hPoint15
        ];

        const pointsRoom3 = [
            hPoint1, hPoint9, hPoint10, hPoint11
        ];

        //#region roomx
        const roomX = createRoomFromFootprint(pointsRoom1, 0.25, 2.7, whiteMaterial);
        roomX.updateMatrixWorld();

        const roomXFloor = createFloorFromFootprint(pointsRoom1, 0.2, brownMaterial);
        roomXFloor.updateMatrixWorld();


        //#endregion

        //#region roomy

        const roomY = createRoomFromFootprint(pointsRoom2, 0.2, 2.5, whiteMaterial);
        const roomYFloor = createFloorFromFootprint(pointsRoom2, 0.2, brownMaterial);

        const winPositions = [
            new Vector3(33, 1, 2),
            new Vector3(34, 1, 2)
        ]

        const roomWithSeveralWins = createSeveralFenestrations(roomY, winPositions, 0.5, 0.9, 0.3);

        //let roomWithWin = createFenestration(roomY, new Vector3(34, 1, 2), 0.5, 0.9, 0.3);
        //roomWithWin = createFenestration(roomWithWin, new Vector3(35.5, 1, 2), 0.5, 0.9, 0.3);

        const roomZ = createRoomFromFootprint(pointsRoom3, 0.2, 2.5, whiteMaterial);
        const roomZFloor = createFloorFromFootprint(pointsRoom3, 0.2, brownMaterial);
        roomZ.updateMatrixWorld();

        scene.add(roomX, roomXFloor, roomWithSeveralWins, roomYFloor, roomZ, roomZFloor);

        //#endregion

        // #endregion

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
        // #endregion

        //#region GUI
        const gui = new GUI({
            container: currentGUIContainer, // <--- This forces it to live inside your div!
            title: 'Franciscos Controls',
            // Optional title header
        });

        const geomFolder = gui.addFolder("Geometry");
        const archFolder = gui.addFolder("Architecture");

        const iluminationFolder = gui.addFolder("Ilumination");
        const lightsFolder = iluminationFolder.addFolder("Lights");
        const lightHelperFolder = iluminationFolder.addFolder("Helpers");

        const guiParams = {
            showHouse: resultGeometry.visible,
            showKnot1: knot1.visible,
            showKnot2: knot2.visible,
            showKnot3: knot3.visible,
            showLights: allLights.visible,
            showLightHelpers: allLightHelpers.visible,
            showHouseLines: allLines.visible
        };

        archFolder.add(guiParams, 'showHouse').onChange((value) => resultGeometry.visible = value);
        archFolder.add(guiParams, 'showHouseLines').onChange((value) => allLines.visible = value);

        geomFolder.add(guiParams, 'showKnot1').onChange((value) => knot1.visible = value);
        geomFolder.add(guiParams, 'showKnot2').onChange((value) => knot2.visible = value);
        geomFolder.add(guiParams, 'showKnot3').onChange((value) => knot3.visible = value);

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
        </div>);

};
export default ThreeJSViewer;