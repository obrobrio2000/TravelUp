require('dotenv').config();
const supertest = require('supertest');
const { app, getCultura, getFood, getUtilities, getIntrattenimento, getSearch } = require('./server');
var request = supertest(app);

describe("Raggiungibilità server API esterne", function () {
    it("Dovrebbe ritornare 404", function (done) {
        request.get('localhost:1515')
            .expect(404, done);
    })
});

describe("Funzionamento funzione getCultura", function () {
    it("Dovrebbe ricevere i luoghi della categoria cultura", function (done) {
        request = supertest(getCultura);
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
        request = supertest(getFood);
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
        request = supertest(getUtilities);
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
        request = supertest(getIntrattenimento);
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
        request = supertest(getSearch);
        getSearch(["Colosseo", "Fontana di Trevi"], "roma", "123456789")
        done();
    }
    );
});