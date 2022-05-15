const express = require('express');
const request = require('request');

const port = 1717;

const app = express();

var opentrip = "https://api.opentripmap.com/0.1";

function getCityInfo(city,distance){



}



app.listen(port, () => {
    console.log(`Server in ascolto sull'indirizzo http://localhost:${port}`);
});