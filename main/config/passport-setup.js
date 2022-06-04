require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const utenti = require('../models/utenti-model');

if ((process.env.NODE_ENV || '').trim() !== 'test') {
    var { io } = require("socket.io-client");
    var socket = io("http://ws:1337");
    socket.on('connect', () => {
        socket.emit('room', { room_name: 'clients' });
    });
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOSTING_URL + "/auth/google/callback",
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid', 'https://www.googleapis.com/auth/calendar.events']
},
    function (accessToken, refreshToken, profile, cb) {
        // process.nextTick(function () {
        //     console.log(profile);
        // });
        async function createUser() {
            try {
                var doc = await utenti.get(profile.emails[0].value);
                try {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: doc.facebookId, accessToken: accessToken, metodo: "Google", nlConsent: doc.nlConsent, hasReviewed: doc.hasReviewed, newUser: "no", _rev: doc._rev }, profile.emails[0].value);
                    socket.emit('mail', { emailUtente: profile.emails[0].value, target: "accesso" });
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: "null", accessToken: accessToken, metodo: "Google", nlConsent: doc.nlConsent, hasReviewed: doc.hasReviewed, newUser: "no", _rev: doc._rev }, profile.emails[0].value);
                    socket.emit('mail', { emailUtente: profile.emails[0].value, target: "accesso" });
                    return response;
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: "null", accessToken: accessToken, metodo: "Google", nlConsent: "no", hasReviewed: "no", newUser: "yes", }, profile.emails[0].value);
                socket.emit('mail', { emailUtente: profile.emails[0].value, target: "benvenuto" });
                return response;
            }
        }
        createUser().then(function (result) {
            return cb(null, profile);
        }
        ).catch(function (err) {
            console.log(err);
            return cb(err);
        }
        );
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.HOSTING_URL + "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'emails', 'first_name', 'middle_name', 'last_name', 'birthday'],
},
    function (accessToken, refreshToken, profile, cb) {
        // process.nextTick(function () {
        //     console.log(profile);
        // });
        async function createUser() {
            try {
                var doc = await utenti.get(profile.emails[0].value);
                try {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: doc.googleId, facebookId: profile.id, accessToken: accessToken, metodo: "Facebook", nlConsent: doc.nlConsent, hasReviewed: doc.hasReviewed, newUser: "no", _rev: doc._rev }, profile.emails[0].value);
                    socket.emit('mail', { emailUtente: profile.emails[0].value, target: "accesso" });
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: "null", facebookId: profile.id, accessToken: accessToken, metodo: "Facebook", nlConsent: doc.nlConsent, hasReviewed: doc.hasReviewed, newUser: "no", _rev: doc._rev }, profile.emails[0].value);
                    socket.emit('mail', { emailUtente: profile.emails[0].value, target: "accesso" });
                    return response;
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: "null", facebookId: profile.id, accessToken: accessToken, metodo: "Facebook", nlConsent: "no", hasReviewed: "no", newUser: "yes", }, profile.emails[0].value);
                if ((process.env.NODE_ENV || '').trim() !== 'test') {
                    socket.emit('mail', { emailUtente: profile.emails[0].value, target: "benvenuto" });
                }
                return response;
            }
        }
        createUser().then(function (result) {
            return cb(null, profile);
        }
        ).catch(function (err) {
            console.log(err);
            return cb(err);
        }
        );
    }
));