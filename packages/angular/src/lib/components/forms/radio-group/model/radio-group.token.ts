import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisRadioGroupDensity,
  SolarisRadioGroupSize,
} from './radio-group.types';

export const SOLARIS_RADIO_GROUP_NAME = new InjectionToken<string>(
  'SOLARIS_RADIO_GROUP_NAME',
);

/**
 * Parent control contract for `solaris-radio` children.
 *
 * Lets a standalone-capable radio inherit `size`/`density` from the
 * enclosing `solaris-radio-group` without its own inputs being overridden:
 * the child resolves own input → group → default (`md` / theme density).
 */
export interface SolarisRadioGroupControl {
  readonly size: Signal<SolarisRadioGroupSize>;
  readonly effectiveDensity: Signal<SolarisRadioGroupDensity>;
}

export const SOLARIS_RADIO_GROUP = new InjectionToken<SolarisRadioGroupControl>(
  'SolarisRadioGroup',
);
