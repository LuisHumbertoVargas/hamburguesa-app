"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type AppContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  user: any;
  setUser: (user: any) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addToCart = (newItem: CartItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === newItem.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return currentCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return currentCart.filter(item => item.id !== id);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
