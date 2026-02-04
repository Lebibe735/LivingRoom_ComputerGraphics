
import * as THREE from 'three';

// Create a soft circular texture for particles
function createFireTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(0.2, 'yellow');
  gradient.addColorStop(0.5, 'orange');
  gradient.addColorStop(1, 'rgba(255,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

// Create the fire particle system
export function createFireParticles() {
  const count = 250;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Random starting position near base, some slightly higher for irregular flame
    positions[i*3+0] = (Math.random()-0.5)*0.08;
    positions[i*3+1] = Math.random()*0.05;
    positions[i*3+2] = (Math.random()-0.5)*0.08;

    // Upward velocity with variation (some rise fast, some slow)
    velocities[i*3+0] = (Math.random()-0.5)*0.004;
    velocities[i*3+1] = 0.004 + Math.random()*0.008;
    velocities[i*3+2] = (Math.random()-0.5)*0.004;

    // Initial color (orange/red)
    colors[i*3+0] = 1.0;
    colors[i*3+1] = 0.5 + Math.random()*0.5;
    colors[i*3+2] = 0.0;

    // Size variation for depth
    sizes[i] = 0.06 + Math.random()*0.04;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const texture = createFireTexture();

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.07,
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  particles.userData = { positions, velocities, colors, sizes, count, intensity: 1, targetIntensity: 1 };
  return particles;
}

// Animate fire: flicker, taper, sway, and reset
export function animateFire(particles) {
  const { positions, velocities, colors, sizes, count } = particles.userData;

  // Smooth intensity fade in/out
  particles.userData.intensity += (particles.userData.targetIntensity - particles.userData.intensity) * 0.05;
  particles.material.opacity = particles.userData.intensity;

  for (let i = 0; i < count; i++) {
    // Sideways flicker using sine/cosine
    positions[i*3+0] += velocities[i*3+0] + Math.sin(positions[i*3+1]*20 + i)*0.001;
    positions[i*3+1] += velocities[i*3+1];
    positions[i*3+2] += velocities[i*3+2] + Math.cos(positions[i*3+1]*20 + i)*0.001;

    // Dynamic tapering (soft, irregular)
    positions[i*3+0] *= 1 - Math.pow(positions[i*3+1], 1.5);
    positions[i*3+2] *= 1 - Math.pow(positions[i*3+1], 1.5);

    // Color gradient by height (red → orange → yellow → white)
    colors[i*3+0] = 1.0;
    colors[i*3+1] = Math.min(1, 0.5 + positions[i*3+1]*6);
    colors[i*3+2] = Math.min(0.3, positions[i*3+1]*2);

    // Size flicker
    sizes[i] = 0.06 + Math.random()*0.04;

    // Reset if too high or spread too far
    if (positions[i*3+1] > 0.18 || Math.abs(positions[i*3+0]) > 0.08 || Math.abs(positions[i*3+2]) > 0.08) {
      positions[i*3+0] = (Math.random()-0.5)*0.08;
      positions[i*3+1] = 0;
      positions[i*3+2] = (Math.random()-0.5)*0.08;

      velocities[i*3+0] = (Math.random()-0.5)*0.004;
      velocities[i*3+1] = 0.004 + Math.random()*0.008;
      velocities[i*3+2] = (Math.random()-0.5)*0.004;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.color.needsUpdate = true;
}

// Toggle fire on/off (completely disappears when off)
export function setFireOn(particles, on) {
  particles.userData.targetIntensity = on ? 1 : 0;

  if (!on) {
    const { positions, velocities, count } = particles.userData;
    for (let i = 0; i < count; i++) {
      positions[i*3+0] = (Math.random()-0.5)*0.08;
      positions[i*3+1] = 0;
      positions[i*3+2] = (Math.random()-0.5)*0.08;

      velocities[i*3+0] = (Math.random()-0.5)*0.004;
      velocities[i*3+1] = 0;
      velocities[i*3+2] = (Math.random()-0.5)*0.004;
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }
}
