import * as THREE from 'three';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Th } from '@chakra-ui/react';

export function createCube(width, height, depth, origin, mat) {
    const positions = [];
    const uvs = [];

    const vecRight = new THREE.Vector3(1, 0, 0);
    const vecLeft = new THREE.Vector3(-1, 0, 0);
    const vecUp = new THREE.Vector3(0, 1, 0);
    const vecDown = new THREE.Vector3(0, -1, 0);
    const vecFront = new THREE.Vector3(0, 0, 1);
    const vecBack = new THREE.Vector3(0, 0, -1);

    const p1 = vecRight.clone().multiplyScalar(width / 2).addScaledVector(vecBack, depth / 2);
    const p2 = p1.clone().addScaledVector(vecBack, depth);
    const p3 = p2.clone().addScaledVector(vecLeft, width);
    const p4 = p1.clone().addScaledVector(vecLeft, width);
    const p5 = p1.clone().addScaledVector(vecUp, height);
    const p6 = p2.clone().addScaledVector(vecUp, height);
    const p7 = p3.clone().addScaledVector(vecUp, height);
    const p8 = p4.clone().addScaledVector(vecUp, height);

    //triangle 1
    positions.push(
        p1.x, p1.y, p1.z,
        p3.x, p3.y, p3.z,
        p2.x, p2.y, p2.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    const centroidRight = new THREE.Vector3()
        .add(p1)
        .add(p2)
        .add(p6)
        .add(p5)
        .divideScalar(4);

    const arrowHelperRight = new THREE.ArrowHelper(vecRight, centroidRight
        , 0.2, 0x17ff00);

    const centroidLeft = new THREE.Vector3()
        .add(p3)
        .add(p4)
        .add(p7)
        .add(p8)
        .divideScalar(4);

    const arrowHelperLeft = new THREE.ArrowHelper(vecLeft, centroidLeft
        , 0.2, 0x17ff00);

    const centroidTop = new THREE.Vector3()
        .add(p5)
        .add(p6)
        .add(p7)
        .add(p8)
        .divideScalar(4);

    const arrowHelperTop = new THREE.ArrowHelper(vecUp, centroidTop
        , 0.2, 0x17ff00);

    const centroidBot = new THREE.Vector3()
        .add(p1)
        .add(p2)
        .add(p3)
        .add(p4)
        .divideScalar(4);

    const arrowHelperBot = new THREE.ArrowHelper(vecDown, centroidBot
        , 0.2, 0x17ff00);

    //triangle 2
    positions.push(
        p1.x, p1.y, p1.z,
        p4.x, p4.y, p4.z,
        p3.x, p3.y, p3.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 3
    positions.push(
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p6.x, p6.y, p6.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 4
    positions.push(
        p6.x, p6.y, p6.z,
        p5.x, p5.y, p5.z,
        p1.x, p1.y, p1.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 5
    positions.push(
        p4.x, p4.y, p4.z,
        p7.x, p7.y, p7.z,
        p3.x, p3.y, p3.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 6
    positions.push(
        p8.x, p8.y, p8.z,
        p7.x, p7.y, p7.z,
        p4.x, p4.y, p4.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 7
    positions.push(
        p4.x, p4.y, p4.z,
        p1.x, p1.y, p1.z,
        p5.x, p5.y, p5.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 8
    positions.push(
        p4.x, p4.y, p4.z,
        p5.x, p5.y, p5.z,
        p8.x, p8.y, p8.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 9
    positions.push(
        p5.x, p5.y, p5.z,
        p6.x, p6.y, p6.z,
        p7.x, p7.y, p7.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 10
    positions.push(
        p5.x, p5.y, p5.z,
        p7.x, p7.y, p7.z,
        p8.x, p8.y, p8.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 11
    positions.push(
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,
        p6.x, p6.y, p6.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    //triangle 12
    positions.push(
        p6.x, p6.y, p6.z,
        p3.x, p3.y, p3.z,
        p7.x, p7.y, p7.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    const cubeGeometry = new THREE.BufferGeometry();
    cubeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    cubeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    cubeGeometry.computeVertexNormals();

    // 6. Wrap in a CSG Brush
    const cubeBrush = new Brush(cubeGeometry, mat);

    //addArrowHelpersToAllFaces(cubeBrush, 0.3, 0x17ff00, scene);

    cubeBrush.add(arrowHelperRight, arrowHelperLeft, arrowHelperTop, arrowHelperBot);

    const pos = origin;

    cubeBrush.position.set(pos.x, pos.y, pos.z);

    cubeBrush.updateMatrixWorld();



    return cubeBrush;
}

export function addArrowHelpersToAllFaces(mesh, length = 0.5, color = 0x17ff00, targetScene) {
    const geometry = mesh.geometry;
    const positionAttr = geometry.attributes.position;
    const index = geometry.index;

    // Ensure the mesh's world matrix is up to date
    mesh.updateMatrixWorld();

    // Determine total number of faces (triangles)
    const faceCount = index ? index.count / 3 : positionAttr.count / 3;

    for (let i = 0; i < faceCount; i++) {
        let iA, iB, iC;

        if (index) {
            // Indexed geometry
            iA = index.getX(i * 3);
            iB = index.getX(i * 3 + 1);
            iC = index.getX(i * 3 + 2);
        } else {
            // Non-indexed geometry
            iA = i * 3;
            iB = i * 3 + 1;
            iC = i * 3 + 2;
        }

        // Get the three vertices of the triangle
        const a = new THREE.Vector3().fromBufferAttribute(positionAttr, iA);
        const b = new THREE.Vector3().fromBufferAttribute(positionAttr, iB);
        const c = new THREE.Vector3().fromBufferAttribute(positionAttr, iC);

        // 1. Calculate the face center (centroid) in local space
        const centroid = new THREE.Vector3()
            .add(a).add(b).add(c)
            .divideScalar(3);

        // Convert centroid to world space
        centroid.applyMatrix4(mesh.matrixWorld);

        // 2. Calculate the face normal using cross product
        const cb = new THREE.Vector3().subVectors(c, b);
        const ab = new THREE.Vector3().subVectors(a, b);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();

        // Convert normal direction to world space
        normal.transformDirection(mesh.matrixWorld);

        // 3. Create the ArrowHelper and add it to the scene
        const arrowHelper = new THREE.ArrowHelper(normal, centroid, length, color);
        targetScene.add(arrowHelper);
    }
}

