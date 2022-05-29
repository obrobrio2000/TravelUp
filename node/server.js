require('dotenv').config();
const express = require('express');
const session = require('cookie-session');
const utenti = require('./models/utenti-model');
const itinerari = require('./models/itinerari-model');
const authRoutes = require('./routes/auth-routes');
const itinerariRoutes = require('./routes/itinerari-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const port = 8080;

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    maxAge: 1000 * 60 * 60 * 24 * 7,
    keys: [process.env.SESSIONSECRET]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/auth', authRoutes);
app.use('/itinerari', itinerariRoutes);

app.get('/', async (req, res) => {
    try {
        const q = {
            selector: {
                creatore: { "$eq": "TravelUp" }
            }
        };
        const itin = await itinerari.find(q);
        // console.log(itin.docs);
        // console.log(itin.docs.length);
        res.render('index', { itin: itin.docs, user: req.user });
    } catch (err) {
        console.log(err);
        res.render('errore');
    }
});

app.get('/index.html', (req, res) => {
    res.redirect('/');
});

const authCheck = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/itinerari');
    }
}

app.get('/login', authCheck, (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
}
);

// handling errori in caso di pagine non esistenti
app.get('/:qualcosaDiInesistente', (req, res) => {
    res.render('errore');
});

// bootstrap
app.get('/css/bootstrap.min.css', function (req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});
app.get('/js/bootstrap.bundle.min.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
});

// aos
app.get('/css/aos.css', function (req, res) {
    res.sendFile(__dirname + '/node_modules/aos/dist/aos.css');
});
app.get('/js/aos.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/aos/dist/aos.js');
});

// jquery
app.get('/js/jquery.min.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

// fontawesome
app.get('/css/all.min.css', function (req, res) {
    res.sendFile(__dirname + '/node_modules/@fortawesome/fontawesome-free/css/all.min.css');
});

// socket.io
app.get('/js/socket.io.min.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.min.js');
});

// polyfill.io
app.get('/js/polyfill.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/abort-controller/polyfill.js');
});

app.listen(port, () => {
    console.log(`Server principale in ascolto sull'indirizzo http://localhost:${port}`);
});



// Richiesta API TravelUp utente ed i suoi itinerari
app.get('/api/utenti/:utente', async (req, res) => {
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
app.get('/api/itinerari/:itinerario', async (req, res) => {
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