const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
require("dotenv").config();
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

app.listen(5000, () => {
  console.log("Server running on port: ", PORT);
});
