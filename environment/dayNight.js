
import * as THREE from 'three';
import { scene } from '../core/scene.js';

let isDay = true;
//sunLight = dritë drejtuesi (DirectionalLight) → si dielli
//sun = sfera e verdhë → duket vizualisht
//Pozicioni = ku ndriçon dielli
//castShadow = true → dielli bën hije
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
//Fillon e fshehur (visible=false) → shfaqet vetëm natën
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
//Dritë që ndriçon gjithçka njësoj
//Intensitet ndryshon ditën dhe natën
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

/* ----------------------
   Stars
------------------------*/
const starsCount = 200; //kemi 200 yje
const starsGeometry = new THREE.BufferGeometry();//për të ruajtur koordinatat e objekteve 3D qe mos krijohet mesh per secilin yll por krejt e perfdorin gjeometirin e njejt
const starsPositions = new Float32Array(starsCount * 3);//Çdo yll ka 3 koordinata: x, y, z → prandaj starsCount * 3.,float i ruan numrat me precizitet te lart
const starsBrightness = new Float32Array(starsCount);//Ruajmë intensitetin e secilit yll për ta bërë të shkëlqejë (flicker).

for (let i = 0; i < starsCount; i++) {
  starsPositions[i*3+0] = (Math.random()-0.5)*50;//x
  starsPositions[i*3+1] = Math.random()*20 + 10;//y
  starsPositions[i*3+2] = (Math.random()-0.5)*50;//z
  //X dhe Z = (Math.random()-0.5)*50 → rastësisht nga -25 deri +25 → shpërndarje horizontale.
// Y = Math.random()*20 + 10 → rastësisht nga 10 deri 30 → lartësi, për të mos qenë poshtë “tokës”.
// starsBrightness[i] = Math.random() → numër midis 0 dhe 1 → për flicker.
  starsBrightness[i] = Math.random(); // for flicker
}
// BufferAttribute = lidhet me BufferGeometry

// 3 = sepse secila pika ka x,y,z
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,// i bardhë
  size: 0.15,
  transparent: true,
  opacity: 0.8,
});
//THREE.Points = një grumbull pikash në 3D.Të gjithë yjet tani janë një objekt, jo 200 mesh individual.
const stars = new THREE.Points(starsGeometry, starsMaterial);
stars.userData = { brightness: starsBrightness };//Ruajmë vlerat e flicker për përdorim në animim.userData = mënyra Three.js për të ruajtur të dhëna shtesë tek objekti.
stars.visible = false;//naten sjan visible
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

dayButton.addEventListener('click', toggleDayNight);//Kur klikohet → thërret funksionin toggleDayNight()

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






















