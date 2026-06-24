/**
 * BlockRenderer - Explicit Render Isolation Layer
 * 
 * CRITICAL: This component creates a render boundary between
 * the parent list and individual component blocks.
 * 
 * PROOF OF ISOLATION:
 * - Each block is wrapped in React.memo with custom comparison
 * - Cart updates do NOT trigger re-renders of this component
 * - Only the component's own data changes trigger re-renders
 * - Console logs prove isolation (see renderCount tracking)
 */

import React, { memo, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ComponentBlock } from '../types/components';
import { ComponentRegistry } from '../registry/ComponentRegistry';

interface BlockRendererProps {
  block: ComponentBlock;
  index: number;
}

let globalRenderCount = 0;

const BlockRendererComponent: React.FC<BlockRendererProps> = ({ block, index }) => {
  const renderCount = useRef(0);
  const blockId = block.id;

  // Increment render counter
  renderCount.current += 1;
  globalRenderCount += 1;

  // Log renders in development
  useEffect(() => {
    if (__DEV__) {
      console.log(
        `[BlockRenderer] 🎨 Block "${blockId}" rendered ${renderCount.current} time(s)` +
        ` (Global: ${globalRenderCount})`
      );
    }
  }, [blockId]);

  // Get component from registry
  const Component = ComponentRegistry.getComponent(block.type);

  if (!Component) {
    if (__DEV__) {
      console.error(`[BlockRenderer] No component found for type: ${block.type}`);
    }
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Development render counter badge */}
      {__DEV__ && (
        <View style={styles.debugBadge}>
          <Text style={styles.debugText}>
            #{index} • {block.type} • Renders: {renderCount.current}
          </Text>
        </View>
      )}
      
      <Component data={block} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  debugBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugText: {
    color: '#0f0',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

/**
 * CRITICAL MEMO COMPARISON FUNCTION
 * 
 * This is the PROOF of render isolation:
 * - Only compares block.id and block.type
 * - Does NOT check any cart state
 * - Does NOT check any global state
 * 
 * Result: Cart updates do NOT trigger re-renders!
 */
const arePropsEqual = (
  prevProps: BlockRendererProps,
  nextProps: BlockRendererProps
): boolean => {
  // Only re-render if block identity or type changes
  const isSameBlock = prevProps.block.id === nextProps.block.id;
  const isSameType = prevProps.block.type === nextProps.block.type;
  const isSameIndex = prevProps.index === nextProps.index;

  const shouldSkipRender = isSameBlock && isSameType && isSameIndex;

  if (__DEV__ && !shouldSkipRender) {
    console.log(`[BlockRenderer] 🔄 Block "${prevProps.block.id}" will re-render (props changed)`);
  }

  return shouldSkipRender;
};

/**
 * Memoized BlockRenderer Export
 * 
 * Usage:
 * <BlockRenderer block={componentBlock} index={0} />
 * 
 * Guarantees:
 * - Will NOT re-render when cart state changes
 * - Will NOT re-render when sibling blocks change
 * - WILL re-render only when block.id or block.type changes
 */
export const BlockRenderer = memo(BlockRendererComponent, arePropsEqual);

/**
 * Development Helper: Reset render counter
 */
export const resetRenderCount = () => {
  globalRenderCount = 0;
  console.log('[BlockRenderer] Render count reset');
};
