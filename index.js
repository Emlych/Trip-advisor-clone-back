const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());

//Package mailgun-js
const mailgun = require("mailgun-js")({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN,
});

app.post("/form", (req, res) => {
  try {
    const data = {
      from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
      to: process.env.MAIL,
      subject: "Hello",
      text: `${req.fields.message}`,
    };
    mailgun.messages().send(data, (error, body) => {
      if (error === undefined) {
        res.json({ message: "Mail sent", body: body });
      } else {
        res.status(400).json(error);
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started.");
});
