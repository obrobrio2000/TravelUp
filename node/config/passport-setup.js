require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const utenti = require('../models/user-model');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'emails', 'first_name', 'middle_name', 'last_name', 'birthday'],
},
    function (accessToken, refreshToken, profile, cb) {
        process.nextTick(function () {
            console.log(profile);
        });

        async function createUser() {
            var doc = "";
            try {
                doc = await utenti.get(profile.emails[0].value);
                var googleId = "null";
                try {
                    googleId = doc.googleId;
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: googleId, facebookId: profile.id, accessToken: accessToken, refreshToken: refreshToken, _rev: doc._rev }, profile.emails[0].value);
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: googleId, facebookId: profile.id, accessToken: accessToken, refreshToken: refreshToken, _rev: doc._rev }, profile.emails[0].value);
                    return response;
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: "null", facebookId: profile.id, accessToken: accessToken, refreshToken: refreshToken }, profile.emails[0].value);
                return response;
            }
        }
        createUser().then(function (result) {
            console.log(result);
            return cb(null, profile);
        }
        ).catch(function (err) {
            console.log(err);
            return cb(err);
        }
        );
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},
    function (accessToken, refreshToken, profile, cb) {
        process.nextTick(function () {
            console.log(profile);
        });

        async function createUser() {
            var doc = "";
            try {
                doc = await utenti.get(profile.emails[0].value);
                var facebookId = "null";
                try {
                    facebookId = doc.facebookId;
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: facebookId, accessToken: accessToken, refreshToken: refreshToken, _rev: doc._rev }, profile.emails[0].value);
                    return response;
                } catch (err) {
                    const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: facebookId, accessToken: accessToken, refreshToken: refreshToken, _rev: doc._rev }, profile.emails[0].value);
                    return response;
                    console.error(err)
                }
            } catch (err) {
                const response = await utenti.insert({ nomeCompleto: profile.displayName, nome: profile.name.givenName, cognome: profile.name.familyName, email: profile.emails[0].value, foto: profile.photos[0].value, googleId: profile.id, facebookId: "null", accessToken: accessToken, refreshToken: refreshToken }, profile.emails[0].value);
                return response;
            }
        }
        createUser().then(function (result) {
            console.log(result);
            return cb(null, profile);
        }
        ).catch(function (err) {
            console.log(err);
            return cb(err);
        }
        );
    }
));

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

// generate a url that asks permissions for *PRODUCT* (Blogger, Calendar etc.) scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',

    // If you only need one scope you can pass it as a string
    scope: scopes
});