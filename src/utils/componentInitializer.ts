/**
 * Component Initializer
 * Registers all components with the Component Registry
 * Must be called before rendering begins
 */

import { ComponentRegistry } from '../registry/ComponentRegistry';
import { BannerHero } from '../components/BannerHero';
import { ProductGrid } from '../components/ProductGrid';
import { DynamicCollection } from '../components/DynamicCollection';
import { FallbackComponent } from '../components/FallbackComponent';

export function initializeComponents(): void {
  // Register known component types
  ComponentRegistry.register('BANNER_HERO', BannerHero);
  ComponentRegistry.register('PRODUCT_GRID_2X2', ProductGrid);
  ComponentRegistry.register('DYNAMIC_COLLECTION', DynamicCollection);

  // Register fallback for unknown types
  ComponentRegistry.registerFallback(FallbackComponent);

  if (__DEV__) {
    console.log(
      '[ComponentInitializer] Registered components:',
      ComponentRegistry.getRegisteredTypes()
    );
  }
}
