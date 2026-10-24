export type SolarisTabsAppearance = 'underline' | 'pills' | 'enclosed';

export type SolarisTabsSize = 'sm' | 'md' | 'lg';

export type SolarisTabsColor = 'primary' | 'neutral';

export type SolarisTabsDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisTabsContentTransition = 'none' | 'fade' | 'slide';

export type SolarisTabsActivationMode = 'automatic' | 'manual';

export type SolarisTabsOrientation = 'horizontal' | 'vertical';

export type SolarisTabsShape = 'normal' | 'wide';

export type SolarisTabsValue = string | number | undefined;

export interface SolarisTabsValueChangeEvent {
  value: SolarisTabsValue;
}

export interface SolarisTabsChangeEvent {
  value: SolarisTabsValue;
  previousValue: SolarisTabsValue;
}

export interface SolarisTabClickEvent {
  value: string | number;
  label: string | undefined;
}
