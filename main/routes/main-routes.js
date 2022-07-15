const express = require('express');
const router = express.Router();
const itinerari = require('../models/itinerari-model');
const utenti = require('../models/utenti-model');

const authCheck = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/itinerari');
    }
}

router.get(["/", "/index.html", "/home"], async (req, res) => {
    try {
        const q = {
            selector: {
                creatore: { "$eq": "TravelUp" }
            }
        };
        const itin = await itinerari.find(q);
        res.render('index', { itin: itin.docs, user: req.user });
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

router.get('/login', authCheck, (req, res) => {
    res.render('login');
});

router.get('/logout', async (req, res) => {
    if ((process.env.NODE_ENV || '').trim() !== 'test' && req.user) {
        var doc = await utenti.get(req.user.emails[0].value);
        await utenti.insert({ nomeCompleto: doc.nomeCompleto, nome: doc.nome, cognome: doc.cognome, email: doc.email, foto: doc.foto, googleId: doc.id, facebookId: doc.facebookId, accessToken: "deleted", metodo: doc.metodo, nlConsent: doc.nlConsent, hasReviewed: doc.hasReviewed, newUser: doc.newUser, apiKey: doc.apiKey, _rev: doc._rev }, doc._id);
    }
    req.logout();
    req.session = null;
    res.redirect('/');
});

// handling errori in caso di pagine non esistenti
router.get('*', (req, res) => {
    res.status(404).render('errore');
});

module.exports = router;