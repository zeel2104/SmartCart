import React from 'react';
import ProductCard from './productcard';

function ProductGrid({ products = [], addToCart }) {
  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {products.map((product) => (
          <ProductCard key={product.SKU} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
