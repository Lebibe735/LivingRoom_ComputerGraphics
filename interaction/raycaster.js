import * as THREE from 'three';
import { camera } from '../core/camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const clickableObjects = [];

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    object.userData?.onClick?.();
  }
}

window.addEventListener('click', onClick);
