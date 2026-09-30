import { InjectionToken } from '@angular/core';
import type { SolarisToastConfig } from '../model/toast.types';

export const SOLARIS_TOAST_CONFIG = new InjectionToken<SolarisToastConfig>(
  'SolarisToastConfig',
);

export const SOLARIS_TOAST_DEFAULT_CONFIG: SolarisToastConfig = {
  position: 'bottom-center',
  appearance: 'surface',
  size: 'md',
  duration: 5000,
  limit: 5,
  pauseOnHover: true,
  pauseOnFocus: true,
  newestOnTop: true,
  countdown: 'text',
};

export const SOLARIS_TOAST_CONTAINER = new InjectionToken<boolean>(
  'SolarisToastContainer',
);
