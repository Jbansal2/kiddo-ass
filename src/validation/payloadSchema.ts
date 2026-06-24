/**
 * Payload Validation with Zod
 * Ensures type safety at runtime for backend JSON payloads
 * Catches malformed data before it reaches components
 */

import { z } from 'zod';

// Action schema validation
export const actionSchema = z.object({
  type: z.enum(['ADD_TO_CART', 'DEEP_LINK', 'NAVIGATE', 'APPLY_MYSTERY_GIFT_COUPON', 'VIDEO_PLAY']),
  payload: z.record(z.any()),
});

// Theme schema validation
export const themeSchema = z.object({
  primary: z.string(),
  background: z.string(),
}).passthrough(); // Allow additional theme keys

// Product item validation
export const productItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  action: actionSchema.optional(),
});

// Component schemas
export const bannerHeroSchema = z.object({
  id: z.string(),
  type: z.literal('BANNER_HERO'),
  imageUrl: z.string().url(),
  title: z.string(),
  subtitle: z.string().optional(),
  action: actionSchema.optional(),
});

export const productGridSchema = z.object({
  id: z.string(),
  type: z.literal('PRODUCT_GRID_2X2'),
  products: z.array(productItemSchema).length(4), // Must have exactly 4 products
});

export const dynamicCollectionSchema = z.object({
  id: z.string(),
  type: z.literal('DYNAMIC_COLLECTION'),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(productItemSchema).min(1),
  theme: themeSchema.partial().optional(),
});

// Union of all component types
export const componentBlockSchema = z.discriminatedUnion('type', [
  bannerHeroSchema,
  productGridSchema,
  dynamicCollectionSchema,
]);

// Campaign overlay validation
export const campaignOverlaySchema = z.object({
  type: z.literal('FULL_SCREEN_OVERLAY'),
  animation_url: z.string().url(),
  pointerEvents: z.enum(['none', 'auto']).optional(),
});

// Root payload validation
export const homepagePayloadSchema = z.object({
  version: z.string(),
  theme: themeSchema,
  components: z.array(componentBlockSchema),
  campaign: campaignOverlaySchema.optional(),
});

// Validation helper with detailed error reporting
export function validatePayload(data: unknown) {
  const result = homepagePayloadSchema.safeParse(data);
  
  if (!result.success) {
    if (__DEV__) {
      console.error('[Validation] Payload validation failed:');
      console.error(result.error.format());
    }
    
    throw new Error('Invalid payload structure');
  }
  
  if (__DEV__) {
    console.log('[Validation] ✅ Payload validated successfully');
  }
  
  return result.data;
}

// Individual component validation (for graceful degradation)
export function validateComponent(data: unknown) {
  const result = componentBlockSchema.safeParse(data);
  
  if (!result.success) {
    if (__DEV__) {
      console.warn('[Validation] Component validation failed:', data);
    }
    return null; // Return null for invalid components
  }
  
  return result.data;
}
