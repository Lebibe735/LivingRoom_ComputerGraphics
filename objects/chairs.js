
import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'

/* =========================================
   CHAIR COLLISION
   -----------------
   Kjo pjesë trajton **karriget** dhe kutitë e tyre të kollizionit
   (për të parandaluar që macja ose objekte të tjera të kalojnë
   përmes tyre në skenë).
========================================= */

// Array që mban të gjitha kutitë e kollizionit për karriget
export const chairBoxes = [] // support multiple chairs

/* =========================================
   LOAD CHAIRS
   -----------------
   Ngarkon modelin e karriges nga .glb
   dhe e përgatit për përdorim në skenë
========================================= */
export function loadChairs(callback) {

  gltfLoader.load('assets/models/chair.glb', (gltf) => {

    const baseChair = gltf.scene // kjo është karrigia e ngarkuar

    // Trajton të gjithë fëmijët e modelit (mesh-et)
    baseChair.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true    // mesh-i hidhet hije në tokë
        child.receiveShadow = true // mesh-i pranon hije nga objekte të tjera
      }
    })

    // Callback i përdoruesit – lejon të pozicionosh, klonosh, ose shtosh karrigen në skenë
    callback(baseChair)
  })
 
}

/* =========================================
   Helper: registerChairCollision
   -----------------
   Pasi të pozicionosh / klonosh çdo karrige, krijon një
   kuti të kollizionit (Box3) që përfaqëson hapësirën e saj
   dhe e ruan në array-n chairBoxes.
   Kjo përdoret më vonë për **kontrollin e kollizioneve** me macen ose objekte të tjera.
========================================= */
export function registerChairCollision(chair) {

  // Krijon Box3 rreth objektit të karriges
  const box = new THREE.Box3().setFromObject(chair)

  // Ruhet në array për përdorim më vonë gjatë simulimit
  chairBoxes.push(box)
}
