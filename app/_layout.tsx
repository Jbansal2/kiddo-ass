/**
 * Root Layout - Expo Router
 * Sets up all context providers and initializes component registry
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider } from '../src/context/ThemeContext';
import { CampaignProvider } from '../src/context/CampaignContext';
import { initializeComponents } from '../src/utils/componentInitializer';
import { actionDispatcher } from '../src/utils/actionDispatcher';

export default function RootLayout() {
  useEffect(() => {
    // Initialize component registry on app start
    initializeComponents();

    // Register action handlers
    actionDispatcher.registerHandlers({
      onAddToCart: (productId, quantity) => {
        // Will be connected to CartContext
        if (__DEV__) {
          console.log(`[Action] Add to cart: ${productId} x${quantity}`);
        }
      },
      onNavigate: (url) => {
        if (__DEV__) {
          console.log(`[Action] Navigate to: ${url}`);
        }
      },
      onCouponApply: (couponCode) => {
        if (__DEV__) {
          console.log(`[Action] Apply coupon: ${couponCode}`);
        }
      },
      onVideoPlay: (videoUrl) => {
        if (__DEV__) {
          console.log(`[Action] Play video: ${videoUrl}`);
        }
      },
    });
  }, []);

  return (
    <ThemeProvider>
      <CampaignProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </CampaignProvider>
    </ThemeProvider>
  );
}
