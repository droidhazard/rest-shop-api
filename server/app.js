const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
// import { getProducts, createProduct } from "./routers/products.js";

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL;

// Middle ware
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Routes
const productsRoutes = require("./routers/products");
const categoriesRoutes = require("./routers/categories");

app.use(`${API_URL}/products`, productsRoutes);
app.use(`${API_URL}/categories`, categoriesRoutes);

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
