'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductTabs({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState('All');
  const { addToCart } = useCart();

  const categories = [
    'All',
    'Flower Plants',
    'Fruit Plants',
    'Trees',
    'Seeds',
    'Garden Decor',
  ];

  // TEMP FIX: no filtering until category exists in DB
  const filteredProducts =
    activeTab === 'All'
      ? products
      : products.filter((product) => product.category === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div
        className="tabs"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(cat)}
            style={{ borderRadius: '30px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid-cols-4">
        {filteredProducts.map((product: any, idx: number) => {
          const price = product.priceValue;

          return (
            <div
              key={idx}
              className="glass-card animate-fade-in"
              style={{ animationDelay: `${(idx % 10) * 0.05}s` }}
            >
              <div className="product-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <h3 className="product-title">
                  {product.name?.length > 45
                    ? product.name.substring(0, 45) + '...'
                    : product.name}
                </h3>

                <div className="price-wrap">
                  <span className="sale-price">₹{price}</span>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={() =>
                    addToCart({
                      name: product.name,
                      price: product.priceValue,
                      imageUrl: product.imageUrl,
                    })
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          No products available.
        </div>
      )}
    </div>
  );
}