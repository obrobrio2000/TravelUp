"use strict";
const nodemailer = require("nodemailer");

async function main() {
  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
		user: 'email@gmail.com',
		pass: 'password' // generare una app password nelle impostazioni dell'account google
		// https://myaccount.google.com/apppasswords
		// anche se sono password usa e getta ricordiamoci comunque di cancellarla prima di pushare
		// oppure mettiamo un qualcosa che prende i dati da un file di testo che escludiamo col .gitignore
	}
  });

  let info = await transporter.sendMail({
    from: "email@gmail.com",
    to: "email@studenti.uniroma1.it",
    subject: "Ciao ✔",
    text: "Come stai?",
    html: "<b>Spero tutto bene</b>",
  });

  console.log("Messaggio inviato: %s", info.messageId);
}

main().catch(console.error);
