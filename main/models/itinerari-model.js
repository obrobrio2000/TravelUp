const nano = require('nano')(process.env.COUCHDB_URL);

const itinerari = nano.use('itinerari');

module.exports = itinerari;