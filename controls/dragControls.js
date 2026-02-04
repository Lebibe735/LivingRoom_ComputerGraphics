import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { camera } from '../core/camera.js';
import { renderer } from '../core/renderer.js';
import { scene } from '../core/scene.js';
import { controls } from './orbitControls.js';

export function enableDrag(objects) {
  const dragControls = new DragControls(
    objects,
    camera,
    renderer.domElement
  );

  // disable orbit while dragging
  dragControls.addEventListener('dragstart', () => {
    controls.enabled = false;
  });

  dragControls.addEventListener('dragend', () => {
    controls.enabled = true;
  });

  // keep chairs on floor
  dragControls.addEventListener('drag', (event) => {
    event.object.position.y = 0;
  });

  return dragControls;
}
