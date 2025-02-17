const express = require("express");
const router = express.Router();
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  deleteCart,
  requestVerification,
} = require("../controllers/cart.controller");

// Get a cart by customer ID and cart number
router.get("/:customer_id", getCart);

// Add an item to a cart
router.post("/:customer_id/:cart_number/items", addItemToCart);

// Remove an item from a cart
router.delete("/:customer_id/:cart_number/items/:item_id", removeItemFromCart);

// Update the quantity of an item in the cart
router.put("/:customer_id/:cart_number/items/:item_id", updateItemQuantity);

// Delete a cart
router.delete("/:customer_id/:cart_number", deleteCart);

// Customer requests verification
router.put("/:customer_id/request-verification", requestVerification);

module.exports = router;
