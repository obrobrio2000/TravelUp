var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) {
});
server.listen(1337, function() { });
wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Il messaggio ricevuto è: ' + message.utf8Data);
        }
    });
    connection.on('close', function(connection) {
    });
});
