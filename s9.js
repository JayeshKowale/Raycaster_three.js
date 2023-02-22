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
  
  // Add a point to the scene
  const pointGeometry = new THREE.Geometry();
  pointGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
  const pointMaterial = new THREE.PointsMaterial({ color: "white", size: 0.4 });
  const point = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(point);
  
  const geometry = new THREE.Geometry();

  // add vertices for the square
  geometry.vertices.push(
    new THREE.Vector3( -10, -1, 0 ),
    new THREE.Vector3( 1, -10, 0 ),
    new THREE.Vector3( 1, 1, 0 ),
    new THREE.Vector3( -1, 1, 0 ),
    new THREE.Vector3( -10, -1, 0 )
  );
  
  // create a material for the lines
  const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
  
  // create a new line object with the geometry and material
  const lines = new THREE.Line( geometry, material );
  
  // set the position of the lines to (10, 2, 0)
  lines.position.set( 0, 2, 0 );
  
  // add the lines to the scene
  scene.add( lines );

  // Raycaster object to cast rays
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Add event listener for mouse movement
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  
  function onDocumentMouseMove(event) {
    // Calculate the mouse position relative to the canvas element
    const canvasBounds = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
  
    // Cast a ray from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);
  
    // Find the intersection point between the ray and the polygon
    const intersection = raycaster.intersectObject(new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(poly_vertices.map(v => new THREE.Vector2(v.x, v.y)))), new THREE.MeshBasicMaterial({ color: 0xffffff })));
  
    // If there is an intersection, set the position of the point to the intersection point
    if (intersection.length > 0) {
      const pointOnPolygon = intersection[0].point;
      point.position.set(pointOnPolygon.x, pointOnPolygon.y, 0);
    }
  }


  // function closestPointInPolygon(polygon, mouse, camera) {
  //   // Create a raycaster object
  //   const raycaster = new THREE.Raycaster();
  
  //   // Set the raycaster's position to the mouse coordinates
  //   raycaster.setFromCamera(mouse, camera);
  
  //   // Find the intersection point between the ray and the polygon
  //   const intersects = raycaster.intersectObject(polygon);
  
  //   // If there are no intersections, return null
  //   if (intersects.length === 0) {
  //     return null;
  //   }
  
  //   // Otherwise, return the closest intersection point
  //   return intersects[0].point;
  // }
  
  
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
  
  
  
  
  // Render the scene
  function animate() {
    const pointOn=closestPointInPolygon(poly_vertices, mouse, camera);
    
      point.position.set(pointOn.x, pointOn.y, 0);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  