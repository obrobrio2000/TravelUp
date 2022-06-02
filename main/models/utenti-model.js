const nano = require('nano')(process.env.COUCHDB_URL);
const nanoCache = require('nano')(process.env.COUCHDB_URL_CACHE);

const utenti = nano.use('utenti');
const utentiCache = nanoCache.use('utenti');

module.exports = utenti;