require('dotenv').config();
const axios = require('axios');
const supertest = require('supertest');
var app = require('./server');
var request = supertest(app);
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { sendMail } = require('./server-mail');
const { getCultura, getFood, getUtilities, getIntrattenimento, getSearch, getImmagini } = require('./server-api');

describe("Server principale", function () {
    describe("Raggiungibilità", function () {
        it("Deve ritornare 200", function (done) {
            request.get('http://main:8080/')
                .then(function (response) {
                    expect(response.status).toBe(200);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        })
    }
    );
    describe('Funzionamento pagine principali', () => {
        describe('GET /', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/')
                    .expect(200, done);
            });
        }
        );
        describe('GET /login', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/login')
                    .expect(200, done);
            });
        }
        );
        describe('GET /logout', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/logout')
                    .expect(302, done);
            });
        }
        );
        describe('GET /api', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/api')
                    .expect(200, done);
            });
        }
        );
        describe('GET /error', () => {
            it('Deve ritornare 404', (done) => {
                request.get('/unknown')
                    .expect(404, done);
            });
        }
        );
    });
    describe('Funzionamento API proprietarie/interne', () => {
        describe('GET utente di test', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/api/utenti/test@test.com?apikey=1234567890')
                    .expect(200, done);
            }
            );
        }
        );
        describe('GET itinerario di test', () => {
            it('Deve ritornare 200 OK', (done) => {
                request.get('/api/itinerari/itinerarioTest?apikey=1234567890')
                    .expect(200, done);
            }
            );
        }
        );
    });
});

describe("Server mail", function () {
    describe("Raggiungibilità", function () {
        it("Deve ritornare 404", function (done) {
            request.get('http://mail:465/')
                .then(function (response) {
                    expect(response.status).toBe(404);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        })
    }
    );
    describe("Funzionamento invio e-mail", function () {
        const emailAddress = process.env.GMAIL_EMAIL;
        it("Deve inviare una email di benvenuto a " + emailAddress, function (done) {
            request = supertest(sendMail);
            sendMail(emailAddress, "benvenuto", "123456789").then(() => {
                done();
            }
            ).catch(() => {
                done();
            }
            );
        }
        );
    });
});

describe("Server API esterne", function () {
    describe("Raggiungibilità", function () {
        it("Deve ritornare 404", function (done) {
            request.get('http://api:1515/')
                .then(function (response) {
                    expect(response.status).toBe(404);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        });
    }
    );
    describe("Funzionamento chiamate OpenTripMap API", function () {
        it("Deve richiedere i luoghi della categoria Cultura", function (done) {
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
        it("Deve richiedere i luoghi della categoria Ristoro", function (done) {
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
        it("Deve richiedere i luoghi della categoria Servizi", function (done) {
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
        it("Deve richiedere i luoghi della categoria Svago", function (done) {
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
        it("Deve richiedere i risultati della ricerca", function (done) {
            request = supertest(getSearch);
            getSearch(["Colosseo", "Fontana di Trevi"], "roma", "123456789")
            done();
        }
        );
    });
    describe("Funzionamento chiamate Google Custom Search API", function () {
        it("Deve richiedere le immagini per le tappe dell'itinerario", function (done) {
            request = supertest(getImmagini);
            getImmagini("Itinerario di test", "test@test.com", [{ nome: "parco di Villa Trabia", data: "2022-06-04", url: "https://google.com/search?q=parco di Villa Trabia Palermo", lat: "38.12824630737305", lon: " 13.346321105957031" }, { nome: "Villa Zito", data: "2022-06-04", url: "https://google.com/search?q=Villa Zito Palermo", lat: "38.13447570800781", lon: " 13.349108695983887" }, { nome: "Antica Focacceria San Francesco", data: "2022-06-04", url: "https://google.com/search?q=Antica Focacceria San Francesco Palermo", lat: "38.1163330078125", lon: " 13.366144180297852" }], "123456789")
            done();
        }
        );
    });
});

describe("Server Socket.IO", function () {
    describe("Raggiungibilità", function () {
        it("Deve ritornare 404", function (done) {
            request.get('http://ws:1337/')
                .then(function (response) {
                    expect(response.status).toBe(404);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        })
    }
    );
    describe("Funzionamento Socket.IO", () => {
        let io, serverSocket, clientSocket;

        beforeAll((done) => {
            const httpServer = createServer();
            io = new Server(httpServer);
            httpServer.listen(() => {
                const port = httpServer.address().port;
                clientSocket = new Client(`http://localhost:${port}`);
                io.on("connection", (socket) => {
                    serverSocket = socket;
                });
                clientSocket.on("connect", done);
            });
        });

        afterAll(() => {
            io.close();
            clientSocket.close();
        });

        test("Senza ack: deve funzionare", (done) => {
            clientSocket.on("hello", (arg) => {
                expect(arg).toBe("world");
                done();
            });
            serverSocket.emit("hello", "world");
        });

        test("Con ack: deve funzionare", (done) => {
            serverSocket.on("hi", (cb) => {
                cb("hola");
            });
            clientSocket.emit("hi", (arg) => {
                expect(arg).toBe("hola");
                done();
            });
        });
    });
});

describe("Server database CouchDB", function () {
    describe("Raggiungibilità", function () {
        it("Deve ritornare 200 OK", function (done) {
            request.get('http://couchdb:5984/')
                .then(function (response) {
                    expect(response.status).toBe(200);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        })
    }
    );
    describe("Creazione database", function () {
        it("Deve ritornare 201", function (done) {
            request.put('http://couchdb:5984/test')
                .then(function (response) {
                    expect(response.status).toBe(201);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        }
        );
    }
    );
    describe("Scrittura sul database", function () {
        it("Deve ritornare 201", function (done) {
            request.post('http://couchdb:5984/test/test')
                .then(function (response) {
                    expect(response.status).toBe(201);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        }
        );
    }
    );
    describe("Lettura dal database", function () {
        it("Deve ritornare 201", function (done) {
            request.get('http://couchdb:5984/test/test')
                .then(function (response) {
                    expect(response.status).toBe(200);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        }
        );
    }
    );
    describe("Cancellazione dal database", function () {
        it("Deve ritornare 201", function (done) {
            request.del('http://couchdb:5984/test/test')
                .then(function (response) {
                    expect(response.status).toBe(200);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        }
        );
    }
    );
    describe("Eliminazione database", function () {
        it("Deve ritornare 201", function (done) {
            request.del('http://couchdb:5984/test')
                .then(function (response) {
                    expect(response.status).toBe(200);
                    done();
                }
                ).catch(function (error) {
                    done();
                }
                );
        }
        );
    }
    );
});

describe("Server web Nginx", function () {
    describe("Raggiungibilità", function () {
        describe('HTTP', () => {
            it("Deve ritornare 200 OK", function (done) {
                request.get('http://nginx:80/')
                    .then(function (response) {
                        expect(response.status).toBe(200);
                        done();
                    }
                    ).catch(function (error) {
                        done();
                    }
                    );
            })
        }
        );
        describe('HTTPS', () => {
            it("Deve ritornare 200 OK", function (done) {
                request.get('https://nginx:443/')
                    .then(function (response) {
                        expect(response.status).toBe(200);
                        done();
                    }
                    ).catch(function (error) {
                        done();
                    }
                    );
            })
        }
        );
        describe('Cache database', () => {
            it("Deve ritornare 200 OK", function (done) {
                request.get('http://nginx:4984/')
                    .then(function (response) {
                        expect(response.status).toBe(200);
                        done();
                    }
                    ).catch(function (error) {
                        done();
                    }
                    );
            })
        }
        );
    });
}
);
