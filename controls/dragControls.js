import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { camera } from '../core/camera.js';//marrim kameren e skenes sepse DragControls duhet të dijë nga cili kënd po shohim
import { renderer } from '../core/renderer.js';//renderer.domElement → canvas ku ndodhin klikimet e mausit

import { controls } from './orbitControls.js';//per rrotullim ,zoom dhe pamjen e kameres
//Krijojmë një funksion që:merr një listë objektesh (objects) dhe u aktivizon drag
export function enableDrag(objects) {
  const dragControls = new DragControls(
    objects,//objects → cilat objekte lëvizin
    camera,//camera → nga cili kënd shohim
    renderer.domElement//ku kapet klikimi i mausit
  );

  // disable orbit while dragging
  //pa këtë → kamera + objekti lëvizin bashkë (bug) pra bllokojm kameren gjate levizjes
  dragControls.addEventListener('dragstart', () => {
    controls.enabled = false;
  });

  dragControls.addEventListener('dragend', () => {
    controls.enabled = true;
  });

  // keep chairs on floor pra kur levizim kur bejme drag ta kemi objektin ne toke
  dragControls.addEventListener('drag', (event) => {
    event.object.position.y = 0;
  });

  return dragControls;
}
