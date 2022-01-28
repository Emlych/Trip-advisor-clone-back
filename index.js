const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

//Package mailgun-js
const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
});

const app = express();
app.use(cors());
app.use(formidable());

app.post("/form", (req, res) => {
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "lagreouemily@gmail.com",
    subject: "Hello",
    text: `${req.fields.message}`,
  };
  mailgun.messages().send(data, (error, body) => {
    if (error === undefined) {
      res.json({ message: "Mail sent", body: body });
    } else {
      res.json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(process.eventNames.PORT, () => {
  console.log("Server has started.");
});
