import * as THREE from 'three'
import { gltfLoader } from '../loaders/gltfLoader.js'
import { kitchenBox } from '../objects/kitchen.js'
import { sofaBox } from '../objects/sofa.js'
import { chairBoxes } from '../objects/chairs.js'

// ------------------- CAT VARIABLES -------------------
let cat, mixer, walkAction           // cat = modeli i mace, mixer = animacioni, walkAction = veprimi i ecjes
let isCatPaused = false              // kontrollon nëse macja është në pauzë

// ------------------- MOVEMENT SETTINGS -------------------
const minX = -4        // kufiri i majtë i dhomës
const maxX = 4         // kufiri i djathtë i dhomës
const minZ = -4        // kufiri i përpara i dhomës
const maxZ = 4         // kufiri i pasmë i dhomës
const speed = 1.2      // shpejtësia e ecjes së macës
const kitchenChance = 0.35 // probabiliteti që macja shkon te kuzhina
const arriveDistance = 0.3  // distanca për të ndaluar kur arrin target-in
const turnSpeed = 6         // shpejtësia e kthimit të macës

// ------------------- STATE -------------------
const target = new THREE.Vector3() // targeti ku macja po ecën
const velocity = new THREE.Vector3() // drejtimi dhe shpejtësia për lëvizje
const moveDir = new THREE.Vector3()  // drejtimi i përkohshëm i ecjes
let hasTarget = false               // nëse macja ka një target aktual

// ------------------- COLLISION -------------------
const catBox = new THREE.Box3() // kuti për kollizionin e macës
function getObstacles() {       // merr të gjitha objektet që mund të përplasen macja
  return [kitchenBox, sofaBox, ...chairBoxes]
}

// ------------------- FOOTSTEPS -------------------
const footsteps = []              // ruan gjurmët e këmbëve
let stepTimer = 0                 // timer për hapin e ardhshëm
let footSide = 1                  // vendos anën (e majtë/djathtas) për hapin
const stepMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.35                  // gjurmët fillojnë pak transparente
})

const forward = new THREE.Vector3(0, 0, 1)   // drejtimi bazë për krahasim me rotacionin
const quatTarget = new THREE.Quaternion()    // përdoret për rotacion të lëmuar

/* ==========================
   UI: STOP / RESUME BUTTON
========================== */
// Krijon një buton për të ndaluar ose rinisur macen
const catStopButton = document.createElement('button')
catStopButton.innerText = 'Stop Cat'
catStopButton.style.position = 'absolute'
catStopButton.style.top = '60px'
catStopButton.style.left = '20px'
catStopButton.style.zIndex = 10
catStopButton.style.padding = '8px 12px'
catStopButton.style.fontSize = '14px'
document.body.appendChild(catStopButton)

// Kur klikohet butoni, pauzon ose rinis animacionin
catStopButton.addEventListener('click', () => {
  isCatPaused = !isCatPaused
  catStopButton.innerText = isCatPaused ? 'Resume Cat' : 'Stop Cat'
  if (walkAction) walkAction.paused = isCatPaused
})

/* ==========================
   LOAD CAT MODEL
========================== */
// Funksioni për të ngarkuar modelin e macës
export function loadCat(callback) {
  gltfLoader.load('assets/models/cat.glb', (gltf) => {
    cat = gltf.scene                  // merr modelin e macës
    cat.scale.set(1.5, 1.5, 1.5)     // rrit modelin për dhomën

    // Aktivizon hije për çdo mesh të macës
    cat.traverse(m => {
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })

    // AnimationMixer kontrollon animacionet e macës
    mixer = new THREE.AnimationMixer(cat)

    // Nëse modeli ka animacione, luaj animacionin e ecjes
    if (gltf.animations.length) {
      walkAction = mixer.clipAction(gltf.animations[0])
      walkAction.play()
      walkAction.paused = isCatPaused // mund ta lë në pauzë nëse është stop
    }

    pickNewTarget() // zgjedh një target fillestar ku macja do të shkojë

    callback(cat)    // dërgon macen jashtë funksionit
  })
}

