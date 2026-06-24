/**
 * Core type definitions for the component registry system
 * Strict typing for dynamic layout components with defensive resilience
 */

export type ComponentType = 
  | 'BANNER_HERO' 
  | 'PRODUCT_GRID_2X2' 
  | 'DYNAMIC_COLLECTION'
  | 'FULL_SCREEN_OVERLAY';

export type ActionType = 
  | 'ADD_TO_CART' 
  | 'DEEP_LINK' 
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'NAVIGATE'
  | 'VIDEO_PLAY';

/**
 * Universal action schema for all interactive components
 */
export interface ActionSchema {
  type: ActionType;
  payload: Record<string, any>;
}

/**
 * Theme configuration for OTA theming injection
 */
export interface ThemeConfig {
  primary: string;
  background: string;
  [key: string]: string;
}

/**
 * Campaign overlay configuration for live campaigns
 */
export interface CampaignOverlay {
  type: 'FULL_SCREEN_OVERLAY';
  animation_url: string;
  pointerEvents?: 'none' | 'auto';
}

/**
 * Base component block interface
 */
export interface BaseComponentBlock {
  id: string;
  type: ComponentType;
  action?: ActionSchema;
}

/**
 * BANNER_HERO component definition
 */
export interface BannerHeroBlock extends BaseComponentBlock {
  type: 'BANNER_HERO';
  imageUrl: string;
  title: string;
  subtitle?: string;
  action?: ActionSchema;
}

/**
 * Product item for grid display
 */
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  action?: ActionSchema;
}

/**
 * PRODUCT_GRID_2X2 component definition
 */
export interface ProductGridBlock extends BaseComponentBlock {
  type: 'PRODUCT_GRID_2X2';
  products: ProductItem[];
}

/**
 * DYNAMIC_COLLECTION component definition
 * Critical: Horizontal FlatList nested in vertical scroll
 */
export interface DynamicCollectionBlock extends BaseComponentBlock {
  type: 'DYNAMIC_COLLECTION';
  title: string;
  subtitle?: string;
  items: ProductItem[];
  theme?: Partial<ThemeConfig>;
}

/**
 * Union type for all component blocks
 */
export type ComponentBlock = 
  | BannerHeroBlock 
  | ProductGridBlock 
  | DynamicCollectionBlock;

/**
 * Root payload structure from backend
 */
export interface HomepagePayload {
  version: string;
  theme: ThemeConfig;
  components: ComponentBlock[];
  campaign?: CampaignOverlay;
}

/**
 * Campaign context definitions
 */
export type CampaignId = 'back_to_school' | 'summer_playhouse' | 'mystery_carnival';

export interface CampaignConfig {
  id: CampaignId;
  theme: ThemeConfig;
  overlay?: CampaignOverlay;
  targetCollections?: string[];
  lottieAssetUrl?: string;
  videoUrl?: string;
  specialComponents?: ComponentBlock[];
}
