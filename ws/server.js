<<<<<<< HEAD
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors:{origin : "*"} });
const NodeCouchDb = require("node-couchdb");
var _uuid;


//Connessione al db
const couch = new NodeCouchDb({
	host: 'couchdb',
	protocol:'http',
	port:5984,
	auth:{
		user:'admin',
		pass:'admin'
	}
||||||| merged common ancestors
var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) {
=======
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors:{origin : "*"} });
const NodeCouchDb = require("node-couchdb");
const { checkServerIdentity } = require("tls");


//Connessione al db
const couch = new NodeCouchDb({
	host: 'couchdb',
	protocol:'http',
	port:5984,
	auth:{
		user:'admin',
		pass:'admin'
	}
>>>>>>> 59d7ff3d5d97ec0753b099ea716323208025fced
});
<<<<<<< HEAD



const logging = "logging_cities";

const mangoQuery = {
	"selector": {
		 "_id": { 
				"$gt": null
		 }
	}
}

const parameters ={};






server.listen(3000, () =>{
	console.log("Server running on port 1337 ...")
||||||| merged common ancestors
server.listen(1337, function() { });
wsServer = new WebSocketServer({
    httpServer: server
=======



const logging = "logging_cities";

const mangoQuery = {
	"selector": {
		 "_id": { 
				"$gt": null
		 }
	}
}

const parameters ={}; 

server.listen(1337, () =>{
	console.log("Server running on port 1337 ...")
>>>>>>> 59d7ff3d5d97ec0753b099ea716323208025fced
});
<<<<<<< HEAD

io.on('connection', (socket) => {
	socket.on('Message', (msg) => {
		var isPresent = false;
		var id;
		var count;
		var rev;
		var citta;
		var stato;
		
		//Query per vedere se richiesta citta-stato gia presente nel logging_db
		couch.mango(logging, mangoQuery, parameters).then(({data, headers, status}) => {
			for( i = 0; i< data.docs.length ; i++){
				if(data.docs[i].citta== JSON.parse(msg).citta && data.docs[i].stato==JSON.parse(msg).stato){
							isPresent = true;
							id = data.docs[i]._id;
							count = data.docs[i].contatore+ 1;
							rev = data.docs[i]._rev
							citta = data.docs[i].citta
							stato = data.docs[i].stato
				}
				
				
			}
			
			//Se non è presente,viene inserito nel db con un _id unico
			if(!isPresent){

				couch.uniqid().then(ids => {
						ids[0],	_uuid = ids[0]});

				couch.insert(logging, {
					_id: _uuid,
					citta: JSON.parse(msg).citta,
					stato: JSON.parse(msg).stato,
					contatore:1    
				}).then(({data, headers, status}) => {
				 console.log("Dati inseriti nel database");
				 
				}, err => {
					
					// either request error occured
					// ...or err.code=EDOCCONFLICT if document with the same id already exists
				});
				
			}
			// Altrimenti viene aggiornato il  valore contatore relativo a quella citta
			else{
				couch.update(logging, {
					_id: id,
					_rev: rev,
					citta: citta,
					stato: stato,
					contatore:count
				}).then(({data, headers, status}) => {
					console.log("Dati nel database aggiornati")
					// data is json response
					// headers is an object with all response headers
					// status is statusCode number
				}, err => {
					// either request error occured
					// ...or err.code=EFIELDMISSING if either _id or _rev fields are missing
				});
			}
			
			
		}, err => {
			// either request error occured
			// ...or err.code=EDOCMISSING if document is missing
			// ...or err.code=EUNKNOWN if statusCode is unexpected
		});
		
		JSON.stringify(msg);
		
		
	
	});
||||||| merged common ancestors
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Il messaggio ricevuto è: ' + message.utf8Data);
        }
    });
    connection.on('close', function(connection) {
    });
=======

io.on('connection', (socket) => {
	socket.on('room',(data)=>{
		socket.join(data.room_name);
		console.log('Socket: '+socket.id+' è entrato nella stanza: '+data.room_name)
	})
	socket.on('Luoghi', (data) => {
		console.log('Richiesta ricevuta')
		var citta = data.citta
		var target = data.target
		var socketid = socket.id
		switch(target){
			//inserire chaching and logging
			case 'Cultura':{
				socket.to('api').emit('Cultura',{socketid,citta});
				break;
			};
			case 'Food' :{
				socket.to('api').emit('Food',{socketid,citta});
				break;
			};
			case 'Intrattenimento':{
				socket.to('api').emit('Intrattenimento',{socketid,citta});
				break;
			};
			case 'Utility':{
				socket.to('api').emit('Utility',{socketid,citta});
				break;
			};
			default:{
				io.to(socketid).emit('Errore');
				break;
			}
		}
		/*var isPresent = false;
		var id;
		var count;
		var rev;
		
		
		//Query per vedere se richiesta citta-stato gia presente nel logging_db
		couch.mango(logging, mangoQuery, parameters).then(({data, headers, status}) => {
			for( i = 0; i< data.docs.length ; i++){
				if(data.docs[i].citta== JSON.parse(msg).citta && data.docs[i].stato==JSON.parse(msg).stato){
							isPresent = true;
							id = data.docs[i]._id;
							count = data.docs[i].contatore+ 1;
							rev = data.docs[i]._rev
							citta = data.docs[i].citta
							stato = data.docs[i].stato
				}
				
				
			}
			
			//Se non è presente,viene inserito nel db con un _id unico
			if(!isPresent){

				couch.uniqid().then(ids => {
						ids[0],	_uuid = ids[0]});

				couch.insert(logging, {
					_id: _uuid,
					citta: JSON.parse(msg).citta,
					stato: JSON.parse(msg).stato,
					contatore:1    
				}).then(({data, headers, status}) => {
				 console.log("Dati inseriti nel database");
				 
				}, err => {
					
					// either request error occured
					// ...or err.code=EDOCCONFLICT if document with the same id already exists
				});
				
			}
			// Altrimenti viene aggiornato il  valore contatore relativo a quella citta
			else{
				couch.update(logging, {
					_id: id,
					_rev: rev,
					citta: citta,
					stato: stato,
					contatore:count
				}).then(({data, headers, status}) => {
					console.log("Dati nel database aggiornati")
					// data is json response
					// headers is an object with all response headers
					// status is statusCode number
				}, err => {
					// either request error occured
					// ...or err.code=EFIELDMISSING if either _id or _rev fields are missing
				});
			}
			
			
		}, err => {
			// either request error occured
			// ...or err.code=EDOCMISSING if document is missing
			// ...or err.code=EUNKNOWN if statusCode is unexpected
		});
		
		JSON.stringify(msg);
		*/
		
	
	});

	socket.on('NuovoItinerario',(data)=>{
		var _uuid;
		console.log('itinerario ricevuto');
		couch.uniqid().then(ids => {
			ids[0], _uuid = ids[0]
		});
		couch.insert('itinerari', {
			_id : _uuid,
			nome: data.titolo,
			creatore: data.creatore,
			tappe: data.tappe
		}).then(({data,headers,status})=>{
			console.log('Inserito con successo');
		},err=>{
			console.log(err);
		})
	})

	socket.on('luoghi_rispostaApi',(data)=>{
		console.log('ricevuta risposta');
		io.to(data.socketid).emit('luoghi_rispostaClient',{value:data.value,target:data.target});
	})
>>>>>>> 59d7ff3d5d97ec0753b099ea716323208025fced
});


