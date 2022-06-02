const nano = require('nano')(process.env.COUCHDB_URL_CACHE);

const utentiCache = nano.use('utenti');

module.exports = utentiCache;