const express = require("express");
const router = express.Router();
const {
  verifyPayment,
  createOrder,
  getAllPayments, // Import the new controller function
} = require("../controllers/payment.controller");

// Create an order
router.post("/create-order", createOrder);

// Verify a payment
router.post("/verify-payment", verifyPayment);

// Get all payments
router.get("/", getAllPayments); // New route to fetch all payments

module.exports = router;
