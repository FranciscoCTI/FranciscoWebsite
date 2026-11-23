import * as THREE from 'three';

// ----------------------------------------------------
// Revit-Style 3D Shape Handle (Push/Pull Grip Gizmo)
// ----------------------------------------------------
export function createGripHelper(scene) {
    const group = new THREE.Group();
    const handleColor = 0x0078D4; // Revit signature shape-handle blue

    const mat = new THREE.MeshBasicMaterial({
        color: handleColor,
        depthTest: false,
        transparent: true,
        opacity: 0.95
    });

    // Outward-pointing arrow cone
    const coneOut = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 16), mat);
    coneOut.position.y = 0.65;
    coneOut.renderOrder = 9999;

    // Inward-pointing arrow cone
    const coneIn = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 16), mat);
    coneIn.position.y = -0.65;
    coneIn.rotation.x = Math.PI;
    coneIn.renderOrder = 9999;

    // Central grip anchor sphere
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), mat);
    sphere.renderOrder = 9999;

    // Connecting shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 16), mat);
    shaft.renderOrder = 9999;

    group.add(coneOut, coneIn, sphere, shaft);
    group.renderOrder = 9999;
    group.visible = false;

    // Ensure grip helper never intercepts raycasting clicks
    group.raycast = () => {};
    group.traverse((child) => {
        child.raycast = () => {};
    });

    scene.add(group);
    return group;
}

export function ensureMultiMaterial(mesh) {
    if (Array.isArray(mesh.material)) return;
    const baseMat = mesh.material;
    const groupCount =
        mesh.geometry.groups && mesh.geometry.groups.length > 0
            ? mesh.geometry.groups.length
            : 6;
    mesh.material = Array.from({ length: groupCount }, () => baseMat.clone());
}

// Directional resize cursors
export function getCursorForAxis(axis) {
    if (axis === 'x') return 'ew-resize';
    if (axis === 'y') return 'ns-resize';
    return 'nwse-resize';
}

// Helper to calculate face center point, normal, and dominant axis
export function getFaceInfo(object, face) {
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox;
    const localNormal = face.normal;

    let axis = 'x';
    const absX = Math.abs(localNormal.x);
    const absY = Math.abs(localNormal.y);
    const absZ = Math.abs(localNormal.z);

    if (absX >= absY && absX >= absZ) axis = 'x';
    else if (absY >= absX && absY >= absZ) axis = 'y';
    else axis = 'z';

    const localCenter = new THREE.Vector3();
    if (axis === 'x') {
        localCenter.x = localNormal.x > 0 ? box.max.x : box.min.x;
        localCenter.y = (box.min.y + box.max.y) / 2;
        localCenter.z = (box.min.z + box.max.z) / 2;
    } else if (axis === 'y') {
        localCenter.x = (box.min.x + box.max.x) / 2;
        localCenter.y = localNormal.y > 0 ? box.max.y : box.min.y;
        localCenter.z = (box.min.z + box.max.z) / 2;
    } else {
        localCenter.x = (box.min.x + box.max.x) / 2;
        localCenter.y = (box.min.y + box.max.y) / 2;
        localCenter.z = localNormal.z > 0 ? box.max.z : box.min.z;
    }

    const worldCenter = localCenter.clone().applyMatrix4(object.matrixWorld);
    const worldNormal = localNormal.clone().transformDirection(object.matrixWorld).normalize();

    return { worldCenter, worldNormal, axis, localNormal };
}

// Create Stretchable Box
export function createStretchableBox(
    scene,
    pos = { x: 27, y: 3, z: -28 },
    scale = { x: 6, y: 6, z: 6 },
    color = 0xdc143c,
    name = 'STRETCH_BOX'
) {
    // Multi-material with 6 materials (one for each face: +X, -X, +Y, -Y, +Z, -Z)
    const materials = Array.from({ length: 6 }, () =>
        new THREE.MeshPhongMaterial({ color: color, shininess: 30 })
    );

    const box = new THREE.Mesh(new THREE.BoxGeometry(), materials);
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    box.userData.draggable = true;
    box.userData.name = name;

    scene.add(box);
    return box;
}

// Create Stretchable Cylinder
export function createStretchableCylinder(
    scene,
    pos = { x: 38, y: 3.5, z: -6 },
    radius = 2.5,
    height = 7,
    color = 0x8b5cf6,
    name = 'STRETCH_CYLINDER'
) {
    // Multi-material for cylinder (side tube, top cap, bottom cap)
    const materials = Array.from({ length: 3 }, () =>
        new THREE.MeshPhongMaterial({ color: color, shininess: 30 })
    );

    const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, 32),
        materials
    );
    cylinder.position.set(pos.x, pos.y, pos.z);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    cylinder.userData.draggable = true;
    cylinder.userData.name = name;

    scene.add(cylinder);
    return cylinder;
}

