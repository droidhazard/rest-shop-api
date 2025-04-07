const Category = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  } else {
    res.send(categoryList);
  }
});

router.post("/", async (req, res) => {
  let newCategory = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  let category = await newCategory.save();
  if (!category) {
    res.status(500).json({ sucesss: false });
  } else {
    res.send(category);
  }
});

router.delete("/:id", (req, res) => {
  const categoryId = req.params.id;
  Category.findByIdAndDelete(categoryId)
    .then((deletedCategory) => {
      res.send(deletedCategory);
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

module.exports = router;
