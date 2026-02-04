import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'
import { kitchenBox } from '../objects/kitchen.js'
import { sofaBox } from '../objects/sofa.js'
import { chairBoxes } from '../objects/chairs.js'


let cat, mixer, walkAction
let isCatPaused = false

// ------------------- SETTINGS -------------------
const minX = -4
const maxX = 4
const minZ = -4
const maxZ = 4
const speed = 1.2
const kitchenChance = 0.35
const arriveDistance = 0.3
const turnSpeed = 6

// ------------------- STATE -------------------
const target = new THREE.Vector3()
const velocity = new THREE.Vector3()
const moveDir = new THREE.Vector3()

let hasTarget = false

// ------------------- COLLISION -------------------
const catBox = new THREE.Box3()
function getObstacles() {
  return [kitchenBox, sofaBox, ...chairBoxes]
}

// ------------------- FOOTSTEPS -------------------
const footsteps = []
let stepTimer = 0
let footSide = 1
const stepMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.35
})

const forward = new THREE.Vector3(0, 0, 1)
const quatTarget = new THREE.Quaternion()

/* ==========================
   UI: STOP / RESUME BUTTON
========================== */
const catStopButton = document.createElement('button')
catStopButton.innerText = 'Stop Cat'
catStopButton.style.position = 'absolute'
catStopButton.style.top = '60px'
catStopButton.style.left = '20px'
catStopButton.style.zIndex = 10
catStopButton.style.padding = '8px 12px'
catStopButton.style.fontSize = '14px'
document.body.appendChild(catStopButton)

catStopButton.addEventListener('click', () => {
  isCatPaused = !isCatPaused
  catStopButton.innerText = isCatPaused ? 'Resume Cat' : 'Stop Cat'
  if (walkAction) walkAction.paused = isCatPaused
})

/* ==========================
   LOAD CAT MODEL
========================== */
export function loadCat(callback) {

  gltfLoader.load('assets/models/cat.glb', (gltf) => {

    cat = gltf.scene
    cat.scale.set(1.5, 1.5, 1.5)

    cat.traverse(m => {
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })

    mixer = new THREE.AnimationMixer(cat)

    if (gltf.animations.length) {
      walkAction = mixer.clipAction(gltf.animations[0])
      walkAction.play()
      walkAction.paused = isCatPaused
    }

    pickNewTarget()

    callback(cat)
  })
}

/* ==========================
   TARGET LOGIC
========================== */
function randomPointInsideBounds() {
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(minX, maxX),
    0,
    THREE.MathUtils.randFloat(minZ, maxZ)
  )
}

function kitchenPoint() {
  return new THREE.Vector3(5, 0, -5)
}

function pickNewTarget() {
  if (Math.random() < kitchenChance) {
    target.copy(kitchenPoint())
  } else {
    target.copy(randomPointInsideBounds())
  }
  hasTarget = true
}

/* ==========================
   COLLISION CHECK
========================== */
function hitsObstacle() {
  catBox.setFromObject(cat)
  const obstacles = getObstacles()
  for (const box of obstacles) {
    if (box && catBox.intersectsBox(box)) return true
  }
  return false
}

function clampInsideBounds(pos) {
  pos.x = THREE.MathUtils.clamp(pos.x, minX, maxX)
  pos.z = THREE.MathUtils.clamp(pos.z, minZ, maxZ)
}

/* ==========================
   FOOTSTEP SPAWN
========================== */
function spawnFootstep(pos, dir) {
  const sideDir = new THREE.Vector3(-dir.z, 0, dir.x).normalize()

  const step = new THREE.Mesh(
    new THREE.CircleGeometry(0.035, 8),
    stepMaterial.clone()
  )

  step.rotation.x = -Math.PI / 2
  step.position.copy(pos)
  step.position.addScaledVector(sideDir, 0.07 * footSide)
  step.position.y = 0.01

  footSide *= -1
  step.userData.life = 2.5

  if (cat.parent) cat.parent.add(step)
  footsteps.push(step)
}

/* ==========================
   UPDATE FUNCTION
========================== */
export function updateCat(delta) {
  if (!cat || !mixer) return
  if (isCatPaused) return
  if (!hasTarget) pickNewTarget()

  // Move toward target
  velocity.subVectors(target, cat.position)
  const dist = velocity.length()
  if (dist < arriveDistance) {
    pickNewTarget()
    return
  }
  velocity.normalize()
  const prev = cat.position.clone()
  cat.position.addScaledVector(velocity, speed * delta)

  // Clamp inside room bounds
  clampInsideBounds(cat.position)

  // Check furniture collisions
  if (hitsObstacle()) {
    cat.position.copy(prev)
    pickNewTarget()
    return
  }

  // Rotate smoothly toward movement direction
  moveDir.copy(velocity)
  quatTarget.setFromUnitVectors(forward, moveDir)
  cat.quaternion.slerp(quatTarget, delta * turnSpeed)

  // Animation speed
  if (walkAction) walkAction.timeScale = speed * 1.2
  mixer.update(delta)

  // Footsteps
  stepTimer += delta * speed
  if (stepTimer > 0.35) {
    spawnFootstep(cat.position, moveDir)
    stepTimer = 0
  }

  // Fade footsteps
  for (let i = footsteps.length - 1; i >= 0; i--) {
    const step = footsteps[i]
    step.userData.life -= delta
    step.material.opacity = step.userData.life / 2.5
    if (step.userData.life <= 0) {
      step.parent.remove(step)
      footsteps.splice(i, 1)
    }
  }
}

/* ==========================
   RESET
========================== */
export function resetCat() {
  if (!cat) return
  cat.position.set(0, 0, 0)
  hasTarget = false
}
