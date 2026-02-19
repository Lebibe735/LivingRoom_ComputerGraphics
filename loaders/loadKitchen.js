import { gltfLoader } from './gltfLoader.js';

// Funksioni për të ngarkuar modelin e kuzhinës
// Merr një callback për ta përdorur modelin jashtë funksionit
export function loadKitchen(callback) {
  gltfLoader.load(
    'assets/models/kitchen.glb',  // rruga e modelit GLB të kuzhinës
    (gltf) => {                    // kur ngarkohet me sukses
      console.log('✅ Kitchen loaded');  // log në console që modeli u ngarkua
      callback(gltf.scene);              // dërgon skenën e kuzhinës te callback
    },
    undefined,                       // mund të vendosësh progress callback, këtu nuk përdoret
    (error) => {                     // nëse ndodh gabim gjatë ngarkimit
      console.error('❌ Kitchen load error:', error); // shfaq gabimin në console
    }
  );
}
