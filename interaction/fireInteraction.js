

import * as THREE from 'three';
import { animateFire } from '../objects/fireParticles.js';
//clickMesh → objekti që mund të klikohet (p.sh. fireplace)
//mixer → për animacione (nuk përdoret shumë këtu)
//action → animacioni i zjarrit (play/stop)
//fire → objekti i zjarrit që do të shfaqet/fikohet
//camera → kamera e skenës (për raycasting)
export function setupFireInteraction(clickMesh, mixer, action, fire, camera) {
  let fireOn = true;
  const raycaster = new THREE.Raycaster();//raycaster → përdoret për të “gjuajtur” rreze nga kamera dhe të gjejë objektin që klikohet

  const mouse = new THREE.Vector2();//mouse → koordinatat e mausit në sistemin -1 → 1 (Three.js)

  window.addEventListener('click', (e) => {//Çdo herë që përdoruesi klikojnë në ekran → ekzekutohet kjo funksion.
    //Three.js përdor koordinata -1 → 1 për raycaster
//(clientX / width) * 2 - 1 → kthen maus horizontal nga 0→1 në -1→1
//(clientY / height) * 2 - 1 → kthen maus vertical nga 0→1 në -1→1 (y është i kundërt)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
// raycaster.setFromCamera(mouse, camera) → krijon rreze nga kamera drejt mausit
// intersectObject(clickMesh) → kontrollon nëse rrezja godet objektin
// length == 0 → nuk godet → nuk bëjmë asgjë
    raycaster.setFromCamera(mouse, camera);
    if (!raycaster.intersectObject(clickMesh).length) return;

    fireOn = !fireOn;
    fire.visible = fireOn;

    if (action) fireOn ? action.play() : action.stop();
  });
}
// group → një grup objektesh në skenë
// .traverse() → kalon të gjithë objektet brenda grupit
// obj.isPoints && obj.visible → vetëm pikë (fire particles) që janë të dukshme
// animateFire(obj) → thërret funksionin për animacionin e partikujve të zjarrit
export function animateFireInScene(group) {
  group.traverse(obj => {
    if (obj.isPoints && obj.visible) animateFire(obj);
  });
}
