'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.id === item.id
      );

      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (
    id: number,
    delta: number
  ) => {
    setCart((prevCart) =>
      prevCart
        .map((i) =>
          i.id === id
            ? {
                ...i,
                quantity: i.quantity + delta,
              }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }

  return context;
};