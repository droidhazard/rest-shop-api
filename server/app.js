const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL;

app.get(`${API_URL}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "hair dresser",
    image: "some_url",
  };
  res.send(product);
});

app.post(`${API_URL}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connected to Database successfully");
  })
  .catch((err) => {
    console.log("Failed to connect to database: ", err.message);
  });

app.listen(5000, () => {
  console.log("Server running on port: ", PORT);
});
