
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let dragging = null;
let offset = new THREE.Vector3();
let camera;
let domElement;

let table = null;
let tableTopY = 0;
let tableSurfaceBox = null;
let bowlBottomOffset = 0;

export function enableDrag(objects, cam, tableObj, dom) {
  camera = cam;
  table = tableObj;
  domElement = dom || window;

  // 🔹 TABLE bounding box (LOCAL SPACE)
  const tableBox = new THREE.Box3().setFromObject(table);

  // tabletop Y in TABLE LOCAL SPACE
  tableTopY = tableBox.max.y;

  // usable tabletop area (slightly inset)
  tableSurfaceBox = new THREE.Box3(
    new THREE.Vector3(
      tableBox.min.x + 0.15,
      tableTopY,
      tableBox.min.z + 0.15
    ),
    new THREE.Vector3(
      tableBox.max.x - 0.15,
      tableTopY,
      tableBox.max.z - 0.15
    )
  );

  domElement.addEventListener('mousedown', onMouseDown);
  domElement.addEventListener('mousemove', onMouseMove);
  domElement.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects, true);
  if (!hits.length) return;

  dragging = hits[0].object;
  while (dragging.parent && dragging.parent !== table) {
    dragging = dragging.parent;
  }

  // 🔹 compute bowl bottom offset (LOCAL)
  const bowlBox = new THREE.Box3().setFromObject(dragging);
  bowlBottomOffset = -bowlBox.min.y;

  // lock Y correctly
  dragging.position.y = tableTopY + bowlBottomOffset;

  // drag offset (LOCAL)
  const hitLocal = hits[0].point.clone();
  table.worldToLocal(hitLocal);
  offset.copy(hitLocal).sub(dragging.position);
}

function onMouseMove(event) {
  if (!dragging) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // tabletop plane in WORLD SPACE
  const tableWorldPos = new THREE.Vector3();
  table.getWorldPosition(tableWorldPos);

  const plane = new THREE.Plane(
    new THREE.Vector3(0, 1, 0),
    -(tableWorldPos.y + tableTopY)
  );

  const hitWorld = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(plane, hitWorld)) return;

  // WORLD → TABLE LOCAL
  table.worldToLocal(hitWorld);

  dragging.position.x = hitWorld.x - offset.x;
  dragging.position.z = hitWorld.z - offset.z;

  //  correct Y lock
  dragging.position.y = tableTopY + bowlBottomOffset;

  //  clamp inside tabletop
  const bowlBox = new THREE.Box3().setFromObject(dragging);
  const bowlSize = new THREE.Vector3();
  bowlBox.getSize(bowlSize);

  const halfX = bowlSize.x / 2;
  const halfZ = bowlSize.z / 2;

  dragging.position.x = THREE.MathUtils.clamp(
    dragging.position.x,
    tableSurfaceBox.min.x + halfX,
    tableSurfaceBox.max.x - halfX
  );

  dragging.position.z = THREE.MathUtils.clamp(
    dragging.position.z,
    tableSurfaceBox.min.z + halfZ,
    tableSurfaceBox.max.z - halfZ
  );
}

function onMouseUp() {
  dragging = null;
}

