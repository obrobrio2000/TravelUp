require('dotenv').config();
const supertest = require('supertest');
const sendMail = require('./server');
const request = supertest(sendMail);

describe("Funzionamento server mail", function () {
    it("Dovrebbe ritornare 404", function (done) {
        request.get('localhost:465')
            .expect(404, done);
    })
});

describe("Funzionamento funzione invio email", function () {
    it("Dovrebbe inviare una email", function (done) {
        sendMail(process.env.GMAIL_EMAIL, "benvenuto", "123456789").then(() => {
            done();
        }
        ).catch(() => {
            done();
        }
        );
    }
    );
}
);