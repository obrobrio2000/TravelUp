require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const utenti = require('../models/utenti-model');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOSTING_URL+"/auth/google/callback",
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid', 'https://www.googleapis.com/auth/calendar.events']
},
    function (accessToken, refreshToken, profile, cb) {
        // process.nextTick(function () {
        //     console.log(profile);
        // });
        async function createUser() {
            var doc = "";
            try {
                doc = await utenti.get(profile.emails[0].value);
                var facebookId = "null";
                try {
                    facebookId = doc.facebookId;
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: facebookId, pippo: accessToken, metodo: "G", _rev: doc._rev }, profile.emails[0].value);
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: facebookId, pippo: accessToken, metodo: "G", _rev: doc._rev }, profile.emails[0].value);
                    return response;
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: "null", pippo: accessToken, metodo: "G" }, profile.emails[0].value);
                return response;
            }
        }
        createUser().then(function (result) {
            // console.log(result);
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
    callbackURL: process.env.HOSTING_URL+"/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'emails', 'first_name', 'middle_name', 'last_name', 'birthday'],
},
    function (accessToken, refreshToken, profile, cb) {
        // process.nextTick(function () {
        //     console.log(profile);
        // });
        async function createUser() {
            var doc = "";
            try {
                doc = await utenti.get(profile.emails[0].value);
                var googleId = "null";
                try {
                    googleId = doc.googleId;
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: googleId, facebookId: profile.id, pippo: accessToken, metodo: "F", _rev: doc._rev }, profile.emails[0].value);
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: googleId, facebookId: profile.id, pippo: accessToken, metodo: "F", _rev: doc._rev }, profile.emails[0].value);
                    return response;
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: "null", facebookId: profile.id, pippo: accessToken, metodo: "F" }, profile.emails[0].value);
                return response;
            }
        }
        createUser().then(function (result) {
            // console.log(result);
            return cb(null, profile);
        }
        ).catch(function (err) {
            console.log(err);
            return cb(err);
        }
        );
    }
));