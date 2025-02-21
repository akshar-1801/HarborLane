import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Html5QrcodeScanner } from "html5-qrcode";
import CartItem from "./CartItem/CartItem";
import CartCard from "./CartCard/CartCard"; // Import CartCard component

interface ScannedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  cartNumber: number;
}

const Cart = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [tabs, setTabs] = useState([1]);
  const [activeTab, setActiveTab] = useState(0);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(
    null
  );
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ScannedProduct | null>(null); // State for selected product

  const products = [
    {
      id: "1",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQqwiQcolEIDRVEgRJlZoCMNq8h0ReIwD_IQ&s",
    },
    {
      id: "2",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5F_1RVEx-WylODDWR1RZRU-gl3iUVVu5NpA&s",
    },
    {
      id: "3",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlY-R0KTsApW-3xmjAFR7UJ7qG1rNCvWKyow&s",
    },
    {
      id: "4",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj6SKeoxe3qcopwP66FmsCVacxuHFM0Mf5Q&s",
    },
    {
      id: "5",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://plus.unsplash.com/premium_photo-1679513691641-9aedddc94f96?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tJTIwb2JqZWN0c3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "6",
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      price: 20,
      image:
        "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
    },
  ];

  // Cleanup function for scanner
  const cleanupScanner = useCallback(() => {
    const scannerElem = document.getElementById("scanner");
    if (scannerElem) scannerElem.innerHTML = ""; // Remove scanner UI
  }, []);

  const addNewTab = () => {
    if (tabs.length < 3) {
      setTabs([...tabs, Math.max(...tabs) + 1]);
      setActiveTab(tabs.length);
    }
  };

  // Handle scanning success
  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      if (scannedProduct) return; // Prevent multiple scans

      const product = products.find((p) => p.id === decodedText);
      if (product) {
        setProductQuantity(1); // ✅ Ensure quantity starts at 1
        setScannedProduct({
          ...product,
          quantity: 1,
          cartNumber: tabs[activeTab],
        });
        setIsScannerOpen(false); // Close scanner
        cleanupScanner();
        setShowProductModal(true);
      }
    },
    [activeTab, cleanupScanner, products, scannedProduct, tabs]
  );

  // Initialize Scanner
  useEffect(() => {
    if (!isScannerOpen) {
      cleanupScanner();
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "scanner",
      { fps: 10, qrbox: { width: 250, height: 100 } },
      false
    );
    scanner.render(handleScanSuccess, console.error);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isScannerOpen, handleScanSuccess, cleanupScanner]); // ✅ Dependencies fixed

  const handleConfirmAdd = () => {
    if (!scannedProduct) return;

    setScannedProducts((prev) => {
      const existingProductIndex = prev.findIndex(
        (p) => p.id === scannedProduct.id && p.cartNumber === tabs[activeTab]
      );

      if (existingProductIndex !== -1) {
        // Update the existing product's quantity correctly
        const updated = [...prev];
        updated[existingProductIndex] = {
          ...updated[existingProductIndex],
          quantity: updated[existingProductIndex].quantity + productQuantity, // ✅ Fix: Correctly add quantity
        };
        return updated;
      }

      // If product is not in cart, add it properly
      return [...prev, { ...scannedProduct, quantity: productQuantity }];
    });

    // Reset modal state after confirming
    setShowProductModal(false);
    setScannedProduct(null);
    setProductQuantity(1);
  };

  const handleRemove = () => {
    setShowProductModal(false);
    setScannedProduct(null);
    setProductQuantity(1);
  };

  const openScanner = () => {
    setShowProductModal(false);
    setScannedProduct(null);
    setProductQuantity(1); // ✅ Reset quantity before scanning
    setIsScannerOpen(true);
  };

  const handleItemClick = (product: ScannedProduct) => {
    setSelectedProduct(product); // Set the selected product to open CartCard
  };

  const handleCloseCartCard = () => {
    setSelectedProduct(null); // Close CartCard
  };

  const handleUpdateProduct = (productId: string, quantity: number) => {
    setScannedProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setScannedProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const filteredProducts = scannedProducts.filter(
    (product) => product.cartNumber === tabs[activeTab]
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-white h-calc([100vh]-55px) relative">
      <div className="flex bg-gray-200 px-1 pt-1 items-end h-10">
        {tabs.map((tabNum, index) => (
          <button
            key={tabNum}
            onClick={() => setActiveTab(index)}
            className={`py-2 flex-1 text-sm rounded-t-lg ${
              activeTab === index
                ? "bg-white font-medium"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            CART {tabNum}
          </button>
        ))}
        {tabs.length < 3 && (
          <button
            onClick={addNewTab}
            className="w-8 bg-gray-400 text-white rounded-full text-lg h-8 ml-1 mb-1 font-bold"
          >
            +
          </button>
        )}
      </div>

      <div className="bg-white p-2 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div key={product.id} onClick={() => handleItemClick(product)}>
            <CartItem product={product} />
          </div>
        ))}
      </div>

      {selectedProduct && (
        <CartCard
          product={selectedProduct}
          onClose={handleCloseCartCard}
          handleUpdate={handleUpdateProduct}
          handleRemove={handleRemoveProduct}
        />
      )}

      <button
        onClick={openScanner}
        className="fixed bottom-12 right-4 w-16 h-16 bg-green-900 rounded-full flex items-center justify-center text-white text-3xl shadow-lg"
      >
        +
      </button>

      {isScannerOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Scan Product</h3>
            <div id="scanner" className="mb-4"></div>
            <button
              onClick={() => setIsScannerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showProductModal && scannedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80">
            <div className="text-center text-white">
              <img
                src={scannedProduct.image}
                alt={scannedProduct.name}
                className="w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-4">
                {scannedProduct.name}
              </h3>
              <p className="text-xl mb-4">
                ₹ {scannedProduct.price}{" "}
                <span className="text-sm">Per Unit</span>
              </p>

              {/* Quantity Selector with Plus & Minus Buttons */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={() =>
                    setProductQuantity((prev) => Math.max(1, prev - 1))
                  }
                  className="w-10 h-10 bg-gray-700 text-white rounded-full text-xl flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-xl font-medium">{productQuantity}</span>
                <button
                  onClick={() => setProductQuantity((prev) => prev + 1)}
                  className="w-10 h-10 bg-green-500 text-white rounded-full text-xl flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRemove}
                  className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  Remove
                </button>
                <button
                  onClick={handleConfirmAdd}
                  className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
