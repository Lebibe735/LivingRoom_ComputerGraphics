

import * as THREE from 'three';
import { animateFire } from '../objects/fireParticles.js';

export function setupFireInteraction(clickMesh, mixer, action, fire, camera) {
  let fireOn = true;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    if (!raycaster.intersectObject(clickMesh).length) return;

    fireOn = !fireOn;
    fire.visible = fireOn;

    if (action) fireOn ? action.play() : action.stop();
  });
}

export function animateFireInScene(group) {
  group.traverse(obj => {
    if (obj.isPoints && obj.visible) animateFire(obj);
  });
}
