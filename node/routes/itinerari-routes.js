const express = require('express');
const router = express.Router();
const utenti = require('../models/model');
const itinerari = require('../models/model');

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
    // res.send('La tua dashboard' + req.user.username);
    // res.send(`Hello ${req.user} - ${req.user.displayName} - ${req.user.emails[0].value} - ${req.user._json.email}`);
    try {
        const q = {
            selector: {
                creatore: { "$eq": req.user.emails[0].value }
            }
        };
        const itin = await itinerari.find(q);
        console.log(itin.docs);
        console.log(itin.docs.length);
        res.render('itinerari', { itin: itin.docs, user: req.user });
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});

router.get('/nuovo', authCheck, async (req, res) => {
    res.render('nuovo-itinerario', { user: req.user });
});

router.get('/:itinerario/modifica', authCheck, async (req, res) => {
    res.render('modifica-itinerario', { user: req.user });
});

router.get('/:itinerario/elimina', authCheck, async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerari.find(q);
        if (req.user.emails[0].value === itin.docs[0].creatore) {
            await itinerari.destroy(itin.docs[0]._id, itin.docs[0]._rev);
            res.redirect('/itinerari');
        } else {
            res.render('error');
        }
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});

router.get('/:itinerario', authCheck, async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerari.find(q);
        console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            res.render('error');
        } else {
            res.render('visualizza-itinerario', { itinerario: itin.docs[0], user: req.user });
        }
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});

module.exports = router;