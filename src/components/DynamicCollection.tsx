/**
 * DYNAMIC_COLLECTION Component
 * CRITICAL: Horizontal FlatList nested within vertical scroll
 * Must prevent interference with parent scroll momentum
 * 
 * Virtualization Boundaries:
 * - Uses FlashList for high frame-rate rendering
 * - Implements nestedScrollEnabled for gesture coordination
 * - Memoized renderItem to prevent excessive re-renders
 */

import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { DynamicCollectionBlock, ProductItem } from '../types/components';
import { ProductCard } from './ProductCard';
import { useTheme } from '../context/ThemeContext';

interface DynamicCollectionProps {
  data: DynamicCollectionBlock;
}

const DynamicCollectionComponent: React.FC<DynamicCollectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const { title, subtitle, items } = data;

  // Stable key extractor
  const keyExtractor = useCallback((item: ProductItem) => item.id, []);

  // Memoized render function with stable reference
  const renderItem = useCallback(
    ({ item }: { item: ProductItem }) => (
      <ProductCard product={item} width={150} />
    ),
    []
  );

  // Estimated item size for FlashList optimization
  const getItemType = useCallback(() => 'product-card', []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        estimatedItemSize={166}
        getItemType={getItemType}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // CRITICAL: Prevents breaking vertical scroll momentum
        nestedScrollEnabled={false}
        // Performance optimization
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={7}
        initialNumToRender={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export const DynamicCollection = memo(DynamicCollectionComponent);
