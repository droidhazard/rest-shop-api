const Category = require("../models/category.js");
const Product = require("../models/product.js");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authJwt = require("../helpers/jwt.js");

// const getProducts = router.get("/");

// const createProduct = router.post("/");

router.get(`/`, authJwt(), async (req, res) => {
  // const productsList = await Product.find().select("name image -_id");
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productsList = await Product.find(filter).populate("category");
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

router.put("/:id", async (req, res) => {
  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (isValidId) {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ message: "invalid object id" });
  }
});

router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      res.send(deletedProduct);
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  res.send({ count: productCount });
  console.log(productCount);
});

router.get("/get/featured/:limit", async (req, res) => {
  const limit = req.params.limit || 3;
  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    +limit
  );
  if (featuredProducts) {
    res.send(featuredProducts);
  } else {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
