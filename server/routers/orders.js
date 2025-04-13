const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const authJwt = require("../helpers/jwt");

router.get("/", async (req, res) => {
  const orderList = await Order.find();
  if (!orderList) {
    res.status(500).json({ success: false });
  } else {
    res.send(orderList);
  }
});

router.post("/", authJwt(), async (req, res) => {
  const newOrder = req.body;
  const createdOrder = await Order.create(newOrder);
  res.status(201).json(createdOrder);
});

module.exports = router;
