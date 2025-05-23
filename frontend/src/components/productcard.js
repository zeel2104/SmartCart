import React from 'react';

function ProductCard({ product, addToCart }) {
  const { PRODUCT_NAME, BRAND, PRICE_CURRENT, PRODUCT_SIZE, SKU, IMAGE_URL } = product;

  const fallback = 'https://via.placeholder.com/150?text=No+Image';
  const walmartImage = `https://i5.walmartimages.com/asr/${SKU}.jpeg`;
  const imageUrl = IMAGE_URL || walmartImage;

  return (
    <div
      className="border rounded shadow-sm bg-white p-2 flex flex-col justify-between"
      style={{ width: '180px', height: '300px' }}
    >
      <img
        src={imageUrl}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallback;
        }}
        alt={PRODUCT_NAME}
        style={{
          height: '100px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '8px',
        }}
      />

      <div style={{ flexGrow: 1 }}>
        <h2 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          lineHeight: '1.1',
          marginBottom: '4px',
          maxHeight: '3em',
          overflow: 'hidden',
        }}>
          {PRODUCT_NAME}
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '4px' }}>
          {BRAND} • {PRODUCT_SIZE} oz
        </p>
        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#15803d' }}>
          ${PRICE_CURRENT}
        </p>
      </div>

      <button
        onClick={() => addToCart(product)}
        style={{
          marginTop: '8px',
          width: '100%',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '4px',
          fontSize: '0.75rem',
          borderRadius: '4px',
          border: 'none',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
