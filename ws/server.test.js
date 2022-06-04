require('dotenv').config();
const supertest = require('supertest');
const app = require('./server');
const request = supertest(app);

describe("Raggiungibilità server WebSocket", function () {
    it("Dovrebbe ritornare 404", function (done) {
        request.get('localhost:1337')
            .expect(404, done);
    })
});

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

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

    test("Dovrebbe funzionare", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    test("Dovrebbe funzionare (con ack)", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            expect(arg).toBe("hola");
            done();
        });
    });
});