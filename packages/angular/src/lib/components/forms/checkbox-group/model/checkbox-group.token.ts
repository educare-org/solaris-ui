import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisCheckboxGroupDensity,
  SolarisCheckboxGroupSize,
} from './checkbox-group.types';

/**
 * Parent control contract for `solaris-checkbox` children.
 *
 * Lets a standalone-capable checkbox inherit `size`/`density` from the
 * enclosing `solaris-checkbox-group` without its own inputs being overridden:
 * the child resolves own input → group → default (`md` / theme density).
 */
export interface SolarisCheckboxGroupControl {
  readonly size: Signal<SolarisCheckboxGroupSize>;
  readonly effectiveDensity: Signal<SolarisCheckboxGroupDensity>;
}

export const SOLARIS_CHECKBOX_GROUP =
  new InjectionToken<SolarisCheckboxGroupControl>('SolarisCheckboxGroup');
