const nano = require('nano')(process.env.COUCHDB_URL);

const logging_api = nano.use('logging_api');

module.exports = logging_api;