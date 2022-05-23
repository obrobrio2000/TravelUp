<<<<<<< HEAD
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
||||||| merged common ancestors
// const { Client } = require("pg");
// const express = require("express");
// const app = express();
// const port = 8080;

// const client = new Client({
//   password: "postgres",
//   user: "postgres",
//   host: "postgres",
// });

// app.use(express.static("public"));

// // Da riabilitare quando sarà tutto pronto
// // (per ora li usiamo tramite CDN così funziona liveserver su vscode):
// // app.use(express.static("node_modules/bootstrap/dist"));
// // app.use(express.static("node_modules/jquery/dist"));
// // app.use(express.static("node_modules/@fortawesome/fontawesome-free"));

// app.get("/contributors", async (req, res) => {
//   const results = await client
//     .query("SELECT * FROM contributors")
//     .then((payload) => {
//       return payload.rows;
//     })
//     .catch(() => {
//       throw new Error("Query failed");
//     });
//   res.setHeader("Content-Type", "application/json");
//   res.status(200);
//   res.send(JSON.stringify(results));
// });

// (async () => {
//   await client.connect();

//   app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
//   });
// })();





const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

const port = 8080;

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// function googleOnSignIn(googleUser) {
//   // Useful data for your client-side scripts:
//   var profile = googleUser.getBasicProfile();
//   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//   console.log('Full Name: ' + profile.getName());
//   console.log('Given Name: ' + profile.getGivenName());
//   console.log('Family Name: ' + profile.getFamilyName());
//   console.log("Image URL: " + profile.getImageUrl());
//   console.log("Email: " + profile.getEmail());

//   // The ID token you need to pass to your backend:
//   var id_token = googleUser.getAuthResponse().id_token;
//   console.log("ID Token: " + id_token);
// }

// function googleSignOut() {
//   var auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut().then(function () {
//     console.log('User signed out.');
//   });
// }

app.use(session({ secret: process.env.SESSIONSECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Authenticate with Google</a><br><a href="/auth/facebook">Authenticate with Facebook</a>');
// });

// Google auth

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile', 'openid'] }
  ));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  })
);

// Facebook auth

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName} - ${req.user.emails[0].value}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/auth/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

(async () => {
  // await client.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();


=======
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

// socket.io
app.get('/js/socket.io.min.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.min.js');
});

app.listen(port, () => {
    console.log(`Server in ascolto sull'indirizzo http://localhost:${port}`);
});
>>>>>>> 59d7ff3d5d97ec0753b099ea716323208025fced
