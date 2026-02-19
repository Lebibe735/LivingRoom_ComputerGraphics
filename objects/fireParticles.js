import * as THREE from 'three';

/*
========================================================
KRIJIMI I FIRE PARTICLES
========================================================
*/
export function createFireParticles() {

  const count = 200; // Numri i grimcave që do të krijohen
  const geometry = new THREE.BufferGeometry(); // BufferGeometry për të ruajtur pozicionet dhe ngjyrat e grimcave

  // Arrays për të ruajtur të dhënat e grimcave
  const positions = new Float32Array(count * 3); // X, Y, Z për çdo grimcë
  const velocities = new Float32Array(count * 3); // Shpejtësia e lëvizjes së çdo grimce
  const colors = new Float32Array(count * 3); // Ngjyra RGB e çdo grimce

  // Loop për të inicializuar çdo grimcë
  for (let i = 0; i < count; i++) {

    const index = i * 3; // Pozicioni fillestar në array për grimcën e i-të

    // -------------------------------
    // POZICIONI FILLESTAR
    // -------------------------------
    positions[index]     = (Math.random() - 0.5) * 0.15; // X: rreth qendres, -0.075 → 0.075
    positions[index + 1] = 0;                             // Y: fillon në bazë
    positions[index + 2] = (Math.random() - 0.5) * 0.15; // Z: rreth qendres

    // -------------------------------
    // VELOCITIES (shpejtësia)
    // -------------------------------
    velocities[index]     = 0;                            // X nuk lëviz
    velocities[index + 1] = 0.0002 + Math.random() * 0.005; // Y: ngadalë lart
    velocities[index + 2] = 0;                            // Z nuk lëviz

    // -------------------------------
    // NGJYRA FILLESTARE
    // -------------------------------
    colors[index]     = 1; // R = 1 (gjithmonë e kuqe)
    colors[index + 1] = 0; // G = 0 (fillestar)
    colors[index + 2] = 0; // B = 0 (fillestar)
  }

  // Vendos atributet e BufferGeometry-së
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  );

  // Materiali për grimcat
  const material = new THREE.PointsMaterial({
    vertexColors: true, // Ngjyrat për grimcat
    size: 0.05,         // Madhësia e grimcës
    transparent: true,  // Transparencë e materialit
    opacity: 1          // Opaciteti fillestar
  });

  // Krijon objektin Points
  const particles = new THREE.Points(geometry, material);

  // Ruaj të dhënat e grimcave në userData për animacionin
  particles.userData = {
    positions,      // Array pozicionesh
    velocities,     // Array shpejtësish
    colors,         // Array ngjyrash
    count,          // Numri i grimcave
    intensity: 1,   // Opaciteti aktual (fade in/out)
    targetIntensity: 1 // Opaciteti i synuar
  };

  return particles; // Kthen objektin e grimcave
}

/*
========================================================
ANIMIMI
========================================================
*/
export function animateFire(particles) {

  const data = particles.userData;           // Merr të dhënat nga userData
  const { positions, velocities, colors, count } = data; // Destructuring për qartësi

  // -------------------------------
  // FADE IN / FADE OUT
  // -------------------------------
  // E rrit ose e ul gradualisht opacitetin (exponential smoothing)
  data.intensity += (data.targetIntensity - data.intensity) * 0.05;
  particles.material.opacity = data.intensity;

  // Nëse intensity është shumë e vogël, ndalo animacionin për të kursyer CPU
  if (data.intensity < 0.01) return;

  // -------------------------------
  // LOOP PËR ÇDO GRIMCË
  // -------------------------------
  for (let i = 0; i < count; i++) {

    const index = i * 3;

    // -------------------------------
    // LËVIZJA LART
    // -------------------------------
    positions[index + 1] += velocities[index + 1] * 0.5; // Faktor 0.5 e ngadalëson

    const y = positions[index + 1]; // Ruaj lartësinë aktuale

    // -------------------------------
    // NGJYRA SIPAS LARTËSISË
    // -------------------------------
    // Krijon gradient të thjeshtë: poshtë = e kuqe, lart = portokalli
    colors[index]     = 1;        // R gjithmonë 1
    colors[index + 1] = y * 4;    // G rritet sa më lart grimca
    colors[index + 2] = 0;        // B gjithmonë 0

    // Limitimi i G = 1
    if (colors[index + 1] > 1) {
      colors[index + 1] = 1;
    }

    // -------------------------------
    // RESET KUR GRIMCA SHKON LART
    // -------------------------------
    if (y > 0.18) {
      // Kthen grimcën në bazë me pozicion të ri rastësor
      positions[index]     = (Math.random() - 0.5) * 0.15;
      positions[index + 1] = 0;
      positions[index + 2] = (Math.random() - 0.5) * 0.15;
    }
  }

  // Njofton Three.js që të përditësojë atributet
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.color.needsUpdate = true;
}

/*
========================================================
NDEZ / FIK ZJARRIN
========================================================
*/
export function setFireOn(particles, on) {
  // Ndryshon targetIntensity për fade in / fade out
  particles.userData.targetIntensity = on ? 1 : 0;
}
