import * as THREE from 'three';
import { scene } from './scene.js';
import { camera } from './camera.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // shadows on
document.body.appendChild(renderer.domElement);

export { renderer };
