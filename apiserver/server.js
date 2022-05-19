const express = require('express');
const request = require('request');
const { io } = require("socket.io-client");
const url = require('url').URL

const socket = io("http://ws:1337");

socket.on("connect",()=>{
    socket.emit('room', {room_name : 'api'});
})

socket.on("LuoghiApi", (socketid,citta)=>{

    var requestUrl = new URL("https://api.opentripmap.com/0.1/en/places/geoname?name="+citta+"&country=it&apikey="+process.env.OPENTRIP_KEY)

    console.log('richiesta ricevuta dalla apis')
    var options = {
        url: requestUrl,
    };
    var museums = [];
    distanza = 10000;
    kinds = "art_galleries%2Carchaeological_museums%2Cnational_museums%2Cother_museums";
    var _lat;
    var _lon;
    request(options,(err,res,body)=>{
        if(!err && res.statusCode == 200){
            info = JSON.parse(body);
            if(info.status != "NOT_FOUND"){
                _lat = info.lat;
                _lon = info.lon;
                var requestUrl = new URL("https://api.opentripmap.com/0.1/en/places/radius?radius="+distanza+"&lon="+_lon+"&lat="+_lat+"&src_geom=wikidata&src_attr=wikidata&kinds="+kinds+"&rate=2&format=json&limit=20&apikey="+process.env.OPENTRIP_KEY)
                options ={
                    url: requestUrl,
                };
                request(options, (err, res, body) => {
                    if (!err && res.statusCode == 200) {
                        info = JSON.parse(body);
                        var ids = ""
                        info.forEach(element => {
                            if(info.indexOf(element) != info.length-1){
                                ids = ids + element.wikidata + "%7C";
                            }else{
                                ids = ids + element.wikidata;
                            }
                        });
                        var requestUrl = new URL("https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids="+ids+"&sites=itwiki&redirects=no&props=info%7Clabels&languages=it&normalize=1")
                        options = {
                            url: requestUrl,
                        }
                        request(options,(err,res,body)=>{
                            if(!err && res.statusCode == 200){
                                info = JSON.parse(body);
                                var titles = "";
                                console.log(info);
                                element = info["entities"];
                                for(let key in element){
                                    if(typeof element[key]['labels'] !== 'undefined' && typeof element[key]['labels']['it'] !== 'undefined' ){
                                        console.log(element[key]['labels'])
                                        if(Object.keys(element).indexOf(key)<Object.keys(element).length-1){
                                            titles = titles + element[key]['labels']['it']['value'] + '%7C';
                                        }else{
                                            titles = titles + element[key]['labels']['it']['value'];
                                        }
                                    }else{
                                        continue;
                                    }
                                }
                                console.log(titles);
                                requestUrl = new URL("https://it.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles="+titles+"&utf8=1&formatversion=latest&exchars=500&exlimit=20&exintro=1&explaintext=1&exsectionformat=raw")
                                options = {
                                    url: requestUrl,
                                }
                                request(options,(err,res,body)=>{
                                    if(!err && res.statusCode == 200){
                                        info = JSON.parse(body);
                                        element = info["query"]["pages"];
                                        for(let key in element){
                                            if(element[key]["pageid"] != undefined){
                                                museums.push(new Musuem(element[key]['title'],element[key]['extract'],element[key]["pageid"]));
                                            }
                                        }
                                        socket.emit("luoghi_rispostaApi",socketid,museums);
                                    }else{
                                        console.log(err)
                                    }
                                })
                            }else{
                                console.log(err)
                            }
                        })
                    }else{
                        console.log(err);
                    }
            });
            }else{
                console.log(err)
            }
        }else{
            console.log(err);
        }
    });
});

socket.on("meteo");



    
function Musuem(title,desc,url){
    this.title = title;
    if(desc != ""){
        this.desc = desc;
    }else{
        this.desc = undefined;
    }
    this.url = 'https://it.wikipedia.org/?curid='+url;
}

/*
function richiestaCitta(citta){
    var options = {
        url: "https://api.opentripmap.com/0.1/en/places/geoname?name="+citta+"&country=it&apikey="+process.env.OPENTRIP_KEY,
    };
    request(options,(err,res,body)=>{
        if(!err && res.statusCode == 200){
            info = JSON.parse(body);
            console.log(info);
            if(info.status == "NOT_FOUND"){
                console.log('Errore citta non trovata');
                return null
            }else{
                return [info.lat,info.lon]
            }
        }
    });
    
}

async function richiestaMusei(lat,lon,citta){
    kinds = "art_galleries%2Carchaeological_museums%2Cnational_museums%2Cother_museums";
    console.log('ho aspetto');
        options ={
            url: "https://api.opentripmap.com/0.1/en/places/radius?radius="+distanza+"&lon="+posizione[1]+"&lat="+posizione[0]+"&src_geom=wikidata&src_attr=wikidata&kinds=museums&rate=2&format=json&limit=10&apikey="+process.env.OPENTRIP_KEY,
        };
    
}*/

const port = 1515;
const app = express();

app.listen(port, () => {
    console.log(`Server in ascolto sull'indirizzo http://localhost:${port}`);
});