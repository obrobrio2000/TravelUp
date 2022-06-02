const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google')
);

router.get('/google/callback',
    passport.authenticate('google', {
        successReturnToOrRedirect: '/itinerari',
        failureRedirect: '/errore'
    })
);

router.get('/facebook',
    passport.authenticate('facebook')
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successReturnToOrRedirect: '/itinerari',
        failureRedirect: '/errore'
    })
);

module.exports = router;