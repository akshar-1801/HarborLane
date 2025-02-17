import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

const images = [
  "https://bigbasketoffer.com/images/Aata.jpg",
  "https://forum.valuepickr.com/uploads/default/original/3X/f/d/fdd08d7e38a627b05f167b0f6212085ba9be9d27.jpeg",
  "https://dmart-files.b-cdn.net/1720600900.jpg",
  "https://pbs.twimg.com/media/DnX-3_SWwAAObLd.jpg",
  "https://bigbasketoffer.com/images/Tea.jpg"
];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto p-3">
      {/* Image Wrapper */}
      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg shadow-lg relative">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={`Slide ${i + 1}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.1,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Animated Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-500"
            animate={{
              backgroundColor: i === index ? "#D1D5DB" : "#374151",
              scale: i === index ? 1.2 : 1,
              opacity: i === index ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
