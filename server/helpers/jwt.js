const { expressjwt: expressJwt } = require("express-jwt"); // ✅ Works in v7+

require("dotenv").config();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y3NDVkYTFiMzcxMjhlOWU0N2U5MjAiLCJpYXQiOjE3NDQ0ODYxMTMsImV4cCI6MTc0NDU3MjUxM30.pqoA9a1SXn3jvIi1w0ORmPrYF5Wu9cxnY6EHUUcjX5k
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y3NDVkYTFiMzcxMjhlOWU0N2U5MjAiLCJpc0FkbWluIjp0cnVlLCJpc1Jldm9rZWQiOnRydWUsImlhdCI6MTc0NDYwMTc1OCwiZXhwIjoxNzQ0Njg4MTU4fQ.plTWh_cl1Qz15HY0vZbKaMeyqgxR_SVhyVrBF77dkAI
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZjOGE1MWQ5YTI1NDE4MmIxMjkyNTYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzQ0NjAzODUxLCJleHAiOjE3NDQ2OTAyNTF9.WmRbQYOsVcIuZyc7TWoqVKcLkmMwF6uxaGG1w315sSk

function authJwt() {
  const secret = process.env.JWT_SIGNING_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/api/v1/products",
        methods: ["GET", "OPTIONS"],
      },
      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

module.exports = authJwt;
