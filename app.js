const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const connection = require("./config/db.config");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({
    title: "DUC Chat System",
    version: "1.0.0",
  });
});

app.get("/forms", (req, res) => {
  connection.query(`SELECT * FROM form`, (err, result) => {
    res.send(result);
  });
});

app.post("/forms", (req, res) => {
  connection.query(
    `SELECT * FROM form WHERE phone = '${req.body.phone}'`,
    (phoneErr, phoneResult) => {
      if (phoneResult.length > 0) {
        if (req.body.degree == null) {
          req.body.degree = 0;
        }
        connection.query(
          `UPDATE form SET ? WHERE phone = '${req.body.phone}'`,
          req.body,
          (updateErr, updateResult) => {
            if (updateErr) {
              console.log(updateErr);
            }
            res.send(updateResult);
          },
        );
      } else {
        connection.query(`INSERT INTO form SET ?`, req.body, (err, result) => {
          if (err) {
            console.log(err);
          }
          res.send(result);
        });
      }
    },
  );
});

server.listen(process.env.PORT, () => {
  console.log("listening on *:" + process.env.PORT);
});
