import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { HomepageRenderer } from '../src/screens/HomepageRenderer';
import { CartBadge } from '../src/components/CartBadge';
import { CampaignSwitcher } from '../src/components/CampaignSwitcher';
import { mockHomepagePayload } from '../src/data/mockPayload';
import { useTheme } from '../src/context/ThemeContext';
import { useCampaign } from '../src/context/CampaignContext';
import { useAddToCart } from '../src/store/cartStore';
import { actionDispatcher } from '../src/utils/actionDispatcher';
import { validatePayload } from '../src/validation/payloadSchema';

export default function HomePage() {
  const { setTheme } = useTheme();
  const { activeCampaign } = useCampaign();
  const addToCart = useAddToCart();

  useEffect(() => {
    try {
      const validatedPayload = validatePayload(mockHomepagePayload);
      setTheme(validatedPayload.theme);
      console.log('[HomePage]Payload validated and theme set');
    } catch (error) {
      console.error('[HomePage]Payload validation failed:', error);
      // Fallback to default theme
      setTheme({ primary: '#FF9933', background: '#FFF5E6' });
    }
  }, []);

  useEffect(() => {
    actionDispatcher.registerHandlers({
      onAddToCart: addToCart,
      onNavigate: (url) => {
        console.log('[Navigate]', url);
      },
      onCouponApply: (couponCode) => {
        console.log('[Coupon Applied]', couponCode);
      },
      onVideoPlay: (videoUrl) => {
        console.log('[Video Play]', videoUrl);
      },
    });
  }, [addToCart]);

  const campaignOverlay = useMemo(() => {
    if (activeCampaign?.overlay) {
      console.log('[HomePage] Using campaign overlay:', activeCampaign.id);
      return activeCampaign.overlay;
    }
    return mockHomepagePayload.campaign;
  }, [activeCampaign]);

  const handleCartPress = () => {
    console.log('[Cart] Opening cart view...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CampaignSwitcher />
        </View>
        <View style={styles.headerRight}>
          <CartBadge onPress={handleCartPress} />
        </View>
      </View>

      {/* Main Content */}
      <HomepageRenderer
        components={mockHomepagePayload.components}
        campaignOverlay={campaignOverlay}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    paddingRight: 8,
  },
});
