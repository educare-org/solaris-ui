export type SolarisStepperOrientation = 'horizontal' | 'vertical';

export type SolarisStepperAppearance = 'default' | 'card' | 'dashed';

export type SolarisStepperSize = 'sm' | 'md' | 'lg';

export type SolarisStepperDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisStepperStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'warning'
  | 'error'
  | 'disabled';

export type SolarisStepperContentTransition = 'none' | 'fade' | 'slide';

export type SolarisStepperActionsAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between';

export interface SolarisStepperChangeEvent {
  activeIndex: number;
  previousIndex: number;
}

export interface SolarisStepClickEvent {
  index: number;
  label: string | undefined;
}

export type SolarisStepperBlockReason = 'enter' | 'exit';

export interface SolarisStepperBlockedEvent {
  index: number;
  from: number;
  reason: SolarisStepperBlockReason;
}
