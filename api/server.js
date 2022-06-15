const express = require('express');
const axios = require('axios');
const url = require('url').URL
const distanza = 10000;

if ((process.env.NODE_ENV || '').trim() !== 'test') {
    var { io } = require("socket.io-client");
    var socket = io("http://ws:1337");

    socket.on("connect", () => {
        socket.emit('room', { room_name: 'api' });
    })

    socket.on("Cultura", (data) => {
        console.log('richiesta ricevuta dal server per cultura')
        citta = data.citta;
        socketid = data.socketid;
        getCultura(citta, socketid);
    });

    socket.on("Food", (data) => {
        console.log('richiesta ricevuta dal server per food');
        citta = data.citta;
        socketid = data.socketid;
        getFood(citta, socketid);
    });

    socket.on("Intrattenimento", (data) => {
        console.log('richiesta ricevuta dal server per Intrattenimento');
        citta = data.citta;
        socketid = data.socketid;
        getIntrattenimento(citta, socketid);
    });

    socket.on("Utility", (data) => {
        console.log('richiesta ricevuta dal server per Utility');
        citta = data.citta;
        socketid = data.socketid;
        getUtilities(citta, socketid);
    });
}

// function Musuem(title,desc,url){
//     this.title = title;
//     if(desc != ""){
//         this.desc = desc;
//     }else{
//         this.desc = undefined;
//     }
//     this.url = 'https://it.wikipedia.org/?curid='+url;
// }

var getCultura = async function getCultura(citta, socketid) {
    var URLrichiesta = 'https://api.opentripmap.com/0.1/en/places/geoname?name=' + citta + '&country=it&apikey=' + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    const kinds = "cultural";
    const posizione = await axios.get(URLrichiesta)
        .then(function (response) {
            var info = response.data
            return { lat: info.lat, lon: info.lon }
        })
        .catch(function (err) {
            console.log(err)
        })
    URLrichiesta = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + distanza + "&lon=" + posizione.lon + "&lat=" + posizione.lat + "&src_geom=wikidata&src_attr=wikidata&kinds=" + kinds + "&rate=2&format=json&limit=20&apikey=" + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    var locations = []
    const names = await axios.get(URLrichiesta)
        .then(function (response) {
            var names = [];
            var info = response.data;
            info.forEach(element => {
                names.push(element.name)
                locations.push({ lat: element.point.lat, lon: element.point.lon })
            });
            return names;

        })
        .catch(function (err) {
            console.log(err)
        })
    const result = await getSearch(names, citta, locations);
    socket.emit("luoghi_rispostaApi", { socketid, value: result, target: 'Cultura' })
}

var getFood = async function getFood(citta, socketid) {
    var URLrichiesta = 'https://api.opentripmap.com/0.1/en/places/geoname?name=' + citta + '&country=it&apikey=' + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    const kinds = "bars,pubs,restaurants,fast_food";
    const posizione = await axios.get(URLrichiesta)
        .then(function (response) {
            var info = response.data
            return { lat: info.lat, lon: info.lon }
        })
        .catch(function (err) {
            console.log(err)
        })
    URLrichiesta = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + distanza + "&lon=" + posizione.lon + "&lat=" + posizione.lat + "&src_geom=osm&src_attr=osm&kinds=" + kinds + "&rate=2&format=json&limit=50&apikey=" + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    var locations = []
    const names = await axios.get(URLrichiesta)
        .then(function (response) {
            var names = [];
            var info = response.data;
            info.forEach(element => {
                names.push(element.name)
                locations.push({ lat: element.point.lat, lon: element.point.lon })
            });
            return names;

        })
        .catch(function (err) {
            console.log(err)
        })
    const result = await getSearch(names, citta, locations);
    socket.emit("luoghi_rispostaApi", { socketid, value: result, target: 'Food' })
}

var getUtilities = async function getUtilities(citta, socketid) {
    var URLrichiesta = 'https://api.opentripmap.com/0.1/en/places/geoname?name=' + citta + '&country=it&apikey=' + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    const kinds = "banks,atm,malls";
    const posizione = await axios.get(URLrichiesta)
        .then(function (response) {
            var info = response.data
            return { lat: info.lat, lon: info.lon }
        })
        .catch(function (err) {
            console.log(err)
        })
    URLrichiesta = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + distanza + "&lon=" + posizione.lon + "&lat=" + posizione.lat + "&src_geom=osm&src_attr=osm&kinds=" + kinds + "&rate=1&format=json&limit=50&apikey=" + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    var locations = []
    const names = await axios.get(URLrichiesta)
        .then(function (response) {
            var names = [];
            var info = response.data;
            info.forEach(element => {
                names.push(element.name)
                locations.push({ lat: element.point.lat, lon: element.point.lon })
            });
            return names;

        })
        .catch(function (err) {
            console.log(err)
        })
    const result = await getSearch(names, citta, locations);
    socket.emit("luoghi_rispostaApi", { socketid, value: result, target: 'Utility' })
}

var getIntrattenimento = async function getIntrattenimento(citta, socketid) {
    var URLrichiesta = 'https://api.opentripmap.com/0.1/en/places/geoname?name=' + citta + '&country=it&apikey=' + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    const kinds = "cinemas,amusement_parks,water_parks";
    const posizione = await axios.get(URLrichiesta)
        .then(function (response) {
            var info = response.data
            return { lat: info.lat, lon: info.lon }
        })
        .catch(function (err) {
            console.log(err)
        })
    URLrichiesta = "https://api.opentripmap.com/0.1/en/places/radius?radius=" + distanza + "&lon=" + posizione.lon + "&lat=" + posizione.lat + "&src_geom=osm&src_attr=osm&kinds=" + kinds + "&rate=1&format=json&limit=50&apikey=" + process.env.OPENTRIP_KEY
    URLrichiesta = decodeURI(URLrichiesta)
    URLrichiesta = encodeURI(URLrichiesta);
    var locations = []
    const names = await axios.get(URLrichiesta)
        .then(function (response) {
            var names = [];
            var info = response.data;
            info.forEach(element => {
                names.push(element.name)
                locations.push({ lat: element.point.lat, lon: element.point.lon })
            });
            return names;

        })
        .catch(function (err) {
            console.log(err)
        })
    const result = await getSearch(names, citta, locations);
    socket.emit("luoghi_rispostaApi", { socketid, value: result, target: 'Intrattenimento' })
}

var getSearch = function getSearch(names, citta, locations) {
    var result = []
    names.forEach((element, index) => {
        result.push({ title: element, url: "https://google.com/search?q=" + element + " " + citta, lat: locations[index].lat, lon: locations[index].lon })
    })
    return result
}



const port = 1515;
const app = express();

if ((process.env.NODE_ENV || '').trim() !== 'test') {
    app.listen(port, () => {
        console.log(`Server API in ascolto sull'indirizzo http://localhost:${port}`);
    });
}

module.exports = {
    app,
    getCultura,
    getFood,
    getUtilities,
    getIntrattenimento,
    getSearch
}