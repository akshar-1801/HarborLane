const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: false,
  },
  barcode: {
    type: String,
    unique: true,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  units_sold: {
    type: Number,
    default: 0,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` on document save
productSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
