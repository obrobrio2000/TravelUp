const nano = require('nano')(process.env.COUCHDB_URL);
const nanoCache = require('nano')(process.env.COUCHDB_URL_CACHE);

const itinerari = nano.use('itinerari');
const itinerariCache = nanoCache.use('itinerari');

module.exports = itinerari;