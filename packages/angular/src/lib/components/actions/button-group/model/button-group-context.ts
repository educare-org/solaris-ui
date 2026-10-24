import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisButtonGroupDensity,
  SolarisButtonGroupOrientation,
  SolarisButtonGroupSize,
} from './button-group.types';

/**
 * Context exposed by `solaris-button-group` to projected
 * `[solaris-button]` and `[solaris-icon-button]` children.
 *
 * When present, the group forces `size` and `density` onto its children
 * so every item renders with the same outer height. `attached` and
 * `orientation` let children opt into attached styling on themselves
 * (inherited CSS variables cannot default to per-button values, so the
 * group cannot restyle children through inheritance alone).
 */
export interface SolarisButtonGroupContext {
  readonly size: Signal<SolarisButtonGroupSize>;
  readonly effectiveDensity: Signal<SolarisButtonGroupDensity>;
  readonly attached: Signal<boolean>;
  readonly orientation: Signal<SolarisButtonGroupOrientation>;
}

export const SOLARIS_BUTTON_GROUP_CONTEXT =
  new InjectionToken<SolarisButtonGroupContext>('SOLARIS_BUTTON_GROUP_CONTEXT');
