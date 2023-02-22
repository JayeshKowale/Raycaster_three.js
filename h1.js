// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the polygons and their points
const polygon1 = new THREE.Shape([
  new THREE.Vector2(-1, -1),
  new THREE.Vector2(-1, 1),
  new THREE.Vector2(1, 1),
  new THREE.Vector2(1, -1),
]);
const polygon2 = new THREE.Shape([
  new THREE.Vector2(-2, -2),
  new THREE.Vector2(-2, 0),
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0, -2),
]);
const point1 = new THREE.Vector2(0, 0);
const point2 = new THREE.Vector2(-1, -1);

// Define the materials for the polygons and points
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const pointMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
const pointMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Create meshes for the polygons and points
const geometry1 = new THREE.ShapeGeometry(polygon1);
const mesh1 = new THREE.Mesh(geometry1, material1);
scene.add(mesh1);
const geometry2 = new THREE.ShapeGeometry(polygon2);
const mesh2 = new THREE.Mesh(geometry2, material2);
scene.add(mesh2);
const pointGeometry1 = new THREE.CircleGeometry(0.1, 32);
const pointMesh1 = new THREE.Mesh(pointGeometry1, pointMaterial1);
scene.add(pointMesh1);
const pointGeometry2 = new THREE.CircleGeometry(0.1, 32);
const pointMesh2 = new THREE.Mesh(pointGeometry2, pointMaterial2);
scene.add(pointMesh2);

// Define the mousemove event listener
document.addEventListener('mousemove', onDocumentMouseMove, false);

// Update the point positions in response to mouse movement
function onDocumentMouseMove(event) {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  
  // Clamp the mouse position to the polygons' boundaries
  const polygon1Bounds = polygon1.getBoundingBox();
  const polygon2Bounds = polygon2.getBoundingBox();
  const clampedMouse = mouse.clone().clamp(polygon1Bounds.min, polygon1Bounds.max);
  clampedMouse.clamp(polygon2Bounds.min, polygon2Bounds.max);
  
  // Update the point positions
  point1.set(clampedMouse.x, clampedMouse.y);
  point2.set(clampedMouse.x - 1, clampedMouse.y - 1);
  
  // Update the point mesh positions
  pointMesh1.position.set(point1.x, point1.y, 0);
  pointMesh2.position.set(point2.x, point2.y, 0);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
