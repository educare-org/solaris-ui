export interface SolarisThemeConfig {
  colorScheme?:
    | 'light'
    | 'dark'
    | 'system'
    | 'high-contrast'
    | 'high-contrast-dark';
  density?: 'compact' | 'normal' | 'comfortable';
  reducedMotion?: 'auto' | 'reduce' | 'no-preference';
}
