import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function UserDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return value.trim() === ""
          ? "First name is required"
          : !/^[a-zA-Z\s]*$/.test(value)
          ? "First name should only contain letters"
          : "";
      case "lastName":
        return value.trim() === ""
          ? "Last name is required"
          : !/^[a-zA-Z\s]*$/.test(value)
          ? "Last name should only contain letters"
          : "";
      case "phoneNumber":
        return value.trim() === ""
          ? "Phone number is required"
          : !/^\d{10}$/.test(value)
          ? "Phone number must be 10 digits"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return; // Only allow digits for phone number
    }

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateInput(name, value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateInput("firstName", firstName),
      lastName: validateInput("lastName", lastName),
      phoneNumber: validateInput("phoneNumber", phoneNumber),
    };

    setErrors(newErrors);

    // Proceed only if there are no errors
    if (!Object.values(newErrors).some((error) => error !== "")) {
      console.log("Form submitted:", { firstName, lastName, phoneNumber });

      // ✅ FIX: Ensure navigation occurs after state update
      setTimeout(() => {
        navigate("/cart");
      }, 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-gradient-to-b from-green-50 to-green-100 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
          Customer Details
        </h1>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-2xl shadow-xl space-y-6"
        >
          {/* First Name Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                +91
              </span>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                pattern="\d*"
                inputMode="numeric"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
                placeholder="Enter 10-digit number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-700 text-white font-medium rounded-lg 
                     shadow-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500 
                     focus:ring-opacity-50 transition-all duration-300"
          >
            Start Shopping
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
