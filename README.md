# Interactive 3D Living Room – Three.js Project

**Live Demo:** [https://living-room-threejs-lm30735-3242-lebibes-projects-d09c3a3b.vercel.app/](https://living-room-threejs-lm30735-3242-lebibes-projects-d09c3a3b.vercel.app/)

## Project Overview

This project is an **interactive 3D living room** built using **Three.js**.  
It demonstrates key computer graphics concepts including **3D modeling, lighting, textures, animation, collision detection, raycasting, and real-time interaction** in the browser.

Users can explore the room freely, interact with objects, and trigger animations.

## Features

### Interactive Objects
- **TV** – click to turn on/off; plays video texture when on
- **Fireplace** – toggle fire animation
- **Light Switch** – turn room lights on/off
- **Cat** – walking animation with start/stop; leaves footprints on the floor
- **Cup** – animated steam effect
- **Laptop** – click to open Google
- **Book** – click to display information about Computer Graphics

### Draggable Objects
- **Chair**
- **Fruit**

### Logic & Behavior
- Collision detection prevents moving through furniture
- Raycasting handles clicks and interactions
- Object hierarchy keeps the scene organized

## Graphics Techniques
- 3D models in GLTF/GLB format
- Draco compression for reduced file size
- Textures for walls, floor, furniture
- Realistic materials
- Shadows and dynamic lighting
- Video textures and particle effects
- Animations for cat, fire, and steam
- Camera controls (orbit and zoom)

## Performance Optimization
- Draco compression for models
- Optimized textures
- Reduced polygon count for better performance
- Minified JavaScript and assets
- Hosted on **Vercel CDN** for fast delivery

## Tech Stack
- **Three.js**
- JavaScript (ES Modules)
- HTML5 / CSS
- GLTF + Draco compressed models
- Vercel (deployment)

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Lebibe735/LivingRoom_ComputerGraphics.git
cd LivingRoom_ComputerGraphics
Install dependencies:
npm install
Run the development server: npm start 
