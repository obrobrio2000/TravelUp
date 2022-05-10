require('dotenv').config();
const express = require('express');
const session = require('cookie-session');
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
        console.log(itin.docs);
        console.log(itin.docs.length);
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

app.get('/errore', (req, res) => {
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});