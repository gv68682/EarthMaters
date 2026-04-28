'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductTabs({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState('All');
  const { addToCart } = useCart();

  // Define the exact tabs to display as requested
  const categories = [
    'All', 
    'Flower Plants', 
    'Fruit Plants', 
    'Trees', 
    'Seeds', 
    'Garden Decor'
  ];

  const filteredProducts = products.filter(product => {
    if (activeTab === 'All') return true;
    
    // Map the raw CSV category into the target grouped tab
    const rawCategory = product['Category'];
    let mappedTab = '';

    if (rawCategory === 'All Plants' || rawCategory === 'Plants') {
      mappedTab = 'Flower Plants';
    } else if (rawCategory === 'Fruit Plants') {
      mappedTab = 'Fruit Plants';
    } else if (rawCategory === 'Tree') {
      mappedTab = 'Trees';
    } else if (rawCategory === 'Bulbs and Seeds' || rawCategory === 'Seeds') {
      mappedTab = 'Seeds';
    } else if (rawCategory === 'Fertilizers' || rawCategory === 'Garden Decor') {
      mappedTab = 'Garden Decor';
    }

    // Match the determined tab with the actively selected tab
    return mappedTab === activeTab;
  });

  return (
    <div>
      <div className="tabs" style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap'}}>
        {categories.map((cat: any) => (
          <button 
            key={cat} 
            className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(cat)}
            style={{borderRadius: '30px'}}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid-cols-4">
        {filteredProducts.map((product: any, idx: number) => {
          const hasSale = product['Sale Price'] && product['Sale Price'] !== 'N/A';
          const price = hasSale ? product['Sale Price'] : product['Regular Price'];
          const oldPrice = hasSale ? product['Regular Price'] : null;
          
          return (
            <div key={idx} className="glass-card animate-fade-in" style={{animationDelay: `${(idx % 10) * 0.05}s`}}>
              <div className="product-image-wrap">
                {hasSale && <span className="badge">Sale</span>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product['Image URL']} alt={product['Product Name']} className="product-image" loading="lazy" />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product['Product Name']?.length > 45 ? product['Product Name'].substring(0, 45) + '...' : product['Product Name']}</h3>
                <div className="price-wrap">
                  <span className="sale-price">{price}</span>
                  {oldPrice && oldPrice !== 'N/A' && <span className="regular-price">{oldPrice}</span>}
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{width: '100%', marginTop: '0.5rem'}}
                  onClick={() => addToCart({
                    name: product['Product Name'],
                    price: price,
                    imageUrl: product['Image URL']
                  })}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
          No products matched this category based on our auto-filtering.
        </div>
      )}
    </div>
  );
}
