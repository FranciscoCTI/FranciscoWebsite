import * as THREE from 'three';

// #region Materials
export const greenMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
    side: THREE.DoubleSide   // Medium matte finish (higher = duller, lower = shinier)
});

export const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000, // Vibrant red
    metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
    roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
});

export const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff, // Vibrant blue
    wireframe: false,
    roughness: 0.5,
    side: THREE.DoubleSide
    // Medium matte finish (higher = duller, lower = shinier)
});

export const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Vibrant blue
    metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
    roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
});

export const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0,
    roughness: 0.5,
});

export const brownMaterial = new THREE.MeshStandardMaterial({
    color: 0x492A15, // Vibrant blue
    metalness: 0,    // 0 means it's not a metal (won't reflect darkness)
    roughness: 0.5,  // Medium matte finish (higher = duller, lower = shinier)
});

//Other object to test reflective material
export const reflectiveMaterial = new THREE.MeshStandardMaterial({
    color: greenMaterial.color, // Use the same color as the green material
    metalness: 0,
    roughness: 0.6,
});

export const lineMat = new THREE.LineBasicMaterial({
    color: 0x00ff88,
    linewidth: 1
});
// #endregion