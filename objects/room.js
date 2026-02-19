

import * as THREE from 'three';
import { scene } from '../core/scene.js';

// Krijon loader për tekstura (imazhe për materialet)
const textureLoader = new THREE.TextureLoader();


// Bounding Box që përfaqëson kufijtë e dhomës
// Përdoret për collision detection (p.sh. që macja të mos dalë jashtë)
export const roomBox = new THREE.Box3(
  new THREE.Vector3(-5, -1, -5), // pika minimale (majtas, poshtë, mbrapa)
  new THREE.Vector3(5, 5, 5)     // pika maksimale (djathtas, lart, përpara)
);

/* =========================
   FLOOR (DYSHEMEJA)
========================= */

// Ngarkimi i teksturave të dyshemesë
// Diffuse = ngjyra bazë
// Normal = jep ndjesi thellësie
// Roughness = kontrollon shkëlqimin
// AO = hije natyrale në qoshe
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

// Bën që tekstura të përsëritet 3x3 dhe të mos shtrihet vetëm një herë
[floorDiffuse, floorNormal, floorRoughness, floorAO].forEach(tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
});

// Material realist që reagon ndaj dritës
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorDiffuse,
  normalMap: floorNormal,
  roughnessMap: floorRoughness,
  aoMap: floorAO,
});

// Krijon plane 10x10 për dyshemenë
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// Rrotullon planin që të bëhet horizontal (dysheme)
floor.rotation.x = -Math.PI / 2;

// Lejon që dyshemeja të marrë hije nga objektet
floor.receiveShadow = true;

// Shton dyshemenë në skenë
scene.add(floor);

/* =========================
   WALLS (MURET)
========================= */

// Ngarkimi i teksturave të murit
const wallDiffuse = textureLoader.load(
  'assets/textures/walls/wall_diffuse.webp'
);
const wallNormal = textureLoader.load(
  'assets/textures/walls/wall_normal.webp'
);

// Material që reagon ndaj dritës për realizëm
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallDiffuse,
  normalMap: wallNormal,
});

/* LEFT WALL (MURI I MAJTË) */

// Krijon mur 10 njësi i gjatë dhe 5 i lartë
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  wallMaterial
);

// Rrotullohet 90° që të bëhet mur anësor
leftWall.rotation.y = Math.PI / 2;

// Vendoset në anën e majtë të dhomës
// Y = 2.5 sepse muri është 5 i lartë (vendoset në mes)
leftWall.position.set(-5, 2.5, 0);

// Muri mund të marrë hije
leftWall.receiveShadow = true;

// Shtohet në skenë
scene.add(leftWall);

/* RIGHT WALL (MURI I DJATHTË) */

// Krijon murin e djathtë me të njëjtën madhësi
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 5),
  wallMaterial
);

// Rrotullohet në drejtimin e kundërt
rightWall.rotation.y = -Math.PI / 2;

// Vendoset në anën e djathtë të dhomës
rightWall.position.set(5, 2.5, 0);

// Mund të marrë hije
rightWall.receiveShadow = true;

// Shtohet në skenë
scene.add(rightWall);
