import React, { useState } from "react";

const Cart = () => {
  const [tabs, setTabs] = useState([1]);
  const [activeTab, setActiveTab] = useState(0);
  const [products] = useState([
    {
      id: 1,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQqwiQcolEIDRVEgRJlZoCMNq8h0ReIwD_IQ&s",
    },
    {
      id: 2,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5F_1RVEx-WylODDWR1RZRU-gl3iUVVu5NpA&s",
    },
    {
      id: 3,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlY-R0KTsApW-3xmjAFR7UJ7qG1rNCvWKyow&s",
    },
    {
      id: 4,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj6SKeoxe3qcopwP66FmsCVacxuHFM0Mf5Q&s",
    },
    {
      id: 5,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1679513691641-9aedddc94f96?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tJTIwb2JqZWN0c3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 6,
      name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
      quantity: 2,
      price: 20,
      cartNumber: 1,
      image:
        "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
    },
    {
        id: 6,
        name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
        quantity: 2,
        price: 20,
        cartNumber: 1,
        image:
          "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
      },
      {
        id: 6,
        name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
        quantity: 2,
        price: 20,
        cartNumber: 1,
        image:
          "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
      },
      {
        id: 6,
        name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
        quantity: 2,
        price: 20,
        cartNumber: 1,
        image:
          "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
      },
      {
        id: 6,
        name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
        quantity: 2,
        price: 20,
        cartNumber: 1,
        image:
          "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
      },
      {
        id: 6,
        name: "Sunfeast Dark Fantasy Vanilla Creme, 249g, Dark Crunchy Biscuit with Smoo...",
        quantity: 2,
        price: 20,
        cartNumber: 1,
        image:
          "https://images.thdstatic.com/productImages/03b3f75e-f804-4e2a-9236-fc27e16084ad/svn/ridgid-orbital-sanders-r8606b-64_600.jpg",
      },
  ]);

  const addNewTab = () => {
    if (tabs.length < 3) {
      const newTabNumber = Math.max(...tabs) + 1;
      setTabs([...tabs, newTabNumber]);
      setActiveTab(tabs.length);
    }
  };

  const filteredProducts = products.filter(
    (product) => product.cartNumber === tabs[activeTab]
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-100 h-[calc(100dvh-55px)]">
      {/* Chrome-style tabs container */}
      <div className="flex bg-gray-200 px-1 pt-1 items-end h-10">
        <div className="flex flex-grow h-9">
          {" "}
          {/* Fixed height container */}
          {tabs.map((tabNum, index) => {
            const width = `${100 / (tabs.length + (tabs.length < 3 ? 1 : 0))}%`;

            return (
              <button
                key={tabNum}
                onClick={() => setActiveTab(index)}
                style={{ width }}
                className={`
                  relative
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-t-lg 
                  transition-colors 
                  duration-200
                  text-sm
                  min-w-[120px]
                  ${
                    activeTab === index
                      ? "bg-white text-gray-800 font-medium"
                      : "bg-gray-300 text-gray-600 hover:bg-gray-400"
                  }
                  ${index > 0 ? "ml-1" : ""}
                `}
              >
                <span className="px-4">CART {tabNum}</span>
                {/* Chrome-style tab separator */}
                {index < tabs.length - 1 && activeTab !== index && (
                  <div className="absolute right-0 top-2 bottom-2 w-px bg-gray-400" />
                )}
              </button>
            );
          })}
          {/* New tab button */}
          {tabs.length < 3 && (
            <button
              onClick={addNewTab}
              style={{ width: `${100 / (tabs.length + 1)}%` }}
              className="
                ml-1 
                h-9
                flex 
                items-center 
                justify-center 
                rounded-t-lg 
                bg-gray-300 
                text-gray-600 
                hover:bg-gray-400 
                min-w-[120px]
              "
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-400 hover:bg-gray-500">
                <span className="text-white text-lg leading-none mb-0.5">
                  +
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Cart items */}
      <div className="bg-white p-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center py-2 px-1 border-b border-gray-200"
          >
            <div className="w-15 h-15 flex-shrink-0 mr-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="text-xs text-gray-800 mb-0.5 truncate">
                {product.name}
              </h3>
              <div className="text-xs text-gray-600">
                {product.quantity} X ₹{product.price}
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <button className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm">
                -
              </button>
              <span className="w-4 text-center text-sm">
                {product.quantity}
              </span>
              <button className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add item button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl shadow-lg">
          +
        </button>
      </div>
    </div>
  );
};

export default Cart;
