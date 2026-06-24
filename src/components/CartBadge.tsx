/**
 * Cart Badge Component
 * Displays cart item count in header
 * Performance: Isolated re-render boundary using Zustand selector
 * 
 * PROOF: Only this component re-renders on cart changes!
 */

import React, { memo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCartCount } from '../store/cartStore';
import { useTheme } from '../context/ThemeContext';

interface CartBadgeProps {
  onPress?: () => void;
}

const CartBadgeComponent: React.FC<CartBadgeProps> = ({ onPress }) => {
  const cartCount = useCartCount(); // Zustand selector
  const { theme } = useTheme();
  const renderCount = useRef(0);

  renderCount.current += 1;

  useEffect(() => {
    if (__DEV__) {
      console.log(`[CartBadge] 🛒 Re-rendered! Count: ${cartCount}, Renders: ${renderCount.current}`);
    }
  }, [cartCount]);

  // Debug: Log on mount
  useEffect(() => {
    console.log('[CartBadge] Component mounted');
  }, []);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🛒</Text>
        {cartCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={styles.badgeText}>
              {cartCount > 99 ? '99+' : cartCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// Only re-render when cart count changes
export const CartBadge = memo(CartBadgeComponent);
