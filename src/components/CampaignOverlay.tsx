/**
 * Campaign Overlay Component
 * Renders full-screen visual indicator for active campaigns
 * CRITICAL: Must not block user interaction with underlying components
 * 
 * NOTE: Showing visual indicator for demo (actual Lottie/WebP can be added)
 */

import React, { memo, useState } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { CampaignOverlay as CampaignOverlayType } from '../types/components';

interface CampaignOverlayProps {
  overlay: CampaignOverlayType;
}

const CampaignOverlayComponent: React.FC<CampaignOverlayProps> = ({ overlay }) => {
  const { animation_url, pointerEvents = 'none' } = overlay;
  const [isVisible, setIsVisible] = useState(true);

  console.log('[CampaignOverlay] 🎨 Rendering overlay:', animation_url);

  // If overlay is dismissed, don't render anything
  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    console.log('[CampaignOverlay] ❌ Overlay dismissed');
    setIsVisible(false);
  };

  // Determine if URL is Lottie JSON or WebP/GIF
  const isLottie = animation_url.endsWith('.json');

  return (
    <View 
      style={styles.container} 
      pointerEvents="box-none"
    >
      {/* Close button - always clickable */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <View style={styles.closeIconContainer}>
          <Text style={styles.closeIcon}>✕</Text>
        </View>
      </TouchableOpacity>

      {/* Visual indicator overlay - blocks touches */}
      <View style={[StyleSheet.absoluteFill, styles.indicatorContainer]} pointerEvents="auto">
        <View style={styles.indicatorBox}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Campaign Overlay Active!</Text>
          <Text style={styles.subtitle}>
            {isLottie ? '🎭 Lottie Animation' : '🖼️ WebP/GIF Animation'}
          </Text>
          <Text style={styles.url} numberOfLines={1}>
            {animation_url.split('/').pop()}
          </Text>
          <Text style={styles.hint}>
            Overlay blocks touches to underlying components
          </Text>
          <Text style={styles.note}>
            ✨ Dismiss to interact with homepage
          </Text>
          
          {/* Dismiss button inside box */}
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissText}>Dismiss Overlay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: Platform.OS === 'android' ? 1000 : undefined,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1001,
    elevation: Platform.OS === 'android' ? 1001 : undefined,
  },
  closeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  url: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  dismissButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  dismissText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const CampaignOverlay = memo(CampaignOverlayComponent);
