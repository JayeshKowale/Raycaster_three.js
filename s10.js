const poly_vertices = [
    { x: -10, y: -1 },
    { x: 1, y: -10},
    { x: 1, y: 1},
    { x: -1, y: 1},
    { x: -10, y: -1 }
  ];

  const scene = new THREE.Scene();
  
  // Create a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20;
  camera.position.x = 0;
  camera.position.y = 0;
  
  // Create a renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const pointGeometry = new THREE.Geometry();
  pointGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
  const pointMaterial = new THREE.PointsMaterial({ color: "white", size: 0.4 });
  const point = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(point);
  
 
// Create a new shape
const shape = new THREE.Shape();

// Move to the first vertex
shape.moveTo(poly_vertices[0].x, poly_vertices[0].y);

// Create a path by connecting remaining vertices
for (let i = 1; i < poly_vertices.length; i++) {
  shape.lineTo(poly_vertices[i].x, poly_vertices[i].y);
}

// Create a new shape geometry from the shape
const geometry = new THREE.ShapeGeometry(shape);

// Create a new mesh from the geometry
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);


function closestPointInPolygon(vertices, mouse, camera) {
    const raycaster = new THREE.Raycaster();
    const point = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    raycaster.setFromCamera(point, camera);
  
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length === 0) {
      return null; // no intersection with polygon
    }
  
    // find closest point to mouse among all vertices
    let closestPoint = new THREE.Vector3().copy(vertices[0]);
    let closestDistance = closestPoint.distanceTo(mouse);
  
    for (let i = 1; i < vertices.length; i++) {
      const vertex = vertices[i];
      const distance = vertex.distanceTo(mouse);
      if (distance < closestDistance) {
        closestPoint = vertex.clone();
        closestDistance = distance;
      }
    }
  
    // find closest intersection point to mouse
    let closestIntersection = intersects[0].point.clone();
    closestDistance = closestIntersection.distanceTo(mouse);
  
    for (let i = 1; i < intersects.length; i++) {
      const intersection = intersects[i].point;
      const distance = intersection.distanceTo(mouse);
      if (distance < closestDistance) {
        closestIntersection = intersection.clone();
        closestDistance = distance;
      }
    }
  
    // check if intersection is inside polygon
    const isInside = isPointInsidePolygon(closestIntersection, vertices);
  
    // create a pointer object at the closest point
    const pointerGeometry = new THREE.CircleGeometry(0.05, 32);
    const pointerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
    pointer.position.copy(closestPoint);
  
    // return closest point inside polygon to mouse and pointer
    if (isInside) {
      return { closestPoint: closestIntersection, pointer: pointer };
    } else {
      return { closestPoint: closestPoint, pointer: pointer };
    }
  }
  

renderer.render(scene,camera);