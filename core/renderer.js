import * as THREE from 'three';

//motori që vizaton 3D me WebGL
const renderer = new THREE.WebGLRenderer({ antialias: true });//antialias e bën figurën më të butë
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // shadows on
// Three.js krijon një <canvas>
// këtu po e shtojmë në faqen HTML që të shfaqet në ekran
//appendChild-shto element brenda body
document.body.appendChild(renderer.domElement);

export { renderer };
