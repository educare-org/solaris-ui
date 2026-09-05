import {
  InjectionToken,
  type InputSignal,
  type OutputEmitterRef,
} from '@angular/core';

export interface SolarisRadioOption {
  readonly value: InputSignal<unknown | undefined>;
  readonly checkedChange: OutputEmitterRef<boolean>;

  focus(): void;
  writeValue(value: boolean | null): void;
  setDisabledState(isDisabled: boolean): void;
  setCvaReadonlyState(isReadonly: boolean): void;
}

export const SOLARIS_RADIO_OPTION = new InjectionToken<SolarisRadioOption>(
  'SOLARIS_RADIO_OPTION',
);
