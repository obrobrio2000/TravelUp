const express = require('express');
const router = express.Router();
const nano = require('nano')(process.env.COUCHDB_URL);
const utenti = require('../models/utenti-model');
const utentiCache = require('../models/utenti-model-cache');
const itinerari = require('../models/itinerari-model');
const itinerariCache = require('../models/itinerari-model-cache');
const logging_api = require('../models/logging_api-model');

// Documentazione API (con Apidoc)
router.get('/', function (req, res) {
    res.render('api');
});

/**
 * @api {get} /api/utenti/:utente Richiesta info utente
 * @apiDescription Richiesta informazioni di un singolo utente (e dei suoi itinerari)
 * @apiName GetUtente
 * @apiGroup Utente
 *
 * @apiParam {String} utente ID dell'utente (la sua email).
 * 
 * @apiHeader {String} apiKey Chiave API dell'utente.
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
 *     {"userData":{"_id":"utente@gmail.com","_rev":"1-f1dce8e005b916e2768481ce2a12fcc5","nomeCompleto":"Mario Rossi","nome":"Mario","cognome":"Rossi","email":"utente@gmail.com","foto":"https://lh3.googleusercontent.com/a-/AOh14GgTAem92CZRLgI6-c","googleId":"116591799016340495644","facebookId":"null","metodo":"G"},"itinData":[{"_id":"fd494e8c9041d53928b0801fe9003205","_rev":"1-1dd209d3a6a23efb75483dba555319ed","nome":"Itinerario bellissimo","creatore":"utente@gmail.com","tappe":[{"nome":"Historical museum of infantry","data":"2022-05-27","url":"https://google.com/search?q=Historical museum of infantry roma","lat":"41.88888931274414","lon":" 12.514721870422363"},{"nome":"St Bibiana","data":"2022-05-29","url":"https://google.com/search?q=St Bibiana roma","lat":"41.89555358886719","lon":" 12.509188652038574"}]},{"_id":"fd494e8c9041d53928b0801fe9003a90","_rev":"1-30fa03422e996391f5dc96bdc93ddf4f","nome":"Giornata a Milano","creatore":"utente@gmail.com","tappe":[{"nome":"Teatro Re","data":"2022-06-01","url":"https://google.com/search?q=Teatro Re milano","lat":"45.4650993347168","lon":" 9.189330101013184"}]},{"_id":"fd494e8c9041d53928b0801fe900422a","_rev":"1-7ddcc3282ef416040632bfc9f91f9b3b","nome":"TravelUp è spettacolare","creatore":"utente@gmail.com","tappe":[{"nome":"Museo del Risorgimento e dell'età contemporanea","data":"2022-05-30","url":"https://google.com/search?q=Museo del Risorgimento e dell'età contemporanea padova","lat":"45.407779693603516","lon":" 11.877222061157227"},{"nome":"Museum of Precinema","data":"2022-06-05","url":"https://google.com/search?q=Museum of Precinema padova","lat":"45.40000915527344","lon":" 11.875760078430176"}]},{"_id":"fd494e8c9041d53928b0801fe90043ab","_rev":"1-01ef8e62edaec72aba5386b4ed48ebf7","nome":"Non vedo l'ora di partire","creatore":"utente@gmail.com","tappe":[{"nome":"Parco di Cava Porcaro","data":"2022-05-28","url":"https://google.com/search?q=Parco di Cava Porcaro ragusa","lat":"36.94054412841797","lon":" 14.61609935760498"}]}],"success":true,"info":"Utente con itinerari"}
 *
 * @apiError UtenteNotFound L'<code>id</code> dell'utente non è stato trovato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"userData":[],"itinData":[],"success":false,"info":"Utente non trovato"}
 */
