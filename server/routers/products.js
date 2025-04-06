const Product = require("../models/product.js");
const express = require("express");
const router = express.Router();

// const getProducts = router.get("/");

// const createProduct = router.post("/");

router.get(`/`, async (req, res) => {
  const productsList = await Product.find();
  if (!productsList) {
    res.status(500).json({ success: false });
  }
  res.send(productsList);
});

router.post(`/`, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  await product.save();
  res.status(201).json(product);
});

module.exports = router;
