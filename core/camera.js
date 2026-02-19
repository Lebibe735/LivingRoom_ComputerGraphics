import * as THREE from 'three';
//Kamere realiste si syri njeriut
const camera = new THREE.PerspectiveCamera(
  75,//FOV (Field of View) sa e gjere esht pamja 
  window.innerWidth / window.innerHeight,//kamera përshtatet me madhësinë e ekranit
  0.1,//Sa afër fillon të shohë kamera
  100//sa larg mund te shikon kamera
);
camera.position.set(0, 2, 5); // start looking at the room//pak lart dhe pak larg nga dhoma
//E bëjmë kamerën të përdorshme në file të tjera.
export { camera };
