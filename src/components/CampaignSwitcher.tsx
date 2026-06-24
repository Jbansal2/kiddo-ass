/**
 * Campaign Switcher Component
 * Debug/Demo tool for switching between live campaigns
 * In production, campaign switching would be driven by server config
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCampaign } from '../context/CampaignContext';
import { useTheme } from '../context/ThemeContext';
import { CampaignId } from '../types/components';
import { campaignConfigs } from '../data/mockPayload';

const campaigns: { id: CampaignId | null; label: string }[] = [
  { id: null, label: 'Default' },
  { id: 'back_to_school', label: 'Back to School' },
  { id: 'summer_playhouse', label: 'Summer Playhouse' },
  { id: 'mystery_carnival', label: 'Mystery Carnival' },
];

const CampaignSwitcherComponent: React.FC = () => {
  const { activeCampaign, switchCampaign } = useCampaign();
  const { setTheme } = useTheme();

  const handleSwitch = (campaignId: CampaignId | null) => {
    console.log('[CampaignSwitcher] Switching to:', campaignId);
    
    if (campaignId) {
      // Get campaign config from mockPayload
      const campaignConfig = campaignConfigs[campaignId];
      
      if (campaignConfig) {
        console.log('[CampaignSwitcher] Campaign config:', campaignConfig);
        
        // Switch campaign (updates CampaignContext)
        switchCampaign(campaignId);
        
        // Update theme
        setTheme(campaignConfig.theme);
        
        console.log('[CampaignSwitcher] ✅ Campaign switched successfully');
      } else {
        console.warn('[CampaignSwitcher] Campaign config not found:', campaignId);
      }
    } else {
      // Reset to default
      switchCampaign(null);
      setTheme({ primary: '#FF9933', background: '#FFF5E6' });
      console.log('[CampaignSwitcher] ✅ Reset to default');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaign:</Text>
      <View style={styles.buttons}>
        {campaigns.map(({ id, label }) => {
          const isActive = activeCampaign?.id === id || (!activeCampaign && !id);
          return (
            <TouchableOpacity
              key={id || 'default'}
              style={[
                styles.button,
                isActive && styles.buttonActive,
              ]}
              onPress={() => handleSwitch(id)}
            >
              <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 11,
    color: '#333',
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export const CampaignSwitcher = memo(CampaignSwitcherComponent);
