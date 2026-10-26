import * as THREE from 'three';
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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


/**
 * Generates a wall mesh from an array of 2D floor plan control points.
 * @param {THREE.Vector2[]} points - Array of ordered corner points on the ground plane.
 * @param {number} wallThickness - Width/thickness of the wall.
 * @param {number} wallHeight - Height to extrude vertically.
 * @param {THREE.Material} material - Surface material.
 */
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

/**
 * Creates a room/wall geometry by extruding a 2D floorplan footprint vertically.
 * @param {THREE.Vector2[]} cornerPoints - Ordered array of corner points on the ground plane (X, Z).
 * @param {number} wallThickness - Width of the wall (e.g., 0.3).
 * @param {number} wallHeight - Vertical height of the wall (e.g., 2.6).
 * @param {THREE.Material} mat - Material for the CSG Brush.
 */
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