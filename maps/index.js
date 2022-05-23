const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
require('dotenv').config();

client
  .distancematrix({ 
    params: {
      
      key: process.env.MAPS_API_KEY,
      destinations:[{ lat:51.4994794, lng:-0.1269979}, {lat:52.4994794, lng:-0.1269979}], //
      mode:"driving",
      origins:[{ lat:41.4822656, lng:-0.1233769 },{lat:52.4994794, lng:-0.1269979}],    //origini e destinazioni di prova
      departure_time :Date.now(),
      traffic_model:"best_guess"
    },
    timeout: 5000 // milliseconds 
  })
  .then(r => {
    console.log(Date.now())
    console.log(r.data);
  })
  .catch(e => {
    console.log(e);
  });
