import * as THREE from 'three';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { materialAO } from 'three/src/nodes/accessors/MaterialNode.js';
import { blueMaterial, redMaterial, greenMaterial, brownMaterial, blackMaterial, whiteMaterial, roofMaterial, lineMat, reflectiveMaterial, grassMaterial } from '../materials/materialsFile';
import { Vector3, Vector2 } from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { position, Th } from '@chakra-ui/react';
import { createCube } from './geometryMethods';

export function createHouse(location, rotation) {

    const allhouse = new THREE.Object3D();

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
    const hPoint16 = new THREE.Vector3(40, 0, 9);

    const pointsRoom1 = [
        hPoint1, hPoint2, hPoint3, hPoint4, hPoint5, hPoint6, hPoint7, hPoint8
    ];

    const pointsRoof1 = [
        hPoint1, hPoint2, hPoint3, hPoint16, hPoint6, hPoint7, hPoint8
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

    const roomXRoof = createThickSlopedRoofFromFootprint(pointsRoof1, 1.2, 0.9, 2.7, 0.2, roofMaterial);
    allhouse.add(roomXRoof);
    //#endregion

    //#region roomy
    const roomY = createRoomFromFootprint(pointsRoom2, 0.2, 2.5, whiteMaterial);
    const roomYFloor = createFloorFromFootprint(pointsRoom2, 0.2, brownMaterial);

    const roomYRoof = createThickSlopedRoofFromFootprint(pointsRoom2, 1.5, 0.8, 2.5, 0.2, roofMaterial);

    allhouse.add(roomYRoof);

    const winPositions = [
        new Vector3(33, 1, 2),
        new Vector3(34, 1, 2)
    ]

    const roomWithSeveralWins = createSeveralFenestrations(roomY, winPositions, 0.5, 0.9, 0.3);

    const doorPositions = [
        new Vector3(36, 0, 0),
        new Vector3(36, 0, 9)
    ]

    const roomWithDoors = createSeveralFenestrations(roomX, doorPositions, 0.8, 2, 0.3);

    const pointsDrywall = [
        new Vector3(32, 0, 4), new Vector3(35, 0, 4)
    ];
    const drywall = createLinearWall(pointsDrywall, 0.1, 2.5, whiteMaterial);
    allhouse.add(drywall);

    const pointsDrywall1 = [
        new Vector3(35, 0, 4), new Vector3(36, 0, 4), new Vector3(36, 0, 5), new Vector3(40, 0, 5),
    ];
    const drywall1 = createLinearWall(pointsDrywall1, 0.2, 2.5, whiteMaterial);
    allhouse.add(drywall1);

    const roomZ = createRoomFromFootprint(pointsRoom3, 0.2, 2.5, whiteMaterial);
    const roomZFloor = createFloorFromFootprint(pointsRoom3, 0.2, brownMaterial);
    roomZ.updateMatrixWorld();

    const roomZRoof = createThickSlopedRoofFromFootprint(pointsRoom3, 1.5, 0.8, 2.5, 0.2, roofMaterial);
    allhouse.add(roomZRoof);

    const winRotatedPositions = [
        { pos: new THREE.Vector3(41, 1, 0), size: [0.5, 1, 0.3], rot: 0 }, // Front Door
        { pos: new THREE.Vector3(43, 1, 1), size: [0.5, 1, 0.3], rot: 90 }, // Left Window
        { pos: new THREE.Vector3(41.5, 1, 2), size: [1.5, 1, 0.3], rot: 0 }  // Right Window
    ];

    const roomWithRotatedWindows = createSeveralRotatedFenestrations(roomZ, winRotatedPositions);

    allhouse.add(roomWithDoors, roomXFloor, roomWithSeveralWins, roomYFloor, roomWithRotatedWindows, roomZFloor);

    //#region grids
    const allGrids = new THREE.Object3D();

    const gridPointsA = [
        new Vector3(35, 0, -2),
        new Vector3(35, 0, 10)
    ];

    const blackGreenLine = new THREE.LineBasicMaterial({
        color: 0x000000, // Green line
        linewidth: 1     // Note: See warning below about linewidth
    });

    const gridA = createGrid(gridPointsA, "A", blackGreenLine);
    allGrids.add(gridA);

    const gridPointsB = [
        new Vector3(32, 0, 0),
        new Vector3(44, 0, 0)
    ];

    const gridB = createGrid(gridPointsB, "B", blackGreenLine);
    allGrids.add(gridB);

    const gridPointsC = [
        new Vector3(40, 0, -2),
        new Vector3(40, 0, 10)
    ];

    const gridC = createGrid(gridPointsC, "C", blackGreenLine);
    allGrids.add(gridC);

    const gridPointsD = [
        new Vector3(32, 0, 0),
        new Vector3(32, 0, 7.6)
    ];

    const gridD = createGrid(gridPointsD, "D", blackGreenLine);
    allGrids.add(gridD);
    allhouse.add(allGrids);

    //#endregion
    allhouse.position.copy(new THREE.Vector3(-37, 0, -3));

    const site = createSite(17, 35, new THREE.Vector3(47, -0.1, 34));
    allhouse.add(site);
    allhouse.rotation.y = rotation;

    allhouse.position.copy(location.clone());

    return allhouse;
}

export function createRoom(path, mat) {
    const extrudeSettings = {
        steps: 30,
        bevelEnabled: false,
        extrudePath: path,
    };

    const shape = new THREE.Shape();
    const shapeWidth = 0.3;
    const shapeHeight = 2.6;

    shape.moveTo(-shapeWidth / 2, -shapeHeight / 2);
    shape.lineTo(shapeWidth / 2, -shapeHeight / 2);
    shape.lineTo(shapeWidth / 2, shapeHeight / 2);
    shape.lineTo(-shapeWidth / 2, shapeHeight / 2);
    shape.closePath();

    const room1 = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const brush1 = new Brush(room1, mat);

    return brush1;
}

export function createWallFromPoints(points, wallThickness, wallHeight, material) {
    const outerPoints = [];
    const innerPoints = [];

    // Calculate parallel offsets for inner and outer wall faces
    for (let i = 0; i < points.length; i++) {
        const prev = points[(i - 1 + points.length) % points.length];
        const curr = points[i];
        const next = points[(i + 1) % points.length];

        // Compute segment directions
        const dir1 = new THREE.Vector2().subVectors(curr, prev).normalize();
        const dir2 = new THREE.Vector2().subVectors(next, curr).normalize();

        // Compute normals
        const norm1 = new THREE.Vector2(-dir1.y, dir1.x);
        const norm2 = new THREE.Vector2(-dir2.y, dir2.x);

        // Miter vector calculation for clean corner joints
        const miter = new THREE.Vector2().addVectors(norm1, norm2).normalize();
        const halfThickness = wallThickness / 2;
        const length = halfThickness / Math.max(miter.dot(norm1), 0.1);

        outerPoints.push(new THREE.Vector2().addVectors(curr, miter.clone().multiplyScalar(length)));
        innerPoints.push(new THREE.Vector2().subVectors(curr, miter.clone().multiplyScalar(length)));
    }

    // Build the closed wall profile shape (Outer perimeter clockwise, inner counter-clockwise)
    const wallShape = new THREE.Shape();

    // Outer boundary
    wallShape.moveTo(outerPoints[0].x, outerPoints[0].y);
    for (let i = 1; i < outerPoints.length; i++) {
        wallShape.lineTo(outerPoints[i].x, outerPoints[i].y);
    }
    wallShape.closePath();

    // Inner boundary hole (creates a hollow room outline)
    const holePath = new THREE.Path();
    holePath.moveTo(innerPoints[0].x, innerPoints[0].y);
    for (let i = innerPoints.length - 1; i >= 0; i--) {
        holePath.lineTo(innerPoints[i].x, innerPoints[i].y);
    }
    holePath.closePath();
    wallShape.holes.push(holePath);

    // Extrude vertically (straight linear displacement)
    const extrudeSettings = {
        depth: wallHeight,
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);

    // Rotate geometry so depth corresponds to vertical Y axis
    geometry.rotateX(Math.PI / 2);

    return new THREE.Mesh(geometry, material);
}

export function createRoomFromFootprint(cornerPoints, wallThickness = 0.3, wallHeight = 2.6, mat) {
    const outerPoints = [];
    const innerPoints = [];

    // 1. Calculate parallel offsets for inner and outer wall edges

    const pts2D = cornerPoints.map(pt => new THREE.Vector2(pt.x, -pt.z));

    const count = pts2D.length;


    for (let i = 0; i < count; i++) {
        const prev = pts2D[(i - 1 + count) % count];
        const curr = pts2D[i];
        const next = pts2D[(i + 1) % count];

        const dir1 = new THREE.Vector2().subVectors(curr, prev).normalize();
        const dir2 = new THREE.Vector2().subVectors(next, curr).normalize();

        const norm1 = new THREE.Vector2(-dir1.y, dir1.x);
        const norm2 = new THREE.Vector2(-dir2.y, dir2.x);

        const miter = new THREE.Vector2().addVectors(norm1, norm2).normalize();
        const halfThick = wallThickness / 2;
        const length = halfThick / Math.max(miter.dot(norm1), 0.1);

        outerPoints.push(new THREE.Vector2().addVectors(curr, miter.clone().multiplyScalar(length)));
        innerPoints.push(new THREE.Vector2().subVectors(curr, miter.clone().multiplyScalar(length)));
    }

    // 2. Build 2D shape with outer perimeter and inner hole
    const wallShape = new THREE.Shape();
    wallShape.moveTo(outerPoints[0].x, outerPoints[0].y);
    for (let i = 1; i < outerPoints.length; i++) {
        wallShape.lineTo(outerPoints[i].x, outerPoints[i].y);
    }
    wallShape.closePath();

    const holePath = new THREE.Path();
    holePath.moveTo(innerPoints[count - 1].x, innerPoints[count - 1].y);
    for (let i = innerPoints.length - 1; i >= 0; i--) {
        holePath.lineTo(innerPoints[i].x, innerPoints[i].y);
    }
    holePath.closePath();
    wallShape.holes.push(holePath);

    // 3. Extrude straight UP along the depth axis (Y-axis displacement)
    const extrudeSettings = {
        depth: wallHeight,
        bevelEnabled: false,
        openEnded: true,
    };

    const roomGeometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);

    // Rotate geometry so depth matches the world Y-axis
    roomGeometry.rotateX(-Math.PI / 2);

    const brush = new Brush(roomGeometry, mat);
    brush.updateMatrixWorld();

    return brush;
}

