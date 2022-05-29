const express = require('express');
const router = express.Router();
const utenti = require('../models/utenti-model');
const itinerari = require('../models/itinerari-model');

// Richiesta API TravelUp utente ed i suoi itinerari
router.get('/utenti/:utente', async (req, res) => {
    try {
        const q1 = {
            selector: {
                _id: { "$eq": req.params.utente }
            }
        };
        const user = await utenti.find(q1);
        console.log(user.docs[0]);
        const q2 = {
            selector: {
                creatore: { "$eq": req.params.utente }
            }
        };
        const itin = await itinerari.find(q2);
        console.log(itin.docs);
        if (user.docs.length == 0) {
            res.status(404);
        } else {
            res.status(200).send({userData: user.docs[0], itinData: itin.docs, success: true});
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

// Richiesta API TravelUp itinerario
router.get('/itinerari/:itinerario', async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerari.find(q);
        console.log(itin.docs);
        if (itin.docs.length == 0) {
            res.status(404);
        } else {
            res.status(200).send({itinData: itin.docs, success: true});
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

// handling errori in caso di pagine non esistenti
router.get('/:sconosciuto', (req, res) => {
    res.render('errore');
});

module.exports = router;