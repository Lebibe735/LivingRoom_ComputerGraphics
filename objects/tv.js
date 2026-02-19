

import { gltfLoader } from '../loaders/gltfLoader.js';

// Funksion për të ngarkuar modelin e TV dhe për të gjetur ekranin e tij
export function loadTV(callback) {

  // ---------- NGARKO MODELIN GLB ----------
  gltfLoader.load('assets/models/tv.glb', (gltf) => {
    const tv = gltf.scene;   // merr skenën e modelit të TV
    let screenMesh = null;    // variabël për mesh-in e ekranit

    // ---------- TRAVERSE (kalojmë nëpër të gjithë fëmijët) ----------
    tv.traverse((child) => {
      if (!child.isMesh) return;  // ne na interesojnë vetëm mesh-et

      // Aktivizo hije për realizëm
      child.castShadow = true;      // mesh-i hedh hije
      child.receiveShadow = true;   // mesh-i merr hije

      // Kontrollo nëse emri i mesh-it përmban 'screen' ose 'display'
      const name = child.name.toLowerCase(); // kthen në të vogla për krahasim
      if (name.includes('screen') || name.includes('display')) {
        screenMesh = child; // ky është mesh-i i ekranit
      }
    });

    // ---------- FALLBACK ----------
    // Nëse nuk u gjet ekran me emrin e duhur, merr mesh-in e parë
    if (!screenMesh) {
      console.warn('TV screen mesh not found! Using first mesh as fallback.');
      tv.traverse((child) => {
        if (!screenMesh && child.isMesh) screenMesh = child;
      });
    }

    // Kthe objektin tv dhe mesh-in e ekranit
    callback({ tv, screenMesh });
  });
}
