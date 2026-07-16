import type { Provider } from '@angular/core';

import {
  SOLARIS_DIALOG_CONFIG,
  SOLARIS_DIALOG_DEFAULT_CONFIG,
} from '../token/dialog.tokens';
import { SolarisDialogService } from '../service/dialog.service';
import type { SolarisDialogConfig } from '../model/dialog.types';

export function provideSolarisDialog(
  config?: Partial<SolarisDialogConfig>,
): Provider[] {
  const merged: SolarisDialogConfig = {
    ...SOLARIS_DIALOG_DEFAULT_CONFIG,
    ...config,
  };

  return [
    SolarisDialogService,
    { provide: SOLARIS_DIALOG_CONFIG, useValue: merged },
  ];
}
