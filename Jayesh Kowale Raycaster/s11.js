// Create a Three.js scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create a geometry for the square
const geometry = new THREE.Geometry();
geometry.vertices.push(
  new THREE.Vector3( -10, -1, 0 ),
  new THREE.Vector3( 1, -10, 0 ),
  new THREE.Vector3( 1, 1, 0 ),
  new THREE.Vector3( -1, 1, 0 ),
  new THREE.Vector3( -10, -1, 0 )
);

// Create a material for the square
const material = new THREE.LineBasicMaterial( { color: 0xffffff } );

// Create a mesh for the square
const mesh = new THREE.Line( geometry, material );
scene.add( mesh );

// Create a point to move to the intersection
const point = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 32, 32 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
scene.add( point );

// Create a raycaster for the mouse
const raycaster = new THREE.Raycaster();

// Set up the camera and position it
camera.position.z = 20;

// Attach the onDocumentMouseMove function to the document's mousemove event
document.addEventListener( 'mousemove', onDocumentMouseMove );

// Define the onDocumentMouseMove function
function onDocumentMouseMove( event ) {
  // Calculate the mouse position in normalized device coordinates
  const mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // Update the raycaster and perform the intersection test
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObject( mesh );

  // Move the point to the first intersection, if there is one
  if ( intersects.length > 0 ) {
    const intersection = intersects[0];
    point.position.copy( intersection.point );
  }
  
    // Check if the intersection point is inside the polygon
    if (isInsidePolygon(intersection, geometry.vertices)) {
        point.position.copy(intersection);
      }
}

// Render the scene
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();



// Check if a point is inside a polygon
function isInsidePolygon(point, polygonVertices) {
    let isInside = false;
    const n = polygonVertices.length;
  
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const vi = polygonVertices[i];
      const vj = polygonVertices[j];
  
      if (((vi.y > point.y) !== (vj.y > point.y)) && (point.x < (vj.x - vi.x) * (point.y - vi.y) / (vj.y - vi.y) + vi.x)) {
        isInside = !isInside;
      }
    }
  
    return isInside;
  }
  