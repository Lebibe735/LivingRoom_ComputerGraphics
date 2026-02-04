
import * as THREE from 'three'
import { camera } from '../core/camera.js'

export function enableTVInteraction({ screenMesh }) {

  const video = document.createElement('video')
  video.src = 'assets/video/tv_content.mp4'
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'
  video.load()

  const videoTexture = new THREE.VideoTexture(video)
  videoTexture.colorSpace = THREE.SRGBColorSpace
  videoTexture.flipY = false

  const offMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    toneMapped: false
  })

  const onMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    toneMapped: false
  })

  screenMesh.material = offMaterial

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let isOn = false

  window.addEventListener('click', (e) => {

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













