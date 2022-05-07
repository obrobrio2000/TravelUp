const router = require('express').Router();
const passport = require('passport');

const authCheck = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', authCheck, (req, res) => {
    // res.send('La tua dashboard' + req.user.username);
    // res.send(`Hello ${req.user} - ${req.user.displayName} - ${req.user.emails[0].value} - ${req.user._json.email}`);
    res.render('dashboard', { user: req.user });
});

module.exports = router;