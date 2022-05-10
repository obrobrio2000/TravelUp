const express = require('express');
const router = express.Router();
const nano = require('nano')(process.env.COUCHDB_URL);
const utenti = nano.use('utenti');
const itinerari = nano.use('itinerari');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

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
        res.render('errore');
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
            res.render('errore');
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

router.get('/:itinerario', authCheck, async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        console.log(q);
        const itin = await itinerari.find(q);
        console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            res.render('errore');
        } else {
            res.render('visualizza-itinerario', { itinerario: itin.docs[0], user: req.user });
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

router.get('/:itinerario/addToCalendar', authCheck, async (req, res) => {
    try {
        const q1 = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        console.log(q1);
        const itin = await itinerari.find(q1);
        console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            res.render('errore');
        } else {
            const q2 = {
                selector: {
                    _id: { "$eq": req.user.emails[0].value }
                }
            };
            const utente = await utenti.find(q2);
            console.log(utente.docs);

            if (utente.docs[0].metodoLogin == 'Facebook') {
                res.render('erroreCalendar');
            } else if (utente.docs[0].metodoLogin == 'Google') {
                const oAuth2Client = new OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                )

                oAuth2Client.setCredentials({
                    access_token: utente.docs[0].accessToken,
                })

                const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

                const event = {
                    summary: itin.docs[0].nome,
                    location: itin.docs[0].citta,
                    description: itin.docs[0].descrizione,
                    colorId: 7,
                    start: {
                        dateTime: itin.docs[0].dataInizio,
                        timeZone: 'Europe/Rome',
                    },
                    end: {
                        dateTime: itin.docs[0].dataFine,
                        timeZone: 'Europe/Rome',
                    },
                }

                calendar.events.insert(
                    { calendarId: 'primary', resource: event },
                    err => {
                        if (err) return console.error('Errore creazione evento nel calendario: ', err)
                        return console.log('Evento creato con successo')
                    }
                )
                res.redirect('/itinerari/' + req.params.itinerario);
            }
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

module.exports = router;