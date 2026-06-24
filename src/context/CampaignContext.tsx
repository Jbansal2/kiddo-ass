/**
 * Campaign Context for Live Campaign Management
 * Enables runtime switching of campaigns without app updates
 * Handles theme injection and overlay configuration
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CampaignConfig, CampaignId } from '../types/components';
import { campaignConfigs } from '../data/mockPayload';

interface CampaignContextValue {
  activeCampaign: CampaignConfig | null;
  switchCampaign: (campaignId: CampaignId | null) => void;
  getCampaign: (campaignId: CampaignId) => CampaignConfig | undefined;
}

const CampaignContext = createContext<CampaignContextValue | undefined>(undefined);

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [activeCampaign, setActiveCampaign] = useState<CampaignConfig | null>(null);

  const switchCampaign = useCallback((campaignId: CampaignId | null) => {
    if (!campaignId) {
      setActiveCampaign(null);
      return;
    }

    const campaign = campaignConfigs[campaignId];
    if (campaign) {
      setActiveCampaign(campaign);
      if (__DEV__) {
        console.log(`[Campaign] Switched to: ${campaignId}`);
      }
    } else {
      console.warn(`[Campaign] Unknown campaign ID: ${campaignId}`);
    }
  }, []);

  const getCampaign = useCallback((campaignId: CampaignId) => {
    return campaignConfigs[campaignId];
  }, []);

  return (
    <CampaignContext.Provider value={{ activeCampaign, switchCampaign, getCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = (): CampaignContextValue => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within CampaignProvider');
  }
  return context;
};
