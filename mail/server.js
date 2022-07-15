require('dotenv').config();
const express = require('express');
const nodemailer = require("nodemailer");
const axios = require('axios');
const url = require('url').URL;

if ((process.env.NODE_ENV || '').trim() !== 'test') {
  var { io } = require("socket.io-client");
  var socket = io(process.env.WS_BACKEND_URL);

  socket.on("connect", () => {
    socket.emit('room', { room_name: 'mail' });
  })

  socket.on("benvenuto", (data) => {
    console.log('richiesta ricevuta dal server per benvenuto')
    emailUtente = data.emailUtente;
    socketid = data.socketid;
    sendMail(emailUtente, "benvenuto", socketid);
  });

  socket.on("newsletterYes", (data) => {
    console.log('richiesta ricevuta dal server per newsletterYes')
    emailUtente = data.emailUtente;
    socketid = data.socketid;
    sendMail(emailUtente, "newsletterYes", socketid);
  });

  socket.on("newsletterNo", (data) => {
    console.log('richiesta ricevuta dal server per newsletterNo')
    emailUtente = data.emailUtente;
    socketid = data.socketid;
    sendMail(emailUtente, "newsletterNo", socketid);
  });

  socket.on("addio", (data) => {
    console.log('richiesta ricevuta dal server per addio')
    emailUtente = data.emailUtente;
    socketid = data.socketid;
    sendMail(emailUtente, "addio", socketid);
  });
}

var sendMail = async function sendMail(emailUtente, tipo, socketid) {
  try {
    let transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      }
    });

    switch (tipo) {
      case "benvenuto": {
        let info = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: emailUtente,
          subject: "Benvenuto su TravelUp",
          html: "Ti ringraziamo per esserti registrato su TravelUp! 😃\n\nOra potrai creare tantissimi itinerari nelle città di tuo interesse.\n\nInizia subito <a href='https://localhost/itinerari'>qui</a> o visitando la pagina <a href='https://localhost/itinerari'>https://localhost/itinerari</a>.\n\nCordiali saluti,\n\nTravelUp",
        });
        console.log("Messaggio di benvenuto inviato: %s", info.messageId);
        break;
      }
      case "accesso": {
        let info = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: emailUtente,
          subject: "Accesso su TravelUp",
          html: "Hai appena effettuato l'accesso su TravelUp! 😃<br><br>Se non sei stato tu, contatta lo staff di TravelUp <a href='https://localhost#contatti'>qui</a> o all'indirizzo <a href='mailto:travelupinc@gmail.com'>travelupinc@gmail.com</a>.<br><br>Cordiali saluti,<br><br>TravelUp",
        });
        console.log("Messaggio di accesso inviato: %s", info.messageId);
        break;
      }
      case "newsletterYes": {
        let info = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: emailUtente,
          subject: "Iscrizione alla newsletter di TravelUp",
          html: "Grazie per esserti iscritto alla newsletter di TravelUp! 😃<br><br>D'ora in poi riceverai delle email periodiche riguardanti itinerari che ti potrebbero interessare e novità varie di TravelUp.<br><br>Se non sei stato tu, contatta lo staff di TravelUp <a href='https://localhost#contatti'>qui</a> o all'indirizzo <a href='mailto:travelupinc@gmail.com'>travelupinc@gmail.com</a>.<br><br>Cordiali saluti,<br><br>TravelUp",
        });
        console.log("Messaggio di iscrizione alla newsletter inviato: %s", info.messageId);
        break;
      }
      case "newsletterNo": {
        let info = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: emailUtente,
          subject: "Disiscrizione dalla newsletter di TravelUp",
          html: "Ti sei disiscritto dalla newsletter di TravelUp... 😞<br><br>D'ora in poi non riceverai più email periodiche da TravelUp, ma continuerai comunque a ricevere email importanti riguardanti il tuo account.<br><br>Se non sei stato tu, contatta lo staff di TravelUp <a href='https://localhost#contatti'>qui</a> o all'indirizzo <a href='mailto:travelupinc@gmail.com'>travelupinc@gmail.com</a>.<br><br>Cordiali saluti,<br><br>TravelUp",
        });
        console.log("Messaggio di disiscrizione dalla newsletter inviato: %s", info.messageId);
        break;
      }
      case "addio": {
        let info = await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: emailUtente,
          subject: "Ci mancherai...",
          html: "Hai eliminato il tuo account di TravelUp.<br><br>Tutti i tuoi dati sono stati eliminati dai nostri server, nel rispetto del Diritto all'oblio (Art. 17 del GDPR).<br><br>Speriamo non sia una scelta definitiva e contiamo di rivederti presto... 😭<br><br>Se non sei stato tu, contatta lo staff di TravelUp <a href='https://localhost#contatti'>qui</a> o all'indirizzo <a href='mailto:travelupinc@gmail.com'>travelupinc@gmail.com</a>.<br><br>Cordiali saluti,<br><br>TravelUp",
        });
        console.log("Messaggio di addio inviato: %s", info.messageId);
        break;
      }
      default: {
        if ((process.env.NODE_ENV || '').trim() !== 'test') {
          io.to(socketid).emit('Errore');
        }
      }
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

const port = 465;
const app = express();

if ((process.env.NODE_ENV || '').trim() !== 'test') {
  app.listen(port, () => {
    console.log(`Server mail in ascolto sull'indirizzo http://localhost:${port}`);
  });
}

module.exports = {
  app,
  sendMail
}
