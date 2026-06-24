/**
 * BANNER_HERO Component
 * Full-width promotional graphic card
 * Performance: Optimized with React.memo and image preloading hints
 */

import React, { memo } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BannerHeroBlock } from '../types/components';
import { actionDispatcher } from '../utils/actionDispatcher';
import { useTheme } from '../context/ThemeContext';

interface BannerHeroProps {
  data: BannerHeroBlock;
}

const BannerHeroComponent: React.FC<BannerHeroProps> = ({ data }) => {
  const { theme } = useTheme();
  const { imageUrl, title, subtitle, action } = data;

  const handlePress = () => {
    actionDispatcher.dispatch(action);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}
      disabled={!action}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={[styles.overlay, { backgroundColor: theme.background + '20' }]}>
        <Text style={[styles.title, { color: theme.primary }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 200,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },
});

export const BannerHero = memo(BannerHeroComponent);
