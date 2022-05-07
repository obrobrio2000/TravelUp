const router = require('express').Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/error'
    })
);

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
);

router.get('/facebook',
    passport.authenticate('facebook')
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/error'
    })
);

module.exports = router;

