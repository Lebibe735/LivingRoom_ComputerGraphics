import { gltfLoader } from './gltfLoader.js';

export function loadKitchen(callback) {
  gltfLoader.load(
    'assets/models/kitchen.glb',
    (gltf) => {
      console.log('✅ Kitchen loaded');
      callback(gltf.scene);
    },
    undefined,
    (error) => {
      console.error('❌ Kitchen load error:', error);
    }
  );

}

