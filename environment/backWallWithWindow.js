import * as THREE from 'three'
import { scene } from '../core/scene.js'
//Loader për imazhe (jpg/png/webp)
const textureLoader = new THREE.TextureLoader()

/* =========================
   TEXTURES
========================= */
//ngjyra e murit (pamja)
const wallDiffuse = textureLoader.load(
  'assets/textures/walls/wall_diffuse.webp'
)
//normal map
const wallNormal = textureLoader.load(
  'assets/textures/walls/wall_normal.webp'
)

// optional tiling
wallDiffuse.wrapS = wallDiffuse.wrapT = THREE.RepeatWrapping//lejon përsëritjen e teksturës
wallNormal.wrapS = wallNormal.wrapT = THREE.RepeatWrapping
wallDiffuse.repeat.set(1, 1)//perseritet normal here 
wallNormal.repeat.set(1, 1) //

/* =========================
   MATERIALS
========================= */

const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallDiffuse,//ngjyra
  normalMap: wallNormal,//detajes
  side: THREE.DoubleSide,//ne te dyja anet te duket
})

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.25,
  transmission: 1,//efekt real i xhamit
  roughness: 0,//i lemuar
  thickness: 0.05,
  depthWrite: false,//shmang bug-e me transparencë
  side: THREE.DoubleSide,
})

/* =========================
   DIMENSIONS
========================= */
//MADHESIA E MURRIT
const WALL_W = 10
const WALL_H = 5
//MADHESIA E DRITARES
const WIN_W = 3
const WIN_H = 2
//pozicioni në skenë
const WALL_Y = 2.5
const WALL_Z = -5


//krijojmë formë 2D
//vizatojmë drejtkëndësh moveto line to
// (-5,2.5) -------- (5,2.5)
//      |              |
//      |      (0,0)   |
//      |              |
// (-5,-2.5) ------- (5,-2.5)

const shape = new THREE.Shape()
shape.moveTo(-WALL_W / 2, -WALL_H / 2)
shape.lineTo(WALL_W / 2, -WALL_H / 2)
shape.lineTo(WALL_W / 2, WALL_H / 2)
shape.lineTo(-WALL_W / 2, WALL_H / 2)
shape.closePath()

/* =========================
   WINDOW HOLE
========================= */
//Krijojme vrime dhe e presim virmen
//(-1.5,1) -------- (1.5,1)
//      |             |
//      |   (0,0)     |
//      |             |
// (-1.5,-1) ------- (1.5,-1)

const hole = new THREE.Path()
hole.moveTo(-WIN_W / 2, -WIN_H / 2)// // (-1.5, -1) poshtë majtas
hole.lineTo(WIN_W / 2, -WIN_H / 2) // (1.5, -1) poshtë djathtas
hole.lineTo(WIN_W / 2, WIN_H / 2)// (1.5, 1) sipër djathtas
hole.lineTo(-WIN_W / 2, WIN_H / 2)// (-1.5, 1) sipër majtas
hole.closePath()//lidhim perseri me piken fillestare

shape.holes.push(hole)//e presim vrimën nga muri

//e kthen formën 2D në mesh
const geometry = new THREE.ShapeGeometry(shape)

//I marrim pikat
const pos = geometry.attributes.position // marrim pikat e murit
const uv = new Float32Array(pos.count * 2) // // krijojmë array për UV

for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i)// // koordinata x e pikës
  const y = pos.getY(i) // koordinata y e pikës
// x + WALL_W/2 → zhvendos murin që të fillojë nga 0
//   / WALL_W → e normalizon në 0 → 1 
// //tekstura shtrihet saktë mbi mur, pa shtrembërim
  uv[i * 2]     = (x + WALL_W / 2) / WALL_W /// konvertoj x -> 0..1 
  uv[i * 2 + 1] = (y + WALL_H / 2) / WALL_H// konvertoj y-> 0..1
}

geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2)) // vendos UV te mesh

/* =========================
   WALL MESH
========================= */

const wall = new THREE.Mesh(geometry, wallMaterial)
wall.position.set(0, WALL_Y, WALL_Z)
scene.add(wall)

/* =========================
   GLASS
========================= */

const glass = new THREE.Mesh( 
  new THREE.PlaneGeometry(WIN_W, WIN_H), //drejtkëndësh për xhamin
  glassMaterial
)

glass.position.set(0, WALL_Y, WALL_Z + 0.02)//pak para murit qe te shmang z-fighting (dridhje grafike)
glass.renderOrder = 10 //pas murit
scene.add(glass)
