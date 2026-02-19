
import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { loadChairs } from './chairs.js';
import { loadTable } from './table.js';
import { enableDrag } from '../controls/dragControls.js';

/* =========================
   GRUPI I DHOMËS SË DREKËS
========================= */
// Krijojmë një grup për tavolinën dhe karriget e ngrënies
const diningGroup = new THREE.Group();

// Vendosim të gjithë grupin në një cep të dhomës
diningGroup.position.set(-3, 0, -3); // x=-3, y=0 (tokë), z=-3 (cep)
scene.add(diningGroup); // shtojmë grupin në skenë

// Array për ruajtjen e karrigeve që mund të lëvizen
const draggableChairs = [];

/* =========================
   LOAD TABLE
========================= */
// Ngarkon modelin 3D të tavolinës
loadTable((table) => {

  table.position.set(0, 0, 0);      // tavolina vendoset në qendër të diningGroup
  table.scale.set(1.35, 1.35, 1.35); // rritet pak në të gjitha dimensionet
  diningGroup.add(table);           // shto tavolinën në grup
});

/* =========================
   LOAD CHAIRS
========================= */
// Ngarkon modelin 3D të karriges
loadChairs((chairModel) => {

  // Pozicionet ku do vendosen karriget rreth tavolinës
  const chairPositions = [
    [ 0, 0, -1.3], // karrige përpara tavolinës
    [ 0, 0,  1.3], // karrige pas tavolinës
    [-1.3, 0,  0], // karrige majtas
    [ 1.3, 0,  0], // karrige djathtas
    [ 1.3, 0, -1.3], // karrige në cep (diagonal)
  ];

  // Për çdo pozicion, klonojmë modelin bazë të karriges
  chairPositions.forEach((pos) => {

    const chair = chairModel.clone(true); // klonim me mesh-et dhe materialet
    chair.position.set(pos[0], 0, pos[2]); // vendosim karrigen në pozicionin e përcaktuar
    chair.scale.set(1.3, 1.3, 1.3);        // rritje paksa

    // Rrotullon karrigen për t'u përballur drejt tavolinës
    chair.lookAt(0, 0, 0); // 0,0,0 është qendra e diningGroup

    diningGroup.add(chair);        // shto karrigen në grup
    draggableChairs.push(chair);   // ruajmë në array për dragControl
  });

  // Aktivizon **drag controls**, për të mundësuar tërheqjen/lëvizjen e karrigeve me mouse
  enableDrag(draggableChairs);
});
