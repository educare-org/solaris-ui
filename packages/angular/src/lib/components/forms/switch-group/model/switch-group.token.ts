import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisSwitchGroupDensity,
  SolarisSwitchGroupSize,
} from './switch-group.types';

/**
 * Parent control contract for `solaris-switch` children.
 *
 * Lets a standalone-capable switch inherit `size`/`density` from the
 * enclosing `solaris-switch-group` without its own inputs being overridden:
 * the child resolves own input → group → default (`md` / theme density).
 */
export interface SolarisSwitchGroupControl {
  readonly size: Signal<SolarisSwitchGroupSize>;
  readonly effectiveDensity: Signal<SolarisSwitchGroupDensity>;
}

export const SOLARIS_SWITCH_GROUP =
  new InjectionToken<SolarisSwitchGroupControl>('SolarisSwitchGroup');
