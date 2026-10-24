import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisOptionDensity,
  SolarisOptionSize,
} from '../model/option.types';

export interface SolarisOptionParent {
  readonly size: Signal<SolarisOptionSize>;
  readonly effectiveDensity: Signal<SolarisOptionDensity>;
}

export const SOLARIS_OPTION_PARENT = new InjectionToken<SolarisOptionParent>(
  'SolarisOptionParent',
);
