
var scene = new THREE.Scene();

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
  const vertices = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  const point = { x: 150, y: 50 };
  const closestPoint = closestPointInPolygon(vertices, point);
  console.log(closestPoint); // { x: 100, y: 50 }



