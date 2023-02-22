// Define the polygon vertices
const polygonVertices = [
    new THREE.Vector3(-10, -1, 0),
    new THREE.Vector3(1, -10, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(-10, -1, 0)
  ];
  
  // Create the Three.js scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // Create the polygon object
  const polygonGeometry = new THREE.Geometry();
  polygonGeometry.vertices = polygonVertices;
  const polygonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
  const polygon = new THREE.Mesh(polygonGeometry, polygonMaterial);
  scene.add(polygon);
  
  // Create the points object
  const pointGeometry = new THREE.Geometry();
  pointGeometry.vertices.push(new THREE.Vector3());
  const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0. });
  const point = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(point);
  
  // Update the point position on each mousemove event
  document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX / window.innerWidth * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    const direction = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;
    const cursorPosition = camera.position.clone().add(direction.multiplyScalar(distance));
    
    // Check if the cursor is inside the polygon
    const raycaster = new THREE.Raycaster(cursorPosition, direction);
    const intersects = raycaster.intersectObject(polygon);
    if (intersects.length > 0) {
      // If the cursor is inside the polygon, position the point on the cursor position
      point.position.copy(cursorPosition);
    } else {
      // If the cursor is outside the polygon, find the point inside the polygon closest to the cursor
      let closestDistance = Infinity;
      let closestPoint = new THREE.Vector3();
      for (let i = 0; i < polygonVertices.length; i++) {
        const vertex = polygonVertices[i];
        const distance = cursorPosition.distanceTo(vertex);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint.copy(vertex);
        }
      }
      point.position.copy(closestPoint);
    }
  });
  
  // Render the scene on each frame
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  