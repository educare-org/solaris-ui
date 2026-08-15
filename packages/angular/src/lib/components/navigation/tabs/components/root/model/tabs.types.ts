export type SolarisTabsOrientation = 'horizontal' | 'vertical';

export type SolarisTabsAppearance = 'underline' | 'pills' | 'enclosed';

export type SolarisTabsDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisTabsActivationMode = 'automatic' | 'manual';

export type SolarisTabsContentTransition = 'none' | 'fade' | 'slide';

export interface SolarisTabsValueChangeEvent {
  value: string | number | undefined;
}

export interface SolarisTabsChangeEvent {
  value: string | number | undefined;
  previousValue: string | number | undefined;
}

export interface SolarisTabClickEvent {
  value: string | number;
  label: string | undefined;
}
