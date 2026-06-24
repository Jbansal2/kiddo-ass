/**
 * Homepage Renderer - Master Component
 * 
 * CRITICAL PERFORMANCE REQUIREMENTS:
 * - Single vertical FlashList containing all components
 * - Strict keyExtractor for index stability
 * - React.memo boundaries on all child components
 * - No prop drilling - uses Context API for shared state
 * 
 * RENDERING ARCHITECTURE:
 * - Component Registry dynamically maps backend types to React components
 * - Unknown types gracefully fallback without crashing
 * - Campaign overlays rendered outside scroll view with pointerEvents="none"
 */

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ComponentBlock } from '../types/components';
import { BlockRenderer } from '../components/BlockRenderer';
import { CampaignOverlay } from '../components/CampaignOverlay';
import { useTheme } from '../context/ThemeContext';

interface HomepageRendererProps {
  components: ComponentBlock[];
  campaignOverlay?: any;
}

export const HomepageRenderer: React.FC<HomepageRendererProps> = ({
  components,
  campaignOverlay,
}) => {
  const { theme } = useTheme();

  // Stable key extractor based on component ID
  const keyExtractor = useCallback((item: ComponentBlock, index: number) => {
    return item.id || `component-${index}`;
  }, []);

  // Dynamic component type resolver
  const getItemType = useCallback((item: ComponentBlock) => {
    return item.type;
  }, []);

  // Render item with BlockRenderer (explicit isolation layer)
  const renderItem = useCallback(({ item, index }: { item: ComponentBlock; index: number }) => {
    return <BlockRenderer block={item} index={index} />;
  }, []);

  // Estimated item sizes for different component types
  const estimatedItemSize = useMemo(() => {
    return 200; // Average height
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <FlashList
        data={components}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={estimatedItemSize}
        showsVerticalScrollIndicator={false}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        updateCellsBatchingPeriod={50}
        // CRITICAL: Enables optimal nested horizontal scroll performance
        drawDistance={400}
      />

      {/* Campaign Overlay - rendered outside scroll context */}
      {campaignOverlay && <CampaignOverlay overlay={campaignOverlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
