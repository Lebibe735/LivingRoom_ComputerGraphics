import * as THREE from 'three'
import { scene } from '../core/scene.js'

const textureLoader = new THREE.TextureLoader()

/* =========================
   TEXTURES
========================= */

const wallDiffuse = textureLoader.load(
  'assets/textures/walls/wall_diffuse.webp'
)
const wallNormal = textureLoader.load(
  'assets/textures/walls/wall_normal.webp'
)

// optional tiling
wallDiffuse.wrapS = wallDiffuse.wrapT = THREE.RepeatWrapping
wallNormal.wrapS = wallNormal.wrapT = THREE.RepeatWrapping
wallDiffuse.repeat.set(1, 1)
wallNormal.repeat.set(1, 1)

/* =========================
   MATERIALS
========================= */

const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallDiffuse,
  normalMap: wallNormal,
  side: THREE.DoubleSide,
})

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.25,
  transmission: 1,
  roughness: 0,
  thickness: 0.05,
  depthWrite: false,
  side: THREE.DoubleSide,
})

/* =========================
   DIMENSIONS
========================= */

const WALL_W = 10
const WALL_H = 5

const WIN_W = 3
const WIN_H = 2

const WALL_Y = 2.5
const WALL_Z = -5

/* =========================
   WALL SHAPE
========================= */

const shape = new THREE.Shape()
shape.moveTo(-WALL_W / 2, -WALL_H / 2)
shape.lineTo(WALL_W / 2, -WALL_H / 2)
shape.lineTo(WALL_W / 2, WALL_H / 2)
shape.lineTo(-WALL_W / 2, WALL_H / 2)
shape.closePath()

/* =========================
   WINDOW HOLE
========================= */

const hole = new THREE.Path()
hole.moveTo(-WIN_W / 2, -WIN_H / 2)
hole.lineTo(WIN_W / 2, -WIN_H / 2)
hole.lineTo(WIN_W / 2, WIN_H / 2)
hole.lineTo(-WIN_W / 2, WIN_H / 2)
hole.closePath()

shape.holes.push(hole)

/* =========================
   GEOMETRY + UV FIX
========================= */

const geometry = new THREE.ShapeGeometry(shape)

// MANUAL UVs
const pos = geometry.attributes.position
const uv = new Float32Array(pos.count * 2)

for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i)
  const y = pos.getY(i)

  uv[i * 2]     = (x + WALL_W / 2) / WALL_W
  uv[i * 2 + 1] = (y + WALL_H / 2) / WALL_H
}

geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

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
  new THREE.PlaneGeometry(WIN_W, WIN_H),
  glassMaterial
)

glass.position.set(0, WALL_Y, WALL_Z + 0.02)
glass.renderOrder = 10
scene.add(glass)