export function createFloorFromFootprint(cornerPoints, floorThickness = 0.3, mat) {
    //Floorshape
    cornerPoints = cornerPoints.map(pt => new THREE.Vector2(pt.x, -pt.z));

    const floorShape = new THREE.Shape();
    floorShape.moveTo(cornerPoints[0].x, cornerPoints[0].y);
    for (let i = 1; i < cornerPoints.length; i++) {
        floorShape.lineTo(cornerPoints[i].x, cornerPoints[i].y);
    }
    floorShape.closePath();

    const extrudeSettings = {
        depth: floorThickness,
        bevelEnabled: false,
        openEnded: false,
    };
    const floorGeometry = new THREE.ExtrudeGeometry(floorShape, extrudeSettings);

    // Rotate geometry so depth matches the world Y-axis
    floorGeometry.rotateX(-Math.PI / 2);

    const brush = new Brush(floorGeometry, mat);
    brush.updateMatrixWorld();

    return brush;

}

export function createRoofFromFootprint(cornerPoints, roofThickness = 0.4, elevation, mat) {
    // 1. Map 3D footprint points (XZ plane) to 2D shape coordinates
    const pts2D = cornerPoints.map(pt => new THREE.Vector2(pt.x, -pt.z));

    // 2. Build the roof shape from the footprint
    const roofShape = new THREE.Shape();
    roofShape.moveTo(pts2D[0].x, pts2D[0].y);
    for (let i = 1; i < pts2D.length; i++) {
        roofShape.lineTo(pts2D[i].x, pts2D[i].y);
    }
    roofShape.closePath();

    // 3. Extrude settings (you can adjust thickness independently from floors)
    const extrudeSettings = {
        depth: roofThickness,
        bevelEnabled: false,
        openEnded: false,
    };

    const roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);

    // 4. Rotate geometry so extrusion depth aligns with the world Y-axis
    roofGeometry.rotateX(-Math.PI / 2);

    // 5. Wrap in a CSG Brush
    const brush = new Brush(roofGeometry, mat);

    const pos = brush.position;

    brush.position.set(pos.x, pos.y + elevation, pos.z);
    brush.updateMatrixWorld();

    return brush;
}

