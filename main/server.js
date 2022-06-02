require('dotenv').config();
const express = require('express');
const app = express();
const session = require('cookie-session');
const cookieParser = require("cookie-parser");
const publicRoutes = require('./routes/public-routes');
const authRoutes = require('./routes/auth-routes');
const itinerariRoutes = require('./routes/itinerari-routes');
const apiRoutes = require('./routes/api-routes');
const mainRoutes = require('./routes/main-routes');
const passport = require('passport');
require('./config/passport-setup');

const port = 8080;

app.set("trust proxy", "127.0.0.1");

app.set('view engine', 'ejs');

app.use(session({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSIONSECRET]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize(), passport.session());

app.use(express.static(__dirname + '/public'), publicRoutes);
app.use('/auth', authRoutes);
app.use('/itinerari', itinerariRoutes);
app.use('/api', apiRoutes);
app.use(mainRoutes);

app.listen(port, () => {
    console.log(`Server principale in ascolto sull'indirizzo http://localhost:${port}`);
});
