const expressJwt = require("express-jwt");
require("dotenv").config();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y3NDVkYTFiMzcxMjhlOWU0N2U5MjAiLCJpYXQiOjE3NDQ0ODYxMTMsImV4cCI6MTc0NDU3MjUxM30.pqoA9a1SXn3jvIi1w0ORmPrYF5Wu9cxnY6EHUUcjX5k

function authJwt() {
  const secret = process.env.JWT_SIGNING_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/api/v1/products",
        methods: "GET",
      },
      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

module.exports = authJwt;
