import * as THREE from 'three';
import { camera } from '../core/camera.js';
//raycaster → krijon një rreze nga kamera drejt mausit, për të gjetur objektet që goditen

// mouse → ruan pozicionin e mausit në koordinata -1 → 1 (Three.js)

// clickableObjects → lista e të gjitha objekteve që mund të klikohen
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const clickableObjects = [];

function onClick(event) {
  //e kthejmë pozicionin e mausit nga pixel → koordinata Three.js (-1…1), që raycaster të dijë drejt nga ku të gjuajë rreze në 3D
  //(clientX / width) * 2 - 1 → kthen maus horizontal nga 0→1 në -1→1
//(clientY / height) * 2 - 1 → kthen maus vertical nga 0→1 në -1→1 (y është i kundërt)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//const intersects = raycaster.intersectObjects(clickableObjects, true);
// raycaster.setFromCamera(mouse, camera) → gjen një rreze nga kamera drejt mausit

// intersectObjects(clickableObjects, true) → kontrollon cilët objekte nga lista goditen

// true → kontrollon edhe fëmijët e objekteve

// intersects = array me të gjitha objektet që goditen nga rrezja


  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);
//intersects[0] → merr objektin më afër kamerës
// object.userData?.onClick?.() → nëse objekti ka userData.onClick, thërret këtë funksion
// Pra mund të caktojmë çdo funksion të veçantë për çdo objekt
  if (intersects.length > 0) {
    const object = intersects[0].object;
    object.userData?.onClick?.();
  }
}

window.addEventListener('click', onClick);
