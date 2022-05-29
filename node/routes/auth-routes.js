const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google')
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/itinerari',
        failureRedirect: '/errore'
    })
);

router.get('/facebook',
    passport.authenticate('facebook')
);

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/itinerari',
        failureRedirect: '/errore'
    })
);

// handling errori in caso di pagine non esistenti
router.get('/:sconosciuto', (req, res) => {
    res.render('errore');
});

module.exports = router;