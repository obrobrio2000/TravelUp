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


