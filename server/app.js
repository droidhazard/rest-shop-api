const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productsRouter = require("./routers/products");
// import { getProducts, createProduct } from "./routers/products.js";

require("dotenv").config();

app.use(bodyParser.json());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL;

app.use(`${API_URL}/products`, productsRouter);

// app.get(`${API_URL}/products`, getProducts);

// app.post(`${API_URL}/products`, createProduct);

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
