require('dotenv').config();
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const nano = require('nano')(process.env.COUCHDB_URL);
const itinerari = nano.use('itinerari');
const { checkServerIdentity } = require("tls");
const port = 1337;
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.GOOGLE_CSE_ID, process.env.GOOGLE_API_KEY);

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
	});

	socket.on('luoghi_rispostaApi', (data) => {
		console.log('ricevuta risposta');
		io.to(data.socketid).emit('luoghi_rispostaClient', { value: data.value, target: data.target });
	})

	socket.on('immagini_rispostaApi', async (data) => {
		console.log('ricevuta risposta');
		await itinerari.insert({ nome: data.nome, creatore: data.creatore, tappe: data.tappe }, (await nano.uuids()).uuids[0]);
		console.log('Inserito con successo');
		io.to(data.socketid).emit('nuovoItinerario_rispostaClient', { value: 'Inserito con successo' });
	})

	socket.on('NuovoItinerario', async (data) => {
		console.log('itinerario ricevuto');
		var socketid = socket.id;
		socket.to('api').emit('Immagini', { socketid, nome: data.titolo, creatore: data.creatore, tappe: data.tappe });
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
