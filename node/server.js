// const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/dashboard-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
// const cookieSession = require('cookie-session');
// usare cookieSession quando non si usa alcun DB nel backend, express-session altrimenti
require('dotenv').config();

const port = 8080;

const app = express();

// function isLoggedIn(req, res, next) {
//     req.user ? next() : res.sendStatus(401);
// }

app.set('view engine', 'ejs');

// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.SESSIONSECRET]
// }));

app.use(session({ secret: process.env.SESSIONSECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect(process.env.MONGODB_URI, () => {
//     console.log('Connected to database');
// });

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => {
//     console.log('connected to database ;)')
// })

app.use(express.static(__dirname + '/public'));

app.use('/auth', authRoutes);
app.use('/dashboard', profileRoutes);

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

const authCheck = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

app.get('/login', authCheck, (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    // res.render('logout');
    res.redirect('/');
});

app.get('/error', (req, res) => {
    res.render('error');
});

// app.get('/dashboard', isLoggedIn, (req, res) => {
//     res.send(`Hello ${req.user} - ${req.user.displayName} - ${req.user.emails[0].value} - ${req.user._json.email}`);
// });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});