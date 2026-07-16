import type { Provider } from '@angular/core';

import type {
  SolarisToastConfig,
  SolarisToastSetup,
} from '../model/toast.types';
import {
  SOLARIS_TOAST_CONFIG,
  SOLARIS_TOAST_DEFAULT_CONFIG,
  SOLARIS_TOAST_CONTAINER,
} from '../token/toast.tokens';
import { SolarisToastService } from '../service/toast.service';

export function provideSolarisToast(
  config?: Partial<SolarisToastConfig>,
  setup?: SolarisToastSetup,
): Provider[] {
  const merged: SolarisToastConfig = {
    ...SOLARIS_TOAST_DEFAULT_CONFIG,
    ...config,
  };

  return [
    SolarisToastService,
    { provide: SOLARIS_TOAST_CONFIG, useValue: merged },
    {
      provide: SOLARIS_TOAST_CONTAINER,
      useValue: setup?.autoContainer ?? true,
    },
  ];
}
