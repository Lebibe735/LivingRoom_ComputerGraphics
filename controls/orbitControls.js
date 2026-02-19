import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//rrotullim me maus,zoom in/out,lëvizje majtas/djathtas (pan)
import { camera } from '../core/camera.js';//marrim kameren qe ta kontrollojme
import { renderer } from '../core/renderer.js';//ku useri ben click
//krijojme controlls per cameren dhe na duhet kamera dmth cfare leviz dhe dom element cfare klikojme
export const controls = new OrbitControls(camera, renderer.domElement);
//Aktivizon lëvizje smooth. pa dapming sbehet ngadale sbehet smooth levizja
controls.enableDamping = true;
controls.dampingFactor = 0.05;//sa i bute efekti

controls.enablePan = true;//Lejon lëvizjen horizontale/vertikale.
controls.minDistance = 2;
controls.maxDistance = 15;

controls.target.set(0, 1, 0);//Pika që kamera shikon.Pak mbi dysheme
controls.update();// i perditeson controlls qe pastaj e therrasim tek animate ne main
