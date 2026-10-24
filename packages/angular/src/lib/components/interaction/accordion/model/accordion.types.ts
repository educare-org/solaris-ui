export type SolarisAccordionAppearance = 'boxed' | 'lined' | 'plain';

export type SolarisAccordionType = 'single' | 'multiple';

export type SolarisAccordionSize = 'sm' | 'md' | 'lg';

export type SolarisAccordionDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisAccordionValue = string | number;

export type SolarisAccordionModel =
  | SolarisAccordionValue
  | SolarisAccordionValue[];

export interface SolarisAccordionConfig {
  appearance?: SolarisAccordionAppearance;
  type?: SolarisAccordionType;
  size?: SolarisAccordionSize;
  density?: SolarisAccordionDensity;
  disabled?: boolean;
  allowToggle?: boolean;
  headingLevel?: number;
  expandIcon?: string;
  value?: SolarisAccordionModel;
}
