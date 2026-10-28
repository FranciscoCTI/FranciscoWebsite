import * as THREE from 'three';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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

export function createSeveralFenestrations(wallBrush, points, width, height, depth) {

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

function removeNegativeZero(vector) {
    vector.x = vector.x === 0 ? 0 : vector.x;
    vector.y = vector.y === 0 ? 0 : vector.y;
    if (vector.z !== undefined) {
        vector.z = vector.z === 0 ? 0 : vector.z;
    }
    return vector;
}