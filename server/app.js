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

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number,
});

const Product = mongoose.model("Product", productSchema);

app.get(`${API_URL}/products`, async (req, res) => {
  const productsList = await Product.find();
  if (!productsList) {
    res.status(500).json({ success: false });
  }
  res.send(productsList);
});

app.post(`${API_URL}/products`, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  await product.save();
  res.status(201).json(product);
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
