const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors:{origin : "*"} });

//

server.listen(3001, () =>{
  console.log("Server running ...")
});

io.on('connection', (socket) => {
  socket.on('Message', (msg) => {
    console.log('message: ' + msg);
  
  });
});


