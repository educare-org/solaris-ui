import type { Provider } from '@angular/core';

import type {
  SolarisExportConfig,
  SolarisExporter,
} from '../model/export.types';
import {
  SOLARIS_EXPORT_CONFIG,
  SOLARIS_EXPORTERS,
} from '../token/export.tokens';

export function provideSolarisExport(
  exporters: readonly SolarisExporter[] = [],
  config?: SolarisExportConfig,
): Provider[] {
  return [
    {
      provide: SOLARIS_EXPORTERS,
      useValue: exporters,
    },
    {
      provide: SOLARIS_EXPORT_CONFIG,
      useValue: config ?? {},
    },
  ];
}
