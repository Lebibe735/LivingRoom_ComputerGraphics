
import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'
import { scene } from '../core/scene.js'

export const lamps = []

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// ================= INIT LAMP SYSTEM =================
export function initLampSystem(camera, renderer) {

  const lampConfigs = [
    { pos: new THREE.Vector3(-4.75, 2.8, -1.5) },
    { pos: new THREE.Vector3(-4.75, 2.8,  1.5) }
  ]

  lampConfigs.forEach(cfg => createLampUnit(cfg.pos))

  renderer.domElement.addEventListener('pointerdown', e => handleClick(e, camera))
}

// ================= CREATE LAMP UNIT =================
function createLampUnit(lampPos) {

  const lampUnit = {
    lampMesh: null,
    switchMesh: null,      // <-- this will be the GROUP now
    switchModel: null,     // <-- real GLB model inside group
    light: null,
    isOn: false
  }

  lamps.push(lampUnit)

  // ---------- LOAD LAMP ----------
  gltfLoader.load('assets/models/Lamp.gltf', gltf => {

    const lamp = gltf.scene
    lamp.position.copy(lampPos)

    const lampRotationY = Math.PI / 2
    lamp.rotation.y = lampRotationY

    lamp.scale.set(1.5, 1.5, 1.5)

    const light = new THREE.PointLight(0xfff1cc, 0, 8)
    light.position.set(0, 0.4, 0)
    lamp.add(light)

    lampUnit.lampMesh = lamp
    lampUnit.light = light

    scene.add(lamp)

    // ---------- LOAD SWITCH ----------
    gltfLoader.load('assets/models/switch.glb', gltf => {

      // ✅ 1) Create a pivot group (this stays fixed in place)
      const switchPivot = new THREE.Group()

      // IMPORTANT: put lampUnit on the pivot so raycast can find it
      switchPivot.userData.lampUnit = lampUnit

      // ✅ 2) This is the real model
      const swModel = gltf.scene
      swModel.scale.set(2.5, 2.5, 2.5)

      // ✅ 3) Fix model origin offset (THIS is why rotation was moving it)
      // Move model inside pivot so pivot is the "real position"
      // You will adjust these numbers depending on your switch model
      swModel.position.set(-5, 0, 5)

      // Add model into pivot group
      switchPivot.add(swModel)

swModel.userData.baseRotation = swModel.rotation.clone()
      // ✅ 4) Place pivot group in world space (REAL placement)
      // You can now change this and it will ALWAYS move correctly
      const localOffset = new THREE.Vector3(0, -1.0, -1.0)

      const worldOffset = localOffset.clone().applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        lampRotationY
      )

      switchPivot.position.copy(lampPos).add(worldOffset)

      // ✅ 5) Rotate pivot to face same direction as lamp (placement direction)
      switchPivot.rotation.set(0, lampRotationY, 0)

      // ✅ 6) Rotate ONLY the model (visual rotation) without moving placement
      // If it faces wrong direction:
      swModel.rotation.y += Math.PI

      // Save references
      lampUnit.switchMesh = switchPivot
      lampUnit.switchModel = swModel

      // Add to scene independently
      scene.add(switchPivot)
    })
  })
}

// ================= HANDLE SWITCH CLICK =================
function handleClick(event, camera) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const hits = raycaster.intersectObjects(
    lamps.map(l => l.switchMesh).filter(Boolean),
    true
  )

  if (!hits.length) return

  let obj = hits[0].object
  while (obj && !obj.userData.lampUnit) obj = obj.parent
  if (!obj) return

  const lampUnit = obj.userData.lampUnit
  lampUnit.isOn = !lampUnit.isOn

  
}

// ================= ANIMATE LAMPS =================
export function animateLamps(delta) {
  lamps.forEach(l => {
    if (!l.light) return
    const target = l.isOn ? 2.5 : 0
    l.light.intensity += (target - l.light.intensity) * delta * 8
  })
}