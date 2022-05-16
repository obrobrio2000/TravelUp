const { response } = require('express');
const express = require('express');
const request = require('request');
const { io } = require("socket.io-client");

const port = 1717;

const app = express();

const socket = io();

socket.on("luoghi", (socketid,city,state,distance)=>{
    
    //variabili che definiscono la citta
    var _lon;
    var _lat;
    var citta = city;
    var _iso = state;
    var distanza = distance
    if(_iso){
        var options = {
            url: "https://api.opentripmap.com/0.1/en/places/geoname?name="+citta+"&country="+iso+"&apikey="+process.env.OPENTRIP_KEY,
        };
        request(options,(err,res,body)=>{
            if(!err && res.statusCode == 200){
                info = JSON.parse(body);
                _lat = info.lat;
                _lon = info.lon;
                options ={
                    url: "https://api.opentripmap.com/0.1/en/places/radius?radius="+distanza+"&lon="+_lon+"&lat="+_lat+"&src_geom=wikidata&src_attr=wikidata&rate=2&format=json&limit=1&apikey="+process.env.OPENTRIP_KEY,
                };
                request(options, (err, res, body) => {
                    if (!err && res.statusCode == 200) {
                        console.log(JSON.parse(body));
                    }else{
                        console.log(err);
                    }
                });
            }else{
                console.log(err);
            }
        });
    }else{
        var options = {
            url: "https://api.opentripmap.com/0.1/en/places/geoname?name="+citta+"&apikey="+process.env.OPENTRIP_KEY,
        };
        request(options,(err,res,body)=>{
            if(!err && res.statusCode == 200){
                info = JSON.parse(body);
                _lat = info.lat;
                _lon = info.lon;
                options ={
                    url: "https://api.opentripmap.com/0.1/en/places/radius?radius="+distance+"&lon="+_lon+"&lat="+_lat+"&src_geom=wikidata&src_attr=wikidata&rate=2&format=json&limit=1&apikey="+process.env.OPENTRIP_KEY,
                };
                request(options, (err, res, body) => {
                    if (!err && res.statusCode == 200) {
                        info = JSON.parse(body);
                        socket.emit('Risposta_luoghi',(socketid,info));
                    }else{
                        console.log(err);
                    }
                });
            }else{
                console.log(err);
            }
        });   
    }
});

socket.on("meteo");

app.listen(port, () => {
    console.log(`Server in ascolto sull'indirizzo http://localhost:${port}`);
});