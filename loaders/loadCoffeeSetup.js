
import * as THREE from 'three';
import { gltfLoader } from '../loaders/gltfLoader.js';
import { livingGroup } from '../objects/livingArea.js';

// ================= SIMPLE STEAM =================

// Variabël globale për avullin (krijojmë vetëm 1 plane)
let steam;

/*
  Funksioni createSteam()
  - Krijon një plane të bardhë transparent
  - E vendos mbi filxhan
  - Ky plane do të simulojë avullin
*/
function createSteam(cup) {

  // Plane pak më i madh që të duket më qartë
  const geometry = new THREE.PlaneGeometry(0.7, 0.7);

  // Material i thjeshtë, transparent
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,        // ngjyrë e bardhë (si avull)
    transparent: true,      // aktivizon transparencën
    opacity: 0.6,           // pak më i dukshëm në fillim
    side: THREE.DoubleSide  // shfaqet nga të dyja anët
  });

  // Krijojmë mesh-in e avullit
  steam = new THREE.Mesh(geometry, material);

  // Vendoset mbi filxhan (pozicion vertikal)
  steam.position.set(0, 3.2, 0);

  // Shtohet si fëmijë i filxhanit
  // kështu lëviz bashkë me të
  cup.add(steam);
}


/*
  Funksioni updateSteam(delta)
  - Thirret në animate loop
  - Bën që avulli të ngrihet lart
  - Gradualisht bëhet transparent
  - Kur zhduket, rikthehet në fillim
*/
export function updateSteam(delta) {

  // Nëse nuk është krijuar ende avulli, ndalo
  if (!steam) return;

  // Lëviz avullin lart (shpejtësi e kontrolluar me delta)
  steam.position.y += 0.7 * delta;

  // Ul gradualisht transparencën
  steam.material.opacity -= 0.4 * delta;

  // Kur avulli bëhet plotësisht transparent
  // rikthehet në pozicionin fillestar
  if (steam.material.opacity <= 0) {
    steam.position.y = 3.2;     // rikthehet poshtë
    steam.material.opacity = 0.6; // bëhet sërish i dukshëm
  }
}


// ================= COFFEE SETUP =================
export function loadCoffeeSetup(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();  // për klikime
  const mouse = new THREE.Vector2();        // koordinatat e mausit
  const clickableMeshes = [];               // ruan mesh-et që mund të klikohen

  // ---------- INFO PANEL ----------
  const infoPanel = document.createElement('div'); // paneli i informacionit për librin
  infoPanel.style.position = 'absolute';
  infoPanel.style.top = '20px';
  infoPanel.style.right = '20px';
  infoPanel.style.padding = '12px';
  infoPanel.style.backgroundColor = 'rgba(0,0,0,0.8)';
  infoPanel.style.color = '#fff';
  infoPanel.style.fontFamily = 'Arial';
  infoPanel.style.display = 'none';        // fillimisht fshehur
  infoPanel.style.maxWidth = '300px';
  infoPanel.style.borderRadius = '8px';
  infoPanel.style.zIndex = 100;            // mbi elemente të tjera
  document.body.appendChild(infoPanel);

  // ---------- COFFEE TABLE ----------
  gltfLoader.load('assets/models/coffeetable.glb', (gltf) => {
    const coffeeTable = gltf.scene;
    coffeeTable.scale.set(1.4, 1.4, 1.4); // madhësi e përgjithshme
    coffeeTable.position.set(-1.5, 0, 4);  // pozicion mbi dysheme
    coffeeTable.rotation.y = Math.PI / 2;  // rrotullim i vogël
    livingGroup.add(coffeeTable);          // shtohet në grupin e dhomës

    // ---------- LAPTOP ----------
    gltfLoader.load('assets/models/laptop.glb', (laptopGltf) => {
      const laptop = laptopGltf.scene;
      laptop.scale.set(0.9, 0.9, 0.9);
      laptop.position.set(-0.35, -0.3,0.30); // mbi tavolinë
      laptop.rotation.y = -Math.PI / 4;

      coffeeTable.add(laptop); // bashkëngjit laptop mbi tavolinë

      // shto të gjitha mesh-et e laptop në listën e klikueshme
      laptop.traverse((child) => {
        if (child.isMesh) clickableMeshes.push({ mesh: child, type: 'laptop' });
      });
      
    });
    
    // ---------- BOOK ----------
    gltfLoader.load('assets/models/book.glb', (bookGltf) => {
      const book = bookGltf.scene;
      book.scale.set(0.35, 0.35, 0.35);
      book.position.set(0.30, 0.43, 0.15); // pak mbi tavolinë
      book.rotation.y = Math.PI / 6;

      coffeeTable.add(book);

      // shto të gjitha mesh-et e librit në listën e klikueshme
      book.traverse((child) => {
        if (child.isMesh) clickableMeshes.push({ mesh: child, type: 'book' });
      });
    });

    // ---------- CUP ----------
    gltfLoader.load('assets/models/cup.glb', (cupGltf) => {
      const cup = cupGltf.scene;
      cup.scale.set(0.035, 0.035, 0.035); // shumë i vogël
      cup.position.set(0.2, 0.39, -0.1);  // mbi tavolinë
      coffeeTable.add(cup);
      cup.updateWorldMatrix(true, true);  // për të vendosur koordinatat globale
      createSteam(cup);                   // krijon avull mbi filxhan
    });
  });

  // ---------- CLICK HANDLER ----------
  function onClick(event) {
    // kthe koordinatat e mausit në -1…1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera); // krijo rreze nga kamera
    const intersects = raycaster.intersectObjects(
      clickableMeshes.map(obj => obj.mesh), // kontrollo të gjitha mesh-et
      true
    );

    if (intersects.length > 0) {
      const clickedObj = clickableMeshes.find(obj => obj.mesh === intersects[0].object);
      if (!clickedObj) return;

      // ---------- LAPTOP CLICK ----------
      if (clickedObj.type === 'laptop') {
        console.log('Laptop clicked!');
        window.open('https://www.google.com', '_blank'); // hap Google
      }

      // ---------- BOOK CLICK ----------
      if (clickedObj.type === 'book') {
        console.log('Book clicked!');
        // shfaq panelin me informacion
        infoPanel.innerHTML = `
          <h3>Computer Graphics</h3>
          <p>
            Computer graphics is the field of visual computing, 
            where one utilizes computers to create images and animations. 
            It combines art, math, and programming.
          </p>
          <button id="closeInfo" style="margin-top:8px;padding:4px 8px;">Close</button>
        `;
        infoPanel.style.display = 'block';

        // mbyll panelin kur klikojmë butonin Close
        document.getElementById('closeInfo').addEventListener('click', () => {
          infoPanel.style.display = 'none';
        });
      }
    }
  }

  window.addEventListener('click', onClick, false); // shto event listener për klik
}
