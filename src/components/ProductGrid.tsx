/**
 * PRODUCT_GRID_2X2 Component
 * 2x2 grid structure for product catalog items
 * Performance: Optimized with memo boundaries and FlatList keyExtractor
 */

import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ProductGridBlock } from '../types/components';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  data: ProductGridBlock;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ data }) => {
  const { products } = data;
  const cardWidth = (Dimensions.get('window').width - 48) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {products.slice(0, 2).map(product => (
          <ProductCard key={product.id} product={product} width={cardWidth} />
        ))}
      </View>
      <View style={styles.row}>
        {products.slice(2, 4).map(product => (
          <ProductCard key={product.id} product={product} width={cardWidth} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export const ProductGrid = memo(ProductGridComponent);
