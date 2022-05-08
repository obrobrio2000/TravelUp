const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1337 });

// var active_connection = null;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('something');
  });
  //active_connection = ws;
  ws.send('something');
  //test();
});

/*
function test(){
  active_connection.send('something else');
}
*/
