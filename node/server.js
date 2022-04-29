// @ts-check

const { Client } = require("pg");
const express = require("express");
const app = express();
const port = 8080;

const client = new Client({
  password: "postgres",
  user: "postgres",
  host: "postgres",
});

app.use(express.static("public"));

app.get("/contributors", async (req, res) => {
  const results = await client
    .query("SELECT * FROM contributors")
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

(async () => {
  await client.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
