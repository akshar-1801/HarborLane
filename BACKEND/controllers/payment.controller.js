const Payment = require("../models/payment.model");
const Order = require("../models/order.model");

// Make a payment
const makePayment = async (req, res) => {
  const { customer_id, order_id, payment_method, amount, transaction_id } =
    req.body;

  try {
    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const payment = new Payment({
      customer_id,
      order_id,
      payment_method,
      amount,
      transaction_id,
      status: "successful",
    });

    await payment.save();

    // Update order to reflect payment
    order.payment_id = payment._id;
    await order.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
  }
};

// Get payment details for an order
const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order_id: req.params.orderId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payment details", error });
  }
};

module.exports = { makePayment, getPaymentDetails };
