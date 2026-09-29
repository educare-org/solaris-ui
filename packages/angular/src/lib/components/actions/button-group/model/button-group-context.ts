import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisButtonGroupDensity,
  SolarisButtonGroupSize,
} from './button-group.types';

/**
 * Context exposed by `solaris-button-group` to projected
 * `[solaris-button]` and `[solaris-icon-button]` children.
 *
 * When present, the group forces `size` and `density` onto its children
 * so every item renders with the same outer height.
 */
export interface SolarisButtonGroupContext {
  readonly size: Signal<SolarisButtonGroupSize>;
  readonly effectiveDensity: Signal<SolarisButtonGroupDensity>;
}

export const SOLARIS_BUTTON_GROUP_CONTEXT =
  new InjectionToken<SolarisButtonGroupContext>('SOLARIS_BUTTON_GROUP_CONTEXT');