export function createSlopedRoofFromFootprint(cornerPoints, roofHeight = 1.5, elevation, overhang, mat) {
    // 1. Map 3D footprint points to 2D (XZ plane)
    let pts2D = cornerPoints.map(pt => new THREE.Vector2(pt.x, -pt.z));

    // Optional: Calculate centroid for the roof peak / ridge center
    let centroid = new THREE.Vector2();
    pts2D.forEach(p => centroid.add(p));
    centroid.divideScalar(pts2D.length);

    let offsetPts2D = pts2D.map(p => {
        const dir = new THREE.Vector2().subVectors(p, centroid).normalize();
        return p.clone().addScaledVector(dir, overhang);
    });

    const n = offsetPts2D.length;
    const positions = [];
    const uvs = [];

    // Height of eaves vs peak
    const eaveY = 0;
    const peakY = roofHeight;

    // 2. Build sloped triangular/quad faces for each side connecting eave to centroid/ridge
    for (let i = 0; i < n; i++) {
        const p1 = offsetPts2D[i];
        const p2 = offsetPts2D[(i + 1) % n];

        const v1 = new THREE.Vector3(p1.x, eaveY, -p1.y);
        const v2 = new THREE.Vector3(p2.x, eaveY, -p2.y);
        const vTop = new THREE.Vector3(centroid.x, peakY, -centroid.y);

        // SWAPPED v2 and v1 here to invert the triangle's normal direction
        positions.push(
            v2.x, v2.y, v2.z,
            v1.x, v1.y, v1.z,
            vTop.x, vTop.y, vTop.z
        );

        uvs.push(1, 0, 0, 0, 0.5, 1);
    }

    // 3. Create BufferGeometry
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    roofGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    // Automatically calculate smooth/flat lighting normals for the sloped faces
    roofGeometry.computeVertexNormals();

    // 4. Wrap in a CSG Brush
    const brush = new Brush(roofGeometry, mat);

    const pos = brush.position;

    brush.position.set(pos.x, pos.y + elevation, pos.z);

    brush.updateMatrixWorld();

    return brush;
}

