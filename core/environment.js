import * as THREE from 'three';
import { scene } from './scene.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';//Loader për HDR/EXR textures per qiell me realist
import { ambientLight, sunLight } from './lights.js';

// Krijojm leader qe lexon file .exr
const loader = new EXRLoader();
let dayTexture, nightTexture;//variabla per teksturat

//Ngarkon imazhin HDR të ditës
loader.load('assets/textures/environment/sky_day.exr', (texture) => {
  
  texture.mapping = THREE.EquirectangularReflectionMapping;//E kthen teksturën në:background 360° e mbeshtjell gjithe skenen si qiell
  dayTexture = texture;

  // Optional: set as initial background
  scene.background = dayTexture;//background → qielli që shohim
  scene.environment = dayTexture;//environment → reflektimet në objekte
});

loader.load('assets/textures/environment/sky_night.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  nightTexture = texture;
});

// Function to switch between day and night
let isDay = true;
export function toggleDayNight() {
  isDay = !isDay;//switch automatik
  if (isDay) {
    scene.background = dayTexture;
    scene.environment = dayTexture;
    ambientLight.intensity = 0.5;//drit me e fort dhe skene me e ndritshme
    sunLight.intensity = 1;
  } else {
    scene.background = nightTexture;
    scene.environment = nightTexture;
    ambientLight.intensity = 0.2;//me pak drite dhe skene me e erret
    sunLight.intensity = 0.1;
  }
}
