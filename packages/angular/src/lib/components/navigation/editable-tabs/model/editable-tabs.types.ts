import type { TemplateRef } from '@angular/core';

import type {
  SolarisTabsOrientation,
  SolarisTabsAppearance,
  SolarisTabsSize,
  SolarisTabsDensity,
  SolarisTabsActivationMode,
  SolarisTabsContentTransition,
} from '../../tabs';

export type SolarisEditableTabsOrientation = SolarisTabsOrientation;
export type SolarisEditableTabsAppearance = SolarisTabsAppearance;
export type SolarisEditableTabsSize = SolarisTabsSize;
export type SolarisEditableTabsDensity = SolarisTabsDensity;
export type SolarisEditableTabsActivationMode = SolarisTabsActivationMode;
export type SolarisEditableTabsContentTransition = SolarisTabsContentTransition;

export type SolarisEditableTabsShowActions = 'hover' | 'always' | 'focus-hover';
export type SolarisEditableTabsRenameOnBlur = 'confirm' | 'cancel';
export type SolarisEditableTabMoveDirection = 'left' | 'right' | 'up' | 'down';

export interface SolarisEditableTabData<TValue = unknown> {
  value: TValue;
  label?: string;
  labelKey?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  locked?: boolean;
  renamable?: boolean;
  removable?: boolean;
  movable?: boolean;
  defaultable?: boolean;
  customActions?: SolarisEditableTabAction[];
  content?: TemplateRef<void>;
}

export interface SolarisEditableTabAction {
  id: string;
  label?: string;
  labelKey?: string;
  icon?: string;
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  disabled?: boolean;
}

export interface SolarisEditableTabRenameEvent<TValue = unknown> {
  value: TValue;
  previousLabel: string;
  nextLabel: string;
  source: 'inline' | 'api';
}

export interface SolarisEditableTabRemoveEvent<TValue = unknown> {
  value: TValue;
  index: number;
  wasActive: boolean;
}

export interface SolarisEditableTabMoveEvent<TValue = unknown> {
  value: TValue;
  previousIndex: number;
  nextIndex: number;
  direction: SolarisEditableTabMoveDirection;
}

export interface SolarisEditableTabDefaultChangeEvent<TValue = unknown> {
  value: TValue;
  previousDefaultValue?: TValue;
}

export interface SolarisEditableTabActionEvent<TValue = unknown> {
  tabValue: TValue;
  actionId: string;
  action: SolarisEditableTabAction;
}