export function createThickSlopedRoofFromFootprint(cornerPoints, roofHeight = 1.5, eaveOverhang = 0.4, elevation, roofThickness = 0.2, mat) {
    // 1. Map 3D footprint points to 2D (XZ plane)
    let pts2D = cornerPoints.map(pt => new THREE.Vector2(pt.x, -pt.z));

    // 2. Calculate the geometric center (centroid)
    let centroid = new THREE.Vector2();
    pts2D.forEach(p => centroid.add(p));
    centroid.divideScalar(pts2D.length);

    // 3. Outer eave footprint (pushed outward)
    let outerPts = pts2D.map(p => {
        const dir = new THREE.Vector2().subVectors(p, centroid).normalize();
        return p.clone().addScaledVector(dir, eaveOverhang);
    });

    // 4. Inner eave footprint (offset inward from outer eave by thickness)
    let innerPts = pts2D.map(p => {
        const dir = new THREE.Vector2().subVectors(p, centroid).normalize();
        return p.clone().addScaledVector(dir, Math.max(0, eaveOverhang - roofThickness));
    });

    const n = outerPts.length;
    const positions = [];
    const uvs = [];

    const eaveY = 0;
    const peakY = roofHeight;
    const innerPeakY = roofHeight - roofThickness;

    for (let i = 0; i < n; i++) {
        const o1 = outerPts[i];
        const o2 = outerPts[(i + 1) % n];
        const in1 = innerPts[i];
        const in2 = innerPts[(i + 1) % n];

        // Outer vertices
        const vOuter1 = new THREE.Vector3(o1.x, eaveY, -o1.y);
        const vOuter2 = new THREE.Vector3(o2.x, eaveY, -o2.y);
        const vOuterPeak = new THREE.Vector3(centroid.x, peakY, -centroid.y);

        // Inner vertices (shifted down and inward)
        const vInner1 = new THREE.Vector3(in1.x, eaveY - roofThickness, -in1.y);
        const vInner2 = new THREE.Vector3(in2.x, eaveY - roofThickness, -in2.y);
        const vInnerPeak = new THREE.Vector3(centroid.x, innerPeakY, -centroid.y);

        // --- A. Outer Sloped Surface (Normals facing outward) ---
        positions.push(
            vOuter2.x, vOuter2.y, vOuter2.z,
            vOuter1.x, vOuter1.y, vOuter1.z,
            vOuterPeak.x, vOuterPeak.y, vOuterPeak.z
        );
        uvs.push(1, 0, 0, 0, 0.5, 1);

        // --- B. Inner Sloped Surface (Normals facing inward / reversed winding) ---
        positions.push(
            vInner1.x, vInner1.y, vInner1.z,
            vInner2.x, vInner2.y, vInner2.z,
            vInnerPeak.x, vInnerPeak.y, vInnerPeak.z
        );
        uvs.push(0, 0, 1, 0, 0.5, 1);

        // --- C. Perimeter Eave / Fascia Connecting Faces (Quad split into 2 triangles) ---
        // Triangle 1
        positions.push(
            vOuter1.x, vOuter1.y, vOuter1.z,
            vOuter2.x, vOuter2.y, vOuter2.z,
            vInner1.x, vInner1.y, vInner1.z
        );
        uvs.push(0, 0, 1, 0, 0, 1);

        // Triangle 2
        positions.push(
            vOuter2.x, vOuter2.y, vOuter2.z,
            vInner2.x, vInner2.y, vInner2.z,
            vInner1.x, vInner1.y, vInner1.z
        );
        uvs.push(1, 0, 1, 1, 0, 1);
    }

    // 5. Create BufferGeometry
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    roofGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    roofGeometry.computeVertexNormals();

    // 6. Wrap in a CSG Brush
    const brush = new Brush(roofGeometry, mat);

    const pos = brush.position;

    brush.position.set(pos.x, pos.y + elevation, pos.z);

    brush.updateMatrixWorld();

    return brush;
}

