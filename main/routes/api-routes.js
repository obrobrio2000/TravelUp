const express = require('express');
const router = express.Router();
const utentiCache = require('../models/utenti-model-cache');
const itinerariCache = require('../models/itinerari-model-cache');

// Documentazione API (con Apidoc)
router.get('/', function (req, res) {
    res.render('api');
});

// Richiesta API TravelUp utente ed i suoi itinerari
/**
 * @api {get} /api/utente/:id Richiesta info utente
 * @apiDescription Richiesta informazioni di un singolo utente (e dei suoi itinerari)
 * @apiName GetUtente
 * @apiGroup Utente
 *
 * @apiParam {String} id ID dell'utente (la sua email).
 *
 * @apiSuccess {Object[]} userData Dati dell'utente.
 * @apiSuccess {String} _id ID dell'utente.
 * @apiSuccess {String} nomeCompleto Nome e cognome dell'utente.
 * @apiSuccess {String} nome Nome dell'utente.
 * @apiSuccess {String} cognome Cognome dell'utente.
 * @apiSuccess {String} email Email dell'utente.
 * @apiSuccess {String} foto Foto profilo dell'utente.
 * @apiSuccess {String} googleId ID Google dell'utente (<code>null</code> se non ha mai fatto l'accesso con Google).
 * @apiSuccess {String} facebookId ID Facebook dell'utente (<code>null</code> se non ha mai fatto l'accesso con Facebook).
 * @apiSuccess {String} accessToken Token di accesso dell'utente (di Google o di Facebook in base all'ultima piattaforma usata per il login).
 * @apiSuccess {String} metodo Ultima piattaforma usata per il login (<code>G</code> se Google o <code>F</code> se Facebook).
 * @apiSuccess {Object[]} itinData Dati degli itinerari dell'utente.
 * @apiSuccess {String} _id ID dell'itinerario.
 * @apiSuccess {String} nome Nome dell'itinerario.
 * @apiSuccess {String} creatore ID dell'utente creatore dell'itinerario.
 * @apiSuccess {Object[]} tappe Tappe dell'itinerario.
 * @apiSuccess {String} tappe.nome Nome della tappa.
 * @apiSuccess {String} tappe.data Data della tappa.
 * @apiSuccess {String} tappe.url URL Google Search della tappa.
 * @apiSuccess {String} tappe.lat Latitudine della tappa.
 * @apiSuccess {String} tappe.lon Longitudine della tappa.
 * @apiSuccess {Boolean} success <code>true</code> se l'itinerario è stato trovato, <code>false</code> altrimenti.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"userData":{"_id":"utente@gmail.com","_rev":"1-f1dce8e005b916e2768481ce2a12fcc5","nomeCompleto":"Mario Rossi","nome":"Mario","cognome":"Rossi","email":"utente@gmail.com","foto":"https://lh3.googleusercontent.com/a-/AOh14GgTAem92CZRLgI6-c","googleId":"116591799016340495644","facebookId":"null","accessToken":"gzg8QyjviRN0qYKHel68RyOfC3EEoDYKnil53-8nCZIsBoTA5NAR4l1521GTYyQzZ7oItrFdPs1","metodo":"G"},"itinData":[{"_id":"fd494e8c9041d53928b0801fe9003205","_rev":"1-1dd209d3a6a23efb75483dba555319ed","nome":"Itinerario bellissimo","creatore":"utente@gmail.com","tappe":[{"nome":"Historical museum of infantry","data":"2022-05-27","url":"https://google.com/search?q=Historical museum of infantry roma","lat":"41.88888931274414","lon":" 12.514721870422363"},{"nome":"St Bibiana","data":"2022-05-29","url":"https://google.com/search?q=St Bibiana roma","lat":"41.89555358886719","lon":" 12.509188652038574"}]},{"_id":"fd494e8c9041d53928b0801fe9003a90","_rev":"1-30fa03422e996391f5dc96bdc93ddf4f","nome":"Giornata a Milano","creatore":"utente@gmail.com","tappe":[{"nome":"Teatro Re","data":"2022-06-01","url":"https://google.com/search?q=Teatro Re milano","lat":"45.4650993347168","lon":" 9.189330101013184"}]},{"_id":"fd494e8c9041d53928b0801fe900422a","_rev":"1-7ddcc3282ef416040632bfc9f91f9b3b","nome":"TravelUp è spettacolare","creatore":"utente@gmail.com","tappe":[{"nome":"Museo del Risorgimento e dell'età contemporanea","data":"2022-05-30","url":"https://google.com/search?q=Museo del Risorgimento e dell'età contemporanea padova","lat":"45.407779693603516","lon":" 11.877222061157227"},{"nome":"Museum of Precinema","data":"2022-06-05","url":"https://google.com/search?q=Museum of Precinema padova","lat":"45.40000915527344","lon":" 11.875760078430176"}]},{"_id":"fd494e8c9041d53928b0801fe90043ab","_rev":"1-01ef8e62edaec72aba5386b4ed48ebf7","nome":"Non vedo l'ora di partire","creatore":"utente@gmail.com","tappe":[{"nome":"Parco di Cava Porcaro","data":"2022-05-28","url":"https://google.com/search?q=Parco di Cava Porcaro ragusa","lat":"36.94054412841797","lon":" 14.61609935760498"}]}],"success":true,"info":"Utente con itinerari"}
 *
 * @apiError Utente non trovato L'<code>id</code> dell'utente non è stato trovato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"userData":[],"itinData":[],"success":false,"info":"Utente non trovato"}
 */
