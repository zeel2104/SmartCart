import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductGrid from './components/productgrid'; // Assuming this component exists
import Cart from './components/cart';

function App() {
  // State for products displayed in the grid
  const [products, setProducts] = useState([]);
  // State for the search query
  const [query, setQuery] = useState('');
  // State for items in the shopping cart
  const [cart, setCart] = useState([]);
  // State for current page in product pagination
  const [page, setPage] = useState(1);
  // State for total number of products matching the query
  const [total, setTotal] = useState(0);
  // Limit for products per page
  const limit = 20;

  // useEffect hook to fetch products and cart data whenever query or page changes
  useEffect(() => {
    console.log("useEffect triggered: Fetching products and cart...");
    fetchProducts();
    fetchCart();
  }, [query, page]);

  /**
   * Fetches product data from the backend API based on the current query and page.
   */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products?q=${query}&page=${page}&limit=${limit}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      console.log("Products fetched:", res.data.products.length, "Total:", res.data.total);
    } catch (err) {
      console.error('Failed to load products:', err);
      // Optionally, set an error state to display a message to the user
    }
  };

  /**
   * Fetches the current cart data from the backend API.
   * IMPORTANT: Creates a new array with new objects for each item to ensure React detects changes.
   */
  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/cart');
      console.log("Backend response for cart fetch:", res.data); // Log the raw data from backend
      // Create a new array and new shallow copies of each object to ensure React re-renders
      const updatedCart = res.data.map(item => ({ ...item }));
      setCart(updatedCart);
      console.log("Frontend cart state after update:", updatedCart); // Log the state that React now holds
    } catch (err) {
      console.error('Failed to load cart:', err);
      // Optionally, set an error state to display a message to the user
    }
  };

  /**
   * Adds a product to the cart by sending a POST request to the backend.
   * After successful addition, fetches the updated cart.
   * @param {object} product - The product object to add to the cart.
   */
  const addToCart = async (product) => {
    console.log("Attempting to add to cart (frontend):", product);
    try {
      await axios.post('http://localhost:5000/cart', product);
      console.log("Product added to cart on backend. Now fetching updated cart.");
      fetchCart(); // Refresh cart after adding
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Optionally, show a user-friendly error message
    }
  };

  /**
   * Removes a product from the cart by its SKU, sending a DELETE request to the backend.
   * After successful removal, fetches the updated cart.
   * @param {string} sku - The SKU of the product to remove.
   */
  const removeFromCart = async (sku) => {
    console.log("Attempting to remove SKU (frontend):", sku);
    try {
      await axios.delete(`http://localhost:5000/cart/${sku}`);
      console.log("Product removed from backend. Now fetching updated cart.");
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error("❌ Remove failed:", err);
      // Optionally, show a user-friendly error message
    }
  };

  /**
   * Updates the quantity of a product in the cart by its SKU, sending a PUT request to the backend.
   * After successful update, fetches the updated cart.
   * @param {string} sku - The SKU of the product to update.
   * @param {number} delta - The change in quantity (e.g., -1 for decrease, 1 for increase).
   */
  const updateQuantity = async (sku, delta) => {
    console.log("Attempting to update quantity (frontend):", sku, "Delta:", delta);
    try {
      await axios.put(`http://localhost:5000/cart/${sku}`, { delta });
      console.log("Quantity updated on backend. Now fetching updated cart.");
      fetchCart(); // Refresh cart after quantity update
    } catch (err) {
      console.error("❌ Quantity update failed:", err);
      // Optionally, show a user-friendly error message
    }
  };

  return (
    <div className="min-h-screen w-full px-8 py-6 font-sans bg-gray-50">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">🛒 SmartCart+ Grocery</h1>

        {/* Search input field */}
        <input
          type="text"
          placeholder="Search for groceries..."
          className="border border-gray-300 p-3 rounded-md w-full max-w-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
        />

        {/* Product Grid component to display products */}
        <div className="w-full overflow-x-hidden">
          {/* ProductGrid component is assumed to be defined elsewhere */}
          <ProductGrid products={products} addToCart={addToCart} />
        </div>

        {/* Pagination controls */}
        <div className="flex gap-4 items-center mt-6 justify-center">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <span className="text-lg font-medium text-gray-700">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>

        {/* Cart component to display items in the cart */}
        <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      </div>
    </div>
  );
}

export default App;