export function createFenestration(wallBrush, point, width, height, depth) {
    const cutterGeom = new THREE.BoxGeometry(width, height, depth);
    const cutterBrush = new Brush(cutterGeom);

    cutterBrush.position.set(point.x, point.y + height / 2, point.z);

    cutterBrush.updateMatrixWorld();

    const mat = wallBrush.material;

    const evaluator = new Evaluator();
    const roomWithHole = evaluator.evaluate(wallBrush, cutterBrush, SUBTRACTION);
    roomWithHole.material = mat;

    return roomWithHole;

}

function createSeveralFenestrations(wallBrush, points, width, height, depth) {

    const wallMat = wallBrush.material;

    const evaluator = new Evaluator();

    const geometries = [];

    for (const point of points) {
        const cutterGeom = new THREE.BoxGeometry(width, height, depth);

        cutterGeom.translate(point.x, point.y + height / 2, point.z);

        geometries.push(cutterGeom);

    }

    const mergedGeom = mergeGeometries(geometries);
    const masterCutter = new Brush(mergedGeom);
    masterCutter.updateMatrixWorld();

    const perforatedWall = evaluator.evaluate(wallBrush, masterCutter, SUBTRACTION);
    perforatedWall.material = wallMat;
    perforatedWall.updateMatrixWorld();

    return perforatedWall;
}

export function createSeveralRotatedFenestrations(wallBrush, info) {

    const wallMat = wallBrush.material;

    const evaluator = new Evaluator();

    const geometries = [];

    for (const item of info) {

        const cutterGeom = new THREE.BoxGeometry(item.size[0], item.size[1], item.size[2]);

        cutterGeom.rotateY(THREE.MathUtils.degToRad(item.rot));
        cutterGeom.translate(item.pos.x, item.pos.y + item.size[1] / 2, item.pos.z);

        geometries.push(cutterGeom);

    }

    const mergedGeom = mergeGeometries(geometries);
    const masterCutter = new Brush(mergedGeom);
    masterCutter.updateMatrixWorld();

    const perforatedWall = evaluator.evaluate(wallBrush, masterCutter, SUBTRACTION);
    perforatedWall.material = wallMat;
    perforatedWall.updateMatrixWorld();

    return perforatedWall;
}

