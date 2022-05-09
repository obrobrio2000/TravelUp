const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/itinerari',
        failureRedirect: '/error'
    })
);

router.get('/facebook',
    passport.authenticate('facebook')
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/itinerari',
        failureRedirect: '/error'
    })
);

module.exports = router;