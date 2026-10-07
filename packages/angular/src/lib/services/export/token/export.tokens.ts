import { InjectionToken } from '@angular/core';

import type {
  SolarisExportConfig,
  SolarisExporter,
} from '../model/export.types';

export const SOLARIS_EXPORTERS = new InjectionToken<readonly SolarisExporter[]>(
  'SOLARIS_EXPORTERS',
);

export const SOLARIS_EXPORT_CONFIG = new InjectionToken<SolarisExportConfig>(
  'SOLARIS_EXPORT_CONFIG',
);
