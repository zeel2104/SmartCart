import React, { useEffect } from 'react';

function Cart({ cart, removeFromCart, updateQuantity }) {
  // useEffect to log the cart prop whenever it changes
  // This helps confirm that the Cart component is receiving the updated data from App.js
  useEffect(() => {
    console.log("Cart component received updated cart prop:", cart);
  }, [cart]); // Dependency array ensures this runs only when 'cart' prop changes

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛍️ Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600 italic">Your cart is empty. Start adding some groceries!</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((product) => {
            // Log each product object right before it's rendered
            console.log("Rendering product in Cart:", product.SKU, "Quantity:", product.quantity, product);
            return (
              <li
                key={String(product.SKU)} // Explicitly convert SKU to a string for the key
                className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center bg-gray-50"
              >
                <div className="flex-grow mb-2 sm:mb-0">
                  <h3 className="font-semibold text-lg text-gray-900">{product.PRODUCT_NAME}</h3>
                  <p className="text-gray-600 text-sm">Price: ${product.PRICE_CURRENT?.toFixed(2) || 'N/A'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(product.SKU, -1)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    {/* Ensure quantity is always treated as a number and has a fallback */}
                    <span className="text-lg font-bold text-gray-800">{Number(product.quantity) || 1}</span>
                    <button
                      onClick={() => updateQuantity(product.SKU, 1)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product.SKU)}
                  className="ml-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Remove ${product.PRODUCT_NAME} from cart`}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Cart;