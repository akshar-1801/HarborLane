const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["cash", "credit_card", "UPI"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_id: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["successful", "failed"],
      default: "successful",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
