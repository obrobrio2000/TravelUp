const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors:{origin : "*"} });
const NodeCouchDb = require("node-couchdb");
const bodyParser = require("body-parser");
//

const couch = new NodeCouchDb({
	auth: {
			user:'admin',
			password:'admin'
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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req,res){
	res.send("Working..");
});


server.listen(3001, () =>{
	console.log("Server running on port 3001 ...")
});

io.on('connection', (socket) => {
	socket.on('Message', (msg) => {
		var isPresent = false;
		//Query per vedere se richiesta citta-stato gia presente nel logging_db
		couch.mango(logging, mangoQuery, parameters).then(({data, headers, status}) => {
			for( i = 0; i< data.docs.length ; i++){
			 
				if(data.docs[i].citta== JSON.parse(msg).citta && data.docs[i].stato==JSON.parse(msg).stato){
							isPresent = true;
				}
				
			}
			
			//Se non è presente,viene inserito nel db con un _id random
			if(!isPresent){
				couch.insert(logging, {
					_id: Math.floor((Math.random() *(100000000000000 - 15)+15)).toString,
					citta: JSON.parse(msg).citta,
					stato: JSON.parse(msg).stato     
				}).then(({data, headers, status}) => {
				 console.log("Dati inseriti nel database");
				 
				}, err => {
					// either request error occured
					// ...or err.code=EDOCCONFLICT if document with the same id already exists
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


