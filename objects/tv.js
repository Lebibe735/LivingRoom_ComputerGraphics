
import { gltfLoader } from '../loaders/gltfLoader.js';
import * as THREE from 'three';

export function loadTV(callback) {
  gltfLoader.load('assets/models/tv.glb', (gltf) => {
    const tv = gltf.scene;
    let screenMesh = null;

    tv.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      // Find screen mesh by name
      const name = child.name.toLowerCase();
      if (name.includes('screen') || name.includes('display')) {
        screenMesh = child;
      }
    });

    // fallback if screen not found
    if (!screenMesh) {
      console.warn('TV screen mesh not found! Using first mesh as fallback.');
      tv.traverse((child) => {
        if (!screenMesh && child.isMesh) screenMesh = child;
      });
    }

    callback({ tv, screenMesh });
  });
 
}























