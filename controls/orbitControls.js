import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { camera } from '../core/camera.js';
import { renderer } from '../core/renderer.js';

export const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enablePan = true;
controls.minDistance = 2;
controls.maxDistance = 15;

controls.target.set(0, 1, 0);
controls.update();
