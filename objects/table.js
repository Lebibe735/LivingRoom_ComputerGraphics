
import * as THREE from 'three'; 
import { gltfLoader } from '../loaders/gltfLoader.js';
import { enableDrag } from '../controls/dragControls.js';

export function loadTable(callback, scene, camera) {
  let table = null;

  gltfLoader.load('assets/models/table.glb', (gltf) => {
    table = gltf.scene;
    table.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    callback(table); // keep table exactly where it is
    gltfLoader.load('https://yourcdn.com/models/table.glb', (gltf) => {
  scene.add(gltf.scene);
});
    // ---------- LOAD FRUIT BOWL ----------
    gltfLoader.load('assets/models/fruitbowl.glb', (fruitGltf) => {
      const fruitBowl = fruitGltf.scene;
      fruitBowl.scale.set(1, 1, 1);

      // place fruit bowl on table
      const tableBox = new THREE.Box3().setFromObject(table);
      const fruitBox = new THREE.Box3().setFromObject(fruitBowl);
      const extraDown = 0.27; // adjust so bowl sits flush
      fruitBowl.position.y = tableBox.max.y - fruitBox.min.y - extraDown;
      fruitBowl.position.x = 0;
      fruitBowl.position.z = 0;

      fruitBowl.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });

      table.add(fruitBowl);

      // ---------- ENABLE DRAG FOR THE WHOLE BOWL ----------
      enableDrag([fruitBowl], camera); // pass the top-level fruitBowl only
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







