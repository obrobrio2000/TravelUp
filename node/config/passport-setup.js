require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const nano = require('nano')(process.env.COUCHDB_URL);
const utenti = nano.use('utenti');
// const { google } = require('googleapis');
// const { OAuth2Client } = require('google-auth-library');

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
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email', 'email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly']
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

// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URL
// );

// // generate a url that asks permissions for *PRODUCT* (Blogger, Calendar etc.) scopes
// const scopes = [
//     'https://www.googleapis.com/auth/calendar',
//     'https://www.googleapis.com/auth/calendar.events',
//     'https://www.googleapis.com/auth/calendar.readonly'
// ];

// const url = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: 'online',

//     // If you only need one scope you can pass it as a string
//     scope: scopes
// });

// const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// const eventStartTime = new Date();
// eventStartTime.setDate(eventStartTime.getDate() + 1);
// const eventEndTime = new Date(eventStartTime);
// eventEndTime.setDate(eventEndTime.getDate() + 2);
// const event = {
//     'summary': 'Google I/O 2015',
//     'location': '800 Howard St., San Francisco, CA 94103',
//     'description': 'A chance to hear more about Google\'s developer products.',
//     'start': {
//         'dateTime': eventStartTime.toISOString(),
//         'timeZone': 'Europe/Rome'
//     },
//     'end': {
//         'dateTime': eventEndTime.toISOString(),
//         'timeZone': 'Europe/Rome'
//     }
// };

// calendar.freebusy.query({
//     resource: {
//         timeMin: eventStartTime.toISOString(),
//         timeMax: eventEndTime.toISOString(),
//         timeZone: 'Europe/Rome',
//         items: [
//             { id: 'primary' }
//         ]
//     }
// }, (err, res) => {
//     if (err) {
//         console.log('The API returned an error: ' + err);
//         return;
//     }
//     const events = res.data.calendars.primary.busy;
//     console.log(events);
//     if (events.length > 0) {
//         console.log('The following events are currently busy:');
//         events.forEach((event) => {
//             console.log(event.summary);
//         }
//         );
//     } else {
//         console.log('No events are currently busy.');
//         return calendar.events.insert({
//             calendarId: 'primary',
//             resource: event
//         }, (err, event) => {
//             if (err) {
//                 console.log('There was an error contacting the Calendar service: ' + err);
//                 return;
//             }
//             console.log('Event created: %s', event.htmlLink);
//         }
//         );
//     }
// });