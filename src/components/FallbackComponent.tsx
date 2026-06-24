/**
 * Fallback Component for unknown component types
 * RESILIENCE CRITICAL: Renders gracefully without crashing
 * Drops unrecognized nodes quietly to preserve view tree stability
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

interface FallbackComponentProps {
  data: any;
}

const FallbackComponentInternal: React.FC<FallbackComponentProps> = ({ data }) => {
  // Log warning in development
  if (__DEV__) {
    console.warn(
      `[FallbackComponent] Rendering fallback for unknown type: "${data?.type}"`
    );
  }

  // Render empty view - silent failure preserves layout stability
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 0,
    width: 0,
  },
});

export const FallbackComponent = memo(FallbackComponentInternal);
