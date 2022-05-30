const express = require('express');
const router = express.Router();
const utenti = require('../models/utenti-model');
const itinerari = require('../models/itinerari-model');
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
        // console.log(itin.docs);
        // console.log(itin.docs.length);
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
    // res.render('modifica-itinerario', { user: req.user });
    res.send("Lavori in corso...");
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
            res.redirect('/itinerari#itinerari');
        } else {
            res.render('errore');
        }
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

router.get('/:itinerario', async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        // console.log(q);
        const itin = await itinerari.find(q);
        // console.log(itin.docs[0]);
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
        // console.log(q1);
        const itin = await itinerari.find(q1);
        // console.log(itin.docs[0]);
        if (itin.docs.length == 0) {
            res.render('errore');
        } else {
            const q2 = {
                selector: {
                    _id: { "$eq": req.user.emails[0].value }
                }
            };
            const utente = await utenti.find(q2);
            // console.log(utente.docs);

            if (utente.docs[0].metodo == 'F') {
                res.render('erroreCalendar');
            } else if (utente.docs[0].metodo == 'G') {
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
                    // location: itin.docs[0].tappe[0].url.replace("https://google.com/search?q=", ""),
                    location: "https://localhost/itinerari/" + req.params.itinerario,
                    // description: itin.docs[0].descrizione,
                    description: "Itinerario creato da " + utente.docs[0].nomeCompleto + " con TravelUp!",
                    colorId: 7,
                    start: {
                        // date: itin.docs[0].tappe[0].data,
                        dateTime: itin.docs[0].tappe[0].data + "T00:00:00",
                        timeZone: 'Europe/Rome',
                    },
                    end: {
                        // date: itin.docs[0].tappe[itin.docs[0].tappe.length - 1].data,
                        dateTime: itin.docs[0].tappe[itin.docs[0].tappe.length - 1].data + "T23:59:59",
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

// handling errori in caso di pagine non esistenti
router.get('/:sconosciuto', (req, res) => {
    res.render('errore');
});

router.get('/nuovo/:sconosciuto', (req, res) => {
    res.render('errore');
});

router.get('/:itinerario/:sconosciuto', (req, res) => {
    res.render('errore');
});

module.exports = router;
