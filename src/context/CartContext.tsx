'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type CartItem = {
  name: string;
  price: string;
  priceValue: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
  cartCount: number;

};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {
      localStorage.removeItem('cart');
    }
    setLoaded(true); // ← mark as loaded
  }, []);

  // Sync to localStorage only after initial load
  useEffect(() => {
    if (!loaded) return; // ← skip first render
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, loaded]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(p => p.name === product.name);
      if (existing) {
        return prev.map(p =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.name === name);
      if (existing && existing.quantity > 1) {
        return prev.map(p =>
          p.name === name ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
      return prev.filter(p => p.name !== name);
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
