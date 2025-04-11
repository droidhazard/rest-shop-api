const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const userList = await User.find();
  if (!userList) {
    res.status(500).json({ success: false });
  } else {
    res.send(userList);
  }
});

router.get("/:id", async (req, res) => {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (isValid) {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "couldn't find" });
    } else {
      res.send(user);
    }
  } else {
    res.status(400).json({ message: "invalid user id" });
  }
});

router.post("/", async (req, res) => {
  let newUser = new User({
    name: req.body.name || "",
    email: req.body.email || "",
    passwordHash:
      bcrypt.hashSync(req.body.password, Number(process.env.SALT)) || "",
    phone: req.body.phone || "",
    isAdmin: req.body.isAdmin || false,
    apartment: req.body.apartment || "",
    zip: req.body.zip || "",
    city: req.body.city || "",
    country: req.body.country || "",
  });
  newUser = await newUser.save();
  if (newUser) {
    res.send(newUser);
  } else {
    res.status(500).json({ success: false });
  }
});
module.exports = router;
