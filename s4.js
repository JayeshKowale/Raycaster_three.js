const poly_vertices = [
    { x: -10, y: -1 },
    { x: 1, y: -10},
    { x: 1, y: 1},
    { x: -1, y: 1},
    { x: -10, y: -1 }
  ];


var scene = new THREE.Scene();

const mouse = new THREE.Vector2();
//const mouse = { x: 0, y: 0 };
// Create a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background= new THREE.Color(0x0031);
// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



  

const pointGeometry1 = new THREE.Geometry();
pointGeometry1.vertices.push(new THREE.Vector3(0, 0, 0));
const pointMaterial1 = new THREE.PointsMaterial({color:"red", size: 0.4});
const newpoint = new THREE.Points(pointGeometry1, pointMaterial1);
scene.add(newpoint);



const pointGeometry2 = new THREE.Geometry();
pointGeometry2.vertices.push(new THREE.Vector3(1, 0, 0));
const pointMaterial2 = new THREE.PointsMaterial({color:"white", size: 0.4});
const npoint = new THREE.Points(pointGeometry2, pointMaterial2);
scene.add(npoint);

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX / window.innerWidth * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    const direction = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;
    const position = camera.position.clone().add(direction.multiplyScalar(distance));
   
    newpoint.position.copy(position);
  });




function updatePointPosition(event) {
  // calculate the mouse position relative to the canvas element
  const canvasBounds = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  // get the closest point on the polygon
  const closestPoint = closestPointInPolygon(poly_vertices, mouse);
  console.log(closestPoint);
  // set the position of the point to the closest point
  npoint.position.set(closestPoint.x, closestPoint.y, 0);
}




 



        function isPointInsidePolygon(point, vertices) {
          const raycaster = new THREE.Raycaster(point, new THREE.Vector3(0, 0, 1));
          let intersections = 0;
          for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const v1 = vertices[i];
            const v2 = vertices[j];
            if ((v1.y > point.y) !== (v2.y > point.y) &&
              point.x < ((v2.x - v1.x) * (point.y - v1.y) / (v2.y - v1.y)) + v1.x) {
              intersections++;
            }
          }
          return intersections % 2 === 1;
        }
        


        function closestPointInPolygon(vertices, mouse) {
          const raycaster = new THREE.Raycaster();
          const point = new THREE.Vector3(mouse.x, mouse.y, 0.5);
         //  raycaster.setFromCamera(point, camera);
         raycaster.ray.origin.copy( camera.position );
         raycaster.ray.direction.set( mouse.x, mouse.y, 0.5 ).unproject( camera ).sub( camera.position ).normalize();

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
        
          // return closest point inside polygon to mouse
          if (isInside) {
            return closestIntersection;
          } else {
            return closestPoint;
          }
        }

     



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
lines.position.set( 0, 0, 0 );

// add the lines to the scene
scene.add( lines );

window.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousemove', updatePointPosition);


  function render() {
   
    console.log(mouse.x,mouse.y);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    
  }
  render();

  
  



