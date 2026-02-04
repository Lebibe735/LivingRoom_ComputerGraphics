import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { loadChairs } from './chairs.js';
import { loadTable } from './table.js';
import { enableDrag } from '../controls/dragControls.js';

const diningGroup = new THREE.Group();
diningGroup.position.set(-3, 0, -3); // corner placement
scene.add(diningGroup);


const draggableChairs = [];

/* =========================
   LOAD TABLE
========================= */

loadTable((table) => {
  table.position.set(0, 0, 0);
  table.scale.set(1.35, 1.35, 1.35);
  diningGroup.add(table);
});

/* =========================
   LOAD CHAIRS
========================= */

loadChairs((chairModel) => {
  const chairPositions = [
    [ 0, 0, -1.3], // front
    [ 0, 0,  1.3], // back
    [-1.3, 0,  0], // left
    [ 1.3, 0,  0], // right
    [ 1.3, 0, -1.3], // corner
  ];

  chairPositions.forEach((pos) => {
    const chair = chairModel.clone(true);
    chair.position.set(pos[0], 0, pos[2]);
    chair.scale.set(1.3, 1.3,1.3);

    // rotate chairs to face table
    chair.lookAt(0, 0, 0);

    diningGroup.add(chair);
    draggableChairs.push(chair);
  });

  enableDrag(draggableChairs);
});
