
import * as THREE from 'three';
import { gltfLoader } from '../loaders/gltfLoader.js';
import { livingGroup } from '../objects/livingArea.js';


// ================= STEAM =================
// ================= STEAM =================
const steamParticles = [];

function createSteam(cup) {

  const geometry = new THREE.PlaneGeometry(0.50, 0.50);

  for (let i = 0; i < 6; i++) {

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false, // 👈 VERY IMPORTANT
    });

    const steam = new THREE.Mesh(geometry, material);

    resetSteam(steam);
    cup.add(steam);

    steamParticles.push(steam);
  }
}

function resetSteam(steam) {
  steam.position.set(
    (Math.random() - 0.5) * 0.08,
    3, // ⬆️ ABOVE CUP (works with tiny scale)
    (Math.random() - 0.5) * 0.08
  );

  steam.rotation.set(
    Math.random() * 0.3,
    Math.random() * Math.PI,
    Math.random() * 0.3
  );

  steam.scale.setScalar(0.8 + Math.random() * 0.4);
  steam.material.opacity = 0.4;

  steam.userData = {
    speed: 0.15 + Math.random() * 0.15,
  };
}

export function updateSteam(delta) {
  steamParticles.forEach((steam) => {
    steam.position.y += steam.userData.speed * delta;
    steam.material.opacity -= delta * 0.2;

    if (steam.material.opacity <= 0) {
      resetSteam(steam);
    }
  });
}

export function loadCoffeeSetup(scene, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const clickableMeshes = [];

  
  // ---------- INFO PANEL ----------
  const infoPanel = document.createElement('div');
  infoPanel.style.position = 'absolute';
  infoPanel.style.top = '20px';
  infoPanel.style.right = '20px';
  infoPanel.style.padding = '12px';
  infoPanel.style.backgroundColor = 'rgba(0,0,0,0.8)';
  infoPanel.style.color = '#fff';
  infoPanel.style.fontFamily = 'Arial';
  infoPanel.style.display = 'none';
  infoPanel.style.maxWidth = '300px';
  infoPanel.style.borderRadius = '8px';
  infoPanel.style.zIndex = 100;
  document.body.appendChild(infoPanel);

  // ---------- COFFEE TABLE ----------
  gltfLoader.load('assets/models/coffeetable.glb', (gltf) => {
    const coffeeTable = gltf.scene;
    coffeeTable.scale.set(1.4, 1.4, 1.4);
    coffeeTable.position.set(-1.5, 0, 4); // Y = floor
    coffeeTable.rotation.y = Math.PI / 2;
    livingGroup.add(coffeeTable);
    
    // ---------- LAPTOP ----------
    gltfLoader.load('assets/models/laptop.glb', (laptopGltf) => {
      const laptop = laptopGltf.scene;
      laptop.scale.set(0.9, 0.9, 0.9);
       laptop.position.set(-0.35, -0.3,0.30); // adjust Y = table top height
      laptop.rotation.y = -Math.PI / 4;

      coffeeTable.add(laptop);

      // Add all meshes of laptop to clickable list
      laptop.traverse((child) => {
        if (child.isMesh) clickableMeshes.push({ mesh: child, type: 'laptop' });
      });
      
    });
    

    // ---------- BOOK ----------
    gltfLoader.load('assets/models/book.glb', (bookGltf) => {
      const book = bookGltf.scene;
      book.scale.set(0.35, 0.35, 0.35);
      book.position.set(0.30, 0.43, 0.15); // slightly above table
      book.rotation.y = Math.PI / 6;

      coffeeTable.add(book);

      // Add all meshes of book to clickable list
      book.traverse((child) => {
        if (child.isMesh) clickableMeshes.push({ mesh: child, type: 'book' });
      });
    });

    // ---------- CUP ----------
    gltfLoader.load('assets/models/cup.glb', (cupGltf) => {
      const cup = cupGltf.scene;
      cup.scale.set(0.035, 0.035, 0.035);
      cup.position.set(0.2, 0.39, -0.1);
      coffeeTable.add(cup);
      cup.updateWorldMatrix(true, true);
      createSteam(cup);
      
    });
  });

  // ---------- CLICK HANDLER ----------
  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      clickableMeshes.map(obj => obj.mesh),
      true
    );

    if (intersects.length > 0) {
      const clickedObj = clickableMeshes.find(obj => obj.mesh === intersects[0].object);
      if (!clickedObj) return;

      if (clickedObj.type === 'laptop') {
        console.log('Laptop clicked!');
        window.open('https://www.google.com', '_blank');
      }

      if (clickedObj.type === 'book') {
        console.log('Book clicked!');
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

        document.getElementById('closeInfo').addEventListener('click', () => {
          infoPanel.style.display = 'none';
        });
      }
    }
  }

  window.addEventListener('click', onClick, false);
}
