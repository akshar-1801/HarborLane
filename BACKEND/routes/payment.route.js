const express = require("express");
const router = express.Router();
const {
  makePayment,
  getPaymentDetails,
} = require("../controllers/payment.controller");

// Make a payment
router.post("/pay", makePayment);

// Get payment details by order ID
router.get("/:orderId", getPaymentDetails);

module.exports = router;
