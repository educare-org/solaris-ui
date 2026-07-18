import { InjectionToken, type Signal } from '@angular/core';

import type {
  SolarisSegmentedControlOrientation,
  SolarisSegmentedControlAppearance,
  SolarisSegmentedControlSize,
  SolarisSegmentedControlDensity,
  SolarisSegmentedControlRadius,
} from '../model/segmented-control.types';
import type { SolarisSegmentedItemComponent } from '../item/segmented-item.component';

export interface SolarisSegmentedControlInterface {
  value: Signal<unknown>;
  items: Signal<ReadonlyArray<SolarisSegmentedItemComponent>>;
  orientation: Signal<SolarisSegmentedControlOrientation>;
  appearance: Signal<SolarisSegmentedControlAppearance>;
  size: Signal<SolarisSegmentedControlSize>;
  density: Signal<SolarisSegmentedControlDensity>;
  radius: Signal<SolarisSegmentedControlRadius>;
  disabled: Signal<boolean>;
  readonly: Signal<boolean>;
  invalid: Signal<boolean>;
  fullWidth: Signal<boolean>;
  equalWidth: Signal<boolean>;
  indicator: Signal<boolean>;
  compareFn: Signal<(a: unknown, b: unknown) => boolean>;
  selectItem: (item: SolarisSegmentedItemComponent) => void;
  focusItem: (item: SolarisSegmentedItemComponent) => void;
}

export const SOLARIS_SEGMENTED_CONTROL =
  new InjectionToken<SolarisSegmentedControlInterface>(
    'SolarisSegmentedControl',
  );
