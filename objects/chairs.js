

import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'

/* =========================================
   CHAIR COLLISION
========================================= */

export const chairBoxes = [] // support multiple chairs

export function loadChairs(callback) {

  gltfLoader.load('assets/models/chair.glb', (gltf) => {

    const baseChair = gltf.scene

    baseChair.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    callback(baseChair)
  })
 
}

/* =========================================
   Helper: register collision AFTER you
   position/clone each chair
========================================= */

export function registerChairCollision(chair) {

  const box = new THREE.Box3().setFromObject(chair)
  chairBoxes.push(box)
}
