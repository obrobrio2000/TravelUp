const express = require('express');
const router = express.Router();
const utenti = require('../models/utenti-model');
const itinerari = require('../models/itinerari-model');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
// var geoip = require('geoip-lite');

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
    // console.log(geoip.lookup((req.headers['x-forwarded-for'] || req.socket.remoteAddress)));
    try {
        const q1 = {
            selector: {
                _id: { "$eq": req.user.emails[0].value }
            }
        };
        const utente = await utenti.find(q1);
        const q2 = {
            selector: {
                creatore: { "$eq": req.user.emails[0].value }
            }
        };
        const itin = await itinerari.find(q2);
        res.render('itinerari', { itin: itin.docs, utente: utente.docs[0] });
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

router.get('/nuovo', authCheck, async (req, res) => {
    res.render('nuovo-itinerario', { user: req.user });
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
            res.status(404).render('errore');
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

router.get('/:itinerario', async (req, res) => {
    try {
        const q = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerari.find(q);
        if (itin.docs.length == 0) {
            res.status(404).render('errore');
        } else {
            res.render('visualizza-itinerario', { itinerario: itin.docs[0], user: req.user });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('errore');
    }
});

router.get('/:itinerario/aggiungiACalendar', authCheck, async (req, res) => {
    try {
        const q1 = {
            selector: {
                _id: { "$eq": req.params.itinerario }
            }
        };
        const itin = await itinerari.find(q1);
        if (itin.docs.length == 0) {
            res.status(404).render('errore');
        } else {
            const q2 = {
                selector: {
                    _id: { "$eq": req.user.emails[0].value }
                }
            };
            const utente = await utenti.find(q2);
            if (utente.docs[0].metodo == 'Facebook') {
                req.session.returnTo = req.originalUrl;
                res.redirect('/auth/google');
            }
            const oAuth2Client = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
            )

            oAuth2Client.setCredentials({
                access_token: utente.docs[0].accessToken,
            })

            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

            var counterTappe = 1;
            var descrizione = "Itinerario creato da " + utente.docs[0].nomeCompleto + " con TravelUp! 😃\n\nLuoghi da visitare:\n";
            itin.docs[0].tappe.forEach(tappa => {
                if (counterTappe == itin.docs[0].tappe.length) {
                    descrizione += counterTappe + ") " + tappa.nome;
                    return;
                }
                descrizione += counterTappe + ") " + tappa.nome + "\n";
                counterTappe += 1;
            });

            const event = {
                summary: itin.docs[0].nome,
                location: "https://localhost/itinerari/" + req.params.itinerario,
                description: descrizione,
                colorId: 7,
                start: {
                    dateTime: itin.docs[0].tappe[0].data + "T00:00:00",
                    timeZone: 'Europe/Rome',
                },
                end: {
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
    } catch (err) {
        console.log(err);
        req.session.returnTo = req.originalUrl;
        res.redirect('/auth/google');
    }
});

module.exports = router;
