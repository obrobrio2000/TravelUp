require('dotenv').config();
const supertest = require('supertest');
const app = require('./server');
const request = supertest(app);

describe("Raggiungibilità server principale", function () {
    it("Dovrebbe ritornare 200", function (done) {
        request.get('localhost:8080')
            .expect(200, done);
    })
});

describe('GET / (Funzionamento homepage)', () => {
    it('Dovrebbe ritornare 200 OK', (done) => {
        request.get('/')
            .expect(200, done);
    });
}
);

describe('GET /login (Funzionamento pagina login)', () => {
    it('Dovrebbe ritornare 200 OK', (done) => {
        request.get('/login')
            .expect(200, done);
    });
}
);

describe('GET /logout (Funzionamento logout)', () => {
    it('Dovrebbe ritornare 302 Found', (done) => {
        request.get('/logout')
            .expect(302, done);
    });
}
);

describe('GET /api (Funzionamento pagina documentazione API)', () => {
    it('Dovrebbe ritornare 200 OK', (done) => {
        request.get('/api/')
            .expect(200, done);
    });
}
);
