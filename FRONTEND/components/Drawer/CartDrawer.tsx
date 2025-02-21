"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CartDrawer() {
  const [isExpanded, setIsExpanded] = useState(false);

  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800; // Fallback for SSR
  const minY = -windowHeight + 160; // Max height when fully opened (leaving a 100px gap from the top)
  const maxY = 0; // Drawer hidden below screen

  return (
    <motion.div
      className="fixed bottom-[-95%] left-0 right-0 bg-gray-100 shadow-2xl rounded-t-2xl p-4 h-[100%]" // Initially hidden
      drag="y"
      dragConstraints={{ top: minY, bottom: maxY }}
      initial={{ y: maxY }} // Start below screen
      animate={{ y: isExpanded ? minY : maxY }} // Animate to expanded or hidden state
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      onDragEnd={(_, info) => {
        if (info.point.y > windowHeight * 0.5) {
          setIsExpanded(false); // Close if dragged too low
        } else {
          setIsExpanded(true); // Open if dragged up
        }
      }}
    >
      {/* Drag Handle */}
      <div className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mb-3 cursor-pointer" />

      {/* Cart Content */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <p className="text-sm text-gray-600">
          Manage your selected items below.
        </p>
      </div>

      {/* Placeholder for Products */}
      <div className="mt-4 grid grid-cols-2 gap-4 p-4">
        <div className="p-4 bg-gray-300 rounded-lg">Product 1</div>
        <div className="p-4 bg-gray-300 rounded-lg">Product 2</div>
        <div className="p-4 bg-gray-300 rounded-lg">Product 3</div>
        <div className="p-4 bg-gray-300 rounded-lg">Product 4</div>
      </div>
    </motion.div>
  );
}
