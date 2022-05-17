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
});



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
});

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
});


