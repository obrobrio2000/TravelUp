const WebSocket = require('ws');
var express = require('express');
var request2server = require('request');
var ws = new WebSocket("ws://localhost:1337/");


var api;
var app = express();
app.use(express.json());

ws.onopen = function()
{
   // Web Socket is connected, send data using send()
   app.post('/api', function(req, res){

    request2server({
        url: 'API_URL', //URL to hit
        
        method: 'GET',
        //headers: {
        //    'Content-Type': 'MyContentType',
        //    'Custom-Header': 'Custom Value'
        //},
        //body: 'Hello Hello!' //Set the body as a string
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            ws.send(body); //Sending api Body to ws Server
        }
    });
  ;
});
   
  
};

ws.onmessage = function (evt)
{
   var received_msg = evt.data;
   console.log(received_msg);
  
};

ws.onclose = function()
{
   // websocket is closed.
   
};



app.listen(8889);