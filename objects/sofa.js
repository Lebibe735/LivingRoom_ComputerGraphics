
import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'
import { scene } from '../core/scene.js'

export let sofaBox = new THREE.Box3()
let sofa

export function loadSofa(callback) {

  gltfLoader.load('assets/models/sofa.glb', (gltf) => {

    sofa = gltf.scene
    sofa.scale.set(1, 1, 1)
    sofa.position.set(-2, 0, 1)

    sofa.traverse(m => {
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })

    scene.add(sofa)

    // 🔥 THIS IS THE IMPORTANT PART
    sofaBox.setFromObject(sofa)

    if (callback) callback(sofa)
  })

}