router.get('/utenti/:utente', async (req, res) => {
    if (Object.keys(req.body).length === 0 && Object.keys(req.query).length !== 0) {
        req.body = req.query;
    } else if (Object.keys(req.body).length !== 0 && Object.keys(req.query).length === 0) {
        req.query = req.body;
    }
    const q = {
        selector: {
            apiKey: { "$eq": req.body.apikey }
        }
    };
    const apikey = await utenti.find(q);
    if (apikey.docs.length == 0) {
        res.status(404).send({ userData: [], itinData: [], success: false, info: "Chiave API non valida! Dopo aver effettuato il login su TravelUp, puoi trovare la tua chiave API personale nella sezione Gestisci account della tua dashboard." });
    }
    if (req.params.utente == undefined || req.params.utente == "" || req.params.utente == null) {
        await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: false, info: "Parametro non valido" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
        res.status(404).send({ itinData: doc, success: false, info: "Parametro non valido" });
    }
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
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: false, info: "Utente non trovato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(404).send({ userData: [], itinData: [], success: false, info: "Utente non trovato" });
            return;
        }
        const itin = await itinerariCache.find(q2);
        console.log(itin.docs);
        if (itin.docs.length == 0) {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: true, info: "Utente senza itinerari" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ userData: { _id: user.docs[0]._id, _rev: user.docs[0]._rev, nomeCompleto: user.docs[0].nomeCompleto, nome: user.docs[0].nome, cognome: user.docs[0].cognome, email: user.docs[0].email, foto: user.docs[0].foto, googleId: user.docs[0].googleId, facebookId: user.docs[0].facebookId, metodo: user.docs[0].metodo }, itinData: [], success: true, info: "Utente senza itinerari" });
        } else {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: true, info: "Utente con itinerari" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ userData: { _id: user.docs[0]._id, _rev: user.docs[0]._rev, nomeCompleto: user.docs[0].nomeCompleto, nome: user.docs[0].nome, cognome: user.docs[0].cognome, email: user.docs[0].email, foto: user.docs[0].foto, googleId: user.docs[0].googleId, facebookId: user.docs[0].facebookId, metodo: user.docs[0].metodo }, itinData: itin.docs, success: true, info: "Utente con itinerari" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

/**
 * @api {delete} /api/utenti/:utente Eliminazione utente
 * @apiDescription Eliminazione di un utente (e dei suoi itinerari)
 * @apiName DeleteUtente
 * @apiGroup Utente
 *
 * @apiParam {String} utente ID dell'utente (la sua email).
 * 
 * @apiHeader {String} apiKey Chiave API dell'utente.
 *
 * @apiSuccess {Object[]} userData Dati dell'utente.
 * @apiSuccess {Object[]} itinData Dati degli itinerari dell'utente.
 * @apiSuccess {Boolean} success <code>true</code> se l'utente ed i suoi itinerari sono stati eliminati, <code>false</code> altrimenti.
 * @apiSuccess {String} info Informazioni sulla richiesta effettuata.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"userData":[],"itinData":[],"success":true,"info":"Utente e suoi itinerari eliminati"}
 *
 * @apiError UtenteNotDeleted L'utente ed i suoi itinerari non sono stati eliminati.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"userData":[],"itinData":[],"success":false,"info":"Utente e suoi itinerari non eliminati"}
 */
router.delete('/utenti/:utente', async (req, res) => {
    const q = {
        selector: {
            apiKey: { "$eq": req.body.apikey }
        }
    };
    const apikey = await utenti.find(q);
    if (apikey.docs.length == 0) {
        res.status(404).send({ userData: [], itinData: [], success: false, info: "Chiave API non valida! Dopo aver effettuato il login su TravelUp, puoi trovare la tua chiave API personale nella sezione Gestisci account della tua dashboard." });
    }
    if (req.params.utente != apikey.docs[0]._id) {
        res.status(404).send({ userData: [], itinData: [], success: false, info: "Non puoi eliminare un utente diverso da te stesso!" });
    }
    if (req.params.utente == undefined || req.params.utente == "" || req.params.utente == null) {
        await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: false, info: "Parametro non valido" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
        res.status(404).send({ userData: [], itinData: [], success: false, info: "Parametro non valido" });
    }
    try {
        try {
            const q1 = {
                selector: {
                    creatore: { "$eq": req.params.utente }
                }
            };
            const itin = await itinerari.find(q1);
            for (var i = 0; i < itin.docs.length; i++) {
                await itinerari.destroy(itin.docs[i]._id, itin.docs[i]._rev);
            }
            var doc = await utenti.get(req.params.utente);
            await utenti.destroy(req.params.utente, doc._rev);
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /utenti/" + req.params.utente, output: { userData: [], itinData: [], success: true, info: "Utente e suoi itinerari eliminati" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ userData: [], itinData: [], success: true, info: "Utente e suoi itinerari eliminati" });
        } catch {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /utenti/" + req.params.utente, output: { itinData: doc, success: false, info: "Utente e suoi itinerari non eliminati" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(404).send({ userData: [], itinData: [], success: false, info: "Utente e suoi itinerari non eliminati" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

/**
 * @api {get} /api/itinerari/:itinerario Richiesta info itinerario
 * @apiDescription Richiesta informazioni di un singolo itinerario
 * @apiName GetItinerario
 * @apiGroup Itinerario
 *
 * @apiParam {String} itinerario ID dell'itinerario.
 * 
 * @apiHeader {String} apiKey Chiave API dell'utente.
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
 * @apiSuccess {String} info Informazioni sulla richiesta effettuata.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"itinData":{"_id":"fd494e8c9041d53928b0801fe9003205","_rev":"1-1dd209d3a6a23efb75483dba555319ed","nome":"Itinerario bellissimo","creatore":"utente@gmail.com","tappe":[{"nome":"Historical museum of infantry","data":"2022-05-27","url":"https://google.com/search?q=Historical museum of infantry roma","lat":"41.88888931274414","lon":" 12.514721870422363"},{"nome":"St Bibiana","data":"2022-05-29","url":"https://google.com/search?q=St Bibiana roma","lat":"41.89555358886719","lon":" 12.509188652038574"}]},"success":true,"info":"Itinerario trovato"}
 *
 * @apiError ItinerarioNotFound L'<code>id</code> dell'itinerario non è stato trovato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"itinData":[],"success":false,"info":"Itinerario non trovato"}
 */
router.get('/itinerari/:itinerario', async (req, res) => {
    if (Object.keys(req.body).length === 0 && Object.keys(req.query).length !== 0) {
        req.body = req.query;
    } else if (Object.keys(req.body).length !== 0 && Object.keys(req.query).length === 0) {
        req.query = req.body;
    }
    const q = {
        selector: {
            apiKey: { "$eq": req.body.apikey }
        }
    };
    const apikey = await utenti.find(q);
    if (apikey.docs.length == 0) {
        res.status(404).send({ itinData: [], success: false, info: "Chiave API non valida! Dopo aver effettuato il login su TravelUp, puoi trovare la tua chiave API personale nella sezione Gestisci account della tua dashboard." });
    }
    if (req.params.itinerario == undefined || req.params.itinerario == "" || req.params.itinerario == null) {
        await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /itinerari/" + req.params.itinerario, output: { itinData: doc, success: false, info: "Parametro non valido" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
        res.status(404).send({ itinData: doc, success: false, info: "Parametro non valido" });
    }
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerariCache.find(q);
        console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /itinerari/" + req.params.itinerario, output: { itinData: [], success: false, info: "Itinerario non trovato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(404).send({ itinData: [], success: false, info: "Itinerario non trovato" });
        } else {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "GET /itinerari/" + req.params.itinerario, output: { itinData: itin.docs[0], success: true, info: "Itinerario trovato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ itinData: itin.docs[0], success: true, info: "Itinerario trovato" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

/**
 * @api {post} /api/itinerari Creazione/modifica itinerario
 * @apiDescription Creazione di un nuovo itinerario o modifica di uno esistente
 * @apiName CreateOrEditItinerario
 * @apiGroup Itinerario
 * 
 * @apiHeader {String} apiKey Chiave API dell'utente.
 * @apiHeader {String} itinerario ID dell'itinerario (in caso di modifica di un itinerario già esistente)
 * @apiHeader {String} nome Nome dell'itinerario.
 * @apiHeader {String} creatore ID dell'utente creatore dell'itinerario.
 * @apiHeader {Object[]} tappe Tappe dell'itinerario.
 * @apiHeader {String} tappe.nome Nome della tappa.
 * @apiHeader {String} tappe.data Data della tappa.
 * @apiHeader {String} tappe.url URL Google Search della tappa.
 * @apiHeader {String} tappe.lat Latitudine della tappa.
 * @apiHeader {String} tappe.lon Longitudine della tappa.
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
 * @apiSuccess {Boolean} success <code>true</code> se l'itinerario è stato creato, <code>false</code> altrimenti.
 * @apiSuccess {String} info Informazioni sulla richiesta effettuata.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"itinData":{"_id":"fd494e8c9041d53928b0801fe9003205","_rev":"1-1dd209d3a6a23efb75483dba555319ed","nome":"Itinerario bellissimo","creatore":"utente@gmail.com","tappe":[{"nome":"Historical museum of infantry","data":"2022-05-27","url":"https://google.com/search?q=Historical museum of infantry roma","lat":"41.88888931274414","lon":" 12.514721870422363"},{"nome":"St Bibiana","data":"2022-05-29","url":"https://google.com/search?q=St Bibiana roma","lat":"41.89555358886719","lon":" 12.509188652038574"}]},"success":true,"info":"Itinerario creato"}
 *
 * @apiError ItinerarioNotCreatedOrEdited L'itinerario non è stato creato/modificato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"itinData":[],"success":false,"info":"Itinerario non creato/modificato"}
 */
router.post('/itinerari', async (req, res) => {
    const q = {
        selector: {
            apiKey: { "$eq": req.body.apikey }
        }
    };
    const apikey = await utenti.find(q);
    if (apikey.docs.length == 0) {
        res.status(404).send({ itinData: [], success: false, info: "Chiave API non valida! Dopo aver effettuato il login su TravelUp, puoi trovare la tua chiave API personale nella sezione Gestisci account della tua dashboard." });
    }
    if (req.body.nome == undefined || req.body.nome == "" || req.body.nome == null || req.body.creatore == undefined || req.body.creatore == "" || req.body.creatore == null || req.body.tappe == undefined || req.body.tappe == "" || req.body.tappe == null) {
        res.status(404).send({ itinData: [], success: false, info: "Parametri non validi" });
    }
    if (req.body.itinerario == undefined || req.body.itinerario == "" || req.body.itinerario == null) {
        await itinerari.insert({ nome: req.body.nome, creatore: req.body.creatore, tappe: req.body.tappe }, (await nano.uuids()).uuids[0]);
        try {
            var doc = await itinerari.get((await nano.uuids()).uuids[0]);
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "POST /itinerari/" + (await nano.uuids()).uuids[0], output: { itinData: doc, success: true, info: "Itinerario creato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ itinData: doc, success: true, info: "Itinerario creato" });
        } catch {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "POST /itinerari/" + (await nano.uuids()).uuids[0], output: { itinData: [], success: false, info: "Itinerario non creato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(404).send({ itinData: [], success: false, info: "Itinerario non creato" });
        }
    } else {
        try {
            const q1 = {
                selector: {
                    _id: { "$eq": req.body.itinerario }
                }
            };
            const itin = await itinerari.find(q1);
            if (itin.docs.length == 0) {
                res.status(404).send({ itinData: [], success: false, info: "Itinerario da modificare non trovato" });
            } else {
                var doc = await itinerari.get(req.body.itinerario);
                await itinerari.insert({ nome: req.body.nome, creatore: req.body.creatore, tappe: req.body.tappe, _rev: doc._rev }, req.body.itinerario);
                try {
                    var doc = await itinerari.get(req.body.itinerario);
                    await logging_api.insert({ apiKey: req.body.apikey, richiesta: "POST /itinerari/" + req.body.itinerario, output: { itinData: doc, success: true, info: "Itinerario modificato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
                    res.status(200).send({ itinData: doc, success: true, info: "Itinerario modificato" });
                } catch {
                    await logging_api.insert({ apiKey: req.body.apikey, richiesta: "POST /itinerari/" + req.body.itinerario, output: { itinData: [], success: false, info: "Itinerario non modificato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
                    res.status(404).send({ itinData: [], success: false, info: "Itinerario non modificato" });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(404).render('errore');
        }
    }
});

/**
 * @api {delete} /api/itinerari/:itinerario Eliminazione itinerario
 * @apiDescription Eliminazione di un itinerario
 * @apiName DeleteItinerario
 * @apiGroup Itinerario
 *
 * @apiParam {String} itinerario ID dell'itinerario.
 * 
 * @apiHeader {String} apiKey Chiave API dell'utente.
 *
 * @apiSuccess {Object[]} itinData Dati dell'itinerario.
 * @apiSuccess {Boolean} success <code>true</code> se l'itinerario è stato eliminato, <code>false</code> altrimenti.
 * @apiSuccess {String} info Informazioni sulla richiesta effettuata.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {"itinData":[],"success":true,"info":"Itinerario eliminato"}
 *
 * @apiError ItinerarioNotDeleted L'itinerario non è stato eliminato.
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {"itinData":[],"success":false,"info":"Itinerario non eliminato"}
 */
router.delete('/itinerari/:itinerario', async (req, res) => {
    const q = {
        selector: {
            apiKey: { "$eq": req.body.apikey }
        }
    };
    const apikey = await utenti.find(q);
    if (apikey.docs.length == 0) {
        res.status(404).send({ itinData: [], success: false, info: "Chiave API non valida! Dopo aver effettuato il login su TravelUp, puoi trovare la tua chiave API personale nella sezione Gestisci account della tua dashboard." });
    }
    if (req.params.itinerario == undefined || req.params.itinerario == "" || req.params.itinerario == null) {
        await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /itinerari/" + req.params.itinerario, output: { itinData: doc, success: false, info: "Parametro non valido" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
        res.status(404).send({ itinData: doc, success: false, info: "Parametro non valido" });
    }
    try {
        try {
            var doc = await itinerari.get(req.params.itinerario);
            await itinerari.destroy(req.params.itinerario, doc._rev);
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /itinerari/" + req.params.itinerario, output: { itinData: [], success: true, info: "Itinerario eliminato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(200).send({ itinData: [], success: true, info: "Itinerario eliminato" });
        } catch {
            await logging_api.insert({ apiKey: req.body.apikey, richiesta: "DELETE /itinerari/" + req.params.itinerario, output: { itinData: doc, success: false, info: "Itinerario non eliminato" }, timestamp: ((new Date()).toISOString()) }, (await nano.uuids()).uuids[0]);
            res.status(404).send({ itinData: [], success: false, info: "Itinerario non eliminato" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

module.exports = router;