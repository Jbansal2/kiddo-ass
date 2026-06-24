/**
 * Component Registry using Factory Pattern
 * Maps backend component types to React component definitions
 * Implements defensive resilience for unknown component types
 */

import { ComponentType } from '../types/components';
import { ComponentType as ReactComponentType } from 'react';

type ComponentMap = Record<ComponentType, ReactComponentType<any>>;

class ComponentRegistryClass {
  private registry: Partial<ComponentMap> = {};
  private fallbackComponent: ReactComponentType<any> | null = null;

  /**
   * Register a component type with its React component
   */
  register(type: ComponentType, component: ReactComponentType<any>): void {
    this.registry[type] = component;
  }

  /**
   * Register fallback component for unknown types
   */
  registerFallback(component: ReactComponentType<any>): void {
    this.fallbackComponent = component;
  }

  /**
   * Retrieve component by type with defensive fallback
   * RESILIENCE CRITICAL: Must gracefully handle unknown types
   */
  getComponent(type: string): ReactComponentType<any> | null {
    // Type guard: check if type is registered
    if (this.isValidComponentType(type)) {
      return this.registry[type as ComponentType] || this.fallbackComponent;
    }

    // Unknown type - log warning and return fallback
    if (__DEV__) {
      console.warn(
        `[ComponentRegistry] Unknown component type: "${type}". Using fallback component.`
      );
    }

    return this.fallbackComponent;
  }

  /**
   * Type guard to check if string is valid ComponentType
   */
  private isValidComponentType(type: string): type is ComponentType {
    return type in this.registry;
  }

  /**
   * Get all registered component types (for debugging)
   */
  getRegisteredTypes(): ComponentType[] {
    return Object.keys(this.registry) as ComponentType[];
  }

  /**
   * Check if a component type is registered
   */
  isRegistered(type: string): boolean {
    return this.isValidComponentType(type) && !!this.registry[type as ComponentType];
  }
}

// Singleton instance
export const ComponentRegistry = new ComponentRegistryClass();
