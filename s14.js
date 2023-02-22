// Define the vertices of the polygon
const polygonVertices = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(0, 2, 0)
  ];
  
  // Define the location to find the closest point to
  const location = new THREE.Vector3(1, 3, 0);
 
  




























  
  // Find the closest point on the polygon to the location
  const closestPoint = findClosestPointInPolygon(location, polygonVertices);
  
  // Log the closest point
  console.log(closestPoint);
  
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
      const edgeDirectionNormalized = edgeDirection.clone().divideScalar(edgeLength);
      const projectionLength = locationDirection.dot(edgeDirectionNormalized);
      const projection = edgeDirectionNormalized.clone().multiplyScalar(projectionLength).add(v1);
      const closestPointOnEdge = projectionLength <= 0 ? v1 : (projectionLength >= edgeLength ? v2 : projection);
  
      // If the closest point on the current edge is closer to the location than the current closest point, update the closest point
      if (closestPointOnEdge.distanceTo(location) < closestPoint.distanceTo(location)) {
        closestPoint = closestPointOnEdge;
      }
    }
  
    // Return the closest point
    return closestPoint;
  }
  