require('dotenv').config();
const express = require('express');
const session = require('cookie-session');
const itinerari = require('./models/itinerari-model');
const authRoutes = require('./routes/auth-routes');
const itinerariRoutes = require('./routes/itinerari-routes');
const apiRoutes = require('./routes/api-routes');
const publicRoutes = require('./routes/public-routes');
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
app.use('/api', apiRoutes);
app.use(publicRoutes);

const authCheck = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/itinerari');
    }
}

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
app.get('/:sconosciuto', (req, res) => {
    res.render('errore');
});

app.listen(port, () => {
    console.log(`Server principale in ascolto sull'indirizzo http://localhost:${port}`);
});
