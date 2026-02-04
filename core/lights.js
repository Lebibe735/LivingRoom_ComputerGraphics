import * as THREE from 'three';
import { scene } from './scene.js';

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

export { ambientLight, sunLight };
