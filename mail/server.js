const express = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();

const port = 465;

const app = express();

async function sendMail() {
  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
<<<<<<< HEAD
	host: 'smtp.gmail.com',
	auth: {
    user: process.env.GMAIL_EMAIL, // creare un file .env nella stessa directory di questo file e dichiarare le variabili (es. GMAIL_EMAIL=user@gmail.com) una per riga
		pass: process.env.GMAIL_PASSWORD // generare una app password su https://myaccount.google.com/apppasswords
	}
=======
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD // generare una app password nelle impostazioni dell'account google
      // https://myaccount.google.com/apppasswords
    }
>>>>>>> Sviluppo
  });

  let info = await transporter.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: process.env.GMAIL_RECIPIENT,
    subject: "Ciao ✔",
    text: "Come stai?",
    html: "<b>Spero tutto bene</b>",
  });

  console.log("Messaggio inviato: %s", info.messageId);
}

sendMail().catch(console.error);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});