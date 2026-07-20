import { InjectionToken } from '@angular/core';

import type { SolarisDialogRef } from '../service/dialog-ref';

export const SOLARIS_DIALOG_DATA = new InjectionToken<unknown>(
  'SolarisDialogData',
);

export const SOLARIS_DIALOG_REF = new InjectionToken<SolarisDialogRef<unknown>>(
  'SolarisDialogRef',
);
