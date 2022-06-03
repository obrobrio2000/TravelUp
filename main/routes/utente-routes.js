const express = require('express');
const router = express.Router();
const utenti = require('../models/utenti-model');
const itinerari = require('../models/itinerari-model');
const { io } = require("socket.io-client");
const socket = io("http://ws:1337");
socket.on('connect', () => {
    socket.emit('room', { room_name: 'clients' });
});

const app = express();

app.use(express.urlencoded({ extended: false }));

const authCheck = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', authCheck, async (req, res) => {
    res.redirect('/itinerari#gestisciAccount');
});

router.get('/elimina', authCheck, async (req, res) => {
    try {
        const q1= {
            selector: {
                _id: { "$eq": req.user.emails[0].value }
            }
        };
        const utente = await utenti.find(q1);
        await utenti.destroy(utente.docs[0]._id, utente.docs[0]._rev);
        const q2 = {
            selector: {
                creatore: { "$eq": req.user.emails[0].value }
            }
        };
        const itin = await itinerari.find(q2);
        itin.docs.forEach(async itinerario => {
            await itinerari.destroy(itinerario._id, itinerario._rev);
        });
        res.redirect('/logout');
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

router.get('/newsletter', authCheck, async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.user.emails[0].value }
            }
        };
        const utente = await utenti.find(q);
        if (utente.docs[0].nlConsent == "no") {
            await utenti.insert({ nomeCompleto: utente.docs[0].nomeCompleto, nome: utente.docs[0].nome, cognome: utente.docs[0].cognome, email: utente.docs[0].email, foto: utente.docs[0].foto, googleId: utente.docs[0].googleId, facebookId: utente.docs[0].facebookId, accessToken: utente.docs[0].accessToken, metodo: utente.docs[0].metodo, nlConsent: "yes", hasReviewed: utente.docs[0].hasReviewed, newUser: utente.docs[0].newUser, _rev: utente.docs[0]._rev }, utente.docs[0]._id);
            socket.emit('mail', { emailUtente: req.user.emails[0].value, target: "newsletterYes" });
        } else {
            await utenti.insert({ nomeCompleto: utente.docs[0].nomeCompleto, nome: utente.docs[0].nome, cognome: utente.docs[0].cognome, email: utente.docs[0].email, foto: utente.docs[0].foto, googleId: utente.docs[0].googleId, facebookId: utente.docs[0].facebookId, accessToken: utente.docs[0].accessToken, metodo: utente.docs[0].metodo, nlConsent: "no", hasReviewed: utente.docs[0].hasReviewed, newUser: utente.docs[0].newUser, _rev: utente.docs[0]._rev }, utente.docs[0]._id);
            socket.emit('mail', { emailUtente: req.user.emails[0].value, target: "newsletterNo" });
        }
        res.redirect('/itinerari#gestisciAccount');
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

module.exports = router;
