
import * as THREE from 'three';
import { scene } from '../core/scene.js';

let isDay = true;

/* ----------------------
   Sun (sphere + light)
------------------------*/
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(5, 8, 5);
sunLight.castShadow = true;
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
sun.position.copy(sunLight.position);
scene.add(sun);

/* ----------------------
   Moon (sphere + light)
------------------------*/
const moonLight = new THREE.DirectionalLight(0x8899ff, 0.3);
moonLight.position.set(-5, 6, -5);
moonLight.castShadow = true;
moonLight.visible = false;
scene.add(moonLight);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xddddff })
);
moon.position.copy(moonLight.position);
moon.visible = false;
scene.add(moon);

/* ----------------------
   Ambient light
------------------------*/
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

/* ----------------------
   Stars
------------------------*/
const starsCount = 200;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(starsCount * 3);
const starsBrightness = new Float32Array(starsCount);

for (let i = 0; i < starsCount; i++) {
  starsPositions[i*3+0] = (Math.random()-0.5)*50;
  starsPositions[i*3+1] = Math.random()*20 + 10;
  starsPositions[i*3+2] = (Math.random()-0.5)*50;
  starsBrightness[i] = Math.random(); // for flicker
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.15,
  transparent: true,
  opacity: 0.8,
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
stars.userData = { brightness: starsBrightness };
stars.visible = false;
scene.add(stars);

/* ----------------------
   Day/Night Functions
------------------------*/
function setDay() {
  sunLight.visible = true;
  sun.visible = true;
  moonLight.visible = false;
  moon.visible = false;
  ambient.intensity = 0.4;
  scene.background = new THREE.Color(0xbfdfff);
  stars.visible = false;
}

function setNight() {
  sunLight.visible = false;
  sun.visible = false;
  moonLight.visible = true;
  moon.visible = true;
  ambient.intensity = 0.1;
  scene.background = new THREE.Color(0x0b1020);
  stars.visible = true;
}

function toggleDayNight() {
  isDay = !isDay;
  isDay ? setDay() : setNight();
}

/* ----------------------
   Button
------------------------*/
const dayButton = document.createElement('button');
dayButton.innerText = "Toggle Day/Night";
dayButton.style.position = "absolute";
dayButton.style.top = "20px";
dayButton.style.right = "20px"; // moved to right
dayButton.style.padding = "6px 10px"; // smaller
dayButton.style.fontSize = "14px";
document.body.appendChild(dayButton);

dayButton.addEventListener('click', toggleDayNight);

/* ----------------------
   Animate Stars
------------------------*/
function animateStars() {
  if (!stars.visible) return;
  const positions = stars.geometry.attributes.position.array;
  const brightness = stars.userData.brightness;

  for (let i = 0; i < starsCount; i++) {
    // Slight up/down motion
    positions[i*3+1] += Math.sin(Date.now()*0.001 + i) * 0.0005;

    // Random flicker
    const flicker = 0.5 + Math.random() * 0.5;
    starsMaterial.color.setRGB(flicker * brightness[i], flicker * brightness[i], flicker * brightness[i]);
  }

  stars.geometry.attributes.position.needsUpdate = true;
  starsMaterial.needsUpdate = true;
}

/* ----------------------
   Animate Loop
------------------------*/
function animate() {
  requestAnimationFrame(animate);
  animateStars();
}

animate();

/* ----------------------
   Initial State
------------------------*/
setDay();

export { toggleDayNight };






















