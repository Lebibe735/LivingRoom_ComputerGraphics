
import * as THREE from 'three';
import { scene } from '../core/scene.js';

const textureLoader = new THREE.TextureLoader();



// export this so cat.js can use it
export const roomBox = new THREE.Box3(
  new THREE.Vector3(-5, -1, -5), // min
  new THREE.Vector3(5, 5, 5)     // max
);

/* =========================
   FLOOR
========================= */

const floorDiffuse = textureLoader.load(
  'assets/textures/floors/wood_floor_diffuse.webp'
);
const floorNormal = textureLoader.load(
  'assets/textures/floors/wood_floor_normal.webp'
);
const floorRoughness = textureLoader.load(
  'assets/textures/floors/wood_floor_roughness.webp'
);
const floorAO = textureLoader.load(
  'assets/textures/floors/wood_floor_ao.webp'
);

[floorDiffuse, floorNormal, floorRoughness, floorAO].forEach(tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
});

const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorDiffuse,
  normalMap: floorNormal,
  roughnessMap: floorRoughness,
  aoMap: floorAO,
});

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);

/* =========================
   WALLS
========================= */

const wallDiffuse = textureLoader.load(
  'assets/textures/walls/wall_diffuse.webp'
);
const wallNormal = textureLoader.load(
  'assets/textures/walls/wall_normal.webp'
);

const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallDiffuse,
  normalMap: wallNormal,
});

/* LEFT */

const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  wallMaterial
);

leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-5, 2.5, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

/* RIGHT */

const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  wallMaterial
);

rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(5, 2.5, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);
