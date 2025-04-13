const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authJwt = require("../helpers/jwt");

// * GET ALL USERS
router.get("/", authJwt(), async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({ success: false });
  } else {
    res.send(userList);
  }
});

// * GET USER BY ID
router.get("/:id", async (req, res) => {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (isValid) {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      res.status(404).json({ success: false, message: "couldn't find" });
    } else {
      res.send(user);
    }
  } else {
    res.status(400).json({ message: "invalid user id" });
  }
});

// * GET USERS WITH LIMITED DETAILS
router.get("/get/dashboard", async (req, res) => {
  const usersList = await User.find().select("name email phone isAdmin");
  if (usersList) {
    res.send(usersList);
  } else {
    res.status(500).json({ success: false });
  }
});

// * CREATE A USER
router.post("/register", async (req, res) => {
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

// * LOGGING USER IN
router.post("/login", authJwt(), async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SIGNING_SECRET,
      { expiresIn: "1d" }
    );
    res.send({ email: user.email, token: token });
  } else {
    return res
      .status(400)
      .send({ message: "invalid email/password", success: false });
  }
});
module.exports = router;
