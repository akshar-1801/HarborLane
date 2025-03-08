"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../Card/Card";
import { fetchRecommendations, Recommendation } from "../../api/products";
import { useUser } from "../../context/UserContext";

export default function CartDrawer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { cartItems } = useUser();

  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800; // Fallback for SSR
  const headerHeight = 55; // Header height in pixels
  const drawerHeight = windowHeight - headerHeight; // Drawer height matches viewport minus header

  // Positioning: y=0 is fully open (top at 55px), y adjusts for closed state
  const peekHeight = 36; // How much to show when closed (handle + some content)
  const minY = 0; // Fully open: top at 55px (adjusted by CSS top)
  const maxY = drawerHeight - peekHeight; // Closed: 60px peeks above bottom

  useEffect(() => {
    const fetchAndSetRecommendations = async () => {
      const cartBarcodes = cartItems.map((item) => item.id);
      const recommendations = await fetchRecommendations(cartBarcodes);
      setRecommendations(recommendations);
    };

    if (isExpanded) {
      fetchAndSetRecommendations();
    }
  }, [isExpanded, cartItems]);

  const preventPullToRefresh = (e: React.TouchEvent<HTMLDivElement>) => {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;
    if (scrollTop === 0 && e.touches && e.touches[0].clientY > 0) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className="fixed left-0 right-0 bg-gray-100 shadow-2xl rounded-t-2xl p-4"
      style={{ height: `${drawerHeight}px`, top: `${headerHeight}px` }} // Fixed height and top offset
      initial={{ y: maxY }} // Start with 60px peeking
      animate={{ y: isExpanded ? minY : maxY }} // Animate to open or closed
      transition={{ type: "spring", stiffness: 300, damping: 40 }}
    >
      {/* Drag Handle */}
      <div
        className="w-50 h-1.5 bg-gray-400 rounded-full mx-auto mb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)} // Toggle drawer state on click
      />

      {/* Cart Content */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Top picks you'll want in your cart
        </p>
      </div>

      {/* Placeholder for Products */}
      <div
        className="mt-4 grid grid-cols-2 gap-4 p-4 pr-0 pl-0 overflow-y-auto"
        style={{ height: "calc(100% - 60px)" }} // Adjust for handle and text
        onTouchMove={preventPullToRefresh} // Prevent page reload on scroll up
      >
        {recommendations.map((product, index) => (
          <Card key={index} product={{ image: product.imageUrl, name: product.name, price: product.price.toString() }} />
        ))}
      </div>
    </motion.div>
  );
}
