const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/user-model');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

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
            console.log("########## FACEBOOK ##########");
            console.log(profile);
        });
        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        return cb(null, profile);
        // new User({
        //     username: profile.displayName,
        //     facebookId: profile.id
        // }).save().then(user => {
        //     return cb(null, user);
        // }).catch(err => {
        //     console.log(err);
        // }
        // );
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},
    function (accessToken, refreshToken, profile, cb) {
        process.nextTick(function () {
            console.log("########## GOOGLE ##########");
            console.log(profile);
        });
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        return cb(null, profile);
        // new User({
        //     username: profile.displayName,
        //     googleId: profile.id
        // }).save().then(user => {
        //     return cb(null, user);
        // }).catch(err => {
        //     console.log(err);
        // }
        // );
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