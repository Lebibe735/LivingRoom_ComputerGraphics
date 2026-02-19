
import * as THREE from 'three';
// Importon Three.js për krijim dhe manipulim objektesh 3D

import { scene } from '../core/scene.js';
import { camera } from '../core/camera.js';
import { renderer } from '../core/renderer.js';
// Marrim referencat kryesore të sistemit 3D

import { loadSofa } from './sofa.js';
import { loadTV } from './tv.js';
import { loadFireplace } from '../loaders/loadFireplace.js';
// Funksione që ngarkojnë modele 3D

import { setupFireInteraction } from '../interaction/fireInteraction.js';
import { createFireParticles } from './fireParticles.js';

/* =========================
   GROUP
========================= */
const livingGroup = new THREE.Group();
/*
Group = container 3D.
Çdo objekt brenda tij trashëgon:
- position
- rotation
- scale
*/

livingGroup.position.set(-2, 0, -2);
/*
Zhvendos komplet dhomën:

X = -2  → majtas
Y = 0   → në tokë
Z = -2  → prapa
*/

scene.add(livingGroup);

/* =========================
   MIXERS
========================= */
const mixers = [];
// Array që ruan animation mixers (për animime GLTF)

/* =========================
   SOFA
========================= */
loadSofa((sofa) => {

  sofa.position.set(-2, 0.5, 4);
  /*
  Vendos divanin në hapësirë.
  Y = 0.5 → pak mbi tokë (që të mos futet në dysheme)
  */

  sofa.scale.set(2.8, 2.8, 2.8);
  /*
  Scale shumëzon dimensionet:
  dimension_final = dimension_original × 2.8
  */

  sofa.rotation.y = Math.PI / 2;
  /*
  Math.PI/2 = 90°
  Rrotullim rreth boshtit Y.
  */

  livingGroup.add(sofa);
});

/* =========================
   TV + VIDEO (BLACK ON/OFF)
========================= */
loadTV(({ tv }) => {

  tv.position.set(6.5, 1.5, 4);
  /*
  Pozicion në mur:
  X = 6.5 → djathtas
  Y = 1.5 → lartësia e murit
  Z = 4   → thellësia
  */

  tv.scale.set(2, 2, 2);
  // Zmadhohet 2 herë

  tv.rotation.y = Math.PI;
  // 180° rrotullim rreth Y

  livingGroup.add(tv);

  /* ---------- VIDEO ---------- */
  const video = document.createElement('video');
  video.src = 'assets/video/tv_content.mp4';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  /*
  HTML5 video element që përdoret si teksturë dinamike.
  */

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  /*
  sRGB përdoret për korrektësi të ngjyrave.
  */

  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  /*
  MeshBasicMaterial:
  - Nuk ndikohet nga drita
  - Shfaq direkt teksturën
  */

  const offMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });
  // Material i zi për gjendjen OFF

  /* ---------- SCREEN ---------- */
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 1.25),
    offMaterial
  );
  /*
  PlaneGeometry(width, height)

  2.15 → gjerësia
  1.25 → lartësia

  Raporti ≈ 16:9
  */

  screen.rotation.y = -Math.PI / 2;
  /*
  -90° rrotullim
  E kthen plane që të përputhet me murin.
  */

  screen.position.set(
    6.40,
    2.27,
    4.013
  );
  /*
  Pozicion preciz për ta vendosur para TV.
  Vlerat janë manuale për align perfekt.
  */

  livingGroup.add(screen);

  /* ---------- CLICK TO TOGGLE ---------- */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let tvOn = false;

  renderer.domElement.addEventListener('pointerdown', (e) => {

    const rect = renderer.domElement.getBoundingClientRect();
    /*
    Merr dimensionet reale të canvas-it në ekran.
    */

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    /*
    Konvertim në NDC (Normalized Device Coordinates):

    x_ndc = (x / width) * 2 - 1
    y_ndc = -(y / height) * 2 + 1

    Range përfundimtar: [-1, 1]
    */

    raycaster.setFromCamera(mouse, camera);
    /*
    Ray equation:
    P(t) = O + tD

    O = origin (camera)
    D = direction (nga mouse)
    */

    const hit = raycaster.intersectObject(screen);
    // Kontrollon nëse rrezja godet plane-n

    if (!hit.length) return;

    if (!tvOn) {
      screen.material = videoMaterial;
      video.currentTime = 0;
      video.play();
      tvOn = true;
    } else {
      video.pause();
      screen.material = offMaterial;
      tvOn = false;
    }
  });
});

/* =========================
   FIREPLACE
========================= */
loadFireplace(({ fireplace, mixer, action }) => {

  fireplace.position.set(6.5, 0.5, 4);
  fireplace.scale.set(0.015, 0.015, 0.015);
  /*
  Scale shumë i vogël sepse modeli ndoshta vjen shumë i madh.
  */

  fireplace.rotation.y = 1.5 * Math.PI;
  /*
  1.5π = 270°
  */

  if (mixer) mixers.push(mixer);
  // Ruaj animation mixer për update

  const fire = createFireParticles();
  fire.position.set(0, 0.25, 0);
  fire.scale.set(2, 2, 2);
  fireplace.add(fire);
  /*
  Sistemi i particles për flakën.
  */

  const fireLight = new THREE.PointLight(0xffaa33, 1, 3);
  fireLight.position.set(0, 0.25, 0);
  fireplace.add(fireLight);
  /*
  Dritë portokalli për efekt realist.
  */

  const clickHelper = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  /*
  Kuti e padukshme për raycasting.
  */

  clickHelper.position.set(0, 0.25, 0);
  fireplace.add(clickHelper);

  livingGroup.add(fireplace);

  setupFireInteraction(clickHelper, mixer, action, fire, camera);
  /*
  Lidh klikimin me:
  - animacionin
  - particles
  - kamerën
  */
});

export { livingGroup, mixers };
