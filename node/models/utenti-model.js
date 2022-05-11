const nano = require('nano')(process.env.COUCHDB_URL);

const utenti = nano.use('utenti');

module.exports = utenti;