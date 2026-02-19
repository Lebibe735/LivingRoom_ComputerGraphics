
import * as THREE from 'three';
import { scene } from './core/scene.js';
import { camera } from './core/camera.js';
import { renderer } from './core/renderer.js';
import { controls } from './controls/orbitControls.js';

import './environment/dayNight.js';
import './environment/backWallWithWindow.js';
import './interaction/raycaster.js';
import './objects/livingArea.js';
import { livingGroup, mixers} from './objects/livingArea.js';

import { animateFireInScene } from './interaction/fireInteraction.js';
import './objects/dining.js';
import './objects/room.js';
import { loadCoffeeSetup } from './loaders/loadCoffeeSetup.js';
import { updateSteam } from './loaders/loadCoffeeSetup.js';
import { loadTable } from './objects/table.js';
import { loadCat, updateCat } from './objects/cat.js';
import { createFireParticles, animateFire, setFireOn } from './objects/fireParticles.js'; // your fire particles
import { initKitchen } from './objects/kitchen.js';
import { initLampSystem, animateLamps } from './objects/lampSystem.js';
//import { createDust, animateDust } from './particles/dust.js';

/* ------------------ LIGHTS ------------------ */
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 6, 5);
dirLight.castShadow = true;
scene.add(dirLight);

/* ------------------ FIRE ------------------ */
// Create fire and add to livingGroup
const fire = createFireParticles();
fire.position.set(6.5, 0.5, 4); // adjust to your fireplace
livingGroup.add(fire);

// Fire toggle button
let fireOn = true;
const fireButton = document.createElement('button');
fireButton.innerText = "Turn Fire Off";
fireButton.style.position = 'absolute';
fireButton.style.top = '20px';
fireButton.style.left = '20px';
fireButton.style.zIndex = 10;
fireButton.style.padding = '8px 12px';
fireButton.style.fontSize = '14px';
document.body.appendChild(fireButton);

fireButton.addEventListener('click', () => {
  fireOn = !fireOn;
  setFireOn(fire, fireOn);
  fireButton.innerText = fireOn ? "Turn Fire Off" : "Turn Fire On";
});

/* ------------------ RESIZE ------------------ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ------------------ CLOCK ------------------ */
const clock = new THREE.Clock();



initKitchen();
loadCat((cat) => {
  scene.add(cat)                   
  enableCatInteraction(camera, renderer.domElement)
})


// After your sofa and livingGroup are loaded
loadCoffeeSetup(scene, camera, renderer);


initLampSystem(camera, renderer);



/* ------------------ ANIMATE LOOP ------------------ */
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update mixers (animations)
  mixers.forEach(m => m.update(delta));
 

  
  // Update controls
  controls.update();

  // Update fire
  animateFireInScene(livingGroup); // existing fires in your livingGroup
  animateFire(fire);               // our toggleable fireplace
  updateCat(delta);
   updateSteam(delta);
   animateLamps(delta);
 

   
  controls.update();
  // Render

  renderer.render(scene, camera);

}

animate();





















