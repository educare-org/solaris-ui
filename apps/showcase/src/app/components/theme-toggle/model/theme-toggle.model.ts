export type ShowcaseBaseTheme = 'light' | 'dark' | 'system';
export type ShowcaseColorScheme =
  | ShowcaseBaseTheme
  | 'high-contrast'
  | 'high-contrast-dark';
export const STORAGE_KEY = 'solaris-theme';
export const HIGH_CONTRAST_STORAGE_KEY = 'solaris-high-contrast';
