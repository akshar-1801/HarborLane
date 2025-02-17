const Employee = require("../models/employee.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "HaBourLaNe";

const verifyCart = async (req, res) => {
  try {
    const { employee_id, cart_id } = req.params;

    // Check if employee exists
    const employee = await Employee.findById(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if employee has the necessary role to verify a cart (associates only)
    if (employee.role !== "associate") {
      return res
        .status(403)
        .json({ message: "Only associates can verify carts" });
    }

    // Find the cart to be verified
    const cart = await Cart.findById(cart_id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Verify the cart
    cart.verified = true;
    cart.verified_by = employee._id;
    cart.verified_at = new Date();

    // Save the cart with verification details
    await cart.save();

    // Track the cart verification in employee's record
    employee.verified_carts.push({
      cart_id: cart._id,
      verified_at: new Date(),
    });
    await employee.save();

    res.status(200).json({ message: "Cart verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employee login
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all carts that need verification
const getCartsForVerification = async (req, res) => {
  try {
    const carts = await Cart.find({
      wants_verification: true,
      verified: false,
    });

    if (carts.length === 0) {
      return res
        .status(404)
        .json({ message: "No carts waiting for verification" });
    }

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loginEmployee,
  getCartsForVerification,
  verifyCart,
};
