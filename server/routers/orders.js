const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const LineItem = require("../models/order-item");
const authJwt = require("../helpers/jwt");

// * GET ALL ORDERS
router.get("/", async (req, res) => {
  const orderList = await Order.find().populate("user", "name");
  if (!orderList) {
    res.status(500).json({ success: false });
  } else {
    res.send(orderList);
  }
});

// * GET ORDER BY ID
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate([
      { path: "user" },
      {
        path: "lineItems",
        populate: {
          path: "product",
          populate: {
            path: "category",
          },
        },
      },
    ])
    .sort({ dateOrdered: -1 });
  // console.log(order);
  if (order) {
    res.send(order);
  } else {
    res.status(500).json({ success: false });
  }
});

// * CREATE AN ORDER
router.post("/", authJwt(), async (req, res) => {
  // * Creating multiple Line Items with post data
  const lineItemIds = Promise.all(
    req.body.lineItems.map(async (item) => {
      let newLineItem = new LineItem({
        quantity: item.quantity,
        product: item.product,
      });
      newLineItem = await newLineItem.save();
      return newLineItem._id;
    })
  );
  const lineItemIdsResolved = await lineItemIds;

  // * Calculate total price of order
  const totalPrices = await Promise.all(
    lineItemIdsResolved.map(async (lineItemId) => {
      const lineItem = await LineItem.findById(lineItemId).populate(
        "product",
        "price"
      );
      const totalPrice = lineItem.product.price * lineItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  // console.log(lineItemIdsResolved);
  let order = new Order({
    lineItems: lineItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  order = await order.save();
  res.status(201).json(order);
});

// * UPDATE ORDER STATUS
router.put("/:id", authJwt(), async (req, res) => {
  const orderId = req.params.id;
  const updatedProduct = await Order.findByIdAndUpdate(
    orderId,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (updatedProduct) {
    res.send(updatedProduct);
  } else {
    res.status(500).json({ success: false });
  }
});

// * DELETE ORDER BY ID
router.delete("/:id", authJwt(), async (req, res) => {
  const orderId = req.params.id;
  let orderData = await Order.findById(orderId);
  orderLineItems = orderData.lineItems.map(async (item) => {
    await LineItem.findByIdAndDelete(item).catch((error) => {
      console.log("Error while deleting lineitem: ", error);
    });
  });
  console.log(orderData);
  // const deletedOrder = await Order.findByIdAndDelete(orderId);
  if (deletedOrder) {
    res.send(deletedOrder);
  } else {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
