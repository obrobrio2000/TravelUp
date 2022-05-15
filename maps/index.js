const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
require('dotenv').config();

client
  .distancematrix({
    params: {
      
      key: process.env.MAPS_API_KEY,
      destinations:[{ lat:51.4994794, lng:-0.1269979}],
      mode:"walking",
      origins:[{ lat:51.4822656, lng:-0.1933769 }],
     

    },
    timeout: 1000 // milliseconds
  })
  .then(r => {

    console.log(r.data.rows[0].elements[0]);
  })
  .catch(e => {
    console.log(e);
  });

  
