
var scene = new THREE.Scene();
const close = {x: 0, y: 0};
const point2D = new THREE.Vector2(3, 0);
const mouse = new THREE.Vector2(0,0);
//const mouse = { x: 0, y: 0 };
// Create a camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;
camera.position.x = 0;
camera.position.y =0;
scene.background= new THREE.Color(0x0031);
// Create a renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );




const pointGeometry = new THREE.Geometry();
pointGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
const pointMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.4});
const ppoint = new THREE.Points(pointGeometry, pointMaterial);
scene.add(ppoint);

const pointGeometry1 = new THREE.Geometry();
pointGeometry1.vertices.push(new THREE.Vector3(2, 0, 0));
const pointMaterial1 = new THREE.PointsMaterial({color:"red", size: 0.4});
const newpoint = new THREE.Points(pointGeometry1, pointMaterial1);
scene.add(newpoint);






// to update close point
function updatePointPosition(Points) {
    
    mouse.x = ( Points.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( Points.clientY / window.innerHeight ) * 2 + 1;
    

   

    // get the closest point on the polygon
    newpoint.position.copy(closestPointInPolygon(verticess1,mouse));
    requestAnimationFrame(updatePointPosition);
    window.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousemove', updatePointPosition);
  }


//// to get mouse position




function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

  const verticess1 = [
    { x: -10, y: -1 },
    { x: 1, y: -10 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -10, y: -1 }
  ];





// function to calculate closest point
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
        const edgeDirection = edgeEnd.clone().sub(edgeStart);
        const pointDirection = point.clone().sub(edgeStart);
        const edgeLength = edgeDirection.lengthSq();
        const t = Math.max(0, Math.min(1, edgeDirection.dot(pointDirection) / edgeLength));
        const projection = edgeStart.clone().add(edgeDirection.multiplyScalar(t));
        const distance = point.distanceToSquared(projection);
        if (distance < minDistance) {
          closestPoint = projection;
          minDistance = distance;
        }
      }
      return closestPoint;
    }
  }







// create a new geometry


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

///////////////////////////////////////////////
// 2 nd polygon

const geometry1 = new THREE.Geometry();

// add vertices for the square
geometry1.vertices.push(
  new THREE.Vector3( 0, 0, 0 ),
  new THREE.Vector3( 10, 0, 0 ),
  new THREE.Vector3( 10, 10, 0 ),
  new THREE.Vector3( 0, 10, 0 ),
  new THREE.Vector3( 0, 0, 0 ),
 // new THREE.Vector3( 15, 5, 0 )
);

// create a material for the lines
const material1 = new THREE.LineBasicMaterial( { color: 0xffffff } );

// create a new line object with the geometry and material
const lines1 = new THREE.Line( geometry1, material1 );

// set the position of the lines to (10, 2, 0)
lines1.position.set( 3, 0, 0 );

// add the lines to the scene
scene.add( lines1 );





// const points = [];
// for (let i = 0; i < 10; i++) {
//   const pointGeometry = new THREE.Geometry();
//   pointGeometry.vertices.push(new THREE.Vector3());
//   const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.5 });
//   const point = new THREE.Points(pointGeometry, pointMaterial);
//   points.push(point);
//   scene.add(point);
// }






const pointGeometry2 = new THREE.Geometry();
pointGeometry2.vertices.push(new THREE.Vector3(0, 0, 0));
const pointMaterial2 = new THREE.PointsMaterial({color: 0xff0000, size: 0.4});
const point2 = new THREE.Points(pointGeometry, pointMaterial);
scene.add(point2);



document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX / window.innerWidth * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    const direction = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;
    const position = camera.position.clone().add(direction.multiplyScalar(distance));
   
    point.position.copy(position);
  });
  
//   const verticess1 = [
//     { x: -10, y: -1 },
//     { x: 1, y: -10 },
//     { x: 1, y: 1 },
//     { x: -1, y: 1 },
//     { x: -10, y: -1 }
//   ];


//   const point = { x: 150, y: 50 };
//   const closestPoint = closestPointInPolygon(vertices, point);
//   console.log(closestPoint); // { x: 100, y: 50 }   this have to be reovoked



   /* 
    
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
      const closestPoint = intersects[0].point;
      point.position.copy(closestPoint);
    } else {
      // If the cursor is outside the polygon, find the point inside the polygon closest to the cursor
      const vertices = polygonGeometry.vertices;
      let closestDistance = Infinity;
      let closestPoint = new THREE.Vector3();
      for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const distance = cursorPosition.distanceTo(vertex);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint.copy(vertex);
        }
      }
      point.position.copy(closestPoint);
    }
  });
  
*/




   


  function render() {
    //closestPointInPolygon(verticess1,mouse);
    //document.addEventListener('mousemove', updateClosestPoint);
  
    requestAnimationFrame(render);
    window.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousemove', updatePointPosition);
 
    renderer.render(scene, camera);
    
  }
  render();
  
  


//renderer.render(scene,camera);
