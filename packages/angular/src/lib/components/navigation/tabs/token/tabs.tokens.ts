import { InjectionToken, type Signal } from '@angular/core';

import type { SolarisTabComponent } from '../components/tab/component/tab.component';
import type {
  SolarisTabsOrientation,
  SolarisTabsAppearance,
  SolarisTabsSize,
  SolarisTabsDensity,
  SolarisTabsActivationMode,
  SolarisTabsContentTransition,
} from '../components/root/model/tabs.types';

export interface SolarisTabsControl {
  value: Signal<string | number | undefined>;
  tabs: Signal<ReadonlyArray<SolarisTabComponent>>;
  orientation: Signal<SolarisTabsOrientation>;
  appearance: Signal<SolarisTabsAppearance>;
  size: Signal<SolarisTabsSize>;
  effectiveDensity: Signal<SolarisTabsDensity>;
  disabled: Signal<boolean>;
  activationMode: Signal<SolarisTabsActivationMode>;
  contentTransition: Signal<SolarisTabsContentTransition>;
  activateTab: (tab: SolarisTabComponent) => void;
  focusTab: (tab: SolarisTabComponent) => void;
  generateTabId: (value: string | number) => string;
  generatePanelId: (value: string | number) => string;
}

export const SOLARIS_TABS = new InjectionToken<SolarisTabsControl>(
  'SolarisTabs',
);
