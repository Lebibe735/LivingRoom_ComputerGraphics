
import * as THREE from 'three'
import { camera } from '../core/camera.js'

export function enableTVInteraction({ screenMesh }) {

  const video = document.createElement('video')
  video.src = 'assets/video/tv_content.mp4'
  video.loop = true
  video.muted = true
  video.playsInline = true//video nuk shkon fullscreen në mobile
  video.preload = 'auto'//→ ngarkon video më herët për të shmangur vonesën
  video.crossOrigin = 'anonymous'//për të mundësuar përdorimin e video si texture
  video.load()

  //VideoTexture → bën video-n të përdoret si teksturë 3D mbi mesh

// colorSpace = sRGB → ngjyrat shfaqen si duhet

// flipY = false → video nuk kthehet vertikalisht
  const videoTexture = new THREE.VideoTexture(video)
  videoTexture.colorSpace = THREE.SRGBColorSpace
  videoTexture.flipY = false
//Kur esht i fikur i zi kur klikojme map teksturen
  const offMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    toneMapped: false
  })

  const onMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    toneMapped: false
  })
//fillimisht i fikur
  screenMesh.material = offMaterial


//   /raycaster → gjen objektin që klikohet

// mouse → koordinatat e mausit në -1…1

// isOn → gjendja aktuale e TV-së (fiks/në)
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let isOn = false

  window.addEventListener('click', (e) => {
//Transformon klikimin e mausit në koordinata -1…1

// Përdor raycaster për të parë nëse klikimi godet screenMesh

// Nëse nuk godet, funksioni ndalon
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const hit = raycaster.intersectObject(screenMesh)

    if (!hit.length) return

    isOn = !isOn

    if (isOn) {
      screenMesh.material = onMaterial
      video.play()
    } else {
      screenMesh.material = offMaterial
      video.pause()
    }
  })
}













