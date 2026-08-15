import type {
  SolarisFormFieldAppearance,
  SolarisFormFieldDensity,
  SolarisFormFieldRadius,
} from '../../form-field';

export type DomainCheckFn = (
  normalizedDomains: string[],
  domain: string,
) => boolean;
export type SolarisEmailFieldAppearance = SolarisFormFieldAppearance;
export type SolarisEmailFieldDensity = SolarisFormFieldDensity;
export type SolarisEmailFieldRadius = SolarisFormFieldRadius;