router.get('/utenti/:utente', async (req, res) => {
    try {
        const q1 = {
            selector: {
                _id: { "$eq": req.params.utente }
            }
        };
        const user = await utentiCache.find(q1);
        console.log(user.docs[0]);
        const q2 = {
            selector: {
                creatore: { "$eq": req.params.utente }
            }
        };
        if (user.docs.length == 0) {
            res.status(404).send({ userData: [], itinData: [], success: false, info: "Utente non trovato" });
            return;
        }
        const itin = await itinerariCache.find(q2);
        console.log(itin.docs);
        if (itin.docs.length == 0) {
            res.status(404).send({ userData: user.docs[0], itinData: [], success: true, info: "Utente senza itinerari" });
        } else {
            res.status(200).send({ userData: user.docs[0], itinData: itin.docs, success: true, info: "Utente con itinerari" });
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

// Richiesta API TravelUp itinerario
/**
 * @api {get} /user/:id Richiesta info itinerario
 * @apiDescription Richiesta informazioni di un singolo itinerario
 * @apiName GetItinerario
 * @apiGroup Itinerario
 *
 * @apiParam {String} id ID dell'itinerario.
 *
 * @apiSuccess {Object[]} itinData Dati dell'itinerario.
 * @apiSuccess {String} _id ID dell'itinerario.
 * @apiSuccess {String} nome Nome dell'itinerario.
 * @apiSuccess {String} creatore ID dell'utente creatore dell'itinerario.
 * @apiSuccess {Object[]} tappe Tappe dell'itinerario.
 * @apiSuccess {String} tappe.nome Nome della tappa.
 * @apiSuccess {String} tappe.data Data della tappa.
 * @apiSuccess {String} tappe.url URL Google Search della tappa.
 * @apiSuccess {String} tappe.lat Latitudine della tappa.
 * @apiSuccess {String} tappe.lon Longitudine della tappa.
 * @apiSuccess {Boolean} success <code>true</code> se l'itinerario è stato trovato, <code>false</code> altrimenti.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"itinData":{"_id":"fd494e8c9041d53928b0801fe9003205","_rev":"1-1dd209d3a6a23efb75483dba555319ed","nome":"Itinerario bellissimo","creatore":"utente@gmail.com","tappe":[{"nome":"Historical museum of infantry","data":"2022-05-27","url":"https://google.com/search?q=Historical museum of infantry roma","lat":"41.88888931274414","lon":" 12.514721870422363"},{"nome":"St Bibiana","data":"2022-05-29","url":"https://google.com/search?q=St Bibiana roma","lat":"41.89555358886719","lon":" 12.509188652038574"}]},"success":true,"info":"Itinerario trovato"}
 *
 * @apiError Itinerario non trovato L'<code>id</code> dell'itinerario non è stato trovato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"itinData":[],"success":false,"info":"Itinerario non trovato"}
 */
router.get('/itinerari/:itinerario', async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerariCache.find(q);
        console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            res.status(404).send({ itinData: [], success: false, info: "Itinerario non trovato" });
        } else {
            res.status(200).send({ itinData: itin.docs[0], success: true, info: "Itinerario trovato" });
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

module.exports = router;