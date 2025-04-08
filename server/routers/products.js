const Category = require("../models/category.js");
const Product = require("../models/product.js");
const express = require("express");
const router = express.Router();

// const getProducts = router.get("/");

// const createProduct = router.post("/");

router.get(`/`, async (req, res) => {
  const productsList = await Product.find().select("name image -_id");
  if (!productsList) {
    res.status(500).json({ success: false });
  }
  res.send(productsList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400).json({ message: "invalid category" });
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.description,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  const newProduct = await product.save();
  if (newProduct) {
    res.status(201).json(product);
  } else {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
