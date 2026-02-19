import * as THREE from 'three';
import { scene } from './scene.js';//skenen e marrim sepse çdo dritë duhet shtuar në scene me scene.add()

// Krijon AmbientLight:dritë që ndriçon gjithçka njësoj ,pa hije,pa drejtim
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);//ngjyra e dritës (e bardhë) dhe intensiteti forca e drites 0.5
scene.add(ambientLight);

// Directional sunlight:si dielli,ka drejtim,krijon hije,ndriçon nga një ane
const sunLight = new THREE.DirectionalLight(0xffffff, 1);//më i fortë se ambient 1 spse dielli duhet te jet me i forte
sunLight.position.set(5, 10, 5);//Vendosim nga vjen drita
sunLight.castShadow = true;//Lejon krijimin e hijes
scene.add(sunLight);

export { ambientLight, sunLight };
