/**
 * Universal Action Dispatcher
 * Centralized handler for all component actions
 * Components remain decoupled from business logic
 */

import { ActionSchema } from '../types/components';

interface ActionHandlers {
  onAddToCart?: (productId: string, quantity: number) => void;
  onNavigate?: (url: string) => void;
  onCouponApply?: (couponCode: string) => void;
  onVideoPlay?: (videoUrl: string) => void;
}

export class ActionDispatcher {
  private handlers: ActionHandlers = {};

  /**
   * Register action handlers
   */
  registerHandlers(handlers: ActionHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Dispatch action based on type
   * CRITICAL: Must be synchronous and non-blocking
   */
  dispatch(action: ActionSchema | undefined): void {
    if (!action) return;

    try {
      switch (action.type) {
        case 'ADD_TO_CART': {
          const { id, quantity = 1 } = action.payload;
          if (id && this.handlers.onAddToCart) {
            this.handlers.onAddToCart(id, quantity);
          }
          break;
        }

        case 'DEEP_LINK':
        case 'NAVIGATE': {
          const { url } = action.payload;
          if (url && this.handlers.onNavigate) {
            this.handlers.onNavigate(url);
          }
          break;
        }

        case 'APPLY_MYSTERY_GIFT_COUPON': {
          const { couponCode } = action.payload;
          if (couponCode && this.handlers.onCouponApply) {
            this.handlers.onCouponApply(couponCode);
          }
          break;
        }

        case 'VIDEO_PLAY': {
          const { videoUrl } = action.payload;
          if (videoUrl && this.handlers.onVideoPlay) {
            this.handlers.onVideoPlay(videoUrl);
          }
          break;
        }

        default:
          if (__DEV__) {
            console.warn(`[ActionDispatcher] Unknown action type: ${action.type}`);
          }
      }
    } catch (error) {
      // Defensive error handling - never crash the app
      if (__DEV__) {
        console.error('[ActionDispatcher] Error handling action:', error);
      }
    }
  }
}

// Singleton instance
export const actionDispatcher = new ActionDispatcher();
