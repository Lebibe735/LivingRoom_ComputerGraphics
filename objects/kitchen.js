
import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { loadKitchen } from '../loaders/loadKitchen.js';

export const kitchenGroup = new THREE.Group();

// ADD
export const kitchenBox = new THREE.Box3();

export function initKitchen() {

  kitchenGroup.position.set(5, 0, -5);
  scene.add(kitchenGroup);

  loadKitchen((kitchen) => {

    kitchen.scale.set(1, 1.3, 1);
    kitchen.rotation.y = Math.PI;

    kitchenGroup.add(kitchen);

    const box = new THREE.Box3().setFromObject(kitchen);
    const size = box.getSize(new THREE.Vector3());

    kitchen.position.x = -size.x / 2;

    const backOffset = -1.8;
    kitchen.position.z = size.z / 2 - backOffset;

    kitchen.position.y = 0;

    // SET COLLISION BOX
    kitchenBox.setFromObject(kitchenGroup);

  });
}
