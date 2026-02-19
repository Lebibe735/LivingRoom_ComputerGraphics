
import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'
import { scene } from '../core/scene.js'

// Bounding Box për divanin (përdoret për collision detection)
export let sofaBox = new THREE.Box3()

// Referencë globale për modelin e divanit
let sofa

// Funksion për ngarkimin e divanit
export function loadSofa(callback) {

  // Ngarkon modelin 3D nga file .glb
  gltfLoader.load('assets/models/sofa.glb', (gltf) => {

    // Merr skenën e modelit
    sofa = gltf.scene

    // Vendos shkallën (madhësinë)
    sofa.scale.set(1, 1, 1)

    // Vendos pozicionin në dhomë
    sofa.position.set(-2, 0, 1)

    // Kalon nëpër çdo mesh të modelit
    // dhe aktivizon hije për realizëm
    sofa.traverse(m => {
      if (m.isMesh) {
        m.castShadow = true      // objekti hedh hije
        m.receiveShadow = true   // objekti merr hije
      }
    })

    // Shton divanin në skenë
    scene.add(sofa)

    // Krijon bounding box sipas madhësisë reale të modelit
    // Përdoret për të mos lejuar objekte të kalojnë përmes divanit
    sofaBox.setFromObject(sofa)

    // Nëse ekziston callback (p.sh. për ta përdorur diku tjetër),
    // kthen modelin pasi të jetë ngarkuar
    if (callback) callback(sofa)
  })

}
