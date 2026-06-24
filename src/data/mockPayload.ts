/**
 * Mock JSON payload simulating production backend gateway response
 * Represents heavy operational payload with all component types
 */

import { HomepagePayload, CampaignConfig } from '../types/components';

export const mockHomepagePayload: HomepagePayload = {
  version: '1.0.0',
  theme: {
    primary: '#FF9933',
    background: '#FFF5E6',
  },
  components: [
    {
      id: 'hero_1',
      type: 'BANNER_HERO',
      imageUrl: 'https://picsum.photos/400/200',
      title: 'Summer Sale - Up to 70% Off!',
      subtitle: 'Limited time offer on all categories',
      action: {
        type: 'DEEP_LINK',
        payload: { url: '/category/sale' },
      },
    },
    {
      id: 'grid_featured',
      type: 'PRODUCT_GRID_2X2',
      products: [
        {
          id: 'p1',
          name: 'Wireless Headphones',
          price: 79.99,
          imageUrl: 'https://picsum.photos/150/150?random=1',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'p1', quantity: 1 },
          },
        },
        {
          id: 'p2',
          name: 'Smart Watch',
          price: 199.99,
          imageUrl: 'https://picsum.photos/150/150?random=2',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'p2', quantity: 1 },
          },
        },
        {
          id: 'p3',
          name: 'Phone Case',
          price: 24.99,
          imageUrl: 'https://picsum.photos/150/150?random=3',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'p3', quantity: 1 },
          },
        },
        {
          id: 'p4',
          name: 'USB-C Cable',
          price: 12.99,
          imageUrl: 'https://picsum.photos/150/150?random=4',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'p4', quantity: 1 },
          },
        },
      ],
    },
    {
      id: 'collection_electronics',
      type: 'DYNAMIC_COLLECTION',
      title: 'Trending Electronics',
      subtitle: 'Hot deals this week',
      items: [
        {
          id: 'e1',
          name: 'Laptop',
          price: 899.99,
          imageUrl: 'https://picsum.photos/150/150?random=10',
          action: { type: 'DEEP_LINK', payload: { url: '/product/e1' } },
        },
        {
          id: 'e2',
          name: 'Tablet',
          price: 449.99,
          imageUrl: 'https://picsum.photos/150/150?random=11',
          action: { type: 'DEEP_LINK', payload: { url: '/product/e2' } },
        },
        {
          id: 'e3',
          name: 'Keyboard',
          price: 89.99,
          imageUrl: 'https://picsum.photos/150/150?random=12',
          action: { type: 'DEEP_LINK', payload: { url: '/product/e3' } },
        },
        {
          id: 'e4',
          name: 'Mouse',
          price: 39.99,
          imageUrl: 'https://picsum.photos/150/150?random=13',
          action: { type: 'DEEP_LINK', payload: { url: '/product/e4' } },
        },
        {
          id: 'e5',
          name: 'Monitor',
          price: 299.99,
          imageUrl: 'https://picsum.photos/150/150?random=14',
          action: { type: 'DEEP_LINK', payload: { url: '/product/e5' } },
        },
      ],
    },
    {
      id: 'collection_home',
      type: 'DYNAMIC_COLLECTION',
      title: 'Lunchboxes & Bags',
      subtitle: 'Perfect for school',
      items: [
        {
          id: 'h1',
          name: 'Insulated Lunchbox',
          price: 29.99,
          imageUrl: 'https://picsum.photos/150/150?random=20',
          action: { type: 'ADD_TO_CART', payload: { id: 'h1', quantity: 1 } },
        },
        {
          id: 'h2',
          name: 'Backpack',
          price: 49.99,
          imageUrl: 'https://picsum.photos/150/150?random=21',
          action: { type: 'ADD_TO_CART', payload: { id: 'h2', quantity: 1 } },
        },
        {
          id: 'h3',
          name: 'Water Bottle',
          price: 19.99,
          imageUrl: 'https://picsum.photos/150/150?random=22',
          action: { type: 'ADD_TO_CART', payload: { id: 'h3', quantity: 1 } },
        },
        {
          id: 'h4',
          name: 'Pencil Case',
          price: 14.99,
          imageUrl: 'https://picsum.photos/150/150?random=23',
          action: { type: 'ADD_TO_CART', payload: { id: 'h4', quantity: 1 } },
        },
      ],
    },
    {
      id: 'grid_deals',
      type: 'PRODUCT_GRID_2X2',
      products: [
        {
          id: 'd1',
          name: 'Bluetooth Speaker',
          price: 59.99,
          imageUrl: 'https://picsum.photos/150/150?random=30',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'd1', quantity: 1 },
          },
        },
        {
          id: 'd2',
          name: 'Fitness Tracker',
          price: 129.99,
          imageUrl: 'https://picsum.photos/150/150?random=31',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'd2', quantity: 1 },
          },
        },
        {
          id: 'd3',
          name: 'Power Bank',
          price: 39.99,
          imageUrl: 'https://picsum.photos/150/150?random=32',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'd3', quantity: 1 },
          },
        },
        {
          id: 'd4',
          name: 'Car Charger',
          price: 19.99,
          imageUrl: 'https://picsum.photos/150/150?random=33',
          action: {
            type: 'ADD_TO_CART',
            payload: { id: 'd4', quantity: 1 },
          },
        },
      ],
    },
  ],
};

/**
 * Campaign configurations for live campaign switching
 */
export const campaignConfigs: Record<string, CampaignConfig> = {
  back_to_school: {
    id: 'back_to_school',
    theme: {
      primary: '#FFD700',
      background: '#1E40AF',
    },
    lottieAssetUrl: 'https://assets.example.com/lottie/paper_airplane.json',
    targetCollections: ['collection_home'],
  },
  summer_playhouse: {
    id: 'summer_playhouse',
    theme: {
      primary: '#00BFFF',
      background: '#87CEEB',
    },
    overlay: {
      type: 'FULL_SCREEN_OVERLAY',
      animation_url: 'https://assets.example.com/webp/water_splash.webp',
      pointerEvents: 'none',
    },
  },
  mystery_carnival: {
    id: 'mystery_carnival',
    theme: {
      primary: '#FF0000',
      background: '#8B0000',
    },
    overlay: {
      type: 'FULL_SCREEN_OVERLAY',
      animation_url: 'https://assets.example.com/lottie/confetti_carnival.json',
      pointerEvents: 'none',
    },
  },
};
