const nano = require('nano')(process.env.COUCHDB_URL);

const utenti = nano.use('utenti');
const itinerari = nano.use('itinerari');

module.exports = utenti;
module.exports = itinerari;