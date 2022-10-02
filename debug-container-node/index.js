const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/info", (req, res) => {
  res.json({ version: process.env.COMMIT_ID });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`version : ${process.env.COMMIT_ID}`);
});
