const poly_vertices = [  { x: -10, y: -1 },  { x: 1, y: -10},  { x: 1, y: 1},  { x: -1, y: 1},  { x: -10, y: -1 }];

const scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointGeometry = new THREE.Geometry();
pointGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
const pointMaterial = new THREE.PointsMaterial({color: "white", size: 0.4});
const point = new THREE.Points(pointGeometry, pointMaterial);
scene.add(point);

const raycaster = new THREE.Raycaster();
const intersectPoint = new THREE.Vector3();

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', onDocumentMouseMove, false);

function updatePointPosition() {
  // calculate the closest point on the polygon to the mouse position
  const closestPoint = closestPointInPolygon(poly_vertices, mouse);

  // set the position of the point to the closest point
  point.position.set(closestPoint.x, closestPoint.y, 0);
}

function animate() {
  requestAnimationFrame(animate);

  updatePointPosition();

  // update the raycaster with the mouse position
  raycaster.setFromCamera(mouse, camera);

  // check for intersection between the raycaster and the polygon
  const intersection = raycaster.intersectObjects(scene.children, true)[0];
  if (intersection) {
    intersectPoint.copy(intersection.point);
  }

  renderer.render(scene, camera);
}

animate();

function closestPointInPolygon(vertices, point) {
  // Ray casting algorithm to determine if point is inside or outside the polygon
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  if (inside) {
    // Point is inside the polygon, return the point itself
    return point;
  } else {
    // Point is outside the polygon, find the closest point on each edge
    let closestPoint = null;
    let minDistance = Number.POSITIVE_INFINITY;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const edgeStart = vertices[j];
      const edgeEnd = vertices[i];
      const distance = distanceFromPointToLineSegment(point, edgeStart, edgeEnd);
      if (distance < minDistance) {
        closestPoint = closestPointOnLineSegment(point, edgeStart, edgeEnd);
        minDistance = distance;
      }
    }
    return closestPoint;
}}
