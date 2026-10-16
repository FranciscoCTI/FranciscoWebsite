import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const ThreeJSViewer = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const width = currentContainer.clientWidth;
        const height = currentContainer.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080); // Dark background

        const gridHelper = new THREE.GridHelper(100, 100, 0xfffaf0, 0xffffff);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.25;
        scene.add(gridHelper);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 10;
        camera.position.y = 4;
        camera.position.x = 0;

        // 2. Renderer Setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        currentContainer.appendChild(renderer.domElement);

        // #region Materials
        const greenMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // Vibrant green
            metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
            roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
        });

        const redMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000, // Vibrant red
            metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
            roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
        });

        const blueMaterial = new THREE.MeshStandardMaterial({
            color: 0x0000ff, // Vibrant blue
            metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
            roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
        });

                //Other object to test reflective material
        const reflectiveMaterial = new THREE.MeshStandardMaterial({
            color: greenMaterial.color, // Use the same color as the green material
            metalness: 0,   
            roughness: 0.6,
        });
        // #endregion

        //#region Objects
        const knotGeom = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
        const mesh = new THREE.Mesh(knotGeom, blueMaterial);
        mesh.position.set(10, 0, 0); // Center the object
        scene.add(mesh);

        const knot2 = new THREE.Mesh(knotGeom, greenMaterial);
        knot2.position.x = -1; // Position it to the left of the reflective sphere  
        scene.add(knot2);

        const knot3 = new THREE.Mesh(knotGeom, redMaterial);
        knot3.position.x = -4; // Position it to the left of the reflective sphere  
        scene.add(knot3);

        const dodecahedronGeometry = new THREE.DodecahedronGeometry(2.5, 1);
        const reflectiveMesh = new THREE.Mesh(dodecahedronGeometry, reflectiveMaterial);
        reflectiveMesh.position.x = 5;
        scene.add(reflectiveMesh);

        //#region extrude along path
        const path = new THREE.CurvePath();
        const v1 = new THREE.Vector3(-3,0,-3);
        const v2 = new THREE.Vector3(3,0,-3);
        const v3 = new THREE.Vector3(3,0,3);
        const v4 = new THREE.Vector3(-3,0,3);

        path.add(new THREE.LineCurve3(v1,v2));
        path.add(new THREE.LineCurve3(v2,v3));
        path.add(new THREE.LineCurve3(v3,v4));
        path.add(new THREE.LineCurve3(v4,v1));
        path.closePath();

        const shape = new THREE.Shape();
        const shapeWidth = 0.3;
        const shapeHeight = 3;

        shape.moveTo(-shapeWidth / 2, -shapeHeight / 2);
        shape.lineTo(shapeWidth / 2, -shapeHeight / 2);
        shape.lineTo(shapeWidth / 2, shapeHeight / 2);
        shape.lineTo(-shapeWidth / 2, shapeHeight / 2);
        shape.closePath();

        const extrudeSettings = {
            steps: 4,
            bevelEnabled: false,
            extrudePath: path
        };

        const geometryExtrusion = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const weldedGeometry = BufferGeometryUtils.mergeVertices(geometryExtrusion);
        const extrudedMesh = new THREE.Mesh(weldedGeometry, redMaterial);
        extrudedMesh.position.z = 10;
        extrudedMesh.position.y =1.5;
        scene.add(extrudedMesh);




        //#endregion

        // #endregion

        // #region Lighting and Controls
        const ambientLight = new THREE.AmbientLight(0x404040, 5.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.target.position.set(5, 0, 0);
        scene.add(directionalLight);

        const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
        //scene.add(lightHelper);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(-5, -10, -7.5);
        scene.add(pointLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;
        // #endregion

        // 5. Animation Loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate the object slightly every frame
            mesh.rotation.y += 0.01;
            knot2.rotation.y += 0.01;
            knot3.rotation.y += 0.01;
            reflectiveMesh.rotation.y += 0.01;

            directionalLight.target.position.x += 0.01; // Move the light target slightly to create dynamic lighting

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
        <div 
      ref={containerRef} 
      style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }} 
    />);

};
export default ThreeJSViewer;