import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisAccordionAppearance,
  SolarisAccordionType,
  SolarisAccordionSize,
  SolarisAccordionDensity,
  SolarisAccordionValue,
  SolarisAccordionModel,
} from './accordion.types';

export interface SolarisAccordionControl {
  value: Signal<SolarisAccordionModel | undefined>;
  appearance: Signal<SolarisAccordionAppearance>;
  type: Signal<SolarisAccordionType>;
  size: Signal<SolarisAccordionSize>;
  effectiveDensity: Signal<SolarisAccordionDensity>;
  disabled: Signal<boolean>;
  allowToggle: Signal<boolean>;
  headingLevel: Signal<number>;
  expandIcon: Signal<string>;
  isOpen: (value: SolarisAccordionValue | undefined) => boolean;
  toggle: (value: SolarisAccordionValue | undefined) => void;
  generatePanelId: (value: SolarisAccordionValue | undefined) => string;
  generateTriggerId: (value: SolarisAccordionValue | undefined) => string;
}

export const SOLARIS_ACCORDION = new InjectionToken<SolarisAccordionControl>(
  'SolarisAccordion',
);
