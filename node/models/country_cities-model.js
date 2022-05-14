// Per ogni database da cachare creare due files (nomedb-model.js e nomedb-model-cache.js). Il primo server per scrivere (direttamente sul db) mentre il secondo serve per leggere e passa per il servizio di caching di nginx.
// Per comandi tipo get/find (per ottenere dal/cercare nel db) si utilizza il caching mentre per scrivere si utilizza il db direttamente.
// Ci sono alcune eccezioni (come per utenti ed itinerari) che leggono direttamente dal db, in questi casi basta creare il file ""...-model.js".
// Se serve solo la lettura (come per country_cities o per il risultato della chiamata API ai luoghi di una città) basta creare il file ""...-cache.js".
// Diagramma di riferimento: https://miro.medium.com/max/1018/1*v3c9wzMdIKrp_wJhOCJEBw.png

const nano = require('nano')(process.env.COUCHDB_URL);

const country_cities = nano.use('country_cities');

module.exports = country_cities;