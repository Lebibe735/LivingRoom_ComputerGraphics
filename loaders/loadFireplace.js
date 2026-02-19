import * as THREE from 'three';
import { gltfLoader } from './gltfLoader.js';

// Funksioni për të ngarkuar modelin e oxhakut
// Merr një callback për të përdorur fireplace, mixer dhe action jashtë funksionit
export function loadFireplace(callback) {
  gltfLoader.load(
    'assets/models/fireplace.glb',  // rruga e modelit GLB të oxhakut
    (gltf) => {                     // kur ngarkohet me sukses
      const fireplace = gltf.scene; // marrim scene-in e modelit

      // =========================================
      // Shto Shadows (hije) për çdo mesh të oxhakut
      // =========================================
      fireplace.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;     // mesh-i mund të hedhë hije
          c.receiveShadow = true;  // mesh-i mund të marrë hije
        }
      });

      // =========================================
      // Animation mixer për oxhakun
      // =========================================
      const mixer = new THREE.AnimationMixer(fireplace); // krijon mixer për animacionet e oxhakut
      const action = gltf.animations[0]                  // merr animacionin e parë (nëse ekziston)
        ? mixer.clipAction(gltf.animations[0])           // krijon action për animacionin
        : null;                                         // nëse nuk ka animacion, vendos null

      // Dërgo oxhakun, mixer dhe action te callback
      callback({ fireplace, mixer, action });
    },
    undefined, // mund të vendosësh progress callback, këtu nuk përdoret
    (err) => console.error('Fireplace failed to load', err) // nëse ndodh gabim
  );
}
