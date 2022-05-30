const express = require('express');
const router = express.Router();

// bootstrap
router.get('/css/bootstrap.min.css', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/bootstrap/dist/css/bootstrap.min.css');
});
router.get('/js/bootstrap.bundle.min.js', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
});

// aos
router.get('/css/aos.css', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/aos/dist/aos.css');
});
router.get('/js/aos.js', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/aos/dist/aos.js');
});

// jquery
router.get('/js/jquery.min.js', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/jquery/dist/jquery.min.js');
});

// fontawesome
router.get('/css/all.min.css', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/@fortawesome/fontawesome-free/css/all.min.css');
});

// socket.io
router.get('/js/socket.io.min.js', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/socket.io-client/dist/socket.io.min.js');
});

// polyfill.io
router.get('/js/polyfill.js', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/abort-controller/polyfill.js');
});

// prism
router.get('/css/prism.min.css', function (req, res) {
    res.sendFile('/usr/src/app/node_modules/prismjs/themes/prism.min.css');
});

module.exports = router;