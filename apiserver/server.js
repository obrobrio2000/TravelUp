const express = require('express');

const port = 1717;

const app = express();

app.listen(port, () => {
    console.log(`Server in ascolto sull'indirizzo http://localhost:${port}`);
});