/* ==========================
   TARGET LOGIC
========================== */
// Gjeneron një pikë random brenda kufijve të dhomës
function randomPointInsideBounds() {
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(minX, maxX),
    0,
    THREE.MathUtils.randFloat(minZ, maxZ)
  )
}

// Pikë fikse për kuzhinën
function kitchenPoint() {
  return new THREE.Vector3(5, 0, -5)
}

// Zgjedh një target të ri për macen
function pickNewTarget() {
  if (Math.random() < kitchenChance) {
    target.copy(kitchenPoint())   // me probabilitet shkon te kuzhina
  } else {
    target.copy(randomPointInsideBounds()) // ose shkon në një pikë random
  }
  hasTarget = true
}

/* ==========================
   COLLISION CHECK
========================== */
function hitsObstacle() {
  catBox.setFromObject(cat)     // krijon kuti për kollizion bazuar në pozicionin aktual
  const obstacles = getObstacles()
  for (const box of obstacles) {
    if (box && catBox.intersectsBox(box)) return true // nëse ka përplasje
  }
  return false
}

// Siguron që macja të mos dalë jashtë dhomës
function clampInsideBounds(pos) {
    // "clamp" do të thotë të kufizosh një vlerë brenda një intervali
  // pos.x = pozicioni aktual në boshtin X
  // minX = kufiri i majtë, maxX = kufiri i djathtë
  pos.x = THREE.MathUtils.clamp(pos.x, minX, maxX)
  // pos.z = pozicioni aktual në boshtin Z (përpara/pas)
  // minZ = kufiri përpara, maxZ = kufiri pas
  pos.z = THREE.MathUtils.clamp(pos.z, minZ, maxZ)
}


/* ==========================
   UPDATE FUNCTION
========================== */
// Ky funksion duhet thirrur në loop-in e animacionit
export function updateCat(delta) {
  if (!cat || !mixer) return       // nëse macja nuk është ngarkuar ende
  if (isCatPaused) return           // nëse është pauzë
  if (!hasTarget) pickNewTarget()   // zgjedh target nëse nuk ka

  // Lëviz macen drejt target-it
  velocity.subVectors(target, cat.position) // krijon vector drejt target-it
  const dist = velocity.length()            // distanca deri te target-i
  if (dist < arriveDistance) {              // nëse arriti target
    pickNewTarget()
    return
  }
  velocity.normalize()                     // normalizon drejtimin
  const prev = cat.position.clone()        // ruan pozicionin e mëparshëm
  cat.position.addScaledVector(velocity, speed * delta) // ec drejt target-it

  // Siguron që nuk del jashtë dhomës
  clampInsideBounds(cat.position)

  // Kontrollon për përplasje me mobiljet
  if (hitsObstacle()) {
    cat.position.copy(prev)   // rikthen pozicionin e mëparshëm
    pickNewTarget()           // zgjedh target të ri
    return
  }

// Rotacion i lëmuar drejt drejtimit të ecjes
moveDir.copy(velocity)                       // Kopjon drejtimin e lëvizjes të macës në një vektor të ri
quatTarget.setFromUnitVectors(forward, moveDir) // Krijon një quaternion që tregon nga "forward" (drejtimi bazë i macës) drejt "moveDir"
cat.quaternion.slerp(quatTarget, delta * turnSpeed) // Rrotullon macen gradualisht drejt "target direction" me slerp (smooth rotation)


  // Rregullon shpejtësinë e animacionit
  if (walkAction) walkAction.timeScale = speed * 1.2//rrit shpejtësinë e animacionit të ecjes sipas shpejtësisë së lëvizjes së macës (speed).
  mixer.update(delta)   // përditëson animacionin



  
}

/* ==========================
   RESET FUNCTION
========================== */
export function resetCat() {
  if (!cat) return
  cat.position.set(0, 0, 0) // vendos macen në fillim të dhomës
  hasTarget = false         // nuk ka target për momentin
}
