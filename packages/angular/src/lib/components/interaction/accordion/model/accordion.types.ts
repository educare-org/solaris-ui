export type SolarisAccordionAppearance = 'boxed' | 'lined';

export type SolarisAccordionType = 'single' | 'multiple';

export type SolarisAccordionSize = 'sm' | 'md' | 'lg';

export type SolarisAccordionValue = string | number;

export type SolarisAccordionModel =
  | SolarisAccordionValue
  | SolarisAccordionValue[];

export interface SolarisAccordionConfig {
  appearance?: SolarisAccordionAppearance;
  type?: SolarisAccordionType;
  size?: SolarisAccordionSize;
  disabled?: boolean;
  allowToggle?: boolean;
  headingLevel?: number;
  expandIcon?: string;
  value?: SolarisAccordionModel;
}