// ----------------------------------------------------
// Controller for Solid Face Grabbing & Stretching
// ----------------------------------------------------
export function createFaceStretchController({ scene, camera, renderer, controls }) {
    const selectionColor = 0x2563eb;
    const gripHelper = createGripHelper(scene);

    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane();

    let draggable = null;
    let selectedElementColor = null;
    let selectedMaterialIndex = null;
    let selectedFaceNormal = null;
    let selectedFaceLocalNormal = null;
    let selectedAxis = null;
    let selectedFaceInitialCoord = 0;
    let selectedFaceOppositeCoord = 0;
    let initialHitPoint = new THREE.Vector3();
    let initialPositions = null;

    function setCursor(cursor) {
        if (renderer && renderer.domElement) {
            renderer.domElement.style.cursor = cursor;
        }
    }

    function updateGripPosition() {
        if (!draggable || !selectedFaceLocalNormal || !selectedAxis) return;
        const box = draggable.geometry.boundingBox;
        const localCenter = new THREE.Vector3();

        if (selectedAxis === 'x') {
            localCenter.x = selectedFaceLocalNormal.x > 0 ? box.max.x : box.min.x;
            localCenter.y = (box.min.y + box.max.y) / 2;
            localCenter.z = (box.min.z + box.max.z) / 2;
        } else if (selectedAxis === 'y') {
            localCenter.x = (box.min.x + box.max.x) / 2;
            localCenter.y = selectedFaceLocalNormal.y > 0 ? box.max.y : box.min.y;
            localCenter.z = (box.min.z + box.max.z) / 2;
        } else {
            localCenter.x = (box.min.x + box.max.x) / 2;
            localCenter.y = (box.min.y + box.max.y) / 2;
            localCenter.z = selectedFaceLocalNormal.z > 0 ? box.max.z : box.min.z;
        }

        draggable.updateMatrixWorld();
        gripHelper.position.copy(localCenter.applyMatrix4(draggable.matrixWorld));
    }

    function resizeFace1(mouseVec) {
        if (!draggable || !selectedFaceNormal || !selectedAxis) return;

        raycaster.setFromCamera(mouseVec, camera);

        const hitPoint = new THREE.Vector3();
        if (!raycaster.ray.intersectPlane(dragPlane, hitPoint)) return;

        const worldDelta = new THREE.Vector3().subVectors(hitPoint, initialHitPoint);

        // Transform world drag delta into local mesh coordinates
        const invRotation = draggable.quaternion.clone().invert();
        const localDeltaVec = worldDelta.applyQuaternion(invRotation);
        const localDelta = localDeltaVec[selectedAxis] / draggable.scale[selectedAxis];

        const axisIndex = selectedAxis === 'x' ? 0 : (selectedAxis === 'y' ? 1 : 2);
        const positions = draggable.geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const originalCoord = initialPositions[i * 3 + axisIndex];

            // Is this vertex on the selected face?
            if (Math.abs(originalCoord - selectedFaceInitialCoord) < 0.001) {
                let targetCoord = originalCoord + localDelta;

                // Prevent face from collapsing past the opposite face (minimum 0.1 units)
                if (selectedFaceLocalNormal[selectedAxis] > 0) {
                    targetCoord = Math.max(selectedFaceOppositeCoord + 0.1, targetCoord);
                } else {
                    targetCoord = Math.min(selectedFaceOppositeCoord - 0.1, targetCoord);
                }

                if (selectedAxis === 'x') {
                    positions.setX(i, targetCoord);
                } else if (selectedAxis === 'y') {
                    positions.setY(i, targetCoord);
                } else if (selectedAxis === 'z') {
                    positions.setZ(i, targetCoord);
                }
            }
        }

        positions.needsUpdate = true;
        draggable.geometry.computeBoundingBox();
        draggable.geometry.computeBoundingSphere();

        // Keep the Revit shape handle pinned to the moving face
        updateGripPosition();
    }

    function dropDraggable(mouseVec = null) {
        if (!draggable) return;

        // Revert face color back to original
        if (Array.isArray(draggable.material) && selectedMaterialIndex !== null) {
            draggable.material[selectedMaterialIndex].color.set(selectedElementColor);
        } else if (draggable.material && selectedElementColor !== null) {
            draggable.material.color.set(selectedElementColor);
        }

        selectedElementColor = null;
        selectedMaterialIndex = null;
        draggable = null;
        selectedFaceNormal = null;
        selectedFaceLocalNormal = null;
        selectedAxis = null;
        initialPositions = null;

        if (controls) controls.enabled = true;

        if (mouseVec) {
            raycaster.setFromCamera(mouseVec, camera);
            const found = raycaster.intersectObjects(scene.children, true);
            const hit = found.find(
                (h) => h.object.visible && h.object.userData.draggable && h.face
            );
            if (hit) {
                const info = getFaceInfo(hit.object, hit.face);
                gripHelper.position.copy(info.worldCenter);
                gripHelper.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    info.worldNormal
                );
                gripHelper.visible = true;
                setCursor(getCursorForAxis(info.axis));
                return;
            }
        }

        gripHelper.visible = false;
        setCursor('default');
    }

    function handleClick(mouseVec) {
        // If we are currently stretching a face, dropping it consumes the click
        if (draggable !== null) {
            dropDraggable(mouseVec);
            return true;
        }

        raycaster.setFromCamera(mouseVec, camera);
        const found = raycaster.intersectObjects(scene.children, true);
        const hit = found.find(
            (h) => h.object.visible && h.object.userData.draggable && h.face
        );

        if (hit) {
            draggable = hit.object;
            ensureMultiMaterial(draggable);

            selectedMaterialIndex =
                hit.face.materialIndex !== undefined ? hit.face.materialIndex : null;

            if (selectedMaterialIndex !== null && Array.isArray(draggable.material)) {
                selectedElementColor = draggable.material[selectedMaterialIndex].color.getHex();
                draggable.material[selectedMaterialIndex].color.set(selectionColor);
            } else if (draggable.material && draggable.material.color) {
                selectedElementColor = draggable.material.color.getHex();
                draggable.material.color.set(selectionColor);
            }

            const info = getFaceInfo(draggable, hit.face);
            selectedFaceLocalNormal = info.localNormal.clone();
            selectedFaceNormal = info.worldNormal.clone();
            selectedAxis = info.axis;

            gripHelper.position.copy(info.worldCenter);
            gripHelper.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                info.worldNormal
            );
            gripHelper.visible = true;
            setCursor(getCursorForAxis(selectedAxis));

            draggable.geometry.computeBoundingBox();
            const box = draggable.geometry.boundingBox;

            selectedFaceInitialCoord =
                selectedFaceLocalNormal[selectedAxis] > 0
                    ? box.max[selectedAxis]
                    : box.min[selectedAxis];
            selectedFaceOppositeCoord =
                selectedFaceLocalNormal[selectedAxis] > 0
                    ? box.min[selectedAxis]
                    : box.max[selectedAxis];

            initialPositions = draggable.geometry.attributes.position.array.slice();

            if (selectedAxis === 'y') {
                const cameraDir = new THREE.Vector3();
                camera.getWorldDirection(cameraDir);
                cameraDir.y = 0;
                cameraDir.normalize();
                dragPlane.setFromNormalAndCoplanarPoint(cameraDir, hit.point);
            } else {
                dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), hit.point);
            }

            initialHitPoint = new THREE.Vector3();
            raycaster.setFromCamera(mouseVec, camera);
            if (!raycaster.ray.intersectPlane(dragPlane, initialHitPoint)) {
                initialHitPoint.copy(hit.point);
            }

            // Disable orbit controls while actively resizing a face
            if (controls) controls.enabled = false;
            return true;
        }

        return false;
    }

    function handleMouseMove(mouseVec) {
        if (draggable !== null) {
            setCursor(getCursorForAxis(selectedAxis));
            resizeFace1(mouseVec);
        } else {
            raycaster.setFromCamera(mouseVec, camera);
            const found = raycaster.intersectObjects(scene.children, true);
            const hit = found.find(
                (h) => h.object.visible && h.object.userData.draggable && h.face
            );
            if (hit) {
                const info = getFaceInfo(hit.object, hit.face);
                gripHelper.position.copy(info.worldCenter);
                gripHelper.quaternion.setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    info.worldNormal
                );
                gripHelper.visible = true;
                setCursor(getCursorForAxis(info.axis));
            } else {
                gripHelper.visible = false;
                setCursor('default');
            }
        }
    }

    function handleMouseOut() {
        if (!draggable) {
            gripHelper.visible = false;
            setCursor('default');
        }
    }

    function isDragging() {
        return draggable !== null;
    }

    function dispose() {
        if (draggable) dropDraggable();
        if (gripHelper && gripHelper.parent) {
            gripHelper.parent.remove(gripHelper);
        }
    }

    return {
        gripHelper,
        handleClick,
        handleMouseMove,
        handleMouseOut,
        isDragging,
        dropDraggable,
        dispose
    };
}
