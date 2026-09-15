import { InjectionToken } from '@angular/core';

import type { SolarisDialogConfig } from '../components/root/model/dialog.types';

export const SOLARIS_DIALOG_CONFIG = new InjectionToken<SolarisDialogConfig>(
  'SolarisDialogConfig',
);

export const SOLARIS_DIALOG_DEFAULT_CONFIG: SolarisDialogConfig = {
  appearance: 'outline',
  fullscreen: false,
  placement: 'center',
  closeable: true,
  backdrop: true,
  closeOnEscape: true,
  closeOnBackdropClick: true,
  autoFocus: 'first-tabbable',
  restoreFocus: true,
  role: 'dialog',
  headerSeparator: true,
  footerSeparator: true,
  actionsAlign: 'end',
  actionsStack: 'auto',
};
