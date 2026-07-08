export interface SolarisIconPath {
  d: string;
  fillRule?: 'nonzero' | 'evenodd';
  clipRule?: 'nonzero' | 'evenodd';
}

export interface SolarisIconDefinition {
  name: string;
  viewBox: string;
  paths: SolarisIconPath[];
}
