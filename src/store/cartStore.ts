/**
 * Cart Store - Zustand Implementation
 * Replaces CartContext for better performance and devtools
 * 
 * Benefits over Context:
 * - No provider wrapper needed
 * - Better performance (selective subscriptions)
 * - Redux DevTools integration
 * - Simpler API
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  // State
  items: Map<string, number>;
  cartCount: number;
  
  // Actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Selectors
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      // Initial state
      items: new Map(),
      cartCount: 0,

      // Add to cart action
      addToCart: (productId: string, quantity: number = 1) => {
        console.log(`[CartStore] 🛒 addToCart called with: ${productId}, quantity: ${quantity}`);
        
        set((state) => {
          const newItems = new Map(state.items);
          const currentQty = newItems.get(productId) || 0;
          newItems.set(productId, currentQty + quantity);

          const newCount = state.cartCount + quantity;
          
          console.log(`[CartStore] ✅ Updated! Old count: ${state.cartCount}, New count: ${newCount}`);

          return {
            items: newItems,
            cartCount: newCount,
          };
        }, false, 'cart/addToCart');
      },

      // Remove from cart action
      removeFromCart: (productId: string) => {
        set((state) => {
          const newItems = new Map(state.items);
          const qty = newItems.get(productId) || 0;
          newItems.delete(productId);

          if (__DEV__) {
            console.log(`[CartStore] Removed ${productId}`);
          }

          return {
            items: newItems,
            cartCount: state.cartCount - qty,
          };
        }, false, 'cart/removeFromCart');
      },

      // Clear cart action
      clearCart: () => {
        set(
          {
            items: new Map(),
            cartCount: 0,
          },
          false,
          'cart/clearCart'
        );
      },

      // Selector for item quantity
      getItemQuantity: (productId: string) => {
        return get().items.get(productId) || 0;
      },
    }),
    { name: 'CartStore' }
  )
);

// Selector hooks for optimized re-renders
export const useCartCount = () => useCartStore((state) => state.cartCount);
export const useCartItems = () => useCartStore((state) => state.items);
export const useAddToCart = () => useCartStore((state) => state.addToCart);
