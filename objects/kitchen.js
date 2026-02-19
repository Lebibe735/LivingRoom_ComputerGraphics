
import * as THREE from 'three'; 
// Importon komplet librarinë Three.js për 3D rendering

import { scene } from '../core/scene.js'; 
// Merr referencën e skenës kryesore ku shtohen objektet 3D

import { loadKitchen } from '../loaders/loadKitchen.js'; 
// Funksion që ngarkon modelin 3D të kuzhinës (zakonisht .gltf ose .glb)

export const kitchenGroup = new THREE.Group();
// Krijon një grup (container 3D)
// Çdo objekt brenda tij trashegon pozicionin, rotacionin dhe scale-in e grupit

// ADD
export const kitchenBox = new THREE.Box3();
// Krijon një bounding box (kuti imagjinare 3D)
// Do përdoret për collision detection

export function initKitchen() {

  kitchenGroup.position.set(5, 0, -5);
  /*
  Vendos komplet grupin në koordinata:

  X = 5   → 5 njësi djathtas
  Y = 0   → në nivelin e tokës
  Z = -5  → 5 njësi prapa

  Në sistemin 3D:
  X = majtas/djathtas
  Y = lart/poshtë
  Z = para/prapa
  */

  scene.add(kitchenGroup);
  // Shton grupin në skenë që të renderohet

  loadKitchen((kitchen) => {
  // Pasi modeli të ngarkohet, ekzekutohet ky callback

    kitchen.scale.set(1, 1.3, 1);
    /*
    Scale shumëzon dimensionet:

    dimension_final = dimension_original × scale

    X = 1   → nuk ndryshon
    Y = 1.3 → 30% më e lartë
    Z = 1   → nuk ndryshon
    */

    kitchen.rotation.y = Math.PI;
    /*
    Math.PI = 3.14159 radian = 180°

    Rrotullon modelin 180° rreth boshtit Y
    (e kthen përballë ose mbrapa)
    */

    kitchenGroup.add(kitchen);
    // Shton modelin brenda grupit

    const box = new THREE.Box3().setFromObject(kitchen);
    /*
    Krijon një bounding box që rrethon modelin.

    Box3 ka:
    min (x,y,z)
    max (x,y,z)
    */

    const size = box.getSize(new THREE.Vector3());
    /*
    Llogarit dimensionet reale të modelit:

    size.x = max.x - min.x  → gjerësia
    size.y = max.y - min.y  → lartësia
    size.z = max.z - min.z  → thellësia
    */

    kitchen.position.x = -size.x / 2;
    /*
    Centrim horizontal.

    Pse -size.x / 2 ?

    Nëse gjerësia është p.sh 4,
    atëherë gjysma është 2.

    Duke vendosur -2,
    objekti zhvendoset majtas me gjysmën e gjerësisë
    dhe qendra e tij përputhet me qendrën e grupit.

    Formula e qendrës:
    center = dimension / 2
    */

    const backOffset = -1.8;
    // Offset manual për ta shtyrë kuzhinën pak përpara ose mbrapa

    kitchen.position.z = size.z / 2 - backOffset;
    /*
    size.z / 2 → zhvendos përpara me gjysmën e thellësisë

    - backOffset → sepse backOffset është -1.8,
    minus minus bëhet plus:

    size.z/2 - (-1.8)
    = size.z/2 + 1.8

    Pra e shtyn pak përpara për rregullim pozicioni.
    */

    kitchen.position.y = 0;
    // Siguron që kuzhina të jetë në nivelin e tokës

    // SET COLLISION BOX
    kitchenBox.setFromObject(kitchenGroup);
    /*
    Krijon bounding box për gjithë grupin.

    Përdoret për:
    - collision detection
    - ndalim lëvizjeje
    - kontroll hapësire
    */

  });
}
