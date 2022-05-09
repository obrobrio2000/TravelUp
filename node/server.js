require('dotenv').config();
const express = require('express');
const session = require('cookie-session');
const nano = require('nano')(process.env.COUCHDB_URL);
const authRoutes = require('./routes/auth-routes');
const itinerariRoutes = require('./routes/itinerari-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const bodyParser = require('body-parser');

const port = 8080;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    maxAge: 1000 * 60 * 60 * 24 * 7,
    keys: [process.env.SESSIONSECRET]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/auth', authRoutes);
app.use('/itinerari', itinerariRoutes);

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
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

app.get('/error', (req, res) => {
    res.render('error');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});