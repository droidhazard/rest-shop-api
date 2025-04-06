const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number,
});

// exports.Product = mongoose.model("Product", productSchema);
module.exports = mongoose.model("Product", productSchema);
