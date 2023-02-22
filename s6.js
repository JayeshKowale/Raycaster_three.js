const poly_vertices = [  { x: -10, y: -1 },  { x: 1, y: -10},  { x: 1, y: 1},  { x: -1, y: 1},  { x: -10, y: -1 }];

const scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointGeometry = new THREE.Geometry();
pointGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
const pointMaterial = new THREE.PointsMaterial({ color: "white", size: 0.4 });
const point = new THREE.Points(pointGeometry, pointMaterial);
scene.add(point);

const raycaster = new THREE.Raycaster();
let intersected = false;

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener("mousemove", onDocumentMouseMove, false);

function updatePointPosition() {
  // cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate the intersections between the ray and the polygon
  const intersects = raycaster.intersectObject(point);

  if (intersects.length > 0) {
    // if the ray intersects the polygon, move the point to the intersection point
    const intersection = intersects[0].point;
    point.position.copy(intersection);
    intersected = true;
  } else {
    // if the ray doesn't intersect the polygon, move the point back to its original position
    point.position.set(1, 0, 0);
    intersected = false;
  }
}

function animate() {
  requestAnimationFrame(animate);

  updatePointPosition();

  renderer.render(scene, camera);
}

animate();
