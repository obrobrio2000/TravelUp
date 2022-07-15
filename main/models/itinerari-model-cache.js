const nano = require('nano')(process.env.COUCHDB_URL_CACHE);

const itinerariCache = nano.use('itinerari');

module.exports = itinerariCache;