
import * as THREE from 'three';
import { gltfLoader } from './gltfLoader.js';

export function loadFireplace(callback) {
  gltfLoader.load(
    'assets/models/fireplace.glb',
    (gltf) => {
      const fireplace = gltf.scene;

      fireplace.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });

      const mixer = new THREE.AnimationMixer(fireplace);
      const action = gltf.animations[0]
        ? mixer.clipAction(gltf.animations[0])
        : null;

      callback({ fireplace, mixer, action });
    },
    undefined,
    (err) => console.error('Fireplace failed to load', err)
  );
 
}
