// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// export const gltfLoader = new GLTFLoader();





import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

export const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
