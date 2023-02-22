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
  
  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  