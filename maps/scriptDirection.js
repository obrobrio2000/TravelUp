

// [START maps_directions_waypoints]
function initMap() {
  console.log("ciao")
 const directionsService = new google.maps.DirectionsService();
 const directionsRenderer = new google.maps.DirectionsRenderer();
 const map = new google.maps.Map(document.getElementById("map"), {
   zoom: 12,
   center: { lat: 41.9109, lng: 12.4818 },
 });

 directionsRenderer.setMap(map);
 document.getElementById("submit").addEventListener("click", () => {
   calculateAndDisplayRoute(directionsService, directionsRenderer);
 });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
 const waypts = [];
 const checkboxArray = document.getElementById("waypoints");

 
 
     
    
    waypts.push({
        location: {lat : 41.8966 ,lng: 12.4748},
        stopover: true,
      });

      waypts.push({
        location: {lat : 41.903065 ,lng: 12.466276},
        stopover: true,
      })


      waypts.push({
        location: {lat : 41.903265 ,lng: 12.467276},
        stopover: true,
      })
     
      waypts.push({
        location: {lat : 41.903025 ,lng: 12.466276},
        stopover: true,
      })
 

 directionsService
   .route({
     origin: {lat : 41.8986 ,lng: 12.4768},
     destination: {lat : 41.8986 ,lng: 12.4768},
     waypoints: waypts,
     optimizeWaypoints: true,
     travelMode: google.maps.TravelMode.WALKING,
   })
   .then((response) => {
      
     directionsRenderer.setDirections(response);

     const route = response.routes[0];
     const summaryPanel = document.getElementById("directions-panel");

     summaryPanel.innerHTML = "";

     /*// For each route, display summary information.
     for (let i = 0; i < route.legs.length; i++) {
       const routeSegment = i + 1;

       summaryPanel.innerHTML +=
         "<b>Route Segment: " + routeSegment + "</b><br>";
       summaryPanel.innerHTML += route.legs[i].start_address + " to ";
       summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
       summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
     }
   })
   .catch((e) => window.alert("Directions request failed due to " + status));
}*/
   });
}
window.initMap = initMap;