export function createLinearWall(points, wallThickness = 0.3, wallHeight = 2.6, mat) {
    const count = points.length;
    if (count < 2) {
        console.warn("A linear wall requires at least 2 points.");
        return null;
    }

    // 1. Extract 2D Ground Points (X, Z)
    const pts2D = points.map(pt => new THREE.Vector2(pt.x, pt.z));
    const halfThick = wallThickness / 2;

    const leftPoints = [];
    const rightPoints = [];

    // 2. Compute Offsets for Open Polyline
    for (let i = 0; i < count; i++) {
        let normal = new THREE.Vector2();

        if (i === 0) {
            // Start Point: Use the direction of the first segment
            const dir = new THREE.Vector2().subVectors(pts2D[1], pts2D[0]).normalize();

            const newX = dir.y == 0 ? 0 : -dir.y;
            const newY = dir.x == 0 ? 0 : dir.x;

            normal.set(newX, newY);

        } else if (i === count - 1) {
            // End Point: Use the direction of the last segment
            const dir = new THREE.Vector2().subVectors(pts2D[count - 1], pts2D[count - 2]).normalize();
            const newX = dir.y == 0 ? 0 : -dir.y;
            const newY = dir.x == 0 ? 0 : dir.x;

            normal.set(newX, newY);
        } else {
            // Middle Points: Compute miter vector between adjacent segments
            const dir1 = new THREE.Vector2().subVectors(pts2D[i], pts2D[i - 1]).normalize();
            const dir2 = new THREE.Vector2().subVectors(pts2D[i + 1], pts2D[i]).normalize();

            const newX1 = dir1.y == 0 ? 0 : -dir1.y;
            const newY1 = dir1.x == 0 ? 0 : dir1.x;

            const newX2 = dir2.y == 0 ? 0 : -dir2.y;
            const newY2 = dir2.x == 0 ? 0 : dir2.x;

            const norm1 = new THREE.Vector2(newX1, newY1);
            const norm2 = new THREE.Vector2(newX2, newY2);

            normal.addVectors(norm1, norm2);
            if (normal.lengthSq() > 0.0001) {
                normal.normalize();
                const miterFactor = Math.max(normal.dot(norm1), 0.1);
                normal.divideScalar(miterFactor);
            } else {
                normal.copy(norm1); // Fallback if vectors cancel out
            }
        }

        // Push Left and Right offset points
        leftPoints.push(new THREE.Vector2().copy(pts2D[i]).addScaledVector(normal, halfThick));
        rightPoints.push(new THREE.Vector2().copy(pts2D[i]).addScaledVector(normal, -halfThick));
    }

    // 3. Build a Closed 2D Shape (Trace Left side forward, Cap End, Trace Right side backward)
    const wallShape = new THREE.Shape();

    // Start at first left point
    wallShape.moveTo(leftPoints[0].x, leftPoints[0].y);

    // Trace forward along the left side
    for (let i = 1; i < count; i++) {
        wallShape.lineTo(leftPoints[i].x, leftPoints[i].y);
    }

    // Cap the far end: connect last left point to last right point
    wallShape.lineTo(rightPoints[count - 1].x, rightPoints[count - 1].y);

    // Trace backward along the right side
    for (let i = count - 2; i >= 0; i--) {
        wallShape.lineTo(rightPoints[i].x, rightPoints[i].y);
    }

    wallShape.closePath(); // Caps the start point back to leftPoints[0]

    // 4. Extrude Vertically
    const extrudeSettings = {
        depth: wallHeight,
        bevelEnabled: false
    };

    const wallGeometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);

    // 5. Re-orient: Maps 2D Local Z (depth) to World +Y (Up)
    wallGeometry.rotateX(Math.PI / 2);

    //wallGeometry.position.y+=wallHeight;
    wallGeometry.translate(0, wallHeight, 0);

    const brush = new Brush(wallGeometry, mat);
    brush.updateMatrixWorld();

    return brush;
}

export function createGrid(points, name, mat) {
    const completeGrid = new THREE.Object3D();

    //line
    const geomLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geomLine, mat);

    completeGrid.add(line);

    //line vec
    const dirStart = new THREE.Vector3().subVectors(points[0], points[1]).normalize();
    const dirEnd = dirStart.clone().negate();

    //Heads
    const headStart = createCircle(points[0], dirStart, name, mat);
    const headEnd = createCircle(points[1], dirEnd, name, mat);

    completeGrid.add(headStart, headEnd);

    return completeGrid;
}

