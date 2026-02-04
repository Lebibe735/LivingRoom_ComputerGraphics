
import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { camera } from '../core/camera.js';
import { renderer } from '../core/renderer.js';
import { loadSofa } from './sofa.js';
import { loadTV } from './tv.js';
import { loadFireplace } from '../loaders/loadFireplace.js';
import { setupFireInteraction } from '../interaction/fireInteraction.js';
import { createFireParticles } from './fireParticles.js';

/* =========================
   GROUP
========================= */
const livingGroup = new THREE.Group();
livingGroup.position.set(-2, 0, -2);
scene.add(livingGroup);

/* =========================
   MIXERS
========================= */
const mixers = [];

/* =========================
   SOFA
========================= */
loadSofa((sofa) => {
  sofa.position.set(-2, 0.5, 4);
  sofa.scale.set(2.8, 2.8, 2.8);
  sofa.rotation.y = Math.PI / 2;
  livingGroup.add(sofa);
});

/* =========================
   TV + VIDEO (BLACK ON/OFF)
========================= */
loadTV(({ tv }) => {
  // ❗ DO NOT TOUCH TV POSITION
  tv.position.set(6.5, 1.5, 4);
  tv.scale.set(2, 2, 2);
  tv.rotation.y = Math.PI;
  livingGroup.add(tv);

  /* ---------- VIDEO ---------- */
  const video = document.createElement('video');
  video.src = 'assets/video/tv_content.mp4';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;

  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
    toneMapped: false
  });

  // 🖤 BLACK OFF MATERIAL
  const offMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });

  /* ---------- SCREEN ---------- */
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.15, 1.25), // fits TV on wall
    offMaterial // START OFF
  );

  // Align to RIGHT WALL
  screen.rotation.y = -Math.PI / 2;
  screen.position.set(
    6.40,  // slightly in front of wall
    2.27,  // TV center height
    4.013  // aligns with TV depth
  );

  livingGroup.add(screen);

  /* ---------- CLICK TO TOGGLE ---------- */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let tvOn = false;

  renderer.domElement.addEventListener('pointerdown', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObject(screen);

    if (!hit.length) return;

    if (!tvOn) {
      // 🔥 TURN ON
      screen.material = videoMaterial;
      video.currentTime = 0;
      video.play();
      tvOn = true;
    } else {
      // 🖤 TURN OFF
      video.pause();
      screen.material = offMaterial;
      tvOn = false;
    }
  });
});

/* =========================
   FIREPLACE (UNCHANGED)
========================= */
loadFireplace(({ fireplace, mixer, action }) => {
  fireplace.position.set(6.5, 0.5, 4);
  fireplace.scale.set(0.015, 0.015, 0.015);
  fireplace.rotation.y = 1.5 * Math.PI;

  if (mixer) mixers.push(mixer);

  const fire = createFireParticles();
  fire.position.set(0, 0.25, 0);
  fire.scale.set(2, 2, 2);
  fireplace.add(fire);

  const fireLight = new THREE.PointLight(0xffaa33, 1, 3);
  fireLight.position.set(0, 0.25, 0);
  fireplace.add(fireLight);

  const clickHelper = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  clickHelper.position.set(0, 0.25, 0);
  fireplace.add(clickHelper);

  livingGroup.add(fireplace);
  setupFireInteraction(clickHelper, mixer, action, fire, camera);
});

export { livingGroup, mixers };
