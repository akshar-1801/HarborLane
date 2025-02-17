import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="w-full bg-green-900 text-white py-1 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          {/* Brand Name */}
          <h1 className="text-lg sm:text-xl font-semibold">HarborLane</h1>

          {/* Hamburger Menu Button */}
          <button onClick={() => setIsOpen(true)} className="p-2">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Sidebar + Overlay with AnimatePresence for exit animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed inset-y-0 left-0 bg-white shadow-lg p-5 z-50 w-full md:w-64 h-full"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }} // Slides out smoothly
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-2 text-gray-600 hover:text-black"
              >
                <X size={28} />
              </button>

              {/* Sidebar Content */}
              <nav className="mt-10 space-y-6 text-center text-lg font-medium">
                <a
                  href="#"
                  className="block text-gray-800 hover:text-green-700"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-gray-800 hover:text-green-700"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block text-gray-800 hover:text-green-700"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="block text-gray-800 hover:text-green-700"
                >
                  Contact
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