function createCircle(point, dir, name, mat) {
    const radius = 0.5;
    const segments = 64;

    const completeBubble = new THREE.Object3D();

    const rp = point.clone().addScaledVector(dir, radius);

    const curve = new THREE.EllipseCurve(
        rp.x, rp.z, radius, radius, 0, 2 * Math.PI, false, 0
    );

    const points2D = curve.getPoints(segments);
    const points3D = points2D.map(p => new THREE.Vector3(p.x, 0, p.y));

    const geom = new THREE.BufferGeometry().setFromPoints(points3D);

    const circleLine = new THREE.LineLoop(geom, mat)

    createLetter(name, rp, (letterMesh) => {
        completeBubble.add(letterMesh);
    });

    completeBubble.add(circleLine);

    return completeBubble;

}

function createLetter(letter, pos, onComplete) {
    const loader = new FontLoader();

    const cdnFontUrl = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

    loader.load(cdnFontUrl, (font) => {

        const textGeometry = new TextGeometry(letter, {
            font: font,
            size: 0.4,
            depth: 0, // Zero height means no volume/extrusion!
            curveSegments: 12
        });

        textGeometry.center();

        // Lay flat on the XZ plane
        textGeometry.rotateX(Math.PI / 2);


        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true // Renders it strictly as lines
        });

        const textMesh = new THREE.Mesh(textGeometry, wireframeMat);

        textMesh.position.copy(pos);

        if (onComplete) {
            onComplete(textMesh);
        }
    });
}

function createSite(width, depth, location) {
    const positions = [];
    const uvs = [];

    const zero = new THREE.Vector3(0, 0, 0);

    const vecRight = new THREE.Vector3(1, 0, 0);
    const vecLeft = new THREE.Vector3(-1, 0, 0);
    const vecUp = new THREE.Vector3(0, 1, 0);
    const vecDown = new THREE.Vector3(0, -1, 0);
    const vecFront = new THREE.Vector3(0, 0, 1);
    const vecBack = new THREE.Vector3(0, 0, -1);

    const p1 = zero.clone().multiplyScalar(width / 2).addScaledVector(vecBack, depth / 2);
    const p2 = p1.clone().addScaledVector(vecBack, depth);
    const p3 = p2.clone().addScaledVector(vecLeft, width);
    const p4 = p1.clone().addScaledVector(vecLeft, width);

    //Posts
    const post1 = createCube(0.1, 1, 0.1, p1, brownMaterial);
    const post2 = createCube(0.1, 1, 0.1, p2, brownMaterial);
    const post3 = createCube(0.1, 1, 0.1, p3, brownMaterial);
    const post4 = createCube(0.1, 1, 0.1, p4, brownMaterial);

    const post5 = createCube(0.1, 1, 0.1, p1.clone().add(vecBack.clone().multiplyScalar(depth / 2)), brownMaterial);
    const post6 = createCube(0.1, 1, 0.1, p4.clone().add(vecBack.clone().multiplyScalar(depth / 2)), brownMaterial);
    const post7 = createCube(0.1, 1, 0.1, p1.clone().add(vecLeft.clone().multiplyScalar(width / 2)), brownMaterial);
    const post8 = createCube(0.1, 1, 0.1, p4.clone().add(vecBack.clone().multiplyScalar(depth / 2)), brownMaterial);

    //triangle 1
    positions.push(
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    positions.push(
        p1.x, p1.y, p1.z,
        p3.x, p3.y, p3.z,
        p4.x, p4.y, p4.z
    );
    uvs.push(1, 0, 0, 0, 0, 1);

    const siteGeometry = new THREE.BufferGeometry();
    siteGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    siteGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    siteGeometry.computeVertexNormals();

    // 6. Wrap in a CSG Brush
    const allSite = new THREE.Object3D();

    const siteBrush = new Brush(siteGeometry, grassMaterial);
    siteBrush.updateMatrixWorld();

    allSite.add(siteBrush, post1, post2, post3, post4, post5, post6, post7, post8);

    allSite.position.copy(location);

    return allSite;
}
