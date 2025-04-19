const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
// import { getProducts, createProduct } from "./routers/products.js";

// Middlewares 1
app.use(bodyParser.json());

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL;

// Routes
const productsRoutes = require("./routers/products");
const categoriesRoutes = require("./routers/categories");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

app.use(`${API_URL}/products`, productsRoutes);
app.use(`${API_URL}/categories`, categoriesRoutes);
app.use(`${API_URL}/users`, usersRoutes);
app.use(`${API_URL}/orders`, ordersRoutes);

// Middlewares 2
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
// app.use(authJwt);

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

// END
