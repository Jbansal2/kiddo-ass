/**
 * ProductCard Component
 * Atomic product display with memo isolation
 * CRITICAL: Must prevent re-renders when cart updates
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ProductItem } from '../types/components';
import { actionDispatcher } from '../utils/actionDispatcher';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: ProductItem;
  width?: number;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ 
  product, 
  width = 150 
}) => {
  const { theme } = useTheme();
  const { imageUrl, name, price, action } = product;

  const handlePress = useCallback(() => {
    actionDispatcher.dispatch(action);
  }, [action]);

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: width - 16, height: width - 16 }]}
        resizeMode="cover"
      />
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      <Text style={[styles.price, { color: theme.primary }]}>
        ${price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    borderRadius: 6,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Critical memo optimization with custom comparison
export const ProductCard = memo(ProductCardComponent, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.product.price === next.product.price &&
    prev.width === next.width
  );
});
