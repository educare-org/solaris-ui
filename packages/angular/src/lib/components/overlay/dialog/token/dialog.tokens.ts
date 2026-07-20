import { InjectionToken } from '@angular/core';

import type { SolarisDialogConfig } from '../model/dialog.types';

export const SOLARIS_DIALOG_CONFIG = new InjectionToken<SolarisDialogConfig>(
  'SolarisDialogConfig',
);

export const SOLARIS_DIALOG_DEFAULT_CONFIG: SolarisDialogConfig = {
  appearance: 'surface',
  size: 'md',
  closeable: true,
  closeOnEscape: true,
  closeOnBackdropClick: true,
  autoFocus: 'first-tabbable',
  restoreFocus: true,
  role: 'dialog',
  actionsAlign: 'end',
  actionsStack: 'auto',
};
