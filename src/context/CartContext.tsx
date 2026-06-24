/**
 * Cart Context for local state management
 * Uses collocated state with React Context API
 * CRITICAL: Updates must NOT trigger re-renders of product components
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextValue {
  cartItems: Map<string, number>;
  cartCount: number;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map());
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    setCartItems(prev => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(productId) || 0;
      newMap.set(productId, currentQty + quantity);
      return newMap;
    });
    
    setCartCount(prev => prev + quantity);

    if (__DEV__) {
      console.log(`[Cart] Added ${quantity}x ${productId} to cart`);
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => {
      const newMap = new Map(prev);
      const qty = newMap.get(productId) || 0;
      newMap.delete(productId);
      setCartCount(count => count - qty);
      return newMap;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems(new Map());
    setCartCount(0);
  }, []);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        addToCart, 
        removeFromCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
