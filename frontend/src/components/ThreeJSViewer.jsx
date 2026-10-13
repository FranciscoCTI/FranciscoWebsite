import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';

const ThreeJSViewer = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const width = currentContainer.clientWidth;
        const height = currentContainer.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111); // Dark background

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 3;

        // 2. Renderer Setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        currentContainer.appendChild(renderer.domElement);

        // 3. Add a simple Object (e.g., a colored Torus Knot or Cube)
        const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4. Add subtle lighting (if using materials that need light, like MeshStandardMaterial)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;

        // 5. Animation Loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Rotate the object slightly every frame
            //mesh.rotation.x += 0.005;
            //mesh.rotation.y += 0.01;

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