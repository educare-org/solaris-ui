import { InjectionToken } from '@angular/core';

import type {
  SolarisStepperOrientation,
  SolarisStepperAppearance,
  SolarisStepperSize,
  SolarisStepperDensity,
} from '../components/root/model/stepper.types';

export interface SolarisStepperControl {
  activeIndex: () => number;
  steps: () => ReadonlyArray<unknown>;
  orientation: () => SolarisStepperOrientation;
  appearance: () => SolarisStepperAppearance;
  linear: () => boolean;
  size: () => SolarisStepperSize;
  density: () => SolarisStepperDensity;
  goToStep: (index: number) => void;
}

export const SOLARIS_STEPPER = new InjectionToken<SolarisStepperControl>(
  'SolarisStepper',
);
