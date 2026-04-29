'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was restored from bfcache - reset loading and clear cart
        setLoading(false);
        clearCart();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const totalAmount = cart.reduce((total, item) => {
    return total + (item.priceValue ?? 0) * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const payloadItems = cart.map(item => ({
        name: item.name,
        imageUrl: item.imageUrl,
        priceValue: item.priceValue,
        quantity: item.quantity,
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      });

      const session = await res.json();

      if (session.url) {
        clearCart();
        window.location.href = session.url;
      } else if (session.error) {
        alert(session.error);
      }
    } catch (e) {
      console.error(e);
      alert('Checkout failed.');
    }
    setLoading(false);
  };

  return (
    <div className="container section">
      <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Your cart is currently empty.</p>
            <Link href="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <button onClick={() => removeFromCart(item.name)} style={{ padding: '0.2rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)} style={{ padding: '0.2rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>+</button>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {item.price}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #ddd' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Total</h2>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                Rs. {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1 }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
