
import * as THREE from 'three'; 
import { gltfLoader } from '../loaders/gltfLoader.js';

// Funksion për ngarkimin e tavolinës dhe enës me fruta
export function loadTable(callback, scene, camera) {
  let table = null;

  // ---------- NGARKO TAVOLINË ----------
  gltfLoader.load('assets/models/table.glb', (gltf) => {
    table = gltf.scene;

    // Aktivizo hije për çdo mesh në tavolinë
    table.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;      // tavolina hedh hije
        c.receiveShadow = true;   // tavolina merr hije
      }
    });

    // Kthe tavolinën për përdorim të mëtejshëm
    callback(table);

    // Ky ngarkim shtesë nga CDN duket i panevojshëm
    gltfLoader.load('https://yourcdn.com/models/table.glb', (gltf) => {
      scene.add(gltf.scene); // mund të shkaktojë tavolinë të dyfishtë
    });

    // ---------- NGARKO ENËN ME FRUTA ----------
    gltfLoader.load('assets/models/fruitbowl.glb', (fruitGltf) => {
      const fruitBowl = fruitGltf.scene;
      fruitBowl.scale.set(1, 1, 1); // shkalla standarde

      // Përdor Box3 për të marrë kufijtë e tavolinës dhe të enës
      const tableBox = new THREE.Box3().setFromObject(table);
      const fruitBox = new THREE.Box3().setFromObject(fruitBowl);

      // Vendos fruitBowl mbi tavolinë
      const extraDown = 0.27; // rregullim që të ulet pak më poshtë
      fruitBowl.position.y = tableBox.max.y - fruitBox.min.y - extraDown; 
      fruitBowl.position.x = 0;
      fruitBowl.position.z = 0;

      // Aktivizo hije për çdo pjesë të enës
      fruitBowl.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });

      // Shto fruitBowl si fëmijë i tavolinës
      table.add(fruitBowl);

      
    });
  });
}

































// import * as THREE from 'three'; 
// import { gltfLoader } from '../loaders/gltfLoader.js';
// import { enableDrag } from '../controls/dragControls.js';

// export function loadTable(callback, scene, camera) {
//   let table = null;

//   gltfLoader.load('assets/models/table.glb', (gltf) => {
//     table = gltf.scene;
//     table.traverse(c => {
//       if (c.isMesh) {
//         c.castShadow = true;
//         c.receiveShadow = true;
//       }
//     });

//     callback(table);

//     gltfLoader.load('assets/models/fruitbowl.gltf', (fruitGltf) => {
//       const fruitBowl = fruitGltf.scene;
//       fruitBowl.scale.set(1, 1, 1);

//       const tableBox = new THREE.Box3().setFromObject(table);
//       const fruitBox = new THREE.Box3().setFromObject(fruitBowl);
//       const extraDown = 0.27;
//       fruitBowl.position.y = tableBox.max.y - fruitBox.min.y - extraDown;
//       fruitBowl.position.x = 0;
//       fruitBowl.position.z = 0;

//       fruitBowl.traverse(c => {
//         if (c.isMesh) {
//           c.castShadow = true;
//           c.receiveShadow = true;
//         }
//       });

//       table.add(fruitBowl);

// // IMPORTANT: bowl is child of table
//       enableDrag([fruitBowl], camera, table);


//     });
//   });
// }







