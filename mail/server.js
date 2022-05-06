const nodemailer = require("nodemailer");
require('dotenv').config();

async function main() {
  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
    user: process.env.GMAIL_EMAIL,
		pass: process.env.GMAIL_PASSWORD // generare una app password nelle impostazioni dell'account google
		// https://myaccount.google.com/apppasswords
	}
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

main().catch(console.error);
