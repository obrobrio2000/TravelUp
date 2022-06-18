const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const nano = require('nano')(process.env.COUCHDB_URL);
const itinerari = nano.use('itinerari');
// const NodeCouchDb = require("node-couchdb");
const { checkServerIdentity } = require("tls");
const port = 1337;

// const couch = new NodeCouchDb({
// 	host: 'couchdb',
// 	protocol: 'https',
// 	port: 6984,
// 	auth: {
// 		user: 'admin',
// 		pass: 'admin'
// 	}
// });



const logging = "logging_cities";

const mangoQuery = {
	"selector": {
		"_id": {
			"$gt": null
		}
	}
}

const parameters = {};


io.on('connection', (socket) => {
	socket.on('room', (data) => {
		socket.join(data.room_name);
		console.log('Socket: ' + socket.id + ' è entrato nella stanza: ' + data.room_name)
	})
	socket.on('Luoghi', (data) => {
		console.log('Richiesta ricevuta')
		var citta = data.citta
		var target = data.target
		var socketid = socket.id
		switch (target) {
			//inserire caching and logging
			case 'Cultura': {
				socket.to('api').emit('Cultura', { socketid, citta });
				break;
			};
			case 'Food': {
				socket.to('api').emit('Food', { socketid, citta });
				break;
			};
			case 'Intrattenimento': {
				socket.to('api').emit('Intrattenimento', { socketid, citta });
				break;
			};
			case 'Utility': {
				socket.to('api').emit('Utility', { socketid, citta });
				break;
			};
			default: {
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

	socket.on('NuovoItinerario', async (data) => {
		console.log('itinerario ricevuto');
		await itinerari.insert({ nome: data.titolo, creatore: data.creatore, tappe: data.tappe }, (await nano.uuids()).uuids[0]);
		console.log('Inserito con successo');
	})

	socket.on('luoghi_rispostaApi', (data) => {
		console.log('ricevuta risposta');
		io.to(data.socketid).emit('luoghi_rispostaClient', { value: data.value, target: data.target });
	})

	socket.on('mail', async (data) => {
		console.log('Richiesta ricevuta')
		var emailUtente = data.emailUtente
		var target = data.target
		var socketid = socket.id
		switch (target) {
			case 'benvenuto': {
				socket.to('mail').emit('benvenuto', { socketid, emailUtente });
				break;
			};
			case 'accesso': {
				socket.to('mail').emit('accesso', { socketid, emailUtente });
				break;
			};
			case 'newsletterYes': {
				socket.to('mail').emit('newsletterYes', { socketid, emailUtente });
				break;
			};
			case 'newsletterNo': {
				socket.to('mail').emit('newsletterNo', { socketid, emailUtente });
				break;
			};
			case 'addio': {
				socket.to('mail').emit('addio', { socketid, emailUtente });
				break;
			};
			case 'test': {
				socket.to('mail').emit('test', { socketid, emailUtente });
				break;
			};
			default: {
				io.to(socketid).emit('Errore');
				break;
			}
		}

	});
});


if ((process.env.NODE_ENV || '').trim() !== 'test') {
	server.listen(port, () => {
		console.log(`Server WebSocket in ascolto sull'indirizzo http://localhost:${port}`);
	});
}

module.exports = app;