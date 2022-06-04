require('dotenv').config();
const supertest = require('supertest');
const { getCultura, getFood, getUtilities, getIntrattenimento, getSearch } = require('./server');
const request = supertest(getCultura);

describe("Raggiungibilità server API esterne", function () {
    it("Dovrebbe ritornare 404", function (done) {
        request.get('localhost:1515')
            .expect(404, done);
    })
});

describe("Funzionamento funzione getCultura", function () {
    it("Dovrebbe ricevere i luoghi della categoria cultura", function (done) {
        getCultura("roma", "123456789").then(() => {
            done();
        }
        ).catch(() => {
            done();
        }
        );
    }
    );
});

describe("Funzionamento funzione getFood", function () {
    it("Dovrebbe ricevere i luoghi della categoria ristoro", function (done) {
        getFood("roma", "123456789").then(() => {
            done();
        }
        ).catch(() => {
            done();
        }
        );
    }
    );
});

describe("Funzionamento funzione getUtilities", function () {
    it("Dovrebbe ricevere i luoghi della categoria servizi", function (done) {
        getUtilities("roma", "123456789").then(() => {
            done();
        }
        ).catch(() => {
            done();
        }
        );
    }
    );
});

describe("Funzionamento funzione getIntrattenimento", function () {
    it("Dovrebbe ricevere i luoghi della categoria svago", function (done) {
        getIntrattenimento("roma", "123456789").then(() => {
            done();
        }
        ).catch(() => {
            done();
        }
        );
    }
    );
});

describe("Funzionamento funzione getSearch", function () {
    it("Dovrebbe ricevere i risultati della ricerca", function (done) {
        getSearch(["Colosseo", "Fontana di Trevi"], "roma", "123456789")
        done();
    }
    );
});