const express = require('express');
const router = express.Router();
const passport = require('passport');
const itinerari = require('../models/itinerari-model');

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
        res.render('errore');
    }
});

router.get('/login', authCheck, (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
}
);

// handling errori in caso di pagine non esistenti
router.get('*', (req, res) => {
    res.render('errore');
});

module.exports = router;