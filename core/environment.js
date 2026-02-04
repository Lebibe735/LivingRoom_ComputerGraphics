import * as THREE from 'three';
import { scene } from './scene.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { ambientLight, sunLight } from './lights.js';

// Load HDRI environments
const loader = new EXRLoader();
let dayTexture, nightTexture;

loader.load('assets/textures/environment/sky_day.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  dayTexture = texture;

  // Optional: set as initial background
  scene.background = dayTexture;
  scene.environment = dayTexture;
});

loader.load('assets/textures/environment/sky_night.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  nightTexture = texture;
});

// Function to switch between day and night
let isDay = true;
export function toggleDayNight() {
  isDay = !isDay;
  if (isDay) {
    scene.background = dayTexture;
    scene.environment = dayTexture;
    ambientLight.intensity = 0.5;
    sunLight.intensity = 1;
  } else {
    scene.background = nightTexture;
    scene.environment = nightTexture;
    ambientLight.intensity = 0.2;
    sunLight.intensity = 0.1;
  }
}
