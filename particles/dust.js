// import * as THREE from 'three';
// import { scene } from '../core/scene.js';

// // ----------------------------
// // Create dust particle system
// // ----------------------------
// export function createDust(count = 100) {
//   const geometry = new THREE.BufferGeometry();
//   const positions = new Float32Array(count * 3);
//   const velocities = new Float32Array(count * 3);
//   const sizes = new Float32Array(count);

//   for (let i = 0; i < count; i++) {
//     // Random position in room volume
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 9;  // X across room
//     positions[i * 3 + 1] = Math.random() * 4;          // Y height
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 9;  // Z depth

//     // Slow drifting motion
//     velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.001;
//     velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001; 
//     velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

//     // Slight size variation
//     sizes[i] = 0.02 + Math.random() * 0.02;
//   }

//   geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//   geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//   // Use a small soft circle for dust
//   const canvas = document.createElement('canvas');
//   canvas.width = canvas.height = 64;
//   const ctx = canvas.getContext('2d');
//   const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
//   gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
//   gradient.addColorStop(1, 'rgba(255,255,255,0)');
//   ctx.fillStyle = gradient;
//   ctx.fillRect(0, 0, 64, 64);
//   const texture = new THREE.CanvasTexture(canvas);

//   const material = new THREE.PointsMaterial({
//     size: 0.03,
//     map: texture,
//     transparent: true,
//     opacity: 0.4,
//     depthWrite: false,
//     blending: THREE.NormalBlending
//   });

//   const dust = new THREE.Points(geometry, material);
//   dust.userData = { positions, velocities, count };
//   return dust;
// }

// // ----------------------------
// // Animate dust particles
// // ----------------------------
// export function animateDust(dust) {
//   const { positions, velocities, count } = dust.userData;

//   for (let i = 0; i < count; i++) {
//     positions[i * 3 + 0] += velocities[i * 3 + 0];
//     positions[i * 3 + 1] += velocities[i * 3 + 1];
//     positions[i * 3 + 2] += velocities[i * 3 + 2];

//     // Reset dust to random position if it drifts outside room bounds
//     if (positions[i * 3 + 0] > 5 || positions[i * 3 + 0] < -5 ||
//         positions[i * 3 + 1] > 5 || positions[i * 3 + 1] < 0 ||
//         positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) {
//       positions[i * 3 + 0] = (Math.random() - 0.5) * 9;
//       positions[i * 3 + 1] = Math.random() * 4;
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
//     }
//   }

//   dust.geometry.attributes.position.needsUpdate = true;
// }
