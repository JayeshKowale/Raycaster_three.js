// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the vertices of the polygon
const polygonVertices = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, -1, 0)
];

// Create a THREE.js mesh for the polygon
const polygonGeometry = new THREE.Geometry();
polygonGeometry.vertices = polygonVertices;
polygonGeometry.faces.push(new THREE.Face3(0, 1, 2));
polygonGeometry.faces.push(new THREE.Face3(0, 2, 3));
polygonGeometry.computeFaceNormals();
const polygonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const polygonMesh = new THREE.Mesh(polygonGeometry, polygonMaterial);
scene.add(polygonMesh);

// Add a listener for the mousemove event
document.addEventListener('mousemove', onDocumentMouseMove, false);

// Function to handle the mousemove event
function onDocumentMouseMove(event) {
  // Calculate the normalized device coordinates (NDC) of the mouse cursor
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Create a THREE.js raycaster from the camera and the NDC of the mouse cursor
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Calculate the intersection between the raycaster and the polygon
  const intersection = raycaster.intersectObject(polygonMesh);

  // If there is an intersection, find the closest point on the polygon to the intersection point
  if (intersection.length > 0) {
    const closestPoint = findClosestPointInPolygon(intersection[0].point, polygonVertices);

    // Move a marker to the closest point (for visualization)
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
    markerMesh.position.copy(closestPoint);
    scene.add(markerMesh);
  }
}

// Function to find the closest point on a polygon to a location
function findClosestPointInPolygon(location, polygonVertices) {
  // Initialize the closest point as the first vertex of the polygon
  let closestPoint = polygonVertices[0].clone();

  // Iterate through the edges of the polygon
  for (let i = 0; i < polygonVertices.length; i++) {
    const v1 = polygonVertices[i];
    const v2 = polygonVertices[(i + 1) % polygonVertices.length];

    // Calculate the closest point on the current edge to the location
    const edgeDirection = v2.clone().sub(v1);
    const locationDirection = location.clone().sub(v1);
    const edgeLength = edgeDirection.length();
    const projectionLength = locationDirection.dot(edgeDirection) / edgeLength;
    const projection = edgeDirection.clone().normalize().multiplyScalar(projectionLength);
    let closest;

    if (projectionLength < 0) {
              // If the closest point is outside the current edge, set it to the edge's starting vertex
      closest = v1.clone();
    } else if (projectionLength > edgeLength) {
      // If the closest point is outside the current edge, set it to the edge's ending vertex
      closest = v2.clone();
    } else {
      // If the closest point is on the current edge, set it to the projection of the location onto the edge
      closest = v1.clone().add(projection);
    }

    // Update the closest point if necessary
    if (location.distanceToSquared(closest) < location.distanceToSquared(closestPoint)) {
      closestPoint = closest;
    }
  }

  return closestPoint;
}

// Render the scene
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

