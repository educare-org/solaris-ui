import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisFormFieldDensity,
  SolarisFormFieldSize,
} from './form-field.types';

/**
 * Parent control contract for projected form controls.
 *
 * Lets a standalone-capable control (`solaris-input`, `solaris-textarea`)
 * inherit `size`/`density` from the enclosing `solaris-form-field` without
 * its own inputs being overridden: each directive resolves own input →
 * field → default (`md` / theme density).
 */
export interface SolarisFormFieldParentControl {
  readonly size: Signal<SolarisFormFieldSize>;
  readonly effectiveDensity: Signal<SolarisFormFieldDensity>;
}

export const SOLARIS_FORM_FIELD =
  new InjectionToken<SolarisFormFieldParentControl>('SolarisFormField');
